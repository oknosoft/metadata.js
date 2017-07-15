
import handlers from './handlers'

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
};
export default function reducer (state = initialState, action) {
	let handler = handlers[action.type];
	return handler ? handler(state, action) : state
};
