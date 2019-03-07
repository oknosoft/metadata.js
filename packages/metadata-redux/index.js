/*!
 metadata-redux v2.0.18-beta.4, built:2019-03-07
 © 2014-2019 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reactRedux = require('react-redux');
var reactRouterRedux = require('react-router-redux');
var reactRouter = require('react-router');

const TRY_LOG_IN = 'USER_TRY_LOG_IN';
const LOG_IN = 'USER_LOG_IN';
const DEFINED = 'USER_DEFINED';
const LOG_OUT = 'USER_LOG_OUT';
const LOG_ERROR = 'USER_LOG_ERROR';
const SOCIAL_TRY_LINK = 'USER_SOCIAL_TRY_LINK';
const SOCIAL_LINKED = 'USER_SOCIAL_LINKED';
const SOCIAL_UNLINKED = 'USER_SOCIAL_UNLINKED';
function defined(name) {
  return {
    type: DEFINED,
    payload: name
  };
}
function log_in(name) {
  return {
    type: LOG_IN,
    payload: name
  };
}
function try_log_in(adapter, name, password) {
  return function (dispatch) {
    dispatch({
      type: TRY_LOG_IN,
      payload: {name, password, provider: 'local'}
    });
    return adapter.log_in(name, password)
      .catch((err) => {
        typeof $p === 'object' && $p.record_log(err);
      });
  };
}
function log_out(adapter) {
  return function (dispatch, getState) {
    function disp_log_out() {
      dispatch({
        type: LOG_OUT,
        payload: {name: getState().meta.user.name}
      });
    }    if(!adapter) {
      disp_log_out();
    }
    else {
      adapter.log_out()
        .then(() => {
          const {superlogin} = $p;
          superlogin && superlogin.authenticated() && superlogin.logout();
        });
    }
  };
}
function log_error(err) {
  const msg = typeof $p === 'object' ? $p.msg.login : {};
  let text = msg.error;
  if(!err.message || err.message.match(/(time|network)/i)){
    text = msg.network;
  }
  else if(err.message.match('suffix')){
    text = msg.suffix;
  }
  else if(err.message.match('empty')){
    text = msg.empty;
  }
  else if(err.message.match('logout')){
    text = msg.need_logout;
  }
  else if(err.message.match('custom') && err.text){
    text = err.text;
  }
  return {
    type: LOG_ERROR,
    payload: text
  };
}
function reset_user(state, logged_out) {
  const user = Object.assign({}, state.user);
  user.logged_in = false;
  user.has_login = false;
  user.try_log_in = false;
  user.stop_log_in = false;
  user.log_error = '';
  if(logged_out) {
    user.logged_out = true;
  }
  return Object.assign({}, state, {user});
}

const ADD = 'OBJ_ADD';
const ADD_ROW = 'OBJ_ADD_ROW';
const DEL_ROW = 'OBJ_DEL_ROW';
const EDIT = 'OBJ_EDIT';
const REVERT = 'OBJ_REVERT';
const SAVE = 'OBJ_SAVE';
const CHANGE = 'OBJ_CHANGE';
const VALUE_CHANGE = 'OBJ_VALUE_CHANGE';
function add(_mgr) {
  const _obj = _mgr.create();
  return {
    type: ADD,
    payload: {class_name: _mgr.class_name, ref: _obj.ref}
  };
}
function add_row(class_name, ref, tabular, proto) {
  return {
    type: ADD_ROW,
    payload: {
      class_name: class_name,
      ref: ref,
      tabular: tabular,
      proto: proto
    }
  };
}
function del_row(class_name, ref, tabular, index) {
  return () => Promise.resolve();
}
function edit(class_name, ref, frm) {
  return {
    type: EDIT,
    payload: {
      class_name: class_name,
      ref: ref,
      frm: frm
    }
  };
}
function revert(class_name, ref) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(dispatch({
          type: REVERT,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}
function save(class_name, ref, post, mark_deleted) {
  return (dispatch, getState) => {
    let _obj;
    if(typeof class_name == 'object') {
      _obj = class_name;
      class_name = _obj._manager.class_name;
      ref = _obj.ref;
      if(mark_deleted) {
        _obj._obj._deleted = true;
      }
      _obj.save(post)
        .then(
          () => {
            dispatch({
              type: SAVE,
              payload: {
                class_name: class_name,
                ref: ref,
                post: post,
                mark_deleted: mark_deleted
              }
            });
          }
        );
    }
  };
}
function post(class_name, ref) {
  return save(class_name, ref, true);
}
function unpost(class_name, ref) {
  return save(class_name, ref, false);
}
function mark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, true);
}
function unmark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, false);
}
function change(class_name, ref) {
  return {
    type: CHANGE,
    payload: {
      class_name: class_name,
      ref: ref
    }
  };
}
function value_change(class_name, ref) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(dispatch({
          type: VALUE_CHANGE,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}

const DATA_PAGE = 'POUCH_DATA_PAGE';
const LOAD_START = 'POUCH_LOAD_START';
const DATA_LOADED = 'POUCH_DATA_LOADED';
const DATA_ERROR = 'POUCH_DATA_ERROR';
const NO_DATA = 'POUCH_NO_DATA';
const AUTOLOGIN = 'POUCH_AUTOLOGIN';
const SYNC_ERROR = 'POUCH_SYNC_ERROR';
const SYNC_DATA = 'POUCH_SYNC_DATA';
const SYNC_PAUSED = 'POUCH_SYNC_PAUSED';
const SYNC_RESUMED = 'POUCH_SYNC_RESUMED';
const SYNC_DENIED = 'POUCH_SYNC_DENIED';
let sync_data_indicator;
function data_loaded(page) {
  return function (dispatch, getState) {
    dispatch({
      type: DATA_LOADED,
      payload: page
    });
    if(typeof page === 'object' && typeof $p === 'object') {
      const {meta: {user}} = getState();
      if(user.has_login) {
        const {job_prm, wsql, adapters, superlogin, aes} = $p;
        let name = wsql.get_user_param('user_name');
        let password = wsql.get_user_param('user_pwd');
        if(!name &&
          job_prm.zone_demo == wsql.get_user_param('zone') &&
          job_prm.guests.length) {
          name = job_prm.guests[0].name;
        }
        if(name) {
          dispatch(defined(name));
        }
        if(!user.logged_in && !user.try_log_in && !user.stop_log_in) {
          if((superlogin && superlogin.authenticated()) || (name && password && wsql.get_user_param('enable_save_pwd'))) {
            return dispatch(try_log_in(adapters.pouch, name, aes.Ctr.decrypt(password)));
          }
          if(name && job_prm.zone_demo == wsql.get_user_param('zone')) {
            dispatch(try_log_in(adapters.pouch, name, aes.Ctr.decrypt(job_prm.guests[0].password)));
          }
        }
      }
    }
  };
}
function sync_data(dbid, change) {
  return function (dispatch, getState) {
    dispatch({
      type: SYNC_DATA,
      payload: {
        dbid: dbid,
        change: change
      }
    });
    if(sync_data_indicator) {
      clearTimeout(sync_data_indicator);
    }
    sync_data_indicator = setTimeout(function () {
      sync_data_indicator = 0;
      dispatch({
        type: SYNC_DATA,
        payload: false
      });
    }, 1200);
  };
}
function data_page(page) {
  return {
    type: DATA_PAGE,
    payload: page
  };
}
function load_start(page) {
  return {
    type: LOAD_START,
    payload: page
  };
}
function autologin() {
  return {
    type: AUTOLOGIN,
    payload: true
  };
}
function sync_error(dbid, err) {
  return {
    type: SYNC_ERROR,
    payload: {dbid, err}
  };
}
function sync_paused(dbid, info) {
  return {
    type: info ? SYNC_PAUSED : SYNC_RESUMED,
    payload: {dbid, info}
  };
}
function sync_resumed(dbid, info) {
  return {
    type: SYNC_RESUMED,
    payload: {dbid, info}
  };
}
function sync_denied(dbid, info) {
  return {
    type: SYNC_DENIED,
    payload: {dbid, info}
  };
}
function data_error(dbid, err) {
  return {
    type: DATA_ERROR,
    payload: {dbid, err}
  };
}
function no_data(dbid, err) {
  return {
    type: NO_DATA,
    payload: {dbid, err}
  };
}

const META_LOADED = 'META_LOADED';
const PRM_CHANGE = 'PRM_CHANGE';
const OFFLINE = 'OFFLINE';
const SECOND_INSTANCE = 'SECOND_INSTANCE';
function meta_loaded({version}) {
  return {
    type: META_LOADED,
    payload: version,
  };
}
function prm_change(name, value) {
  return {
    type: PRM_CHANGE,
    payload: {name, value},
  };
}
function offline(state) {
  return {
    type: OFFLINE,
    payload: state,
  };
}
function second_instance() {
  return {
    type: SECOND_INSTANCE,
    payload: true,
  };
}

var actions_meta = {
  types: {
    [TRY_LOG_IN]: TRY_LOG_IN,
    [LOG_IN]: LOG_IN,
    [DEFINED]: DEFINED,
    [LOG_OUT]: LOG_OUT,
    [LOG_ERROR]: LOG_ERROR,
    [SOCIAL_TRY_LINK]: SOCIAL_TRY_LINK,
    [SOCIAL_LINKED]: SOCIAL_LINKED,
    [SOCIAL_UNLINKED]: SOCIAL_UNLINKED,
    [DATA_LOADED]: DATA_LOADED,
    [DATA_PAGE]: DATA_PAGE,
    [DATA_ERROR]: DATA_ERROR,
    [LOAD_START]: LOAD_START,
    [NO_DATA]: NO_DATA,
    [SYNC_DATA]: SYNC_DATA,
    [SYNC_ERROR]: SYNC_ERROR,
    [SYNC_PAUSED]: SYNC_PAUSED,
    [SYNC_RESUMED]: SYNC_RESUMED,
  },
  [META_LOADED]: meta_loaded,
  [PRM_CHANGE]: prm_change,
  [TRY_LOG_IN]: try_log_in,
  [LOG_IN]: log_in,
  [DEFINED]: defined,
  [LOG_OUT]: log_out,
  [LOG_ERROR]: log_error,
  [DATA_LOADED]: data_loaded,
  [DATA_PAGE]: data_page,
  [DATA_ERROR]: data_error,
  [LOAD_START]: load_start,
  [NO_DATA]: no_data,
  [SYNC_DATA]: sync_data,
  [ADD]: add,
  [ADD_ROW]: add_row,
  [DEL_ROW]: del_row,
  [EDIT]: edit,
  [REVERT]: revert,
  [SAVE]: save,
  [CHANGE]: change,
  [VALUE_CHANGE]: value_change,
  obj_post: post,
  obj_unpost: unpost,
  obj_mark_deleted: mark_deleted,
  obj_unmark_deleted: unmark_deleted,
};

var handlers_meta = {
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

function metaInitialState() {
  let user_name = "",
    has_login = false,
    couch_direct = true,
    second_instance = false,
    fake = typeof $p !== 'object';
  if(!fake) {
    const {wsql, job_prm, superlogin} = $p;
    user_name = wsql.get_user_param('user_name');
    couch_direct = wsql.get_user_param('couch_direct', 'boolean');
    if(wsql.get_user_param('zone') == job_prm.zone_demo && !user_name && job_prm.guests.length) {
      wsql.set_user_param('enable_save_pwd', true);
      wsql.set_user_param('user_name', user_name = job_prm.guests[0].username);
      wsql.set_user_param('user_pwd', job_prm.guests[0].password);
      has_login = true;
    }
    else if(wsql.get_user_param('enable_save_pwd', 'boolean') && user_name && wsql.get_user_param('user_pwd')) {
      has_login = true;
    }
    else if(superlogin && user_name) {
      has_login = true;
    }
    else {
      has_login = false;
    }
    second_instance = second_instance || job_prm.second_instance;
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
    couch_direct,
    second_instance,
    fake,
    user: {
      name: user_name,
      has_login,
      try_log_in: false,
      logged_in: false,
      log_error: '',
    }
  };
}function metaReducer(state, action) {
  if(!state) {
    return metaInitialState();
  }
  else if(state.fake) {
    state = metaInitialState();
  }
  const handler = handlers_meta[action.type];
  return handler ? handler(state, action) : state;
}

let attached;
function metaMiddleware({adapters, md}) {
  return ({dispatch}) => {
    return next => action => {
      if(!attached) {
        attached = true;
        adapters.pouch.on({
          user_log_in: (name) => dispatch(log_in(name)),
          user_log_out: () => dispatch(log_out()),
          user_log_fault: (err) => dispatch(log_error(err)),
          user_log_stop: () => dispatch(log_in()),
          pouch_data_page: (page) => dispatch(data_page(page)),
          pouch_data_loaded: (page) => dispatch(data_loaded(page)),
          pouch_doc_ram_loaded: () => dispatch(data_loaded('doc_ram')),
          pouch_complete_loaded: () => dispatch(data_loaded('complete')),
          pouch_data_error: (dbid, err) => dispatch(data_error(dbid, err)),
          pouch_load_start: (page) => dispatch(load_start(page)),
          pouch_autologin: (page) => dispatch(autologin()),
          pouch_no_data: (dbid, err) => dispatch(no_data(dbid, err)),
          pouch_sync_data: (dbid, change) => dispatch(sync_data(dbid, change)),
          pouch_sync_error: (dbid, err) => dispatch(sync_error(dbid, err)),
          pouch_sync_paused: (dbid, info) => dispatch(sync_paused(dbid, info)),
          pouch_sync_resumed: (dbid, info) => dispatch(sync_resumed(dbid, info)),
          pouch_sync_denied: (dbid, info) => dispatch(sync_denied(dbid, info)),
        });
        md.on({
          obj_loaded: (_obj) => {
            dispatch(change(_obj._manager.class_name, _obj.ref));
          },
          second_instance: (_obj) => {
            dispatch(second_instance());
          },
          setting_changed: () => {
          },
        });
        if(typeof window != undefined && window.addEventListener){
          window.addEventListener('online', () => dispatch(offline(false)), false);
          window.addEventListener('offline', () => dispatch(offline(true)), false);
        }
      }
      return next(action);
    };
  };
}

const IFACE_STATE = 'IFACE_STATE';
function iface_state(state) {
  return {
    type: IFACE_STATE,
    payload: state,
  };
}
var actions_iface = {
  [IFACE_STATE]: iface_state,
};

var handlers_iface = {
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

let attached$1;
function ifaceMiddleware() {
  return (store) => {
    const {dispatch} = store;
    return next => action => {
      if(!attached$1) {
        attached$1 = true;
        if(!attached$1) {
          dispatch(iface_state(''));
        }
      }
      return next(action);
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleNavigate(path) {
      return dispatch(reactRouterRedux.push(path));
    },
  };
}

function disconnect(iface, area) {
  return () => {
  };
}
function mapStateToProps(Component, area) {
  if(!area) {
    area = Component.name;
  }
  return ({iface}) => Object.assign({disconnect: disconnect(iface, area)}, iface.common, iface[area]);
}
var withIface = (Component) => reactRedux.connect(mapStateToProps(Component), mapDispatchToProps)(Component);

function mapStateToProps$1({meta}) {
  return typeof $p === 'object' ?
    Object.assign({}, meta, {
      _obj: $p.current_user,
      _mgr: $p.cat.users,
      _acl: 'e',
    }) : meta;
}function mapDispatchToProps$1(dispatch) {
  return {
    handleLogin(login, password) {
      const {adapters, wsql, job_prm, aes, cat, superlogin} = $p;
      if(!login && !password) {
        if(wsql.get_user_param('user_name') && wsql.get_user_param('user_pwd')) {
          login = wsql.get_user_param('user_name');
          password = aes.Ctr.decrypt(wsql.get_user_param('user_pwd'));
        }
        else if(wsql.get_user_param('zone') == job_prm.zone_demo) {
          login = job_prm.guests[0].username;
          password = aes.Ctr.decrypt(job_prm.guests[0].password);
        }
        else if(superlogin) {
          if(superlogin.authenticated()){
            login = superlogin.getSession().user_id;
          }
          else {
            return dispatch(log_out(adapters.pouch));
          }
        }
        else {
          return dispatch(log_out(adapters.pouch));
        }
      }
      return dispatch(try_log_in(adapters.pouch, login, password));
    },
    handleLogOut() {
      return dispatch(log_out($p.adapters.pouch));
    }
  };
}var withMeta = reactRedux.connect(mapStateToProps$1, mapDispatchToProps$1);

const mapStateToProps$2 = ({iface}, {location}) => {
  return Object.assign({path_log_in: !!location.pathname.match(/\/(login|about)$/)}, iface.common);
};
var withNavigateAndMeta = (View) => {
  const withNavigate = reactRedux.connect(mapStateToProps$2, mapDispatchToProps)(reactRouter.withRouter(View));
  return withMeta(withNavigate);
};

var withIfaceAndMeta = (Component) => {
  return reactRedux.connect(
    (state) => Object.assign({}, mapStateToProps$1(state), mapStateToProps(Component)(state)),
    (dispatch) => Object.assign({}, mapDispatchToProps$1(dispatch), mapDispatchToProps(dispatch)))(Component);
};

const mapDispatchToProps$2 = (dispatch) => {
  const handlers = {
    handleNavigate(path) {
      return dispatch(reactRouterRedux.push(path));
    },
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleAdd(_mgr) {
      return dispatch(reactRouterRedux.push(`/${_mgr.class_name}/${$p.utils.generate_guid()}${_mgr.hasOwnProperty('_cachable') ? '?area=' + _mgr._cachable : ''}`));
    },
    handleAddRow() {
    },
    handleDelRow() {
    },
    handleEdit({ref, _mgr}) {
      return dispatch(reactRouterRedux.push(`/${_mgr.class_name}/${ref}`));
    },
    handlePost() {
    },
    handleUnPost() {
    },
    handleMarkDeleted({ref, _mgr}) {
      const {current_user} = $p;
      if(current_user && current_user.get_acl(_mgr.class_name).includes('d')) {
        return _mgr.get(ref, 'promise')
          .then((o) => {
            return !o._deleted && o.mark_deleted(true);
          })
      }
    },
    handleUnMarkDeleted() {
    },
    handleSave() {
    },
    handleRevert() {
    },
    handlePrint() {
    },
    handleAttachment() {
    }
  };
  return Object.assign({handlers}, handlers);
};
var withObj = reactRedux.connect(null, mapDispatchToProps$2);

const mapStateToProps$3 = () => {
  if(typeof $p !== 'object'){
    return;
  }
  const {wsql, superlogin} = $p;
  const res = {use_superlogin: !!superlogin};
  for (const name of [
    'zone',
    'couch_path',
    'superlogin_path',
    ['couch_direct', 'boolean'],
    ['enable_save_pwd', 'boolean'],
    ['ram_indexer', 'boolean'],
    'user_name',
    'user_pwd'
  ]) {
    if(Array.isArray(name)) {
      res[name[0]] = wsql.get_user_param(name[0], name[1]);
    }
    else {
      res[name] = wsql.get_user_param(name);
    }
  }
  return res;
};
const mapDispatchToProps$3 = (dispatch) => {
  return {
    handleSetPrm(name, value) {
      dispatch(prm_change(name, value));
    },
  };
};
var withPrm = reactRedux.connect(mapStateToProps$3, mapDispatchToProps$3);

exports.metaActions = actions_meta;
exports.metaReducer = metaReducer;
exports.metaMiddleware = metaMiddleware;
exports.ifaceActions = actions_iface;
exports.ifaceReducer = getIfaceReducer;
exports.ifaceMiddleware = ifaceMiddleware;
exports.withIface = withIface;
exports.withMeta = withMeta;
exports.withNavigateAndMeta = withNavigateAndMeta;
exports.withIfaceAndMeta = withIfaceAndMeta;
exports.withObj = withObj;
exports.withPrm = withPrm;
exports.dispatchIface = mapDispatchToProps;
//# sourceMappingURL=index.js.map
