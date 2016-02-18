/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_meta
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
 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
 * @param mtype {Object} - поле type объекта метаданных (field.type)
 * @return {*}
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
 * @return {*}
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
 * ### Поиск массива значений в коллекции
 * Кроме стандартного поиска по равенству значений,
 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
 * @method _find_rows
 * @for MetaEngine
 * @param arr {Array}
 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @param callback {Function}
 * @return {Array}
 * @private
 */
$p._find_rows = function(arr, selection, callback){
	var ok, o, i, j, res = [], top, count = 0;

	if(selection){
		if(selection._top){
			top = selection._top;
			delete selection._top;
		}else
			top = 300;
	}

	for(i in arr){
		o = arr[i];
		ok = true;
		if(selection){
			if(typeof selection == "function")
				ok = selection(o);
			else
				for(j in selection){
					if(j.substr(0, 1) == "_")
						continue;

					else if(typeof selection[j] == "function"){
						ok = selection[j](o, j);
						if(!ok)
							break;

					}else if(j == "or" && Array.isArray(selection[j])){
						ok = selection[j].some(function (element) {
							var key = Object.keys(element)[0];
							if(element[key].hasOwnProperty("like"))
								return o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
							else
								return $p.is_equal(o[key], element[key]);
						});
						if(!ok)
							break;

					}else if(selection[j] && selection[j].hasOwnProperty("like")){
						if(o[j].toLowerCase().indexOf(selection[j].like.toLowerCase())==-1){
							ok = false;
							break;
						}
					}else if(selection[j] && selection[j].hasOwnProperty("not")){
						if($p.is_equal(o[j], selection[j].not)){
							ok = false;
							break;
						}

					}else if(selection[j] && selection[j].hasOwnProperty("in")){
						ok = selection[j].in.some(function(element) {
							return $p.is_equal(element, o[j]);
						});
						if(!ok)
							break;

					}else if(!$p.is_equal(o[j], selection[j])){
						ok = false;
						break;
					}
				}
		}

		// выполняем колбэк с элементом и пополняем итоговый массив
		if(ok){
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

		if(mgr.cachable){
			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then($p.iface.data_to_tree);
		}
	}

	function get_selection(){

		if(mgr.cachable){

			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then(function(data){
					return $p.iface.data_to_grid.call(mgr, data, attr);
				});
		}
	}


	if(attr.action == "get_tree" && (res_local = get_tree()))
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
	 * @type ChartsOfCharacteristics
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
	 * Коллекция менеджеров задач
	 * @property tsk
	 * @type Tasks
	 * @for MetaEngine
	 * @static
	 */
	_tsk = $p.tsk = new (

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
		}),

	/**
	 * Коллекция менеджеров бизнес-процессов
	 * @property bp
	 * @type Tasks
	 * @for MetaEngine
	 * @static
	 */
	_bp = $p.bp = new (

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
 *    new $p.Meta('meta');
 */
function Meta(req, patch) {

	var m = (req && req.response) ? JSON.parse(req.response) : req,
		class_name;

	// Экспортируем ссылку на себя
	_md = $p.md = this;

	if(patch)
		Meta._patch(m, patch.response ? JSON.parse(patch.response) : patch);

	req = null;
	if(typeof window != "undefined"){
		patch = $p.injected_data['log.json'];
		Meta._patch(m, patch);
		patch = null;
	}

	/**
	 * Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){
		var np = class_name.split("."),
			res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}},
			is_doc = "doc,tsk,bp".indexOf(np[0]) != -1, is_cat = "cat,tsk".indexOf(np[0]) != -1;
		if(!field_name)
			return m[np[0]][np[1]];
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
		}else if(field_name=="deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";
		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";
		}else if(field_name=="lc_changed"){
			res.synonym = "Изменено в 1С";
			res.tooltip = "Время записи в 1С";
			res.type.types[0] = "number";
			res.type.digits = 15;
			res.type.fraction_figits = 0;
		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;
		}else if(field_name)
			res = m[np[0]][np[1]].fields[field_name];
		else
			res = m[np[0]][np[1]];
		return res;
	};

	/**
	 * Возвращает структуру метаданных конфигурации
	 * @method get_classes
	 */
	_md.get_classes = function () {
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
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md;\n";

		function on_table_created(data){

			if(typeof data === "number"){
				cstep--;
				if(cstep==0){
					if(callback)
						setTimeout(function () {
							callback(create);
						}, 10);
					else
						alasql.utils.saveFile("create_tables.sql", create);
				} else
					iteration();
			}else if(data && data.hasOwnProperty("message")){
				if($p.iface && $p.iface.docs){
					$p.iface.docs.progressOff();
					$p.msg.show_msg({
						title: $p.msg.error_critical,
						type: "alert-error",
						text: data.message
					});
				}
			}
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + ";\n";
			on_table_created(1);
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер
		"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
			for(class_name in managers[mgr])
				data_names.push({"class": $p[mgr], "name": managers[mgr][class_name]});
		});
		cstep = data_names.length;

		iteration();

	};

	/**
	 * Возвращает тип поля sql для типа данных
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
	 * Для полей составного типа, добавляет в sql поле описания типа
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
	}

	/**
	 * Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 */
	_md.sql_mask = function(f, t){
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	/**
	 * Возвращает менеджер объекта по имени класса
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
	 * Возвращает менеджер значения по свойству строки
	 * @method value_mgr
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - метаданные поля
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	_md.value_mgr = function(row, f, mf, array_enabled, v){
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
			if(rt.length == 1 || row[f] == $p.blank.guid)
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

	/**
	 * Возвращает имя типа элемента управления для типа поля
	 * @method control_by_type
	 * @param type
	 * @return {*}
	 */
	_md.control_by_type = function (type) {
		var ft;
		if(type.is_ref){
			if(type.types.join().indexOf("enm.")==-1)
				ft = "ocombo";//ft = "ref"; //
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
		} else if(type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
			ft = "txt";
		} else {
			ft = "ed";
		}
		return ft;
	};

	/**
	 * Возвращает структуру для инициализации таблицы на форме
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

	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: 'deleted',
			Description: 'name',
			DataVersion: 'data_version',
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
		return m.syns_js[m.syns_1с.indexOf(v)] || v;
	};

	_md.syns_1с = function (v) {
		var syn1c = {
			deleted: 'DeletionMark',
			name: 'Description',
			data_version: 'DataVersion',
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
		return m.syns_1с[m.syns_js.indexOf(v)] || v;
	};

	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				m.doc[i].printing_plates = pp.doc[i];

	};

	/**
	 * Возвращает имя класса по полному имени объекта метаданных 1С
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
			name = "aссreg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";
		else if(pn[0] == "Обработка")
			name = "dp.";
		else if(pn[0] == "Отчет")
			name = "rep.";

		return name + pn[1];

	};

	/**
	 * Возвращает полное именя объекта метаданных 1С по имени класса metadata
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
		else if(pn[0] == "aссreg")
			name = "РегистрБухгалтерии.";
		else if(pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if(pn[0] == "cacc")
			name = "ПланСчетов.";
		else if(pn[0] == "dp")
			name = "Обработка.";
		else if(pn[0] == "rep")
			name = "Отчет.";

		return name + pn[1];

	};

	_md.dates = function () {
		return {
			md_date: m["md_date"],
			cat_date: m["cat_date"]
		};
	}

	// создаём объекты менеджеров

	for(class_name in m.enm)
		_enm[class_name] = new EnumManager(m.enm[class_name], "enm."+class_name);

	for(class_name in m.cat)
		_cat[class_name] = new CatManager("cat."+class_name);

	for(class_name in m.doc)
		_doc[class_name] = new DocManager("doc."+class_name);

	for(class_name in m.ireg)
		_ireg[class_name] = (class_name == "$log") ? new LogManager("ireg."+class_name) : new InfoRegManager("ireg."+class_name);

	for(class_name in m.areg)
		_areg[class_name] = new AccumRegManager("areg."+class_name);

	for(class_name in m.dp)
		_dp[class_name] = new DataProcessorsManager("dp."+class_name);

	for(class_name in m.cch)
		_cch[class_name] = new ChartOfCharacteristicManager("cch."+class_name);

	for(class_name in m.cacc)
		_cacc[class_name] = new ChartOfAccountManager("cacc."+class_name);

	for(class_name in m.tsk)
		_tsk[class_name] = new TaskManager("tsk."+class_name);

	for(class_name in m.bp)
		_bp[class_name] = new BusinessProcessManager("bp."+class_name);

	// загружаем модификаторы и прочие зависимости
	$p.modifiers.execute($p);

	// широковещательное оповещение о готовности метаданных
	$p.eve.callEvent("meta");

}
$p.Meta = Meta;

/**
 * Подмешивает свойства с иерархией объекта patch в объект obj
 * @param obj
 * @param patch
 * @private
 */
Meta._patch = function(obj, patch){
	for(var area in patch){

		if(typeof patch[area] == "object"){
			if(obj[area])
				Meta._patch(obj[area], patch[area]);
			else
				obj[area] = patch[area];
		}else
			obj[area] = patch[area];
	}
}

/**
 * Инициализирует метаданные из встроенных данных, внешних файлов или indexeddb
 * @return {Promise}
 * @private
 */
Meta.init_meta = function (forse) {

	return new Promise(function(resolve, reject){

		if($p.injected_data['meta.json'])
			resolve(new Meta($p.injected_data['meta.json'], $p.injected_data['meta_patch.json']));

		else if($p.injected_data['meta_patch.json'])
			resolve(new Meta($p.injected_data['meta_patch.json']));

		else{

			// проверим indexeddb
			$p.wsql.idx_connect(null, 'meta')
				.then(function (db) {
					var mreq, mpatch;
					$p.wsql.idx_get('meta', db, 'meta')
						.then(function (data) {
							if(data && !forse){
								mreq = data;
								$p.wsql.idx_get('meta_patch', db, 'meta')
									.then(function (data) {
										resolve(new Meta(mreq, data));
									});
							}
							else{
								if(!$p.job_prm.files_date)
									$p.eve.update_files_version()
										.then(function () {
											from_files(db);
										});
								else
									from_files(db);
							}
						});
				});


			// в indexeddb не нашлось - грузим из файла
			function from_files(db){

				if(!$p.job_prm.data_url)
					return $p.wsql.idx_save({ref: "meta"}, db, 'meta')
						.then(function () {
							return $p.wsql.idx_save({ref: "meta_patch"}, db, 'meta')
						})
						.then(function () {
							new Meta({}, {})
						});


				var parts = [
					$p.ajax.get($p.job_prm.data_url + "meta.json?v="+$p.job_prm.files_date),
					$p.ajax.get($p.job_prm.data_url + "meta_patch.json?v="+$p.job_prm.files_date)
				], mreq, mpatch;


				// читаем файл метаданных и файл патча метаданных
				$p.eve.reduce_promices(parts, function (req) {
						if(req instanceof XMLHttpRequest && req.status == 200){
							if(req.responseURL.indexOf("meta.json") != -1){
								mreq = JSON.parse(req.response);

							}else if(req.responseURL.indexOf("meta_patch.json") != -1)
								mpatch = JSON.parse(req.response);
						}else{
							$p.record_log(req);
						}
					})
					// создаём объект Meta() описания метаданных
					.then(function () {
						if(!mreq)
							reject(new Error("Ошибка чтения файла метаданных"));
						else{
							mreq.ref = "meta";
							$p.wsql.idx_save(mreq, db, 'meta')
								.then(function () {
									mpatch.ref = "meta_patch";
									$p.wsql.idx_save(mpatch, db, 'meta');
								})
								.then(function () {
									resolve(new Meta(mreq, mpatch));
								});
						}
					})
			}
		}

	});
}

Meta.init_static = function (forse) {

	return new Promise(function(resolve, reject){

		// проверим indexeddb
		$p.wsql.idx_connect(null, 'static')
			.then(function (db) {
				var mreq, mpatch;
				$p.wsql.idx_get('p0', db, 'static')
					.then(function (data) {

					});
			});

	});
}

/**
 * Запись журнала регистрации
 * @param err
 */
$p.record_log = function (err) {
	if($p.ireg && $p.ireg.$log)
		$p.ireg.$log.record(err);
	else
		console.log(err);
};

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
			grid.parse(res, function(){
				if(callback)
					callback(res);
			}, "xml");

		else if(callback)
			callback(res);
	}

	grid.xmlFileUrl = "exec";


	var mgr = _md.mgr_by_class_name(attr.class_name);

	if((!mgr.cachable || attr.rest) && ($p.job_prm.rest || $p.job_prm.irest_enabled))
		mgr.rest_selection(attr)
			.then(cb_callBack)
			.catch($p.record_log);
	else
		_load(attr)
			.then(cb_callBack)
			.catch($p.record_log);

};