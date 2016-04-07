/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

/**
 * Интерфейс локальной и сетевой баз данных PouchDB
 * @class Pouch
 * @static
 */
function Pouch(){

	var t = this, _local, _remote, _auth, _data_loaded,
		_couch_path = $p.wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
		_zone = $p.wsql.get_user_param("zone", "number"),
		_prefix = $p.job_prm.local_storage_prefix,
		_suffix = $p.wsql.get_user_param("couch_suffix", "string") || "";

	if(_couch_path && _couch_path.indexOf("http") != 0)
		_couch_path = location.protocol + "//" + location.host + _couch_path;



	function run_sync(local, remote, id){

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
							$p.wsql.set_user_param("couch_ram_data_version", v.version);
							rinfo = t.reset_local_data();
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

				if(id == "ram" && linfo.doc_count < 10){
					// широковещательное оповещение о начале загрузки локальных данных
					_page = {
						total_rows: rinfo.doc_count,
						local_rows: linfo.doc_count,
						docs_written: 0,
						limit: 100,
						page: 0,
						start: Date.now()
					};
					$p.eve.callEvent("pouch_load_data_start", [_page]);

				}

				var method = (id == "ram" || id == "meta") ? local.replicate.from : local.sync;
				_local.sync[id] = method(remote, {
					live: true,
					retry: true
				});

				_local.sync[id]
					.on('change', function (change) {
						// yo, something changed!
						if(id == "ram"){
							t.load_changes(change);

							if(linfo.doc_count < 10){

								// широковещательное оповещение о загрузке порции данных
								_page.page++;
								_page.docs_written = change.docs_written;
								_page.duration = Date.now() - _page.start;
								$p.eve.callEvent("pouch_load_data_page", [_page]);

								if(_page.docs_written >= _page.total_rows){

									// широковещательное оповещение об окончании загрузки локальных данных
									console.log(_page);
									_data_loaded = true;
									$p.eve.callEvent("pouch_load_data_loaded", [_page]);
								}

							}
						}
						$p.eve.callEvent("pouch_change", [id, change]);

					}).on('paused', function (info) {
					// replication was paused, usually because of a lost connection
					if(info)
						$p.eve.callEvent("pouch_paused", [id, info]);

				}).on('active', function (info) {
					// replication was resumed
					$p.eve.callEvent("pouch_active", [id, info]);

				}).on('denied', function (info) {
					// a document failed to replicate, e.g. due to permissions
					$p.eve.callEvent("pouch_denied", [id, info]);

				}).on('complete', function (info) {
					// handle complete
					$p.eve.callEvent("pouch_complete", [id, info]);

				}).on('error', function (err) {
					// totally unhandled error (shouldn't happen)
					$p.eve.callEvent("pouch_error", [id, err]);

				});

				return _local.sync[id];
			});
	}

	t.__define({

		local: {
			get: function () {
				if(!_local){
					_local = {
						ram: new PouchDB(_prefix + _zone + "_ram", {auto_compaction: true, revs_limit: 2}),
						doc: new PouchDB(_prefix + _zone + "_doc", {auto_compaction: true, revs_limit: 2}),
						meta: new PouchDB(_prefix + "meta", {auto_compaction: true}),
						sync: {}
					}
				}
				if(_couch_path && !_local._meta){
					_local._meta = new PouchDB(_couch_path + "meta", {
						auth: {
							username: "guest",
							password: "meta"
						},
						skip_setup: true
					});
					run_sync(_local.meta, _local._meta, "meta");
				}
				return _local;
			}
		},

		remote: {
			get: function () {
				if(!_remote && _auth){
					_remote = {
						ram: new PouchDB(_couch_path + _zone + "_ram", {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						}),
						doc: new PouchDB(_couch_path + _zone + "_doc" + _suffix, {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						})
					}
				}
				return _remote;
			}
		},

		/**
		 * Выполняет авторизацию
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
						return Promise.reject();
				}

				return $p.ajax.get_ex(_couch_path + _zone + "_ram", {username: username, password: password})
					.then(function (req) {
						_auth = {username: username, password: password};
						setTimeout(function () {
							dhx4.callEvent("log_in", [username]);
						});
						return {ram: run_sync(t.local.ram, t.remote.ram, "ram"), doc: run_sync(t.local.doc, t.remote.doc, "doc")};
					});
			}
		},

		/**
		 * Останавливает синхронизации и снимает признак авторизованности
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

				dhx4.callEvent("log_out");
			}
		},

		/**
		 * Уничтожает локальные данные
		 */
		reset_local_data: {
			value: function () {

				var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
					destroy_doc = t.local.doc.destroy.bind(t.local.doc),
					do_reload = function (){
						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 2000);
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
		 * Загружает условно-постоянные данные из базы ram в alasql
		 */
		load_data: {
			value: function () {

				var options = {
					limit : 100,
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
								$p.eve.callEvent("pouch_load_data_page", [_page]);

								if (t.load_changes(response, options))
									fetchNextPage();
								 else{
									resolve();
									// широковещательное оповещение об окончании загрузки локальных данных
									console.log(_page);
									_data_loaded = true;
									$p.eve.callEvent("pouch_load_data_loaded", [_page]);
								}

							} else if(err){
								reject(err);
								// широковещательное оповещение об ошибке загрузки
								$p.eve.callEvent("pouch_load_data_error", [err]);
							}

						});
					}

					t.local.ram.info()
						.then(function (info) {
							if(info.doc_count > 10){
								// широковещательное оповещение о начале загрузки локальных данных
								$p.eve.callEvent("pouch_load_data_start", [_page]);
								fetchNextPage();
							}else{
								$p.eve.callEvent("pouch_load_data_error", [info]);
								reject(info);
							}
						});
				});

			}
		},

		/**
		 * Информирует об авторизованности на сервере CouchDB
		 */
		authorized: {
			get: function () {
				return _auth && _auth.username;
			}
		},


		/**
		 * Информирует о загруженности данных
		 */
		data_loaded: {
			get: function () {
				return !!_data_loaded;
			}
		},

		/**
		 * Запускает процесс синхронизвации
		 */
		run_sync: {
			value: function (local, remote, id) {
				return run_sync(local, remote, id);
			}
		},

		/**
		 * Читает объект из pouchdb
		 * @return {Promise.<DataObj>} - промис с загруженным объектом
		 */
		load_obj: {
			value: function (tObj) {

				return tObj._manager.pouch_db.get(tObj._manager.class_name + "|" + tObj.ref)
					.then(function (res) {
						delete res._id;
						delete res._rev;
						tObj._mixin(res)._set_loaded();
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function (res) {
						return tObj;
					});
			}
		},

		/**
		 * Записывает объект в pouchdb
		 * @return {Promise.<DataObj>} - промис с записанным объектом
		 */
		save_obj: {
			value: function (tObj, attr) {

				var tmp = tObj._obj._clone(),
					db = tObj._manager.pouch_db;
				
				tmp._id = tObj._manager.class_name + "|" + tObj.ref;
				delete tmp.ref;

				if(attr.attachments)
					tmp._attachments = attr.attachments;

				return (tObj.is_new() ? Promise.resolve() : db.get(tmp._id))
					.then(function (res) {
						if(res){
							tmp._rev = res._rev;
							for(var att in res._attachments){
								if(!tmp._attachments)
									tmp._attachments = {};
								if(!tmp._attachments[att])
									tmp._attachments[att] = res._attachments[att];
							}
						}
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function () {
						return db.put(tmp);
					})
					.then(function () {
						
						if(tObj.is_new())
							tObj._set_loaded(tObj.ref);
						
						if(tmp._attachments){
							if(!tObj._attachments)
								tObj._attachments = {};
							for(var att in tmp._attachments){
								if(!tObj._attachments[att] || !tmp._attachments[att].stub)
									tObj._attachments[att] = tmp._attachments[att];
							}
						}
						
						tmp = null;
						attr = null;
						return tObj;
					});
			}
		},

		/**
		 * Загружает в менеджер изменения или полученные через allDocs данные
		 */
		load_changes: {
			value: function(changes, options){

				var docs, doc, res = {}, cn, key;

				if(!options){
					if(changes.direction){
						if(changes.direction != "pull")
							return;
						docs = changes.change.docs;
					}else
						docs = changes.docs;

				}else
					docs = changes.rows;

				if (docs.length > 0) {
					if(options){
						options.startkey = docs[docs.length - 1].key;
						options.skip = 1;
					}

					docs.forEach(function (rev) {
						doc = options ? rev.doc : rev;
						if(!doc){
							if((rev.value && rev.value.deleted))
								doc = {
									_id: rev.id,
									_deleted: true
								};
							else if(rev.error)
								return;
						}
						key = doc._id.split("|");
						cn = key[0].split(".");
						doc.ref = key[1];
						delete doc._id;
						delete doc._rev;
						if(!res[cn[0]])
							res[cn[0]] = {};
						if(!res[cn[0]][cn[1]])
							res[cn[0]][cn[1]] = [];
						res[cn[0]][cn[1]].push(doc);
					});

					for(var mgr in res){
						for(cn in res[mgr])
							if($p[mgr] && $p[mgr][cn])
								$p[mgr][cn].load_array(res[mgr][cn], true);
					}

					res	= changes = docs = doc = null;
					return true;
				}

				return false;
			}
		},

		/**
		 * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
		 * @method backup_database
		 * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
		 * @async
		 */

		backup_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}
		},

		/**
		 * Восстанавливает базу из архивной копии
		 * @method restore_database
		 * @async
		 */
		restore_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}

		}

	});

}


