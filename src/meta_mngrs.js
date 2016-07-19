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
 * Описание структуры колонки формы списка
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
$p.iface.Col_struct = Col_struct;


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
		 * @param name {String} - имя события [after_create, after_load, before_save, after_save, value_change, add_row, del_row]
		 * @param method {Function} - добавляемый метод
		 * @param [first] {Boolean} - добавлять метод в начало, а не в конец коллекции
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
			value: function (name, method, first) {
				if(first)
					_events[name].push(method);
				else
					_events[name].push(method);
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
				if(res.length){
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

	//	Создаём функции конструкторов экземпляров объектов и строк табличных частей
	var _obj_constructor = this._obj_constructor || DataObj;		// ссылка на конструктор элементов

	// Для всех типов, кроме перечислений, создаём через (new Function) конструктор объекта
	if(!(this instanceof EnumManager)){

		var obj_constructor_name = class_name.split(".")[1];
		this._obj_constructor = eval("(function " + obj_constructor_name.charAt(0).toUpperCase() + obj_constructor_name.substr(1) +
			"(attr, manager){manager._obj_constructor.superclass.constructor.call(this, attr, manager)})");
		this._obj_constructor._extend(_obj_constructor);

		if(this instanceof InfoRegManager){

			// реквизиты по метаданным
			for(var f in this.metadata().dimensions){
				this._obj_constructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable: true,
					configurable: true
				});
			}
			for(var f in this.metadata().resources){
				this._obj_constructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable: true,
					configurable: true
				});
			}
			for(var f in this.metadata().attributes){
				this._obj_constructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable: true,
					configurable: true
				});
			}

		}else{

			this._ts_сonstructors = {};             // ссылки на конструкторы строк табчастей

			// реквизиты по метаданным
			for(var f in this.metadata().fields){
				this._obj_constructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable: true,
					configurable: true
				});
			}

			// табличные части по метаданным
			for(var f in this.metadata().tabular_sections){

				// создаём конструктор строки табчасти
				var row_constructor_name = obj_constructor_name.charAt(0).toUpperCase() + obj_constructor_name.substr(1) + f.charAt(0).toUpperCase() + f.substr(1) + "Row";

				this._ts_сonstructors[f] = eval("(function " + row_constructor_name + "(owner) \
			{owner._owner._manager._ts_сonstructors[owner._name].superclass.constructor.call(this, owner)})");
				this._ts_сonstructors[f]._extend(TabularSectionRow);

				// в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
				for(var rf in this.metadata().tabular_sections[f].fields){
					this._ts_сonstructors[f].prototype.__define(rf, {
						get : new Function("return this._getter('"+rf+"')"),
						set : new Function("v", "this._setter('"+rf+"',v)"),
						enumerable: true,
						configurable: true
					});
				}

				// устанавливаем геттер и сеттер для табличной части
				this._obj_constructor.prototype.__define(f, {
					get : new Function("return this._getter_ts('"+f+"')"),
					set : new Function("v", "this._setter_ts('"+f+"',v)"),
					enumerable: true,
					configurable: true
				});
			}

		}
	}

	_obj_constructor = null;

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

	extra_fields: {
		value : function(obj){

			// ищем предопределенный элемент, сответствующий классу данных
			var destinations = $p.cat.destinations || $p.cat.НаборыДополнительныхРеквизитовИСведений,
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

	extra_properties: {
		value : function(obj){
			return [];
		}
	}
});



/**
 * ### Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
 *
 * @method sync_grid
 * @for DataManager
 * @param grid {dhtmlXGridObject}
 * @param attr {Object}
 */
DataManager.prototype.sync_grid = function(attr, grid){

	var mgr = this;

	function request(){

		if(attr.custom_selection){
			return attr.custom_selection(attr);
			
		}else if(mgr.cachable == "ram"){

			// запрос к alasql
			if(attr.action == "get_tree")
				return $p.wsql.promise(mgr.get_sql_struct(attr), [])
					.then($p.iface.data_to_tree);

			else if(attr.action == "get_selection")
				return $p.wsql.promise(mgr.get_sql_struct(attr), [])
					.then(function(data){
						return $p.iface.data_to_grid.call(mgr, data, attr);
					});

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
				grid.xmlFileUrl = "exec";
				grid.parse(res, function(){
					resolve(res);
				}, "xml");

			}else
				resolve(res);

		});

	}
	
	// TODO: переделать обработку catch()
	return request()
		.then(to_grid)
		.catch($p.record_log);

};

