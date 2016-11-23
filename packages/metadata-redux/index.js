'use strict';

var _actions;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ### Действия и типы действий в терминах redux
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module actions.js
 *
 * Created 05.09.2016
 */

// ------------------------------------
// Action types - имена типов действий
// ------------------------------------

var META_LOADED = 'META_LOADED'; // Инициализирует параметры и создаёт менеджеры объектов данных

var PRM_CHANGE = 'PRM_CHANGE'; // Изменены глобальные параметры (couch_path, zone и т.д.)


var USER_TRY_LOG_IN = 'USER_TRY_LOG_IN'; // Попытка авторизации
var USER_LOG_IN = 'USER_LOG_IN'; // Подтверждает авторизацию
var USER_DEFINED = 'USER_DEFINED'; // Установить текущего пользователя (авторизация не обязательна)
var USER_LOG_OUT = 'USER_LOG_OUT'; // Попытка завершения синхронизации
var USER_LOG_ERROR = 'USER_LOG_ERROR'; // Ошибка авторизации

var USER_SOCIAL_TRY_LINK = 'USER_SOCIAL_TRY_LINK'; // Попытка привязать аккаунт социальной сети
var USER_SOCIAL_LINKED = 'USER_SOCIAL_LINKED'; // Пользователь привязан к аккаунту социальной сети
var USER_SOCIAL_UNLINKED = 'USER_SOCIAL_UNLINKED'; // Пользователь отвязан от аккаунта социальной сети

var POUCH_DATA_PAGE = 'POUCH_DATA_PAGE'; // Оповещение о загрузке порции локальных данных
var POUCH_LOAD_START = 'POUCH_LOAD_START'; // Оповещение о начале загрузки локальных данных
var POUCH_DATA_LOADED = 'POUCH_DATA_LOADED'; // Оповещение об окончании загрузки локальных данных
var POUCH_DATA_ERROR = 'POUCH_DATA_ERROR'; // Оповещение об ошибке при загрузке локальных данных
var POUCH_NO_DATA = 'POUCH_NO_DATA'; // Оповещение об отсутствии локальных данных (как правило, при первом запуске)

var POUCH_SYNC_START = 'POUCH_SYNC_START'; // Оповещение о начале синхронизации базы doc
var POUCH_SYNC_ERROR = 'POUCH_SYNC_ERROR'; // Оповещение об ошибке репликации - не означает окончания репликации - просто информирует об ошибке
var POUCH_SYNC_DATA = 'POUCH_SYNC_DATA'; // Прибежали изменения с сервера или мы отправили данные на сервер
var POUCH_SYNC_PAUSED = 'POUCH_SYNC_PAUSED'; // Репликация приостановлена, обычно, из-за потери связи с сервером
var POUCH_SYNC_RESUMED = 'POUCH_SYNC_RESUMED'; // Репликация возобновлена
var POUCH_SYNC_DENIED = 'POUCH_SYNC_DENIED'; // Разновидность ошибки репликации из-за недостатка прав для записи документа на сервере

var OBJ_ADD = 'OBJ_ADD'; // Команда создать объекта
var OBJ_ADD_ROW = 'OBJ_ADD_ROW'; // Команда добавить строку в табчасть объекта
var OBJ_DEL_ROW = 'OBJ_DEL_ROW'; // Команда удалить строку табчасти объекта
var OBJ_EDIT = 'OBJ_EDIT'; // Команда открыть форму редактирования объекта
var OBJ_REVERT = 'OBJ_REVERT'; // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
var OBJ_SAVE = 'OBJ_SAVE'; // Команда записать изменённый объект (пометка удаления, проведение и отмена проведения - это так же, запись)
var OBJ_CHANGE = 'OBJ_CHANGE'; // Записан изменённый объект (по команде интерфейса или в результате репликации)
var OBJ_VALUE_CHANGE = 'OBJ_VALUE_CHANGE'; // Изменён реквизит шапки или строки табчасти


// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------

function meta_loaded($p) {

	return {
		type: META_LOADED,
		payload: $p
	};
}

