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
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule events
 */

/**
 * ### Обработчики событий приложения
 *
 * Cм. так же, модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events_browser"}}{{/crossLinkModule}}
 *
 * @class AppEvents
 * @static
 * @menuorder 30
 * @tooltip Движок событий
 */
function AppEvents() {

	this.__define({

		/**
		 * ### Запускает процесс инициализаци параметров и метаданных
		 *
		 * @method run
		 * @for AppEvents
		 *
		 */
		init: {
			value: function () {
				$p.__define("job_prm", {
					value: new JobPrm(),
					writable: false
				});
				$p.wsql.init_params();
			}
		},

		/**
		 * ### Добавляет объекту методы генерации и обработки событий
		 *
		 * @method do_eventable
		 * @for AppEvents
		 * @param obj {Object} - объект, которому будут добавлены eventable свойства
		 */
		do_eventable: {
			value: function (obj) {

				function attach(name, func) {
					name = String(name).toLowerCase();
					if (!this._evnts.data[name])
						this._evnts.data[name] = {};
					var eventId = $p.utils.generate_guid();
					this._evnts.data[name][eventId] = func;
					return eventId;
				}

				function detach(eventId) {

					if(!eventId){
						return detach_all.call(this);
					}

					for (var a in this._evnts.data) {
						var k = 0;
						for (var b in this._evnts.data[a]) {
							if (b == eventId) {
								this._evnts.data[a][b] = null;
								delete this._evnts.data[a][b];
							} else {
								k++;
							}
						}
						if (k == 0) {
							this._evnts.data[a] = null;
							delete this._evnts.data[a];
						}
					}
				}

				 function detach_all() {
					for (var a in this._evnts.data) {
						for (var b in this._evnts.data[a]) {
							this._evnts.data[a][b] = null;
							delete this._evnts.data[a][b];
						}
						this._evnts.data[a] = null;
						delete this._evnts.data[a];
					}
				}

				function call(name, params) {
					name = String(name).toLowerCase();
					if (this._evnts.data[name] == null)
						return true;
					var r = true;
					for (var a in this._evnts.data[name]) {
						r = this._evnts.data[name][a].apply(this, params) && r;
					}
					return r;
				}

				function ontimer() {

					for(var name in this._evnts.evnts){
						var l = this._evnts.evnts[name].length;
						if(l){
							for(var i=0; i<l; i++){
								this.emit(name, this._evnts.evnts[name][i]);
							}
							this._evnts.evnts[name].length = 0;
						}
					}

					this._evnts.timer = 0;
				}

				obj.__define({

					_evnts: {
						value: {
							data: {},
							timer: 0,
							evnts: {}
						}
					},

					on: {
						value: attach
					},

					attachEvent: {
						value: attach
					},

					off: {
						value: detach
					},

					detachEvent: {
						value: detach
					},

					detachAllEvents: {
						value: detach_all
					},

					checkEvent: {
						value: function(name) {
							name = String(name).toLowerCase();
							return (this._evnts.data[name] != null);
						}
					},

					callEvent: {
						value: call
					},

					emit: {
						value: call
					},

					emit_async: {
						value: function callEvent(name, params){

							if(!this._evnts.evnts[name])
								this._evnts.evnts[name] = [];

							this._evnts.evnts[name].push(params);

							if(this._evnts.timer)
								clearTimeout(this._evnts.timer);

							this._evnts.timer = setTimeout(ontimer.bind(this), 4);
						}
					}

				});
			}
		}
	});

	// если мы внутри браузера и загружен dhtmlx, переносим в AppEvents свойства dhx4
	if(typeof window !== "undefined" && window.dhx4){
		for(var p in dhx4){
			this[p] = dhx4[p];
			delete dhx4[p];
		}
		window.dhx4 = this;

	}else if(typeof WorkerGlobalScope === "undefined"){

		// мы внутри Nodejs

		this.do_eventable(this);

	}

}

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 *
 * @class JobPrm
 * @static
 * @menuorder 04
 * @tooltip Параметры приложения
 */
