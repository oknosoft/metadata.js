/**
 * Конструкторы менеджеров данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
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
	if(!$p.job_prm.offline && _metadata.hasOwnProperty("cachable"))
		_cachable = _metadata.cachable;

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

			if(mf.form && mf.form.obj){
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
		.catch(function (err) {
			console.log(err);
		});
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
				new t._obj_сonstructor(aattr[i], t);

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
		res = {}, f,
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
		var sql = "CREATE TABLE IF NOT EXISTS `"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT";

		if(t instanceof DocManager)
			sql += ", posted BOOLEAN, date Date, number_doc CHAR";
		else
			sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

		for(f in cmd.fields)
			sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.fields[f].type);


		for(f in cmd["tabular_sections"])
			sql += ", " + "`ts_" + f + "` JSON";
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

	else if(action == "get_tree")
		res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";

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

	var res,
		action = attr && attr.action ? attr.action : "create_table";

	if(action == "create_table")
		res = "CREATE TABLE IF NOT EXISTS `"+this.table_name+
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
		var sql = "CREATE TABLE IF NOT EXISTS `"+t.table_name+"` (",
			first_field = true;

		for(f in cmd["dimensions"]){
			if(first_field){
				sql += "`" + f + "`";
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
				sql += "`" + f + "`";
				first_field = false;
			}else
				sql += _md.sql_mask(f);
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

		for(var f in attr){
			if(f == "action" || f == "_values")
				continue;

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
	 * @param msg {String|Object} - текст события
	 */
	this.record = function(msg){
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

		alasql("insert into `ireg_$log` (`date`, `sequence`, `class`, `note`, `obj`) values (?, ?, ?, ?, ?)",
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