/**
 * ### Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @for DataManager
 * @param val {DataObj|String} - текущее значение
 * @param [selection] {Object} - отбор, который будет наложен на список
 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
 * @return {Promise.<Array>}
 */
DataManager.prototype.get_option_list = function(val, selection){

	var t = this, l = [], input_by_string, text, sel;

	function check(v){
		if($p.is_equal(v.value, val))
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

	if(t.cachable == "ram" || (selection && selection._local)) {
		t.find_rows(selection, function (v) {
			l.push(check({text: v.presentation, value: v.ref}));
		});
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
						text: is_doc ? (v.number_doc + " от " + $p.dateFormat(v.date, $p.dateFormat.masks.ru)) : (v.name || v.id),
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
						if(i != "predefined_name" && !mf.fields[i].hide)
							oxml[" "].push(i);
				}

				if(mf.tabular_sections && mf.tabular_sections.extra_fields)
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

			}else if(typeof f === "object"){
				row_id = f.id;
				mf = extra_fields && extra_fields.metadata && extra_fields.metadata[row_id];
				if(!mf)
					mf = {synonym: f.synonym};
				else if(f.synonym)
					mf.synonym = f.synonym;

				ft = f.type;
				txt = "";
				if(f.hasOwnProperty("txt"))
					txt = f.txt;
				else if((v = o[row_id]) !== undefined)
					txt_by_type(v, mf.type ? mf : _md.get(t.class_name, row_id));

			}else if(extra_fields && extra_fields.metadata && ((mf = extra_fields.metadata[f]) !== undefined)){
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
			//	add_xml_row({param: _cch.properties.get("", false)}, "params"); // fake-строка, если в табчасти нет допреквизитов

		}

		if(i!=" ") gd += '</row>';                          // если блок был открыт - закрываем
	}
	gd += '</rows>';
	return gd;
};



/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String|DataObj.cst.formulas} - идентификатор команды печати
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
			return this.get(ref, true, true)
				.then(model.execute.bind(model))
				.then(tune_wnd_print);

	}else{
		
		// иначе - печатаем средствами 1С или иного сервера
		var rattr = {};
		$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
		rattr.url += this.rest_name + "(guid'" + $p.fix_guid(ref) + "')" +
			"/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

		return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
			.then(tune_wnd_print);
	}

};

/**
 * Возвращает промис со структурой печатных форм объекта
 * @return {Promise.<Object>}
 */
