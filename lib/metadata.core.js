/*!
 metadata.js v0.12.231, built:2017-06-26 &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 metadata.js may be freely distributed under the MIT. To obtain _Oknosoft Commercial license_, contact info@oknosoft.ru
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
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */


;"use strict";

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
					if(exclude && exclude.indexOf(f)!=-1){
            continue;
          }
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
	 * @param [exclude] {Array} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	_clone: {
		value: function(exclude, str_date) {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
        if(exclude && exclude.indexOf(p)!=-1){
          continue;
        }
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager){
              c[p] = v;
            }
						else if("object" === typeof v){
              if(v instanceof Date){
                c[p] = str_date ? v.toJSON() : v;
              }
              else{
                c[p] = v._clone(exclude, str_date);
              }
            }
						else{
              c[p] = v;
            }
					}
					else{
            c[p] = v;
          }
				}
			}
			return c;
		}
	}
});

/**
 * Отбрасываем часовой пояс при сериализации даты
 * @method toJSON
 * @for Date
 */
Date.prototype.toJSON = function () {
  return $p.moment(this).format($p.moment._masks.iso);
}

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
				if(!target){
					return;
				}
				if(!target._observers){
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
				}
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
				if(target && target._observers){

					if(!observer){
						target._observers.length = 0;
					}

					for(var i=0; i<target._observers.length; i++){
						if(target._observers[i]===observer){
							target._observers.splice(i, 1);
							break;
						}
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

						if(timer){
							clearTimeout(timer);
						}

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
			value: "0.12.231",
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
		 * Абстрактный поиск значения в коллекции
		 * @method _find
		 * @param a {Array}
		 * @param val {DataObj|String}
		 * @param val {Array|String} - имена полей, в которых искать
		 * @return {*}
		 * @private
		 */
		_find: {
			value: function(a, val, columns){
				//TODO переписать с учетом html5 свойств массивов
				var o, i, finded;
				if(typeof val != "object"){
					for(i in a){ // ищем по всем полям объекта
						o = a[i];
						for(var j in o){
							if(typeof o[j] !== "function" && $p.utils.is_equal(o[j], val))
								return o;
						}
					}
				}else{
					for(i in a){ // ищем по ключам из val
						o = a[i];
						finded = true;
						for(var j in val){
							if(typeof o[j] !== "function" && !$p.utils.is_equal(o[j], val[j])){
								finded = false;
								break;
							}
						}
						if(finded)
							return o;
					}
				}
			}
		},

		/**
		 * Выясняет, удовлетворяет ли объект `o` условию `selection`
		 * @method _selection
		 * @param o {Object}
		 * @param [selection]
		 * @private
		 */
		_selection: {
			value: function (o, selection) {

				var ok = true, j, sel, is_obj;

				if(selection){
					// если отбор является функцией, выполняем её, передав контекст
					if(typeof selection == "function")
						ok = selection.call(this, o);

					else{
						// бежим по всем свойствам `selection`
						for(j in selection){

							sel = selection[j];
							is_obj = sel && typeof(sel) === "object";

							// пропускаем служебные свойства
							if(j.substr(0, 1) == "_")
								continue;

							// если свойство отбора является функцией, выполняем её, передав контекст
							else if(typeof sel == "function"){
								ok = sel.call(this, o, j);
								if(!ok)
									break;

								// если свойство отбора является объектом `or`, выполняем Array.some() TODO: здесь напрашивается рекурсия
							}else if(j == "or" && Array.isArray(sel)){
								ok = sel.some(function (element) {
									var key = Object.keys(element)[0];
									if(element[key].hasOwnProperty("like"))
										return typeof o[key] == "string" && o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
									else
										return $p.utils.is_equal(o[key], element[key]);
								});
								if(!ok)
									break;

								// если свойство отбора является объектом `like`, сравниваем подстроку
							}else if(is_obj && sel.hasOwnProperty("like")){
								if(!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase())==-1){
									ok = false;
									break;
								}

								// если свойство отбора является объектом `not`, сравниваем на неравенство
							}else if(is_obj && sel.hasOwnProperty("not")){
								if($p.utils.is_equal(o[j], sel.not)){
									ok = false;
									break;
								}

								// если свойство отбора является объектом `in`, выполняем Array.some()
							}else if(is_obj && sel.hasOwnProperty("in")){
								ok = sel.in.some(function(element) {
									return $p.utils.is_equal(element, o[j]);
								});
								if(!ok)
									break;

								// если свойство отбора является объектом `lt`, сравниваем на _меньше_
							}else if(is_obj && sel.hasOwnProperty("lt")){
								ok = o[j] < sel.lt;
								if(!ok)
									break;

								// если свойство отбора является объектом `gt`, сравниваем на _больше_
							}else if(is_obj && sel.hasOwnProperty("gt")){
								ok = o[j] > sel.gt;
								if(!ok)
									break;

								// если свойство отбора является объектом `between`, сравниваем на _вхождение_
							}else if(is_obj && sel.hasOwnProperty("between")){
								var tmp = o[j];
								if(typeof tmp != "number")
									tmp = $p.utils.fix_date(o[j]);
								ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
								if(!ok)
									break;

							}else if(!$p.utils.is_equal(o[j], sel)){
								ok = false;
								break;
							}
						}
					}
				}

				return ok;
			}
		},

		/**
		 * ### Поиск массива значений в коллекции
		 * Кроме стандартного поиска по равенству значений,
		 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
		 * @method _find_rows
		 * @param arr {Array}
		 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
		 * @param callback {Function}
		 * @return {Array}
		 * @private
		 */
		_find_rows: {
			value: function(arr, selection, callback){

				var o, res = [], top, count = 0;

				if(selection){
					if(selection._top){
						top = selection._top;
						delete selection._top;
					}else
						top = 1000;
				}

				for(var i in arr){
					o = arr[i];

					// выполняем колбэк с элементом и пополняем итоговый массив
					if($p._selection.call(this, o, selection)){
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
			  if(arguments.length == 2){
          id = arguments[1];
        }
				if(typeof id == "function" && id._evnts){
					id._evnts.forEach(function (id) {
						$p.eve.detachEvent(id);
					});
				}
				else if(!id){
          $p.eve.detachAllEvents();
        }
				else{
          $p.eve.detachEvent(id);
        }
			}
		},

		/**
		 * ### Запись журнала регистрации
		 *
		 * @method record_log
		 * @param err
		 */
		record_log: {
			value: function (err) {
				$p.ireg && $p.ireg.log && $p.ireg.log.record(err);
			}
		},

		/**
		 * ### Mетаданные конфигурации
		 * @property md
		 * @type Meta
		 * @static
		 */
		md: {
			value: new Meta()
		},

		/**
		 * Коллекция менеджеров перечислений
		 * @property enm
		 * @type Enumerations
		 * @static
		 */
		enm: {
			value: new (
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
				})
		},

		/**
		 * Коллекция менеджеров справочников
		 * @property cat
		 * @type Catalogs
		 * @static
		 */
		cat: {
			value: 	new (
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
			)
		},

		/**
		 * Коллекция менеджеров документов
		 * @property doc
		 * @type Documents
		 * @static
		 */
		doc: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров сведений
		 * @property ireg
		 * @type InfoRegs
		 * @static
		 */
		ireg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров накопления
		 * @property areg
		 * @type AccumRegs
		 * @static
		 */
		areg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров бухгалтерии
		 * @property accreg
		 * @type AccountsRegs
		 * @static
		 */
		accreg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров обработок
		 * @property dp
		 * @type DataProcessors
		 * @static
		 */
		dp: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров отчетов
		 * @property rep
		 * @type Reports
		 * @static
		 */
		rep: {
			value: new (
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
				})
		},

		/**
		 * Коллекция менеджеров планов счетов
		 * @property cacc
		 * @type ChartsOfAccounts
		 * @static
		 */
		cacc: {
			value: 	new (

				/**
				 * ### Коллекция менеджеров планов счетов
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
				 *
				 * @class ChartsOfAccounts
				 * @static
				 */
					function ChartsOfAccounts(){
					this.toString = function(){return $p.msg.meta_cacc_mgr};
				})
		},

		/**
		 * Коллекция менеджеров планов видов характеристик
		 * @property cch
		 * @type ChartsOfCharacteristics
		 * @static
		 */
		cch: {
			value: new (

				/**
				 * ### Коллекция менеджеров планов видов характеристик
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
				 *
				 * @class ChartsOfCharacteristics
				 * @static
				 */
					function ChartsOfCharacteristics(){
					this.toString = function(){return $p.msg.meta_cch_mgr};
				})
		},

		/**
		 * Коллекция менеджеров задач
		 * @property tsk
		 * @type Tasks
		 * @static
		 */
		tsk: {
			value: 	new (

				/**
				 * ### Коллекция менеджеров задач
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "TaskManager"}}{{/crossLink}}
				 *
				 * @class Tasks
				 * @static
				 */
					function Tasks(){
					this.toString = function(){return $p.msg.meta_task_mgr};
				})
		},

		/**
		 * Коллекция менеджеров бизнес-процессов
		 * @property bp
		 * @type Tasks
		 * @static
		 */
		bp: {
			value: 	new (

				/**
				 * ### Коллекция бизнес-процессов
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "BusinessProcessManager"}}{{/crossLink}}
				 *
				 * @class BusinessProcesses
				 * @static
				 */
					function BusinessProcesses(){
					this.toString = function(){return $p.msg.meta_bp_mgr};
				})
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

		LogManager: {
			value: LogManager
		},

		MetaObjManager: {
			value: MetaObjManager
		},

		MetaFieldManager: {
			value: MetaFieldManager
		},

		SchemeSettingsManager: {
			value: SchemeSettingsManager
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
		if (mtype.is_ref){
			return this.fix_guid(str);
		}
		if (mtype.date_part){
			return this.fix_date(str, true)
		}
		if (mtype["digits"]){
			return this.fix_number(str, true)
		}
		if (mtype.types && mtype.types[0] == "boolean"){
			return this.fix_boolean(str)
		}
		return str;
	};

	/**
	 * ### Добавляет days дней к дате
	 * и сбрасывает время в 00:00:00
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
			switch (type) {
        case "array" :
          reader.readAsArrayBuffer(blob);
          break;
        case "data_url":
          reader.readAsDataURL(blob);
          break;
        default:
          reader.readAsText(blob);
      }
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

    if(url instanceof Blob){
      Promise.resolve(show_blob({response: url}));
    }
    else if(!method || (typeof method == "string" && method.toLowerCase().indexOf("post")!=-1))
      return this.post_ex(url,
        typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
        true,
        function(xhr){
          xhr.responseType = "blob";
        })
        .then(show_blob);
    else{
      return this.get_ex(url, true, function(xhr){
        xhr.responseType = "blob";
      })
        .then(show_blob);
    }
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
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule wsql
 */


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
		 * ### Поправка времени javascript
		 * @property js_time_diff
		 * @type Number
		 */
		js_time_diff: {
			value: -(new Date("0001-01-01")).valueOf()
		},

		/**
		 * ### Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
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

				if(typeof prm_value == "object"){
					user_params[prm_name] = prm_value;
					prm_value = JSON.stringify(prm_value);
				}
				else if(prm_value === false || prm_value === "false"){
					user_params[prm_name] = false;
					prm_value = "";
				}
				else{
					user_params[prm_name] = prm_value;
				}

				ls.setItem($p.job_prm.local_storage_prefix+prm_name, prm_value);

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

				if(!user_params.hasOwnProperty(prm_name) && ls){
					user_params[prm_name] = this.fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);
				}

				return user_params[prm_name];
			}
		},

		/**
		 * ### Выполняет sql запрос к локальной базе данных
		 *
		 * @method promise
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
		 * ### Сохраняет настройки формы или иные параметры объекта _options_
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
		 * ### Восстанавливает сохраненные параметры в объект _options_
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
		 * ### Приведение типов при операциях с `localStorage`
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
		 * ### Указатель на alasql
		 * @property alasql
		 * @type Function
		 */
		alasql: {
			value: typeof alasql != "undefined" ? alasql : require("alasql")
		},

		/**
		 * ### Создаёт и заполняет умолчаниями таблицу параметров
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
					// if(typeof WorkerGlobalScope === "undefined"){
					// 	ls = new require('node-localstorage').LocalStorage('./localstorage');
					// }
          ls = {
            setItem: function (name, value) {
            },
            getItem: function (name) {
            }
          };
				}
				else{
          ls = localStorage;
        }

				// значения базовых параметров по умолчанию
				var nesessery_params = [
					{p: "user_name",      v: "", t:"string"},
					{p: "user_pwd",       v: "", t:"string"},
					{p: "browser_uid",		v: $p.utils.generate_guid(), t:"string"},
					{p: "zone",           v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t: $p.job_prm.zone_is_string ? "string" : "number"},
					{p: "enable_save_pwd",v: $p.job_prm.enable_save_pwd,	t:"boolean"},
          {p: "couch_direct",   v: $p.job_prm.hasOwnProperty("couch_direct") ? $p.job_prm.couch_direct : true,	t:"boolean"},
					{p: "couch_path",		  v: $p.job_prm.couch_path,	t:"string"},
          {p: "rest_path",		  v: "", t:"string"},
					{p: "skin",		        v: "dhx_web", t:"string"},
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
					if((o.t == "boolean" ? wsql.get_user_param(o.p) : wsql.get_user_param(o.p, o.t)) == undefined ||
						(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
						wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
				});

				// сообщяем движку pouch пути и префиксы
				var pouch_prm = {
					path: wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
					zone: wsql.get_user_param("zone", "number"),
					prefix: $p.job_prm.local_storage_prefix,
					suffix: wsql.get_user_param("couch_suffix", "string") || "",
					direct: wsql.get_user_param("couch_direct", "boolean"),
					user_node: $p.job_prm.user_node,
					noreplicate: $p.job_prm.noreplicate
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

				// создаём таблицы alasql
				if(this.create_tables){
					this.alasq(this.create_tables, []);
					this.create_tables = "";
				}


			}
		},

		/**
		 * ### Удаляет таблицы WSQL
		 * Например, для последующего пересоздания при изменении структуры данных
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

	/**
	 * ### Указатель на aladb
	 * @property aladb
	 * @type alasql.Database
	 */
	this.__define({
		aladb: {
			value: new this.alasql.Database('md')
		}
	});

}

/**
 * Строковые константы интернационализации
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule i18n
 */


/**
 * ### Сообщения пользователю и строки интернационализации
 *
 * @class Messages
 * @static
 * @menuorder 61
 * @tooltip i18n
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
		 * @param attr {object} - атрибуты сообщения attr.type - [info, alert, confirm, modalbox, info-error, alert-warning, confirm-error]
		 * @param [delm] - элемент html в тексте которого сообщение будет продублировано
		 * @example
		 *  $p.msg.show_msg({
		 *      title:"Important!",
		 *      type:"alert-error",
		 *      text:"Error"});
		 */
		this.show_msg = function(attr, delm){
			if(!attr){
        return;
      }
			if(typeof attr == "string"){
				if($p.iface.synctxt){
					$p.iface.synctxt.show_message(attr);
					return;
				}
				attr = {type:"info", text:attr };
			}
			else if(Array.isArray(attr) && attr.length > 1){
        attr = {type: "info", text: '<b>' + attr[0] + '</b><br />' + attr[1]};
      }
			if(delm && typeof delm.setText == "function"){
        delm.setText(attr.text);
      }
			dhtmlx.message(attr);
		};
    dhtmlx.message.position = "bottom";

		/**
		 * Проверяет корректность ответа сервера
		 * @method check_soap_result
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
		 */
		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

if(typeof window !== "undefined" && window.dhx4){
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
 * Строки сообщений и элементов интерфейса
 */
(function (msg){

	// публичные методы, экспортируемые, как свойства $p.msg
	msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

	msg.argument_is_not_ref = "Аргумент не является ссылкой";
	msg.addr_title = "Ввод адреса";

	msg.cache_update_title = "Обновление кеша браузера";
	msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";
	msg.cancel = "Отмена";

	msg.delivery_area_empty = "Укажите район доставки";

	msg.empty_login_password = "Не указаны имя пользователя или пароль";
	msg.empty_response = "Пустой ответ сервера";
	msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";
	msg.error_geocoding = "Ошибка геокодера";

	msg.error_auth = "Авторизация пользователя не выполнена";
	msg.error_critical = "Критическая ошибка";
	msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
	msg.error_network = "Ошибка сети или сервера - запрос отклонен";
	msg.error_rights = "Ограничение доступа";
	msg.error_low_acl = "Недостаточно прав для выполнения операции";

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
	msg.logged_in = "Авторизован под именем: ";
	msg.log_out_title = "Отключиться от сервера?";
	msg.log_out_break = "<br/>Завершить синхронизацию?";
	msg.sync_title = "Обмен с сервером";
	msg.sync_complite = "Синхронизация завершена";

	msg.main_title = "Окнософт: заказ дилера ";
	msg.mark_delete_confirm = "Пометить объект %1 на удаление?";
	msg.mark_undelete_confirm = "Снять пометку удаления с объекта %1?";
	msg.meta = {
		cat: "Справочник",
		doc: "Документ",
		cch: "План видов характеристик",
		cacc: "Планы счетов",
		tsk : "Задача",
		ireg: "Регистр сведений",
		areg: "Регистр накопления",
		bp: "Бизнес процесс",
		ts_row: "Строка табличной части",
		dp: "Обработка",
		rep: "Отчет"
	};
	msg.meta_cat = "Справочники";
	msg.meta_doc = "Документы";
	msg.meta_cch = "Планы видов характеристик";
	msg.meta_cacc = "Планы счетов";
	msg.meta_tsk = "Задачи";
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
	msg.meta_task_mgr = "Менеджер задач";
	msg.meta_bp_mgr = "Менеджер бизнес-процессов";
	msg.meta_reports_mgr = "Менеджер отчетов";
	msg.meta_cacc_mgr = "Менеджер планов счетов";
	msg.meta_cch_mgr = "Менеджер планов видов характеристик";
	msg.meta_extender = "Модификаторы объектов и менеджеров";

	msg.modified_close = "Объект изменен<br/>Закрыть без сохранения?";
	msg.mandatory_title = "Обязательный реквизит";
	msg.mandatory_field = "Укажите значение реквизита '%1'";

	msg.no_metadata = "Не найдены метаданные объекта '%1'";
	msg.no_selected_row = "Не выбрана строка табличной части '%1'";
	msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
	msg.not_implemented = "Не реализовано в текущей версии";

	msg.offline_request = "Запрос к серверу в автономном режиме";
	msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
	msg.order_sent_title = "Подтвердите отправку заказа";
	msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

	msg.report_error = "<i class='fa fa-exclamation-circle fa-2x fa-fw'></i> Ошибка";
	msg.report_prepare = "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета";
	msg.report_need_prepare = "<i class='fa fa-info fa-2x fa-fw'></i> Нажмите 'Сформировать' для получения отчета";
	msg.report_need_online = "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме";

	msg.request_title = "Запрос регистрации";
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

	msg.tabular_will_cleared = "Табличная часть '%1' будет очищена. Продолжить?";

	msg.unsupported_browser_title = "Браузер не поддерживается";
	msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
	msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
	msg.unsupported_mode_title = "Режим не поддерживается";
	msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
	msg.unknown_error = "Неизвестная ошибка в функции '%1'";

	msg.value = "Значение";

})($p.msg);





/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

/**
 * ### Интерфейс локальной и сетевой баз данных PouchDB
 * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
 *
 * @class Pouch
 * @static
 * @menuorder 34
 * @tooltip Данные pouchdb
 */
function Pouch(){

	var t = this,
		_paths = {},
		_local, _remote, _auth, _data_loaded;

	t.__define({

		/**
		 * Конструктор PouchDB
		 */
		DB: {
			value: typeof PouchDB === "undefined" ?
				require('pouchdb-core')
					.plugin(require('pouchdb-adapter-memory'))
					.plugin(require('pouchdb-adapter-http'))
					.plugin(require('pouchdb-replication'))
					.plugin(require('pouchdb-mapreduce'))
					.plugin(require('pouchdb-find')) : PouchDB
		},

		init: {
			value: function (attr) {
				_paths._mixin(attr);
				if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined"){
					_paths.path = location.protocol + "//" + location.host + _paths.path;
				}
			}
		},

		/**
		 * ### Локальные базы PouchDB
		 *
		 * @property local
		 * @type {Object}
		 */
		local: {
			get: function () {
				if(!_local){
					var opts = {auto_compaction: true, revs_limit: 2};
          _local = {
            ram: new t.DB(_paths.prefix + _paths.zone + "_ram", opts),
            doc: _paths.direct ? t.remote.doc : new t.DB(_paths.prefix + _paths.zone + "_doc", opts),
            meta: new t.DB(_paths.prefix + "meta", opts),
            sync: {}
          }
				}
				if(_paths.path && !_local._meta){
					_local._meta = new t.DB(_paths.path + "meta", {skip_setup: true});
					t.run_sync(_local.meta, _local._meta, "meta");
				}
				return _local;
			}
		},

		/**
		 * ### Базы PouchDB на сервере
		 *
		 * @property remote
		 * @type {Object}
		 */
		remote: {
			get: function () {
				if(!_remote){
					var opts = {skip_setup: true, adapter: 'http'};
          _remote = {};
          $p.md.bases().forEach(function (db) {
            _remote[db] = db == 'ram' ?
              new t.DB(_paths.path + _paths.zone + "_" + db, opts) :
              new t.DB(_paths.path + _paths.zone + "_" + db + (_paths.suffix ? "_" + _paths.suffix : ""), opts)
          })
				}
				return _remote;
			}
		},

		/**
		 * ### Выполняет авторизацию и запускает репликацию
		 * @method log_in
		 * @param username {String}
		 * @param password {String}
		 * @return {Promise}
		 */
		log_in: {
			value: function (username, password) {

				// реквизиты гостевого пользователя для демобаз
				if (username == undefined && password == undefined){
					if($p.job_prm.guests && $p.job_prm.guests.length) {
						username = $p.job_prm.guests[0].username;
						password = $p.aes.Ctr.decrypt($p.job_prm.guests[0].password);
					}else{
						return Promise.reject(new Error("username & password not defined"));
					}
				}

				if (_auth) {
					if (_auth.username == username){
						return Promise.resolve();
					} else {
						return Promise.reject(new Error("need logout first"));
					}
				}

				// авторизуемся во всех базах
				var bases = $p.md.bases(),
					try_auth = [];

				this.remote;

				bases.forEach(function(name){
					try_auth.push(
						_remote[name].login(username, password)
					)
				})

				return Promise.all(try_auth)
					.then(function (){

						_auth = {username: username};
						setTimeout(function(){

							// сохраняем имя пользователя в базе
							if($p.wsql.get_user_param("user_name") != username){
								$p.wsql.set_user_param("user_name", username)
							}

							// если настроено сохранение пароля - сохраняем и его
							if($p.wsql.get_user_param("enable_save_pwd")){
								if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password){
									$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password))   // сохраняем имя пользователя в базе
								}
							}
							else if($p.wsql.get_user_param("user_pwd") != ""){
								$p.wsql.set_user_param("user_pwd", "")
							}

							// излучаем событие
							$p.eve.callEvent('user_log_in', [username]);
						});

            try_auth.length = 0;
            bases.forEach(function(dbid) {
              if(t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]){
                try_auth.push(t.run_sync(t.local[dbid], t.remote[dbid], dbid));
              }
            });
            return Promise.all(try_auth);
					})
          .then(function () {
            // широковещательное оповещение об окончании загрузки локальных данных
            if(t.local._loading){
              return new Promise(function (resolve, reject) {
                $p.eve.attachEvent("pouch_data_loaded", resolve);
              });
            }
            else{
              return t.call_data_loaded();
            }
          })
					.catch(function(err) {
						// излучаем событие
						$p.eve.callEvent("user_log_fault", [err])
					})
			}
		},

		/**
		 * ### Останавливает синхронизации и снимает признак авторизованности
		 * @method log_out
		 */
		log_out: {
			value: function () {

				if(_auth){
					if(_local.sync.doc){
						try{
							_local.sync.doc.cancel();
						}catch(err){}
					}
					if(_local.sync.ram){
						try{
							_local.sync.ram.cancel();
						}catch(err){}
					}
					_auth = null;
				}

				$p.eve.callEvent("log_out");

				if(_paths.direct){
					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);
				}

				return _remote && _remote.ram ?
					_remote.ram.logout()
						.then(function () {
							if(_remote && _remote.doc){
								return _remote.doc.logout()
							}
						})
						.then(function () {
							if(_remote && _remote.ram){
								delete _remote.ram;
							}
							if(_remote && _remote.doc){
								delete _remote.doc;
							}
							_remote = null;
							$p.eve.callEvent("user_log_out")
						})
					:
					Promise.resolve();
			}
		},

		/**
		 * ### Уничтожает локальные данные
		 * Используется при изменении структуры данных на сервере
		 *
		 * @method reset_local_data
		 */
		reset_local_data: {
			value: function () {

				var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
					destroy_doc = t.local.doc.destroy.bind(t.local.doc),
					do_reload = function (){
						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 1000);
					};

				t.log_out();

				setTimeout(function () {
					destroy_ram()
						.then(destroy_doc)
						.catch(destroy_doc)
						.then(do_reload)
						.catch(do_reload);
				}, 1000);

			}
		},

    call_data_loaded: {
		  value: function (page) {
        _data_loaded = true;
        if(!page){
          page = _local.sync._page || {};
        }
        return $p.md.load_doc_ram().then(function () {
          setTimeout(function () {
            $p.eve.callEvent(page.note = "pouch_data_loaded", [page]);
          }, 1000);
        });
      }
    },

		/**
		 * ### Загружает условно-постоянные данные из базы ram в alasql
		 * Используется при инициализации данных на старте приложения
		 *
		 * @method load_data
		 */
		load_data: {
			value: function () {

				var options = {
					limit : 800,
					include_docs: true
				},
					_page = {
						total_rows: 0,
						limit: options.limit,
						page: 0,
						start: Date.now()
					};

				// бежим по всем документам из ram
				return new Promise(function(resolve, reject){

					function fetchNextPage() {
						t.local.ram.allDocs(options, function (err, response) {

							if (response) {

								// широковещательное оповещение о загрузке порции локальных данных
								_page.page++;
								_page.total_rows = response.total_rows;
								_page.duration = Date.now() - _page.start;
								$p.eve.callEvent("pouch_load_data_page", [_page]);

								if (t.load_changes(response, options))
									fetchNextPage();
								else{
									resolve();
									// широковещательное оповещение об окончании загрузки локальных данных
                  t.call_data_loaded(_page);
								}

							} else if(err){
								reject(err);
								// широковещательное оповещение об ошибке загрузки
								$p.eve.callEvent("pouch_load_data_error", [err]);
							}
						});
					}

					t.local.ram.info()
						.then(function (info) {
							if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){
								// широковещательное оповещение о начале загрузки локальных данных
								$p.eve.callEvent("pouch_load_data_start", [_page]);
                t.local._loading = true;
								fetchNextPage();
							}else{
								$p.eve.callEvent("pouch_load_data_error", [info]);
								reject(info);
							}
						});
				});

			}
		},

		/**
		 * ### Информирует об авторизованности на сервере CouchDB
		 *
		 * @property authorized
		 */
		authorized: {
			get: function () {
				return _auth && _auth.username;
			}
		},


		/**
		 * ### Информирует о загруженности данных
		 *
		 * @property data_loaded
		 */
		data_loaded: {
			get: function () {
				return !!_data_loaded;
			}
		},

		/**
		 * ### Запускает процесс синхронизвации
		 *
		 * @method run_sync
		 * @param local {PouchDB}
		 * @param remote {PouchDB}
		 * @param id {String}
		 * @return {Promise.<TResult>}
		 */
		run_sync: {
			value: function (local, remote, id){

				var linfo, _page;

				return local.info()
					.then(function (info) {
						linfo = info;
						return remote.info()
					})
					.then(function (rinfo) {

						// для базы "ram", сервер мог указать тотальную перезагрузку данных
						// в этом случае - очищаем базы и перезапускаем браузер
						if(id != "ram"){
              return rinfo;
            }

						return remote.get("data_version")
							.then(function (v) {
								if(v.version != $p.wsql.get_user_param("couch_ram_data_version")){

									// если это не первый запуск - перезагружаем
									if($p.wsql.get_user_param("couch_ram_data_version"))
										rinfo = t.reset_local_data();

									// сохраняем версию в localStorage
									$p.wsql.set_user_param("couch_ram_data_version", v.version);

								}
								return rinfo;
							})
							.catch(function (err) {
								$p.record_log(err);
							})
							.then(function () {
								return rinfo;
							});

					})
					.then(function (rinfo) {

						if(!rinfo){
              return;
            }

            _page = {
              id: id,
              total_rows: rinfo.doc_count + rinfo.doc_del_count,
              local_rows: linfo.doc_count,
              docs_written: 0,
              limit: 200,
              page: 0,
              start: Date.now()
            };

            // широковещательное оповещение о начале загрузки локальных данных
						if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
							$p.eve.callEvent("pouch_load_data_start", [_page]);
						}
            // широковещательное оповещение о начале синхронизации базы doc
						else{
              $p.eve.callEvent("pouch_" + id + "_sync_start");
						}

            return new Promise(function(resolve, reject){

              // ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
              var options = {
                batch_size: 200,
                batches_limit: 6
              };

              function sync_events(sync, options) {

                return sync.on('change', function (change) {
                  // yo, something changed!

                  // широковещательное оповещение о загрузке порции данных
                  if(!_data_loaded && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
                    _page.page++;
                    _page.docs_written = change.docs_written;
                    _page.duration = Date.now() - _page.start;
                    $p.eve.callEvent("pouch_load_data_page", [_page]);
                  }

                  if(id != "ram"){
                    change.update_only = true;
                  }
                  t.load_changes(change);
                  $p.eve.callEvent("pouch_change", [id, change]);

                })
                  .on('paused', function (info) {
                    // replication was paused, usually because of a lost connection
                    $p.eve.callEvent("pouch_paused", [id, info]);
                  })
                  .on('active', function (info) {
                    // replication was resumed
                    $p.eve.callEvent("pouch_active", [id, info]);
                  })
                  .on('denied', function (info) {
                    // a document failed to replicate, e.g. due to permissions
                    $p.eve.callEvent("pouch_denied", [id, info]);
                  })
                  .on('complete', function (info) {
                    // handle complete
                    if(options){
                      options.live = true;
                      options.retry = true;

                      if(id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo){
                        _local.sync[id] = sync_events(local.replicate.from(remote, options));
                      }else{
                        _local.sync[id] = sync_events(local.sync(remote, options));
                      }
                      resolve(id);
                    }
                  })
                  .on('error', function (err) {
                    // totally unhandled error (shouldn't happen)
                    reject([id, err]);
                    $p.eve.callEvent("pouch_error", [id, err]);
                  });
              }

              // если указан клиентский или серверный фильтр - подключаем
              if(id == "meta"){
                options.filter = "auth/meta";
                options.live = true;
                options.retry = true;
              }
              else if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]){
                options.filter = $p.job_prm.pouch_filter[id];
              }

              sync_events(local.replicate.from(remote, options), options)

            });

					});
			}
		},

		/**
		 * ### Читает объект из pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
		 * @return {Promise.<DataObj>} - промис с загруженным объектом
		 */
		load_obj: {
			value: function (tObj) {

				return tObj._manager.pouch_db.get(tObj.class_name + "|" + tObj.ref)
					.then(function (res) {
						delete res._id;
						delete res._rev;
						tObj._mixin(res)._set_loaded();
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function (res) {
						return tObj;
					});
			}
		},

		/**
		 * ### Записывает объект в pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - записываемый объект
		 * @param attr {Object} - ополнительные параметры записи
		 * @return {Promise.<DataObj>} - промис с записанным объектом
		 */
		save_obj: {
			value: function (tObj, attr) {

			  var _data = tObj._data;
        if(!_data || (_data._saving && !_data._modified)){
          return Promise.resolve(tObj);
        }
        if(_data._saving && _data._modified){
          return new Promise(function(resolve, reject) {
            setTimeout(function(){
              resolve(t.save_obj(tObj, attr));
            }, 100);
          });
        }
        _data._saving = true;

				var tmp = tObj._obj._clone(void 0, true),
					db = attr.db || tObj._manager.pouch_db;

        tmp.class_name = tObj.class_name;
				tmp._id = tmp.class_name + "|" + tObj.ref;
				delete tmp.ref;

				if(attr.attachments){
          tmp._attachments = attr.attachments;
        }

				return (tObj.is_new() ? Promise.resolve() : db.get(tmp._id))
					.then(function (res) {
						if(res){
							tmp._rev = res._rev;
							for(var att in res._attachments){
								if(!tmp._attachments)
									tmp._attachments = {};
								if(!tmp._attachments[att])
									tmp._attachments[att] = res._attachments[att];
							}
						}
					})
					.catch(function (err) {
						if(err && err.status != 404){
              throw err;
            }
					})
					.then(function () {
						return db.put(tmp);
					})
					.then(function () {

						if(tObj.is_new())
							tObj._set_loaded(tObj.ref);

						if(tmp._attachments){
							if(!tObj._attachments)
								tObj._attachments = {};
							for(var att in tmp._attachments){
								if(!tObj._attachments[att] || !tmp._attachments[att].stub)
									tObj._attachments[att] = tmp._attachments[att];
							}
						}

            delete _data._saving;
						return tObj;
					})
          .catch(function (err) {
            delete _data._saving;
            if(err && err.status != 404){
              throw err;
            }
          });
			}
		},

		/**
		 * ### Загружает в менеджер изменения или полученные через allDocs данные
		 *
		 * @method load_changes
		 * @param changes
		 * @param options
		 * @return {boolean}
		 */
		load_changes: {
			value: function(changes, options){

				var docs, doc, res = {}, cn, key;

				if(!options){
					if(changes.direction){
						if(changes.direction != "pull")
							return;
						docs = changes.change.docs;
					}else
						docs = changes.docs;
				}
				else
					docs = changes.rows;

				if (docs.length > 0) {
					if(options){
						options.startkey = docs[docs.length - 1].key;
						options.skip = 1;
					}

					docs.forEach(function (rev) {
						doc = options ? rev.doc : rev;
						if(!doc){
							if((rev.value && rev.value.deleted))
								doc = {
									_id: rev.id,
									_deleted: true
								};
							else if(rev.error)
								return;
						}
						key = doc._id.split("|");
						cn = key[0].split(".");
						doc.ref = key[1];
						delete doc._id;
						delete doc._rev;
						if(!res[cn[0]])
							res[cn[0]] = {};
						if(!res[cn[0]][cn[1]])
							res[cn[0]][cn[1]] = [];
						res[cn[0]][cn[1]].push(doc);
					});

					for(var mgr in res){
						for(cn in res[mgr]){
							if($p[mgr] && $p[mgr][cn]){
								$p[mgr][cn].load_array(res[mgr][cn],
                  changes.update_only && $p[mgr][cn].cachable.indexOf("ram") == -1 ? "update_only" : true);
							}
						}
					}

					return true;
				}

				return false;
			}
		},

		/**
		 * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
		 * @method backup_database
		 * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
		 * @async
		 */

		backup_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}
		},

		/**
		 * Восстанавливает базу из архивной копии
		 * @method restore_database
		 * @async
		 */
		restore_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}

		}

	});

}



