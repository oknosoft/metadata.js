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

import {MetaEventEmitter} from 'metadata-abstract-adapter';

/**
 * Описание структуры колонки формы списка
 * @class Col_struct
 * @param id
 * @param width
 * @param type
 * @param align
 * @param sort
 * @param caption
 * @constructor
 */
function Col_struct(id,width,type,align,sort,caption){
	this.id = id;
	this.width = width;
	this.type = type;
	this.align = align;
	this.sort = sort;
	this.caption = caption;
}

// isNode
// if(typeof process !== 'undefined' && process.versions && process.versions.node){
// 	MetaEventEmitter = require('metadata-abstract-adapter/index.js').MetaEventEmitter;
// }else{
// 	MetaEventEmitter = require('metadata-abstract-adapter').MetaEventEmitter;
// }

function mngrs($p) {

	const {wsql, md} = $p;

	class DataManager extends MetaEventEmitter{

		constructor(class_name) {

			super()

			const _meta = md.get(class_name);

			Object.defineProperties(this, {

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
					get: () => {

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
					get: () => class_name
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
					get: () => wsql.aladb.tables[this.table_name] ? wsql.aladb.tables[this.table_name].data : []
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
					value: field_name => {

						if(field_name)
							return _meta.fields[field_name] || md.get(class_name, field_name) || _meta.tabular_sections[field_name];
						else
							return _meta;
					}
				},

				constructor_names: {
					value: {}
				},

				/**
				 * ### Хранилище объектов данного менеджера
				 */
				by_ref: {
					value: {}
				}
			});

		}

		/**
		 * ### Имя семейства объектов данного менеджера
		 * Примеры: "справочников", "документов", "регистров сведений"
		 * @property family_name
		 * @for DataManager
		 * @type String
		 * @final
		 */
		get family_name(){
			return msg.meta_mgrs[this.class_name.split(".")[0]].replace(msg.meta_mgrs.mgr+" ", "");
		}

		/**
		 * ### Имя таблицы объектов этого менеджера в базе alasql
		 * @property table_name
		 * @type String
		 * @final
		 */
		get table_name(){
			return this.class_name.replace(".", "_");
		}

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
		find_rows(selection, callback){
			return utils._find_rows.call(this, this.by_ref, selection, callback);
		}

		/**
		 * ### Найти строки на сервере
		 * @param selection
		 * @async
		 */
		find_rows_remote(selection) {
			return this.adapter.find_rows(this, selection);
		}

		/**
		 * ### Дополнительные реквизиты
		 * Массив дополнителных реквизитов (аналог подсистемы `Свойства` БСП) вычисляется через
		 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
		 *
		 * @property extra_fields
		 * @type Array
		 */
		extra_fields(obj){
			// ищем предопределенный элемент, сответствующий классу данных
			var destinations = $p.cat.destinations || $p.cch.destinations,
				pn = md.class_name_to_1c(this.class_name).replace(".", "_"),
				res = [];

			if(destinations){
				destinations.find_rows({predefined_name: pn}, destination => {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if(ts){
						ts.each(row => {
							if(!row._deleted && !row.ПометкаУдаления)
								res.push(row.property || row.Свойство);
						});
					}
					return false;
				})

			}

			return res;
		}

		/**
		 * ### Дополнительные свойства
		 * Массив дополнителных свойств (аналог подсистемы `Свойства` БСП) вычисляется через
		 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
		 *
		 * @property extra_properties
		 * @type Array
		 */
		extra_properties(obj){
			return [];
		}

		/**
		 * ### Имя функции - конструктора объектов или строк табличных частей
		 *
		 * @method obj_constructor
		 * @param [ts_name] {String}
		 * @return {Function}
		 */
		obj_constructor(ts_name = "") {

			if(!this.constructor_names[ts_name]){
				var parts = this.class_name.split("."),
					fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);
				this.constructor_names[ts_name] = ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;
			}

			return this.constructor_names[ts_name];

		}

		/**
		 * ### Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
		 *
		 * @method sync_grid
		 * @for DataManager
		 * @param grid {dhtmlXGridObject}
		 * @param attr {Object}
		 */
		sync_grid(attr, grid){

			var mgr = this;

			function request(){

				if(typeof attr.custom_selection == "function"){
					return attr.custom_selection(attr);

				}else if(mgr.cachable == "ram"){

					// запрос к alasql
					if(attr.action == "get_tree")
						return wsql.promise(mgr.get_sql_struct(attr), [])
							.then($p.iface.data_to_tree);

					else if(attr.action == "get_selection")
						return wsql.promise(mgr.get_sql_struct(attr), [])
							.then(data => $p.iface.data_to_grid.call(mgr, data, attr));

				}else if(mgr.cachable.indexOf("doc") == 0){

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

		/**
		 * ### Возвращает массив доступных значений для комбобокса
		 * @method get_option_list
		 * @for DataManager
		 * @param [selection] {Object} - отбор, который будет наложен на список
		 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
		 * @return {Promise.<Array>}
		 */
		get_option_list(selection){

			var t = this, l = [], input_by_string, text, sel;

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

			if(t.cachable == "ram" || (selection && selection._local)) {
				t.find_rows(selection, function (v) {
					l.push(v);
				});
				return Promise.resolve(l);

			}else if(t.cachable != "e1cib"){
				return t.adapter.find_rows(t, selection)
					.then(function (data) {
						data.forEach(function (v) {
							l.push(v);
						});
						return l;
					});

			}else{
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
								text: is_doc ? (v.number_doc + " от " + moment(v.date).format(moment._masks.ldt)) : (v.name || v.id),
								value: v.ref}));
						});
						return l;
					});
			}
		}

		/**
		 * Заполняет свойства в объекте source в соответствии с реквизитами табчасти
		 * @param tabular {String} - имя табчасти
		 * @param source {Object}
		 */
		tabular_captions(tabular, source) {

		}

		/**
		 * Печатает объект
		 * @method print
		 * @param ref {DataObj|String} - guid ссылки на объект
		 * @param model {String|DataObj.cat.formulas} - идентификатор команды печати
		 * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
		 */
		print(ref, model, wnd){

			function tune_wnd_print(wnd_print){
				if(wnd && wnd.progressOff)
					wnd.progressOff();
				if(wnd_print)
					wnd_print.focus();
			}

			if(wnd && wnd.progressOn)
				wnd.progressOn();

			setTimeout(tune_wnd_print, 3000);

			// если _printing_plates содержит ссылку на обрабочтик печати, используем его
			if(this._printing_plates[model] instanceof DataObj)
				model = this._printing_plates[model];

			// если существует локальный обработчик, используем его
			if(model instanceof DataObj && model.execute){

				if(ref instanceof DataObj)
					return model.execute(ref)
						.then(tune_wnd_print);
				else
					return this.get(ref, true)
						.then(model.execute.bind(model))
						.then(tune_wnd_print);

			}else{

				// иначе - печатаем средствами 1С или иного сервера
				var rattr = {};
				$p.ajax.default_attr(rattr, job_prm.irest_url());
				rattr.url += this.rest_name + "(guid'" + utils.fix_guid(ref) + "')" +
					"/Print(model=" + model + ", browser_uid=" + wsql.get_user_param("browser_uid") +")";

				return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
					.then(tune_wnd_print);
			}

		}

		/**
		 * Возвращает промис со структурой печатных форм объекта
		 * @return {Promise.<Object>}
		 */
		printing_plates(){
			var rattr = {}, t = this;

			if(!t._printing_plates){
				if(t.metadata().printing_plates)
					t._printing_plates = t.metadata().printing_plates;

				else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
					t._printing_plates = {};
				}
			}

			if(!t._printing_plates && $p.ajax.authorized){
				$p.ajax.default_attr(rattr, job_prm.irest_url());
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

		/**
		 * Широковещательное событие на объекте `md`
		 * @param name
		 * @param attr
		 */
		brodcast_event(name, attr){md.emit(name, attr)}

		/**
		 * Указатель на адаптер данных этого менеджера
		 */
		get adapter(){
			switch (this.cachable){
				case undefined:
				case "ram":
				case "doc":
				case "doc_remote":
				case "remote":
				case "user":
				case "meta":
					return $p.adapters.pouch;
			}
			return $p.adapters[this.cachable];
		}

		static get EVENTS(){
			return {

				/**
				 * ### После создания
				 * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
				 * или заполнить объект на основании данных связанного объекта
				 *
				 * @event AFTER_CREATE
				 * @for DataManager
				 */
				AFTER_CREATE: "AFTER_CREATE",

				/**
				 * ### После чтения объекта с сервера
				 * Имеет смысл для объектов с типом кеширования ("doc", "doc_remote", "meta", "e1cib").
				 * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
				 *
				 * @event AFTER_LOAD
				 * @for DataManager
				 */
				AFTER_LOAD: "AFTER_LOAD",

				/**
				 * ### Перед записью
				 * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
				 * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
				 *
				 * @event BEFORE_SAVE
				 * @for DataManager
				 */
				BEFORE_SAVE: "BEFORE_SAVE",

				/**
				 * ### После записи
				 *
				 * @event AFTER_SAVE
				 * @for DataManager
				 */
				BEFORE_SAVE: "BEFORE_SAVE",

				/**
				 * ### При изменении реквизита шапки или табличной части
				 *
				 * @event VALUE_CHANGE
				 * @for DataManager
				 */
				VALUE_CHANGE: "VALUE_CHANGE",

				/**
				 * ### При добавлении строки табличной части
				 *
				 * @event ADD_ROW
				 * @for DataManager
				 */
				ADD_ROW: "ADD_ROW",

				/**
				 * ### При удалении строки табличной части
				 *
				 * @event DEL_ROW
				 * @for DataManager
				 */
				DEL_ROW: "DEL_ROW"
			}
		}

	}

	/**
	 * ### Aбстрактный менеджер ссылочных данных
	 * От него унаследованы менеджеры документов, справочников, планов видов характеристик и планов счетов
	 *
	 * @class RefDataManager
	 * @extends DataManager
	 * @constructor
	 * @param class_name {string} - имя типа менеджера объекта
	 */
	class RefDataManager extends DataManager{

		/**
		 * Помещает элемент ссылочных данных в локальную коллекцию
		 * @method push
		 * @param o {DataObj}
		 * @param [new_ref] {String} - новое значение ссылки объекта
		 */
		push(o, new_ref){
			if(new_ref && (new_ref != o.ref)){
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			}else
				this.by_ref[o.ref] = o;
		}

		/**
		 * Выполняет перебор элементов локальной коллекции
		 * @method each
		 * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
		 */
		each(fn){
			for(var i in this.by_ref){
				if(!i || i == utils.blank.guid)
					continue;
				if(fn.call(this, this.by_ref[i]) == true)
					break;
			}
		}

		/**
		 * Синоним для each()
		 */
		forEach(fn) {
			return this.each.call(this, fn);
		}

		/**
		 * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
		 * @method get
		 * @param [ref] {String|Object} - ссылочный идентификатор
		 * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
		 * @return {DataObj|undefined}
		 */
		get(ref, do_not_create){

			var o = this.by_ref[ref] || this.by_ref[(ref = utils.fix_guid(ref))];

			if(!o){
				if(do_not_create)
					return;
				else
					o = new $p[this.obj_constructor()](ref, this, true);
			}

			if(ref === utils.blank.guid)
				return o;

			if(o.is_new()){
				return o.load();	// читаем из 1С или иного сервера

			}else
				return o;
		}

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
		create(attr, fill_default){

			if(!attr || typeof attr != "object")
				attr = {};
			if(!attr.ref || !utils.is_guid(attr.ref) || utils.is_empty_guid(attr.ref))
				attr.ref = utils.generate_guid();

			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
					// заглушка ссылки объекта

				}else{

					if(o instanceof DocObj && o.date == utils.blank.date)
						o.date = new Date();

					// Триггер после создания
					let after_create_res = {};
					this.emit("after_create", o, after_create_res);

					// Если новый код или номер не были назначены в триггере - устанавливаем стандартное значение
					if((this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager)){
						if(!o.number_doc)
							o.new_number_doc();
					}else{
						if(!o.id)
							o.new_number_doc();
					}

					if(after_create_res === false)
						return Promise.resolve(o);

					else if(typeof after_create_res === "object" && after_create_res.then)
						return after_create_res;

					// выполняем обработчик после создания объекта и стандартные действия, если их не запретил обработчик
					if(this.cachable == "e1cib" && fill_default){
						var rattr = {};
						$p.ajax.default_attr(rattr, job_prm.irest_url());
						rattr.url += this.rest_name + "/Create()";
						return $p.ajax.get_ex(rattr.url, rattr)
							.then(function (req) {
								return utils._mixin(o, JSON.parse(req.response), undefined, ["ref"]);
							});
					}

				}
			}

			return Promise.resolve(o);
		}

		/**
		 * Удаляет объект из alasql и локального кеша
		 * @method unload_obj
		 * @param ref
		 */
		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if(o.ref == ref){
					a.splice(i, 1);
					return true;
				}
			});
		}

		/**
		 * Находит первый элемент, в любом поле которого есть искомое значение
		 * @method find
		 * @param val {*} - значение для поиска
		 * @param columns {String|Array} - колонки, в которых искать
		 * @return {DataObj}
		 */
		find(val, columns){
			return utils._find(this.by_ref, val, columns);
		}

		/**
		 * ### Сохраняет массив объектов в менеджере
		 *
		 * @method load_array
		 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
		 * @param [forse] {Boolean|String} - перезаполнять объект
		 */
		load_array(aattr, forse){

			var ref, obj, res = [];

			for(var i=0; i<aattr.length; i++){

				ref = utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if(!obj){

					if(forse == "update_only"){
						continue;
					}

					obj = new $p[this.obj_constructor()](aattr[i], this);
					if(forse)
						obj._set_loaded();

				}else if(obj.is_new() || forse){
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}

		/**
		 * Находит перую папку в пределах подчинения владельцу
		 * @method first_folder
		 * @param owner {DataObj|String}
		 * @return {DataObj} - ссылка найденной папки или пустая ссылка
		 */
		first_folder(owner){
			for(var i in this.by_ref){
				var o = this.by_ref[i];
				if(o.is_folder && (!owner || utils.is_equal(owner, o.owner)))
					return o;
			}
			return this.get();
		}

		/**
		 * Возаращает массив запросов для создания таблиц объекта и его табличных частей
		 * @method get_sql_struct
		 * @param attr {Object}
		 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
		 * @return {Object|String}
		 */
		get_sql_struct(attr){
			var t = this,
				cmd = t.metadata(),
				res = {}, f, f0, trunc_index = 0,
				action = attr && attr.action ? attr.action : "create_table";


			function sql_selection(){

				var ignore_parent = !attr.parent,
					parent = attr.parent || utils.blank.guid,
					owner,
					initial_value = attr.initial_value || utils.blank.guid,
					filter = attr.filter || "",
					set_parent = utils.blank.guid;

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

					flds.forEach(fld => {
						if(fld.indexOf(" as ") != -1)
							s += ", " + fld;
						else
							s += md.sql_mask(fld, true);
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
								(owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
						else
							s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

					}else{
						if(cmd["has_owners"])
							s = " WHERE (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
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

					s += ") AND (_t_.ref != '" + utils.blank.guid + "')";


					// допфильтры форм и связей параметров выбора
					if(attr.selection){
						if(typeof attr.selection == "function"){

						}else
							attr.selection.forEach(sel => {
								for(var key in sel){

									if(typeof sel[key] == "function"){
										s += "\n AND " + sel[key](t, key) + " ";

									}else if(cmd.fields.hasOwnProperty(key) || key === "ref"){
										if(sel[key] === true)
											s += "\n AND _t_." + key + " ";

										else if(sel[key] === false)
											s += "\n AND (not _t_." + key + ") ";

										else if(typeof sel[key] == "object"){

											if(utils.is_data_obj(sel[key]) || utils.is_guid(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = utils.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else if(keys[0] == "in")
													s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce((sum, val) => {
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

						}

						// строка фильтра
						if(filter && filter.indexOf("%") == -1)
							filter = "%" + filter + "%";

					}

					// установим владельца
					if(cmd["has_owners"]){
						owner = attr.owner;
						if(attr.selection && typeof attr.selection != "function"){
							attr.selection.forEach(sel => {
								if(sel.owner){
									owner = typeof sel.owner == "object" ?  sel.owner.valueOf() : sel.owner;
									delete sel.owner;
								}
							});
						}
						if(!owner)
							owner = utils.blank.guid;
					}

					// ссылка родителя во взаимосвязи с начальным значением выбора
					if(initial_value !=  utils.blank.guid && ignore_parent){
						if(cmd["hierarchical"]){
							on_parent(t.get(initial_value))
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
						sql += ", " + f0 + md.sql_type(t, f, cmd.fields[f].type, true);
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
						sql += md.sql_mask(f) + md.sql_type(t, f, cmd.fields[f].type);

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
					sql += md.sql_mask(f);
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

		/**
		 * ШапкаТаблицыПоИмениКласса
		 */
		caption_flds(attr){

			var _meta = (attr && attr.metadata) || this.metadata(),
				acols = [];

			if(_meta.form && _meta.form[attr.form || 'selection']){
				acols = _meta.form[attr.form || 'selection'].cols;

			}else if(this instanceof DocManager){
				acols.push(new Col_struct("date", "160", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("number_doc", "140", "ro", "left", "server", "Номер"));

				if(_meta.fields.note)
					acols.push(new Col_struct("note", "*", "ro", "left", "server", _meta.fields.note.synonym));

				if(_meta.fields.responsible)
					acols.push(new Col_struct("responsible", "*", "ro", "left", "server", _meta.fields.responsible.synonym));


			}else if(this instanceof CatManager){

				if(_meta.code_length)
					acols.push(new Col_struct("id", "140", "ro", "left", "server", "Код"));

				if(_meta.main_presentation_name)
					acols.push(new Col_struct("name", "*", "ro", "left", "server", "Наименование"));

			}else{

				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				//if(_meta.has_owners){
				//	acols.push(new Col_struct("owner", "*", "ro", "left", "server", _meta.fields.owner.synonym));
				//}

			}

			return acols;
		}

		/**
		 * Догружает с сервера объекты, которых нет в локальном кеше
		 * @method load_cached_server_array
		 * @param list {Array} - массив строк ссылок или объектов со свойством ref
		 * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
		 * @return {Promise}
		 */
		load_cached_server_array(list, alt_rest_name) {

			var query = [], obj,
				t = this,
				mgr = alt_rest_name ? {class_name: t.class_name, rest_name: alt_rest_name} : t,
				check_loaded = !alt_rest_name;

			list.forEach(o => {
				obj = t.get(o.ref || o, true);
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

		/**
		 * Возаращает предопределенный элемент по имени предопределенных данных
		 * @method predefined
		 * @param name {String} - имя предопределенного
		 * @return {DataObj}
		 */
		predefined(name){

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
	class DataProcessorsManager extends DataManager{

		/**
		 * Создаёт экземпляр объекта обработки
		 * @method
		 * @return {DataProcessorObj}
		 */
		create(){
			return new $p[this.obj_constructor()]({}, this);
		}

		/**
		 * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql. Добавлен, чтобы не ругалась форма обхекта при закрытии
		 * @method unload_obj
		 * @param [ref]
		 */
		unload_obj(ref) {	}
	}

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
	class EnumManager extends RefDataManager{

		constructor(class_name) {
			super(class_name);

			for(var v of md.get(class_name))
				new EnumObj(v, this);

		}

		get(ref, do_not_create){

			if(ref instanceof EnumObj)
				return ref;

			else if(!ref || ref == utils.blank.guid)
				ref = "_";

			var o = this[ref];
			if(!o)
				o = new EnumObj({name: ref}, this);

			return o;
		}

		push(o, new_ref){
			Object.defineProperty(this, new_ref, {
				value : o
			});
		}

		each(fn) {
			this.alatable.forEach(v => {
				if(v.ref && v.ref != "_" && v.ref != utils.blank.guid)
					fn.call(this[v.ref]);
			});
		}

		/**
		 * Bозаращает массив запросов для создания таблиц объекта и его табличных частей
		 * @param attr {Object}
		 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
		 * @return {Object|String}
		 */
		get_sql_struct(attr){

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

		/**
		 * Возвращает массив доступных значений для комбобокса
		 * @method get_option_list
		 * @param [selection] {Object}
		 * @param [selection._top] {Number}
		 * @return {Promise.<Array>}
		 */
		get_option_list(selection){
			var l = [], synonym = "", sref;

			if(selection){
				for(var i in selection){
					if(i.substr(0,1)!="_"){
						if(i == "ref"){
							sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
						}
						else
							synonym = selection[i];
					}
				}
			}

			if(typeof synonym == "object"){
				if(synonym.like)
					synonym = synonym.like;
				else
					synonym = "";
			}
			synonym = synonym.toLowerCase();

			this.alatable.forEach(v => {
				if(synonym){
					if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1)
						return;
				}
				if(sref){
					if(Array.isArray(sref)){
						if(!sref.some(sv => sv.name == v.ref || sv.ref == v.ref || sv == v.ref))
							return;
					}else{
						if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
							return;
					}
				}
				l.push(this[v.ref]);
			});

			return Promise.resolve(l);
		}

	}

	/**
	 * ### Абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
	 *
	 * @class RegisterManager
	 * @extends DataManager
	 * @constructor
	 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
	 */
	class RegisterManager extends DataManager{

		/**
		 * Помещает элемент ссылочных данных в локальную коллекцию
		 * @method push
		 * @param o {RegisterRow}
		 * @param [new_ref] {String} - новое значение ссылки объекта
		 */
		push(o, new_ref) {
			if (new_ref && (new_ref != o.ref)) {
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			} else
				this.by_ref[o.ref] = o;
		};

		/**
		 * Возвращает массив записей c заданным отбором либо запись по ключу
		 * @method get
		 * @for InfoRegManager
		 * @param attr {Object} - объект {key:value...}
		 * @param force_promise {Boolean} - возаращять промис, а не массив
		 * @param return_row {Boolean} - возвращать запись, а не массив
		 * @return {*}
		 */
		get(attr, force_promise, return_row) {

			if (!attr)
				attr = {};
			else if (typeof attr == "string")
				attr = {ref: attr};

			if (attr.ref && return_row)
				return force_promise ? Promise.resolve(this.by_ref[attr.ref]) : this.by_ref[attr.ref];

			attr.action = "select";

			var arr = wsql.alasql(this.get_sql_struct(attr), attr._values),
				res;

			delete attr.action;
			delete attr._values;

			if (arr.length) {
				if (return_row)
					res = this.by_ref[this.get_ref(arr[0])];
				else {
					res = [];
					for (var i in arr)
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
		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some((o, i, a) => {
				if (o.ref == ref) {
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
		load_array(aattr, forse) {

			var ref, obj, res = [];

			for (var i = 0; i < aattr.length; i++) {

				ref = this.get_ref(aattr[i]);
				obj = this.by_ref[ref];

				if (!obj && !aattr[i]._deleted) {
					obj = new $p[this.obj_constructor()](aattr[i], this);
					if (forse)
						obj._set_loaded();

				} else if (obj && aattr[i]._deleted) {
					obj.unload();
					continue;

				} else if (obj.is_new() || forse) {
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		};

		/**
		 * Возаращает запросов для создания таблиц или извлечения данных
		 * @method get_sql_struct
		 * @for RegisterManager
		 * @param attr {Object}
		 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
		 * @return {Object|String}
		 */
		get_sql_struct(attr) {
			var t = this,
				cmd = t.metadata(),
				res = {}, f,
				action = attr && attr.action ? attr.action : "create_table";

			function sql_selection(){

				var filter = attr.filter || "";

				function list_flds(){
					var flds = [], s = "_t_.ref";

					if(cmd.form && cmd.form.selection){
						cmd.form.selection.fields.forEach(fld => flds.push(fld));

					}else{

						for(var f in cmd["dimensions"]){
							flds.push(f);
						}
					}

					flds.forEach(fld => {
						if(fld.indexOf(" as ") != -1)
							s += ", " + fld;
						else
							s += md.sql_mask(fld, true);
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
							attr.selection.forEach(sel => {
								for(var key in sel){

									if(typeof sel[key] == "function"){
										s += "\n AND " + sel[key](t, key) + " ";

									}else if(cmd.fields.hasOwnProperty(key)){
										if(sel[key] === true)
											s += "\n AND _t_." + key + " ";

										else if(sel[key] === false)
											s += "\n AND (not _t_." + key + ") ";

										else if(typeof sel[key] == "object"){

											if(utils.is_data_obj(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = utils.value_mgr({}, key, mf.type, true, val);
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
						sql += md.sql_type(t, f, cmd.dimensions[f].type, true);
					}

					for(f in cmd.resources)
						sql += ", " + f + md.sql_type(t, f, cmd.resources[f].type, true);

					for(f in cmd.attributes)
						sql += ", " + f + md.sql_type(t, f, cmd.attributes[f].type, true);

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

					//sql += md.sql_mask(f) + md.sql_type(t, f, cmd.dimensions[f].type);

					for(f in cmd.dimensions)
						sql += md.sql_mask(f) + md.sql_type(t, f, cmd.dimensions[f].type);

					for(f in cmd.resources)
						sql += md.sql_mask(f) + md.sql_type(t, f, cmd.resources[f].type);

					for(f in cmd.attributes)
						sql += md.sql_mask(f) + md.sql_type(t, f, cmd.attributes[f].type);

					// sql += ", PRIMARY KEY (";
					// first_field = true;
					// for(f in cmd["dimensions"]){
					// 	if(first_field){
					// 		sql += "`" + f + "`";
					// 		first_field = false;
					// 	}else
					// 		sql += md.sql_mask(f);
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

		get_ref(attr){

			if(attr instanceof RegisterRow)
				attr = attr._obj;

			if(attr.ref)
				return attr.ref;

			var key = "",
				dimensions = this.metadata().dimensions;

			for(var j in dimensions){
				key += (key ? "¶" : "");
				if(dimensions[j].type.is_ref)
					key += utils.fix_guid(attr[j]);

				else if(!attr[j] && dimensions[j].type.digits)
					key += "0";

				else if(dimensions[j].date_part)
					key += moment(attr[j] || utils.blank.date).format(moment.defaultFormatUtc);

				else if(attr[j]!=undefined)
					key += String(attr[j]);

				else
					key += "$";
			}
			return key;
		}

		caption_flds(attr){

			var _meta = (attr && attr.metadata) || this.metadata(),
				acols = [];

			if(_meta.form && _meta.form[attr.form || 'selection']){
				acols = _meta.form[attr.form || 'selection'].cols;

			}else{

				for(var f in _meta["dimensions"]){
					acols.push(new Col_struct(f, "*", "ro", "left", "server", _meta["dimensions"][f].synonym));
				}
			}

			return acols;
		}

		create(attr){

			if(!attr || typeof attr != "object")
				attr = {};


			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				// Триггер после создания
				let after_create_res = {};
				this.emit("after_create", o, after_create_res);

				if(after_create_res === false)
					return Promise.resolve(o);

				else if(typeof after_create_res === "object" && after_create_res.then)
					return after_create_res;
			}

			return Promise.resolve(o);
		}

	}

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
	class InfoRegManager extends RegisterManager{

		/**
		 * Возаращает массив записей - срез первых значений по ключам отбора
		 * @method slice_first
		 * @for InfoRegManager
		 * @param filter {Object} - отбор + период
		 */
		slice_first(filter){

		}

		/**
		 * Возаращает массив записей - срез последних значений по ключам отбора
		 * @method slice_last
		 * @for InfoRegManager
		 * @param filter {Object} - отбор + период
		 */
		slice_last(filter){

		}
	}

	/**
	 * ### Журнал событий
	 * Хранит и накапливает события сеанса<br />
	 * Является наследником регистра сведений
	 * @extends InfoRegManager
	 * @class LogManager
	 * @static
	 */
	class LogManager extends InfoRegManager{

		constructor() {
			super("ireg.$log");
		}

		/**
		 * Добавляет запись в журнал
		 * @param msg {String|Object|Error} - текст + класс события
		 * @param [msg.obj] {Object} - дополнительный json объект
		 */
		record(msg){

			if(msg instanceof Error){
				if(console)
					console.log(msg);
				msg = {
					class: "error",
					note: msg.toString()
				}
			}else if(typeof msg == "object" && !msg.class && !msg.obj){
				msg = {
					class: "obj",
					obj: msg,
					note: msg.note
				};
			}else if(typeof msg != "object")
				msg = {note: msg};

			msg.date = Date.now() + wsql.time_diff;

			// уникальность ключа
			if(!this.smax)
				this.smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_$log` where `date` = ?");
			var res = this.smax([msg.date]);
			if(!res.length || res[0].sequence === undefined)
				msg.sequence = 0;
			else
				msg.sequence = parseInt(res[0].sequence) + 1;

			// класс сообщения
			if(!msg.class)
				msg.class = "note";

			wsql.alasql("insert into `ireg_$log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)",
				[msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

		}

		/**
		 * Сбрасывает события на сервер
		 * @method backup
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		backup(dfrom, dtill){

		}

		/**
		 * Восстанавливает события из архива на сервере
		 * @method restore
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		restore(dfrom, dtill){

		}

		/**
		 * Стирает события в указанном диапазоне дат
		 * @method clear
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		clear(dfrom, dtill){

		}

		show(pwnd) {

		}

		get(ref, force_promise, do_not_create) {

			if(typeof ref == "object")
				ref = ref.ref || "";

			if(!this.by_ref[ref]){

				if(force_promise === false)
					return undefined;

				var parts = ref.split("¶");
				wsql.alasql("select * from `ireg_$log` where date=" + parts[0] + " and sequence=" + parts[1])
					.forEach(row => new RegisterRow(row, this));
			}

			return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
		}

		get_sql_struct(attr){

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
				return InfoRegManager.prototype.get_sql_struct.call(this, attr);
		}

		caption_flds(attr) {

			var _meta = (attr && attr.metadata) || this.metadata(),
				acols = [];

			if(_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;

			}else{
				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
				acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));
			}

			return acols;
		}

		data_to_grid(data, attr) {
			var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
					.replace("%1", data.length).replace("%2", attr.start)
					.replace("%3", attr.set_parent || "" ),
				caption = this.caption_flds(attr);

			// при первом обращении к методу добавляем описание колонок
			xml += caption.head;

			data.forEach(row => {
				xml += "<row id=\"" + row.ref + "\"><cell>" +
					moment(row.date - wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + row.sequence + "</cell>" +
					"<cell>" + (row.class || "") + "</cell><cell>" + (row.note || "") + "</cell></row>";
			});

			return xml + "</rows>";
		}

	}

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
	class AccumRegManager extends RegisterManager{

	}

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
	class CatManager extends RefDataManager{

		constructor(class_name) {
			super(class_name);

			// реквизиты по метаданным
			if (this.metadata().hierarchical && this.metadata().group_hierarchy) {

				/**
				 * ### Признак "это группа"
				 * @property is_folder
				 * @for CatObj
				 * @type {Boolean}
				 */
				Object.defineProperty($p[this.obj_constructor()].prototype, 'is_folder', {
					get : function(){ return this._obj.is_folder || false},
					set : function(v){ this._obj.is_folder = $p.utils.fix_boolean(v)},
					enumerable: true,
					configurable: true
				})
			}
		}

		/**
		 * Возвращает объект по наименованию
		 * @method by_name
		 * @param name {String|Object} - искомое наименование
		 * @return {DataObj}
		 */
		by_name(name) {

			var o;

			this.find_rows({name: name}, obj => {
				o = obj;
				return false;
			});

			if (!o)
				o = this.get();

			return o;
		}

		/**
		 * Возвращает объект по коду
		 * @method by_id
		 * @param id {String|Object} - искомый код
		 * @return {DataObj}
		 */
		by_id(id) {

			var o;

			this.find_rows({id: id}, obj => {
				o = obj;
				return false;
			});

			if (!o)
				o = this.get();

			return o;
		};

		/**
		 * Для иерархических справочников возвращает путь элемента
		 * @param ref {String|CatObj} - ссылка или объект данных
		 * @return {string} - строка пути элемента
		 */
		path(ref) {
			var res = [], tobj;

			if (ref instanceof DataObj)
				tobj = ref;
			else
				tobj = this.get(ref, true);

			if (tobj)
				res.push({ref: tobj.ref, presentation: tobj.presentation});

			if (tobj && this.metadata().hierarchical) {
				while (true) {
					tobj = tobj.parent;
					if (tobj.empty())
						break;
					res.push({ref: tobj.ref, presentation: tobj.presentation});
				}
			}

			return res;
		};

	}

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
	class ChartOfCharacteristicManager extends CatManager{
		toString(){return msg.meta_mgrs.cch}
	}

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
	class ChartOfAccountManager extends CatManager{
		toString(){return msg.meta_mgrs.cacc}
	}

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
	class DocManager extends RefDataManager{
		toString(){return msg.meta_mgrs.doc}
	}

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
	class TaskManager extends CatManager{
		toString(){return msg.meta_mgrs.tsk}
	}

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
	class BusinessProcessManager extends CatManager{
		toString(){return msg.meta_mgrs.bp}
	}

	/**
	 * ### Коллекция менеджеров перечислений
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
	 *
	 * @class Enumerations
	 * @static
	 */
	class Enumerations{
		toString(){return msg.meta_classes.enm}
	}

	/**
	 * ### Коллекция менеджеров справочников
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
	 *
	 * @class Catalogs
	 * @static
	 */
	class Catalogs{
		toString(){return msg.meta_classes.cat}
	}

	/**
	 * ### Коллекция менеджеров документов
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
	 *
	 * @class Documents
	 * @static
	 */
	class Documents{
		toString(){return msg.meta_classes.doc}
	}

	/**
	 * ### Коллекция менеджеров регистров сведений
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
	 *
	 * @class InfoRegs
	 * @static
	 */
	class InfoRegs{
		toString(){return msg.meta_classes.ireg}
	}

	/**
	 * ### Коллекция менеджеров регистров накопления
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
	 *
	 * @class AccumRegs
	 * @static
	 */
	class AccumRegs{
		toString(){return msg.meta_classes.areg}
	}

	/**
	 * ### Коллекция менеджеров регистров бухгалтерии
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
	 *
	 * @class AccountsRegs
	 * @static
	 */
	class AccountsRegs{
		toString(){return msg.meta_classes.accreg}
	}

	/**
	 * ### Коллекция менеджеров обработок
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
	 *
	 * @class DataProcessors
	 * @static
	 */
	class DataProcessors{
		toString(){return msg.meta_classes.dp}
	}

	/**
	 * ### Коллекция менеджеров отчетов
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
	 *
	 * @class Reports
	 * @static
	 */
	class Reports{
		toString(){return msg.meta_classes.rep}
	}

	/**
	 * ### Коллекция менеджеров планов счетов
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
	 *
	 * @class ChartsOfAccounts
	 * @static
	 */
	class ChartsOfAccounts{
		toString(){return msg.meta_classes.cacc}
	}

	/**
	 * ### Коллекция менеджеров планов видов характеристик
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
	 *
	 * @class ChartsOfCharacteristics
	 * @static
	 */
	class ChartsOfCharacteristics{
		toString(){return msg.meta_classes.cch}
	}

	/**
	 * ### Коллекция менеджеров задач
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "TaskManager"}}{{/crossLink}}
	 *
	 * @class Tasks
	 * @static
	 */
	class Tasks{
		toString(){return msg.meta_classes.tsk}
	}

	/**
	 * ### Коллекция бизнес-процессов
	 * - Состав коллекции определяется метаданными используемой конфигурации
	 * - Тип элементов коллекции: {{#crossLink "BusinessProcessManager"}}{{/crossLink}}
	 *
	 * @class BusinessProcesses
	 * @static
	 */
	class BusinessProcesses{
		toString(){return msg.meta_classes.bp}
	}

	Object.defineProperties($p, {

		/**
		 * Коллекция менеджеров перечислений
		 * @property enm
		 * @type Enumerations
		 * @static
		 */
		enm: { value: new Enumerations() },

		/**
		 * Коллекция менеджеров справочников
		 * @property cat
		 * @type Catalogs
		 * @static
		 */
		cat: { value: new Catalogs() },

		/**
		 * Коллекция менеджеров документов
		 * @property doc
		 * @type Documents
		 * @static
		 */
		doc: { value: new Documents() },

		/**
		 * Коллекция менеджеров регистров сведений
		 * @property ireg
		 * @type InfoRegs
		 * @static
		 */
		ireg: { value: new InfoRegs() },

		/**
		 * Коллекция менеджеров регистров накопления
		 * @property areg
		 * @type AccumRegs
		 * @static
		 */
		areg: { value: new AccumRegs() },

		/**
		 * Коллекция менеджеров регистров бухгалтерии
		 * @property accreg
		 * @type AccountsRegs
		 * @static
		 */
		accreg: { value: new AccountsRegs() },

		/**
		 * Коллекция менеджеров обработок
		 * @property dp
		 * @type DataProcessors
		 * @static
		 */
		dp: { value: new DataProcessors() },

		/**
		 * Коллекция менеджеров отчетов
		 * @property rep
		 * @type Reports
		 * @static
		 */
		rep: { value: new Reports() },

		/**
		 * Коллекция менеджеров планов счетов
		 * @property cacc
		 * @type ChartsOfAccounts
		 * @static
		 */
		cacc: { value: new ChartsOfAccounts() },

		/**
		 * Коллекция менеджеров планов видов характеристик
		 * @property cch
		 * @type ChartsOfCharacteristics
		 * @static
		 */
		cch: { value: new ChartsOfCharacteristics() },

		/**
		 * Коллекция менеджеров задач
		 * @property tsk
		 * @type Tasks
		 * @static
		 */
		tsk: { value: new Tasks() },

		/**
		 * Коллекция менеджеров бизнес-процессов
		 * @property bp
		 * @type Tasks
		 * @static
		 */
		bp: { value: new BusinessProcesses() }


	});

	if(!classes.DataManager){
		Object.defineProperties(classes, {

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

			RegisterRow: { value: RegisterRow }

		})
	}

	if(!utils.value_mgr){
		/**
		 * ### Возвращает менеджер значения по свойству строки
		 * @method value_mgr
		 * @param row {Object|TabularSectionRow} - строка табчасти или объект
		 * @param f {String} - имя поля
		 * @param mf {Object} - описание типа поля mf.type
		 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
		 * @param v {*} - устанавливаемое значение
		 * @return {DataManager|Array|undefined}
		 */
		Object.defineProperty(utils, 'value_mgr', {

			value: function(row, f, mf, array_enabled, v) {
				var property, oproperty, tnames, rt, mgr;
				if (mf._mgr)
					return mf._mgr;

				function mf_mgr(mgr) {
					if (mgr && mf.types.length == 1)
						mf._mgr = mgr;
					return mgr;
				}

				if (mf.types.length == 1) {
					tnames = mf.types[0].split(".");
					if (tnames.length > 1 && $p[tnames[0]])
						return mf_mgr($p[tnames[0]][tnames[1]]);

				} else if (v && v.type) {
					tnames = v.type.split(".");
					if (tnames.length > 1 && $p[tnames[0]])
						return mf_mgr($p[tnames[0]][tnames[1]]);
				}

				property = row.property || row.param;
				if (f != "value" || !property) {

					rt = [];
					mf.types.forEach(function (v) {
						tnames = v.split(".");
						if (tnames.length > 1 && $p[tnames[0]][tnames[1]])
							rt.push($p[tnames[0]][tnames[1]]);
					});
					if (rt.length == 1 || row[f] == utils.blank.guid)
						return mf_mgr(rt[0]);

					else if (array_enabled)
						return rt;

					else if ((property = row[f]) instanceof DataObj)
						return property._manager;

					else if (utils.is_guid(property) && property != utils.blank.guid) {
						for (var i in rt) {
							mgr = rt[i];
							if (mgr.get(property, true))
								return mgr;
						}
					}
				} else {

					// Получаем объект свойства
					if (utils.is_data_obj(property))
						oproperty = property;
					else if (utils.is_guid(property))
						oproperty = $p.cch.properties.get(property);
					else
						return;

					if (utils.is_data_obj(oproperty)) {

						if (oproperty.is_new())
							return $p.cat.property_values;

						// и через его тип выходми на мнеджера значения
						for (rt in oproperty.type.types)
							if (oproperty.type.types[rt].indexOf(".") > -1) {
								tnames = oproperty.type.types[rt].split(".");
								break;
							}
						if (tnames && tnames.length > 1 && $p[tnames[0]])
							return mf_mgr($p[tnames[0]][tnames[1]]);
						else
							return oproperty.type;
					}
				}
			}
		})
	}

}

