/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 * Задача обработчиков - измеять state
 * Активные действия и работа с данными происходит в actions
 */

import {META_LOADED, PRM_CHANGE, OFFLINE, IDLE, SECOND_INSTANCE} from './actions_base';
import {DATA_LOADED, DATA_PAGE, DATA_ERROR, LOAD_START, AUTOLOGIN, NO_DATA, SYNC_DATA, SYNC_ERROR, SYNC_PAUSED, SYNC_RESUMED} from './actions_pouch';
import {DEFINED, LOG_IN, TRY_LOG_IN, LOG_OUT, LOG_ERROR, reset_user} from './actions_auth';
import {ADD, CHANGE} from './actions_obj';

export default {

  [META_LOADED]: (state) => {
    return Object.assign({}, state, {meta_loaded: true});
  },

  [PRM_CHANGE]: (state, {payload}) => {
    const {name, value} = payload;
    if(typeof $p !== 'object') {
      return;
    }
    const {wsql} = $p;
    if(Array.isArray(name)) {
      for (const {prm, value} of name) {
        wsql.set_user_param(prm, value);
      }
    }
    else if(typeof name == 'object') {
      for (const prm in name) {
        wsql.set_user_param(prm, name[prm]);
      }
    }
    else if(wsql.get_user_param(name) == value) {
      return state;
    }
    wsql.set_user_param(name, value);
    return Object.assign({}, state);
  },

  [OFFLINE]: (state, {payload}) => Object.assign({}, state, {offline: payload}),

  [IDLE]: (state, {payload}) => Object.assign({}, state, {idle: payload}),

  [SECOND_INSTANCE]: (state, action) => Object.assign({}, state, {second_instance: true}),

  [DATA_LOADED]: (state, {payload: name}) => {
    const payload = {data_loaded: true, fetch: false};
    if(name == 'doc_ram') {
      payload.doc_ram_loaded = true;
    }
    else if(name == 'complete') {
      payload.complete_loaded = true;
    }
    return Object.assign({}, state, payload);
  },

  [DATA_PAGE]: (state, {payload}) => Object.assign({}, state, {page: payload}),

  [DATA_ERROR]: (state, {payload}) => Object.assign({}, state, {err: payload, fetch: false}),

  [LOAD_START]: (state) => Object.assign({}, state, {data_empty: false, fetch: true}),

  [AUTOLOGIN]: (state) => Object.assign({}, state, {autologin: true}),

  [NO_DATA]: (state, {payload}) => Object.assign({}, state, {data_empty: true, first_run: payload.dbid !== 'no_ram', fetch: false}),

  [SYNC_DATA]: (state, {payload}) => Object.assign({}, state, {fetch: !!payload}),

  [SYNC_PAUSED]: (state) => Object.assign({}, state, {sync_started: false}),

  [SYNC_RESUMED]: (state) => Object.assign({}, state, {sync_started: true}),

  [SYNC_ERROR]: (state, {payload}) => {
    const {err} = payload;
    if(err && err.error == 'forbidden') {
      return reset_user(state);
    }
    else if(err && err.data_size) {
      return Object.assign({}, state, {sync_started: false, data_size: err.data_size});
    }
    return state;
  },

  [DEFINED]: (state, {payload}) => {
    const user = Object.assign({}, state.user);
    user.name = payload;
    return Object.assign({}, state, {user});
  },

  [LOG_IN]: (state, {payload}) => {
    const user = Object.assign({}, state.user, {
      logged_in: payload ? true : false,
      stop_log_in: payload ? false : true,
      try_log_in: false,
      log_error: ''
    });
    return Object.assign({}, state, {user, idle: false});
  },

  [TRY_LOG_IN]: (state) => {
    const user = Object.assign({}, state.user, {
      try_log_in: true,
      stop_log_in: false,
      log_error: ''
    });
    return Object.assign({}, state, {user});
  },

  [LOG_OUT]: (state) => {
    return reset_user(state, true);
  },

  [LOG_ERROR]: (state, {payload}) => {
    const reseted = reset_user(state);
    reseted.user.log_error = payload;
    return reseted;
  },

  [ADD]: (state, action) => state,

  [CHANGE]: (state, {payload}) => Object.assign({}, state, {obj_change: payload}),

};
