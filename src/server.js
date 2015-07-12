/**
 * Created by unpete on 02.04.2015.
 */

	// WebSocket для серверных событий на клиенте
var WebSocketServer = require('ws').Server,
	ws_md = new WebSocketServer({ port: 8001 }),

	http = require("http"),
	// сервер http для взаимодействия с клиентами metadata
	http_md = http.createServer(function(request,response) {

		response.end("404: Not Found: "+request.url);

	}),
	// сервер http для взаимодействия с 1С
	http_1c = http.createServer(function(request,response) {

		var rtext="", ref;

		function reg_from_1c() {
			try {
				rtext = JSON.parse(rtext);
				if($p.is_empty_guid(ref = $p.fix_guid(rtext.obj.ref)))
					return;

			} catch (e) {
				console.log(result.rows[0]);
				return;
			};

			pg.connect(conString, function(err, client, done) {
				if(err) {
					return console.error('error fetching client from pool', err);
				}
				client.query('SELECT * from changes', [], function(err, result) {
					//call `done()` to release the client back to the pool
					done();

					if(err) {
						return console.error('error running query', err);
					}
					console.log(result.rows[0]);
					//output: 1
				});
			});
		};

		request.on("data", function(chunk) {
			rtext+=chunk.toString();
		});

		request.on("end", function() {
			response.end("404: Not Found: "+request.url);
			reg_from_1c();
		});

	}),

	// драйвер PostgreSQL
	pg = require('pg'),
	conString = "postgres://md:md@localhost/md",

	// metadata.js
	$p = require('../lib/metadata.node.js');

http_md.listen(8002);
http_1c.listen(8003);


