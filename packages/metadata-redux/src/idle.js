/**
 *
 *
 * @module idle
 *
 * Created by Evgeniy Malyarov on 22.06.2019.
 */

import {offline, idle} from './actions_base';
const timeout = 10 * 60 * 1000;

export default class Idle {
  constructor(dispatch) {
    let start = Date.now();
    let activity = start;

    function event() {
      activity = Date.now();
    }

    function watchdog() {
      if(Date.now() - activity > timeout) {
        dispatch(idle(true));
      }
      setTimeout(watchdog, timeout);
    }

    // события window online-offline
    if(typeof window != undefined && window.addEventListener){
      window.addEventListener('online', () => dispatch(offline(false)), false);
      window.addEventListener('offline', () => dispatch(offline(true)), false);
      document.addEventListener('mousemove', event, false);
      document.addEventListener('keydown', event, false);
      watchdog();
    }

    // TODO: здесь можно подписаться на rotate и т.д.

  }



}
