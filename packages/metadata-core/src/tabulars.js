/**
 * Конструкторы табличных частей
 *
 * @module  metadata
 * @submodule meta_tabulars
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
class TabularSection {

	constructor(name, owner) {

		// Если табчасти нет в данных владельца - создаём
		if (!owner._obj[name]){
			owner._obj[name] = []
		}

		Object.defineProperties(this, {

			/**
			 * Имя табличной части
			 * @property _name
			 * @type String
			 */
			_name: {
				get: () => name
			},

			/**
			 * Объект-владелец табличной части
			 * @property _owner
			 * @type DataObj
			 */
			_owner: {
				get: () => owner
			},

		})
	}

	toString() {
		return "Табличная часть " + this._owner._manager.class_name + "." + this._name
	}

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	get _obj(){
		const {_owner, _name} = this
		return _owner._obj[_name]
	}

	/**
	 * ### Возвращает строку табчасти по индексу
	 * @method get
	 * @param index {Number} - индекс строки табчасти
	 * @return {TabularSectionRow}
	 */
	get(index) {
		const row = this._obj[index]
		return row ? row._row : null
	}

	/**
	 * ### Возвращает количество элементов в табчасти
	 * @method count
	 * @return {Number}
	 *
	 * @example
	 *     // количество элементов в табчасти
	 *     var count = ts.count();
	 */
	count() {
		return this._obj.length
	}

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
	clear(silent) {

		const {_obj, _owner} = this;

		// for (var i = 0; i < _obj.length; i++){
		// 	delete _obj[i]
		// }
		_obj.length = 0;

		if (!silent && !_owner._data._silent){
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}
		return this;
	}

	/**
	 * ### Удаляет строку табличной части
	 * @method del
	 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
	 */
	del(val, silent) {

		const {_obj, _owner} = this;

		let index;

		if (typeof val == "undefined")
			return;

		else if (typeof val == "number")
			index = val;

		else if (_obj[val.row - 1]._row === val)
			index = val.row - 1;

		else {
			for (var i in _obj)
				if (_obj[i]._row === val) {
					index = Number(i);
					delete _obj[i]._row;
					break;
				}
		}
		if (index == undefined)
			return;

		_obj.splice(index, 1);

		_obj.forEach(function (row, index) {
			row.row = index + 1;
		});

		if (!silent && !_owner._data._silent){
			// TODO: observe
			// Object.getNotifier(_owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}

		_owner._data._modified = true;
	}

	/**
	 * ### Находит первую строку, содержащую значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @param columns {String|Array} - колонки, в которых искать
	 * @return {TabularSectionRow}
	 */
	find(val, columns) {
		var res = utils._find(this._obj, val, columns);
		if (res)
			return res._row;
	}

	/**
	 * ### Находит строки, соответствующие отбору
	 * Если отбор пустой, возвращаются все строки табчасти
	 *
	 * @method find_rows
	 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
	 * @param [callback] {Function} - в который передается строка табчасти на каждой итерации
	 * @return {Array}
	 */
	find_rows(selection, callback) {

		const cb = callback ? (row) => {
			return callback.call(this, row._row);
		} : null;

		return utils._find_rows.call(this, this._obj, selection, cb);

	}

	/**
	 * ### Меняет местами строки табчасти
	 * @method swap
	 * @param rowid1 {number}
	 * @param rowid2 {number}
	 */
	swap(rowid1, rowid2) {

		const {_obj} = this;
		[_obj[rowid1], _obj[rowid2]] = [_obj[rowid2], _obj[rowid1]];
		_obj[rowid1].row = rowid2 + 1
		_obj[rowid2].row = rowid1 + 1

		if (!this._owner._data._silent){
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}
	}

	/**
	 * ### Добавляет строку табчасти
	 * @method add
	 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
	 * @param silent {Boolean} - тихий режим, без генерации событий изменения объекта
	 * @return {TabularSectionRow}
	 *
	 * @example
	 *     // Добавляет строку в табчасть и заполняет её значениями, переданными в аргументе
	 *     const row = ts.add({field1: value1});
	 */
	add(attr = {}, silent) {

		const {_owner, _name, _obj} = this
		const row = _owner._manager.obj_constructor(_name, this);

		// присваиваем типизированные значения по умолчанию
		for (let f in row._metadata().fields){
			row[f] = attr[f] || "";
		}

		row._obj.row = _obj.push(row._obj);
		Object.defineProperty(row._obj, "_row", {
			value: row,
			enumerable: false
		})

		if (!silent && !this._owner._data._silent){
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}

		_owner._data._modified = true;

		return row;
	}

	/**
	 * ### Выполняет цикл "для каждого"
	 * @method each
	 * @param fn {Function} - callback, в который передается строка табчасти
	 */
	each(fn) {
		this._obj.forEach((row) => fn.call(this, row._row));
	}

	/**
	 * ### Псевдоним для each
	 * @method forEach
	 * @type {TabularSection.each|*}
	 */
	get forEach() {
		return this.each
	}

	/**
	 * ### Сворачивает табличную часть
	 * детали см. в {{#crossLink "TabularSection/aggregate:method"}}{{/crossLink}}
	 * @method group_by
	 * @param [dimensions] {Array|String}
	 * @param [resources] {Array|String}
	 */
	group_by(dimensions, resources) {

		try {
			const res = this.aggregate(dimensions, resources, "SUM", true);
			return this.clear(true).load(res);
		}
		catch (err) {
			utils.record_log(err);
		}
	}

	/**
	 * ### Сортирует табличную часть
	 *
	 * @method sort
	 * @param fields {Array|String}
	 */
	sort(fields) {

		if (typeof fields == "string"){
			fields = fields.split(",")
		}

		let sql = "select * from ? order by ",
			res = true
			has_dot;

		fields.forEach(function (f) {
			has_dot = has_dot || f.match('.');
			f = f.trim().replace(/\s{1,}/g, " ").split(" ");
			if (res){
				res = false;
			}
			else{
				sql += ", ";
			}

			sql += "`" + f[0] + "`";
			if (f[1]){
				sql += " " + f[1];
			}
		});

		try {
			res = alasql(sql, [has_dot ? this._obj.map((row) => row._row) : this._obj]);
			return this.clear(true).load(res);
		}
		catch (err) {
			utils.record_log(err);
		}
	}

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
	aggregate(dimensions, resources, aggr = "sum", ret_array) {

		if (typeof dimensions == "string"){
			dimensions = dimensions.split(",")
		}
		if (typeof resources == "string"){
			resources = resources.split(",")
		}

		// для простых агрегатных функций, sql не используем
		if (!dimensions.length && resources.length == 1 && aggr == "sum") {
			return this._obj.reduce(function (sum, row, index, array) {
				return sum + row[resources[0]];
			}, 0);
		}

		let sql, res = true;

		resources.forEach(function (f) {
			if (!sql)
				sql = "select " + aggr + "(`" + f + "`) `" + f + "`";
			else
				sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
		});
		dimensions.forEach(function (f) {
			if (!sql)
				sql = "select `" + f + "`";
			else
				sql += ", `" + f + "`";
		});
		sql += " from ? ";
		dimensions.forEach(function (f) {
			if (res) {
				sql += "group by ";
				res = false;
			}
			else
				sql += ", ";
			sql += "`" + f + "`";
		});

		try {
			res = alasql(sql, [this._obj]);
			if (!ret_array) {
				if (resources.length == 1)
					res = res.length ? res[0][resources[0]] : 0;
				else
					res = res.length ? res[0] : {};
			}
			return res;

		} catch (err) {
			utils.record_log(err);
		}
	};

	/**
	 * ### Загружает табличнут часть из массива объектов
	 *
	 * @method load
	 * @param aattr {Array} - массив объектов к загрузке
	 */
	load(aattr) {

		let arr;

		this.clear(true);

		if (aattr instanceof TabularSection){
			arr = aattr._obj
		}
		else if (Array.isArray(aattr)){
			arr = aattr
		}

		if (arr){
			arr.forEach((row) => {
				this.add(row, true)
			})
		}

		if (!this._owner._data._silent){
			// TODO: observe
			// Object.getNotifier(t._owner).notify({
			// 	type: 'rows',
			// 	tabular: t._name
			// });
		}

		return this;
	}

	/**
	 * ### Перезаполняет грид данными табчасти с учетом отбора
	 * @method sync_grid
	 * @param grid {dhtmlxGrid} - элемент управления
	 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
	 */
	sync_grid(grid, selection) {
		var grid_data = {rows: []},
			columns = [];

		for (var i = 0; i < grid.getColumnCount(); i++)
			columns.push(grid.getColumnId(i));

		grid.clearAll();
		this.find_rows(selection, function (r) {
			var data = [];
			columns.forEach(function (f) {
				if (utils.is_data_obj(r[f]))
					data.push(r[f].presentation);
				else
					data.push(r[f]);
			});
			grid_data.rows.push({id: r.row, data: data});
		});
		if (grid.objBox) {
			try {
				grid.parse(grid_data, "json");
				//grid.callEvent("onGridReconstructed", []);
			} catch (e) {
			}
		}
	}

	toJSON() {
		return this._obj;
	}
}


