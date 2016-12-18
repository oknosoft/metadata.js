'use strict';

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

const META_LOADED = 'META_LOADED'; // Инициализирует параметры и создаёт менеджеры объектов данных

const PRM_CHANGE = 'PRM_CHANGE'; // Изменены глобальные параметры (couch_path, zone и т.д.)


const USER_TRY_LOG_IN = 'USER_TRY_LOG_IN'; // Попытка авторизации
const USER_LOG_IN = 'USER_LOG_IN'; // Подтверждает авторизацию
const USER_DEFINED = 'USER_DEFINED'; // Установить текущего пользователя (авторизация не обязательна)
const USER_LOG_OUT = 'USER_LOG_OUT'; // Попытка завершения синхронизации
const USER_LOG_ERROR = 'USER_LOG_ERROR'; // Ошибка авторизации

const USER_SOCIAL_TRY_LINK = 'USER_SOCIAL_TRY_LINK'; // Попытка привязать аккаунт социальной сети
const USER_SOCIAL_LINKED = 'USER_SOCIAL_LINKED'; // Пользователь привязан к аккаунту социальной сети
const USER_SOCIAL_UNLINKED = 'USER_SOCIAL_UNLINKED'; // Пользователь отвязан от аккаунта социальной сети

const POUCH_DATA_PAGE = 'POUCH_DATA_PAGE'; // Оповещение о загрузке порции локальных данных
const POUCH_LOAD_START = 'POUCH_LOAD_START'; // Оповещение о начале загрузки локальных данных
const POUCH_DATA_LOADED = 'POUCH_DATA_LOADED'; // Оповещение об окончании загрузки локальных данных
const POUCH_DATA_ERROR = 'POUCH_DATA_ERROR'; // Оповещение об ошибке при загрузке локальных данных
const POUCH_NO_DATA = 'POUCH_NO_DATA'; // Оповещение об отсутствии локальных данных (как правило, при первом запуске)

const POUCH_SYNC_START = 'POUCH_SYNC_START'; // Оповещение о начале синхронизации базы doc
const POUCH_SYNC_ERROR = 'POUCH_SYNC_ERROR'; // Оповещение об ошибке репликации - не означает окончания репликации - просто информирует об ошибке
const POUCH_SYNC_DATA = 'POUCH_SYNC_DATA'; // Прибежали изменения с сервера или мы отправили данные на сервер
const POUCH_SYNC_PAUSED = 'POUCH_SYNC_PAUSED'; // Репликация приостановлена, обычно, из-за потери связи с сервером
const POUCH_SYNC_RESUMED = 'POUCH_SYNC_RESUMED'; // Репликация возобновлена
const POUCH_SYNC_DENIED = 'POUCH_SYNC_DENIED'; // Разновидность ошибки репликации из-за недостатка прав для записи документа на сервере

