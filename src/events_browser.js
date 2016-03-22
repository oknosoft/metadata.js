/**
 * Этот фрагмент кода выполняем только в браузере
 * Created 28.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author Evgeniy Malyarov
 * @module common
 * @submodule events_browser
 */

/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
(function(w){
	
	var eve = $p.eve,
		iface = $p.iface,
		msg = $p.msg,
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
			eve.callEvent("onOrientationChange", [$p.device_orient]);
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

	/**
	 * ждём готовности документа
	 */
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

				var _yageocoder,
					_ggeocoder,
					_ipgeo,
					_addr = "",
					_parts;

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



				this.__define({

					ipgeo: {
						value: function () {
							return $p.ajax.get("//api.sypexgeo.net/")
								.then(function (req) {
									return JSON.parse(req.response);
								})
								.catch($p.record_log);
						}
					},

					/**
					 * Объект [геокодера yandex](https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/)
					 * @property yageocoder
					 * @for IPInfo
					 * @type YaGeocoder
					 */
					yageocoder: {
						get : function(){

							if(!_yageocoder)
								_yageocoder = new YaGeocoder();
							return _yageocoder;
						},
						enumerable : false,
						configurable : false
					},

					/**
					 * Объект [геокодера google](https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests)
					 * @property ggeocoder
					 * @for IPInfo
					 * @type {google.maps.Geocoder}
					 */
					ggeocoder: {
						get : function(){
							return _ggeocoder;
						},
						enumerable : false,
						configurable : false
					},

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

									eve.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
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
			if($p.job_prm.use_ip_geo || $p.job_prm.use_google_geo){

				/**
				 * Данные геолокации
				 * @property ipinfo
				 * @for MetaEngine
				 * @type IPInfo
				 * @static
				 */
				$p.ipinfo = new IPInfo();

			}
			if (navigator.geolocation && $p.job_prm.use_google_geo) {

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
			if(!w.JSON || !w.indexedDB){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				throw msg.unsupported_browser;
				return;
			}

			/**
			 * Инициализируем параметры пользователя,
			 * проверяем offline и версию файлов
			 */
			function init_params(){

				$p.wsql.init_params().then(function(){

					function load_css(){

						var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
						if(surl.indexOf("cdn.jsdelivr.net")!=-1)
							surl = "//cdn.jsdelivr.net/metadata/latest/"

						// стили загружаем только при необходимости
						for(i=0; i < document.styleSheets.length; i++){
							if(document.styleSheets[i].href){
								if(document.styleSheets[i].href.indexOf("dhx_web")!=-1 || document.styleSheets[i].href.indexOf("dhx_terrace")!=-1)
									load_dhtmlx = false;
								if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
									load_meta = false;
							}
						}

						// задаём основной скин
						dhtmlx.skin = $p.wsql.get_user_param("skin") || $p.job_prm.skin || "dhx_web";

						//str.replace(new RegExp(list[i] + '$'), 'finish')
						if(load_dhtmlx)
							$p.load_script(surl + (dhtmlx.skin == "dhx_web" ? "dhx_web.css" : "dhx_terrace.css"), "link");
						if(load_meta)
							$p.load_script(surl + "metadata.css", "link");

						// дополнительные стили
						if($p.job_prm.additional_css)
							$p.job_prm.additional_css.forEach(function (name) {
								if(dhx4.isIE || name.indexOf("ie_only") == -1)
									$p.load_script(name, "link");
							});

						// задаём путь к картинкам
						dhtmlx.image_path = "//oknosoft.github.io/metadata.js/lib/imgs/";

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
						step_size: 57,
						files: 0
					};

					eve.set_offline(!navigator.onLine);

					/**
					 * Выполняем отложенные методы из eve.onload
					 */
					eve.onload.execute($p);

					// инициализируем метаданные и обработчик при начале работы интерфейса
					setTimeout(function () {

						$p.md.init()
							.catch($p.record_log);

						// Если есть сплэш, удаляем его
						if(document && document.querySelector("#splash"))
							document.querySelector("#splash").parentNode.removeChild(document.querySelector("#splash"));

						iface.oninit();

					}, 10);


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
						//cache.addEventListener('downloading', do_cache_update_msg, false);

						// Процесс скачивания ресурсов. Индикатор прогресса изменяется
						//cache.addEventListener('progress', do_cache_update_msg,	false);

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

			}, 10);

		}, 10);

		function do_reload(){
			if(!$p.ajax.authorized){
				eve.redirect = true;
				location.reload(true);
			}
		}



	}, false);

	/**
	 * слушаем события клавиатуры
 	 */
	document.body.addEventListener("keydown", function (ev) {
		eve.callEvent("keydown", [ev]);
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
 * Авторизация на сервере 1С
 * @method log_in
 * @for AppEvents
 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
 * @async
 */
$p.eve.log_in = function(onstep){

	var irest_attr = {},
		mdd;

	// информируем о начале операций
	onstep($p.eve.steps.load_meta);

	// выясняем, доступен ли irest (наш сервис) или мы ограничены стандартным rest-ом
	// параллельно, проверяем авторизацию
	$p.ajax.default_attr(irest_attr, $p.job_prm.irest_url());

	return ($p.job_prm.offline ? Promise.resolve({responseURL: "", response: ""}) : $p.ajax.get_ex(irest_attr.url, irest_attr))

		.then(function (req) {
			if(!$p.job_prm.offline)
				$p.job_prm.irest_enabled = true;
			if(req.response[0] == "{")
				return JSON.parse(req.response);
		})

		.catch(function () {
			// если здесь ошибка, значит доступен только стандартный rest
		})

		.then(function (res) {


			onstep($p.eve.steps.authorization);

			// TODO: реализовать метод для получения списка ролей пользователя
			mdd = res;
			mdd.root = true;

			// в автономном режиме сразу переходим к чтению первого файла данных
			// если irest_enabled, значит уже авторизованы
			if($p.job_prm.offline || $p.job_prm.irest_enabled)
				return mdd;

			else
				return $p.ajax.get_ex($p.job_prm.rest_url()+"?$format=json", true)
					.then(function () {
						return mdd;
					});
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

			// широковещательное оповещение об авторизованности на сервере
			eve.callEvent("log_in", [$p.ajax.authorized = true]);

			if(typeof res == "string")
				res = JSON.parse(res);

			if($p.msg.check_soap_result(res))
				return;

			if($p.wsql.get_user_param("enable_save_pwd"))
				$p.wsql.set_user_param("user_pwd", $p.ajax.password);

			else if($p.wsql.get_user_param("user_pwd"))
				$p.wsql.set_user_param("user_pwd", "");

			// сохраняем разницу времени с сервером
			if(res.now_1с && res.now_js)
				$p.wsql.set_user_param("time_diff", res.now_1с - res.now_js);

		})

		// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
		.then(function () {

			if(mdd.access){
				mdd.access.force = true;
				$p.eve.from_json_to_data_obj(mdd.access);
			}

			// здесь же, уточняем список печатных форм
			_md.printing_plates(mdd.printing_plates);

		});

};
