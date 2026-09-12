

import {OwnerObj} from '../meta/metaObjs';
import {own} from '../meta/symbols';
import {CouchdbAdapter} from './couchdb';

const auth = {

  provider: '',
  username: '',
  password: '',
  user: null,

  headers(opts) {
    const {provider, username, password} = this;
    if(!opts.headers) {
      opts.headers = new Headers({Accept: 'application/json'});
    }
    if(provider === 'couchdb') {
      if(!opts.headers.has('Authorization') && username && password) {
        opts.headers.set('Authorization', `Basic ${btoa(decodeURIComponent(encodeURIComponent(username + ':' + password)))}`);
      }
    }

    if(typeof sessionStorage === 'object' && sessionStorage.key('zone')) {
      const zone = sessionStorage.getItem('zone');
      if(zone) {
        //url = url.replace(/_\d\d_/, `_${zone}_`);
        const branch = sessionStorage.getItem('branch');
        const impersonation = sessionStorage.getItem('impersonation');
        opts.headers.set('zone', zone);
        opts.headers.set('year', sessionStorage.getItem('year') || new Date().getFullYear());
        branch && opts.headers.set('branch', branch);
        impersonation && opts.headers.set('impersonation', impersonation);
      }
    }

    if(!opts.headers.has('Content-Type')) {
      opts.headers.set('Content-Type', 'application/json');
    }

    return opts.headers;
  },

  get authorized() {
    return this.user;
  },

  isSync(provider) {
    return ['couchdb', 'ldap'].includes(provider);
  }

}

export class DataAdapters extends OwnerObj {

  fetch(url, opts = {}) {
    auth.headers(opts)
    return fetch(url, opts);
  }

  emit() {

  }

  get user() {
    return auth.user;
  }

  logIn({provider = 'couchdb', username, password}) {
    return new Promise((resolve, reject) => {
      if(auth.authorized) {
        reject(new Error('need logout first'));
      }
      if(auth.isSync(provider) && (!username || !password)) {
        reject(new Error('empty login or password'));
      }
      Object.assign(auth, {provider, username, password});
      const timer = setTimeout(() => {
        reject(new Error('login timeout'));
      }, 10000);
      this.fetch(`/auth/${provider}`)
        .then((res) => res.json())
        .then((res) => {
          clearTimeout(timer);
          const {cat, jobPrm} = this[own];
          auth.user = cat.users.create(res, false, true);
          jobPrm.set('userName', auth.user.id || auth.user.name);
          Object.defineProperties(this, {
            doc: {
              value: new CouchdbAdapter(this, 'doc'),
            },
          });
          resolve(auth.user);
        })
        .catch((err) => {
          Object.assign(auth, {provider: '', username: '', password: '', user: null});
          reject(err);
        });
    });

  }

  logOut() {

  }

  /**
   * @summary Загружает данные, которые не зависят от отдела абонента
   * @desc и не требуют авторизации
   * @param {Object} attr
   * @return {Promise<never>|Promise<any>}
   */
  async loadСommon(attr) {

  }

  /**
   * Загружает данные после авторизации
   * @param {Object} attr
   * @return {Promise<never>|Promise<any>}
   */
  async loadRam(attr) {

  }
}

