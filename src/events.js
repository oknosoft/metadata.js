/**
 * Содержит методы обработки событий __при запуске__ программы, __перед закрытием__,<br />
 * при обновлении файлов __ApplicationCache__, а так же, при переходе в __offline__ и __online__
 *
 *	События развиваются в такой последовательности:
 *
 *	1) выясняем, совместим ли браузер. В зависимости от параметров url и параметров по умолчанию,
 *	 может произойти переход в ChromeStore или другие действия
 *
 *	2) анализируем AppCache, при необходимости обновляем скрипты и перезагружаем страницу
 *
 * 	3) инициализируем $p.wsql и комбинируем параметры работы программы с параметрами url
 *
 * 	4) если режим работы предполагает использование построителя, подключаем слушатель его событий.
 *	 по событию построителя "ready", выполняем метод initMainLayout() объекта $p.iface.
 *	 Метод initMainLayout() переопределяется во внешним, по отношению к ядру, модуле
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module common
 * @submodule events
 */



/**
 * Устанавливает соединение с вебсокет-сервером, обеспечивает приём и отправку сообщений
 * @class SocketMsg
 * @constructor
 */
function SocketMsg(){

	var socket_uid, ws, opened, attempt = 0, t = this;

	function reflect_react(data){
		if(data && data.type == "react"){
			try{
				var mgr = _md ? _md.mgr_by_class_name(data.class_name) : null;
				if(mgr)
					mgr.load_array([data.obj], true);

			}catch(err){
				$p.record_log(err);
			}
		}
	}

	t.connect = function(reset_attempt){

		// http://builder.local/debug.html#socket_uid=4e8b16b6-89b0-11e2-9c06-da48b440c859

		if(!socket_uid)
			socket_uid = $p.job_prm.parse_url().socket_uid || "";

		if(reset_attempt)
			attempt = 0;
		attempt++;

		// проверяем состояние и пытаемся установить ws соединение с Node
		if($p.job_prm.ws_url){
			if(!ws || !opened){
				try{
					ws = new WebSocket($p.job_prm.ws_url);

					ws.onopen = function() {
						opened = true;
						ws.send(JSON.stringify({
							socket_uid: socket_uid,
							zone: $p.wsql.get_user_param("zone"),
							browser_uid: $p.wsql.get_user_param("browser_uid"),
							_side: "js",
							_mirror: true
						}));
					};

					ws.onclose = function() {
						opened = false;
						setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					};

					ws.onmessage = function(ev) {
						var data;
						try{
							data = JSON.parse(ev.data);
						}catch(err){
							data = ev.data;
						}
						dhx4.callEvent("socket_msg", [data]);
					};

					ws.onerror = $p.record_log;

				}catch(err){
					setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					$p.record_log(err);
				}
			}
		}
	};

	t.send = function (data) {
		if(ws && opened){
			if(!data)
				data = {};
			else if("object" != typeof data)
				data = {data: data};
			data.socket_uid = socket_uid;
			data._side = "js";
			ws.send(JSON.stringify(data));
		}
	};

	// если мы в браузере, подключаем обработчик react
	if(typeof window !== "undefined" && window.dhx4)
		dhx4.attachEvent("socket_msg", reflect_react);

}

/**
 * Интерфейс асинхронного обмена сообщениями
 * @property socket
 * @type {SocketMsg}
 */
$p.eve.socket = new SocketMsg();

/**
 * Шаги синхронизации (перечисление состояний)
 * @property steps
 * @for AppEvents
 * @type SyncSteps
 */
$p.eve.steps = {
	load_meta: 0,           // загрузка метаданных из файла
	authorization: 1,       // авторизация на сервере 1С или Node (в автономном режиме шаг не выполняется)
	create_managers: 2,     // создание менеджеров объектов
	process_access:  3,     // загрузка данных пользователя, обрезанных по RLS (контрагенты, договоры, организации)
	load_data_files: 4,     // загрузка данных из файла зоны
	load_data_db: 5,        // догрузка данных с сервера 1С или Node
	load_data_wsql: 6,      // загрузка данных из локальной датабазы (имеет смысл, если локальная база не в ОЗУ)
	save_data_wsql: 7       // кеширование данных из озу в локальную датабазу
};


/**
 * Регламентные задания синхронизапции каждые 3 минуты
 * @event ontimer
 * @for AppEvents
 */
$p.eve.ontimer = function () {

	// читаем файл версии файлов js. в случае изменений, оповещаем пользователя
	// TODO: это место желательно перенести в сервисворкер
	$p.eve.update_files_version();

};
setInterval($p.eve.ontimer, 180000);

