
import {log_in, log_out} from './actions_auth';
import {data_page, data_loaded, data_error, load_start, no_data, sync_start, sync_data, sync_error, sync_paused, sync_resumed, sync_denied} from './actions_pouch';
import {change} from './actions_obj';


let attached;

/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
export default function metaMiddleware({adapters, md}) {
	return (store) => {
		const {dispatch} = store;
		return next => action => {
			if(!attached){
				attached = true;
				adapters.pouch.on({

					user_log_in: (name) => {dispatch(log_in(name))},

					user_log_out: () => {dispatch(log_out())},

					pouch_data_page: (page) => {dispatch(data_page(page))},

					pouch_data_loaded: (page) => {dispatch(data_loaded(page))},

          pouch_doc_ram_loaded: () => {dispatch(data_loaded('doc_ram'))},

					pouch_data_error: (dbid, err) => {dispatch(data_error(dbid, err))},

					pouch_load_start: (page) => {dispatch(load_start(page))},

					pouch_no_data: (dbid, err) => {dispatch(no_data(dbid, err))},

					pouch_sync_start: () => {dispatch(sync_start())},

					pouch_sync_data: (dbid, change) => {dispatch(sync_data(dbid, change))},

					pouch_sync_error: (dbid, err) => {dispatch(sync_error(dbid, err))},

					pouch_sync_paused: (dbid, info) => {dispatch(sync_paused(dbid, info))},

					pouch_sync_resumed: (dbid, info) => {dispatch(sync_resumed(dbid, info))},

					pouch_sync_denied: (dbid, info) => {dispatch(sync_denied(dbid, info))},

				});

				md.on({
					obj_loaded: (_obj) => {dispatch(change(_obj._manager.class_name, _obj.ref))}
				});
			}
			return next(action);
		}
	}
}

