/**
 * Методы, используемые сервером metadata (postgres + nodejs)
 *
 * Created 16.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author Evgeniy Malyarov
 * @module server
 */


/**
 * Читает данные из файла (только в Node.js)
 * @param filename
 * @return {Promise}
 */
$p.from_file = function(filename){
	return new Promise(function(resolve, reject){
		require('fs').readFile(filename, { encoding:'utf8' }, function(err, dataFromFile){
			if(err){
				reject(err);
			} else {
				resolve(dataFromFile.toString().trim());
			}
		});
	});
}

/**
 * Запускает процесс инициализации сервера
 *
 * @param alasql - указатель на экземпляр alasql используется вместо require(), чтобы работать с изменённой библиотекой
 * @return {Promise.<T>}
 */
$p.eve.init_node = function (alasql) {

	$p.job_prm = new $p.JobPrm();

	var data_url = $p.job_prm.data_url || "/data/",
		pg_drv = require('pg');

	// читаем в каталоге данных файлы создания таблиц и описания метаданных
	return $p.from_file(data_url + 'create_tables.sql')
		.then(function (sql) {
			return $p.wsql.init_params(alasql, sql);
		})
		.then(function() {
			return $p.from_file(data_url + 'meta.json');
		})
		.then(function(meta) {
			return $p.from_file(data_url + 'meta_patch.json')
				.then(function (patch) {
					return [JSON.parse(meta), JSON.parse(patch)]
				})
		})
		.then(function(meta) {

			// создаём объект описания метаданных
			return new $p.Meta(meta[0], meta[1]);
		})
		.then(function () {

			// инициализируем драйвер postgres
			if($p.job_prm.pg_cnn){

				function pg_connect (pg_callback) {
					return pg_drv.connect($p.job_prm.pg_cnn, pg_callback);
				};

				/**
				 * Выполняет запрос к postgres.
				 * Создаёт новое соединение на время выполнения запроса и закрывет его по завершении
				 * @param sql
				 * @param params
				 * @return {Promise}
				 */
				$p.wsql.postgres = function (sql, params) {

					return new Promise(function(resolve, reject){

						if(!sql){
							resolve({rows: []});
							return;
						}

						if(!params)
							params = [];

						pg_connect(function(err, client, done) {

							if(err){
								reject(err);
								return;
							}

							client.query(sql, params, function(err, result) {

								if(err){
									done();
									reject(err);
									return;
								}

								resolve(result);

							});
						});

					});

				}

				/**
				 * Вызывает в callback соединение postgres.
				 * Используется в случае, когда надо выполнить пачку запросов в контексте одного соединения
				 * @type {pg_connect}
				 */
				$p.wsql.postgres.connect = pg_connect;
			}

			// читаем скрипт создания таблиц postgres
			return $p.from_file(data_url + 'create_tables_pg.sql');

		})
		.then(function (sql) {

			// пересоздаём таблицы postgres
			return $p.wsql.postgres(sql);

		});

};


/**
 * Загружает из 1С все элементы данного типа
 */
DataManager.prototype.load_full = function(){

	var t = this,
		cmd = t.metadata(),
		attr = {};

	// получаем список ссылок
	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : t.rest_name) + "?allowedOnly=true&$format=json&$top=10000&$select=Ref_Key";
	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (refs) {
			// получаем списко пакетов блоками по 50 ссылок
			var packets = [],
				packet = [],
				packet_size = 50,
				i = 1;
			refs.value.forEach(function (v) {
				packet.push(v.Ref_Key);
				if(i == packet_size){
					i = 1;
					packets.push(packet);
					packet = [];
				}
				i++;
			})
			if(packets.indexOf(packet) == -1)
				packets.push(packet);
			return packets;
		})
		.then(function (packets) {
			// здесь можно было бы применить packets.reduce() или Promise.all(),
			// но нам нужно неспешное последовательное выполнение

			return new Promise(function(resolve, reject){

				var index = 0;

				// движемся по списку пачкой в n элементов
				function iteration(){

					t.load_cached_server_array(packets[index])
						.then(function () {

							index++;
							if(index < packets.length)
								setTimeout(iteration, 1000);
							else
								resolve();
						})
						.catch(reject)
				}

				iteration();

			});

		})




};

/**
 * Загружает все элементы из postgres
 */
RefDataManager.prototype.from_postgres = function(){


};

/**
 * Сохраняет все элементы в postgres
 */
RefDataManager.prototype.to_postgres = function(){


};