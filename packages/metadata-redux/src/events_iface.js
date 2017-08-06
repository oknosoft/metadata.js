import {iface_state} from './actions_iface';

let attached;

/**
 * Подключает диспетчеризацию событий redux к интерфейсу приложения
 */
export default function ifaceMiddleware() {
  return (store) => {
    const {dispatch} = store;
    return next => action => {
      if(!attached) {
        attached = true;

        // TODO: здесь можно подписаться на online-offline, rotate и т.д.
        if(!attached) {
          dispatch(iface_state(''));
        }
      }
      return next(action);
    };
  };
}

