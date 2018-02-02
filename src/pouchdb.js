/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

/**
 * ### Интерфейс локальной и сетевой баз данных PouchDB
 * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
 *
 * @class Pouch
 * @static
 * @menuorder 34
 * @tooltip Данные pouchdb
 */
function Pouch(){

	var t = this,
		_paths = {},
		_local, _remote, _auth, _data_loaded;

	t.__define({

		/**
		 * Конструктор PouchDB
		 */
		DB: {
			value: typeof PouchDB === "undefined" ?
				require('pouchdb-core')
					.plugin(require('pouchdb-adapter-memory'))
					.plugin(require('pouchdb-adapter-http'))
					.plugin(require('pouchdb-replication'))
					.plugin(require('pouchdb-mapreduce'))
					.plugin(require('pouchdb-find')) : PouchDB
		},

		init: {
			value: function (attr) {
				_paths._mixin(attr);
				if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined"){
					_paths.path = location.protocol + "//" + location.host + _paths.path;
				}
			}
		},

		/**
		 * ### Локальные базы PouchDB
		 *
		 * @property local
		 * @type {Object}
		 */
		local: {
			get: function () {
				if(!_local){
					var opts = {auto_compaction: true, revs_limit: 2};
          _local = {
            ram: new t.DB(_paths.prefix + _paths.zone + "_ram", opts),
            doc: _paths.direct ? t.remote.doc : new t.DB(_paths.prefix + _paths.zone + "_doc", opts),
            meta: new t.DB(_paths.prefix + "meta", opts),
            sync: {}
          }
				}
				if(_paths.path && !_local._meta){
					_local._meta = new t.DB(_paths.path + "meta", {skip_setup: true});
					t.run_sync(_local.meta, _local._meta, "meta");
				}
				return _local;
			}
		},

		/**
		 * ### Базы PouchDB на сервере
		 *
		 * @property remote
		 * @type {Object}
		 */
		remote: {
			get: function () {
				if(!_remote){
					var opts = {skip_setup: true, adapter: 'http'};
          _remote = {};
          $p.md.bases().forEach(function (db) {
            _remote[db] = db == 'ram' ?
              new t.DB(_paths.path + _paths.zone + "_" + db, opts) :
              new t.DB(_paths.path + _paths.zone + "_" + db + (_paths.suffix ? "_" + _paths.suffix : ""), opts)
          })
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
				if (username == undefined && password == undefined){
					if($p.job_prm.guests && $p.job_prm.guests.length) {
						username = $p.job_prm.guests[0].username;
						password = $p.aes.Ctr.decrypt($p.job_prm.guests[0].password);
					}else{
						return Promise.reject(new Error("username & password not defined"));
					}
				}

				if (_auth) {
					if (_auth.username == username){
						return Promise.resolve();
					} else {
						return Promise.reject(new Error("need logout first"));
					}
				}

				// авторизуемся во всех базах
				var bases = $p.md.bases(),
					try_auth = [];

				this.remote;

				bases.forEach(function(name){
					try_auth.push(
						_remote[name].login(username, password)
					)
				})

				return Promise.all(try_auth)
					.then(function (){

						_auth = {username: username};
						setTimeout(function(){

							// сохраняем имя пользователя в базе
							if($p.wsql.get_user_param("user_name") != username){
								$p.wsql.set_user_param("user_name", username)
							}

							// если настроено сохранение пароля - сохраняем и его
							if($p.wsql.get_user_param("enable_save_pwd")){
								if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password){
									$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password))   // сохраняем имя пользователя в базе
								}
							}
							else if($p.wsql.get_user_param("user_pwd") != ""){
								$p.wsql.set_user_param("user_pwd", "")
							}

							// излучаем событие
							$p.eve.callEvent('user_log_in', [username]);
						});

            try_auth.length = 0;
            bases.forEach(function(dbid) {
              if(t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]){
                try_auth.push(t.run_sync(t.local[dbid], t.remote[dbid], dbid));
              }
            });
            return Promise.all(try_auth);
					})
          .then(function () {
            // широковещательное оповещение об окончании загрузки локальных данных
            if(t.local._loading){
              return new Promise(function (resolve, reject) {
                $p.eve.attachEvent("pouch_data_loaded", resolve);
              });
            }
            else{
              return t.call_data_loaded();
            }
          })
					.catch(function(err) {
						// излучаем событие
						$p.eve.callEvent("user_log_fault", [err])
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

				$p.eve.callEvent("log_out");

				if(_paths.direct){
					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);
				}

				return _remote && _remote.ram ?
					_remote.ram.logout()
						.then(function () {
							if(_remote && _remote.doc){
								return _remote.doc.logout()
							}
						})
						.then(function () {
							if(_remote && _remote.ram){
								delete _remote.ram;
							}
							if(_remote && _remote.doc){
								delete _remote.doc;
							}
							_remote = null;
							$p.eve.callEvent("user_log_out")
						})
					:
					Promise.resolve();
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

    call_data_loaded: {
		  value: function (page) {
        _data_loaded = true;
        if(!page){
          page = _local.sync._page || {};
        }
        return $p.md.load_doc_ram().then(function () {
          setTimeout(function () {
            $p.eve.callEvent(page.note = "pouch_data_loaded", [page]);
          }, 1000);
        });
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
					limit : 800,
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
                  t.call_data_loaded(_page);
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
							if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){
								// широковещательное оповещение о начале загрузки локальных данных
								$p.eve.callEvent("pouch_load_data_start", [_page]);
                t.local._loading = true;
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
						if(id != "ram"){
              return rinfo;
            }

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

						if(!rinfo){
              return;
            }

            _page = {
              id: id,
              total_rows: rinfo.doc_count + rinfo.doc_del_count,
              local_rows: linfo.doc_count,
              docs_written: 0,
              limit: 200,
              page: 0,
              start: Date.now()
            };

            // широковещательное оповещение о начале загрузки локальных данных
						if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
							$p.eve.callEvent("pouch_load_data_start", [_page]);
						}
            // широковещательное оповещение о начале синхронизации базы doc
						else{
              $p.eve.callEvent("pouch_" + id + "_sync_start");
						}

            return new Promise(function(resolve, reject){

              // ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
              var options = {
                batch_size: 200,
                batches_limit: 6
              };

              function sync_events(sync, options) {

                return sync.on('change', function (change) {
                  // yo, something changed!

                  // широковещательное оповещение о загрузке порции данных
                  if(!_data_loaded && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
                    _page.page++;
                    _page.docs_written = change.docs_written;
                    _page.duration = Date.now() - _page.start;
                    $p.eve.callEvent("pouch_load_data_page", [_page]);
                  }

                  if(id != "ram"){
                    change.update_only = true;
                  }
                  t.load_changes(change);
                  $p.eve.callEvent("pouch_change", [id, change]);

                })
                  .on('paused', function (info) {
                    // replication was paused, usually because of a lost connection
                    $p.eve.callEvent("pouch_paused", [id, info]);
                  })
                  .on('active', function (info) {
                    // replication was resumed
                    $p.eve.callEvent("pouch_active", [id, info]);
                  })
                  .on('denied', function (info) {
                    // a document failed to replicate, e.g. due to permissions
                    $p.eve.callEvent("pouch_denied", [id, info]);
                  })
                  .on('complete', function (info) {
                    // handle complete
                    if(options){
                      options.live = true;
                      options.retry = true;

                      if(id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo){
                        _local.sync[id] = sync_events(local.replicate.from(remote, options));
                      }else{
                        _local.sync[id] = sync_events(local.sync(remote, options));
                      }
                      resolve(id);
                    }
                  })
                  .on('error', function (err) {
                    // totally unhandled error (shouldn't happen)
                    reject([id, err]);
                    $p.eve.callEvent("pouch_error", [id, err]);
                  });
              }

              // если указан клиентский или серверный фильтр - подключаем
              if(id == "meta"){
                options.filter = "auth/meta";
                options.live = true;
                options.retry = true;
              }
              else if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]){
                options.filter = $p.job_prm.pouch_filter[id];
              }

              sync_events(local.replicate.from(remote, options), options)

            });

					});
			}
		},

		/**
		 * ### Читает объект из pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
		 * @return {Promise.<DataObj>} - промис с загруженным объектом
		 */
		load_obj: {
			value: function (tObj) {

				return tObj._manager.pouch_db.get(tObj.class_name + "|" + tObj.ref)
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
		 * ### Записывает объект в pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - записываемый объект
		 * @param attr {Object} - ополнительные параметры записи
		 * @return {Promise.<DataObj>} - промис с записанным объектом
		 */
		save_obj: {
			value: function (tObj, attr) {

			  var _data = tObj._data;
        if(!_data || (_data._saving && !_data._modified)){
          return Promise.resolve(tObj);
        }
        if(_data._saving && _data._modified){
          return new Promise(function(resolve, reject) {
            setTimeout(function(){
              resolve(t.save_obj(tObj, attr));
            }, 100);
          });
        }
        _data._saving = true;

				var tmp = tObj._obj._clone(void 0, true),
					db = attr.db || tObj._manager.pouch_db;

        tmp.class_name = tObj.class_name;
				tmp._id = tmp.class_name + "|" + tObj.ref;
				delete tmp.ref;

				if(attr.attachments){
          tmp._attachments = attr.attachments;
        }

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
						if(err && err.status != 404){
              throw err;
            }
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

            delete _data._saving;
						return tObj;
					})
          .catch(function (err) {
            delete _data._saving;
            if(err && err.status != 404){
              throw err;
            }
          });
			}
		},

		/**
		 * ### Загружает в менеджер изменения или полученные через allDocs данные
		 *
		 * @method load_changes
		 * @param changes
		 * @param options
		 * @return {boolean}
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
				}
				else
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
						for(cn in res[mgr]){
							if($p[mgr] && $p[mgr][cn]){
								$p[mgr][cn].load_array(res[mgr][cn],
                  changes.update_only && $p[mgr][cn].cachable.indexOf("ram") == -1 ? "update_only" : true);
							}
						}
					}

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


