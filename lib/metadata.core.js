/*!
 &copy; http://www.oknosoft.ru 2014-2015
 @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 @author Evgeniy Malyarov
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.$p = factory();
  }
}(this, function() {
/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */

/**
 * ### Глобальный объект
 * Фреймворк [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует единственную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 */
function MetaEngine() {
	this.version = "0.9.201";
	this.toString = function(){
		return "Oknosoft data engine. v:" + this.version;
	};
	this.injected_data = {};
}

/**
 * Для совместимости со старыми модулями, публикуем $p глобально
 * Кроме этой переменной, metadata.js ничего не экспортирует
 */
var $p = new MetaEngine();

if(typeof window !== "undefined"){

	/**
	 * Загружает скрипты и стили синхронно и асинхронно
	 * @method load_script
	 * @for MetaEngine
	 * @param src {String} - url ресурса
	 * @param type {String} - "link" или "script"
	 * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
	 * @async
	 */
	$p.load_script = function (src, type, callback) {
		var s = document.createElement(type);
		if (type == "script") {
			s.type = "text/javascript";
			s.src = src;
			if(callback){
				s.async = true;
				s.addEventListener('load', callback, false);
			}else
				s.async = false;
		} else {
			s.type = "text/css";
			s.rel = "stylesheet";
			s.href = src;
		}
		document.head.appendChild(s);
	};

}else{

	/**
	 * Читает данные из файла (только в Node.js)
	 * @param filename
	 * @return {Promise}
	 */
	$p.from_file = function(filename){
		return new Promise(function(resolve, reject){
			require('fs').readFile(filename, { encoding:'utf8' }, function(err, dataFromFile){
				if(err){
					reject(err);
				} else {
					resolve(dataFromFile.toString().trim());
				}
			});
		});
	}
}


/**
 * Фреймворк [metadata.js](https://github.com/oknosoft/metadata.js), добавляет в прототип _Object_<br />
 * несколько методов - синтаксический сахар для _наследования_ и работы со _свойствами_
 * @class Object
 * @constructor
 */

/**
 * Синтаксический сахар для defineProperty
 * @method __define
 * @for Object
 */
Object.defineProperty(Object.prototype, "__define", {
	value: function( key, descriptor ) {
		if( descriptor ) {
			Object.defineProperty( this, key, descriptor );
		} else {
			Object.defineProperties( this, key );
		}
		return this;
	},
	enumerable: false
});

Object.prototype.__define({

	/**
	 * Реализует наследование текущим конструктором свойств и методов конструктора Parent
	 * @method _extend
	 * @for Object
	 * @param Parent {Function}
	 */
	"_extend": {
		value: function( Parent ) {
			var F = function() { };
			F.prototype = Parent.prototype;
			this.prototype = new F();
			this.prototype.constructor = this;
			this.__define("superclass", {
				value: Parent.prototype,
				enumerable: false
			});
		},
		enumerable: false
	},

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param src {Object} - источник
	 * @return {Object}
	 */
	"_mixin": {
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
		},
		enumerable: false
	},

	/**
	 * Создаёт копию объекта
	 * @method _clone
	 * @for Object
	 * @param src {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	"_clone": {
		value: function() {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager)
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
		},
		enumerable: false
	}
});


/**
 * Полифил для обсервера и нотифаера пока не подключаем
 * Это простая заглушка, чтобы в старых браузерах не возникали исключения
 */
if(!Object.observe && !Object.unobserve && !Object.getNotifier)

	Object.prototype.__define({

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

		unobserve: {
			value: function(target, observer) {
				if(!target._observers)
					return;
				for(var i in target._observers){
					if(target._observers[i]===observer){
						target._observers.splice(i, 1);
						break;
					}
				}
			},
			enumerable: false
		},

		getNotifier: {
			value: function(target) {
				var timer_setted;
				return {
					notify: function (noti) {
						if(!target._observers)
							return;
						target._notis.push(noti);
						if(!timer_setted){
							timer_setted = true;
							setTimeout(function () {
								//TODO: свернуть массив оповещений перед отправкой
								target._observers.forEach(function (observer) {
									observer(target._notis);
								});
								target._notis.length = 0;
								timer_setted = false;
							}, 10);
						}
					}
				}
			},
			enumerable: false
		}
	});

/**
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * @method dateFormat
 * @for MetaEngine
 * @param date {Date} - источник
 * @param mask {dateFormat.masks} - маска формата
 * @param utc {Boolean} Converts the date from local time to UTC/GMT
 * @return {String}
 */
$p.dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = $p.dateFormat;

		if(!mask)
			mask = $p.dateFormat.masks.ru;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) date = new Date(0);

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

/**
 * Some common format strings
 */
$p.dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	atom:           "yyyy-mm-dd'T'HH:MM:ss'Z'",
	ru:				"dd.mm.yyyy HH:MM",
	short_ru:       "dd.mm.yyyy",
	date:           "dd.mm.yy",
	date_time:		"dd.mm.yy HH:MM"
};

/**
 * Наша promise-реализация ajax
 *
 * @property ajax
 * @for MetaEngine
 * @type Ajax
 * @static
 */
$p.ajax = new (

	/**
	 * ### Наша promise-реализация ajax
	 * - Поддерживает basic http авторизацию
	 * - Позволяет установить перед отправкой запроса специфические заголовки
	 * - Поддерживает получение и отправку данных с типом `blob`
	 * - Позволяет отправлять запросы типа `get`, `post`, `put`, `patch`, `delete`
	 *
	 * @class Ajax
	 * @static
	 */
	function Ajax() {

		function _call(method, url, post_data, auth, before_send) {

			// Возвращаем новое Обещание.
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
								password = $p.ajax.password;
							}else{
								username = $p.wsql.get_user_param("user_name");
								password = $p.wsql.get_user_param("user_pwd");
								if(!username && $p.job_prm && $p.job_prm.guest_name){
									username = $p.job_prm.guest_name;
									password = $p.job_prm.guest_pwd;
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
		}

	}
);

/**
 * Несколько статических методов двумерной математики
 * @property m
 * @for MetaEngine
 * @static
 */
$p.m = {

	/**
	 * ПоложениеТочкиОтносительноПрямой
	 * @param x {Number}
	 * @param y {Number}
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @return {number}
	 */
	point_pos: function(x,y, x1,y1, x2,y2){
		if (Math.abs(x1-x2) < 0.2){return (x-x1)*(y1-y2);}	// вертикаль  >0 - справа, <0 - слева,=0 - на линии
		if (Math.abs(y1-y2) < 0.2){return (y-y1)*(x2-x1);}	// горизонталь >0 - снизу, <0 - сверху,=0 - на линии
		return (y-y1)*(x2-x1)-(y2-y1)*(x-x1);				// >0 - справа, <0 - слева,=0 - на линии
	},

	/**
	 * КоординатыЦентраДуги
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @param r0 {Number}
	 * @param ccw {Boolean}
	 * @return {Point}
	 */
	arc_cntr: function(x1,y1, x2,y2, r0, ccw){
		var a,b,p,r,q,yy1,xx1,yy2,xx2;
		if(ccw){
			var tmpx=x1, tmpy=y1;
			x1=x2; y1=y2; x2=tmpx; y2=tmpy;
		}
		if (x1!=x2){
			a=(x1*x1 - x2*x2 - y2*y2 + y1*y1)/(2*(x1-x2));
			b=((y2-y1)/(x1-x2));
			p=b*b+ 1;
			r=-2*((x1-a)*b+y1);
			q=(x1-a)*(x1-a) - r0*r0 + y1*y1;
			yy1=(-r + Math.sqrt(r*r - 4*p*q))/(2*p);
			xx1=a+b*yy1;
			yy2=(-r - Math.sqrt(r*r - 4*p*q))/(2*p);
			xx2=a+b*yy2;
		} else{
			a=(y1*y1 - y2*y2 - x2*x2 + x1*x1)/(2*(y1-y2));
			b=((x2-x1)/(y1-y2));
			p=b*b+ 1;
			r=-2*((y1-a)*b+x1);
			q=(y1-a)*(y1-a) - r0*r0 + x1*x1;
			xx1=(-r - Math.sqrt(r*r - 4*p*q))/(2*p);
			yy1=a+b*xx1;
			xx2=(-r + Math.sqrt(r*r - 4*p*q))/(2*p);
			yy2=a+b*xx2;
		}

		if ($p.m.point_pos(xx1,yy1, x1,y1, x2,y2)>0)
			return {x: xx1, y: yy1};
		else
			return {x: xx2, y: yy2}
	},

	/**
	 * Рассчитывает координаты точки, лежащей на окружности
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @param r {Number}
	 * @param arc_ccw {Boolean}
	 * @param more_180 {Boolean}
	 * @return {Point}
	 */
	arc_point: function(x1,y1, x2,y2, r, arc_ccw, more_180){
		var point = {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
		if (r>0){
			var dx = x1-x2, dy = y1-y2, dr = r*r-(dx*dx+dy*dy)/4, l, h, centr;
			if(dr >= 0){
				centr = $p.m.arc_cntr(x1,y1, x2,y2, r, arc_ccw);
				dx = centr.x - point.x;
				dy = point.y - centr.y;	// т.к. Y перевернут
				l = Math.sqrt(dx*dx + dy*dy);

				if(more_180)
					h = r+Math.sqrt(dr);
				else
					h = r-Math.sqrt(dr);

				point.x += dx*h/l;
				point.y += dy*h/l;
			}
		}
		return point;
	}

};

/**
 * Пустые значения даты и уникального идентификатора
 * @property blank
 * @for MetaEngine
 * @static
 */
$p.blank = new function Blank() {
	this.date = new Date("0001-01-01");
	this.guid = "00000000-0000-0000-0000-000000000000";

	/**
	 * Возвращает пустое значение по типу метаданных
	 * @method by_type
	 * @param mtype {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	this.by_type = function(mtype){
		var v;
		if(mtype.is_ref)
			v = $p.blank.guid;
		else if(mtype.date_part)
			v = $p.blank.date;
		else if(mtype["digits"])
			v = 0;
		else if(mtype.types && mtype.types[0]=="boolean")
			v = false;
		else
			v = "";
		return v;
	};
};


/**
 * Проверяет, является ли значение guid-ом
 * @method is_guid
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
 */
$p.is_guid = function(v){
	if(typeof v !== "string" || v.length < 36)
		return false;
	else if(v.length > 36)
		v = v.substr(0, 36);
	return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
};

/**
 * Проверяет, является ли значение пустым идентификатором
 * @method is_empty_guid
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если v эквивалентен пустому guid
 */
$p.is_empty_guid = function (v) {
	return !v || v === $p.blank.guid;
};

/**
 * Генерирует новый guid
 * @method generate_guid
 * @for MetaEngine
 * @return {String}
 */
$p.generate_guid = function(){
	var d = new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
};

/**
 * Извлекает guid из строки или ссылки или объекта
 * @method fix_guid
 * @param ref {*} - значение, из которого надо извлечь идентификатор
 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
 * @return {String}
 */
$p.fix_guid = function(ref, generate){

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

	if($p.is_guid(ref) || generate === false)
		return ref;

	else if(generate)
		return $p.generate_guid();

	else
		return $p.blank.guid;
};

/**
 * Приводит значение к типу Число
 * @method fix_number
 * @param str {*} - приводиме значение
 * @param [strict=false] {Boolean} - конвертировать NaN в 0
 * @return {Number}
 */
$p.fix_number = function(str, strict){
	var v = parseFloat(str);
	if(!isNaN(v))
		return v;
	else if(strict)
		return 0;
	else
		return str;
};

/**
 * Приводит значение к типу Булево
 * @method fix_boolean
 * @param str {String}
 * @return {boolean}
 */
$p.fix_boolean = function(str){
	if(typeof str === "string")
		return !(!str || str.toLowerCase() == "false");
	else
		return !!str;
};

/**
 * Приводит значение к типу Дата
 * @method fix_date
 * @param str {*} - приводиме значение
 * @param [strict=false] {boolean} - если истина и значение не приводится к дате, возвращать пустую дату
 * @return {Date|*}
 */
$p.fix_date = function(str, strict){
	var dfmt = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
	if(str instanceof Date)
		return str;
	else if(str && typeof str == "string" && dfmt.test(str.substr(0,10))){
		var adp = str.split(" "), ad = adp[0].split("."), d, strr;
		if(ad.length == 1){
			ad = adp[0].split("/");
			if(ad.length == 1)
				ad = adp[0].split("-");
		}
		if(ad.length == 3 && ad[2].length == 4){
			strr = ad[2] + "-" + ad[1] + "-" + ad[0];
			for(var i = 1; i < adp.length; i++)
				strr += " " + adp[i];
			d=new Date(strr);
		}else
			d=new Date(str);

		if(d && d.getFullYear()>0)
			return d;
	}

	if(strict)
		return $p.blank.date;
	else
		return str;
};

/**
 * Добавляет days дней к дате
 * @method date_add_day
 * @param date {Date} - исходная дата
 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
 * @return {Date}
 */
$p.date_add_day = function(date, days){
	var newDt = new Date();
	newDt.setDate(date.getDate() + days);
	return newDt;
};

/**
 * Запрещает всплывание события
 * @param e {MouseEvent|KeyboardEvent}
 * @returns {Boolean}
 */
$p.cancel_bubble = function(e) {
	var evt = (e || event);
	if (evt && evt.stopPropagation)
		evt.stopPropagation();
	if (evt && !evt.cancelBubble)
		evt.cancelBubble = true;
	return false
};

/**
 * Сообщения пользователю и строки нитернационализации
 * @property msg
 * @type Messages
 * @static
 */
$p.msg = new Messages();

/**
 * ### Сообщения пользователю и строки нитернационализации
 *
 * @class Messages
 * @static
 */
function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};

	/**
	 * расширяем мессанджер
	 */
	if(typeof window !== "undefined" && "dhtmlx" in window){

		/**
		 * Показывает информационное сообщение или confirm
		 * @method show_msg
		 * @for Messages
		 * @param attr {object} - атрибуты сообщения attr.type - [info, alert, confirm, modalbox, info-error, alert-warning, confirm-error]
		 * @param [delm] - элемент html в тексте которого сообщение будет продублировано
		 * @example
		 *  $p.msg.show_msg({
		 *      title:"Important!",
		 *      type:"alert-error",
		 *      text:"Error"});
		 */
		this.show_msg = function(attr, delm){
			if(!attr)
				return;
			if(typeof attr == "string"){
				if($p.iface.synctxt){
					$p.iface.synctxt.show_message(attr);
					return;
				}
				attr = {type:"info", text:attr };
			}
			if(delm && typeof delm.setText == "function")
				delm.setText(attr.text);
			dhtmlx.message(attr);
		};

		/**
		 * Проверяет корректность ответа сервера
		 * @method check_soap_result
		 * @for Messages
		 * @param res {XMLHttpRequest|Object} - полученный с сервера xhr response
		 * @return {boolean} - true, если нет ошибки
		 */
		this.check_soap_result = function(res){
			if(!res){
				$p.msg.show_msg({
					type: "alert-error",
					text: $p.msg.empty_response,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error=="limit_query"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.limit_query.replace("%1", res["queries"]).replace("%2", res["queries_avalable"]),
					title: $p.msg.srv_overload});
				return true;

			}else if(res.error=="network" || res.error=="empty"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.error_network,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error && res.error_description){
				$p.iface.docs.progressOff();
				if(res.error_description.indexOf("Недостаточно прав") != -1){
					res["error_type"] = "alert-warning";
					res["error_title"] = $p.msg.error_rights;
				}
				$p.msg.show_msg({
					type: res["error_type"] || "alert-error",
					text: res.error_description,
					title: res["error_title"] || $p.msg.error_critical
				});
				return true;

			}else if(res.error && !res.messages){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-error",
					title: $p.msg.error_critical,
					text: $p.msg.unknown_error.replace("%1", "unknown_error")
				});
				return true;
			}

		};

		/**
		 * Показывает модальное сообщение о нереализованной функциональности
		 * @method show_not_implemented
		 * @for Messages
		 */
		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

/**
 * Объекты интерфейса пользователя
 * @class InterfaceObjs
 * @static
 */
function InterfaceObjs(){

	this.toString = function(){return "Объекты интерфейса пользователя"};

	/**
	 * Очищает область (например, удаляет из div все дочерние элементы)
	 * @method clear_svgs
	 * @param area {HTMLElement|String}
	 */
	this.clear_svgs = function(area){
		if(typeof area === "string")
			area = document.getElementById(area);
		while (area.firstChild)
			area.removeChild(area.firstChild);
	};

	/**
	 * Возвращает координату левого верхнего угла элемента относительно документа
	 * @method get_offset
	 * @param elm {HTMLElement} - элемент, координату которого, необходимо определить
	 * @return {Object} - {left: number, top: number}
	 */
	this.get_offset = function(elm) {
		var offset = {left: 0, top:0};
		if (elm.offsetParent) {
			do {
				offset.left += elm.offsetLeft;
				offset.top += elm.offsetTop;
			} while (elm = elm.offsetParent);
		}
		return offset;
	};

	/**
	 * Заменяет в строке критичные для xml символы
	 * @method normalize_xml
	 * @param str {string} - исходная строка, в которой надо замаскировать символы
	 * @return {XML|string}
	 */
	this.normalize_xml = function(str){
		if(!str) return "";
		var entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, function (s) {return entities[s];});
	};

	/**
	 * Масштабирует svg
	 * @method scale_svg
	 * @param svg_current {String} - исходная строка svg
	 * @param size {Number} - требуемый размер картинки
	 * @param padding {Number} - отступ от границы viewBox
	 * @return {String} - отмасштабированная строка svg
	 */
	this.scale_svg = function(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};

		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);

		// получаем w, h и формируем viewBox="0 0 400 100"
		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if(svg_current[0] == "width" || svg_current[0] == "height"){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}

		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="0 0 ' + (svg_j["width"] - padding) + ' ' + (svg_j["height"] - padding) + '"';
		}
		k = size / (svg_j["height"] - padding);
		svg_j["height"] = size;
		svg_j["width"] = Math.round(svg_j["width"] * k);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="' +
			svg_j["width"] + '" height="' + svg_j["height"] + '" xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
	};

	/**
	 * Добавляет в форму функциональность вызова справки
	 * @method bind_help
	 * @param wnd {dhtmlXWindowsCell}
	 * @param [path] {String} - url справки
	 */
	this.bind_help = function (wnd, path) {

		function frm_help(win){
			if(!win.help_path){
				$p.msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: $p.msg.not_implemented
				});
				return;
			}
		}

		if(wnd instanceof dhtmlXCellObject) {
			// TODO реализовать кнопку справки для приклеенной формы
		}else{
			if(!wnd.help_path && path)
				wnd.help_path = path;

			wnd.button('help').show();
			wnd.button('help').enable();
			wnd.attachEvent("onHelp", frm_help);
		}

	};

	/**
	 * Устанавливает hash url для сохранения истории и последующей навигации
	 * @method set_hash
	 * @param [obj] {String|Object} - имя класса или объект со свойствами к установке в хеш адреса
	 * @param [ref] {String} - ссылка объекта
	 * @param [frm] {String} - имя формы объекта
	 * @param [view] {String} - имя представления главной формы
	 */
	this.set_hash = function (obj, ref, frm, view ) {

		var ext = {},
			hprm = $p.job_prm.parse_url();

		if(arguments.length == 1 && typeof obj == "object"){
			ext = obj;
			if(ext.hasOwnProperty("obj")){
				obj = ext.obj;
				delete ext.obj;
			}
			if(ext.hasOwnProperty("ref")){
				ref = ext.ref;
				delete ext.ref;
			}
			if(ext.hasOwnProperty("frm")){
				frm = ext.frm;
				delete ext.frm;
			}
			if(ext.hasOwnProperty("view")){
				view = ext.view;
				delete ext.view;
			}
		}

		if(obj === undefined)
			obj = hprm.obj || "";
		if(ref === undefined)
			ref = hprm.ref || "";
		if(frm === undefined)
			frm = hprm.frm || "";
		if(view === undefined)
			view = hprm.view || "";

		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;
		for(var key in ext){
			hash += "&" + key + "=" + ext[key];
		}

		if(location.hash.substr(1) == hash)
			this.hash_route();
		else
			location.hash = hash;
	};

	/**
	 * Выполняет навигацию при изменении хеша url
	 * @method hash_route
	 * @param event {HashChangeEvent}
	 * @return {Boolean}
	 */
	this.hash_route = function (event) {

		var hprm = $p.job_prm.parse_url(),
			res = $p.eve.hash_route.execute(hprm),
			mgr;

		if((res !== false) && (!$p.iface.before_route || $p.iface.before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					// если задана ссылка, открываем форму объекта
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"]($p.iface.docs, hprm.ref)

				}else if(hprm.view && $p.iface.swith_view){
					// если задано имя представления, переключаем главную форму
					$p.iface.swith_view(hprm.view);

				}

			}
		}

		if(event)
			return $p.cancel_bubble(event);
	};


	/**
	 * Возникает после готовности DOM. Должен быть обработан конструктором основной формы приложения
	 * @event oninit
	 */
	this.oninit = null;

	/**
	 * Обновляет формы интерфейса пользователя раз в полторы минуты
	 * @event ontimer
	 */
	this.ontimer = null;
	setTimeout(function () {
		if($p.iface.ontimer && typeof $p.iface.ontimer === "function"){
			setInterval($p.iface.ontimer, 90000);
		}
	}, 20000);

}

