
import {log_in, log_out} from './actions_auth';
import {data_page, data_loaded, data_error, load_start, no_data, sync_start, sync_data, sync_error, sync_paused, sync_resumed, sync_denied} from './actions_pouch';
import {change} from './actions_obj';

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
export default function events($p, store) {

	$p.adapters.pouch.on({

		user_log_in: (name) => {store.dispatch(log_in(name))},

		user_log_out: () => {store.dispatch(log_out())},

		pouch_data_page: (page) => {store.dispatch(data_page(page))},

		pouch_data_loaded: (page) => {store.dispatch(data_loaded(page))},

		pouch_data_error: (dbid, err) => {store.dispatch(data_error(dbid, err))},

		pouch_load_start: (page) => {store.dispatch(load_start(page))},

		pouch_no_data: (dbid, err) => {store.dispatch(no_data(dbid, err))},

		pouch_sync_start: () => {store.dispatch(sync_start())},

		pouch_sync_data: (dbid, change) => {store.dispatch(sync_data(dbid, change))},

		pouch_sync_error: (dbid, err) => {store.dispatch(sync_error(dbid, err))},

		pouch_sync_paused: (dbid, info) => {store.dispatch(sync_paused(dbid, info))},

		pouch_sync_resumed: (dbid, info) => {store.dispatch(sync_resumed(dbid, info))},

		pouch_sync_denied: (dbid, info) => {store.dispatch(sync_denied(dbid, info))},

	});

	$p.md.on({
		obj_loaded: (_obj) => {store.dispatch(change(_obj._manager.class_name, _obj.ref))}
	});

};
