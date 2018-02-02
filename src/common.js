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
			value: "PACKAGE_VERSION",
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