/**
 * Объекты интерфейса пользователя
 * @property iface
 * @for MetaEngine
 * @type InterfaceObjs
 * @static
 */
$p.iface = new InterfaceObjs();

/**
 * ### Модификатор отложенного запуска
 * Служебный объект, реализующий отложенную загрузку модулей,<br />
 * в которых доопределяется (переопределяется) поведение объектов и менеджеров конкретных типов<br />
 *
 * @class Modifiers
 * @constructor
 */
function Modifiers(){

	var methods = [];

	/**
	 * Добавляет метод в коллекцию методов для отложенного вызова.<br />
	 * См. так же, {{#crossLink "AppEvents/onload:property"}}{{/crossLink}} и {{#crossLink "MetaEngine/modifiers:property"}}{{/crossLink}}
	 * @method push
	 * @param method {Function} - функция, которая будет вызвана после инициализации менеджеров объектов данных
	 */
	this.push = function (method) {
		methods.push(method);
	};

	/**
	 * Отменяет подписку на событие
	 * @param method {Function}
	 */
	this.detache = function (method) {
		var index = methods.indexOf(method);
		if(index != -1)
			methods.splice(index, 1);
	};

	/**
	 * Загружает и выполняет методы модификаторов
	 * @method execute
	 */
	this.execute = function (data) {
		var res, tres;
		methods.forEach(function (method) {
			if(typeof method === "function")
				tres = method(data);
			else
				tres = $p.injected_data[method](data);
			if(res !== false)
				res = tres;
		});
		return tres;
	};
};
$p.Modifiers = Modifiers;

/**
 * ### Генераторы и обработчики событий
 * - при запуске программы
 * - при авторизации и начальной синхронизации с сервером
 * - при периодических обменах изменениями с сервером
 * - См. так же модуль {{#crossLinkModule "events"}}{{/crossLinkModule}}
 * @class AppEvents
 * @static
 */
function AppEvents(){

	this.toString = function(){return "События при начале работы программы"};

	/**
	 * ### Обработчики при начале работы программы
	 * Клиентские модули при загрузке могут добавлять в этот массив свои функции,<br />
	 * которые будут выполнены после готовности документа. См. так же, {{#crossLink "Modifiers/push:method"}}{{/crossLink}}
	 * @property onload
	 * @type Modifiers
	 * @static
	 */
	this.__define("onload", {
		value: new Modifiers(),
		enumerable: false,
		configurable: false
	});

	this.__define("hash_route", {
		value: new Modifiers(),
		enumerable: false,
		configurable: false
	});
}

/**
 * Обработчики событий приложения
 * Подробнее см. класс {{#crossLink "AppEvents"}}{{/crossLink}} и модуль {{#crossLinkModule "events"}}{{/crossLinkModule}}
 * @property eve
 * @for MetaEngine
 * @type AppEvents
 * @static
 */
$p.eve = new AppEvents();

/**
 * ### Модификаторы менеджеров объектов метаданных
 * Т.к. экземпляры менеджеров и конструкторы объектов доступны в системе только после загрузки метаданных,
 * а метаданные загружаются после авторизации на сервере, методы модификаторов нельзя выполнить при старте приложения
 * @property modifiers
 * @for MetaEngine
 * @type Modifiers
 * @static
 */
$p.__define("modifiers", {
	value: new Modifiers(),
	enumerable: false,
	configurable: false
});

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 * @class JobPrm
 * @static
 */
