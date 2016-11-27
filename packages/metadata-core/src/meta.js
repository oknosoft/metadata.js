/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_meta
 */

/**
 * ### Описание метаданных объекта
 *
 * @class MetaObj
 */
class MetaObj {

}

/**
 * ### Описание метаданных поля
 *
 * @class MetaField
 */
class MetaField {

}

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

class Meta extends MetaEventEmitter{

	constructor($p) {

		super();

		var _m;

		/**
		 * ### Инициализирует метаданные
		 * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
		 *
		 * @method init
		 * @for Meta
		 * @param [meta_db] {Object|String}
		 */
		this.init = function (meta_db) {

			var confirm_count = 0;

			_m = meta_db;
			meta_db = null;


			// следим за изменениями базы meta и предлагаем перезагрузку при обновлении версии
			// TODO: назначить обработчик
			// $p.adapters.pouch.local.sync.meta.on("change", function (change) {
			// 	if(!_m)
			// 		do_init();
			//
			// 	else{
			// 		// если изменились метаданные, запланировать перезагрузку
			// 		do_reload();
			//      setTimeout(function () {
			//       	$p.eve.redirect = true;
			//       	location.reload(true);
			//       }, 1000);
			//   	}
			// });

			return _m;

		};

		/**
		 * ### Возвращает описание объекта метаданных
		 *
		 * @method get
		 * @param class_name {String} - например, "doc.calc_order"
		 * @param [field_name] {String}
		 * @return {Object}
		 */
		this.get = function(class_name, field_name){

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
		 * @method classes
		 * @return {Object}
		 */
		this.classes = function () {
			var res = {};
			for(var i in _m){
				res[i] = [];
				for(var j in _m[i])
					res[i].push(j);
			}
			return res;
		};

		/**
		 * ### Возвращает массив используемых баз
		 *
		 * @method bases
		 * @return {Array}
		 */
		this.bases = function () {
			var res = {};
			for(var i in _m){
				for(var j in _m[i]){
					if(_m[i][j].cachable){
						let _name = _m[i][j].cachable.replace('_remote', '');
						if(!res[_name])
							res[_name] = _name;
					}
				}
			}
			return Object.keys(res);
		};

		/**
		 * ### Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
		 * @method create_tables
		 */
		this.create_tables = function(callback, attr){

			var cstep = 0, data_names = [], managers = this.classes(), class_name,
				create = (attr && attr.postgres) ? "" : "USE md; ";

			function on_table_created(){

				cstep--;
				if(cstep==0){
					if(callback)
						callback(create);
					else
						$p.wsql.alasql.utils.saveFile("create_tables.sql", create);
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

		/**
		 * ### Возвращает англоязычный синоним строки
		 * TODO: перенести этот метод в плагин
		 *
		 * @method syns_js
		 * @param v {String}
		 * @return {String}
		 */
		this.syns_js = function(v) {
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
		 * TODO: перенести этот метод в плагин
		 *
		 * @method syns_1с
		 * @param v {String}
		 * @return {String}
		 */
		this.syns_1с = function (v) {
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
		this.printing_plates = function (pp) {
			if(pp)
				for(var i in pp.doc)
					_m.doc[i].printing_plates = pp.doc[i];

		};

		/**
		 * ### Возвращает менеджер объекта по имени класса
		 * @method mgr_by_class_name
		 * @param class_name {String}
		 * @return {DataManager|undefined}
		 * @private
		 */
		this.mgr_by_class_name = function (class_name) {
			if (class_name) {
				var np = class_name.split(".");
				if (np[1] && $p[np[0]])
					return $p[np[0]][np[1]];
				var pos = class_name.indexOf("_");
				if(pos){
					np = [class_name.substr(0,pos), class_name.substr(pos+1)];
					if (np[1] && $p[np[0]])
						return $p[np[0]][np[1]];
				}
			}
		}

	}

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
	sql_type(mgr, f, mf, pg) {
		var sql;
		if ((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if (mf.is_ref || mf.types.indexOf("guid") != -1) {
			if (!pg)
				sql = " CHAR";

			else if (mf.types.every(function (v) {
					return v.indexOf("enm.") == 0
				}))
				sql = " character varying(100)";

			else if (!mf.hasOwnProperty("str_len"))
				sql = " uuid";

			else
				sql = " character varying(" + Math.max(36, mf.str_len) + ")";

		} else if (mf.hasOwnProperty("str_len"))
			sql = pg ? (mf.str_len ? " character varying(" + mf.str_len + ")" : " text") : " CHAR";

		else if (mf.date_part)
			if (!pg || mf.date_part == "date")
				sql = " Date";

			else if (mf.date_part == "date_time")
				sql = " timestamp with time zone";

			else
				sql = " time without time zone";

		else if (mf.hasOwnProperty("digits")) {
			if (mf.fraction_figits == 0)
				sql = pg ? (mf.digits < 7 ? " integer" : " bigint") : " INT";
			else
				sql = pg ? (" numeric(" + mf.digits + "," + mf.fraction_figits + ")") : " FLOAT";

		} else if (mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else if (mf.types.indexOf("json") != -1)
			sql = " JSON";

		else
			sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	}

	/**
	 * ### Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 * @private
	 */
	sql_mask(f, t) {
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	}

	/**
	 * ### Возвращает структуру для инициализации таблицы на форме
	 * TODO: перенести этот метод в плагин
	 *
	 * @method ts_captions
	 * @param class_name
	 * @param ts_name
	 * @param source
	 * @return {boolean}
	 */
	ts_captions(class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = this.get(class_name).tabular_sections[ts_name],
			mfrm = this.get(class_name).form,
			fields = mts.fields, mf;

		// если имеются метаданные формы, используем их
		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			utils._mixin(source, mfrm.obj.tabular_sections[ts_name]);

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
					source.types += "," + this.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	}

	/**
	 * ### Возвращает имя класса по полному имени объекта метаданных 1С
	 * TODO: перенести этот метод в плагин
	 *
	 * @method class_name_from_1c
	 * @param name
	 */
	class_name_from_1c (name) {

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

		return name + this.syns_js(pn[1]);

	}

	/**
	 * ### Возвращает полное именя объекта метаданных 1С по имени класса metadata
	 * TODO: перенести этот метод в плагин
	 *
	 * @method class_name_to_1c
	 * @param name
	 */
	class_name_to_1c(name) {

		var pn = name.split(".");
		if (pn.length == 1)
			return "Перечисление." + name;
		else if (pn[0] == "enm")
			name = "Перечисление.";
		else if (pn[0] == "cat")
			name = "Справочник.";
		else if (pn[0] == "doc")
			name = "Документ.";
		else if (pn[0] == "ireg")
			name = "РегистрСведений.";
		else if (pn[0] == "areg")
			name = "РегистрНакопления.";
		else if (pn[0] == "accreg")
			name = "РегистрБухгалтерии.";
		else if (pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if (pn[0] == "cacc")
			name = "ПланСчетов.";
		else if (pn[0] == "dp")
			name = "Обработка.";
		else if (pn[0] == "rep")
			name = "Отчет.";

		return name + this.syns_1с(pn[1]);

	}

}

Meta.Obj = MetaObj;
Meta.Field = MetaField;

classes.Meta = Meta;
