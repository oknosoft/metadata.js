/**
 * ### Реализует механизмы синхронизации с 1С
 * - Предоставляет по http список метаданных и синонимы
 * - Отвечает на post-запросы 1С для регистрации объектов и ссылок
 * - Закидывает в 1С изменёные со стороны веб-приложения объекты
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  http_1c
 */


module.exports = function (attr) {

	function srv_1c(request, response) {

		var rtext="";

		function end_error(response, err, text, done){

			if(done)
				done();

			response.statusCode = 500;
			response.end(text);
			return console.error(text, err);
		}

		/**
		 * Регистрирует объект в таблице изменений
		 */
		function reg_from_1c() {

			var robj, ref;

			try {
				robj = JSON.parse(rtext);
				if($p.is_empty_guid(ref = $p.fix_guid(robj.obj.ref)))
					return;

			} catch (err){
				return console.error('JSON.parse', err);
			};

			// оповещаем клиентов об изменениях
			if(attr.http.socket)
				attr.http.socket.broadcast(rtext);

			attr.pg.drv.connect(attr.pg.cnn, function(err, client, done) {

				if(err)
					return console.error('error fetching client from pool', err);

				client.query('SELECT 1 from changes where zone=$1 and ref=$2;', [robj.zone, ref], function(err, result) {
					if(err){
						done();
						return console.error('error running query', err);
					}

					if(result.rows.length){
						client.query('UPDATE changes SET lc_changed=$3, class_name=$4, obj=$5 WHERE zone=$1 and ref=$2;',
							[robj.zone, ref, robj.lc_changed, robj.class_name, robj.obj], function(err, result) {
								done();
								if(err)
									return console.error('error running query', err);

							});

					}else{
						client.query('INSERT INTO changes (zone, ref, lc_changed, class_name, obj) VALUES ($1, $2, $3, $4, $5);',
							[robj.zone, ref, robj.lc_changed, robj.class_name, robj.obj], function(err, result) {
								done();
								if(err)
									return console.error('error running query', err);

							});
					}

				});
			});
		}

		function get_meta(response){

			attr.pg.drv.connect(attr.pg.cnn, function(err, client, done) {

				if(err)
					return end_error(response, err, "error fetching client from pool");

				client.query('SELECT * from meta;', [], function(err, result) {

					if(err)
						return end_error(response, err, "error running query", done);

					response.setHeader("Content-Type", "application/json");
					response.end(JSON.stringify(result.rows));

				});
			});
		}

		function get_syns(){

		}

		if(request.method == "POST"){
			request.on("data", function(chunk) {
				rtext+=chunk.toString();
			});

			request.on("end", function() {
				response.end("OK");
				reg_from_1c();
			});

		}else if(request.method == "GET"){
			if(request.url.startsWith("/syns")){
				response.end("200: "+request.url);

			} else if(request.url.startsWith("/meta")){
				get_meta(response);

			} else if(request.url.startsWith("/syns_and_meta")){
				response.end("200: "+request.url);

			} else if(request.url.startsWith("/fetch_meta")){
				response.end("200: "+request.url);
				attr["1c"].fetch_meta();

			}else{
				response.statusCode = 404;
				response.end("404: Not Found: "+request.url);
			}

		}

	}

	// сервер http для администрирования системы
	var port = attr.http["1c"];
	attr.http["1c"] = attr.http.http.createServer(srv_1c);
	attr.http["1c"].listen(port);

	// методы для вытягивания данных из 1С
	attr["1c"].fetch_meta = function () {

		// заполняем справочник ИдентификаторыОбъектовМетаданных
		var tattr = {
			fields: ["ref", "ПолноеИмя"],
			top: 10000,
			auth: attr["1c"].auth,
			request: attr.http.request
		};
		attr.$p.rest.load_array(tattr, attr.$p.cat.ИдентификаторыОбъектовМетаданных)
			.then(function (data) {
				attr.$p.cat.ИдентификаторыОбъектовМетаданных.load_array(data);
			})
			.then(function () {
				tattr = {
					top: 10000,
					auth: attr["1c"].auth,
					request: attr.http.request
				};
				return attr.$p.rest.load_array(tattr, attr.$p.ireg.ИнтеграцияМетаданные);
			})
			.then(function (data) {
				attr.$p.ireg.ИнтеграцияМетаданные.load_array(data);
			});



	}

};