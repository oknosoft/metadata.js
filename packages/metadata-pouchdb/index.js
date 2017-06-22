'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _metadataAbstractAdapter = require('metadata-abstract-adapter');

var _metadataAbstractAdapter2 = _interopRequireDefault(_metadataAbstractAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

/**
 * ### PouchDB для хранения данных в idb браузера и синхронизации с CouchDB
 */
const PouchDB = require('pouchdb-core').plugin(require('pouchdb-adapter-http')).plugin(require('pouchdb-replication')).plugin(require('pouchdb-mapreduce')).plugin(require('pouchdb-find'));
// pouchdb_memory = require('pouchdb-adapter-memory'),
// pouchdb_idb = require('pouchdb-adapter-idb')

/**
 * В зависимости от среды исполнения, подключаем адаптер memory или idb или websql
 * isNode
 */
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
	PouchDB.plugin(require('pouchdb-adapter-memory'));
} else {
	PouchDB.plugin(require('pouchdb-authentication'));
	const ua = navigator && navigator.userAgent ? navigator.userAgent.toLowerCase() : '';
	if (ua.match('safari') && !ua.match('chrome')) {
		PouchDB.plugin(require('pouchdb-adapter-websql'));
	} else {
		PouchDB.plugin(require('pouchdb-adapter-idb'));
	}
}

/**
 * ### Интерфейс локальной и сетевой баз данных PouchDB
 * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
 *
 * @class Pouch
 * @static
 * @menuorder 34
 * @tooltip Данные pouchdb
 */
class AdapterPouch extends _metadataAbstractAdapter2.default {

	constructor($p) {

		super($p);

		var t = this,
		    _paths = {},
		    _local,
		    _remote,
		    _auth,
		    _data_loaded;

		Object.defineProperties(this, {

			init: {
				value: function (attr) {
					Object.assign(_paths, attr);
					if (_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined") {
						_paths.path = location.protocol + "//" + location.host + _paths.path;
					}
				}
			},

			/**
    * ### Локальные базы PouchDB
    *
    * @property local
    * @type {{ram: PouchDB, doc: PouchDB, meta: PouchDB, sync: {}}}
    */
			local: {
				get: function () {
					if (!_local) {

						var opts = { auto_compaction: true, revs_limit: 2 },
						    bases = $p.md.bases();

						_local = { sync: {} };

						["ram", "doc", "meta", "user"].forEach(name => {
							if (bases.indexOf(name) != -1) {
								if (name == "meta") {
									_local[name] = new PouchDB(_paths.prefix + "meta", opts);
								} else {
									if (_paths.direct) {
										_local[name] = this.remote[name];
									} else {
										_local[name] = new PouchDB(_paths.prefix + _paths.zone + "_" + name, opts);
									}
								}
							}
						});
					}
					return _local;
				}
			},

			/**
    * ### Базы PouchDB на сервере
    *
    * @property remote
    * @type {{ram: PouchDB, doc: PouchDB}}
    */
			remote: {
				get: function () {
					if (!_remote) {

						const opts = { skip_setup: true, adapter: 'http' };

						if (_paths.user_node) {
							opts.auth = _paths.user_node;
						}

						_remote = {};

						function dbpath(name) {
							if ($p.superlogin) {
								return $p.superlogin.getDbUrl(_paths.prefix + (name == "meta" ? name : _paths.zone + "_" + name));
							} else {
								if (name == "meta") {
									return _paths.path + "meta";
								} else if (name == "ram") {
									return _paths.path + _paths.zone + "_ram";
								} else {
									return _paths.path + _paths.zone + "_" + name + (_paths.suffix ? "_" + _paths.suffix : "");
								}
							}
						}

						$p.md.bases().forEach(name => {
							if (name == 'e1cib' || name == 'pgsql') {
								return;
							}
							_remote[name] = new PouchDB(dbpath(name), opts);
						});
					}
					return _remote;
				}
			},

			/**
    * Возвращает базу PouchDB, связанную с объектами данного менеджера
    * @method db
    * @param _mgr {DataManager}
    * @return {PouchDB}
    */
			db: {
				value: function (_mgr) {
					const dbid = _mgr.cachable.replace('_remote', '').replace('_ram', '');
					if (dbid.indexOf("remote") != -1 || _paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1) return this.remote[dbid.replace("_remote", "")];else return this.local[dbid] || this.remote[dbid];
				}
			},

			/**
    * ### Выполняет авторизацию и запускает репликацию
    * @method log_in
    * @param username {String}
    * @param password {String}
    * @return {Promise}
    */
			log_in: {
				value: function (username, password) {

					// реквизиты гостевого пользователя для демобаз
					if (username == undefined && password == undefined) {
						if ($p.job_prm.guests && $p.job_prm.guests.length) {
							username = $p.job_prm.guests[0].username;
							password = $p.aes.Ctr.decrypt($p.job_prm.guests[0].password);
						} else {
							return Promise.reject(new Error("username & password not defined"));
						}
					}

					if (_auth) {
						if (_auth.username == username) {
							return Promise.resolve();
						} else {
							return Promise.reject(new Error("need logout first"));
						}
					}

					// авторизуемся во всех базах
					const try_auth = [];
					$p.md.bases().forEach(name => {
						if (t.remote[name]) {
							try_auth.push(_paths.user_node ? this.remote[name].info() : this.remote[name].login(username, password));
						}
					});

					return Promise.all(try_auth).then(() => {

						_auth = { username: username };
						setTimeout(() => {

							// сохраняем имя пользователя в базе
							if ($p.wsql.get_user_param("user_name") != username) {
								$p.wsql.set_user_param("user_name", username);
							}

							// если настроено сохранение пароля - сохраняем и его
							if ($p.wsql.get_user_param("enable_save_pwd")) {
								if ($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password) {
									$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password)); // сохраняем имя пользователя в базе
								}
							} else if ($p.wsql.get_user_param("user_pwd") != "") {
								$p.wsql.set_user_param("user_pwd", "");
							}

							// излучаем событие
							t.emit('user_log_in', username);
						});

						const sync = {};
						if (_paths.direct) {
							return t.load_data();
						}
						try_auth.length = 0;
						$p.md.bases().forEach(dbid => {
							if (t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]) {
								if (_paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1) {
									return;
								}
								try_auth.push(t.run_sync(t.local[dbid], t.remote[dbid], dbid));
							}
						});
						return Promise.all(try_auth);
					}).catch(err => {
						// излучаем событие
						t.emit('user_log_fault', err);
					});
				}
			},

