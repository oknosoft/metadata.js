/**
 * Конструкторы объектов данных
 *
 * @module  metadata
 * @submodule meta_objs
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumObj"}}{{/crossLink}} - ПеречислениеОбъект
 * - {{#crossLink "CatObj"}}{{/crossLink}} - СправочникОбъект
 * - {{#crossLink "DocObj"}}{{/crossLink}} - ДокументОбъект
 * - {{#crossLink "DataProcessorObj"}}{{/crossLink}} - ОбработкаОбъект
 * - {{#crossLink "TaskObj"}}{{/crossLink}} - ЗадачаОбъект
 * - {{#crossLink "BusinessProcessObj"}}{{/crossLink}} - БизнеспроцессОбъект
 * - {{#crossLink "RegisterRow"}}{{/crossLink}} - ЗаписьРегистраОбъект
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 * @menuorder 20
 * @tooltip Объект данных
 */
class DataObj {

	constructor(attr, manager) {

		var tmp,
			_ts_ = {},
			_obj = {},
			_data = {
				_is_new: !(this instanceof EnumObj)
			};

		// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
		if(!(manager instanceof classes.DataProcessorsManager) && !(manager instanceof classes.EnumManager)){
			tmp = manager.get(attr, true);
		}

		if(tmp){
			attr = null;
			return tmp;
		}


		if(manager instanceof classes.EnumManager){
			_obj.ref = attr.name;
		}
		else if(!(manager instanceof classes.RegisterManager)){
			_obj.ref = utils.fix_guid(attr);
		}
		else{
			_obj.ref = manager.get_ref(attr);
		}


		Object.defineProperties(this, {

			/**
			 * ### Фактическое хранилище данных объекта
			 * Оно же, запись в таблице объекта локальной базы данных
			 * @property _obj
			 * @type Object
			 * @final
			 */
			_obj: {
				value: _obj,
				configurable: true
			},

			/**
			 * Хранилище ссылок на табличные части - не сохраняется в базе данных
			 * @property _ts_
			 */
			_ts_: {
				value: (name) => _ts_[name] || (_ts_[name] = new TabularSection(name, this)),
				configurable: true
			},

			/**
			 * Указатель на менеджер данного объекта
			 * @property _manager
			 * @type DataManager
			 * @final
			 */
			_manager: {
				value : manager
			},

			/**
			 * Пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
			 * @property _data
			 * @type DataManager
			 * @final
			 */
			_data: {
				value : _data,
				configurable: true
			}

		})

		if(manager.alatable && manager.push){
			manager.alatable.push(_obj);
			manager.push(this, _obj.ref);
		}

		attr = null;
	}