/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_meta
 * @requires common
 */

var _md;

/**
 * ### Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 *
 * @class Meta
 * @static
 * @menuorder 02
 * @tooltip Описание метаданных
 */
function Meta() {

	var _m = {
		enm: {
			accumulation_record_type: [
				{
					order: 0,
					name: "debit",
					synonym: "Приход"
				},
				{
					order: 1,
					name: "credit",
					synonym: "Расход"
				}
			],
			sort_directions: [
				{
					order: 0,
					name: "asc",
					synonym: "По возрастанию"
				},
				{
					order: 1,
					name: "desc",
					synonym: "По убыванию"
				}
			],
			comparison_types: [
				{
					order: 0,
					name: "gt",
					synonym: "Больше"
				},
				{
					order: 1,
					name: "gte",
					synonym: "Больше или равно"
				},
				{
					order: 2,
					name: "lt",
					synonym: "Меньше"
				},
				{
					order: 3,
					name: "lte",
					synonym: "Меньше или равно "
				},
				{
					order: 4,
					name: "eq",
					synonym: "Равно"
				},
				{
					order: 5,
					name: "ne",
					synonym: "Не равно"
				},
				{
					"order": 6,
					"name": "in",
					"synonym": "В списке"
				},
				{
					order: 7,
					name: "nin",
					synonym: "Не в списке"
				},
				{
					order: 8,
					name: "lke",
					synonym: "Подобно "
				},
				{
					order: 9,
					name: "nlk",
					synonym: "Не подобно"
				}
			]
		},
		cat: {
      meta_objs: {
        fields: {}
      },
      meta_fields: {
        fields: {}
      },
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Настройки отчетов и списков",
        input_by_string: [
          "name"
        ],
        hierarchical: false,
        has_owners: false,
        group_hierarchy: true,
        main_presentation_name: true,
        code_length: 0,
        fields: {
          obj: {
            synonym: "Объект",
            tooltip: "Имя класса метаданных",
            type: {
              types: [
                "string"
              ],
              str_len: 250
            }
          },
          user: {
            synonym: "Пользователь",
            tooltip: "Если пусто - публичная настройка",
            type: {
              types: [
                "string"
              ],
              str_len: 50
            }
          },
          order: {
            synonym: "Порядок",
            tooltip: "Порядок варианта",
            type: {
              types: [
                "number"
              ],
              digits: 6,
              fraction_figits: 0,
            }
          },
          query: {
            synonym: "Запрос",
            tooltip: "Индекс CouchDB или текст SQL",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          },
          date_from: {
            "synonym": "Начало периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          date_till: {
            "synonym": "Конец периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          formula: {
            synonym: "Формула",
            tooltip: "Формула инициализации",
            type: {
              types: [
                "cat.formulas"
              ],
              is_ref: true
            }
          },
          tag: {
            synonym: "Дополнительные свойства",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          }
        },
        tabular_sections: {
          fields: {
            name: "fields",
            synonym: "Доступные поля",
            tooltip: "Состав, порядок и ширина колонок",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "Для плоского списка, родитель пустой",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              width: {
                synonym: "Ширина",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 6
                }
              },
              caption: {
                synonym: "Заголовок",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              tooltip: {
                synonym: "Подсказка",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              ctrl_type: {
                synonym: "Тип",
                tooltip: "Тип элемента управления",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formatter: {
                synonym: "Формат",
                tooltip: "Функция форматирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              },
              editor: {
                synonym: "Редактор",
                tooltip: "Компонент редактирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              }
            }
          },
          sorting: {
            name: "sorting",
            synonym: "Поля сортировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              direction: {
                synonym: "Направление",
                tooltip: "",
                type: {
                  types: [
                    "enm.sort_directions"
                  ],
                  "is_ref": true
                }
              }
            }
          },
          dimensions: {
            name: "dimensions",
            synonym: "Поля группировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              }
            }
          },
          resources: {
            name: "resources",
            synonym: "Ресурсы",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formula: {
                synonym: "Формула",
                tooltip: "По умолчанию - сумма",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              }
            }
          },
          selection: {
            name: "selection",
            synonym: "Отбор",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              left_value: {
                synonym: "Левое значение",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              comparison_type: {
                synonym: "Вид сравнения",
                tooltip: "",
                type: {
                  types: [
                    "enm.comparison_types"
                  ],
                  is_ref: true
                }
              },
              right_value: {
                synonym: "Правое значение",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              }
            }
          },
          params: {
            name: "params",
            synonym: "Параметры",
            tooltip: "",
            fields: {
              param: {
                synonym: "Параметр",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value_type: {
                synonym: "Тип",
                tooltip: "Тип значения",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value: {
                synonym: "Значение",
                tooltip: "Может иметь примитивный или ссылочный тип или массив",
                type: {
                  types: [
                    "string",
                    "number",
                    // "date",
                    // "array"
                  ],
                  str_len: 0,
                  digits: 15,
                  fraction_figits: 3,
                  // date_part: "date"
                }
              }
            }
          },
          composition: {
            name: "composition",
            synonym: "Структура",
            tooltip: "",
            fields: {
              parent: {
                "synonym": "Родитель",
                "multiline_mode": false,
                "tooltip": "",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 10
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                "synonym": "Элемент",
                "tooltip": "Элемент структуры отчета",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              kind: {
                "synonym": "Вид раздела отчета",
                "tooltip": "список, таблица, группировка строк, группировка колонок",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              definition: {
                "synonym": "Описание",
                "tooltip": "Описание раздела структуры",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              }
            }
          }
        },
        cachable: "doc"
      }
		},
		doc: {},
		ireg: {
			log: {
				name: "log",
				note: "",
				synonym: "Журнал событий",
				dimensions: {
					date: {
						synonym: "Дата",
						multiline_mode: false,
						tooltip: "Время события",
						type: {
							types: [
								"number"
							],
							digits: 15,
							fraction_figits: 0
						}
					},
					sequence: {
						synonym: "Порядок",
						multiline_mode: false,
						tooltip: "Порядок следования",
						type: {
							types: [
								"number"
							],
							digits: 6,
							fraction_figits: 0
						}
					}
				},
				resources: {
					"class": {
						synonym: "Класс",
						multiline_mode: false,
						tooltip: "Класс события",
						type: {
							types: [
								"string"
							],
							str_len: 100
						}
					},
					note: {
						synonym: "Комментарий",
						multiline_mode: true,
						tooltip: "Текст события",
						type: {
							types: [
								"string"
							],
							str_len: 0
						}
					},
					obj: {
						synonym: "Объект",
						multiline_mode: true,
						tooltip: "Объект, к которому относится событие",
						type: {
							types: [
								"string"
							],
							str_len: 0
						}
					}
				}
			}
		},
		areg: {},
		dp: {
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Варианты настроек",
        fields: {
          scheme: {
            synonym: "Текущая настройка",
            tooltip: "Текущий вариант настроек",
            mandatory: true,
            type: {
              types: [
                "cat.scheme_settings"
              ],
              is_ref: true
            }
          }
        }
      }
    },
		rep: {},
		cch: {},
		cacc: {}
	};

	_md = this;

	// загружает метаданные из pouchdb
	function meta_from_pouch(meta_db){

		return meta_db.info()
			.then(function () {
				return meta_db.get('meta');

			})
			.then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				return meta_db.get('meta_patch');

			}).then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				delete _m._id;
				delete _m._rev;
				return _m;
			});
	}


	/**
	 * ### Cоздаёт объекты менеджеров
	 * @method create_managers
	 */
	_md.create_managers = function(){};

  /**
   * ### Возвращает массив используемых баз
   *
   * @method bases
   * @return {Array}
   */
  _md.bases = function () {
    var res = {};
    for(var i in _m){
      for(var j in _m[i]){
        if(_m[i][j].cachable){
          var _name = _m[i][j].cachable.replace('_remote', '').replace('_ram', '');
          if(_name != 'meta' && _name != 'e1cib' && !res[_name])
            res[_name] = _name;
        }
      }
    }
    return Object.keys(res);
  }

  /**
   * ### Загружает объекты с типом кеширования doc_ram в ОЗУ
   * @method load_doc_ram
   */
  _md.load_doc_ram = function() {
    var res = [];
    ['cat','cch','ireg'].forEach(function (kind) {
      for (var name in _m[kind]) {
        if (_m[kind][name].cachable == 'doc_ram') {
          res.push(kind + '.' + name);
        }
      }
    });
    return $p.wsql.pouch.local.doc.find({
      selector: {class_name: {$in: res}},
      limit: 10000
    })
      .then($p.wsql.pouch.load_changes);
  }

	/**
	 * ### Инициализирует метаданные
	 * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
	 *
	 * @method create_managers
	 * @for Meta
	 * @param [meta_db] {Object|String}
	 */
	_md.init = function (meta_db) {

		var is_local = !meta_db || ($p.wsql.pouch && meta_db == $p.wsql.pouch.local.meta),
			is_remote = meta_db && ($p.wsql.pouch && meta_db == $p.wsql.pouch.local._meta);

		function do_init(){

			if(meta_db && !is_local && !is_remote){
				$p._patch(_m, meta_db);
				meta_db = null;

				_md.create_managers();

			}else{

				return meta_from_pouch(meta_db || $p.wsql.pouch.local.meta)
					.then(function () {
						if(is_local){
							_md.create_managers();

						}else{
							return _m;
						}
					})
					.catch($p.record_log);
			}
		}



		// этот обработчик нужен только при инициализации, когда в таблицах meta еще нет данных
		$p.on("pouch_change", function (dbid, change) {

			if (dbid != "meta")
				return;

			if(!_m)
				do_init();

			else if($p.iface && $p.iface.do_reload && change.docs && change.docs.length < 4){

				// если изменились метаданные, запланировать перезагрузку
				setTimeout(function () {
					$p.iface.do_reload();
				}, 10000);

			}

		});

		return do_init();

	};

	/**
	 * ### Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){

		var np = class_name.split(".");

		if(!field_name)
			return _m[np[0]][np[1]];

		var res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}},
			is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

		if(is_doc && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;

		}else if(is_doc && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";

		}else if(is_doc && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";

		}else if(is_cat && field_name=="id"){
			res.synonym = "Код";

		}else if(is_cat && field_name=="name"){
			res.synonym = "Наименование";

		}else if(field_name=="_deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";

		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";

		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;

		}else if(field_name)
			res = _m[np[0]][np[1]].fields[field_name];

		else
			res = _m[np[0]][np[1]];

		return res;
	};

	/**
	 * ### Возвращает структуру имён объектов метаданных конфигурации
	 *
	 * @method get_classes
	 */
	_md.get_classes = function () {
		var res = {};
		for(var i in _m){
			res[i] = [];
			for(var j in _m[i])
				res[i].push(j);
		}
		return res;
	};

	/**
	 * ### Возвращает тип поля sql для типа данных
	 *
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
	 * ### Для полей составного типа, добавляет в sql поле описания типа
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
				res = ', "' + f0 + '" character varying(255)';
			else
				res = _md.sql_mask(f0) + " CHAR";
		}
		return res;
	};

	/**
	 * ### Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 * @private
	 */
	_md.sql_mask = function(f, t){
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	/**
	 * ### Возвращает менеджер объекта по имени класса
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
	 * ### Возвращает менеджер значения по свойству строки
	 * @method value_mgr
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - описание типа поля mf.type
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	_md.value_mgr = function(row, f, mf, array_enabled, v){

		var property, oproperty, tnames, rt, mgr;

		if(mf._mgr instanceof DataManager){
			return mf._mgr;
		}

		function mf_mgr(mgr){
			if(mgr instanceof DataManager && mf.types.length == 1){
				mf._mgr = mgr;
			}
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
			if(rt.length == 1 || row[f] == $p.utils.blank.guid)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			// Получаем объект свойства
			if($p.utils.is_data_obj(property)){
				oproperty = property;
			}
			else if($p.utils.is_guid(property)){
				oproperty = $p.cch.properties.get(property, false);
			}
			else{
				return;
			}

			if($p.utils.is_data_obj(oproperty)){

				// затычка для неизвестных свойств используем значения свойств объектов
				if(oproperty.is_new()){
					return $p.cat.property_values;
				}

				// и через его тип выходми на мнеджера значения
				rt = [];
				oproperty.type.types.some(function(v){
					tnames = v.split(".");
					if(tnames.length > 1 && $p[tnames[0]][tnames[1]]){
						rt.push($p[tnames[0]][tnames[1]]);
					}
					else if(v == "boolean"){
						rt.push({types: ["boolean"]});
						return true
					}
				});
				if(rt.length == 1 || row[f] == $p.utils.blank.guid){
					return mf_mgr(rt[0]);
				}
				else if(array_enabled){
					return rt;
				}
				else if((property = row[f]) instanceof DataObj){
					return property._manager;
				}
				else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
					for(var i in rt){
						mgr = rt[i];
						if(mgr.get(property, false, true))
							return mgr;
					}
				}
			}
		}
	};

	/**
	 * ### Возвращает имя типа элемента управления для типа поля
	 * @method control_by_type
	 * @param type
	 * @return {*}
	 */
	_md.control_by_type = function (type, val) {
		var ft;

		if(typeof val == "boolean" && type.types.indexOf("boolean") != -1){
			ft = "ch";

		} else if(typeof val == "number" && type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(val instanceof Date && type.date_part){
			ft = "dhxCalendar";

		} else if(type.is_ref){
			ft = "ocombo";

		} else if(type.date_part) {
			ft = "dhxCalendar";

		} else if(type.digits) {
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
	 * ### Возвращает структуру для инициализации таблицы на форме
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

	/**
	 * ### Возвращает англоязычный синоним строки
	 * @method syns_js
	 * @param v {String}
	 * @return {String}
	 */
	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: '_deleted',
			Description: 'name',
			DataVersion: 'data_version',    // todo: не сохранять это поле в pouchdb
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
			Ссылка: 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
	};

	/**
	 * ### Возвращает русскоязычный синоним строки
	 * @method syns_1с
	 * @param v {String}
	 * @return {String}
	 */
	_md.syns_1с = function (v) {
		var syn1c = {
			_deleted: 'DeletionMark',
			name: 'Description',
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
		return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
	};

	/**
	 * ### Возвращает список доступных печатных форм
	 * @method printing_plates
	 * @return {Object}
	 */
	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				_m.doc[i].printing_plates = pp.doc[i];

	};

	/**
	 * ### Возвращает имя класса по полному имени объекта метаданных 1С
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
		else if(pn[0] == "РегистрБухгалтерии")
			name = "accreg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";
		else if(pn[0] == "Обработка")
			name = "dp.";
		else if(pn[0] == "Отчет")
			name = "rep.";

		return name + _md.syns_js(pn[1]);

	};

	/**
	 * ### Возвращает полное именя объекта метаданных 1С по имени класса metadata
	 * @method class_name_to_1c
	 * @param name
	 */
	_md.class_name_to_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "Перечисление." + name;
		else if(pn[0] == "enm")
			name = "Перечисление.";
		else if(pn[0] == "cat")
			name = "Справочник.";
		else if(pn[0] == "doc")
			name = "Документ.";
		else if(pn[0] == "ireg")
			name = "РегистрСведений.";
		else if(pn[0] == "areg")
			name = "РегистрНакопления.";
		else if(pn[0] == "accreg")
			name = "РегистрБухгалтерии.";
		else if(pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if(pn[0] == "cacc")
			name = "ПланСчетов.";
		else if(pn[0] == "dp")
			name = "Обработка.";
		else if(pn[0] == "rep")
			name = "Отчет.";

		return name + _md.syns_1с(pn[1]);

	};


	/**
	 * ### Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
	 * @method create_tables
	 */
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md; ";

		function on_table_created(){

			cstep--;
			if(cstep==0){
				if(callback)
					callback(create);
				else
					alasql.utils.saveFile("create_tables.sql", create);
			} else
				iteration();
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + "; ";
			on_table_created();
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер
		"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
			for(class_name in managers[mgr])
				data_names.push({"class": $p[mgr], "name": managers[mgr][class_name]});
		});
		cstep = data_names.length;

		iteration();

	};


}

