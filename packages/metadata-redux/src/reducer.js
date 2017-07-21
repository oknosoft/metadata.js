
import handlers from './handlers'

/**
 * ### Reducer
 * Он создаёт область в хранилище состояния и несёт ответственность за изменения этой области
 */
const initialState = {
	meta_loaded: false,
	data_loaded: false,
  doc_ram_loaded: false,
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
export default function metaReducer (state = initialState, action) {
	let handler = handlers[action.type];
	return handler ? handler(state, action) : state
};