	_getter(f) {

		var mf = this._metadata(f).type,
			res = this._obj ? this._obj[f] : "",
			mgr, ref;

		if(f == "type" && typeof res == "object")
			return res;

		else if(f == "ref"){
			return res;

		}else if(mf.is_ref){
			if(mf.digits && typeof res === "number")
				return res;

			if(mf.hasOwnProperty("str_len") && !utils.is_guid(res))
				return res;

			if(mgr = utils.value_mgr(this._obj, f, mf)){
				if(utils.is_data_mgr(mgr))
					return mgr.get(res);
				else
					return utils.fetch_type(res, mgr);
			}

			if(res){
				console.log([f, mf, this._obj]);
				return null;
			}

		}else if(mf.date_part)
			return utils.fix_date(this._obj[f], true);

		else if(mf.digits)
			return utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));

		else if(mf.types[0]=="boolean")
			return utils.fix_boolean(this._obj[f]);

		else
			return this._obj[f] || "";
	}

	__setter(f, v) {

		const {_obj} = this;
		const mf = this._metadata(f).type;
		let mgr;

		if(f == "type" && v.types){
			_obj[f] = v;
		}
		else if(f == "ref"){
			_obj[f] = utils.fix_guid(v);
		}
		else if(mf.is_ref){

			if(mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !utils.is_guid(v)){
				_obj[f] = v;

			}
			else {
				_obj[f] = utils.fix_guid(v);

				if($p.utils.is_data_obj(v) && mf.types.indexOf(v._manager.class_name) != -1){

				}else{
					mgr = utils.value_mgr(_obj, f, mf, false, v);
					if(mgr){
						if(mgr instanceof classes.EnumManager){
							if(typeof v == "string")
								_obj[f] = v;

							else if(!v)
								_obj[f] = "";

							else if(typeof v == "object")
								_obj[f] = v.ref || v.name || "";

						}else if(v && v.presentation){
							if(v.type && !(v instanceof DataObj))
								delete v.type;
							mgr.create(v);
						}else if(!utils.is_data_mgr(mgr))
							_obj[f] = utils.fetch_type(v, mgr);
					}else{
						if(typeof v != "object")
							_obj[f] = v;
					}
				}
			}
		}
		else if(mf.date_part){
			_obj[f] = utils.fix_date(v, true);
		}
		else if(mf.digits){
			_obj[f] = utils.fix_number(v, !mf.hasOwnProperty("str_len"));
		}
		else if(mf.types[0]=="boolean"){
			_obj[f] = utils.fix_boolean(v);
		}
		else{
			_obj[f] = v;
		}

	}

	__notify(f) {
		if(!this._data._silent){
			// TODO: observe
			// Object.getNotifier(this).notify({
			// 	type: 'update',
			// 	name: f,
			// 	oldValue: this._obj[f]
			// });
		}
	}

	_setter(f, v) {
		if(this._obj[f] != v){
			this.__notify(f);
			this.__setter(f, v);
			this._data._modified = true;
		}
	}

	_getter_ts(f) {
		return this._ts_(f)
	}

	_setter_ts(f, v) {
		const ts = this._ts_(f);
		if(ts instanceof TabularSection && Array.isArray(v)){
			ts.load(v)
		}
	}

	/**
	 * ### valueOf
	 * для операций сравнения возвращаем guid
	 */
	valueOf(){ return this.ref }

	/**
	 * ### toJSON
	 * для сериализации возвращаем внутренний _obj
	 */
	toJSON(){ return this._obj }

	/**
	 * ### toString
	 * для строкового представления используем
	 */
	toString(){ return this.presentation }

	/**
	 * Метаданные текущего объекта
	 * @method _metadata
	 * @for DataObj
	 * @param field_name
	 * @type Object
	 * @final
	 */
	_metadata(field_name){
		return this._manager.metadata(field_name)
	}

	/**
	 * Пометка удаления
	 * @property _deleted
	 * @for DataObj
	 * @type Boolean
	 */
	get _deleted(){ return !!this._obj._deleted }

	/**
	 * Признак модифицированности
	 */
	get _modified(){
		if(!this._data)
			return false;
		return !!(this._data._modified)
	}

	/**
	 * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	is_new(){ return this._data._is_new }

	/**
	 * Метод для ручной установки признака _прочитан_ (не новый)
	 */
	_set_loaded(ref){
		this._manager.push(this, ref);
		this._data._modified = false;
		this._data._is_new = false;
		return this;
	}

	/**
	 * Установить пометку удаления
	 * @method mark_deleted
	 * @for DataObj
	 * @param deleted {Boolean}
	 */
	mark_deleted(deleted){
		this._obj._deleted = !!deleted;
		return this.save();
	}

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty(){ return utils.is_empty_guid(this._obj.ref) }

	/**
	 * Читает объект из внешней или внутренней датабазы асинхронно.
	 * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
	 * @method load
	 * @for DataObj
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	load() {

		if (this.ref == utils.blank.guid) {

			if (this instanceof CatObj)
				this.id = "000000000";
			else
				this.number_doc = "000000000";

			return Promise.resolve(this);

		} else {

			return this._manager.adapter.load_obj(this)
				.then(() => {
					this._data._modified = false;
					setTimeout(() => {this._manager.brodcast_event("obj_loaded", this)})
					return this;
				});
		}

	}

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 * @for DataObj
	 */
	unload() {
		var f, obj = this._obj;

		this._manager.unload_obj(this.ref);

		if (this._observers)
			this._observers.length = 0;

		if (this._notis)
			this._notis.length = 0;

		for (f in this._metadata().tabular_sections)
			this[f].clear(true);

		for (f in this) {
			if (this.hasOwnProperty(f))
				delete this[f];
		}
		for (f in obj)
			delete obj[f];
		["_ts_", "_obj", "_data"].forEach((f) => { delete this[f]; });
		f = obj = null;
	}

	/**
	 * ### Записывает объект
	 * Ввыполняет подписки на события перед записью и после записи<br />
	 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
	 *
	 * @method save
	 * @for DataObj
	 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param [operational] {Boolean} - режим проведения документа (Оперативный, Неоперативный)
	 * @param [attachments] {Array} - массив вложений
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	save(post, operational, attachments) {

		if (this instanceof DocObj && typeof post == "boolean") {
			var initial_posted = this.posted;
			this.posted = post;
		}

		var saver,

			before_save_res = {},

			reset_modified = () => {

				if (before_save_res === false) {
					if (this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted) {
						this.posted = initial_posted;
					}
				} else
					this._data._modified = false;

				saver = null;
				before_save_res = null;
				reset_modified = null;

				return this;
			};

		this._manager.emit("before_save", this, before_save_res);

		// если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
		if (before_save_res === false) {
			return Promise.reject(reset_modified());

		} else if (before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then) {
			// если пользовательский обработчик перед записью вернул промис, его и возвращаем
			return before_save_res.then(reset_modified);
		}

		// для объектов с иерархией установим пустого родителя, если иной не указан
		if (this._metadata().hierarchical && !this._obj.parent)
			this._obj.parent = utils.blank.guid;

		// для документов, контролируем заполненность даты
		if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) {

			if (utils.blank.date == this.date){
				this.date = new Date();
			}

			if (!this.number_doc){
				this.new_number_doc();
			}

		} else {
			if (!this.id){
				this.new_number_doc();
			}
		}


		// если не указаны обязательные реквизиты
		// TODO: show_msg alert-error
		// if (msg && msg.show_msg) {
		// 	for (var mf in this._metadata().fields) {
		// 		if (this._metadata().fields[mf].mandatory && !this._obj[mf]) {
		// 			msg.show_msg({
		// 				title: msg.mandatory_title,
		// 				type: "alert-error",
		// 				text: msg.mandatory_field.replace("%1", this._metadata(mf).synonym)
		// 			});
		// 			before_save_res = false;
		// 			return Promise.reject(reset_modified());
		// 		}
		// 	}
		// }

		// в зависимости от типа кеширования, получаем saver и сохраняем объект во внешней базе
		return this._manager.adapter.save_obj(
			this, {
				post: post,
				operational: operational,
				attachments: attachments
			})
		// и выполняем обработку после записи
			.then(function (obj) {
				obj._manager.emit("after_save", obj);
				return obj;
			})
			.then(reset_modified);
	}


	/**
	 * ### Возвращает присоединенный объект или файл
	 * @method get_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 */
	get_attachment(att_id) {
		return this._manager.adapter.get_attachment(this._manager, this.ref, att_id);
	}

	/**
	 * ### Сохраняет объект или файл во вложении
	 * Вызывает {{#crossLink "DataManager/save_attachment:method"}} одноименный метод менеджера {{/crossLink}} и передаёт ссылку на себя в качестве контекста
	 *
	 * @method save_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @param attachment {Blob|String} - вложениe
	 * @param [type] {String} - mime тип
	 * @return Promise.<DataObj>
	 * @async
	 */
	save_attachment(att_id, attachment, type) {
		return this._manager.save_attachment(this.ref, att_id, attachment, type)
			.then(function (att) {
				if (!this._attachments)
					this._attachments = {};
				if (!this._attachments[att_id] || !att.stub)
					this._attachments[att_id] = att;
				return att;
			}.bind(this));
	}


	/**
	 * ### Удаляет присоединенный объект или файл
	 * Вызывает одноименный метод менеджера и передаёт ссылку на себя в качестве контекста
	 *
	 * @method delete_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @async
	 */
	delete_attachment(att_id) {
		return this._manager.delete_attachment(this.ref, att_id)
			.then(function (att) {
				if (this._attachments)
					delete this._attachments[att_id];
				return att;
			}.bind(this));
	}


	/**
	 * ### Включает тихий режим
	 * Режим, при котором объект не информирует мир об изменениях своих свойств.<br />
	 * Полезно, например, при групповых изменениях, чтобы следящие за объектом формы не тратили время на перерисовку при изменении каждого совйтсва
	 *
	 * @method _silent
	 * @for DataObj
	 * @param [v] {Boolean}
	 */
	_silent(v) {
		if (typeof v == "boolean")
			this._data._silent = v;
		else {
			this._data._silent = true;
			setTimeout(function () {
				this._data._silent = false;
			}.bind(this));
		}
	}

	_mixin_attr(attr){

		if(attr && typeof attr == "object"){
			if(attr._not_set_loaded){
				delete attr._not_set_loaded;
				utils._mixin(this, attr);

			}else{
				utils._mixin(this, attr);

				if(!utils.is_empty_guid(this.ref) && (attr.id || attr.name))
					this._set_loaded(this.ref);
			}
		}
	}


	/**
	 * ### Выполняет команду печати
	 * Вызывает одноименный метод менеджера и передаёт себя в качестве объекта печати
	 *
	 * @method print
	 * @for DataObj
	 * @param model {String} - идентификатор макета печатной формы
	 * @param [wnd] - указатель на форму, из которой произведён вызов команды печати
	 * @return {*|{value}|void}
	 * @async
	 */
	print(model, wnd) {
		return this._manager.print(this, model, wnd);
	}

}

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
Object.defineProperty(DataObj.prototype, "ref", {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = utils.fix_guid(v)},
	enumerable : true,
	configurable: true
})