function JobPrm(){

	/**
	 * Осуществляет синтаксический разбор параметров url
	 * @method parse_url
	 * @return {Object}
	 */
	this.parse_url = function (){

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
	};

	/**
	 * Указывает, проверять ли совместимость браузера при запуске программы
	 * @property check_browser_compatibility
	 * @type {Boolean}
	 * @static
	 */
	this.check_browser_compatibility = true;

	this.check_dhtmlx = true;
	this.use_builder = false;
	this.offline = false;
	this.local_storage_prefix = "";

	if(typeof window != "undefined"){

		/**
		 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
		 * @property url_prm
		 * @type {Object}
		 * @static
		 */
		this.url_prm = this.parse_url();

	}else
		this.url_prm = {};

	// подмешиваем параметры, заданные в файле настроек сборки
	if(typeof $p.settings === "function")
		$p.settings(this, $p.modifiers);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

	/**
	 * Устаревший метод. умрёт после перевода методов _заказа дилера_ в irest
	 * TODO: удалить этот метод
	 * @method hs_url
	 * @deprecated
	 * @return {string}
	 */
	this.hs_url = function () {
		var url = this.hs_path || "/a/zd/%1/hs/upzp",
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	function base_url(){
		return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	/**
	 * Адрес стандартного интерфейса 1С OData
	 * @method rest_url
	 * @return {string}
	 */
	this.rest_url = function () {
		var url = base_url(),
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	/**
	 * Адрес http интерфейса библиотеки интеграции
	 * @method irest_url
	 * @return {string}
	 */
	this.irest_url = function () {
		var url = base_url(),
			zone = $p.wsql.get_user_param("zone", "number");
		url = url.replace("odata/standard.odata", "hs/rest");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

}
$p.JobPrm = JobPrm;


/**
 * Интерфейс локальной базы данных
 * @class WSQL
 * @static
 */
function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	if(typeof localStorage === "undefined"){

		// локальное хранилище внутри node.js
		if(typeof WorkerGlobalScope === "undefined"){
			if(typeof localStorage === "undefined")
				ls = new require('node-localstorage').LocalStorage('./localstorage');
		}

	} else
		ls = localStorage;

	function fetch_type(prm, type){
		if(type == "object"){
			try{
				prm = JSON.parse(prm);
			}catch(e){
				prm = {};
			}
			return prm;
		}else if(type == "number")
			return $p.fix_number(prm, true);
		else if(type == "date")
			return $p.fix_date(prm, true);
		else if(type == "boolean")
			return $p.fix_boolean(prm);
		else
			return prm;
	}

	//TODO реализовать поддержку postgres в Node

	/**
	 * Выполняет sql запрос к локальной базе данных, возвращает Promise
	 * @param sql
	 * @param params
	 * @return {Promise}
	 * @async
	 */
	wsql.promise = function(sql, params) {
		return new Promise(function(resolve, reject){
			wsql.alasql(sql, params || [], function(data, err) {
				if(err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};

	/**
	 * Устанавливает параметр в user_params и базе данных
	 * @method set_user_param
	 * @param prm_name {string} - имя параметра
	 * @param prm_value {string|number|object|boolean} - значение
	 * @return {Promise}
	 * @async
	 */
	wsql.set_user_param = function(prm_name, prm_value){

		return new Promise(function(resolve, reject){

			var str_prm = prm_value;
			if(typeof prm_value == "object")
				str_prm = JSON.stringify(prm_value);

			else if(prm_value === false)
				str_prm = "";

			// localStorage в этом месте можно заменить на другое хранилище
			if(ls)
				ls.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
			user_params[prm_name] = prm_value;

			resolve();

		});
	};

	/**
	 * Возвращает значение сохраненного параметра
	 * @method get_user_param
	 * @param prm_name {String} - имя параметра
	 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
	 * @return {*} - значение параметра
	 */
	wsql.get_user_param = function(prm_name, type){

		if(!user_params.hasOwnProperty(prm_name) && ls)
			user_params[prm_name] = fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);

		return user_params[prm_name];
	};

	/**
	 * Сохраняет настройки формы или иные параметры объекта _options_
	 * @method save_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - сохраняемые параметры
	 * @return {Promise}
	 * @async
	 */
	wsql.save_options = function(prefix, options){
		return wsql.set_user_param(prefix + "_" + options.name, options);
	};

	/**
	 * Восстанавливает сохраненные параметры в объект _options_
	 * @method restore_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - объект, в который будут записаны параметры
	 */
	wsql.restore_options = function(prefix, options){
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
	};

	/**
	 * ### Создаёт и заполняет умолчаниями таблицу параметров
	 * Внутри Node, в функцию следует передать ссылку на alasql
	 * @method init_params
	 * @return {Promise}
	 * @async
	 */
	wsql.init_params = function(ialasql, create_tables_sql){

		wsql.alasql = ialasql || alasql;
		wsql.aladb = new wsql.alasql.Database('md');

		var nesessery_params = [
			{p: "user_name",		v: "", t:"string"},
			{p: "user_pwd",			v: "", t:"string"},
			{p: "browser_uid",		v: $p.generate_guid(), t:"string"},
			{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t:"number"},
			{p: "enable_save_pwd",	v: "",	t:"boolean"},
			{p: "reset_local_data",	v: "",	t:"boolean"},
			{p: "autologin",		v: "",	t:"boolean"},
			{p: "cache_cat_date",	v: 0,	t:"number"},
			{p: "margin",			v: 60,	t:"number"},
			{p: "discount",			v: 15,	t:"number"},
			{p: "offline",			v: $p.job_prm.offline || "", t:"boolean"},
			{p: "skin",		        v: "dhx_web", t:"string"},
			{p: "rest_path",		v: "", t:"string"}
		], zone;



		// подмешиваем к базовым параметрам настройки приложения
		if($p.job_prm.additional_params)
			nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

		// если зона не указана, устанавливаем "1"
		if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
			zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
		// если зона указана в url, используем её
		if($p.job_prm.url_prm.hasOwnProperty("zone"))
			zone = $p.fix_number($p.job_prm.url_prm.zone, true);
		if(zone !== undefined)
			wsql.set_user_param("zone", zone);

		// дополняем хранилище недостающими параметрами
		nesessery_params.forEach(function(o){
			if(wsql.get_user_param(o.p, o.t) == undefined ||
				(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
					wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
		});

		// сбрасываем даты, т.к. база в озу
		wsql.set_user_param("cache_cat_date", 0);
		wsql.set_user_param("reset_local_data", "");

		return new Promise(function(resolve, reject){

			if(create_tables_sql)
				wsql.alasql(create_tables_sql, [], resolve);

			else if($p.job_prm.create_tables){
				if($p.job_prm.create_tables_sql)
					wsql.alasql($p.job_prm.create_tables_sql, [], function(){
						delete $p.job_prm.create_tables_sql;
						resolve();
					});
				else
					$p.ajax.get($p.job_prm.create_tables)
						.then(function (req) {
							wsql.alasql(req.response, [], resolve);
						});
			}else
				resolve();

		});

	};

	/**
	 * Удаляет таблицы WSQL. Например, для последующего пересоздания при изменении структуры данных
	 * @method drop_tables
	 * @param callback {Function}
	 * @async
	 */
	wsql.drop_tables = function(callback){
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
	};

	/**
	 * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
	 * @method backup_database
	 * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
	 * @async
	 */
	wsql.backup_database = function(do_zip){

		// получаем строку create_tables

		// получаем строки для каждой таблицы

		// складываем все части в файл
	};

	/**
	 * Восстанавливает базу из архивной копии
	 * @method restore_database
	 * @async
	 */
	wsql.restore_database = function(){

	};

	/**
	 * Подключается к indexedDB
	 * @method idx_connect
	 * @param db_name {String} - имя базы
	 * @param store_name {String} - имя хранилища в базе
	 * @return {Promise.<IDBDatabase>}
	 * @async
	 */
	wsql.idx_connect = function (db_name, store_name) {
		return new Promise(function(resolve, reject){
			var request = indexedDB.open(db_name, 1);
			request.onerror = function(err){
				reject(err);
			};
			request.onsuccess = function(){
				// При успешном открытии вызвали коллбэк передав ему объект БД
				resolve(request.result);
			};
			request.onupgradeneeded = function(e){
				// Если БД еще не существует, то создаем хранилище объектов.
				e.currentTarget.result.createObjectStore(store_name, { keyPath: "ref" });
				return wsql.idx_connect(db_name, store_name);
			}
		});
	};

	/**
	 * Сохраняет объект в indexedDB
	 * @method idx_save
	 * @param obj {DataObj|Object}
	 * @param [db] {IDBDatabase}
	 * @param [store_name] {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_save = function (obj, db, store_name) {

		return new Promise(function(resolve, reject){

			function _save(db){
				var request = db.transaction([store_name], "readwrite")
					.objectStore(store_name)
					.put(obj instanceof DataObj ? obj._obj : obj);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(!store_name && obj._manager)
				store_name = obj._manager.table_name;

			if(db)
				_save(db);
			else
				wsql.idx_connect(wsql.idx_name || $p.job_prm.local_storage_prefix || 'md', store_name)
					.then(_save);

		});
	};

	/**
	 * Получает объект из indexedDB по ключу
	 * @method idx_get
	 * @param ref {String} - ключ
	 * @param [db] {IDBDatabase}
	 * @param store_name {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_get = function (ref, db, store_name) {

		return new Promise(function(resolve, reject){

			function _get(db){
				var request = db.transaction([store_name], "readonly")
					.objectStore(store_name)
					.get(ref);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(db)
				_get(db);
			else
				wsql.idx_connect(wsql.idx_name || $p.job_prm.local_storage_prefix || 'md', store_name)
					.then(_get);

		});
	};

	/**
	 * Сохраняет объект в indexedDB
	 * @method idx_delete
	 * @param obj {DataObj|Object|String} - объект или идентификатор
	 * @param [db] {IDBDatabase}
	 * @param [store_name] {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_delete = function (obj, db, store_name) {

		return new Promise(function(resolve, reject){

			function _delete(db){
				var request = db.transaction([store_name], "readwrite")
					.objectStore(store_name)
					.delete(obj instanceof DataObj ? obj.ref : obj);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(!store_name && obj._manager)
				store_name = obj._manager.table_name;

			if(db)
				_delete(db);
			else
				wsql.idx_connect(wsql.idx_name || $p.job_prm.local_storage_prefix || 'md', store_name)
					.then(_delete);

		});
	};

};

/**
 * Экземпляр интерфейса локальной базы данных
 * @property wsql
 * @for MetaEngine
 * @type WSQL
 * @static
 */
$p.wsql = new WSQL();

/**
 * Строковые константы интернационализации
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module common
 * @submodule i18n
 */

var msg = $p.msg;

/**
 * русификация dateFormat
 */
$p.dateFormat.i18n = {
	dayNames: [
		"Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
		"Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
	],
	monthNames: [
		"Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек",
		"Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"
	]
};

if(typeof window !== "undefined" && "dhx4" in window){
	dhx4.dateFormat.ru = "%d.%m.%Y";
	dhx4.dateLang = "ru";
	dhx4.dateStrings = {
		ru: {
			monthFullName:	["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август","Сентябрь","Oктябрь","Ноябрь","Декабрь"],
			monthShortName:	["Янв","Фев","Maр","Aпр","Maй","Июн","Июл","Aвг","Сен","Окт","Ноя","Дек"],
			dayFullName:	["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
			dayShortName:	["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
		}
	};
}

/**
 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
 * @method russian_names
 * @for Messages
 */
$p.msg.russian_names = function(){
	if($p.job_prm.russian_names){

		// глобальный контекст
		window.__define({
			"Метаданные": {
				get: function(){return _md},
				enumerable: false
			},
			"Справочники": {
				get: function(){return _cat},
				enumerable: false
			},
			"Документы": {
				get: function(){return _doc},
				enumerable: false
			},
			"РегистрыСведений": {
				get: function(){return _ireg},
				enumerable: false
			},
			"РегистрыНакопления": {
				get: function(){return _areg},
				enumerable: false
			},
			"РегистрыБухгалтерии": {
				get: function(){return _aссreg},
				enumerable: false
			},
			"Обработки": {
				get: function(){return _dp},
				enumerable: false
			},
			"Отчеты": {
				get: function(){return _rep},
				enumerable: false
			},
			"ОбластьКонтента": {
				get: function(){return $p.iface.docs},
				enumerable: false
			},
			"Сообщить": {
				get: function(){return $p.msg.show_msg},
				enumerable: false
			},
			"Истина": {
				value: true,
				enumerable: false
			},
			"Ложь": {
				value: false,
				enumerable: false
			}

		});

		// свойства и методы менеджеров
		DataManager.prototype.__define({
				"ФормаВыбора": {
					get: function(){return this.form_selection},
					enumerable: false
				},
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				},
				"Найти": {
					get: function(){return this.find},
					enumerable: false
				},
				"НайтиСтроки": {
					get: function(){return this.find_rows},
					enumerable: false
				},
				"НайтиПоНаименованию": {
					get: function(){return this.by_name},
					enumerable: false
				}
			}
		);

		// свойства и методы объектов данных
		DataObj.prototype.__define({
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				}
			}
		);

	}
};

/**
 *  строки ФИАС адресного классификатора
 */
$p.fias = function FIAS(){};
(function (fias){

	fias.toString = function(){return "Коды адресного классификатора"};

	fias.types = ["владение", "здание", "помещение"];

	// Код, Наименование, Тип, Порядок, КодФИАС
	fias["1010"] = {name: "дом",			type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"]};
	fias["1020"] = {name: "владение",		type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"]};
	fias["1030"] = {name: "домовладение",	type: 1, order: 3, fid: 3};

	fias["1050"] = {name: "корпус",		type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"]};
	fias["1060"] = {name: "строение",	type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"]};
	fias["1080"] = {name: "литера",		type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"]};
	fias["1070"] = {name: "сооружение",	type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"]};
	fias["1040"] = {name: "участок",	type: 2, order: 5, syn: [" уч.", " уч ", "участок"]};

	fias["2010"] = {name: "квартира",	type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"]};
	fias["2030"] = {name: "офис",		type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"]};
	fias["2040"] = {name: "бокс",		type: 3, order: 3};
	fias["2020"] = {name: "помещение",	type: 3, order: 4};
	fias["2050"] = {name: "комната",	type: 3, order: 5, syn: ["комн.", "комн ", "комната"]};

	//	//  сокращения 1C для поддержки обратной совместимости при парсинге
	//	fias["2010"] = {name: "кв.",	type: 3, order: 6};
	//	fias["2030"] = {name: "оф.",	type: 3, order: 7};

	// Уточняющие объекты
	fias["10100000"] = {name: "Почтовый индекс"};
	fias["10200000"] = {name: "Адресная точка"};
	fias["10300000"] = {name: "Садовое товарищество"};
	fias["10400000"] = {name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента"};
	fias["10500000"] = {name: "Промышленная зона"};
	fias["10600000"] = {name: "Гаражно-строительный кооператив"};
	fias["10700000"] = {name: "Территория"};

})($p.fias);


// публичные методы, экспортируемые, как свойства $p.msg
msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

msg.align_node_right = "Уравнять вертикально вправо";
msg.align_node_bottom = "Уравнять горизонтально вниз";
msg.align_node_top = "Уравнять горизонтально вверх";
msg.align_node_left = "Уравнять вертикально влево";
msg.align_set_right = "Установить размер сдвигом вправо";
msg.align_set_bottom = "Установить размер сдвигом вниз";
msg.align_set_top = "Установить размер сдвигом вверх";
msg.align_set_left = "Установить размер сдвигом влево";
msg.align_invalid_direction = "Неприменимо для элемента с данной ориентацией";
msg.argument_is_not_ref = "Аргумент не является ссылкой";
msg.addr_title = "Ввод адреса";

msg.cache_update_title = "Обновление кеша браузера";
msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";

msg.delivery_area_empty = "Укажите район доставки";

msg.empty_login_password = "Не указаны имя пользователя или пароль";
msg.empty_response = "Пустой ответ сервера";
msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";

msg.error_auth = "Авторизация пользователя не выполнена";
msg.error_critical = "Критическая ошибка";
msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
msg.error_network = "Ошибка сети или сервера - запрос отклонен";
msg.error_rights = "Ограничение доступа";

msg.file_size = "Запрещена загрузка файлов<br/>размером более ";
msg.file_confirm_delete = "Подтвердите удаление файла ";
msg.file_new_date = "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления";
msg.file_new_date_title = "Версия файлов";

msg.init_catalogues = "Загрузка справочников с сервера";
msg.init_catalogues_meta = ": Метаданные объектов";
msg.init_catalogues_tables = ": Реструктуризация таблиц";
msg.init_catalogues_nom = ": Базовые типы + номенклатура";
msg.init_catalogues_sys = ": Технологические справочники";
msg.init_login = "Укажите имя пользователя и пароль";

msg.requery = "Повторите попытку через 1-2 минуты";

msg.limit_query = "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + msg.requery;
msg.long_operation = "Длительная операция";

msg.main_title = "Окнософт: заказ дилера ";
msg.meta_cat = "Справочники";
msg.meta_doc = "Документы";
msg.meta_cch = "Планы видов характеристик";
msg.meta_cacc = "Планы счетов";
msg.meta_ireg = "Регистры сведений";
msg.meta_areg = "Регистры накопления";
msg.meta_mgr = "Менеджер";
msg.meta_cat_mgr = "Менеджер справочников";
msg.meta_doc_mgr = "Менеджер документов";
msg.meta_enn_mgr = "Менеджер перечислений";
msg.meta_ireg_mgr = "Менеджер регистров сведений";
msg.meta_areg_mgr = "Менеджер регистров накопления";
msg.meta_accreg_mgr = "Менеджер регистров бухгалтерии";
msg.meta_dp_mgr = "Менеджер обработок";
msg.meta_reports_mgr = "Менеджер отчетов";
msg.meta_charts_of_accounts_mgr = "Менеджер планов счетов";
msg.meta_charts_of_characteristic_mgr = "Менеджер планов видов характеристик";
msg.meta_extender = "Модификаторы объектов и менеджеров";

msg.no_metadata = "Не найдены метаданные объекта '%1'";
msg.no_selected_row = "Не выбрана строка табличной части '%1'";
msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
msg.not_implemented = "Не реализовано в текущей версии";

msg.offline_request = "Запрос к серверу в автономном режиме";
msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
msg.order_sent_title = "Подтвердите отправку заказа";
msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

msg.request_title = "Окнософт: Запрос регистрации";
msg.request_message = "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо";

msg.select_from_list = "Выбор из списка";
msg.select_grp = "Укажите группу, а не элемент";
msg.select_elm = "Укажите элемент, а не группу";
msg.select_file_import = "Укажите файл для импорта";
msg.srv_overload = "Сервер перегружен";
msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
msg.sync_script = "Обновление скриптов приложения:";
msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
msg.sync_break = "Прервать синхронизацию";
msg.sync_no_data = "Файл не содержит подходящих элементов для загрузки";

msg.unsupported_browser_title = "Браузер не поддерживается";
msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
msg.unsupported_mode_title = "Режим не поддерживается";
msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
msg.unknown_error = "Неизвестная ошибка в функции '%1'";

msg.value = "Значение";

msg.bld_constructor = "Конструктор объектов графического построителя";
msg.bld_title = "Графический построитель";
msg.bld_empty_param = "Не заполнен обязательный параметр <br />";
msg.bld_not_product = "В текущей строке нет изделия построителя";
msg.bld_not_draw = "Отсутствует эскиз или не указана система профилей";
msg.bld_wnd_title = "Построитель изделия № ";
msg.bld_from_blocks_title = "Выбор типового блока";
msg.bld_from_blocks = "Текущее изделие будет заменено конфигурацией типового блока. Продолжить?";
msg.bld_split_imp = "В параметрах продукции<br />'%1'<br />запрещены незамкнутые контуры<br />" +
	"Для включения деления импостом,<br />установите это свойство в 'Истина'";

/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_meta
 * @requires common
 */

/**
 * Проверяет, является ли значенние Data-объектным типом
 * @method is_data_obj
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если значение является ссылкой
 */
$p.is_data_obj = function(v){
	return v && v instanceof DataObj};

/**
 * приводит тип значения v к типу метаданных
 * @method fetch_type
 * @for MetaEngine
 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
 * @param mtype {Object} - поле type объекта метаданных (field.type)
 * @return {*}
 */
$p.fetch_type = function(str, mtype){
	var v = str;
	if(mtype.is_ref)
		v = $p.fix_guid(str);
	else if(mtype.date_part)
		v = $p.fix_date(str, true);
	else if(mtype["digits"])
		v = $p.fix_number(str, true);
	else if(mtype.types[0]=="boolean")
		v = $p.fix_boolean(str);
	return v;
};


/**
 * Сравнивает на равенство ссылочные типы и примитивные значения
 * @method is_equal
 * @for MetaEngine
 * @param v1 {DataObj|String}
 * @param v2 {DataObj|String}
 * @return {boolean} - true, если значенния эквивалентны
 */
$p.is_equal = function(v1, v2){

	if(v1 == v2)
		return true;
	else if(typeof v1 === typeof v2)
		return false;

	return ($p.fix_guid(v1, false) == $p.fix_guid(v2, false));
};

/**
 * Абстрактный поиск значения в коллекции
 * @method _find
 * @for MetaEngine
 * @param a {Array}
 * @param val {DataObj|String}
 * @return {*}
 * @private
 */
$p._find = function(a, val){
	//TODO переписать с учетом html5 свойств массивов
	var o, i, finded;
	if(typeof val != "object"){
		for(i in a){ // ищем по всем полям объекта
			o = a[i];
			for(var j in o){
				if(typeof o[j] !== "function" && $p.is_equal(o[j], val))
					return o;
			}
		}
	}else{
		for(i in a){ // ищем по ключам из val
			o = a[i];
			finded = true;
			for(var j in val){
				if(typeof o[j] !== "function" && !$p.is_equal(o[j], val[j])){
					finded = false;
					break;
				}
			}
			if(finded)
				return o;
		}
	}
};

/**
 * ### Поиск массива значений в коллекции
 * Кроме стандартного поиска по равенству значений,
 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
 * @method _find_rows
 * @for MetaEngine
 * @param arr {Array}
 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @param callback {Function}
 * @return {Array}
 * @private
 */
$p._find_rows = function(arr, selection, callback){
	var ok, o, i, j, res = [], top, count = 0;

	if(selection){
		if(selection._top){
			top = selection._top;
			delete selection._top;
		}else
			top = 300;
	}

	for(i in arr){
		o = arr[i];
		ok = true;
		if(selection){
			if(typeof selection == "function")
				ok = selection(o);
			else
				for(j in selection){
					if(j.substr(0, 1) == "_")
						continue;

					else if(typeof selection[j] == "function"){
						ok = selection[j](o, j);
						if(!ok)
							break;

					}else if(j == "or" && Array.isArray(selection[j])){
						ok = selection[j].some(function (element) {
							var key = Object.keys(element)[0];
							if(element[key].hasOwnProperty("like"))
								return o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
							else
								return $p.is_equal(o[key], element[key]);
						});
						if(!ok)
							break;

					}else if(selection[j].hasOwnProperty("like")){
						if(o[j].toLowerCase().indexOf(selection[j].like.toLowerCase())==-1){
							ok = false;
							break;
						}
					}else if(selection[j].hasOwnProperty("not")){
						if($p.is_equal(o[j], selection[j].not)){
							ok = false;
							break;
						}

					}else if(selection[j].hasOwnProperty("in")){
						ok = selection[j].in.some(function(element) {
							return $p.is_equal(element, o[j]);
						});
						if(!ok)
							break;

					}else if(!$p.is_equal(o[j], selection[j])){
						ok = false;
						break;
					}
				}
		}

		// выполняем колбэк с элементом и пополняем итоговый массив
		if(ok){
			if(callback){
				if(callback.call(this, o) === false)
					break;
			}else
				res.push(o);

			// ограничиваем кол-во возвращаемых элементов
			if(top) {
				count++;
				if (count >= top)
					break;
			}
		}

	}
	return res;
};

/**
 * Абстрактный запрос к soap или базе WSQL
 * @param method
 * @param attr
 * @param async
 * @param callback
 * @private
 */
function _load(attr){

	var mgr = _md.mgr_by_class_name(attr.class_name), res_local;

	function get_tree(){

		if(mgr.cachable){
			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then($p.iface.data_to_tree);
		}
	}

	function get_orders(){

	}

	function get_selection(){

		if(mgr.cachable){

			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then(function(data){
					return $p.iface.data_to_grid.call(mgr, data, attr);
				});
		}
	}


	if(attr.action == "get_tree" && (res_local = get_tree()))
		return res_local;
	else if(attr.action == "get_orders" && (res_local = get_orders()))
		return res_local;
	else if(attr.action == "get_selection" && (res_local = get_selection()))
		return res_local;
	else if($p.job_prm.offline)
		return Promise.reject(Error($p.msg.offline_request));

	attr.browser_uid = $p.wsql.get_user_param("browser_uid");

	return $p.ajax.post_ex($p.job_prm.hs_url(), JSON.stringify(attr), true)
		.then(function (req) {
			return req.response;
		});
}


/**
 * Коллекция менеджеров справочников
 * @property cat
 * @type Catalogs
 * @for MetaEngine
 * @static
 */
var _cat = $p.cat = new (
		/**
		 * ### Коллекция менеджеров справочников
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
		 *
		 * @class Catalogs
		 * @static
		 */
		function Catalogs(){
			this.toString = function(){return $p.msg.meta_cat_mgr};
		}
	),

	/**
	 * Коллекция менеджеров перечислений
	 * @property enm
	 * @type Enumerations
	 * @for MetaEngine
	 * @static
	 */
	_enm = $p.enm = new (
		/**
		 * ### Коллекция менеджеров перечислений
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
		 *
		 * @class Enumerations
		 * @static
		 */
		function Enumerations(){
			this.toString = function(){return $p.msg.meta_enn_mgr};
	}),

	/**
	 * Коллекция менеджеров документов
	 * @property doc
	 * @type Documents
	 * @for MetaEngine
	 * @static
	 */
	_doc = $p.doc = new (
		/**
		 * ### Коллекция менеджеров документов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
		 *
		 * @class Documents
		 * @static
		 */
		function Documents(){
			this.toString = function(){return $p.msg.meta_doc_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров сведений
	 * @property ireg
	 * @type InfoRegs
	 * @for MetaEngine
	 * @static
	 */
	_ireg = $p.ireg = new (
		/**
		 * ### Коллекция менеджеров регистров сведений
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
		 *
		 * @class InfoRegs
		 * @static
		 */
		function InfoRegs(){
			this.toString = function(){return $p.msg.meta_ireg_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров накопления
	 * @property areg
	 * @type AccumRegs
	 * @for MetaEngine
	 * @static
	 */
	_areg = $p.areg = new (
		/**
		 * ### Коллекция менеджеров регистров накопления
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
		 *
		 * @class AccumRegs
		 * @static
		 */
		function AccumRegs(){
			this.toString = function(){return $p.msg.meta_areg_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров бухгалтерии
	 * @property aссreg
	 * @type AccountsRegs
	 * @for MetaEngine
	 * @static
	 */
	_aссreg = $p.aссreg = new (
		/**
		 * ### Коллекция менеджеров регистров бухгалтерии
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
		 *
		 * @class AccountsRegs
		 * @static
		 */
			function AccountsRegs(){
			this.toString = function(){return $p.msg.meta_accreg_mgr};
		}),

	/**
	 * Коллекция менеджеров обработок
	 * @property dp
	 * @type DataProcessors
	 * @for MetaEngine
	 * @static
	 */
	_dp	= $p.dp = new (
		/**
		 * ### Коллекция менеджеров обработок
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
		 *
		 * @class DataProcessors
		 * @static
		 */
		function DataProcessors(){
			this.toString = function(){return $p.msg.meta_dp_mgr};
	}),

	/**
	 * Коллекция менеджеров отчетов
	 * @property rep
	 * @type Reports
	 * @for MetaEngine
	 * @static
	 */
	_rep = $p.rep = new (
		/**
		 * ### Коллекция менеджеров отчетов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
		 *
		 * @class Reports
		 * @static
		 */
		function Reports(){
			this.toString = function(){return $p.msg.meta_reports_mgr};
	}),

	/**
	 * Коллекция менеджеров планов счетов
	 * @property cacc
	 * @type ChartsOfAccounts
	 * @for MetaEngine
	 * @static
	 */
	_cacc = $p.cacc = new (

		/**
		 * ### Коллекция менеджеров планов счетов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
		 *
		 * @class ChartsOfAccounts
		 * @static
		 */
			function ChartsOfAccounts(){
			this.toString = function(){return $p.msg.meta_charts_of_accounts_mgr};
		}),

	/**
	 * Коллекция менеджеров планов видов характеристик
	 * @property cch
	 * @type ChartsOfCharacteristic
	 * @for MetaEngine
	 * @static
	 */
	_cch = $p.cch = new (

		/**
		 * ### Коллекция менеджеров планов видов характеристик
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
		 *
		 * @class ChartsOfCharacteristics
		 * @static
		 */
			function ChartsOfCharacteristics(){
			this.toString = function(){return $p.msg.meta_charts_of_characteristic_mgr};
		}),

	/**
	 * Mетаданные конфигурации
	 */
	_md;


// КОНСТРУКТОРЫ - полная абстракция

/**
 * ### Хранилище метаданных конфигурации
 * Загружает описание из файлов на сервере, объекта или json-строки. В оффлайне используется локальный кеш
 *
 * @class Meta
 * @constructor
 * @param req {XMLHttpRequest|Object|String} - с основными метаданными
 * @param patch {XMLHttpRequest} - с дополнительными метаданными
 *
 * @example
 *    new $p.Meta('meta');
 */
function Meta(req, patch) {

	var m = (req && req.response) ? JSON.parse(req.response) : req,
		class_name;

	// Экспортируем ссылку на себя
	_md = $p.md = this;

	if(patch)
		Meta._patch(m, patch.response ? JSON.parse(patch.response) : patch);

	req = null;
	if(typeof window != "undefined"){
		patch = $p.injected_data['log.json'];
		if(typeof patch == "string")
			patch = JSON.parse(patch);
		Meta._patch(m, patch);
		patch = null;
	}

	/**
	 * Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){
		var np = class_name.split("."),
			res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}};
		if(!field_name)
			return m[np[0]][np[1]];
		if(np[0]=="doc" && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;
		}else if(np[0]=="doc" && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";
		}else if(np[0]=="doc" && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";
		}else if(np[0]=="cat" && field_name=="id"){
			res.synonym = "Код";
		}else if(np[0]=="cat" && field_name=="name"){
			res.synonym = "Наименование";
		}else if(field_name=="deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";
		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";
		}else if(field_name=="lc_changed"){
			res.synonym = "Изменено в 1С";
			res.tooltip = "Время записи в 1С";
			res.type.types[0] = "number";
			res.type.digits = 15;
			res.type.fraction_figits = 0;
		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;
		}else if(field_name)
			res = m[np[0]][np[1]].fields[field_name];
		else
			res = m[np[0]][np[1]];
		return res;
	};

	/**
	 * Возвращает структуру метаданных конфигурации
	 * @method get_classes
	 */
	_md.get_classes = function () {
		var res = {};
		for(var i in m){
			res[i] = [];
			for(var j in m[i])
				res[i].push(j);
		}
		return res;
	};

	/**
	 * Создаёт таблицы WSQL для всех объектов метаданных
	 * @method create_tables
	 * @return {Promise.<T>}
	 * @async
	 */
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = "USE md;\nCREATE TABLE refs (ref CHAR);\n";

		function on_table_created(data){

			if(typeof data === "number"){
				cstep--;
				if(cstep==0){
					if(callback)
						setTimeout(function () {
							callback(create);
						}, 10);
					else
						alasql.utils.saveFile("create_tables.sql", create);
				} else
					iteration();
			}else if(data && data.hasOwnProperty("message")){
				if($p.iface && $p.iface.docs){
					$p.iface.docs.progressOff();
					$p.msg.show_msg({
						title: $p.msg.error_critical,
						type: "alert-error",
						text: data.message
					});
				}
			}
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер

		for(class_name in managers.cat)
			data_names.push({"class": _cat, "name": managers.cat[class_name]});
		cstep = data_names.length;

		for(class_name in managers.ireg){
			data_names.push({"class": _ireg, "name": managers.ireg[class_name]});
			cstep++;
		}

		for(class_name in managers.doc){
			data_names.push({"class": _doc, "name": managers.doc[class_name]});
			cstep++;
		}

		for(class_name in managers.enm){
			data_names.push({"class": _enm, "name": managers.enm[class_name]});
			cstep++;
		}

		for(class_name in managers.cch){
			data_names.push({"class": _cch, "name": managers.cch[class_name]});
			cstep++;
		}

		for(class_name in managers.cacc){
			data_names.push({"class": _cacc, "name": managers.cacc[class_name]});
			cstep++;
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + ";\n";
			on_table_created(1);
		}

		iteration();

	};

	/**
	 * Возвращает тип поля sql для типа данных
	 * @method sql_type
	 * @param mgr {DataManager}
	 * @param f {String}
	 * @param mf {Object} - описание метаданных поля
	 * @param pg {Boolean} - использовать синтаксис postgreSQL
	 * @return {*}
	 */
	_md.sql_type = function (mgr, f, mf, pg) {
		var sql;
		if((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if(mf.is_ref || mf.types.indexOf("guid") != -1){
			if(!pg)
				sql = " CHAR";

			else if(mf.types.every(function(v){return v.indexOf("enm.") == 0}))
				sql = " character varying(100)";

			else if (!mf.hasOwnProperty("str_len"))
				sql = " uuid";

			else
				sql = " character varying(" + Math.max(36, mf.str_len) + ")";

		}else if(mf.hasOwnProperty("str_len"))
			sql = pg ? (mf.str_len ? " character varying(" + mf.str_len + ")" : " text") : " CHAR";

		else if(mf.date_part)
			if(!pg || mf.date_part == "date")
				sql = " Date";

			else if(mf.date_part == "date_time")
				sql = " timestamp with time zone";

			else
				sql = " time without time zone";

		else if(mf.hasOwnProperty("digits")){
			if(mf.fraction_figits==0)
				sql = pg ? (mf.digits < 7 ? " integer" : " bigint") : " INT";
			else
				sql = pg ? (" numeric(" + mf.digits + "," + mf.fraction_figits + ")") : " FLOAT";

		}else if(mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else if(mf.types.indexOf("json") != -1)
			sql = " JSON";

		else
			sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	};

	/**
	 * Для полей составного типа, добавляет в sql поле описания типа
	 * @param mf
	 * @param f
	 * @param pg
	 * @return {string}
	 */
	_md.sql_composite = function (mf, f, f0, pg){
		var res = "";
		if(mf[f].type.types.length > 1 && f != "type"){
			if(!f0)
				f0 = f.substr(0, 29) + "_T";
			else{
				f0 = f0.substr(0, 29) + "_T";
			}

			if(pg)
				res = ", " + f0 + " character varying(255)";
			else
				res = _md.sql_mask(f0) + " CHAR";
		}
		return res;
	}

	/**
	 * Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 */
	_md.sql_mask = function(f, t){
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	/**
	 * Возвращает менеджер объекта по имени класса
	 * @method mgr_by_class_name
	 * @param class_name {String}
	 * @return {DataManager|undefined}
	 * @private
	 */
	_md.mgr_by_class_name = function(class_name){
		if(class_name){
			var np = class_name.split(".");
			if(np[1] && $p[np[0]])
				return $p[np[0]][np[1]];
		}
	};

	/**
	 * Возвращает менеджер значения по свойству строки
	 * @method value_mgr
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - метаданные поля
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	_md.value_mgr = function(row, f, mf, array_enabled, v){
		var property, oproperty, tnames, rt, mgr;
		if(mf._mgr)
			return mf._mgr;

		function mf_mgr(mgr){
			if(mgr && mf.types.length == 1)
				mf._mgr = mgr;
			return mgr;
		}

		if(mf.types.length == 1){
			tnames = mf.types[0].split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}else if(v && v.type){
			tnames = v.type.split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}

		property = row.property || row.param;
		if(f != "value" || !property){
			rt = [];
			mf.types.forEach(function(v){
				tnames = v.split(".");
				if(tnames.length > 1 && $p[tnames[0]][tnames[1]])
					rt.push($p[tnames[0]][tnames[1]]);
			});
			if(rt.length == 1)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.is_guid(property) && property != $p.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			// Получаем объект свойства
			oproperty = _cch.properties.get(property, false);
			if($p.is_data_obj(oproperty)){

				if(oproperty.is_new())
					return _cat.property_values;

				// и через его тип выходми на мнеджера значения
				for(rt in oproperty.type.types)
					if(oproperty.type.types[rt].indexOf(".") > -1){
						tnames = oproperty.type.types[rt].split(".");
						break;
					}
				if(tnames && tnames.length > 1 && $p[tnames[0]])
					return mf_mgr($p[tnames[0]][tnames[1]]);
				else
					return oproperty.type;
			}
		}
	};

	/**
	 * Возвращает имя типа элемента управления для типа поля
	 * @method control_by_type
	 * @param type
	 * @return {*}
	 */
	_md.control_by_type = function (type) {
		var ft;
		if(type.is_ref){
			if(type.types.join().indexOf("enm.")==-1)
				ft = "ocombo";//ft = "ref"; //
			else
				ft = "refc";
		} else if(type.date_part) {
			ft = "dhxCalendar";
		} else if(type["digits"]) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";
		} else if(type.types[0]=="boolean") {
			ft = "ch";
		} else if(type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
			ft = "txt";
		} else {
			ft = "ed";
		}
		return ft;
	};

	/**
	 * Возвращает структуру для инициализации таблицы на форме
	 * @method ts_captions
	 * @param class_name
	 * @param ts_name
	 * @param source
	 * @return {boolean}
	 */
	_md.ts_captions = function (class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = _md.get(class_name).tabular_sections[ts_name],
			mfrm = _md.get(class_name).form,
			fields = mts.fields, mf;

		// если имеются метаданные формы, используем их
		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			source._mixin(mfrm.obj.tabular_sections[ts_name]);

		}else{

			if(ts_name==="contact_information")
				fields = {type: "", kind: "", presentation: ""};

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for(var f in fields){
				mf = mts.fields[f];
				if(!mf.hide){
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + _md.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	};

	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: 'deleted',
			Description: 'name',
			DataVersion: 'data_version',
			IsFolder: 'is_folder',
			Number: 'number_doc',
			Date: 'date',
			Дата: 'date',
			Posted: 'posted',
			Code: 'id',
			Parent_Key: 'parent',
			Owner_Key: 'owner',
			Owner:     'owner',
			Ref_Key: 'ref',
			"Ссылка": 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return m.syns_js[m.syns_1с.indexOf(v)] || v;
	};

	_md.syns_1с = function (v) {
		var syn1c = {
			deleted: 'DeletionMark',
			name: 'Description',
			data_version: 'DataVersion',
			is_folder: 'IsFolder',
			number_doc: 'Number',
			date: 'Date',
			posted: 'Posted',
			id: 'Code',
			ref: 'Ref_Key',
			parent: 'Parent_Key',
			owner: 'Owner_Key',
			row: 'LineNumber'
		};
		if(syn1c[v])
			return syn1c[v];
		return m.syns_1с[m.syns_js.indexOf(v)] || v;
	};

	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				m.doc[i].printing_plates = pp.doc[i];

	};

	/**
	 * Возвращает имя класса по полному имени объекта метаданных 1С
	 * @method class_name_from_1c
	 * @param name
	 */
	_md.class_name_from_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "enm." + name;
		else if(pn[0] == "Перечисление")
			name = "enm.";
		else if(pn[0] == "Справочник")
			name = "cat.";
		else if(pn[0] == "Документ")
			name = "doc.";
		else if(pn[0] == "РегистрСведений")
			name = "ireg.";
		else if(pn[0] == "РегистрНакопления")
			name = "areg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";

		return name + pn[1];

	};

	// создаём объекты менеджеров

	for(class_name in m.enm)
		_enm[class_name] = new EnumManager(m.enm[class_name], "enm."+class_name);

	for(class_name in m.cat){
		_cat[class_name] = new CatManager("cat."+class_name);
	}

	for(class_name in m.doc){
		_doc[class_name] = new DocManager("doc."+class_name);
	}

	for(class_name in m.ireg){
		if(class_name == "$log")
			_ireg[class_name] = new LogManager("ireg."+class_name);
		else
			_ireg[class_name] = new InfoRegManager("ireg."+class_name);
	}

	for(class_name in m.dp)
		_dp[class_name] = new DataProcessorsManager("dp."+class_name);

	for(class_name in m.cch)
		_cch[class_name] = new ChartOfCharacteristicManager("cch."+class_name);

	for(class_name in m.cacc)
		_cacc[class_name] = new ChartOfAccountManager("cacc."+class_name);

	// загружаем модификаторы и прочие зависимости
	$p.modifiers.execute($p);

	return {
		md_date: m["md_date"],
		cat_date: m["cat_date"]
	};
}
$p.Meta = Meta;

Meta._patch = function(obj, patch){
	for(var area in patch){
		for(var c in patch[area]){
			if(!obj[area][c])
				obj[area][c] = {};
			for(var f in patch[area][c]){
				if(!obj[area][c][f])
					obj[area][c][f] = patch[area][c][f];
				else if(typeof obj[area][c][f] == "object")
					obj[area][c][f]._mixin(patch[area][c][f]);
			}
		}
	}
}

/**
 * Запись журнала регистрации
 * @param err
 */
$p.record_log = function (err) {
	if($p.ireg && $p.ireg.$log)
		$p.ireg.$log.record(err);
	else
		console.log(err);
};

/**
 * Загрузка данных в grid
 * @method load_soap_to_grid
 * @for Catalogs
 * @param attr {Object} - объект с параметрами запроса SOAP
 * @param grid {dhtmlxGrid}
 * @param callback {Function}
 */
_cat.load_soap_to_grid = function(attr, grid, callback){

	function cb_callBack(res){
		if(res.substr(0,1) == "{")
			res = JSON.parse(res);

		if(typeof res == "string")
		// загружаем строку в грид
			grid.parse(res, function(){
				if(callback)
					callback(res);
			}, "xml");

		else if(callback)
			callback(res);
	}

	grid.xmlFileUrl = "exec";


	var mgr = _md.mgr_by_class_name(attr.class_name);

	if(!mgr.cachable && ($p.job_prm.rest || $p.job_prm.irest_enabled || attr.rest))
		mgr.rest_selection(attr)
			.then(cb_callBack)
			.catch($p.record_log);
	else
		_load(attr)
			.then(cb_callBack)
			.catch($p.record_log);

};
/**
 * Конструкторы менеджеров данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_mngrs
 * @requires common
 */



/**
 * ### Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок
 *
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 */
function DataManager(class_name){

	var _metadata = _md.get(class_name),
		_cachable,
		_async_write = _metadata.async_write,
		_events = {
			after_create: [],
			after_load: [],
			before_save: [],
			after_save: [],
			value_change: []
		};

	// перечисления кешируются всегда
	if(class_name.indexOf("enm.") != -1)
		_cachable = true;

	// если offline, все объекты кешируем
	else if($p.job_prm.offline)
		_cachable = true;

	// документы, отчеты и обработки по умолчанию не кешируем
	else if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
		_cachable = false;

	// остальные классы по умолчанию кешируем
	else
		_cachable = true;

	// Если в метаданных явно указано правило кеширования, используем его
	if(!$p.job_prm.offline && _metadata.cachable != undefined)
		_cachable = _metadata.cachable != "НеКешировать";

	this.__define({

			/**
			 * Выполняет две функции:
			 * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
			 * - Указывает, нужно ли запоминать представления ссылок (инверсно).
			 * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
			 * @property cachable
			 * @for DataManager
			 * @type Boolean
			 */
			"cachable": {
				value: _cachable,
				writable: true,
				enumerable: false
			},

			/**
			 * Указывает на возможность асинхронной записи элементов данного объекта
			 * - Если online, сразу выполняем запрос к серверу
			 * - Если offline и асинхронная запись разрешена, записываем в кеш и отправляем на сервер при первой возможности
			 * - Если offline и асинхронная запись запрещена - генерируем ошибку
			 * @property async_write
			 * @for DataManager
			 * @type Boolean
			 */
			"async_write": {
				value: _async_write,
				writable: false,
				enumerable: false
			},

			/**
			 * Имя типа объектов этого менеджера
			 * @property class_name
			 * @for DataManager
			 * @type String
			 * @final
			 */
			"class_name": {
				value: class_name,
				writable: false,
				enumerable: false
			},

			/**
			 * Указатель на массив, сопоставленный с таблицей локальной базы данных
			 * Фактически - хранилище объектов данного класса
			 * @property alatable
			 * @for DataManager
			 * @type Array
			 * @final
			 */
			"alatable": {
				get : function () {
					return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
				},
				enumerable : false
			},

			/**
			 * Метаданные объекта (указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту)
			 * @method metadata
			 * @for DataManager
			 * @return {Object} - объект метаданных
			 */
			"metadata": {
				value: function(field){
					if(field)
						return _metadata.fields[field] || _metadata.tabular_sections[field];
					else
						return _metadata;
				},
				enumerable: false
			},

			/**
			 * Добавляет подписку на события объектов данного менеджера
			 * @method attache_event
			 * @for DataManager
			 * @param name {String} - имя события
			 * @param method {Function} - добавляемый метод
			 * @param [first] {Boolean} - добавлять метод в начало, а не в конец коллекции
			 */
			"attache_event": {
				value: function (name, method, first) {
					if(first)
						_events[name].push(method);
					else
						_events[name].push(method);
				},
				enumerable: false
			},

			/**
			 * Выполняет методы подписки на событие
			 * @method handle_event
			 * @for DataManager
			 * @param obj {DataObj} - объект, в котором произошло событие
			 * @param name {String} - имя события
			 * @param attr {Object} - дополнительные свойства, передаваемые в обработчик события
			 * @return {Boolesn}
			 */
			"handle_event": {
				value: function (obj, name, attr) {
					var res;
					_events[name].forEach(function (method) {
						if(res !== false)
							res = method.call(obj, attr);
					});
					return res;
				},
				enumerable: false
			}

		}
	);

	//	Создаём функции конструкторов экземпляров объектов и строк табличных частей
	var _obj_сonstructor = this._obj_сonstructor || DataObj;		// ссылка на конструктор элементов

	// Для всех типов, кроме перечислений, создаём через (new Function) конструктор объекта
	if(!(this instanceof EnumManager)){

		var obj_сonstructor_name = class_name.split(".")[1];
		this._obj_сonstructor = eval("(function " + obj_сonstructor_name.charAt(0).toUpperCase() + obj_сonstructor_name.substr(1) +
			"(attr, manager){manager._obj_сonstructor.superclass.constructor.call(this, attr, manager)})");
		this._obj_сonstructor._extend(_obj_сonstructor);

		if(this instanceof InfoRegManager){

			delete this._obj_сonstructor.prototype.deleted;
			delete this._obj_сonstructor.prototype.ref;
			delete this._obj_сonstructor.prototype.lc_changed;

			// реквизиты по метаданным
			for(var f in this.metadata().dimensions){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}
			for(var f in this.metadata().resources){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}

		}else{

			this._ts_сonstructors = {};             // ссылки на конструкторы строк табчастей

			// реквизиты по метаданным
			for(var f in this.metadata().fields){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}

			// табличные части по метаданным
			for(var f in this.metadata().tabular_sections){

				// создаём конструктор строки табчасти
				var row_сonstructor_name = obj_сonstructor_name.charAt(0).toUpperCase() + obj_сonstructor_name.substr(1) + f.charAt(0).toUpperCase() + f.substr(1) + "Row";

				this._ts_сonstructors[f] = eval("(function " + row_сonstructor_name + "(owner) \
			{owner._owner._manager._ts_сonstructors[owner._name].superclass.constructor.call(this, owner)})");
				this._ts_сonstructors[f]._extend(TabularSectionRow);

				// в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
				for(var rf in this.metadata().tabular_sections[f].fields){
					this._ts_сonstructors[f].prototype.__define(rf, {
						get : new Function("return this._getter('"+rf+"')"),
						set : new Function("v", "this._setter('"+rf+"',v)"),
						enumerable : true
					});
				}

				// устанавливаем геттер и сеттер для табличной части
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter_ts('"+f+"')"),
					set : new Function("v", "this._setter_ts('"+f+"',v)"),
					enumerable : true
				});
			}

		}
	}

	_obj_сonstructor = null;

}

/**
 * Возвращает имя семейства объектов данного менеджера<br />
 * Примеры: "справочников", "документов", "регистров сведений"
 * @property family_name
 * @for DataManager
 * @type String
 * @final
 */
DataManager.prototype.__define("family_name", {
	get : function () {
		return $p.msg["meta_"+this.class_name.split(".")[0]+"_mgr"].replace($p.msg.meta_mgr+" ", "");
	},
	enumerable : false
});

/**
 * Регистрирует время изменения при заиси объекта для целей синхронизации
 */
DataManager.prototype.register_ex = function(){

};

/**
 * Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
 * @method sync_grid
 * @for DataManager
 * @param grid {dhtmlXGridObject}
 * @param attr {Object}
 */
DataManager.prototype.sync_grid = function(grid, attr){

	var res;

	if(this.cachable)
		;
	else if($p.job_prm.rest || $p.job_prm.irest_enabled || attr.rest){

		if(attr.action == "get_tree")
			res = this.rest_tree();

		else if(attr.action == "get_selection")
			res = this.rest_selection();

	}

};

/**
 * Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @for DataManager
 * @param val {DataObj|String} - текущее значение
 * @param [selection] {Object} - отбор, который будет наложен на список
 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
 * @return {Promise.<Array>}
 */
DataManager.prototype.get_option_list = function(val, selection){
	var t = this, l = [], count = 0, input_by_string, text, sel;

	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

	// TODO: реализовать для некешируемых объектов (rest)
	// TODO: учесть "поля поиска по строке"

	// поиск по строке
	if(selection.presentation && (input_by_string = t.metadata().input_by_string)){
		text = selection.presentation.like;
		delete selection.presentation;
		selection.or = [];
		input_by_string.forEach(function (fld) {
			sel = {};
			sel[fld] = {like: text};
			selection.or.push(sel);
		})
	}

	if(t.cachable || (selection && selection._local)){
		t.find_rows(selection, function (v) {
			l.push(check({text: v.presentation, value: v.ref}));
		});
		return Promise.resolve(l);

	}else{
		// для некешируемых выполняем запрос к серверу
		var attr = { selection: selection, top: selection._top };
		delete selection._top;



		if(t instanceof DocManager)
			attr.fields = ["ref", "date", "number_doc"];
		else if(t.metadata().main_presentation_name)
			attr.fields = ["ref", "name"];
		else
			attr.fields = ["ref", "id"];

		return _rest.load_array(attr, t)
			.then(function (data) {
				data.forEach(function (v) {
					l.push(check({
						text: t instanceof DocManager ? (v.number_doc + " от " + $p.dateFormat(v.date, $p.dateFormat.masks.ru)) : (v.name || v.id),
						value: v.ref}));
				});
				return l;
			});
	}
};

/**
 * Заполняет свойства в объекте source в соответствии с реквизитами табчасти
 * @param tabular {String} - имя табчасти
 * @param source {Object}
 */
DataManager.prototype.tabular_captions = function (tabular, source) {

};

/**
 * Возаращает строку xml для инициализации PropertyGrid
 * @method get_property_grid_xml
 * @param oxml {Object} - объект с иерархией полей (входной параметр - правила)
 * @param o {DataObj} - объект данных, из полей и табличных частей которого будут прочитаны значения
 * @param extra_fields {Object} - объект с описанием допреквизитов
 * @param extra_fields.ts {String} - имя табчасти
 * @param extra_fields.title {String} - заголовок в oxml, под которым следует расположить допреквизиты // "Дополнительные реквизиты", "Свойства изделия", "Параметры"
 * @param extra_fields.selection {Object} - отбор, который следует приминить к табчасти допреквизитов
 * @return {String} - XML строка в терминах dhtml.PropertyGrid
 */
DataManager.prototype.get_property_grid_xml = function(oxml, o, extra_fields){
	var t = this, i, j, mf, v, ft, txt, row_id, gd = '<rows>',

		default_oxml = function () {
			if(oxml)
				return;
			mf = t.metadata();

			if(mf.form && mf.form.obj && mf.form.obj.head){
				oxml = mf.form.obj.head;

			}else{
				oxml = {" ": []};

				if(o instanceof CatObj){
					if(mf.code_length)
						oxml[" "].push("id");
					if(mf.main_presentation_name)
						oxml[" "].push("name");
				}else if(o instanceof DocObj){
					oxml[" "].push("number_doc");
					oxml[" "].push("date");
				}
				if(!o.is_folder){
					for(i in mf.fields)
						if(!mf.fields[i].hide)
							oxml[" "].push(i);
				}
				if(mf.tabular_sections["extra_fields"])
					oxml["Дополнительные реквизиты"] = [];
			}


		},

		txt_by_type = function (fv, mf) {

			if($p.is_data_obj(fv))
				txt = fv.presentation;
			else
				txt = fv;

			if(mf.type.is_ref){
				;
			} else if(mf.type.date_part) {
				txt = $p.dateFormat(txt, "");

			} else if(mf.type.types[0]=="boolean") {
				txt = txt ? "1" : "0";
			}
		},

		by_type = function(fv){

			ft = _md.control_by_type(mf.type);
			txt_by_type(fv, mf);

		},

		add_xml_row = function(f, tabular){
			if(tabular){
				var pref = f["property"] || f["param"] || f["Параметр"],
					pval = f["value"] != undefined ? f["value"] : f["Значение"];
				if(pref.empty()) {
					row_id = tabular + "|" + "empty";
					ft = "ro";
					txt = "";
					mf = {synonym: "?"};

				}else{
					mf = {synonym: pref.presentation, type: pref.type};
					row_id = tabular + "|" + pref.ref;
					by_type(pval);
					if(ft == "edn")
						ft = "calck";

					if(pref.mandatory)
						ft += '" class="cell_mandatory';
				}

			}else if(typeof f === "object"){
				mf = {synonym: f.synonym};
				row_id = f.id;
				ft = f.type;
				txt = "";
				if(f.hasOwnProperty("txt"))
					txt = f.txt;
				else if((v = o[row_id]) !== undefined)
					txt_by_type(v, _md.get(t.class_name, row_id));

			}else if(extra_fields && extra_fields.meta && ((mf = extra_fields.meta[f]) !== undefined)){
				row_id = f;
				by_type(v = o[f]);

			}else if((v = o[f]) !== undefined){
				mf = _md.get(t.class_name, row_id = f);
				by_type(v);

			}else
				return;

			gd += '<row id="' + row_id + '"><cell>' + (mf.synonym || mf.name) +
				'</cell><cell type="' + ft + '">' + txt + '</cell></row>';
		};

	default_oxml();

	for(i in oxml){
		if(i!=" ")
			gd += '<row open="1"><cell>' + i + '</cell>';   // если у блока есть заголовок, формируем блок иначе добавляем поля без иерархии

		for(j in oxml[i])
			add_xml_row(oxml[i][j]);                        // поля, описанные в текущем разделе

		if(extra_fields && i == extra_fields.title && o[extra_fields.ts]){  // строки табчасти o.extra_fields
			var added = false;
			o[extra_fields.ts].find_rows(extra_fields.selection, function (row) {
				add_xml_row(row, extra_fields.ts);
			});
			//if(!added)
			//	add_xml_row({param: _cch.properties.get("", false)}, "params"); // fake-строка, если в табчасти нет допреквизитов

		}

		if(i!=" ") gd += '</row>';                          // если блок был открыт - закрываем
	}
	gd += '</rows>';
	return gd;
};

/**
 * Имя таблицы объектов этого менеджера в локальной базе данных
 * @property table_name
 * @type String
 * @final
 */
DataManager.prototype.__define("table_name", {
	get : function(){
		return this.class_name.replace(".", "_");
	},
	enumerable : false
});


/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String} - идентификатор команды печати
 * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
 */
DataManager.prototype.print = function(ref, model, wnd){

	function tune_wnd_print(wnd_print){
		if(wnd && wnd.progressOff)
			wnd.progressOff();
		if(wnd_print)
			wnd_print.focus();
	}

	if(wnd && wnd.progressOn)
		wnd.progressOn();

	var rattr = {};
	$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
	rattr.url += this.rest_name + "(guid'" + $p.fix_guid(ref) + "')" +
		"/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

	$p.ajax.get_and_show_blob(rattr.url, rattr, "get")
		.then(tune_wnd_print)
		.catch($p.record_log);
	setTimeout(tune_wnd_print, 3000);

};

/**
 * Возвращает промис со структурой печатных форм объекта
 * @return {Promise.<Object>}
 */
DataManager.prototype.printing_plates = function(){
	var rattr = {}, t = this;

	if($p.job_prm.offline)
		return Promise.resolve({});

	if(t.metadata().printing_plates)
		t._printing_plates = t.metadata().printing_plates;

	if(t._printing_plates)
		return Promise.resolve(t._printing_plates);

	$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
	rattr.url += t.rest_name + "/Print()";
	return $p.ajax.get_ex(rattr.url, rattr)
		.then(function (req) {
			t.__define("_printing_plates", {
				value: JSON.parse(req.response),
				enumerable: false
			});
			return t._printing_plates;
		})
		.catch(function (err) {
			return {};
		});
};



/**
 * ### Aбстрактный менеджер ссылочных данных
 * От него унаследованы менеджеры документов, справочников, планов видов характеристик и планов счетов
 *
 * @class RefDataManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта
 */
function RefDataManager(class_name) {

	var t = this,				// ссылка на себя
		by_ref={};				// приватное хранилище объектов по guid

	RefDataManager.superclass.constructor.call(t, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {DataObj}
	 */
	t.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete by_ref[o.ref];
			by_ref[new_ref] = o;
		}else
			by_ref[o.ref] = o;
	};

	/**
	 * Возвращает указатель на элементы локальной коллекции
	 * @method all
	 * @return {Object}
	 */
	t.all = function(){return by_ref};

	/**
	 * Выполняет перебор элементов локальной коллекции
	 * @method each
	 * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
	 */
	t.each = function(fn){
		for(var i in by_ref){
			if(!i || i == $p.blank.guid)
				continue;
			if(fn.call(this, by_ref[i]) == true)
				break;
		}
	};

	/**
	 * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
	 * @method get
	 * @param ref {String|Object} - ссылочный идентификатор
	 * @param [force_promise] {Boolean} - Если истина, возвращает промис, даже для локальных объектов. Если ложь, ищет только в локальном кеше
	 * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
	 * @return {DataObj|Promise.<DataObj>}
	 */
	t.get = function(ref, force_promise, do_not_create){

		var o = by_ref[ref] || by_ref[(ref = $p.fix_guid(ref))];

		if(!o){
			if(do_not_create)
				return;
			else
				o = new t._obj_сonstructor(ref, t, true);
		}

		if(force_promise === false)
			return o;

		else if(force_promise === undefined && ref === $p.blank.guid)
			return o;

		if(!t.cachable || o.is_new()){
			return o.load();	// читаем из 1С или иного сервера

		}else if(force_promise)
			return Promise.resolve(o);

		else
			return o;
	};

	/**
	 * Создаёт новый объект типа объектов текущего менеджера<br />
	 * Для кешируемых объектов, все действия происходят на клиенте<br />
	 * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
	 * @method create
	 * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
	 * @param [fill_default] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
	 * @return {Promise.<*>}
	 */
	t.create = function(attr, fill_default){

		function do_fill(){

		}

		if(!attr || typeof attr != "object")
			attr = {};
		if(!attr.ref || !$p.is_guid(attr.ref) || $p.is_empty_guid(attr.ref))
			attr.ref = $p.generate_guid();

		var o = by_ref[attr.ref];
		if(!o){
			o = new t._obj_сonstructor(attr, t);

			if(!t.cachable && fill_default){
				var rattr = {};
				$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
				rattr.url += t.rest_name + "/Create()";
				return $p.ajax.get_ex(rattr.url, rattr)
					.then(function (req) {
						return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
					});
			}

			if(fill_default){
				var _obj = o._obj;
				// присваиваем типизированные значения по умолчанию
				for(var f in t.metadata().fields){
					if(_obj[f] == undefined)
						_obj[f] = "";
				}
			}
		}

		return Promise.resolve(o);
	};

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method delete_loc
	 * @param ref
	 */
	t.delete_loc = function(ref) {
		var ind;
		delete by_ref[ref];
		for(var i in t.alatable){
			if(t.alatable[i].ref == ref){
				ind = i;
				break;
			}
		}
		if(ind != undefined){
			t.alatable.splice(ind, 1);
		}
	};


	/**
	 * Находит первый элемент, в любом поле которого есть искомое значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @return {DataObj}
	 */
	t.find = function(val){
		return $p._find(by_ref, val); };

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный по отбору<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере (для кешируемых типов)
	 * Для некешируемых типов выполняет запрос к базе
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param callback {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	t.find_rows = function(selection, callback){
		return $p._find_rows.call(t, by_ref, selection, callback);
	};

	/**
	 * Cохраняет объект в базе 1C либо выполняет запрос attr.action
	 * @method save
	 * @param attr {Object} - атрибуты сохраняемого объекта могут быть ранее полученным DataObj или произвольным объектом (а-ля данныеформыструктура)
	 * @return {Promise.<T>} - инфо о завершении операции
	 * @async
	 */
	t.save = function(attr){
		if(attr && (attr.specify ||
			($p.is_guid(attr.ref) && !t.cachable))) {
			return _load({
				class_name: t.class_name,
				action: attr.action || "save", attr: attr
			}).then(JSON.parse);
		}else
			return Promise.reject();
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	t.load_array = function(aattr, forse){

		var ref, obj;

		for(var i in aattr){
			ref = $p.fix_guid(aattr[i]);
			if(!(obj = by_ref[ref])){
				obj = new t._obj_сonstructor(aattr[i], t);
				if(forse)
					obj._set_loaded();

			}else if(obj.is_new() || forse){
				obj._mixin(aattr[i]);
				obj._set_loaded();
			}

		}

	};


	/**
	 * Возаращает предопределенный элемент или ссылку предопределенного элемента
	 * @method predefined
	 * @param name {String} - имя предопределенного
	 * @return {DataObj}
	 */
	t.predefined = function(name){
		var p = t.metadata()["predefined"][name];
		if(!p)
			return undefined;
		return t.get(p.ref);
	};

	/**
	 * Находит перую папку в пределах подчинения владельцу
	 * @method first_folder
	 * @param owner {DataObj|String}
	 * @return {DataObj} - ссылка найденной папки или пустая ссылка
	 */
	t.first_folder = function(owner){
		for(var i in by_ref){
			var o = by_ref[i];
			if(o.is_folder && (!owner || $p.is_equal(owner, o.owner)))
				return o;
		}
		return t.get();
	};


}
RefDataManager._extend(DataManager);

/**
 * Возаращает массив запросов для создания таблиц объекта и его табличных частей
 * @method get_sql_struct
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
RefDataManager.prototype.get_sql_struct = function(attr){
	var t = this,
		cmd = t.metadata(),
		res = {}, f, f0, trunc_index = 0,
		action = attr && attr.action ? attr.action : "create_table";


	function sql_selection(){

		var ignore_parent = !attr.parent,
			parent = attr.parent || $p.blank.guid,
			owner,
			initial_value = attr.initial_value || $p.blank.guid,
			filter = attr.filter || "",
			set_parent = $p.blank.guid;

		function list_flds(){
			var flds = [], s = "_t_.ref, _t_.`deleted`";

			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else{

				if(cmd["hierarchical"] && cmd["group_hierarchy"])
					flds.push("is_folder");
				else
					flds.push("0 as is_folder");

				if(t instanceof ChartOfAccountManager){
					flds.push("id");
					flds.push("name as presentation");

				}else if(cmd["main_presentation_name"])
					flds.push("name as presentation");

				else{
					if(cmd["code_length"])
						flds.push("id as presentation");
					else
						flds.push("'...' as presentation");
				}

				if(cmd["has_owners"])
					flds.push("owner");

				if(cmd["code_length"])
					flds.push("id");

			}

			flds.forEach(function(fld){
				if(fld.indexOf(" as ") != -1)
					s += ", " + fld;
				else
					s += _md.sql_mask(fld, true);
			});
			return s;

		}

		function join_flds(){

			var s = "", parts;

			if(cmd.form && cmd.form.selection){
				for(var i in cmd.form.selection.fields){
					if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
						continue;
					parts = cmd.form.selection.fields[i].split(" as ");
					parts[0] = parts[0].split(".");
					if(parts[0].length > 1){
						if(s)
							s+= "\n";
						s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
					}
				}
			}
			return s;
		}

		function where_flds(){

			var s;

			if(t instanceof ChartOfAccountManager){
				s = " WHERE (" + (filter ? 0 : 1);

			}else if(cmd["hierarchical"]){
				if(cmd["has_owners"])
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" +
						(owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				else
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

			}else{
				if(cmd["has_owners"])
					s = " WHERE (" + (owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				else
					s = " WHERE (" + (filter ? 0 : 1);
			}

			if(t.sql_selection_where_flds){
				s += t.sql_selection_where_flds(filter);

			}else if(t instanceof DocManager)
				s += " OR _t_.number_doc LIKE '" + filter + "'";

			else{
				if(cmd["main_presentation_name"] || t instanceof ChartOfAccountManager)
					s += " OR _t_.name LIKE '" + filter + "'";

				if(cmd["code_length"])
					s += " OR _t_.id LIKE '" + filter + "'";
			}

			s += ") AND (_t_.ref != '" + $p.blank.guid + "')";


			// допфильтры форм и связей параметров выбора
			if(attr.selection){
				if(typeof attr.selection == "function"){

				}else
					attr.selection.forEach(function(sel){
						for(var key in sel){

							if(typeof sel[key] == "function"){
								s += "\n AND " + sel[key](t, key) + " ";

							}else if(cmd.fields.hasOwnProperty(key)){
								if(sel[key] === true)
									s += "\n AND _t_." + key + " ";
								else if(sel[key] === false)
									s += "\n AND (not _t_." + key + ") ";
								else if(typeof sel[key] == "string" || typeof sel[key] == "object")
									s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
								else
									s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
							} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
								//if(sel[key])
								//	s += "\n AND _t_." + key + " ";
								//else
								//	s += "\n AND (not _t_." + key + ") ";
							}
						}
					});
			}

			return s;
		}

		function order_flds(){

			if(t instanceof ChartOfAccountManager){
				return "ORDER BY id";

			}else if(cmd["hierarchical"]){
				if(cmd["group_hierarchy"])
					return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";
				else
					return "ORDER BY _t_.parent desc, is_initial_value, presentation";
			}else
				return "ORDER BY is_initial_value, presentation";
		}

		function selection_prms(){

			// т.к. в процессе установки может потребоваться получение объектов, код асинхронный
			function on_parent(o){

				// ссылка родителя для иерархических справочников
				if(o){
					set_parent = (attr.set_parent = o.parent.ref);
					parent = set_parent;
					ignore_parent = false;
				}else if(!filter && !ignore_parent){
					;
				}else{
					if(t.class_name == "cat.base_blocks"){
						if(owner == $p.blank.guid)
							owner = _cat.bases.predefined("main");
						parent = t.first_folder(owner).ref;
					}
				}

				// строка фильтра
				if(filter && filter.indexOf("%") == -1)
					filter = "%" + filter + "%";

			}

			// установим владельца
			if(cmd["has_owners"]){
				owner = attr.owner;
				if(attr.selection && typeof attr.selection != "function"){
					attr.selection.forEach(function(sel){
						if(sel.owner){
							owner = typeof sel.owner == "object" ?  sel.owner.valueOf() : sel.owner;
							delete sel.owner;
						}
					});
				}
				if(!owner)
					owner = $p.blank.guid;
			}

			// ссылка родителя во взаимосвязи с начальным значением выбора
			if(initial_value !=  $p.blank.guid && ignore_parent){
				if(cmd["hierarchical"]){
					on_parent(t.get(initial_value, false))
				}else
					on_parent();
			}else
				on_parent();

		}

		selection_prms();

		var sql;
		if(t.sql_selection_list_flds)
			sql = t.sql_selection_list_flds(initial_value);
		else
			sql = ("SELECT %2, case when _t_.ref = '" + initial_value +
			"' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
				.replace("%2", list_flds())
				.replace("%j", join_flds())
			;

		return sql.replace("%3", where_flds()).replace("%4", order_flds());

	}

	function sql_create(){

		var sql = "CREATE TABLE IF NOT EXISTS ";

		if(attr && attr.postgres){
			sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, deleted boolean, lc_changed bigint";

			if(t instanceof DocManager)
				sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";
			else{
				if(cmd.code_length)
					sql += ", id character("+cmd.code_length+")";
				sql += ", name character varying(50), is_folder boolean";
			}

			for(f in cmd.fields){
				if(f.length > 30){
					if(cmd.fields[f].short_name)
						f0 = cmd.fields[f].short_name;
					else{
						trunc_index++;
						f0 = f[0] + trunc_index + f.substr(f.length-27);
					}
				}else
					f0 = f;
				sql += ", " + f0 + _md.sql_type(t, f, cmd.fields[f].type, true) + _md.sql_composite(cmd.fields, f, f0, true);
			}

			for(f in cmd["tabular_sections"])
				sql += ", " + "ts_" + f + " JSON";

		}else{
			sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT";

			if(t instanceof DocManager)
				sql += ", posted boolean, date Date, number_doc CHAR";
			else
				sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

			for(f in cmd.fields)
				sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.fields[f].type)+ _md.sql_composite(cmd.fields, f);

			for(f in cmd["tabular_sections"])
				sql += ", " + "`ts_" + f + "` JSON";
		}

		sql += ")";

		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var fields = ["ref", "deleted", "lc_changed"],
			sql = "INSERT INTO `"+t.table_name+"` (ref, `deleted`, lc_changed",
			values = "(?";

		if(t.class_name.substr(0, 3)=="cat"){
			sql += ", id, name, is_folder";
			fields.push("id");
			fields.push("name");
			fields.push("is_folder");

		}else if(t.class_name.substr(0, 3)=="doc"){
			sql += ", posted, date, number_doc";
			fields.push("posted");
			fields.push("date");
			fields.push("number_doc");

		}
		for(f in cmd.fields){
			sql += _md.sql_mask(f);
			fields.push(f);
		}
		for(f in cmd["tabular_sections"]){
			sql += ", `ts_" + f + "`";
			fields.push("ts_" + f);
		}
		sql += ") VALUES ";
		for(f = 1; f<fields.length; f++){
			values += ", ?";
		}
		values += ")";
		sql += values;

		return {sql: sql, fields: fields, values: values};
	}


	if(action == "create_table")
		res = sql_create();

	else if(["insert", "update", "replace"].indexOf(action) != -1)
		res[t.table_name] = sql_update();

	else if(action == "select")
		res = "SELECT * FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "select_all")
		res = "SELECT * FROM `"+t.table_name+"`";

	else if(action == "delete")
		res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

	else if(action == "get_tree"){
		if(!attr.filter || attr.filter.is_folder)
			res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";
		else
			res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
	}

	else if(action == "get_selection")
		res = sql_selection();

	return res;
};

// ШапкаТаблицыПоИмениКласса
RefDataManager.prototype.caption_flds = function(attr){

	var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
		acols = [], cmd = this.metadata(),	s = "";

	function Col_struct(id,width,type,align,sort,caption){
		this.id = id;
		this.width = width;
		this.type = type;
		this.align = align;
		this.sort = sort;
		this.caption = caption;
	}

	if(cmd.form && cmd.form.selection){
		acols = cmd.form.selection.cols;

	}else if(this instanceof DocManager){
		acols.push(new Col_struct("date", "120", "ro", "left", "server", "Дата"));
		acols.push(new Col_struct("number_doc", "120", "ro", "left", "server", "Номер"));

	}else if(this instanceof ChartOfAccountManager){
		acols.push(new Col_struct("id", "120", "ro", "left", "server", "Код"));
		acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

	}else{

		acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
		//if(cmd["has_owners"]){
		//	var owner_caption = "Владелец";
		//	acols.push(new Col_struct("owner", "200", "ro", "left", "server", owner_caption));
		//}

	}

	if(attr.get_header && acols.length){
		s = "<head>";
		for(var col in acols){
			s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
				.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
		}
		s += "</head>";
	}

	return {head: s, acols: acols};
};

/**
 * Догружает с сервера объекты, которых нет в локальном кеше
 * @method load_cached_server_array
 * @param list {Array} - массив строк ссылок или объектов со свойством ref
 * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
 * @return {Promise}
 */
RefDataManager.prototype.load_cached_server_array = function (list, alt_rest_name) {

	var query = [], obj,
		t = this,
		mgr = alt_rest_name ? {class_name: t.class_name, rest_name: alt_rest_name} : t,
		check_loaded = !alt_rest_name;

	list.forEach(function (o) {
		obj = t.get(o.ref || o, false, true);
		if(!obj || (check_loaded && obj.is_new()))
			query.push(o.ref || o);
	});
	if(query.length){

		var attr = {
			url: "",
			selection: {ref: {in: query}}
		};
		if(check_loaded)
			attr.fields = ["ref"];

		$p.rest.build_select(attr, mgr);
		//if(dhx4.isIE)
		//	attr.url = encodeURI(attr.url);

		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				var data = JSON.parse(req.response);

				if(check_loaded)
					data = data.value;
				else{
					data = data.data;
					for(var i in data){
						if(!data[i].ref && data[i].id)
							data[i].ref = data[i].id;
						if(data[i].Код){
							data[i].id = data[i].Код;
							delete data[i].Код;
						}
						data[i]._not_set_loaded = true;
					}
				}

				t.load_array(data);
				return(list);
			});

	}else
		return Promise.resolve(list);
};


/**
 * ### Абстрактный менеджер обработок
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "DataProcessors"}}{{/crossLink}}
 *
 * @class DataProcessorsManager
 * @extends DataManager
 * @param class_name {string} - имя типа менеджера объекта
 * @constructor
 */
function DataProcessorsManager(class_name){

	DataProcessorsManager.superclass.constructor.call(this, class_name);

	/**
	 * Создаёт экземпляр объекта обработки
	 * @method
	 * @return {DataProcessorObj}
	 */
	this.create = function(){
		return new this._obj_сonstructor({}, this);
	};

}
DataProcessorsManager._extend(DataManager);



/**
 * ### Абстрактный менеджер перечисления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
 *
 * @class EnumManager
 * @extends RefDataManager
 * @param a {array} - массив значений
 * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
function EnumManager(a, class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	this._obj_сonstructor = EnumObj;

	this.push = function(o, new_ref){
		this.__define(new_ref, {
			value : o,
			enumerable : false
		}) ;
	};

	this.get = function(ref){

		if(ref instanceof EnumObj)
			return ref;

		else if(!ref || ref == $p.blank.guid)
			ref = "_";

		var o = this[ref];
		if(!o)
			o = new EnumObj({name: ref}, this);

		return o;
	};

	this.each = function (fn) {
		this.alatable.forEach(function (v) {
			if(v.ref && v.ref != $p.blank.guid)
				fn.call(this[v.ref]);
		});
	};

	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);


/**
 * Bозаращает массив запросов для создания таблиц объекта и его табличных частей
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
EnumManager.prototype.get_sql_struct = function(attr){

	var res = "CREATE TABLE IF NOT EXISTS ",
		action = attr && attr.action ? attr.action : "create_table";

	if(attr && attr.postgres){
		if(action == "create_table")
			res += this.table_name+
				" (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";
		else if(["insert", "update", "replace"].indexOf(action) != -1){
			res = {};
			res[this.table_name] = {
				sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES ($1, $2, $3)",
				fields: ["ref", "sequence", "synonym"],
				values: "($1, $2, $3)"
			};

		}else if(action == "delete")
			res = "DELETE FROM "+this.table_name+" WHERE ref = $1";

	}else {
		if(action == "create_table")
			res += "`"+this.table_name+
				"` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";

		else if(["insert", "update", "replace"].indexOf(action) != -1){
			res = {};
			res[this.table_name] = {
				sql: "INSERT INTO `"+this.table_name+"` (ref, sequence, synonym) VALUES (?, ?, ?)",
				fields: ["ref", "sequence", "synonym"],
				values: "(?, ?, ?)"
			};

		}else if(action == "delete")
			res = "DELETE FROM `"+this.table_name+"` WHERE ref = ?";
	}



	return res;

};

/**
 * Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @param val {DataObj|String}
 * @param [selection] {Object}
 * @param [selection._top] {Number}
 * @return {Promise.<Array>}
 */
EnumManager.prototype.get_option_list = function(val, selection){
	var l = [], synonym = "";

	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

	if(selection){
		for(var i in selection){
			if(i.substr(0,1)=="_")
				continue;
			synonym = selection[i];
		}
	}

	if(typeof synonym == "object"){
		if(synonym.like)
			synonym = synonym.like;
		else
			synonym = "";
	}
	synonym = synonym.toLowerCase();

	this.alatable.forEach(function (v) {
		if(synonym){
			if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1)
				return;
		}
		l.push(check({text: v.synonym || "", value: v.ref}));
	});
	return Promise.resolve(l);
};


/**
 * ### Абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 *
 * @class RegisterManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function RegisterManager(class_name){

	var by_ref={};				// приватное хранилище объектов по ключу записи

	this._obj_сonstructor = RegisterRow;

	RegisterManager.superclass.constructor.call(this, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {RegisterRow}
	 */
	this.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete by_ref[o.ref];
			by_ref[new_ref] = o;
		}else
			by_ref[o.ref] = o;
	};

	/**
	 * Возвращает массив записей c заданным отбором либо запись по ключу
	 * @method get
	 * @for InfoRegManager
	 * @param attr {Object} - объект {key:value...}
	 * @param force_promise {Boolesn} - возаращять промис, а не массив
	 * @param return_row {Boolesn} - возвращать запись, а не массив
	 * @return {*}
	 */
	this.get = function(attr, force_promise, return_row){

		if(!attr)
			attr = {};
		attr.action = "select";

		var arr = $p.wsql.alasql(this.get_sql_struct(attr), attr._values),
			res;

		delete attr.action;
		delete attr._values;

		if(arr.length){
			if(return_row)
				res = by_ref[this.get_ref(arr[0])];
			else{
				res = [];
				for(var i in arr)
					res.push(by_ref[this.get_ref(arr[i])]);
			}
		}
		return force_promise ? Promise.resolve(res) : res;
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
	 * @async
	 */
	this.load_array = function(aattr){

		var key, obj, res = [];

		for(var i in aattr){

			key = this.get_ref(aattr[i]);

			if(!(obj = by_ref[key])){
				new this._obj_сonstructor(aattr[i], this);

			}else
				obj._mixin(aattr[i]);

			res.push(by_ref[key]);
		}
		return res;

	};

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный по отбору<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере (для кешируемых типов)
	 * Для некешируемых типов выполняет запрос к базе
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param callback {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	this.find_rows = function(selection, callback){
		return $p._find_rows.call(this, this.alatable, selection, callback);
	};

}
RegisterManager._extend(DataManager);

/**
 * Возаращает запросов для создания таблиц или извлечения данных
 * @method get_sql_struct
 * @for RegisterManager
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
RegisterManager.prototype.get_sql_struct = function(attr) {
	var t = this,
		cmd = t.metadata(),
		res = {}, f,
		action = attr && attr.action ? attr.action : "create_table";

	function sql_create(){
		var sql = "CREATE TABLE IF NOT EXISTS ",
			first_field = true;

		if(attr && attr.postgres){
			sql += t.table_name+" ("

			if(cmd.splitted){
				sql += "zone integer";
				first_field = false;
			}

			for(f in cmd["dimensions"]){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
				sql += _md.sql_type(t, f, cmd["dimensions"][f].type, true) + _md.sql_composite(cmd["dimensions"], f, "", true);
			}

			for(f in cmd["resources"])
				sql += ", " + f + _md.sql_type(t, f, cmd["resources"][f].type, true) + _md.sql_composite(cmd["resources"], f, "", true);

			sql += ", PRIMARY KEY (";
			first_field = true;
			if(cmd.splitted){
				sql += "zone";
				first_field = false;
			}
			for(f in cmd["dimensions"]){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
			}

		}else{
			sql += "`"+t.table_name+"` ("

			for(f in cmd["dimensions"]){
				if(first_field){
					sql += "`" + f + "`";
					first_field = false;
				}else
					sql += _md.sql_mask(f);
				sql += _md.sql_type(t, f, cmd["dimensions"][f].type) + _md.sql_composite(cmd["dimensions"], f);
			}

			for(f in cmd["resources"])
				sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd["resources"][f].type) + _md.sql_composite(cmd["resources"], f);

			sql += ", PRIMARY KEY (";
			first_field = true;
			for(f in cmd["dimensions"]){
				if(first_field){
					sql += "`" + f + "`";
					first_field = false;
				}else
					sql += _md.sql_mask(f);
			}
		}

		sql += "))";

		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
			fields = [],
			first_field = true;

		for(f in cmd["dimensions"]){
			if(first_field){
				sql += f;
				first_field = false;
			}else
				sql += ", " + f;
			fields.push(f);
		}
		for(f in cmd["resources"]){
			sql += ", " + f;
			fields.push(f);
		}

		sql += ") VALUES (?";
		for(f = 1; f<fields.length; f++){
			sql += ", ?";
		}
		sql += ")";

		return {sql: sql, fields: fields};
	}

	function sql_select(){
		var sql = "SELECT * FROM `"+t.table_name+"` WHERE ",
			first_field = true;
		attr._values = [];

		for(var f in cmd["dimensions"]){

			if(first_field)
				first_field = false;
			else
				sql += " and ";

			sql += "`" + f + "`" + "=?";
			attr._values.push(attr[f]);
		}

		if(first_field)
			sql += "1";

		return sql;
	}


	if(action == "create_table")
		res = sql_create();

	else if(action in {insert:"", update:"", replace:""})
		res[t.table_name] = sql_update();

	else if(action == "select")
		res = sql_select();

	else if(action == "select_all")
		res = sql_select();

	else if(action == "delete")
		res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

	return res;
};

RegisterManager.prototype.get_ref = function(attr){
	var key = "", ref,
		dimensions = this.metadata().dimensions;
	if(attr instanceof RegisterRow)
		attr = attr._obj;
	for(var j in dimensions){
		key += (key ? "_" : "");
		if(dimensions[j].type.is_ref)
			key += $p.fix_guid(attr[j]);

		else if(!attr[j] && dimensions[j].type.digits)
			key += "0";

		else if(dimensions[j].date_part)
			key += $p.dateFormat(attr[j] || $p.blank.date, $p.dateFormat.masks.atom);

		else if(attr[j]!=undefined)
			key += String(attr[j]);

		else
			key += "$";
	}
	return key;
};




/**
 * ### Абстрактный менеджер регистра сведений
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "InfoRegs"}}{{/crossLink}}
 *
 * @class InfoRegManager
 * @extends RegisterManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function InfoRegManager(class_name){

	InfoRegManager.superclass.constructor.call(this, class_name);

}
InfoRegManager._extend(RegisterManager);

/**
 * Возаращает массив записей - срез первых значений по ключам отбора
 * @method slice_first
 * @for InfoRegManager
 * @param filter {Object} - отбор + период
 */
InfoRegManager.prototype.slice_first = function(filter){

};

/**
 * Возаращает массив записей - срез последних значений по ключам отбора
 * @method slice_last
 * @for InfoRegManager
 * @param filter {Object} - отбор + период
 */
InfoRegManager.prototype.slice_last = function(filter){

};


/**
 * ### Журнал событий
 * Хранит и накапливает события сеанса<br />
 * Является наследником регистра сведений
 * @extends InfoRegManager
 * @class LogManager
 * @static
 */
function LogManager(){

	LogManager.superclass.constructor.call(this, "ireg.$log");

	var smax;

	/**
	 * Добавляет запись в журнал
	 * @param msg {String|Object|Error} - текст + класс события
	 * @param [msg.obj] {Object} - дополнительный json объект
	 */
	this.record = function(msg){

		if(msg instanceof Error){
			if(console)
				console.log(msg);
			var err = msg;
			msg = {
				class: "error",
				note: err.toString()
			}
		}

		if(typeof msg != "object")
			msg = {note: msg};
		msg.date = Date.now() + $p.eve.time_diff();
		if(!smax)
			smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_$log` where `date` = ?");
		var res = smax([msg.date]);
		if(!res.length || res[0].sequence === undefined)
			msg.sequence = 0;
		else
			msg.sequence = res[0].sequence + 1;
		if(!msg.class)
			msg.class = "note";


		$p.wsql.alasql("insert into `ireg_$log` (`date`, `sequence`, `class`, `note`, `obj`) values (?, ?, ?, ?, ?)",
			[msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

	};

	/**
	 * Сбрасывает события на сервер
	 * @method backup
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.backup = function(dfrom, dtill){

	};

	/**
	 * Восстанавливает события из архива на сервере
	 * @method restore
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.restore = function(dfrom, dtill){

	};

	/**
	 * Стирает события в указанном диапазоне дат
	 * @method clear
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.clear = function(dfrom, dtill){

	};

	this.show = function (pwnd) {

	};

	this.get_sql_struct = function(attr){

		if(attr && attr.action == "get_selection"){
			var sql = "select * from `ireg_$log`";
			if(attr.date_from){
				if (attr.date_till)
					sql += " where `date` >= ? and `date` <= ?";
				else
					sql += " where `date` >= ?";
			}else if (attr.date_till)
				sql += " where `date` <= ?";

			return sql;

		}else
			return LogManager.superclass.get_sql_struct.call(this, attr);
	};

	this.caption_flds = function (attr) {

		var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
			acols = [], cmd = this.metadata(),	s = "";

		function Col_struct(id,width,type,align,sort,caption){
			this.id = id;
			this.width = width;
			this.type = type;
			this.align = align;
			this.sort = sort;
			this.caption = caption;
		}

		acols.push(new Col_struct("date", "140", "ro", "left", "server", "Дата"));
		acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
		acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));

		if(attr.get_header){
			s = "<head>";
			for(var col in acols){
				s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
					.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
			}
			s += "</head>";
		}

		return {head: s, acols: acols};
	};

	this.data_to_grid = function (data, attr) {
		var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
				.replace("%1", data.length).replace("%2", attr.start)
				.replace("%3", attr.set_parent || "" ),
			caption = this.caption_flds(attr),
			time_diff = $p.eve.time_diff();

		// при первом обращении к методу добавляем описание колонок
		xml += caption.head;

		data.forEach(function(r){
			xml += "<row id=\"" + r.date + "_" + r.sequence + "\"><cell>" +
				$p.dateFormat(r.date - time_diff, $p.dateFormat.masks.date_time) + (r.sequence ? "." + r.sequence : "") + "</cell>" +
				"<cell>" + r.class + "</cell><cell>" + r.note + "</cell></row>";
		});

		return xml + "</rows>";
	}
}
LogManager._extend(InfoRegManager);



/**
 * ### Абстрактный менеджер регистра накопления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "AccumRegs"}}{{/crossLink}}
 *
 * @class AccumRegManager
 * @extends RegisterManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "areg.goods_on_stores"
 */
function AccumRegManager(class_name){

	AccumRegManager.superclass.constructor.call(this, class_name);
}
AccumRegManager._extend(RegisterManager);




/**
 * ### Абстрактный менеджер справочника
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Catalogs"}}{{/crossLink}}
 *
 * @class CatManager
 * @extends RefDataManager
 * @constructor
 * @param class_name {string}
 */
function CatManager(class_name) {

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		/**
		 * признак "это группа"
		 * @property is_folder
		 * @for CatObj
		 * @type {Boolean}
		 */
		this._obj_сonstructor.prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.fix_boolean(v)},
			enumerable : true
		});
	}

}
CatManager._extend(RefDataManager);

/**
 * Возвращает объект по наименованию
 * @method by_name
 * @param name {String|Object} - искомое наименование
 * @return {DataObj}
 */
CatManager.prototype.by_name = function(name){

	var o;

	this.find_rows({name: name}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

/**
 * Возвращает объект по коду
 * @method by_id
 * @param id {String|Object} - искомый код
 * @return {DataObj}
 */
CatManager.prototype.by_id = function(id){

	var o;

	this.find_rows({id: id}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

/**
 * Для иерархических кешируемых справочников возвращает путь элемента
 * @param ref {String|CatObj} - ссылка или объект данных
 * @return {string} - строка пути элемента
 */
CatManager.prototype.path = function(ref){
	var res = [], tobj;

	if(ref instanceof DataObj)
		tobj = ref;
	else
		tobj = this.get(ref, false, true);
	if(tobj)
		res.push({ref: tobj.ref, presentation: tobj.presentation});

	if(tobj && this.metadata().hierarchical){
		while(true){
			tobj = tobj.parent;
			if(tobj.empty())
				break;
			res.push({ref: tobj.ref, presentation: tobj.presentation});
		}
	}
	return res;
};



/**
 * ### Абстрактный менеджер плана видов характеристик
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfCharacteristics"}}{{/crossLink}}
 *
 * @class ChartOfCharacteristicManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function ChartOfCharacteristicManager(class_name){

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	ChartOfCharacteristicManager.superclass.constructor.call(this, class_name);

}
ChartOfCharacteristicManager._extend(CatManager);


/**
 * ### Абстрактный менеджер плана счетов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfAccounts"}}{{/crossLink}}
 *
 * @class ChartOfAccountManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function ChartOfAccountManager(class_name){

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	ChartOfAccountManager.superclass.constructor.call(this, class_name);

}
ChartOfAccountManager._extend(CatManager);


/**
 * ### Абстрактный менеджер документов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Documents"}}{{/crossLink}}
 *
 * @class DocManager
 * @extends RefDataManager
 * @constructor
 * @param class_name {string}
 */
function DocManager(class_name) {

	this._obj_сonstructor = DocObj;		// ссылка на конструктор элементов

	DocManager.superclass.constructor.call(this, class_name);


}
DocManager._extend(RefDataManager);

/**
 * Конструкторы табличных частей
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_tabulars
 * @requires common
 */


/**
 * ### Абстрактный объект табличной части
 * - Физически, данные хранятся в {{#crossLink "DataObj"}}{{/crossLink}}, а точнее - в поле типа массив и именем табчасти объекта `_obj`
 * - Класс предоставляет методы для доступа и манипуляции данными табчасти
 *
 * @class TabularSection
 * @constructor
 * @param name {String} - имя табчасти
 * @param owner {DataObj} - владелец табличной части
 */
function TabularSection(name, owner){

	// Если табчасти нет в данных владельца - создаём
	if(!owner._obj[name])
		owner._obj[name] = [];

	/**
	 * Имя табличной части
	 * @property _name
	 * @type String
	 */
	this.__define('_name', {
		value : name,
		enumerable : false
	});

	/**
	 * Объект-владелец табличной части
	 * @property _owner
	 * @type DataObj
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: owner._obj[name],
		writable: false,
		enumerable: false
	});
}

TabularSection.prototype.toString = function(){
	return "Табличная часть " + this._owner._manager.class_name + "." + this._name
};

/**
 * Возвращает строку табчасти по индексу
 * @method get
 * @param index {Number} - индекс строки табчасти
 * @return {TabularSectionRow}
 */
TabularSection.prototype.get = function(index){
	return this._obj[index]._row;
};

/**
 * Возвращает количество элементов в табчасти
 * @method count
 * @return {Number}
 */
TabularSection.prototype.count = function(){return this._obj.length};

/**
 * очищает табличнут часть
 * @method clear
 */
TabularSection.prototype.clear = function(do_not_notify){
	for(var i in this._obj)
		delete this._obj[i];
	this._obj.length = 0;

	if(!do_not_notify)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});
};

/**
 * Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val){
	var index, _obj = this._obj, j = 0;
	if(typeof val == "undefined")
		return;
	else if(typeof val == "number")
		index = val;
	else if(_obj[val.row-1]._row === val)
		index = val.row-1;
	else{
		for(var i in _obj)
			if(_obj[i]._row === val){
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
	}
	if(index == undefined)
		return;

	_obj.splice(index, 1);

	for(var i in _obj){
		j++;
		_obj[i].row = j;
	}

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * Находит первую строку, содержащую значение
 * @method find
 * @param val {*}
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val){
	var res = $p._find(this._obj, val);
	if(res)
		return res._row;
};

/**
 * Находит строки, соответствующие отбору. Если отбор пустой, возвращаются все строки табчасти
 * @method find_rows
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 * @param [callback] {Function} - в который передается строка табчасти на каждой итерации
 * @return {Array}
 */
TabularSection.prototype.find_rows = function(selection, callback){

	var t = this,
		cb = callback ? function (row) {
			return callback.call(t, row._row);
		} : null;

	return $p._find_rows.call(t, t._obj, selection, cb);

};

/**
 * Меняет местами строки табчасти
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){
	var tmp = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = tmp;

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 */
TabularSection.prototype.add = function(attr, do_not_notify){

	var row = new this._owner._manager._ts_сonstructors[this._name](this);

	if(!attr)
		attr = {};

	// присваиваем типизированные значения по умолчанию
	for(var f in row._metadata.fields)
		row[f] = attr[f] || "";

	row._obj.row = this._obj.push(row._obj);
	row._obj.__define("_row", {
		value: row,
		enumerable: false
	});

	if(!do_not_notify)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;
	return row;
};

/**
 * Выполняет цикл "для каждого"
 * @method each
 * @param fn {Function} - callback, в который передается строка табчасти
 */
TabularSection.prototype.each = function(fn){
	var t = this;
	t._obj.forEach(function(row){
		return fn.call(t, row._row);
	});
};

/**
 * загружает табличнут часть из массива объектов
 * @method load
 * @param aattr {Array} - массив объектов к загрузке
 */
TabularSection.prototype.load = function(aattr){
	var t = this, arr;
	t.clear(true);
	if(aattr instanceof TabularSection)
		arr = aattr._obj;
	else if(Array.isArray(aattr))
		arr = aattr;
	if(arr)
		arr.forEach(function(row){
			t.add(row, true);
	});

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * Перезаполняет грид данными табчасти с учетом отбора
 * @method sync_grid
 * @param grid {dhtmlxGrid} - элемент управления
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 */
TabularSection.prototype.sync_grid = function(grid, selection){
	var grid_data = {rows: []},
		columns = [];

	for(var i = 0; i<grid.getColumnCount(); i++)
		columns.push(grid.getColumnId(i));

	grid.clearAll();
	this.find_rows(selection, function(r){
		var data = [];
		columns.forEach(function (f) {
			if($p.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	try{ grid.parse(grid_data, "json"); } catch (e){}
	grid.callEvent("onGridReconstructed", []);

};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


/**
 * ### Aбстрактная строка табличной части
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 */
function TabularSectionRow(owner){

	var _obj = {};

	/**
	 * Указатель на владельца данной строки табличной части
	 * @property _owner
	 * @type TabularSection
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Отображается в поле типа json записи в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

/**
 * Метаданые строки табличной части
 * @property _metadata
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * Номер строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 * @final
 */
TabularSectionRow.prototype.__define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

/**
 * Копирует строку табличной части
 * @method _clone
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define("_clone", {
	value : function(){
		return new this._owner._owner._manager._ts_сonstructors[this._owner._name](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;

	Object.getNotifier(this._owner._owner).notify({
		type: 'row',
		row: this,
		tabular: this._owner._name,
		name: f,
		oldValue: this._obj[f]
	});

	DataObj.prototype.__setter.call(this, f, v);

};


/**
 * Конструкторы объектов данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_objs
 * @requires common
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 */
function DataObj(attr, manager) {

	var ref, tmp,
		_ts_ = {},
		_obj = {data_version: ""},
		_is_new = !(this instanceof EnumObj);

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager))
		tmp = manager.get(attr, false, true);

	if(tmp)
		return tmp;

	if(manager instanceof EnumManager)
		_obj.ref = ref = attr.name;

	else if(!(manager instanceof RegisterManager)){
		_obj.ref = ref = $p.fix_guid(attr);
		_obj.deleted = false;
		_obj.lc_changed = 0;

	}else
		ref = manager.get_ref(attr);

	/**
	 * Указатель на менеджер данного объекта
	 * @property _manager
	 * @type DataManager
	 * @final
	 */
	this.__define('_manager', {
		value : manager,
		enumerable : false
	});

	/**
	 * Возвращает "истина" для нового (еще не записанного или непрочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	this.__define("is_new", {
		value: function(){
			return _is_new;
		},
		enumerable: false
	});

	this.__define("_set_loaded", {
		value: function(ref){
			_is_new = false;
			manager.push(this, ref);
		},
		enumerable: false
	});


	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 * @final
	 */
	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

	this.__define("_ts_", {
		value: function( name ) {
			if( !_ts_[name] ) {
				_ts_[name] = new TabularSection(name, this);
			}
			return _ts_[name];
		},
		enumerable: false
	});


	if(manager.alatable && manager.push){
		manager.alatable.push(_obj);
		manager.push(this, ref);
	}

}

DataObj.prototype.valueOf = function () {
	return this.ref;
};

/**
 * Обработчик при сериализации объекта
 * @return {*}
 */
DataObj.prototype.toJSON = function () {
	return this._obj;
};

DataObj.prototype._getter = function (f) {

	var mf = this._metadata.fields[f].type,
		mgr, ref;

	if(f == "type" && typeof this._obj[f] == "object")
		return this._obj[f];

	else if(f == "ref"){
		return this._obj[f];

	}else if(mf.is_ref){
		if(mgr = _md.value_mgr(this._obj, f, mf)){
			if(mgr instanceof DataManager)
				return mgr.get(this._obj[f], false);
			else
				return $p.fetch_type(this._obj[f], mgr);
		}else if(this._obj[f]){
			console.log([f, mf, this._obj]);
			return null;
		}

	}else if(mf.date_part)
		return $p.fix_date(this._obj[f], true);

	else if(mf.digits)
		return $p.fix_number(this._obj[f], true);

	else if(mf.types[0]=="boolean")
		return $p.fix_boolean(this._obj[f]);

	else
		return this._obj[f] || "";
};

DataObj.prototype.__setter = function (f, v) {

	var mf = this._metadata.fields[f].type,
		mgr;

	if(f == "type" && v.types)
		this._obj[f] = v;

	else if(f == "ref")

		this._obj[f] = $p.fix_guid(v);

	else if(mf.is_ref){

		this._obj[f] = $p.fix_guid(v);

		mgr = _md.value_mgr(this._obj, f, mf, false, v);

		if(mgr){
			if(mgr instanceof EnumManager){
				if(typeof v == "string")
					this._obj[f] = v;

				else if(!v)
					this._obj[f] = "";

				else if(typeof v == "object")
					this._obj[f] = v.ref || v.name || "";

			}else if(v && v.presentation){
				if(v.type && !(v instanceof DataObj))
					delete v.type;
				mgr.create(v);
			}else if(!(mgr instanceof DataManager))
				this._obj[f] = $p.fetch_type(v, mgr);
		}else{
			if(typeof v != "object")
				this._obj[f] = v;
		}

	}else if(mf.date_part)
		this._obj[f] = $p.fix_date(v, true);

	else if(mf.digits)
		this._obj[f] = $p.fix_number(v, true);

	else if(mf.types[0]=="boolean")
		this._obj[f] = $p.fix_boolean(v);

	else
		this._obj[f] = v;
};

DataObj.prototype.__notify = function (f) {
	Object.getNotifier(this).notify({
		type: 'update',
		name: f,
		oldValue: this._obj[f]
	});
};

DataObj.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;

	this.__notify(f);

	this.__setter(f, v);

};

DataObj.prototype._getter_ts = function (f) {
	return this._ts_(f);
};

DataObj.prototype._setter_ts = function (f, v) {
	var ts = this._ts_(f);
	if(ts instanceof TabularSection && Array.isArray(v))
		ts.load(v);
};


/**
 * Читает объект из внешней датабазы асинхронно.
 * @method load
 * @for DataObj
 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.load = function(){

	var tObj = this;

	function callback_1c(res){		// инициализация из датабазы 1C

		if(typeof res == "string")
			res = JSON.parse(res);
		if($p.msg.check_soap_result(res))
			return;

		var ref = $p.fix_guid(res);
		if(tObj.is_new() && !$p.is_empty_guid(ref))
			tObj._set_loaded(ref);

		return tObj._mixin(res);      // заполнить реквизиты шапки и табличных частей
	}

	if(tObj._manager.cachable && !tObj.is_new())
		return Promise.resolve(tObj);

	if(tObj.ref == $p.blank.guid){
		if(tObj instanceof CatObj)
			tObj.id = "000000000";
		else
			tObj.number_doc = "000000000";
		return Promise.resolve(tObj);

	}else if($p.job_prm.rest || $p.job_prm.irest_enabled)
		return _rest.load_obj(tObj);

	else
		return _load({
			class_name: tObj._manager.class_name,
			action: "load",
			ref: tObj.ref
		})
			.then(callback_1c);

};

/**
 * ### Записывает объект
 * Ввыполняет подписки на события перед записью и после записи
 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param [mode] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.save = function (post, operational) {

	var saver;

	// Если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
	if(this._manager.handle_event(this, "before_save") === false)
		return Promise.resolve(this);

	if(this instanceof DocObj && $p.blank.date == this.date)
		this.date = new Date();

	// если доступен irest - сохраняем через него, иначе - стандартным сервисом
	if($p.job_prm.offline)
		saver = function (obj) {
			return Promise.resolve(obj);
		};
	else{
		saver = $p.job_prm.irest_enabled ? _rest.save_irest : _rest.save_rest;
	}


	// Сохраняем во внешней базе
	return saver(this, {
		post: post,
		operational: operational
	})

		// и выполняем обработку после записи
		.then(function (obj) {
			return obj._manager.handle_event(obj, "after_save");
		});
};

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @return {boolean} - true, если ссылка пустая
 */
DataObj.prototype.empty = function(){
	return $p.is_empty_guid(this._obj.ref);
};


/**
 * Метаданные текущего объекта
 * @property _metadata
 * @for DataObj
 * @type Object
 * @final
 */
DataObj.prototype.__define('_metadata', {
	get : function(){ return this._manager.metadata()},
	enumerable : false
});

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
DataObj.prototype.__define('ref', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = $p.fix_guid(v)},
	enumerable : true,
	configurable: true
});

/**
 * Пометка удаления
 * @property deleted
 * @for DataObj
 * @type Boolean
 */
DataObj.prototype.__define('deleted', {
	get : function(){ return this._obj.deleted},
	set : function(v){
		this.__notify('deleted');
		this._obj.deleted = !!v;
	},
	enumerable : true,
	configurable: true
});

/**
 * Версия данных для контроля изменения объекта другим пользователем
 * @property data_version
 * @for DataObj
 * @type String
 */
DataObj.prototype.__define('data_version', {
	get : function(){ return this._obj.data_version || ""},
	set : function(v){
		this.__notify('data_version');
		this._obj.data_version = String(v);
	},
	enumerable : true
});

/**
 * Время последнего изменения объекта в миллисекундах от начала времён для целей синхронизации
 * @property lc_changed
 * @for DataObj
 * @type Number
 */
DataObj.prototype.__define('lc_changed', {
	get : function(){ return this._obj.lc_changed || 0},
	set : function(v){
		this.__notify('lc_changed');
		this._obj.lc_changed = $p.fix_number(v, true);
	},
	enumerable : true,
	configurable: true
});



/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function CatObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	CatObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for CatObj
	 * @type String
	 */
	this.__define('presentation', {
		get : function(){

			if(this.name || this.id)
				return this.name || this.id || this._metadata["obj_presentation"];
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object"){
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}else{
			this._mixin(attr);
			if(!$p.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
	}

}
CatObj._extend(DataObj);

/**
 * Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype.__define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){
		this.__notify('id');
		this._obj.id = v;
	},
	enumerable : true
});

/**
 * Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype.__define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){
		this.__notify('name');
		this._obj.name = String(v);
	},
	enumerable : true
});


/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function DocObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	DocObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for DocObj
	 * @type String
	 */
	this.__define('presentation', {
		get : function(){

			if(this.number_str || this.number_doc)
				return this._metadata["obj_presentation"] + ' №' + (this.number_str || this.number_doc) + " от " + $p.dateFormat(this.date, $p.dateFormat.masks.ru);
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);
}
DocObj._extend(DataObj);

/**
 * Номер документа
 * @property number_doc
 * @type {String|Number}
 */
DocObj.prototype.__define('number_doc', {
	get : function(){ return this._obj.number_doc || ""},
	set : function(v){
		this.__notify('number_doc');
		this._obj.number_doc = v;
	},
	enumerable : true
});

/**
 * Дата документа
 * @property date
 * @type {Date}
 */
DocObj.prototype.__define('date', {
	get : function(){ return this._obj.date || $p.blank.date},
	set : function(v){
		this.__notify('date');
		this._obj.date = $p.fix_date(v, true);
	},
	enumerable : true
});

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
DocObj.prototype.__define('posted', {
	get : function(){ return this._obj.posted || false},
	set : function(v){
		this.__notify('posted');
		this._obj.posted = $p.fix_boolean(v);
	},
	enumerable : true
});



/**
 * ### Абстрактный класс ОбработкаОбъект
 * @class DataProcessorObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function DataProcessorObj(attr, manager) {

	// выполняем конструктор родительского объекта
	DataProcessorObj.superclass.constructor.call(this, attr, manager);

	var f, cmd = manager.metadata();
	for(f in cmd.fields)
		attr[f] = $p.fetch_type("", cmd.fields[f].type);
	for(f in cmd["tabular_sections"])
		attr[f] = [];

	this._mixin(attr);

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 */
	this.unload = function(){
		for(f in this){
			if(this[f] instanceof TabularSection){
				this[f].clear();
				delete this[f];
			}else if(typeof this[f] != "function"){
				delete this[f];
			}
		}
	};
}
DataProcessorObj._extend(DataObj);

/**
 * ### Абстрактный класс значения перечисления
 * Имеет fake-ссылку и прочие атрибуты объекта данных, но фактически - это просто значение перечисления
 *
 * @class EnumObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {EnumManager}
 */
function EnumObj(attr, manager) {

	// выполняем конструктор родительского объекта
	EnumObj.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);

}
EnumObj._extend(DataObj);


/**
 * Порядок элемента перечисления
 * @property order
 * @for EnumObj
 * @type Number
 */
EnumObj.prototype.__define('order', {
	get : function(){ return this._obj.sequence},
	set : function(v){ this._obj.sequence = parseInt(v)},
	enumerable : true
});

/**
 * Наименование элемента перечисления
 * @property name
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('name', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = String(v)},
	enumerable : true
});

/**
 * Синоним элемента перечисления
 * @property synonym
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('synonym', {
	get : function(){ return this._obj.synonym || ""},
	set : function(v){ this._obj.synonym = String(v)},
	enumerable : true
});

/**
 * Представление объекта
 * @property presentation
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('presentation', {
	get : function(){
		return this.synonym || this.name;
	},
	enumerable : false
});

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @for EnumObj
 * @return {boolean} - true, если ссылка пустая
 */
EnumObj.prototype.empty = function(){
	return this.ref == "_";
};


/**
 * ### Запись (строка) регистра
 * Используется во всех типах регистров (сведений, накопления, бухгалтерии)
 *
 * @class RegisterRow
 * @extends DataObj
 * @constructor
 * @param attr {object} - объект, по которому запись будет заполнена
 * @param manager {InfoRegManager|AccumRegManager}
 */
function RegisterRow(attr, manager){

	// выполняем конструктор родительского объекта
	RegisterRow.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);
}
RegisterRow._extend(DataObj);

/**
 * Метаданные строки регистра
 * @property _metadata
 * @for RegisterRow
 * @type Object
 */
RegisterRow.prototype.__define('_metadata', {
	get : function(){
		var cm = this._manager.metadata();
		if(!cm.fields)
			cm.fields = ({})._mixin(cm.dimensions)._mixin(cm.resources);
		return cm;
	},
	enumerable : false
});

RegisterRow.prototype.__define('ref', {
	get : function(){ return this._manager.get_ref(this)},
	enumerable : true
});


/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule rest
 * @requires common
 */

/**
 * Методы общего назначения для работы с rest
 * @class Rest
 * @static
 */
function Rest(){

	/**
	 * Форматирует период для подстановки в запрос rest
	 * @method filter_date
	 * @param fld {String} - имя поля для фильтрации по датам
	 * @param [dfrom] {Date} - дата начала
	 * @param [dtill] {Date} - дата окончания
	 * @return {String}
	 */
	this.filter_date = function (fld, dfrom, dtill) {
		if(!dfrom)
			dfrom = new Date("2015-01-01");
		var res = fld + " gt datetime'" + $p.dateFormat(dfrom, $p.dateFormat.masks.isoDateTime) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.dateFormat(dtill, $p.dateFormat.masks.isoDateTime) + "'";
		return res;
	};

	/**
	 * Преобразует данные, прочитанные из rest-сервиса в json-прототип DataObj
	 * @method to_data
	 * @param rdata {Object} - фрагмент ответа rest
	 * @param mgr {DataManager}
	 * @return {Object}
	 */
	this.to_data = function (rdata, mgr) {
		var o = {},
			mf = mgr.metadata().fields,
			mts = mgr.metadata().tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			if(rdata.hasOwnProperty("DeletionMark"))
				o.deleted = rdata.DeletionMark;
			if(rdata.hasOwnProperty("DataVersion"))
				o.data_version = rdata.DataVersion;
			if(rdata.hasOwnProperty("Ref_Key"))
				o.ref = rdata.Ref_Key;
		}else{
			mf = []._mixin(mgr.metadata().dimensions)._mixin(mgr.metadata().resources);
		}

		if(mgr instanceof DocManager){
			if(rdata.hasOwnProperty("Number"))
				o.number_doc = rdata.Number || rdata.number_doc;
			else if(rdata.hasOwnProperty("number_doc"))
				o.number_doc = rdata.number_doc;
			if(rdata.hasOwnProperty("Date"))
				o.date = rdata.Date;
			else if(rdata.hasOwnProperty("date"))
				o.date = rdata.date;
			if(rdata.hasOwnProperty("Posted"))
				o.posted = rdata.Posted;
			else if(rdata.hasOwnProperty("posted"))
				o.posted = rdata.posted;

		} else {
			if(mgr.metadata().main_presentation_name){
				if(rdata.hasOwnProperty("Description"))
					o.name = rdata.Description;
				else if(rdata.hasOwnProperty("name"))
					o.name = rdata.name;
			}

			if(mgr.metadata().code_length){
				if(rdata.hasOwnProperty("Code"))
					o.id = rdata.Code;
				else if(rdata.hasOwnProperty("id"))
					o.id = rdata.id;
			}
		}

		for(f in mf){
			syn = _md.syns_1с(f);
			if(syn.indexOf("_Key") == -1 && mf[f].type.is_ref && rdata[syn+"_Key"])
				syn+="_Key";
			if(!rdata.hasOwnProperty(syn))
				continue;
			o[f] = rdata[syn];
		}

		for(ts in mts){
			synts = ts == "extra_fields" ? ts : _md.syns_1с(ts);
			if(!rdata.hasOwnProperty(synts))
				continue;
			o[ts] = [];
			if(rdata[synts]){
				rdata[synts].sort(function (a, b) {
					return a.LineNumber > b.LineNumber;
				});
				rdata[synts].forEach(function (r) {
					row = {};
					for(tf in mts[ts].fields){
						syn = (ts == "extra_fields" && (tf == "property" || tf == "value")) ? tf : _md.syns_1с(tf);
						if(syn.indexOf("_Key") == -1 && mts[ts].fields[tf].type.is_ref && r[syn+"_Key"])
							syn+="_Key";
						row[tf] = r[syn];
					}
					o[ts].push(row);
				});
			}
		}

		return o;
	};

	/**
	 * Выполняет запрос к rest-сервису и возвращает массив прототипов DataObj
	 * @param attr {Object} - параметры запроса
	 * @param mgr {DataManager}
	 * @return {Promise.<T>}
	 */
	this.ajax_to_data = function (attr, mgr) {
		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				var data = [];
				res.value.forEach(function (rdata) {
					data.push(_rest.to_data(rdata, mgr));
				});
				return data;
			});
	};

	this.build_select = function (attr, mgr) {
		var s, f, syn, type, select_str = "";

		function build_condition(fld, val){

			if(typeof val == "function"){
				f += val(mgr, fld);

			}else{

				syn = _md.syns_1с(fld);
				type = _md.get(mgr.class_name, fld);
				if(type){
					type = type.type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}

					if(type.types.length){

						if(["boolean", "number"].indexOf(typeof val) != -1 )
							f += syn + " eq " + val;

						else if((type.is_ref && typeof val != "object") || val instanceof DataObj)
							f += syn + " eq guid'" + val + "'";

						else if(typeof val == "string")
							f += syn + " eq '" + val + "'";

						else if(typeof val == "object"){
							// TODO: учесть in, not, like
							if(val.hasOwnProperty("like"))
								f += syn + " like '%" + val.like + "%'";

							else if(val.hasOwnProperty("not")){
								f += " not (" + build_condition(fld, val.not) + ") ";
							}

							else if(val.hasOwnProperty("in")){
								f += (syn + " in (") + (type.is_ref ? val.in.map(function(v){return "guid'" + v + "'"}).join(",") : val.in.join(",")) + ") ";
							}
						}
					}
				}
			}
		}

		function build_selection(sel){
			for(var fld in sel){

				if(!f)
					f = "&$filter=";
				else
					f += " and ";

				if(fld == "or" && Array.isArray(sel[fld])){
					var first = true;
					sel[fld].forEach(function (element) {

						if(first){
							f += " ( ";
							first = false;
						}else
							f += " or ";

						var key = Object.keys(element)[0];
						build_condition(key, element[key]);

					});
					f += " ) ";

				}else
					build_condition(fld, sel[fld]);

			}
		}

		if(!attr)
			attr = {};

		// учитываем нужные поля
		if(attr.fields){
			attr.fields.forEach(function(fld){
				if(fld == "ref")
					syn = "Ref_Key";
				else{
					syn = _md.syns_1с(fld);
					type = _md.get(mgr.class_name, fld).type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}
				}
				if(!s)
					s = "&$select=";
				else
					s += ",";
				s += syn;
			});
			select_str += s;
		}

		// учитываем отбор
		// /a/unf/hs/rest/Catalog_Контрагенты?allowedOnly=true&$format=json&$top=30&$select=Ref_Key,Description&$filter=IsFolder eq false and Description like '%б%'
		if(attr.selection){
			if(typeof attr.selection == "function"){

			}else if(Array.isArray(attr.selection))
				attr.selection.forEach(build_selection);

			else
				build_selection(attr.selection);

			if(f)
				select_str += f;
		}


		// для простых запросов используем стандартный odata 1c
		if($p.job_prm.rest &&
			mgr.rest_name.indexOf("Module_") == -1 &&
			mgr.rest_name.indexOf("DataProcessor_") == -1 &&
			mgr.rest_name.indexOf("Report_") == -1 &&
			select_str.indexOf(" like ") == -1 &&
			select_str.indexOf(" in ") == -1 &&
			!mgr.metadata().irest )
			$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		// для сложных отборов либо при явном irest в метаданных, используем наш irest
		else
			$p.ajax.default_attr(attr, $p.job_prm.irest_url());

		// начинаем строить url: только разрешенные + top
		attr.url += mgr.rest_name + "?allowedOnly=true&$format=json&$top=" + (attr.top || 300) + select_str;
		//a/unf/odata/standard.odata/Document_ЗаказПокупателя?allowedOnly=true&$format=json&$select=Ref_Key,DataVersion
	};

	/**
	 * Загружает список объектов из rest-сервиса, обрезанный отбором
	 * @method load_array
	 * @for DataManager
	 * @param attr {Object} - параметры запроса
	 * @param [attr.selection] {Object} - условия отбора
	 * @param [attr.top] {Number} - максимальное число загружаемых записей
	 * @param mgr {DataManager}
	 * @return {Promise.<T>} - промис с массивом загруженных прототипов DataObj
	 * @async
	 */
	this.load_array = function (attr, mgr) {

		_rest.build_select(attr, mgr);

		return _rest.ajax_to_data(attr, mgr);
	};

	/**
	 * Читает объект из rest-сервиса
	 * @return {Promise.<T>} - промис с загруженным объектом
	 */
	this.load_obj = function (tObj) {

		var attr = {};
		$p.ajax.default_attr(attr, (!tObj._metadata.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'" + tObj.ref + "')?$format=json";

		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				tObj._mixin(_rest.to_data(res, tObj._manager))._set_loaded();
				return tObj;
			})
			.catch(function (err) {
				if(err.status==404)
					return tObj;
				else
					$p.record_log(err);
			});
	};

	/**
	 * Сохраняет объект в базе irest-сервиса (наш http-интерфейс)
	 * @param tObj {DataObj} - сохраняемый объект
	 * @param attr {Object} - параметры сохранения
	 * @param attr.[url] {String} - если не указано, будет использован адрес irest из параметров работы программы
	 * @param attr.[username] {String}
	 * @param attr.[password] {String}
	 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param attr.[operational] {Boolean|undefined} - режим проведения документа [Оперативный, Неоперативный]
	 * @return {Promise.<T>}
	 * @async
	 */
	this.save_irest = function (tObj, attr) {

		var post_data = JSON.stringify(tObj),
			prm = (attr.post != undefined ? ",post="+attr.post : "")+
				(attr.operational != undefined ? ",operational="+attr.operational : "");

		$p.ajax.default_attr(attr, $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'"+tObj.ref+"'"+prm+")";

		return $p.ajax.post_ex(attr.url, post_data, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				return tObj._mixin(res);
			});
	};

	/**
	 * Сохраняет объект в базе rest-сервиса
	 * @param tObj {DataObj} - сохраняемый объект
	 * @param attr {Object} - параметры сохранения
	 * @param attr.[url] {String} - если не указано, будет использован адрес rest из параметров работы программы
	 * @param attr.[username] {String}
	 * @param attr.[password] {String}
	 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param attr.[operational] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
	 * @return {Promise.<T>}
	 * @async
	 */
	this.save_rest = function (tObj, attr) {

		var atom = tObj.to_atom(),
			url;

		$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		url = attr.url + tObj._manager.rest_name;

		// проверяем наличие ссылки в базе приёмника
		attr.url = url + "(guid'" + tObj.ref + "')?$format=json&$select=Ref_Key,DeletionMark";

		return $p.ajax.get_ex(attr.url, attr)
			.catch(function (err) {
				if(err.status == 404){
					return {response: JSON.stringify({is_new: true})};
				}else
					return Promise.reject(err);
			})
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (data) {
				// если объект существует на стороне приемника, выполняем patch, иначе - post
				if(data.is_new)
					return $p.ajax.post_ex(url, atom, attr);
				else
					return $p.ajax.patch_ex(url + "(guid'" + tObj.ref + "')", atom, attr);
			})
			.then(function (req) {
				var data = xmlToJSON.parseString(req.response, {
					mergeCDATA: false, // extract cdata and merge with text
					grokAttr: true, // convert truthy attributes to boolean, etc
					grokText: false, // convert truthy text/attr to boolean, etc
					normalize: true, // collapse multiple spaces to single space
					xmlns: false, // include namespaces as attribute in output
					namespaceKey: '_ns', // tag name for namespace objects
					textKey: '_text', // tag name for text nodes
					valueKey: '_value', // tag name for attribute values
					attrKey: '_attr', // tag for attr groups
					cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
					attrsAsObject: false, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
					stripAttrPrefix: true, // remove namespace prefixes from attributes
					stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
					childrenAsArray: false // force children into arrays
				});
				if(data.entry && data.entry.content && data.entry.updated){
					var p = data.entry.content.properties, r = {}, v;
					r.lc_changed = new Date(data.entry.updated._text);
					for(var i in p){
						if(i.indexOf("_")==0)
							continue;
						if(v = p[i].element){
							r[i] = [];
							if(Array.isArray(v)){
								for(var n in v){
									r[i][n] = {};
									for(var j in v[n])
										if(j.indexOf("_")!=0)
											r[i][n][j] = v[n][j]._text === "false" ? false : v[n][j]._text;
								}
							}else{
								r[i][0] = {};
								for(var j in v)
									if(j.indexOf("_")!=0)
										r[i][0][j] = v[j]._text === "false" ? false : v[j]._text;
							}
						}else
							r[i] = p[i]._text === "false" ? false : p[i]._text;
					}
					return _rest.to_data(r, tObj._manager);
				}
			})
			.then(function (res) {
				return tObj._mixin(res);
			});

	};
}

var _rest = $p.rest = new Rest();


/**
 * ### Имя объектов этого менеджера для запросов к rest-серверу
 * Идентификатор формируется по принципу: ПрефиксИмени_ИмяОбъектаКонфигурации_СуффиксИмени
 * - Справочник _Catalog_
 * - Документ _Document_
 * - Журнал документов _DocumentJournal_
 * - Константа _Constant_
 * - План обмена _ExchangePlan_
 * - План счетов _ChartOfAccounts_
 * - План видов расчета _ChartOfCalculationTypes_
 * - План видов характеристик _ChartOfCharacteristicTypes_
 * - Регистр сведений _InformationRegister_
 * - Регистр накопления _AccumulationRegister_
 * - Регистр расчета _CalculationRegister_
 * - Регистр бухгалтерии _AccountingRegister_
 * - Бизнес-процесс _BusinessProcess_
 * - Задача _Task_
 * - Обработка _DataProcessor_
 * - Отчет _Report_
 * - Общий модуль _Module_
 * - Внешняя обработка _ExternalDataProcessor_
 * - Внешний отчет _ExternalReport_
 *
 * @property rest_name
 * @for DataManager
 * @type String
 * @final
 */
DataManager.prototype.__define("rest_name", {
	get : function(suffix){
		var fp = this.class_name.split("."),
			csyn = {
				cat: "Catalog",
				doc: "Document",
				ireg: "InformationRegister",
				areg: "AccumulationRegister",
				cch: "ChartOfCharacteristicTypes",
				cacc: "ChartOfAccounts"
			};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]) + (suffix || "");
	},
	enumerable : false
});


DataManager.prototype.rest_tree = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = [], ares = [], o, ro, syn, mf;

	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000&$select=Ref_Key,DeletionMark,Parent_Key,Description&$filter=IsFolder eq true";

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {
					ref: ro["Ref_Key"],
					deleted: ro["DeletionMark"],
					parent: ro["Parent_Key"],
					presentation: ro["Description"]
				};
				ares.push(o);
			}
			return $p.iface.data_to_tree(ares);
		});

};

DataManager.prototype.rest_selection = function (attr) {

	if(attr.action == "get_tree")
		return this.rest_tree(attr);

	var t = this,
		cmd = t.metadata(),
		flds = [],
		ares = [], o, ro, syn, mf,
		select,
		filter_added;

	select = (function(){

		var s = "$select=Ref_Key,DeletionMark";

		if(cmd.form && cmd.form.selection){
			cmd.form.selection.fields.forEach(function (fld) {
				flds.push(fld);
			});

		}else if(t instanceof DocManager){
			flds.push("posted");
			flds.push("date");
			flds.push("number_doc");

		}else{

			if(cmd["hierarchical"] && cmd["group_hierarchy"])
				flds.push("is_folder");
			else
				flds.push("0 as is_folder");

			if(cmd["main_presentation_name"])
				flds.push("name as presentation");
			else{
				if(cmd["code_length"])
					flds.push("id as presentation");
				else
					flds.push("'...' as presentation");
			}

			if(cmd["has_owners"])
				flds.push("owner");

			if(cmd["code_length"])
				flds.push("id");

		}

		flds.forEach(function(fld){
			var parts;
			if(fld.indexOf(" as ") != -1){
				parts = fld.split(" as ")[0].split(".");
				if(parts.length == 1)
					fld = parts[0];
				else if(parts[0] != "_t_")
					return;
				else
					fld = parts[1]
			}
			if(fld == "0")
				return;
			syn = _md.syns_1с(fld);
			if(_md.get(t.class_name, fld).type.is_ref){
				if(syn.indexOf("_Key") == -1 && _md.get(t.class_name, fld).type.types.length && _md.get(t.class_name, fld).type.types[0].indexOf("enm.")==-1)
					syn += "_Key";
			}

			s += "," + syn;
		});

		flds.push("ref");
		flds.push("deleted");

		return s;

	})();


	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : this.rest_name) + "?allowedOnly=true&$format=json&$top=1000&" + select;

	if(_md.get(t.class_name, "date")){
		attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);
		filter_added = true;
	}

	if(attr.parent){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Parent_Key eq guid'" + attr.parent + "'";
		filter_added = true;
	}

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {};
				flds.forEach(function (fld) {

					var fldsyn;

					if(fld == "ref") {
						o[fld] = ro["Ref_Key"];
						return;
					}else if(fld.indexOf(" as ") != -1){
						fldsyn = fld.split(" as ")[1];
						fld = fld.split(" as ")[0].split(".");
						fld = fld[fld.length-1];
					}else
						fldsyn = fld;

					syn = _md.syns_1с(fld);
					mf = _md.get(t.class_name, fld);

					if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
						syn += "_Key";

					if(mf.type.date_part)
						o[fldsyn] = $p.dateFormat(ro[syn], $p.dateFormat.masks[mf.type.date_part]);

					else if(mf.type.is_ref){
						if(!ro[syn] || ro[syn] == $p.blank.guid)
							o[fldsyn] = "";
						else{
							var mgr	= _md.value_mgr(o, fld, mf.type, false, ro[syn]);
							if(mgr)
								o[fldsyn] = mgr.get(ro[syn]).presentation;
							else
								o[fldsyn] = "";
						}
					}else
						o[fldsyn] = ro[syn];

				});
				ares.push(o);
			}
			return $p.iface.data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(selection){

	if(!selection.period)
		selection.period = $p.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.dateFormat(selection.period, $p.dateFormat.masks.isoDateTime) + "'",
		condition = "";

	for(var fld in cmd.dimensions){

		if(selection[fld] === undefined)
			continue;

		var syn = _md.syns_1с(fld),
			mf = cmd.dimensions[fld];

		if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1){
			syn += "_Key";
			if(condition)
				condition+= " and ";
			condition+= syn+" eq guid'"+selection[fld].ref+"'";
		}else{
			if(condition)
				condition+= " and ";

			if(mf.type.digits)
				condition+= syn+" eq "+$p.fix_number(selection[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+$p.dateFormat(selection[fld], $p.dateFormat.masks.isoDateTime)+"'";

			else
				condition+= syn+" eq '"+selection[fld]+"'";
		}

	}

	if(condition)
		period+= ",Condition='"+condition+"'";

	$p.ajax.default_attr(selection, $p.job_prm.rest_url());
	selection.url += this.rest_name + "/SliceLast(%sl)?allowedOnly=true&$format=json&$top=1000".replace("%sl", period);

	return _rest.ajax_to_data(selection, t)
		.then(function (data) {
			return t.load_array(data);
		});
};

/**
 * Сериализует объект данных в формат xml/atom (например, для rest-сервиса 1С)
 * @param [ex_meta] {Object} - метаданные внешней по отношению к текущей базы (например, для записи в *УНФ* объекта *Заказа дилера*).
 * Если указано, вывод ограничен полями, доступными во внешней базе + используются синонимы внешней базы
 */
DataObj.prototype.to_atom = function (ex_meta) {

	var res = '<entry><category term="StandardODATA.%n" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>\
				\n<title type="text"/><updated>%d</updated><author/><summary/><content type="application/xml">\
				\n<m:properties xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">\
			%p\
			\n</m:properties></content></entry>'
		.replace('%n', this._manager.rest_name)
		.replace('%d', $p.dateFormat(new Date(), $p.dateFormat.masks.atom)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this.deleted + '</d:DeletionMark>' +
			'\n<d:DataVersion>' + this.data_version + '</d:DataVersion>',

		f, mf, fts, ts, mts, pname, v;

	function fields_to_atom(obj){
		var meta_fields = obj._metadata.fields,
			prefix = obj instanceof TabularSectionRow ? '\n\t<d:' : '\n<d:';

		for(f in meta_fields){
			mf = meta_fields[f];
			pname = _md.syns_1с(f);
			v = obj[f];
			if(v instanceof EnumObj)
				v = v.empty() ? "" : v.name;

			else if(v instanceof DataObj){
				if(pname.indexOf("_Key") == -1)
					pname+= '_Key';
				v = v.ref;

			}else if(mf.type.date_part){
				if(v.getFullYear() < 1000)
					v = '0001-01-01T00:00:00Z';
				else
					v = $p.dateFormat(v, $p.dateFormat.masks.atom);

			}else if(v == undefined)
				continue;


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.dateFormat(this.date, $p.dateFormat.masks.atom) + '</d:Date>';
		prop+= '\n<d:Number>' + this.number_doc + '</d:Number>';

	} else {

		if(this._metadata.main_presentation_name)
			prop+= '\n<d:Description>' + this.name + '</d:Description>';

		if(this._metadata.code_length)
			prop+= '\n<d:Code>' + this.id + '</d:Code>';

		if(this._metadata.hierarchical && this._metadata.group_hierarchy)
			prop+= '\n<d:IsFolder>' + this.is_folder + '</d:IsFolder>';

	}

	fields_to_atom(this);

	for(fts in this._metadata.tabular_sections) {

		mts = this._metadata.tabular_sections[fts];
		//if(mts.hide)
		//	continue;

		pname = 'StandardODATA.' + this._manager.rest_name + '_' + _md.syns_1с(fts) + '_RowType';
		ts = this[fts];
		if(ts.count()){
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')">';

			ts.each(function (row) {
				prop+= '\n\t<d:element m:type="' + pname + '">';
				prop+= '\n\t<d:LineNumber>' + row.row + '</d:LineNumber>';
				fields_to_atom(row);
				prop+= '\n\t</d:element>';
			});

			prop+= '\n</d:' + _md.syns_1с(fts) + '>';

		}else
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')" />';
	}

	return res.replace('%p', prop);

	//<d:DeletionMark>false</d:DeletionMark>
	//<d:Ref_Key>213d87ad-33d5-11de-b58f-00055d80a2b8</d:Ref_Key>
	//<d:IsFolder>false</d:IsFolder>
	//<d:Description>Новая папка</d:Description>
	//<d:Запасы m:type="Collection(StandardODATA.Document_ЗаказПокупателя_Запасы_RowType)">
	//	<d:element m:type="StandardODATA.Document_ЗаказПокупателя_Запасы_RowType">
	//		<d:LineNumber>1</d:LineNumber>
	//		<d:Номенклатура_Key>6ebf3bf7-3565-11de-b591-00055d80a2b9</d:Номенклатура_Key>
	//		<d:ТипНоменклатурыЗапас>true</d:ТипНоменклатурыЗапас>
	//		<d:Характеристика_Key>00000000-0000-0000-0000-000000000000</d:Характеристика_Key>
	//		<d:ПроцентАвтоматическойСкидки>0</d:ПроцентАвтоматическойСкидки>
	//		<d:СуммаАвтоматическойСкидки>0</d:СуммаАвтоматическойСкидки>
	//		<d:КлючСвязи>0</d:КлючСвязи>
	//	</d:element>
	//</d:Запасы>
	//<d:МатериалыЗаказчика m:type="Collection(StandardODATA.Document_ЗаказПокупателя_МатериалыЗаказчика_RowType)"/>
};


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
			if($p.job_prm.check_browser_compatibility && (!w.JSON || !w.indexedDB) ){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				setTimeout(function(){ location.replace(msg.store_url_od); }, 6000);
				return;
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
						dhtmlx.skin = $p.wsql.get_user_param("skin") || $p.job_prm.skin || "dhx_web";

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


$p.eve.init_node = function (alasql) {

	$p.job_prm = new $p.JobPrm();

	var data_url = $p.job_prm.data_url || "/data/";

	return $p.from_file(data_url + 'create_tables.sql')
		.then(function (sql) {
			return $p.wsql.init_params(alasql, sql);
		})
		.then(function() {
			return $p.from_file(data_url + 'meta.json');
		})
		.then(function(meta) {
			return $p.from_file(data_url + 'meta_patch.json')
				.then(function (patch) {
					return [JSON.parse(meta), JSON.parse(patch)]
				})
		})
		.then(function(meta) {
			return new $p.Meta(meta[0], meta[1]);
		});

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


return $p;
}));
