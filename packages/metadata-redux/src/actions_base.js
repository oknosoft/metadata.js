// Action types - имена типов действий

export const META_LOADED = 'META_LOADED'; // Инициализирует параметры и создаёт менеджеры объектов данных
export const PRM_CHANGE = 'PRM_CHANGE';   // Изменено значение настроек программы (couch_path, zone и т.д.)
export const OFFLINE = 'OFFLINE';         // Изменено значение настроек программы (couch_path, zone и т.д.)
export const SECOND_INSTANCE = 'SECOND_INSTANCE'; // Открыт второй экземпляр программы в другом окне или закладке

// Actions - функции - генераторы действий. Они передаются в диспетчер redux

export function meta_loaded({version}) {
  return {
    type: META_LOADED,
    payload: version,
  };
}

export function prm_change(name, value) {
  return {
    type: PRM_CHANGE,
    payload: {name, value},
  };
}

export function offline(state) {
  return {
    type: OFFLINE,
    payload: state,
  };
}

export function second_instance() {
  return {
    type: SECOND_INSTANCE,
    payload: true,
  };
}