/**
 * Конструкторы менеджеров данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_mngrs
 * @requires common
 */


/**
 * ### Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumManager"}}{{/crossLink}} - менеджер перечислений
 * - {{#crossLink "RefDataManager"}}{{/crossLink}} - абстрактный менеджер ссылочных данных
 * - {{#crossLink "CatManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfAccountManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DocManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DataProcessorsManager"}}{{/crossLink}} - менеджер обработок
 * - {{#crossLink "RegisterManager"}}{{/crossLink}} - абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 * - {{#crossLink "InfoRegManager"}}{{/crossLink}} - менеджер регистров сведений
 * - {{#crossLink "LogManager"}}{{/crossLink}} - менеджер журнала регистрации
 * - {{#crossLink "AccumRegManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "TaskManager"}}{{/crossLink}} - менеджер задач
 * - {{#crossLink "BusinessProcessManager"}}{{/crossLink}} - менеджер бизнес-процессов
 *
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 * @menuorder 10
 * @tooltip Менеджер данных
 */
function DataManager(class_name){

	var _meta = _md.get(class_name),

		_events = {

			/**
			 * ### После создания
			 * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
			 * или заполнить объект на основании данных связанного объекта
			 *
			 * @event after_create
			 * @for DataManager
			 */
			after_create: [],

			/**
			 * ### После чтения объекта с сервера
			 * Имеет смысл для объектов с типом кеширования ("doc", "doc_remote", "meta", "e1cib").
			 * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
			 *
			 * @event after_load
			 * @for DataManager
			 */
			after_load: [],

			/**
			 * ### Перед записью
			 * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
			 * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
			 *
			 * @event before_save
			 * @for DataManager
			 */
			before_save: [],

			/**
			 * ### После записи
			 *
			 * @event after_save
			 * @for DataManager
			 */
			after_save: [],

			/**
			 * ### При изменении реквизита шапки или табличной части
			 *
			 * @event value_change
			 * @for DataManager
			 */
			value_change: [],

			/**
			 * ### При добавлении строки табличной части
			 *
			 * @event add_row
			 * @for DataManager
			 */
			add_row: [],

			/**
			 * ### При удалении строки табличной части
			 *
			 * @event del_row
			 * @for DataManager
			 */
			del_row: []
		};

	this.__define({

		/**
		 * ### Способ кеширования объектов этого менеджера
		 *
		 * Выполняет две функции:
		 * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
		 * - Указывает, нужно ли запоминать представления ссылок (инверсно).
		 * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
		 * @property cachable
		 * @for DataManager
		 * @type String - ("ram", "doc", "doc_remote", "meta", "e1cib")
		 * @final
		 */
		cachable: {
			get: function () {

				// перечисления кешируются всегда
				if(class_name.indexOf("enm.") != -1)
					return "ram";

				// Если в метаданных явно указано правило кеширования, используем его
				if(_meta.cachable)
					return _meta.cachable;

				// документы, отчеты и обработки по умолчанию кешируем в idb, но в память не загружаем
				if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
					return "doc";

				// остальные классы по умолчанию кешируем и загружаем в память при старте
				return "ram";

			}
		},


		/**
		 * ### Имя типа объектов этого менеджера
		 * @property class_name
		 * @for DataManager
		 * @type String
		 * @final
		 */
		class_name: {
			value: class_name,
			writable: false
		},

		/**
		 * ### Указатель на массив, сопоставленный с таблицей локальной базы данных
		 * Фактически - хранилище объектов данного класса
		 * @property alatable
		 * @for DataManager
		 * @type Array
		 * @final
		 */
		alatable: {
			get : function () {
				return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
			}
		},

		/**
		 * ### Метаданные объекта
		 * указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту
		 *
		 * @method metadata
		 * @for DataManager
		 * @return {Object} - объект метаданных
		 */
		metadata: {
			value: function(field){
				if(field)
					return _meta.fields[field] || _meta.tabular_sections[field];
				else
					return _meta;
			}
		},

		/**
		 * ### Добавляет подписку на события объектов данного менеджера
		 * В обработчиках событий можно реализовать бизнес-логику при создании, удалении и изменении объекта.
		 * Например, заполнение шапки и табличных частей, пересчет одних полей при изменении других и т.д.
		 *
		 * @method on
		 * @for DataManager
		 * @param name {String|Object} - имя события [after_create, after_load, before_save, after_save, value_change, add_row, del_row]
		 * @param [method] {Function} - добавляемый метод, если не задан в объекте первым параметром
		 *
		 * @example
		 *
		 *     // Обработчик при создании документа
		 *     // @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 *     $p.doc.nom_prices_setup.on("after_create", function (attr) {
		 *       // присваиваем новый номер документа
		 *       return this.new_number_doc();
		 *     });
		 *
		 *     // Обработчик события "при изменении свойства" в шапке или табличной части при редактировании в форме объекта
		 *     // @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 *     $p.doc.nom_prices_setup.on("add_row", function (attr) {
		 *       // установим валюту и тип цен по умолчению при добавлении строки
		 *       if(attr.tabular_section == "goods"){
		 *         attr.row.price_type = this.price_type;
		 *         attr.row.currency = this.price_type.price_currency;
		 *       }
		 *     });
		 *
		 */
		on: {
			value: function (name, method) {
				if(typeof name == "object"){
					for(var n in name){
						if(name.hasOwnProperty(n))
							_events[n].push(name[n]);
					}
				}else
					_events[name].push(method);
			}
		},

		/**
		 * ### Удаляет подписку на событие объектов данного менеджера
		 *
		 * @method off
		 * @for DataManager
		 * @param name {String} - имя события [after_create, after_load, before_save, after_save, value_change, add_row, del_row]
		 * @param [method] {Function} - удаляемый метод. Если не задан, будут отключены все обработчики событий `name`
		 */
		off: {
			value: function (name, method) {
        if(typeof name == "object"){

        }else{
          var index = _events[name].indexOf(method);
          if(index != -1){
            _events[name].splice(index, 1);
          }
        }
			}
		},

		/**
		 * ### Выполняет методы подписки на событие
		 * Служебный, внутренний метод, вызываемый формами и обсерверами при создании и изменении объекта данных<br/>
		 * Выполняет в цикле все назначенные обработчики текущего события<br/>
		 * Если любой из обработчиков вернул `false`, возвращает `false`. Иначе, возвращает массив с результатами всех обработчиков
		 *
		 * @method handle_event
		 * @for DataManager
		 * @param obj {DataObj} - объект, в котором произошло событие
		 * @param name {String} - имя события
		 * @param attr {Object} - дополнительные свойства, передаваемые в обработчик события
		 * @return {Boolean|Array.<*>}
		 * @private
		 */
		handle_event: {
			value: function (obj, name, attr) {
				var res = [], tmp;
				_events[name].forEach(function (method) {
					if(res !== false){
						tmp = method.call(obj, attr);
						if(tmp === false)
							res = tmp;
						else if(tmp)
							res.push(tmp);
					}
				});
				if(res === false){
					return res;

				}else if(res.length){
					if(res.length == 1)
					// если значение единственное - возвращчем его
						return res[0];
					else{
						// если среди значений есть промисы - возвращаем all
						if(res.some(function (v) {return typeof v === "object" && v.then}))
							return Promise.all(res);
						else
							return res;
					}
				}

			}
		},

		/**
		 * ### Хранилище объектов данного менеджера
		 */
		by_ref: {
			value: {}
		}
	});

}