function JobPrm(){

	function base_url(){
		return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	function parse_url(){

		function parse(url_prm){
			var prm = {}, tmp = [], pairs;

			if(url_prm.substr(0, 1) === "#" || url_prm.substr(0, 1) === "?")
				url_prm = url_prm.substr(1);

			if(url_prm.length > 2){

				pairs = decodeURI(url_prm).split('&');

				// берём параметры из url
				for (var i in pairs){   //разбиваем пару на ключ и значение, добавляем в их объект
					tmp = pairs[i].split('=');
					if(tmp[0] == "m"){
						try{
							prm[tmp[0]] = JSON.parse(tmp[1]);
						}catch(e){
							prm[tmp[0]] = {};
						}
					}else
						prm[tmp[0]] = tmp[1] || "";
				}
			}

			return prm;
		}

		return parse(location.search)._mixin(parse(location.hash));
	}

	this.__define({

		/**
		 * Осуществляет синтаксический разбор параметров url
		 * @method parse_url
		 * @return {Object}
		 */
		parse_url: {
			value: parse_url
		},

		offline: {
			value: false,
			writable: true
		},

		local_storage_prefix: {
			value: "",
			writable: true
		},

		create_tables: {
			value: true,
			writable: true
		},

		/**
		 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
		 * @property url_prm
		 * @type {Object}
		 * @static
		 */
		url_prm: {
			value: typeof window != "undefined" ? parse_url() : {}
		},

		/**
		 * Адрес стандартного интерфейса 1С OData
		 * @method rest_url
		 * @return {string}
		 */
		rest_url: {
			value: function () {
				var url = base_url(),
					zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
				if(zone)
					return url.replace("%1", zone);
				else
					return url.replace("%1/", "");
			}
		},

		/**
		 * Адрес http интерфейса библиотеки интеграции
		 * @method irest_url
		 * @return {string}
		 */
		irest_url: {
			value: function () {
				var url = base_url(),
					zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
				url = url.replace("odata/standard.odata", "hs/rest");
				if(zone)
					return url.replace("%1", zone);
				else
					return url.replace("%1/", "");
			}
		}
	});

	// подмешиваем параметры, заданные в файле настроек сборки
	$p.eve.callEvent("settings", [this, $p.modifiers]);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

}

/**
 * ### Модификатор отложенного запуска
 * Служебный объект, реализующий отложенную загрузку модулей,<br />
 * в которых доопределяется (переопределяется) поведение объектов и менеджеров конкретных типов
 *
 * @class Modifiers
 * @constructor
 * @menuorder 62
 * @tooltip Внешние модули
 */
function Modifiers(){

	var methods = [];

	/**
	 * Добавляет метод в коллекцию методов для отложенного вызова
	 * @method push
	 * @param method {Function} - функция, которая будет вызвана после инициализации менеджеров объектов данных
	 */
	this.push = function (method) {
		methods.push(method);
	};

	/**
	 * Отменяет подписку на событие
	 * @method detache
	 * @param method {Function}
	 */
	this.detache = function (method) {
		var index = methods.indexOf(method);
		if(index != -1)
			methods.splice(index, 1);
	};

	/**
	 * Отменяет все подписки
	 * @method clear
	 */
	this.clear = function () {
		methods.length = 0;
	};

	/**
	 * Загружает и выполняет методы модификаторов
	 * @method execute
	 */
	this.execute = function (context) {

		// выполняем вшитые в сборку модификаторы
		var res, tres;
		methods.forEach(function (method) {
			if(typeof method === "function")
				tres = method(context);
			else
				tres = $p.injected_data[method](context);
			if(res !== false)
				res = tres;
		});
		return res;
	};

	/**
	 * выполняет подключаемые модификаторы
	 * @method execute_external
	 * @param data
	 */
	this.execute_external = function (data) {

		var paths = $p.wsql.get_user_param("modifiers");

		if(paths){
			paths = paths.split('\n').map(function (path) {
				if(path)
					return new Promise(function(resolve, reject){
						$p.load_script(path, "script", resolve);
					});
				else
					return Promise.resolve();
			});
		}else
			paths = [];

		return Promise.all(paths)
			.then(function () {
				this.execute(data);
			}.bind(this));
	};

}

