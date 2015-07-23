/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 * @module  metadata
 * @submodule rest
 * @author	Evgeniy Malyarov
 * @requires common
 */

function Rest(){

	this.filter_date = function (fld, dfrom, dtill) {
		if(!dfrom)
			dfrom = new Date("2015-01-01");
		var res = fld + " gt datetime'" + $p.dateFormat(dfrom, $p.dateFormat.masks.isoDateTime) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.dateFormat(dtill, $p.dateFormat.masks.isoDateTime) + "'";
		return res;
	};

	this.to_data = function (rdata, mgr) {
		var o = {},
			mf = mgr.metadata().fields,
			mts = mgr.metadata().tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			o.deleted = rdata.DeletionMark;
			o.data_version = rdata.DataVersion;
		}else{
			mf = []._mixin(mgr.metadata().dimensions)._mixin(mgr.metadata().resources);
		}

		if(mgr instanceof DocManager){
			o.number_doc = rdata.Number;
			o.date = rdata.Date;
			o.posted = rdata.Posted;

		} else {
			if(mgr.metadata().main_presentation_name)
				o.name = rdata.Description;

			if(mgr.metadata().code_length)
				o.id = rdata.Code;
		}

		for(f in mf){
			syn = _md.syns_1с(f);
			if(mf[f].type.is_ref && rdata[syn+"_Key"])
				syn+="_Key";
			o[f] = rdata[syn];
		}

		for(ts in mts){
			synts = _md.syns_1с(ts);
			o[ts] = [];
			if(rdata[synts]){
				rdata[synts].sort(function (a, b) {
					return a.LineNumber > b.LineNumber;
				});
				rdata[synts].forEach(function (r) {
					row = {};
					for(tf in mts[ts].fields){
						syn = _md.syns_1с(tf);
						if(mts[ts].fields[tf].type.is_ref && r[syn+"_Key"])
							syn+="_Key";
						row[tf] = r[syn];
					}
					o[ts].push(row);
				});
			}
		}

		return o;
	};

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
	}
}

var _rest = $p.rest = new Rest();


/**
 * Имя объектов этого менеджера для rest-запросов на сервер<br />
 * Идентификатор формируется по следующему принципу: ПрефиксИмени_ИмяОбъектаКонфигурации_СуффиксИмени
 * - Справочник  Catalog
 * - Документ    Document
 * - Журнал документов   DocumentJournal
 * - Константа   Constant
 * - План обмена ExchangePlan
 * - План счетов ChartOfAccounts
 * - План видов расчета  ChartOfCalculationTypes
 * - План видов характеристик    ChartOfCharacteristicTypes
 * - Регистр сведений    InformationRegister
 * - Регистр накопления  AccumulationRegister
 * - Регистр расчета CalculationRegister
 * - Регистр бухгалтерии AccountingRegister
 * - Бизнес-процесс  BusinessProcess
 * - Задача  Task
 * @property rest_name
 * @type String
 */
DataManager.prototype._define("rest_name", {
	get : function(suffix){
		var fp = this.class_name.split("."),
			csyn = {cat: "Catalog", doc: "Document", ireg: "InformationRegister", areg: "AccumulationRegister"};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]) + (suffix || "");
	},
	enumerable : false
});

/**
 * Загружает список объектов из rest-сервиса
 * @param attr {Object} - параметры сохранения
 * @param attr.[url] {String}
 * @param attr.[username] {String}
 * @param attr.[password] {String}
 * @param attr.[filter] {String} - строка условия отбора
 * @param attr.[top] {Number} - максимальное число загружаемых записей
 * @return {Promise.<T>} - промис с массивом загруженных объектов
 * @async
 */
DataManager.prototype.load_rest = function (attr) {

	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000";
	//a/unf/odata/standard.odata/Document_ЗаказПокупателя?allowedOnly=true&$format=json&$select=Ref_Key,DataVersion

	return _rest.ajax_to_data(attr, this);

};

DataManager.prototype.rest_tree = function (attr) {

};

