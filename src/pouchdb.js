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

	var t = this, _local, _remote, _auth;

	t.__define({

		local: {
			get: function () {
				if(!_local){
					_local = {
						cat: new PouchDB($p.job_prm.local_storage_prefix + "cat"),
						doc: new PouchDB($p.job_prm.local_storage_prefix + "doc")
					}
				}
				return _local;
			}
		},

		remote: {
			get: function () {
				if(!_remote && _auth){
					_remote = {
						cat: new PouchDB($p.job_prm.couchdb + "cat", {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						}),
						doc: new PouchDB($p.job_prm.couchdb + "doc", {
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
				if(_auth && _auth.username != username && _local.sync_cat)
					_local.sync_cat.cancel();

				if(_remote && _remote.cat)
					delete _remote.cat;

				if(_remote && _remote.doc)
					delete _remote.doc;

				_remote = null;

				return $p.ajax.get_ex($p.job_prm.couchdb + "cat", {username: username, password: password})
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

				var exclude = ["meta", "meta_patch", "sync"], keys = [], curr = [];

				// бежим по ключу всех документов
				return t.local.cat.allDocs()
					.then(function (doc) {
						doc.rows.forEach(function (rev) {
							if(exclude.indexOf(rev.id) == -1){
								curr.push({id: rev.id, rev: rev.value.rev});
								if(curr.length > 100){
									keys.push(curr);
									curr = [];
								}
							}
						});
						if(curr.length){
							keys.push(curr);
							curr = [];
						}
						doc	= null;

						// формируем пачку запросов по 100 документов
						keys.forEach(function (rev) {
							curr.push($p.wsql.pouch.local.cat.bulkGet({docs: rev}));
						});
						return $p.eve.reduce_promices(curr, function (result) {
							var res = {}, cn;
							result.results.forEach(function (rev) {
								if(rev.docs.length && (keys = rev.docs[0].ok)){
									cn = keys.class_name.split(".");
									keys.ref = keys._id;
									delete keys.class_name;
									delete keys._id;
									delete keys._rev;
									if(!res[cn[0]])
										res[cn[0]] = {};
									if(!res[cn[0]][cn[1]])
										res[cn[0]][cn[1]] = [];
									res[cn[0]][cn[1]].push(keys);
								};
							});

							for(var mgr in res){
								for(cn in res[mgr])
									if($p[mgr][cn])
										$p[mgr][cn].load_array(res[mgr][cn]);
							}
							result	= null;
							res	= null;
						});
					});
			}
		},

		/**
		 * Запускает процесс синхронизвации
		 */
		run_sync: {
			value: function () {

				t.authenticate()
					.then(function () {

						if(!_local.sync_cat)
							_local.sync_cat = t.local.cat.sync(t.remote.cat, {
								live: true,
								retry: true
							}).on('change', function (change) {
								// yo, something changed!
								$p.eve.callEvent("pouch_change", [change]);

							}).on('paused', function (info) {
								// replication was paused, usually because of a lost connection
								$p.eve.callEvent("pouch_paused", [info]);

							}).on('active', function (info) {
								// replication was resumed
								$p.eve.callEvent("pouch_active", [info]);

							}).on('denied', function (info) {
								// a document failed to replicate, e.g. due to permissions
								$p.eve.callEvent("pouch_denied", [info]);

							}).on('complete', function (info) {
								// handle complete
								$p.eve.callEvent("pouch_complete", [info]);

							}).on('error', function (err) {
								// totally unhandled error (shouldn't happen)
								$p.eve.callEvent("pouch_error", [err]);

							});

					})
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
