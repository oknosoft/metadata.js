/**
 * Конструкторы табличных частей
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_tabulars
 * @requires common
 */


/**
 * ### Абстрактный объект табличной части
 * - Физически, данные хранятся в {{#crossLink "DataObj"}}{{/crossLink}}, а точнее - в поле типа массив и именем табчасти объекта `_obj`
 * - Класс предоставляет методы для доступа и манипуляции данными табчасти
 *
 * @class TabularSection
 * @constructor
 * @param name {String} - имя табчасти
 * @param owner {DataObj} - владелец табличной части
 * @menuorder 21
 * @tooltip Табличная часть
 */
function TabularSection(name, owner){

	// Если табчасти нет в данных владельца - создаём
	if(!owner._obj[name])
		owner._obj[name] = [];

	/**
	 * Имя табличной части
	 * @property _name
	 * @type String
	 */
	this.__define('_name', {
		value : name,
		enumerable : false
	});

	/**
	 * Объект-владелец табличной части
	 * @property _owner
	 * @type DataObj
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: owner._obj[name],
		writable: false,
		enumerable: false
	});
}

TabularSection.prototype.toString = function(){
	return "Табличная часть " + this._owner.class_name + "." + this._name
};

/**
 * ### Возвращает строку табчасти по индексу
 * @method get
 * @param index {Number} - индекс строки табчасти
 * @return {TabularSectionRow}
 */
TabularSection.prototype.get = function(index){
	return this._obj[index] ? this._obj[index]._row : null;
};

/**
 * ### Возвращает количество элементов в табчасти
 * @method count
 * @return {Number}
 *
 * @example
 *     // количество элементов в табчасти
 *     var count = ts.count();
 */
TabularSection.prototype.count = function(){return this._obj.length};

/**
 * ### Очищает табличнут часть
 * @method clear
 * @return {TabularSection}
 *
 * @example
 *     // Очищает табличнут часть
 *     ts.clear();
 *
 */
TabularSection.prototype.clear = function(silent, selection){

  if(!selection){
    this._obj.length = 0;
  }
  else{
    this.find_rows(selection).forEach(function (row) {
      row._row._owner.del(row.row-1, true);
    })
  }

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	return this;
};

/**
 * ### Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val, silent){

	var index, _obj = this._obj;

	if(typeof val == "undefined")
		return;

	else if(typeof val == "number")
		index = val;

	else if(_obj[val.row-1]._row === val)
		index = val.row-1;

	else{
		for(var i in _obj)
			if(_obj[i]._row === val){
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
	}
	if(index == undefined)
		return;

	_obj.splice(index, 1);

	_obj.forEach(function (row, index) {
		row.row = index + 1;
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	this._owner._data._modified = true;
};

/**
 * ### Находит первую строку, содержащую значение
 * @method find
 * @param val {*} - значение для поиска
 * @param columns {String|Array} - колонки, в которых искать
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val, columns){
	var res = $p._find(this._obj, val, columns);
	if(res)
		return res._row;
};

/**
 * ### Находит строки, соответствующие отбору
 * Если отбор пустой, возвращаются все строки табчасти
 *
 * @method find_rows
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 * @param [callback] {Function} - в который передается строка табчасти на каждой итерации
 * @return {Array}
 */
TabularSection.prototype.find_rows = function(selection, callback){

	var t = this,
		cb = callback ? function (row) {
			return callback.call(t, row._row);
		} : null;

	return $p.utils._find_rows.call(t, t._obj, selection, cb);

};

/**
 * ### Меняет местами строки табчасти
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){

	var row1 = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = row1;
  this._obj[rowid1].row = rowid1 + 1;
  this._obj[rowid2].row = rowid2 + 1;

	if(!this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});
};

/**
 * ### Добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 *
 * @example
 *     // Добавляет строку в табчасть и заполняет её значениями, переданными в аргументе
 *     var row = ts.add({field1: value1});
 */
TabularSection.prototype.add = function(attr, silent){

	var row = new $p[this._owner._manager.obj_constructor(this._name)](this);

	if(!attr)
		attr = {};

	// присваиваем типизированные значения по умолчанию
	for(var f in row._metadata.fields)
		row[f] = attr[f] || "";

	row._obj.row = this._obj.push(row._obj);
	row._obj.__define("_row", {
		value: row,
		enumerable: false
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;

	this._owner._data._modified = true;

	return row;
};

/**
 * ### Выполняет цикл "для каждого"
 * @method each
 * @param fn {Function} - callback, в который передается строка табчасти
 */
TabularSection.prototype.each = function(fn){
	var t = this;
	t._obj.forEach(function(row){
		return fn.call(t, row._row);
	});
};

/**
 * ### Псевдоним для each
 * @method forEach
 * @type {TabularSection.each|*}
 */
TabularSection.prototype.forEach = TabularSection.prototype.each;

/**
 * ### Сворачивает табличную часть
 * детали см. в {{#crossLink "TabularSection/aggregate:method"}}{{/crossLink}}
 * @method group_by
 * @param [dimensions] {Array|String}
 * @param [resources] {Array|String}
 */
TabularSection.prototype.group_by = function (dimensions, resources) {

	try{
		var res = this.aggregate(dimensions, resources, "SUM", true);
		return this.clear(true).load(res);

	}catch(err){}
};

/**
 * ### Сортирует табличную часть
 *
 * @method sort
 * @param fields {Array|String}
 */
TabularSection.prototype.sort = function (fields) {

	if(typeof fields == "string")
		fields = fields.split(",");

	var sql = "select * from ? order by ", res = true;
	fields.forEach(function (f) {
		f = f.trim().replace(/\s{1,}/g," ").split(" ");
		if(res)
			res = false;
		else
			sql += ", ";
		sql += "`" + f[0] + "`";
		if(f[1])
			sql += " " + f[1];
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		return this.clear(true).load(res);

	}catch(err){
		$p.record_log(err);
	}
};

/**
 * ### Вычисляет агрегатную функцию по табличной части
 * - Не изменяет исходный объект. Если пропущен аргумент `aggr` - вычисляет сумму.
 * - Стандартные агрегаторы: SUM, COUNT, MIN, MAX, FIRST, LAST, AVG, AGGR, ARRAY, REDUCE
 * - AGGR - позволяет задать собственный агрегатор (функцию) для расчета итогов
 *
 * @method aggregate
 * @param [dimensions] {Array|String} - список измерений
 * @param [resources] {Array|String} - список ресурсов
 * @param [aggr] {String} - агрегатная функция
 * @param [ret_array] {Boolran} - указывает возвращать массив значений
 * @return {Number|Array} - Значение агрегатной фукнции или массив значений
 *
 * @example
 *     // вычисляем сумму (итог) по полю amount табличной части
 *     var total = ts.aggregate("", "amount");
 *
 *     // вычисляем максимальные суммы для всех номенклатур табличной части
 *     // вернёт массив объектов {nom, amount}
 *     var total = ts.aggregate("nom", "amount", "MAX", true);
 */
TabularSection.prototype.aggregate = function (dimensions, resources, aggr, ret_array) {

	if(typeof dimensions == "string")
		dimensions = dimensions.split(",");
	if(typeof resources == "string")
		resources = resources.split(",");
	if(!aggr)
		aggr = "sum";

	// для простых агрегатных функций, sql не используем
	if(!dimensions.length && resources.length == 1 && aggr == "sum"){
		return this._obj.reduce(function(sum, row, index, array) {
			return sum + row[resources[0]];
		}, 0);
	}

	var sql, res = true;

	resources.forEach(function (f) {
		if(!sql)
			sql = "select " + aggr + "(`" + f + "`) `" + f + "`";
		else
			sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
	});
	dimensions.forEach(function (f) {
		if(!sql)
			sql = "select `" + f + "`";
		else
			sql += ", `" + f + "`";
	});
	sql += " from ? ";
	dimensions.forEach(function (f) {
		if(res){
			sql += "group by ";
			res = false;
		}
		else
			sql += ", ";
		sql += "`" + f + "`";
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		if(!ret_array){
			if(resources.length == 1)
				res = res.length ? res[0][resources[0]] : 0;
			else
				res = res.length ? res[0] : {};
		}
		return res;

	}catch(err){
		$p.record_log(err);
	}
};

/**
 * ### Загружает табличнут часть из массива объектов
 *
 * @method load
 * @param aattr {Array} - массив объектов к загрузке
 */
TabularSection.prototype.load = function(aattr){

	var t = this, arr;

	t.clear(true);
	if(aattr instanceof TabularSection)
		arr = aattr._obj;
	else if(Array.isArray(aattr))
		arr = aattr;
	if(arr)
		arr.forEach(function(row){
			t.add(row, true);
	});

	if(!this._owner._data._silent)
		Object.getNotifier(t._owner).notify({
			type: 'rows',
			tabular: t._name
		});

	return t;
};

/**
 * ### Перезаполняет грид данными табчасти с учетом отбора
 * @method sync_grid
 * @param grid {dhtmlxGrid} - элемент управления
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 */
TabularSection.prototype.sync_grid = function(grid, selection){
	var grid_data = {rows: []},
		columns = [];

	for(var i = 0; i<grid.getColumnCount(); i++)
		columns.push(grid.getColumnId(i));

	grid.clearAll();
	this.find_rows(selection, function(r){
		var data = [];
		columns.forEach(function (f) {
			if($p.utils.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	if(grid.objBox){
		try{
			grid.parse(grid_data, "json");
			grid.callEvent("onGridReconstructed", []);
		} catch (e){}
	}
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


/**
 * ### Aбстрактная строка табличной части
 *
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 * @menuorder 22
 * @tooltip Строка табчасти
 */
function TabularSectionRow(owner){

	var _obj = {};

	/**
	 * Указатель на владельца данной строки табличной части
	 * @property _owner
	 * @type TabularSection
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Отображается в поле типа json записи в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

/**
 * ### Метаданые строки табличной части
 * @property _metadata
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * ### Номер строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 * @final
 */
TabularSectionRow.prototype.__define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

/**
 * ### Копирует строку табличной части
 * @method _clone
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define("_clone", {
	value : function(){
		return new $p[this._owner._owner._manager.obj_constructor(this._owner._name)](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v || (!v && this._obj[f] == $p.utils.blank.guid))
		return;

	var _owner = this._owner._owner;

	if(!_owner._data._silent)
		Object.getNotifier(_owner).notify({
			type: 'row',
			row: this,
			tabular: this._owner._name,
			name: f,
			oldValue: this._obj[f]
		});

	// учтём связь по типу
	if(this._metadata.fields[f].choice_type){
		var prop;
		if(this._metadata.fields[f].choice_type.path.length == 2)
			prop = this[this._metadata.fields[f].choice_type.path[1]];
		else
			prop = _owner[this._metadata.fields[f].choice_type.path[0]];
		if(prop && prop.type)
			v = $p.utils.fetch_type(v, prop.type);
	}

	DataObj.prototype.__setter.call(this, f, v);
  _owner._data._modified = true;

};

