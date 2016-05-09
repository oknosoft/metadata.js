/**
 * Конструкторы объектов данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_objs
 * @requires common
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 */
function DataObj(attr, manager) {

	var tmp,
		_ts_ = {},
		_obj = {},
		_data = {
			_is_new: !(this instanceof EnumObj)
		};

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager))
		tmp = manager.get(attr, false, true);

	if(tmp){
		attr = null;
		return tmp;
	}


	if(manager instanceof EnumManager)
		_obj.ref = attr.name;

	else if(!(manager instanceof RegisterManager)){
		_obj.ref = $p.fix_guid(attr);

	}else
		_obj.ref = manager.get_ref(attr);


	this.__define({

		/**
		 * ### Фактическое хранилище данных объекта
		 * Оно же, запись в таблице объекта локальной базы данных
		 * @property _obj
		 * @type Object
		 * @final
		 */
		_obj: {
			value: _obj,
			writable: false,
			enumerable: false,
			configurable: true
		},

		/**
		 * Хранилище ссылок на табличные части - не сохраняется в базе данных
		 * @property _ts_
		 */
		_ts_: {
			value: function( name ) {
				if( !_ts_[name] ) {
					_ts_[name] = new TabularSection(name, this);
				}
				return _ts_[name];
			},
			enumerable: false,
			configurable: true
		},

		/**
		 * Указатель на менеджер данного объекта
		 * @property _manager
		 * @type DataManager
		 * @final
		 */
		_manager: {
			value : manager,
			writable: false,
			enumerable : false
		},

		/**
		 * Пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
		 * @property _data
		 * @type DataManager
		 * @final
		 */
		_data: {
			value : _data,
			writable: false,
			enumerable : false,
			configurable: true
		}

	});


	if(manager.alatable && manager.push){
		manager.alatable.push(_obj);
		manager.push(this, _obj.ref);
	}

	attr = null;

}


DataObj.prototype._getter = function (f) {

	var mf = this._metadata.fields[f].type,
		res = this._obj ? this._obj[f] : "",
		mgr, ref;

	if(f == "type" && typeof res == "object")
		return res;

	else if(f == "ref"){
		return res;

	}else if(mf.is_ref){
		if(mf.digits && typeof res === "number")
			return res;

		if(mf.hasOwnProperty("str_len") && !$p.is_guid(res))
			return res;

		if(mgr = _md.value_mgr(this._obj, f, mf)){
			if(mgr instanceof DataManager)
				return mgr.get(res, false);
			else
				return $p.fetch_type(res, mgr);
		}

		if(res){
			console.log([f, mf, this._obj]);
			return null;
		}

	}else if(mf.date_part)
		return $p.fix_date(this._obj[f], true);

	else if(mf.digits)
		return $p.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));

	else if(mf.types[0]=="boolean")
		return $p.fix_boolean(this._obj[f]);

	else
		return this._obj[f] || "";
};

DataObj.prototype.__setter = function (f, v) {

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
		this._obj[f] = $p.fix_number(v, !mf.hasOwnProperty("str_len"));

	else if(mf.types[0]=="boolean")
		this._obj[f] = $p.fix_boolean(v);

	else
		this._obj[f] = v;
	
};

DataObj.prototype.__notify = function (f) {
	if(!this._data._silent)
		Object.getNotifier(this).notify({
			type: 'update',
			name: f,
			oldValue: this._obj[f]
		});
};

DataObj.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;
	
	this.__notify(f);
	this.__setter(f, v);
	this._data._modified = true;

};

DataObj.prototype._getter_ts = function (f) {
	return this._ts_(f);
};

DataObj.prototype._setter_ts = function (f, v) {
	var ts = this._ts_(f);
	if(ts instanceof TabularSection && Array.isArray(v))
		ts.load(v);
};