function prm_change(prms) {

	return {
		type: PRM_CHANGE,
		payload: prms
	};
}

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
			type: POUCH_DATA_LOADED,
			payload: page
		});

		var _getState = getState(),
		    meta = _getState.meta,
		    $p = meta.$p;

		// если вход еще не выполнен...


		if (!meta.user.logged_in) {

			setTimeout(function () {

				// получаем имя сохраненного или гостевого пользователя
				var name = $p.wsql.get_user_param('user_name');
				var password = $p.wsql.get_user_param('user_pwd');

				if (!name && $p.job_prm.zone_demo == $p.wsql.get_user_param('zone') && $p.job_prm.guests.length) {
					name = $p.job_prm.guests[0].name;
				}

				// устанавливаем текущего пользователя
				if (name) dispatch(user_defined(name));

				// если разрешено сохранение пароля или гостевая зона...
				if (name && password && $p.wsql.get_user_param('enable_save_pwd')) {
					dispatch(user_try_log_in($p.adapters.pouch, name, $p.aes.Ctr.decrypt(password)));
					return;
				}

				if (name && $p.job_prm.zone_demo == $p.wsql.get_user_param('zone')) {
					dispatch(user_try_log_in($p.adapters.pouch, name, $p.aes.Ctr.decrypt($p.job_prm.guests[0].password)));
				}
			}, 10);
		}
	};
}

var sync_data_indicator;

function pouch_sync_data(dbid, change) {

	// Thunk middleware знает, как обращаться с функциями.
	// Он передает метод действия в качестве аргумента функции,
	// т.о, это позволяет отправить действие самостоятельно.

	return function (dispatch, getState) {

		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({
			type: POUCH_SYNC_DATA,
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
				type: POUCH_SYNC_DATA,
				payload: false
			});
		}, 1200);
	};
}

function pouch_data_page(page) {
	return {
		type: POUCH_DATA_PAGE,
		payload: page
	};
}

function pouch_load_start(page) {
	return {
		type: POUCH_LOAD_START,
		payload: page
	};
}

function pouch_sync_start() {
	return { type: POUCH_SYNC_START };
}

function pouch_sync_error(dbid, err) {
	return {
		type: POUCH_SYNC_ERROR,
		payload: { dbid: dbid, err: err }
	};
}

function pouch_sync_paused(dbid, info) {
	return {
		type: POUCH_SYNC_PAUSED,
		payload: { dbid: dbid, info: info }
	};
}

function pouch_sync_resumed(dbid, info) {
	return {
		type: POUCH_SYNC_RESUMED,
		payload: { dbid: dbid, info: info }
	};
}

function pouch_sync_denied(dbid, info) {
	return {
		type: POUCH_SYNC_DENIED,
		payload: { dbid: dbid, info: info }
	};
}

function pouch_data_error(dbid, err) {
	return {
		type: POUCH_DATA_ERROR,
		payload: { dbid: dbid, err: err }
	};
}

function pouch_no_data(dbid, err) {
	return {
		type: POUCH_NO_DATA,
		payload: { dbid: dbid, err: err }
	};
}

function user_defined(name) {

	return {
		type: USER_DEFINED,
		payload: name
	};
}

/**
 * ### Пользователь авторизован
 * @param name
 * @return {{type: string, payload: *}}
 */
function user_log_in(name) {
	return {
		type: USER_LOG_IN,
		payload: name
	};
}

function user_try_log_in(adapter, name, password) {

	// Thunk middleware знает, как обращаться с функциями.
	// Он передает метод действия в качестве аргумента функции,
	// т.о, это позволяет отправить действие самостоятельно.

	return function (dispatch, getState) {

		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({
			type: USER_TRY_LOG_IN,
			payload: { name: name, password: password, provider: 'local' }
		});

		// в зависимости от использования суперлогина, разные действия
		if (adapter.$p.superlogin) {
			return adapter.$p.superlogin.login({
				username: name,
				password: password
			}).then(function (session) {
				return adapter.log_in(session.token, session.password);
			});
		} else {
			return adapter.log_in(name, password);
		}

		// In a real world app, you also want to
		// catch any error in the network call.
	};
}

/**
 * Инициирует отключение пользователя
 * @param adapter
 * @return {Function}
 */
function user_log_out(adapter) {

	return function (dispatch, getState) {

		var disp_log_out = function disp_log_out() {
			dispatch({
				type: USER_LOG_OUT,
				payload: { name: getState().meta.user.name }
			});
		};

		// в зависимости от использования суперлогина, разные действия
		if (!adapter) {
			disp_log_out();
		} else if (adapter.$p.superlogin) {
			adapter.$p.superlogin.logOut().then(disp_log_out);
		} else {
			adapter.log_out();
		}
	};
}

function user_log_error() {
	return {
		type: USER_LOG_ERROR
	};
}