DataManager.prototype.rest_selection = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = [],
		ares = [], o, ro, syn, mf,
		select = list_flds();


	function list_flds(){
		var s = "$select=Ref_Key,DeletionMark";

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
			syn = _md.syns_1с(fld);
			if(_md.get(t.class_name, fld).type.is_ref){
				if(_md.get(t.class_name, fld).type.types.length && _md.get(t.class_name, fld).type.types[0].indexOf("enm.")==-1)
					syn += "_Key";
			}

			s += "," + syn;
		});

		flds.push("ref");
		flds.push("deleted");

		return s;

	}

	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000&" + select;

	attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {};
				flds.forEach(function (fld) {
					if(fld == "ref"){
						o[fld] = ro["Ref_Key"];
					}else{
						syn = _md.syns_1с(fld);
						mf = _md.get(t.class_name, fld);
						if(mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
							syn += "_Key";

						if(mf.type.date_part)
							o[fld] = $p.dateFormat(ro[syn], $p.dateFormat.masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!ro[syn] || ro[syn] == $p.blank.guid)
								o[fld] = "";
							else{
								var mgr	= _md.value_mgr(o, fld, mf.type, false, ro[syn]);
								if(mgr)
									o[fld] = mgr.get(ro[syn]).presentation;
								else
									o[fld] = "";
							}
						}else
							o[fld] = ro[syn];
					}
				});
				ares.push(o);
			}
			return data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(filter){

	if(!filter.period)
		filter.period = $p.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.dateFormat(filter.period, $p.dateFormat.masks.isoDateTime) + "'",
		condition = "";

	for(var fld in cmd.dimensions){

		if(filter[fld] === undefined)
			continue;

		var syn = _md.syns_1с(fld),
			mf = cmd.dimensions[fld];

		if(mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1){
			syn += "_Key";
			if(condition)
				condition+= " and ";
			condition+= syn+" eq guid'"+filter[fld].ref+"'";
		}else{
			if(condition)
				condition+= " and ";

			if(mf.type.digits)
				condition+= syn+" eq "+$p.fix_number(filter[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+$p.dateFormat(filter[fld], $p.dateFormat.masks.isoDateTime)+"'";

			else
				condition+= syn+" eq '"+filter[fld]+"'";
		}

	}

	if(condition)
		period+= ",Condition='"+condition+"'";

	$p.ajax.default_attr(filter, $p.job_prm.rest_url());
	filter.url += this.rest_name + "/SliceLast(%sl)?allowedOnly=true&$format=json&$top=1000".replace("%sl", period);

	return _rest.ajax_to_data(filter, t)
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
		.replace('%d', $p.dateFormat(new Date(), $p.dateFormat.masks.atom)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this.deleted + '</d:DeletionMark>' +
			'\n<d:DataVersion>' + this.data_version + '</d:DataVersion>',

		f, mf, fts, ts, mts, pname, v;

	function fields_to_atom(obj){
		var meta_fields = obj._metadata.fields,
			prefix = obj instanceof TabularSectionRow ? '\n\t<d:' : '\n<d:';

		for(f in meta_fields){
			mf = meta_fields[f];
			pname = _md.syns_1с(f);
			v = obj[f];
			if(v instanceof EnumObj)
				v = v.name;
			else if(v instanceof DataObj){
				pname+= '_Key';
				v = v.ref;
			}else if(mf.type.date_part){
				if($p.blank.date == v)
					v = '0001-01-01T00:00:00Z';
				else
					v = $p.dateFormat(v, $p.dateFormat.masks.atom);
			}


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.dateFormat(this.date, $p.dateFormat.masks.atom) + '</d:Date>';
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
 * Сохраняет объект в базе rest-сервиса
 * @param attr {Object} - параметры сохранения
 * @param attr.url {String}
 * @param attr.username {String}
 * @param attr.password {String}
 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param attr.[operational] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>}
 * @async
 */
DataObj.prototype.save_rest = function (attr) {

	var tObj = this,
		atom = tObj.to_atom(),
		url;

	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	url = attr.url + tObj._manager.rest_name;

	// проверяем наличие ссылки в базе приёмника
	attr.url = url + "(guid'" + tObj.ref + "')?$format=json&$select=Ref_Key,DeletionMark";

	return $p.ajax.get_ex(attr.url, attr)
		.catch(function (err) {
			if(err.status == 404){
				return JSON.stringify({is_new: true});
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
			var data = require("xml_to_json").parseString(req.response, {
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
				r.lc_changed = new Date(data.entry.updated._text);
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

/**
 * Читает объект из rest-сервиса
 * @return {Promise.<T>} - промис с загруженным объектом
 */
DataObj.prototype.load_rest = function () {

	var attr = {},
		tObj = this;
	$p.ajax.default_attr(attr, $p.job_prm.rest_url());
	attr.url += tObj._manager.rest_name + "(guid'" + tObj.ref + "')?$format=json";

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			return tObj._mixin(_rest.to_data(res, tObj._manager));
		})
		.catch(function (err) {
			if(err.status==404)
				return tObj;
			else
				console.log(err);
		});
};