/**
 * ### Aбстрактная строка табличной части
 *
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 * @menuorder 22
 * @tooltip Строка табчасти
 */
class TabularSectionRow {

	constructor(owner) {

		//var _obj = {};

		Object.defineProperties(this, {

			/**
			 * Указатель на владельца данной строки табличной части
			 * @property _owner
			 * @type TabularSection
			 */
			_owner: {
				value: owner
			},

			/**
			 * ### Фактическое хранилище данных объекта
			 * Отображается в поле типа json записи в таблице объекта локальной базы данных
			 * @property _obj
			 * @type Object
			 */
			_obj: {
				value: {}
			}
		})
	}


	/**
	 * ### Метаданые строки табличной части
	 * @property _metadata
	 * @for TabularSectionRow
	 * @type Number
	 */
	_metadata(field_name) {
		const {_owner} = this
		return field_name ? _owner._owner._metadata(_owner._name).fields[field_name] : _owner._owner._metadata(_owner._name)
	}

	/**
	 * ### Номер строки табличной части
	 * @property row
	 * @for TabularSectionRow
	 * @type Number
	 * @final
	 */
	get row() {
		return this._obj.row || 0
	}

	/**
	 * ### Копирует строку табличной части
	 * @method _clone
	 * @for TabularSectionRow
	 * @type Number
	 */
	_clone() {
		const {_owner, _obj} = this
		return utils._mixin(_owner._owner._manager.obj_constructor(_owner._name, _owner), _obj)
	}

	get _getter() {
		return DataObj.prototype._getter
	}

	_setter(f, v) {

		const {_owner, _obj} = this
		const _meta = this._metadata(f)

		if (_obj[f] == v || (!v && _obj[f] == utils.blank.guid))
			return;

		if (!_owner._owner._data._silent){
			// TODO: observe
			// Object.getNotifier(this._owner._owner).notify({
			// 	type: 'row',
			// 	row: this,
			// 	tabular: this._owner._name,
			// 	name: f,
			// 	oldValue: this._obj[f]
			// });
		}

		// учтём связь по типу
		if (_meta.choice_type) {
			let prop;
			if (_meta.choice_type.path.length == 2)
				prop = this[_meta.choice_type.path[1]];
			else
				prop = _owner._owner[_meta.choice_type.path[0]];
			if (prop && prop.type)
				v = utils.fetch_type(v, prop.type);
		}

		DataObj.prototype.__setter.call(this, f, v);
		_owner._owner._data._modified = true;
	}

}

classes.TabularSection = TabularSection;
classes.TabularSectionRow = TabularSectionRow;
