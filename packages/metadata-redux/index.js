module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defined = defined;
exports.log_in = log_in;
exports.try_log_in = try_log_in;
exports.log_out = log_out;
exports.log_error = log_error;
exports.reset_user = reset_user;
/**
 * ### Действия и типы действий авторизации в терминах redux
 *
 * @module actions_auth
 *
 * Created by Evgeniy Malyarov on 15.07.2017.
 */

var TRY_LOG_IN = exports.TRY_LOG_IN = 'USER_TRY_LOG_IN'; // Попытка авторизации
var LOG_IN = exports.LOG_IN = 'USER_LOG_IN'; // Подтверждает авторизацию
var DEFINED = exports.DEFINED = 'USER_DEFINED'; // Установить текущего пользователя (авторизация не обязательна)
var LOG_OUT = exports.LOG_OUT = 'USER_LOG_OUT'; // Попытка завершения синхронизации
var LOG_ERROR = exports.LOG_ERROR = 'USER_LOG_ERROR'; // Ошибка авторизации

var SOCIAL_TRY_LINK = exports.SOCIAL_TRY_LINK = 'USER_SOCIAL_TRY_LINK'; // Попытка привязать аккаунт социальной сети
var SOCIAL_LINKED = exports.SOCIAL_LINKED = 'USER_SOCIAL_LINKED'; // Пользователь привязан к аккаунту социальной сети
var SOCIAL_UNLINKED = exports.SOCIAL_UNLINKED = 'USER_SOCIAL_UNLINKED'; // Пользователь отвязан от аккаунта социальной сети

function defined(name) {

  return {
    type: DEFINED,
    payload: name
  };
}

/**
 * ### Пользователь авторизован
 * @param name
 * @return {{type: string, payload: *}}
 */
function log_in(name) {
  return {
    type: LOG_IN,
    payload: name
  };
}

function try_log_in(adapter, name, password) {

  // Thunk middleware знает, как обращаться с функциями.
  // Он передает метод действия в качестве аргумента функции,
  // т.о, это позволяет отправить действие самостоятельно.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch({
      type: TRY_LOG_IN,
      payload: { name: name, password: password, provider: 'local' }
    });

    return adapter.log_in(name, password).catch(function (err) {
      $p.record_log(err);
    });

    // In a real world app, you also want to
    // catch any error in the network call.
  };
}

/**
 * Инициирует отключение пользователя
 * @param adapter
 * @return {Function}
 */
function log_out(adapter) {

  return function (dispatch, getState) {

    function disp_log_out() {
      dispatch({
        type: LOG_OUT,
        payload: { name: getState().meta.user.name }
      });
    };

    // в зависимости от использования суперлогина, разные действия
    var _$p = $p,
        superlogin = _$p.superlogin;

    if (superlogin) {
      if (superlogin.authenticated()) {
        superlogin.logout().then(disp_log_out);
      } else {
        disp_log_out();
      }
    } else if (!adapter) {
      disp_log_out();
    } else {
      adapter.log_out();
    }
  };
}

function log_error(err) {
  var msg = $p.msg.login;
  var text = msg.error;
  if (!err.message || err.message.match(/(time|network)/i)) {
    text = msg.network;
  } else if (err.message.match('suffix')) {
    text = msg.suffix;
  } else if (err.message.match('empty')) {
    text = msg.empty;
  } else if (err.message.match('logout')) {
    text = msg.need_logout;
  } else if (err.message.match('custom') && err.text) {
    text = err.text;
  }
  return {
    type: LOG_ERROR,
    payload: text
  };
}

