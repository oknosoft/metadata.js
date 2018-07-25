/**
 * ### Действия и типы действий адаптера pouchdb в терминах redux
 *
 * Created 05.09.2016
 */

import {defined, try_log_in} from './actions_auth';

export const DATA_PAGE = 'POUCH_DATA_PAGE';     // Оповещение о загрузке порции локальных данных
export const LOAD_START = 'POUCH_LOAD_START';   // Оповещение о начале загрузки локальных данных
export const DATA_LOADED = 'POUCH_DATA_LOADED'; // Оповещение об окончании загрузки локальных данных
export const DATA_ERROR = 'POUCH_DATA_ERROR';   // Оповещение об ошибке при загрузке локальных данных
export const NO_DATA = 'POUCH_NO_DATA';         // Оповещение об отсутствии локальных данных (как правило, при первом запуске)
export const AUTOLOGIN = 'POUCH_AUTOLOGIN';     // Оповещение о создании баз autologin

export const SYNC_START = 'POUCH_SYNC_START';    // Оповещение о начале синхронизации базы doc
export const SYNC_ERROR = 'POUCH_SYNC_ERROR';    // Оповещение об ошибке репликации - не означает окончания репликации - просто информирует об ошибке
export const SYNC_DATA = 'POUCH_SYNC_DATA';     // Прибежали изменения с сервера или мы отправили данные на сервер
export const SYNC_PAUSED = 'POUCH_SYNC_PAUSED';   // Репликация приостановлена, обычно, из-за потери связи с сервером
export const SYNC_RESUMED = 'POUCH_SYNC_RESUMED';  // Репликация возобновлена
export const SYNC_DENIED = 'POUCH_SYNC_DENIED';   // Разновидность ошибки репликации из-за недостатка прав для записи документа на сервере

let sync_data_indicator;

/**
 * ### После загрузки локальных данных
 * если разрешено сохранение пароля или демо-режим, выполняем попытку авторизации
 * @param page
 * @return {{type: string, payload: *}}
 */
export function data_loaded(page) {

  return function (dispatch, getState) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch({
      type: DATA_LOADED,
      payload: page
    });

    if(typeof page === 'object' && typeof $p === 'object') {
      const {meta: {user}} = getState();

      if(user.has_login) {
        const {job_prm, wsql, adapters, superlogin, aes} = $p;

        // получаем имя сохраненного или гостевого пользователя
        let name = wsql.get_user_param('user_name');
        let password = wsql.get_user_param('user_pwd');

        if(!name &&
          job_prm.zone_demo == wsql.get_user_param('zone') &&
          job_prm.guests.length) {
          name = job_prm.guests[0].name;
        }

        // устанавливаем текущего пользователя
        if(name) {
          dispatch(defined(name));
        }

        // если вход еще не выполнен...
        if(!user.logged_in && !user.try_log_in && !user.stop_log_in) {
          // если разрешено сохранение пароля или superlogin или гостевая зона...
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

export function sync_data(dbid, change) {


  // Thunk middleware знает, как обращаться с функциями.
  // Он передает метод действия в качестве аргумента функции,
  // т.о, это позволяет отправить действие самостоятельно.

  return function (dispatch, getState) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

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

export function data_page(page) {
  return {
    type: DATA_PAGE,
    payload: page
  };
}

export function load_start(page) {
  return {
    type: LOAD_START,
    payload: page
  };
}

export function autologin() {
  return {
    type: AUTOLOGIN,
    payload: true
  };
}

export function sync_error(dbid, err) {
  return {
    type: SYNC_ERROR,
    payload: {dbid, err}
  };
}

export function sync_paused(dbid, info) {
  return {
    type: info ? SYNC_PAUSED : SYNC_RESUMED,
    payload: {dbid, info}
  };
}

export function sync_resumed(dbid, info) {
  return {
    type: SYNC_RESUMED,
    payload: {dbid, info}
  };
}

export function sync_denied(dbid, info) {
  return {
    type: SYNC_DENIED,
    payload: {dbid, info}
  };
}

export function data_error(dbid, err) {
  return {
    type: DATA_ERROR,
    payload: {dbid, err}
  };
}

export function no_data(dbid, err) {
  return {
    type: NO_DATA,
    payload: {dbid, err}
  };
}