			/**
    * ### Останавливает синхронизацию и снимает признак авторизованности
    * @method log_out
    */
			log_out: {
				value: function () {

					if (_auth) {
						if (_local.sync.doc) {
							try {
								_local.sync.doc.cancel();
							} catch (err) {}
						}
						if (_local.sync.ram) {
							try {
								_local.sync.ram.cancel();
							} catch (err) {}
						}
						_auth = null;
					}

					return _remote.ram.logout().then(() => {
						if (_remote && _remote.doc) {
							return _remote.doc.logout();
						}
					}).then(() => {
						if (_remote && _remote.ram) {
							delete _remote.ram;
						}
						if (_remote && _remote.doc) {
							delete _remote.doc;
						}
						_remote = null;
						t.emit('user_log_out');
					});
				}
			},

			/**
    * ### Уничтожает локальные данные
    * Используется при изменении структуры данных на сервере
    *
    * @method reset_local_data
    */
			reset_local_data: {
				value: function () {

					var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
					    destroy_doc = t.local.doc.destroy.bind(t.local.doc),
					    do_reload = () => {
						setTimeout(() => {
							location.reload(true);
						}, 1000);
					};

					t.log_out();

					setTimeout(() => {
						destroy_ram().then(destroy_doc).catch(destroy_doc).then(do_reload).catch(do_reload);
					}, 1000);
				}
			},

