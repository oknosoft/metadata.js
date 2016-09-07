/**
 * ### Действия и типы действий в терминах redux
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module actions.js
 *
 * Created 05.09.2016
 */


/*
 * типы действий
 */

export const LOAD_META          = 'LOAD_META'           // Создаёт менеджеры объектов данных
export const LOAD_RAM           = 'LOAD_RAM'            // Начало загрузки снапшота из Pouch.local.ram
export const LOAD_RAM_COMPLITE  = 'LOAD_RAM_COMPLITE'   // Начало загрузки снапшота из Pouch.local.ram

export const OBJ_ADD            = 'OBJ_ADD'             // Команда создать объекта
export const OBJ_ADD_ROW        = 'OBJ_ADD_ROW'         // Команда добавить строку в табчасть объекта
export const OBJ_DEL_ROW        = 'OBJ_DEL_ROW'         // Команда удалить строку табчасти объекта
export const OBJ_EDIT           = 'OBJ_EDIT'            // Команда открыть форму редактирования объекта
export const OBJ_DELETE         = 'OBJ_DELETE'          // Команда пометить объект на удаление
export const OBJ_REVERT         = 'OBJ_REVERT'          // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
export const OBJ_SAVE           = 'OBJ_SAVE'            // Команда записать изменённый объект
export const OBJ_CHANGED        = 'OBJ_CHANGED'         // Записан изменённый объект (по команде интерфейса или в результате репликации)


/*
 * генераторы действий
 */

export function load_meta() {
	return { type: LOAD_META }
}

export function load_ram() {
	return { type: LOAD_RAM }
}

export function load_ram_complite() {
	return { type: LOAD_RAM_COMPLITE }
}

export function obj_add(class_name) {
	return { type: OBJ_ADD, class_name: class_name }
}

export function obj_add_row(class_name, ref, tabular) {
	return {
		type: OBJ_ADD_ROW,
		class_name: class_name,
		ref: ref,
		tabular: tabular
	}
}

export function obj_edit(class_name, ref, frm) {
	return {
		type: OBJ_EDIT,
		class_name: class_name,
		ref: ref,
		frm: frm
	}
}