/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
class CatObj extends DataObj{

	constructor(attr, manager){

		// выполняем конструктор родительского объекта
		super(attr, manager);

		this._mixin_attr(attr);

	}

	/**
	 * Представление объекта
	 * @property presentation
	 * @for CatObj
	 * @type String
	 */
	get presentation(){
		if(this.name || this.id){
			// return this._metadata().obj_presentation || this._metadata().synonym + " " + this.name || this.id;
			return this.name || this.id || this._metadata().obj_presentation || this._metadata().synonym;
		}else
			return this._presentation || '';
	}
	/**
	 * @type String
	 */
	set presentation(v){
		if(v)
			this._presentation = String(v);
	}

}
Object.defineProperties(CatObj.prototype, {

	/**
	 * ### Код элемента справочника
	 * @property id
	 * @type String|Number
	 */
	id: {
		get : function(){ return this._obj.id || ""},
		set : function(v){
			this.__notify('id');
			this._obj.id = v;
		},
		enumerable: true
	},

	/**
	 * ### Наименование элемента справочника
	 * @property name
	 * @type String
	 */
	name: {
		get : function(){ return this._obj.name || ""},
		set : function(v){
			this.__notify('name');
			this._obj.name = String(v);
		},
		enumerable: true
	}
})



/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
class DocObj extends DataObj{

