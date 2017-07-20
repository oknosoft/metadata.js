/*!
 metadata-redux v2.0.1-beta.19, built:2017-07-20
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const TRY_LOG_IN   = 'USER_TRY_LOG_IN';
const LOG_IN       = 'USER_LOG_IN';
const DEFINED      = 'USER_DEFINED';
const LOG_OUT      = 'USER_LOG_OUT';
const LOG_ERROR    = 'USER_LOG_ERROR';



function defined(name) {
	return {
		type: DEFINED,
		payload: name
	}
}
function log_in(name) {
	return {
		type: LOG_IN,
		payload: name
	}
}
function try_log_in(adapter, name, password) {
	return function (dispatch) {
		dispatch({
			type: TRY_LOG_IN,
			payload: {name: name, password: password, provider: 'local'}
		});
		if(adapter.$p.superlogin){
			return adapter.$p.superlogin.login({
				username: name,
				password: password
			})
				.then((session) => adapter.log_in(session.token, session.password));
		}
		else{
			return adapter.log_in(name, password);
		}
	}
}
function log_out(adapter) {
	return function (dispatch, getState) {
		const disp_log_out = () => {
			dispatch({
				type: LOG_OUT,
				payload: {name: getState().meta.user.name}
			});
		};
		if(!adapter){
			disp_log_out();
		}else if(adapter.$p.superlogin){
			adapter.$p.superlogin.logOut()
				.then(disp_log_out);
		}else{
			adapter.log_out();
		}
	}
}
function log_error() {
	return {
		type: LOG_ERROR
	}
}

const ADD           = 'OBJ_ADD';
const ADD_ROW       = 'OBJ_ADD_ROW';
const DEL_ROW       = 'OBJ_DEL_ROW';
const EDIT          = 'OBJ_EDIT';
const REVERT        = 'OBJ_REVERT';
const SAVE          = 'OBJ_SAVE';
const CHANGE        = 'OBJ_CHANGE';
const VALUE_CHANGE  = 'OBJ_VALUE_CHANGE';
function add(_mgr) {
	const _obj = _mgr.create();
	return {
		type: ADD,
		payload: {class_name: _mgr.class_name, ref: _obj.ref}
	}
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
	}
}
function del_row(class_name, ref, tabular, index) {
	return () => Promise.resolve()
}
function edit(class_name, ref, frm) {
	return {
		type: EDIT,
		payload: {
			class_name: class_name,
			ref: ref,
			frm: frm
		}
	}
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
		})
	}
}
function save(class_name, ref, post, mark_deleted) {
	return (dispatch, getState) => {
		let _obj;
		if(typeof class_name == 'object'){
			_obj = class_name;
			class_name = _obj._manager.class_name;
			ref = _obj.ref;
			if (mark_deleted) {
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
	}
}
function post(class_name, ref) {
	return save(class_name, ref, true)
}
function unpost(class_name, ref) {
	return save(class_name, ref, false)
}
function mark_deleted(class_name, ref) {
	return save(class_name, ref, undefined, true)
}
function unmark_deleted(class_name, ref) {
	return save(class_name, ref, undefined, false)
}
function change(class_name, ref) {
	return {
		type: CHANGE,
		payload: {
			class_name: class_name,
			ref: ref
		}
	}
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
		})
	}
}

const DATA_PAGE   = 'POUCH_DATA_PAGE';
const LOAD_START  = 'POUCH_LOAD_START';
const DATA_LOADED = 'POUCH_DATA_LOADED';
const DATA_ERROR  = 'POUCH_DATA_ERROR';
const NO_DATA     = 'POUCH_NO_DATA';
const SYNC_START  = 'POUCH_SYNC_START';
const SYNC_ERROR  = 'POUCH_SYNC_ERROR';
const SYNC_DATA   = 'POUCH_SYNC_DATA';
const SYNC_PAUSED = 'POUCH_SYNC_PAUSED';
const SYNC_RESUMED= 'POUCH_SYNC_RESUMED';
const SYNC_DENIED = 'POUCH_SYNC_DENIED';
let sync_data_indicator;
function data_loaded(page) {
	return function (dispatch, getState) {
		dispatch({
			type: DATA_LOADED,
			payload: page
		});
		const { meta } = getState(),
			{ $p } = meta;
		if(!meta.user.logged_in){
			setTimeout(function () {
				let name = $p.wsql.get_user_param('user_name');
				let password = $p.wsql.get_user_param('user_pwd');
				if(!name &&
					$p.job_prm.zone_demo == $p.wsql.get_user_param('zone') &&
					$p.job_prm.guests.length){
					name = $p.job_prm.guests[0].name;
				}
				if(name)
					dispatch(defined(name));
				if(name && password && $p.wsql.get_user_param('enable_save_pwd')){
					dispatch(try_log_in($p.adapters.pouch, name, $p.aes.Ctr.decrypt(password)));
					return;
				}
				if(name && $p.job_prm.zone_demo == $p.wsql.get_user_param('zone')){
					dispatch(try_log_in($p.adapters.pouch, name,
						$p.aes.Ctr.decrypt($p.job_prm.guests[0].password)));
				}
			}, 10);
		}
	}
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
		if(sync_data_indicator){
			clearTimeout(sync_data_indicator);
		}
		sync_data_indicator = setTimeout(function () {
			sync_data_indicator = 0;
			dispatch({
				type: SYNC_DATA,
				payload: false
			});
		}, 1200);
	}
}
function data_page(page) {
	return {
		type: DATA_PAGE,
		payload: page
	}
}
function load_start(page) {
	return {
		type: LOAD_START,
		payload: page
	}
}
function sync_start() {
	return { type: SYNC_START }
}
function sync_error(dbid, err) {
	return {
		type: SYNC_ERROR,
		payload: { dbid, err }
	}
}
function sync_paused(dbid, info) {
	return {
		type: SYNC_PAUSED,
		payload: { dbid, info }
	}
}
function sync_resumed(dbid, info) {
	return {
		type: SYNC_RESUMED,
		payload: { dbid, info }
	}
}
function sync_denied(dbid, info) {
	return {
		type: SYNC_DENIED,
		payload: { dbid, info }
	}
}
function data_error(dbid, err) {
	return {
		type: DATA_ERROR,
		payload: { dbid, err }
	}
}
function no_data(dbid, err) {
	return {
		type: NO_DATA,
		payload: { dbid, err }
	}
}

const META_LOADED = 'META_LOADED';
const PRM_CHANGE = 'PRM_CHANGE';
function meta_loaded($p) {
	return {
		type: META_LOADED,
		payload: $p,
	};
}
function prm_change(prms) {
	return {
		type: PRM_CHANGE,
		payload: prms,
	};
}

var actions = {
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

var handlers = {
  [META_LOADED]: (state, action) => {
    const {wsql, job_prm} = action.payload;
    const {user} = state;
    let has_login;
    if (wsql.get_user_param('zone') == job_prm.zone_demo && !wsql.get_user_param('user_name') && job_prm.guests.length) {
      wsql.set_user_param('enable_save_pwd', true);
      wsql.set_user_param('user_name', job_prm.guests[0].username);
      wsql.set_user_param('user_pwd', job_prm.guests[0].password);
      has_login = true;
    }
    else if (wsql.get_user_param('enable_save_pwd') && wsql.get_user_param('user_name') && wsql.get_user_param('user_pwd')) {
      has_login = true;
    }
    else {
      has_login = false;
    }
    return Object.assign({}, state, {
      couch_direct: wsql.get_user_param('couch_direct', 'boolean'),
      meta_loaded: true,
      user: Object.assign({}, user, {has_login}),
    });
  },
  [PRM_CHANGE]: (state, action) => state,
  [DATA_LOADED]: (state, action) => Object.assign({}, state, {data_loaded: true, fetch: false}),
  [DATA_PAGE]: (state, action) => Object.assign({}, state, {page: action.payload}),
  [DATA_ERROR]: (state, action) => Object.assign({}, state, {err: action.payload, fetch: false}),
  [LOAD_START]: (state, action) => Object.assign({}, state, {sync_started: true, data_empty: false, fetch: true}),
  [NO_DATA]: (state, action) => Object.assign({}, state, {data_empty: true, fetch: false}),
  [SYNC_START]: (state, action) => Object.assign({}, state, {sync_started: true}),
  [SYNC_DATA]: (state, action) => Object.assign({}, state, {fetch: !!action.payload}),
  [DEFINED]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload,
      logged_in: state.user.logged_in,
    },
  }),
  [LOG_IN]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload,
      logged_in: true,
      try_log_in: false,
    },
  }),
  [TRY_LOG_IN]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload.name,
      try_log_in: true,
      logged_in: state.user.logged_in,
    },
  }),
  [LOG_OUT]: (state, action) => Object.assign({}, state, {
    user: {
      name: state.user.name,
      logged_in: false,
      has_login: false,
      try_log_in: false,
    },
    sync_started: false,
  }),
  [LOG_ERROR]: (state, action) => Object.assign({}, state, {
    user: {
      name: state.user.name,
      logged_in: false,
      has_login: false,
      try_log_in: false,
    },
    sync_started: false,
  }),
  [ADD]: (state, action) => state,
  [CHANGE]: (state, action) => Object.assign({}, state, {obj_change: action.payload}),
};

const initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: undefined,
	sync_started: false,
	fetch: false,
	offline: false,
	path_log_in: false,
	couch_direct: true,
	user: {
		name: "",
		has_login: false,
		try_log_in: false,
		logged_in: false,
		log_error: false,
	}
};
function metaReducer (state = initialState, action) {
	let handler = handlers[action.type];
	return handler ? handler(state, action) : state
}

let attached;
function metaMiddleware({adapters, md}) {
	return (store) => {
		const {dispatch} = store;
		return next => action => {
			if(!attached){
				attached = true;
				adapters.pouch.on({
					user_log_in: (name) => {dispatch(log_in(name));},
					user_log_out: () => {dispatch(log_out());},
					pouch_data_page: (page) => {dispatch(data_page(page));},
					pouch_data_loaded: (page) => {dispatch(data_loaded(page));},
					pouch_data_error: (dbid, err) => {dispatch(data_error(dbid, err));},
					pouch_load_start: (page) => {dispatch(load_start(page));},
					pouch_no_data: (dbid, err) => {dispatch(no_data(dbid, err));},
					pouch_sync_start: () => {dispatch(sync_start());},
					pouch_sync_data: (dbid, change$$1) => {dispatch(sync_data(dbid, change$$1));},
					pouch_sync_error: (dbid, err) => {dispatch(sync_error(dbid, err));},
					pouch_sync_paused: (dbid, info) => {dispatch(sync_paused(dbid, info));},
					pouch_sync_resumed: (dbid, info) => {dispatch(sync_resumed(dbid, info));},
					pouch_sync_denied: (dbid, info) => {dispatch(sync_denied(dbid, info));},
				});
				md.on({
					obj_loaded: (_obj) => {dispatch(change(_obj._manager.class_name, _obj.ref));}
				});
			}
			return next(action);
		}
	}
}

exports.metaActions = actions;
exports.metaReducer = metaReducer;
exports.metaMiddleware = metaMiddleware;
