/*!
 metadata-superlogin v2.0.3-beta.32, built:2017-10-17
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var superlogin = _interopDefault(require('superlogin-client'));

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
      payload: {name: name, password: password, provider: 'local'}
    });
    if(adapter.$p.superlogin) {
      return adapter.$p.superlogin.login({
        username: name,
        password: password
      })
        .then((session) => adapter.log_in(session.token, session.password));
    }
    else {
      return adapter.log_in(name, password);
    }
  };
}
function log_out(adapter) {
  return function (dispatch, getState) {
    const disp_log_out = () => {
      dispatch({
        type: LOG_OUT,
        payload: {name: getState().meta.user.name}
      });
    };
    if(!adapter) {
      disp_log_out();
    }
    else if(adapter.$p.superlogin) {
      adapter.$p.superlogin.logOut()
        .then(disp_log_out);
    }
    else {
      adapter.log_out();
    }
  };
}
function log_error() {
  return {
    type: LOG_ERROR
  };
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

const SYNC_ERROR = 'POUCH_SYNC_ERROR';
const SYNC_DATA = 'POUCH_SYNC_DATA';
const SYNC_PAUSED = 'POUCH_SYNC_PAUSED';
const SYNC_RESUMED = 'POUCH_SYNC_RESUMED';

let sync_data_indicator;
function data_loaded(page) {
  return function (dispatch, getState) {
    dispatch({
      type: DATA_LOADED,
      payload: page
    });
    if(typeof page == 'object') {
      const {meta} = getState();
      if(!meta.user.logged_in && meta.user.has_login) {
        const {job_prm, wsql, adapters, aes} = $p;
        setTimeout(() => {
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
          if(name && password && wsql.get_user_param('enable_save_pwd')) {
            return dispatch(try_log_in(adapters.pouch, name, aes.Ctr.decrypt(password)));
          }
          if(name && job_prm.zone_demo == wsql.get_user_param('zone')) {
            dispatch(try_log_in(adapters.pouch, name, aes.Ctr.decrypt(job_prm.guests[0].password)));
          }
        });
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

var metaActions = {
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

var default_config = {
  baseUrl: 'http://localhost:3000/auth/',
  endpoints: ['api.example.com'],
  noDefaultEndpoint: false,
  storage: 'local',
  providers: ['google', 'yandex', 'github', 'facebook'],
  checkExpired: false,
  refreshThreshold: 0.5
};

function attach($p) {
  superlogin.on('login', function (event, session) {
  });
  superlogin.on('logout', function (event, message) {
  });
  superlogin.on('refresh', function (event, newSession) {
  });
  superlogin.on('link', function (event, provider) {
  });
  function handleSocialAuth(provider) {
    return function (dispatch, getState) {
      dispatch({
        type: metaActions.types.USER_TRY_LOG_IN,
        payload: {name: 'oauth', provider: provider}
      });
      return superlogin.socialAuth(provider)
        .then((session) => $p.adapters.pouch.log_in(session.token, session.password));
    };
  }
  function handleLogin(login, password) {
    return metaActions.USER_TRY_LOG_IN($p.adapters.pouch, login, password);
  }
  function handleLogOut() {
    return function (dispatch, getState) {
      $p.adapters.pouch.log_out()
        .then(() => superlogin.logout())
        .then(() => dispatch({
          type: metaActions.types.USER_LOG_OUT,
          payload: {name: getState().meta.user.name}
        }));
    };
  }
  function handleRegister(registration) {
    return function (dispatch, getState) {
      superlogin.register(registration)
        .then(function () {
          if(superlogin.authenticated()) {
            const session = superlogin.getSession();
            dispatch({
              type: metaActions.types.USER_LOG_IN,
              payload: {name: session.name, password: session.password, provider: 'local'}
            });
          }
          else {
          }
        });
    };
  }
  function handleForgotPassword() {
    return superlogin.forgotPassword(email)
      .then(function () {
        toasty('Check your email!');
      }, function (err) {
        if(err) {
          console.error(err);
        }
      });
  }
  function handleCheckUsername(name) {
  }
  function handlecheckEmail(email) {
  }
  function handleSetPrm(attr) {
    for (var key in attr) {
      $p.wsql.set_user_param(key, attr[key]);
    }
    return metaActions.PRM_CHANGE(attr);
  }
  Object.defineProperty($p, 'superlogin', {
    get: function () {
      return superlogin;
    }
  });
  superlogin._actions = {
    handleSocialAuth,
    handleLogin,
    handleLogOut,
    handleRegister,
    handleForgotPassword,
    handleCheckUsername,
    handlecheckEmail,
    handleSetPrm,
  };
  superlogin._init = function (store) {
    $p.adapters.pouch.on('superlogin_log_in', () => {
      const user_name = superlogin.getSession().user_id;
      if($p.cat && $p.cat.users) {
        $p.cat.users.find_rows_remote({
          _view: 'doc/number_doc',
          _key: {
            startkey: ['cat.users', 0, user_name],
            endkey: ['cat.users', 0, user_name]
          }
        }).then(function (res) {
          if(res.length) {
            return res[0];
          }
          else {
            let user = $p.cat.users.create({
              ref: $p.utils.generate_guid(),
              id: user_name
            });
            return user.save();
          }
        })
          .then(function () {
            store.dispatch(metaActions.USER_LOG_IN(user_name));
          });
      }
      else {
        store.dispatch(metaActions.USER_LOG_IN(user_name));
      }
    });
  };
}
function plugin(config = default_config) {
  superlogin.configure(config);
  return {
    constructor() {
      attach(this);
    }
  };
}

module.exports = plugin;
//# sourceMappingURL=index.js.map