const OBJ_ADD = 'OBJ_ADD'; // Команда создать объекта
const OBJ_ADD_ROW = 'OBJ_ADD_ROW'; // Команда добавить строку в табчасть объекта
const OBJ_DEL_ROW = 'OBJ_DEL_ROW'; // Команда удалить строку табчасти объекта
const OBJ_EDIT = 'OBJ_EDIT'; // Команда открыть форму редактирования объекта
const OBJ_REVERT = 'OBJ_REVERT'; // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
const OBJ_SAVE = 'OBJ_SAVE'; // Команда записать изменённый объект (пометка удаления, проведение и отмена проведения - это так же, запись)
const OBJ_CHANGE = 'OBJ_CHANGE'; // Записан изменённый объект (по команде интерфейса или в результате репликации)
const OBJ_VALUE_CHANGE = 'OBJ_VALUE_CHANGE'; // Изменён реквизит шапки или строки табчасти


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

		const { meta } = getState(),
		      { $p } = meta;

		// если вход еще не выполнен...
		if (!meta.user.logged_in) {

			setTimeout(function () {

				// получаем имя сохраненного или гостевого пользователя
				let name = $p.wsql.get_user_param('user_name');
				let password = $p.wsql.get_user_param('user_pwd');

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
		payload: { dbid, err }
	};
}

function pouch_sync_paused(dbid, info) {
	return {
		type: POUCH_SYNC_PAUSED,
		payload: { dbid, info }
	};
}

function pouch_sync_resumed(dbid, info) {
	return {
		type: POUCH_SYNC_RESUMED,
		payload: { dbid, info }
	};
}

function pouch_sync_denied(dbid, info) {
	return {
		type: POUCH_SYNC_DENIED,
		payload: { dbid, info }
	};
}

function pouch_data_error(dbid, err) {
	return {
		type: POUCH_DATA_ERROR,
		payload: { dbid, err }
	};
}

function pouch_no_data(dbid, err) {
	return {
		type: POUCH_NO_DATA,
		payload: { dbid, err }
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

		const disp_log_out = () => {
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

const actions = {

	[META_LOADED]: meta_loaded,
	[PRM_CHANGE]: prm_change,

	[USER_TRY_LOG_IN]: user_try_log_in,
	[USER_LOG_IN]: user_log_in,
	[USER_DEFINED]: user_defined,
	[USER_LOG_OUT]: user_log_out,
	[USER_LOG_ERROR]: user_log_error,

	[POUCH_DATA_LOADED]: pouch_data_loaded,
	[POUCH_DATA_PAGE]: pouch_data_page,
	[POUCH_DATA_ERROR]: pouch_data_error,
	[POUCH_LOAD_START]: pouch_load_start,
	[POUCH_NO_DATA]: pouch_no_data,
	[POUCH_SYNC_DATA]: pouch_sync_data,

	[OBJ_ADD]: obj_add,
	[OBJ_ADD_ROW]: obj_add_row,
	[OBJ_DEL_ROW]: obj_del_row,
	[OBJ_EDIT]: obj_edit,
	[OBJ_REVERT]: obj_revert,
	[OBJ_SAVE]: obj_save,
	[OBJ_CHANGE]: obj_change,
	[OBJ_VALUE_CHANGE]: obj_value_change,
	obj_post: obj_post,
	obj_unpost: obj_unpost,
	obj_mark_deleted: obj_mark_deleted,
	obj_unmark_deleted: obj_unmark_deleted

};
'use strict';

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
	const _obj = _mgr.create();
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
	return () => Promise.resolve();
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
	return (dispatch, getState) => {
		return new Promise(resolve => {
			setTimeout(() => {
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
	return (dispatch, getState) => {
		let _obj;
		if (typeof class_name == 'object') {
			_obj = class_name;
			class_name = _obj._manager.class_name;
			ref = _obj.ref;
			if (mark_deleted) _obj._obj._deleted = true;
			_obj.save(post).then(() => {
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
	return (dispatch, getState) => {
		return new Promise(resolve => {
			setTimeout(() => {
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

/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
const ACTION_HANDLERS = {

	[META_LOADED]: (state, action) => Object.assign({}, state, {
		$p: action.payload,
		meta_loaded: true
	}),

	[PRM_CHANGE]: (state, action) => state,

	[POUCH_DATA_LOADED]: (state, action) => Object.assign({}, state, { data_loaded: true, fetch_local: false }),

	[POUCH_DATA_PAGE]: (state, action) => Object.assign({}, state, { page: action.payload }),

	[POUCH_DATA_ERROR]: (state, action) => Object.assign({}, state, { err: action.payload, fetch_local: false }),

	[POUCH_LOAD_START]: (state, action) => Object.assign({}, state, { data_empty: false, fetch_local: true }),

	[POUCH_NO_DATA]: (state, action) => Object.assign({}, state, { data_empty: true, fetch_local: false }),

	[POUCH_SYNC_START]: (state, action) => Object.assign({}, state, { sync_started: true }),

	[POUCH_SYNC_DATA]: (state, action) => Object.assign({}, state, { fetch_remote: action.payload ? true : false }),

	[USER_DEFINED]: (state, action) => Object.assign({}, state, { user: {
			name: action.payload,
			logged_in: state.user.logged_in
		} }),

	[USER_LOG_IN]: (state, action) => Object.assign({}, state, { user: {
			name: action.payload,
			logged_in: true
		} }),

	[USER_TRY_LOG_IN]: (state, action) => Object.assign({}, state, { user: {
			name: action.payload.name,
			logged_in: state.user.logged_in
		} }),

	[USER_LOG_OUT]: (state, action) => Object.assign({}, state, {
		user: {
			name: state.user.name,
			logged_in: false
		},
		sync_started: false
	}),

	[USER_LOG_ERROR]: (state, action) => Object.assign({}, state, {
		user: {
			name: state.user.name,
			logged_in: false
		},
		sync_started: false
	})

};

/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */
const initialState = {
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
function rx_reducer(state = initialState, action) {

	let handler = ACTION_HANDLERS[action.type];

	if (!handler) handler = ACTION_HANDLERS_OBJ[action.type];

	return handler ? handler(state, action) : state;
}

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function rx_events(store) {

	this.adapters.pouch.on({

		user_log_in: name => {
			store.dispatch(user_log_in(name));
		},

		user_log_out: () => {
			store.dispatch(user_log_out());
		},

		pouch_data_page: page => {
			store.dispatch(pouch_data_page(page));
		},

		pouch_data_loaded: page => {
			store.dispatch(pouch_data_loaded(page));
		},

		pouch_data_error: (dbid, err) => {
			store.dispatch(pouch_data_error(dbid, err));
		},

		pouch_load_start: page => {
			store.dispatch(pouch_load_start(page));
		},

		pouch_no_data: (dbid, err) => {
			store.dispatch(pouch_no_data(dbid, err));
		},

		pouch_sync_start: () => {
			store.dispatch(pouch_sync_start());
		},

		pouch_sync_data: (dbid, change) => {
			store.dispatch(pouch_sync_data(dbid, change));
		},

		pouch_sync_error: (dbid, err) => {
			store.dispatch(pouch_sync_error(dbid, err));
		},

		pouch_sync_paused: (dbid, info) => {
			store.dispatch(pouch_sync_paused(dbid, info));
		},

		pouch_sync_resumed: (dbid, info) => {
			store.dispatch(pouch_sync_resumed(dbid, info));
		},

		pouch_sync_denied: (dbid, info) => {
			store.dispatch(pouch_sync_denied(dbid, info));
		}

	});

	this.md.on({
		obj_loaded: _obj => {
			store.dispatch(obj_change(_obj._manager.class_name, _obj.ref));
		}
	});
}

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
const plugin = {

	proto(constructor) {

		Object.defineProperties(constructor.prototype, {

			rx_actions: {
				value: actions
			},

			rx_action_types: {
				value: {

					USER_TRY_LOG_IN,
					USER_LOG_IN,
					USER_DEFINED,
					USER_LOG_OUT,
					USER_LOG_ERROR,

					POUCH_DATA_LOADED,
					POUCH_DATA_PAGE,
					POUCH_DATA_ERROR,
					POUCH_LOAD_START,
					POUCH_NO_DATA
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

	constructor() {}
};
exports.default = plugin;
"use strict";

/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
const ACTION_HANDLERS_OBJ = {

  [OBJ_ADD]: (state, action) => state,

  [OBJ_CHANGE]: (state, action) => Object.assign({}, state, { obj_change: action.payload })

};