var actions = (_actions = {}, _defineProperty(_actions, META_LOADED, meta_loaded), _defineProperty(_actions, PRM_CHANGE, prm_change), _defineProperty(_actions, USER_TRY_LOG_IN, user_try_log_in), _defineProperty(_actions, USER_LOG_IN, user_log_in), _defineProperty(_actions, USER_DEFINED, user_defined), _defineProperty(_actions, USER_LOG_OUT, user_log_out), _defineProperty(_actions, USER_LOG_ERROR, user_log_error), _defineProperty(_actions, POUCH_DATA_LOADED, pouch_data_loaded), _defineProperty(_actions, POUCH_DATA_PAGE, pouch_data_page), _defineProperty(_actions, POUCH_DATA_ERROR, pouch_data_error), _defineProperty(_actions, POUCH_LOAD_START, pouch_load_start), _defineProperty(_actions, POUCH_NO_DATA, pouch_no_data), _defineProperty(_actions, POUCH_SYNC_DATA, pouch_sync_data), _defineProperty(_actions, OBJ_ADD, obj_add), _defineProperty(_actions, OBJ_ADD_ROW, obj_add_row), _defineProperty(_actions, OBJ_DEL_ROW, obj_del_row), _defineProperty(_actions, OBJ_EDIT, obj_edit), _defineProperty(_actions, OBJ_REVERT, obj_revert), _defineProperty(_actions, OBJ_SAVE, obj_save), _defineProperty(_actions, OBJ_CHANGE, obj_change), _defineProperty(_actions, OBJ_VALUE_CHANGE, obj_value_change), _defineProperty(_actions, 'obj_post', obj_post), _defineProperty(_actions, 'obj_unpost', obj_unpost), _defineProperty(_actions, 'obj_mark_deleted', obj_mark_deleted), _defineProperty(_actions, 'obj_unmark_deleted', obj_unmark_deleted), _actions);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * ### Действия и типы действий в терминах redux
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module actions.js
 *
 * Created 05.09.2016
 */

// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------


function obj_add(_mgr) {
	var _obj = _mgr.create();
	return {
		type: OBJ_ADD,
		payload: { class_name: _mgr.class_name, ref: _obj.ref }
	};
}

function obj_add_row(class_name, ref, tabular, proto) {
	return {
		type: OBJ_ADD_ROW,
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
function obj_del_row(class_name, ref, tabular, index) {
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
function obj_edit(class_name, ref, frm) {
	return {
		type: OBJ_EDIT,
		payload: {
			class_name: class_name,
			ref: ref,
			frm: frm
		}
	};
}

function obj_revert(class_name, ref) {
	return function (dispatch, getState) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				dispatch(dispatch({
					type: OBJ_REVERT,
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

function obj_save(class_name, ref, post, mark_deleted) {
	return function (dispatch, getState) {
		var _obj = void 0;
		if ((typeof class_name === 'undefined' ? 'undefined' : _typeof(class_name)) == 'object') {
			_obj = class_name;
			class_name = _obj._manager.class_name;
			ref = _obj.ref;
			if (mark_deleted) _obj._obj._deleted = true;
			_obj.save(post).then(function () {
				dispatch({
					type: OBJ_SAVE,
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

function obj_post(class_name, ref) {
	return obj_save(class_name, ref, true);
}

function obj_unpost(class_name, ref) {
	return obj_save(class_name, ref, false);
}

function obj_mark_deleted(class_name, ref) {
	return obj_save(class_name, ref, undefined, true);
}

function obj_unmark_deleted(class_name, ref) {
	return obj_save(class_name, ref, undefined, false);
}

function obj_change(class_name, ref) {
	return {
		type: OBJ_CHANGE,
		payload: {
			class_name: class_name,
			ref: ref
		}
	};
}

function obj_value_change(class_name, ref) {
	return function (dispatch, getState) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				dispatch(dispatch({
					type: OBJ_VALUE_CHANGE,
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
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ACTION_HANDLERS;

var _simpleAssign = require("simple-assign");

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
var ACTION_HANDLERS = (_ACTION_HANDLERS = {}, _defineProperty(_ACTION_HANDLERS, META_LOADED, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, {
		$p: action.payload,
		meta_loaded: true
	});
}), _defineProperty(_ACTION_HANDLERS, PRM_CHANGE, function (state, action) {
	return state;
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_LOADED, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { data_loaded: true, fetch_local: false });
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_PAGE, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { page: action.payload });
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_ERROR, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { err: action.payload, fetch_local: false });
}), _defineProperty(_ACTION_HANDLERS, POUCH_LOAD_START, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { data_empty: false, fetch_local: true });
}), _defineProperty(_ACTION_HANDLERS, POUCH_NO_DATA, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { data_empty: true, fetch_local: false });
}), _defineProperty(_ACTION_HANDLERS, POUCH_SYNC_START, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { sync_started: true });
}), _defineProperty(_ACTION_HANDLERS, POUCH_SYNC_DATA, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { fetch_remote: action.payload ? true : false });
}), _defineProperty(_ACTION_HANDLERS, USER_DEFINED, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { user: {
			name: action.payload,
			logged_in: state.user.logged_in
		} });
}), _defineProperty(_ACTION_HANDLERS, USER_LOG_IN, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { user: {
			name: action.payload,
			logged_in: true
		} });
}), _defineProperty(_ACTION_HANDLERS, USER_TRY_LOG_IN, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, { user: {
			name: action.payload.name,
			logged_in: state.user.logged_in
		} });
}), _defineProperty(_ACTION_HANDLERS, USER_LOG_OUT, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, {
		user: {
			name: state.user.name,
			logged_in: false
		},
		sync_started: false
	});
}), _defineProperty(_ACTION_HANDLERS, USER_LOG_ERROR, function (state, action) {
	return (0, _simpleAssign2.default)({}, state, {
		user: {
			name: state.user.name,
			logged_in: false
		},
		sync_started: false
	});
}), _ACTION_HANDLERS);