DataObj.prototype.__define({

	/**
	 * ### valueOf
	 * для операций сравнения возвращаем guid
	 */
	valueOf: {
		value: function () {
			return this.ref;
		},
		enumerable : false
	},

	/**
	 * ### toJSON
	 * для сериализации возвращаем внутренний _obj
	 */
	toJSON: {
		value: function () {
			return this._obj;
		},
		enumerable : false
	},

	/**
	 * ### toString
	 * для строкового представления используем
	 */
	toString: {
		value: function () {
			return this.presentation;
		},
		enumerable : false
	},

	/**
	 * Метаданные текущего объекта
	 * @property _metadata
	 * @for DataObj
	 * @type Object
	 * @final
	 */
	_metadata: {
		get : function(){ return this._manager.metadata()},
		enumerable : false
	},

	/**
	 * Пометка удаления
	 * @property _deleted
	 * @for DataObj
	 * @type Boolean
	 */
	_deleted: {
		get : function(){ return !!this._obj._deleted},
		enumerable : false
	},

	/**
	 * Признак модифицированности
	 */
	_modified: {
		get : function(){
			if(!this._data)
				return false;
			return !!(this._data._modified)
		},
		enumerable : false
	},

	/**
	 * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	is_new: {
		value: function(){
			return this._data._is_new;
		},
		enumerable: false
	},

	/**
	 * Метод для ручной установки признака _прочитан_ (не новый)
	 */
	_set_loaded: {
		value: function(ref){
			this._manager.push(this, ref);
			this._data._modified = false;
			this._data._is_new = false;
		},
		enumerable: false
	},

	/**
	 * Установить пометку удаления
	 * @method mark_deleted
	 * @for DataObj
	 * @param deleted {Boolean}
	 */
	mark_deleted: {
		value: function(deleted){
			this._obj._deleted = !!deleted;
			this.save();
			this.__notify('_deleted');
		},
		enumerable : false
	},

	/**
	 * guid ссылки объекта
	 * @property ref
	 * @for DataObj
	 * @type String
	 */
	ref: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = $p.fix_guid(v)},
		enumerable : true,
		configurable: true
	},

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return $p.is_empty_guid(this._obj.ref);
		},
		enumerable : false
	},

	/**
	 * Читает объект из внешней или внутренней датабазы асинхронно.
	 * В отличии от _mgr.get() перезаполняет объект сохранёнными данными
	 * @method load
	 * @for DataObj
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	load: {
		value: function(){

			var reset_modified = function () {
					reset_modified = null;
					this._data._modified = false;
					return this;
				}.bind(this);

			if(this.ref == $p.blank.guid){
				if(this instanceof CatObj)
					this.id = "000000000";
				else
					this.number_doc = "000000000";

				return Promise.resolve(this);

			}else{
				if(this._manager.cachable && this._manager.cachable != "e1cib"){
					return $p.wsql.pouch.load_obj(this).then(reset_modified);

				} else
					return _rest.load_obj(this).then(reset_modified);
			}


		},
		enumerable : false
	},

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 * @for DataObj
	 */
	unload: {
		value: function(){
			var f, obj = this._obj;

			this._manager.unload_obj(this.ref);

			if(this._observers)
				this._observers.length = 0;

			if(this._notis)
				this._notis.length = 0;

			for(f in this._metadata.tabular_sections)
				this[f].clear(true);

			for(f in this){
				if(this.hasOwnProperty(f))
					delete this[f];
			}
			for(f in obj)
				delete obj[f];
			["_ts_","_obj","_data"].forEach(function (f) {
				delete this[f];
			}.bind(this));
			f = obj = null;
		},
		enumerable : false
	},

	/**
	 * ### Записывает объект
	 * Ввыполняет подписки на события перед записью и после записи
	 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
	 * @method save
	 * @for DataObj
	 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param [mode] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
	 * @param [attachments] {Array} - массив вложений
	 * @return {Promise.<T>} - промис с результатом выполнения операции
	 * @async
	 */
	save: {
		value: function (post, operational, attachments) {

			if(this instanceof DocObj && typeof post == "boolean"){
				this.posted = post;
			}

			var saver,
				before_save_res = this._manager.handle_event(this, "before_save"),
				reset_modified = function () {
					saver = null;
					before_save_res = null;
					reset_modified = null;
					this._data._modified = false;
					return this;
				}.bind(this);

			// Если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
			if(before_save_res === false)
				return Promise.resolve(this).then(reset_modified);

			else if(typeof before_save_res === "object" && before_save_res.then)
				return before_save_res.then(reset_modified);

			if(this instanceof DocObj && $p.blank.date == this.date)
				this.date = new Date();

			if(this._manager.cachable && this._manager.cachable != "e1cib"){
				saver = $p.wsql.pouch.save_obj;

			} else {
				// запрос к серверу 1C по сети
				saver = _rest.save_irest;

			}

			// Сохраняем во внешней базе
			return saver(
				this, {
					post: post,
					operational: operational,
					attachments: attachments
				})
			// и выполняем обработку после записи
				.then(function (obj) {
					return obj._manager.handle_event(obj, "after_save");
				})
				.then(reset_modified);
		},
		enumerable : false
	},

	/**
	 * Возвращает присоединенный объект или файл
	 * @method get_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 */
	get_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		},
		enumerable: false
	},

	/**
	 * Сохраняет объект или файл во вложении
	 * @method save_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @param attachment {Blob|String} - вложениe
	 * @param [type] {String} - mime тип
	 */
	save_attachment: {
		value: function (att_id, attachment, type) {
			return this._manager.save_attachment(this.ref, att_id, attachment, type);
		},
		enumerable: false
	},

	/**
	 * Удаляет присоединенный объект или файл
	 * @method delete_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 */
	delete_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		},
		enumerable: false
	},

	/**
	 * ###Включает тихий режим
	 * Режим, при котором объект не информирует мир об изменениях своих свойств
	 * @method _silent
	 * @for DataObj
	 * @param [v] {Boolean}
	 */
	_silent: {
		value: function (v) {
			if(typeof v == "boolean")
				this._data._silent = v;
			else{
				this._data._silent = true;
				setTimeout(function () {
					this._data._silent = false;	
				}.bind(this));
			}			
		},
		enumerable: false
	},

	/**
	 * Выполняет команду печати
	 */
	print: {
		value: function (model, wnd) {
			return this._manager.print(this, model, wnd);
		},
		enumerable: false
	}
	
});


