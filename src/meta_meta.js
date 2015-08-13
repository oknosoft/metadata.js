/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  metadata
 * @submodule meta_meta
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
			for(j in attr){
				if(attr[j].hasOwnProperty("like")){
					if(o[j].toLowerCase().indexOf(attr[j].like.toLowerCase())==-1){
						ok = false;
						break;
					}
				}else{
					if(!$p.is_equal(o[j], attr[j])){
						ok = false;
						break;
					}
				}
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
 *    new $p.Meta(require('meta'));
 */
function Meta(req, patch) {

	var m = (req instanceof XMLHttpRequest) ? JSON.parse(req.response) : req,
		class_name;

	function apply_patch(patch){
		for(var area in patch){
			for(var c in patch[area]){
				if(!m[area][c])
					m[area][c] = {};
				m[area][c]._mixin(patch[area][c]);
			}
		}
	}
	if(patch)
		apply_patch(JSON.parse(patch.response));
	req = null;
	patch = require('log');
	if(typeof patch == "string")
		patch = JSON.parse(patch);
	apply_patch(patch);
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
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
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
				else
					return oproperty.type;
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
			Дата: 'date',
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
		if(pp)
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
	$p.modifiers.execute();

	return {
		md_date: m["md_date"],
		cat_date: m["cat_date"]
	};
}
$p.Meta = Meta;

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