function reset_user(state) {
  var user = Object.assign({}, state.user);
  user.logged_in = false;
  user.has_login = false;
  user.try_log_in = false;
  user.log_error = '';
  return Object.assign({}, state, { user: user });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iface_state = iface_state;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ### Действия и типы действий адаптера pouchdb в терминах redux
 *
 * Created 05.09.2016
 */

var IFACE_STATE = exports.IFACE_STATE = 'IFACE_STATE'; // Устанавливает состояние интерфейса

/**
 *
 * @param state {Object}
 * @param state.component {String} - раздел состояния, для которого будет установлено свойство (как правило, имя класса компонента)
 * @param state.name {String} - имя поля в состоянии раздела
 * @param state.value {String} - значение
 * @return {{type: string, payload: *}}
 */
function iface_state(state) {
  return {
    type: IFACE_STATE,
    payload: state
  };
}

exports.default = _defineProperty({}, IFACE_STATE, iface_state);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.add = add;
exports.add_row = add_row;
exports.del_row = del_row;
exports.edit = edit;
exports.revert = revert;
exports.save = save;
exports.post = post;
exports.unpost = unpost;
exports.mark_deleted = mark_deleted;
exports.unmark_deleted = unmark_deleted;
exports.change = change;
exports.value_change = value_change;
/**
 * ### Действия и типы действий объектов данных в терминах redux
 *
 * Created 05.09.2016
 */

var ADD = exports.ADD = 'OBJ_ADD'; // Команда создать объект
var ADD_ROW = exports.ADD_ROW = 'OBJ_ADD_ROW'; // Команда добавить строку в табчасть объекта
var DEL_ROW = exports.DEL_ROW = 'OBJ_DEL_ROW'; // Команда удалить строку табчасти объекта
var EDIT = exports.EDIT = 'OBJ_EDIT'; // Команда открыть форму редактирования объекта
var REVERT = exports.REVERT = 'OBJ_REVERT'; // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
var SAVE = exports.SAVE = 'OBJ_SAVE'; // Команда записать изменённый объект (пометка удаления, проведение и отмена проведения - это так же, запись)
var CHANGE = exports.CHANGE = 'OBJ_CHANGE'; // Записан изменённый объект (по команде интерфейса или в результате репликации)
var VALUE_CHANGE = exports.VALUE_CHANGE = 'OBJ_VALUE_CHANGE'; // Изменён реквизит шапки или строки табчасти

function add(_mgr) {
  var _obj = _mgr.create();
  return {
    type: ADD,
    payload: { class_name: _mgr.class_name, ref: _obj.ref }
  };
}

function add_row(class_name, ref, tabular, proto) {
  return {
    type: ADD_ROW,
    payload: {
      class_name: class_name,
      ref: ref,
      tabular: tabular,
      proto: proto
    }
  };
}

/**
 * ### Удаляет строку, не оставляет следов в истории
 * @param class_name
 * @param ref
 * @param tabular
 * @param index
 * @return {function(): Promise.<T>}
 */
function del_row(class_name, ref, tabular, index) {
  // удаляем строку

  // возвращаем thunk
  return function () {
    return Promise.resolve();
  };
}

/**
 * ### Генерирует событие маршрутизации на форму объекта
 * @param class_name
 * @param ref
 * @param frm
 * @return {{type: string, payload: {class_name: *, ref: *, frm: *}}}
 */
function edit(class_name, ref, frm) {
  return {
    type: EDIT,
    payload: {
      class_name: class_name,
      ref: ref,
      frm: frm
    }
  };
}

function revert(class_name, ref) {
  return function (dispatch, getState) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        dispatch(dispatch({
          type: REVERT,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}

function save(class_name, ref, post, mark_deleted) {
  return function (dispatch, getState) {
    var _obj = void 0;
    if ((typeof class_name === 'undefined' ? 'undefined' : _typeof(class_name)) == 'object') {
      _obj = class_name;
      class_name = _obj._manager.class_name;
      ref = _obj.ref;

      if (mark_deleted) {
        _obj._obj._deleted = true;
      }

      _obj.save(post).then(function () {
        dispatch({
          type: SAVE,
          payload: {
            class_name: class_name,
            ref: ref,
            post: post,
            mark_deleted: mark_deleted
          }
        });
      });
    }
  };
}

function post(class_name, ref) {
  return save(class_name, ref, true);
}

function unpost(class_name, ref) {
  return save(class_name, ref, false);
}

function mark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, true);
}

function unmark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, false);
}

function change(class_name, ref) {
  return {
    type: CHANGE,
    payload: {
      class_name: class_name,
      ref: ref
    }
  };
}