$p.eve.update_files_version = function () {

	if(typeof window === "undefined" || !$p.job_prm || $p.job_prm.offline || !$p.job_prm.data_url)
		return;

	if(!$p.job_prm.files_date)
		$p.job_prm.files_date = $p.wsql.get_user_param("files_date", "number");

	$p.ajax.get($p.job_prm.data_url + "sync.json?v="+Date.now())
		.then(function (req) {
			var sync = JSON.parse(req.response);

			if(!$p.job_prm.confirmation && $p.job_prm.files_date != sync.files_date){

				$p.wsql.set_user_param("files_date", sync.files_date);

				if(!$p.job_prm.files_date){
					$p.job_prm.files_date = sync.files_date;

				}else {

					$p.job_prm.confirmation = true;

					dhtmlx.confirm({
						title: $p.msg.file_new_date_title,
						text: $p.msg.file_new_date,
						ok: "Перезагрузка",
						cancel: "Продолжить",
						callback: function(btn) {

							delete $p.job_prm.confirmation;

							if(btn){
								$p.eve.redirect = true;
								location.reload(true);
							}
						}
					});
				}
			}
		}).catch($p.record_log)
};


/**
 * Читает порцию данных из веб-сервиса обмена данными
 * @method pop
 * @for AppEvents
 */
$p.eve.pop = function () {

	var cache_cat_date = $p.eve.stepper.cat_ini_date;

	// запрашиваем очередную порцию данных в 1С
	function get_cachable_portion(step){

		return _load({
			action: "get_cachable_portion",
			cache_cat_date: cache_cat_date,
			step_size: $p.eve.stepper.step_size,
			step: step || 0
		});
	}

	function update_cache_cat_date(need){
		if($p.eve.stepper.cat_ini_date > $p.wsql.get_user_param("cache_cat_date", "number"))
			$p.wsql.set_user_param("cache_cat_date", $p.eve.stepper.cat_ini_date);
		if(need)
			setTimeout(function () {
				$p.eve.pop(true);
			}, 10000);
	}

	if($p.job_prm.offline || !$p.job_prm.irest_enabled)
		return Promise.resolve(false);

	else {
		// TODO: реализовать синхронизацию на irest
		return Promise.resolve(false);
	}

	// за такт pop делаем не более 2 запросов к 1С
	return get_cachable_portion()

		// загружаем в ОЗУ данные первого запроса
		.then(function (req) {
			return $p.eve.from_json_to_data_obj(req);
		})

		.then(function (need) {
			if(need){
				return get_cachable_portion(1)

					.then(function (req) {
						return $p.eve.from_json_to_data_obj(req);
					})

					.then(function (need){
						update_cache_cat_date(need);
					});
			}
			update_cache_cat_date(need);
		});
};

/**
 * Записывает порцию данных в веб-сервис обмена данными
 * @method push
 * @for AppEvents
 */
$p.eve.push = function () {

};

$p.eve.from_json_to_data_obj = function(res) {

	var stepper = $p.eve.stepper, class_name;

	if (typeof res == "string")
		res = JSON.parse(res);
	else if(res instanceof XMLHttpRequest){
		if(res.response)
			res = JSON.parse(res.response);
		else
			res = {};
	}

	if(stepper.do_break){
		$p.iface.sync.close();
		$p.eve.redirect = true;
		location.reload(true);

	}else if(res["cat_date"] || res.force){
		if(res["cat_date"] > stepper.cat_ini_date)
			stepper.cat_ini_date = res["cat_date"];
		if(res["cat_date"] > stepper.cat_date)
			stepper.cat_date = res["cat_date"];
		if(res["count_all"])
			stepper.count_all = res["count_all"];
		if(res["current"])
			stepper.current = res["current"];

		for(class_name in res.cch)
			if(_cch[class_name])
				_cch[class_name].load_array(res.cch[class_name]);

		for(class_name in res.cacc)
			if(_cacc[class_name])
				_cacc[class_name].load_array(res.cacc[class_name]);

		for(class_name in res.cat)
			if(_cat[class_name])
				_cat[class_name].load_array(res.cat[class_name]);

		for(class_name in res.doc)
			if(_doc[class_name])
				_doc[class_name].load_array(res.doc[class_name]);

		for(class_name in res.ireg)
			if(_ireg[class_name])
				_ireg[class_name].load_array(res.ireg[class_name]);

		for(class_name in res.areg)
			if(_areg[class_name])
				_areg[class_name].load_array(res.areg[class_name]);

		// если все данные получены в первом запросе, второй можно не делать
		return res.current && (res.current >= stepper.step_size);
	}
};

// возаращает промис после выполнения всех заданий в очереди
$p.eve.reduce_promices = function(parts, callback){

	return parts.reduce(function(sequence, part_promise) {

		// Используем редуцирование что бы связать в очередь обещания, и добавить каждую главу на страницу
		return sequence.then(function() {
			return part_promise;

		})
			// загружаем все части в озу
			.then(callback)
			.catch(callback);

	}, Promise.resolve())
};

$p.eve.js_time_diff = -(new Date("0001-01-01")).valueOf();

$p.eve.time_diff = function () {
	var time_diff = $p.wsql.get_user_param("time_diff", "number");
	return (!time_diff || isNaN(time_diff) || time_diff < 62135571600000 || time_diff > 62135622000000) ? $p.eve.js_time_diff : time_diff;
};
