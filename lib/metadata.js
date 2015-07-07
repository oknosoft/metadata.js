// This file was automatically generated from "dev.lmd.json"
(function (global, main, modules, modules_options, options) {
    var initialized_modules = {},
        global_eval = function (code) {
            return global.Function('return ' + code)();
        },
        
        global_document = global.document,
        local_undefined,
        /**
         * @param {String} moduleName module name or path to file
         * @param {*}      module module content
         *
         * @returns {*}
         */
        register_module = function (moduleName, module) {
            lmd_trigger('lmd-register:before-register', moduleName, module);
            // Predefine in case of recursive require
            var output = {'exports': {}};
            initialized_modules[moduleName] = 1;
            modules[moduleName] = output.exports;

            if (!module) {
                // if undefined - try to pick up module from globals (like jQuery)
                // or load modules from nodejs/worker environment
                module = lmd_trigger('js:request-environment-module', moduleName, module)[1] || global[moduleName];
            } else if (typeof module === 'function') {
                // Ex-Lazy LMD module or unpacked module ("pack": false)
                var module_require = lmd_trigger('lmd-register:decorate-require', moduleName, lmd_require)[1];

                // Make sure that sandboxed modules cant require
                if (modules_options[moduleName] &&
                    modules_options[moduleName].sandbox &&
                    typeof module_require === 'function') {

                    module_require = local_undefined;
                }

                module = module(module_require, output.exports, output) || output.exports;
            }

            module = lmd_trigger('lmd-register:after-register', moduleName, module)[1];
            return modules[moduleName] = module;
        },
        /**
         * List of All lmd Events
         *
         * @important Do not rename it!
         */
        lmd_events = {},
        /**
         * LMD event trigger function
         *
         * @important Do not rename it!
         */
        lmd_trigger = function (event, data, data2, data3) {
            var list = lmd_events[event],
                result;

            if (list) {
                for (var i = 0, c = list.length; i < c; i++) {
                    result = list[i](data, data2, data3) || result;
                    if (result) {
                        // enable decoration
                        data = result[0] || data;
                        data2 = result[1] || data2;
                        data3 = result[2] || data3;
                    }
                }
            }
            return result || [data, data2, data3];
        },
        /**
         * LMD event register function
         *
         * @important Do not rename it!
         */
        lmd_on = function (event, callback) {
            if (!lmd_events[event]) {
                lmd_events[event] = [];
            }
            lmd_events[event].push(callback);
        },
        /**
         * @param {String} moduleName module name or path to file
         *
         * @returns {*}
         */
        lmd_require = function (moduleName) {
            var module = modules[moduleName];

            var replacement = lmd_trigger('*:rewrite-shortcut', moduleName, module);
            if (replacement) {
                moduleName = replacement[0];
                module = replacement[1];
            }

            lmd_trigger('*:before-check', moduleName, module);
            // Already inited - return as is
            if (initialized_modules[moduleName] && module) {
                return module;
            }

            lmd_trigger('*:before-init', moduleName, module);

            // Lazy LMD module not a string
            if (typeof module === 'string' && module.indexOf('(function(') === 0) {
                module = global_eval(module);
            }

            return register_module(moduleName, module);
        },
        output = {'exports': {}},

        /**
         * Sandbox object for plugins
         *
         * @important Do not rename it!
         */
        sandbox = {
            'global': global,
            'modules': modules,
            'modules_options': modules_options,
            'options': options,

            'eval': global_eval,
            'register': register_module,
            'require': lmd_require,
            'initialized': initialized_modules,

            
            'document': global_document,
            
            

            'on': lmd_on,
            'trigger': lmd_trigger,
            'undefined': local_undefined
        };

    for (var moduleName in modules) {
        // reset module init flag in case of overwriting
        initialized_modules[moduleName] = 0;
    }



    main(lmd_trigger('lmd-register:decorate-require', 'main', lmd_require)[1], output.exports, output);
})/*DO NOT ADD ; !*/
(this,(function (require, exports, module) { /* wrapped by builder */
/**
 * Created by unpete on 30.04.2015.
 */

var $p = require("common");

}),{
"common": (function (require, exports, module) { /* wrapped by builder */
/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i> <br />&copy; http://www.oknosoft.ru 2009-2015
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 * @author	Evgeniy Malyarov
 */

/**
 * Класс глобального объекта фреймворка __Лёгкого клиента__
 * @class MetaEngine
 * @static
 */
function MetaEngine() {
	this.version = "0.9.191";
	this.toString = function(){
		return "Oknosoft data engine. v:" + this.version;
	};
}

/**
 * Для совместимости со старыми модулями, публикуем $p глобально<br />
 * Кроме этой переменной, metadata.js ничего не экспортирует
 * @property $p
 * @for window
 */
var $p = new MetaEngine();
if(window)
	window.$p = $p;


/**
 * Обёртка для подключения через AMD или CommonJS
 * https://github.com/umdjs/umd
 */
if (typeof define === 'function' && define.amd) {
	// Support AMD (e.g. require.js)
	define('$p', $p);
} else if (typeof module === 'object' && module) { // could be `null`
	// Support CommonJS module
	module.exports = $p;
}

/**
 * Синтаксический сахар для defineProperty
 * @method _define
 * @for Object
 */
Object.defineProperty(Object.prototype, "_define", {
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
 * @param Parent {function}
 */
Object.prototype._define("_extend", {
	value: function( Parent ) {
		var F = function() { };
		F.prototype = Parent.prototype;
		this.prototype = new F();
		this.prototype.constructor = this;
		this._define("superclass", {
			value: Parent.prototype,
			enumerable: false
		});
	},
	enumerable: false
});

/**
 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
 * @method mixin
 * @for Object
 * @param src {Object} - источник
 * @return {Object}
 */
Object.prototype._define("_mixin", {
	value: function( src ) {
		var tobj = {}; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа
		for(var f in src){
			// копируем в dst свойства src, кроме тех, которые унаследованы от Object
			if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
				this[f] = src[f];
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
 * @returns {*}
 */
Object.prototype._define("_clone", {
	value: function() {
		if(!this || "object" !== typeof this)
			return this;
		var p, v, c = "function" === typeof this.pop ? [] : {};
		for(p in this){
			if (this.hasOwnProperty(p)){
				v = this[p];
				if(v && "object" === typeof v)
					c[p] = v._clone();
				else
					c[p] = v;
			}
		}
		return c;
	},
	enumerable: false
});

/**
 * Загружает скрипты и стили синхронно и асинхронно
 * @method load_script
 * @for MetaEngine
 * @param src {String} - url ресурса
 * @param type {String} - "link" или "script"
 * @param [callback] {function} - функция обратного вызова после загрузки скрипта
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
 * Если браузер не поддерживает Promise, загружаем полифил
 */
if(typeof Promise !== "function")
	$p.load_script("https://www.promisejs.org/polyfills/promise-7.0.1.min.js", "script");

/**
 * Если контекст исполнения - браузер, загружаем таблицы стилей
 */
(function(w){
	var i, surl, sname, load_dhtmlx = true, load_meta = true;

	if("dhtmlx" in w){
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
		// стили загружаем только при необходимости
		for(i=0; i < document.styleSheets.length; i++){
			if(document.styleSheets[i].href){
				if(document.styleSheets[i].href.indexOf("dhtmlx.css")!=-1)
					load_dhtmlx = false;
				else if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
					load_meta = false;
			}
		}
		if(load_dhtmlx)
			$p.load_script(surl.replace(sname, "dhtmlx.css"), "link");
		if(load_meta)
			$p.load_script(surl.replace(sname, "metadata.css"), "link");

		// задаём путь к картинкам
		dhtmlx.image_path = surl.replace(sname, "imgs/");

		// задаём основной скин
		dhtmlx.skin = "dhx_web";

		// запрещаем добавлять dhxr+date() к запросам get внутри dhtmlx
		dhx4.ajax.cache = true;
	}
})(window || {});



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
 * @property ajax
 * @for MetaEngine
 * @type Ajax
 * @static
 */
$p.ajax = new (

	/**
	 * Наша promise-реализация ajax
	 * @class Ajax
	 * @static
	 */
	function Ajax() {

		function _call(method, url, postData, auth, beforeSend) {

			// Возвращаем новое Обещание.
			return new Promise(function(resolve, reject) {

				// Делаем привычные XHR вещи
				var req = new XMLHttpRequest();

				if(auth){
					var username, password;
					if(typeof auth == "object" && auth.username && auth.hasOwnProperty("password")){
						username = auth.username;
						password = auth.password;
					}else{
						username = $p.ajax.username;
						password = $p.ajax.password;
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

				if (method == "POST") {
					if(!this.hide_headers){
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
			return _call("GET", url);
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
			return _call("POST", url, postData);
		};

		/**
		 * Выполняет асинхронный get запрос с авторизацией и возможностью установить заголовки http
		 * @method get_ex
		 * @param url {String}
		 * @param auth {Boolean}
		 * @param beforeSend {function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.get_ex = function(url, auth, beforeSend){
			return _call("GET", url, null, auth, beforeSend);

		};

		/**
		 * Выполняет асинхронный post запрос с авторизацией и возможностью установить заголовки http
		 * @method post_ex
		 * @param url {String}
		 * @param postData {String} - данные для отправки на сервер
		 * @param auth {Boolean}
		 * @param beforeSend {function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.post_ex = function(url, postData, auth, beforeSend){
			return _call("POST", url, postData, auth, beforeSend);
		};

		/**
		 * Выполняет асинхронный put запрос с авторизацией и возможностью установить заголовки http
		 * @method put_ex
		 * @param url {String}
		 * @param putData {String} - данные для отправки на сервер
		 * @param auth {Boolean}
		 * @param beforeSend {function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.put_ex = function(url, putData, auth, beforeSend){
			return _call("PUT", url, putData, auth, beforeSend);
		};

		/**
		 * Выполняет асинхронный delete запрос с авторизацией и возможностью установить заголовки http
		 * @method delete_ex
		 * @param url {String}
		 * @param auth {Boolean}
		 * @param beforeSend {function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.delete_ex = function(url, auth, beforeSend){
			return _call("DELETE", url, null, auth, beforeSend);

		};

		/**
		 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
		 * @method get_and_show_blob
		 * @param url {String} - адрес, по которому будет произведен запрос
		 * @param post_data {Object|String} - данные запроса
		 * @param callback {function}
		 * @async
		 */
		this.get_and_show_blob = function(url, post_data){

			var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
				wnd_print;

			return this.post_ex(url,
				typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function(xhr){
					xhr.responseType = "blob";
				})
				.then(function(req){
					url = window.URL.createObjectURL(req.response);
					wnd_print = window.open(url, "wnd_print", params);
					wnd_print.onload = function(e) {
						window.URL.revokeObjectURL(url);
					};
					return wnd_print;
				});
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
	 * @return {any}
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
 * @param v {String} - проверяемое значение
 * @return {boolean} - true, если значение соответствует регурярному выражению guid
 */
$p.is_guid = function(v){
	if(typeof v !== "string" || v.length < 36)
		return false;
	else if(v.length > 36)
		v = v.substr(0, 36);
	return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
};

$p.is_empty_guid = function (v) {
	return !v || v === $p.blank.guid;
};

/**
 * Генерирует новый guid
 * @method generate_guid
 * @return {string}
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
 * @param str {any} - приводиме значение
 * @param [strict=false] {boolean} - если истина и значение не приводится к дате, возвращать пустую дату
 * @return {Date|any}
 */
$p.fix_date = function(str, strict){
	var dfmt = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/, d;
	if(str && typeof str == "string" && dfmt.test(str.substr(0,10))){
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
	if (evt.stopPropagation)
		evt.stopPropagation();
	if (!evt.cancelBubble)
		evt.cancelBubble = true;
	return false
};

/**
 * Масштабирует svg
 * @param svg_current {String} - исходная строка svg
 * @param size {Number} - требуемый размер картинки
 * @param padding {Number} - отступ от границы viewBox
 * @return {String}
 */
$p.scale_svg = function(svg_current, size, padding){
	var j, k, svg_head, svg_body, head_ind, viewBox, svg_j = {};

	head_ind = svg_current.indexOf(">");
	svg_head = svg_current.substring(5, head_ind).split(' ');
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
	viewBox = 'viewBox="0 0 ' + (svg_j["width"] - padding) + ' ' + (svg_j["height"] - padding) + '"';
	k = size / (svg_j["height"] - padding);
	svg_j["height"] = size;
	svg_j["width"] = Math.round(svg_j["width"] * k);

	return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="' +
		svg_j["width"] + '" height="' + svg_j["height"] + '" xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
};

/**
 * Заменяет в строке критичные для xml символы
 * @method normalize_xml
 * @param str {string} - исходная строка, в которой надо замаскировать символы
 * @return {XML|string}
 */
$p.normalize_xml = function(str){
	if(!str) return "";
	var entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
	return str.replace(	/[&"'<>]/g, function (s) {return entities[s];});
};

/**
 * Добавляет в форму функциональность вызова справки
 * @param wnd {dhtmlXWindowsCell}
 * @param [path] {String} - url справки
 */
$p.bind_help = function (wnd, path) {

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

	if(wnd instanceof dhtmlXLayoutCell) {
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
 * Возвращает координату элемента
 * @param elm {HTMLElement}
 */
$p.get_offset = function(elm) {
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
 * Сообщения пользователю и строки нитернационализации
 * @property msg
 * @type Messages
 * @static
 */
$p.msg = new function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};

	/**
	 * расширяем мессанджер
	 */
	if("dhtmlx" in (window || {})){

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
};

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

		if(!$p.iface.before_route || $p.iface.before_route(event)!==false){

			if($p.ajax.authorized){

				var hprm = $p.job_prm.parse_url(), mgr;

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
 * @type InterfaceObjs
 * @static
 */
$p.iface = new InterfaceObjs();

/**
 * Обработчики событий приложения
 * Подробнее см. класс {{#crossLink "AppEvents"}}{{/crossLink}} и модуль {{#crossLinkModule "events"}}{{/crossLinkModule}}
 * @property eve
 * @for MetaEngine
 * @type AppEvents
 * @static
 */
$p.eve = new (
	/**
	 * Обработчики событий:
	 * - при запуске программы
	 * - при авторизации и начальной синхронизации с сервером
	 * - при периодических обменах изменениями с сервером
	 * См. так же модуль {{#crossLinkModule "events"}}{{/crossLinkModule}}
	 * @class AppEvents
	 * @static
	 */
	function AppEvents(){

		this.toString = function(){return "События при начале работы программы"};

		// Модули при загрузке могут добавлять в этот массив свои функции, которые будут выполнены после готовности документа
		this.onload = [];
	}
);

/**
 * Модификаторы менеджеров объектов метаданных {{#crossLink "Modifiers"}}{{/crossLink}}
 * @property modifiers
 * @for MetaEngine
 * @type {Modifiers}
 * @static
 */
$p.modifiers = new (
	/**
	 * Модификаторы менеджеров объектов метаданных<br />
	 * Служебный объект, реализующий отложенную загрузку модулей, в которых доопределяется (переопределяется) поведение
	 * объектов и менеджеров конкретных типов
	 * Т.к. экземпляры менеджеров и конструкторы объектов доступны в системе только посл загрузки метаданных,
	 * а метаданные загружаются после авторизации на сервере, методы модификаторов нельзя выполнить при старте приложения
	 * @class Modifiers
	 * @static
	 */
	function Modifiers(){

		var methods = [];

		/**
		 * Добавляет метод в коллекцию методов для отложенного вызова
		 * @method push
		 * @param method {function} - функция, которая будет вызвана после инициализации менеджеров объектов данных
		 */
		this.push = function (method) {
			methods.push(method);
		};

		/**
		 * Загружает и выполняет методы модификаторов
		 * @method execute
		 */
		this.execute = function () {
			methods.forEach(function (method) {
				if(typeof method === "function")
					method($p);
				else
					require(method)($p);
			});
		}

	}
);

/**
 * Хранит глобальные настройки варианта компиляции (Заказ дилера, Безбумажка, Демо и т.д.)
 * Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
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

	this.hs_url = function () {
		var url = this.hs_path || "/a/zd/%1/hs/upzp",
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	this.rest_url = function () {
		var url = this.rest_path || "/a/zd/%1/odata/standard.odata/",
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	this.unf_url = function () {
		return "/a/unf/%1/odata/standard.odata/".replace("%1", $p.wsql.get_user_param("zone_unf", "number"));
	}

}


/**
 * Интерфейс локальной базы данных
 * @property wsql
 * @for MetaEngine
 * @type WSQL
 * @static
 */
$p.wsql = (
	/**
	 * Интерфейс локальной базы данных
	 * @class WSQL
	 * @static
	 */
	function WSQL(){}
);
(function (wsql) {

	var user_params = {},
		inited = 0;

	if(window.alasql)
		wsql.aladb = new alasql.Database('md');
	else
		inited = 1000;


	function fetch_type(prm, type){
		if(type == "object")
			return prm ? $p.fix_guid(JSON.parse(prm)) : {};
		else if(type == "number")
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
	 * @for WSQL
	 * @param sql {String} - текст запроса
	 * @param prm {Array} - массив с параметрами для передачи в запрос
	 * @param [callback] {function} - функция обратного вызова. если не укзана, запрос выполняется "как бы синхронно"
	 * @param [tag] {any} - произвольные данные для передачи в callback
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
	 * @return {Promise.<T>}
	 */
	wsql.promise = function(sql, params) {
		return new Promise(function(resolve, reject){
			alasql(sql, params, function(data, err) {
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
	 * @for WSQL
	 * @param prm_name {string} - имя параметра
	 * @param prm_value {string|number|object|boolean} - значение
	 * @param [callback] {function} - вызывается после установки параметра
	 */
	wsql.set_user_param = function(prm_name, prm_value, callback){

		var str_prm = prm_value;
		if(typeof prm_value == "object")
			str_prm = JSON.stringify(prm_value);

		else if(prm_value === false)
			str_prm = "";

		if(window && window.localStorage)
			localStorage.setItem(prm_name, str_prm);
		user_params[prm_name] = prm_value;

		if(callback)
			callback([]);
	};

	/**
	 * Возвращает значение сохраненного параметра
	 * @method get_user_param
	 * @param prm_name {String} - имя параметра
	 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
	 * @return {*} - значение параметра
	 */
	wsql.get_user_param = function(prm_name, type){

		if(!user_params.hasOwnProperty(prm_name) && localStorage)
			user_params[prm_name] = fetch_type(localStorage.getItem(prm_name), type);

		return user_params[prm_name];
	};

	wsql.save_options = function(prefix, options){
		wsql.set_user_param(prefix + "_" + options.name, options);
	};

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
	 * @param [callback] {function} - вызывается после создания и заполнения значениями по умолчанию таблицы параметров
	 * @async
	 */
	wsql.init_params = function(callback){

		var nesessery_params = [
			{p: "user_name",		v: "", t:"string"},
			{p: "user_pwd",			v: "", t:"string"},
			{p: "browser_uid",		v: $p.generate_guid(), t:"string"},
			{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t:"number"},
			{p: "zone_unf",         v: 1, t:"number"},
			{p: "phantom_url",		v: "/p/", t:"string"},
			{p: "enable_save_pwd",	v: "",	t:"boolean"},
			{p: "reset_local_data",	v: "",	t:"boolean"},
			{p: "autologin",		v: "",	t:"boolean"},
			{p: "cache_md_date",	v: 0,	t:"number"},
			{p: "cache_cat_date",	v: 0,	t:"number"},
			{p: "files_date",       v: 201506140000,	t:"number"},
			{p: "margin",			v: 60,	t:"number"},
			{p: "discount",			v: 15,	t:"number"},
			{p: "offline",			v: "" || $p.job_prm.offline, t:"boolean"}
		], zone;

		// подмешиваем к базовым параметрам настройки приложения
		if($p.job_prm.additionsl_params)
			nesessery_params = nesessery_params.concat($p.job_prm.additionsl_params);

		// дополняем хранилище недостающими параметрами
		nesessery_params.forEach(function(o){
			if(wsql.get_user_param(o.p, o.t) == undefined ||
					(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1 || o.p.indexOf("zone") != -1)))
				wsql.set_user_param(o.p, o.v);
		});

		// сбрасываем даты, т.к. база в озу
		wsql.set_user_param("cache_md_date", 0);
		wsql.set_user_param("cache_cat_date", 0);
		wsql.set_user_param("reset_local_data", "");

		// если зона указана в url, используем её
		if($p.job_prm.url_prm.hasOwnProperty("zone")){
			zone = $p.fix_number($p.job_prm.url_prm.zone, true);

		// если зона была указана по-старому в hs_url, используем её
		}else if((zone = localStorage.getItem("hs_url")) && (zone = zone.match(/\/[0-9]+\//))){
			zone = $p.fix_number(zone[0].replace("/", "").replace("/", ""));

		// если зона не указана, устанавливаем "1"
		}else if(!localStorage.getItem("zone"))
			zone = 1;

		if(zone){
			wsql.set_user_param("zone", zone);
			localStorage.removeItem("hs_url");
			localStorage.removeItem("ws_url");
			localStorage.removeItem("rest_url");
			localStorage.removeItem("unf_url");
		}

		if(window.alasql){
			if($p.job_prm.create_tables){
				if($p.job_prm.create_tables_sql)
					alasql($p.job_prm.create_tables_sql, [], function(){
						inited = 1000;
						delete $p.job_prm.create_tables_sql;
						callback([]);
					});
				else
					$p.ajax.get($p.job_prm.create_tables)
						.then(function (req) {
							alasql(req.response, [], function(){
								inited = 1000;
								callback([]);
							});
						});
			}else
				callback([]);
		}else
			callback([]);

	};

	/**
	 * Удаляет таблицы WSQL. Например, для последующего пересоздания при изменении структуры данных
	 * @method drop_tables
	 * @param callback {function}
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

	wsql.dump = function(callback){
		var cstep = 0, tmames = [], create = "", insert = "";

		function tmames_finded(data){
			data.forEach(function (tname) {
				create += alasql("show create table " + tname["tableid"]) + ";\n";
			});

			console.log(create);
			setTimeout(callback, 10);
		}

		$p.wsql.exec("SHOW TABLES", [], tmames_finded);
	}

	wsql.toString = function(){return "JavaScript SQL engine"};

})($p.wsql);


/* joined by builder */
/**
 * Строковые константы интернационализации
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

if("dhx4" in (window || {})){
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
msg.srv_overload = "Сервер перегружен";
msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
msg.long_operation = "Длительная операция";
msg.sync_script = "Обновление скриптов приложения:";
msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
msg.sync_break = "Прервать синхронизацию";
msg.unsupported_browser_title = "Браузер не поддерживается";
msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
msg.unsupported_mode_title = "Режим не поддерживается";
msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
msg.unknown_error = "Неизвестная ошибка в функции '%1'";



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

/* joined by builder */
/**
 * Расширение типов ячеек dhtmlXGrid
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 *
 * Экспортирует конструкторы:
 * * **eXcell_ref** - поля ввода значений ссылочных типов
 * * **eXcell_refc** - комбобокс ссылочных типов (перечисления и короткие справочники)
 *
 * @module  wdg_dhtmlx
 * @requires common
 */

/**
 * Обработчик клавиш {tab}, {enter} и {F4} в поле ввода
 */
function input_keydown(e, t){
	if(e.keyCode == 8 || e.keyCode == 46){
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source);
	}else if(e.keyCode == 9 || e.keyCode == 13)
		t.grid.editStop();	// по {tab} и {enter} заканчиваем редактирование
	else if(e.keyCode == 115)
		t.cell.firstChild.childNodes[1].onclick(e);			// по {F4} открываем редактор
	return $p.cancel_bubble(e);
}

var eXcell_proto = new eXcell();


/**
 * Конструктор поля ввода значений ссылочных типов для грида
 * @param cell
 */
function eXcell_ref(cell){

	if (!cell) return;

	var t = this, td,

		ti_keydown=function(e){
			return input_keydown(e, t);
		},

		open_selection=function(e) {

			var fmd, rt, at, cl, acl, sval,
				attr = {
					initial_value: t.val.ref,
					parent: null,
					owner: null};

			t.mgr = null;

			if(t.source.slist)
				t.source.slist.call(t);

			else if(t.source.tabular_section){
				fmd = t.source.row._metadata.fields[t.source.col];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
				if(t.mgr){
					if(t.source["choice_links"] && t.source["choice_links"][t.source.tabular_section + "_" + t.source.col])
						acl = t.source["choice_links"][t.source.tabular_section + "_" + t.source.col];
					else
						acl = fmd["choice_links"];
					if(acl){
						for(var icl in acl){
							if((cl = acl[icl]).name[1] == "owner")
								attr.owner = cl.path.length == 2 ? t.source.row[cl.path[1]].ref : t.source.o[cl.path[0]].ref;
						}
					}
					t.mgr.form_selection(t.source, attr);
				}

			}else{
				if(t.fpath.length < 2){
					fmd = t.source.o._manager.metadata(t.fpath[0]);
					t.mgr = _md.value_mgr(t.source.o, t.fpath[0], fmd.type);

					if(t.source["choice_links"] && t.source["choice_links"][t.fpath[0]])
						acl = t.source["choice_links"][t.fpath[0]];
					else
						acl = fmd["choice_links"];
					if(t.source["choice_params"] && t.source["choice_params"][t.fpath[0]])
						for(var icl in t.source["choice_params"][t.fpath[0]]){
							if(!attr.selection)
								attr.selection = [];
							attr.selection.push(t.source["choice_params"][t.fpath[0]][icl]);
						}
				}else{
					fmd = t.source.o._metadata["tabular_sections"][t.fpath[0]].fields[t.fpath[1]];
					t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
				}

				if(t.mgr){
					if(acl){
						for(var icl in acl){
							if((cl = acl[icl]).path.length == 1)
								sval = t.source.o[cl.path[0]].ref;
							else{
								// TODO: связь по подчиненному реквизиту. надо разыменовать ссылку поля
								// !!! пока не неализовано
								sval = t.source.o[cl.path[0]].ref;
							}
							if(cl.name[1] == "owner")
								attr.owner = sval ;
							else if(cl.name[0] == "selection"){
								if(!attr.selection)
									attr.selection = [];
								var selection = {};
								selection[cl.name[1]] = sval;
								attr.selection.push(selection);
							}
						}
					}
					t.mgr.form_selection(t.source, attr);
				}
			}

			return $p.cancel_bubble(e);
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;
	t.open_selection = open_selection;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : val);
	};

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			if(t.source.tabular_section){
				t.source.row = t.source.o[t.source.tabular_section].get(t.cell.parentNode.idd-1);
				t.source.col = t.source.fields[t.cell.cellIndex];
				t.source.cell = t;
				return t.source.row[t.source.col];
			}else{
				t.fpath = t.grid.getSelectedRowId().split("|");
				if(t.fpath.length < 2) return t.source.o[t.fpath[0]];
				else {
					var vr = t.source.o[t.fpath[0]].find(t.fpath[1]);
					if(vr) return (vr["value"] || vr["Значение"]);
				}
			}
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){
		var ti;
		t.val = t.getValue();		//save current value
		if(t.source.tabular_section){
			t.cell.innerHTML = '<div class="ref_div23"><input type="text" class="dhx_combo_edit" style="height: 22px;"><div class="ref_field23">&nbsp;</div></div>';
		}else{
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';
		}

		td = t.cell.firstChild;
		ti = td.childNodes[0];
		ti.value=t.val ? t.val.presentation : '';
		ti.onclick=$p.cancel_bubble;		//blocks onclick event
		ti.readOnly = true;
		ti.focus();
		ti.onkeydown=ti_keydown;
		td.childNodes[1].onclick=open_selection;
	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.cell.firstChild)
			t.setValue(t.cell.firstChild.childNodes[0].value);	//sets the new value
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}
}
eXcell_ref.prototype = eXcell_proto;
window.eXcell_ref = eXcell_ref;

/**
 * Конструктор комбобокса кешируемых ссылочных типов для грида
 */
function eXcell_refc(cell){

	if (!cell) return;

	var t = this,
		slist=function() {
			t.mgr = null;
			var fmd, rt, at, res = [{value:"1", text:"One"}];

			if(t.source.slist)
				return t.source.slist.call(t);

			else if(t.source.tabular_section){
				fmd = t.source.row._metadata.fields[t.source.col];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);

			}else if(t.fpath.length < 2){
				fmd = t.source.o._manager.metadata(t.fpath[0]);
				t.mgr = _md.value_mgr(t.source.o, t.fpath[0], fmd.type);

			}else if(t.fpath[0] == "extra_fields" || t.fpath[0] == "params"){
				return _cch.properties.slist(t.fpath[1]);

			} else{
				fmd = t.source.o._metadata["tabular_sections"][t.fpath[0]].fields[t.fpath[1]];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
			}

			// если менеджер найден, получаем список у него
			if(t.mgr)
				res = t.mgr.get_option_list(t.val);

			return res;
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : val);
	};

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			if(t.source.tabular_section){
				t.source.row = t.source.o[t.source.tabular_section].get(t.cell.parentNode.idd-1);
				t.source.col = t.source.fields[t.cell.cellIndex];
				t.source.cell = t;
				return t.source.row[t.source.col];
			}else{
				t.fpath = t.grid.getSelectedRowId().split("|");
				if(t.fpath.length < 2)
					return t.source.o[t.fpath[0]];
				else {
					var collection = t.source.o[t.fpath[0]],
						vr = collection.find ? collection.find(t.fpath[1]) : $p._find(collection, t.fpath[1]);
					if(vr)
						return (vr["value"] || vr["Значение"]);
				}
			}
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){

		if(t.combo) return;

		t.val = t.getValue();		//save current value
		t.cell.innerHTML = "";
		t.combo = new dhtmlXCombo({
			parent: t.cell,
			items: slist()
		});

		t.combo.DOMelem.style.border = "none";
		t.combo.DOMelem.style.height = "21px";
		t.combo.DOMelem.style.width = (t.cell.offsetWidth - 8) + "px";
		t.combo.DOMelem_input.style.fontSize = "11px";
		t.combo.DOMelem_input.style.margin = 0;
		t.combo.DOMlist.style.fontSize = "11px";

		t.combo.setFocus();
		t.combo.setComboValue(t.val.ref);
		t.combo.readonly(true, true);
		t.combo.openSelect();
		t.combo.attachEvent("onChange", function(){
			if(t.source.on_select){
				var sval = (t.mgr || $p.cat["property_values"]).get(t.combo.getSelectedValue(), false);
				setTimeout( function(){t.source.on_select(sval); }, 0 );
			}
		});

	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.combo)
			t.setValue(t.combo.getComboText());
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}

}
eXcell_refc.prototype = eXcell_proto;
window.eXcell_refc = eXcell_refc;



function data_to_grid(data, attr){

	function cat_picture_class(r){
		var res;
		if(r.is_folder)
			res = "cell_ref_folder";
		else
			res = "cell_ref_elm";
		if(r.deleted)
			res = res + "_deleted";
		return res ;
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", data.length).replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr),
		fname;

	// при первом обращении к методу добавляем описание колонок
	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + r[caption.acols[0].id] + "</cell>";
		for(var col=1; col < caption.acols.length; col++ ){
			fname = caption.acols[col].id;
			xml += "<cell>" + ((fname == "svg" ? $p.normalize_xml(r[fname]) : r[fname]) || "") + "</cell>";
		}
		xml += "</row>";
	});

	return xml + "</rows>";
}



/* joined by builder */
/**
 * Ячейка грида для отображения картинки svg и компонент,
 * получающий и отображающий галерею эскизов объекта данных
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wdg_rsvg
 * @requires common
 */

/**
 * Конструктор поля картинки svg
 */
function eXcell_rsvg(cell){ //the eXcell name is defined here
	if (cell){                // the default pattern, just copy it
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function(){};  //read-only cell doesn't have edit method
	this.isDisabled = function(){ return true; }; // the cell is read-only, so it's always in the disabled state
	this.setValue=function(val){
		this.setCValue(val ? $p.scale_svg(val, 120, 10) : "нет эскиза");
	}
}
eXcell_rsvg.prototype = eXcell_proto;
window.eXcell_rsvg = eXcell_rsvg;

/**
 * Компонент Svgs, получающий и отображающий галерею эскизов объекта данных
 * @class Svgs
 * @param manager {DataManager}
 * @param layout {dhtmlXLayoutObject|dhtmlXWindowsCell}
 * @param area {HTMLElement}
 * @constructor
 */
$p.iface.Svgs = function (manager, layout, area) {

	var t = this,
		minmax = document.createElement('div'),
		pics_area = document.createElement('div'),
		stack = [],
		area_hidden = $p.wsql.get_user_param("svgs_area_hidden", "boolean"),
		area_text = area.querySelector(".dhx_cell_statusbar_text");

	if(area_text)
		area_text.style.display = "none";

	pics_area.className = 'svgs-area';
	if(area.firstChild)
		area.insertBefore(pics_area, area.firstChild);
	else
		area.appendChild(pics_area);

	minmax.className = 'svgs-minmax';
	minmax.title="Скрыть/показать панель эскизов";
	minmax.onclick = function () {
		area_hidden = !area_hidden;
		$p.wsql.set_user_param("svgs_area_hidden", area_hidden);
		apply_area_hidden();

		if(!area_hidden && stack.length)
			t.reload();

	};
	area.appendChild(minmax);
	apply_area_hidden();

	function apply_area_hidden(){

		pics_area.style.display = area_hidden ? "none" : "";

		if(layout.setSizes)
			layout.setSizes();
		else{
			var dim = layout.getDimension();
			layout.setDimension(dim[0], dim[1]);
			layout.maximize();
		}

		if(area_hidden){
			minmax.style.backgroundPositionX = "-32px";
			minmax.style.top = layout.setSizes ? "16px" : "-18px";
		}
		else{
			minmax.style.backgroundPositionX = "0px";
			minmax.style.top = "0px";
		}
	}

	function drow_svgs(res){

		var i, j, k, svg_elm;

		$p.iface.clear_svgs(pics_area);

		if(!res.svgs.length){
			// возможно, стоит показать надпись, что нет эскизов
		}else
			for(i in res.svgs){
				if(!res.svgs[i] || res.svgs[i].substr(0, 1) != "<")
					continue;
				svg_elm = document.createElement("div");
				pics_area.appendChild(svg_elm);
				svg_elm.style["float"] = "left";
				svg_elm.innerHTML = $p.scale_svg(res.svgs[i], 88, 22);
			}
	}

	this.reload = function (ref) {

		if(ref)
			stack.push(ref);

		if(!area_hidden)
			setTimeout(function(){
				if(stack.length){
					manager.save({
						ref: stack.pop(),
						specify: "order_pics",
						action: "calc",
						async: true
					})
						.then(drow_svgs)
						.catch(function (err) {
							console.log(err);
						});
					stack.length = 0;
				}
			}, 300);
	}

}
/* joined by builder */
/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wdg_filter
 * @requires common
 */

/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * @param attr {Object} - параметры создаваемого виджета
 * @param attr.manager {DataManager}
 * @param attr.toolbar {dhtmlXToolbarObject}
 * @param attr.[pos=7] {Number} - номер элемента на тулбаре, после которого вставлять виджет
 * @constructor
 */
$p.iface.Toolbar_filter = function (attr) {

	var t = this,
		input_filter_width = 350,
		input_filter_changed = 0;

	if(!attr.pos)
		attr.pos = 6;

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.period){

		// управляем доступностью дат в миникалендаре
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		function onchange(){

			if(input_filter_changed){
				clearTimeout(input_filter_changed);
				input_filter_changed = 0;
			}

			attr.onchange.call(t, t.get_filter());
		}

		function onkeydown(){

			if(input_filter_changed)
				clearTimeout(input_filter_changed);

			input_filter_changed = setTimeout(function () {
				if(input_filter_changed)
					onchange();
			}, 600);
		}

		input_filter_width = 180;

		attr.toolbar.addText("lbl_date_from", attr.pos, "Период с:");
		attr.pos++;
		attr.toolbar.addInput("input_date_from", attr.pos, "", 72);
		attr.pos++;
		attr.toolbar.addText("lbl_date_till", attr.pos, "по:");
		attr.pos++;
		attr.toolbar.addInput("input_date_till", attr.pos, "", 72);
		attr.pos++;

		t.input_date_from = attr.toolbar.getInput("input_date_from");
		t.input_date_from.setAttribute("readOnly", "true");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = attr.toolbar.getInput("input_date_till");
		t.input_date_till.setAttribute("readOnly", "true");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		// подключаем календарь к инпутам
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", onchange);

		// начальные значения периода
		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.dateFormat(attr.date_from, $p.dateFormat.masks.short_ru);
		t.input_date_till.value=$p.dateFormat(attr.date_till, $p.dateFormat.masks.short_ru);

	}

	// текстовое поле фильтра по подстроке
	if(!attr.hide_filter){
		attr.toolbar.addText("lbl_filter", attr.pos, "Фильтр");
		attr.pos++;
		attr.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = attr.toolbar.getInput("input_filter");
		t.input_filter.onchange = onchange;
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";

		attr.toolbar.addSpacer("input_filter");

	}else
		attr.toolbar.addSpacer("input_date_till");

	t.get_filter = function () {
		return {
			date_from: t.input_date_from ? dhx4.str2date(t.input_date_from.value) : "",
			date_till: t.input_date_till ? dhx4.str2date(t.input_date_till.value) : "",
			filter: t.input_filter ? t.input_filter.value : ""
		}
	}


};

/* joined by builder */
/**
 * Форма dat.GUI - визуализация и изменение параметров объекта<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module common
 * @submodule wnd_dat
 */

$p.iface.dat_gui = function(_dxw, attr) {

	dat.GUI.DEFAULT_WIDTH = '100%';

	var wnd_dat = $p.iface.dat_blank(_dxw, attr),
		gui = new dat.GUI({ autoPlace: false }),
		_updating = false;
	_dxw = null;

	wnd_dat.attachObject(gui.domElement);
	wnd_dat.setMinDimension(240, 280);

	gui.domElement.removeChild(gui.__closeButton);
	delete gui.__closeButton;

	if(attr.parked)
		wnd_dat.park();

	gui.wnd = wnd_dat;

	gui.clear = function(){

		function removeFolder(folder){

			for(var f in folder.__folders){
				removeFolder(folder.__folders[f]);
				delete folder.__folders[f];
			}

			while(folder.__controllers.length)
				folder.__controllers[0].remove();
			folder.__ul.parentNode.removeChild(folder.__ul);
		}

		for(var f in gui.__folders){
			removeFolder(gui.__folders[f]);
			delete gui.__folders[f];
		}

		while(gui.__controllers.length)
			gui.__controllers[0].remove();
	};

	gui.update = function() {
		for(var f in gui.__folders){
			gui.__folders[f].__controllers.forEach(function(c){
				c.updateDisplay();
			});
		}
		gui.__controllers.forEach(function(c){
			c.updateDisplay();
		});
		if(gui.after_update)
			gui.after_update();

		_updating = false;
	};

	gui.lazy_update = function() {
		if(!_updating){
			_updating = true;
			setTimeout(gui.update, 10);
		}
	};

	gui.first_obj = function (instance) {
		var c;
		for(var f in gui.__folders){
			for(var i in gui.__folders[f].__controllers){
				c = gui.__folders[f].__controllers[i];
				if(c.object instanceof instance){
					return c.object;
				}
			}
		}
		for(var i in gui.__controllers){
			c = gui.__controllers[i];
			if(c.object instanceof instance){
				return c.object;
			}
		}
	};

	gui.close = function () {
		gui.clear();
		wnd_dat.close();
		wnd_dat = null;
		gui = null;
	};

	gui.wnd_options = wnd_dat.wnd_options;

	return gui;
};

/**
 * Форма dat - шаблон окна инструментов
 */
$p.iface.dat_blank = function(_dxw, attr) {

	if(!attr)
		attr = {};

	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: attr.id || 'wnd_dat_' + dhx4.newId(),
		left: attr.left || 900,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});
	_dxw = null;

	if(!attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {};
	wnd_dat.modified = false;

	wnd_dat.wnd_options = function (options) {
		var pos = wnd_dat.getPosition(),
			sizes = wnd_dat.getDimension(),
			parked = wnd_dat.isParked();
		options.left = pos[0];
		options.top = pos[1];
		options.width = sizes[0];
		options.parked = parked;
		if(!parked)
			options.height = sizes[1];

	};

	wnd_dat.bottom_toolbar = function(oattr){

		var attr = ({
				wrapper: wnd_dat.cell,
				width: '100%',
				height: '28px',
				bottom: '0px',
				left: '0px',
				name: 'tb_bottom',
				buttons: [
					{name: 'btn_cancel', text: 'Отмена', title: 'Закрыть без сохранения', width:'60px', float: 'right'},
					{name: 'btn_ok', b: 'Ок', title: 'Применить изменения', width:'30px', float: 'right'}
				],
				onclick: function (name) {
					return false;
				}
			})._mixin(oattr),

			tb_bottom = new OTooolBar(attr),
			sbar = wnd_dat.attachStatusBar({height: 12});
		sbar.style.zIndex = -1000;
		sbar.firstChild.style.backgroundColor = "transparent";
		sbar.firstChild.style.border = "none";
		return tb_bottom;
	};

	if(attr.modal){
		if(attr.pwnd && attr.pwnd.setModal)
			attr.pwnd.setModal(0);
		wnd_dat.setModal(1);
	}

	return wnd_dat;
};

/**
 * Форма dat.tree - дерево с галочками
 */
$p.iface.dat_tree = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr),
		layout = document.createElement("div"),
		cell_a = document.createElement("div"),
		cell_b = document.createElement("div"),
		str_form = [
			{ type:"combo" , name:"cb_sys", label:"Система"  },
			{ type:"combo" , name:"cb_clr", label:"Цвет"  },
			{ type:"settings" , labelWidth:50, inputWidth:160, offsetLeft: 0, offsetTop: 0  }
		];

	_dxw = null;

	wnd_dat.setMinDimension(250, 300);
	wnd_dat.attachObject(layout);
	layout.appendChild(cell_a);
	layout.appendChild(cell_b);
	wnd_dat.cell_a = cell_a;

	wnd_dat.tree = new dhtmlXTreeObject(cell_b, "100%", "100%", 0);
	wnd_dat.tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	wnd_dat.tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	wnd_dat.tree.enableCheckBoxes(true, true);
	wnd_dat.tree.enableTreeImages(false);

	return wnd_dat;
};

/**
 * Форма dat.pgrid - таблица свойств
 */
$p.iface.dat_pgrid = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr);

	_dxw = null;

	wnd_dat.setMinDimension(320, 300);

	var pgrid = wnd_dat.elmnts.pgrid = wnd_dat.attachPropertyGrid();
	pgrid.setDateFormat("%d.%m.%Y %H:%i");
	pgrid.init();
	if(attr.grid_struct)
		pgrid.loadXMLString(
			attr.o._manager.get_property_grid_xml(attr.grid_struct, attr.v), function(){
				pgrid.enableAutoHeight(false);
				pgrid.setSizes();
				pgrid.setUserData("", "source",	{
					o: attr.v,
					grid: pgrid,
					on_select: $p.iface.pgrid_on_select,
					slist: attr.grid_slist,
					grid_on_change: attr.grid_on_change,
					wnd: wnd_dat
				});
				pgrid.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
				pgrid.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
			});

	return wnd_dat;
};

/**
 * обработчик выбора значения в свойствах (ссылочные типы)
 * вызывается в контексте this = pgrid
 * @param selv {*} выбранное значение
 */
$p.iface.pgrid_on_select = function(selv){

	if(selv===undefined)
		return;

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source"),
		f = pgrid.getSelectedRowId();

	if(source.o[f] != undefined){
		if(typeof source.o[f] == "number")
			source.o[f] = $p.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.is_data_obj(selv) ? selv.presentation : selv || "");

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change.call(pgrid, f, selv);
};

/**
 * обработчик изменения значения в свойствах (примитивные типы)
 * @param pname {String} - имя измененного свойства
 * @param new_value {*} - новое значение
 * @param old_value {*} - предыдущее значение
 */
$p.iface.pgrid_on_change = function(pname, new_value, old_value){
	if(pname)
		$p.iface.pgrid_on_select.call(this, new_value);
};

/**
 * обработчик изменения флажка в свойствах (bit)
 * @param rId {String} - идентификатор строки
 * @param cInd {Number} - идентификатор колонки
 * @param state {Boolean} - состояние чекбокса
 */
$p.iface.pgrid_on_checkbox = function(rId, cInd, state){

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source")

	if(source.o[rId] != undefined)
		source.o[rId] = state;

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};

/**
 * Рисует стандартную раскладку (XLayout) с деревом в левой части
 * @method layout_2u
 * @for InterfaceObjs
 * @param [tree_attr] {String} - путь к файлу структуры дерева
 * @return {Object} - Псевдопромис
 */
$p.iface.layout_2u = function (tree_attr) {

	var iface = $p.iface;

	iface.main = new dhtmlXLayoutObject({
		parent: document.body,
		pattern: "2U"
	});
	iface.main.attachEvent("onCollapse", function(name){
		if(name=="b"){
			iface.docs.expand();
			return false;
		}
	});
	iface.docs = iface.main.cells('b');

	iface.cell_tree = iface.main.cells('a');
	iface.cell_tree.setText('Режим');
	iface.cell_tree.setWidth('190');
	iface.cell_tree.fixSize(false, false);
	iface.cell_tree.collapse();

	iface.tree = iface.cell_tree.attachTree();
	iface.tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	iface.tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');

	
	if(tree_attr){

		// довешиваем обработчик на дерево
		iface.tree.attachEvent("onSelect", tree_attr.onselect);

		return new Promise(function(resolve, reject) {
			iface.tree.loadXML(tree_attr.path+'?v='+$p.job_prm.files_date, function(){
				this.tree_filteres = tree_attr.path;
				resolve(this);
			});
		});

	}else{
		iface.tree.attachEvent("onSelect", function(id){    // довешиваем обработчик на дерево

			var parts = id.split('.');

			if(parts.length > 1){

				if(iface.swith_view(parts[0]) == "oper"){		// открываем форму списка текущего метаданного

					var mgr = $p.md.mgr_by_class_name(id.substr(5));

					if(typeof iface.docs.close === "function" )
						iface.docs.close();

					if(mgr)
						mgr.form_list(iface.docs, {});

				}
			}
		});
		return Promise.resolve(iface.tree);
	}

};

/**
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param [onstep] {function} - обработчик визуализации шагов входа в систему. Если не указан, рисуется стандарное окно
 * @param resolve {function} - обработчик успешной авторизации и начальной загрузки данных
 * @param reject {function} - обработчик, который вызывается в случае ошибок на старте программы
 */
$p.iface.frm_auth = function (onstep, resolve, reject) {

	var frm_auth = $p.iface.auth = $p.iface.docs.attachForm(),
		w, were_errors, auth_struct;

	if(!onstep)
		onstep = function (step){

			var stepper = $p.eve.stepper;

			switch(step) {

				case $p.eve.steps.authorization:

					stepper.frm_sync.setItemValue("text_processed", "Авторизация");

					break;

				case $p.eve.steps.load_meta:

					// индикатор прогресса и малое всплывающее сообщение
					$p.iface.docs.progressOn();
					$p.msg.show_msg($p.msg.init_catalogues + $p.msg.init_catalogues_meta, $p.iface.docs);
					if(!$p.iface.sync)
						$p.iface.wnd_sync();
					$p.iface.sync.create(stepper);

					break;

				case $p.eve.steps.create_managers:

					stepper.frm_sync.setItemValue("text_processed", "Обработка метаданных");
					stepper.frm_sync.setItemValue("text_bottom", "Создаём объекты менеджеров данных...");

					break;

				case $p.eve.steps.process_access:

					break;

				case $p.eve.steps.load_data_files:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем файлы данных зоны...");

					break;

				case $p.eve.steps.load_data_db:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка изменений из 1С");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем изменённые справочники");

					break;

				case $p.eve.steps.load_data_wsql:

					break;

				case $p.eve.steps.save_data_wsql:

					stepper.frm_sync.setItemValue("text_processed", "Кеширование данных");
					stepper.frm_sync.setItemValue("text_bottom", "Сохраняем таблицы в локальном SQL...");

					break;

				default:

					break;
			}

		};

	function do_auth(login, password, is_guest){
		$p.ajax.username = login;
		$p.ajax.password = password;

		if(login){
			if(!is_guest)
				$p.wsql.set_user_param("user_name", login);					// сохраняем имя пользователя в базе
			if(!$p.is_guid($p.wsql.get_user_param("browser_uid")))
				$p.wsql.set_user_param("browser_uid", $p.generate_guid());	// проверяем guid браузера

			$p.eve.log_in(onstep)
				.then(resolve)
				.catch(function (err) {
					were_errors = true;
					if(reject)
						reject(err);
				})
				.then(function (err) {
					if($p.iface.sync)
						$p.iface.sync.close();
					if($p.iface.docs){
						$p.iface.docs.progressOff();
						if(!were_errors)
							$p.iface.docs.hideHeader();
					}
					if($p.iface.cell_tree && !were_errors)
						$p.iface.cell_tree.expand();
				});

		} else
			this.validate();
	}

	// обработчик кнопки "войти" формы авторизации
	function auth_click(name){

		this.resetValidateCss();

		if(this.getCheckedValue("type") == "guest"){
			do_auth.call(this, this.getItemValue("guest"), "", true);
			$p.wsql.set_user_param("user_name", "");

		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

		}
	}

	// загружаем структуру
	auth_struct = require("form_auth").replace(/\/imgs\//g, dhtmlx.image_path);
	frm_auth.loadStruct(auth_struct, function(){

		// после готовности формы читаем пользователя из локальной датабазы
		if($p.wsql.get_user_param("user_name")){
			frm_auth.setItemValue("login", $p.wsql.get_user_param("user_name"));
			frm_auth.setItemValue("type", "auth");

			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				frm_auth.setItemValue("password", $p.wsql.get_user_param("user_pwd"));

				if($p.wsql.get_user_param("autologin"))
					auth_click();
			}
		}

		// позиционируем форму по центру
		if((w = ($p.iface.docs.getWidth() - 500)/2) >= 10)
			frm_auth.cont.style.paddingLeft = w.toFixed() + "px";
		else
			frm_auth.cont.style.paddingLeft = "20px";

	});

	// назначаем обработчик нажатия на кнопку
	frm_auth.attachEvent("onButtonClick", auth_click);

	frm_auth.attachEvent("onKeyDown",function(inp, ev, name, value){
		if(ev.keyCode == 13){
			if(name == "password" || this.getCheckedValue("type") == "guest"){
				auth_click.call(this);
			}
		}
	});


	$p.msg.show_msg($p.msg.init_login, $p.iface.docs);

	frm_auth.onerror = function (err) {

		$p.ajax.authorized = false;

		var emsg = err.message.toLowerCase();

		if(emsg.indexOf("auth") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_auth
			});
			frm_auth.setItemValue("password", "");
			frm_auth.validate();

		}else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_network
			});
		}
	}

};

/**
 * Служебная функция для открытия окна настроек из гиперссылки
 * @param e
 * @return {Boolean}
 */
$p.iface.open_settings = function (e) {
	(e || event).preventDefault();
	window.open(($p.job_prm.settings_url || 'order_dealer/options.html')+'?v='+$p.job_prm.files_date);
	return $p.cancel_bubble(e);
};

/**
 * Переключает вид формы между списком, календаарём и отчетами
 * @method swith_view
 * @for InterfaceObjs
 * @param name {String} - имя представления
 */
$p.iface.swith_view = function(name){

	var state,
		iface = $p.iface,

		/**
		 * Переключает состав элементов дерева
		 * @param view
		 */
		swith_tree = function(name){

			function compare_text(a, b) {
				if (a.text > b.text) return 1;
				if (a.text < b.text) return -1;
			}

			if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;

			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]},
					{id:"oper_cch", text: $p.msg.meta_cch, item:[]},
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]}
				]}, mdn, md,

				// бежим по справочникам
					tlist = meta_tree.item[0].item;
				for(mdn in _cat){
					if(typeof _cat[mdn] == "function")
						continue;
					md = _cat[mdn].metadata();
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по документам
				tlist = meta_tree.item[1].item;
				for(mdn in _doc){
					if(typeof _doc[mdn] == "function")
						continue;
					md = _doc[mdn].metadata();
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам видов характеристик
				tlist = meta_tree.item[2].item;
				for(mdn in _cch){
					if(typeof _cch[mdn] == "function")
						continue;
					md = _cch[mdn].metadata();
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам счетов
				tlist = meta_tree.item[3].item;
				for(mdn in _cacc){
					if(typeof _cacc[mdn] == "function")
						continue;
					md = _cacc[mdn].metadata();
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				iface.tree.loadJSONObject(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				});

			}else{
				iface.tree.loadXML(iface.tree.tree_filteres+'?v='+$p.job_prm.files_date, function(){

				});

			}

			iface.tree._view = name;
		};

	if(name.indexOf(iface.docs.getViewName())==0)
		return iface.docs.getViewName();

	state = iface.docs.showView(name);
	if (state == true) {
		// first call, init corresponding components
		// календарь
		if(name=="cal" && !window.dhtmlXScheduler){
			$p.load_script("lib/dhtmlxscheduler.js", "script", function(){
				$p.load_script("lib/ext/dhtmlxscheduler_minical.js", "script");
				$p.load_script("lib/ext/dhtmlxscheduler_timeline.js", "script");
				$p.load_script("lib/ext/dhtmlxscheduler_locale_ru.js", "script", function(){
					//scheduler.config.xml_date="%Y-%m-%d %H:%i";
					scheduler.config.first_hour = 8;
					scheduler.config.last_hour = 22;
					iface.docs.scheduler = iface.docs.attachScheduler(new Date("2015-03-20"), "week", "scheduler_here");
					iface.docs.scheduler.attachEvent("onBeforeViewChange", function(old_mode, old_date, mode, date){
						if(mode == "timeline"){
							$p.msg.show_not_implemented();
							return false;
						}
						return true;
					});
				});
			});

			$p.load_script("lib/dhtmlxscheduler.css", "link");

			//}else if(name=="rep"){
			//	// подключаемый отчет
			//
			//}else if(name=="oper"){
			//	// в дереве - список метаданных, в окне - список текущего метаданного
			//

		}
	}

	swith_tree(name);

	if(name == "def")
		iface.main.showStatusBar();
	else
		iface.main.hideStatusBar();
};


/**
 * Панель инструментов рисовалки и альтернативная панель инструментов прочих форм
 * @class OTooolBar
 * @param attr {Object} - параметры создаваемой панели - родитель, положение, размер и ориентация
 * @constructor
 */
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

	/**
	 * Всплывающие подсказки
	 * @type {dhtmlXPopup}
	 */
	if(!$p.iface.popup)
		$p.iface.popup = new dhtmlXPopup();

	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path + 'custom_field/';

	div.className = 'wb-tools';
	_this.cell = div;

	_this.buttons = {};

	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				btn.classList.remove('selected');
		}
		if(select && !this.classList.contains('selected'))
			this.classList.add('selected');
	}

	/**
	 * Добавляет кнопку на панель инструментов
	 * @method add
	 * @param battr {Object} - атрибуты создаваемой кнопки
	 */
	this.add = function(battr){

		var bdiv = $p.iface.add_button(div, attr, battr);

		dhtmlxEvent(bdiv, "click", function(){
			var tool_name = this.name.replace(attr.name + '_', '');
			if(attr.onclick)
				attr.onclick.call(_this, tool_name);
		});

		dhtmlxEvent(bdiv, "mouseover", function(){
			if(battr.title){
				popup_focused = true;
				$p.iface.popup.attachHTML(battr.title);
				if(!battr.sub)
					$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);
			}
		});

		dhtmlxEvent(bdiv, "mouseout", function () {
			popup_focused = false;
			setTimeout(function () {
				if(!popup_focused)
					$p.iface.popup.hide();
			}, 300);

		});

		_this.buttons[battr.name] = bdiv;

		if(battr.sub){

			function remove_sub(){
				if(bdiv.subdiv && !sub_focused && !btn_focused){
					while(bdiv.subdiv.firstChild)
						bdiv.subdiv.removeChild(bdiv.subdiv.firstChild);
					bdiv.subdiv.parentNode.removeChild(bdiv.subdiv);
					bdiv.subdiv = null;
				}
			}

			bdiv.onmouseover = function(){

				btn_focused = true;

				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'wb-tools';
					offset = $p.get_offset(bdiv);
					this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = '198px';
					this.subdiv.style.width = '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = bdiv.onclick;
					}
					attr.wrapper.appendChild(this.subdiv);

					this.subdiv.onmouseover = function () {
						sub_focused = true;
					};

					this.subdiv.onmouseout = function () {
						sub_focused = false;
						setTimeout(remove_sub, 500);
					};

					if(battr.title)
						$p.iface.popup.show(dhx4.absLeft(this.subdiv), dhx4.absTop(this.subdiv), this.subdiv.offsetWidth, this.subdiv.offsetHeight);
				}

			};

			bdiv.onmouseout = function(){
				btn_focused = false;
				setTimeout(remove_sub, 500);
			}
		}
	};

	/**
	 * Выделяет кнопку по событию mouseover и снимает выделение с остальных кнопок
	 * @method select
	 * @param name {String} - имя текущей кнопки
	 */
	this.select = function(name){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.name == attr.name + '_' + name){
				bselect.call(btn, true);
				return;
			}
		}
	};

	/**
	 * Деструктор объекта
	 * @method unload
	 */
	this.unload = function(){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		attr.wrapper.removeChild(div);
	};


	attr.wrapper.appendChild(div);
	div.style.width = attr.width || '28px';
	div.style.height = attr.height || '150px';
	div.style.position = 'absolute';
	if(attr.top)
		div.style.top = attr.top;
	if(attr.left)
		div.style.left = attr.left;
	if(attr.bottom)
		div.style.bottom = attr.bottom;
	if(attr.right)
		div.style.right = attr.right;

	if(attr.buttons)
		attr.buttons.forEach(function(battr){
			_this.add(battr);
		});

};
$p.iface.OTooolBar = OTooolBar;

/**
 * Добавляет кнопку на панель инструментов
 * @method add_button
 * @for InterfaceObjs
 * @param parent {Element}
 * @param attr {Object}
 * @param battr {Object}
 * @returns {Element}
 */
$p.iface.add_button = function(parent, attr, battr) {
	var bdiv = document.createElement('div'), html = '';
	bdiv.name = (attr ? attr.name + '_' : '') + battr.name;
	parent.appendChild(bdiv);
	bdiv.className = 'wb-button';
	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	bdiv.innerHTML = html;

	if(battr.float)
		bdiv.style.float = battr.float;
	if(battr.clear)
		bdiv.style.clear = battr.clear;
	if(battr.width)
		bdiv.style.width = battr.width;
	return bdiv;
};




/* joined by builder */
/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wnd_address
 */


/**
 *  Конструктор поля ввода адреса
 */
function eXcell_addr(cell){

	if (!cell) return;

	var t = this, td,

		ti_keydown=function(e){
			return input_keydown(e, t);
		},

		open_selection=function(e) {
			wnd_address(t.source);
			return $p.cancel_bubble(e);
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;
	t.open_selection = open_selection;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){ t.setCValue(val); };

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			return t.source.o["shipping_address"];
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){
		var ti;
		t.val = t.getValue();		//save current value
		if(t.source.tabular_section){
			t.cell.innerHTML = '<div class="ref_div23"><input type="text" class="dhx_combo_edit" style="height: 22px;"><div class="ref_field23">&nbsp;</div></div>';
		}else{
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';
		}

		td = t.cell.firstChild;
		ti = td.childNodes[0];
		ti.value=t.val;
		ti.onclick=$p.cancel_bubble;		//blocks onclick event
		ti.readOnly = true;
		ti.focus();
		ti.onkeydown=ti_keydown;
		td.childNodes[1].onclick=open_selection;
	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.cell.firstChild && t.cell.firstChild.childNodes[0] && t.cell.firstChild.childNodes[0].length)
			t.setValue(t.cell.firstChild.childNodes[0].value);	//sets the new value
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}
}
eXcell_addr.prototype = eXcell_proto;
window.eXcell_addr = eXcell_addr;

function wnd_address(source){

	var wnd,		// окно формы
		v = {		// реквизиты формы
			delivery_area: source.o.delivery_area,
			coordinates: source.o.coordinates ? JSON.parse(source.o.coordinates) : [],
			country: "Россия",
			region: "",
			city: "",
			street:	"",
			postal_code: "",
			marker: {}
		};

	process_address_fields(frm_create);


	/**
	 * ПриСозданииНаСервере
	 */
	function frm_create(){

		// параметры открытия формы
		var options = {
			name: 'wnd_addr',
			wnd: {
				id: 'wnd_addr',
				top: 130,
				left: 200,
				width: 800,
				height: 560,
				modal: true,
				center: true,
				pwnd: source,
				allow_close: true,
				allow_minmax: true,
				on_close: frm_close,
				caption: source.o.shipping_address
			}
		};

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd.elmnts.layout = wnd.attachLayout('2E');
		wnd.elmnts.cell_frm = wnd.elmnts.layout.cells('a');
		wnd.elmnts.cell_frm.setHeight('110');
		wnd.elmnts.cell_frm.hideHeader();
		wnd.elmnts.cell_frm.fixSize(0,1);

		wnd.elmnts.pgrid = wnd.elmnts.cell_frm.attachPropertyGrid();
		wnd.elmnts.pgrid.setDateFormat("%d.%m.%Y %H:%i");
		wnd.elmnts.pgrid.init();
		wnd.elmnts.pgrid.loadXMLString(source.o._manager.get_property_grid_xml({
			" ": [
				{id: "delivery_area", path: "o.delivery_area", synonym: "Район доставки", type: "ref", txt: v.delivery_area.presentation},
				{id: "region", path: "o.region", synonym: "Регион", type: "ro", txt: v.region},
				{id: "city", path: "o.city", synonym: "Населенный пункт", type: "ed", txt: v.city},
				{id: "street", path: "o.street", synonym: "Улица, дом, корпус, литера, квартира", type: "ed", txt: v.street}
			]
		}, v), function(){
			wnd.elmnts.pgrid.enableAutoHeight(true);
			//wnd.elmnts.pgrid.setInitWidthsP("40,60");
			wnd.elmnts.pgrid.setSizes();
			wnd.elmnts.pgrid.setUserData("", "source", {
				o: v,
				grid: wnd.elmnts.pgrid,
				on_select: pgrid_on_select,
				slist: slist
			});
			wnd.elmnts.pgrid.attachEvent("onPropertyChanged", pgrid_on_changed );

		});

		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.toolbar.loadStruct('<toolbar><item id="btn_select" type="button" title="Установить адрес" text="&lt;b&gt;Выбрать&lt;/b&gt;" /></toolbar>',
			function(){
				this.attachEvent("onclick", toolbar_click);
			});


		wnd.elmnts.cell_map = wnd.elmnts.layout.cells('b');
		wnd.elmnts.cell_map.hideHeader();

		// если координаты есть в Расчете, используем их
		// если есть строка адреса, пытаемся геокодировать
		// если есть координаты $p.ipinfo, используем их
		// иначе - Москва
		var mapParams = {
			center: new google.maps.LatLng(v.latitude, v.longitude),
			zoom: v.street ? 15 : 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		wnd.elmnts.map = wnd.elmnts.cell_map.attachMap(mapParams);

		v.marker = new google.maps.Marker({
			map: wnd.elmnts.map,
			draggable: true,
			animation: google.maps.Animation.DROP,
			position: mapParams.center
		});
		google.maps.event.addListener(v.marker, 'click', marker_toggle_bounce);
		google.maps.event.addListener(v.marker, 'dragend', marker_dragend);

		refresh_grid();
	}

	/**
	 *	@desc: 	Наборы значений для реффилдов
	 */
	function slist() {
		var res = [];
		if(this.fpath[0]=="delivery_area"){
			$p.cat["delivery_areas"].form_selection(this.source, {initial_value: v.delivery_area.ref});
		}
		return res;
	}

	/**
	 *	@desc: 	обработчик команд формы
	 *	@type:	private
	 *	@topic: 0
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_select"){					// выполнить команду редактора построителя

			source.o.delivery_area = v.delivery_area;

			assemble_address_fields();

			source.grid.cells("shipping_address", 1)
				.setValue(source.o.shipping_address);

			source.o.coordinates = JSON.stringify([v.latitude, v.longitude]);

		}
		wnd.close();
	}

	/**
	 *	@desc: 	обработчик выбора значения в свойствах (ссылочные типы)
	 *	@param:	this - важный контекст
	 */
	function pgrid_on_select(selv){

		if(selv===undefined)
			return;

		var f = wnd.elmnts.pgrid.getSelectedRowId(),
			clear_street = false;

		if(v[f] != undefined){
			clear_street = (v[f] != selv);
			v[f] = selv;
		}

		if($p.is_data_obj(selv) ){
			wnd.elmnts.pgrid.cells().setValue(selv.presentation);
			delivery_area_changed(clear_street);
		}else
			addr_changed();
	}

	function delivery_area_changed(clear_street){
		// получим город и район из "района доставки"
		if(!v.delivery_area.empty() && clear_street )
			v.street = "";

		if(v.delivery_area.region){
			v.region = v.delivery_area.region;
			wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);

		}else if(clear_street)
			v.region = "";

		if(v.delivery_area.city){
			v.city = v.delivery_area.city;
			wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);

		}else if(clear_street)
			v.city = "";

		if(v.delivery_area.latitude && v.delivery_area.longitude){
			var LatLng = new google.maps.LatLng(v.delivery_area.latitude, v.delivery_area.longitude);
			wnd.elmnts.map.setCenter(LatLng);
			v.marker.setPosition(LatLng);
		}

		refresh_grid();
	}

	function refresh_grid(){
		wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);
		wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);
		wnd.elmnts.pgrid.cells("street", 1).setValue(v.street);
	}

	function addr_changed() {
		var zoom = v.street ? 15 : 12;

		if(wnd.elmnts.map.getZoom() != zoom)
			wnd.elmnts.map.setZoom(zoom);

		do_geocoding(function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var loc = results[0].geometry.location;
				wnd.elmnts.map.setCenter(loc);
				v.marker.setPosition(loc);
				v.latitude = loc.lat();
				v.longitude = loc.lng();

				v.postal_code = process_address_components({}, results[0].address_components).postal_code || "";
			}
		});
	}

	function assemble_addr(){
		return (v.street ? (v.street.replace(/,/g," ") + ", ") : "") +
			(v.city ? (v.city + ", ") : "") +
			(v.region ? (v.region + ", ") : "") + v.country +
			(v.postal_code ? (", " + v.postal_code) : "");
	}

	function assemble_address_fields(){

		source.o.shipping_address = assemble_addr();

		var fields = '<КонтактнаяИнформация  \
				xmlns="http://www.v8.1c.ru/ssl/contactinfo" \
				xmlns:xs="http://www.w3.org/2001/XMLSchema" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   \
				Представление="%1">   \
					<Комментарий/>  \
					<Состав xsi:type="Адрес" Страна="РОССИЯ">   \
						<Состав xsi:type="АдресРФ">'.replace('%1', source.o.shipping_address);

		if(v.region)
			fields += '\n<СубъектРФ>' + v.region + '</СубъектРФ>';

		if(v.city){
			if(v.city.indexOf('г.') != -1 || v.city.indexOf('г ') != -1 || v.city.indexOf(' г') != -1)
				fields += '\n<Город>' + v.city + '</Город>';
			else
				fields += '\n<НаселПункт>' + v.city + '</НаселПункт>';
		}

		if(v.street){
			var street = (v.street.replace(/,/g," ")),
				suffix, index, house, bld, house_type, flat_type, bld_type;

			// отделяем улицу от дома, корпуса и квартиры
			for(var i in $p.fias){
				if($p.fias[i].type == 1){
					for(var j in $p.fias[i].syn){
						if((index = street.indexOf($p.fias[i].syn[j])) != -1){
							house_type = i;
							suffix = street.substr(index + $p.fias[i].syn[j].length).trim();
							street = street.substr(0, index).trim();
							break;
						}
					}
				}
				if(house_type)
					break;
			}
			if(!house_type){
				house_type = "1010";
				if((index = street.indexOf(" ")) != -1){
					suffix = street.substr(index);
					street = street.substr(0, index);
				}
			}
			fields += '\n<Улица>' + street.trim() + '</Улица>';

			// отделяем корпус и квартиру от дома
			if(suffix){

				house = suffix.toLowerCase();
				suffix = "";

				for(var i in $p.fias){
					if($p.fias[i].type == 3){
						for(var j in $p.fias[i].syn){
							if((index = house.indexOf($p.fias[i].syn[j])) != -1){
								flat_type = i;
								suffix = house.substr(index + $p.fias[i].syn[j].length);
								house = house.substr(0, index);
								break;
							}
						}
					}
					if(flat_type)
						break;
				}

				if(!flat_type){
					flat_type = "2010";
					if((index = house.indexOf(" ")) != -1){
						suffix = house.substr(index);
						house = house.substr(0, index);
					}
				}

				fields += '\n<ДопАдрЭл><Номер Тип="' + house_type +  '" Значение="' + house.trim() + '"/></ДопАдрЭл>';

			}

			if(suffix)
				fields += '\n<ДопАдрЭл><Номер Тип="' + flat_type +  '" Значение="' + suffix.trim() + '"/></ДопАдрЭл>';

		}

		if(v.postal_code)
			fields += '<ДопАдрЭл ТипАдрЭл="10100000" Значение="' + v.postal_code + '"/>';

		fields += '</Состав> \
					</Состав></КонтактнаяИнформация>';

		source.o.address_fields = fields;
	}

	function process_address_fields(callback){

		if(source.o.address_fields){
			v.xml = ( new DOMParser() ).parseFromString(source.o.address_fields, "text/xml");
			var tmp = {}, res = {"building_room": ""}, tattr, building_room = [],
				nss = "СубъектРФ,Округ,СвРайМО,СвРайМО,ВнутригРайон,НаселПункт,Улица,Город,ДопАдрЭл,Адрес_по_документу,Местоположение".split(",");

			function get_aatributes(ca){
				if(ca.attributes && ca.attributes.length == 2){
					var res = {};
					res[ca.attributes[0].value] = ca.attributes[1].value;
					return res;
				}
			}

			for(var i in nss){
				tmp[nss[i]] = v.xml.getElementsByTagName(nss[i]);
			}
			for(var i in tmp){
				for(var j in tmp[i]){
					if(j == "length" || !tmp[i].hasOwnProperty(j))
						continue;
					if(tattr = get_aatributes(tmp[i][j])){
						if(!res[i])
							res[i] = [];
						res[i].push(tattr);
					}else if(tmp[i][j].childNodes.length){
						for(var k in tmp[i][j].childNodes){
							if(k == "length" || !tmp[i][j].childNodes.hasOwnProperty(k))
								continue;
							if(tattr = get_aatributes(tmp[i][j].childNodes[k])){
								if(!res[i])
									res[i] = [];
								res[i].push(tattr);
							}else if(tmp[i][j].childNodes[k].nodeValue){
								if(!res[i])
									res[i] = tmp[i][j].childNodes[k].nodeValue;
								else
									res[i] += " " + tmp[i][j].childNodes[k].nodeValue;
							}
						}
					}
				}
			}
			for(var i in res["ДопАдрЭл"]){

				for(var j in $p.fias){
					if(j.length != 4)
						continue;
					if(res["ДопАдрЭл"][i][j])
						building_room[$p.fias[j].type] = $p.fias[j].name + " " + res["ДопАдрЭл"][i][j];
				}

				if(res["ДопАдрЭл"][i]["10100000"])
					v.postal_code = res["ДопАдрЭл"][i]["10100000"];
			}

			v.address_fields = res;

			//
			v.region = res["СубъектРФ"] || res["Округ"] || "";
			v.city = res["Город"] || res["НаселПункт"] || "";
			v.street = (res["Улица"] || "");
			for(var i in building_room){
				v.street+= " " + building_room[i];
			}
		}

		// если есть координаты $p.ipinfo, используем их
		// иначе - Москва
		if(v.coordinates.length){
			// если координаты есть в Расчете, используем их
			v.latitude = v.coordinates[0];
			v.longitude = v.coordinates[1];
			callback();

		}else if(source.o.shipping_address){
			// если есть строка адреса, пытаемся геокодировать
			do_geocoding(function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					v.latitude = results[0].geometry.location.lat();
					v.longitude = results[0].geometry.location.lng();
				}
				callback();
			});

		}else if($p.ipinfo.latitude && $p.ipinfo.longitude ){
			v.latitude = $p.ipinfo.latitude;
			v.longitude = $p.ipinfo.longitude;
			callback();
		}else{
			v.latitude = 55.635924;
			v.longitude = 37.6066379;
			callback();
			$p.msg.show_msg($p.msg.empty_geocoding);
		}

	}

	function do_geocoding(callback){
		var address = assemble_addr();

		$p.ipinfo.ggeocoder.geocode({ 'address': address}, callback);
	}

	function marker_toggle_bounce() {

		if (v.marker.getAnimation() != null) {
			v.marker.setAnimation(null);
		} else {
			v.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){v.marker.setAnimation(null)}, 1500);
		}
	}

	function process_address_components(v, components){
		var i, c, j, street = "", street0 = "", locality = "";
		for(i in components){
			c = components[i];
			//street_number,route,locality,administrative_area_level_2,administrative_area_level_1,country,sublocality_level_1
			for(j in c.types){
				switch(c.types[j]){
					case "route":
						if(c.short_name.indexOf("Unnamed")==-1){
							street = c.short_name + (street ? (" " + street) : "");
							street0 = $p.m.trim(c.long_name.replace("улица", ""));
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
		if(v.region == v.city_long)
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

	function marker_dragend(e) {
		$p.ipinfo.ggeocoder.geocode({'latLng': e.latLng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var addr = results[0];

					wnd.setText(addr.formatted_address);
					process_address_components(v, addr.address_components);

					refresh_grid();

					var zoom = v.street ? 15 : 12;
					if(wnd.elmnts.map.getZoom() != zoom){
						wnd.elmnts.map.setZoom(zoom);
						wnd.elmnts.map.setCenter(e.latLng);
					}

					v.latitude = e.latLng.lat();
					v.longitude = e.latLng.lng();
				}
			}
		});
	}

	function pgrid_on_changed(pname, new_value, old_value){
		if(pname){
			if(v.delivery_area.empty()){
				new_value = old_value;
				$p.msg.show_msg({
					type: "alert",
					text: $p.msg.delivery_area_empty,
					title: $p.msg.addr_title});
				setTimeout(function(){
					wnd.elmnts.pgrid.selectRowById("delivery_area");
				}, 50);

			} else
				pgrid_on_select(new_value);
		}
	}

	function frm_close(win){
		source.grid.editStop();
		return !win.error;
	}

	return wnd;

};

/* joined by builder */
/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  metadata
 * @author	Evgeniy Malyarov
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
 * @param str {any} - значение (обычно, строка, полученная из html поля ввода)
 * @param mtype {Object} - поле type объекта метаданных (field.type)
 * @return {any}
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
 * @return {any}
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
 * Абстрактный поиск массива значений в коллекции
 * @method _find_rows
 * @for MetaEngine
 * @param a {Array}
 * @param attr {object}
 * @param fn {function}
 * @return {Array}
 * @private
 */
$p._find_rows = function(a, attr, fn){
	var ok, o, i, j, res = [];
	for(i in a){
		o = a[i];
		ok = true;
		if(attr)
			for(j in attr)
				if(!$p.is_equal(o[j], attr[j])){
					ok = false;
					break;
				}
		if(ok){
			if(fn){
				if(fn.call(this, o) === false)
					break;
			}else
				res.push(o);
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
		var xml = "<?xml version='1.0' encoding='UTF-8'?><tree id=\"0\">";

		function add_hierarchically(row, adata){
			xml = xml + "<item text=\"" +
				row.presentation.replace(/"/g, "'") +	"\" id=\"" +
				row.ref + "\" im0=\"folderClosed.gif\">";
			$p._find_rows(adata, {parent: row.ref}, function(r){
				add_hierarchically(r, adata)
			});
			xml = xml + "</item>";
		}

		if(mgr._cachable){
			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then(function(data){
					add_hierarchically({presentation: "...", ref: $p.blank.guid}, []);
					$p._find_rows(data, {parent: $p.blank.guid}, function(r){
						add_hierarchically(r, data)
					});
					return xml + "</tree>";
				});
		}
	}

	function get_orders(){

	}

	function get_selection(){

		if(mgr._cachable){

			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then(function(data){
					return data_to_grid.call(mgr, data, attr);
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
		 * Коллекция менеджеров справочников
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров перечислений
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров документов
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров регистров сведений
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров регистров накопления
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров регистров бухгалтерии
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров обработок
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров отчетов
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров планов счетов
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
		 * Коллекция менеджеров планов видов характеристик
		 *
		 * Состав коллекции определяется метаданными используемой конфигурации
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
 * Хранилище метаданных конфигурации
 * загружает описание из файла на сервере. в оффлайне используется локальный кеш
 * @class Meta
 * @static
 * @param req {XMLHttpRequest} - с основными метаданными
 * @param patch {XMLHttpRequest} - с дополнительными метаданными
 */
function Meta(req, patch) {

	var m = JSON.parse(req.response), class_name;
	if(patch){
		patch = JSON.parse(patch.response);
		for(var area in patch){
			for(var c in patch[area]){
				if(!m[area][c])
					m[area][c] = {};
				m[area][c]._mixin(patch[area][c]);
			}
		}
	}
	req = null;
	patch = null;


	/**
	 * Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	this.get = function(class_name, field_name){
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
		}else if(field_name)
			res = m[np[0]][np[1]].fields[field_name];
		else
			res = m[np[0]][np[1]];
		return res;
	};

	/**
	 * Возвращает структуру метаданных конфигурации
	 */
	this.get_classes = function () {
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
	this.create_tables = function(callback){

		var cstep = 0, data_names = [], managers = this.get_classes(), class_name,
			create = "USE md;\nCREATE TABLE IF NOT EXISTS refs (ref CHAR);\n";

		function on_table_created(data){

			if(typeof data === "number"){
				cstep--;
				if(cstep==0){
					if(callback)
						setTimeout(callback, 10);
					alasql.utils.saveFile("create_tables.sql", create);
				} else
					iteration();
			}else if(data.hasOwnProperty("message")){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					title: $p.msg.error_critical,
					type: "alert-error",
					text: data.message
				});
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
			var data = data_names[cstep-1],
				sql = data["class"][data.name].get_sql_struct();

			create += sql + ";\n";
			on_table_created(1);
			//$p.wsql.exec(sql, [], on_table_created);
		}

		$p.wsql.exec(create);
		iteration();

	};

	this.sql_type = function (mgr, f, mf) {
		var sql;
		if((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if(mf.is_ref || mf.hasOwnProperty("str_len"))
			sql = " CHAR";

		else if(mf.date_part)
			sql = " Date";

		else if(mf.hasOwnProperty("digits")){
			if(mf.fraction_figits==0)
				sql = " INT";
			else
				sql = " FLOAT";

		}else if(mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else
			sql = " CHAR";
		return sql;
	};

	this.sql_mask = function(f, t){
		var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + (mask_names.some(
				function (mask) {
					return f.indexOf(mask) !=-1
				})  ? ("`" + f + "`") : f);
	};

	/**
	 * Возвращает менеджер объекта по имени класса
	 * @param class_name {String}
	 * @return {DataManager|undefined}
	 * @private
	 */
	this.mgr_by_class_name = function(class_name){
		if(class_name){
			var np = class_name.split(".");
			if(np[1] && $p[np[0]])
				return $p[np[0]][np[1]];
		}
	};

	/**
	 * Возвращает менеджер значения по свойству строки
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - метаданные поля
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	this.value_mgr = function(row, f, mf, array_enabled, v){
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
			}
		}
	};

	this.control_by_type = function (type) {
		var ft;
		if(type.is_ref){
			if(type.types.join().indexOf("enm.")==-1)
				ft = "ref";
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
		} else if(type.str_len && type.str_len >= 100) {
			ft = "txt";
		} else {
			ft = "ed";
		}
		return ft;
	};

	this.ts_captions = function (class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = this.get(class_name).tabular_sections[ts_name],
			mfrm = this.get(class_name).form,
			fields = mts.fields, mf;

		// если имеются метаданные формы, используем их
		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			source._mixin(mfrm.obj.tabular_sections[ts_name]);

		}else{

			if(ts_name==="contact_information")
				fields = {type: "", kind: "", presentation: ""}

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
					source.types += "," + this.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	};

	this.syns_js = function (v) {
		var synJS = {
			DeletionMark: 'deleted',
			Description: 'name',
			DataVersion: 'data_version',
			IsFolder: 'is_folder',
			Number: 'number_doc',
			Date: 'date',
			Posted: 'posted',
			Code: 'id'
		};
		if(synJS[v])
			return synJS[v];
		return m.syns_js[m.syns_1с.indexOf(v)] || v;
	};

	this.syns_1с = function (v) {
		var syn1c = {
			deleted: 'DeletionMark',
			name: 'Description',
			data_version: 'DataVersion',
			is_folder: 'IsFolder',
			number_doc: 'Number',
			date: 'Date',
			posted: 'Posted',
			id: 'Code'
		};
		if(syn1c[v])
			return syn1c[v];
		return m.syns_1с[m.syns_js.indexOf(v)] || v;
	};

	this.printing_plates = function (pp) {
		for(var i in pp.doc)
			m.doc[i].printing_plates = pp.doc[i];

	};

	// Экспортируем ссылку на себя
	_md = $p.md = this;


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
		_ireg[class_name] = new InfoRegManager("ireg."+class_name);
	}

	for(class_name in m.dp)
		_dp[class_name] = new DataProcessorsManager("dp."+class_name);

	for(class_name in m.cch)
		_cch[class_name] = new ChartOfCharacteristicManager("cch."+class_name);

	for(class_name in m.cacc)
		_cacc[class_name] = new ChartOfAccountManager("cacc."+class_name);

	// загружаем модификаторы и прочие зависимости
	$p.modifiers.execute();

	return {
		md_date: m["md_date"],
		cat_date: m["cat_date"]
	};
}

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
			grid.loadXMLString(res, function(){
				if(callback)
					callback(res);
			});

		else if(callback)
			callback(res);
	}

	grid.xmlFileUrl = "exec";


	var mgr = _md.mgr_by_class_name(attr.class_name);

	if(!mgr._cachable && ($p.job_prm.rest || attr.rest))
		mgr.rest_selection(attr)
			.then(cb_callBack)
			.catch(function (error) {
				console.log(error);
			});
	else
		_load(attr)
			.then(cb_callBack)
			.catch(function (error) {
				console.log(error);
			});

};
/* joined by builder */
/**
 * Конструкторы менеджеров данных
 * @module  metadata
 * @submodule meta_mngrs
 * @author	Evgeniy Malyarov
 * @requires common
 */



/**
 * Абстрактный менеджер данных: и ссылочных и с суррогратным ключом и несохраняемых обработок
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 */
function DataManager(class_name){

	var _metadata = _md.get(class_name),
		_cachable,
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
	if(!$p.job_prm.offline && _metadata.hasOwnProperty("cachable"))
		_cachable = _metadata.cachable;


	/**
	 * Выполняет две функции:
	 * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
	 * - Указывает, нужно ли запоминать представления ссылок (инверсно). Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
	 * @property _cachable
	 * @type Boolean
	 */
	this._define("_cachable", {
		value: _cachable,
		writable: true,
		enumerable: false
	});


	/**
	 * Имя типа объектов этого менеджера
	 * @property class_name
	 * @type String
	 */
	this._define("class_name", {
		value: class_name,
		writable: false,
		enumerable: false
	});


	/**
	 * Указатель на массив, сопоставленный с таблицей локальной базы данных
	 * Фактически - хранилище объектов данного класса
	 * @property alatable
	 * @type Array
	 */
	this._define("alatable", {
		get : function () {
			return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
		},
		enumerable : false
	});

	/**
	 * Метаданные объекта (указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту)
	 * @property metadata
	 * @type {Object} - объект метаданных
	 */
	this._define("metadata", {
		value: function(field){
			if(field)
				return _metadata.fields[field] || _metadata.tabular_sections[field];
			else
				return _metadata;
		},
		enumerable: false
	});

	/**
	 * Добавляет подписку на события объектов данного менеджера
	 * @param name {String} - имя события
	 * @param method {Function} - добавляемый метод
	 * @param [first] {Boolean} - добавлять метод в начало, а не в конец коллекции
	 */
	this.attache_event = function (name, method, first) {
		if(first)
			_events[name].push(method);
		else
			_events[name].push(method);
	};

	/**
	 * Выполняет методы подписки на событие
	 * @param obj {DataObj} - объект, в котором произошло событие
	 * @param name {String} - имя события
	 * @param attr {Object} - дополнительные свойства, передаваемые в обработчик события
	 */
	this.handle_event = function (obj, name, attr) {
		var res;
		_events[name].forEach(function (method) {
			if(res !== false)
				res = method.call(obj, attr);
		});
		return res;
	};


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
				this._obj_сonstructor.prototype._define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}
			for(var f in this.metadata().resources){
				this._obj_сonstructor.prototype._define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}

		}else{

			this._ts_сonstructors = {};             // ссылки на конструкторы строк табчастей

			// реквизиты по метаданным
			for(var f in this.metadata().fields){
				this._obj_сonstructor.prototype._define(f, {
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
					this._ts_сonstructors[f].prototype._define(rf, {
						get : new Function("return this._getter('"+rf+"')"),
						set : new Function("v", "this._setter('"+rf+"',v)"),
						enumerable : true
					});
				}

				// устанавливаем геттер и сеттер для табличной части
				this._obj_сonstructor.prototype._define(f, {
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
 */
DataManager.prototype._define("family_name", {
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

	if(this._cachable)
		;
	else if($p.job_prm.rest || attr.rest){

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
 * @param val {DataObj|String}
 * @param filter {Object}
 * @return {Array}
 */
DataManager.prototype.get_option_list = function(val, filter){
	var l = [];
	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}
	this.find_rows(filter, function (v) {
		l.push(check({text: v.presentation, value: v.ref}));
	});
	return l;
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
 * @return {string} - XML строка в терминах dhtml.PropertyGrid
 */
DataManager.prototype.get_property_grid_xml = function(oxml, o){
	var i, j, mf, v, ft, txt, t = this, row_id, gd = '<rows>',

		default_oxml = function () {
			if(oxml)
				return;
			oxml = {" ": []};
			mf = _md.get(t.class_name);
			if(o instanceof CatObj){
				if(mf.code_length)
					oxml[" "].push("id");
				if(mf.main_presentation_name)
					oxml[" "].push("name");
			}else if(o instanceof DocObj){
				oxml[" "].push("number");
				oxml[" "].push("date");
			}
			if(!o.is_folder){
				for(i in mf.fields)
					if(!mf.fields[i].hide)
						oxml[" "].push(i);
			}
			if(_md.get(t.class_name).tabular_sections["extra_fields"])
				oxml["Дополнительные реквизиты"] = [];

		},

		by_type = function(fv){

			ft = _md.control_by_type(mf.type);

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

		add_xml_row = function(f, tabular){
			if(tabular){
				var pref = f["property"] || f["param"] || f["Параметр"],
					pval = f["value"] || f["Значение"];
				if(pref.empty()) {
					row_id = tabular + "|" + "empty";
					ft = "ro";
					txt = "";
					mf = {synonym: "?"};

				}else{
					mf = {synonym: pref.presentation, type: pref.type};
					row_id = tabular + "|" + pref.ref;
					by_type(pval);
					if(ft == "ref")
						ft = "refc";
					else if(ft == "edn")
						ft = "calck";

					if(pref.mandatory)
						ft += '" class="cell_mandatory';
				}
			}else if(typeof f === "object"){
				mf = {synonym: f.synonym};
				row_id = f.id;
				ft = f.type;
				txt = f.txt;
			}else if((v = o[f]) !== undefined){
				mf = _md.get(t.class_name, f);
				row_id = f;
				by_type(v);
			}else
				return;

			gd += '<row id="' + row_id + '"><cell>' + (mf.synonym || mf.name) +
				'</cell><cell type="' + ft + '">' + txt + '</cell></row>';
		};

	default_oxml();

	for(i in oxml){
		if(i!=" ") gd += '<row open="1"><cell>' + i + '</cell>';	// если у блока есть заголовок, формируем блок иначе добавляем поля без иерархии

		for(j in oxml[i]) add_xml_row(oxml[i][j]);					// поля, описанные в текущем разделе

		if(i == "Дополнительные реквизиты" && o["extra_fields"])    // строки табчасти o.extra_fields
			o["extra_fields"].each(function(row){
				add_xml_row(row, "extra_fields");
			});

		else if(i == "Свойства изделия"){							// специфичные свойства изделия
			var added = false;
			o.params.each(function(row){
				if(row.cns_no == 0 && !row.hide){
					add_xml_row(row, "params");
					added = true;
				}
			});
			if(!added)
				add_xml_row({param: _cch.properties.get("", false)}, "params");
		}else if(i == "Параметры"){									// параметры фурнитуры
			for(var k in o.fprms){
				if(o.fprms[k].hide || o.fprms[k]["param"].empty())
					continue;
				add_xml_row(o.fprms[k], "fprms");
			}
		}


		if(i!=" ") gd += '</row>';									// если блок был открыт - закрываем
	}
	gd += '</rows>';
	return gd;
};

/**
 * Имя таблицы объектов этого менеджера в локальной базе данных
 * @property table_name
 * @type String
 */
DataManager.prototype._define("table_name", {
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

	$p.ajax.get_and_show_blob($p.job_prm.hs_url(), {
		action: "print",
		class_name: this.class_name,
		ref: $p.fix_guid(ref),
		model: model,
		browser_uid: $p.wsql.get_user_param("browser_uid")
	})
		.then(tune_wnd_print)
		.catch(function (err) {
			console.log(err);
		});

	setTimeout(tune_wnd_print, 3000);
};


/**
 * Aбстрактный менеджер ссылочных данных - документов и справочников
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
	 * @return {DataObj|Promise(DataObj)}
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

		if(!t._cachable || o.is_new()){
			return o.load();	// читаем из 1С или иного сервера

		}else if(force_promise)
			return Promise.resolve(o);

		else
			return o;
	};

	t.create = function(attr, fill){
		var o = by_ref[attr.ref];
		if(!o){

			o = new t._obj_сonstructor(attr, t);

			if(fill){
				var _obj = o._obj;
				// присваиваем типизированные значения по умолчанию
				for(var f in t.metadata().fields){
					if(_obj[f] == undefined)
						_obj[f] = "";
				}
			}
		}

		return o;
	};


	/**
	 * Находит первый элемент, в любом поле которого есть искомое значение
	 * @method find
	 * @param val {any} - значение для поиска
	 * @return {DataObj}
	 */
	t.find = function(val){
		return $p._find(by_ref, val); };

	/**
	 * Находит строки, соответствующие отбору. Eсли отбор пустой, возвращаются все строки табчасти
	 * @method find_rows
	 * @param attr {Object} - объект. в ключах имена полей, в значениях значения фильтра
	 * @param fn {Function} - callback, в который передается строка табчасти
	 * @return {Array}
	 */
	t.find_rows = function(attr, fn){ return $p._find_rows(by_ref, attr, fn); };

	/**
	 * Cохраняет объект в базе 1C либо выполняет запрос attr.action
	 * @method save
	 * @param attr {Object} - атрибуты сохраняемого объекта могут быть ранее полученным DataObj или произвольным объектом (а-ля данныеформыструктура)
	 * @return {Promise.<T>} - инфо о завершении операции
	 * @async
	 */
	t.save = function(attr){
		if(attr && (attr.specify ||
			($p.is_guid(attr.ref) && !t._cachable))) {
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
	 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
	 * @async
	 */
	t.load_array = function(aattr){

		var ref, obj;

		for(var i in aattr){
			ref = $p.fix_guid(aattr[i]);
			if(!(obj = by_ref[ref])){
				new t._obj_сonstructor(aattr[i], t);

			}else if(obj.is_new()){
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
		res = {}, f,
		action = attr && attr.action ? attr.action : "create_table";


	function sql_selection(){

		var ignore_parent = !attr.parent,
			parent = attr.parent || $p.blank.guid,
			owner = attr.owner || $p.blank.guid,
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
				attr.selection.forEach(function(sel){
					for(var key in sel){

						if(cmd.fields.hasOwnProperty(key)){
							if(sel[key] === true)
								s += "\n AND _t_." + key + " ";
							else if(sel[key] === false)
								s += "\n AND (not _t_." + key + ") ";
							else if(typeof sel[key] == "string")
								s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
							else
								s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
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


				//
				//
				//// допфильтры форм и связей параметров выбора
				//Если СтруктураМД.param.Свойство("selection") Тогда
				//Для Каждого selection Из СтруктураМД.param.selection Цикл
				//Для Каждого Эл Из selection Цикл
				//Если ТипЗнч(Эл.Значение) = Тип("УникальныйИдентификатор") Тогда
				//Реквизит = СтруктураМД.МетаОбъекта.Реквизиты.Найти(ИнтеграцияСериализацияСервер.Synonim(Эл.Ключ, СтруктураМД));
				//Если Реквизит <> Неопределено Тогда
				//Для Каждого Т Из Реквизит.Тип.Типы() Цикл
				//Попытка
				//МенеджерСсылки = ОбщегоНазначения.МенеджерОбъектаПоСсылке(Новый(Т));
				//ЗначениеОтбора = МенеджерСсылки.ПолучитьСсылку(Эл.Значение);
				//Исключение
				//КонецПопытки;
				//КонецЦикла;
				//КонецЕсли;
				//Иначе
				//ЗначениеОтбора = Эл.Значение;
				//КонецЕсли;
				//Запрос.УстановитьПараметр(Эл.Ключ, ЗначениеОтбора);
				//КонецЦикла;
				//КонецЦикла;
				//КонецЕсли;
				//
				//// допфильтры форм и связей параметров выбора
				//Если СтруктураМД.param.Свойство("filter_ex") Тогда
				//Для Каждого Эл Из СтруктураМД.param.filter_ex Цикл
				//Запрос.УстановитьПараметр(Эл.Ключ, Эл.Значение);
				//КонецЦикла;
				//КонецЕсли;
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
			"' then 0 else 1 end as is_initial_value FROM " + t.table_name + " AS _t_ %j %3 %4 LIMIT 300")
				.replace("%2", list_flds())
				.replace("%j", join_flds())
			;

		return sql.replace("%3", where_flds()).replace("%4", order_flds());

	}

	function sql_create(){
		var sql = "CREATE TABLE IF NOT EXISTS "+t.table_name+" (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT";

		if(t instanceof DocManager)
			sql += ", posted BOOLEAN, date Date, number_doc CHAR";
		else
			sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

		for(f in cmd.fields)
			sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.fields[f].type);


		for(f in cmd["tabular_sections"])
			sql += ", " + "ts_" + f + " JSON";
		sql += ")";
		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var fields = ["ref", "deleted", "lc_changed"],
			sql = "INSERT INTO "+t.table_name+" (ref, `deleted`, lc_changed",
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
			sql += ", " + "ts_" + f;
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
		res = "SELECT * FROM "+t.table_name+" WHERE ref = ?";

	else if(action == "select_all")
		res = "SELECT * FROM "+t.table_name;

	else if(action == "delete")
		res = "DELETE FROM "+t.table_name+" WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS "+t.table_name;

	else if(action == "get_tree")
		res = "SELECT ref, parent, name as presentation FROM " + t.table_name + " WHERE is_folder order by parent, name";

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
 * Менеджер обработок
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
 * Абстрактный менеджер перечисления
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
		this._define(new_ref, {
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

	var res,
		action = attr && attr.action ? attr.action : "create_table";

	if(action == "create_table")
		res = "CREATE TABLE IF NOT EXISTS "+this.table_name+
			" (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";
	else if(["insert", "update", "replace"].indexOf(action) != -1){
		res = {};
		res[this.table_name] = {
			sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES (?, ?, ?)",
			fields: ["ref", "sequence", "synonym"],
			values: "(?, ?, ?)"
		};
	}else if(action == "delete")
		res = "DELETE FROM "+this.table_name+" WHERE ref = ?";

	return res;

};

/**
 * Возвращает массив доступных значений для комбобокса
 * @param val {DataObj|String}
 * @param filter {Object}
 * @return {Array}
 */
EnumManager.prototype.get_option_list = function(val){
	var l = [];
	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}
	this.alatable.forEach(function (v) {
		l.push(check({text: v.synonym, value: v.ref}));
	});
	return l;
};


/**
 * Абстрактный менеджер регистра (накопления и сведений)
 * @class InfoRegManager
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

		var arr = alasql(this.get_sql_struct(attr), attr._values),
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
		var sql = "CREATE TABLE IF NOT EXISTS "+t.table_name+" (",
			first_field = true;

		for(f in cmd["dimensions"]){
			if(first_field){
				sql += f;
				first_field = false;
			}else
				sql += _md.sql_mask(f);
			sql += _md.sql_type(t, f, cmd["dimensions"][f].type);
		}

		for(f in cmd["resources"])
			sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd["resources"][f].type);

		sql += ", PRIMARY KEY (";
		first_field = true;
		for(f in cmd["dimensions"]){
			if(first_field){
				sql += f;
				first_field = false;
			}else
				sql += _md.sql_mask(f);
		}

		sql += "))";

		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var sql = "INSERT OR REPLACE INTO "+t.table_name+" (",
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
		var sql = "SELECT * FROM "+t.table_name+" WHERE ",
			first_field = true;
		attr._values = [];

		for(var f in attr){
			if(f == "action" || f == "_values")
				continue;

			if(first_field)
				first_field = false;
			else
				sql += " and ";

			sql += f + "=?";
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
		res = "DELETE FROM "+t.table_name+" WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS "+t.table_name;

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
 * Абстрактный менеджер регистра сведений
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
 * Абстрактный менеджер регистра накопления
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
 * Абстрактный менеджер справочника
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
		this._obj_сonstructor.prototype._define("is_folder", {
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
 * Абстрактный менеджер плана видов характеристик
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
 * Абстрактный менеджер плана видов характеристик
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
 * Абстрактный менеджер документов
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

/* joined by builder */
/**
 * Конструкторы табличных частей
 * @module  metadata
 * @submodule meta_tabulars
 * @author	Evgeniy Malyarov
 * @requires common
 */


/**
 * Абстрактный объект табличной части
 * Физически, данные хранятся в DataObj`екте, а точнее - в поле типа массив и именем табчасти объекта _obj
 * Класс TabularSection предоставляет методы для манипуляции этими данными
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
	this._define('_name', {
		value : name,
		enumerable : false
	});

	/**
	 * Объект-владелец табличной части
	 * @property _owner
	 * @type DataObj
	 */
	this._define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
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
TabularSection.prototype.clear = function(){
	for(var i in this._obj)
		delete this._obj[i];
	this._obj.length = 0;
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
};

/**
 * Находит первую строку, содержащую значение
 * @method find
 * @param val {any}
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
 * @param attr {object} - в ключах имена полей, в значениях значения фильтра
 * @param callback {function}
 * @return {Array}
 */
TabularSection.prototype.find_rows = function(attr, callback){

	var ok, o, i, j, res = [], a = this._obj;
	for(i in a){
		o = a[i];
		ok = true;
		if(attr)
			for(j in attr)
				if(!$p.is_equal(o[j], attr[j])){
					ok = false;
					break;
				}
		if(ok){
			if(callback){
				if(callback.call(this, o._row) === false)
					break;
			}else
				res.push(o._row);
		}
	}
	return res;
};

/**
 * Сдвигает указанную строку табличной части на указанное смещение
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){
	var tmp = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = tmp;
};

/**
 * добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 */
TabularSection.prototype.add = function(attr){

	var row = new this._owner._manager._ts_сonstructors[this._name](this);

	// если передали значения по умолчанию, миксуем
	if(attr)
		row._mixin(attr || {});

	// присваиваем типизированные значения по умолчанию
	for(var f in row._metadata.fields){
		if(row._obj[f] == undefined)
			row[f] = "";
	}

	row._obj.row = this._obj.push(row._obj);
	row._obj._define("_row", {
		value: row,
		enumerable: false
	});

	attr = null;
	return row;
};

/**
 * Выполняет цикл "для каждого"
 * @method each
 * @param fn {function} - callback, в который передается строка табчасти
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
	this.clear();
	for(var i in aattr)
		this.add(aattr[i]);
};

/**
 * Перезаполняет грид данными табчасти
 * @method sync_grid
 * @param grid {dhtmlxGrid} - элемент управления
 */
TabularSection.prototype.sync_grid = function(grid){
	var grid_data = {rows: []},
		source = grid.getUserData("", "source");
	grid.clearAll();
	grid.setUserData("", "source", source);
	this.each(function(r){
		var data = [];
		for(var f in source.fields){
			if($p.is_data_obj(r[source.fields[f]]))
				data.push(r[source.fields[f]].presentation);
			else
				data.push(r[source.fields[f]]);
		}
		grid_data.rows.push({ id: r.row, data: data });
	});
	try{ grid.parse(grid_data, "json"); } catch (e){}
	grid.callEvent("onGridReconstructed",[]);
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};



/**
 * Aбстрактная строка табличной части
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
	this._define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * Фактическое хранилище данных объекта
	 * отображается в поле типа json записи в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

/**
 * Метаданые строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype._define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * Номер строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype._define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

TabularSectionRow.prototype._define("_clone", {
	value : function(){
		var row = new this._owner._owner._manager._ts_сonstructors[this._owner._name](this._owner)._mixin(this._obj);
		return row;
	},
	enumerable : false
});



/* joined by builder */
/**
 * Конструкторы объектов данных
 * @module  metadata
 * @submodule meta_objs
 * @author	Evgeniy Malyarov
 * @requires common
 */


/**
 * Абстрактный объект ссылочных данных - документов и справочников
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 */
function DataObj(attr, manager) {

	var ref, tmp, _ts_ = {}, _obj = {data_version: ""}, _is_new = !(this instanceof EnumObj);

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
	 */
	this._define('_manager', {
		value : manager,
		enumerable : false
	});

	/**
	 * Возвращает "истина" для нового (еще не записанного или непрочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	this._define("is_new", {
		value: function(){
			return _is_new;
		},
		enumerable: false
	});

	this._define("_set_loaded", {
		value: function(ref){
			_is_new = false;
			manager.push(this, ref);
		},
		enumerable: false
	});


	/**
	 * Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

	this._define("_ts_", {
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
		if(mgr = _md.value_mgr(this._obj, f, mf))
			return mgr.get(this._obj[f], false);
		else{
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

DataObj.prototype._setter = function (f, v) {

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
			}
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
 * @return {Promise.<T>} - промис с результатом выполнения операции
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

	if(tObj._manager._cachable && !tObj.is_new())
		return Promise.resolve(tObj);

	if(tObj.ref == $p.blank.guid){
		if(tObj instanceof CatObj)
			tObj.id = "000000000";
		else
			tObj.number_doc = "000000000";
		return Promise.resolve(tObj);

	}else if(!tObj._manager._cachable && $p.job_prm.rest)
		return tObj.load_rest();

	else
		return _load({
			class_name: tObj._manager.class_name,
			action: "load",
			ref: tObj.ref
		})
			.then(callback_1c);



};

/**
 * Сохраняет объект в локальной датабазе, выполняет подписки на события
 * В зависимости от настроек, инициирует запись объекта во внешнюю базу данных
 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param [mode] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.save = function (post, operational) {

	// Если процедуры перед записью завершились неудачно - не продолжаем
	if(_manager.handle_event(this, "before_save") === false)
		return Promise.resolve(this);

	// Сохраняем во внешней базе
	this.save_rest({
		url: $p.job_prm.rest_url(),
		username: $p.ajax.username,
		password: $p.ajax.password,
		post: post,
		operational: operational
	})

		// и выполняем обработку после записи
		.then(function (obj) {
			return _manager.handle_event(obj, "after_save");
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
 */
DataObj.prototype._define('_metadata', {
	get : function(){ return this._manager.metadata()},
	enumerable : false
});

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
DataObj.prototype._define('ref', {
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
DataObj.prototype._define('deleted', {
	get : function(){ return this._obj.deleted},
	set : function(v){ this._obj.deleted = !!v},
	enumerable : true,
	configurable: true
});

/**
 * Версия данных для контроля изменения объекта другим пользователем
 * @property data_version
 * @for DataObj
 * @type String
 */
DataObj.prototype._define('data_version', {
	get : function(){ return this._obj.data_version || ""},
	set : function(v){ this._obj.data_version = String(v)},
	enumerable : true
});

/**
 * Время последнего изменения объекта в миллисекундах от начала времён для целей синхронизации
 * @property lc_changed
 * @for DataObj
 * @type Number
 */
DataObj.prototype._define('lc_changed', {
	get : function(){ return this._obj.lc_changed || 0},
	set : function(v){ this._obj.lc_changed = $p.fix_number(v, true)},
	enumerable : true,
	configurable: true
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = DataObj.prototype._setter;



/**
 * Абстрактный элемент справочника
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
	this._define('presentation', {
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

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.is_empty_guid(this.ref) && (attr.id || attr.name))
		this._set_loaded(this.ref);
}
CatObj._extend(DataObj);

/**
 * Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype._define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){ this._obj.id = v},
	enumerable : true
});

/**
 * Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype._define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){ this._obj.name = String(v)},
	enumerable : true
});


/**
 * Абстрактный ДокументОбъект
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
	this._define('presentation', {
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
DocObj.prototype._define('number_doc', {
	get : function(){ return this._obj.number_doc || ""},
	set : function(v){ this._obj.number_doc = v},
	enumerable : true
});

/**
 * Дата документа
 * @property date
 * @type {Date}
 */
DocObj.prototype._define('date', {
	get : function(){ return this._obj.date || $p.blank.date},
	set : function(v){ this._obj.date = $p.fix_date(v, true)},
	enumerable : true
});

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
DocObj.prototype._define('posted', {
	get : function(){ return this._obj.posted || false},
	set : function(v){ this._obj.posted = $p.fix_boolean(v)},
	enumerable : true
});



/**
 * Абстрактный ОбработкаОбъект
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
 * Абстрактный элемент перечисления
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
EnumObj.prototype._define('order', {
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
EnumObj.prototype._define('name', {
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
EnumObj.prototype._define('synonym', {
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
EnumObj.prototype._define('presentation', {
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
 * Запись регистра (накопления и сведений)
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
 * Метаданные текущего объекта
 * @property _metadata
 * @for DataObj
 * @type Object
 */
RegisterRow.prototype._define('_metadata', {
	get : function(){
		var cm = this._manager.metadata();
		if(!cm.fields)
			cm.fields = ({})._mixin(cm.dimensions)._mixin(cm.resources);
		return cm;
	},
	enumerable : false
});

RegisterRow.prototype._define('ref', {
	get : function(){ return this._manager.get_ref(this)},
	enumerable : true
});


/* joined by builder */
/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 * @module  metadata
 * @submodule rest
 * @author	Evgeniy Malyarov
 * @requires common
 */

function Rest(){

	this.filter_date = function (fld, dfrom, dtill) {
		if(!dfrom)
			dfrom = new Date("2015-01-01");
		var res = fld + " gt datetime'" + $p.dateFormat(dfrom, $p.dateFormat.masks.isoDateTime) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.dateFormat(dtill, $p.dateFormat.masks.isoDateTime) + "'";
		return res;
	};

	this.to_data = function (rdata, mgr) {
		var o = {},
			mf = mgr.metadata().fields,
			mts = mgr.metadata().tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			o.deleted = rdata.DeletionMark;
			o.data_version = rdata.DataVersion;
		}else{
			mf = []._mixin(mgr.metadata().dimensions)._mixin(mgr.metadata().resources);
		}

		if(mgr instanceof DocManager){
			o.number_doc = rdata.Number;
			o.date = rdata.Date;
			o.posted = rdata.Posted;

		} else {
			if(mgr.metadata().main_presentation_name)
				o.name = rdata.Description;

			if(mgr.metadata().code_length)
				o.id = rdata.Code;
		}

		for(f in mf){
			syn = _md.syns_1с(f);
			if(mf[f].type.is_ref && rdata[syn+"_Key"])
				syn+="_Key";
			o[f] = rdata[syn];
		}

		for(ts in mts){
			synts = _md.syns_1с(ts);
			o[ts] = [];
			rdata[synts].sort(function (a, b) {
				return a.LineNumber > b.LineNumber;
			});
			rdata[synts].forEach(function (r) {
				row = {};
				for(tf in mts[ts].fields){
					syn = _md.syns_1с(tf);
					if(mts[ts].fields[tf].type.is_ref && r[syn+"_Key"])
						syn+="_Key";
					row[tf] = r[syn];
				}
				o[ts].push(row);
			});
		}

		return o;
	};

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
	}
}

var _rest = $p.rest = new Rest();


/**
 * Имя объектов этого менеджера для rest-запросов на сервер<br />
 * Идентификатор формируется по следующему принципу: ПрефиксИмени_ИмяОбъектаКонфигурации_СуффиксИмени
 * - Справочник  Catalog
 * - Документ    Document
 * - Журнал документов   DocumentJournal
 * - Константа   Constant
 * - План обмена ExchangePlan
 * - План счетов ChartOfAccounts
 * - План видов расчета  ChartOfCalculationTypes
 * - План видов характеристик    ChartOfCharacteristicTypes
 * - Регистр сведений    InformationRegister
 * - Регистр накопления  AccumulationRegister
 * - Регистр расчета CalculationRegister
 * - Регистр бухгалтерии AccountingRegister
 * - Бизнес-процесс  BusinessProcess
 * - Задача  Task
 * @property rest_name
 * @type String
 */
DataManager.prototype._define("rest_name", {
	get : function(suffix){
		var fp = this.class_name.split("."),
			csyn = {cat: "Catalog", doc: "Document", ireg: "InformationRegister", areg: "AccumulationRegister"};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]) + (suffix || "");
	},
	enumerable : false
});

/**
 * Загружает список объектов из rest-сервиса
 * @param attr {Object} - параметры сохранения
 * @param attr.[url] {String}
 * @param attr.[username] {String}
 * @param attr.[password] {String}
 * @param attr.[filter] {String} - строка условия отбора
 * @param attr.[top] {Number} - максимальное число загружаемых записей
 * @return {Promise.<T>} - промис с массивом загруженных объектов
 * @async
 */
DataManager.prototype.load_rest = function (attr) {

	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000";
	//a/unf/odata/standard.odata/Document_ЗаказПокупателя?allowedOnly=true&$format=json&$select=Ref_Key,DataVersion

	return _rest.ajax_to_data(attr, this);

};

DataManager.prototype.rest_tree = function (attr) {

};

DataManager.prototype.rest_selection = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = [],
		ares = [], o, ro, syn, mf,
		select = list_flds();


	function list_flds(){
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
			syn = _md.syns_1с(fld);
			if(_md.get(t.class_name, fld).type.is_ref)
				syn += "_Key";
			s += "," + syn;
		});

		flds.push("ref");
		flds.push("deleted");

		return s;

	}

	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000&" + select;

	attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {};
				flds.forEach(function (fld) {
					if(fld == "ref"){
						o[fld] = ro["Ref_Key"];
					}else{
						syn = _md.syns_1с(fld);
						mf = _md.get(t.class_name, fld);
						if(mf.type.is_ref)
							syn += "_Key";

						if(mf.type.date_part)
							o[fld] = $p.dateFormat(ro[syn], $p.dateFormat.masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!ro[syn] || ro[syn] == $p.blank.guid)
								o[fld] = "";
							else{
								var mgr	= _md.value_mgr(o, fld, mf.type, false, ro[syn]);
								if(mgr)
									o[fld] = mgr.get(ro[syn]).presentation;
								else
									o[fld] = "";
							}
						}else
							o[fld] = ro[syn];
					}
				});
				ares.push(o);
			}
			return data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(filter){

	if(!filter.period)
		filter.period = $p.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.dateFormat(filter.period, $p.dateFormat.masks.isoDateTime) + "'",
		condition = "";

	for(var fld in cmd.dimensions){

		if(filter[fld] === undefined)
			continue;

		var syn = _md.syns_1с(fld);
		if(cmd.dimensions[fld].type.is_ref){
			syn += "_Key";
			if(condition)
				condition+= " and ";
			condition+= syn+" eq guid'"+filter[fld].ref+"'";
		}else{
			if(condition)
				condition+= " and ";

			if(cmd.dimensions[fld].type.digits)
				condition+= syn+" eq "+$p.fix_number(filter[fld]);

			else if(cmd.dimensions[fld].type.date_part)
				condition+= syn+" eq datetime'"+$p.dateFormat(filter[fld], $p.dateFormat.masks.isoDateTime)+"'";

			else
				condition+= syn+" eq '"+filter[fld]+"'";
		}

	}

	if(condition)
		period+= ",Condition='"+condition+"'";

	$p.ajax.default_attr(filter, $p.job_prm.rest_url());
	filter.url += this.rest_name + "/SliceLast(%sl)?allowedOnly=true&$format=json&$top=1000".replace("%sl", period);

	return _rest.ajax_to_data(filter, t)
		.then(function (data) {
			return t.load_array(data);
		});
};

/**
 * Сериализует объект данных в формат xml/atom (например, для rest-сервиса 1С)
 * @param [ex_meta] {Object} - метаданные внешней базы (например, УНФ).
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
				v = v.name;
			else if(v instanceof DataObj){
				pname+= '_Key';
				v = v.ref;
			}else if(mf.type.date_part)
				v = $p.dateFormat(v, $p.dateFormat.masks.atom);

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
 * Сохраняет объект в базе rest-сервиса
 * @param attr {Object} - параметры сохранения
 * @param attr.url {String}
 * @param attr.username {String}
 * @param attr.password {String}
 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param attr.[operational] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>}
 * @async
 */
DataObj.prototype.save_rest = function (attr) {

	attr.url += this._manager.rest_name;

	// проверяем наличие ссылки в базе приёмника



	//HTTP-заголовок 1C_OData_DataLoadMode=true
	//Post?PostingModeOperational=false.
	return Promise.resolve(this);

};

/**
 * Читает объект из rest-сервиса
 * @return {Promise.<T>} - промис с загруженным объектом
 */
DataObj.prototype.load_rest = function () {

	var attr = {},
		tObj = this;
	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += tObj._manager.rest_name + "(guid'" + tObj.ref + "')?$format=json";

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			return tObj._mixin(_rest.to_data(res, tObj._manager));
		});
};
/* joined by builder */
/**
 * Процедуры импорта и экспорта данных
 * @module metadata
 * @submodule import_export
 * @requires common
 */


/**
 * Осуществляет экспорт данных в файл или в строковую переменную или на сервер
 * - Экспортироваться может как единичный объект, так и коллекция объектов
 * - В параметрах метода либо интерактивно могут задаваться правила экспорта, такие как:
 *   - Формат формируемого файла (json, xlsx, sql)
 *   - Дополнять ли формируемый файл информацией о метаданных (типы и связи полей)
 *   - Включать ли в формируемый файл данные связанных объектов<br />(например, выгружать вместе с заказом объекты номенклатуры и характеристик)
 *
 * @method export
 * @for DataManager
 * @param attr {Object} - параметры экспорта
 * @param [attr.pwnd] {dhtmlXWindows} - указатель на родительскую форму
 */
DataManager.prototype.export = function(attr){

	if(attr && "string" === typeof attr)
		attr = {items: attr.split(",")};
	else if(!attr)
		attr = {items: []};


	var _mgr = this, pwnd = attr.pwnd, wnd,
		options = {
			name: 'export',
			wnd: {
				top: 130,
				left: 200,
				width: 470,
				height: 300
			}
		};

	// читаем объект из локального SQL или из 1С
	frm_create();


	/**
	 * ПриСозданииНаСервере()
	 */
	function frm_create(){

		$p.wsql.restore_options("data_manager", options);
		options.wnd.caption = "Экспорт " + _mgr.family_name + " '" + (_mgr.metadata().synonym || _mgr.metadata().name) + "'";

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd.bottom_toolbar({
			buttons: [
				{name: 'btn_cancel', img: 'tb_delete.png', text: 'Отмена', title: 'Отмена', width:'80px', float: 'right'},
				{name: 'btn_ok', img: 'save.png', b: 'Ок', title: 'Выполнить экспорт', width:'50px', float: 'right'}],
			onclick: function (name) {
					if(name == 'btn_ok')
						do_export();
					else
						wnd.close();
					return false;
				}
			});


		wnd.button('close').show();
		wnd.button('park').hide();
		wnd.attachEvent("onClose", frm_close);

		var str = [
			{ type:"fieldset" , name:"form_range", label:"Выгрузить", offsetLeft:"20", list:[
				{ type:"settings" , labelWidth:300, labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"range", label:"Выделенные строки", value:"selected"  },
				{ type:"radio" , name:"range", label:"Весь справочник", value:"all"  }
			]},
			{ type:"block" , name:"form_block_1", list:[
				{ type:"fieldset" , name:"fieldset_format", label:"Формат файла", list:[
					{ type:"settings" , labelWidth:60, labelAlign:"left", position:"label-right"  },
					{ type:"radio" , name:"format", label:"json", value:"json", tooltip: "Выгрузить в формате JSON"  },
					{ type:"radio" , name:"format", label:"xlsx", value:"xlsx", tooltip: "Выгрузить в офисном формате XLSX" }

				]  },
				{ type:"newcolumn"   },
				{ type:"fieldset" , name:"form_fieldset_2", label:"Дополнительно выгрузить", offsetLeft:"10", list:[
					{ type:"settings" , position:"label-right"  },
					{ type:"checkbox" , name:"meta", label:"Описание метаданных", labelAlign:"left", position:"label-right", checked: options.meta  },
					{ type:"checkbox" , name:"relation", label:"Связанные объекты по ссылкам", position:"label-right", checked: options.relation, tooltip: "Пока не реализовано" }
				]  }
			]}


		];
		wnd.elmnts.frm = wnd.attachForm(str);

		wnd.elmnts.frm.setItemValue("range", options.range || "all");

		if(attr.items && attr.items.length == 1){
			if(attr.obj)
				wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + attr.items[0].presentation);
			else
				_mgr.get(attr.items[0], true).then(function (Obj) {
					wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + Obj.presentation);
				});
			wnd.elmnts.frm.setItemValue("range", "selected");

		}else if(attr.items && attr.items.length)
			wnd.elmnts.frm.setItemLabel("range", "selected", "Выделенные строки (" + attr.items.length + " элем.)");

		if(_mgr instanceof DocManager)
			wnd.elmnts.frm.setItemLabel("range", "all", "Все документы из кеша (0 элем.)");


		wnd.elmnts.frm.setItemValue("format", options.format || "json");

		wnd.elmnts.frm.attachEvent("onChange", set_availability);

		set_availability();

	}

	function set_availability(){

		wnd.elmnts.frm.setItemValue("relation", false);
		wnd.elmnts.frm.disableItem("relation");

		if(wnd.elmnts.frm.getItemValue("format") == "json"){
			wnd.elmnts.frm.enableItem("meta");

		}else if(wnd.elmnts.frm.getItemValue("format") == "sql"){
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}else{
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}
	}

	function refresh_options(){
		options.format = wnd.elmnts.frm.getItemValue("format");
		options.range = wnd.elmnts.frm.getItemValue("range");
		options.meta = wnd.elmnts.frm.getItemValue("meta");
		options.relation = wnd.elmnts.frm.getItemValue("relation");
		return options;
	}

	function do_export(){

		refresh_options();

		function export_xlsx(){
			if(attr.obj)
				alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM ?", [attr.items[0]._obj]);
			else
				alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM " + _mgr.table_name);
		}

		var res = {meta: {}, items: {}},
			items = res.items[_mgr.class_name] = [];

		//$p.wsql.aladb.tables.refs.data.push({ref: "dd274d11-833b-11e1-92c2-8b79e9a2b61c"})
		//alasql('select * from cat_cashboxes where ref in (select ref from refs)')

		if(options.meta)
			res.meta[_mgr.class_name] = _mgr.metadata();

		if(options.format == "json"){

			if(attr.obj)
				items.push(attr.items[0]._obj);
			else
				_mgr.each(function (o) {
					if(options.range == "all" || attr.items.indexOf(o.ref) != -1)
						items.push(o._obj);
				});

			if(attr.items.length && !items.length)
				_mgr.get(attr.items[0], true).then(function (Obj) {
					items.push(Obj._obj);
					alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));
				});

			else
				alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));

		}else if(options.format == "xlsx"){
			if(!window.xlsx)
				$p.load_script("lib/xlsx.core.min.js", "script", export_xlsx);
			else
				export_xlsx();

		}else{
			//alasql("SELECT * INTO SQL('"+_mgr.table_name+".sql') FROM " + _mgr.table_name);
			$p.msg.show_not_implemented();
		}

	}

	function frm_close(win){

		$p.iface.popup.hide();
		wnd.wnd_options(options.wnd);
		$p.wsql.save_options("data_manager", refresh_options());

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		return true;
	}


};


/* joined by builder */
/**
 * Форма обновления кеша appcache
 */

function wnd_appcache ($p) {
	var _appcache = $p.iface.appcache = {},
		_stepper;

	_appcache.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_appcache.update = function(){
		_stepper.frm_appcache.setItemValue("text_processed", "Обработано элементов: " + _stepper.loaded + " из " + _stepper.total);

	};

	_appcache.close = function(){
		if(_stepper && _stepper.wnd_appcache){
			_stepper.wnd_appcache.close();
			delete _stepper.wnd_appcache;
		}
	};


	function frm_create(){
		_stepper.wnd_appcache = $p.iface.w.createWindow('wnd_appcache', 0, 0, 490, 250);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_script },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_appcache = _stepper.wnd_appcache.attachForm(str);
		_stepper.frm_appcache.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.wnd_appcache.setText($p.msg.long_operation);
		_stepper.wnd_appcache.denyResize();
		_stepper.wnd_appcache.centerOnScreen();
		_stepper.wnd_appcache.button('park').hide();
		_stepper.wnd_appcache.button('minmax').hide();
		_stepper.wnd_appcache.button('close').hide();
	}

}
/* joined by builder */
/**
 * Форма окна длительной операции
 */

$p.iface.wnd_sync = function() {

	var _sync = $p.iface.sync = {},
		_stepper;

	_sync.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_sync.update = function(cats){
		_stepper.frm_sync.setItemValue("text_processed", "Обработано элементов: " + _stepper.step * _stepper.step_size + " из " + _stepper.count_all);
		var cat_list = "", md, rcount = 0;
		for(var cat_name in cats){
			rcount++;
			if(rcount > 4)
				break;
			if(cat_list)
				cat_list+= "<br />";
			md = $p.cat[cat_name].metadata();
			cat_list+= (md.list_presentation || md.synonym) + " (" + cats[cat_name].length + ")";
		}
		_stepper.frm_sync.setItemValue("text_current", "Текущий запрос: " + _stepper.step + " (" + Math.round(_stepper.step * _stepper.step_size * 100 / _stepper.count_all) + "%)");
		_stepper.frm_sync.setItemValue("text_bottom", cat_list);

	};

	_sync.close = function(){
		if(_stepper && _stepper.wnd_sync){
			_stepper.wnd_sync.close();
			delete _stepper.wnd_sync;
		}
	};


	/**
	 *	Приватные методы
	 */
	function frm_create(){

		// параметры открытия формы
		var options = {
			name: 'wnd_sync',
			wnd: {
				id: 'wnd_sync',
				top: 130,
				left: 200,
				width: 496,
				height: 290,
				modal: true,
				center: true,
				caption: $p.msg.long_operation
			}
		};

		_stepper.wnd_sync = $p.iface.dat_blank(null, options.wnd);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_data },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_sync = _stepper.wnd_sync.attachForm(str);
		_stepper.frm_sync.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.frm_sync.setItemValue("text_processed", "Подготовка данных");
		_stepper.frm_sync.setItemValue("text_bottom", "Загружается структура таблиц...");
	}
}
/* joined by builder */
/**
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, отчетов и обработок<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module metadata
 * @submodule wnd_obj
 */


/**
 * Форма объекта данных
 * @method form_obj
 * @for DataManager
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_obj = function(pwnd, attr){

	// если существует переопределенная форма, открываем её
	var frm = require("wnd/wnd_" + this.class_name.replace('.', "_") + "_obj");
	if(frm)
		return frm($p, pwnd, attr);

	var _mgr = this,
		o = attr.o,
		cmd = _mgr.metadata(),
		wnd;

	// читаем объект из локального SQL или получаем с сервера
	if($p.is_data_obj(o))
		initialize();
	else{
		pwnd.progressOn();

		_mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				pwnd.progressOff();
				initialize();
			})
			.catch(function (err) {
				pwnd.progressOff();
				console.log(err);
			});
	}


	/**
	 * инициализация до создания формы, но после чтения объекта
	 */
	function initialize(){

		// создаём форму
		wnd = $p.iface.w.createWindow(_mgr.class_name, 0, 0, 900, 600);

		/**
		 * перезаполняет шапку и табчасть документа данными "attr"
		 * @param [attr] {object}
		 */
		wnd.reflect_change = function(attr){
			if(attr)
				o._mixin(attr);
			refresh_tabulars();
			header_refresh();
		};

		// настраиваем форму
		frm_create();

	}

	/**
	 * ПриСозданииНаСервере()
	 */
	function frm_create(){

		wnd.elmnts = {};
		wnd.modified = false;

		wnd.setText((cmd.obj_presentation || cmd.synonym) + ': ' + o.presentation);
		wnd.centerOnScreen();
		wnd.button('stick').hide();
		wnd.button('park').hide();
		wnd.attachEvent("onClose", frm_close);
		$p.bind_help(wnd);


		/**
		 *	Закладки: шапка и табличные части
		 */
		wnd.elmnts.frm_tabs = wnd.attachTabbar();
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};
		if(!o.is_folder){
			for(var ts in cmd.tabular_sections){
				if(ts==="extra_fields")
					continue;

				if(o[ts] instanceof TabularSection){

					// настройка табличной части
					tabular_init(ts);
				}
			}
		}
		wnd.attachEvent("onResizeFinish", function(win){
			wnd.elmnts.pg_header.enableAutoHeight(false,wnd.elmnts.tabs.tab_header._getHeight()-20,true);
		});

		/**
		 *	закладка шапка
		 */
		wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachPropertyGrid();
		wnd.elmnts.pg_header.setDateFormat("%d.%m.%Y %H:%i");
		wnd.elmnts.pg_header.init();
		wnd.elmnts.pg_header.loadXMLString(_mgr.get_property_grid_xml(null, o), function(){
			wnd.elmnts.pg_header.enableAutoHeight(false,wnd.elmnts.tabs.tab_header._getHeight()-20,true);
			wnd.elmnts.pg_header.setSizes();
			wnd.elmnts.pg_header.setUserData("", "source", {
				o: o,
				wnd: wnd,
				grid: wnd.elmnts.pg_header,
				on_select: $p.iface.pgrid_on_select,
				grid_on_change: header_change
			});
			wnd.elmnts.pg_header.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
			wnd.elmnts.pg_header.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
		});

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.frm_toolbar.loadStruct(require("toolbar_obj"), function(){
			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", toolbar_click);

			if(o.hasOwnProperty("posted")){
				this.enableItem("btn_post");
				this.enableItem("btn_unpost");
			}else{
				this.hideItem("btn_post");
				this.hideItem("btn_unpost");
			}

			// добавляем команды печати
			var pp = cmd["printing_plates"];
			for(var pid in pp)
				this.addListOption("bs_print", pid, "~", "button", pp[pid]);

			// попап для присоединенных файлов
			wnd.elmnts.vault_pop = new dhtmlXPopup({
				toolbar: this,
				id: "btn_files"
			});
			wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

		});


	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_add_row")
			add_row();

		else if(btn_id=="btn_delete_row")
			del_row();

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o.ref, btn_id, wnd);

		else if(btn_id=="btn_import")
			$p.msg.show_not_implemented();

		else if(btn_id=="btn_export")
			_mgr.export(o.ref);

	}

	/**
	 * показывает список связанных документов
	 */
	function go_connection(){
		$p.msg.show_not_implemented();
	}

	/**
	 * создаёт и показывает диалог присоединенных файлов
	 */
	function show_vault(){

		if (!wnd.elmnts.vault) {

			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				uploadUrl:  $p.job_prm.hs_url() + "/files/?class_name=" + _mgr.class_name + "&ref=" + o.ref,
				buttonClear: false,
				autoStart: true,
				filesLimit: 10
			});
			wnd.elmnts.vault.conf.wnd = wnd;

			// действия после загрузки файла
			wnd.elmnts.vault.attachEvent("onUploadFile", function(v, e){


			});

			// действия перед загрузкой файла
			wnd.elmnts.vault.attachEvent("onBeforeFileAdd", function(file){
				if(file.size <= this.getMaxFileSize())
					return true;
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.file_size + this._readableSize(this.getMaxFileSize()),
					title: $p.msg.main_title});
				return false;
			});

			// действия перед удалением файла
			wnd.elmnts.vault.attachEvent("onBeforeFileRemove", function(file){

				if(wnd.elmnts.vault.file_data[file.id].delete_confirmed)
					return true;

				dhtmlx.confirm({
					title: $p.msg.main_title,
					text: $p.msg.file_confirm_delete + file.name,
					cancel: "Отмена",
					callback: function(btn) {
						if(btn)
							$p.ajax.post_ex(wnd.elmnts.vault.actionUrl(file.id, "drop"), "", true)
								.then(function(req){
									wnd.elmnts.vault.file_data[file.id].delete_confirmed = true;
									wnd.elmnts.vault._removeFileFromQueue(file.id);
								});
					}
				});
				return false;

			});

			// обновляем список присоединенных файлов

		}

	}


	/**
	 * Перечитать табчасть продукции из объекта
	 */
	function refresh_tabulars(){
		for(var ts in cmd.tabular_sections){
			if(ts !== "extra_fields" && o[ts] instanceof TabularSection){
				o[ts].sync_grid(wnd.elmnts["grid_" + name]);
			}
		}
	}


	/**
	 * обработчик выбора значения в таблице продукции (ссылочные типы)
	 */
	function tabular_on_value_select(selv){

		if(selv===undefined)
			return;

		var ret_code = _mgr.handle_event(o, "value_change", {
				field: this.col,
				value: selv,
				tabular_section: this.tabular_section,
				grid: wnd.elmnts["grid_" + this.tabular_section],
				row: this.row,
				wnd: wnd
			});

		if(typeof ret_code !== "boolean"){
			this.row[this.col] = selv;
			this.cell.setValue(selv.presentation);
		}
	}

	/**
	 * обработчик изменения значения в таблице продукции (примитивные типы)
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var source = this.getUserData("", "source"),
			row = o[source.tabular_section].get(rId-1),
			fName = source.fields[cInd],
			ret_code = _mgr.handle_event(o, "value_change", {
				field: fName,
				value: nValue,
				tabular_section: source.tabular_section,
				grid: this,
				row: row,
				cell: this.cells(rId, cInd),
				wnd: wnd
			});

		if(typeof ret_code !== "boolean"){
			row[fName] = $p.fetch_type(nValue, row._metadata.fields[fName].type);
			ret_code = true;
		}

		return ret_code;
	}

	/**
	 * дополнительный обработчик изменения значения в шапке документа (ссылочные и примитивные типы)
	 */
	function header_change(f, selv){
		_mgr.handle_event(o, "value_change", {
			field: f,
			value: selv,
			tabular_section: "",
			grid: this,
			cell: this.cells(),
			wnd: wnd
		})
	}

	/**
	 * настройка (инициализация) табличной части продукции
	 */
	function tabular_init(name){

		// с помощью метода ts_captions(), выясняем, надо ли добавлять данную ТЧ и формируем описание колонок табчасти
		var source = {
				o: o,
				wnd: wnd,
				on_select: tabular_on_value_select,
				tabular_section: name
			};
		if(!_md.ts_captions(_mgr.class_name, name, source))
			return;

		// закладка табов табличной части
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+cmd.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);


		// панель инструментов табличной части
		var tb = wnd.elmnts["tb_" + name] = wnd.elmnts.tabs['tab_'+name].attachToolbar();
		tb.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		tb.loadStruct(require("toolbar_add_del"), function(){
			this.attachEvent("onclick", toolbar_click);
		});

		// собственно табличная часть
		var grid = wnd.elmnts["grid_" + name] = wnd.elmnts.tabs['tab_'+name].attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setHeader(source.headers);
		if(source.min_widths)
			grid.setInitWidths(source.widths);
		if(source.min_widths)
			grid.setColumnMinWidth(source.min_widths);
		if(source.aligns)
			grid.setColAlign(source.aligns);
		grid.setColSorting(source.sortings);
		grid.setColTypes(source.types);
		grid.setColumnIds(source.fields.join(","));
		grid.enableAutoWidth(true, 1200, 600);
		grid.enableEditTabOnly(true);

		grid.init();

		grid.setUserData("", "source", source);
		grid.attachEvent("onEditCell", tabular_on_edit);

		o[name].sync_grid(grid);
	}


	/**
	 * перечитывает реквизиты шапки из объекта в гриды
	 */
	function header_refresh(){
		function reflect(id){
			if(typeof id == "string"){
				var fv = o[id]
				if(fv != undefined){
					if($p.is_data_obj(fv))
						this.cells(id, 1).setValue(fv.presentation);
					else if(fv instanceof Date)
						this.cells(id, 1).setValue($p.dateFormat(fv, ""));
					else
						this.cells(id, 1).setValue(fv);

				}else if(id.indexOf("extra_fields") > -1){
					var row = o["extra_fields"].find(id.split("|")[1]);
				}
			}
		}
		wnd.elmnts.pg_header.forEachRow(function(id){	reflect.call(wnd.elmnts.pg_header, id); });
	}

	function tabular_new_row(){
		var row = o["production"].add({qty: 1, quantity: 1, discount_percent_internal: $p.wsql.get_user_param("discount", "number")});
		refresh_tabulars();
		wnd.elmnts.detales_grid.selectRowById(row.row);
		return row;
	}

	function tabular_get_sel_index(){
		var selId = wnd.elmnts.detales_grid.getSelectedRowId();
		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;
		$p.msg.show_msg({type: "alert-warning",
			text: $p.msg.no_selected_row.replace("%1", "Продукция"),
			title: cmd["obj_presentation"] + ': ' + o.presentation});
	}

	function del_row(){

		var rId = tabular_get_sel_index(), row;

		if(rId == undefined)
			return;
		else
			row = o["production"].get(rId);


		//wnd.progressOn();
		//_mgr.save({
		//	ref: o.ref,
		//	del_row: rId,
		//	o: o._obj,
		//	action: "calc",
		//	specify: "production"
		//}).then(function(res){
		//	if(!$p.msg.check_soap_result(res))			// сервер об ошибках не сообщил. считаем, что данные записались
		//		wnd.reflect_change(res); // - перезаполнить шапку и табчасть
		//	wnd.progressOff();
		//});
	}

	function save(action){

		function do_save(){

			//wnd.progressOn();
			//_mgr.save({
			//	ref: o.ref,
			//	o: o._obj,
			//	action: "calc"
			//});
		}

		do_save();

		if(action == "close")
			wnd.close();
	}

	function frm_close(win){

		if (wnd.elmnts.vault)
			wnd.elmnts.vault.unload();

		if (wnd.elmnts.vault_pop)
			wnd.elmnts.vault_pop.unload();

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		return true;
	}


	/**
	 * добавляет строку табчасти
	 */
	function add_row(){
		var row = tabular_new_row(), cell, grid = wnd.elmnts.detales_grid;
		grid.selectCell(row.row-1, grid.getColIndexById("nom"), false, true, true);
		cell = grid.cells();
		cell.edit();
		cell.open_selection();
	}

}
/* joined by builder */
/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module  wnd_selection
 */

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_selection = function(pwnd, attr){

	var _mngr = this,
		md = _mngr.metadata(),
		has_tree = md["hierarchical"] && !(_mngr instanceof ChartOfAccountManager),
		wnd, s_col = 0,
		a_direction = "asc",
		previous_filter = {};


	// создаём и настраиваем форму
	if(has_tree && attr.initial_value && attr.initial_value!= $p.blank.guid && !attr.parent)
		_mngr.get(attr.initial_value, true)
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				frm_create();
			});
	else
		frm_create();


	/**
	 *	раздел вспомогательных функций
	 */

	/**
	 * аналог 1С-ного ПриСозданииНаСервере()
	 */
	function frm_create(){

		// создаём и растраиваем форму
		if(pwnd instanceof dhtmlXLayoutCell) {
			wnd = pwnd;
			wnd.showHeader();
			wnd.close = function () {
				(wnd || pwnd).detachToolbar();
				(wnd || pwnd).detachStatusBar();
				(wnd || pwnd).detachObject(true);
				frm_unload();
			};
		}else{
			wnd = $p.iface.w.createWindow('wnd_' + _mngr.class_name.replace(".", "_") + '_select', 0, 0, 900, 600);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.bind_help(wnd);
		wnd.setText('Список ' + (_mngr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (md["list_presentation"] || md.synonym) + '"');

		dhtmlxEvent(document.body, "keydown", body_keydown);

		// статусбар
		wnd.elmnts = {
			status_bar: wnd.attachStatusBar()
		};
		wnd.elmnts.status_bar.setText("<div id='" + _mngr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");

		// командная панель формы

		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.toolbar.loadStruct(require("toolbar_selection"), function(){

			this.attachEvent("onclick", toolbar_click);

			// текстовое поле фильтра по подстроке
			wnd.elmnts.filter = new $p.iface.Toolbar_filter({
				manager: _mngr,
				toolbar: this,
				onchange: input_filter_change
			});

			if(!pwnd.on_select && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper"){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				this.addListOption("bs_more", "btn_order_list", "~", "button", "Список заказов", "tb_autocad.png");
				this.addListOption("bs_more", "btn_import", "~", "button", "Загрузить из файла", "document_load.png");
				this.addListOption("bs_more", "btn_export", "~", "button", "Выгрузить в файл", "document_save.png");

			}else{
				this.disableItem("btn_new");
				this.disableItem("btn_edit");
				this.disableItem("btn_delete");
			}

			//
			create_tree_and_grid();
		});
	}

	/**
	 * Устанавливает фокус в поле фильтра
	 * @param evt {KeyboardEvent}
	 * @return {Boolean}
	 */
	function body_keydown(evt){
		if(wnd && (evt.keyCode == 113 || evt.keyCode == 115)){ //"F2" или "F4"
			setTimeout(function(){
				wnd.elmnts.filter.input_filter.focus();
			}, 0);
			return $p.cancel_bubble(evt);
		}
	}

	function input_filter_change(flt){
		if(has_tree){
			if(flt.filter)
				wnd.elmnts.cell_tree.collapse();
			else
				wnd.elmnts.cell_tree.expand();
		}
		wnd.elmnts.grid.reload();
	}

	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;

		if(has_tree){
			layout = wnd.attachLayout('2U');

			cell_grid = layout.cells('b');
			cell_grid.hideHeader();
			grid = wnd.elmnts.grid = cell_grid.attachGrid();

			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();
			cell_tree.setCollapsedText("Дерево");
			tree = wnd.elmnts.tree = cell_tree.attachTree();
			tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
			tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
			tree.enableKeyboardNavigation(true);
			tree.attachEvent("onSelect", function(){	// довешиваем обработчик на дерево
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					grid.reload();
			});

			// !!! проверить закешированность дерева
			// !!! для неиерархических справочников дерево можно спрятать
			$p.cat.load_soap_to_grid({
				action: "get_tree",
				class_name: _mngr.class_name
			}, wnd.elmnts.tree, function(){
				setTimeout(function(){ grid.reload(); }, 20);
			});

		}else{
			cell_grid = wnd;
			grid = wnd.elmnts.grid = wnd.attachGrid();
			setTimeout(function(){ grid.reload(); }, 20);
		}

		// настройка грида
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setPagingWTMode(true,true,true,[20,30,60]);
		grid.enablePaging(true, 30, 8, _mngr.class_name.replace(".", "_") + "_select_recinfoArea");
		grid.setPagingSkin("toolbar", dhtmlx.skin);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = get_filter(start,count);
			if(!filter)
				return;
			$p.cat.load_soap_to_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			var tree_row_index=null;
			if(tree)
				tree_row_index = tree.getIndexById(rId);
			if(tree_row_index!=null)
				tree.selectItem(rId, true);
			else select(rId);
		});

		if($p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		// эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){
			var filter = get_filter();
			if(!filter) return;
			cell_grid.progressOn();
			grid.clearAll();
			$p.cat.load_soap_to_grid(filter, grid, function(xml){
				if(typeof xml === "object"){
					$p.msg.check_soap_result(xml);

				}else if(!grid_inited){
					if(filter.initial_value){
						var xpos = xml.indexOf("set_parent"),
							xpos2 = xml.indexOf("'>", xpos),
							xh = xml.substr(xpos+12, xpos2-xpos-12);
						if($p.is_guid(xh)){
							if(has_tree){
								tree.do_not_reload = true;
								tree.selectItem(xh, false);
							}
						}
						grid.selectRowById(filter.initial_value);

					}else if(filter.parent && $p.is_guid(filter.parent) && has_tree){
						tree.do_not_reload = true;
						tree.selectItem(filter.parent, false);
					}
					grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
					grid.enableAutoWidth(true, 1200, 600);
					grid.setSizes();
					grid_inited = true;
					wnd.elmnts.filter.input_filter.focus();
				}
				if (a_direction && grid_inited)
					grid.setSortImgState(true, s_col, a_direction);
				cell_grid.progressOff();
			});
		};
	}

	/**
	 *	@desc: 	обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_select"){
			select();
		}else if(btn_id=="btn_new"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_edit"){
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if(rId)
				$p.iface.set_hash(_mngr.class_name, rId);
			else
				$p.msg.show_msg({type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title});

		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");

		}else if(btn_id=="btn_delete"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_import"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_export"){
			_mngr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
			wnd.elmnts.grid.reload();

		}
	}

	/**
	 * выбор значения в гриде
	 * @param rId - идентификтор строки грида
	 */
	function select(rId){

		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();

		// запрещаем выбирать папки
		if(wnd.elmnts.tree && wnd.elmnts.tree.getIndexById(rId) != null){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		if(rId && pwnd.on_select){
			var fld = _mngr.get(rId);
			wnd.close();
			pwnd.on_select.call(pwnd.grid || pwnd, fld);
		}
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(){
		_mngr = null;
		wnd = null;
		md = null;
		previous_filter = null;
		document.body.removeEventListener("keydown", body_keydown);
	}

	function frm_close(win){
		// проверить на ошибки, записать изменения
		// если проблемы, вернуть false

		setTimeout(frm_unload, 10);

		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		return true;
	}

	/**
	 *	@desc: 	формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 *			переопределяется в каждой форме
	 *	@param:	start, count - начальная запись и количество записей
	 */
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					class_name: _mngr.class_name,
					order_by: s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				})
				._mixin(attr),

			tparent = has_tree ? wnd.elmnts.tree.getSelectedItemId() : null;

		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.blank.guid;

		for(var f in filter){
			if(previous_filter[f] != filter[f]){
				previous_filter = filter;
				return filter;
			}
		}
	}

	function customColumnSort(ind){
		var a_state = wnd.elmnts.grid.getSortingState();
		s_col=ind;
		a_direction = ((a_state[1] == "des")?"asc":"des");
		wnd.elmnts.grid.reload();
		return true;
	}

	return wnd;
};

/**
 * Форма списка объектов данных
 * @method form_list
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_list = function(pwnd, attr){
	return this.form_selection(pwnd, attr);
};
/* joined by builder */
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
						}, 100);
					});
				else
					location_callback();
			}


			// создавать dhtmlXWindows можно только после готовности документа
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
			setTimeout(function(){
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
						setTimeout(iface.oninit, 100);


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
			}, 100);


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

	if($p.job_prm.offline || !$p.job_prm.data_url)
		return;

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
		}).catch(function (err) {
			console.log(err);
		})
};


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
	else if($p.job_prm.rest)
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
			_cch[class_name].load_array(res.cch[class_name]);

		for(class_name in res.cacc)
			_cacc[class_name].load_array(res.cacc[class_name]);

		for(class_name in res.cat)
			_cat[class_name].load_array(res.cat[class_name]);

		for(class_name in res.doc)
			_doc[class_name].load_array(res.doc[class_name]);

		for(class_name in res.ireg)
			_ireg[class_name].load_array(res.ireg[class_name]);

		for(class_name in res.areg)
			_areg[class_name].load_array(res.areg[class_name]);

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
		mdd, data_url = $p.job_prm.data_url || "/data/";

	// информируем о начале операций
	onstep($p.eve.steps.load_meta);

	// читаем файл метаданных
	return $p.ajax.get(data_url + "meta.json?v="+$p.job_prm.files_date)

		// грузим метаданные
		.then(function (req) {
			onstep($p.eve.steps.create_managers);

			// пытаемся загрузить патч метаданных
			return $p.ajax.get(data_url + "meta_patch.json?v="+$p.job_prm.files_date)
				.then(function (rep) {
					return new Meta(req, rep);
				})
				.catch(function () {
					return new Meta(req, rep);
				});
		})

		// авторизуемся на сервере. в автономном режиме сразу переходим к чтению первого файла данных
		.then(function (res) {

			onstep($p.eve.steps.authorization);

			if($p.job_prm.offline)
				return res;

			else if($p.job_prm.rest){
				// в режиме rest тестируем авторизацию
				return $p.ajax.get_ex($p.job_prm.rest_url()+"?$format=json", true);

			}else
				return _load({
					action: "get_meta",
					cache_md_date: $p.wsql.get_user_param("cache_md_date", "number"),
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

			var parts = [];
			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

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

			// здесь же, уточняем список печатных форм и
			_md.printing_plates(mdd.printing_plates);

			// и запоминаем в ajax признак полноправности пользователя
			$p.ajax.root = !!mdd.root;
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
}),
"filesaver": (function (require, exports, module) { /* wrapped by builder */
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2015-05-07.2
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
		// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
		// for the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 500 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob(["\ufeff", blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name) {
			blob = auto_bom(blob);
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab == undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name) {
			return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
		};
	}

	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}
}),
"form_auth": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<items>\n\t<item type=\"settings\" position=\"label-left\" labelWidth=\"150\" inputWidth=\"230\" noteWidth=\"230\"/>\n\t<item type=\"fieldset\" name=\"data\" inputWidth=\"auto\" label=\"Авторизация\">\n\n        <item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" checked=\"true\" value=\"guest\" label=\"Гостевой (демо) режим\">\n            <item type=\"select\" name=\"guest\" label=\"Роль\">\n                <option value=\"Дилер\" label=\"Дилер\"/>\n            </item>\n        </item>\n\n\t\t<item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" value=\"auth\" label=\"Есть учетная запись\">\n\t\t\t<item type=\"input\" value=\"\" name=\"login\" label=\"Имя пользователя\" validate=\"NotEmpty\" />\n\t\t\t<item type=\"password\" value=\"\" name=\"password\" label=\"Пароль\" validate=\"NotEmpty\" />\n\t\t</item>\n\n\t\t<item type=\"button\" value=\"Войти\" name=\"submit\"/>\n\n        <item type=\"template\" name=\"text_options\" className=\"order_dealer_options\" inputWidth=\"231\"\n              value=\"&lt;a href='#' onclick='$p.iface.open_settings();' &gt; &lt;img src='/imgs/dhxtoolbar_web/tb_settings.png' align='top' /&gt; Настройки &lt;/a&gt; &lt;img src='/imgs/dhxtoolbar_web/blank9.png' align='top' /&gt; &lt;a href='//www.oknosoft.ru/feedback' target='_blank' &gt; &lt;img src='/imgs/dhxtoolbar_web/cloud-question.png' align='top' /&gt; Задать вопрос &lt;/a&gt;\"  />\n\n\t</item>\n</items>\n",
"toolbar_add_del": "<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item type=\"button\" id=\"btn_add\"    text=\"Добавить\" title=\"Добавить строку\" img=\"tb_new.png\"  />\r\n    <item type=\"button\" id=\"btn_delete\" text=\"Удалить\"  title=\"Удалить строку\" img=\"tb_delete.png\"   imgdis=\"tb_delete_dis.png\" />\r\n</toolbar>",
"toolbar_obj": "<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item type=\"button\" id=\"btn_save_close\" text=\"Записать и закрыть\" img=\"save.gif\" imgdis=\"\" title=\"Рассчитать, записать и закрыть\" />\r\n    <item type=\"button\" id=\"btn_save\" text=\"Записать\" img=\"tb_calculate.png\" title=\"Рассчитать и записать данные\"/>\r\n    <item type=\"button\" id=\"btn_post\" img=\"tb_post.png\" imgdis=\"tb_post.png\" enabled=\"false\" title=\"Провести документ\" />\r\n    <item type=\"button\" id=\"btn_unpost\" img=\"tb_unpost.png\" imgdis=\"tb_unpost.png\" enabled=\"false\" title=\"Отмена проведения\" />\r\n\r\n    <item type=\"button\" id=\"btn_files\" text=\"Файлы\" img=\"tb_screpka.png\" imgdis=\"tb_screpka_dis.png\" title=\"Присоединенные файлы\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_create_by_virtue\" text=\"Создать\" title=\"Создать на основании\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_message\" enabled=\"false\" text=\"Сообщение\" image=\"\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_go_to\" text=\"Перейти\" title=\"\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_go_connection\" enabled=\"false\" text=\"Связи\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\"         img=\"print.gif\"         text=\"Печать\" openAll=\"true\">\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"        img=\"tb_more_w.png\"  title=\"Дополнительно\" openAll=\"true\">\r\n        <item type=\"button\" id=\"btn_import\" img=\"document_load.png\" text=\"Загрузить из файла\" />\r\n        <item type=\"button\" id=\"btn_export\" img=\"document_save.png\" text=\"Выгрузить в файл\" />\r\n    </item>\r\n\r\n</toolbar>\r\n",
"toolbar_ok_cancel": "<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"btn_ok\"       type=\"button\"   img=\"\"  imgdis=\"\"   text=\"&lt;b&gt;Ок&lt;/b&gt;\"  />\r\n    <item id=\"btn_cancel\"   type=\"button\"\timg=\"\"  imgdis=\"\"   text=\"Отмена\" />\r\n</toolbar>",
"toolbar_selection": "<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"btn_select\"   type=\"button\"   img=\"\"              imgdis=\"\"               title=\"Выбрать элемент списка\" text=\"&lt;b&gt;Выбрать&lt;/b&gt;\"  />\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item id=\"btn_new\"      type=\"button\"\timg=\"tb_new.png\"\timgdis=\"tb_new_dis.png\"\ttitle=\"Создать\" />\r\n    <item id=\"btn_edit\"     type=\"button\"\timg=\"tb_edit.png\"\timgdis=\"tb_edit_dis.png\"\ttitle=\"Изменить\" />\r\n    <item id=\"btn_delete\"   type=\"button\"\timg=\"tb_delete.png\"\timgdis=\"tb_delete_dis.png\"\ttitle=\"Удалить\" />\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"        img=\"tb_more_w.png\"     title=\"Дополнительно\" openAll=\"true\">\r\n\r\n    </item>\r\n\r\n</toolbar>"
},{},{});