/**
 * ### Абстрактный класс СправочникОбъект
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
	this.__define('presentation', {
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

	if(attr && typeof attr == "object"){
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}else{
			this._mixin(attr);
			if(!$p.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
	}

	attr = null;

}
CatObj._extend(DataObj);

/**
 * Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype.__define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){
		this.__notify('id');
		this._obj.id = v;
	},
	enumerable : true
});

/**
 * Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype.__define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){
		this.__notify('name');
		this._obj.name = String(v);
	},
	enumerable : true
});


/**
 * ### Абстрактный класс ДокументОбъект
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
	this.__define('presentation', {
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

	attr = null;
}
DocObj._extend(DataObj);

function doc_props_date_number(proto){
	proto.__define({

		/**
		 * Номер документа
		 * @property number_doc
		 * @type {String|Number}
		 */
		number_doc: {
			get : function(){ return this._obj.number_doc || ""},
			set : function(v){
				this.__notify('number_doc');
				this._obj.number_doc = v;
			},
			enumerable : true
		},

		/**
		 * Дата документа
		 * @property date
		 * @type {Date}
		 */
		date: {
			get : function(){ return this._obj.date || $p.blank.date},
			set : function(v){
				this.__notify('date');
				this._obj.date = $p.fix_date(v, true);
			},
			enumerable : true
		}
	});
}

DocObj.prototype.__define({

	/**
	 * Признак проведения
	 * @property posted
	 * @type {Boolean}
	 */
	posted: {
		get : function(){ return this._obj.posted || false},
		set : function(v){
			this.__notify('posted');
			this._obj.posted = $p.fix_boolean(v);
		},
		enumerable : true
	}

});
doc_props_date_number(DocObj.prototype);


/**
 * ### Абстрактный класс ОбработкаОбъект
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

}
DataProcessorObj._extend(DataObj);


/**
 * ### Абстрактный класс ЗадачаОбъект
 * @class TaskObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function TaskObj(attr, manager) {

	// выполняем конструктор родительского объекта
	TaskObj.superclass.constructor.call(this, attr, manager);


}
TaskObj._extend(CatObj);
doc_props_date_number(TaskObj.prototype);


/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function BusinessProcessObj(attr, manager) {

	// выполняем конструктор родительского объекта
	BusinessProcessObj.superclass.constructor.call(this, attr, manager);


}
BusinessProcessObj._extend(CatObj);
doc_props_date_number(BusinessProcessObj.prototype);


/**
 * ### Абстрактный класс значения перечисления
 * Имеет fake-ссылку и прочие атрибуты объекта данных, но фактически - это просто значение перечисления
 *
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

EnumObj.prototype.__define({

	/**
	 * Порядок элемента перечисления
	 * @property order
	 * @for EnumObj
	 * @type Number
	 */
	order: {
		get : function(){ return this._obj.sequence},
		set : function(v){ this._obj.sequence = parseInt(v)},
		enumerable : true
	},

	/**
	 * Наименование элемента перечисления
	 * @property name
	 * @for EnumObj
	 * @type String
	 */
	name: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = String(v)},
		enumerable : true
	},

	/**
	 * Синоним элемента перечисления
	 * @property synonym
	 * @for EnumObj
	 * @type String
	 */
	synonym: {
		get : function(){ return this._obj.synonym || ""},
		set : function(v){ this._obj.synonym = String(v)},
		enumerable : true
	},

	/**
	 * Представление объекта
	 * @property presentation
	 * @for EnumObj
	 * @type String
	 */
	presentation: {
		get : function(){
			return this.synonym || this.name;
		},
		enumerable : false
	},

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @for EnumObj
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return this.ref == "_";
		}
	}
});


/**
 * ### Запись (строка) регистра
 * Используется во всех типах регистров (сведений, накопления, бухгалтерии)
 *
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

	for(var check in manager.metadata().dimensions){
		if(!attr.hasOwnProperty(check) && attr.ref){
			var keys = attr.ref.split("¶");
			Object.keys(manager.metadata().dimensions).forEach(function (fld, ind) {
				this[fld] = keys[ind];
			}.bind(this));
			break;
		}
	}

}
RegisterRow._extend(DataObj);

RegisterRow.prototype.__define({

	/**
	 * Метаданные строки регистра
	 * @property _metadata
	 * @for RegisterRow
	 * @type Object
	 */
	_metadata: {
		get: function () {
			var cm = this._manager.metadata();
			if (!cm.fields)
				cm.fields = ({})._mixin(cm.dimensions)._mixin(cm.resources)._mixin(cm.attributes);
			return cm;
		},
		enumerable: false
	},

	/**
	 * Ключ записи регистра
	 */
	ref: {
		get : function(){ return this._manager.get_ref(this)},
		enumerable : true
	}
});