DataManager.prototype.__define({

	/**
	 * ### Имя семейства объектов данного менеджера
	 * Примеры: "справочников", "документов", "регистров сведений"
	 * @property family_name
	 * @for DataManager
	 * @type String
	 * @final
	 */
	family_name: {
		get : function () {
			return $p.msg["meta_"+this.class_name.split(".")[0]+"_mgr"].replace($p.msg.meta_mgr+" ", "");
		}
	},

	/**
	 * ### Имя таблицы объектов этого менеджера в базе alasql
	 * @property table_name
	 * @type String
	 * @final
	 */
	table_name: {
		get : function(){
			return this.class_name.replace(".", "_");
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере.
	 * Имеет смысл для объектов, у которых _cachable = "ram"_
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param [callback] {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	find_rows: {
		value: function(selection, callback){
			return $p._find_rows.call(this, this.by_ref, selection, callback);
		}
	},

	/**
	 * ### Дополнительные реквизиты
	 * Массив дополнителных реквизитов (аналог подсистемы `Свойства` БСП) вычисляется через
	 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
	 *
	 * @property extra_fields
	 * @type Array
	 */
	extra_fields: {
		value : function(obj){

			// ищем предопределенный элемент, сответствующий классу данных
			var destinations = $p.cat.destinations || $p.cch.destinations,
				pn = _md.class_name_to_1c(this.class_name).replace(".", "_"),
				res = [];

			if(destinations){
				destinations.find_rows({predefined_name: pn}, function (destination) {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if(ts){
						ts.each(function (row) {
							if(!row._deleted && !row.ПометкаУдаления)
								res.push(row.property || row.Свойство);
						});
					}
					return false;
				})

			}

			return res;
		}
	},

	/**
	 * ### Дополнительные свойства
	 * Массив дополнителных свойств (аналог подсистемы `Свойства` БСП) вычисляется через
	 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
	 *
	 * @property extra_properties
	 * @type Array
	 */
	extra_properties: {
		value : function(obj){
			return [];
		}
	},

	/**
	 * ### Имя функции - конструктора объектов или строк табличных частей
	 *
	 * @method obj_constructor
	 * @param ts_name {String}
	 * @return {Function}
	 */
	obj_constructor: {
		value: function (ts_name) {
			var parts = this.class_name.split("."),
				fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);

			return ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;

		}
	},

  /**
   * ### Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
   *
   * @method sync_grid
   * @for DataManager
   * @param grid {dhtmlXGridObject}
   * @param attr {Object}
   */
  sync_grid: {
	  value: function(attr, grid){

      var mgr = this;

      function request(){

        if(typeof attr.custom_selection == "function"){
          return attr.custom_selection(attr);

        }else if(mgr.cachable == "ram" || mgr.cachable == "doc_ram"){

          // запрос к alasql
          if(attr.action == "get_tree")
            return $p.wsql.promise(mgr.get_sql_struct(attr), [])
              .then($p.iface.data_to_tree);

          else if(attr.action == "get_selection")
            return $p.wsql.promise(mgr.get_sql_struct(attr), [])
              .then(function(data){
                return $p.iface.data_to_grid.call(mgr, data, attr);
              });

        }else if(mgr.cachable.indexOf("doc") == 0 || mgr.cachable.indexOf("remote") == 0){

          // todo: запрос к pouchdb
          if(attr.action == "get_tree")
            return mgr.pouch_tree(attr);

          else if(attr.action == "get_selection")
            return mgr.pouch_selection(attr);

        } else {

          // запрос к серверу по сети
          if(attr.action == "get_tree")
            return mgr.rest_tree(attr);

          else if(attr.action == "get_selection")
            return mgr.rest_selection(attr);

        }
      }

      function to_grid(res){

        return new Promise(function(resolve, reject) {

          if(typeof res == "string"){

            if(res.substr(0,1) == "{")
              res = JSON.parse(res);

            // загружаем строку в грид
            if(grid && grid.parse){
              grid.xmlFileUrl = "exec";
              grid.parse(res, function(){
                resolve(res);
              }, "xml");
            }else
              resolve(res);

          }else if(grid instanceof dhtmlXTreeView && grid.loadStruct){
            grid.loadStruct(res, function(){
              resolve(res);
            });

          }else
            resolve(res);

        });

      }

      // TODO: переделать обработку catch()
      return request()
        .then(to_grid)
        .catch($p.record_log);

    }
  },

  /**
   * ### Возвращает массив доступных значений для комбобокса
   * @method get_option_list
   * @for DataManager
   * @param val {DataObj|String} - текущее значение
   * @param [selection] {Object} - отбор, который будет наложен на список
   * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
   * @return {Promise.<Array>}
   */
  get_option_list: {
    value: function(val, selection){

      var t = this, l = [], input_by_string, text, sel;

      function check(v){
        if($p.utils.is_equal(v.value, val))
          v.selected = true;
        return v;
      }

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

      if(t.cachable.indexOf("ram") != -1 || (selection && selection._local)) {
        t.find_rows(selection, function (v) {
          l.push(check({text: v.presentation, value: v.ref}));
        });
        l.sort(function(a, b) {
          if (a.text < b.text){
            return -1;
          }
          else if (a.text > b.text){
            return 1;
          }
          return 0;
        })
        return Promise.resolve(l);

      }else if(t.cachable != "e1cib"){
        return t.pouch_find_rows(selection)
          .then(function (data) {
            data.forEach(function (v) {
              l.push(check({
                text: v.presentation,
                value: v.ref}));
            });
            return l;
          });
      }
      else{
        // для некешируемых выполняем запрос к серверу
        var attr = { selection: selection, top: selection._top},
          is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
        delete selection._top;

        if(is_doc)
          attr.fields = ["ref", "date", "number_doc"];

        else if(t.metadata().main_presentation_name)
          attr.fields = ["ref", "name"];
        else
          attr.fields = ["ref", "id"];

        return _rest.load_array(attr, t)
          .then(function (data) {
            data.forEach(function (v) {
              l.push(check({
                text: is_doc ? (v.number_doc + " от " + $p.moment(v.date).format($p.moment._masks.ldt)) : (v.name || v.id),
                value: v.ref}));
            });
            return l;
          });
      }
    }
  },

  /**
   * Заполняет свойства в объекте source в соответствии с реквизитами табчасти
   * @param tabular {String} - имя табчасти
   * @param source {Object}
   */
  tabular_captions: {
    value: function (tabular, source) {

    }
  },

  /**
   * ### Возаращает строку xml для инициализации PropertyGrid
   * служебный метод, используется {{#crossLink "OHeadFields"}}{{/crossLink}}
   * @method get_property_grid_xml
   * @param oxml {Object} - объект с иерархией полей (входной параметр - правила)
   * @param o {DataObj} - объект данных, из полей и табличных частей которого будут прочитаны значения
   * @param extra_fields {Object} - объект с описанием допреквизитов
   * @param extra_fields.ts {String} - имя табчасти
   * @param extra_fields.title {String} - заголовок в oxml, под которым следует расположить допреквизиты // "Дополнительные реквизиты", "Свойства изделия", "Параметры"
   * @param extra_fields.selection {Object} - отбор, который следует приминить к табчасти допреквизитов
   * @return {String} - XML строка в терминах dhtml.PropertyGrid
   * @private
   */
  get_property_grid_xml: {
    value: function(oxml, o, extra_fields){

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
                if(i != "predefined_name" && !mf.fields[i].hide)
                  oxml[" "].push(i);
            }

            if(mf.tabular_sections && mf.tabular_sections.extra_fields)
              oxml["Дополнительные реквизиты"] = [];
          }


        },

        txt_by_type = function (fv, mf) {

          if($p.utils.is_data_obj(fv))
            txt = fv.presentation;
          else
            txt = fv;

          if(mf.type.is_ref){
            ;
          } else if(mf.type.date_part) {
            txt = $p.moment(txt).format($p.moment._masks[mf.type.date_part]);

          } else if(mf.type.types[0]=="boolean") {
            txt = txt ? "1" : "0";
          }
        },

        by_type = function(fv){

          ft = _md.control_by_type(mf.type, fv);
          txt_by_type(fv, mf);

        },

        add_xml_row = function(f, tabular){
          if(tabular){
            var pref = f.property || f.param || f.Параметр || f.Свойство,
              pval = f.value != undefined ? f.value : f.Значение;
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
          }
          else if(typeof f === "object"){
            row_id = f.id;
            mf = extra_fields && extra_fields.metadata && extra_fields.metadata[row_id];
            if(!mf){
              mf = {synonym: f.synonym};
            }
            else if(f.synonym){
              mf.synonym = f.synonym;
            }

            ft = f.type;
            txt = "";
            if(f.hasOwnProperty("txt")){
              txt = f.txt;
            }
            else if((v = o[row_id]) !== undefined){
              txt_by_type(v, mf.type ? mf : _md.get(t.class_name, row_id));
            }
          }
          else if(extra_fields && extra_fields.metadata && ((mf = extra_fields.metadata[f]) !== undefined)){
            row_id = f;
            by_type(v = o[f]);
          }
          else if((v = o[f]) !== undefined){
            mf = _md.get(t.class_name, row_id = f);
            if(!mf){
              return;
            }
            by_type(v);
          }
          else{
            return;
          }

          gd += '<row id="' + row_id + '"><cell>' + (mf.synonym || mf.name) +
            '</cell><cell type="' + ft + '">' + txt + '</cell></row>';
        };

      default_oxml();

      for(i in oxml){
        if(i!=" "){
          gd += '<row open="1"><cell>' + i + '</cell>';   // если у блока есть заголовок, формируем блок иначе добавляем поля без иерархии
        }

        for(j in oxml[i]){
          add_xml_row(oxml[i][j]);                        // поля, описанные в текущем разделе
        }

        if(extra_fields && i == extra_fields.title && o[extra_fields.ts]){  // строки табчасти o.extra_fields
          var added = false,
            destinations_extra_fields = t.extra_fields(o),
            pnames = "property,param,Свойство,Параметр".split(","),
            //meta_extra_fields = o._metadata.tabular_sections[extra_fields.ts].fields,
            meta_extra_fields = o[extra_fields.ts]._owner._metadata.tabular_sections[o[extra_fields.ts]._name].fields,
            pname;

          // Если в объекте не найдены предопределенные свойства - добавляем
          if(pnames.some(function (name) {
              if(meta_extra_fields[name]){
                pname = name;
                return true;
              }
            })){
            o[extra_fields.ts].forEach(function (row) {
              var index = destinations_extra_fields.indexOf(row[pname]);
              if(index != -1)
                destinations_extra_fields.splice(index, 1);
            });
            destinations_extra_fields.forEach(function (property) {
              var row = o[extra_fields.ts].add();
              row[pname] = property;
            });
          };

          // Добавляем строки в oxml с учетом отбора, который мог быть задан в extra_fields.selection
          o[extra_fields.ts].find_rows(extra_fields.selection, function (row) {
            add_xml_row(row, extra_fields.ts);

          });
          //if(!added)
          //	add_xml_row({param: $p.cch.properties.get("", false)}, "params"); // fake-строка, если в табчасти нет допреквизитов

        }

        if(i!=" ") gd += '</row>';                          // если блок был открыт - закрываем
      }
      gd += '</rows>';
      return gd;
    }
  },

  /**
   * Печатает объект
   * @method print
   * @param ref {DataObj|String} - guid ссылки на объект
   * @param model {String|DataObj.cst.formulas} - идентификатор команды печати
   * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
   */
  print: {
    value: function(ref, model, wnd){

      function tune_wnd_print(wnd_print){
        if(wnd && wnd.progressOff)
          wnd.progressOff();
        if(wnd_print)
          wnd_print.focus();
      }

      if(wnd && wnd.progressOn){
        wnd.progressOn();
      }

      setTimeout(tune_wnd_print, 3000);

      // если _printing_plates содержит ссылку на обрабочтик печати, используем его
      if(this._printing_plates[model] instanceof DataObj){
        model = this._printing_plates[model];
      }

      // если существует локальный обработчик, используем его
      if(model instanceof DataObj && model.execute){

        if(ref instanceof DataObj)
          return model.execute(ref)
            .then(tune_wnd_print);
        else
          return this.get(ref, true, true)
            .then(model.execute.bind(model))
            .then(tune_wnd_print);

      }else{

        // иначе - печатаем средствами 1С или иного сервера
        var rattr = {};
        $p.ajax.default_attr(rattr, $p.job_prm.irest_url());
        rattr.url += this.rest_name + "(guid'" + $p.utils.fix_guid(ref) + "')" +
          "/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

        return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
          .then(tune_wnd_print);
      }

    }
  },

  /**
   * Возвращает промис со структурой печатных форм объекта
   * @return {Promise.<Object>}
   */
  printing_plates: {
    value: function(){
      var rattr = {}, t = this;

      if(!t._printing_plates){
        if(t.metadata().printing_plates)
          t._printing_plates = t.metadata().printing_plates;

        else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
          t._printing_plates = {};
        }
      }

      if(!t._printing_plates && $p.ajax.authorized){
        $p.ajax.default_attr(rattr, $p.job_prm.irest_url());
        rattr.url += t.rest_name + "/Print()";
        return $p.ajax.get_ex(rattr.url, rattr)
          .then(function (req) {
            t._printing_plates = JSON.parse(req.response);
            return t._printing_plates;
          })
          .catch(function () {
          })
          .then(function (pp) {
            return pp || (t._printing_plates = {});
          });
      }

      return Promise.resolve(t._printing_plates);

    }
  }

});


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

	RefDataManager.superclass.constructor.call(this, class_name);

}
RefDataManager._extend(DataManager);

