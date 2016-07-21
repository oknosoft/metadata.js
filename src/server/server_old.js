/**
 * Created by unpete on 02.04.2015.
 */

/**
 CREATE TABLE changes
 (
 zone integer NOT NULL,
 ref uuid NOT NULL,
 lc_changed bigint,
 class_name character varying(255),
 obj json,
 CONSTRAINT pk PRIMARY KEY (zone, ref)
 )
 WITH (
 OIDS=FALSE
 );
 */

	// WebSocket для серверных событий на клиенте
var WebSocketServer = require('ws').Server,
	ws_md = new WebSocketServer({ port: 8001 }),

	http = require("http"),
	// сервер http для взаимодействия с клиентами metadata
	http_md = http.createServer(srv_md),
	// сервер http для взаимодействия с 1С
	http_1c = http.createServer(srv_1c),

	// драйвер PostgreSQL
	pg = require('pg'),
	cnn_str = "postgres://md:md@localhost/md",

	// metadata.js
	$p = require('../lib/metadata.core.js');

function srv_1c(request, response) {

	var rtext="";

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

		ws_md.broadcast(rtext);

		pg.connect(cnn_str, function(err, client, done) {

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

http_md.listen(8002);

http_1c.listen(8003);

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