			/**
    * ### Загружает условно-постоянные данные из базы ram в alasql
    * Используется при инициализации данных на старте приложения
    *
    * @method load_data
    */
			load_data: {
				value: function () {

					var options = {
						limit: 800,
						include_docs: true
					},
					    _page = {
						total_rows: 0,
						limit: options.limit,
						page: 0,
						start: Date.now()
					};

					// бежим по всем документам из ram
					return new Promise((resolve, reject) => {

						function fetchNextPage() {
							t.local.ram.allDocs(options, (err, response) => {

								if (response) {
									// широковещательное оповещение о загрузке порции локальных данных
									_page.page++;
									_page.total_rows = response.total_rows;
									_page.duration = Date.now() - _page.start;

									t.emit('pouch_data_page', Object.assign({}, _page));

									if (t.load_changes(response, options)) {
										fetchNextPage();
									}
									// широковещательное оповещение об окончании загрузки локальных данных
									else {
											t.call_data_loaded(_page);
											resolve();
										}
								} else if (err) {
									reject(err);
									// широковещательное оповещение об ошибке загрузки
									t.emit('pouch_data_error', "ram", err);
								}
							});
						}

						t.local.ram.info().then(info => {
							if (info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)) {

								// широковещательное оповещение о начале загрузки локальных данных
								t.emit('pouch_load_start', _page);

								fetchNextPage();
							} else {

								t.emit('pouch_no_data', info);
								resolve();
							}
						});
					});
				}
			},

			/**
    * ### Информирует об авторизованности на сервере CouchDB
    *
    * @property authorized
    */
			authorized: {
				get: function () {
					return _auth && _auth.username;
				}
			},

			/**
    * ### Информирует о загруженности данных
    *
    * @property data_loaded
    */
			data_loaded: {
				get: function () {
					return !!_data_loaded;
				}
			},

			call_data_loaded: {
				value: function (page) {
					_data_loaded = true;
					if (!page) {
						page = _local.sync._page || {};
					}
					return $p.md.load_doc_ram().then(() => setTimeout(() => t.emit(page.note = 'pouch_data_loaded', page), 1000));
				}
			},

			/**
    * ### Запускает процесс синхронизвации
    *
    * @method run_sync
    * @param local {PouchDB}
    * @param remote {PouchDB}
    * @param id {String}
    * @return {Promise.<TResult>}
    */
			run_sync: {
				value: function (id) {

					let local = t.local[id],
					    remote = t.remote[id],
					    linfo,
					    _page;

					return local.info().then(info => {

						linfo = info;
						return remote.info();
					}).then(rinfo => {

						// для базы "ram", сервер мог указать тотальную перезагрузку данных
						// в этом случае - очищаем базы и перезапускаем браузер
						if (id != "ram") {
							return rinfo;
						}

						return remote.get("data_version").then(v => {
							if (v.version != $p.wsql.get_user_param("couch_ram_data_version")) {
								// если это не первый запуск - перезагружаем
								if ($p.wsql.get_user_param("couch_ram_data_version")) {
									rinfo = t.reset_local_data();
								}
								// сохраняем версию в localStorage
								$p.wsql.set_user_param("couch_ram_data_version", v.version);
							}
							return rinfo;
						}).catch(err => {
							$p.record_log(err);
						}).then(() => {
							return rinfo;
						});
					}).then(rinfo => {

						if (!rinfo) {
							return;
						}

						if (id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)) {

							// широковещательное оповещение о начале загрузки локальных данных
							_page = {
								total_rows: rinfo.doc_count,
								local_rows: linfo.doc_count,
								docs_written: 0,
								limit: 300,
								page: 0,
								start: Date.now()
							};
							t.emit('pouch_load_start', _page);
						} else if (id == "doc") {
							// широковещательное оповещение о начале синхронизации базы doc
							setTimeout(() => {
								t.emit('pouch_sync_start');
							});
						}

						var options = {
							live: true,
							retry: true,
							batch_size: 200,
							batches_limit: 6
						};

						// если указан клиентский или серверный фильтр - подключаем
						if ($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]) {
							options.filter = $p.job_prm.pouch_filter[id];
						} else if (id == "meta") {
							// если для базы meta фильтр не задан, используем умолчание
							options.filter = "auth/meta";
						}

						// ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
						if (id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo) {
							_local.sync[id] = local.replicate.from(remote, options);
						} else {
							_local.sync[id] = local.sync(remote, options);
						}

						_local.sync[id].on('change', change => {
							// yo, something changed!
							if (id == "ram") {
								t.load_changes(change);

								if (linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)) {

									// широковещательное оповещение о загрузке порции данных
									_page.page++;
									_page.docs_written = change.docs_written;
									_page.duration = Date.now() - _page.start;

									t.emit('pouch_data_page', Object.assign({}, _page));

									// широковещательное оповещение об окончании загрузки локальных данных
									if (change.docs.length < _page.limit) {
										t.call_data_loaded(_page);
									}
								}
							} else {
								// если прибежали изменения базы doc - обновляем те объекты, которые уже прочитаны в озу
								change.update_only = true;
								t.load_changes(change);
							}

							t.emit('pouch_sync_data', id, change);
						}).on('paused', info => {
							// replication was paused, usually because of a lost connection
							t.emit('pouch_sync_paused', id, info);
						}).on('active', info => {
							// replication was resumed
							t.emit('pouch_sync_resumed', id, info);
						}).on('denied', info => {
							// a document failed to replicate, e.g. due to permissions
							t.emit('pouch_sync_denied', id, info);
						}).on('error', err => {
							// totally unhandled error (shouldn't happen)
							t.emit('pouch_sync_error', id, err);
						});

						return _local.sync[id];
					});
				}
			}

		});
	}

	/**
  * ### Читает объект из pouchdb
  *
  * @method load_obj
  * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
  * @return {Promise.<DataObj>} - промис с загруженным объектом
  */
	load_obj(tObj) {

		const db = this.db(tObj._manager);
		return db.get(tObj._manager.class_name + "|" + tObj.ref).then(res => {
			delete res._id;
			delete res._rev;
			Object.assign(tObj, res)._set_loaded();
		}).catch(err => {
			if (err.status != 404) throw err;else console.log({ tObj, db });
		}).then(res => {
			return tObj;
		});
	}

	/**
  * ### Записывает объект в pouchdb
  *
  * @method load_obj
  * @param tObj {DataObj} - записываемый объект
  * @param attr {Object} - ополнительные параметры записи
  * @return {Promise.<DataObj>} - промис с записанным объектом
  */
	save_obj(tObj, attr) {

		const { _manager, _obj, ref } = tObj;
		const db = this.db(_manager);
		const tmp = Object.assign({ _id: _manager.class_name + "|" + ref }, _obj);

		delete tmp.ref;

		if (attr.attachments) {
			tmp._attachments = attr.attachments;
		}

		return new Promise((resolve, reject) => {
			const getter = tObj.is_new() ? Promise.resolve() : db.get(tmp._id);
			getter.then(res => {
				if (res) {
					tmp._rev = res._rev;
					for (var att in res._attachments) {
						if (!tmp._attachments) tmp._attachments = {};
						if (!tmp._attachments[att]) tmp._attachments[att] = res._attachments[att];
					}
				}
			}).catch(err => {
				err && err.status != 404 && reject(err);
			}).then(() => {
				return db.put(tmp);
			}).then(() => {
				tObj.is_new() && tObj._set_loaded(tObj.ref);
				if (tmp._attachments) {
					if (!tObj._attachments) tObj._attachments = {};
					for (var att in tmp._attachments) {
						if (!tObj._attachments[att] || !tmp._attachments[att].stub) tObj._attachments[att] = tmp._attachments[att];
					}
				}
				resolve(tObj);
			}).catch(err => {
				err && err.status != 404 && reject(err);
			});
		});
	}

	/**
  * ### Возвращает набор данных для дерева динсписка
  *
  * @method pouch_tree
  * @param _mgr {DataManager}
  * @param attr {Object}
  * @return {Promise.<Array>}
  */
	get_tree(_mgr, attr) {}

	/**
  * ### Возвращает набор данных для динсписка
  *
  * @method pouch_selection
  * @param _mgr {DataManager}
  * @param attr
  * @return {Promise.<Array>}
  */
	get_selection(_mgr, attr) {}

	/**
  * Загружает объекты из PouchDB по массиву ссылок
  *
  * @param _mgr {DataManager}
  * @param refs {Array}
  * @param with_attachments {Boolean}
  * @return {*}
  */
	load_array(_mgr, refs, with_attachments) {

		if (!refs.length) {
			return Promise.resolve(false);
		}

		const options = {
			limit: refs.length + 1,
			include_docs: true,
			keys: refs.map(v => _mgr.class_name + "|" + v)
		},
		      db = this.db(_mgr);

		if (with_attachments) {
			options.attachments = true;
			options.binary = true;
		}

		return db.allDocs(options).then(result => this.load_changes(result, {}));
	}

	/**
  * Загружает объекты из PouchDB, обрезанные по view
  */
	load_view(_mgr, _view) {

		var doc,
		    res = [],
		    db = this.db(_mgr),
		    options = {
			limit: 1000,
			include_docs: true,
			startkey: _mgr.class_name + "|",
			endkey: _mgr.class_name + '|\ufff0'
		};

		return new Promise((resolve, reject) => {

			function process_docs(err, result) {

				if (result) {

					if (result.rows.length) {

						options.startkey = result.rows[result.rows.length - 1].key;
						options.skip = 1;

						result.rows.forEach(rev => {
							doc = rev.doc;
							let key = doc._id.split("|");
							doc.ref = key[1];
							// наполняем
							res.push(doc);
						});

						_mgr.load_array(res);
						res.length = 0;

						db.query(_view, options, process_docs);
					} else {
						resolve();
					}
				} else if (err) {
					reject(err);
				}
			}

			db.query(_view, options, process_docs);
		});
	}

	/**
  * ### Найти строки
  * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
  * Eсли отбор пустой, возвращаются все строки из PouchDB.
  *
  * @method pouch_find_rows
  * @param _mgr {DataManager}
  * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
  * @param [selection._top] {Number}
  * @param [selection._skip] {Number}
  * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
  * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
  * @return {Promise.<Array>}
  */
	find_rows(_mgr, selection) {
		var doc,
		    res = [],
		    utils = this.$p.utils,
		    db = this.db(_mgr),
		    _raw,
		    _view,
		    _total_count,
		    top,
		    calc_count,
		    top_count = 0,
		    skip = 0,
		    skip_count = 0,
		    options = {
			limit: 100,
			include_docs: true,
			startkey: _mgr.class_name + "|",
			endkey: _mgr.class_name + '|\ufff0'
		};

		if (selection) {

			if (selection._top) {
				top = selection._top;
				delete selection._top;
			} else top = 300;

			if (selection._raw) {
				_raw = selection._raw;
				delete selection._raw;
			}

			if (selection._total_count) {
				_total_count = selection._total_count;
				delete selection._total_count;
			}

			if (selection._view) {
				_view = selection._view;
				delete selection._view;
			}

			if (selection._key) {

				if (selection._key._order_by == "des") {
					options.startkey = selection._key.endkey || selection._key + '\ufff0';
					options.endkey = selection._key.startkey || selection._key;
					options.descending = true;
				} else {
					options.startkey = selection._key.startkey || selection._key;
					options.endkey = selection._key.endkey || selection._key + '\ufff0';
				}
			}

			if (typeof selection._skip == "number") {
				skip = selection._skip;
				delete selection._skip;
			}

			if (selection._attachments) {
				options.attachments = true;
				options.binary = true;
				delete selection._attachments;
			}
		}

		// если сказано посчитать все строки...
		if (_total_count) {

			calc_count = true;
			_total_count = 0;

			// если нет фильтра по строке или фильтр растворён в ключе
			if (Object.keys(selection).length <= 1) {

				// если фильтр в ключе, получаем все строки без документов
				if (selection._key && selection._key.hasOwnProperty("_search")) {
					options.include_docs = false;
					options.limit = 100000;

					return db.query(_view, options).then(result => {

						result.rows.forEach(row => {

							// фильтруем
							if (!selection._key._search || row.key[row.key.length - 1].toLowerCase().indexOf(selection._key._search) != -1) {

								_total_count++;

								// пропукскаем лишние (skip) элементы
								if (skip) {
									skip_count++;
									if (skip_count < skip) return;
								}

								res.push(row.id);

								// ограничиваем кол-во возвращаемых элементов
								if (top) {
									top_count++;
									if (top_count >= top) {
										return;
									}
								}
							}
						});

						delete options.startkey;
						delete options.endkey;
						if (options.descending) delete options.descending;
						options.keys = res;
						options.include_docs = true;

						return db.allDocs(options);
					}).then(result => {
						return {
							rows: result.rows.map(row => {

								var doc = row.doc;

								doc.ref = doc._id.split("|")[1];

								if (!_raw) {
									delete doc._id;
									delete doc._rev;
								}

								return doc;
							}),
							_total_count: _total_count
						};
					});
				}
			}
		}

		// бежим по всем документам из ram
		return new Promise((resolve, reject) => {

			function process_docs(err, result) {

				if (result) {

					if (result.rows.length) {

						options.startkey = result.rows[result.rows.length - 1].key;
						options.skip = 1;

						result.rows.forEach(rev => {
							doc = rev.doc;

							let key = doc._id.split("|");
							doc.ref = key[1];

							if (!_raw) {
								delete doc._id;
								delete doc._rev;
							}

							// фильтруем
							if (!utils._selection.call(_mgr, doc, selection)) {
								return;
							}

							if (calc_count) {
								_total_count++;
							}

							// пропукскаем лишние (skip) элементы
							if (skip) {
								skip_count++;
								if (skip_count < skip) return;
							}

							// наполняем
							res.push(doc);

							// ограничиваем кол-во возвращаемых элементов
							if (top) {
								top_count++;
								if (top_count >= top) {
									return;
								}
							}
						});

						if (top && (top_count >= top || result.rows.length < options.limit) && !calc_count) {
							resolve(_raw ? res : _mgr.load_array(res));
						} else {
							fetch_next_page();
						}
					} else {
						if (calc_count) {
							resolve({
								rows: _raw ? res : _mgr.load_array(res),
								_total_count: _total_count
							});
						} else resolve(_raw ? res : _mgr.load_array(res));
					}
				} else if (err) {
					reject(err);
				}
			}

			function fetch_next_page() {

				if (_view) db.query(_view, options, process_docs);else db.allDocs(options, process_docs);
			}

			fetch_next_page();
		});
	}

	/**
  * ### Сохраняет присоединенный файл
  *
  * @method save_attachment
  * @param _mgr {DataManager}
  * @param ref
  * @param att_id
  * @param attachment
  * @param type
  * @return {Promise}
  * @async
  */
	save_attachment(_mgr, ref, att_id, attachment, type) {

		if (!type) type = { type: "text/plain" };

		if (!(attachment instanceof Blob) && type.indexOf("text") == -1) attachment = new Blob([attachment], { type: type });

		// получаем ревизию документа
		var _rev,
		    db = this.db(_mgr);

		ref = _mgr.class_name + "|" + this.$p.utils.fix_guid(ref);

		return db.get(ref).then(res => {
			if (res) _rev = res._rev;
		}).catch(err => {
			if (err.status != 404) throw err;
		}).then(() => {
			return db.putAttachment(ref, att_id, _rev, attachment, type);
		});
	}

	/**
  * Получает присоединенный к объекту файл
  * @param _mgr {DataManager}
  * @param ref
  * @param att_id
  * @return {Promise}
  */
	get_attachment(_mgr, ref, att_id) {

		return this.db(_mgr).getAttachment(_mgr.class_name + "|" + this.$p.utils.fix_guid(ref), att_id);
	}

	/**
  * Удаляет присоединенный к объекту файл
  * @param _mgr {DataManager}
  * @param ref
  * @param att_id
  * @return {Promise}
  */
	delete_attachment(_mgr, ref, att_id) {

		// получаем ревизию документа
		var _rev,
		    db = this.db(_mgr);

		ref = _mgr.class_name + "|" + this.$p.utils.fix_guid(ref);

		return db.get(ref).then(res => {
			if (res) _rev = res._rev;
		}).catch(err => {
			if (err.status != 404) throw err;
		}).then(() => {
			return db.removeAttachment(ref, att_id, _rev);
		});
	}

	/**
  * ### Загружает в менеджер изменения или полученные через allDocs данные
  *
  * @method load_changes
  * @param changes
  * @param options
  * @return {boolean}
  */
	load_changes(changes, options) {

		let docs,
		    doc,
		    res = {},
		    cn,
		    key,
		    { $p } = this;

		if (!options) {
			if (changes.direction) {
				if (changes.direction != "pull") return;
				docs = changes.change.docs;
			} else {
				docs = changes.docs;
			}
		} else {
			docs = changes.rows;
		}

		if (docs.length > 0) {
			if (options) {
				options.startkey = docs[docs.length - 1].key;
				options.skip = 1;
			}

			docs.forEach(rev => {
				doc = options ? rev.doc : rev;
				if (!doc) {
					if (rev.value && rev.value.deleted) doc = {
						_id: rev.id,
						_deleted: true
					};else if (rev.error) return;
				}
				key = doc._id.split("|");
				cn = key[0].split(".");
				doc.ref = key[1];
				delete doc._id;
				delete doc._rev;
				if (!res[cn[0]]) res[cn[0]] = {};
				if (!res[cn[0]][cn[1]]) res[cn[0]][cn[1]] = [];
				res[cn[0]][cn[1]].push(doc);
			});

			for (let mgr in res) {
				for (cn in res[mgr]) {
					if ($p[mgr] && $p[mgr][cn]) {
						$p[mgr][cn].load_array(res[mgr][cn], changes.update_only ? "update_only" : true);
					}
				}
			}

			return true;
		}

		return false;
	}

	/**
  * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
  * @method backup_database
  * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
  * @async
  */
	backup_database(do_zip) {}

	// получаем строку create_tables

	// получаем строки для каждой таблицы

	// складываем все части в файл


	/**
  * Восстанавливает базу из архивной копии
  * @method restore_database
  * @async
  */
	restore_database(do_zip) {

		// получаем строку create_tables

		// получаем строки для каждой таблицы

		// складываем все части в файл
	}

}