/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */
var initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: false,
	sync_started: false,
	fetch_local: false,
	fetch_remote: false,
	user: {
		name: "",
		logged_in: false
	}
};
function rx_reducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];


	var handler = ACTION_HANDLERS[action.type];

	if (!handler) handler = ACTION_HANDLERS_OBJ[action.type];

	if (handler) {
		if (action.type != OBJ_CHANGE) {
			console.log(action);
		}
		return handler(state, action);
	} else return state;
}

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function rx_events(store) {

	this.adapters.pouch.on({

		user_log_in: function (_user_log_in) {
			function user_log_in(_x2) {
				return _user_log_in.apply(this, arguments);
			}

			user_log_in.toString = function () {
				return _user_log_in.toString();
			};

			return user_log_in;
		}(function (name) {
			store.dispatch(user_log_in(name));
		}),

		user_log_out: function (_user_log_out) {
			function user_log_out() {
				return _user_log_out.apply(this, arguments);
			}

			user_log_out.toString = function () {
				return _user_log_out.toString();
			};

			return user_log_out;
		}(function () {
			store.dispatch(user_log_out());
		}),

		pouch_data_page: function (_pouch_data_page) {
			function pouch_data_page(_x3) {
				return _pouch_data_page.apply(this, arguments);
			}

			pouch_data_page.toString = function () {
				return _pouch_data_page.toString();
			};

			return pouch_data_page;
		}(function (page) {
			store.dispatch(pouch_data_page(page));
		}),

		pouch_data_loaded: function (_pouch_data_loaded) {
			function pouch_data_loaded(_x4) {
				return _pouch_data_loaded.apply(this, arguments);
			}

			pouch_data_loaded.toString = function () {
				return _pouch_data_loaded.toString();
			};

			return pouch_data_loaded;
		}(function (page) {
			store.dispatch(pouch_data_loaded(page));
		}),

		pouch_data_error: function (_pouch_data_error) {
			function pouch_data_error(_x5, _x6) {
				return _pouch_data_error.apply(this, arguments);
			}

			pouch_data_error.toString = function () {
				return _pouch_data_error.toString();
			};

			return pouch_data_error;
		}(function (dbid, err) {
			store.dispatch(pouch_data_error(dbid, err));
		}),

		pouch_load_start: function (_pouch_load_start) {
			function pouch_load_start(_x7) {
				return _pouch_load_start.apply(this, arguments);
			}

			pouch_load_start.toString = function () {
				return _pouch_load_start.toString();
			};

			return pouch_load_start;
		}(function (page) {
			store.dispatch(pouch_load_start(page));
		}),

		pouch_no_data: function (_pouch_no_data) {
			function pouch_no_data(_x8, _x9) {
				return _pouch_no_data.apply(this, arguments);
			}

			pouch_no_data.toString = function () {
				return _pouch_no_data.toString();
			};

			return pouch_no_data;
		}(function (dbid, err) {
			store.dispatch(pouch_no_data(dbid, err));
		}),

		pouch_sync_start: function (_pouch_sync_start) {
			function pouch_sync_start() {
				return _pouch_sync_start.apply(this, arguments);
			}

			pouch_sync_start.toString = function () {
				return _pouch_sync_start.toString();
			};

			return pouch_sync_start;
		}(function () {
			store.dispatch(pouch_sync_start());
		}),

		pouch_sync_data: function (_pouch_sync_data) {
			function pouch_sync_data(_x10, _x11) {
				return _pouch_sync_data.apply(this, arguments);
			}

			pouch_sync_data.toString = function () {
				return _pouch_sync_data.toString();
			};

			return pouch_sync_data;
		}(function (dbid, change) {
			store.dispatch(pouch_sync_data(dbid, change));
		}),

		pouch_sync_error: function (_pouch_sync_error) {
			function pouch_sync_error(_x12, _x13) {
				return _pouch_sync_error.apply(this, arguments);
			}

			pouch_sync_error.toString = function () {
				return _pouch_sync_error.toString();
			};

			return pouch_sync_error;
		}(function (dbid, err) {
			store.dispatch(pouch_sync_error(dbid, err));
		}),

		pouch_sync_paused: function (_pouch_sync_paused) {
			function pouch_sync_paused(_x14, _x15) {
				return _pouch_sync_paused.apply(this, arguments);
			}

			pouch_sync_paused.toString = function () {
				return _pouch_sync_paused.toString();
			};

			return pouch_sync_paused;
		}(function (dbid, info) {
			store.dispatch(pouch_sync_paused(dbid, info));
		}),

		pouch_sync_resumed: function (_pouch_sync_resumed) {
			function pouch_sync_resumed(_x16, _x17) {
				return _pouch_sync_resumed.apply(this, arguments);
			}

			pouch_sync_resumed.toString = function () {
				return _pouch_sync_resumed.toString();
			};

			return pouch_sync_resumed;
		}(function (dbid, info) {
			store.dispatch(pouch_sync_resumed(dbid, info));
		}),

		pouch_sync_denied: function (_pouch_sync_denied) {
			function pouch_sync_denied(_x18, _x19) {
				return _pouch_sync_denied.apply(this, arguments);
			}

			pouch_sync_denied.toString = function () {
				return _pouch_sync_denied.toString();
			};

			return pouch_sync_denied;
		}(function (dbid, info) {
			store.dispatch(pouch_sync_denied(dbid, info));
		})

	});

	this.md.on({
		obj_loaded: function obj_loaded(_obj) {
			store.dispatch(obj_change(_obj._manager.class_name, _obj.ref));
		}
	});
}

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
var plugin = {
	proto: function proto(constructor) {

		Object.defineProperties(constructor.prototype, {

			rx_actions: {
				value: actions
			},

			rx_action_types: {
				value: {

					USER_TRY_LOG_IN: USER_TRY_LOG_IN,
					USER_LOG_IN: USER_LOG_IN,
					USER_DEFINED: USER_DEFINED,
					USER_LOG_OUT: USER_LOG_OUT,
					USER_LOG_ERROR: USER_LOG_ERROR,

					POUCH_DATA_LOADED: POUCH_DATA_LOADED,
					POUCH_DATA_PAGE: POUCH_DATA_PAGE,
					POUCH_DATA_ERROR: POUCH_DATA_ERROR,
					POUCH_LOAD_START: POUCH_LOAD_START,
					POUCH_NO_DATA: POUCH_NO_DATA
				}
			},

			rx_reducer: {
				value: rx_reducer,
				writable: true
			},

			rx_events: {
				value: rx_events,
				writable: true
			}
		});
	},
	constructor: function constructor() {}
};
exports.default = plugin;
"use strict";

var _ACTION_HANDLERS_OBJ;

var _simpleAssign = require("simple-assign");

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
var ACTION_HANDLERS_OBJ = (_ACTION_HANDLERS_OBJ = {}, _defineProperty(_ACTION_HANDLERS_OBJ, OBJ_ADD, function (state, action) {
  return state;
}), _defineProperty(_ACTION_HANDLERS_OBJ, OBJ_CHANGE, function (state, action) {
  return (0, _simpleAssign2.default)({}, state, { obj_change: action.payload });
}), _ACTION_HANDLERS_OBJ);