RefDataManager.prototype.__define({

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {DataObj}
	 * @param [new_ref] {String} - новое значение ссылки объекта
	 */
	push: {
		value: function(o, new_ref){
			if(new_ref && (new_ref != o.ref)){
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			}else
				this.by_ref[o.ref] = o;
		}
	},

	/**
	 * Выполняет перебор элементов локальной коллекции
	 * @method each
	 * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
	 */
	each: {
		value: 	function(fn){
			for(var i in this.by_ref){
				if(!i || i == $p.utils.blank.guid)
					continue;
				if(fn.call(this, this.by_ref[i]) == true)
					break;
			}
		}
	},

	/**
	 * Синоним для each()
	 */
	forEach: {
		value: function (fn) {
			return this.each.call(this, fn);
		}
	},

	/**
	 * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
	 * @method get
	 * @param ref {String|Object} - ссылочный идентификатор
	 * @param [force_promise] {Boolean} - Если истина, возвращает промис, даже для локальных объектов. Если ложь, ищет только в локальном кеше
	 * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
	 * @return {DataObj|Promise.<DataObj>}
	 */
	get: {
		value: function(ref, force_promise, do_not_create){

			var o = this.by_ref[ref] || this.by_ref[(ref = $p.utils.fix_guid(ref))];

			if(!o){
				if(do_not_create && !force_promise)
					return;
				else
					o = new $p[this.obj_constructor()](ref, this, true);
			}

			if(force_promise === false)
				return o;

			else if(force_promise === undefined && ref === $p.utils.blank.guid)
				return o;

			if(o.is_new()){
				return o.load();	// читаем из 1С или иного сервера

			}else if(force_promise)
				return Promise.resolve(o);

			else
				return o;
		}
	},

	/**
	 * ### Создаёт новый объект типа объектов текущего менеджера
	 * Для кешируемых объектов, все действия происходят на клиенте<br />
	 * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
	 *
	 * @method create
	 * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
	 * @param [fill_default] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
	 * @return {Promise.<*>}
	 */
	create: {
		value: function(attr, fill_default, force_obj){

			if(!attr || typeof attr != "object")
				attr = {};
			if(!attr.ref || !$p.utils.is_guid(attr.ref) || $p.utils.is_empty_guid(attr.ref))
				attr.ref = $p.utils.generate_guid();

			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
					// заглушка ссылки объекта

				}else{

					if(o instanceof DocObj && o.date == $p.utils.blank.date)
						o.date = new Date();

					// Триггер после создания
					var after_create_res = this.handle_event(o, "after_create");

					// Если новый код или номер не были назначены в триггере - устанавливаем стандартное значение
					if((this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager)){
						if(!o.number_doc)
							o.new_number_doc();
					}
					else{
						if(!o.id && o._metadata.code_length)
							o.new_number_doc();
					}

					if(after_create_res === false)
						return Promise.resolve(o);

					else if(typeof after_create_res === "object" && after_create_res.then)
						return after_create_res;

					// выполняем обработчик после создания объекта и стандартные действия, если их не запретил обработчик
					if(this.cachable == "e1cib" && fill_default){
						var rattr = {};
						$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
						rattr.url += this.rest_name + "/Create()";
						return $p.ajax.get_ex(rattr.url, rattr)
							.then(function (req) {
								return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
							});
					}

				}
			}

			return force_obj ? o : Promise.resolve(o);
		}
	},

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method unload_obj
	 * @param ref
	 */
	unload_obj: {
		value: function(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if(o.ref == ref){
					a.splice(i, 1);
					return true;
				}
			});
		}
	},

	/**
	 * Находит первый элемент, в любом поле которого есть искомое значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @param columns {String|Array} - колонки, в которых искать
	 * @return {DataObj}
	 */
	find: {
		value: function(val, columns){
			return $p._find(this.by_ref, val, columns);
		}
	},

	/**
	 * ### Сохраняет массив объектов в менеджере
	 *
	 * @method load_array
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean|String} - перезаполнять объект
	 */
	load_array: {
		value: function(aattr, forse){

			var ref, obj, res = [];

			for(var i=0; i<aattr.length; i++){

				ref = $p.utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if(!obj){
					if(forse == "update_only"){
						continue;
					}
					obj = new $p[this.obj_constructor()](aattr[i], this);
					if(forse){
            obj._set_loaded();
          }
				}
				else if(obj.is_new() || forse){
					obj._mixin(aattr[i]);
					obj._set_loaded();
				}
				res.push(obj);
			}
			return res;
		}
	},

	/**
	 * Находит перую папку в пределах подчинения владельцу
	 * @method first_folder
	 * @param owner {DataObj|String}
	 * @return {DataObj} - ссылка найденной папки или пустая ссылка
	 */
	first_folder: {
		value: function(owner){
			for(var i in this.by_ref){
				var o = this.by_ref[i];
				if(o.is_folder && (!owner || $p.utils.is_equal(owner, o.owner)))
					return o;
			}
			return this.get();
		}
	},

	/**
	 * Возаращает массив запросов для создания таблиц объекта и его табличных частей
	 * @method get_sql_struct
	 * @param attr {Object}
	 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
	 * @return {Object|String}
	 */
	get_sql_struct: {
		value: function(attr){
			var t = this,
				cmd = t.metadata(),
				res = {}, f, f0, trunc_index = 0,
				action = attr && attr.action ? attr.action : "create_table";


			function sql_selection(){

				var ignore_parent = !attr.parent,
					parent = attr.parent || $p.utils.blank.guid,
					owner,
					initial_value = attr.initial_value || $p.utils.blank.guid,
					filter = attr.filter || "",
					set_parent = $p.utils.blank.guid;

				function list_flds(){
					var flds = [], s = "_t_.ref, _t_.`_deleted`";

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
								(owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
						else
							s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

					}else{
						if(cmd["has_owners"])
							s = " WHERE (" + (owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
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

					s += ") AND (_t_.ref != '" + $p.utils.blank.guid + "')";


					// допфильтры форм и связей параметров выбора
					if(attr.selection){
						if(typeof attr.selection == "function"){

						}else
							attr.selection.forEach(function(sel){
								for(var key in sel){

									if(typeof sel[key] == "function"){
										s += "\n AND " + sel[key](t, key) + " ";

									}else if(cmd.fields.hasOwnProperty(key) || key === "ref"){
										if(sel[key] === true)
											s += "\n AND _t_." + key + " ";

										else if(sel[key] === false)
											s += "\n AND (not _t_." + key + ") ";

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]) || $p.utils.is_guid(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else if(keys[0] == "in")
													s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce(function(sum, val){
														if(sum){
															sum+=",";
														}
														if(typeof val == "number"){
															sum+=val.toString();
														}else{
															sum+="'" + val + "'";
														}
														return  sum;
													}, "") + ")) ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
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
							owner = $p.utils.blank.guid;
					}

					// ссылка родителя во взаимосвязи с начальным значением выбора
					if(initial_value !=  $p.utils.blank.guid && ignore_parent){
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
					sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

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
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

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
				var fields = ["ref", "_deleted"],
					sql = "INSERT INTO `"+t.table_name+"` (ref, `_deleted`",
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
		}
	},

	/**
	 * ШапкаТаблицыПоИмениКласса
	 */
	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else if(this instanceof DocManager){
				acols.push(new Col_struct("date", "160", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("number_doc", "140", "ro", "left", "server", "Номер"));

				if(_meta.fields.note)
					acols.push(new Col_struct("note", "*", "ro", "left", "server", _meta.fields.note.synonym));

				if(_meta.fields.responsible)
					acols.push(new Col_struct("responsible", "*", "ro", "left", "server", _meta.fields.responsible.synonym));


			}else if(this instanceof ChartOfAccountManager){
				acols.push(new Col_struct("id", "140", "ro", "left", "server", "Код"));
				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

			}else{

				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				//if(_meta.has_owners){
				//	acols.push(new Col_struct("owner", "*", "ro", "left", "server", _meta.fields.owner.synonym));
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
		}
	},

	/**
	 * Догружает с сервера объекты, которых нет в локальном кеше
	 * @method load_cached_server_array
	 * @param list {Array} - массив строк ссылок или объектов со свойством ref
	 * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
	 * @return {Promise}
	 */
	load_cached_server_array: {
		value: function (list, alt_rest_name) {

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
		}
	},

	/**
	 * Возаращает предопределенный элемент по имени предопределенных данных
	 * @method predefined
	 * @param name {String} - имя предопределенного
	 * @return {DataObj}
	 */
	predefined: {
		value: function(name){

			if(!this._predefined)
				this._predefined = {};

			if(!this._predefined[name]){

				this._predefined[name] = this.get();

				this.find_rows({predefined_name: name}, function (el) {
					this._predefined[name] = el;
					return false;
				});
			}

			return this._predefined[name];
		}
	}

});



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

}
DataProcessorsManager._extend(DataManager);

DataProcessorsManager.prototype.__define({

	/**
	 * Создаёт экземпляр объекта обработки
	 * @method
	 * @return {DataProcessorObj}
	 */
	create: {
		value: function(attr){
			return new $p[this.obj_constructor()](attr || {}, this);
		}
	},

	/**
	 * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql. Добавлен, чтобы не ругалась форма объекта при закрытии
	 * @method unload_obj
	 * @param ref
	 */
	unload_obj: {
		value: function() {	}
	}
});



/**
 * ### Абстрактный менеджер перечисления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
 *
 * @class EnumManager
 * @extends RefDataManager
 * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
function EnumManager(class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	var a = $p.md.get(class_name);
	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);

EnumManager.prototype.__define({

	get: {
		value: function(ref){

			if(ref instanceof EnumObj)
				return ref;

			else if(!ref || ref == $p.utils.blank.guid)
				ref = "_";

			var o = this[ref];
			if(!o)
				o = new EnumObj({name: ref}, this);

			return o;
		}
	},

	push: {
		value: function(o, new_ref){
			this.__define(new_ref, {
				value : o
			});
		}
	},

	each: {
		value: function (fn) {
			this.alatable.forEach(function (v) {
				if(v.ref && v.ref != "_" && v.ref != $p.utils.blank.guid)
					fn.call(this[v.ref]);
			}.bind(this));
		}
	},

  /**
   * Bозаращает массив запросов для создания таблиц объекта и его табличных частей
   * @param attr {Object}
   * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
   * @return {Object|String}
   */
  get_sql_struct: {
	  value: function(attr){

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

    }
  },

  /**
   * Возвращает массив доступных значений для комбобокса
   * @method get_option_list
   * @param val {DataObj|String}
   * @param [selection] {Object}
   * @param [selection._top] {Number}
   * @return {Promise.<Array>}
   */
  get_option_list: {
    value: function(val, selection){
      var l = [], synonym = "", sref;

      function check(v){
        if($p.utils.is_equal(v.value, val))
          v.selected = true;
        return v;
      }

      if(selection){
        for(var i in selection){
          if(i.substr(0,1)=="_")
            continue;
          else if(i == "ref"){
            sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
          }
          else
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
        if(sref){
          if(Array.isArray(sref)){
            if(!sref.some(function (sv) {
                return sv.name == v.ref || sv.ref == v.ref || sv == v.ref;
              }))
              return;
          }else{
            if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
              return;
          }
        }
        l.push(check({text: v.synonym || "", value: v.ref}));
      });
      l.sort(function(a, b) {
        if (a.text < b.text){
          return -1;
        }
        else if (a.text > b.text){
          return 1;
        }
        return 0;
      })
      return Promise.resolve(l);
    }
  }

});


/**
 * ### Абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 *
 * @class RegisterManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function RegisterManager(class_name){

	RegisterManager.superclass.constructor.call(this, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {RegisterRow}
	 * @param [new_ref] {String} - новое значение ссылки объекта
	 */
	this.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete this.by_ref[o.ref];
			this.by_ref[new_ref] = o;
		}else
			this.by_ref[o.ref] = o;
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
		else if(typeof attr == "string")
			attr = {ref: attr};

		if(attr.ref && return_row)
			return force_promise ? Promise.resolve(this.by_ref[attr.ref]) : this.by_ref[attr.ref];

		attr.action = "select";

		var arr = $p.wsql.alasql(this.get_sql_struct(attr), attr._values),
			res;

		delete attr.action;
		delete attr._values;

		if(arr.length){
			if(return_row)
				res = this.by_ref[this.get_ref(arr[0])];
			else{
				res = [];
				for(var i in arr)
					res.push(this.by_ref[this.get_ref(arr[i])]);
			}
		}

		return force_promise ? Promise.resolve(res) : res;
	};

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method unload_obj
	 * @param ref
	 */
	this.unload_obj = function(ref) {
		delete this.by_ref[ref];
		this.alatable.some(function (o, i, a) {
			if(o.ref == ref){
				a.splice(i, 1);
				return true;
			}
		});
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	this.load_array = function(aattr, forse){
		var ref, obj, res = [];

		for(var i=0; i<aattr.length; i++){
			ref = this.get_ref(aattr[i]);
			obj = this.by_ref[ref];

			if(!obj && !aattr[i]._deleted){
				obj = new $p[this.obj_constructor()](aattr[i], this);
				forse && obj._set_loaded();
			}
			else if(aattr[i]._deleted){
        obj && obj.unload();
				continue;
			}
			else if(obj.is_new() || forse){
				obj._mixin(aattr[i]);
				obj._set_loaded();
			}
			res.push(obj);
		}
		return res;
	};

}
RegisterManager._extend(DataManager);

RegisterManager.prototype.__define({

	/**
	 * Возаращает запросов для создания таблиц или извлечения данных
	 * @method get_sql_struct
	 * @for RegisterManager
	 * @param attr {Object}
	 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
	 * @return {Object|String}
	 */
	get_sql_struct: {
		value: function(attr) {
			var t = this,
				cmd = t.metadata(),
				res = {}, f,
				action = attr && attr.action ? attr.action : "create_table";

			function sql_selection(){

				var filter = attr.filter || "";

				function list_flds(){
					var flds = [], s = "_t_.ref";

					if(cmd.form && cmd.form.selection){
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});

					}else{

						for(var f in cmd["dimensions"]){
							flds.push(f);
						}
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

					var s = " WHERE (" + (filter ? 0 : 1);

					if(t.sql_selection_where_flds){
						s += t.sql_selection_where_flds(filter);

					}

					s += ")";


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

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
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

					return "";
				}

				// строка фильтра
				if(filter && filter.indexOf("%") == -1)
					filter = "%" + filter + "%";

				var sql;
				if(t.sql_selection_list_flds)
					sql = t.sql_selection_list_flds();
				else
					sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
						.replace("%2", list_flds())
						.replace("%j", join_flds())
					;

				return sql.replace("%3", where_flds()).replace("%4", order_flds());

			}

			function sql_create(){

				var sql = "CREATE TABLE IF NOT EXISTS ",
					first_field = true;

				if(attr && attr.postgres){
					sql += t.table_name+" (";

					if(cmd.splitted){
						sql += "zone integer";
						first_field = false;
					}

					for(f in cmd.dimensions){
						if(first_field){
							sql += f;
							first_field = false;
						}else
							sql += ", " + f;
						sql += _md.sql_type(t, f, cmd.dimensions[f].type, true) + _md.sql_composite(cmd.dimensions, f, "", true);
					}

					for(f in cmd.resources)
						sql += ", " + f + _md.sql_type(t, f, cmd.resources[f].type, true) + _md.sql_composite(cmd.resources, f, "", true);

					for(f in cmd.attributes)
						sql += ", " + f + _md.sql_type(t, f, cmd.attributes[f].type, true) + _md.sql_composite(cmd.attributes, f, "", true);

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
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					//sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.dimensions[f].type) + _md.sql_composite(cmd.dimensions, f);

					for(f in cmd.dimensions)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.dimensions[f].type);

					for(f in cmd.resources)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.resources[f].type);

					for(f in cmd.attributes)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.attributes[f].type);

					// sql += ", PRIMARY KEY (";
					// first_field = true;
					// for(f in cmd["dimensions"]){
					// 	if(first_field){
					// 		sql += "`" + f + "`";
					// 		first_field = false;
					// 	}else
					// 		sql += _md.sql_mask(f);
					// }
				}

				sql += ")";

				return sql;
			}

			function sql_update(){
				// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
				var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
					fields = [],
					first_field = true;

				for(f in cmd.dimensions){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.resources){
					sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.attributes){
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

			else if(action == "get_selection")
				res = sql_selection();

			return res;
		}
	},

	get_ref: {
		value: function(attr){

			if(attr instanceof RegisterRow)
				attr = attr._obj;

			if(attr.ref)
				return attr.ref;

			var key = "",
				dimensions = this.metadata().dimensions;

			for(var j in dimensions){
				key += (key ? "¶" : "");
				if(dimensions[j].type.is_ref)
					key += $p.utils.fix_guid(attr[j]);

				else if(!attr[j] && dimensions[j].type.digits)
					key += "0";

				else if(dimensions[j].date_part)
					key += $p.moment(attr[j] || $p.utils.blank.date).format($p.moment.defaultFormatUtc);

				else if(attr[j]!=undefined)
					key += String(attr[j]);

				else
					key += "$";
			}
			return key;
		}
	},

	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else{

				for(var f in _meta["dimensions"]){
					acols.push(new Col_struct(f, "*", "ro", "left", "server", _meta["dimensions"][f].synonym));
				}
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
		}
	},

	create: {
		value: function(attr){

			if(!attr || typeof attr != "object")
				attr = {};


			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				// Триггер после создания
				var after_create_res = this.handle_event(o, "after_create");

				if(after_create_res === false)
					return Promise.resolve(o);

				else if(typeof after_create_res === "object" && after_create_res.then)
					return after_create_res;
			}

			return Promise.resolve(o);
		}
	}
});



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

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		/**
		 * ### Признак "это группа"
		 * @property is_folder
		 * @for CatObj
		 * @type {Boolean}
		 */
		$p[this.obj_constructor()].prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.utils.fix_boolean(v)},
			enumerable: true,
			configurable: true
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


	DocManager.superclass.constructor.call(this, class_name);

}
DocManager._extend(RefDataManager);

/**
 * ### Абстрактный менеджер задач
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Tasks"}}{{/crossLink}}
 *
 * @class TaskManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function TaskManager(class_name){

	TaskManager.superclass.constructor.call(this, class_name);

}
TaskManager._extend(CatManager);

/**
 * ### Абстрактный менеджер бизнес-процессов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "BusinessProcesses"}}{{/crossLink}}
 *
 * @class BusinessProcessManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function BusinessProcessManager(class_name){

	BusinessProcessManager.superclass.constructor.call(this, class_name);

}
BusinessProcessManager._extend(CatManager);


/**
 * ### Журнал событий
 * Хранит и накапливает события сеанса<br />
 * Является наследником регистра сведений
 * @extends InfoRegManager
 * @class LogManager
 * @static
 */
