/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

const alasql = require("alasql/dist/alasql.js")

const PouchDB = require('pouchdb-core')
		.plugin(require('pouchdb-adapter-http'))
		.plugin(require('pouchdb-replication'))
		.plugin(require('pouchdb-mapreduce'))
		.plugin(require('pouchdb-authentication')),
	pouchdb_memory = require('pouchdb-adapter-memory'),
	pouchdb_idb = require('pouchdb-adapter-idb')

if(alasql.utils.isNode)
	PouchDB.plugin(pouchdb_memory)
else
	PouchDB.plugin(pouchdb_idb)


/**
 * ### Интерфейс локальной и сетевой баз данных PouchDB
 * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
 *
 * @class Pouch
 * @static
 * @menuorder 34
 * @tooltip Данные pouchdb
 */
class Pouch{

	constructor($p){

		var t = this,
			_paths = {},
			_local, _remote, _auth, _data_loaded;

		Object.defineProperties(this, {

			init: {

				value: function (attr) {

					Object.assign(_paths, attr);

					if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined")
						_paths.path = location.protocol + "//" + location.host + _paths.path;
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
					if(!_local){
						var opts = {auto_compaction: true, revs_limit: 2};
						_local = {
							ram: new PouchDB(_paths.prefix + _paths.zone + "_ram", opts),
							doc: new PouchDB(_paths.prefix + _paths.zone + "_doc", opts),
							meta: new PouchDB(_paths.prefix + "meta", opts),
							sync: {}
						}
					}
					if(_paths.path && !_local._meta){
						_local._meta = new PouchDB(_paths.path + "meta", {
							auth: {
								username: "guest",
								password: "meta"
							},
							skip_setup: true
						});
						t.run_sync(_local.meta, _local._meta, "meta");
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
					if(!_remote){
						_remote = {
							ram: new PouchDB(_paths.path + _paths.zone + "_ram", { skip_setup: true }),
							doc: new PouchDB(_paths.path + _paths.zone + "_doc" + _paths.suffix, { skip_setup: true })
						}
					}
					return _remote;
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
					if(username == undefined && password == undefined){
						username = $p.job_prm.guest_name;
						password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
					}

					if(_auth){
						if(_auth.username == username)
							return Promise.resolve();
						else
							return Promise.reject(new Error("need logout first"));
					}


					return this.remote.ram.login(username, password)
						.then(() => _remote.doc.login(username, password))
						.then(function (req) {
							_auth = {username: username, password: password};
							setTimeout(() => { $p.store.dispatch(user_log_in(username)) });
							return {
								ram: t.run_sync(t.local.ram, t.remote.ram, "ram"),
								doc: t.run_sync(t.local.doc, t.remote.doc, "doc")
							}
						})
				}
			},

			/**
			 * ### Останавливает синхронизации и снимает признак авторизованности
			 * @method log_out
			 */
			log_out: {
				value: function () {

					if(_auth){
						if(_local.sync.doc){
							try{
								_local.sync.doc.cancel();
							}catch(err){}
						}
						if(_local.sync.ram){
							try{
								_local.sync.ram.cancel();
							}catch(err){}
						}
						_auth = null;
					}

					if(_remote && _remote.ram)
						delete _remote.ram;

					if(_remote && _remote.doc)
						delete _remote.doc;

					_remote = null;

					$p.store.dispatch(user_log_out())
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
						do_reload = function (){
							setTimeout(function () {
								$p.eve.redirect = true;
								location.reload(true);
							}, 1000);
						};

					t.log_out();

					setTimeout(function () {
						destroy_ram()
							.then(destroy_doc)
							.catch(destroy_doc)
							.then(do_reload)
							.catch(do_reload);
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
							limit : 200,
							include_docs: true
						},
						_page = {
							total_rows: 0,
							limit: options.limit,
							page: 0,
							start: Date.now()
						};

					// бежим по всем документам из ram
					return new Promise(function(resolve, reject){

						function fetchNextPage() {
							t.local.ram.allDocs(options, function (err, response) {

								if (response) {

									// широковещательное оповещение о загрузке порции локальных данных
									_page.page++;
									_page.total_rows = response.total_rows;
									_page.duration = Date.now() - _page.start;

									$p.store.dispatch(pouch_data_page(_page))

									if (t.load_changes(response, options))
										fetchNextPage();
									else{
										resolve();
										// широковещательное оповещение об окончании загрузки локальных данных
										_data_loaded = true;

										$p.store.dispatch(pouch_data_loaded(_page))

									}

								} else if(err){
									reject(err);
									// широковещательное оповещение об ошибке загрузки
									$p.store.dispatch(pouch_data_error("ram", err))
								}
							});
						}

						t.local.ram.info()
							.then(function (info) {
								if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){

									// широковещательное оповещение о начале загрузки локальных данных
									$p.store.dispatch(pouch_load_start(_page))

									fetchNextPage();

								}else{

									$p.store.dispatch(pouch_no_data("ram", info))
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
				value: function (local, remote, id){

					var linfo, _page;

					return local.info()
						.then(function (info) {

							linfo = info;
							return remote.info()

						})
						.then(function (rinfo) {

							// для базы "ram", сервер мог указать тотальную перезагрузку данных
							// в этом случае - очищаем базы и перезапускаем браузер
							if(id != "ram")
								return rinfo;

							return remote.get("data_version")
								.then(function (v) {
									if(v.version != $p.wsql.get_user_param("couch_ram_data_version")){

										// если это не первый запуск - перезагружаем
										if($p.wsql.get_user_param("couch_ram_data_version"))
											rinfo = t.reset_local_data();

										// сохраняем версию в localStorage
										$p.wsql.set_user_param("couch_ram_data_version", v.version);

									}
									return rinfo;
								})
								.catch(function (err) {
									$p.record_log(err);
								})
								.then(function () {
									return rinfo;
								});

						})
						.then(function (rinfo) {

							if(!rinfo)
								return;

							if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){

								// широковещательное оповещение о начале загрузки локальных данных
								_page = {
									total_rows: rinfo.doc_count,
									local_rows: linfo.doc_count,
									docs_written: 0,
									limit: 200,
									page: 0,
									start: Date.now()
								};
								$p.store.dispatch(pouch_load_start(_page))

							}else if(id == "doc"){
								// широковещательное оповещение о начале синхронизации базы doc
								setTimeout(function () {
									$p.store.dispatch(pouch_sync_start(_page))
								});
							}

							// ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
							var options = {
								live: true,
								retry: true,
								batch_size: 200,
								batches_limit: 8
							};

							// если указан клиентский или серверный фильтр - подключаем
							if(id == "meta"){
								options.filter = "auth/meta";

							}else if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]){
								options.filter = $p.job_prm.pouch_filter[id];
							}

							if(id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo){
								_local.sync[id] = local.replicate.from(remote, options);
							}else{
								_local.sync[id] = local.sync(remote, options);
							}

							_local.sync[id]
								.on('change', function (change) {
									// yo, something changed!
									if(id == "ram"){
										t.load_changes(change);

										if(linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){

											// широковещательное оповещение о загрузке порции данных
											_page.page++;
											_page.docs_written = change.docs_written;
											_page.duration = Date.now() - _page.start;

											$p.store.dispatch(pouch_data_page(_page))

											if(_page.docs_written >= _page.total_rows){

												// широковещательное оповещение об окончании загрузки локальных данных
												_data_loaded = true;
												$p.store.dispatch(pouch_data_loaded(_page))

											}

										}
									}else{
										change.update_only = true;
										t.load_changes(change);
									}

									$p.store.dispatch(pouch_change(id, change))

								})
								.on('paused', function (info) {
									// replication was paused, usually because of a lost connection
									//$p.eve.callEvent("pouch_paused", [id, info]);
									$p.store.dispatch(pouch_sync_error(id, info))

								})
								.on('active', function (info) {
									// replication was resumed
									//$p.eve.callEvent("pouch_active", [id, info]);
									$p.store.dispatch(pouch_sync_error(id, info))

								})
								.on('denied', function (info) {
									// a document failed to replicate, e.g. due to permissions
									//$p.eve.callEvent("pouch_denied", [id, info]);
									$p.store.dispatch(pouch_sync_error(id, info))


								})
								.on('error', function (err) {
									// totally unhandled error (shouldn't happen)
									$p.store.dispatch(pouch_sync_error(id, err))

							});

							return _local.sync[id];
						});
				}
			}

		})

	}

	/**
	 * ### Читает объект из pouchdb
	 *
	 * @method load_obj
	 * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
	 * @return {Promise.<DataObj>} - промис с загруженным объектом
	 */
	load_obj(tObj) {

		return tObj._manager.pouch_db.get(tObj._manager.class_name + "|" + tObj.ref)
			.then(function (res) {
				delete res._id;
				delete res._rev;
				tObj._mixin(res)._set_loaded();
			})
			.catch(function (err) {
				if (err.status != 404)
					throw err;
			})
			.then(function (res) {
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

		var tmp = tObj._obj._clone(),
			db = tObj._manager.pouch_db;

		tmp._id = tObj._manager.class_name + "|" + tObj.ref;
		delete tmp.ref;

		if (attr.attachments)
			tmp._attachments = attr.attachments;

		return (tObj.is_new() ? Promise.resolve() : db.get(tmp._id))
			.then(function (res) {
				if (res) {
					tmp._rev = res._rev;
					for (var att in res._attachments) {
						if (!tmp._attachments)
							tmp._attachments = {};
						if (!tmp._attachments[att])
							tmp._attachments[att] = res._attachments[att];
					}
				}
			})
			.catch(function (err) {
				if (err.status != 404)
					throw err;
			})
			.then(function () {
				return db.put(tmp);
			})
			.then(function () {

				if (tObj.is_new())
					tObj._set_loaded(tObj.ref);

				if (tmp._attachments) {
					if (!tObj._attachments)
						tObj._attachments = {};
					for (var att in tmp._attachments) {
						if (!tObj._attachments[att] || !tmp._attachments[att].stub)
							tObj._attachments[att] = tmp._attachments[att];
					}
				}

				tmp = null;
				attr = null;
				return tObj;
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

		var docs, doc, res = {}, cn, key;

		if (!options) {
			if (changes.direction) {
				if (changes.direction != "pull")
					return;
				docs = changes.change.docs;
			} else
				docs = changes.docs;

		} else
			docs = changes.rows;

		if (docs.length > 0) {
			if (options) {
				options.startkey = docs[docs.length - 1].key;
				options.skip = 1;
			}

			docs.forEach(function (rev) {
				doc = options ? rev.doc : rev;
				if (!doc) {
					if ((rev.value && rev.value.deleted))
						doc = {
							_id: rev.id,
							_deleted: true
						};
					else if (rev.error)
						return;
				}
				key = doc._id.split("|");
				cn = key[0].split(".");
				doc.ref = key[1];
				delete doc._id;
				delete doc._rev;
				if (!res[cn[0]])
					res[cn[0]] = {};
				if (!res[cn[0]][cn[1]])
					res[cn[0]][cn[1]] = [];
				res[cn[0]][cn[1]].push(doc);
			});

			for (var mgr in res) {
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
	backup_database(do_zip){

		// получаем строку create_tables

		// получаем строки для каждой таблицы

		// складываем все части в файл
	}


	/**
	 * Восстанавливает базу из архивной копии
	 * @method restore_database
	 * @async
	 */
	restore_database(do_zip){

		// получаем строку create_tables

		// получаем строки для каждой таблицы

		// складываем все части в файл
	}

}



