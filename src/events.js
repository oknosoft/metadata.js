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
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 *
 * @module common
 * @submodule events
 */

/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
function only_in_browser(w){
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

	/**
	 * Тип устройства и ориентация экрана
	 * @param e
	 */
	eve.on_rotate = function (e) {
		$p.device_orient = (w.orientation == 0 || w.orientation == 180 ? "portrait":"landscape");
		if (typeof(e) != "undefined")
			w.dhx4.callEvent("onOrientationChange", [$p.device_orient]);
	};
	if(typeof(w.orientation)=="undefined")
		$p.device_orient = w.innerWidth>w.innerHeight ? "landscape" : "portrait";
	else
		eve.on_rotate();
	w.addEventListener("orientationchange", eve.on_rotate, false);

	$p.__define("device_type", {
		get: function () {
			var device_type = $p.wsql.get_user_param("device_type");
			if(!device_type){
				device_type = (function(i){return (i<1024?"phone":(i<1280?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
				$p.wsql.set_user_param("device_type", device_type);
			}
			return device_type;
		},
		set: function (v) {
			$p.wsql.set_user_param("device_type", v);
		},
		enumerable: false,
		configurable: false
	});


	/**
	 * Отслеживаем онлайн
	 */
	w.addEventListener('online', eve.set_offline);
	w.addEventListener('offline', function(){eve.set_offline(true);});

	w.addEventListener('load', function(){

		/**
		 * Инициализацию выполняем с небольшой задержкой,
		 * чтобы позволить сторонним скриптам подписаться на событие onload и сделать свои черные дела
		 */
		setTimeout(function () {

			/**
			 * ### Данные геолокации
			 * Объект предоставляет доступ к функциям _геокодирования браузера_, а так же - геокодерам _Яндекс_ и _Гугл_
			 *
			 * @class IPInfo
			 * @static
			 */
			function IPInfo(){

				var _yageocoder, _ggeocoder, _addr = "", _parts;

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
				 * Объект [геокодера yandex](https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/)
				 * @property yageocoder
				 * @for IPInfo
				 * @type YaGeocoder
				 */
				this.__define("yageocoder", {
					get : function(){

						if(!_yageocoder)
							_yageocoder = new YaGeocoder();
						return _yageocoder;
					},
					enumerable : false,
					configurable : false});


				/**
				 * Объект [геокодера google](https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests)
				 * @property ggeocoder
				 * @for IPInfo
				 * @type {google.maps.Geocoder}
				 */
				this.__define("ggeocoder", {
						get : function(){
							return _ggeocoder;
						},
						enumerable : false,
						configurable : false}
				);


				this.__define({

					/**
					 * Адрес геолокации пользователя программы
					 * @property addr
					 * @for IPInfo
					 * @type String
					 */
					addr: {
						get : function(){
							return _addr;
						}
					},

					parts: {
						get : function(){
							return _parts;
						}
					},

					components: {
						value : function(v, components){
							var i, c, j, street = "", street0 = "", locality = "";
							for(i in components){
								c = components[i];
								//street_number,route,locality,administrative_area_level_2,administrative_area_level_1,country,sublocality_level_1
								for(j in c.types){
									switch(c.types[j]){
										case "route":
											if(c.short_name.indexOf("Unnamed")==-1){
												street = c.short_name + (street ? (" " + street) : "");
												street0 = c.long_name.replace("улица", "").trim();
											}
											break;
										case "administrative_area_level_1":
											v.region = c.long_name;
											break;
										case "administrative_area_level_2":
											v.city = c.short_name;
											v.city_long = c.long_name;
											break;
										case "locality":
											locality = (locality ? (locality + " ") : "") + c.short_name;
											break;
										case "street_number":
											street = (street ? (street + " ") : "") + c.short_name;
											break;
										case "postal_code":
											v.postal_code = c.short_name;
											break;
										default:
											break;
									}
								}
							}
							if(v.region && v.region == v.city_long)
								if(v.city.indexOf(locality) == -1)
									v.city = locality;
								else
									v.city = "";
							else if(locality){
								if(v.city.indexOf(locality) == -1 && v.region.indexOf(locality) == -1)
									street = locality + ", " + street;
							}

							// если в адресе есть подстрока - не переписываем
							if(!v.street || v.street.indexOf(street0)==-1)
								v.street = street;

							return v;
						}
					}
				});

				this.location_callback= function(){

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
										_parts = results[0];
									else
										_parts = results[1];
									_addr = _parts.formatted_address;

									dhx4.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
								}
							});

						}, $p.record_log, {
							timeout: 30000
						}
					);
				}
			};

			function navigate(url){
				if(url && (location.origin + location.pathname).indexOf(url)==-1)
					location.replace(url);
			}

			/**
			 * Нулевым делом, создаём объект параметров работы программы, в процессе создания которого,
			 * выполняется клиентский скрипт, переопределяющий триггеры и переменные окружения
			 * Параметры имеют значения по умолчанию, могут переопределяться подключаемыми модулями
			 * и параметрами url, синтаксический разбор url производим сразу
			 * @property job_prm
			 * @for MetaEngine
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
				 * @for MetaEngine
				 * @type IPInfo
				 * @static
				 */
				$p.ipinfo = new IPInfo();

				// подгружаем скрипты google
				if(!window.google || !window.google.maps)
					$p.eve.onload.push(function () {
						setTimeout(function(){
							$p.load_script(location.protocol +
								"//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});
						}, 100);
					});
				else
					location_callback();
			}

			/**
			 * Если указано, навешиваем слушателя на postMessage
			 */
			if($p.job_prm.allow_post_message){
				/**
				 * Обработчик события postMessage сторонних окон или родительского окна (если iframe)
				 * @event message
				 * @for AppEvents
				 */
				w.addEventListener("message", function(event) {

					if($p.job_prm.allow_post_message == "*" || $p.job_prm.allow_post_message == event.origin){

						if(typeof event.data == "string"){
							try{
								var res = eval(event.data);
								if(res && event.source){
									if(typeof res == "object")
										res = JSON.stringify(res);
									else if(typeof res == "function")
										return;
									event.source.postMessage(res, "*");
								}
							}catch(e){
								$p.record_log(e);
							}
						}
					}
				});
			}

			// устанавливаем соединение с сокет-сервером
			eve.socket.connect();

			// проверяем совместимость браузера
			if($p.job_prm.check_browser_compatibility && (!w.JSON || !w.indexedDB || !w.localStorage) ){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				setTimeout(function(){ location.replace(msg.store_url_od); }, 6000);
				return;
			}

			// проверяем установленность приложения только если мы внутри хрома
			if($p.job_prm.check_app_installed && w.chrome && w.chrome.app && !w.chrome.app.isInstalled){
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
			function init_params(){

				$p.wsql.init_params().then(function(){

					function load_css(){

						var i, surl, sname, load_dhtmlx = true, load_meta = true,
							smetadata = new RegExp('metadata.js$'),
							smetadatamin = new RegExp('metadata.min.js$');

						for(i in document.scripts){
							if(document.scripts[i].src.match(smetadata)){
								sname = smetadata;
								surl = document.scripts[i].src;
								break;
							}else if(document.scripts[i].src.match(smetadatamin)){
								sname = smetadatamin;
								surl = document.scripts[i].src;
								break;
							}
						}
						// стили загружаем только при необходимости
						for(i=0; i < document.styleSheets.length; i++){
							if(document.styleSheets[i].href){
								if(document.styleSheets[i].href.indexOf("dhx_web")!=-1 || document.styleSheets[i].href.indexOf("dhx_terrace")!=-1)
									load_dhtmlx = false;
								else if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
									load_meta = false;
							}
						}

						// задаём основной скин
						dhtmlx.skin = $p.wsql.get_user_param("skin") || "dhx_web";

						//str.replace(new RegExp(list[i] + '$'), 'finish')
						if(load_dhtmlx)
							$p.load_script(surl.replace(sname, dhtmlx.skin == "dhx_web" ? "dhx_web.css" : "dhx_terrace.css"), "link");
						if(load_meta)
							$p.load_script(surl.replace(sname, "metadata.css"), "link");

						// дополнительные стили
						if($p.job_prm.additional_css)
							$p.job_prm.additional_css.forEach(function (name) {
								if(dhx4.isIE || name.indexOf("ie_only") == -1)
									$p.load_script(name, "link");
							});

						// задаём путь к картинкам
						dhtmlx.image_path = surl.replace(sname, "imgs/");

						// суффикс скина
						dhtmlx.skin_suffix = function () {
							return dhtmlx.skin.replace("dhx", "") + "/"
						};

						// запрещаем добавлять dhxr+date() к запросам get внутри dhtmlx
						dhx4.ajax.cache = true;

						/**
						 * ### Каркас оконного интерфейса
						 * См. описание на сайте dhtmlx [dhtmlXWindows](http://docs.dhtmlx.com/windows__index.html)
						 * @property w
						 * @for InterfaceObjs
						 * @type dhtmlXWindows
						 */
						$p.iface.__define("w", {
							value: new dhtmlXWindows(),
							enumerable: false
						});
						$p.iface.w.setSkin(dhtmlx.skin);

						/**
						 * ### Всплывающие подсказки
						 * См. описание на сайте dhtmlx [dhtmlXPopup](http://docs.dhtmlx.com/popup__index.html)
						 * @property popup
						 * @for InterfaceObjs
						 * @type dhtmlXPopup
						 */
						$p.iface.__define("popup", {
							value: new dhtmlXPopup(),
							enumerable: false
						});

					}

					// создавать dhtmlXWindows можно только после готовности документа
					if("dhtmlx" in w)
						load_css();

					eve.stepper = {
						step: 0,
						count_all: 0,
						cat_date: 0,
						step_size: 57,
						files: 0,
						cat_ini_date: $p.wsql.get_user_param("cache_cat_date", "number")  || 0
					};

					eve.set_offline(!navigator.onLine);

					eve.update_files_version();

					// пытаемся перейти в полноэкранный режим в мобильных браузерах
					if (document.documentElement.webkitRequestFullScreen
						&& navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
						&& ($p.job_prm.request_full_screen || $p.wsql.get_user_param("request_full_screen"))) {
						var requestFullScreen = function(){
							document.documentElement.webkitRequestFullScreen();
							w.removeEventListener('touchstart', requestFullScreen);
						};
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
					eve.onload.execute($p);

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
						setTimeout(iface.oninit, 100);

					$p.msg.russian_names();

					// TODO: переписать управление appcache на сервисворкерах
					if($p.wsql.get_user_param("use_service_worker", "boolean") && typeof navigator != "undefined"
						&& 'serviceWorker' in navigator && location.protocol.indexOf("https") != -1){

						// Override the default scope of '/' with './', so that the registration applies
						// to the current directory and everything underneath it.
						navigator.serviceWorker.register('metadata_service_worker.js', {scope: '/'})
							.then(function(registration) {
								// At this point, registration has taken place.
								// The service worker will not handle requests until this page and any
								// other instances of this page (in other tabs, etc.) have been closed/reloaded.
								$p.record_log('serviceWorker register succeeded');
							})
							.catch($p.record_log);

					}else if (cache = w.applicationCache){

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
						cache.addEventListener('error', $p.record_log, false);
					}

				});
			}

			setTimeout(function(){

				/**
				 * проверяем поддержку промисов, при необходимости загружаем полифил
				 */
				if(typeof Promise !== "function"){
					$p.load_script("//cdn.jsdelivr.net/es6-promise/latest/es6-promise.min.js", "script", function () {
						ES6Promise.polyfill();
						init_params();
					});
				} else
					init_params();

			}, 20);

		}, 20);

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
				setTimeout(do_reload, 25000);
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

}
if(typeof window !== "undefined")
	only_in_browser(window);

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

	if(!$p.job_prm || $p.job_prm.offline || !$p.job_prm.data_url)
		return;

	if(!$p.job_prm.files_date)
		$p.job_prm.files_date = $p.wsql.get_user_param("files_date", "number");

	$p.ajax.get($p.job_prm.data_url + "sync.json?v="+Date.now())
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

/**
 * Запускает процесс входа в программу и начальную синхронизацию
 * @method log_in
 * @for AppEvents
 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
 * @async
 */
$p.eve.log_in = function(onstep){

	var stepper = $p.eve.stepper, irest_attr = {}, parts = [], mreq, mpatch,
		mdd, data_url = $p.job_prm.data_url || "/data/";

	// информируем о начале операций
	onstep($p.eve.steps.load_meta);

	// выясняем, доступен ли irest (наш сервис) или мы ограничены стандартным rest-ом
	$p.ajax.default_attr(irest_attr, $p.job_prm.irest_url());
	if(!$p.job_prm.offline)
		parts.push($p.ajax.get_ex(irest_attr.url, irest_attr));

	parts.push($p.ajax.get(data_url + "meta.json?v="+$p.job_prm.files_date));
	parts.push($p.ajax.get(data_url + "meta_patch.json?v="+$p.job_prm.files_date));

	// читаем файл метаданных и файл патча метаданных
	return $p.eve.reduce_promices(parts, function (req) {
		if(req instanceof XMLHttpRequest && req.status == 200){
			if(req.responseURL.indexOf("/hs/rest") != -1)
				$p.job_prm.irest_enabled = true;

			else if(req.responseURL.indexOf("meta.json") != -1){
				onstep($p.eve.steps.create_managers);
				mreq = JSON.parse(req.response);

			}else if(req.responseURL.indexOf("meta_patch.json") != -1)
				mpatch = JSON.parse(req.response);
		}else{
			$p.record_log(req);
		}
	})
		// создаём объект Meta() описания метаданных
		.then(function () {
			if(!mreq)
				throw Error("Ошибка чтения файла метаданных");
			else
				return new Meta(mreq, mpatch);
		})

		// авторизуемся на сервере. в автономном режиме сразу переходим к чтению первого файла данных
		.then(function (res) {

			mreq = mpatch = null;

			onstep($p.eve.steps.authorization);

			if($p.job_prm.offline)
				return res;

			else if($p.job_prm.rest || $p.job_prm.irest_enabled){

				// TODO: реализовать метод для получения списка ролей пользователя

				// в режиме rest тестируем авторизацию. если irest_enabled, значит уже авторизованы
				if($p.job_prm.irest_enabled)
					return {root: true};
				else
					return $p.ajax.get_ex($p.job_prm.rest_url()+"?$format=json", true)
						.then(function (req) {
							//return JSON.parse(res.response);
							return {root: true};
						});

			}else
				return _load({
					action: "get_meta",
					cache_cat_date: stepper.cat_ini_date,
					now_js: Date.now(),
					margin: $p.wsql.get_user_param("margin", "number"),
					ipinfo: $p.ipinfo.hasOwnProperty("latitude") ? JSON.stringify($p.ipinfo) : ""
				})
		})

		// обработчик ошибок авторизации
		.catch(function (err) {

			if($p.iface.auth.onerror)
				$p.iface.auth.onerror(err);

			throw err;
		})

		// интерпретируем ответ сервера
		.then(function (res) {

			onstep($p.eve.steps.load_data_files);

			if($p.job_prm.offline)
				return res;

			$p.ajax.authorized = true;

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
			if(res.cat && res.cat["clrs"])
				_md.get("cat.clrs").predefined.white.ref = res.cat["clrs"].predefined.white.ref;
			if(res.cat && res.cat["bases"])
				_md.get("cat.bases").predefined.main.ref = res.cat["bases"].predefined.main.ref;

			return res;
		})

		// сохраняем даты справочников в mdd и читаем первый файл данных
		.then(function(res){

			mdd = res;

			stepper.zone = ($p.job_prm.demo ? "1" : $p.wsql.get_user_param("zone")) + "/";

			return $p.ajax.get(data_url + "zones/" + stepper.zone + "p_0.json?v="+$p.job_prm.files_date)
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

			parts = [];
			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

			return $p.eve.reduce_promices(parts, $p.eve.from_json_to_data_obj);

		})

		// если онлайн, выполняем такт обмена с 1С
		.then(function() {

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

			// здесь же, уточняем список печатных форм и
			_md.printing_plates(mdd.printing_plates);

			// и запоминаем в ajax признак полноправности пользователя
			if($p.ajax.hasOwnProperty("root"))
				delete $p.ajax.root;
			$p.ajax.__define("root", {
				value: !!mdd.root,
				writable: false,
				enumerable: false
			});
		})

		// сохраняем данные в локальной датабазе
		.then(function () {
			onstep($p.eve.steps.save_data_wsql);
		});

};

$p.eve.auto_log_in = function () {
	var stepper = $p.eve.stepper,
		data_url = $p.job_prm.data_url || "/data/",
		parts = [],
		mreq, mpatch, p_0, mdd;


	stepper.zone = $p.wsql.get_user_param("zone") + "/";

	parts.push($p.ajax.get(data_url + "meta.json?v="+$p.job_prm.files_date));
	parts.push($p.ajax.get(data_url + "meta_patch.json?v="+$p.job_prm.files_date));
	parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_0.json?v="+$p.job_prm.files_date));

	// читаем файл метаданных, файл патча метаданных и первый файл снапшота
	return $p.eve.reduce_promices(parts, function (req) {
		if(req instanceof XMLHttpRequest && req.status == 200){
			if(req.responseURL.indexOf("meta.json") != -1)
				mreq = JSON.parse(req.response);

			else if(req.responseURL.indexOf("meta_patch.json") != -1)
				mpatch = JSON.parse(req.response);

			else if(req.responseURL.indexOf("p_0.json") != -1)
				p_0 = JSON.parse(req.response);
		}else{
			$p.record_log(req);
		}
	})
		// создаём объект Meta() описания метаданных
		.then(function () {
			if(!mreq)
				throw Error("Ошибка чтения файла метаданных");
			else
				return new $p.Meta(mreq, mpatch);
		})

		// из содержимого первого файла получаем количество файлов и загружаем их все
		.then(function (req) {

			stepper.files = p_0.files-1;
			stepper.step_size = p_0.files > 0 ? Math.round(p_0.count_all / p_0.files) : 57;
			stepper.cat_ini_date = p_0["cat_date"];
			$p.eve.from_json_to_data_obj(p_0);

		})

		// формируем массив url файлов данных зоны
		.then(function () {

			parts = [];
			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

			return $p.eve.reduce_promices(parts, $p.eve.from_json_to_data_obj);

		})

		// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
		.then(function () {
			stepper.step_size = 57;
		})
};