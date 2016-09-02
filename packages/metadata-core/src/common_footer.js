
	this.__define({

		version: {
			value: "PACKAGE_VERSION",
			writable: false
		},

		toString: { value: () => "Oknosoft data engine. v:" + this.version },

		/**
		 * ### Коллекция вспомогательных методов
		 *
		 * @property utils
		 * @type Utils
		 * @final
		 */
		utils: { value: new Utils() },

		/**
		 * ### Буфер для строковых и двоичных данных, внедряемых в скрипт
		 * В этой структуре живут, например, sql текст инициализации таблиц, xml-строки форм и менюшек и т.д.
		 *
		 * @property injected_data
		 * @type Object
		 * @final
		 */
		injected_data: { value: {} },

		/**
		 * Наша promise-реализация ajax
		 *
		 * @property ajax
		 * @type Ajax
		 * @final
		 */
		ajax: { value: new Ajax() },

		/**
		 * Сообщения пользователю и строки нитернационализации
		 * @property msg
		 * @type Messages
		 * @final
		 */
		msg: { value: new Messages() },

		/**
		 * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
		 * @property wsql
		 * @type WSQL
		 * @final
		 */
		wsql: { value: new WSQL() },

		/**
		 * Обработчики событий приложения
		 * Подробнее см. модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events.ui"}}{{/crossLinkModule}}
		 * @property eve
		 * @type AppEvents
		 * @final
		 */
		eve: { value: new AppEvents() },

		/**
		 * Aes для шифрования - дешифрования данных
		 *
		 * @property aes
		 * @type Aes
		 * @final
		 */
		aes: { value: new Aes("metadata.js") },

		/**
		 * ### Moment для операций с интервалами и датами
		 *
		 * @property moment
		 * @type Function
		 * @final
		 */
		moment: { get: () => this.utils.moment },

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
							is_obj = typeof(sel) === "object";

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
										return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
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
						top = 300;
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
				if(typeof id == "function" && id._evnts){
					id._evnts.forEach(function (id) {
						$p.eve.detachEvent(id);
					});
				}else if(!id)
					$p.eve.detachAllEvents();
				else
					$p.eve.detachEvent(id);
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
				if($p.ireg && $p.ireg.$log)
					$p.ireg.$log.record(err);
				console.log(err);
			}
		},

		/**
		 * ### Mетаданные конфигурации
		 * @property md
		 * @type Meta
		 * @static
		 */
		md: { value: new Meta() },

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
		 * @property aссreg
		 * @type AccountsRegs
		 * @static
		 */
		aссreg: {
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
					this.toString = function(){return $p.msg.meta_charts_of_accounts_mgr};
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
					this.toString = function(){return $p.msg.meta_charts_of_characteristic_mgr};
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

		DataManager: { value: DataManager },

		RefDataManager: { value: RefDataManager },

		DataProcessorsManager: { value: DataProcessorsManager },

		EnumManager: { value: EnumManager },

		RegisterManager: { value: RegisterManager },

		InfoRegManager: { value: InfoRegManager },

		LogManager: { value: LogManager },

		AccumRegManager: { value: AccumRegManager },

		CatManager: { value: CatManager },

		ChartOfCharacteristicManager: { value: ChartOfCharacteristicManager },

		ChartOfAccountManager: { value: ChartOfAccountManager },

		DocManager: { value: DocManager },

		TaskManager: { value: TaskManager },

		BusinessProcessManager: { value: BusinessProcessManager },

		DataObj: { value: DataObj },

		CatObj: { value: CatObj },

		DocObj: { value: DocObj },

		DataProcessorObj: { value: DataProcessorObj },

		TaskObj: { value: TaskObj },

		BusinessProcessObj: { value: BusinessProcessObj },

		EnumObj: { value: EnumObj },

		RegisterRow: { value: RegisterRow },

		TabularSection: { value: TabularSection },

		TabularSectionRow: { value: TabularSectionRow }

	});
}}



