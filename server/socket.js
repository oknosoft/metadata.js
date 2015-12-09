/**
 *
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author    Evgeniy Malyarov
 * @module  socket
 */

module.exports = function ($p, attr) {

	// WebSocket для серверных событий на клиенте
	var WebSocketServer = require('ws').Server,
		ws_md = new WebSocketServer({ port: 8001 }),

		http = require("http"),

// драйвер PostgreSQL
		pg = require('pg');

	function srv_1c(request, response) {

		var rtext="";

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

			ws_md.broadcast(rtext);

			pg.connect(attr.pg, function(err, client, done) {

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

					// console.log(result.rows[0]);

				});
			});
		}

		request.on("data", function(chunk) {
			rtext+=chunk.toString();
		});

		request.on("end", function() {
			response.end("404: Not Found: "+request.url);
			reg_from_1c();
		});

	}

	function srv_md(request, response) {
		response.end("404: Not Found: "+request.url);
	}


	ws_md.on('connection', function(ws) {

		ws.on('message', function(data) {
			try{
				data = JSON.parse(data);
				if(data.hasOwnProperty("zone"))
					ws.zone = data.zone;
				if(data.hasOwnProperty("browser_uid"))
					ws.browser_uid = data.browser_uid;
				if(data.hasOwnProperty("uid"))
					ws.uid = data.uid;

				ws_md.clients.forEach(function each(client) {
					if(client != ws && (client.uid == data.uid || client.browser_uid == data.browser_uid))
						client.send(data);
				});

				console.log(data);

			}catch(err){
				console.log(err);
			}
		});

	});

	ws_md.broadcast = function broadcast(data) {
		ws_md.clients.forEach(function each(client) {
			client.send(data);
		});
	};

	return ws_md;
};






