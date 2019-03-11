/**
 * Конструкторы табличных частей
 *
 * @module  metadata
 * @submodule meta_tabulars
 */

import utils from './utils';

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
export class TabularSection {

	constructor(name, owner) {

		// Если табчасти нет в данных владельца - создаём
		if (!owner._obj[name]){
			owner._obj[name] = []
		}

    /**
     * Имя табличной части
     * @property _name
     * @type String
     */
		this._name = name;

    /**
     * Объект-владелец табличной части
     * @property _owner
     * @type DataObj
     */
    this._owner = owner;

	}

  toString() {
	  const {_owner: {_manager}, _name} = this;
    const {msg} = _manager._owner.$p;
    return msg.tabular + ' ' + _manager.class_name + '.' + _name;
  }

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
  get _obj() {
    const {_owner, _name} = this;
    return _owner._obj[_name];
  }

	/**
	 * ### Возвращает строку табчасти по индексу
	 * @method get
	 * @param index {Number} - индекс строки табчасти
	 * @return {TabularSectionRow}
	 */
  get(index) {
    const row = this._obj[index];
    return row ? row._row : null;
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
    return this._obj.length;
  }

	/**
	 * ### Очищает табличную часть
	 * @method clear
	 * @return {TabularSection}
	 *
	 * @example
	 *     // Очищает табличнут часть
	 *     ts.clear();
	 *
	 */
	clear(selection) {
		const {_obj, _owner, _name} = this;
    if(!selection){
      _obj.length = 0;
      // obj, ts_name
      !_owner._data._loading && _owner._manager.emit_async('rows', _owner, {[_name]: true});
    }
    else{
      this.find_rows(selection).forEach((row) => this.del(row.row-1))
    }
		return this;
	}

	/**
	 * ### Удаляет строку табличной части
	 * @method del
	 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
	 */
	del(val) {

		const {_obj, _owner, _name} = this;
    const {_data, _manager} = _owner;

		let index;

    if(typeof val == 'undefined') {
      return;
    }
    else if(typeof val == 'number') {
      index = val;
    }
		else if (val.row && _obj[val.row - 1] && _obj[val.row - 1]._row === val){
      index = val.row - 1;
    }
		else {
		  for(let i = 0; i < _obj.length; i++){
        if (_obj[i]._row === val) {
          index = i;
          break;
        }
      }
		}
		if (index == undefined || !_obj[index]){
      return;
    }

		// триггер
    if(!_data._loading && _owner.del_row(_obj[index]._row) === false){
      return;
    }

		_obj.splice(index, 1);

		_obj.forEach((row, index) => row.row = index + 1);

    // триггер
    !_data._loading && _owner.after_del_row(_name);

    // obj, {ts_name: null}
    !_data._loading && _manager.emit_async('rows', _owner, {[_name]: true});
		_data._modified = true;
	}

	/**
	 * ### Находит первую строку, содержащую значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @param columns {String|Array} - колонки, в которых искать
	 * @return {TabularSectionRow}
	 */
	find(val, columns) {
		const res = utils._find(this._obj, val, columns);
		return res && res._row;
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
	 * @param rowid1 {number|TabularSectionRow}
	 * @param rowid2 {number|TabularSectionRow}
	 */
	swap(rowid1, rowid2) {
    const {_obj, _owner, _name} = this;
    if(typeof rowid1 !== 'number') {
      rowid1 = rowid1.row - 1;
    }
    if(typeof rowid2 !== 'number') {
      rowid2 = rowid2.row - 1;
    }
		[_obj[rowid1], _obj[rowid2]] = [_obj[rowid2], _obj[rowid1]];
		_obj[rowid1].row = rowid1 + 1;
		_obj[rowid2].row = rowid2 + 1;

    // obj, {ts_name: null}
    const {_data, _manager} = _owner;
    !_data._loading && _manager.emit_async('rows', _owner, {[_name]: true});
    _data._modified = true;
	}

	/**
	 * ### Добавляет строку табчасти
	 * @method add
	 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
	 * @param silent {Boolean} - тихий режим, без генерации событий изменения объекта
   * @param Constructor {function} - альтернативный конструктор строки
	 * @return {TabularSectionRow}
	 *
	 * @example
	 *     // Добавляет строку в табчасть и заполняет её значениями, переданными в аргументе
	 *     const row = ts.add({field1: value1});
	 */
	add(attr = {}, silent, Constructor) {

		const {_owner, _name, _obj} = this;
    const {_manager, _data} = _owner;
		const row = Constructor ? new Constructor(this) : _manager.obj_constructor(_name, this);

    // триггер
		if(!_data._loading && _owner.add_row && _owner.add_row(row, attr) === false){
		  return;
    }

		// присваиваем типизированные значения по умолчанию
		for (const f in row._metadata().fields){
		  if(!row._obj[f]) {
        row[f] = attr[f] || "";
      }
		}

    row._obj.row = _obj.push(row._obj);
    Object.defineProperty(row._obj, '_row', {
      value: row,
      enumerable: false
    });

    // obj, {ts_name: null}
    !_data._loading && !silent && _manager.emit_async('rows', _owner, {[_name]: true});
		_data._modified = true;

		return row;
	}

	/**
	 * ### Выполняет цикл "для каждого"
	 * @method each
	 * @param fn {Function} - callback, в который передается строка табчасти
	 */
	each(fn) {
	  for(const row of this._obj){
	    if(fn.call(this, row._row) === false) break;
    }
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
      const res = this.aggregate(dimensions, resources, 'SUM', true);
			return this.load(res);
		}
		catch (err) {
			this._owner._manager._owner.$p.record_log(err);
		}
	}

