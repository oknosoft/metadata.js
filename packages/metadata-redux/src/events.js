
/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
export function attach_events(pouch, store) {

	pouch.on('user_log_in', (name) => {store.dispatch(user_log_in(name))});

	pouch.on('user_log_out', () => {store.dispatch(user_log_out())});

	pouch.on('pouch_data_page', (page) => {store.dispatch(pouch_data_page(page))});

	pouch.on('pouch_data_loaded', (page) => {store.dispatch(pouch_data_loaded(page))});

	pouch.on('pouch_data_error', (dbid, err) => {store.dispatch(pouch_data_error(dbid, err))});

	pouch.on('pouch_load_start', (page) => {store.dispatch(pouch_load_start(page))});

	pouch.on('pouch_no_data', (dbid, err) => {store.dispatch(pouch_no_data(dbid, err))});

	pouch.on('pouch_sync_start', () => {store.dispatch(pouch_sync_start())});

	pouch.on('pouch_change', (dbid, change) => {store.dispatch(pouch_change(dbid, change))});

	pouch.on('pouch_sync_error', (dbid, err) => {store.dispatch(pouch_sync_error(dbid, err))});

}
