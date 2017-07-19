class AppEvents {

	constructor($p) {

		const eve = this;
		const {msg, job_prm, wsql, iface, classes} = $p;

		this.$p = $p;

		this.do_eventable(this, $p.md);
		if (typeof window !== 'undefined' && window.dhx4) {
			for (var p in dhx4) {
				if (!this[p]) {
					this[p] = dhx4[p];
				}
				delete dhx4[p];
			}
			window.dhx4 = this;
		}

		this.steps = {
			load_meta: 0,           // загрузка метаданных из файла
			authorization: 1,       // авторизация на сервере 1С или Node (в автономном режиме шаг не выполняется)
			create_managers: 2,     // создание менеджеров объектов
			process_access: 3,     // загрузка данных пользователя, обрезанных по RLS (контрагенты, договоры, организации)
			load_data_files: 4,     // загрузка данных из файла зоны
			load_data_db: 5,        // догрузка данных с сервера 1С или Node
			load_data_wsql: 6,      // загрузка данных из локальной датабазы (имеет смысл, если локальная база не в ОЗУ)
			save_data_wsql: 7       // кеширование данных из озу в локальную датабазу
		};


		/**
		 * Отслеживаем онлайн
		 */
		window.addEventListener('online', this.set_offline.bind(this));
		window.addEventListener('offline', this.set_offline.bind(this, true));

		/**
		 * ждём готовности документа
		 */
		window.addEventListener('load', () => {

			/**
			 * Инициализацию выполняем с небольшой задержкой,
			 * чтобы позволить сторонним скриптам подписаться на событие onload и сделать свои черные дела
			 */
			setTimeout(() => {

				/**
				 * Метод может быть вызван сторонним сайтом через post_message
				 * @param url
				 */
				function navigate(url) {
					if (url && (location.origin + location.pathname).indexOf(url) == -1)
						location.replace(url);
				}

				/**
				 * Инициализируем параметры пользователя,
				 * проверяем offline и версию файлов
				 */
				function init_params() {

					function load_css() {

						var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
						if (surl.indexOf('cdn.jsdelivr.net') != -1)
							surl = '//cdn.jsdelivr.net/metadata/latest/';

						// стили загружаем только при необходимости
						for (var i = 0; i < document.styleSheets.length; i++) {
							if (document.styleSheets[i].href) {
								if (document.styleSheets[i].href.indexOf('dhx_web') != -1 || document.styleSheets[i].href.indexOf('dhx_terrace') != -1)
									load_dhtmlx = false;
								if (document.styleSheets[i].href.indexOf('metadata.css') != -1)
									load_meta = false;
							}
						}

						//str.replace(new RegExp(list[i] + '$'), 'finish')
						if (load_dhtmlx)
							$p.load_script(surl + (dhtmlx.skin == 'dhx_web' ? 'dhx_web.css' : 'dhx_terrace.css'), 'link');
						if (load_meta)
							$p.load_script(surl + 'metadata.css', 'link');

						// дополнительные стили
						if (job_prm.additional_css)
							job_prm.additional_css.forEach(function (name) {
								if (dhx4.isIE || name.indexOf('ie_only') == -1)
									$p.load_script(name, 'link');
							});

						// задаём путь к картинкам
						dhtmlx.image_path = '//oknosoft.github.io/metadata.js/lib/imgs/';

						// суффикс скина
						dhtmlx.skin_suffix = function () {
							return dhtmlx.skin.replace('dhx', '') + '/';
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
						// iface.__define('w', {
						// 	value: new dhtmlXWindows(),
						// 	enumerable: false,
						// });
						// iface.w.setSkin(dhtmlx.skin);

						/**
						 * ### Всплывающие подсказки
						 * См. описание на сайте dhtmlx [dhtmlXPopup](http://docs.dhtmlx.com/popup__index.html)
						 * @property popup
						 * @for InterfaceObjs
						 * @type dhtmlXPopup
						 */
						iface.__define('popup', {
							value: new dhtmlXPopup(),
							enumerable: false,
						});

					}

					function load_data() {
						// читаем локальные данные в ОЗУ
						wsql.pouch.load_data()
							.catch($p.record_log);

						load_finish();

					}

					function load_finish() {
						// если есть сплэш, удаляем его
						if (document.querySelector('#splash')) {
							document.querySelector('#splash').parentNode.removeChild(splash);
						}

						eve.emit('iface_init', $p);
					}


					// создавать dhtmlXWindows можно только после готовности документа
					if ('dhtmlx' in window)
						load_css();

					// разбираемся с ориентацией
					if (typeof(window.orientation) == 'undefined') {
						job_prm.device_orient = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
					}
					else {
						eve.on_rotate();
					}
					window.addEventListener('orientationchange', eve.on_rotate.bind(eve), false);

					eve.stepper = {
						step: 0,
						count_all: 0,
						step_size: 57,
						files: 0,
						ram: {},
						doc: {},
					};

					eve.set_offline(!navigator.onLine);

					// инициализируем метаданные и обработчик при начале работы интерфейса
					if (wsql.get_user_param('couch_direct')) {

						const on_user_log_in = wsql.pouch.on('user_log_in', function () {
							wsql.pouch.off(on_user_log_in);
							load_finish();
						});

						// если это демо (zone === zone_demo), устанавливаем логин и пароль
						if (wsql.get_user_param('zone') == job_prm.zone_demo &&
							!wsql.get_user_param('user_name') && job_prm.guests.length) {
							wsql.set_user_param('enable_save_pwd', true);
							wsql.set_user_param('user_name', job_prm.guests[0].username);
							wsql.set_user_param('user_pwd', job_prm.guests[0].password);
						}

						setTimeout(function () {
							iface.frm_auth({
								modal_dialog: true,
								try_auto: false,
							});
						}, 100);
					}
					else {
						setTimeout(load_data, 20);
					}

					// TODO: переписать управление appcache на сервисворкерах
					if (window.applicationCache) {
						const cache = window.applicationCache;

						// обновление не требуется
						cache.addEventListener('noupdate', (e) => console.log(e), false);

						// Ресурсы уже кэшированнны. Индикатор прогресса скрыт.
						cache.addEventListener('cached', (e) => {
							timer_setted = true;
							if (iface.appcache)
								iface.appcache.close();
						}, false);

						// Начало скачивания ресурсов. progress_max - количество ресурсов. Показываем индикатор прогресса
						//cache.addEventListener('downloading', do_cache_update_msg, false);

						// Процесс скачивания ресурсов. Индикатор прогресса изменяется
						//cache.addEventListener('progress', do_cache_update_msg,	false);

						// Скачивание завершено. Скрываем индикатор прогресса. Обновляем кэш. Перезагружаем страницу.
						cache.addEventListener('updateready', (e) => {
							try {
								cache.swapCache();
							} catch (e) {
							}
							iface.do_reload();
						}, false);

						// Ошибка кеша
						cache.addEventListener('error', $p.record_log, false);
					}
				}


				/**
				 * если в job_prm указано использование геолокации, геокодер инициализируем с небольшой задержкой
				 */
				if (job_prm.use_ip_geo || job_prm.use_google_geo) {

					/**
					 * Данные геолокации
					 * @property ipinfo
					 * @for MetaEngine
					 * @type IPInfo
					 * @static
					 */
					$p.ipinfo = new classes.IPInfo($p);

				}
				if (job_prm.use_google_geo) {

					// подгружаем скрипты google
					if (!window.google || !window.google.maps) {
						$p.on('iface_init', function () {
							setTimeout(function () {
								$p.load_script('https://maps.google.com/maps/api/js?key=' + job_prm.use_google_geo + '&callback=$p.ipinfo.location_callback', 'script', function () {
								});
							}, 100);
						});
					}
					else {
						$p.ipinfo.location_callback();
					}
				}


				job_prm.__define('device_type', {
					get: function () {
						var device_type = wsql.get_user_param('device_type');
						if (!device_type) {
							device_type = (function (i) {
								return (i < 800 ? 'phone' : (i < 1024 ? 'tablet' : 'desktop'));
							})(Math.max(screen.width, screen.height));
							wsql.set_user_param('device_type', device_type);
						}
						return device_type;
					},
					set: function (v) {
						wsql.set_user_param('device_type', v);
					},
				});

				/**
				 * слушаем события клавиатуры
				 */
				document.body.addEventListener('keydown', (ev) => eve.callEvent('keydown', [ev]), false);

				setTimeout(init_params, 10);

			}, 10);

		}, false);

		/**
		 * Обработчик события "перед закрытием окна"
		 * @event onbeforeunload
		 * @for AppEvents
		 * @returns {string} - если не путсто, браузер показывает диалог с вопросом, можно ли закрывать
		 */
		window.onbeforeunload = () => !eve.redirect && msg.onbeforeunload;

		/**
		 * Обработчик back/forward событий браузера
		 * @event popstat
		 * @for AppEvents
		 */
		window.addEventListener('popstat', iface.hash_route);

		/**
		 * Обработчик события изменения hash в url
		 * @event hashchange
		 * @for AppEvents
		 */
		window.addEventListener('hashchange', iface.hash_route);

	}

	/**
	 * Устанавливает состояние online/offline в параметрах работы программы
	 * @method set_offline
	 * @for AppEvents
	 * @param offline {Boolean}
	 */
	set_offline(offline) {
		const {job_prm} = this.$p;
		var current_offline = job_prm['offline'];
		job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
		if (current_offline != job_prm['offline']) {
			// предпринять действия
			current_offline = job_prm['offline'];

		}
	}

	/**
	 * Тип устройства и ориентация экрана
	 * @method on_rotate
	 * @for AppEvents
	 * @param e {Event}
	 */
	on_rotate(e) {
		const {job_prm} = this.$p;
		job_prm.device_orient = (window.orientation == 0 || window.orientation == 180 ? 'portrait' : 'landscape');
		if (typeof(e) != 'undefined')
			this.callEvent('onOrientationChange', [job_prm.device_orient]);
	}

	/**
	 * ### Добавляет объекту методы генерации и обработки событий
	 *
	 * @method do_eventable
	 * @for AppEvents
	 * @param obj {Object} - объект, которому будут добавлены eventable свойства
	 */
	do_eventable(obj, target) {

		obj.__define({

			on: {
				value: target.on.bind(target),
				enumerable: true,
			},

			attachEvent: {
				get: function () {
					return this.on;
				},
				enumerable: true,
			},

			off: {
				value: target.off.bind(target),
				enumerable: true,
			},

			detachEvent: {
				get: function () {
					return this.off;
				},
				enumerable: true,
			},

			detachAllEvents: {
				value: function (type) {
					return target.off(type);
				},
				enumerable: true,
			},

			checkEvent: {
				value: function (name) {
					return target.eventNames().join(',').match(match(new RegExp(name, 'i')));
				},
				enumerable: true,
			},

			callEvent: {
				value: function (type, args = []) {
					return target.emit(type, ...args);
				},
				enumerable: true,
			},

			emit: {
				value: target.emit.bind(target),
				enumerable: true,
			},

		});
	}


	/**
	 * Авторизация на сервере 1С
	 * @method log_in
	 * @for AppEvents
	 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
	 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
	 * @async
	 */
	log_in(onstep) {

		const {job_prm, ajax} = this.$p;
		const {steps} = this;

		let irest_attr = {},
			mdd;

		// информируем о начале операций
		onstep(steps.load_meta);

		// выясняем, доступен ли irest (наш сервис) или мы ограничены стандартным rest-ом
		// параллельно, проверяем авторизацию
		ajax.default_attr(irest_attr, job_prm.irest_url());

		return (job_prm.offline ? Promise.resolve({responseURL: '', response: ''}) : ajax.get_ex(irest_attr.url, irest_attr))

			.then(function (req) {
				if (!job_prm.offline)
					job_prm.irest_enabled = true;
				if (req.response[0] == '{')
					return JSON.parse(req.response);
			})

			.catch(function () {
				// если здесь ошибка, значит доступен только стандартный rest
			})

			.then(function (res) {


				onstep(steps.authorization);

				// TODO: реализовать метод для получения списка ролей пользователя
				mdd = res;
				mdd.root = true;

				// в автономном режиме сразу переходим к чтению первого файла данных
				// если irest_enabled, значит уже авторизованы
				if (job_prm.offline || job_prm.irest_enabled)
					return mdd;

				else
					return ajax.get_ex(job_prm.rest_url() + '?$format=json', true)
						.then(function () {
							return mdd;
						});
			})

			// обработчик ошибок авторизации
			.catch(function (err) {

				if ($p.iface.auth.onerror)
					$p.iface.auth.onerror(err);

				throw err;
			})

			// интерпретируем ответ сервера
			.then(function (res) {

				onstep(steps.load_data_files);

				if (job_prm.offline)
					return res;

				// широковещательное оповещение об авторизованности на сервере
				$p.eve.callEvent('user_log_in', [ajax.authorized = true]);

				if (typeof res == 'string')
					res = JSON.parse(res);

				if ($p.msg.check_soap_result(res))
					return;

				if ($p.wsql.get_user_param('enable_save_pwd'))
					$p.wsql.set_user_param('user_pwd', ajax.password);

				else if ($p.wsql.get_user_param('user_pwd'))
					$p.wsql.set_user_param('user_pwd', '');

				// сохраняем разницу времени с сервером
				if (res.now_1c && res.now_js)
					$p.wsql.set_user_param('time_diff', res.now_1c - res.now_js);

			})

			// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными, здесь же, уточняем список печатных форм
			.then(function () {
				_md.printing_plates(mdd.printing_plates);
			});
	}
}


export default ($p) => {
	$p.eve = new AppEvents($p);
}