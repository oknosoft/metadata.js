/**
 * ### Действия и типы действий в терминах redux
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module actions.js
 *
 * Created 05.09.2016
 */


// ------------------------------------
// Action types - имена типов действий
// ------------------------------------

const META_LOADED       = 'META_LOADED'         // Инициализирует параметры и создаёт менеджеры объектов данных

const PRM_CHANGE        = 'PRM_CHANGE'          // Изменены глобальные параметры (couch_path, zone и т.д.)


const USER_TRY_LOG_IN   = 'USER_TRY_LOG_IN'     // Попытка авторизации
const USER_LOG_IN       = 'USER_LOG_IN'         // Подтверждает авторизацию
const USER_DEFINED      = 'USER_DEFINED'        // Установить текущего пользователя (авторизация не обязательна)
const USER_LOG_OUT      = 'USER_LOG_OUT'        // Попытка завершения синхронизации
const USER_LOG_ERROR    = 'USER_LOG_ERROR'      // Ошибка авторизации

const USER_SOCIAL_TRY_LINK  = 'USER_SOCIAL_TRY_LINK'    // Попытка привязать аккаунт социальной сети
const USER_SOCIAL_LINKED    = 'USER_SOCIAL_LINKED'      // Пользователь привязан к аккаунту социальной сети
const USER_SOCIAL_UNLINKED  = 'USER_SOCIAL_UNLINKED'    // Пользователь отвязан от аккаунта социальной сети

const POUCH_DATA_PAGE   = 'POUCH_DATA_PAGE'     // Оповещение о загрузке порции локальных данных
const POUCH_LOAD_START  = 'POUCH_LOAD_START'    // Оповещение о начале загрузки локальных данных
const POUCH_DATA_LOADED = 'POUCH_DATA_LOADED'   // Оповещение об окончании загрузки локальных данных
const POUCH_DATA_ERROR  = 'POUCH_DATA_ERROR'    // Оповещение об ошибке при загрузке локальных данных
const POUCH_NO_DATA     = 'POUCH_NO_DATA'       // Оповещение об отсутствии локальных данных (как правило, при первом запуске)

const POUCH_SYNC_START  = 'POUCH_SYNC_START'    // Оповещение о начале синхронизации базы doc
const POUCH_SYNC_ERROR  = 'POUCH_SYNC_ERROR'    // Оповещение об ошибке репликации - не означает окончания репликации - просто информирует об ошибке
const POUCH_SYNC_DATA   = 'POUCH_SYNC_DATA'     // Прибежали изменения с сервера или мы отправили данные на сервер
const POUCH_SYNC_PAUSED = 'POUCH_SYNC_PAUSED'   // Репликация приостановлена, обычно, из-за потери связи с сервером
const POUCH_SYNC_RESUMED= 'POUCH_SYNC_RESUMED'  // Репликация возобновлена
const POUCH_SYNC_DENIED = 'POUCH_SYNC_DENIED'   // Разновидность ошибки репликации из-за недостатка прав для записи документа на сервере




// ------------------------------------
// Actions - функции - генераторы действий. Они передаются в диспетчер redux
// ------------------------------------

function meta_loaded($p) {

	return {
		type: META_LOADED,
		payload: $p
	}
}

function prm_change(prms) {

	return {
		type: PRM_CHANGE,
		payload: prms
	}
}

/**
 * ### После загрузки локальных данных
 * если разрешено сохранение пароля или демо-режим, выполняем попытку авторизации
 * @param page
 * @return {{type: string, payload: *}}
 */
function pouch_data_loaded(page) {

	return function (dispatch, getState) {

		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({
			type: POUCH_DATA_LOADED,
			payload: page
		});


		const { meta } = getState(),
			{ $p } = meta;

		// если вход еще не выполнен...
		if(!meta.user.logged_in){

			setTimeout(function () {

				// получаем имя сохраненного или гостевого пользователя
				let name = $p.wsql.get_user_param('user_name');
				let password = $p.wsql.get_user_param('user_pwd');

				if(!name &&
					$p.job_prm.zone_demo == $p.wsql.get_user_param('zone') &&
					$p.job_prm.guests.length){
					name = $p.job_prm.guests[0].name
				}

				// устанавливаем текущего пользователя
				if(name)
					dispatch(user_defined(name));

				// если разрешено сохранение пароля или гостевая зона...
				if(name && password && $p.wsql.get_user_param('enable_save_pwd')){
					dispatch(user_try_log_in($p.adapters.pouch, name, $p.aes.Ctr.decrypt(password)));
					return;
				}

				if(name && $p.job_prm.zone_demo == $p.wsql.get_user_param('zone')){
					dispatch(user_try_log_in($p.adapters.pouch, name,
						$p.aes.Ctr.decrypt($p.job_prm.guests[0].password)));
				}

			}, 10)
		}
	}

}

var sync_data_indicator;

