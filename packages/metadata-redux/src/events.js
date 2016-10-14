
/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
const ACTION_HANDLERS = {

	[META_LOADED]:          (state, action) => Object.assign({}, state, {$p: action.payload}),

	[PRM_CHANGE]:          (state, action) => state,

	[POUCH_DATA_LOADED]:    (state, action) => Object.assign({}, state, {data_loaded: true, fetch_local: false}),

	[POUCH_DATA_PAGE]:      (state, action) => Object.assign({}, state, {page: action.payload}),

	[POUCH_DATA_ERROR]:     (state, action) => Object.assign({}, state, {err: action.payload, fetch_local: false}),

	[POUCH_LOAD_START]:     (state, action) => Object.assign({}, state, {data_empty: false, fetch_local: true}),

	[POUCH_NO_DATA]:        (state, action) => Object.assign({}, state, {data_empty: true, fetch_local: false}),

	[POUCH_SYNC_START]:     (state, action) => Object.assign({}, state, {sync_started: true}),

	[POUCH_SYNC_DATA]:     (state, action) => Object.assign({}, state, {fetch_remote: action.payload ? true : false}),

	[USER_DEFINED]: (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: state.user.logged_in
	}}),

	[USER_LOG_IN]:  (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: true
	}}),

	[USER_TRY_LOG_IN]:  (state, action) => Object.assign({}, state, {user: {
		name: action.payload.name,
		logged_in: state.user.logged_in
	}}),

	[USER_LOG_OUT]:     (state, action) => Object.assign({}, state, {
		user: {
			name: state.user.name,
			logged_in: false,
		},
		sync_started: false
	}),

	[USER_LOG_ERROR]:   (state, action) => Object.assign({}, state, {
	user: {
		name: state.user.name,
		logged_in: false,
	},
	sync_started: false
	})

}

/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */
const initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: false,
	sync_started: false,
	fetch_local: false,
	fetch_remote: false,
	user: {
		name: "",
		logged_in: false
	}
}
function rx_reducer (state = initialState, action) {

	let handler = ACTION_HANDLERS[action.type];

	if(!handler)
		handler = ACTION_HANDLERS_OBJ[action.type]

	if(handler){
		console.log(action)
		return handler(state, action)
	}else
		return state
}


/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function rx_events(store) {

	this.adapters.pouch.on({

		user_log_in: (name) => {store.dispatch(user_log_in(name))},

		user_log_out: () => {store.dispatch(user_log_out())},

		pouch_data_page: (page) => {store.dispatch(pouch_data_page(page))},

		pouch_data_loaded: (page) => {store.dispatch(pouch_data_loaded(page))},

		pouch_data_error: (dbid, err) => {store.dispatch(pouch_data_error(dbid, err))},

		pouch_load_start: (page) => {store.dispatch(pouch_load_start(page))},

		pouch_no_data: (dbid, err) => {store.dispatch(pouch_no_data(dbid, err))},

		pouch_sync_start: () => {store.dispatch(pouch_sync_start())},

		pouch_sync_data: (dbid, change) => {store.dispatch(pouch_sync_data(dbid, change))},

		pouch_sync_error: (dbid, err) => {store.dispatch(pouch_sync_error(dbid, err))},

		pouch_sync_paused: (dbid, info) => {store.dispatch(pouch_sync_paused(dbid, info))},

		pouch_sync_resumed: (dbid, info) => {store.dispatch(pouch_sync_resumed(dbid, info))},

		pouch_sync_denied: (dbid, info) => {store.dispatch(pouch_sync_denied(dbid, info))},

	});

	this.md.on({
		obj_loaded: (_obj) => {store.dispatch(obj_change(_obj._manager.class_name, _obj.ref))}
	});

}

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
const plugin = {

	proto(constructor) {

		Object.defineProperties(constructor.prototype, {

			rx_actions: {
				value: actions
			},

			rx_action_types: {
				value: {

					USER_TRY_LOG_IN,
					USER_LOG_IN,
					USER_DEFINED,
					USER_LOG_OUT,
					USER_LOG_ERROR,

					POUCH_DATA_LOADED,
					POUCH_DATA_PAGE,
					POUCH_DATA_ERROR,
					POUCH_LOAD_START,
					POUCH_NO_DATA
				}
			},

			rx_reducer: {
				value: rx_reducer,
				writable: true
			},

			rx_events: {
				value: rx_events,
				writable: true
			}
		})

	},

	constructor(){

	}
}
export default plugin;
