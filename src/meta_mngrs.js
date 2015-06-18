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
			after_save: []
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

	// справочники по умолчанию кешируем
	else if(class_name.indexOf("cat.") != -1)
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
		writable: false,
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
	 * @param obj {DataObj}
	 * @param name
	 */
	this.handle_event = function (obj, name) {
		var res;
		_events[name].forEach(function (method) {
			if(res !== false)
				res = method.call(obj);
		});
		return res;
	};


	//	Создаём функции конструкторов экземпляров объектов и строк табличных частей
	var _obj_сonstructor = this._obj_сonstructor || DataObj;		// ссылка на конструктор элементов

	if(!(this instanceof EnumManager)){

		// для всех типов, кроме перечислений
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
 * Регистрирует время изменения при заиси объекта для целей синхронизации
 */
DataManager.prototype.register_ex = function(){

};



/**
 * Cписок значений для поля выбора
 * @method get_option_list
 * @return {Array}
 */
DataManager.prototype.get_option_list = function(){};

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
				add_xml_row({param: $p.cat.properties.get("", false)}, "params");
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
		by_ref={},				// приватное хранилище объектов по guid
		sys_fields_names = function(){
			if(t instanceof EnumManager){
				return {presentation_name: "synonym", id_name: "name"};
			}else if(t instanceof CatManager){
				return {presentation_name: "presentation", id_name: "id"};
			}else if(t instanceof DocManager){
				return {presentation_name: "presentation", id_name: "number_doc"};
			}
		};

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
			if(i == $p.blank.guid)
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

		var o = by_ref[(ref = $p.fix_guid(ref))];

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
	 * Возвращает объект по коду (для справочников) или имени (для перечислений)
	 * @method by_id
	 * @param id {String|Object} - идентификатор
	 * @return {DataObj}
	 */
	t.by_id = function(id, empty_if_not_finded){
		var fnames = sys_fields_names();

		for(var i in by_ref)
			if(by_ref[i][fnames.id_name] == id)
				return by_ref[i];

		if(empty_if_not_finded)
			return t.get();
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

	/**
	 * Возвращает массив доступных значений для комбобокса
	 * @param val {DataObj|String}
	 * @param filter {Object}
	 * @return {Array}
	 */
	t.get_option_list = function(val, filter){
		var l = [];
		function check(v){
			if($p.is_equal(v.value, val))
				v.selected = true;
			return v;
		}
		t.find_rows(filter, function (v) {
			l.push(check({text: v.synonym || v.name || v.id, value: v.ref}));
		});
		return l;
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
			var flds = ["ref", "deleted"], s = "";

			if(t.class_name == "cat.contracts"){
				flds.push("is_folder");
				flds.push("id");
				flds.push("name as presentation");
				flds.push("contract_kind");
				flds.push("mutual_settlements");
				flds.push("organization");

			}else if(t.class_name.indexOf("cat.") != -1 ){

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

			}else if(t.class_name.indexOf("doc.") != -1){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");
			}

			flds.forEach(function(fld){
				if(!s)
					s = fld;
				else
					s += _md.sql_mask(fld);
			});
			return s;

		}

		function where_flds(){

			var s;

			if(cmd["hierarchical"]){
				if(cmd["has_owners"]){
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" +
						(owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				}else{
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);
				}
			}else{
				if(cmd["has_owners"]){
					s = " WHERE (" + (owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				}else{
					s = " WHERE (" + (filter ? 0 : 1);
				}
			}

			if(t.sql_selection_where_flds){
				s += t.sql_selection_where_flds(filter);

			}else if(t.class_name.indexOf("cat.") != -1){
				s += " OR _t_.name LIKE '" + filter + "'";
				if(cmd["code_length"])
					s += " OR _t_.id LIKE '" + filter + "'";

			}else if(t.class_name.indexOf("doc.") != -1){
				s += " OR _t_.number_doc LIKE '" + filter + "'";

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
			if(cmd["hierarchical"]){
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

		// ШапкаТаблицыПоИмениКласса
		function caption_flds(){

			var str_struct = function Col(id,width,type,align,sort,caption){
					this.id = id;
					this.width = width;
					this.type = type;
					this.align = align;
					this.sort = sort;
					this.caption = caption;
				},
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],
				s = "";

			if(t.sql_selection_caption_flds){
				t.sql_selection_caption_flds(attr, acols, str_struct);

			}else if(t.class_name.indexOf("cat.") != -1 ){

				acols.push(new str_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				//if(cmd["has_owners"]){
				//	var owner_caption = "Владелец";
				//	acols.push(new str_struct("owner", "200", "ro", "left", "server", owner_caption));
				//}

			}else if(t.class_name.indexOf("doc.") != -1 ){
				acols.push(new str_struct("date", "120", "ro", "left", "server", "Дата"));
				acols.push(new str_struct("number_doc", "120", "ro", "left", "server", "Номер"));

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

		selection_prms();

		var sql;
		if(t.sql_selection_list_flds)
			sql = t.sql_selection_list_flds(initial_value);
		else
			sql = ("SELECT %2, case when _t_.ref = '" + initial_value +
			"' then 0 else 1 end as is_initial_value FROM " + t.table_name + " AS _t_ %3 %4 LIMIT 300")
				.replace("%2", list_flds());

		return {
			sql: sql.replace("%3", where_flds()).replace("%4", order_flds()),
			struct: caption_flds()
		};

	}

	function sql_create(){
		var sql = "CREATE TABLE IF NOT EXISTS "+t.table_name+" (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT";

		if(t.class_name.substr(0, 3)=="cat")
			sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

		else if(t.class_name.substr(0, 3)=="doc")
			sql += ", posted BOOLEAN, date Date, number_doc CHAR";

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
		res = "SELECT ref, parent, name presentation FROM " + t.table_name + " WHERE is_folder order by parent, name";

	else if(action == "get_selection")
		res = sql_selection();

	return res;
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

	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);

EnumManager.prototype.toString = function(){return "Менеджер перечисления " + this.class_name; };

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
			" (ref CHAR PRIMARY KEY NOT NULL, sequence INT, name CHAR, synonym CHAR)";
	else if(["insert", "update", "replace"].indexOf(action) != -1){
		res = {};
		res[this.table_name] = {
			sql: "INSERT INTO "+this.table_name+" (ref, sequence, name, synonym) VALUES (?, ?, ?, ?)",
			fields: ["ref", "order", "name", "synonym"],
			values: "(?, ?, ?, ?)"
		};
	}else if(action == "delete")
		res = "DELETE FROM "+this.table_name+" WHERE ref = ?";

	return res;

};



/**
 * Абстрактный менеджер регистра сведений
 * @class InfoRegManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function InfoRegManager(class_name){

	var by_ref={};				// приватное хранилище объектов по ключу записи

	this._obj_сonstructor = InfoRegRow;

	InfoRegManager.superclass.constructor.call(this, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {InfoRegRow}
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

}
InfoRegManager._extend(DataManager);

/**
 * сохраняет массив объектов в менеджере
 * @method load_array
 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
 * @async
 */
InfoRegManager.prototype.load_array = function(aattr){

	var key, obj, dimensions;

	for(var i in aattr){
		key = {};
		dimensions = this.metadata().dimensions;
		for(var j in dimensions)
			key[j] = aattr[i][j];

		if(!(obj = this.get(key))){
			new this._obj_сonstructor(aattr[i], this);

		}else
			obj._mixin(aattr[i]);
	}

};

/**
 * Возаращает запросов для создания таблиц или извлечения данных
 * @method get_sql_struct
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
InfoRegManager.prototype.get_sql_struct = function(attr) {
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

InfoRegManager.prototype.toString = function(){
	return "Менеджер регистра сведений " + this.class_name;
};

InfoRegManager.prototype.get_first = function(attr){

};

InfoRegManager.prototype.get_last = function(attr){

};

InfoRegManager.prototype.get_ref = function(attr){
	var key = "", ref,
		dimensions = this.metadata().dimensions;
	if(attr instanceof InfoRegRow)
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
 * Абстрактный менеджер справочника
 * @class CatManager
 * @extends RefDataManager
 * @constructor
 * @param class_name {string}
 * @param [cachable=false] {boolean}
 */
function CatManager(class_name) {

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical){

		if(this.metadata().group_hierarchy){

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

}
CatManager._extend(RefDataManager);

CatManager.prototype.toString = function(){return "Менеджер справочника " + this.class_name; };


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

DocManager.prototype.toString = function(){return "Менеджер документа " + this.class_name; };



