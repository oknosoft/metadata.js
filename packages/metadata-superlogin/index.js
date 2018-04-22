/*!
 metadata-superlogin v2.0.16-beta.57, built:2018-04-22
 © 2014-2018 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var superlogin = _interopDefault(require('superlogin-client'));

var adapter = (constructor) => {
  const {classes} = constructor;
  classes.AdapterPouch = class AdapterPouchSuperlogin extends classes.AdapterPouch {
    after_init() {
      const {props, local, remote} = this;
      const opts = {skip_setup: true, adapter: 'http'};
      props.autologin.forEach((name) => {
        if(!remote[name]) {
          remote[name] = new PouchDB(super.dbpath(name), opts);
          if(name === 'ram') {
            this.run_sync(name)
              .then(() => {
                if(local._loading) {
                  return new Promise((resolve, reject) => {
                    this.once('pouch_data_loaded', resolve);
                  });
                }
                else if(!props.user_node) {
                  return this.call_data_loaded();
                }
              });
          }
        }
      });
    }
    log_in(username, password) {
      const {props, local, remote, $p} = this;
      const {job_prm, wsql, aes, md, superlogin: superlogin$$1} = $p;
      const start = superlogin$$1.getSession() ? Promise.resolve(superlogin$$1.getSession()) : superlogin$$1.login({username, password})
        .catch((err) => {
          this.emit('user_log_fault', {message: 'custom', text: err.message});
          return Promise.reject(err);
        });
      return start.then((session) => {
        if(!session) {
          const err = new Error('empty login or password');
          this.emit('user_log_fault', err);
          return Promise.reject(err);
        }
        if(this.props._auth) {
          if(this.props._auth.username == username) {
            return Promise.resolve();
          }
          else {
            const err = new Error('need logout first');
            this.emit('user_log_fault', err);
            return Promise.reject(err);
          }
        }
        super.after_init();
        for(const name of props.autologin) {
          if(name === 'doc' || name === 'ram') {
            continue;
          }
          let url = this.dbpath('doc');
          if(url && remote[name]) {
            const {path, prefix, zone} = props;
            const pos = url.indexOf(prefix + (name == 'meta' ? name : (zone + '_doc')));
            remote[name] = new PouchDB(url.substr(0, pos) + prefix + (name == 'meta' ? name : (zone + '_' + name)),
              {skip_setup: true, adapter: 'http'});
          }
        }
        if(wsql.get_user_param('user_name') != session.user_id) {
          wsql.set_user_param('user_name', session.user_id);
        }
        this.emit_async('user_log_in', session.user_id);
        return this.after_log_in()
          .catch(err => {
            this.emit('user_log_fault', err);
          });
      });
    }
    dbpath(name) {
      const {$p, props: {path, prefix, zone}} = this;
      let url = $p.superlogin.getDbUrl(prefix + (name == 'meta' ? name : (zone + '_' + name)));
      const localhost = 'localhost:5984/' + prefix;
      if(url.indexOf(localhost) !== -1) {
        const https = path.indexOf('https://') !== -1;
        if(https){
          url = url.replace('http://', 'https://');
        }
        url = url.replace(localhost, path.substr(https ? 8 : 7));
      }
      return url;
    }
    get authorized() {
      return !!this.$p.superlogin.getSession();
    }
  };
}

var default_config = {
  baseUrl: 'http://localhost:3000/auth/',
  endpoints: ['api.example.com'],
  noDefaultEndpoint: false,
  storage: 'local',
  providers: ['google', 'yandex', 'github', 'facebook'],
  checkExpired: false,
  refreshThreshold: 0.5
}

const {metaActions} = require('metadata-redux');
function attach($p) {
  superlogin.on('login', function (event, session) {
    session = null;
  });
  superlogin.on('logout', function (event, message) {
  });
  superlogin.on('refresh', function (event, newSession) {
  });
  superlogin.on('link', function (event, provider) {
  });
  superlogin.create_user = function () {
    const session = superlogin.getSession();
    if(session) {
      const attr = {
        id: session.user_id,
        ref: session.profile && session.profile.ref ? session.profile.ref : $p.utils.generate_guid(),
        name: session.profile && session.profile.name ? session.profile.name : session.user_id,
      };
      return $p.cat.users.create(attr, false, true);
    }
  };
  function handleSocialAuth(provider) {
    return function (dispatch, getState) {
      if(superlogin.authenticated()) {
        return superlogin.link(provider)
          .then((res) => {
            res = null;
          })
          .catch((err) => {
            err = null;
          });
      }
      dispatch({
        type: metaActions.types.USER_TRY_LOG_IN,
        payload: {name: 'oauth', provider: provider}
      });
      return superlogin.socialAuth(provider)
        .then((session) => $p.adapters.pouch.log_in(session.token, session.password))
        .catch((err) => $p.adapters.pouch.log_out());
    };
  }
  function handleLogin(login, password) {
    return metaActions.USER_TRY_LOG_IN($p.adapters.pouch, login, password);
  }
  function handleLogOut() {
    return function (dispatch, getState) {
      $p.adapters.pouch.log_out()
        .then(() => superlogin.logout())
        .then(() => dispatch({
          type: metaActions.types.USER_LOG_OUT,
          payload: {name: getState().meta.user.name}
        }));
    };
  }
  function handleRegister(registration) {
    return function (dispatch) {
      const {username, email, password, confirmPassword} = registration;
      if(!password || password.length < 6 || password !== confirmPassword) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'Password must be at least 6 characters length'}));
      }
      if(!username || username.length < 3) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'empty'}));
      }
      return superlogin.validateUsername(username)
        .catch((err) => {
          dispatch(metaActions.USER_LOG_ERROR(
            err.message && err.message.match(/(time|network)/i) ? err : {message: 'custom', text: err.error ? err.error : 'Username error'}
          ));
        })
        .then((ok) => {
          return ok && superlogin.validateEmail(email)
        })
        .catch((err) => {
          dispatch(metaActions.USER_LOG_ERROR(
            err.message && err.message.match(/(time|network)/i) ? err : {message: 'custom', text: err.error ? err.error : 'Email error'}
          ));
        })
        .then((ok) => {
          return ok && superlogin.register(registration)
        })
        .then((reg) => {
          if(reg) {
            if(reg.success) {
              if(superlogin.getConfig().email.requireEmailConfirm) {
                dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'info:Создана учетная запись. Проверьте почтовый ящик для активации'}));
              }
              else {
                return superlogin.authenticated() ? superlogin.getSession() :
                  superlogin.login({username, password}).then((session) => {
                    return superlogin.getSession();
                  });
              }
            }
            else {
              dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'Registration error'}));
            }
          }
        })
        .then((session) => {
          return session && $p.adapters.pouch.log_in(session.username, session.password);
        })
        .catch((err) => {
          dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: err.error ? err.error : 'Registration error'}));
        });
    };
  }
  function handleForgotPassword() {
    return superlogin.forgotPassword(email)
      .then(function () {
        toasty('Check your email!');
      }, function (err) {
        if(err) {
          console.error(err);
        }
      });
  }
  function handleCheckUsername(name) {
  }
  function handlecheckEmail(email) {
  }
  function handleSetPrm(attr) {
    for (const key in attr) {
      $p.wsql.set_user_param(key, attr[key]);
    }
    return metaActions.PRM_CHANGE(attr);
  }
  Object.defineProperty($p, 'superlogin', {
    get: function () {
      return superlogin;
    }
  });
  superlogin._actions = {
    handleSocialAuth,
    handleLogin,
    handleLogOut,
    handleRegister,
    handleForgotPassword,
    handleCheckUsername,
    handlecheckEmail,
    handleSetPrm,
  };
  superlogin._init = function (store) {
    $p.adapters.pouch.on('superlogin_log_in', () => {
      const user_name = superlogin.getSession().user_id;
      if($p.cat && $p.cat.users) {
        $p.cat.users.find_rows_remote({
          _view: 'doc/number_doc',
          _key: {
            startkey: ['cat.users', 0, user_name],
            endkey: ['cat.users', 0, user_name]
          }
        }).then(function (res) {
          if(res.length) {
            return res[0];
          }
          else {
            let user = $p.cat.users.create({
              ref: $p.utils.generate_guid(),
              id: user_name
            });
            return user.save();
          }
        })
          .then(function () {
            store.dispatch(metaActions.USER_LOG_IN(user_name));
          });
      }
      else {
        store.dispatch(metaActions.USER_LOG_IN(user_name));
      }
    });
  };
}
function plugin(config = default_config) {
  return {
    proto(constructor) {
      adapter(constructor);
    },
    constructor() {
      const baseUrl = this.wsql.get_user_param('superlogin_path', 'string');
      if(baseUrl){
        config.baseUrl = baseUrl;
      }
      superlogin.configure(config);
      attach(this);
    }
  };
}

module.exports = plugin;
//# sourceMappingURL=index.js.map
