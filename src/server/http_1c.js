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
				if($p.utils.is_empty_guid(ref = $p.utils.fix_guid(robj.obj.ref)))
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
		$p.rest.load_array(tattr, $p.cat.ИдентификаторыОбъектовМетаданных)
			.then(function (data) {
				$p.cat.ИдентификаторыОбъектовМетаданных.load_array(data, true);
			})
			.then(function () {
				tattr = {
					top: 10000,
					auth: attr["1c"].auth,
					request: attr.http.request
				};
				return $p.rest.load_array(tattr, $p.ireg.ИнтеграцияМетаданные);
			})
			.then(function (data) {
				var o, im;
				for(var i in data){

					o = data[i];

					if($p.utils.is_guid(o.Объект)){
						o.ref = o.Объект;
						im = $p.cat.ИдентификаторыОбъектовМетаданных.get(o.ref);
						o.class_name = $p.md.class_name_from_1c(im.ПолноеИмя);

					}else{
						o.class_name = "enm." + o.Объект;
					}

					o.lc_changed_base = o.ДиапазонДат;
					o.cache = o.Кешировать ? 1 : 0;
					o.irest_enabled = o.РазрешенIREST;

					if(o.ТипРегистрации)
						o.reg_type = $p.enm.ИнтеграцияТипРегистрации[o.ТипРегистрации].order;
					else
						o.reg_type = 0;

					delete o.Объект;
					delete o.ДиапазонДат;
					delete o.Кешировать;
					delete o.РазрешенIREST;
					delete o.ТипРегистрации;

				}
				return data;
			})
			.then(function (data) {
				var index = -1,
					insert = "insert into meta (class_name, ref, cache, hide, lc_changed_base, irest_enabled, reg_type, meta, meta_patch) " +
						"values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
					update = "update meta set class_name=$1, ref=$2, cache=$3, hide=$4, lc_changed_base=$5, irest_enabled=$6, reg_type=$7, meta=$8, meta_patch=$9 " +
						"where class_name=$10;";


				attr.pg.drv.connect(attr.pg.cnn, function(err, client, done) {

					function iteration(){
						index++;
						if(index < data.length){
							var obj = data[index];

							client.query('SELECT class_name from meta where class_name=$1;', [obj.class_name], function(err, result) {
								if(err){
									done();
									return console.error('error running query', err);
								}

								if(result.rows.length){
									client.query(update,
										[obj.class_name, obj.ref, obj.cache, obj.hide, obj.lc_changed_base, obj.irest_enabled, obj.reg_type, obj.meta, obj.meta_patch, obj.class_name],
										function(err, result) {
											if(err){
												done();
												return console.error('error running query', err);
											}

											iteration();

										});

								}else{
									client.query(insert,
										[obj.class_name, obj.ref, obj.cache, obj.hide, obj.lc_changed_base, obj.irest_enabled, obj.reg_type, obj.meta, obj.meta_patch],
										function(err, result) {
											if(err){
												done();
												return console.error('error running query', err);
											}

											iteration();

										});
								}

							});

						}else
							done();
					}

					if(err)
						return console.error('error fetching client from pool', err);

					iteration();

				});
			});

	}

};