function proto_data_obj($p) {

	const { classes, adapters } = $p;

	Object.defineProperties(classes.DataObj.prototype, {

		/**
   * Устанавливает новый номер документа или код справочника
   */
		new_number_doc: {

			value: function (prefix) {

				if (!this._metadata().code_length) {
					return Promise.resolve(this);
				}

				// если не указан явно, рассчитываем префикс по умолчанию
				const { current_user, wsql } = $p;
				const { date, organization, _manager } = this;
				if (!prefix) {
					prefix = (current_user && current_user.prefix || "") + (organization && organization.prefix || "");
				}

				let obj = this,
				    part = "",
				    year = date instanceof Date ? date.getFullYear() : 0,
				    code_length = this._metadata().code_length - prefix.length;

				// для кешируемых в озу, вычисляем без индекса
				if (this._manager.cachable == "ram") {
					return Promise.resolve(this.new_cat_id(prefix));
				}

				return adapters.pouch.db(_manager).query("doc/number_doc", {
					limit: 1,
					include_docs: false,
					startkey: [_manager.class_name, year, prefix + '\ufff0'],
					endkey: [_manager.class_name, year, prefix],
					descending: true
				}).then(res => {
					if (res.rows.length) {
						const num0 = res.rows[0].key[2];
						for (var i = num0.length - 1; i > 0; i--) {
							if (isNaN(parseInt(num0[i]))) break;
							part = num0[i] + part;
						}
						part = (parseInt(part || 0) + 1).toFixed(0);
					} else {
						part = "1";
					}
					while (part.length < code_length) part = "0" + part;

					if (obj instanceof classes.DocObj || obj instanceof classes.TaskObj || obj instanceof classes.BusinessProcessObj) obj.number_doc = prefix + part;else obj.id = prefix + part;

					return obj;
				});
			}
		},

		new_cat_id: {

			value: function (prefix) {

				const { current_user, wsql } = $p;
				const { organization, _manager } = this;

				if (!prefix) prefix = (current_user && current_user.prefix || "") + (organization && organization.prefix ? organization.prefix : wsql.get_user_param("zone") + "-");

				let code_length = this._metadata().code_length - prefix.length,
				    field = this instanceof classes.DocObj || this instanceof classes.TaskObj || this instanceof classes.BusinessProcessObj ? "number_doc" : "id",
				    part = "",
				    res = wsql.alasql("select top 1 " + field + " as id from ? where " + field + " like '" + prefix + "%' order by " + field + " desc", [_manager.alatable]);

				if (res.length) {
					const num0 = res[0].id || "";
					for (var i = num0.length - 1; i > 0; i--) {
						if (isNaN(parseInt(num0[i]))) break;
						part = num0[i] + part;
					}
					part = (parseInt(part || 0) + 1).toFixed(0);
				} else {
					part = "1";
				}
				while (part.length < code_length) part = "0" + part;

				this[field] = prefix + part;

				return this;
			}
		}
	});
}

const plugin = {

	constructor() {

		Object.defineProperty(this.adapters, 'pouch', { value: new AdapterPouch(this) });
		Object.defineProperty(this.classes, 'PouchDB', { value: PouchDB });

		proto_data_obj(this);
	}
};
exports.default = plugin;
