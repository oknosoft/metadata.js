/**
 * Содержит методы и подписки на события superlogin-client
 * https://github.com/micky2be/superlogin-client
 *
 */

import metaActions from 'metadata-redux/src/actions_meta';

import superlogin from 'superlogin-client';

import default_config from './default.config'

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

  function handleSocialAuth(provider) {


    // Thunk middleware знает, как обращаться с функциями.
    // Он передает метод действия в качестве аргумента функции,
    // т.о, это позволяет отправить действие самостоятельно.

    return function (dispatch, getState) {

      // First dispatch: the app state is updated to inform
      // that the API call is starting.

      dispatch({
        type: metaActions.types.USER_TRY_LOG_IN,
        payload: {name: 'oauth', provider: provider}
      });

      // The function called by the thunk middleware can return a value,
      // that is passed on as the return value of the dispatch method.

      // In this case, we return a promise to wait for.
      // This is not required by thunk middleware, but it is convenient for us.

      return superlogin.socialAuth(provider)
        .then((session) => $p.adapters.pouch.log_in(session.token, session.password));

      // In a real world app, you also want to
      // catch any error in the network call.
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

    return function (dispatch, getState) {

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
            //toasty('Registration successful.');
          }
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
    for (var key in attr) {
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

  superlogin.configure(config);

  return {

    constructor() {

      attach(this);

    }
  };
};

