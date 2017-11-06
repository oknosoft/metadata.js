/**
 * ### Действия и типы действий адаптера pouchdb в терминах redux
 *
 * Created 05.09.2016
 */

export const IFACE_STATE = 'IFACE_STATE';         // Устанавливает состояние интерфейса

/**
 *
 * @param state {Object}
 * @param state.component {String} - раздел состояния, для которого будет установлено свойство (как правило, имя класса компонента)
 * @param state.name {String} - имя поля в состоянии раздела
 * @param state.value {String} - значение
 * @return {{type: string, payload: *}}
 */
export function iface_state(state) {
  return {
    type: IFACE_STATE,
    payload: state,
  };
}

export default {
  [IFACE_STATE]: iface_state,
};
