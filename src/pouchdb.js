/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author  Evgeniy Malyarov
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @module common
 * @submodule pouchdb
 */

/**
 * Интерфейс локальной и сетевой баз данных PouchDB
 * @class Pouch
 * @static
 */
function Pouch(){

	var t = this, _local, _remote, _auth,
		_zone = $p.wsql.get_user_param("zone", "number"),
		_prefix = $p.job_prm.local_storage_prefix;

	function run_sync(local, remote, id){
		return local.info()
			.then(function () {
				return remote.info()
			})
			.then(function (linfo) {
				return _local.sync[id] = local.sync(remote, {
					live: true,
					retry: true
				}).on('change', function (change) {
					// yo, something changed!
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
			});
	}

	t.__define({

		local: {
			get: function () {
				if(!_local){
					_local = {
						cat: new PouchDB(_prefix + _zone + "_cat", {auto_compaction: true, revs_limit: 2}),
						doc: new PouchDB(_prefix + _zone + "_doc", {auto_compaction: true, revs_limit: 2}),
						meta: new PouchDB(_prefix + "meta", {auto_compaction: true}),
						sync: {}
					}
				}
				if($p.job_prm.couchdb && !_local._meta){
					_local._meta = new PouchDB($p.job_prm.couchdb + "meta", {
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
						cat: new PouchDB($p.job_prm.couchdb + _zone + "_cat", {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						}),
						doc: new PouchDB($p.job_prm.couchdb + _zone + "_doc", {
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
		authenticate: {
			value: function (username, password) {

				// реквизиты гостевого пользователя для демобаз
				if(username == undefined && password == undefined){
					username = $p.job_prm.guest_name;
					password = $p.job_prm.guest_pwd;
				}

				if(_auth && _auth.username == username)
					return Promise.resolve();

				// переподключение под другим пользователем
				if(_auth && _auth.username != username){
					if(_local.sync.cat)
						_local.sync.cat.cancel();
					if(_local.sync.doc)
						_local.sync.doc.cancel();
				}

				if(_remote && _remote.cat)
					delete _remote.cat;

				if(_remote && _remote.doc)
					delete _remote.doc;

				_remote = null;

				return $p.ajax.get_ex($p.job_prm.couchdb + _zone + "_cat", {username: username, password: password})
					.then(function (req) {
						_auth = {username: username, password: password};
						return JSON.parse(req.response);
					});
			}
		},

		/**
		 * Загружает условно-постоянные данные из базы cat в alasql
		 */
		load_data: {
			value: function () {

				var options = {
					limit : 100,
					include_docs: true
				};

				// бежим по всем документам из cat
				return new Promise(function(resolve, reject){

					function fetchNextPage() {
						t.local.cat.allDocs(options, function (err, response) {

							if (response) {

								if (response.rows.length > 0) {
									options.startkey = response.rows[response.rows.length - 1].key;
									options.skip = 1;

									var res = {}, cn;
									response.rows.forEach(function (rev) {
										cn = rev.doc.class_name.split(".");
										rev.doc.ref = rev.doc._id;
										delete rev.doc.class_name;
										delete rev.doc._id;
										delete rev.doc._rev;
										if(!res[cn[0]])
											res[cn[0]] = {};
										if(!res[cn[0]][cn[1]])
											res[cn[0]][cn[1]] = [];
										res[cn[0]][cn[1]].push(rev.doc);
									});

									for(var mgr in res){
										for(cn in res[mgr])
											if($p[mgr][cn])
												$p[mgr][cn].load_array(res[mgr][cn]);
									}
									response = null;
									res	= null;

									fetchNextPage();

								} else
									resolve();

							} else if(err)
								reject(err);

						});
					}

					fetchNextPage();

				});

			}
		},

		/**
		 * Запускает процесс синхронизвации
		 */
		run_sync: {
			value: function (local, remote, id) {
				return t.authenticate()
					.then(function () {
						return run_sync(local, remote, id);
					});
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
