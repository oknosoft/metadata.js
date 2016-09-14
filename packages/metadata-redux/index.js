'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ACTION_HANDLERS = exports.actions = exports.POUCH_NO_DATA = exports.POUCH_SYNC_ERROR = exports.POUCH_DATA_ERROR = exports.POUCH_CHANGE = exports.POUCH_DATA_LOADED = exports.POUCH_SYNC_START = exports.POUCH_LOAD_START = exports.POUCH_DATA_PAGE = exports.USER_LOG_OUT = exports.USER_LOG_IN = exports.USER_DEFINED = exports.OBJ_CHANGED = exports.OBJ_SAVE = exports.OBJ_REVERT = exports.OBJ_DELETE = exports.OBJ_EDIT = exports.OBJ_DEL_ROW = exports.OBJ_ADD_ROW = exports.OBJ_ADD = exports.META_LOADED = undefined;

var _actions, _ACTION_HANDLERS;

exports.default = metaReducer;
exports.attach_events = attach_events;

var _metadataCore = require('metadata-core');

var _metadataCore2 = _interopRequireDefault(_metadataCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
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

var META_LOADED = exports.META_LOADED = 'META_LOADED'; // Инициализирует параметры и создаёт менеджеры объектов данных

var OBJ_ADD = exports.OBJ_ADD = 'OBJ_ADD'; // Команда создать объекта
var OBJ_ADD_ROW = exports.OBJ_ADD_ROW = 'OBJ_ADD_ROW'; // Команда добавить строку в табчасть объекта
var OBJ_DEL_ROW = exports.OBJ_DEL_ROW = 'OBJ_DEL_ROW'; // Команда удалить строку табчасти объекта
var OBJ_EDIT = exports.OBJ_EDIT = 'OBJ_EDIT'; // Команда открыть форму редактирования объекта
var OBJ_DELETE = exports.OBJ_DELETE = 'OBJ_DELETE'; // Команда пометить объект на удаление
var OBJ_REVERT = exports.OBJ_REVERT = 'OBJ_REVERT'; // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
var OBJ_SAVE = exports.OBJ_SAVE = 'OBJ_SAVE'; // Команда записать изменённый объект
var OBJ_CHANGED = exports.OBJ_CHANGED = 'OBJ_CHANGED'; // Записан изменённый объект (по команде интерфейса или в результате репликации)

var USER_DEFINED = exports.USER_DEFINED = 'USER_DEFINED'; // Команда создать объекта
var USER_LOG_IN = exports.USER_LOG_IN = 'USER_LOG_IN'; // Команда создать объекта
var USER_LOG_OUT = exports.USER_LOG_OUT = 'USER_LOG_OUT'; // Команда создать объекта

var POUCH_DATA_PAGE = exports.POUCH_DATA_PAGE = 'POUCH_DATA_PAGE'; // Оповещение о загрузке порции локальных данных
var POUCH_LOAD_START = exports.POUCH_LOAD_START = 'POUCH_LOAD_START'; // Оповещение о начале загрузки локальных данных
var POUCH_SYNC_START = exports.POUCH_SYNC_START = 'POUCH_SYNC_START'; // Оповещение о начале синхронизации базы doc
var POUCH_DATA_LOADED = exports.POUCH_DATA_LOADED = 'POUCH_DATA_LOADED'; // Оповещение об окончании загрузки локальных данных
var POUCH_CHANGE = exports.POUCH_CHANGE = 'POUCH_CHANGE'; // Прибежали изменения с сервера
var POUCH_DATA_ERROR = exports.POUCH_DATA_ERROR = 'POUCH_DATA_ERROR'; // Оповещение об ошибке при загрузке локальных данных
var POUCH_SYNC_ERROR = exports.POUCH_SYNC_ERROR = 'POUCH_SYNC_ERROR'; // Оповещение об ошибке репликации
var POUCH_NO_DATA = exports.POUCH_NO_DATA = 'POUCH_NO_DATA'; // Оповещение об отсутствии локальных данных (как правило, при первом запуске)


// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------

function meta_loaded() {

	return { type: META_LOADED };
}

function pouch_data_loaded(page) {
	return {
		type: POUCH_DATA_LOADED,
		payload: page
	};
}

function pouch_change(dbid, change) {
	return {
		type: POUCH_CHANGE,
		payload: {
			dbid: dbid,
			change: change
		}
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
		payload: {
			dbid: dbid,
			err: err
		}
	};
}

function pouch_data_error(dbid, err) {
	return {
		type: POUCH_DATA_ERROR,
		payload: {
			dbid: dbid,
			err: err
		}
	};
}

function pouch_no_data(dbid, err) {
	return {
		type: POUCH_NO_DATA,
		payload: {
			dbid: dbid,
			err: err
		}
	};
}

function user_defined(name) {
	return {
		type: USER_DEFINED,
		payload: name
	};
}

function user_log_in(name) {
	return {
		type: USER_LOG_IN,
		payload: name
	};
}

function user_log_out() {
	return {
		type: USER_LOG_OUT
	};
}

function obj_add(class_name) {
	return {
		type: OBJ_ADD,
		payload: { class_name: class_name }
	};
}

function obj_add_row(class_name, ref, tabular) {
	return {
		type: OBJ_ADD_ROW,
		payload: {
			class_name: class_name,
			ref: ref,
			tabular: tabular
		}
	};
}

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

var actions = exports.actions = (_actions = {}, _defineProperty(_actions, META_LOADED, meta_loaded), _defineProperty(_actions, POUCH_DATA_LOADED, pouch_data_loaded), _defineProperty(_actions, POUCH_DATA_PAGE, pouch_data_page), _defineProperty(_actions, POUCH_DATA_ERROR, pouch_data_error), _defineProperty(_actions, POUCH_LOAD_START, pouch_load_start), _defineProperty(_actions, POUCH_NO_DATA, pouch_no_data), _defineProperty(_actions, USER_DEFINED, user_defined), _defineProperty(_actions, USER_LOG_IN, user_log_in), _defineProperty(_actions, USER_LOG_OUT, user_log_out), _actions);

// ------------------------------------
// Action Handlers - обработчики событий - вызываются из корневого редюсера
// ------------------------------------
var ACTION_HANDLERS = exports.ACTION_HANDLERS = (_ACTION_HANDLERS = {}, _defineProperty(_ACTION_HANDLERS, META_LOADED, function (state, action) {
	return Object.assign({}, state, { meta_loaded: true });
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_LOADED, function (state, action) {
	return Object.assign({}, state, { data_loaded: true });
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_PAGE, function (state, action) {
	return Object.assign({}, state, { page: action.payload });
}), _defineProperty(_ACTION_HANDLERS, POUCH_DATA_ERROR, function (state, action) {
	return Object.assign({}, state, { err: action.payload });
}), _defineProperty(_ACTION_HANDLERS, POUCH_LOAD_START, function (state, action) {
	return Object.assign({}, state, { data_empty: false, fetch_local: true });
}), _defineProperty(_ACTION_HANDLERS, POUCH_NO_DATA, function (state, action) {
	return Object.assign({}, state, { data_empty: true });
}), _defineProperty(_ACTION_HANDLERS, USER_DEFINED, function (state, action) {
	return Object.assign({}, state, { user: {
			name: action.payload,
			logged_in: state.user.logged_in
		} });
}), _defineProperty(_ACTION_HANDLERS, USER_LOG_IN, function (state, action) {
	return Object.assign({}, state, { user: {
			name: action.payload,
			logged_in: true
		} });
}), _defineProperty(_ACTION_HANDLERS, USER_LOG_OUT, function (state, action) {
	return Object.assign({}, state, { user: {
			name: state.user.name,
			logged_in: false
		} });
}), _ACTION_HANDLERS);

// ------------------------------------
// Reducer
// ------------------------------------
var initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: true,
	fetch_local: false,
	fetch_remote: false,
	user: {
		name: "",
		logged_in: false
	}
};
function metaReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];


	if (!state.data) {

		state.data = new _metadataCore2.default();

		Object.defineProperty(state.data, 'actions', {
			value: actions
		});
	}

	var handler = ACTION_HANDLERS[action.type];

	if (handler) {
		console.log(action);
		return handler(state, action);
	} else return state;
}

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function attach_events(pouch, store) {

	pouch.on('user_log_in', function (name) {
		store.dispatch(user_log_in(name));
	});

	pouch.on('user_log_out', function () {
		store.dispatch(user_log_out());
	});

	pouch.on('pouch_data_page', function (page) {
		store.dispatch(pouch_data_page(page));
	});

	pouch.on('pouch_data_loaded', function (page) {
		store.dispatch(pouch_data_loaded(page));
	});

	pouch.on('pouch_data_error', function (dbid, err) {
		store.dispatch(pouch_data_error(dbid, err));
	});

	pouch.on('pouch_load_start', function (page) {
		store.dispatch(pouch_load_start(page));
	});

	pouch.on('pouch_no_data', function (dbid, err) {
		store.dispatch(pouch_no_data(dbid, err));
	});

	pouch.on('pouch_sync_start', function () {
		store.dispatch(pouch_sync_start());
	});

	pouch.on('pouch_change', function (dbid, change) {
		store.dispatch(pouch_change(dbid, change));
	});

	pouch.on('pouch_sync_error', function (dbid, err) {
		store.dispatch(pouch_sync_error(dbid, err));
	});
}