	/**
	 * ### Сортирует табличную часть
	 *
	 * @method sort
	 * @param fields {Array|String}
	 */
	sort(fields) {

    if(typeof fields == 'string') {
      fields = fields.split(',');
    }

    let sql = 'select * from ? order by ';
		let	res = true;
		let	has_dot;

		for(let f of fields){
      has_dot = has_dot || f.indexOf('.') !== -1;
      f = f.trim().replace(/\s{1,}/g, ' ').split(' ');
      if (res){
        res = false;
      }
      else{
        sql += ', ';
      }

      sql += '`' + f[0] + '`';
      if(f[1]) {
        sql += ' ' + f[1];
      }
    }

    const {$p} = this._owner._manager._owner;
		try {
			res = $p.wsql.alasql(sql, [has_dot ? this._obj.map((row) => row._row) : this._obj]);
			return this.load(res);
		}
		catch (err) {
			$p.record_log(err);
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

		if (typeof dimensions == "string") {
      dimensions = dimensions.length ? dimensions.split(",") : []
    }
    if (typeof resources == "string") {
      resources = resources.length ? resources.split(",") : [];
    }

		// для простых агрегатных функций, sql не используем
		if (!dimensions.length && resources.length == 1 && aggr == "sum") {
			return this._obj.reduce(function (sum, row, index, array) {
				return sum + row[resources[0]];
			}, 0);
		}

		let sql, res = true;

		resources.forEach((f) => {
			if (!sql){
        sql = "select ";
      }
      else{
        sql += ", ";
      }
      sql += aggr + "(`" + f + "`) `" + f + "`";
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

		const {$p} = this._owner._manager._owner;
		try {
			res = $p.wsql.alasql(sql, [this._obj]);
			if (!ret_array) {
				if (resources.length == 1)
					res = res.length ? res[0][resources[0]] : 0;
				else
					res = res.length ? res[0] : {};
			}
			return res;

		} catch (err) {
			$p.record_log(err);
		}
	};

	/**
	 * ### Загружает табличнут часть из массива объектов
	 *
	 * @method load
	 * @param aattr {Array} - массив объектов к загрузке
	 */
	load(aattr) {

    const {_owner, _name, _obj} = this;
    const {_manager, _data} = _owner;
    const {_loading} = _data;

    if(!_loading){
      _data._loading = true;
    }

    this.clear();

		for(let row of aattr instanceof TabularSection ? aattr._obj : (Array.isArray(aattr) ? aattr : [])){
      this.add(row);
    }

    // obj, {ts_name: null}
    _data._loading = _loading;
    !_loading && _manager.emit_async('rows', _owner, {[_name]: true});

		return this;
	}

	/**
	 * ### Выгружает колонку табчасти в массив
	 *
	 * @method unload_column
	 * @param column {String} - имя колонки
	 * @return {Array}
	 */
	unload_column(column) {

		const res = [];

		this.each((row) => {
			res.push(row[column])
		})

		return res;
	}

	/**
	 * Обработчик сериализации
	 * @return {Object}
	 */
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
export class TabularSectionRow {

	constructor(owner, attr) {

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
				value: attr ? attr : {}
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

	get _manager() {
		return this._owner._owner._manager;
	}

	get _data() {
    return this._owner._owner._data;
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

	_setter(f, v) {

		const {_owner, _obj} = this;
		const _meta = this._metadata(f);

		if (_obj[f] == v || (!v && _obj[f] == utils.blank.guid)){
      return;
    }

    // obj, {f: oldValue}
    const {_manager, _data} = _owner._owner;

		// признак того, что тип уже приведён
		let fetched_type;

		// учтём связь по типу
		if (_meta.choice_type) {
			const prop = _meta.choice_type.path.length == 2 ? this[_meta.choice_type.path[1]] : _owner._owner[_meta.choice_type.path[0]];
			if (prop && prop.type){
        fetched_type = prop.type;
        v = utils.fetch_type(v, fetched_type);
      }
		}

		// установим модифицированность и оповестим мир
		if(!_data._loading){
      _manager.emit_async('update', this, {[f]: _obj[f]});
      _data._modified = true;
    }

		this.__setter(f, v, fetched_type);

	}

  /**
   * ### При изменении реквизита шапки или табличной части
   *
   * @event VALUE_CHANGE
   */
  value_change(f, mf, v) {
    return this;
  }

};