function value_change(class_name, ref) {
  return function (dispatch, getState) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        dispatch(dispatch({
          type: VALUE_CHANGE,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.meta_loaded = meta_loaded;
exports.prm_change = prm_change;
exports.offline = offline;
// Action types - имена типов действий

var META_LOADED = exports.META_LOADED = 'META_LOADED'; // Инициализирует параметры и создаёт менеджеры объектов данных
var PRM_CHANGE = exports.PRM_CHANGE = 'PRM_CHANGE'; // Изменено значение настроек программы (couch_path, zone и т.д.)
var OFFLINE = exports.OFFLINE = 'OFFLINE'; // Изменено значение настроек программы (couch_path, zone и т.д.)

// Actions - функции - генераторы действий. Они передаются в диспетчер redux

function meta_loaded(_ref) {
  var version = _ref.version;

  return {
    type: META_LOADED,
    payload: version
  };
}

function prm_change(name, value) {
  return {
    type: PRM_CHANGE,
    payload: { name: name, value: value }
  };
}

function offline(state) {
  return {
    type: OFFLINE,
    payload: state
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapDispatchToProps;

var _actions_iface = __webpack_require__(2);

var _reactRouterRedux = __webpack_require__(9);

function mapDispatchToProps(dispatch) {
  return {
    handleIfaceState: function handleIfaceState(state) {
      return dispatch((0, _actions_iface.iface_state)(state));
    },
    handleNavigate: function handleNavigate(path) {
      return dispatch((0, _reactRouterRedux.push)(path));
    }
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYNC_DENIED = exports.SYNC_RESUMED = exports.SYNC_PAUSED = exports.SYNC_DATA = exports.SYNC_ERROR = exports.SYNC_START = exports.NO_DATA = exports.DATA_ERROR = exports.DATA_LOADED = exports.LOAD_START = exports.DATA_PAGE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * ### Действия и типы действий адаптера pouchdb в терминах redux
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Created 05.09.2016
                                                                                                                                                                                                                                                                               */

exports.data_loaded = data_loaded;
exports.sync_data = sync_data;
exports.data_page = data_page;
exports.load_start = load_start;
exports.sync_error = sync_error;
exports.sync_paused = sync_paused;
exports.sync_resumed = sync_resumed;
exports.sync_denied = sync_denied;
exports.data_error = data_error;
exports.no_data = no_data;

var _actions_auth = __webpack_require__(1);

var DATA_PAGE = exports.DATA_PAGE = 'POUCH_DATA_PAGE'; // Оповещение о загрузке порции локальных данных
var LOAD_START = exports.LOAD_START = 'POUCH_LOAD_START'; // Оповещение о начале загрузки локальных данных
var DATA_LOADED = exports.DATA_LOADED = 'POUCH_DATA_LOADED'; // Оповещение об окончании загрузки локальных данных
var DATA_ERROR = exports.DATA_ERROR = 'POUCH_DATA_ERROR'; // Оповещение об ошибке при загрузке локальных данных
var NO_DATA = exports.NO_DATA = 'POUCH_NO_DATA'; // Оповещение об отсутствии локальных данных (как правило, при первом запуске)

var SYNC_START = exports.SYNC_START = 'POUCH_SYNC_START'; // Оповещение о начале синхронизации базы doc
var SYNC_ERROR = exports.SYNC_ERROR = 'POUCH_SYNC_ERROR'; // Оповещение об ошибке репликации - не означает окончания репликации - просто информирует об ошибке
var SYNC_DATA = exports.SYNC_DATA = 'POUCH_SYNC_DATA'; // Прибежали изменения с сервера или мы отправили данные на сервер
var SYNC_PAUSED = exports.SYNC_PAUSED = 'POUCH_SYNC_PAUSED'; // Репликация приостановлена, обычно, из-за потери связи с сервером
var SYNC_RESUMED = exports.SYNC_RESUMED = 'POUCH_SYNC_RESUMED'; // Репликация возобновлена
var SYNC_DENIED = exports.SYNC_DENIED = 'POUCH_SYNC_DENIED'; // Разновидность ошибки репликации из-за недостатка прав для записи документа на сервере

var sync_data_indicator = void 0;

/**
 * ### После загрузки локальных данных
 * если разрешено сохранение пароля или демо-режим, выполняем попытку авторизации
 * @param page
 * @return {{type: string, payload: *}}
 */
function data_loaded(page) {

  return function (dispatch, getState) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch({
      type: DATA_LOADED,
      payload: page
    });

    if ((typeof page === 'undefined' ? 'undefined' : _typeof(page)) == 'object') {
      var _getState = getState(),
          meta = _getState.meta;

      // если вход еще не выполнен...


      if (!meta.user.logged_in && meta.user.has_login) {
        setTimeout(function () {
          var _$p = $p,
              job_prm = _$p.job_prm,
              wsql = _$p.wsql,
              adapters = _$p.adapters,
              superlogin = _$p.superlogin,
              aes = _$p.aes;

          // получаем имя сохраненного или гостевого пользователя

          var name = wsql.get_user_param('user_name');
          var password = wsql.get_user_param('user_pwd');

          if (!name && job_prm.zone_demo == wsql.get_user_param('zone') && job_prm.guests.length) {
            name = job_prm.guests[0].name;
          }

          // устанавливаем текущего пользователя
          if (name) {
            dispatch((0, _actions_auth.defined)(name));
          }

          // если разрешено сохранение пароля или superlogin или гостевая зона...
          if (name && password && wsql.get_user_param('enable_save_pwd')) {
            return dispatch((0, _actions_auth.try_log_in)(adapters.pouch, name, aes.Ctr.decrypt(password)));
          }
          if (superlogin && superlogin.authenticated()) {
            return dispatch((0, _actions_auth.try_log_in)(adapters.pouch));
          }
          if (name && job_prm.zone_demo == wsql.get_user_param('zone')) {
            dispatch((0, _actions_auth.try_log_in)(adapters.pouch, name, aes.Ctr.decrypt(job_prm.guests[0].password)));
          }
        });
      }
    }
  };
}

function sync_data(dbid, change) {

  // Thunk middleware знает, как обращаться с функциями.
  // Он передает метод действия в качестве аргумента функции,
  // т.о, это позволяет отправить действие самостоятельно.

  return function (dispatch, getState) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch({
      type: SYNC_DATA,
      payload: {
        dbid: dbid,
        change: change
      }
    });

    if (sync_data_indicator) {
      clearTimeout(sync_data_indicator);
    }

    sync_data_indicator = setTimeout(function () {

      sync_data_indicator = 0;

      dispatch({
        type: SYNC_DATA,
        payload: false
      });
    }, 1200);
  };
}

function data_page(page) {
  return {
    type: DATA_PAGE,
    payload: page
  };
}

function load_start(page) {
  return {
    type: LOAD_START,
    payload: page
  };
}

function sync_error(dbid, err) {
  return {
    type: SYNC_ERROR,
    payload: { dbid: dbid, err: err }
  };
}

function sync_paused(dbid, info) {
  return {
    type: info ? SYNC_PAUSED : SYNC_RESUMED,
    payload: { dbid: dbid, info: info }
  };
}

function sync_resumed(dbid, info) {
  return {
    type: SYNC_RESUMED,
    payload: { dbid: dbid, info: info }
  };
}

function sync_denied(dbid, info) {
  return {
    type: SYNC_DENIED,
    payload: { dbid: dbid, info: info }
  };
}

function data_error(dbid, err) {
  return {
    type: DATA_ERROR,
    payload: { dbid: dbid, err: err }
  };
}

function no_data(dbid, err) {
  return {
    type: NO_DATA,
    payload: { dbid: dbid, err: err }
  };
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStateToProps = mapStateToProps;
exports.mapDispatchToProps = mapDispatchToProps;

var _reactRedux = __webpack_require__(0);

var _actions_auth = __webpack_require__(1);

function mapStateToProps(_ref) {
  var meta = _ref.meta;

  return Object.assign({}, meta, {
    _obj: $p.current_user,
    _mgr: $p.cat.users,
    _acl: 'e'
  });
};

function mapDispatchToProps(dispatch) {
  var _$p = $p,
      adapters = _$p.adapters,
      wsql = _$p.wsql,
      job_prm = _$p.job_prm,
      aes = _$p.aes,
      cat = _$p.cat,
      superlogin = _$p.superlogin;


  return {
    handleLogin: function handleLogin(login, password) {
      if (!login && !password) {
        if (wsql.get_user_param('user_name') && wsql.get_user_param('user_pwd')) {
          login = wsql.get_user_param('user_name');
          password = aes.Ctr.decrypt(wsql.get_user_param('user_pwd'));
        } else if (wsql.get_user_param('zone') == job_prm.zone_demo) {
          login = job_prm.guests[0].username;
          password = aes.Ctr.decrypt(job_prm.guests[0].password);
        } else if (superlogin) {
          if (superlogin.authenticated()) {
            login = superlogin.getSession().user_id;
          } else {
            return dispatch((0, _actions_auth.log_out)(adapters.pouch));
          }
        } else {
          return dispatch((0, _actions_auth.log_out)(adapters.pouch));
        }
      }
      return dispatch((0, _actions_auth.try_log_in)(adapters.pouch, login, password));
    },
    handleLogOut: function handleLogOut() {
      return dispatch((0, _actions_auth.log_out)(adapters.pouch));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStateToProps = mapStateToProps;

var _reactRedux = __webpack_require__(0);

var _dispatchIface = __webpack_require__(5);

var _dispatchIface2 = _interopRequireDefault(_dispatchIface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: реализовать освобождение индивидуальной области компонента в iface
function disconnect(iface, area) {
  return function () {};
}

function mapStateToProps(Component, area) {
  if (!area) {
    area = Component.name;
  }
  return function (_ref) {
    var iface = _ref.iface;
    return Object.assign({ disconnect: disconnect(iface, area) }, iface.common, iface[area]);
  };
}

exports.default = function (Component) {
  return (0, _reactRedux.connect)(mapStateToProps(Component), _dispatchIface2.default)(Component);
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("react-router-redux");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchIface = exports.withPrm = exports.withObj = exports.withIfaceAndMeta = exports.withNavigateAndMeta = exports.withMeta = exports.withIface = exports.ifaceMiddleware = exports.ifaceReducer = exports.ifaceActions = exports.metaMiddleware = exports.metaReducer = exports.metaActions = undefined;

var _actions_meta = __webpack_require__(12);

var _actions_meta2 = _interopRequireDefault(_actions_meta);

var _reducer_meta = __webpack_require__(13);

var _reducer_meta2 = _interopRequireDefault(_reducer_meta);

var _events_meta = __webpack_require__(15);

var _events_meta2 = _interopRequireDefault(_events_meta);

var _actions_iface = __webpack_require__(2);

var _actions_iface2 = _interopRequireDefault(_actions_iface);

var _reducer_iface = __webpack_require__(16);

var _reducer_iface2 = _interopRequireDefault(_reducer_iface);

var _events_iface = __webpack_require__(18);

var _events_iface2 = _interopRequireDefault(_events_iface);

var _withIface = __webpack_require__(8);

var _withIface2 = _interopRequireDefault(_withIface);

var _withMeta = __webpack_require__(7);

var _withMeta2 = _interopRequireDefault(_withMeta);

var _withNavigateAndMeta = __webpack_require__(19);

var _withNavigateAndMeta2 = _interopRequireDefault(_withNavigateAndMeta);

var _withIfaceAndMeta = __webpack_require__(21);

var _withIfaceAndMeta2 = _interopRequireDefault(_withIfaceAndMeta);

var _withObj = __webpack_require__(22);

var _withObj2 = _interopRequireDefault(_withObj);

var _withPrm = __webpack_require__(23);

var _withPrm2 = _interopRequireDefault(_withPrm);

var _dispatchIface = __webpack_require__(5);

var _dispatchIface2 = _interopRequireDefault(_dispatchIface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.metaActions = _actions_meta2.default;
exports.metaReducer = _reducer_meta2.default;
exports.metaMiddleware = _events_meta2.default;
exports.ifaceActions = _actions_iface2.default;
exports.ifaceReducer = _reducer_iface2.default;
exports.ifaceMiddleware = _events_iface2.default;
exports.withIface = _withIface2.default;
exports.withMeta = _withMeta2.default;
exports.withNavigateAndMeta = _withNavigateAndMeta2.default;
exports.withIfaceAndMeta = _withIfaceAndMeta2.default;
exports.withObj = _withObj2.default;
exports.withPrm = _withPrm2.default;
exports.dispatchIface = _dispatchIface2.default;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types, _types$base$META_LOAD;

var _actions_auth = __webpack_require__(1);

var auth = _interopRequireWildcard(_actions_auth);

var _actions_obj = __webpack_require__(3);

var obj = _interopRequireWildcard(_actions_obj);

var _actions_pouch = __webpack_require__(6);

var pouch = _interopRequireWildcard(_actions_pouch);

var _actions_base = __webpack_require__(4);

var base = _interopRequireWildcard(_actions_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * ### Действия и типы действий в терминах redux
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
                                                                                                                                                                                                                   * @module actions.js
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * Created 05.09.2016
                                                                                                                                                                                                                   */

exports.default = (_types$base$META_LOAD = {

  types: (_types = {}, _defineProperty(_types, auth.TRY_LOG_IN, auth.TRY_LOG_IN), _defineProperty(_types, auth.LOG_IN, auth.LOG_IN), _defineProperty(_types, auth.DEFINED, auth.DEFINED), _defineProperty(_types, auth.LOG_OUT, auth.LOG_OUT), _defineProperty(_types, auth.LOG_ERROR, auth.LOG_ERROR), _defineProperty(_types, auth.SOCIAL_TRY_LINK, auth.SOCIAL_TRY_LINK), _defineProperty(_types, auth.SOCIAL_LINKED, auth.SOCIAL_LINKED), _defineProperty(_types, auth.SOCIAL_UNLINKED, auth.SOCIAL_UNLINKED), _defineProperty(_types, pouch.DATA_LOADED, pouch.DATA_LOADED), _defineProperty(_types, pouch.DATA_PAGE, pouch.DATA_PAGE), _defineProperty(_types, pouch.DATA_ERROR, pouch.DATA_ERROR), _defineProperty(_types, pouch.LOAD_START, pouch.LOAD_START), _defineProperty(_types, pouch.NO_DATA, pouch.NO_DATA), _defineProperty(_types, pouch.SYNC_DATA, pouch.SYNC_DATA), _defineProperty(_types, pouch.SYNC_ERROR, pouch.SYNC_ERROR), _defineProperty(_types, pouch.SYNC_PAUSED, pouch.SYNC_PAUSED), _defineProperty(_types, pouch.SYNC_RESUMED, pouch.SYNC_RESUMED), _types)

}, _defineProperty(_types$base$META_LOAD, base.META_LOADED, base.meta_loaded), _defineProperty(_types$base$META_LOAD, base.PRM_CHANGE, base.prm_change), _defineProperty(_types$base$META_LOAD, auth.TRY_LOG_IN, auth.try_log_in), _defineProperty(_types$base$META_LOAD, auth.LOG_IN, auth.log_in), _defineProperty(_types$base$META_LOAD, auth.DEFINED, auth.defined), _defineProperty(_types$base$META_LOAD, auth.LOG_OUT, auth.log_out), _defineProperty(_types$base$META_LOAD, auth.LOG_ERROR, auth.log_error), _defineProperty(_types$base$META_LOAD, pouch.DATA_LOADED, pouch.data_loaded), _defineProperty(_types$base$META_LOAD, pouch.DATA_PAGE, pouch.data_page), _defineProperty(_types$base$META_LOAD, pouch.DATA_ERROR, pouch.data_error), _defineProperty(_types$base$META_LOAD, pouch.LOAD_START, pouch.load_start), _defineProperty(_types$base$META_LOAD, pouch.NO_DATA, pouch.no_data), _defineProperty(_types$base$META_LOAD, pouch.SYNC_DATA, pouch.sync_data), _defineProperty(_types$base$META_LOAD, obj.ADD, obj.add), _defineProperty(_types$base$META_LOAD, obj.ADD_ROW, obj.add_row), _defineProperty(_types$base$META_LOAD, obj.DEL_ROW, obj.del_row), _defineProperty(_types$base$META_LOAD, obj.EDIT, obj.edit), _defineProperty(_types$base$META_LOAD, obj.REVERT, obj.revert), _defineProperty(_types$base$META_LOAD, obj.SAVE, obj.save), _defineProperty(_types$base$META_LOAD, obj.CHANGE, obj.change), _defineProperty(_types$base$META_LOAD, obj.VALUE_CHANGE, obj.value_change), _defineProperty(_types$base$META_LOAD, 'obj_post', obj.post), _defineProperty(_types$base$META_LOAD, 'obj_unpost', obj.unpost), _defineProperty(_types$base$META_LOAD, 'obj_mark_deleted', obj.mark_deleted), _defineProperty(_types$base$META_LOAD, 'obj_unmark_deleted', obj.unmark_deleted), _types$base$META_LOAD);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handlers_meta = __webpack_require__(14);

var _handlers_meta2 = _interopRequireDefault(_handlers_meta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * META
 */

function metaInitialState() {
  var _$p = $p,
      wsql = _$p.wsql,
      job_prm = _$p.job_prm,
      superlogin = _$p.superlogin;

  var user_name = wsql.get_user_param('user_name');
  var has_login = void 0;
  if (wsql.get_user_param('zone') == job_prm.zone_demo && !user_name && job_prm.guests.length) {
    wsql.set_user_param('enable_save_pwd', true);
    wsql.set_user_param('user_name', user_name = job_prm.guests[0].username);
    wsql.set_user_param('user_pwd', job_prm.guests[0].password);
    has_login = true;
  } else if (wsql.get_user_param('enable_save_pwd', 'boolean') && user_name && wsql.get_user_param('user_pwd')) {
    has_login = true;
  } else if (superlogin && user_name) {
    has_login = true;
  } else {
    has_login = false;
  }

  return {
    meta_loaded: false,
    data_loaded: false,
    doc_ram_loaded: false,
    complete_loaded: false,
    first_run: false,
    data_empty: undefined,
    sync_started: false,
    fetch: false,
    offline: typeof navigator != 'undefined' && !navigator.onLine,
    path_log_in: false,
    couch_direct: wsql.get_user_param('couch_direct', 'boolean'),
    user: {
      name: user_name,
      has_login: has_login,
      try_log_in: false,
      logged_in: false,
      log_error: ''
    }
  };
} /**
   * ### Reducer
   * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
   */

;

function metaReducer(state, action) {
  if (!state) {
    return metaInitialState();
  }
  var handler = _handlers_meta2.default[action.type];
  return handler ? handler(state, action) : state;
};

exports.default = metaReducer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _META_LOADED$PRM_CHAN;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Action Handlers - обработчики событий - вызываются из корневого редюсера
                                                                                                                                                                                                                                                                               * Задача обработчиков - измеять state
                                                                                                                                                                                                                                                                               * Активные действия и работа с данными происходит в actions
                                                                                                                                                                                                                                                                               */

var _actions_base = __webpack_require__(4);

var _actions_pouch = __webpack_require__(6);

var _actions_auth = __webpack_require__(1);

var _actions_obj = __webpack_require__(3);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = (_META_LOADED$PRM_CHAN = {}, _defineProperty(_META_LOADED$PRM_CHAN, _actions_base.META_LOADED, function (state, action) {
  return Object.assign({}, state, { meta_loaded: true });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_base.PRM_CHANGE, function (state, action) {
  var _action$payload = action.payload,
      name = _action$payload.name,
      value = _action$payload.value;
  var _$p = $p,
      wsql = _$p.wsql;

  if (Array.isArray(name)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = name[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref = _step.value;
        var prm = _ref.prm;
        var _value = _ref.value;

        wsql.set_user_param(prm, _value);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
    for (var _prm in name) {
      wsql.set_user_param(_prm, name[_prm]);
    }
  } else if (wsql.get_user_param(name) == value) {
    return state;
  }
  wsql.set_user_param(name, value);
  return Object.assign({}, state);
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_base.OFFLINE, function (state, action) {
  return Object.assign({}, state, { offline: action.payload });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.DATA_LOADED, function (state, action) {
  var payload = { data_loaded: true, fetch: false };
  if (action.payload == 'doc_ram') {
    payload.doc_ram_loaded = true;
  } else if (action.payload == 'complete') {
    payload.complete_loaded = true;
  }
  return Object.assign({}, state, payload);
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.DATA_PAGE, function (state, action) {
  return Object.assign({}, state, { page: action.payload });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.DATA_ERROR, function (state, action) {
  return Object.assign({}, state, { err: action.payload, fetch: false });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.LOAD_START, function (state, action) {
  return Object.assign({}, state, { data_empty: false, fetch: true });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.NO_DATA, function (state, action) {
  return Object.assign({}, state, { data_empty: true, first_run: true, fetch: false });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.SYNC_DATA, function (state, action) {
  return Object.assign({}, state, { fetch: !!action.payload });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.SYNC_PAUSED, function (state, action) {
  return Object.assign({}, state, { sync_started: false });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.SYNC_RESUMED, function (state, action) {
  return Object.assign({}, state, { sync_started: true });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_pouch.SYNC_ERROR, function (state, action) {
  var err = action.payload.err;

  if (err && err.error == 'forbidden') {
    return (0, _actions_auth.reset_user)(state);
  } else if (err && err.data_size) {
    return Object.assign({}, state, { sync_started: false, data_size: err.data_size });
  }
  return state;
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_auth.DEFINED, function (state, action) {
  var user = Object.assign({}, state.user);
  user.name = action.payload;
  return Object.assign({}, state, { user: user });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_auth.LOG_IN, function (state, action) {
  var user = Object.assign({}, state.user, { logged_in: action.payload ? true : false, try_log_in: false, log_error: '' });
  return Object.assign({}, state, { user: user });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_auth.TRY_LOG_IN, function (state, action) {
  var user = Object.assign({}, state.user, { try_log_in: true, log_error: '' });
  return Object.assign({}, state, { user: user });
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_auth.LOG_OUT, function (state, action) {
  return (0, _actions_auth.reset_user)(state);
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_auth.LOG_ERROR, function (state, action) {
  var reseted = (0, _actions_auth.reset_user)(state);
  reseted.user.log_error = action.payload;
  return reseted;
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_obj.ADD, function (state, action) {
  return state;
}), _defineProperty(_META_LOADED$PRM_CHAN, _actions_obj.CHANGE, function (state, action) {
  return Object.assign({}, state, { obj_change: action.payload });
}), _META_LOADED$PRM_CHAN);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = metaMiddleware;

var _actions_auth = __webpack_require__(1);

var _actions_pouch = __webpack_require__(6);

var _actions_obj = __webpack_require__(3);

var _actions_base = __webpack_require__(4);

var attached = void 0;

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function metaMiddleware(_ref) {
  var adapters = _ref.adapters,
      md = _ref.md;

  return function (_ref2) {
    var dispatch = _ref2.dispatch;

    return function (next) {
      return function (action) {
        if (!attached) {
          attached = true;

          // события pouchdb
          adapters.pouch.on({

            user_log_in: function user_log_in(name) {
              return dispatch((0, _actions_auth.log_in)(name));
            },

            user_log_out: function user_log_out() {
              return dispatch((0, _actions_auth.log_out)());
            },

            user_log_fault: function user_log_fault(err) {
              return dispatch((0, _actions_auth.log_error)(err));
            },

            user_log_stop: function user_log_stop() {
              return dispatch((0, _actions_auth.log_in)());
            },

            pouch_data_page: function pouch_data_page(page) {
              return dispatch((0, _actions_pouch.data_page)(page));
            },

            pouch_data_loaded: function pouch_data_loaded(page) {
              return dispatch((0, _actions_pouch.data_loaded)(page));
            },

            pouch_doc_ram_loaded: function pouch_doc_ram_loaded() {
              return dispatch((0, _actions_pouch.data_loaded)('doc_ram'));
            },

            pouch_complete_loaded: function pouch_complete_loaded() {
              return dispatch((0, _actions_pouch.data_loaded)('complete'));
            },

            pouch_data_error: function pouch_data_error(dbid, err) {
              return dispatch((0, _actions_pouch.data_error)(dbid, err));
            },

            pouch_load_start: function pouch_load_start(page) {
              return dispatch((0, _actions_pouch.load_start)(page));
            },

            pouch_no_data: function pouch_no_data(dbid, err) {
              return dispatch((0, _actions_pouch.no_data)(dbid, err));
            },

            pouch_sync_data: function pouch_sync_data(dbid, change) {
              return dispatch((0, _actions_pouch.sync_data)(dbid, change));
            },

            pouch_sync_error: function pouch_sync_error(dbid, err) {
              return dispatch((0, _actions_pouch.sync_error)(dbid, err));
            },

            pouch_sync_paused: function pouch_sync_paused(dbid, info) {
              return dispatch((0, _actions_pouch.sync_paused)(dbid, info));
            },

            pouch_sync_resumed: function pouch_sync_resumed(dbid, info) {
              return dispatch((0, _actions_pouch.sync_resumed)(dbid, info));
            },

            pouch_sync_denied: function pouch_sync_denied(dbid, info) {
              return dispatch((0, _actions_pouch.sync_denied)(dbid, info));
            }

          });

          // события metaengine
          md.on({
            obj_loaded: function obj_loaded(_obj) {
              dispatch((0, _actions_obj.change)(_obj._manager.class_name, _obj.ref));
            },

            setting_changed: function setting_changed() {}
          });

          // события window online-offline
          // TODO: дополнить периодическим опросом couchdb
          if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) != undefined && window.addEventListener) {
            window.addEventListener('online', function () {
              return dispatch((0, _actions_base.offline)(false));
            }, false);
            window.addEventListener('offline', function () {
              return dispatch((0, _actions_base.offline)(true));
            }, false);
          }

          // TODO: здесь можно подписаться на rotate и т.д.
        }
        return next(action);
      };
    };
  };
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handlers_iface = __webpack_require__(17);

var _handlers_iface2 = _interopRequireDefault(_handlers_iface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * IFACE
 */

var defaultState = {
  'common': {
    title: 'Заказ дилера'
  },
  CalcOrderList: {
    state_filter: ''
  },
  NavDrawer: {
    open: false
  },
  NavList: {
    orders: true
  },
  LogDrawer: {
    open: false
  }
}; /**
    * ### Reducer
    * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
    */

function getIfaceReducer(initialState) {

  return function ifaceReducer(state, action) {
    if (!state) {
      return typeof initialState == 'function' ? initialState() : initialState || defaultState;
    }
    var handler = _handlers_iface2.default[action.type];
    return handler ? handler(state, action) : state;
  };
}

// возаоащаем не сам редюсер, а обёртку для установки начального состояния
exports.default = getIfaceReducer;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions_iface = __webpack_require__(2);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Action Handlers - обработчики событий - вызываются из корневого редюсера
                                                                                                                                                                                                                   * Задача обработчиков - измеять state
                                                                                                                                                                                                                   * Активные действия и работа с данными происходит в actions
                                                                                                                                                                                                                   */

exports.default = _defineProperty({}, _actions_iface.IFACE_STATE, function (state, action) {
  var _action$payload = action.payload,
      component = _action$payload.component,
      name = _action$payload.name,
      value = _action$payload.value;

  var area = component || 'common';
  var previous = Object.assign({}, state[area]);
  if (value == 'invert') {
    previous[name] = !previous[name];
  } else {
    previous[name] = value;
  }
  return Object.assign({}, state, _defineProperty({}, area, previous));
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ifaceMiddleware;

var _actions_iface = __webpack_require__(2);

var attached = void 0;

/**
 * Подключает диспетчеризацию событий redux к интерфейсу приложения
 */
function ifaceMiddleware() {
  return function (store) {
    var dispatch = store.dispatch;

    return function (next) {
      return function (action) {
        if (!attached) {
          attached = true;

          // TODO: здесь можно подписаться на online-offline, rotate и т.д.
          if (!attached) {
            dispatch((0, _actions_iface.iface_state)(''));
          }
        }
        return next(action);
      };
    };
  };
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(0);

var _reactRouter = __webpack_require__(20);

var _withMeta = __webpack_require__(7);

var _withMeta2 = _interopRequireDefault(_withMeta);

var _dispatchIface = __webpack_require__(5);

var _dispatchIface2 = _interopRequireDefault(_dispatchIface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// deprecated
var mapStateToProps = function mapStateToProps(_ref, _ref2) {
  var iface = _ref.iface;
  var location = _ref2.location;

  return Object.assign({ path_log_in: !!location.pathname.match(/\/(login|about)$/) }, iface.common);
};

exports.default = function (View) {
  var withNavigate = (0, _reactRedux.connect)(mapStateToProps, _dispatchIface2.default)((0, _reactRouter.withRouter)(View));
  return (0, _withMeta2.default)(withNavigate);
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(0);

var _withMeta = __webpack_require__(7);

var _withIface = __webpack_require__(8);

var _dispatchIface = __webpack_require__(5);

var _dispatchIface2 = _interopRequireDefault(_dispatchIface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (Component) {
  return (0, _reactRedux.connect)(function (state) {
    return Object.assign({}, (0, _withMeta.mapStateToProps)(state), (0, _withIface.mapStateToProps)(Component)(state));
  }, function (dispatch) {
    return Object.assign({}, (0, _withMeta.mapDispatchToProps)(dispatch), (0, _dispatchIface2.default)(dispatch));
  })(Component);
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(0);

var _actions_obj = __webpack_require__(3);

var obj = _interopRequireWildcard(_actions_obj);

var _reactRouterRedux = __webpack_require__(9);

var _actions_iface = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapDispatchToProps = function mapDispatchToProps(dispatch) {

  var handlers = {
    handleNavigate: function handleNavigate(path) {
      return dispatch((0, _reactRouterRedux.push)(path));
    },
    handleIfaceState: function handleIfaceState(state) {
      return dispatch((0, _actions_iface.iface_state)(state));
    },
    handleAdd: function handleAdd(_mgr) {
      return dispatch((0, _reactRouterRedux.push)('/' + _mgr.class_name + '/' + $p.utils.generate_guid()));
    },
    handleAddRow: function handleAddRow() {},
    handleDelRow: function handleDelRow() {},
    handleEdit: function handleEdit(_ref) {
      var ref = _ref.ref,
          _mgr = _ref._mgr;

      return dispatch((0, _reactRouterRedux.push)('/' + _mgr.class_name + '/' + ref));
    },
    handlePost: function handlePost() {},
    handleUnPost: function handleUnPost() {},
    handleMarkDeleted: function handleMarkDeleted() {},
    handleUnMarkDeleted: function handleUnMarkDeleted() {},
    handleSave: function handleSave() {},
    handleRevert: function handleRevert() {},
    handlePrint: function handlePrint() {},
    handleAttachment: function handleAttachment() {}
  };
  return Object.assign({ handlers: handlers }, handlers);
};

exports.default = (0, _reactRedux.connect)(null, mapDispatchToProps);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(0);

var _actions_base = __webpack_require__(4);

var mapStateToProps = function mapStateToProps() /**{meta}**/{
  var _$p = $p,
      wsql = _$p.wsql,
      superlogin = _$p.superlogin;

  var res = { use_superlogin: !!superlogin };
  var _arr = ['zone', 'couch_path', 'superlogin_path', ['couch_direct', 'boolean'], ['enable_save_pwd', 'boolean'], 'user_name', 'user_pwd'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var name = _arr[_i];
    if (Array.isArray(name)) {
      res[name[0]] = wsql.get_user_param(name[0], name[1]);
    } else {
      res[name] = wsql.get_user_param(name);
    }
  }
  return res;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    handleSetPrm: function handleSetPrm(name, value) {
      dispatch((0, _actions_base.prm_change)(name, value));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps);

/***/ })
/******/ ]);