function LogManager(){

	LogManager.superclass.constructor.call(this, "ireg.log");

	var smax;

	this.__define({

		/**
		 * Добавляет запись в журнал
		 * @param msg {String|Object|Error} - текст + класс события
		 * @param [msg.obj] {Object} - дополнительный json объект
		 */
		record: {
			value: function(msg){

				if(msg instanceof Error){
          console && console.log(msg);
					msg = {
						class: "error",
						note: msg.toString()
					}
				}
        else if(msg instanceof DataObj){
          console && console.log(msg);
          var _err = msg._data._err;
          msg = {
            class: "error",
            obj: {
              type: msg.class_name,
              ref: msg.ref,
              presentation: msg.presentation
            },
            note: _err ? _err.text : ''
          }
        }
				else if(typeof msg == "object" && !msg.class && !msg.obj){
					msg = {
						class: "obj",
						obj: msg,
						note: msg.note
					};
				}
				else if(typeof msg != "object"){
          msg = {note: msg};
        }

				msg.date = Date.now() + $p.wsql.time_diff;

				// уникальность ключа
				if(!smax){
          smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?");
        }
				var res = smax([msg.date]);
        msg.sequence = (!res.length || res[0].sequence === undefined) ? 0 : parseInt(res[0].sequence) + 1;

				// класс сообщения
				if(!msg.class){
          msg.class = "note";
        }

				$p.wsql.alasql("insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)",
					[msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

        msg.note && $p.msg && $p.msg.show_msg && $p.msg.show_msg([msg.class, msg.note]);

			}
		},

		/**
		 * Сбрасывает события на сервер
		 * @method backup
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		backup: {
			value: function(dfrom, dtill){

			}
		},

		/**
		 * Восстанавливает события из архива на сервере
		 * @method restore
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		restore: {
			value: function(dfrom, dtill){

			}
		},

		/**
		 * Стирает события в указанном диапазоне дат
		 * @method clear
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		clear: {
			value: function(dfrom, dtill){

			}
		},

		show: {
			value: function (pwnd) {

			}
		},

		get: {
			value: function (ref, force_promise, do_not_create) {

				if(typeof ref == "object")
					ref = ref.ref || "";

				if(!this.by_ref[ref]){

					if(force_promise === false)
						return undefined;

					var parts = ref.split("¶");
					$p.wsql.alasql("select * from `ireg_log` where date=" + parts[0] + " and sequence=" + parts[1]).forEach(function (row) {
						new RegisterRow(row, this);
					}.bind(this));
				}

				return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
			}
		},

		get_sql_struct: {
			value: function(attr){

				if(attr && attr.action == "get_selection"){
					var sql = "select * from `ireg_log`";
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
			}
		},

		caption_flds: {
			value: function (attr) {

				var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
					acols = [], s = "";


				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
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
			}
		},

		data_to_grid: {
			value: function (data, attr) {
				var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
						.replace("%1", data.length).replace("%2", attr.start)
						.replace("%3", attr.set_parent || "" ),
					caption = this.caption_flds(attr);

				// при первом обращении к методу добавляем описание колонок
				xml += caption.head;

				data.forEach(function(r){
					xml += "<row id=\"" + r.ref + "\"><cell>" +
						$p.moment(r.date - $p.wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + r.sequence + "</cell>" +
						"<cell>" + (r.class || "") + "</cell><cell>" + (r.note || "") + "</cell></row>";
				});

				return xml + "</rows>";
			}
		}

	});

}
LogManager._extend(InfoRegManager);


/**
 * ### Менеджер объектов метаданных
 * Используется для формирования списков типов документов, справочников и т.д.
 * Например, при работе в интерфейсе с составными типами
 */
function MetaObjManager() {

	MetaObjManager.superclass.constructor.call(this, "cat.meta_objs");
}
MetaObjManager._extend(CatManager);


/**
 * ### Менеджер доступных полей
 * Используется при настройке отчетов и динамических списков
 */
function MetaFieldManager() {

	MetaFieldManager.superclass.constructor.call(this, "cat.meta_fields");
}
MetaFieldManager._extend(CatManager);


/**
 * ### Менеджер настроек отчетов и динсписков
 */
function SchemeSettingsManager() {

	SchemeSettingsManager.superclass.constructor.call(this, "cat.scheme_settings");
}
SchemeSettingsManager._extend(CatManager);



/**
 * Конструкторы табличных частей
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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
 * @menuorder 21
 * @tooltip Табличная часть
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
	return "Табличная часть " + this._owner.class_name + "." + this._name
};

/**
 * ### Возвращает строку табчасти по индексу
 * @method get
 * @param index {Number} - индекс строки табчасти
 * @return {TabularSectionRow}
 */
TabularSection.prototype.get = function(index){
	return this._obj[index] ? this._obj[index]._row : null;
};

/**
 * ### Возвращает количество элементов в табчасти
 * @method count
 * @return {Number}
 *
 * @example
 *     // количество элементов в табчасти
 *     var count = ts.count();
 */
TabularSection.prototype.count = function(){return this._obj.length};

/**
 * ### Очищает табличнут часть
 * @method clear
 * @return {TabularSection}
 *
 * @example
 *     // Очищает табличнут часть
 *     ts.clear();
 *
 */
TabularSection.prototype.clear = function(silent, selection){

  if(!selection){
    this._obj.length = 0;
  }
  else{
    this.find_rows(selection).forEach(function (row) {
      row._row._owner.del(row.row-1, true);
    })
  }

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	return this;
};

/**
 * ### Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val, silent){

	var index, _obj = this._obj;

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

	_obj.forEach(function (row, index) {
		row.row = index + 1;
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	this._owner._data._modified = true;
};

/**
 * ### Находит первую строку, содержащую значение
 * @method find
 * @param val {*} - значение для поиска
 * @param columns {String|Array} - колонки, в которых искать
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val, columns){
	var res = $p._find(this._obj, val, columns);
	if(res)
		return res._row;
};

/**
 * ### Находит строки, соответствующие отбору
 * Если отбор пустой, возвращаются все строки табчасти
 *
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
 * ### Меняет местами строки табчасти
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){

	var row1 = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = row1;
  this._obj[rowid1].row = rowid1 + 1;
  this._obj[rowid2].row = rowid2 + 1;

	if(!this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});
};

/**
 * ### Добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 *
 * @example
 *     // Добавляет строку в табчасть и заполняет её значениями, переданными в аргументе
 *     var row = ts.add({field1: value1});
 */
TabularSection.prototype.add = function(attr, silent){

	var row = new $p[this._owner._manager.obj_constructor(this._name)](this);

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

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;

	this._owner._data._modified = true;

	return row;
};

/**
 * ### Выполняет цикл "для каждого"
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
 * ### Псевдоним для each
 * @method forEach
 * @type {TabularSection.each|*}
 */
TabularSection.prototype.forEach = TabularSection.prototype.each;

/**
 * ### Сворачивает табличную часть
 * детали см. в {{#crossLink "TabularSection/aggregate:method"}}{{/crossLink}}
 * @method group_by
 * @param [dimensions] {Array|String}
 * @param [resources] {Array|String}
 */
TabularSection.prototype.group_by = function (dimensions, resources) {

	try{
		var res = this.aggregate(dimensions, resources, "SUM", true);
		return this.clear(true).load(res);

	}catch(err){}
};

/**
 * ### Сортирует табличную часть
 *
 * @method sort
 * @param fields {Array|String}
 */
TabularSection.prototype.sort = function (fields) {

	if(typeof fields == "string")
		fields = fields.split(",");

	var sql = "select * from ? order by ", res = true;
	fields.forEach(function (f) {
		f = f.trim().replace(/\s{1,}/g," ").split(" ");
		if(res)
			res = false;
		else
			sql += ", ";
		sql += "`" + f[0] + "`";
		if(f[1])
			sql += " " + f[1];
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		return this.clear(true).load(res);

	}catch(err){
		$p.record_log(err);
	}
};

/**
 * ### Вычисляет агрегатную функцию по табличной части
 * - Не изменяет исходный объект. Если пропущен аргумент `aggr` - вычисляет сумму.
 * - Стандартные агрегаторы: SUM, COUNT, MIN, MAX, FIRST, LAST, AVG, AGGR, ARRAY, REDUCE
 * - AGGR - позволяет задать собственный агрегатор (функцию) для расчета итогов
 *
 * @method aggregate
 * @param [dimensions] {Array|String} - список измерений
 * @param [resources] {Array|String} - список ресурсов
 * @param [aggr] {String} - агрегатная функция
 * @param [ret_array] {Boolran} - указывает возвращать массив значений
 * @return {Number|Array} - Значение агрегатной фукнции или массив значений
 *
 * @example
 *     // вычисляем сумму (итог) по полю amount табличной части
 *     var total = ts.aggregate("", "amount");
 *
 *     // вычисляем максимальные суммы для всех номенклатур табличной части
 *     // вернёт массив объектов {nom, amount}
 *     var total = ts.aggregate("nom", "amount", "MAX", true);
 */
TabularSection.prototype.aggregate = function (dimensions, resources, aggr, ret_array) {

	if(typeof dimensions == "string")
		dimensions = dimensions.split(",");
	if(typeof resources == "string")
		resources = resources.split(",");
	if(!aggr)
		aggr = "sum";

	// для простых агрегатных функций, sql не используем
	if(!dimensions.length && resources.length == 1 && aggr == "sum"){
		return this._obj.reduce(function(sum, row, index, array) {
			return sum + row[resources[0]];
		}, 0);
	}

	var sql, res = true;

	resources.forEach(function (f) {
		if(!sql)
			sql = "select " + aggr + "(`" + f + "`) `" + f + "`";
		else
			sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
	});
	dimensions.forEach(function (f) {
		if(!sql)
			sql = "select `" + f + "`";
		else
			sql += ", `" + f + "`";
	});
	sql += " from ? ";
	dimensions.forEach(function (f) {
		if(res){
			sql += "group by ";
			res = false;
		}
		else
			sql += ", ";
		sql += "`" + f + "`";
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		if(!ret_array){
			if(resources.length == 1)
				res = res.length ? res[0][resources[0]] : 0;
			else
				res = res.length ? res[0] : {};
		}
		return res;

	}catch(err){
		$p.record_log(err);
	}
};

/**
 * ### Загружает табличнут часть из массива объектов
 *
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

	if(!this._owner._data._silent)
		Object.getNotifier(t._owner).notify({
			type: 'rows',
			tabular: t._name
		});

	return t;
};

/**
 * ### Перезаполняет грид данными табчасти с учетом отбора
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
			if($p.utils.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	if(grid.objBox){
		try{
			grid.parse(grid_data, "json");
			grid.callEvent("onGridReconstructed", []);
		} catch (e){}
	}
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


/**
 * ### Aбстрактная строка табличной части
 *
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 * @menuorder 22
 * @tooltip Строка табчасти
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
 * ### Метаданые строки табличной части
 * @property _metadata
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * ### Номер строки табличной части
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
 * ### Копирует строку табличной части
 * @method _clone
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define("_clone", {
	value : function(){
		return new $p[this._owner._owner._manager.obj_constructor(this._owner._name)](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v || (!v && this._obj[f] == $p.utils.blank.guid))
		return;

	var _owner = this._owner._owner;

	if(!_owner._data._silent)
		Object.getNotifier(_owner).notify({
			type: 'row',
			row: this,
			tabular: this._owner._name,
			name: f,
			oldValue: this._obj[f]
		});

	// учтём связь по типу
	if(this._metadata.fields[f].choice_type){
		var prop;
		if(this._metadata.fields[f].choice_type.path.length == 2)
			prop = this[this._metadata.fields[f].choice_type.path[1]];
		else
			prop = _owner[this._metadata.fields[f].choice_type.path[0]];
		if(prop && prop.type)
			v = $p.utils.fetch_type(v, prop.type);
	}

	DataObj.prototype.__setter.call(this, f, v);
  _owner._data._modified = true;

};


/**
 * Конструкторы объектов данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_objs
 * @requires common
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumObj"}}{{/crossLink}} - ПеречислениеОбъект
 * - {{#crossLink "CatObj"}}{{/crossLink}} - СправочникОбъект
 * - {{#crossLink "DocObj"}}{{/crossLink}} - ДокументОбъект
 * - {{#crossLink "DataProcessorObj"}}{{/crossLink}} - ОбработкаОбъект
 * - {{#crossLink "TaskObj"}}{{/crossLink}} - ЗадачаОбъект
 * - {{#crossLink "BusinessProcessObj"}}{{/crossLink}} - БизнеспроцессОбъект
 * - {{#crossLink "RegisterRow"}}{{/crossLink}} - ЗаписьРегистраОбъект
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 * @menuorder 20
 * @tooltip Объект данных
 */
function DataObj(attr, manager) {

	var tmp,
		_ts_ = {};

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager)){
    tmp = manager.get(attr, false, true);
  }

	if(tmp){
		attr = null;
		return tmp;
	}


	this.__define({

		/**
		 * Хранилище ссылок на табличные части - не сохраняется в базе данных
		 * @property _ts_
		 */
		_ts_: {
			value: function( name ) {
				if( !_ts_[name] ) {
					_ts_[name] = new TabularSection(name, this);
				}
				return _ts_[name];
			},
			configurable: true
		},

		/**
		 * Указатель на менеджер данного объекта
		 * @property _manager
		 * @type DataManager
		 * @final
		 */
		_manager: {
			value : manager
		},

    /**
     * Пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
     * @property _data
     * @type DataManager
     * @final
     */
    _data: {
		  value: {
        _is_new: !(this instanceof EnumObj)
      }
    },

    /**
     * ### Фактическое хранилище данных объекта
     * Оно же, запись в таблице объекта локальной базы данных
     * @property _obj
     * @type Object
     * @final
     */
    _obj: {
		  value: {
        ref: manager instanceof EnumManager ? attr.name : (manager instanceof RegisterManager ? manager.get_ref(attr) : $p.utils.fix_guid(attr))
      }
    }

	});


	if(manager.alatable && manager.push){
		manager.alatable.push(this._obj);
		manager.push(this, this._obj.ref);
	}

	attr = null;

}

DataObj.prototype.__define({

	/**
	 * ### valueOf
	 * для операций сравнения возвращаем guid
	 */
	valueOf: {
		value: function () {
			return this.ref;
		}
	},

	/**
	 * ### toJSON
	 * для сериализации возвращаем внутренний _obj
	 */
	toJSON: {
		value: function () {
			return this._obj;
		}
	},

	/**
	 * ### toString
	 * для строкового представления используем
	 */
	toString: {
		value: function () {
			return this.presentation;
		}
	},

  __notify: {
	  value: function (f) {
      if(!this._data._silent)
        Object.getNotifier(this).notify({
          type: 'update',
          name: f,
          oldValue: this._obj[f]
        });
    }
  },

  _getter: {
	  value: function (f) {

      var mf = this._metadata.fields[f].type,
        res = this._obj ? this._obj[f] : "",
        mgr, ref;

      if(f == "type" && typeof res == "object")
        return res;

      else if(f == "ref"){
        return res;

      }else if(mf.is_ref){

        if(mf.digits && typeof res === "number"){
          return res;
        }

        if(mf.hasOwnProperty("str_len") && !$p.utils.is_guid(res)){
          return res;
        }

        if(mgr = _md.value_mgr(this._obj, f, mf)){
          if($p.utils.is_data_mgr(mgr)){
            return mgr.get(res, false);
          }
          else{
            return $p.utils.fetch_type(res, mgr);
          }
        }

        if(res){
          console.log([f, mf, this._obj]);
          return null;
        }

      }else if(mf.date_part)
        return $p.utils.fix_date(this._obj[f], true);

      else if(mf.digits)
        return $p.utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));

      else if(mf.types[0]=="boolean")
        return $p.utils.fix_boolean(this._obj[f]);

      else
        return this._obj[f] || "";
    }
  },

  _getter_ts: {
	  value: function (f) {return this._ts_(f)}
  },

  _setter: {
	  value: function (f, v) {

      if(this._obj[f] == v)
        return;

      this.__notify(f);
      this.__setter(f, v);
      this._data._modified = true;

    }
  },

  __setter: {
    value: function (f, v) {

      var mf = this._metadata.fields[f].type,
        mgr;

      if(f == "type" && v.types)
        this._obj[f] = v;

      else if(f == "ref")

        this._obj[f] = $p.utils.fix_guid(v);

      else if(mf.is_ref){

        if(mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !$p.utils.is_guid(v)){
          this._obj[f] = v;
        }
        else if(typeof v == "boolean" && mf.types.indexOf("boolean") != -1){
          this._obj[f] = v;
        }
        else {
          this._obj[f] = $p.utils.fix_guid(v);

          mgr = _md.value_mgr(this._obj, f, mf, false, v);

          if(mgr){
            if(mgr instanceof EnumManager){
              if(typeof v == "string"){
                this._obj[f] = v;
              }
              else if(!v){
                this._obj[f] = "";
              }
              else if(typeof v == "object"){
                this._obj[f] = v.ref || v.name || "";
              }
            }
            else if(v && v.presentation){
              if(v.type && !(v instanceof DataObj)){
                delete v.type;
              }
              mgr.create(v);
            }
            else if(!$p.utils.is_data_mgr(mgr)){
              this._obj[f] = $p.utils.fetch_type(v, mgr);
            }
          }
          else{
            if(typeof v != "object"){
              this._obj[f] = v;
            }
          }
        }
      }
      else if(mf.date_part){
        this._obj[f] = $p.utils.fix_date(v, true);
      }
      else if(mf.digits){
        this._obj[f] = $p.utils.fix_number(v, !mf.hasOwnProperty("str_len"));
      }
      else if(mf.types[0]=="boolean"){
        this._obj[f] = $p.utils.fix_boolean(v);
      }
      else{
        this._obj[f] = v;
      }

    }
  },

  _setter_ts: {
	  value: function (f, v) {
      var ts = this._ts_(f);
      ts instanceof TabularSection && Array.isArray(v) && ts.load(v);
    }
  },


	/**
	 * Метаданные текущего объекта
	 * @property _metadata
	 * @for DataObj
	 * @type Object
	 * @final
	 */
	_metadata: {
		get : function(){
			return this._manager.metadata()
		}
	},

	/**
	 * Пометка удаления
	 * @property _deleted
	 * @for DataObj
	 * @type Boolean
	 */
	_deleted: {
		get : function(){
			return !!this._obj._deleted
		}
	},

	/**
	 * Признак модифицированности
	 */
	_modified: {
		get : function(){
			if(!this._data)
				return false;
			return !!(this._data._modified)
		}
	},

	/**
	 * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	is_new: {
		value: function(){
			return this._data._is_new;
		}
	},

	/**
	 * Метод для ручной установки признака _прочитан_ (не новый)
	 */
	_set_loaded: {
		value: function(ref){
			this._manager.push(this, ref);
			this._data._modified = false;
			this._data._is_new = false;
			return this;
		}
	},

	/**
	 * Установить пометку удаления
	 * @method mark_deleted
	 * @for DataObj
	 * @param deleted {Boolean}
	 */
	mark_deleted: {
		value: function(deleted){
			this._obj._deleted = !!deleted;
			this.save();
			this.__notify('_deleted');
			return this;
		}
	},

	/**
	 * guid ссылки объекта
	 * @property ref
	 * @for DataObj
	 * @type String
	 */
	ref: {
		get : function(){return this._obj.ref},
		set : function(v){this._obj.ref = $p.utils.fix_guid(v)},
		enumerable : true,
		configurable: true
	},

  /**
   * ### Имя типа этого объекта
   * @property class_name
   * @type String
   * @final
   */
  class_name: {
    get : function(){return this._manager.class_name},
    set : function(v){this._obj.class_name = v}
  },

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return $p.utils.is_empty_guid(this._obj.ref);
		}
	},

	/**
	 * Читает объект из внешней или внутренней датабазы асинхронно.
	 * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
	 * @method load
	 * @for DataObj
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	load: {
		value: function(){

			var reset_modified = function () {
					reset_modified = null;
					this._data._modified = false;
					return this;
				}.bind(this);

			if(this.ref == $p.utils.blank.guid){
				if(this instanceof CatObj){
          this.id = "000000000";
        }
				else{
          this.number_doc = "000000000";
        }
				return Promise.resolve(this);
			}
			else{
				if(this._manager.cachable && this._manager.cachable != "e1cib"){
					return $p.wsql.pouch.load_obj(this).then(reset_modified);
				}
				else{
          return _rest.load_obj(this).then(reset_modified);
        }
			}
		}
	},

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 * @for DataObj
	 */
	unload: {
		value: function(){
			var f, obj = this._obj;

			this._manager.unload_obj(this.ref);

			if(this._observers)
				this._observers.length = 0;

			if(this._notis)
				this._notis.length = 0;

			for(f in this._metadata.tabular_sections)
				this[f].clear(true);

			for(f in this){
				if(this.hasOwnProperty(f))
					delete this[f];
			}
			for(f in obj)
				delete obj[f];
			["_ts_","_obj","_data"].forEach(function (f) {
				delete this[f];
			}.bind(this));
			f = obj = null;
		}
	},

	/**
	 * ### Записывает объект
	 * Ввыполняет подписки на события перед записью и после записи<br />
	 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
	 *
	 * @method save
	 * @for DataObj
	 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param [operational] {Boolean} - режим проведения документа (Оперативный, Неоперативный)
	 * @param [attachments] {Array} - массив вложений
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	save: {
		value: function (post, operational, attachments) {

			if(this instanceof DocObj && typeof post == "boolean"){
				var initial_posted = this.posted;
				this.posted = post;
			}

			var saver,

				before_save_res = this._manager.handle_event(this, "before_save"),

				reset_modified = function () {
					if(before_save_res === false){
						if(this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted){
							this.posted = initial_posted;
						}
					}else{
            this._data._modified = false;
          }
					saver = null;
					before_save_res = null;
					reset_modified = null;
					return this;
				}.bind(this);

			// если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
			if(before_save_res === false){
				return Promise.reject(reset_modified());
			}
      // если пользовательский обработчик перед записью вернул промис, его и возвращаем
			else if(before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then){
				return before_save_res.then(reset_modified);
			}

			// для объектов с иерархией установим пустого родителя, если иной не указан
			if(this._metadata.hierarchical && !this._obj.parent){
        this._obj.parent = $p.utils.blank.guid;
      }

			// для документов, контролируем заполненность даты
			if(this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj){
				if($p.utils.blank.date == this.date)
					this.date = new Date();
				if(!this.number_doc)
					this.new_number_doc();
			}
			else{
				if(!this.id)
					this.new_number_doc();
			}

			// если не указаны обязательные реквизиты
			if($p.msg && $p.msg.show_msg){
				for(var mf in this._metadata.fields){
					if(this._metadata.fields[mf].mandatory && !this._obj[mf]){
						$p.msg.show_msg({
							title: $p.msg.mandatory_title,
							type: "alert-error",
							text: $p.msg.mandatory_field.replace("%1", this._metadata.fields[mf].synonym)
						});
						before_save_res = false;
						return Promise.reject(reset_modified());
					}
				}
			}

			// в зависимости от типа кеширования, получаем saver
			if(this._manager.cachable && this._manager.cachable != "e1cib"){
				saver = $p.wsql.pouch.save_obj;
			}
      // запрос к серверу 1C по сети
			else {
				saver = _rest.save_irest;
			}

			// Сохраняем во внешней базе
			return saver(
				this, {
					post: post,
					operational: operational,
					attachments: attachments
				})
			// и выполняем обработку после записи
				.then(function (obj) {
					return obj._manager.handle_event(obj, "after_save");
				})
				.then(reset_modified);
		}
	},

	/**
	 * ### Возвращает присоединенный объект или файл
	 * @method get_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 */
	get_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		}
	},

	/**
	 * ### Сохраняет объект или файл во вложении
	 * Вызывает {{#crossLink "DataManager/save_attachment:method"}} одноименный метод менеджера {{/crossLink}} и передаёт ссылку на себя в качестве контекста
	 *
	 * @method save_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @param attachment {Blob|String} - вложениe
	 * @param [type] {String} - mime тип
	 * @return Promise.<DataObj>
	 * @async
	 */
	save_attachment: {
		value: function (att_id, attachment, type) {
			return this._manager.save_attachment(this.ref, att_id, attachment, type)
				.then(function (att) {
					if(!this._attachments)
						this._attachments = {};
					if(!this._attachments[att_id] || !att.stub)
						this._attachments[att_id] = att;
					return att;
				}.bind(this));
		}
	},

	/**
	 * ### Удаляет присоединенный объект или файл
	 * Вызывает одноименный метод менеджера и передаёт ссылку на себя в качестве контекста
	 *
	 * @method delete_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @async
	 */
	delete_attachment: {
		value: function (att_id) {
			return this._manager.delete_attachment(this.ref, att_id)
				.then(function (att) {
					if(this._attachments)
						delete this._attachments[att_id];
					return att;
				}.bind(this));
		}
	},

	/**
	 * ### Включает тихий режим
	 * Режим, при котором объект не информирует мир об изменениях своих свойств.<br />
	 * Полезно, например, при групповых изменениях, чтобы следящие за объектом формы не тратили время на перерисовку при изменении каждого совйтсва
	 *
	 * @method _silent
	 * @for DataObj
	 * @param [v] {Boolean}
	 */
	_silent: {
		value: function (v) {
			if(typeof v == "boolean")
				this._data._silent = v;
			else{
				this._data._silent = true;
				setTimeout(function () {
					this._data._silent = false;
				}.bind(this));
			}
		}
	},

	/**
	 * ### Выполняет команду печати
	 * Вызывает одноименный метод менеджера и передаёт себя в качестве объекта печати
	 *
	 * @method print
	 * @for DataObj
	 * @param model {String} - идентификатор макета печатной формы
	 * @param [wnd] - указатель на форму, из которой произведён вызов команды печати
	 * @return {*|{value}|void}
	 * @async
	 */
	print: {
		value: function (model, wnd) {
			return this._manager.print(this, model, wnd);
		}
	}

});


