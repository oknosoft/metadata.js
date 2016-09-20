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

const OBJ_ADD           = 'OBJ_ADD'             // Команда создать объекта
const OBJ_ADD_ROW       = 'OBJ_ADD_ROW'         // Команда добавить строку в табчасть объекта
const OBJ_DEL_ROW       = 'OBJ_DEL_ROW'         // Команда удалить строку табчасти объекта
const OBJ_EDIT          = 'OBJ_EDIT'            // Команда открыть форму редактирования объекта
const OBJ_REVERT        = 'OBJ_REVERT'          // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
const OBJ_SAVE          = 'OBJ_SAVE'            // Команда записать изменённый объект (пометка удаления, проведение и отмена проведения - это так же, запись)
const OBJ_CHANGE        = 'OBJ_CHANGE'          // Записан изменённый объект (по команде интерфейса или в результате репликации)
const OBJ_VALUE_CHANGE  = 'OBJ_VALUE_CHANGE'    // Изменён реквизит шапки или строки табчасти


// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------


function obj_add(class_name) {
	return {
		type: OBJ_ADD,
		payload: {class_name: class_name}
	}
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
	}
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
	return () => Promise.resolve()
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
	}
}

function obj_revert(class_name, ref) {
	return (dispatch, getState) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				dispatch(dispatch({
					type: OBJ_REVERT,
					payload: {
						class_name: class_name,
						ref: ref
					}
				}))
				resolve()
			}, 200)
		})
	}
}

function obj_save(class_name, ref, post, mark_deleted) {
	return (dispatch, getState) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				dispatch(dispatch({
					type: OBJ_SAVE,
					payload: {
						class_name: class_name,
						ref: ref,
						post: post,
						mark_deleted: mark_deleted
					}
				}))
				resolve()
			}, 200)
		})
	}
}

function obj_change(class_name, ref) {
	return {
		type: OBJ_CHANGE,
		payload: {
			class_name: class_name,
			ref: ref
		}
	}
}

function obj_value_change(class_name, ref) {
	return (dispatch, getState) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				dispatch(dispatch({
					type: OBJ_VALUE_CHANGE,
					payload: {
						class_name: class_name,
						ref: ref
					}
				}))
				resolve()
			}, 200)
		})
	}
}



