/**
 *
 *
 * @module idle
 *
 * Created by Evgeniy Malyarov on 22.06.2019.
 */

import {offline, idle} from './actions_base';
import {log_out} from './actions_auth';

export default class Idle {
  constructor(dispatch, timeout) {
    if(!timeout) {
      timeout = 12 * 60 * 1000;
    }
    this.start = Date.now();
    this.activity = this.start;

    const event = () => {
      this.activity = Date.now();
    }

    const watchdog = () => {
      if(Date.now() - this.activity > timeout) {
        event();
        dispatch(idle(true));
      }
    }

    // события window online-offline
    if(typeof window != undefined && window.addEventListener){
      window.addEventListener('online', () => dispatch(offline(false)), false);
      window.addEventListener('offline', () => dispatch(offline(true)), false);
      document.addEventListener('mousemove', event, false);
      document.addEventListener('keydown', event, false);
      setInterval(watchdog, 30000);
    }

    // TODO: здесь можно подписаться на rotate и т.д.

  }

  get idle() {
    return Date.now() - this.activity;
  }


}
