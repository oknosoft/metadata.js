/**
 * Обмен сообщениями через вебсокеты
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule socket
 *
 */

/**
 * Устанавливает соединение с вебсокет-сервером, обеспечивает приём и отправку сообщений
 * @class SocketMsg
 * @constructor
 */
function SocketMsg() {

	var socket_uid, ws, opened, attempt = 0, t = this;

	function reflect_react(data) {
		if (data && data.type == "react") {
			try {
				var mgr = _md ? _md.mgr_by_class_name(data.class_name) : null;
				if (mgr)
					mgr.load_array([data.obj], true);

			} catch (err) {
				$p.record_log(err);
			}
		}
	}

	t.connect = function (reset_attempt) {

		// http://builder.local/debug.html#socket_uid=4e8b16b6-89b0-11e2-9c06-da48b440c859

		if (!socket_uid)
			socket_uid = $p.job_prm.parse_url().socket_uid || "";

		if (reset_attempt)
			attempt = 0;
		attempt++;

		// проверяем состояние и пытаемся установить ws соединение с Node
		if ($p.job_prm.ws_url) {
			if (!ws || !opened) {
				try {
					ws = new WebSocket($p.job_prm.ws_url);

					ws.onopen = function () {
						opened = true;
						ws.send(JSON.stringify({
							socket_uid: socket_uid,
							zone: $p.wsql.get_user_param("zone"),
							browser_uid: $p.wsql.get_user_param("browser_uid"),
							_side: "js",
							_mirror: true
						}));
					};

					ws.onclose = function () {
						opened = false;
						setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					};

					ws.onmessage = function (ev) {
						var data;

						try {
							data = JSON.parse(ev.data);
						} catch (err) {
							data = ev.data;
						}

						$p.eve.callEvent("socket_msg", [data]);
					};

					ws.onerror = $p.record_log;

				} catch (err) {
					setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					$p.record_log(err);
				}
			}
		}
	};

	t.send = function (data) {
		if (ws && opened) {
			if (!data)
				data = {};
			else if ("object" != typeof data)
				data = {data: data};
			data.socket_uid = socket_uid;
			data._side = "js";
			ws.send(JSON.stringify(data));
		}
	};

	$p.eve.attachEvent("socket_msg", reflect_react);

}

/**
 * Интерфейс асинхронного обмена сообщениями
 * @property socket
 * @type {SocketMsg}
 */
$p.eve.socket = new SocketMsg();
