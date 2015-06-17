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
 * @module common
 * @submodule events
 */

/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
if(window){
	(function (w) {

		var eve = $p.eve,
			iface = $p.iface,
			msg = $p.msg,
			stepper = {},
			timer_setted = false,
			cache;

		/**
		 * Устанавливает состояние online/offline в параметрах работы программы
		 * @method set_offline
		 * @for AppEvents
		 * @param offline {Boolean}
		 */
		eve.set_offline = function(offline){
			var current_offline = $p.job_prm['offline'];
			$p.job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
			if(current_offline != $p.job_prm['offline']){
				// предпринять действия
				current_offline = $p.job_prm['offline'];

			}
		};

		w.addEventListener('online', eve.set_offline);
		w.addEventListener('offline', function(){eve.set_offline(true);});

		w.addEventListener('load', function(){

			function do_reload(){
				if(!$p.ajax.authorized){
					eve.redirect = true;
					location.reload(true);
				}
			}

			function do_cache_update_msg(e){

				if(!stepper.wnd_appcache && $p.iface.appcache)
					$p.iface.appcache.create(stepper);

				else if(!timer_setted){
					timer_setted = true;
					setTimeout(do_reload, 20000);
				}

				if($p.iface.appcache){
					stepper.loaded = e.loaded || 0;
					stepper.total = e.total || 140;
					$p.iface.appcache.update();
				}

				if(stepper.do_break){
					$p.iface.appcache.close();
					setTimeout(do_reload, 1000);
				}
			}



			/**
			 * Нулевым делом, создаём объект параметров работы программы, в процессе создания которого,
			 * выполняется клиентский скрипт, переопределяющий триггеры и переменные окружения
			 * Параметры имеют значения по умолчанию, могут переопределяться подключаемыми модулями
			 * и параметрами url, синтаксический разбор url производим сразу
			 * @property job_prm
			 * @for OSDE
			 * @type JobPrm
			 * @static
			 */
			$p.job_prm = new JobPrm();


			/**
			 * если в $p.job_prm указано использование геолокации, геокодер инициализируем с небольшой задержкой
			 */
			if (navigator.geolocation && $p.job_prm.use_google_geo) {

				/**
				 * Данные геолокации
				 * @property ipinfo
				 * @type IPInfo
				 * @static
				 */
				$p.ipinfo = new function IPInfo(){

					var _yageocoder, _ggeocoder, _addr = "";

					/**
					 * Геокодер карт Яндекс
					 * @class YaGeocoder
					 * @static
					 */
					function YaGeocoder(){

						/**
						 * Выполняет прямое или обратное геокодирование
						 * @method geocode
						 * @param attr {Object}
						 * @return {Promise.<T>}
						 */
						this.geocode = function (attr) {
							//http://geocode-maps.yandex.ru/1.x/?geocode=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA,+%D0%9F%D0%BB%D0%B5%D1%85%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+%D1%83%D0%BB%D0%B8%D1%86%D0%B0,+%D0%B4%D0%BE%D0%BC+32&format=json&sco=latlong
							//http://geocode-maps.yandex.ru/1.x/?geocode=61.4080273,55.1550362&format=json&lang=ru_RU

							return Promise.resolve(false);
						}
					}

					/**
					 * Объект геокодера yandex
					 * https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/
					 * @property yageocoder
					 * @for IPInfo
					 * @type YaGeocoder
					 */
					this._define("yageocoder", {
						get : function(){

							if(!_yageocoder)
								_yageocoder = new YaGeocoder();
							return _yageocoder;
						},
						enumerable : false,
						configurable : false});


					/**
					 * Объект геокодера google
					 * https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests
					 * @property ggeocoder
					 * @for IPInfo
					 * @type {google.maps.Geocoder}
					 */
					this._define("ggeocoder", {
							get : function(){
								return _ggeocoder;
							},
							enumerable : false,
							configurable : false}
					);

					/**
					 * Адрес геолокации пользователя программы
					 * @property addr
					 * @for IPInfo
					 * @type String
					 */
					this._define("addr", {
							get : function(){
								return _addr;
							},
							enumerable : true,
							configurable : false}
					);

					this.location_callback= function(){

						/**
						 * Объект геокодера google
						 * https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests
						 * @property ggeocoder
						 * @for IPInfo
						 * @type {google.maps.Geocoder}
						 */
						_ggeocoder = new google.maps.Geocoder();

						navigator.geolocation.getCurrentPosition(function(position){

								/**
								 * Географическая широта геолокации пользователя программы
								 * @property latitude
								 * @for IPInfo
								 * @type Number
								 */
								$p.ipinfo.latitude = position.coords.latitude;

								/**
								 * Географическая долгота геолокации пользователя программы
								 * @property longitude
								 * @for IPInfo
								 * @type Number
								 */
								$p.ipinfo.longitude = position.coords.longitude;

								var latlng = new google.maps.LatLng($p.ipinfo.latitude, $p.ipinfo.longitude);

								_ggeocoder.geocode({'latLng': latlng}, function(results, status) {
									if (status == google.maps.GeocoderStatus.OK){
										if(!results[1] || results[0].address_components.length >= results[1].address_components.length)
											_addr = results[0].formatted_address;
										else
											_addr = results[1].formatted_address;
									}
								});

							}, function(err){
								if(err)
									$p.ipinfo.err = err.message;
							}, {
								timeout: 30000
							}
						);
					}
				};

				// подгружаем скрипты google
				if(!window.google || !window.google.maps)
					$p.eve.onload.push(function () {
						setTimeout(function(){
							$p.load_script(location.protocol +
								"//maps.google.com/maps/api/js?sensor=false&callback=$p.ipinfo.location_callback", "script", function(){});
						}, 600);
					});
				else
					location_callback();
			}


			if("dhtmlx" in w){
				$p.iface.w = new dhtmlXWindows();
				$p.iface.w.setSkin(dhtmlx.skin);
			}

			// проверяем совместимость браузера
			if($p.job_prm.check_browser_compatibility && (!w.JSON || !w.indexedDB || !w.localStorage) ){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				setTimeout(function(){ location.replace(msg.store_url_od); }, 6000);
				return;
			}

			// проверяем установленность приложения только если мы внутри хрома
			if($p.job_prm.check_app_installed && w["chrome"] && w["chrome"]["app"] && !w["chrome"]["app"]["isInstalled"]){
				if(!location.hostname.match(/.local/)){
					eve.redirect = true;
					msg.show_msg({type: "alert-error", text: msg.unsupported_mode, title: msg.unsupported_mode_title});
					setTimeout(function(){ location.replace(msg.store_url_od); }, 6000);
					return;
				}
			}

			/**
			 * Инициализируем параметры пользователя,
			 * проверяем offline и версию файлов
			 */
			$p.wsql.init_params(function(){

				eve.set_offline(!navigator.onLine);

				eve.update_files_version();

				// пытаемся перейти в полноэкранный режим в мобильных браузерах
				if (document.documentElement.webkitRequestFullScreen && navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
					function requestFullScreen(){
						document.documentElement.webkitRequestFullScreen();
						w.removeEventListener('touchstart', requestFullScreen);
					}
					w.addEventListener('touchstart', requestFullScreen, false);
				}

				// кешируем ссылки на элементы управления
				if($p.job_prm.use_builder || $p.job_prm.use_wrapper){
					$p.wrapper	= document.getElementById("owb_wrapper");
					$p.risdiv	= document.getElementById("risdiv");
					$p.ft		= document.getElementById("msgfooter");
					if($p.ft)
						$p.ft.style.display = "none";
				}

				/**
				 * Выполняем отложенные методы из eve.onload
				 */
				eve.onload.forEach(function (method) {
					if(typeof method === "function")
						method();
				});

				// Если есть сплэш, удаляем его
				if(document && document.querySelector("#splash"))
					document.querySelector("#splash").parentNode.removeChild(document.querySelector("#splash"));

				/**
				 *	начинаем слушать события msgfooter-а, в который их пишет рисовалка
				 */
				if($p.job_prm.use_builder && $p.ft){

					dhtmlxEvent($p.ft, "click", function(evt){
						$p.cancel_bubble(evt);
						if(evt.qualifier == "ready")
							iface.oninit();
						else if($p.eve.builder_click)
							$p.eve.builder_click(evt);
					});

				}else
					iface.oninit();

				// Ресурсы уже кэшированнны. Индикатор прогресса скрыт
				if (cache = w.applicationCache){

					// обновление не требуется
					cache.addEventListener('noupdate', function(e){

					}, false);

					// Ресурсы уже кэшированнны. Индикатор прогресса скрыт.
					cache.addEventListener('cached', function(e){
						timer_setted = true;
						if($p.iface.appcache)
							$p.iface.appcache.close();
					}, false);

					// Начало скачивания ресурсов. progress_max - количество ресурсов. Показываем индикатор прогресса
					cache.addEventListener('downloading', do_cache_update_msg, false);

					// Процесс скачивания ресурсов. Индикатор прогресса изменяется
					cache.addEventListener('progress', do_cache_update_msg,	false);

					// Скачивание завершено. Скрываем индикатор прогресса. Обновляем кэш. Перезагружаем страницу.
					cache.addEventListener('updateready', function(e) {
						try{
							cache.swapCache();
							if($p.iface.appcache){
								$p.iface.appcache.close();
							}
						}catch(e){}
						do_reload();
					}, false);

					// Ошибка кеша
					cache.addEventListener('error', function(e) {
						if(!w.JSON || !w.openDatabase || typeof(w.openDatabase) !== 'function'){
							//msg.show_msg({type: "alert-error",
							//	text: msg.unknown_error.replace("%1", "applicationCache"),
							//	title: msg.main_title});
						}else
							msg.show_msg({type: "alert-error", text: e.message || msg.unknown_error, title: msg.error_critical});

					}, false);
				}

			});

		}, false);

		/**
		 * Обработчик события "перед закрытием окна"
		 * @event onbeforeunload
		 * @for AppEvents
		 * @returns {string} - если не путсто, браузер показывает диалог с вопросом, можно ли закрывать
		 */
		w.onbeforeunload = function(){
			if(!eve.redirect)
				return msg.onbeforeunload;
		};

		/**
		 * Обработчик back/forward событий браузера
		 * @event popstat
		 * @for AppEvents
		 */
		w.addEventListener("popstat", $p.iface.hash_route);

		/**
		 * Обработчик события изменения hash в url
		 * @event hashchange
		 * @for AppEvents
		 */
		w.addEventListener("hashchange", $p.iface.hash_route);

	})(window);
}


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

