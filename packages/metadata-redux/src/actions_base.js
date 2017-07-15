// Action types - имена типов действий

export const META_LOADED = 'META_LOADED';         // Инициализирует параметры и создаёт менеджеры объектов данных
export const PRM_CHANGE = 'PRM_CHANGE';          // Изменены глобальные параметры (couch_path, zone и т.д.)

// Actions - функции - генераторы действий. Они передаются в диспетчер redux

export function meta_loaded($p) {

	return {
		type: META_LOADED,
		payload: $p,
	};
}

export function prm_change(prms) {

	return {
		type: PRM_CHANGE,
		payload: prms,
	};
}