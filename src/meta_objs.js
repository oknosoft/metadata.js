/**
 * Конструкторы объектов данных
 * @module  metadata
 * @submodule meta_objs
 * @author	Evgeniy Malyarov
 * @requires common
 */


/**
 * Абстрактный объект ссылочных данных - документов и справочников
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 */
function DataObj(attr, manager) {

	var ref, tmp,
		_ts_ = {},
		_obj = {data_version: ""},
		_is_new = !(this instanceof EnumObj);

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager))
		tmp = manager.get(attr, false, true);

	if(tmp)
		return tmp;

	if(manager instanceof EnumManager)
		_obj.ref = ref = attr.name;

	else if(!(manager instanceof RegisterManager)){
		_obj.ref = ref = $p.fix_guid(attr);
		_obj.deleted = false;
		_obj.lc_changed = 0;

	}else
		ref = manager.get_ref(attr);

	/**
	 * Указатель на менеджер данного объекта
	 * @property _manager
	 * @type DataManager
	 */
	this._define('_manager', {
		value : manager,
		enumerable : false
	});

	/**
	 * Возвращает "истина" для нового (еще не записанного или непрочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	this._define("is_new", {
		value: function(){
			return _is_new;
		},
		enumerable: false
	});

	this._define("_set_loaded", {
		value: function(ref){
			_is_new = false;
			manager.push(this, ref);
		},
		enumerable: false
	});


	/**
	 * Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this._define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

	this._define("_ts_", {
		value: function( name ) {
			if( !_ts_[name] ) {
				_ts_[name] = new TabularSection(name, this);
			}
			return _ts_[name];
		},
		enumerable: false
	});


	if(manager.alatable && manager.push){
		manager.alatable.push(_obj);
		manager.push(this, ref);
	}

}

DataObj.prototype.valueOf = function () {
	return this.ref;
};

/**
 * Обработчик при сериализации объекта
 * @return {*}
 */
DataObj.prototype.toJSON = function () {
	return this._obj;
};

DataObj.prototype._getter = function (f) {

	var mf = this._metadata.fields[f].type,
		mgr, ref;

	if(f == "type" && typeof this._obj[f] == "object")
		return this._obj[f];

	else if(f == "ref"){
		return this._obj[f];

	}else if(mf.is_ref){
		if(mgr = _md.value_mgr(this._obj, f, mf)){
			if(mgr instanceof DataManager)
				return mgr.get(this._obj[f], false);
			else
				return $p.fetch_type(this._obj[f], mgr);
		}else if(this._obj[f]){
			console.log([f, mf, this._obj]);
			return null;
		}

	}else if(mf.date_part)
		return $p.fix_date(this._obj[f], true);

	else if(mf.digits)
		return $p.fix_number(this._obj[f], true);

	else if(mf.types[0]=="boolean")
		return $p.fix_boolean(this._obj[f]);

	else
		return this._obj[f] || "";
};

DataObj.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;

	Object.getNotifier(this).notify({
		type: 'update',
		name: f,
		oldValue: this._obj[f]
	});

	var mf = this._metadata.fields[f].type,
		mgr;

	if(f == "type" && v.types)
		this._obj[f] = v;

	else if(f == "ref")

		this._obj[f] = $p.fix_guid(v);

	else if(mf.is_ref){

		this._obj[f] = $p.fix_guid(v);

		mgr = _md.value_mgr(this._obj, f, mf, false, v);

		if(mgr){
			if(mgr instanceof EnumManager){
				if(typeof v == "string")
					this._obj[f] = v;

				else if(!v)
					this._obj[f] = "";

				else if(typeof v == "object")
					this._obj[f] = v.ref || v.name || "";

			}else if(v && v.presentation){
				if(v.type && !(v instanceof DataObj))
					delete v.type;
				mgr.create(v);
			}else if(!(mgr instanceof DataManager))
				this._obj[f] = $p.fetch_type(v, mgr);
		}else{
			if(typeof v != "object")
				this._obj[f] = v;
		}

	}else if(mf.date_part)
		this._obj[f] = $p.fix_date(v, true);

	else if(mf.digits)
		this._obj[f] = $p.fix_number(v, true);

	else if(mf.types[0]=="boolean")
		this._obj[f] = $p.fix_boolean(v);

	else
		this._obj[f] = v;
};

