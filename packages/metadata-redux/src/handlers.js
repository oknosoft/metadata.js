/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 *
 * @module handlers
 *
 * Created by Evgeniy Malyarov on 15.07.2017.
 */

import {META_LOADED, PRM_CHANGE} from './actions_base';
import {DATA_LOADED, DATA_PAGE, DATA_ERROR, LOAD_START, NO_DATA, SYNC_START, SYNC_DATA} from './actions_pouch';
import {DEFINED, LOG_IN, TRY_LOG_IN, LOG_OUT, LOG_ERROR} from './actions_auth';
import {ADD, CHANGE} from './actions_obj';


export default {

	[META_LOADED]: (state, action) => Object.assign({}, state, {
		$p: action.payload,
		meta_loaded: true,
	}),

	[PRM_CHANGE]: (state, action) => state,

	[DATA_LOADED]: (state, action) => Object.assign({}, state, {data_loaded: true, fetch_local: false}),

	[DATA_PAGE]: (state, action) => Object.assign({}, state, {page: action.payload}),

	[DATA_ERROR]: (state, action) => Object.assign({}, state, {err: action.payload, fetch_local: false}),

	[LOAD_START]: (state, action) => Object.assign({}, state, {data_empty: false, fetch_local: true}),

	[NO_DATA]: (state, action) => Object.assign({}, state, {data_empty: true, fetch_local: false}),

	[SYNC_START]: (state, action) => Object.assign({}, state, {sync_started: true}),

	[SYNC_DATA]: (state, action) => Object.assign({}, state, {fetch_remote: action.payload ? true : false}),

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
		},
	}),

	[TRY_LOG_IN]: (state, action) => Object.assign({}, state, {
		user: {
			name: action.payload.name,
			logged_in: state.user.logged_in,
		},
	}),

	[LOG_OUT]: (state, action) => Object.assign({}, state, {
		user: {
			name: state.user.name,
			logged_in: false,
		},
		sync_started: false,
	}),

	[LOG_ERROR]: (state, action) => Object.assign({}, state, {
		user: {
			name: state.user.name,
			logged_in: false,
		},
		sync_started: false,
	}),

	[ADD]: (state, action) => state,

	[CHANGE]: (state, action) => Object.assign({}, state, {obj_change: action.payload}),

};