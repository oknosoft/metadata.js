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

export const LOAD_META          = 'LOAD_META'           // Инициализирует параметры и создаёт менеджеры объектов данных
export const LOAD_RAM           = 'LOAD_RAM'            // Начало загрузки снапшота из Pouch.local.ram
export const LOAD_RAM_COMPLETE  = 'LOAD_RAM_COMPLETE'   // Начало загрузки снапшота из Pouch.local.ram

export const OBJ_ADD            = 'OBJ_ADD'             // Команда создать объекта
export const OBJ_ADD_ROW        = 'OBJ_ADD_ROW'         // Команда добавить строку в табчасть объекта
export const OBJ_DEL_ROW        = 'OBJ_DEL_ROW'         // Команда удалить строку табчасти объекта
export const OBJ_EDIT           = 'OBJ_EDIT'            // Команда открыть форму редактирования объекта
export const OBJ_DELETE         = 'OBJ_DELETE'          // Команда пометить объект на удаление
export const OBJ_REVERT         = 'OBJ_REVERT'          // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
export const OBJ_SAVE           = 'OBJ_SAVE'            // Команда записать изменённый объект
export const OBJ_CHANGED        = 'OBJ_CHANGED'         // Записан изменённый объект (по команде интерфейса или в результате репликации)


// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------

export function load_meta(settings, meta) {

	console.log(settings, meta)

	return {
		type: LOAD_META,
		payload: {
			settings: settings,
			meta
		}
	}
}

export function load_ram() {
	return { type: LOAD_RAM }
}

export function load_ram_complete() {
	return { type: LOAD_RAM_COMPLETE }
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
	[LOAD_META]: (state, action) => Object.assign({}, state, {load_meta: true}),
	[LOAD_RAM]: (state, action) => Object.assign({}, state, {load_ram: true})
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function metaReducer (state, action) {

	if(!state){

		const data = new MetaEngine();
		Object.defineProperty(data, 'actions', {
			value: {
				[LOAD_META]: load_meta
			}
		})

		state = {
			load_meta: false,
			load_ram: false,
			user: {
				defined: false,
				logged_in: false
			},
			data: data
		}
	}

	const handler = ACTION_HANDLERS[action.type]
	return handler ? handler(state, action) : state
}
