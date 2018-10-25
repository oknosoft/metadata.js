/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 * Задача обработчиков - измеять state
 * Активные действия и работа с данными происходит в actions
 */

import {META_LOADED, PRM_CHANGE, OFFLINE, SECOND_INSTANCE} from './actions_base';
import {DATA_LOADED, DATA_PAGE, DATA_ERROR, LOAD_START, AUTOLOGIN, NO_DATA, SYNC_DATA, SYNC_ERROR, SYNC_PAUSED, SYNC_RESUMED} from './actions_pouch';
import {DEFINED, LOG_IN, TRY_LOG_IN, LOG_OUT, LOG_ERROR, reset_user} from './actions_auth';
import {ADD, CHANGE} from './actions_obj';

export default {

  [META_LOADED]: (state, action) => {
    return Object.assign({}, state, {meta_loaded: true});
  },

  [PRM_CHANGE]: (state, action) => {
    const {name, value} = action.payload;
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

  [OFFLINE]: (state, action) => Object.assign({}, state, {offline: action.payload}),

  [SECOND_INSTANCE]: (state, action) => Object.assign({}, state, {second_instance: true}),

  [DATA_LOADED]: (state, action) => {
    const payload = {data_loaded: true, fetch: false};
    if(action.payload == 'doc_ram') {
      payload.doc_ram_loaded = true;
    }
    else if(action.payload == 'complete') {
      payload.complete_loaded = true;
    }
    return Object.assign({}, state, payload);
  },

  [DATA_PAGE]: (state, action) => Object.assign({}, state, {page: action.payload}),

  [DATA_ERROR]: (state, action) => Object.assign({}, state, {err: action.payload, fetch: false}),

  [LOAD_START]: (state, action) => Object.assign({}, state, {data_empty: false, fetch: true}),

  [AUTOLOGIN]: (state, action) => Object.assign({}, state, {autologin: true}),

  [NO_DATA]: (state, action) => Object.assign({}, state, {data_empty: true, first_run: true, fetch: false}),

  [SYNC_DATA]: (state, action) => Object.assign({}, state, {fetch: !!action.payload}),

  [SYNC_PAUSED]: (state, action) => Object.assign({}, state, {sync_started: false}),

  [SYNC_RESUMED]: (state, action) => Object.assign({}, state, {sync_started: true}),

  [SYNC_ERROR]: (state, action) => {
    const {err} = action.payload;
    if(err && err.error == 'forbidden') {
      return reset_user(state);
    }
    else if(err && err.data_size) {
      return Object.assign({}, state, {sync_started: false, data_size: err.data_size});
    }
    return state;
  },

  [DEFINED]: (state, action) => {
    const user = Object.assign({}, state.user);
    user.name = action.payload;
    return Object.assign({}, state, {user});
  },

  [LOG_IN]: (state, action) => {
    const user = Object.assign({}, state.user, {
      logged_in: action.payload ? true : false,
      stop_log_in: action.payload ? false : true,
      try_log_in: false,
      log_error: ''
    });
    return Object.assign({}, state, {user});
  },

  [TRY_LOG_IN]: (state, action) => {
    const user = Object.assign({}, state.user, {
      try_log_in: true,
      stop_log_in: false,
      log_error: ''
    });
    return Object.assign({}, state, {user});
  },

  [LOG_OUT]: (state, action) => {
    return reset_user(state, true);
  },

  [LOG_ERROR]: (state, action) => {
    const reseted = reset_user(state);
    reseted.user.log_error = action.payload;
    return reseted;
  },

  [ADD]: (state, action) => state,

  [CHANGE]: (state, action) => Object.assign({}, state, {obj_change: action.payload}),

};