/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
function CatObj(attr, manager) {

	// выполняем конструктор родительского объекта
	CatObj.superclass.constructor.call(this, attr, manager);

	if(this._data && attr && typeof attr == "object"){
	  this._data._silent = true;
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}
		else{
			this._mixin(attr);
			if(!$p.utils.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
    this._data._silent = false;
	}

}
CatObj._extend(DataObj);

CatObj.prototype.__define({

  /**
   * ### Код элемента справочника
   * @property id
   * @type String|Number
   */
  id: {
    get : function(){ return this._obj.id || ""},
    set : function(v){
      this.__notify('id');
      this._obj.id = v;
    },
    enumerable: true
  },

  /**
   * ### Наименование элемента справочника
   * @property name
   * @type String
   */
  name: {
    get : function(){ return this._obj.name || ""},
    set : function(v){
      this.__notify('name');
      this._obj.name = String(v);
    },
    enumerable: true
  },

  /**
   * Представление объекта
   * @property presentation
   * @for CatObj
   * @type String
   */
  presentation: {
    get : function(){
      if(this.name || this.id){
        // return this._metadata.obj_presentation || this._metadata.synonym + " " + this.name || this.id;
        return this.name || this.id || this._metadata.obj_presentation || this._metadata.synonym;
      }else{
        return this._presentation || "";
      }
    },
    set : function(v){
      if(v){
        this._presentation = String(v);
      }
    }
  },

  /**
   * ### В иерархии
   * Выясняет, находится ли текущий объект в указанной группе
   *
   * @param group {Object|Array} - папка или массив папок
   *
   */
  _hierarchy: {
    value: function (group) {
      var t = this;
      if(Array.isArray(group)){
        return group.some(function (v) {
          return t._hierarchy(v);
        });
      }
      if(this == group || t.parent == group){
        return true;
      }
      var parent = t.parent;
      if(parent && !parent.empty()){
        return parent._hierarchy(group);
      }
      return group == $p.utils.blank.guid;
    }
  },

  /**
   * ### Дети
   * Возвращает массив элементов, находящихся в иерархии текущего
   */
  _children: {
    get: function () {
      var  t = this, res = [];
      this._manager.forEach(function (o) {
        if(o != t && o._hierarchy(t)){
          res.push(o);
        }
      });
      return res;
    }
  }

})



/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
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

			if(this.number_doc)
				return (this._metadata.obj_presentation || this._metadata.synonym) + ' №' + this.number_doc + " от " + $p.moment(this.date).format($p.moment._masks.ldt);
			else
				return _presentation || "";

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		}
	});

	if(attr && typeof attr == "object"){
    this._data._silent = true;
    this._mixin(attr);
    this._data._silent = false;
  }

	if(!$p.utils.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);

	attr = null;
}
DocObj._extend(DataObj);

function doc_props_date_number(proto){
	proto.__define({

		/**
		 * Номер документа
		 * @property number_doc
		 * @type {String|Number}
		 */
		number_doc: {
			get : function(){ return this._obj.number_doc || ""},
			set : function(v){
				this.__notify('number_doc');
				this._obj.number_doc = v;
			},
			enumerable: true
		},

		/**
		 * Дата документа
		 * @property date
		 * @type {Date}
		 */
		date: {
			get : function(){ return this._obj.date || $p.utils.blank.date},
			set : function(v){
				this.__notify('date');
				this._obj.date = $p.utils.fix_date(v, true);
			},
			enumerable: true
		}
	});
}

DocObj.prototype.__define({

	/**
	 * Признак проведения
	 * @property posted
	 * @type {Boolean}
	 */
	posted: {
		get : function(){ return this._obj.posted || false},
		set : function(v){
			this.__notify('posted');
			this._obj.posted = $p.utils.fix_boolean(v);
		},
		enumerable: true
	}

});
doc_props_date_number(DocObj.prototype);


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
	for(f in cmd.fields){
	  if(!attr[f]){
      attr[f] = $p.utils.fetch_type("", cmd.fields[f].type);
    }
  }
	for(f in cmd["tabular_sections"]){
	  if(!attr[f]){
      attr[f] = [];
    }
  }

	this._mixin(attr);

}
DataProcessorObj._extend(DataObj);


/**
 * ### Абстрактный класс ЗадачаОбъект
 * @class TaskObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function TaskObj(attr, manager) {

	// выполняем конструктор родительского объекта
	TaskObj.superclass.constructor.call(this, attr, manager);


}
TaskObj._extend(CatObj);
doc_props_date_number(TaskObj.prototype);


/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function BusinessProcessObj(attr, manager) {

	// выполняем конструктор родительского объекта
	BusinessProcessObj.superclass.constructor.call(this, attr, manager);


}
BusinessProcessObj._extend(CatObj);
doc_props_date_number(BusinessProcessObj.prototype);


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

EnumObj.prototype.__define({

	/**
	 * Порядок элемента перечисления
	 * @property order
	 * @for EnumObj
	 * @type Number
	 */
	order: {
		get : function(){ return this._obj.sequence},
		set : function(v){ this._obj.sequence = parseInt(v)},
		enumerable: true
	},

	/**
	 * Наименование элемента перечисления
	 * @property name
	 * @for EnumObj
	 * @type String
	 */
	name: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = String(v)},
		enumerable: true
	},

	/**
	 * Синоним элемента перечисления
	 * @property synonym
	 * @for EnumObj
	 * @type String
	 */
	synonym: {
		get : function(){ return this._obj.synonym || ""},
		set : function(v){ this._obj.synonym = String(v)},
		enumerable: true
	},

	/**
	 * Представление объекта
	 * @property presentation
	 * @for EnumObj
	 * @type String
	 */
	presentation: {
		get : function(){
			return this.synonym || this.name;
		}
	},

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @for EnumObj
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return !this.ref || this.ref == "_";
		}
	}
});


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

	for(var check in manager.metadata().dimensions){
		if(!attr.hasOwnProperty(check) && attr.ref){
			var keys = attr.ref.split("¶");
			Object.keys(manager.metadata().dimensions).forEach(function (fld, ind) {
				this[fld] = keys[ind];
			}.bind(this));
			break;
		}
	}

}
RegisterRow._extend(DataObj);

RegisterRow.prototype.__define({

	/**
	 * Метаданные строки регистра
	 * @property _metadata
	 * @for RegisterRow
	 * @type Object
	 */
	_metadata: {
		get: function () {
			var _meta = this._manager.metadata();
			if (!_meta.fields)
				_meta.fields = ({})._mixin(_meta.dimensions)._mixin(_meta.resources)._mixin(_meta.attributes);
			return _meta;
		}
	},

	/**
	 * Ключ записи регистра
	 */
	ref: {
		get : function(){
			return this._manager.get_ref(this);
		},
		enumerable: true
	},

	presentation: {
		get: function () {
			return this._metadata.obj_presentation || this._metadata.synonym;
		}
	}
});


/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule rest
 * @requires common
 */

/**
 * ### Методы общего назначения для работы с rest
 * 
 * @class Rest
 * @static
 * @menuorder 35
 * @tooltip Работа с rest 1С
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
		var res = fld + " gt datetime'" + $p.moment(dfrom).format($p.moment._masks.iso) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.moment(dtill).format($p.moment._masks.iso) + "'";
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
			cm = mgr.metadata(),
			mf = cm.fields,
			mts = cm.tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			if(rdata.hasOwnProperty("DeletionMark"))
				o._deleted = rdata.DeletionMark;

			if(rdata.hasOwnProperty("DataVersion"))
				;
			if(rdata.hasOwnProperty("Ref_Key"))
				o.ref = rdata.Ref_Key;

		}else{
			mf = ({})._mixin(cm.dimensions)._mixin(cm.resources)._mixin(cm.attributes);
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
			if(cm.main_presentation_name){
				if(rdata.hasOwnProperty("Description"))
					o.name = rdata.Description;
				else if(rdata.hasOwnProperty("name"))
					o.name = rdata.name;
			}

			if(cm.code_length){
				if(rdata.hasOwnProperty("Code"))
					o.id = rdata.Code;
				else if(rdata.hasOwnProperty("id"))
					o.id = rdata.id;
			}
		}

		for(f in mf){
			if(rdata.hasOwnProperty(f)){
				o[f] = rdata[f];
			}else{
				syn = _md.syns_1с(f);
				if(syn.indexOf("_Key") == -1 && mf[f].type.is_ref && rdata[syn+"_Key"])
					syn+="_Key";
				if(!rdata.hasOwnProperty(syn))
					continue;
				o[f] = rdata[syn];
			}
		}

		for(ts in mts){
			synts = (ts == "extra_fields" || rdata.hasOwnProperty(ts)) ? ts : _md.syns_1с(ts);
			if(!rdata.hasOwnProperty(synts))
				continue;
			o[ts] = [];
			if(rdata[synts]){
				rdata[synts].sort(function (a, b) {
					return (a.LineNumber || a.row) > (b.LineNumber || b.row);
				});
				rdata[synts].forEach(function (r) {
					row = {};
					for(tf in mts[ts].fields){
						syn = (r.hasOwnProperty(tf) || (ts == "extra_fields" && (tf == "property" || tf == "value"))) ? tf : _md.syns_1с(tf);
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
	 * @return {Promise.<DataObj>} - промис с загруженным объектом
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
	get : function(){
		var fp = this.class_name.split("."),
			csyn = {
				cat: "Catalog",
				doc: "Document",
				ireg: "InformationRegister",
				areg: "AccumulationRegister",
				cch: "ChartOfCharacteristicTypes",
				cacc: "ChartOfAccounts",
				tsk: "Task",
				bp: "BusinessProcess"
			};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]);
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
					_deleted: ro["DeletionMark"],
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

		}else if(t instanceof TaskManager){
			flds.push("name as presentation");
			flds.push("date");
			flds.push("number_doc");
			flds.push("completed");

		}else if(t instanceof BusinessProcessManager){
			flds.push("date");
			flds.push("number_doc");
			flds.push("started");
			flds.push("finished");

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
		flds.push("_deleted");

		return s;

	})();


	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : this.rest_name) + "?allowedOnly=true&$format=json&$top=1000&" + select;

	if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){
		attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);
		filter_added = true;
	}

	if(cmd["hierarchical"] && attr.parent){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Parent_Key eq guid'" + attr.parent + "'";
		filter_added = true;
	}

	if(cmd["has_owners"] && attr.owner){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Owner_Key eq guid'" + attr.owner + "'";
		filter_added = true;
	}

	if(attr.filter){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "$filter eq '" + attr.filter + "'";
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
					if(mf){
						if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
							syn += "_Key";

						if(mf.type.date_part)
							o[fldsyn] = $p.moment(ro[syn]).format($p.moment._masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!ro[syn] || ro[syn] == $p.utils.blank.guid)
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
					}
				});
				ares.push(o);
			}
			return $p.iface.data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(selection){

	if(!selection.period)
		selection.period = $p.utils.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.moment(selection.period).format($p.moment._masks.iso) + "'",
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
				condition+= syn+" eq "+$p.utils.fix_number(selection[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+ $p.moment(selection[fld]).format($p.moment._masks.iso) +"'";

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
		.replace('%d', $p.moment().format($p.moment.defaultFormatUtc)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this._deleted + '</d:DeletionMark>',
			// '\n<d:DataVersion>' + this.data_version + '</d:DataVersion>',

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
					v = $p.moment(v).format($p.moment.defaultFormatUtc);

			}else if(v == undefined)
				continue;


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.moment(this.date).format($p.moment.defaultFormatUtc) + '</d:Date>';
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
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации с базами PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_pouchdb
 * @requires common
 */



DataManager.prototype.__define({

	/**
	 * Загружает объекты из PouchDB по массиву ссылок
	 */
	pouch_load_array: {
		value: function (refs, with_attachments) {

			var options = {
				limit : refs.length + 1,
				include_docs: true,
				keys: refs.map(function (v) {
					return this.class_name + "|" + v;
				}.bind(this))
			};
			if(with_attachments){
				options.attachments = true;
				options.binary = true;
			}

			return this.pouch_db.allDocs(options)
				.then(function (result) {
					return $p.wsql.pouch.load_changes(result, {});
				})
		}
	},

	/**
	 * Загружает объекты из PouchDB, обрезанные по view
	 */
	pouch_load_view: {
		value: function (_view) {

			var t = this, doc, res = [],
				options = {
					limit : 1000,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\ufff0'
				};

			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;
								key = doc._id.split("|");
								doc.ref = key[1];
								// наполняем
								res.push(doc);
							});

							t.load_array(res);
							res.length = 0;

							t.pouch_db.query(_view, options, process_docs);

						}else{
							resolve();
						}

					} else if(err){
						reject(err);
					}
				}

				t.pouch_db.query(_view, options, process_docs);

			});
		}
	},

	/**
	 * Возвращает базу PouchDB, связанную с объектами данного менеджера
	 * @property pouch_db
	 * @for DataManager
	 */
	pouch_db: {
		get: function () {
		  const cachable = this.cachable.replace("_ram", "");
			if(cachable.indexOf("remote") != -1)
				return $p.wsql.pouch.remote[cachable.replace("_remote", "")];
			else
				return $p.wsql.pouch.local[cachable] || $p.wsql.pouch.remote[cachable];
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки из PouchDB.
	 *
	 * @method pouch_find_rows
	 * @for DataManager
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param [selection._top] {Number}
	 * @param [selection._skip] {Number}
	 * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
	 * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
	 * @return {Promise.<Array>}
	 */
	pouch_find_rows: {
		value: function (selection) {

			var t = this, doc, res = [],
				_raw, _view, _total_count, top, calc_count,
				top_count = 0, skip = 0, skip_count = 0,
				options = {
					limit : 100,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\ufff0'
				};

			if(selection){

				if(selection._top){
					top = selection._top;
					delete selection._top;
				}else
					top = 300;

				if(selection._raw) {
					_raw = selection._raw;
					delete selection._raw;
				}

				if(selection._total_count) {
					_total_count = selection._total_count;
					delete selection._total_count;
				}

				if(selection._view) {
					_view = selection._view;
					delete selection._view;
				}

				if(selection._key) {

					if(selection._key._order_by == "des"){
						options.startkey = selection._key.endkey || selection._key + '\ufff0';
						options.endkey = selection._key.startkey || selection._key;
						options.descending = true;
					}else{
						options.startkey = selection._key.startkey || selection._key;
						options.endkey = selection._key.endkey || selection._key + '\ufff0';
					}
				}

				if(typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}

				if(selection._attachments) {
					options.attachments = true;
					options.binary = true;
					delete selection._attachments;
				}

			}

			// если сказано посчитать все строки...
			if(_total_count){

				calc_count = true;
				_total_count = 0;

				// если нет фильтра по строке или фильтр растворён в ключе
				if(Object.keys(selection).length <= 1){

					// если фильтр в ключе, получаем все строки без документов
					if(selection._key && selection._key.hasOwnProperty("_search")){
						options.include_docs = false;
						options.limit = 100000;

						return t.pouch_db.query(_view, options)
							.then(function (result) {

								result.rows.forEach(function (row) {

									// фильтруем
									if(!selection._key._search || row.key[row.key.length-1].toLowerCase().indexOf(selection._key._search) != -1){

										_total_count++;

										// пропукскаем лишние (skip) элементы
										if(skip) {
											skip_count++;
											if (skip_count < skip)
												return;
										}

										// ограничиваем кол-во возвращаемых элементов
										if(top) {
											top_count++;
											if (top_count > top)
												return;
										}

										res.push(row.id);
									}
								});

								delete options.startkey;
								delete options.endkey;
								if(options.descending)
									delete options.descending;
								options.keys = res;
								options.include_docs = true;

								return t.pouch_db.allDocs(options);

							})
							.then(function (result) {
								return {
									rows: result.rows.map(function (row) {

										var doc = row.doc;

										doc.ref = doc._id.split("|")[1];

										if(!_raw){
											delete doc._id;
											delete doc._rev;
										}

										return doc;
									}),
									_total_count: _total_count
								};
							})
					}

				}

			}

			// бежим по всем документам из ram
			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;

								key = doc._id.split("|");
								doc.ref = key[1];

								if(!_raw){
									delete doc._id;
									delete doc._rev;
								}

								// фильтруем
								if(!$p._selection.call(t, doc, selection))
									return;

								if(calc_count)
									_total_count++;

								// пропукскаем лишние (skip) элементы
								if(skip) {
									skip_count++;
									if (skip_count < skip)
										return;
								}

								// ограничиваем кол-во возвращаемых элементов
								if(top) {
									top_count++;
									if (top_count > top)
										return;
								}

								// наполняем
								res.push(doc);
							});

							if(top && top_count > top && !calc_count) {
								resolve(_raw ? res : t.load_array(res));

							}else
								fetch_next_page();

						}else{
							if(calc_count){
								resolve({
									rows: _raw ? res : t.load_array(res),
									_total_count: _total_count
								});
							}else
								resolve(_raw ? res : t.load_array(res));
						}

					} else if(err){
						reject(err);
					}
				}

				function fetch_next_page() {

					if(_view){
            t.pouch_db.query(_view, options, process_docs);
          }
					else{
            t.pouch_db.allDocs(options, process_docs);
          }
				}

				fetch_next_page();

			});

		}
	},

	/**
	 * ### Возвращает набор данных для динсписка
	 *
	 * @method pouch_selection
	 * @for DataManager
	 * @param attr
	 * @return {Promise.<Array>}
	 */
	pouch_selection: {
		value: function (attr) {

			var t = this,
				cmd = attr.metadata || t.metadata(),
				flds = ["ref", "_deleted"], // поля запроса
				selection = {
					_raw: true,
					_total_count: true,
					_top: attr.count || 30,
					_skip: attr.start || 0
				},   // условие см. find_rows()
				ares = [], o, mf, fldsyn;

			// набираем поля
			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else if(t instanceof TaskManager){
				flds.push("name as presentation");
				flds.push("date");
				flds.push("number_doc");
				flds.push("completed");

			}else if(t instanceof BusinessProcessManager){
				flds.push("date");
				flds.push("number_doc");
				flds.push("started");
				flds.push("finished");

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

			// набираем условие
			// фильтр по дате
			if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){

				if(!attr.date_from)
					attr.date_from = new Date("2015-01-01");
				if(!attr.date_till)
					attr.date_till = $p.utils.date_add_day(new Date(), 1);

				selection.date = {between: [attr.date_from, attr.date_till]};

			}

			// фильтр по родителю
			if(cmd["hierarchical"] && attr.parent)
				selection.parent = attr.parent;

			// добавляем условия из attr.selection
			if(attr.selection){
				if(Array.isArray(attr.selection)){
					attr.selection.forEach(function (asel) {
						for(fldsyn in asel)
							if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
								selection[fldsyn] = asel[fldsyn];
					});
				}else
					for(fldsyn in attr.selection)
						if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
							selection[fldsyn] = attr.selection[fldsyn];
			}

			// прибиваем фильтр по дате, если он встроен в ключ
			if(selection._key && selection._key._drop_date && selection.date) {
				delete selection.date;
			}

			// строковый фильтр по полям поиска, если он не описан в ключе
			if(attr.filter && (!selection._key || !selection._key._search)) {
				if(cmd.input_by_string.length == 1)
					selection[cmd.input_by_string] = {like: attr.filter};
				else{
					selection.or = [];
					cmd.input_by_string.forEach(function (ifld) {
						var flt = {};
						flt[ifld] = {like: attr.filter};
						selection.or.push(flt);
					});
				}
			}

			// обратная сортировка по ключу, если есть признак сортировки в ключе и 'des' в атрибутах
			if(selection._key && selection._key._order_by){
				selection._key._order_by = attr.direction;
			}

			// фильтр по владельцу
			//if(cmd["has_owners"] && attr.owner)
			//	selection.owner = attr.owner;

			return t.pouch_find_rows(selection)
				.then(function (rows) {

					if(rows.hasOwnProperty("_total_count") && rows.hasOwnProperty("rows")){
						attr._total_count = rows._total_count;
						rows = rows.rows
					}

					rows.forEach(function (doc) {

						// наполняем
						o = {};
						flds.forEach(function (fld) {

							if(fld == "ref") {
								o[fld] = doc[fld];
								return;
							}else if(fld.indexOf(" as ") != -1){
								fldsyn = fld.split(" as ")[1];
								fld = fld.split(" as ")[0].split(".");
								fld = fld[fld.length-1];
							}else
								fldsyn = fld;

							mf = _md.get(t.class_name, fld);
							if(mf){

								if(mf.type.date_part)
									o[fldsyn] = $p.moment(doc[fld]).format($p.moment._masks[mf.type.date_part]);

								else if(mf.type.is_ref){
									if(!doc[fld] || doc[fld] == $p.utils.blank.guid)
										o[fldsyn] = "";
									else{
										var mgr	= _md.value_mgr(o, fld, mf.type, false, doc[fld]);
										if(mgr)
											o[fldsyn] = mgr.get(doc[fld]).presentation;
										else
											o[fldsyn] = "";
									}
								}else if(typeof doc[fld] === "number" && mf.type.fraction_figits)
									o[fldsyn] = doc[fld].toFixed(mf.type.fraction_figits);

								else
									o[fldsyn] = doc[fld];
							}
						});
						ares.push(o);
					});

					return $p.iface.data_to_grid.call(t, ares, attr);
				})
				.catch($p.record_log);

		}
	},


	/**
	 * ### Возвращает набор данных для дерева динсписка
	 *
	 * @method pouch_tree
	 * @for DataManager
	 * @param attr
	 * @return {Promise.<Array>}
	 */
	pouch_tree: {
		value: function (attr) {

			return this.pouch_find_rows({
				is_folder: true,
				_raw: true,
				_top: attr.count || 300,
				_skip: attr.start || 0
			})
				.then(function (rows) {
					rows.sort(function (a, b) {
						if (a.parent == $p.utils.blank.guid && b.parent != $p.utils.blank.guid)
							return -1;
						if (b.parent == $p.utils.blank.guid && a.parent != $p.utils.blank.guid)
							return 1;
						if (a.name < b.name)
							return -1;
						if (a.name > b.name)
							return 1;
						return 0;
					});
					return rows.map(function (row) {
						return {
							ref: row.ref,
							parent: row.parent,
							presentation: row.name
						}
					});
				})
				.then($p.iface.data_to_tree);
		}
	},

	/**
	 * ### Сохраняет присоединенный файл
	 *
	 * @method save_attachment
	 * @for DataManager
	 * @param ref
	 * @param att_id
	 * @param attachment
	 * @param type
	 * @return {Promise}
	 * @async
	 */
	save_attachment: {
		value: function (ref, att_id, attachment, type) {

			if(!type)
				type = {type: "text/plain"};

			if(!(attachment instanceof Blob) && type.indexOf("text") == -1)
				attachment = new Blob([attachment], {type: type});

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.putAttachment(ref, att_id, _rev, attachment, type);
				});

		}
	},

	/**
	 * Получает присоединенный к объекту файл
	 * @param ref
	 * @param att_id
	 * @return {Promise}
	 */
	get_attachment: {
		value: function (ref, att_id) {

			return this.pouch_db.getAttachment(this.class_name + "|" + $p.utils.fix_guid(ref), att_id);

		}
	},

	/**
	 * Удаляет присоединенный к объекту файл
	 * @param ref
	 * @param att_id
	 * @return {Promise}
	 */
	delete_attachment: {
		value: function (ref, att_id) {

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.removeAttachment(ref, att_id, _rev);
				});
		}
	}

});

