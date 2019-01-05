/**
 * Содержит методы и подписки на события superlogin-client
 * https://github.com/micky2be/superlogin-client
 *
 */

import superlogin from './client';

import adapter from './adapter';
import default_config from './default.config';

const {metaActions} = require('metadata-redux');

function needAuth() {
  return Promise.reject({error: 'Требуется авторизация'});
}

function postWithAuth(url, body) {
  return superlogin.authenticated() ?
    superlogin._http.post(url, body)
      .then(res => res.data && superlogin.refresh_profile(res.data))
    :
    needAuth();
}

function attach($p) {

  const {cat, utils, wsql, adapters: {pouch}} = $p;

  // Session is an object that contains all the session information returned by SuperLogin, along with serverTimeDiff, the difference between the server clock and the local clock.
  superlogin.on('login', function (event, session) {
    session = null;
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

  superlogin.create_user = function () {
    const session = this.getSession();
    if(session) {
      const attr = {
        id: session.user_id,
        ref: session.profile && session.profile.ref ? session.profile.ref : utils.generate_guid(),
        name: session.profile && session.profile.name ? session.profile.name : session.user_id,
      }
      return cat.users.create(attr, false, true);
    }
  };

  superlogin.change_name = function (newName) {
    if(this.authenticated()) {
      const session = this.getSession();
      return session.profile.name == newName ?
        Promise.resolve() :
        this._http.post(`/user/change-name`, {newName})
          .then(res => {
            session.profile.name = newName;
            this.setSession(session);
            return res.data;
          });
    }
    return needAuth();
  };

  // инвертирует бит подписки в профиле пользователя
  superlogin.change_subscription = function (subscription) {
    if(this.authenticated()) {
      const session = this.getSession();
      return session.profile.subscription == subscription ?
        Promise.resolve() :
        this._http.post(`/user/change-subscription`, {subscription})
          .then(res => {
            session.profile.subscription = subscription;
            this.setSession(session);
            return res.data;
          });
    }
    return needAuth();
  }

  superlogin.refresh_profile = function(profile) {
    const session = superlogin.getSession();
    if(session) {
      Object.assign(session, {profile});
      return superlogin.setSession(session);
    }
  }

  // создаёт общую базу и добавляет её в профиль подписчика
  superlogin.create_db = function (name) {
    return postWithAuth('/user/create-db', {name});
  }

  // добавляет пользователя в список администрирования
  superlogin.add_user = function (name) {
    return postWithAuth('/user/add-user', {name});
  }

  // удаляет пользователя из списка администрирования
  superlogin.rm_user = function (name) {
    return postWithAuth('/user/rm-user', {name});
  }

  // получает список пользователей общих баз текущего пользователя
  superlogin.shared_users = function () {
    return superlogin._http.post('/user/shared-users', {});
  }

  // добавляет общую базу пользователю
  superlogin.share_db = function (name, db) {
    return postWithAuth('/user/share-db', {name, db});
  }

  // отнимает общую базу у пользователя
  superlogin.unshare_db = function (name, db) {
    return postWithAuth('/user/unshare-db', {name, db});
  }


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

            return pouch.log_in(session.token, session.password);
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

      // Если мы уже авторизованы - делаем link вместо создания нового пользователя
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

      // Если еще не авторизованы - создаём пользователя по данным соцсети
      return superlogin.socialAuth(provider)
        .then((session) => {
          return pouch.log_in(session.token, session.password);
        })
        .catch((err) => {
          return pouch.log_out()
            .then(() => {
              if(typeof err === 'string' && err.indexOf('newAccount') !== -1) {
                const text = `Пользователь '${err.substr(11)}' провайдера '${provider}' не связан с пользователем сервиса.
                Для авторизации oAuth, зарегистрируйтесь через логин/пароль и свяжите учётную запись сервиса с провайдером социальной сети`;
                dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text}));
              }
            });
        });
    };
  }

  // запускает авторизацию - обычную или SuperLogin
  function handleLogin(login, password) {
    return metaActions.USER_TRY_LOG_IN(pouch, login, password);
  }

  // завершает сессию
  function handleLogOut() {

    return function (dispatch, getState) {

      pouch.log_out()
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

      if(!password || password.length < 6) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'Длина пароля должна быть не менее 6 символов'}));
      }
      else if(password !== confirmPassword) {
        return dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: 'Не совпадают пароль и подтверждение пароля'}));
      }

      // проверим login, email и password
      return superlogin.validateUsername(username)
        .catch((err) => {
          dispatch(metaActions.USER_LOG_ERROR(
            err.message && err.message.match(/(time|network)/i) ? err : {message: 'custom', text: err.error ? err.error : 'Ошибка при проверке имени пользователя'}
          ));
        })
        .then((ok) => ok && superlogin.validateEmail(email))
        .catch((err) => {
          dispatch(metaActions.USER_LOG_ERROR(
            err.message && err.message.match(/(time|network)/i) ? err : {message: 'custom', text: err.error ? err.error : 'Email error'}
          ));
        })
        // попытка регистрации
        .then((ok) => ok && superlogin.register(registration))
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
              dispatch(metaActions.USER_LOG_ERROR({message: 'custom', text: reg.error ? reg.error : 'Registration error'}));
            }
          }
        })
        .then((session) => {
          return session && pouch.log_in(session.username, session.password);
        })
        .catch((err) => {
          const {validationErrors} = err;
          if(validationErrors) {
            err.error = validationErrors[Object.keys(validationErrors)[0]];
          }
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
      wsql.set_user_param(key, attr[key]);
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

    pouch.on('superlogin_log_in', () => {

      const user_name = superlogin.getSession().user_id;

      if(cat.users) {

        cat.users.find_rows_remote({
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
            let user = cat.users.create({
              ref: utils.generate_guid(),
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

