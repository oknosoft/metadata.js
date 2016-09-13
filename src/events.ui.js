/**
 * Этот фрагмент кода выполняем только в браузере
 * Created 28.12.2015<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule events.ui
 */

$p.eve.__define({

	/**
	 * Устанавливает состояние online/offline в параметрах работы программы
	 * @method set_offline
	 * @for AppEvents
	 * @param offline {Boolean}
	 */
	set_offline: {
		value: function(offline){
			var current_offline = $p.job_prm['offline'];
			$p.job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
			if(current_offline != $p.job_prm['offline']){
				// предпринять действия
				current_offline = $p.job_prm['offline'];

			}
		}
	},

	/**
	 * Тип устройства и ориентация экрана
	 * @method on_rotate
	 * @for AppEvents
	 * @param e {Event}
	 */
	on_rotate: {
		value: function (e) {
			$p.job_prm.device_orient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
			if (typeof(e) != "undefined")
				$p.eve.callEvent("onOrientationChange", [$p.job_prm.device_orient]);

			// if($p.job_prm.device_type != "desktop"){
			// 	setTimeout(function () {
			// 		document.body.style.height = window.outerHeight + 'px';
			// 		setTimeout(function () {
			// 			window.scrollTo(0, 1);
			// 		}, 1100);
			// 	}, 1000);
			// 	return false;
			// }

		}
	},

	/**
	 * Шаги синхронизации (перечисление состояний)
	 * @property steps
	 * @for AppEvents
	 * @type SyncSteps
	 */
	steps: {
		value: {
			load_meta: 0,           // загрузка метаданных из файла
			authorization: 1,       // авторизация на сервере 1С или Node (в автономном режиме шаг не выполняется)
			create_managers: 2,     // создание менеджеров объектов
			process_access:  3,     // загрузка данных пользователя, обрезанных по RLS (контрагенты, договоры, организации)
			load_data_files: 4,     // загрузка данных из файла зоны
			load_data_db: 5,        // догрузка данных с сервера 1С или Node
			load_data_wsql: 6,      // загрузка данных из локальной датабазы (имеет смысл, если локальная база не в ОЗУ)
			save_data_wsql: 7       // кеширование данных из озу в локальную датабазу
		}
	},

	/**
	 * Авторизация на сервере 1С
	 * @method log_in
	 * @for AppEvents
	 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
	 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
	 * @async
	 */
	log_in: {
		value: function(onstep){

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
					$p.eve.callEvent("log_in", [$p.ajax.authorized = true]);

					if(typeof res == "string")
						res = JSON.parse(res);

					if($p.msg.check_soap_result(res))
						return;

					if($p.wsql.get_user_param("enable_save_pwd"))
						$p.wsql.set_user_param("user_pwd", $p.ajax.password);

					else if($p.wsql.get_user_param("user_pwd"))
						$p.wsql.set_user_param("user_pwd", "");

					// сохраняем разницу времени с сервером
					if(res.now_1c && res.now_js)
						$p.wsql.set_user_param("time_diff", res.now_1c - res.now_js);

				})

				// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
				.then(function () {

					// здесь же, уточняем список печатных форм
					_md.printing_plates(mdd.printing_plates);

				});
		}
	}

});


/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
(function(w, eve, msg){

	var timer_setted = false,
		cache;

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
			 * Метод может быть вызван сторонним сайтом через post_message
			 * @param url
			 */
			function navigate(url){
				if(url && (location.origin + location.pathname).indexOf(url)==-1)
					location.replace(url);
			}

			/**
			 * Инициализируем параметры пользователя,
			 * проверяем offline и версию файлов
			 */
			function init_params(){

				function load_css(){

					var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
					if(surl.indexOf("cdn.jsdelivr.net")!=-1)
						surl = "//cdn.jsdelivr.net/metadata/latest/";

					// стили загружаем только при необходимости
					for(var i=0; i < document.styleSheets.length; i++){
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

				// устанавливаем параметры localStorage
				$p.wsql.init_params();

				// создавать dhtmlXWindows можно только после готовности документа
				if("dhtmlx" in w)
					load_css();

				// разбираемся с ориентацией
				if(typeof(w.orientation)=="undefined")
					$p.job_prm.device_orient = w.innerWidth>w.innerHeight ? "landscape" : "portrait";
				else
					eve.on_rotate();
				w.addEventListener("orientationchange", eve.on_rotate, false);

				eve.stepper = {
					step: 0,
					count_all: 0,
					step_size: 57,
					files: 0
				};

				eve.set_offline(!navigator.onLine);

				// инициализируем метаданные и обработчик при начале работы интерфейса
				setTimeout(function () {

					// читаем локальные данные в ОЗУ
					$p.wsql.pouch.load_data()
						.catch($p.record_log);

					// если есть сплэш, удаляем его
					var splash;
					if(splash = document.querySelector("#splash"))
						splash.parentNode.removeChild(splash);

					eve.callEvent("iface_init", [$p]);

				}, 20);


				msg.russian_names();

				// TODO: переписать управление appcache на сервисворкерах
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
					//cache.addEventListener('downloading', do_cache_update_msg, false);

					// Процесс скачивания ресурсов. Индикатор прогресса изменяется
					//cache.addEventListener('progress', do_cache_update_msg,	false);

					// Скачивание завершено. Скрываем индикатор прогресса. Обновляем кэш. Перезагружаем страницу.
					cache.addEventListener('updateready', function(e) {
						try{
							cache.swapCache();
						}catch(e){}
						$p.iface.do_reload();
					}, false);

					// Ошибка кеша
					cache.addEventListener('error', $p.record_log, false);
				}
			}

			// проверяем совместимость браузера
			if(!w.JSON || !w.indexedDB){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				throw msg.unsupported_browser;
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
			$p.__define("job_prm", {
				value: new JobPrm(),
				writable: false
			});

			/**
			 * если в job_prm указано использование геолокации, геокодер инициализируем с небольшой задержкой
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
			if ($p.job_prm.use_google_geo) {

				// подгружаем скрипты google
				if(!window.google || !window.google.maps){
					$p.on("iface_init", function () {
						setTimeout(function(){
							$p.load_script("//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});
						}, 100);
					});

				}else
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

			$p.job_prm.__define("device_type", {
				get: function () {
					var device_type = $p.wsql.get_user_param("device_type");
					if(!device_type){
						device_type = (function(i){return (i<800?"phone":(i<1024?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
						$p.wsql.set_user_param("device_type", device_type);
					}
					return device_type;
				},
				set: function (v) {
					$p.wsql.set_user_param("device_type", v);
				}
			});

			/**
			 * слушаем события клавиатуры
			 */
			document.body.addEventListener("keydown", function (ev) {
				eve.callEvent("keydown", [ev]);
			}, false);

			setTimeout(init_params, 10);

		}, 10);

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

})(window, $p.eve, $p.msg);
