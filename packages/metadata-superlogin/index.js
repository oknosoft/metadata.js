/*!
 metadata-superlogin v2.0.16-beta.46, built:2018-01-09
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
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
    }
    log_in(username, password) {
      const {props, local, remote, $p} = this;
      const {job_prm, wsql, aes, md, superlogin: superlogin$$1} = $p;
      const start = superlogin$$1.getSession() ? Promise.resolve(superlogin$$1.getSession()) : superlogin$$1.login({username, password})
        .catch((err) => {
          this.emit('user_log_fault', err);
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
      const {$p, props} = this;
      return $p.superlogin.getDbUrl(props.prefix + (name == 'meta' ? name : (props.zone + '_' + name)));
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
  });
  superlogin.on('logout', function (event, message) {
  });
  superlogin.on('refresh', function (event, newSession) {
  });
  superlogin.on('link', function (event, provider) {
  });
  function handleSocialAuth(provider) {
    return function (dispatch, getState) {
      dispatch({
        type: metaActions.types.USER_TRY_LOG_IN,
        payload: {name: 'oauth', provider: provider}
      });
      return superlogin.socialAuth(provider)
        .then((session) => $p.adapters.pouch.log_in(session.token, session.password));
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
      superlogin.register(registration)
        .then(function () {
          if(superlogin.authenticated()) {
            const session = superlogin.getSession();
            dispatch({
              type: metaActions.types.USER_LOG_IN,
              payload: {name: session.name, password: session.password, provider: 'local'}
            });
          }
          else {
          }
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
    for (var key in attr) {
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
