/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */


/**
 * Фреймворк добавляет в прототипы _Object_ и _Number_<br />
 * несколько методов - синтаксический сахар для _наследования_ и работы со _свойствами_
 * @class Object
 * @constructor
 */


Object.defineProperties(Object.prototype, {

	/**
	 * Синтаксический сахар для defineProperty
	 * @method __define
	 * @for Object
	 */
	__define: {
		value: function( key, descriptor ) {
			if( descriptor ) {
				Object.defineProperty( this, key, descriptor );
			} else {
				Object.defineProperties( this, key );
			}
			return this;
		}
	},

	/**
	 * Реализует наследование текущим конструктором свойств и методов конструктора Parent
	 * @method _extend
	 * @for Object
	 * @param Parent {Function}
	 */
	_extend: {
		value: function( Parent ) {
			var F = function() { };
			F.prototype = Parent.prototype;
			this.prototype = new F();
			this.prototype.constructor = this;
			this.__define("superclass", {
				value: Parent.prototype,
				enumerable: false
			});
		}
	},

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param src {Object} - источник
	 * @return {this}
	 */
	_mixin: {
		value: function(src, include, exclude ) {
			var tobj = {}, i, f; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа
			if(include && include.length){
				for(i = 0; i<include.length; i++){
					f = include[i];
					if(exclude && exclude.indexOf(f)!=-1)
						continue;
					// копируем в dst свойства src, кроме тех, которые унаследованы от Object
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}else{
				for(f in src){
					if(exclude && exclude.indexOf(f)!=-1)
						continue;
					// копируем в dst свойства src, кроме тех, которые унаследованы от Object
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}
			return this;
		}
	},

	/**
	 * Создаёт копию объекта
	 * @method _clone
	 * @for Object
	 * @param src {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	_clone: {
		value: function() {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager || v instanceof Date)
							c[p] = v;

						else if("object" === typeof v)
							c[p] = v._clone();

						else
							c[p] = v;
					} else
						c[p] = v;
				}
			}
			return c;
		}
	}
});

/**
 * Метод округления в прототип числа
 * @method round
 * @for Number
 */
if(!Number.prototype.round)
	Number.prototype.round = function(places) {
		var multiplier = Math.pow(10, places);
		return (Math.round(this * multiplier) / multiplier);
	};

/**
 * Метод дополнения лидирующими нулями в прототип числа
 * @method pad
 * @for Number
 */
if(!Number.prototype.pad)
	Number.prototype.pad = function(size) {
		var s = String(this);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};

/**
 * Полифил обсервера и нотифаера
 */
if(!Object.observe && !Object.unobserve && !Object.getNotifier){
	Object.prototype.__define({

		/**
		 * Подключает наблюдателя
		 * @method observe
		 * @for Object
		 */
		observe: {
			value: function(target, observer) {
				if(!target._observers)
					target.__define({
						_observers: {
							value: [],
							enumerable: false
						},
						_notis: {
							value: [],
							enumerable: false
						}
					});
				target._observers.push(observer);
			},
			enumerable: false
		},

		/**
		 * Отключает наблюдателя
		 * @method unobserve
		 * @for Object
		 */
		unobserve: {
			value: function(target, observer) {
				if(!target._observers)
					return;
				for(var i=0; i<target._observers.length; i++){
					if(target._observers[i]===observer){
						target._observers.splice(i, 1);
						break;
					}
				}
			},
			enumerable: false
		},

		/**
		 * Возвращает объект нотификатора
		 * @method getNotifier
		 * @for Object
		 */
		getNotifier: {
			value: function(target) {
				var timer;
				return {
					notify: function (noti) {

						if(!target._observers || !noti)
							return;

						if(!noti.object)
							noti.object = target;

						target._notis.push(noti);
						noti = null;

						if(timer)
							clearTimeout(timer);

						timer = setTimeout(function () {
							//TODO: свернуть массив оповещений перед отправкой
							if(target._notis.length){
								target._observers.forEach(function (observer) {
									observer(target._notis);
								});
								target._notis.length = 0;
							}
							timer = false;

						}, 4);
					}
				}
			},
			enumerable: false
		}

	});
}


/**
 * Для совместимости со старыми модулями, публикуем $p глобально
 * Кроме этой переменной, metadata.js ничего не экспортирует
 */
var $p = new MetaEngine();


/**
 * ### Metadata.js - проект с открытым кодом
 * Приглашаем к сотрудничеству всех желающих. Будем благодарны за любую помощь
 *
 * ### Почему Metadata.js?
 * Библиотека предназначена для разработки бизнес-ориентированных и учетных offline-first браузерных приложений
 * и содержит JavaScript реализацию [Объектной модели 1С](http://v8.1cru/overview/Platform.htm).
 * Библиотека эмулирует наиболее востребованные классы API 1С внутри браузера или Node.js, дополняя их средствами автономной работы и обработки данных на клиенте.
 *
 * ### Для кого?
 * Для разработчиков мобильных и браузерных приложений, которым близка парадигма 1С _на базе бизнес-объектов: документов и справочников_,
 * но которым тесно в рамках традиционной платформы 1С.<br />
 * Metadata.js предоставляет программисту:
 * - высокоуровневые [data-объекты](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html), схожие по функциональности с документами, регистрами и справочниками платформы 1С
 * - инструменты декларативного описания метаданных и автогенерации интерфейса, схожие по функциональности с метаданными и формами платформы 1С
 * - средства событийно-целостной репликации и эффективные классы обработки данных, не имеющие прямых аналогов в 1С
 *
 * ### Контекст metadata.js
 * [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует в глобальную область видимости переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 * @menuorder 00
 * @tooltip Контекст metadata.js
 */
function MetaEngine() {

	this.__define({

		version: {
			value: "PACKAGE_VERSION_NUMBER",
			writable: false
		},

		toString: {
			value: function(){
				return "Oknosoft data engine. v:" + this.version;
			},
			writable: false
		},

		/**
		 * ### Коллекция вспомогательных методов
		 *
		 * @property utils
		 * @type Utils
		 * @final
		 */
		utils: {
			value: new Utils()
		},

		/**
		 * ### Буфер для строковых и двоичных данных, внедряемых в скрипт
		 * В этой структуре живут, например, sql текст инициализации таблиц, xml-строки форм и менюшек и т.д.
		 *
		 * @property injected_data
		 * @type Object
		 * @final
		 */
		injected_data: {
			value: {},
			writable: false
		},

		/**
		 * Наша promise-реализация ajax
		 *
		 * @property ajax
		 * @type Ajax
		 * @final
		 */
		ajax: {
			value: new Ajax(),
			writable: false
		},

		/**
		 * Сообщения пользователю и строки нитернационализации
		 * @property msg
		 * @type Messages
		 * @final
		 */
		msg: {
			value: new Messages(),
			writable: false
		},

		/**
		 * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
		 * @property wsql
		 * @type WSQL
		 * @final
		 */
		wsql: {
			value: new WSQL(),
			writable: false
		},

		/**
		 * Обработчики событий приложения
		 * Подробнее см. модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events.ui"}}{{/crossLinkModule}}
		 * @property eve
		 * @type AppEvents
		 * @final
		 */
		eve: {
			value: new AppEvents(),
			writable: false
		},

		/**
		 * ### Модификаторы менеджеров объектов метаданных
		 * Т.к. экземпляры менеджеров и конструкторы объектов доступны в системе только после загрузки метаданных,
		 * а метаданные загружаются после авторизации на сервере, методы модификаторов нельзя выполнить при старте приложения
		 * @property modifiers
		 * @type {Modifiers}
		 * @final
		 */
		modifiers: {
			value: new Modifiers(),
			writable: false
		},

		/**
		 * Aes для шифрования - дешифрования данных
		 *
		 * @property aes
		 * @type Aes
		 * @final
		 */
		aes: {
			value: new Aes("metadata.js"),
			writable: false
		},

		/**
		 * ### Moment для операций с интервалами и датами
		 *
		 * @property moment
		 * @type Function
		 * @final
		 */
		moment: {
			get: function () { return this.utils.moment; }
		},

		/**
		 * ### Подмешивает в объект свойства с иерархией объекта patch
		 * В отличии от `_mixin`, не замещает, а дополняет одноименные свойства
		 *
		 * @method _patch
		 * @param obj {Object}
		 * @param patch {Object}
		 * @return {Object} - исходный объект с подмешанными свойствами
		 */
		_patch: {
			value: function (obj, patch) {
				for(var area in patch){

					if(typeof patch[area] == "object"){
						if(obj[area] && typeof obj[area] == "object")
							$p._patch(obj[area], patch[area]);
						else
							obj[area] = patch[area];
					}else
						obj[area] = patch[area];
				}
				return obj;
			}
		},

		/**
		 * ### Подключает обработчики событий
		 *
		 * @method on
		 * @param name {String|Object} - имя события
		 * @param fn {Function} - функция - обработчик
		 * @returns {*}
		 */
		on: {
			value: function (name, fn) {
				if(typeof name == "object"){
					for(var n in name){
						if(!name[n]._evnts)
							name[n]._evnts = [];
						name[n]._evnts.push(this.eve.attachEvent(n, name[n]));
					}
				}else
					return this.eve.attachEvent(name, fn);
			}
		},

		/**
		 * ### Отключает обработчики событий
		 *
		 * @method off
		 * @param id {String|Number|Function}
		 */
		off: {
			value: function (id) {
				if(typeof id == "function" && id._evnts){
					id._evnts.forEach(function (id) {
						$p.eve.detachEvent(id);
					});
				}else
					$p.eve.detachEvent(id);
			}
		},

		DataManager: {
			value: DataManager
		},

		RefDataManager: {
			value: RefDataManager
		},

		DataProcessorsManager: {
			value: DataProcessorsManager
		},

		EnumManager: {
			value: EnumManager
		},

		RegisterManager: {
			value: RegisterManager
		},

		InfoRegManager: {
			value: InfoRegManager
		},

		InfoRegManager: {
			value: InfoRegManager
		},

		LogManager: {
			value: LogManager
		},

		AccumRegManager: {
			value: AccumRegManager
		},

		CatManager: {
			value: CatManager
		},

		ChartOfCharacteristicManager: {
			value: ChartOfCharacteristicManager
		},

		ChartOfAccountManager: {
			value: ChartOfAccountManager
		},

		DocManager: {
			value: DocManager
		},

		TaskManager: {
			value: TaskManager
		},

		BusinessProcessManager: {
			value: BusinessProcessManager
		},

		DataObj: {
			value: DataObj
		},

		CatObj: {
			value: CatObj
		},

		DocObj: {
			value: DocObj
		},

		DataProcessorObj: {
			value: DataProcessorObj
		},

		TaskObj: {
			value: TaskObj
		},

		BusinessProcessObj: {
			value: BusinessProcessObj
		},

		EnumObj: {
			value: EnumObj
		},

		RegisterRow: {
			value: RegisterRow
		},

		TabularSection: {
			value: TabularSection
		},

		TabularSectionRow: {
			value: TabularSectionRow
		}

	});
}

/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
function Utils() {

	/**
	 * ### Moment для операций с интервалами и датами
	 *
	 * @property moment
	 * @type Function
	 * @final
	 */
	this.moment = typeof moment == "function" ? moment : require('moment');
	this.moment._masks = {
		date:       "DD.MM.YY",
		date_time:  "DD.MM.YYYY HH:mm",
		ldt:        "DD MMMM YYYY, HH:mm",
		iso:        "YYYY-MM-DDTHH:mm:ss"
	};


	/**
	 * ### Приводит значение к типу Дата
	 *
	 * @method fix_date
	 * @param str {String|Number|Date} - приводиме значение
	 * @param [strict=false] {Boolean} - если истина и значение не приводится к дате, возвращать пустую дату
	 * @return {Date|*}
	 */
	this.fix_date = function(str, strict){

		if(str instanceof Date)
			return str;
		else{
			var m = this.moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", this.moment.ISO_8601]);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	};

	/**
	 * ### Извлекает guid из строки или ссылки или объекта
	 *
	 * @method fix_guid
	 * @param ref {*} - значение, из которого надо извлечь идентификатор
	 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
	 * @return {String}
	 */
	this.fix_guid = function(ref, generate){

		if(ref && typeof ref == "string"){

		} else if(ref instanceof DataObj)
			return ref.ref;

		else if(ref && typeof ref == "object"){
			if(ref.presentation){
				if(ref.ref)
					return ref.ref;
				else if(ref.name)
					return ref.name;
			}
			else
				ref = (typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref")) ?  ref.ref.ref : ref.ref;
		}

		if(this.is_guid(ref) || generate === false)
			return ref;

		else if(generate)
			return this.generate_guid();

		else
			return this.blank.guid;
	};

	/**
	 * ### Приводит значение к типу Число
	 *
	 * @method fix_number
	 * @param str {*} - приводиме значение
	 * @param [strict=false] {Boolean} - конвертировать NaN в 0
	 * @return {Number}
	 */
	this.fix_number = function(str, strict){
		var v = parseFloat(str);
		if(!isNaN(v))
			return v;
		else if(strict)
			return 0;
		else
			return str;
	};

	/**
	 * ### Приводит значение к типу Булево
	 *
	 * @method fix_boolean
	 * @param str {String}
	 * @return {boolean}
	 */
	this.fix_boolean = function(str){
		if(typeof str === "string")
			return !(!str || str.toLowerCase() == "false");
		else
			return !!str;
	};

	/**
	 * ### Пустые значения даты и уникального идентификатора
	 *
	 * @property blank
	 * @type Blank
	 * @final
	 */
	this.blank = {
		date: this.fix_date("0001-01-01T00:00:00"),
		guid: "00000000-0000-0000-0000-000000000000",
		by_type: function(mtype){
			var v;
			if(mtype.is_ref)
				v = this.guid;
			else if(mtype.date_part)
				v = this.date;
			else if(mtype["digits"])
				v = 0;
			else if(mtype.types && mtype.types[0]=="boolean")
				v = false;
			else
				v = "";
			return v;
		}
	};

	/**
	 * ### Приводит тип значения v к типу метаданных
	 *
	 * @method fetch_type
	 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
	 * @param mtype {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	this.fetch_type = function(str, mtype){
		var v = str;
		if(mtype.is_ref)
			v = this.fix_guid(str);
		else if(mtype.date_part)
			v = this.fix_date(str, true);
		else if(mtype["digits"])
			v = this.fix_number(str, true);
		else if(mtype.types[0]=="boolean")
			v = this.fix_boolean(str);
		return v;
	};

	/**
	 * ### Добавляет days дней к дате
	 *
	 * @method date_add_day
	 * @param date {Date} - исходная дата
	 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
	 * @return {Date}
	 */
	this.date_add_day = function(date, days, reset_time){
		var newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if(reset_time)
			newDt.setHours(0,-newDt.getTimezoneOffset(),0,0);
		return newDt;
	}

	/**
	 * ### Генерирует новый guid
	 *
	 * @method generate_guid
	 * @return {String}
	 */
	this.generate_guid = function(){
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
	};

	/**
	 * ### Проверяет, является ли значение guid-ом
	 *
	 * @method is_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
	 */
	this.is_guid = function(v){
		if(typeof v !== "string" || v.length < 36)
			return false;
		else if(v.length > 36)
			v = v.substr(0, 36);
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
	};

	/**
	 * ### Проверяет, является ли значение пустым идентификатором
	 *
	 * @method is_empty_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если v эквивалентен пустому guid
	 */
	this.is_empty_guid = function (v) {
		return !v || v === this.blank.guid;
	};

	/**
	 * ### Проверяет, является ли значенние Data-объектным типом
	 *
	 * @method is_data_obj
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	this.is_data_obj = function(v){
		return v && v instanceof DataObj;
	};

	/**
	 * ### Проверяет, является ли значенние менеджером объектов данных
	 *
	 * @method is_data_mgr
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	this.is_data_mgr = function(v){
		return v && v instanceof DataManager;
	};

	/**
	 * ### Сравнивает на равенство ссылочные типы и примитивные значения
	 *
	 * @method is_equal
	 * @param v1 {DataObj|String}
	 * @param v2 {DataObj|String}
	 * @return {boolean} - true, если значенния эквивалентны
	 */
	this.is_equal = function(v1, v2){

		if(v1 == v2)
			return true;
		else if(typeof v1 === typeof v2)
			return false;

		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	};

	/**
	 * ### Читает данные из блоба
	 * Возвращает промис с прочитанными данными
	 *
	 * @param blob {Blob}
	 * @param [type] {String} - если type == "data_url", в промисе будет возвращен DataURL, а не текст
	 * @return {Promise}
	 */
	this.blob_as_text = function (blob, type) {

		return new Promise(function(resolve, reject){
			var reader = new FileReader();
			reader.onload = function(event){
				resolve(reader.result);
			};
			reader.onerror = function(err){
				reject(err);
			};
			if(type == "data_url")
				reader.readAsDataURL(blob);
			else
				reader.readAsText(blob);
		});

	};

}

/**
 * ### Наша promise-реализация ajax
 * - Поддерживает basic http авторизацию
 * - Позволяет установить перед отправкой запроса специфические заголовки
 * - Поддерживает получение и отправку данных с типом `blob`
 * - Позволяет отправлять запросы типа `get`, `post`, `put`, `patch`, `delete`
 *
 * @class Ajax
 * @static
 * @menuorder 31
 * @tooltip Работа с http
 */
function Ajax() {


	function _call(method, url, post_data, auth, before_send) {

		// Возвращаем новое Обещание
		return new Promise(function(resolve, reject) {

			// внутри Node, используем request
			if(typeof window == "undefined" && auth && auth.request){

				auth.request({
						url: encodeURI(url),
						headers : {
							"Authorization": auth.auth
						}
					},
					function (error, response, body) {
						if(error)
							reject(error);

						else if(response.statusCode != 200)
							reject({
								message: response.statusMessage,
								description: body,
								status: response.statusCode
							});

						else
							resolve({response: body});
					}
				);

			}else {

				// делаем привычные для XHR вещи
				var req = new XMLHttpRequest();

				if(window.dhx4 && window.dhx4.isIE)
					url = encodeURI(url);

				if(auth){
					var username, password;
					if(typeof auth == "object" && auth.username && auth.hasOwnProperty("password")){
						username = auth.username;
						password = auth.password;
						
					}else{
						if($p.ajax.username && $p.ajax.authorized){
							username = $p.ajax.username;
							password = $p.aes.Ctr.decrypt($p.ajax.password);
							
						}else{
							username = $p.wsql.get_user_param("user_name");
							password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
							
							if(!username && $p.job_prm && $p.job_prm.guest_name){
								username = $p.job_prm.guest_name;
								password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
							}
						}
					}
					req.open(method, url, true, username, password);
					req.withCredentials = true;
					req.setRequestHeader("Authorization", "Basic " +
						btoa(unescape(encodeURIComponent(username + ":" + password))));
				}else
					req.open(method, url, true);

				if(before_send)
					before_send.call(this, req);

				if (method != "GET") {
					if(!this.hide_headers && !auth.hide_headers){
						req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					}
				} else {
					post_data = null;
				}

				req.onload = function() {
					// Этот кусок вызовется даже при 404’ой ошибке
					// поэтому проверяем статусы ответа
					if (req.status == 200 && (req.response instanceof Blob || req.response.substr(0,9)!=="<!DOCTYPE")) {
						// Завершаем Обещание с текстом ответа
						if(req.responseURL == undefined)
							req.responseURL = url;
						resolve(req);
					}
					else {
						// Обламываемся, и передаём статус ошибки
						// что бы облегчить отладку и поддержку
						if(req.response)
							reject({
								message: req.statusText,
								description: req.response,
								status: req.status
							});
						else
							reject(Error(req.statusText));
					}
				};

				// отлавливаем ошибки сети
				req.onerror = function() {
					reject(Error("Network Error"));
				};

				// Делаем запрос
				req.send(post_data);
			}

		});

	}

	/**
	 * имя пользователя для авторизации на сервере
	 * @property username
	 * @type String
	 */
	this.username = "";

	/**
	 * пароль пользователя для авторизации на сервере
	 * @property password
	 * @type String
	 */
	this.password = "";

	/**
	 * На этапе отладки считаем всех пользователей полноправными
	 * @type {boolean}
	 */
	this.root = true;

	/**
	 * признак авторизованности на сервере
	 * @property authorized
	 * @type Boolean
	 */
	this.authorized = false;

	/**
	 * Выполняет асинхронный get запрос
	 * @method get
	 * @param url {String}
	 * @return {Promise.<T>}
	 * @async
	 */
	this.get = function(url) {
		return _call.call(this, "GET", url);
	};

	/**
	 * Выполняет асинхронный post запрос
	 * @method post
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.post = function(url, postData) {
		if (arguments.length == 1) {
			postData = "";
		} else if (arguments.length == 2 && (typeof(postData) == "function")) {
			onLoad = postData;
			postData = "";
		} else {
			postData = String(postData);
		}
		return _call.call(this, "POST", url, postData);
	};

	/**
	 * Выполняет асинхронный get запрос с авторизацией и возможностью установить заголовки http
	 * @method get_ex
	 * @param url {String}
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.get_ex = function(url, auth, beforeSend){
		return _call.call(this, "GET", url, null, auth, beforeSend);

	};

	/**
	 * Выполняет асинхронный post запрос с авторизацией и возможностью установить заголовки http
	 * @method post_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.post_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "POST", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный put запрос с авторизацией и возможностью установить заголовки http
	 * @method put_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.put_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "PUT", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный patch запрос с авторизацией и возможностью установить заголовки http
	 * @method patch_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.patch_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "PATCH", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный delete запрос с авторизацией и возможностью установить заголовки http
	 * @method delete_ex
	 * @param url {String}
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	this.delete_ex = function(url, auth, beforeSend){
		return _call.call(this, "DELETE", url, null, auth, beforeSend);

	};

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
	 * @method get_and_show_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param [method] {String}
	 * @async
	 */
	this.get_and_show_blob = function(url, post_data, method){

		var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
			wnd_print;

		function show_blob(req){
			url = window.URL.createObjectURL(req.response);
			wnd_print = window.open(url, "wnd_print", params);
			wnd_print.onload = function(e) {
				window.URL.revokeObjectURL(url);
			};
			return wnd_print;
		}

		if(!method || (typeof method == "string" && method.toLowerCase().indexOf("post")!=-1))
			return this.post_ex(url,
				typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
				true,
				function(xhr){
					xhr.responseType = "blob";
				})
				.then(show_blob);
		else
			return this.get_ex(url, true, function(xhr){
					xhr.responseType = "blob";
				})
				.then(show_blob);
	};

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает диалог сохранения в файл
	 * @method get_and_save_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param file_name {String} - имя файла для сохранения
	 * @return {Promise.<T>}
	 */
	this.get_and_save_blob = function(url, post_data, file_name){

		return this.post_ex(url,
			typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function(xhr){
				xhr.responseType = "blob";
			})
			.then(function(req){
				saveAs(req.response, file_name);
			});
	};

	this.default_attr = function (attr, url) {
		if(!attr.url)
			attr.url = url;
		if(!attr.username)
			attr.username = this.username;
		if(!attr.password)
			attr.password = this.password;
		attr.hide_headers = true;

		if($p.job_prm["1c"]){
			attr.auth = $p.job_prm["1c"].auth;
			attr.request = $p.job_prm["1c"].request;
		}
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

/**
 * ### Интерфейс к localstorage, alasql и pouchdb
 * - Обеспечивает взаимодействие с локальными и серверными данными
 * - Обслуживает локальные параметры пользователя
 *
 * @class WSQL
 * @static
 * @menuorder 33
 * @tooltip Данные localstorage
 */
function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	this.__define({

		/**
		 * Поправка времени javascript
		 * @property js_time_diff
		 * @type Number
		 */
		js_time_diff: {
			value: -(new Date("0001-01-01")).valueOf()
		},

		/**
		 * Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
		 * @property time_diff
		 * @type Number
		 */
		time_diff: {
			get: function () {
				var diff = this.get_user_param("time_diff", "number");
				return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
			}
		},

		/**
		 * ### Устанавливает параметр в user_params и localStorage
		 *
		 * @method set_user_param
		 * @param prm_name {string} - имя параметра
		 * @param prm_value {string|number|object|boolean} - значение
		 * @async
		 */
		set_user_param: {
			value: function(prm_name, prm_value){

				var str_prm = prm_value;
				if(typeof prm_value == "object")
					str_prm = JSON.stringify(prm_value);

				else if(prm_value === false)
					str_prm = "";

				ls.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
				user_params[prm_name] = prm_value;
			}
		},

		/**
		 * ### Возвращает значение сохраненного параметра из localStorage
		 * Параметр извлекается с приведением типа
		 *
		 * @method get_user_param
		 * @param prm_name {String} - имя параметра
		 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
		 * @return {*} - значение параметра
		 */
		get_user_param: {
			value: function(prm_name, type){

				if(!user_params.hasOwnProperty(prm_name) && ls)
					user_params[prm_name] = this.fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);

				return user_params[prm_name];
			}
		},

		/**
		 * Выполняет sql запрос к локальной базе данных, возвращает Promise
		 * @param sql
		 * @param params
		 * @return {Promise}
		 * @async
		 */
		promise: {
			value: function(sql, params) {
				return new Promise(function(resolve, reject){
					wsql.alasql(sql, params || [], function(data, err) {
						if(err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				});
			}
		},

		/**
		 * Сохраняет настройки формы или иные параметры объекта _options_
		 * @method save_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - сохраняемые параметры
		 * @return {Promise}
		 * @async
		 */
		save_options: {
			value: function(prefix, options){
				return wsql.set_user_param(prefix + "_" + options.name, options);
			}
		},

		/**
		 * Восстанавливает сохраненные параметры в объект _options_
		 * @method restore_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - объект, в который будут записаны параметры
		 */
		restore_options: {
			value: function(prefix, options){
				var options_saved = wsql.get_user_param(prefix + "_" + options.name, "object");
				for(var i in options_saved){
					if(typeof options_saved[i] != "object")
						options[i] = options_saved[i];
					else{
						if(!options[i])
							options[i] = {};
						for(var j in options_saved[i])
							options[i][j] = options_saved[i][j];
					}
				}
				return options;
			}
		},

		/**
		 * Приведение типов при операциях с `localStorage`
		 * @method fetch_type
		 * @param prm
		 * @param type
		 * @returns {*}
		 */
		fetch_type: {
			value: 	function(prm, type){
				if(type == "object"){
					try{
						prm = JSON.parse(prm);
					}catch(e){
						prm = {};
					}
					return prm;
				}else if(type == "number")
					return $p.utils.fix_number(prm, true);
				else if(type == "date")
					return $p.utils.fix_date(prm, true);
				else if(type == "boolean")
					return $p.utils.fix_boolean(prm);
				else
					return prm;
			}
		},

		/**
		 * ### Создаёт и заполняет умолчаниями таблицу параметров
		 * Внутри Node, в функцию следует передать ссылку на alasql
		 *
		 * @method init_params
		 * @return {Promise}
		 * @async
		 */
		init_params: {

			value: function(){

				// префикс параметров LocalStorage
				// TODO: отразить в документации, что если префикс пустой, то параметры не инициализируются
				if(!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables)
					return Promise.resolve();

				if(typeof localStorage === "undefined"){

					// локальное хранилище внутри node.js
					if(typeof WorkerGlobalScope === "undefined"){
						ls = new require('node-localstorage').LocalStorage('./localstorage');

					}else{
						ls = {
							setItem: function (name, value) {

							},
							getItem: function (name) {

							}
						};
					}

				} else
					ls = localStorage;

				/**
				 * ### Указатель на alasql
				 * @property alasql
				 * @for WSQL
				 * @type Function
				 */
				wsql.__define("alasql", {
					value: typeof alasql != "undefined" ? alasql : ($p.job_prm.alasql || require("alasql"))
				});

				wsql.aladb = new wsql.alasql.Database('md');

				// значения базовых параметров по умолчанию
				var nesessery_params = [
					{p: "user_name",		v: "", t:"string"},
					{p: "user_pwd",			v: "", t:"string"},
					{p: "browser_uid",		v: $p.utils.generate_guid(), t:"string"},
					{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t: $p.job_prm.zone_is_string ? "string" : "number"},
					{p: "enable_save_pwd",	v: $p.job_prm.enable_save_pwd,	t:"boolean"},
					{p: "autologin",		v: "",	t:"boolean"},
					{p: "skin",		        v: "dhx_web", t:"string"},
					{p: "rest_path",		v: "", t:"string"}
				],	zone;

				// подмешиваем к базовым параметрам настройки приложения
				if($p.job_prm.additional_params)
					nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

				// если зона не указана, устанавливаем "1"
				if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
					zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
				// если зона указана в url, используем её
				if($p.job_prm.url_prm.hasOwnProperty("zone"))
					zone = $p.job_prm.zone_is_string ? $p.job_prm.url_prm.zone : $p.utils.fix_number($p.job_prm.url_prm.zone, true);
				if(zone !== undefined)
					wsql.set_user_param("zone", zone);

				// дополняем хранилище недостающими параметрами
				nesessery_params.forEach(function(o){
					if(wsql.get_user_param(o.p, o.t) == undefined ||
						(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
						wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
				});

				// сообщяем движку pouch пути и префиксы
				var pouch_prm = {
					path: wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
					zone: wsql.get_user_param("zone", "number"),
					prefix: $p.job_prm.local_storage_prefix,
					suffix: wsql.get_user_param("couch_suffix", "string") || ""
				};
				if(pouch_prm.path){

					/**
					 * ### Указатель на локальные и сетевые базы PouchDB
					 * @property pouch
					 * @for WSQL
					 * @type Pouch
					 */
					wsql.__define("pouch", { value: new Pouch()	});
					wsql.pouch.init(pouch_prm);
				}

				return new Promise(function(resolve, reject){

					if($p.job_prm.create_tables){

						if($p.job_prm.create_tables_sql)
							wsql.alasql($p.job_prm.create_tables_sql, [], function(){
								delete $p.job_prm.create_tables_sql;
								resolve();
							});

						else if($p.injected_data["create_tables.sql"])
							wsql.alasql($p.injected_data["create_tables.sql"], [], function(){
								delete $p.injected_data["create_tables.sql"];
								resolve();
							});

						else if(typeof $p.job_prm.create_tables === "string")
							$p.ajax.get($p.job_prm.create_tables)
								.then(function (req) {
									wsql.alasql(req.response, [], resolve);
								});
						else
							resolve();
					}else
						resolve();

				});

			}
		},

		/**
		 * Удаляет таблицы WSQL. Например, для последующего пересоздания при изменении структуры данных
		 * @method drop_tables
		 * @param callback {Function}
		 * @async
		 */
		drop_tables: {
			value: function(callback){
				var cstep = 0, tmames = [];

				function ccallback(){
					cstep--;
					if(cstep<=0)
						setTimeout(callback, 10);
					else
						iteration();
				}

				function iteration(){
					var tname = tmames[cstep-1]["tableid"];
					if(tname.substr(0, 1) == "_")
						ccallback();
					else
						wsql.alasql("drop table IF EXISTS " + tname, [], ccallback);
				}

				function tmames_finded(data){
					tmames = data;
					if(cstep = data.length)
						iteration();
					else
						ccallback();
				}

				wsql.alasql("SHOW TABLES", [], tmames_finded);
			}
		}

	});

}