DataObj.prototype._getter_ts = function (f) {
	return this._ts_(f);
};

DataObj.prototype._setter_ts = function (f, v) {
	var ts = this._ts_(f);
	if(ts instanceof TabularSection && Array.isArray(v))
		ts.load(v);
};


/**
 * Читает объект из внешней датабазы асинхронно.
 * @method load
 * @for DataObj
 * @return {Promise.<T>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.load = function(){

	var tObj = this;

	function callback_1c(res){		// инициализация из датабазы 1C

		if(typeof res == "string")
			res = JSON.parse(res);
		if($p.msg.check_soap_result(res))
			return;

		var ref = $p.fix_guid(res);
		if(tObj.is_new() && !$p.is_empty_guid(ref))
			tObj._set_loaded(ref);

		return tObj._mixin(res);      // заполнить реквизиты шапки и табличных частей
	}

	if(tObj._manager._cachable && !tObj.is_new())
		return Promise.resolve(tObj);

	if(tObj.ref == $p.blank.guid){
		if(tObj instanceof CatObj)
			tObj.id = "000000000";
		else
			tObj.number_doc = "000000000";
		return Promise.resolve(tObj);

	}else if(!tObj._manager._cachable && $p.job_prm.rest)
		return tObj.load_rest();

	else
		return _load({
			class_name: tObj._manager.class_name,
			action: "load",
			ref: tObj.ref
		})
			.then(callback_1c);



};

/**
 * Сохраняет объект в локальной датабазе, выполняет подписки на события
 * В зависимости от настроек, инициирует запись объекта во внешнюю базу данных
 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param [mode] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.save = function (post, operational) {

	// Если процедуры перед записью завершились неудачно - не продолжаем
	if(this._manager.handle_event(this, "before_save") === false)
		return Promise.resolve(this);

	if(this instanceof DocObj && $p.blank.date == this.date)
		this.date = new Date();

	// Сохраняем во внешней базе
	return this.save_rest({
		post: post,
		operational: operational
	})

		// и выполняем обработку после записи
		.then(function (obj) {
			return obj._manager.handle_event(obj, "after_save");
		});
};

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @return {boolean} - true, если ссылка пустая
 */
DataObj.prototype.empty = function(){
	return $p.is_empty_guid(this._obj.ref);
};


/**
 * Метаданные текущего объекта
 * @property _metadata
 * @for DataObj
 * @type Object
 */
DataObj.prototype._define('_metadata', {
	get : function(){ return this._manager.metadata()},
	enumerable : false
});

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
DataObj.prototype._define('ref', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = $p.fix_guid(v)},
	enumerable : true,
	configurable: true
});

/**
 * Пометка удаления
 * @property deleted
 * @for DataObj
 * @type Boolean
 */
DataObj.prototype._define('deleted', {
	get : function(){ return this._obj.deleted},
	set : function(v){ this._obj.deleted = !!v},
	enumerable : true,
	configurable: true
});

/**
 * Версия данных для контроля изменения объекта другим пользователем
 * @property data_version
 * @for DataObj
 * @type String
 */
DataObj.prototype._define('data_version', {
	get : function(){ return this._obj.data_version || ""},
	set : function(v){ this._obj.data_version = String(v)},
	enumerable : true
});

/**
 * Время последнего изменения объекта в миллисекундах от начала времён для целей синхронизации
 * @property lc_changed
 * @for DataObj
 * @type Number
 */