	constructor(attr, manager){

		// выполняем конструктор родительского объекта
		super(attr, manager);

		this._mixin_attr(attr);

	}

	/**
	 * Представление объекта
	 * @property presentation
	 * @for DocObj
	 * @type String
	 */
	get presentation(){
		if(this.number_doc)
			return (this._metadata().obj_presentation || this._metadata().synonym) + ' №' + this.number_doc + " от " + moment(this.date).format(moment._masks.ldt);
		else
			return this._presentation || "";
	}
	/**
	 * @type String
	 */
	set presentation(v){
		if(v)
			this._presentation = String(v);
	}

}


function doc_props_date_number(proto){

	Object.defineProperties(proto, {

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
			enumerable: true
		},

		/**
		 * Дата документа
		 * @property date
		 * @type {Date}
		 */
		date: {
			get : function(){ return this._obj.date || utils.blank.date},
			set : function(v){
				this.__notify('date');
				this._obj.date = utils.fix_date(v, true);
			},
			enumerable: true
		}

	});
}

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
Object.defineProperty(DocObj.prototype, "posted", {
	get : function(){ return this._obj.posted || false},
	set : function(v){
		this.__notify('posted');
		this._obj.posted = utils.fix_boolean(v);
	},
	enumerable: true
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
class DataProcessorObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		var f, cmd = manager.metadata();
		for(f in cmd.fields)
			attr[f] = utils.fetch_type("", cmd.fields[f].type);
		for(f in cmd["tabular_sections"])
			attr[f] = [];

		utils._mixin(this, attr);

	}
}