function pouch_sync_data(dbid, change) {


	// Thunk middleware знает, как обращаться с функциями.
	// Он передает метод действия в качестве аргумента функции,
	// т.о, это позволяет отправить действие самостоятельно.

	return function (dispatch, getState) {

		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({
			type: POUCH_SYNC_DATA,
			payload: {
				dbid: dbid,
				change: change
			}
		})

		if(sync_data_indicator){
			clearTimeout(sync_data_indicator);
		}

		sync_data_indicator = setTimeout(function () {

			sync_data_indicator = 0;

			dispatch({
				type: POUCH_SYNC_DATA,
				payload: false
			})

		}, 1500);
	}
}

function pouch_data_page(page) {
	return {
		type: POUCH_DATA_PAGE,
		payload: page
	}
}

function pouch_load_start(page) {
	return {
		type: POUCH_LOAD_START,
		payload: page
	}
}

function pouch_sync_start() {
	return { type: POUCH_SYNC_START }
}

function pouch_sync_error(dbid, err) {
	return {
		type: POUCH_SYNC_ERROR,
		payload: { dbid, err }
	}
}

function pouch_sync_paused(dbid, info) {
	return {
		type: POUCH_SYNC_PAUSED,
		payload: { dbid, info }
	}
}

function pouch_sync_resumed(dbid, info) {
	return {
		type: POUCH_SYNC_RESUMED,
		payload: { dbid, info }
	}
}

function pouch_sync_denied(dbid, info) {
	return {
		type: POUCH_SYNC_DENIED,
		payload: { dbid, info }
	}
}

function pouch_data_error(dbid, err) {
	return {
		type: POUCH_DATA_ERROR,
		payload: { dbid, err }
	}
}

function pouch_no_data(dbid, err) {
	return {
		type: POUCH_NO_DATA,
		payload: { dbid, err }
	}
}

function user_defined(name) {

	return {
		type: USER_DEFINED,
		payload: name
	}
}

/**
 * ### Пользователь авторизован
 * @param name
 * @return {{type: string, payload: *}}
 */
function user_log_in(name) {
	return {
		type: USER_LOG_IN,
		payload: name
	}
}

function user_try_log_in(adapter, name, password) {

	// Thunk middleware знает, как обращаться с функциями.
	// Он передает метод действия в качестве аргумента функции,
	// т.о, это позволяет отправить действие самостоятельно.

	return function (dispatch, getState) {

		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({
			type: USER_TRY_LOG_IN,
			payload: {name: name, password: password, provider: 'local'}
		})

		// в зависимости от использования суперлогина, разные действия
		if(adapter.$p.superlogin){
			return adapter.$p.superlogin.login({
				username: name,
				password: password
			})
				.then(function (session) {
					return adapter.log_in(session.token, session.password)
				})

		}else{
			return adapter.log_in(name, password)
		}

		// In a real world app, you also want to
		// catch any error in the network call.
	}
}

/**
 * Инициирует отключение пользователя
 * @param adapter
 * @return {Function}
 */
function user_log_out(adapter) {

	return function (dispatch, getState) {

		const disp_log_out = () => {
			dispatch({
				type: USER_LOG_OUT,
				payload: {name: getState().meta.user.name}
			})
		}

		// в зависимости от использования суперлогина, разные действия
		if(!adapter){
			disp_log_out();

		}else if(adapter.$p.superlogin){
			adapter.$p.superlogin.logOut()
				.then(disp_log_out)

		}else{
			adapter.log_out();
		}
	}
}

function user_log_error() {
	return {
		type: USER_LOG_ERROR
	}
}


const actions = {

	[META_LOADED]: meta_loaded,
	[PRM_CHANGE]: prm_change,

	[USER_TRY_LOG_IN]: user_try_log_in,
	[USER_LOG_IN]: user_log_in,
	[USER_DEFINED]: user_defined,
	[USER_LOG_OUT]: user_log_out,
	[USER_LOG_ERROR]: user_log_error,

	[POUCH_DATA_LOADED]: pouch_data_loaded,
	[POUCH_DATA_PAGE]: pouch_data_page,
	[POUCH_DATA_ERROR]: pouch_data_error,
	[POUCH_LOAD_START]: pouch_load_start,
	[POUCH_NO_DATA]: pouch_no_data,

	[OBJ_ADD]: obj_add,
	[OBJ_ADD_ROW]: obj_add_row,
	[OBJ_DEL_ROW]: obj_del_row,
	[OBJ_EDIT]: obj_edit,
	[OBJ_REVERT]: obj_revert,
	[OBJ_SAVE]: obj_save,
	[OBJ_CHANGE]: obj_change,
	[OBJ_VALUE_CHANGE]: obj_value_change,
	obj_post: obj_post,
	obj_unpost: obj_unpost,
	obj_mark_deleted: obj_mark_deleted,
	obj_unmark_deleted: obj_unmark_deleted

}



