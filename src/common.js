/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author	Evgeniy Malyarov
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */

//"use strict";

/**
 * ### Глобальный объект
 * Фреймворк [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует единственную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 */
function MetaEngine() {
	this.version = "0.9.199";
	this.toString = function(){
		return "Oknosoft data engine. v:" + this.version;
	};
}

/**
 * Для совместимости со старыми модулями, публикуем $p глобально
 * Кроме этой переменной, metadata.js ничего не экспортирует
 */
$p = new MetaEngine();

/**
 * Обёртка для подключения через AMD или CommonJS
 * https://github.com/umdjs/umd
 */
if (typeof define === 'function' && define.amd) {
	define('$p', $p);                               // Support AMD (e.g. require.js)
} else if (typeof module === 'object' && module) {  // could be `null`
	module.exports = $p;                            // Support CommonJS module
}

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


	/**
	 * Если контекст исполнения - браузер, проверяем поддержку промисов, при необходимости загружаем полифил
	 */
	(function(){
		var i, surl, sname;

		if(typeof Promise !== "function"){

			for(i in document.scripts){
				if(document.scripts[i].src.indexOf("metadata.js")!=-1){
					sname = "metadata.js";
					surl = document.scripts[i].src;
					break;
				}else if(document.scripts[i].src.indexOf("metadata.min.js")!=-1){
					sname = "metadata.min.js";
					surl = document.scripts[i].src;
					break;
				}
			}

			$p.load_script(surl.replace(sname, "es6-promise.min.js"), "script", function () {
				ES6Promise.polyfill();
			});

		}

	})();

}else if(typeof WorkerGlobalScope === "undefined"){

	// локальное хранилище внутри node.js
	if(typeof localStorage === "undefined")
		localStorage = new require('node-localstorage').LocalStorage('./localstorage');

	// alasql внутри node.js
	if (typeof window === "undefined" && typeof alasql === "undefined")
		alasql = require('alasql');

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

/**
 * Реализует наследование текущим конструктором свойств и методов конструктора Parent
 * @method _extend
 * @for Object
 * @param Parent {Function}
 */
Object.prototype.__define("_extend", {
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
});

/**
 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
 * @method _mixin
 * @for Object
 * @param src {Object} - источник
 * @return {Object}
 */
Object.prototype.__define("_mixin", {
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
});

/**
 * Создаёт копию объекта
 * @method _clone
 * @for Object
 * @param src {Object|Array} - исходный объект
 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
 * @returns {Object|Array} - копия объекта
 */
Object.prototype.__define("_clone", {
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
});

/**
 * Полифил для обсервера и нотифаера пока не подключаем
 * Это простая заглушка, чтобы в старых браузерах не возникали исключения
 */
if(!Object.observe && !Object.unobserve && !Object.getNotifier)
	Object.__define({
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

		function _call(method, url, postData, auth, beforeSend) {

			// Возвращаем новое Обещание.
			return new Promise(function(resolve, reject) {

				// Делаем привычные XHR вещи
				var req = new XMLHttpRequest();

				if(typeof window != "undefined" && dhx4.isIE)
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
				}
				else
					req.open(method, url, true);

				if(beforeSend)
					beforeSend.call(this, req);

				if (method != "GET") {
					if(!this.hide_headers && !auth.hide_headers){
						req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					}
				} else {
					postData = null;
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
				req.send(postData);
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

			if(!method || method.toLowerCase().indexOf("post")!=-1)
				return this.post_ex(url,
					typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function(xhr){
						xhr.responseType = "blob";
					})
					.then(show_blob);
			else
				return this.get_ex(url, post_data, function(xhr){
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
					require("filesaver").saveAs(req.response, file_name);
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

	if(ref && typeof ref == "string")
		;

	else if(ref instanceof DataObj)
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
	 * @param [obj] {String} - имя класса объекта
	 * @param [ref] {String} - ссылка объекта
	 * @param [frm] {String} - имя формы объекта
	 * @param [view] {String} - имя представления главной формы
	 */
	this.set_hash = function (obj, ref, frm, view ) {
		if(!obj)
			obj = "";
		if(!ref)
			ref = "";
		if(!frm)
			frm = "";
		if(!view)
			view = "";
		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;

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
				tres = require(method)(data);
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

	/**
	 * Указывает, проверять ли установленность приложения в Google Chrome Store при запуске программы
	 * @property check_app_installed
	 * @type {Boolean}
	 * @static
	 */
	this.check_app_installed = false;
	this.check_dhtmlx = true;
	this.use_builder = false;
	this.offline = false;
	this.local_storage_prefix = "";

	/**
	 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
	 * @property url_prm
	 * @type {Object}
	 * @static
	 */
	this.url_prm = this.parse_url();

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

	/**
	 * Адрес стандартного интерфейса 1С OData
	 * @method rest_url
	 * @return {string}
	 */
	this.rest_url = function () {
		var url = this.rest_path || "/a/zd/%1/odata/standard.odata/",
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
		var url = this.rest_path || "/a/zd/%1/odata/standard.odata/",
			zone = $p.wsql.get_user_param("zone", "number");
		url = url.replace("odata/standard.odata", "hs/rest");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

}


/**
 * Интерфейс локальной базы данных
 * @class WSQL
 * @static
 */
function WSQL(){

	var wsql = this,
		user_params = {},
		inited = 0;

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

	//TODO задействовать вебворкеров + единообразно база в озу alasql


	/**
	 * Выполняет sql запрос к локальной базе данных
	 * @method exec
	 * @param sql {String} - текст запроса
	 * @param prm {Array} - массив с параметрами для передачи в запрос
	 * @param [callback] {Function} - функция обратного вызова. если не укзана, запрос выполняется "как бы синхронно"
	 * @param [tag] {*} - произвольные данные для передачи в callback
	 * @async
	 */
	wsql.exec = function(sql, prm, callback, tag) {

		if(inited < 10){
			inited++;
			setTimeout(function () {
				wsql.exec(sql, prm, callback, tag);
			}, 1000);
			return;

		}else if(inited < 100) {
			throw new TypeError('alasql init error');
		}

		if(!Array.isArray(prm))
			prm = [prm];	// если параметры не являются массивом, конвертируем

		var i, data = [];
		try{
			if(callback)
				alasql(sql, prm, function (data) {
					callback(data, tag);
				});
			else
				alasql(sql, prm);
		}
		catch(e){
			if(callback)
				callback(e);
		}
	};

	/**
	 * Выполняет sql запрос к локальной базе данных, возвращает Promise
	 * @param sql
	 * @param params
	 * @return {Promise}
	 * @async
	 */
	wsql.promise = function(sql, params) {
		return new Promise(function(resolve, reject){
			alasql(sql, params || [], function(data, err) {
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
			if(typeof localStorage !== "undefined")
				localStorage.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
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

		if(!user_params.hasOwnProperty(prm_name) && (typeof localStorage !== "undefined"))
			user_params[prm_name] = fetch_type(localStorage.getItem($p.job_prm.local_storage_prefix+prm_name), type);

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
	 * Создаёт и заполняет умолчаниями таблицу параметров
	 * @method init_params
	 * @return {Promise}
	 * @async
	 */
	wsql.init_params = function(){

		var nesessery_params = [
			{p: "user_name",		v: "", t:"string"},
			{p: "user_pwd",			v: "", t:"string"},
			{p: "browser_uid",		v: $p.generate_guid(), t:"string"},
			{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t:"number"},
			{p: "enable_save_pwd",	v: "",	t:"boolean"},
			{p: "reset_local_data",	v: "",	t:"boolean"},
			{p: "autologin",		v: "",	t:"boolean"},
			{p: "cache_md_date",	v: 0,	t:"number"},
			{p: "cache_cat_date",	v: 0,	t:"number"},
			{p: "files_date",       v: 201511010000, t:"number"},
			{p: "margin",			v: 60,	t:"number"},
			{p: "discount",			v: 15,	t:"number"},
			{p: "offline",			v: "" || $p.job_prm.offline, t:"boolean"},
			{p: "skin",		        v: "dhx_web", t:"string"}
		], zone;

		// подмешиваем к базовым параметрам настройки приложения
		if($p.job_prm.additional_params)
			nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

		// если зона не указана, устанавливаем "1"
		if(!localStorage.getItem($p.job_prm.local_storage_prefix+"zone"))
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
		wsql.set_user_param("cache_md_date", 0);
		wsql.set_user_param("cache_cat_date", 0);
		wsql.set_user_param("reset_local_data", "");

		return new Promise(function(resolve, reject){

			if(typeof alasql !== "undefined"){
				if($p.job_prm.create_tables){
					if($p.job_prm.create_tables_sql)
						alasql($p.job_prm.create_tables_sql, [], function(){
							inited = 1000;
							delete $p.job_prm.create_tables_sql;
							resolve();
						});
					else
						$p.ajax.get($p.job_prm.create_tables)
							.then(function (req) {
								alasql(req.response, [], function(){
									inited = 1000;
									resolve();
								});
							});
				}else
					resolve();
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
				alasql("drop table IF EXISTS " + tname, [], ccallback);
		}

		function tmames_finded(data){
			tmames = data;
			if(cstep = data.length)
				iteration();
			else
				ccallback();
		}

		alasql("SHOW TABLES", [], tmames_finded);
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

	if(typeof alasql !== "undefined"){

		wsql.aladb = new alasql.Database('md');

	} else
		inited = 1000;
};

/**
 * Экземпляр интерфейса локальной базы данных
 * @property wsql
 * @for MetaEngine
 * @type WSQL
 * @static
 */
$p.wsql = new WSQL();