DataObj.prototype._define('lc_changed', {
	get : function(){ return this._obj.lc_changed || 0},
	set : function(v){ this._obj.lc_changed = $p.fix_number(v, true)},
	enumerable : true,
	configurable: true
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = DataObj.prototype._setter;



/**
 * Абстрактный элемент справочника
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function CatObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	CatObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for CatObj
	 * @type String
	 */
	this._define('presentation', {
		get : function(){

			if(this.name || this.id)
				return this.name || this.id || this._metadata["obj_presentation"];
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.is_empty_guid(this.ref) && (attr.id || attr.name))
		this._set_loaded(this.ref);
}
CatObj._extend(DataObj);

/**
 * Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype._define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){ this._obj.id = v},
	enumerable : true
});

/**
 * Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype._define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){ this._obj.name = String(v)},
	enumerable : true
});


/**
 * Абстрактный ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function DocObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	DocObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for DocObj
	 * @type String
	 */
	this._define('presentation', {
		get : function(){

			if(this.number_str || this.number_doc)
				return this._metadata["obj_presentation"] + ' №' + (this.number_str || this.number_doc) + " от " + $p.dateFormat(this.date, $p.dateFormat.masks.ru);
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);
}
DocObj._extend(DataObj);

/**
 * Номер документа
 * @property number_doc
 * @type {String|Number}
 */
DocObj.prototype._define('number_doc', {
	get : function(){ return this._obj.number_doc || ""},
	set : function(v){ this._obj.number_doc = v},
	enumerable : true
});

/**
 * Дата документа
 * @property date
 * @type {Date}
 */
DocObj.prototype._define('date', {
	get : function(){ return this._obj.date || $p.blank.date},
	set : function(v){ this._obj.date = $p.fix_date(v, true)},
	enumerable : true
});

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
DocObj.prototype._define('posted', {
	get : function(){ return this._obj.posted || false},
	set : function(v){ this._obj.posted = $p.fix_boolean(v)},
	enumerable : true
});



/**
 * Абстрактный ОбработкаОбъект
 * @class DataProcessorObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function DataProcessorObj(attr, manager) {

	// выполняем конструктор родительского объекта
	DataProcessorObj.superclass.constructor.call(this, attr, manager);

	var f, cmd = manager.metadata();
	for(f in cmd.fields)
		attr[f] = $p.fetch_type("", cmd.fields[f].type);
	for(f in cmd["tabular_sections"])
		attr[f] = [];

	this._mixin(attr);

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 */
	this.unload = function(){
		for(f in this){
			if(this[f] instanceof TabularSection){
				this[f].clear();
				delete this[f];
			}else if(typeof this[f] != "function"){
				delete this[f];
			}
		}
	};
}
DataProcessorObj._extend(DataObj);

/**
 * Абстрактный элемент перечисления
 * @class EnumObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {EnumManager}
 */
function EnumObj(attr, manager) {

	// выполняем конструктор родительского объекта
	EnumObj.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);

}
EnumObj._extend(DataObj);


/**
 * Порядок элемента перечисления
 * @property order
 * @for EnumObj
 * @type Number
 */
EnumObj.prototype._define('order', {
	get : function(){ return this._obj.sequence},
	set : function(v){ this._obj.sequence = parseInt(v)},
	enumerable : true
});

/**
 * Наименование элемента перечисления
 * @property name
 * @for EnumObj
 * @type String
 */
EnumObj.prototype._define('name', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = String(v)},
	enumerable : true
});

/**
 * Синоним элемента перечисления
 * @property synonym
 * @for EnumObj
 * @type String
 */
EnumObj.prototype._define('synonym', {
	get : function(){ return this._obj.synonym || ""},
	set : function(v){ this._obj.synonym = String(v)},
	enumerable : true
});

/**
 * Представление объекта
 * @property presentation
 * @for EnumObj
 * @type String
 */
EnumObj.prototype._define('presentation', {
	get : function(){
		return this.synonym || this.name;
	},
	enumerable : false
});

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @for EnumObj
 * @return {boolean} - true, если ссылка пустая
 */
EnumObj.prototype.empty = function(){
	return this.ref == "_";
};


/**
 * Запись регистра (накопления и сведений)
 * @class RegisterRow
 * @extends DataObj
 * @constructor
 * @param attr {object} - объект, по которому запись будет заполнена
 * @param manager {InfoRegManager|AccumRegManager}
 */
function RegisterRow(attr, manager){

	// выполняем конструктор родительского объекта
	RegisterRow.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);
}
RegisterRow._extend(DataObj);

/**
 * Метаданные текущего объекта
 * @property _metadata
 * @for DataObj
 * @type Object
 */
RegisterRow.prototype._define('_metadata', {
	get : function(){
		var cm = this._manager.metadata();
		if(!cm.fields)
			cm.fields = ({})._mixin(cm.dimensions)._mixin(cm.resources);
		return cm;
	},
	enumerable : false
});

RegisterRow.prototype._define('ref', {
	get : function(){ return this._manager.get_ref(this)},
	enumerable : true
});

