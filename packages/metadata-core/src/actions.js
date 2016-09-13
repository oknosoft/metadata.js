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

export const META_LOADED        = 'META_LOADED'         // Инициализирует параметры и создаёт менеджеры объектов данных

export const OBJ_ADD            = 'OBJ_ADD'             // Команда создать объекта
export const OBJ_ADD_ROW        = 'OBJ_ADD_ROW'         // Команда добавить строку в табчасть объекта
export const OBJ_DEL_ROW        = 'OBJ_DEL_ROW'         // Команда удалить строку табчасти объекта
export const OBJ_EDIT           = 'OBJ_EDIT'            // Команда открыть форму редактирования объекта
export const OBJ_DELETE         = 'OBJ_DELETE'          // Команда пометить объект на удаление
export const OBJ_REVERT         = 'OBJ_REVERT'          // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
export const OBJ_SAVE           = 'OBJ_SAVE'            // Команда записать изменённый объект
export const OBJ_CHANGED        = 'OBJ_CHANGED'         // Записан изменённый объект (по команде интерфейса или в результате репликации)

export const USER_DEFINED       = 'USER_DEFINED'        // Команда создать объекта
export const USER_LOG_IN        = 'USER_LOG_IN'         // Команда создать объекта
export const USER_LOG_OUT       = 'USER_LOG_OUT'        // Команда создать объекта

export const POUCH_DATA_PAGE    = 'POUCH_DATA_PAGE'     // Оповещение о загрузке порции локальных данных
export const POUCH_LOAD_START   = 'POUCH_LOAD_START'    // Оповещение о начале загрузки локальных данных
export const POUCH_SYNC_START   = 'POUCH_SYNC_START'    // Оповещение о начале синхронизации базы doc
export const POUCH_DATA_LOADED  = 'POUCH_DATA_LOADED'   // Оповещение об окончании загрузки локальных данных
export const POUCH_CHANGE       = 'POUCH_CHANGE'        // Прибежали изменения с сервера
export const POUCH_DATA_ERROR   = 'POUCH_DATA_ERROR'    // Оповещение об ошибке при загрузке локальных данных
export const POUCH_SYNC_ERROR   = 'POUCH_SYNC_ERROR'    // Оповещение об ошибке репликации
export const POUCH_NO_DATA      = 'POUCH_NO_DATA'       // Оповещение об отсутствии локальных данных (как правило, при первом запуске)



// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------

export function meta_loaded() {

	return { type: META_LOADED }
}

export function pouch_data_loaded(page) {
	return {
		type: POUCH_DATA_LOADED,
		payload: page
	}
}

export function pouch_change(dbid, change) {
	return {
		type: POUCH_CHANGE,
		payload: {
			dbid: dbid,
			change: change
		}
	}
}

export function pouch_data_page(page) {
	return {
		type: POUCH_DATA_PAGE,
		payload: page
	}
}

export function pouch_load_start(page) {
	return {
		type: POUCH_LOAD_START,
		payload: page
	}
}

export function pouch_sync_start() {
	return { type: POUCH_SYNC_START }
}

export function pouch_sync_error(dbid, err) {
	return {
		type: POUCH_SYNC_ERROR,
		payload: {
			dbid: dbid,
			err: err
		}
	}
}

export function pouch_data_error(dbid, err) {
	return {
		type: POUCH_DATA_ERROR,
		payload: {
			dbid: dbid,
			err: err
		}
	}
}

export function pouch_no_data(dbid, err) {
	return {
		type: POUCH_NO_DATA,
		payload: {
			dbid: dbid,
			err: err
		}
	}
}

export function user_defined(name) {
	return {
		type: USER_DEFINED,
		payload: name
	}
}

export function user_log_in(name) {
	return {
		type: USER_LOG_IN,
		payload: name
	}
}

export function user_log_out() {
	return {
		type: USER_LOG_OUT
	}
}

export function obj_add(class_name) {
	return {
		type: OBJ_ADD,
		payload: {class_name: class_name}
	}
}

export function obj_add_row(class_name, ref, tabular) {
	return {
		type: OBJ_ADD_ROW,
		payload: {
			class_name: class_name,
			ref: ref,
			tabular: tabular
		}
	}
}

export function obj_edit(class_name, ref, frm) {
	return {
		type: OBJ_EDIT,
		payload: {
			class_name: class_name,
			ref: ref,
			frm: frm
		}
	}
}

// ------------------------------------
// Action Handlers - обработчики событий - вызываются из корневого редюсера
// ------------------------------------
const ACTION_HANDLERS = {
	[META_LOADED]:          (state, action) => Object.assign({}, state, {meta_loaded: true}),

	[POUCH_DATA_LOADED]:    (state, action) => Object.assign({}, state, {data_loaded: true}),
	[POUCH_DATA_PAGE]:      (state, action) => Object.assign({}, state, {page: action.payload}),
	[POUCH_DATA_ERROR]:     (state, action) => Object.assign({}, state, {err: action.payload}),
	[POUCH_LOAD_START]:     (state, action) => Object.assign({}, state, {data_empty: false, fetch_local: true}),
	[POUCH_NO_DATA]:        (state, action) => Object.assign({}, state, {data_empty: true}),

	[USER_DEFINED]:     (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: state.user.logged_in
	}}),
	[USER_LOG_IN]:      (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: true
	}}),
	[USER_LOG_OUT]:     (state, action) => Object.assign({}, state, {user: {
		name: state.user.name,
		logged_in: false
	}})

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: true,
	fetch_local: false,
	fetch_remote: false,
	user: {
		name: "",
		logged_in: false
	}
}
export default function metaReducer (state = initialState, action) {

	if(!state.data){

		state.data = new MetaEngine()

		if(!state.data.actions){
			Object.defineProperty(state.data, 'actions', {
				value: {
					[META_LOADED]: meta_loaded,

					[POUCH_DATA_LOADED]: pouch_data_loaded,
					[POUCH_DATA_PAGE]: pouch_data_page,
					[POUCH_DATA_ERROR]: pouch_data_error,
					[POUCH_LOAD_START]: pouch_load_start,
					[POUCH_NO_DATA]: pouch_no_data,

					[USER_DEFINED]: user_defined,
					[USER_LOG_IN]: user_log_in,
					[USER_LOG_OUT]: user_log_out
				}
			})
		}
	}

	const handler = ACTION_HANDLERS[action.type]

	if(handler){
		console.log(action)
		return handler(state, action)
	}else
		return state
}
