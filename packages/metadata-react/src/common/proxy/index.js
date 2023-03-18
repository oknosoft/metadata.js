/**
 * ### Плагин proxy и oauth-авторизации
 *
 * @module auth_proxy
 *
 * Created by Evgeniy Malyarov on 14.06.2019.
 */

import urlJoin from 'url-join';
import urlParse from 'url-parse';
import {toPromise} from 'pouchdb-utils';
import oAuthPopup from './popup';
import {load_common, load_ram} from './no_ram';
import {event_src} from './events';

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = 'authentication_error';
    this.error = true;
    try {
      Error.captureStackTrace(this, AuthError);
    } catch (e) {}
  }
}

function getBaseUrl({__opts, name}) {
  // Parse database url
  const prefix = __opts && __opts.prefix ? __opts.prefix + '/' : '';
  const url = urlParse(prefix + name);
  return url.origin;
}

function getSessionUrl(db) {
  const {_auth_provider} = db.__opts.owner.props;
  return urlJoin(getBaseUrl(db), `/auth/${_auth_provider || ''}`);
}

function getBasicAuthHeaders({prefix = 'Basic ', username, password}) {
  const str = username + ':' + password;
  const token = btoa(unescape(encodeURIComponent(str)));
  return {Authorization: prefix + token};
}

export default function index (withMeta) {

  const logIn = toPromise(function (username = '', password, opts, callback) {
    if (typeof callback === 'undefined') {
      callback = opts;
      opts = {};
    }
    if (['http', 'https'].indexOf(this.type()) === -1) {
      return callback(new AuthError('this plugin only works for the http/https adapter'));
    }

    const {owner} = this.__opts;
    const prefix = owner.auth_prefix();
    if(['ldap','basic'].includes(prefix.toLowerCase().trim())){
      if (!username) {
        return callback(new AuthError('you must provide a username'));
      } else if (!password) {
        return callback(new AuthError('you must provide a password'));
      }

      const names = username.trim().split(' as ');
      username = names[0].trim();
      const impersonation = names[1] && names[1].trim();
      if(impersonation) {
        sessionStorage.setItem('impersonation', encodeURIComponent(impersonation));
      }

      const ajaxOpts = Object.assign({
        method: 'POST',
        headers: new Headers(Object.assign({'Content-Type': 'application/json'}, getBasicAuthHeaders({prefix, username, password}))),
        body: JSON.stringify({name: username, password}),
      }, opts.ajax || {});

      owner.fetch(getSessionUrl(this), ajaxOpts)
        .then((res) => {
          let zones = res.headers.get('zones');
          if(zones) {
            zones = zones.split(',').map((v) => parseInt(v, 10));
          }
          return res.json()
            .then(json => Object.assign(json, {zones}));
        })
        .then((res) => {
          if(res.error) {
            throw new AuthError(res.message || `${res.error} ${res.reason}`);
          }
          delete ajaxOpts.method;
          delete ajaxOpts.body;
          return withMeta ?
            owner.fetch(this.name.replace(/_.*$/, '_meta'), ajaxOpts)
              .then((res) => res.json())
              .then((info) => {
                if(info.error) {
                  throw new AuthError(`${typeof info.error === 'boolean' ? '' : info.error}: ${res.id}: ${info.reason || info.message}`);
                }
                return res;
              })
            :
            res;
        })
        .then((res) => {
          if(impersonation) {
            res.su = username;
          }
          callback(null, res);
        })
        .catch(callback);
    }
    else {
      oAuthPopup(getSessionUrl(this))
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
    }

  });

  const logOut = toPromise(function (opts, callback) {
    if (typeof callback === 'undefined') {
      callback = opts;
      opts = {};
    }
    const {owner} = this.__opts;
    const ajaxOpts = Object.assign({method: 'DELETE'}, opts.ajax || {});
    owner.fetch(getSessionUrl(this), ajaxOpts)
      .then((res) => res.json())
      .then((res) => callback(null, res))
      .catch(callback);
  });

  return {
    login: logIn,
    logIn: logIn,
    logout: logOut,
    logOut: logOut,
    getBasicAuthHeaders,
  };
};

export {load_common, load_ram, event_src};
