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
	const _obj = _mgr.create()
	return {
		type: OBJ_ADD,
		payload: {class_name: _mgr.class_name, ref: _obj.ref}
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
		let _obj
		if(typeof class_name == 'object'){
			_obj = class_name;
			class_name = _obj._manager.class_name
			ref = _obj.ref;

			if (mark_deleted) {
				_obj._obj._deleted = true;
			}

			_obj.save(post)
				.then(
					() => {
						dispatch({
							type: OBJ_SAVE,
							payload: {
								class_name: class_name,
								ref: ref,
								post: post,
								mark_deleted: mark_deleted
							}
						})
					}
				)
		}
	}
}

function obj_post(class_name, ref) {
	return obj_save(class_name, ref, true)
}

function obj_unpost(class_name, ref) {
	return obj_save(class_name, ref, false)
}

function obj_mark_deleted(class_name, ref) {
	return obj_save(class_name, ref, undefined, true)
}

function obj_unmark_deleted(class_name, ref) {
	return obj_save(class_name, ref, undefined, false)
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

