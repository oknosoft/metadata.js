/**
 *
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  http_socket
 */

module.exports = function (attr) {

	// WebSocket для серверных событий на клиенте
	var WebSocketServer = require('ws').Server,
		ws_md = new WebSocketServer({ port: 8001 });


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