DataObj.prototype.__define({

	/**
	 * Устанавливает новый номер документа или код справочника
	 */
	new_number_doc: {

		value: function (prefix) {

			if(!this._metadata.code_length)
				return;

			// если не указан явно, рассчитываем префикс по умолчанию
			if(!prefix){
        prefix = (($p.current_user && $p.current_user.prefix) || "") + ((this.organization && this.organization.prefix) || "");
      }

			var obj = this,
				part = "",
				year = (this.date instanceof Date) ? this.date.getFullYear() : 0,
				code_length = this._metadata.code_length - prefix.length;

			// для кешируемых в озу, вычисляем без индекса
			if(this._manager.cachable == "ram")
				return Promise.resolve(this.new_cat_id(prefix));

			return obj._manager.pouch_db.query("doc/number_doc",
				{
					limit : 1,
					include_docs: false,
					startkey: [obj.class_name, year, prefix + '\ufff0'],
					endkey: [obj.class_name, year, prefix],
					descending: true
				})
				.then(function (res) {
					if(res.rows.length){
						var num0 = res.rows[0].key[2];
						for(var i = num0.length-1; i>0; i--){
							if(isNaN(parseInt(num0[i])))
								break;
							part = num0[i] + part;
						}
						part = (parseInt(part || 0) + 1).toFixed(0);
					}else{
						part = "1";
					}
					while (part.length < code_length)
						part = "0" + part;

					if(obj instanceof DocObj || obj instanceof TaskObj || obj instanceof BusinessProcessObj)
						obj.number_doc = prefix + part;
					else
						obj.id = prefix + part;

					return obj;

				});
		}
	},

	new_cat_id: {

		value: function (prefix) {

			if(!prefix)
				prefix = (($p.current_user && $p.current_user.prefix) || "") +
					(this.organization && this.organization.prefix ? this.organization.prefix : ($p.wsql.get_user_param("zone") + "-"));

			var code_length = this._metadata.code_length - prefix.length,
				field = (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) ? "number_doc" : "id",
				part = "",
				res = $p.wsql.alasql("select top 1 " + field + " as id from ? where " + field + " like '" + prefix + "%' order by " + field + " desc", [this._manager.alatable]);

			if(res.length){
				var num0 = res[0].id || "";
				for(var i = num0.length-1; i>0; i--){
					if(isNaN(parseInt(num0[i])))
						break;
					part = num0[i] + part;
				}
				part = (parseInt(part || 0) + 1).toFixed(0);
			}else{
				part = "1";
			}
			while (part.length < code_length)
				part = "0" + part;

			this[field] = prefix + part;

			return this;
		}
	}
});

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

	this.__define({

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
			value: typeof window != "undefined" ? this.parse_url() : {}
		}

	});

	// подмешиваем параметры, заданные в файле настроек сборки
	$p.eve.callEvent("settings", [this]);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

};

JobPrm.prototype.__define({

  base_url: {
    value: function (){
      return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
    }
  },

  /**
   * Осуществляет синтаксический разбор параметров url
   * @method parse_url
   * @return {Object}
   */
  parse_url_str: {
    value: function (prm_str) {
      var prm = {}, tmp = [], pairs;

      if (prm_str[0] === "#" || prm_str[0] === "?")
        prm_str = prm_str.substr(1);

      if (prm_str.length > 2) {

        pairs = decodeURI(prm_str).split('&');

        // берём параметры из url
        for (var i in pairs) {   //разбиваем пару на ключ и значение, добавляем в их объект
          tmp = pairs[i].split('=');
          if (tmp[0] == "m") {
            try {
              prm[tmp[0]] = JSON.parse(tmp[1]);
            } catch (e) {
              prm[tmp[0]] = {};
            }
          } else
            prm[tmp[0]] = tmp[1] || "";
        }
      }

      return prm;
    }
  },

  /**
   * Осуществляет синтаксический разбор параметров url
   * @method parse_url
   * @return {Object}
   */
  parse_url: {
    value: function () {
      return this.parse_url_str(location.search)._mixin(this.parse_url_str(location.hash));
    }
  },

  /**
   * Адрес стандартного интерфейса 1С OData
   * @method rest_url
   * @return {string}
   */
  rest_url: {
    value: function () {
      var url = this.base_url(),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  },

  /**
   * Адрес http интерфейса библиотеки интеграции
   * @method irest_url
   * @return {string}
   */
  irest_url: {
    value: function () {
      var url = this.base_url().replace("odata/standard.odata", "hs/rest"),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  }

});


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

};



/**
* AES implementation in JavaScript                                   (c) Chris Veness 2005-2016
*                                                                                   MIT Licence
* www.movable-type.co.uk/scripts/aes.html
*/



/**
 * AES (Rijndael cipher) encryption routines,
 *
 * Reference implementation of FIPS-197 http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf.
 *
 * @namespace
 */
function Aes(default_key) {

	'use strict';


	var Aes = this;


	/**
	 * AES Cipher function: encrypt 'input' state with Rijndael algorithm [§5.1];
	 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage.
	 *
	 * @param   {number[]}   input - 16-byte (128-bit) input state array.
	 * @param   {number[][]} w - Key schedule as 2D byte-array (Nr+1 x Nb bytes).
	 * @returns {number[]}   Encrypted output state array.
	 */
	Aes.cipher = function(input, w) {
		var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

		var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
		for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

		state = Aes.addRoundKey(state, w, 0, Nb);

		for (var round=1; round<Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}

		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);

		var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
		for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];

		return output;
	};


	/**
	 * Perform key expansion to generate a key schedule from a cipher key [§5.2].
	 *
	 * @param   {number[]}   key - Cipher key as 16/24/32-byte array.
	 * @returns {number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes).
	 */
	Aes.keyExpansion = function(key) {
		var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nk = key.length/4; // key length (in words): 4/6/8 for 128/192/256-bit keys
		var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

		var w = new Array(Nb*(Nr+1));
		var temp = new Array(4);

		// initialise first Nk words of expanded key with cipher key
		for (var i=0; i<Nk; i++) {
			var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
			w[i] = r;
		}

		// expand the key into the remainder of the schedule
		for (var i=Nk; i<(Nb*(Nr+1)); i++) {
			w[i] = new Array(4);
			for (var t=0; t<4; t++) temp[t] = w[i-1][t];
			// each Nk'th word has extra transformation
			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
			}
			// 256-bit key has subWord applied every 4th word
			else if (Nk > 6 && i%Nk == 4) {
				temp = Aes.subWord(temp);
			}
			// xor w[i] with w[i-1] and w[i-Nk]
			for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
		}

		return w;
	};


	/**
	 * Apply SBox to state S [§5.1.1]
	 * @private
	 */
	Aes.subBytes = function(s, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};


	/**
	 * Shift row r of state S left by r bytes [§5.1.2]
	 * @private
	 */
	Aes.shiftRows = function(s, Nb) {
		var t = new Array(4);
		for (var r=1; r<4; r++) {
			for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
			for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
		}          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
		return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
	};


	/**
	 * Combine bytes of each col of state S [§5.1.3]
	 * @private
	 */
	Aes.mixColumns = function(s, Nb) {
		for (var c=0; c<4; c++) {
			var a = new Array(4);  // 'a' is a copy of the current column from 's'
			var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
			for (var i=0; i<4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
			}
			// a[n] ^ b[n] is a•{03} in GF(2^8)
			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
		}
		return s;
	};


	/**
	 * Xor Round Key into state S [§5.1.4]
	 * @private
	 */
	Aes.addRoundKey = function(state, w, rnd, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
		}
		return state;
	};


	/**
	 * Apply SBox to 4-byte word w
	 * @private
	 */
	Aes.subWord = function(w) {
		for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};


	/**
	 * Rotate 4-byte word w left by one byte
	 * @private
	 */
	Aes.rotWord = function(w) {
		var tmp = w[0];
		for (var i=0; i<3; i++) w[i] = w[i+1];
		w[3] = tmp;
		return w;
	};


// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
	Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
		0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
		0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
		0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
		0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
		0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
		0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
		0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
		0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
		0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
		0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
		0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
		0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
		0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
		0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
		0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];


// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
	Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
		[0x01, 0x00, 0x00, 0x00],
		[0x02, 0x00, 0x00, 0x00],
		[0x04, 0x00, 0x00, 0x00],
		[0x08, 0x00, 0x00, 0x00],
		[0x10, 0x00, 0x00, 0x00],
		[0x20, 0x00, 0x00, 0x00],
		[0x40, 0x00, 0x00, 0x00],
		[0x80, 0x00, 0x00, 0x00],
		[0x1b, 0x00, 0x00, 0x00],
		[0x36, 0x00, 0x00, 0x00] ];


	/**
	 * Aes.Ctr: Counter-mode (CTR) wrapper for AES.
	 *
	 * This encrypts a Unicode string to produces a base64 ciphertext using 128/192/256-bit AES,
	 * and the converse to decrypt an encrypted ciphertext.
	 *
	 * See http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
	 *
	 * @augments Aes
	 */
	Aes.Ctr = {};


	/**
	 * Encrypt a text using AES encryption in Counter mode of operation.
	 *
	 * Unicode multi-byte character safe
	 *
	 * @param   {string} plaintext - Source text to be encrypted.
	 * @param   {string} password - The password to use to generate a key for encryption.
	 * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
	 * @returns {string} Encrypted text.
	 *
	 * @example
	 *   var encr = Aes.Ctr.encrypt('big secret', 'pāşšŵōřđ', 256); // 'lwGl66VVwVObKIr6of8HVqJr'
	 */
	Aes.Ctr.encrypt = function(plaintext, password, nBits) {
		var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);

		// use AES itself to encrypt password to get cipher key (using plain password as source for key
		// expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
		var nBytes = nBits/8;  // no bytes in key (16/24/32)
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes)); // gives us 16-byte key
		key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

		// initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
		// [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
		var counterBlock = new Array(blockSize);

		var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
		var nonceMs = nonce%1000;
		var nonceSec = Math.floor(nonce/1000);
		var nonceRnd = Math.floor(Math.random()*0xffff);
		// for debugging: nonce = nonceMs = nonceSec = nonceRnd = 0;

		for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
		for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
		for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;

		// and convert it to a string to go on the front of the ciphertext
		var ctrTxt = '';
		for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

		// generate key schedule - an expansion of the key into distinct Key Rounds for each round
		var keySchedule = Aes.keyExpansion(key);

		var blockCount = Math.ceil(plaintext.length/blockSize);
		var ciphertext = '';

		for (var b=0; b<blockCount; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			// done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
			for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8);

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --

			// block size is reduced on final block
			var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
			var cipherChar = new Array(blockLength);

			for (var i=0; i<blockLength; i++) {
				// -- xor plaintext with ciphered counter char-by-char --
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
			}
		}

		ciphertext =  base64Encode(ctrTxt+ciphertext);

		return ciphertext;
	};


	/**
	 * Decrypt a text encrypted by AES in counter mode of operation
	 *
	 * @param   {string} ciphertext - Cipher text to be decrypted.
	 * @param   {string} password - Password to use to generate a key for decryption.
	 * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
	 * @returns {string} Decrypted text
	 *
	 * @example
	 *   var decr = Aes.Ctr.decrypt('lwGl66VVwVObKIr6of8HVqJr', 'pāşšŵōřđ', 256); // 'big secret'
	 */
	Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
		var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);

		// use AES to encrypt password (mirroring encrypt routine)
		var nBytes = nBits/8;  // no bytes in key
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

		// recover nonce from 1st 8 bytes of ciphertext
		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

		// generate key schedule
		var keySchedule = Aes.keyExpansion(key);

		// separate ciphertext into blocks (skipping past initial 8 bytes)
		var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
		ciphertext = ct;  // ciphertext is now array of block-length strings

		// plaintext will get generated block-by-block into array of block-length strings
		var plaintext = '';

		for (var b=0; b<nBlocks; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i=0; i<ciphertext[b].length; i++) {
				// -- xor plaintext with ciphered counter byte-by-byte --
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/nBlocks });
			}
		}

		plaintext = utf8Decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

		return plaintext;
	};


	/* Extend String object with method to encode multi-byte string to utf8
	 * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
	 * - note utf8Encode is an identity function with 7-bit ascii strings, but not with 8-bit strings;
	 * - utf8Encode('x') = 'x', but utf8Encode('ça') = 'Ã§a', and utf8Encode('Ã§a') = 'ÃÂ§a'*/
	function utf8Encode(str) {
		//return unescape( encodeURIComponent( str ) );

		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}

	/* Extend String object with method to decode utf8 string to multi-byte */
	function utf8Decode(str) {
		try {
			return decodeURIComponent( escape( str ) );
		} catch (e) {
			return str; // invalid UTF-8? return as-is
		}
	}

	/* Extend String object with method to encode base64
	 * - developer.mozilla.org/en-US/docs/Web/API/window.btoa, nodejs.org/api/buffer.html
	 * - note: btoa & Buffer/binary work on single-byte Unicode (C0/C1), so ok for utf8 strings, not for general Unicode...
	 * - note: if btoa()/atob() are not available (eg IE9-), try github.com/davidchambers/Base64.js */
	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
		throw new Error('No Base64 Encode');
	}

	/* Extend String object with method to decode base64 */
	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary'); // Node.js
		throw new Error('No Base64 Decode');
	}

}

if (typeof module != 'undefined' && module.exports) module.exports = Aes;


return $p;
}));
