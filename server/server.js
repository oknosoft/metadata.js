/**
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  server
 */

var argv = process.argv,
	attr = argv.length > 2 ? argv[2] : 'settings.json';

alasql = require('../lib/alasql/alasql.js');

function parser(filename, callback){

	require('fs').readFile(filename, { encoding:'utf8' }, function(err, dataFromFile){

		if(err){
			callback(err);
		} else {
			try {
				callback(null, JSON.parse(dataFromFile.toString().trim()));
			}
			catch (e){
				callback(e)
			}
		}

	});
}



parser(attr, function(err, data){

	if(err){
		throw (err);
	}

	attr = data;
	data = null;

	// metadata.js
	attr.$p = require('../lib/metadata.core.js');

	attr.$p.settings = function (prm, modifiers) {

		// для транспорта используем rest, а не сервис http
		prm.rest = true;
		prm.irest_enabled = true;
		prm.offline = false;

		// разделитель для localStorage
		prm.local_storage_prefix = "adm_";

		// расположение rest-сервиса 1c
		prm.rest_path = attr["1c"].odata;

		// по умолчанию, обращаемся к зоне %%%
		prm.zone = 0;

		// расположение файлов данных
		prm.data_url = "data/";

		// расположение файла инициализации базы sql
		//prm.create_tables = true;
		//prm.create_tables_sql = require('create_tables');

	};
	attr.$p.job_prm = new $p.JobPrm();

	$p.wsql.init_params()
		.then(function(){

			// метаданные интеграции
			parser("integration.meta.json", function(err, data){

				new attr.$p.Meta(data);

				// request
				attr.http.request = require('request');

				// авторизация в 1С
				attr["1c"].auth = "Basic " + new Buffer(attr["1c"].username + ":" + attr["1c"].password).toString("base64");

				// http
				attr.http.http = require('http');

				// драйвер PostgreSQL
				attr.pg.drv = require('pg');

				// если указано использование сокетов - инициализируем
				if(attr.http["socket"])
					require('./http_socket.js')(attr);

				// если указано использование взаимодействия с 1С - инициализируем
				if(attr.http["1c"])
					require('./http_1c.js')(attr);

				// если указано использование административного интерфейса - инициализируем
				if(attr.http["adm"])
					require('./http_adm.js')(attr);

			});

		});

});