DataManager.prototype.printing_plates = function(){
	var rattr = {}, t = this;

	if(!t._printing_plates){
		if(t.metadata().printing_plates)
			t._printing_plates = t.metadata().printing_plates;

		else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
			t._printing_plates = {};
		}
	}

	if(t._printing_plates)
		return Promise.resolve(t._printing_plates);

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
				if(!i || i == $p.blank.guid)
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

			var o = this.by_ref[ref] || this.by_ref[(ref = $p.fix_guid(ref))];

			if(!o){
				if(do_not_create && !force_promise)
					return;
				else
					o = new this._obj_constructor(ref, this, true);
			}

			if(force_promise === false)
				return o;

			else if(force_promise === undefined && ref === $p.blank.guid)
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
		value: function(attr, fill_default){

			if(!attr || typeof attr != "object")
				attr = {};
			if(!attr.ref || !$p.is_guid(attr.ref) || $p.is_empty_guid(attr.ref))
				attr.ref = $p.generate_guid();

			var o = this.by_ref[attr.ref];
			if(!o){

				o = new this._obj_constructor(attr, this);

				if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
					// заглушка ссылки объекта

				}else{

					if(o instanceof DocObj && o.date == $p.blank.date)
						o.date = new Date();

					// Триггер после создания
					var after_create_res = this.handle_event(o, "after_create");

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

			return Promise.resolve(o);
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
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	load_array: {
		value: function(aattr, forse){

			var ref, obj, res = [];

			for(var i=0; i<aattr.length; i++){

				ref = $p.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if(!obj){
					obj = new this._obj_constructor(aattr[i], this);
					if(forse)
						obj._set_loaded();

				}else if(obj.is_new() || forse){
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
				if(o.is_folder && (!owner || $p.is_equal(owner, o.owner)))
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
					parent = attr.parent || $p.blank.guid,
					owner,
					initial_value = attr.initial_value || $p.blank.guid,
					filter = attr.filter || "",
					set_parent = $p.blank.guid;

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

										else if(typeof sel[key] == "object"){

											if($p.is_data_obj(sel[key]))
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
	},

	obj_constructor_text: {
		value: function () {

			var parts = this.class_name.split("."),
				fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1),
				text = "function " + fn_name + "(attr, manager){manager._obj_constructor.superclass.constructor.call(this, attr, manager)}'\n";

			text += fn_name + "._extend(" + parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + "Obj);\n";

			// реквизиты по метаданным
			for(var f in this.metadata().fields){
				text += fn_name + ".prototype.__define('"+f+"', {get: function(){return this._getter('"+f+"')}, " +
					"set: function(v){this._setter('"+f+"',v)}, enumerable: true, configurable: true});\n";
			}


			// табличные части по метаданным
			for(var f in this.metadata().tabular_sections){

				// создаём конструктор строки табчасти
				var row_fn_name = fn_name + f.charAt(0).toUpperCase() + f.substr(1) + "Row";

				text += "function " + row_fn_name + "(owner)" +
					"{owner._owner._manager._ts_сonstructors[owner._name].superclass.constructor.call(this, owner)});\n";

				text += row_fn_name + "._extend(TabularSectionRow);\n";

				// в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
				for(var rf in this.metadata().tabular_sections[f].fields){
					text += row_fn_name + ".prototype.__define('"+rf+"', {get: function(){return this._getter('"+rf+"')}, " +
						"set: function(v){this._setter('"+rf+"',v)}, enumerable: true, configurable: true});\n";
				}

				// устанавливаем геттер и сеттер для табличной части
				text += fn_name + ".prototype.__define('"+f+"', {get: function(){return this._getter_ts('"+f+"')}, " +
					"set: function(v){this._setter_ts('"+f+"',v)}, enumerable: true, configurable: true});\n";

			}

			return text;

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
		value: function(){
			return new this._obj_constructor({}, this);
		}
	},

	/**
	 * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql. Добавлен, чтобы не ругалась форма обхекта при закрытии
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
 * @param a {array} - массив значений
 * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
function EnumManager(a, class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	this._obj_constructor = EnumObj;

	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);

EnumManager.prototype.__define({

	get: {
		value: function(ref){

			if(ref instanceof EnumObj)
				return ref;

			else if(!ref || ref == $p.blank.guid)
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
				if(v.ref && v.ref != "_" && v.ref != $p.blank.guid)
					fn.call(this[v.ref]);
			}.bind(this));
		}
	}
});

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
	var l = [], synonym = "", sref;

	function check(v){
		if($p.is_equal(v.value, val))
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

	this._obj_constructor = RegisterRow;

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
				obj = new this._obj_constructor(aattr[i], this);
				if(forse)
					obj._set_loaded();

			}else if(obj && aattr[i]._deleted){
				obj.unload();
				continue;

			}else if(obj.is_new() || forse){
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

											if($p.is_data_obj(sel[key]))
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

				o = new this._obj_constructor(attr, this);

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
			msg = {
				class: "error",
				note: msg.toString()
			}
		}

		if(typeof msg != "object")
			msg = {note: msg};
		msg.date = Date.now() + $p.eve.time_diff();

		// уникальность ключа
		if(!smax)
			smax = alasql.compile("select MAX(`ref`) as `ref` from `ireg_$log` where `date` = ?");
		var res = smax([msg.date]);
		if(!res.length || res[0].ref === undefined)
			msg.sequence = 0;
		else
			msg.sequence = parseInt(res[0].ref.split(".")[1]) + 1;

		// класс сообщения
		if(!msg.class)
			msg.class = "note";

		$p.wsql.alasql("insert into `ireg_$log` (`ref`, `date`, `class`, `note`, `obj`) values (?, ?, ?, ?, ?)",
			[msg.date + "."+msg.sequence, msg.date, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

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

	this._obj_constructor = CatObj;		// ссылка на конструктор элементов

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		/**
		 * признак "это группа"
		 * @property is_folder
		 * @for CatObj
		 * @type {Boolean}
		 */
		this._obj_constructor.prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.fix_boolean(v)},
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

	this._obj_constructor = CatObj;		// ссылка на конструктор элементов

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

	this._obj_constructor = CatObj;		// ссылка на конструктор элементов

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

	this._obj_constructor = DocObj;		// ссылка на конструктор элементов

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

	this._obj_constructor = TaskObj;		// ссылка на конструктор элементов

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

	this._obj_constructor = BusinessProcessObj;		// ссылка на конструктор элементов

	BusinessProcessManager.superclass.constructor.call(this, class_name);

}
BusinessProcessManager._extend(CatManager);