$p.eve.stepper = {
	step: 0,
	count_all: 0,
	cat_date: 0,
	step_size: 57,
	files: 0,
	cat_ini_date: $p.wsql.get_user_param("cache_cat_date", "number")  || 0
};

/**
 * Регламентные задания синхронизапции каждые 3 минуты
 * @event ontimer
 * @for AppEvents
 */
$p.eve.ontimer = function () {

	// читаем файл версии файлов js. в случае изменений, оповещаем пользователя
	// TODO сделать автообновление
	$p.eve.update_files_version();

};
setInterval($p.eve.ontimer, 180000);

$p.eve.update_files_version = function () {

	if(!$p.job_prm.files_date)
		$p.job_prm.files_date = $p.wsql.get_user_param("files_date", "number");

	if($p.job_prm['offline'])
		return;

	$p.ajax.get("/data/sync.json?v="+Date.now())
		.then(function (req) {
			var sync = JSON.parse(req.response);

			if(!$p.job_prm.confirmation && $p.job_prm.files_date != sync.files_date){

				$p.wsql.set_user_param("files_date", sync.files_date);

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
		}).catch(function (err) {
			console.log(err);
		})
}


/**
 * Читает порцию данных из веб-сервиса обмена данными
 * @method pop
 * @for AppEvents
 * @param write_ro_wsql {Boolean} - указывает сразу кешировать прочитанные данные в wsql
 */
$p.eve.pop = function (write_ro_wsql) {

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

	if($p.job_prm.offline)
		return Promise.resolve(false);

	// за такт pop делаем не более 2 запросов к 1С
	return get_cachable_portion()

		// загружаем в ОЗУ данные первого запроса
		.then(function (req) {
			return $p.eve.from_json_to_data_obj(req, write_ro_wsql);
		})

		.then(function (need) {
			if(need){
				return get_cachable_portion(1)

					.then(function (req) {
						return $p.eve.from_json_to_data_obj(req, write_ro_wsql);
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
	else if(res instanceof XMLHttpRequest)
		res = JSON.parse(res.response);

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

		for(class_name in res.cat)
			_cat[class_name].load_array(res.cat[class_name]);

		for(class_name in res.doc)
			_doc[class_name].load_array(res.doc[class_name]);

		for(class_name in res.ireg)
			_ireg[class_name].load_array(res.ireg[class_name]);

		// если все данные получены в первом запросе, второй можно не делать
		return res.current && (res.current >= stepper.step_size);
	}
};

// возаращает промис после выполнения всех заданий в очереди
$p.eve.reduce_promices = function(parts){

	return parts.reduce(function(sequence, part_promise) {

		// Используем редуцирование что бы связать в очередь обещания, и добавить каждую главу на страницу
		return sequence.then(function() {
			return part_promise;

		})
			// загружаем все части в озу
			.then($p.eve.from_json_to_data_obj);

	}, Promise.resolve())
};

/**
 * Запускает процесс входа в программу и начальную синхронизацию
 * @method log_in
 * @for AppEvents
 * @param onstep {function} - callback обработки состояния. Функция вызывается в начале шага
 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
 * @async
 */
$p.eve.log_in = function(onstep){

	var stepper = $p.eve.stepper,
		mdd;

	// информируем о начале операций
	onstep($p.eve.steps.load_meta);

	// читаем файл метаданных
	return $p.ajax.get("/data/meta.json?v="+$p.job_prm.files_date)

		// грузим метаданные
		.then(function (req) {
			onstep($p.eve.steps.create_managers);
			return new Meta(req);
		})

		// авторизуемся на сервере. в автономном режиме сразу переходим к чтению первого файла данных
		.then(function (res) {

			onstep($p.eve.steps.authorization);

			if($p.job_prm.offline)
				return res;

			return _load({
				action: "get_meta",
				cache_md_date: $p.wsql.get_user_param("cache_md_date", "number"),
				cache_cat_date: stepper.cat_ini_date,
				now_js: Date.now(),
				margin: $p.wsql.get_user_param("margin", "number"),
				ipinfo: $p.ipinfo.hasOwnProperty("latitude") ? JSON.stringify($p.ipinfo) : ""
			})
		})

		// интерпретируем ответ сервера
		.then(function (res) {

			onstep($p.eve.steps.load_data_files);

			if($p.job_prm.offline)
				return res;

			if(typeof res == "string")
				res = JSON.parse(res);

			if($p.msg.check_soap_result(res))
				return;

			if($p.wsql.get_user_param("enable_save_pwd"))
				$p.wsql.set_user_param("user_pwd", $p.ajax.password);
			else if($p.wsql.get_user_param("user_pwd"))
				$p.wsql.set_user_param("user_pwd", "");

			// обрабатываем поступившие данные
			$p.wsql.set_user_param("time_diff", res["now_1с"] - res["now_js"]);
			_md.get("cat.clrs").predefined.white.ref = res.cat["clrs"].predefined.white.ref;
			_md.get("cat.bases").predefined.main.ref = res.cat["bases"].predefined.main.ref;

			return res;
		})

		// сохраняем даты справочников в mdd и читаем первый файл данных
		.then(function(res){

			mdd = res;

			stepper.zone = ($p.job_prm.demo ? "1" : $p.wsql.get_user_param("zone")) + "/";

			return $p.ajax.get("/data/zones/" + stepper.zone + "p_0.json?v="+$p.job_prm.files_date)
		})

		// из содержимого первого файла получаем количество файлов и загружаем их все
		.then(function (req) {

			var tmpres = JSON.parse(req.response);
			stepper.files = tmpres.files-1;
			stepper.step_size = tmpres.files > 0 ? Math.round(tmpres.count_all / tmpres.files) : 57;
			stepper.cat_ini_date = tmpres["cat_date"];
			$p.eve.from_json_to_data_obj(tmpres);

		})

		// формируем массив url файлов данных зоны
		.then(function () {

			var parts = [];
			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get("/data/zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get("/data/zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

			return $p.eve.reduce_promices(parts);

		})

		// если онлайн, выполняем такт обмена с 1С
		.then(function(parts) {

			onstep($p.eve.steps.load_data_db);
			stepper.step_size = 57;
			return $p.eve.pop();
		})

		// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
		.then(function () {
			if(mdd.access){
				mdd.access.force = true;
				$p.eve.from_json_to_data_obj(mdd.access);
			}
		})

		// сохраняем данные в локальной датабазе
		.then(function () {
			onstep($p.eve.steps.save_data_wsql);
			//for(var cat_name in _cat){
			//	if(!(_cat[cat_name] instanceof CatManager))
			//		continue;
			//	_cat[cat_name].save_wsql();
			//}
		});

};