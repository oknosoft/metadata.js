/**
 * Конструкторы табличных частей
 * @module  metadata
 * @submodule meta_tabulars
 * @author	Evgeniy Malyarov
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
	this._define('_name', {
		value : name,
		enumerable : false
	});

	/**
	 * Объект-владелец табличной части
	 * @property _owner
	 * @type DataObj
	 */
	this._define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
		value: owner._obj[name],
		writable: false,
		enumerable: false
	});
}

TabularSection.prototype.toString = function(){
	return "Табличная часть " + this._owner._manager.class_name + "." + this._name
};

/**
 * Возвращает строку табчасти по индексу
 * @method get
 * @param index {Number} - индекс строки табчасти
 * @return {TabularSectionRow}
 */
TabularSection.prototype.get = function(index){
	return this._obj[index]._row;
};

/**
 * Возвращает количество элементов в табчасти
 * @method count
 * @return {Number}
 */
TabularSection.prototype.count = function(){return this._obj.length};

/**
 * очищает табличнут часть
 * @method clear
 */
TabularSection.prototype.clear = function(do_not_notify){
	for(var i in this._obj)
		delete this._obj[i];
	this._obj.length = 0;

	if(!do_not_notify)
		Object.getNotifier(this).notify({
			type: 'update'
		});
};

/**
 * Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val){
	var index, _obj = this._obj, j = 0;
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

	for(var i in _obj){
		j++;
		_obj[i].row = j;
	}

	Object.getNotifier(this).notify({
		type: 'update'
	});
};

/**
 * Находит первую строку, содержащую значение
 * @method find
 * @param val {any}
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val){
	var res = $p._find(this._obj, val);
	if(res)
		return res._row;
};

/**
 * Находит строки, соответствующие отбору. Если отбор пустой, возвращаются все строки табчасти
 * @method find_rows
 * @param attr {object} - в ключах имена полей, в значениях значения фильтра
 * @param callback {function}
 * @return {Array}
 */
TabularSection.prototype.find_rows = function(attr, callback){

	var ok, o, i, j, res = [], a = this._obj;
	for(i in a){
		o = a[i];
		ok = true;
		if(attr)
			for(j in attr)
				if(!$p.is_equal(o[j], attr[j])){
					ok = false;
					break;
				}
		if(ok){
			if(callback){
				if(callback.call(this, o._row) === false)
					break;
			}else
				res.push(o._row);
		}
	}
	return res;
};

/**
 * Меняет местами строки табчасти
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){
	var tmp = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = tmp;

	Object.getNotifier(this).notify({
		type: 'update'
	});
};

/**
 * добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 */
TabularSection.prototype.add = function(attr, do_not_notify){

	var row = new this._owner._manager._ts_сonstructors[this._name](this);

	if(!attr)
		attr = {};

	// присваиваем типизированные значения по умолчанию
	for(var f in row._metadata.fields)
		row[f] = attr[f] || "";

	row._obj.row = this._obj.push(row._obj);
	row._obj._define("_row", {
		value: row,
		enumerable: false
	});

	if(!do_not_notify)
		Object.getNotifier(this).notify({
			type: 'update'
		});

	attr = null;
	return row;
};

/**
 * Выполняет цикл "для каждого"
 * @method each
 * @param fn {function} - callback, в который передается строка табчасти
 */
TabularSection.prototype.each = function(fn){
	var t = this;
	t._obj.forEach(function(row){
		return fn.call(t, row._row);
	});
};

/**
 * загружает табличнут часть из массива объектов
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

	Object.getNotifier(this).notify({
		type: 'update'
	});
};

/**
 * Перезаполняет грид данными табчасти
 * @method sync_grid
 * @param grid {dhtmlxGrid} - элемент управления
 */
TabularSection.prototype.sync_grid = function(grid){
	var grid_data = {rows: []},
		source = grid.getUserData("", "source");
	grid.clearAll();
	grid.setUserData("", "source", source);
	this.each(function(r){
		var data = [];
		for(var f in source.fields){
			if($p.is_data_obj(r[source.fields[f]]))
				data.push(r[source.fields[f]].presentation);
			else
				data.push(r[source.fields[f]]);
		}
		grid_data.rows.push({ id: r.row, data: data });
	});
	try{ grid.parse(grid_data, "json"); } catch (e){}
	grid.callEvent("onGridReconstructed",[]);
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};



/**
 * ### Aбстрактная строка табличной части
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 */
function TabularSectionRow(owner){

	var _obj = {};

	/**
	 * Указатель на владельца данной строки табличной части
	 * @property _owner
	 * @type TabularSection
	 */
	this._define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Отображается в поле типа json записи в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

/**
 * Метаданые строки табличной части
 * @property _metadata
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype._define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * Номер строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 * @final
 */
TabularSectionRow.prototype._define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

/**
 * Копирует строку табличной части
 * @method _clone
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype._define("_clone", {
	value : function(){
		var row = new this._owner._owner._manager._ts_сonstructors[this._owner._name](this._owner)._mixin(this._obj);
		return row;
	},
	enumerable : false
});

