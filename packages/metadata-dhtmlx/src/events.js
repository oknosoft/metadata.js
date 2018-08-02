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
		 * ждём готовности документа
		 */
		window.addEventListener('load', () => {

			/**
			 * Инициализацию выполняем с небольшой задержкой,
			 * чтобы позволить сторонним скриптам подписаться на событие onload и сделать свои черные дела
			 */
			setTimeout(() => {


				/**
				 * Инициализируем параметры пользователя, проверяем offline и версию файлов
				 */
				function init_params() {

					// создавать dhtmlXWindows можно только после готовности документа
					if ('dhtmlx' in window){
						// задаём путь к картинкам
						dhtmlx.image_path = 'https://oknosoft.github.io/metadata.js/lib/imgs/';

						// запрещаем добавлять dhxr+date() к запросам get внутри dhtmlx
						dhx4.ajax.cache = true;


						/**
						 * ### Всплывающие подсказки
						 * См. описание на сайте dhtmlx [dhtmlXPopup](http://docs.dhtmlx.com/popup__index.html)
						 * @property popup
						 * @for InterfaceObjs
						 * @type dhtmlXPopup
						 */
						iface.__define('popup', {
							value: new dhtmlXPopup(),
						});
					}

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

					// TODO: переписать управление appcache на сервисворкерах
					if (window.applicationCache) {
						const cache = window.applicationCache;

						// обновление не требуется
						cache.addEventListener('noupdate', (e) => console.log(e), false);

						// Ресурсы уже кэшированнны. Индикатор прогресса скрыт.
						cache.addEventListener('cached', (e) => iface.appcache && iface.appcache.close(), false);

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
					$p.ipinfo = new classes.IPInfo();
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

				setTimeout(init_params, 10);

			}, 10);

		}, false);

		/**
		 * Обработчик события "перед закрытием окна"
		 * @event onbeforeunload
		 * @for AppEvents
		 * @returns {string} - если не путсто, браузер показывает диалог с вопросом, можно ли закрывать
		 */
		window.onbeforeunload = () => eve.redirect ? undefined : msg.onbeforeunload;

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
