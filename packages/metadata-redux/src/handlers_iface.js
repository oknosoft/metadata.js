/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 * Задача обработчиков - измеять state
 * Активные действия и работа с данными происходит в actions
 */

import {IFACE_STATE} from './actions_iface';

export default {
  [IFACE_STATE]: (state, action) => {
    const {component, name, value} = action.payload;
    const area = component || 'common';
    const previous = Object.assign({}, state[area]);
    if(value == 'invert') {
      previous[name] = !previous[name];
    }
    else {
      previous[name] = value;
    }
    return Object.assign({}, state, {[area]: previous});
  },
};
