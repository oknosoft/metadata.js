/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */

import handlers_meta from './handlers_meta';


/**
 * META
 */

function metaInitialState() {
  const {wsql, job_prm} = $p;
  let user_name = wsql.get_user_param('user_name');
  let has_login;
  if(wsql.get_user_param('zone') == job_prm.zone_demo && !user_name && job_prm.guests.length) {
    wsql.set_user_param('enable_save_pwd', true);
    wsql.set_user_param('user_name', user_name = job_prm.guests[0].username);
    wsql.set_user_param('user_pwd', job_prm.guests[0].password);
    has_login = true;
  }
  else if(wsql.get_user_param('enable_save_pwd', 'boolean') && user_name && wsql.get_user_param('user_pwd')) {
    has_login = true;
  }
  else {
    has_login = false;
  }

  return {
    meta_loaded: false,
    data_loaded: false,
    doc_ram_loaded: false,
    complete_loaded: false,
    first_run: false,
    data_empty: undefined,
    sync_started: false,
    fetch: false,
    offline: typeof navigator != 'undefined' && !navigator.onLine,
    path_log_in: false,
    couch_direct: true,
    user: {
      name: user_name,
      has_login: has_login,
      try_log_in: false,
      logged_in: false,
      log_error: false,
    }
  };
};

function metaReducer(state, action) {
  if(!state) {
    return metaInitialState();
  }
  let handler = handlers_meta[action.type];
  return handler ? handler(state, action) : state;
};

export default metaReducer;
