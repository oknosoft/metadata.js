/**
 * Содержит методы и подписки на события superlogin-client
 * https://github.com/micky2be/superlogin-client
 *
 */

import superlogin from 'superlogin-client';

import adapter from './adapter';
import default_config from './default.config';

const {metaActions} = require('metadata-redux');

// переопределяем getDbUrl
// const default_getDbUrl = superlogin.getDbUrl.bind(superlogin);
// superlogin.getDbUrl = function (name) {
//   return default_getDbUrl(name).replace('http://', 'https://').replace('fl211:5984', 'flowcon.oknosoft.ru/couchdb');
// };

function attach($p) {

  // Session is an object that contains all the session information returned by SuperLogin, along with serverTimeDiff, the difference between the server clock and the local clock.
  superlogin.on('login', function (event, session) {

  });

  // Message is a message that explains why the user was logged out: 'Logged out' or 'Session expired'.
  superlogin.on('logout', function (event, message) {

  });

  // Broadcast when the token is refreshed.
  superlogin.on('refresh', function (event, newSession) {

  });

  //
  superlogin.on('link', function (event, provider) {

  });


  /**
   * Подмена обработчиков событий PouchDB
   */

  /**
   * ### После загрузки локальных данных
   * если разрешено сохранение пароля или демо-режим, выполняем попытку авторизации
   * @param page
   * @return {{type: string, payload: *}}
   */
  function pouch_data_loaded(page) {

    return function (dispatch, getState) {

      // First dispatch: the app state is updated to inform
      // that the API call is starting.

      dispatch({
        type: metaActions.types.POUCH_DATA_LOADED,
        payload: page
      });


      const {meta} = getState();

      // если вход еще не выполнен...
      if(!meta.user.logged_in && superlogin.authenticated()) {

        setTimeout(function () {

          const session = superlogin.getSession();

          // устанавливаем текущего пользователя и пытаемся авторизоваться
          if(session) {

            dispatch(metaActions.USER_DEFINED(session.user_id));

            dispatch({
              type: metaActions.types.USER_TRY_LOG_IN,
              payload: {name: session.token, password: session.password, provider: session.provider}
            });

            return $p.adapters.pouch.log_in(session.token, session.password);
          }


        }, 10);
      }
    };

  }


  /**
   * Actions
   */

  // генерирует функцию авторизации через соцсети
  function handleSocialAuth(provider) {

    return function (dispatch, getState) {

      // First dispatch: the app state is updated to inform
      // that the API call is starting.
      dispatch({
        type: metaActions.types.USER_TRY_LOG_IN,
        payload: {name: 'oauth', provider: provider}
      });

      // Если мы уже авторизованы - делаем link вместо создания нового пользователя
      if(superlogin.authenticated()) {
        return superlogin.link(provider)
          .then((res) => {

          })
          .catch((err) => {

          });
      }

      // Если еще не авторизованы - создаём пользователя по данным соцсети
      return superlogin.socialAuth(provider)
        .then((session) => $p.adapters.pouch.log_in(session.token, session.password))
        .catch((err) => $p.adapters.pouch.log_out());
    };
  }

  // запускает авторизацию - обычную или SuperLogin
  function handleLogin(login, password) {
    return metaActions.USER_TRY_LOG_IN($p.adapters.pouch, login, password);
  }

  // завершает сессию
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

  // регистрация нового пользователя
  function handleRegister(registration) {

    return function (dispatch) {

      const {username, email, password, confirmPassword} = registration;

      if(!password || password.length < 6 || password !== confirmPassword) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'Password must be at least 6 characters length'}));
      }
      if(!username || username.length < 3) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'empty'}));
      }

      // проверим login, email и password
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
        // попытка регистрации
        .then((ok) => {
          return ok && superlogin.register(registration)
        })
        .then((reg) => {
          if(reg) {
            if(reg.success) {
              if(superlogin.getConfig().email.requireEmailConfirm) {
                dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'info: Создана учетная запись. Проверьте почтовый ящик для активации.'}));
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

  function handleLink(provider) {

    return function (dispatch, getState) {

      superlogin.link(provider)
        .then(function () {
          // toasty(provider.toUpperCase() + ' link successful!');
          // refresh();
        });
    };
  }

  // генерирует письмо восстановления пароля
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

  // экспортируем superlogin в MetaEngine
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

  // меняем подписки на события pouchdb
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


export default function plugin(config = default_config) {

  return {

    proto(constructor) {
      // дополняем и модифицируем конструкторы
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
};

