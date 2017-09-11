/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */

import handlers_iface from './handlers_iface';


/**
 * IFACE
 */

const defaultState = {
  'common': {
    title: 'Заказ дилера',
  },
  CalcOrderList: {
    state_filter: '',
  },
  NavDrawer: {
    open: false,
  },
  NavList: {
    orders: true,
  },
  LogDrawer: {
    open: false,
  },
};

function getIfaceReducer(initialState) {

  return function ifaceReducer(state, action) {
    if(!state) {
      return typeof initialState == 'function' ? initialState() : initialState || defaultState;
    }
    let handler = handlers_iface[action.type];
    return handler ? handler(state, action) : state;
  };
}

// возаоащаем не сам редюсер, а обёртку для установки начального состояния
export default getIfaceReducer;
