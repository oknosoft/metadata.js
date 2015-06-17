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

	$p.job_prm.rest_url()
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
 * @param filter {String} - строка условия отбора
 * @param [top] {Number} - максимальное число загружаемых записей
 * @return {Promise.<T>} - промис с массивом загруженных объектов
 * @async
 */
DataManager.prototype.load_rest = function (url, filter, top) {
	if(!url)
		url = $p.job_prm.hs_url();
	//a/zd/1/odata/standard.odata/Catalog_Номенклатура?$format=json&$select=Ref_Key,DataVersion
	return Promise.resolve([]);
};

/**
 * Сериализует объект данных в формат xml/atom (например, для rest-сервиса 1С)
 * @param [ex_meta] {Object} - метаданные внешней базы (например, УНФ).
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
			}else if(mf.type.date_part)
				v = $p.dateFormat(v, $p.dateFormat.masks.atom);

			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof CatObj){

		if(this._metadata.main_presentation_name)
			prop+= '\n<d:Description>' + this.name + '</d:Description>';

		if(this._metadata.code_length)
			prop+= '\n<d:Code>' + this.id + '</d:Code>';

		if(this._metadata.hierarchical && this._metadata.group_hierarchy)
			prop+= '\n<d:IsFolder>' + this.is_folder + '</d:IsFolder>';

	}else if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.dateFormat(this.date, $p.dateFormat.masks.atom) + '</d:Date>';
		prop+= '\n<d:Number>' + this.number_doc + '</d:Number>';

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

	attr.url += this._manager.rest_name;

	// проверяем наличие ссылки в базе приёмника



	//HTTP-заголовок 1C_OData_DataLoadMode=true
	//Post?PostingModeOperational=false.
	return Promise.resolve(this);

};