/**
 * ### Абстрактный класс ЗадачаОбъект
 * @class TaskObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
class TaskObj extends CatObj {}
doc_props_date_number(TaskObj.prototype);


/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
class BusinessProcessObj extends CatObj {}
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
class EnumObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		if(attr && typeof attr == "object")
			utils._mixin(this, attr);

	}

	/**
	 * Порядок элемента перечисления
	 * @property order
	 * @for EnumObj
	 * @type Number
	 */
	get order() {
		return this._obj.sequence
	}
	/**
	 * @type Number
	 */
	set order(v) {
		this._obj.sequence = parseInt(v)
	}


	/**
	 * Наименование элемента перечисления
	 * @property name
	 * @for EnumObj
	 * @type String
	 */
	get name() {
		return this._obj.ref
	}
	/**
	 * @type String
	 */
	set name(v) {
		this._obj.ref = String(v)
	}

	/**
	 * Синоним элемента перечисления
	 * @property synonym
	 * @for EnumObj
	 * @type String
	 */
	get synonym() {
		return this._obj.synonym || ""
	}
	/**
	 * @type String
	 */
	set synonym(v) {
		this._obj.synonym = String(v)
	}

	/**
	 * Представление объекта
	 * @property presentation
	 * @for EnumObj
	 * @type String
	 */
	get presentation() {
		return this.synonym || this.name;
	}

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @for EnumObj
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty() {
		return !this.ref || this.ref == "_";
	}
}


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
class RegisterRow extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		if (attr && typeof attr == "object"){
			var tref = attr.ref;
			if(tref){
				delete attr.ref;
			}
			utils._mixin(this, attr);
			if(tref){
				attr.ref = tref;
			}
		}

		for (var check in manager.metadata().dimensions) {
			if (!attr.hasOwnProperty(check) && attr.ref) {
				var keys = attr.ref.split("¶");
				Object.keys(manager.metadata().dimensions).forEach((fld, ind) => {
					this[fld] = keys[ind]
				});
				break;
			}
		}

	}

	/**
	 * Метаданные строки регистра
	 * @method _metadata
	 * @for RegisterRow
	 * @param field_name
	 * @type Object
	 */
	_metadata(field_name) {
		var _meta = this._manager.metadata();
		if (!_meta.fields)
			_meta.fields = Object.assign({}, _meta.dimensions, _meta.resources, _meta.attributes);
		return field_name ? _meta.fields[field_name] : _meta;
	}

	/**
	 * Ключ записи регистра
	 */
	get ref() {
		return this._manager.get_ref(this);
	}

	get presentation() {
		return this._metadata().obj_presentation || this._metadata().synonym;
	}
}

/**
 * Здесь живут ссылки на конструкторы классов
 * @type {{}}
 */
export const classes = {DataObj, CatObj, DocObj, DataProcessorObj, TaskObj, BusinessProcessObj, EnumObj, RegisterRow};


