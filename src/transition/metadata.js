/*!
 metadata-js v0.12.231, built:2017-07-16
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.$p = factory());
}(this, (function () { 'use strict';

function msg$1(id) {
	return msg$1.i18n[msg$1.lang][id];
}
msg$1.lang = 'ru';
msg$1.i18n = {
	ru: {
		store_url_od: 'https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage',
		argument_is_not_ref: 'Аргумент не является ссылкой',
		addr_title: 'Ввод адреса',
		cache_update_title: 'Обновление кеша браузера',
		cache_update: 'Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера',
		cancel: 'Отмена',
		delivery_area_empty: 'Укажите район доставки',
		empty_login_password: 'Не указаны имя пользователя или пароль',
		empty_response: 'Пустой ответ сервера',
		empty_geocoding: 'Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера',
		error_geocoding: 'Ошибка геокодера',
		error_auth: 'Авторизация пользователя не выполнена',
		error_critical: 'Критическая ошибка',
		error_metadata: 'Ошибка загрузки метаданных конфигурации',
		error_network: 'Ошибка сети или сервера - запрос отклонен',
		error_rights: 'Ограничение доступа',
		error_low_acl: 'Недостаточно прав для выполнения операции',
		file_size: 'Запрещена загрузка файлов<br/>размером более ',
		file_confirm_delete: 'Подтвердите удаление файла ',
		file_new_date: 'Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления',
		file_new_date_title: 'Версия файлов',
		init_catalogues: 'Загрузка справочников с сервера',
		init_catalogues_meta: ': Метаданные объектов',
		init_catalogues_tables: ': Реструктуризация таблиц',
		init_catalogues_nom: ': Базовые типы + номенклатура',
		init_catalogues_sys: ': Технологические справочники',
		init_login: 'Укажите имя пользователя и пароль',
		requery: 'Повторите попытку через 1-2 минуты',
		get limit_query() {
			return 'Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>' + this.requery;
		},
		long_operation: 'Длительная операция',
		logged_in: 'Авторизован под именем: ',
		log_out_title: 'Отключиться от сервера?',
		log_out_break: '<br/>Завершить синхронизацию?',
		sync_title: 'Обмен с сервером',
		sync_complite: 'Синхронизация завершена',
		main_title: 'Окнософт: заказ дилера ',
		mark_delete_confirm: 'Пометить объект %1 на удаление?',
		mark_undelete_confirm: 'Снять пометку удаления с объекта %1?',
		meta: {
			enm: 'Перечисление',
			cat: 'Справочник',
			doc: 'Документ',
			cch: 'План видов характеристик',
			cacc: 'План счетов',
			tsk: 'Задача',
			ireg: 'Регистр сведений',
			areg: 'Регистр накопления',
			accreg: 'Регистр бухгалтерии',
			bp: 'Бизнес процесс',
			ts_row: 'Строка табличной части',
			dp: 'Обработка',
			rep: 'Отчет',
		},
		meta_classes: {
			enm: 'Перечисления',
			cat: 'Справочники',
			doc: 'Документы',
			cch: 'Планы видов характеристик',
			cacc: 'Планы счетов',
			tsk: 'Задачи',
			ireg: 'Регистры сведений',
			areg: 'Регистры накопления',
			accreg: 'Регистры бухгалтерии',
			bp: 'Бизнес процессы',
			dp: 'Обработки',
			rep: 'Отчеты',
		},
		meta_mgrs: {
			mgr: 'Менеджер',
			get enm() {
				return this.mgr + ' перечислений';
			},
			get cat() {
				return this.mgr + ' справочников';
			},
			get doc() {
				return this.mgr + ' документов';
			},
			get cch() {
				return this.mgr + ' планов видов характеристик';
			},
			get cacc() {
				return this.mgr + ' планов счетов';
			},
			get tsk() {
				return this.mgr + ' задач';
			},
			get ireg() {
				return this.mgr + ' регистров сведений';
			},
			get areg() {
				return this.mgr + ' регистров накопления';
			},
			get accreg() {
				return this.mgr + ' регистров бухгалтерии';
			},
			get bp() {
				return this.mgr + ' бизнес-процессов';
			},
			get dp() {
				return this.mgr + ' обработок';
			},
			get rep() {
				return this.mgr + ' отчетов';
			},
		},
		meta_cat_mgr: 'Менеджер справочников',
		meta_doc_mgr: 'Менеджер документов',
		meta_enn_mgr: 'Менеджер перечислений',
		meta_ireg_mgr: 'Менеджер регистров сведений',
		meta_areg_mgr: 'Менеджер регистров накопления',
		meta_accreg_mgr: 'Менеджер регистров бухгалтерии',
		meta_dp_mgr: 'Менеджер обработок',
		meta_task_mgr: 'Менеджер задач',
		meta_bp_mgr: 'Менеджер бизнес-процессов',
		meta_reports_mgr: 'Менеджер отчетов',
		meta_cch_mgr: 'Менеджер планов счетов',
		meta_cch_mgr: 'Менеджер планов видов характеристик',
		meta_extender: 'Модификаторы объектов и менеджеров',
		modified_close: 'Объект изменен<br/>Закрыть без сохранения?',
		mandatory_title: 'Обязательный реквизит',
		mandatory_field: 'Укажите значение реквизита "%1"',
		no_metadata: 'Не найдены метаданные объекта "%1"',
		no_selected_row: 'Не выбрана строка табличной части "%1"',
		no_dhtmlx: 'Библиотека dhtmlx не загружена',
		not_implemented: 'Не реализовано в текущей версии',
		offline_request: 'Запрос к серверу в автономном режиме',
		onbeforeunload: 'Окнософт: легкий клиент. Закрыть программу?',
		order_sent_title: 'Подтвердите отправку заказа',
		order_sent_message: 'Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу',
		report_error: '<i class="fa fa-exclamation-circle fa-2x fa-fw"></i> Ошибка',
		report_prepare: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i> Подготовка отчета',
		report_need_prepare: '<i class="fa fa-info fa-2x fa-fw"></i> Нажмите "Сформировать" для получения отчета',
		report_need_online: '<i class="fa fa-plug fa-2x fa-fw"></i> Нет подключения. Отчет недоступен в автономном режиме',
		request_title: 'Запрос регистрации',
		request_message: 'Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо',
		select_from_list: 'Выбор из списка',
		select_grp: 'Укажите группу, а не элемент',
		select_elm: 'Укажите элемент, а не группу',
		select_file_import: 'Укажите файл для импорта',
		srv_overload: 'Сервер перегружен',
		sub_row_change_disabled: 'Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель',
		sync_script: 'Обновление скриптов приложения:',
		sync_data: 'Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников',
		sync_break: 'Прервать синхронизацию',
		sync_no_data: 'Файл не содержит подходящих элементов для загрузки',
		tabular_will_cleared: 'Табличная часть "%1" будет очищена. Продолжить?',
		unsupported_browser_title: 'Браузер не поддерживается',
		unsupported_browser: 'Несовместимая версия браузера<br/>Рекомендуется Google Chrome',
		supported_browsers: 'Рекомендуется Chrome, Safari или Opera',
		unsupported_mode_title: 'Режим не поддерживается',
		get unsupported_mode() {
			return 'Программа не установлена<br/> в <a href="' + this.store_url_od + '">приложениях Google Chrome</a>';
		},
		unknown_error: 'Неизвестная ошибка в функции "%1"',
		value: 'Значение',
	},
};
for (let id in msg$1.i18n.ru) {
	Object.defineProperty(msg$1, id, {
		get: function () {
			return msg$1.i18n.ru[id];
		},
	});
}

class DataObj$1 {
	constructor(attr, manager) {
		if(!(manager instanceof DataProcessorsManager$1) && !(manager instanceof EnumManager$1)){
			const tmp = manager.get(attr, true);
			if(tmp){
				return tmp;
			}
		}
		const _ts_ = {};
		Object.defineProperties(this, {
			_obj: {
				value: {
					ref: manager instanceof EnumManager$1 ? attr.name : (manager instanceof RegisterManager ? manager.get_ref(attr) : utils.fix_guid(attr))
				},
				configurable: true
			},
			_ts_: {
				value: (name) => _ts_[name] || (_ts_[name] = new TabularSection(name, this)),
				configurable: true
			},
			_manager: {
				value : manager
			},
			_data: {
				value: {
					_is_new: !(this instanceof EnumObj)
				},
				configurable: true
			}
		});
		if(manager.alatable && manager.push){
			manager.alatable.push(this._obj);
			manager.push(this, this._obj.ref);
		}
		attr = null;
	}
	_getter(f) {
		const mf = this._metadata(f).type;
		const {_obj} = this;
		const res = _obj ? _obj[f] : "";
		if(f == "type" && typeof res == "object"){
			return res;
		}
		else if(f == "ref"){
			return res;
		}
		else if(mf.is_ref){
			if(mf.digits && typeof res === "number"){
				return res;
			}
			if(mf.hasOwnProperty("str_len") && !utils.is_guid(res)){
				return res;
			}
			let	mgr = this._manager.value_mgr(_obj, f, mf);
			if(mgr){
				if(utils.is_data_mgr(mgr)){
					return mgr.get(res);
				}
				else{
					return utils.fetch_type(res, mgr);
				}
			}
			if(res){
				console.log([f, mf, _obj]);
				return null;
			}
		}else if(mf.date_part){
			return utils.fix_date(_obj[f], true);
		}
		else if(mf.digits){
			return utils.fix_number(_obj[f], !mf.hasOwnProperty("str_len"));
		}
		else if(mf.types[0]=="boolean"){
			return utils.fix_boolean(_obj[f]);
		}
		else{
			return _obj[f] || "";
		}
	}
	__setter(f, v) {
		const mf = this._metadata(f).type;
		const {_obj} = this;
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
			else if(typeof v == "boolean" && mf.types.indexOf("boolean") != -1){
				_obj[f] = v;
			}
			else {
				_obj[f] = utils.fix_guid(v);
				if(utils.is_data_obj(v) && mf.types.indexOf(v._manager.class_name) != -1){
				}else{
					let mgr = this._manager.value_mgr(_obj, f, mf, false, v);
					if(mgr){
						if(mgr instanceof EnumManager$1){
							if(typeof v == "string")
								_obj[f] = v;
							else if(!v)
								_obj[f] = "";
							else if(typeof v == "object")
								_obj[f] = v.ref || v.name || "";
						}else if(v && v.presentation){
							if(v.type && !(v instanceof DataObj$1))
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
			ts.load(v);
		}
	}
	valueOf(){ return this.ref }
	toJSON(){ return this._obj }
	toString(){ return this.presentation }
	_metadata(field_name){
		return this._manager.metadata(field_name)
	}
	get _deleted(){
		return !!this._obj._deleted
	}
	get _modified(){
		return !!this._data._modified
	}
	is_new(){
		return !this._data || this._data._is_new
	}
	_set_loaded(ref){
		this._manager.push(this, ref);
		this._data._modified = false;
		this._data._is_new = false;
		return this;
	}
	mark_deleted(deleted){
		this._obj._deleted = !!deleted;
		return this.save();
	}
	get class_name() {
		return this._manager.class_name
	}
	set class_name(v) {
		return this._obj.class_name = v
	}
	empty(){
		return !this._obj || utils.is_empty_guid(this._obj.ref)
	}
	load() {
		if (this.ref == utils.blank.guid) {
			if (this instanceof CatObj$1)
				this.id = "000000000";
			else
				this.number_doc = "000000000";
			return Promise.resolve(this);
		} else {
			return this._manager.adapter.load_obj(this)
				.then(() => {
					this._data._modified = false;
					setTimeout(() => {this._manager.brodcast_event("obj_loaded", this);});
					return this;
				});
		}
	}
	unload() {
		const {_obj, ref, _observers, _notis, _manager} = this;
		_manager.unload_obj(ref);
		if (_observers){
			_observers.length = 0;
		}
		if (_notis){
			_notis.length = 0;
		}
		for (let f in this._metadata().tabular_sections){
			this[f].clear(true);
		}
		for (let f in this) {
			if (this.hasOwnProperty(f)){
				delete this[f];
			}
		}
		for (let f in _obj){
			delete _obj[f];
		}
		["_ts_", "_obj", "_data"].forEach((f) => delete this[f]);
	}
	save(post, operational, attachments) {
		if (this instanceof DocObj$1 && typeof post == "boolean") {
			var initial_posted = this.posted;
			this.posted = post;
		}
		let saver,
			before_save_res = {},
			reset_modified = () => {
				if (before_save_res === false) {
					if (this instanceof DocObj$1 && typeof initial_posted == "boolean" && this.posted != initial_posted) {
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
		if (before_save_res === false) {
			return Promise.reject(reset_modified());
		} else if (before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then) {
			return before_save_res.then(reset_modified);
		}
		if (this._metadata().hierarchical && !this._obj.parent)
			this._obj.parent = utils.blank.guid;
		if (this instanceof DocObj$1 || this instanceof TaskObj || this instanceof BusinessProcessObj) {
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
		return this._manager.adapter.save_obj(
			this, {
				post: post,
				operational: operational,
				attachments: attachments
			})
			.then(function (obj) {
				obj._manager.emit("after_save", obj);
				return obj;
			})
			.then(reset_modified);
	}
	get_attachment(att_id) {
		const {_manager, ref} = this;
		return _manager.adapter.get_attachment(_manager, ref, att_id);
	}
	save_attachment(att_id, attachment, type) {
		const {_manager, ref, _attachments} = this;
		return _manager.save_attachment(ref, att_id, attachment, type)
			.then((att) => {
				if (!_attachments)
					this._attachments = {};
				if (!this._attachments[att_id] || !att.stub)
					this._attachments[att_id] = att;
				return att;
			});
	}
	delete_attachment(att_id) {
		const {_manager, ref, _attachments} = this;
		return _manager.delete_attachment(ref, att_id)
			.then((att) => {
				if (_attachments)
					delete _attachments[att_id];
				return att;
			});
	}
	_silent(v) {
		const {_data} = this;
		if (typeof v == "boolean"){
			_data._silent = v;
		}
		else {
			_data._silent = true;
			setTimeout(() => {
				_data._silent = false;
			});
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
	print(model, wnd) {
		return this._manager.print(this, model, wnd);
	}
}
Object.defineProperty(DataObj$1.prototype, "ref", {
	get : function(){ return this._obj ? this._obj.ref : utils.blank.guid},
	set : function(v){ this._obj.ref = utils.fix_guid(v);},
	enumerable : true,
	configurable: true
});
class CatObj$1 extends DataObj$1 {
	constructor(attr, manager){
		super(attr, manager);
		this._mixin_attr(attr);
	}
	get presentation(){
		if(this.name || this.id){
			return this.name || this.id || this._metadata().obj_presentation || this._metadata().synonym;
		}else
			return this._presentation || '';
	}
	set presentation(v){
		if(v)
			this._presentation = String(v);
	}
	get id() {return this._obj.id || ""}
	set id(v) {
		this.__notify('id');
		this._obj.id = v;
	}
	get name() {return this._obj.name || ""}
	set name(v) {
		this.__notify('name');
		this._obj.name = String(v);
	}
	get _children() {
		const res = [];
		this._manager.forEach((o) => {
			if(o != this && o._hierarchy(this)){
				res.push(o);
			}
		});
		return res;
	}
	_hierarchy(group) {
		if(Array.isArray(group)){
			return group.some((v) => this._hierarchy(v));
		}
		const {parent} = this;
		if(this == group || parent == group){
			return true;
		}
		if(parent && !parent.empty()){
			return parent._hierarchy(group);
		}
		return group == utils.blank.guid;
	}
}
const NumberDocAndDate = (superclass) => class extends superclass {
	get number_doc() {
		return this._obj.number_doc || ""
	}
	set number_doc(v) {
		this.__notify('number_doc');
		this._obj.number_doc = v;
	}
	get date() {
		return this._obj.date instanceof Date ? this._obj.date : utils.blank.date
	}
	set date(v) {
		this.__notify('date');
		this._obj.date = utils.fix_date(v, true);
	}
};
class DocObj$1 extends NumberDocAndDate(DataObj$1) {
	constructor(attr, manager){
		super(attr, manager);
		this._mixin_attr(attr);
	}
	get presentation(){
		if(this.number_doc)
			return (this._metadata().obj_presentation || this._metadata().synonym) + ' №' + this.number_doc + " от " + moment(this.date).format(moment._masks.ldt);
		else
			return this._presentation || "";
	}
	set presentation(v){
		if(v)
			this._presentation = String(v);
	}
	get posted() {
		return this._obj.posted || false
	}
	set posted(v) {
		this.__notify('posted');
		this._obj.posted = utils.fix_boolean(v);
	}
}
class DataProcessorObj extends DataObj$1 {
	constructor(attr, manager) {
		super(attr, manager);
		const cmd = manager.metadata();
		for(let f in cmd.fields){
			if(!attr[f]){
				attr[f] = utils.fetch_type("", cmd.fields[f].type);
			}
		}
		for(let f in cmd["tabular_sections"]){
			if(!attr[f]){
				attr[f] = [];
			}
		}
		utils._mixin(this, attr);
	}
}
class TaskObj extends NumberDocAndDate(CatObj$1) {
}
class BusinessProcessObj extends NumberDocAndDate(CatObj$1) {
}
class EnumObj extends DataObj$1 {
	constructor(attr, manager) {
		super(attr, manager);
		if(attr && typeof attr == "object")
			utils._mixin(this, attr);
	}
	get order() {
		return this._obj.sequence
	}
	set order(v) {
		this._obj.sequence = parseInt(v);
	}
	get name() {
		return this._obj.ref
	}
	set name(v) {
		this._obj.ref = String(v);
	}
	get synonym() {
		return this._obj.synonym || ""
	}
	set synonym(v) {
		this._obj.synonym = String(v);
	}
	get presentation() {
		return this.synonym || this.name;
	}
	empty() {
		return !this.ref || this.ref == "_";
	}
}
class RegisterRow$1 extends DataObj$1 {
	constructor(attr, manager) {
		super(attr, manager);
		if (attr && typeof attr == "object"){
			let tref = attr.ref;
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
					this[fld] = keys[ind];
				});
				break;
			}
		}
	}
	_metadata(field_name) {
		const _meta = this._manager.metadata();
		if (!_meta.fields){
			_meta.fields = Object.assign({}, _meta.dimensions, _meta.resources, _meta.attributes);
		}
		return field_name ? _meta.fields[field_name] : _meta;
	}
	get ref() {
		return this._manager.get_ref(this);
	}
	get presentation() {
		return this._metadata().obj_presentation || this._metadata().synonym;
	}
}


var data_objs = Object.freeze({
	DataObj: DataObj$1,
	CatObj: CatObj$1,
	NumberDocAndDate: NumberDocAndDate,
	DocObj: DocObj$1,
	DataProcessorObj: DataProcessorObj,
	TaskObj: TaskObj,
	BusinessProcessObj: BusinessProcessObj,
	EnumObj: EnumObj,
	RegisterRow: RegisterRow$1
});

var domain;
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);
function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.usingDomains = false;
EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;
EventEmitter.defaultMaxListeners = 10;
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};
function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}
EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');
  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;
  domain = this.domain;
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er;
    } else {
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }
  handler = events[type];
  if (!handler)
    return false;
  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }
  if (needDomainExit)
    domain.exit();
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      events = this._events;
      if (!events)
        return this;
      list = events[type];
      if (!list)
        return this;
      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;
        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }
        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }
      return this;
    };
EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;
      events = this._events;
      if (!events)
        return this;
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }
      return this;
    };
EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;
  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }
  return ret;
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

class MetaEventEmitter extends EventEmitter{
	on(type, listener){
		if(typeof listener == 'function' && typeof type != 'object'){
			super.on(type, listener);
		}
		else{
			for(let fld in type){
				if(typeof type[fld] == 'function'){
					super.on(fld, type[fld]);
				}
			}
		}
	}
	off(type, listener){
		if(super.off){
			super.off(type, listener);
		}
		else{
			if(listener){
				super.removeListener(type, listener);
			}
			else{
				super.removeAllListeners(type);
			}
		}
	}
}

class DataManager extends MetaEventEmitter{
	constructor(owner, class_name) {
		super();
		this._owner = owner;
		this.class_name = class_name;
		this.constructor_names = {};
		this.by_ref = {};
	}
	toString(){
		return msg$1('meta_mgrs')[this._owner.name]
	}
	metadata(field_name) {
		if(!this._meta){
			this._meta = this._owner.$p.md.get(this.class_name);
		}
		if(field_name){
			return this._meta && this._meta.fields && this._meta.fields[field_name] || this._owner.$p.md.get(this.class_name, field_name);
		}
		else{
			return this._meta;
		}
	}
	get adapter(){
		const {adapters} = this._owner.$p;
		switch (this.cachable){
			case undefined:
			case "ram":
			case "doc":
			case "doc_remote":
			case "doc_ram":
			case "remote":
			case "user":
			case "meta":
				return adapters.pouch;
		}
		return adapters[this.cachable];
	}
	get alatable(){
		const {table_name, _owner} = this;
		const {tables} = _owner.$p.wsql.aladb;
		return tables[table_name] ? tables[table_name].data : []
	}
	get cachable(){
		const {class_name} = this;
		const _meta = this.metadata();
		if(class_name.indexOf("enm.") != -1)
			return "ram";
		if(_meta && _meta.cachable)
			return _meta.cachable;
		if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
			return "doc";
		return "ram";
	}
	get family_name(){
		return msg$1('meta_mgrs')[this.class_name.split(".")[0]].replace(msg$1('meta_mgrs').mgr+" ", "");
	}
	get table_name(){
		return this.class_name.replace(".", "_");
	}
	find_rows(selection, callback){
		return utils._find_rows.call(this, this.by_ref, selection, callback);
	}
	find_rows_remote(selection) {
		return this.adapter.find_rows(this, selection);
	}
	extra_fields(obj){
		const {cat, cch, md} = this._owner.$p;
		const dests = cat.destinations || cch.destinations,
			predefined_name = md.class_name_to_1c(this.class_name).replace(".", "_"),
			res = [];
		if(dests){
			dests.find_rows({predefined_name}, destination => {
				const ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
				if(ts){
					ts.each(row => {
						if(!row._deleted && !row.ПометкаУдаления){
							res.push(row.property || row.Свойство);
						}
					});
				}
				return false;
			});
		}
		return res;
	}
	extra_properties(obj){
		return [];
	}
	obj_constructor(ts_name = "", mode) {
		if(!this.constructor_names[ts_name]){
			var parts = this.class_name.split("."),
				fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);
			this.constructor_names[ts_name] = ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;
		}
		ts_name = this.constructor_names[ts_name];
		if(!mode){
			return ts_name;
		}
		const constructor = this._owner.$p[ts_name];
		if(mode === true ){
			return constructor;
		}
		if(Array.isArray(mode)){
			return new constructor(...mode);
		}
		return new constructor(mode);
	}
	sync_grid(attr, grid){
		const mgr = this;
		const {iface, record_log, wsql} = this._owner.$p;
		function request(){
			if(typeof attr.custom_selection == "function"){
				return attr.custom_selection(attr);
			}else if(mgr.cachable == "ram"){
				if(attr.action == "get_tree")
					return wsql.promise(mgr.get_sql_struct(attr), [])
						.then(iface.data_to_tree);
				else if(attr.action == "get_selection")
					return wsql.promise(mgr.get_sql_struct(attr), [])
						.then(data => iface.data_to_grid.call(mgr, data, attr));
			}else if(mgr.cachable.indexOf("doc") == 0){
				if(attr.action == "get_tree")
					return mgr.pouch_tree(attr);
				else if(attr.action == "get_selection")
					return mgr.pouch_selection(attr);
			} else {
				if(attr.action == "get_tree")
					return mgr.rest_tree(attr);
				else if(attr.action == "get_selection")
					return mgr.rest_selection(attr);
			}
		}
		function to_grid(res){
			return new Promise(function(resolve, reject) {
				if(typeof res == "string"){
					if(res.substr(0,1) == "{")
						res = JSON.parse(res);
					if(grid && grid.parse){
						grid.xmlFileUrl = "exec";
						grid.parse(res, function(){
							resolve(res);
						}, "xml");
					}else
						resolve(res);
				}else if(grid instanceof dhtmlXTreeView && grid.loadStruct){
					grid.loadStruct(res, function(){
						resolve(res);
					});
				}else
					resolve(res);
			});
		}
		return request()
			.then(to_grid)
			.catch(record_log);
	}
	get_option_list(selection){
		var t = this, l = [], input_by_string, text, sel;
		if(selection.presentation && (input_by_string = t.metadata().input_by_string)){
			text = selection.presentation.like;
			delete selection.presentation;
			selection.or = [];
			input_by_string.forEach(function (fld) {
				sel = {};
				sel[fld] = {like: text};
				selection.or.push(sel);
			});
		}
		if(t.cachable == "ram" || (selection && selection._local)) {
			t.find_rows(selection, function (v) {
				l.push(v);
			});
			return Promise.resolve(l);
		}else if(t.cachable != "e1cib"){
			return t.adapter.find_rows(t, selection)
				.then(function (data) {
					data.forEach(function (v) {
						l.push(v);
					});
					return l;
				});
		}else{
			var attr = { selection: selection, top: selection._top},
				is_doc = t instanceof DocManager$1 || t instanceof BusinessProcessManager$1;
			delete selection._top;
			if(is_doc)
				attr.fields = ["ref", "date", "number_doc"];
			else if(t.metadata().main_presentation_name)
				attr.fields = ["ref", "name"];
			else
				attr.fields = ["ref", "id"];
			return _rest.load_array(attr, t)
				.then(function (data) {
					data.forEach(function (v) {
						l.push({
							text: is_doc ? (v.number_doc + " от " + moment(v.date).format(moment._masks.ldt)) : (v.name || v.id),
							value: v.ref});
					});
					return l;
				});
		}
	}
	value_mgr(row, f, mf, array_enabled, v) {
		let property, oproperty, tnames, rt, mgr;
		if (mf._mgr){
			return mf._mgr;
		}
		function mf_mgr(mgr) {
			if (mgr && mf.types.length == 1){
				mf._mgr = mgr;
			}
			return mgr;
		}
		if (mf.types.length == 1) {
			tnames = mf.types[0].split(".");
			if (tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}
		else if (v && v.type) {
			tnames = v.type.split(".");
			if (tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}
		property = row.property || row.param;
		if (f != "value" || !property) {
			rt = [];
			mf.types.forEach(function (v) {
				tnames = v.split(".");
				if (tnames.length > 1 && $p[tnames[0]][tnames[1]]){
					rt.push($p[tnames[0]][tnames[1]]);
				}
			});
			if (rt.length == 1 || row[f] == utils.blank.guid){
				return mf_mgr(rt[0]);
			}
			else if (array_enabled){
				return rt;
			}
			else if ((property = row[f]) instanceof DataObj){
				return property._manager;
			}
			else if (utils.is_guid(property) && property != utils.blank.guid) {
				for (var i in rt) {
					mgr = rt[i];
					if (mgr.get(property, true)){
						return mgr;
					}
				}
			}
		} else {
			if (utils.is_data_obj(property)){
				oproperty = property;
			}
			else if (utils.is_guid(property)){
				oproperty = $p.cch.properties.get(property);
			}
			else{
				return;
			}
			if (utils.is_data_obj(oproperty)) {
				if (oproperty.is_new()){
					return $p.cat.property_values;
				}
				rt = [];
				oproperty.type.types.some((v) => {
					tnames = v.split(".");
					if(tnames.length > 1 && $p[tnames[0]][tnames[1]]){
						rt.push($p[tnames[0]][tnames[1]]);
					}
					else if(v == "boolean"){
						rt.push({types: ["boolean"]});
						return true
					}
				});
				if(rt.length == 1 || row[f] == utils.blank.guid){
					return mf_mgr(rt[0]);
				}
				else if(array_enabled){
					return rt;
				}
				else if((property = row[f]) instanceof DataObj){
					return property._manager;
				}
				else if(utils.is_guid(property) && property != utils.blank.guid){
					for(let i in rt){
						mgr = rt[i];
						if(mgr.get(property, false)){
							return mgr;
						}
					}
				}
			}
		}
	}
	printing_plates(){
		var rattr = {}, t = this;
		const {ajax} = this._owner.$p;
		if(!t._printing_plates){
			if(t.metadata().printing_plates){
				t._printing_plates = t.metadata().printing_plates;
			}
			else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
				t._printing_plates = {};
			}
		}
		if(!t._printing_plates && ajax.authorized){
			ajax.default_attr(rattr, job_prm.irest_url());
			rattr.url += t.rest_name + "/Print()";
			return ajax.get_ex(rattr.url, rattr)
				.then(function (req) {
					t._printing_plates = JSON.parse(req.response);
					return t._printing_plates;
				})
				.catch(function () {
				})
				.then(function (pp) {
					return pp || (t._printing_plates = {});
				});
		}
		return Promise.resolve(t._printing_plates);
	}
	brodcast_event(name, attr){
		this._owner.$p.md.emit(name, attr);
	}
	static get EVENTS(){
		return {
			AFTER_CREATE: "AFTER_CREATE",
			AFTER_LOAD: "AFTER_LOAD",
			BEFORE_SAVE: "BEFORE_SAVE",
			BEFORE_SAVE: "BEFORE_SAVE",
			VALUE_CHANGE: "VALUE_CHANGE",
			ADD_ROW: "ADD_ROW",
			DEL_ROW: "DEL_ROW"
		}
	}
}
class RefDataManager extends DataManager{
	push(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete this.by_ref[o.ref];
			this.by_ref[new_ref] = o;
		}else
			this.by_ref[o.ref] = o;
	}
	each(fn){
		for(var i in this.by_ref){
			if(!i || i == utils.blank.guid)
				continue;
			if(fn.call(this, this.by_ref[i]) == true)
				break;
		}
	}
	forEach(fn) {
		return this.each.call(this, fn);
	}
	get(ref, do_not_create){
		let o = this.by_ref[ref] || this.by_ref[(ref = utils.fix_guid(ref))];
		if(!o){
			if(do_not_create && do_not_create != 'promise'){
				return;
			}
			else{
				o = this.obj_constructor('', [ref, this, true]);
			}
		}
		if(ref === utils.blank.guid){
			return do_not_create == 'promise' ? Promise.resolve(o) : o;
		}
		if(o.is_new()){
			if(do_not_create == 'promise'){
				return o.load();
			}
			else{
				return o;
			}
		}else{
			return do_not_create == 'promise' ? Promise.resolve(o) : o;
		}
	}
	create(attr, fill_default){
		if(!attr || typeof attr != "object"){
			attr = {};
		}
		else if(utils.is_data_obj(attr)){
			return Promise.resolve(attr);
		}
		if(!attr.ref || !utils.is_guid(attr.ref) || utils.is_empty_guid(attr.ref)){
			attr.ref = utils.generate_guid();
		}
		let o = this.by_ref[attr.ref];
		if(!o){
			o = this.obj_constructor('', [attr, this]);
			if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
			}else{
				if(o instanceof DocObj && o.date == utils.blank.date){
					o.date = new Date();
				}
				let after_create_res = {};
				this.emit("after_create", o, after_create_res);
				let call_new_number_doc;
				if((this instanceof DocManager$1 || this instanceof TaskManager$1 || this instanceof BusinessProcessManager$1)){
					if(!o.number_doc){
						call_new_number_doc = true;
					}
				}else{
					if(!o.id){
						call_new_number_doc = true;
					}
				}
				const {ajax} = this._owner.$p;
				return (call_new_number_doc ? o.new_number_doc() : Promise.resolve(o))
					.then(() => {
						if(after_create_res === false)
							return o;
						else if(typeof after_create_res === "object" && after_create_res.then)
							return after_create_res;
						if(this.cachable == "e1cib" && fill_default){
							var rattr = {};
							ajax.default_attr(rattr, job_prm.irest_url());
							rattr.url += this.rest_name + "/Create()";
							return ajax.get_ex(rattr.url, rattr)
								.then(function (req) {
									return utils._mixin(o, JSON.parse(req.response), undefined, ["ref"]);
								});
						}else
							return o;
					})
			}
		}
		return Promise.resolve(o);
	}
	unload_obj(ref) {
		delete this.by_ref[ref];
		this.alatable.some(function (o, i, a) {
			if(o.ref == ref){
				a.splice(i, 1);
				return true;
			}
		});
	}
	find(val, columns){
		return utils._find(this.by_ref, val, columns);
	}
	load_array(aattr, forse){
		const res = [];
		for(let attr of aattr){
			let obj = this.by_ref[utils.fix_guid(attr)];
			if(!obj){
				if(forse == "update_only"){
					continue;
				}
				obj = this.obj_constructor('', [attr, this]);
				forse && obj._set_loaded();
			}
			else if(obj.is_new() || forse){
				utils._mixin(obj, attr)._set_loaded();
			}
			res.push(obj);
		}
		return res;
	}
	first_folder(owner){
		for(var i in this.by_ref){
			var o = this.by_ref[i];
			if(o.is_folder && (!owner || utils.is_equal(owner, o.owner)))
				return o;
		}
		return this.get();
	}
	get_sql_struct(attr){
		const {sql_mask, sql_type} = this._owner.$p.md;
		var t = this,
			cmd = t.metadata(),
			res = {}, f, f0, trunc_index = 0,
			action = attr && attr.action ? attr.action : "create_table";
		function sql_selection(){
			var ignore_parent = !attr.parent,
				parent = attr.parent || utils.blank.guid,
				owner,
				initial_value = attr.initial_value || utils.blank.guid,
				filter = attr.filter || "",
				set_parent = utils.blank.guid;
			function list_flds(){
				var flds = [], s = "_t_.ref, _t_.`_deleted`";
				if(cmd.form && cmd.form.selection){
					cmd.form.selection.fields.forEach(function (fld) {
						flds.push(fld);
					});
				}else if(t instanceof DocManager$1){
					flds.push("posted");
					flds.push("date");
					flds.push("number_doc");
				}else{
					if(cmd["hierarchical"] && cmd["group_hierarchy"])
						flds.push("is_folder");
					else
						flds.push("0 as is_folder");
					if(t instanceof ChartOfAccountManager$1){
						flds.push("id");
						flds.push("name as presentation");
					}else if(cmd["main_presentation_name"])
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
				flds.forEach(fld => {
					if(fld.indexOf(" as ") != -1)
						s += ", " + fld;
					else
						s += sql_mask(fld, true);
				});
				return s;
			}
			function join_flds(){
				var s = "", parts;
				if(cmd.form && cmd.form.selection){
					for(var i in cmd.form.selection.fields){
						if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
							continue;
						parts = cmd.form.selection.fields[i].split(" as ");
						parts[0] = parts[0].split(".");
						if(parts[0].length > 1){
							if(s)
								s+= "\n";
							s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
						}
					}
				}
				return s;
			}
			function where_flds(){
				var s;
				if(t instanceof ChartOfAccountManager$1){
					s = " WHERE (" + (filter ? 0 : 1);
				}else if(cmd["hierarchical"]){
					if(cmd["has_owners"])
						s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" +
							(owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
					else
						s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);
				}else{
					if(cmd["has_owners"])
						s = " WHERE (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
					else
						s = " WHERE (" + (filter ? 0 : 1);
				}
				if(t.sql_selection_where_flds){
					s += t.sql_selection_where_flds(filter);
				}else if(t instanceof DocManager$1)
					s += " OR _t_.number_doc LIKE '" + filter + "'";
				else{
					if(cmd["main_presentation_name"] || t instanceof ChartOfAccountManager$1)
						s += " OR _t_.name LIKE '" + filter + "'";
					if(cmd["code_length"])
						s += " OR _t_.id LIKE '" + filter + "'";
				}
				s += ") AND (_t_.ref != '" + utils.blank.guid + "')";
				if(attr.selection){
					if(typeof attr.selection == "function"){
					}else
						attr.selection.forEach(sel => {
							for(var key in sel){
								if(typeof sel[key] == "function"){
									s += "\n AND " + sel[key](t, key) + " ";
								}else if(cmd.fields.hasOwnProperty(key) || key === "ref"){
									if(sel[key] === true)
										s += "\n AND _t_." + key + " ";
									else if(sel[key] === false)
										s += "\n AND (not _t_." + key + ") ";
									else if(typeof sel[key] == "object"){
										if(utils.is_data_obj(sel[key]) || utils.is_guid(sel[key]))
											s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
										else{
											var keys = Object.keys(sel[key]),
												val = sel[key][keys[0]],
												mf = cmd.fields[key],
												vmgr;
											if(mf && mf.type.is_ref){
												vmgr = t.value_mgr({}, key, mf.type, true, val);
											}
											if(keys[0] == "not")
												s += "\n AND (not _t_." + key + " = '" + val + "') ";
											else if(keys[0] == "in")
												s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce((sum, val) => {
														if(sum){
															sum+=",";
														}
														if(typeof val == "number"){
															sum+=val.toString();
														}else{
															sum+="'" + val + "'";
														}
														return  sum;
													}, "") + ")) ";
											else
												s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									}else if(typeof sel[key] == "string")
										s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
									else
										s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
								}
							}
						});
				}
				return s;
			}
			function order_flds(){
				if(t instanceof ChartOfAccountManager$1){
					return "ORDER BY id";
				}else if(cmd["hierarchical"]){
					if(cmd["group_hierarchy"])
						return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";
					else
						return "ORDER BY _t_.parent desc, is_initial_value, presentation";
				}else
					return "ORDER BY is_initial_value, presentation";
			}
			function selection_prms(){
				function on_parent(o){
					if(o){
						set_parent = (attr.set_parent = o.parent.ref);
						parent = set_parent;
						ignore_parent = false;
					}
					if(filter && filter.indexOf("%") == -1)
						filter = "%" + filter + "%";
				}
				if(cmd["has_owners"]){
					owner = attr.owner;
					if(attr.selection && typeof attr.selection != "function"){
						attr.selection.forEach(sel => {
							if(sel.owner){
								owner = typeof sel.owner == "object" ?  sel.owner.valueOf() : sel.owner;
								delete sel.owner;
							}
						});
					}
					if(!owner)
						owner = utils.blank.guid;
				}
				if(initial_value !=  utils.blank.guid && ignore_parent){
					if(cmd["hierarchical"]){
						on_parent(t.get(initial_value));
					}else
						on_parent();
				}else
					on_parent();
			}
			selection_prms();
			var sql;
			if(t.sql_selection_list_flds)
				sql = t.sql_selection_list_flds(initial_value);
			else
				sql = ("SELECT %2, case when _t_.ref = '" + initial_value +
				"' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
					.replace("%2", list_flds())
					.replace("%j", join_flds())
				;
			return sql.replace("%3", where_flds()).replace("%4", order_flds());
		}
		function sql_create(){
			var sql = "CREATE TABLE IF NOT EXISTS ";
			if(attr && attr.postgres){
				sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";
				if(t instanceof DocManager$1)
					sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";
				else{
					if(cmd.code_length)
						sql += ", id character("+cmd.code_length+")";
					sql += ", name character varying(50), is_folder boolean";
				}
				for(f in cmd.fields){
					if(f.length > 30){
						if(cmd.fields[f].short_name)
							f0 = cmd.fields[f].short_name;
						else{
							trunc_index++;
							f0 = f[0] + trunc_index + f.substr(f.length-27);
						}
					}else
						f0 = f;
					sql += ", " + f0 + sql_type(t, f, cmd.fields[f].type, true);
				}
				for(f in cmd["tabular_sections"])
					sql += ", " + "ts_" + f + " JSON";
			}else{
				sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";
				if(t instanceof DocManager$1)
					sql += ", posted boolean, date Date, number_doc CHAR";
				else
					sql += ", id CHAR, name CHAR, is_folder BOOLEAN";
				for(f in cmd.fields)
					sql += sql_mask(f) + sql_type(t, f, cmd.fields[f].type);
				for(f in cmd["tabular_sections"])
					sql += ", " + "`ts_" + f + "` JSON";
			}
			sql += ")";
			return sql;
		}
		function sql_update(){
			var fields = ["ref", "_deleted"],
				sql = "INSERT INTO `"+t.table_name+"` (ref, `_deleted`",
				values = "(?";
			if(t.class_name.substr(0, 3)=="cat"){
				sql += ", id, name, is_folder";
				fields.push("id");
				fields.push("name");
				fields.push("is_folder");
			}else if(t.class_name.substr(0, 3)=="doc"){
				sql += ", posted, date, number_doc";
				fields.push("posted");
				fields.push("date");
				fields.push("number_doc");
			}
			for(f in cmd.fields){
				sql += sql_mask(f);
				fields.push(f);
			}
			for(f in cmd["tabular_sections"]){
				sql += ", `ts_" + f + "`";
				fields.push("ts_" + f);
			}
			sql += ") VALUES ";
			for(f = 1; f<fields.length; f++){
				values += ", ?";
			}
			values += ")";
			sql += values;
			return {sql: sql, fields: fields, values: values};
		}
		if(action == "create_table")
			res = sql_create();
		else if(["insert", "update", "replace"].indexOf(action) != -1)
			res[t.table_name] = sql_update();
		else if(action == "select")
			res = "SELECT * FROM `"+t.table_name+"` WHERE ref = ?";
		else if(action == "select_all")
			res = "SELECT * FROM `"+t.table_name+"`";
		else if(action == "delete")
			res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";
		else if(action == "drop")
			res = "DROP TABLE IF EXISTS `"+t.table_name+"`";
		else if(action == "get_tree"){
			if(!attr.filter || attr.filter.is_folder)
				res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";
			else
				res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
		}
		else if(action == "get_selection")
			res = sql_selection();
		return res;
	}
	caption_flds(attr){
		return [];
	}
	load_cached_server_array(list, alt_rest_name) {
		const {ajax, rest} = this._owner.$p;
		var query = [], obj,
			t = this,
			mgr = alt_rest_name ? {class_name: t.class_name, rest_name: alt_rest_name} : t,
			check_loaded = !alt_rest_name;
		list.forEach(o => {
			obj = t.get(o.ref || o, true);
			if(!obj || (check_loaded && obj.is_new()))
				query.push(o.ref || o);
		});
		if(query.length){
			var attr = {
				url: "",
				selection: {ref: {in: query}}
			};
			if(check_loaded)
				attr.fields = ["ref"];
			rest.build_select(attr, mgr);
			return ajax.get_ex(attr.url, attr)
				.then(function (req) {
					var data = JSON.parse(req.response);
					if(check_loaded)
						data = data.value;
					else{
						data = data.data;
						for(var i in data){
							if(!data[i].ref && data[i].id)
								data[i].ref = data[i].id;
							if(data[i].Код){
								data[i].id = data[i].Код;
								delete data[i].Код;
							}
							data[i]._not_set_loaded = true;
						}
					}
					t.load_array(data);
					return(list);
				});
		}else
			return Promise.resolve(list);
	}
	predefined(name){
		if(!this._predefined)
			this._predefined = {};
		if(!this._predefined[name]){
			this._predefined[name] = this.get();
			this.find_rows({predefined_name: name}, function (el) {
				this._predefined[name] = el;
				return false;
			});
		}
		return this._predefined[name];
	}
}
class DataProcessorsManager$1 extends DataManager{
	create(){
		return this.obj_constructor('', [{}, this]);
	}
	get(ref){
		if(ref){
			if(!this.by_ref[ref]){
				this.by_ref[ref] = this.create();
			}
			return this.by_ref[ref];
		}else
			return this.create();
	}
	unload_obj(ref) {	}
}
class EnumManager$1 extends RefDataManager{
	constructor(owner, class_name) {
		super(owner, class_name);
		for(var v of owner.$p.md.get(class_name)){
			new EnumObj(v, this);
		}
	}
	get(ref, do_not_create){
		if(ref instanceof EnumObj)
			return ref;
		else if(!ref || ref == utils.blank.guid)
			ref = "_";
		var o = this[ref];
		if(!o)
			o = new EnumObj({name: ref}, this);
		return o;
	}
	push(o, new_ref){
		Object.defineProperty(this, new_ref, {
			value : o
		});
	}
	each(fn) {
		this.alatable.forEach(v => {
			if(v.ref && v.ref != "_" && v.ref != utils.blank.guid)
				fn.call(this[v.ref]);
		});
	}
	get_sql_struct(attr){
		var res = "CREATE TABLE IF NOT EXISTS ",
			action = attr && attr.action ? attr.action : "create_table";
		if(attr && attr.postgres){
			if(action == "create_table")
				res += this.table_name+
					" (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";
			else if(["insert", "update", "replace"].indexOf(action) != -1){
				res = {};
				res[this.table_name] = {
					sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES ($1, $2, $3)",
					fields: ["ref", "sequence", "synonym"],
					values: "($1, $2, $3)"
				};
			}else if(action == "delete")
				res = "DELETE FROM "+this.table_name+" WHERE ref = $1";
		}else {
			if(action == "create_table")
				res += "`"+this.table_name+
					"` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";
			else if(["insert", "update", "replace"].indexOf(action) != -1){
				res = {};
				res[this.table_name] = {
					sql: "INSERT INTO `"+this.table_name+"` (ref, sequence, synonym) VALUES (?, ?, ?)",
					fields: ["ref", "sequence", "synonym"],
					values: "(?, ?, ?)"
				};
			}else if(action == "delete")
				res = "DELETE FROM `"+this.table_name+"` WHERE ref = ?";
		}
		return res;
	}
	get_option_list(selection){
		var l = [], synonym = "", sref;
		if(selection){
			for(var i in selection){
				if(i.substr(0,1)!="_"){
					if(i == "ref"){
						sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
					}
					else
						synonym = selection[i];
				}
			}
		}
		if(typeof synonym == "object"){
			if(synonym.like)
				synonym = synonym.like;
			else
				synonym = "";
		}
		synonym = synonym.toLowerCase();
		this.alatable.forEach(v => {
			if(synonym){
				if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1)
					return;
			}
			if(sref){
				if(Array.isArray(sref)){
					if(!sref.some(sv => sv.name == v.ref || sv.ref == v.ref || sv == v.ref))
						return;
				}else{
					if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
						return;
				}
			}
			l.push(this[v.ref]);
		});
		return Promise.resolve(l);
	}
}
class RegisterManager extends DataManager{
	push(o, new_ref) {
		if (new_ref && (new_ref != o.ref)) {
			delete this.by_ref[o.ref];
			this.by_ref[new_ref] = o;
		} else
			this.by_ref[o.ref] = o;
	};
	get(attr, return_row) {
		if (!attr)
			attr = {};
		else if (typeof attr == "string")
			attr = {ref: attr};
		if (attr.ref && return_row)
			return this.by_ref[attr.ref];
		attr.action = "select";
		const {alasql} = this._owner.$p.wsql;
		const arr = wsql.alasql(this.get_sql_struct(attr), attr._values);
		let res;
		delete attr.action;
		delete attr._values;
		if (arr.length) {
			if (return_row)
				res = this.by_ref[this.get_ref(arr[0])];
			else {
				res = [];
				for (var i in arr)
					res.push(this.by_ref[this.get_ref(arr[i])]);
			}
		}
		return res;
	};
	unload_obj(ref) {
		delete this.by_ref[ref];
		this.alatable.some((o, i, a) => {
			if (o.ref == ref) {
				a.splice(i, 1);
				return true;
			}
		});
	};
	load_array(aattr, forse) {
		var ref, obj, res = [];
		for (var i = 0; i < aattr.length; i++) {
			ref = this.get_ref(aattr[i]);
			obj = this.by_ref[ref];
			if (!obj && !aattr[i]._deleted) {
				obj = this.obj_constructor('', [aattr[i], this]);
				if (forse)
					obj._set_loaded();
			} else if (obj && aattr[i]._deleted) {
				obj.unload();
				continue;
			} else if (obj.is_new() || forse) {
				utils._mixin(obj, aattr[i])._set_loaded();
			}
			res.push(obj);
		}
		return res;
	};
	get_sql_struct(attr) {
		const {sql_mask, sql_type} = this._owner.$p.md;
		var t = this,
			cmd = t.metadata(),
			res = {}, f,
			action = attr && attr.action ? attr.action : "create_table";
		function sql_selection(){
			var filter = attr.filter || "";
			function list_flds(){
				var flds = [], s = "_t_.ref";
				if(cmd.form && cmd.form.selection){
					cmd.form.selection.fields.forEach(fld => flds.push(fld));
				}else{
					for(var f in cmd["dimensions"]){
						flds.push(f);
					}
				}
				flds.forEach(fld => {
					if(fld.indexOf(" as ") != -1)
						s += ", " + fld;
					else
						s += sql_mask(fld, true);
				});
				return s;
			}
			function join_flds(){
				var s = "", parts;
				if(cmd.form && cmd.form.selection){
					for(var i in cmd.form.selection.fields){
						if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
							continue;
						parts = cmd.form.selection.fields[i].split(" as ");
						parts[0] = parts[0].split(".");
						if(parts[0].length > 1){
							if(s)
								s+= "\n";
							s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
						}
					}
				}
				return s;
			}
			function where_flds(){
				var s = " WHERE (" + (filter ? 0 : 1);
				if(t.sql_selection_where_flds){
					s += t.sql_selection_where_flds(filter);
				}
				s += ")";
				if(attr.selection){
					if(typeof attr.selection == "function"){
					}else
						attr.selection.forEach(sel => {
							for(var key in sel){
								if(typeof sel[key] == "function"){
									s += "\n AND " + sel[key](t, key) + " ";
								}else if(cmd.fields.hasOwnProperty(key)){
									if(sel[key] === true)
										s += "\n AND _t_." + key + " ";
									else if(sel[key] === false)
										s += "\n AND (not _t_." + key + ") ";
									else if(typeof sel[key] == "object"){
										if(utils.is_data_obj(sel[key]))
											s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
										else{
											var keys = Object.keys(sel[key]),
												val = sel[key][keys[0]],
												mf = cmd.fields[key],
												vmgr;
											if(mf && mf.type.is_ref){
												vmgr = t.value_mgr({}, key, mf.type, true, val);
											}
											if(keys[0] == "not")
												s += "\n AND (not _t_." + key + " = '" + val + "') ";
											else
												s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									}else if(typeof sel[key] == "string")
										s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
									else
										s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
								}
							}
						});
				}
				return s;
			}
			function order_flds(){
				return "";
			}
			if(filter && filter.indexOf("%") == -1)
				filter = "%" + filter + "%";
			var sql;
			if(t.sql_selection_list_flds)
				sql = t.sql_selection_list_flds();
			else
				sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
					.replace("%2", list_flds())
					.replace("%j", join_flds())
				;
			return sql.replace("%3", where_flds()).replace("%4", order_flds());
		}
		function sql_create(){
			var sql = "CREATE TABLE IF NOT EXISTS ",
				first_field = true;
			if(attr && attr.postgres){
				sql += t.table_name+" (";
				if(cmd.splitted){
					sql += "zone integer";
					first_field = false;
				}
				for(f in cmd.dimensions){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
					sql += sql_type(t, f, cmd.dimensions[f].type, true);
				}
				for(f in cmd.resources)
					sql += ", " + f + sql_type(t, f, cmd.resources[f].type, true);
				for(f in cmd.attributes)
					sql += ", " + f + sql_type(t, f, cmd.attributes[f].type, true);
				sql += ", PRIMARY KEY (";
				first_field = true;
				if(cmd.splitted){
					sql += "zone";
					first_field = false;
				}
				for(f in cmd["dimensions"]){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
				}
			}else{
				sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";
				for(f in cmd.dimensions)
					sql += sql_mask(f) + sql_type(t, f, cmd.dimensions[f].type);
				for(f in cmd.resources)
					sql += sql_mask(f) + sql_type(t, f, cmd.resources[f].type);
				for(f in cmd.attributes)
					sql += sql_mask(f) + sql_type(t, f, cmd.attributes[f].type);
			}
			sql += ")";
			return sql;
		}
		function sql_update(){
			var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
				fields = [],
				first_field = true;
			for(f in cmd.dimensions){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
				fields.push(f);
			}
			for(f in cmd.resources){
				sql += ", " + f;
				fields.push(f);
			}
			for(f in cmd.attributes){
				sql += ", " + f;
				fields.push(f);
			}
			sql += ") VALUES (?";
			for(f = 1; f<fields.length; f++){
				sql += ", ?";
			}
			sql += ")";
			return {sql: sql, fields: fields};
		}
		function sql_select(){
			var sql = "SELECT * FROM `"+t.table_name+"` WHERE ",
				first_field = true;
			attr._values = [];
			for(var f in cmd["dimensions"]){
				if(first_field)
					first_field = false;
				else
					sql += " and ";
				sql += "`" + f + "`" + "=?";
				attr._values.push(attr[f]);
			}
			if(first_field)
				sql += "1";
			return sql;
		}
		if(action == "create_table")
			res = sql_create();
		else if(action in {insert:"", update:"", replace:""})
			res[t.table_name] = sql_update();
		else if(action == "select")
			res = sql_select();
		else if(action == "select_all")
			res = sql_select();
		else if(action == "delete")
			res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";
		else if(action == "drop")
			res = "DROP TABLE IF EXISTS `"+t.table_name+"`";
		else if(action == "get_selection")
			res = sql_selection();
		return res;
	}
	get_ref(attr){
		if(attr instanceof RegisterRow)
			attr = attr._obj;
		if(attr.ref)
			return attr.ref;
		var key = "",
			dimensions = this.metadata().dimensions;
		for(var j in dimensions){
			key += (key ? "¶" : "");
			if(dimensions[j].type.is_ref)
				key += utils.fix_guid(attr[j]);
			else if(!attr[j] && dimensions[j].type.digits)
				key += "0";
			else if(dimensions[j].date_part)
				key += moment(attr[j] || utils.blank.date).format(moment.defaultFormatUtc);
			else if(attr[j]!=undefined)
				key += String(attr[j]);
			else
				key += "$";
		}
		return key;
	}
	caption_flds(attr){
		return [];
	}
	create(attr){
		if(!attr || typeof attr != "object")
			attr = {};
		var o = this.by_ref[attr.ref];
		if(!o){
			o = this.obj_constructor('', [attr, this]);
			let after_create_res = {};
			this.emit("after_create", o, after_create_res);
			if(after_create_res === false)
				return Promise.resolve(o);
			else if(typeof after_create_res === "object" && after_create_res.then)
				return after_create_res;
		}
		return Promise.resolve(o);
	}
}
class InfoRegManager extends RegisterManager{
	slice_first(filter){
	}
	slice_last(filter){
	}
}
class AccumRegManager extends RegisterManager{
}
class CatManager$1 extends RefDataManager{
	constructor(owner, class_name) {
		super(owner, class_name);
		const _meta = this.metadata() || {};
		if (_meta.hierarchical && _meta.group_hierarchy) {
			Object.defineProperty(this.obj_constructor('', true).prototype, 'is_folder', {
				get : function(){ return this._obj.is_folder || false},
				set : function(v){ this._obj.is_folder = utils.fix_boolean(v);},
				enumerable: true,
				configurable: true
			});
		}
	}
	by_name(name) {
		var o;
		this.find_rows({name: name}, obj => {
			o = obj;
			return false;
		});
		if (!o)
			o = this.get();
		return o;
	}
	by_id(id) {
		var o;
		this.find_rows({id: id}, obj => {
			o = obj;
			return false;
		});
		if (!o)
			o = this.get();
		return o;
	};
	path(ref) {
		var res = [], tobj;
		if (ref instanceof DataObj)
			tobj = ref;
		else
			tobj = this.get(ref, true);
		if (tobj)
			res.push({ref: tobj.ref, presentation: tobj.presentation});
		if (tobj && this.metadata().hierarchical) {
			while (true) {
				tobj = tobj.parent;
				if (tobj.empty())
					break;
				res.push({ref: tobj.ref, presentation: tobj.presentation});
			}
		}
		return res;
	};
}
class ChartOfCharacteristicManager extends CatManager$1{
}
class ChartOfAccountManager$1 extends CatManager$1{
}
class DocManager$1 extends RefDataManager{
}
class TaskManager$1 extends CatManager$1{
}
class BusinessProcessManager$1 extends CatManager$1{
}


var data_managers = Object.freeze({
	DataManager: DataManager,
	RefDataManager: RefDataManager,
	DataProcessorsManager: DataProcessorsManager$1,
	EnumManager: EnumManager$1,
	RegisterManager: RegisterManager,
	InfoRegManager: InfoRegManager,
	AccumRegManager: AccumRegManager,
	CatManager: CatManager$1,
	ChartOfCharacteristicManager: ChartOfCharacteristicManager,
	ChartOfAccountManager: ChartOfAccountManager$1,
	DocManager: DocManager$1,
	TaskManager: TaskManager$1,
	BusinessProcessManager: BusinessProcessManager$1
});

const moment$1 = (typeof window != 'undefined' && window.moment) || (moment => {
	require('moment/locale/ru');
	return moment;
})(require('moment'));
moment$1._masks = {
	date: 'DD.MM.YY',
	date_time: 'DD.MM.YYYY HH:mm',
	ldt: 'DD MMMM YYYY, HH:mm',
	iso: 'YYYY-MM-DDTHH:mm:ss',
};
Date.prototype.toJSON = function () {
	return moment$1(this).format(moment$1._masks.iso);
};
if (!Number.prototype.round) {
	Number.prototype.round = function (places) {
		var multiplier = Math.pow(10, places);
		return (Math.round(this * multiplier) / multiplier);
	};
}
if (!Number.prototype.pad) {
	Number.prototype.pad = function (size) {
		var s = String(this);
		while (s.length < (size || 2)) {
			s = '0' + s;
		}
		return s;
	};
}
if (!Object.prototype._clone) {
	Object.defineProperty(Object.prototype, '_clone', {
		value: function () {
			return utils._clone(this);
		},
	});
}
if (!Object.prototype._mixin) {
	Object.defineProperty(Object.prototype, '_mixin', {
		value: function (src, include, exclude) {
			return utils._mixin(this, src, include, exclude);
		},
	});
}
if (!Object.prototype.__define) {
	Object.defineProperty(Object.prototype, '__define', {
		value: function (key, descriptor) {
			if (descriptor) {
				Object.defineProperty(this, key, descriptor);
			} else {
				Object.defineProperties(this, key);
			}
			return this;
		},
	});
}
const utils = {
	moment: moment$1,
	fix_date(str, strict) {
		if (str instanceof Date)
			return str;
		else {
			var m = moment$1(str, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm', 'YYYYDDMMHHmmss', moment$1.ISO_8601]);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	},
	fix_guid(ref, generate) {
		if (ref && typeof ref == 'string') {
		}
		else if (ref instanceof DataObj$1) {
			return ref.ref;
		}
		else if (ref && typeof ref == 'object') {
			if (ref.presentation) {
				if (ref.ref)
					return ref.ref;
				else if (ref.name)
					return ref.name;
			}
			else {
				ref = (typeof ref.ref == 'object' && ref.ref.hasOwnProperty('ref')) ? ref.ref.ref : ref.ref;
			}
		}
		if (this.is_guid(ref) || generate === false) {
			return ref;
		}
		else if (generate) {
			return this.generate_guid();
		}
		return this.blank.guid;
	},
	fix_number(str, strict) {
		const v = parseFloat(str);
		if (!isNaN(v)) {
			return v;
		}
		else if (strict) {
			return 0;
		}
		return str;
	},
	fix_boolean(str) {
		if (typeof str === 'string') {
			return !(!str || str.toLowerCase() == 'false');
		}
		return !!str;
	},
	fetch_type(str, mtype) {
		if (mtype.is_ref) {
			return this.fix_guid(str);
		}
		if (mtype.date_part) {
			return this.fix_date(str, true);
		}
		if (mtype['digits']) {
			return this.fix_number(str, true);
		}
		if (mtype.types && mtype.types[0] == 'boolean') {
			return this.fix_boolean(str);
		}
		return str;
	},
	date_add_day(date, days, reset_time) {
		const newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if (reset_time) {
			newDt.setHours(0, -newDt.getTimezoneOffset(), 0, 0);
		}
		return newDt;
	},
	generate_guid() {
		let d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
	},
	is_guid(v) {
		if (typeof v !== 'string' || v.length < 36) {
			return false;
		}
		else if (v.length > 36) {
			const parts = v.split('|');
			v = parts.length == 2 ? parts[1] : v.substr(0, 36);
		}
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
	},
	is_empty_guid(v) {
		return !v || v === this.blank.guid;
	},
	is_data_obj(v) {
		return v && v instanceof DataObj$1;
	},
	is_data_mgr(v) {
		return v && v instanceof DataManager;
	},
	is_equal(v1, v2) {
		if (v1 == v2) {
			return true;
		}
		else if (typeof v1 === 'string' && typeof v2 === 'string' && v1.trim() === v2.trim()) {
			return true;
		}
		else if (typeof v1 === typeof v2) {
			return false;
		}
		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	},
	blob_as_text(blob, type) {
		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			reader.onload = function (event) {
				resolve(reader.result);
			};
			reader.onerror = function (err) {
				reject(err);
			};
			if (type == 'data_url')
				reader.readAsDataURL(blob);
			else
				reader.readAsText(blob);
		});
	},
	get_and_show_blob(url, post_data, method) {
		var params = 'menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes',
			req;
		function show_blob(req) {
			url = window.URL.createObjectURL(req.response);
			var wnd_print = window.open(url, 'wnd_print', params);
			wnd_print.onload = (e) => window.URL.revokeObjectURL(url);
			return wnd_print;
		}
		if (!method || (typeof method == 'string' && method.toLowerCase().indexOf('post') != -1))
			req = this.post_ex(url,
				typeof post_data == 'object' ? JSON.stringify(post_data) : post_data,
				true,
				xhr => xhr.responseType = 'blob');
		else
			req = this.get_ex(url, true, xhr => xhr.responseType = 'blob');
		return show_blob(req);
	},
	get_and_save_blob(url, post_data, file_name) {
		return this.post_ex(url,
			typeof post_data == 'object' ? JSON.stringify(post_data) : post_data, true, function (xhr) {
				xhr.responseType = 'blob';
			})
			.then(function (req) {
				saveAs(req.response, file_name);
			});
	},
	_mixin(obj, src, include, exclude) {
		const tobj = {};
		function exclude_cpy(f) {
			if (!exclude || exclude.indexOf(f) == -1) {
				if ((typeof tobj[f] == 'undefined') || (tobj[f] != src[f])) {
					obj[f] = src[f];
				}
			}
		}
		if (include && include.length) {
			for (let i = 0; i < include.length; i++) {
				exclude_cpy(include[i]);
			}
		} else {
			for (let f in src) {
				exclude_cpy(f);
			}
		}
		return obj;
	},
	_patch(obj, patch) {
		for (let area in patch) {
			if (typeof patch[area] == 'object') {
				if (obj[area] && typeof obj[area] == 'object') {
					this._patch(obj[area], patch[area]);
				}
				else {
					obj[area] = patch[area];
				}
			} else {
				obj[area] = patch[area];
			}
		}
		return obj;
	},
	_clone(obj) {
		if (!obj || 'object' !== typeof obj)
			return obj;
		var p, v, c = 'function' === typeof obj.pop ? [] : {};
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				v = obj[p];
				if (v) {
					if ('function' === typeof v || v instanceof DataObj$1 || v instanceof DataManager || v instanceof Date)
						c[p] = v;
					else if ('object' === typeof v)
						c[p] = this._clone(v);
					else
						c[p] = v;
				} else
					c[p] = v;
			}
		}
		return c;
	},
	_find(src, val, columns) {
		if (typeof val != 'object') {
			for (let i in src) {
				const o = src[i];
				for (let j in o) {
					if (typeof o[j] !== 'function' && utils.is_equal(o[j], val)) {
						return o;
					}
				}
			}
		} else {
			for (let i in src) {
				const o = src[i];
				let finded = true;
				for (let j in val) {
					if (typeof o[j] !== 'function' && !utils.is_equal(o[j], val[j])) {
						finded = false;
						break;
					}
				}
				if (finded) {
					return o;
				}
			}
		}
	},
	_selection(o, selection) {
		let ok = true;
		if (selection) {
			if (typeof selection == 'function') {
				ok = selection.call(this, o);
			}
			else {
				for (let j in selection) {
					const sel = selection[j];
					const is_obj = sel && typeof(sel) === 'object';
					if (j.substr(0, 1) == '_') {
						continue;
					}
					else if (typeof sel == 'function') {
						ok = sel.call(this, o, j);
						if (!ok)
							break;
					}
					else if (j == 'or' && Array.isArray(sel)) {
						ok = sel.some(function (element) {
							var key = Object.keys(element)[0];
							if (element[key].hasOwnProperty('like'))
								return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase()) != -1;
							else
								return utils.is_equal(o[key], element[key]);
						});
						if (!ok)
							break;
					}
					else if (is_obj && sel.hasOwnProperty('like')) {
						if (!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase()) == -1) {
							ok = false;
							break;
						}
					}
					else if (is_obj && sel.hasOwnProperty('not')) {
						if (utils.is_equal(o[j], sel.not)) {
							ok = false;
							break;
						}
					}
					else if (is_obj && sel.hasOwnProperty('in')) {
						ok = sel.in.some(function (element) {
							return utils.is_equal(element, o[j]);
						});
						if (!ok)
							break;
					}
					else if (is_obj && sel.hasOwnProperty('lt')) {
						ok = o[j] < sel.lt;
						if (!ok)
							break;
					}
					else if (is_obj && sel.hasOwnProperty('gt')) {
						ok = o[j] > sel.gt;
						if (!ok)
							break;
					}
					else if (is_obj && sel.hasOwnProperty('between')) {
						var tmp = o[j];
						if (typeof tmp != 'number')
							tmp = utils.fix_date(o[j]);
						ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
						if (!ok)
							break;
					}
					else if (!utils.is_equal(o[j], sel)) {
						ok = false;
						break;
					}
				}
			}
		}
		return ok;
	},
	_find_rows(src, selection, callback) {
		const res = [];
		let top, count = 0;
		if (selection) {
			if (selection._top) {
				top = selection._top;
				delete selection._top;
			} else {
				top = 300;
			}
		}
		for (let i in src) {
			const o = src[i];
			if (utils._selection.call(this, o, selection)) {
				if (callback) {
					if (callback.call(this, o) === false) {
						break;
					}
				} else {
					res.push(o);
				}
				if (top) {
					count++;
					if (count >= top) {
						break;
					}
				}
			}
		}
		return res;
	},
};
utils.__define('blank', {
	value: Object.freeze({
		date: utils.fix_date('0001-01-01T00:00:00'),
		guid: '00000000-0000-0000-0000-000000000000',
		by_type: function (mtype) {
			var v;
			if (mtype.is_ref)
				v = this.guid;
			else if (mtype.date_part)
				v = this.date;
			else if (mtype['digits'])
				v = 0;
			else if (mtype.types && mtype.types[0] == 'boolean')
				v = false;
			else
				v = '';
			return v;
		},
	}),
	enumerable: true,
	configurable: false,
	writable: false,
});

function Aes(default_key) {
	'use strict';
	var Aes = this;
	Aes.cipher = function(input, w) {
		var Nb = 4;
		var Nr = w.length/Nb - 1;
		var state = [[],[],[],[]];
		for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];
		state = Aes.addRoundKey(state, w, 0, Nb);
		for (var round=1; round<Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}
		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);
		var output = new Array(4*Nb);
		for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
		return output;
	};
	Aes.keyExpansion = function(key) {
		var Nb = 4;
		var Nk = key.length/4;
		var Nr = Nk + 6;
		var w = new Array(Nb*(Nr+1));
		var temp = new Array(4);
		for (var i=0; i<Nk; i++) {
			var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
			w[i] = r;
		}
		for (var i=Nk; i<(Nb*(Nr+1)); i++) {
			w[i] = new Array(4);
			for (var t=0; t<4; t++) temp[t] = w[i-1][t];
			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
			}
			else if (Nk > 6 && i%Nk == 4) {
				temp = Aes.subWord(temp);
			}
			for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
		}
		return w;
	};
	Aes.subBytes = function(s, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};
	Aes.shiftRows = function(s, Nb) {
		var t = new Array(4);
		for (var r=1; r<4; r++) {
			for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];
			for (var c=0; c<4; c++) s[r][c] = t[c];
		}
		return s;
	};
	Aes.mixColumns = function(s, Nb) {
		for (var c=0; c<4; c++) {
			var a = new Array(4);
			var b = new Array(4);
			for (var i=0; i<4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
			}
			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
		}
		return s;
	};
	Aes.addRoundKey = function(state, w, rnd, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
		}
		return state;
	};
	Aes.subWord = function(w) {
		for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};
	Aes.rotWord = function(w) {
		var tmp = w[0];
		for (var i=0; i<3; i++) w[i] = w[i+1];
		w[3] = tmp;
		return w;
	};
	Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
		0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
		0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
		0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
		0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
		0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
		0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
		0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
		0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
		0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
		0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
		0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
		0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
		0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
		0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
		0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
	Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
		[0x01, 0x00, 0x00, 0x00],
		[0x02, 0x00, 0x00, 0x00],
		[0x04, 0x00, 0x00, 0x00],
		[0x08, 0x00, 0x00, 0x00],
		[0x10, 0x00, 0x00, 0x00],
		[0x20, 0x00, 0x00, 0x00],
		[0x40, 0x00, 0x00, 0x00],
		[0x80, 0x00, 0x00, 0x00],
		[0x1b, 0x00, 0x00, 0x00],
		[0x36, 0x00, 0x00, 0x00] ];
	Aes.Ctr = {};
	Aes.Ctr.encrypt = function(plaintext, password, nBits) {
		var blockSize = 16;
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);
		var nBytes = nBits/8;
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes-16));
		var counterBlock = new Array(blockSize);
		var nonce = (new Date()).getTime();
		var nonceMs = nonce%1000;
		var nonceSec = Math.floor(nonce/1000);
		var nonceRnd = Math.floor(Math.random()*0xffff);
		for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
		for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
		for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
		var ctrTxt = '';
		for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);
		var keySchedule = Aes.keyExpansion(key);
		var blockCount = Math.ceil(plaintext.length/blockSize);
		var ciphertext = '';
		for (var b=0; b<blockCount; b++) {
			for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8);
			var cipherCntr = Aes.cipher(counterBlock, keySchedule);
			var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
			var cipherChar = new Array(blockLength);
			for (var i=0; i<blockLength; i++) {
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
			}
		}
		ciphertext =  base64Encode(ctrTxt+ciphertext);
		return ciphertext;
	};
	Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
		var blockSize = 16;
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);
		var nBytes = nBits/8;
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes-16));
		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
		var keySchedule = Aes.keyExpansion(key);
		var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
		ciphertext = ct;
		var plaintext = '';
		for (var b=0; b<nBlocks; b++) {
			for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;
			var cipherCntr = Aes.cipher(counterBlock, keySchedule);
			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i=0; i<ciphertext[b].length; i++) {
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/nBlocks });
			}
		}
		plaintext = utf8Decode(plaintext);
		return plaintext;
	};
	function utf8Encode(str) {
		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}
	function utf8Decode(str) {
		try {
			return decodeURIComponent( escape( str ) );
		} catch (e) {
			return str;
		}
	}
	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str);
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64');
		throw new Error('No Base64 Encode');
	}
	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str);
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary');
		throw new Error('No Base64 Decode');
	}
}

class JobPrm {
	constructor($p) {
		this.$p = $p;
		this.local_storage_prefix = '';
		this.create_tables = true;
	}
	init(settings) {
		if (typeof settings == 'function')
			settings(this);
	}
	base_url() {
		return this.$p.wsql.get_user_param('rest_path') || this.rest_path || '/a/zd/%1/odata/standard.odata/';
	}
	rest_url() {
		const url = this.base_url();
		const zone = this.$p.wsql.get_user_param('zone', this.zone_is_string ? 'string' : 'number');
		return zone ? url.replace('%1', zone) : url.replace('%1/', '');
	}
	irest_url() {
		const url = this.base_url().replace('odata/standard.odata', 'hs/rest');
		const zone = this.$p.wsql.get_user_param('zone', this.zone_is_string ? 'string' : 'number');
		return zone ? url.replace('%1', zone) : url.replace('%1/', '');
	}
	ajax_attr(attr, url) {
		if (!attr.url)
			attr.url = url;
		if (!attr.username)
			attr.username = this.username;
		if (!attr.password)
			attr.password = this.password;
		attr.hide_headers = true;
	}
}

const alasql$1 = (typeof window != 'undefined' && window.alasql) || require('alasql/dist/alasql.min');
const fake_ls = {
	setItem(name, value) {},
	getItem(name) {}
};
class WSQL {
	constructor($p) {
		this.$p = $p;
		this._params = {};
		this.aladb = new alasql$1.Database('md');
		this.alasql = alasql$1;
		Object.freeze(this);
	}
	get js_time_diff(){ return -(new Date("0001-01-01")).valueOf()}
	get time_diff(){
		var diff = this.get_user_param("time_diff", "number");
		return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
	}
	get _ls() {
		return typeof localStorage === "undefined" ? fake_ls : localStorage;
	}
	init(settings, meta) {
		alasql$1.utils.isBrowserify = false;
		const {job_prm, adapters} = this.$p;
		job_prm.init(settings);
		if (!job_prm.local_storage_prefix && !job_prm.create_tables)
			return;
		var nesessery_params = [
			{p: "user_name", v: "", t: "string"},
			{p: "user_pwd", v: "", t: "string"},
			{p: "browser_uid", v: utils.generate_guid(), t: "string"},
			{
				p: "zone",
				v: job_prm.hasOwnProperty("zone") ? job_prm.zone : 1,
				t: job_prm.zone_is_string ? "string" : "number"
			},
			{p: "enable_save_pwd", v: true, t: "boolean"},
			{p: "rest_path", v: "", t: "string"},
			{p: "couch_path", v: "", t: "string"}
		], zone;
		if (job_prm.additional_params)
			nesessery_params = nesessery_params.concat(job_prm.additional_params);
		if (!this._ls.getItem(job_prm.local_storage_prefix + "zone"))
			zone = job_prm.hasOwnProperty("zone") ? job_prm.zone : 1;
		if (zone !== undefined)
			this.set_user_param("zone", zone);
		nesessery_params.forEach((o) => {
			if (!this.prm_is_set(o.p))
				this.set_user_param(o.p, job_prm.hasOwnProperty(o.p) ? job_prm[o.p] : o.v);
		});
		if(adapters.pouch){
			const pouch_prm = {
				path: this.get_user_param("couch_path", "string") || job_prm.couch_path || "",
				zone: this.get_user_param("zone", "number"),
				prefix: job_prm.local_storage_prefix,
				suffix: this.get_user_param("couch_suffix", "string") || "",
				direct: job_prm.couch_direct || this.get_user_param("couch_direct", "boolean"),
				user_node: job_prm.user_node,
				noreplicate: job_prm.noreplicate,
			};
			if (pouch_prm.path) {
				adapters.pouch.init(pouch_prm);
			}
		}
		meta(this.$p);
	};
	save_options(prefix, options){
		return this.set_user_param(prefix + "_" + options.name, options);
	}
	set_user_param(prm_name, prm_value){
		const {$p, _params, _ls} = this;
		if(typeof prm_value == "object"){
			_params[prm_name] = prm_value;
			prm_value = JSON.stringify(prm_value);
		}
		else if(prm_value === false || prm_value === "false"){
			this._params[prm_name] = false;
			prm_value = "";
		}
		else{
			_params[prm_name] = prm_value;
		}
		_ls.setItem($p.job_prm.local_storage_prefix+prm_name, prm_value);
	}
	get_user_param(prm_name, type){
		const {$p, _params, _ls} = this;
		if(!_params.hasOwnProperty(prm_name) && _ls){
			_params[prm_name] = this.fetch_type(_ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);
		}
		return this._params[prm_name];
	}
	prm_is_set(prm_name) {
		const {$p, _params, _ls} = this;
		return _params.hasOwnProperty(prm_name) || (_ls && _ls.hasOwnProperty($p.job_prm.local_storage_prefix+prm_name))
	}
	restore_options(prefix, options){
		const options_saved = this.get_user_param(prefix + "_" + options.name, "object");
		for(let i in options_saved){
			if(typeof options_saved[i] != "object"){
				options[i] = options_saved[i];
			}
			else{
				if(!options[i]){
					options[i] = {};
				}
				for(let j in options_saved[i]){
					options[i][j] = options_saved[i][j];
				}
			}
		}
		return options;
	}
	fetch_type(prm, type){
		if(type == "object"){
			try{
				prm = JSON.parse(prm);
			}catch(e){
				prm = {};
			}
			return prm;
		}
		else if(type == "number"){
			return utils.fix_number(prm, true);
		}
		else if(type == "date"){
			return utils.fix_date(prm, true);
		}
		else if(type == "boolean"){
			return utils.fix_boolean(prm);
		}
		return prm;
	}
}

class MetaObj {
}
class MetaField {
}
class Meta extends MetaEventEmitter {
	constructor($p) {
		super();
		const _m = {};
		Meta._sys.forEach((patch) => {
			utils._patch(_m, patch);
		});
		Meta._sys.length = 0;
		this.init = function (patch) {
			return utils._patch(_m, patch);
		};
		this.get = function (class_name, field_name) {
			const np = class_name.split('.');
			if (!_m || !_m[np[0]]) {
				return;
			}
			const _meta = _m[np[0]][np[1]];
			if (!field_name) {
				return _meta;
			}
			else if (_meta && _meta.fields[field_name]) {
				return _meta.fields[field_name];
			}
			else if (_meta && _meta.tabular_sections && _meta.tabular_sections[field_name]) {
				return _meta.tabular_sections[field_name];
			}
			const res = {
					multiline_mode: false,
					note: '',
					synonym: '',
					tooltip: '',
					type: {
						is_ref: false,
						types: ['string'],
					},
				},
				is_doc = 'doc,tsk,bp'.indexOf(np[0]) != -1,
				is_cat = 'cat,cch,cacc,tsk'.indexOf(np[0]) != -1;
			if (is_doc && field_name == 'number_doc') {
				res.synonym = 'Номер';
				res.tooltip = 'Номер документа';
				res.type.str_len = 11;
			} else if (is_doc && field_name == 'date') {
				res.synonym = 'Дата';
				res.tooltip = 'Дата документа';
				res.type.date_part = 'date_time';
				res.type.types[0] = 'date';
			} else if (is_doc && field_name == 'posted') {
				res.synonym = 'Проведен';
				res.type.types[0] = 'boolean';
			} else if (is_cat && field_name == 'id') {
				res.synonym = 'Код';
			} else if (is_cat && field_name == 'name') {
				res.synonym = 'Наименование';
			} else if (field_name == '_deleted') {
				res.synonym = 'Пометка удаления';
				res.type.types[0] = 'boolean';
			} else if (field_name == 'is_folder') {
				res.synonym = 'Это группа';
				res.type.types[0] = 'boolean';
			} else if (field_name == 'ref') {
				res.synonym = 'Ссылка';
				res.type.is_ref = true;
				res.type.types[0] = class_name;
			} else {
				return;
			}
			return res;
		};
		this.classes = function () {
			var res = {};
			for (var i in _m) {
				res[i] = [];
				for (var j in _m[i])
					res[i].push(j);
			}
			return res;
		};
		this.bases = function () {
			var res = {};
			for (let i in _m) {
				for (let j in _m[i]) {
					if (_m[i][j].cachable) {
						let _name = _m[i][j].cachable.replace('_remote', '').replace('_ram', '');
						if (_name != 'meta' && _name != 'e1cib' && !res[_name])
							res[_name] = _name;
					}
				}
			}
			return Object.keys(res);
		};
		this.create_tables = function (callback, attr) {
			let cstep = 0, data_names = [], managers = this.classes(),
				create = (attr && attr.postgres) ? '' : 'USE md; ';
			function on_table_created() {
				cstep--;
				if (cstep == 0) {
					if (callback)
						callback(create);
					else
						$p.wsql.alasql.utils.saveFile('create_tables.sql', create);
				} else
					iteration();
			}
			function iteration() {
				var data = data_names[cstep - 1];
				create += data['class'][data.name].get_sql_struct(attr) + '; ';
				on_table_created();
			}
			for (let mgr of 'enm,cch,cacc,cat,bp,tsk,doc,ireg,areg'.split(',')) {
				for (let class_name in managers[mgr]) {
					data_names.push({'class': $p[mgr], 'name': managers[mgr][class_name]});
				}
			}
			cstep = data_names.length;
			iteration();
		};
		this.syns_js = function (v) {
			var synJS = {
				DeletionMark: '_deleted',
				Description: 'name',
				DataVersion: 'data_version',
				IsFolder: 'is_folder',
				Number: 'number_doc',
				Date: 'date',
				Дата: 'date',
				Posted: 'posted',
				Code: 'id',
				Parent_Key: 'parent',
				Owner_Key: 'owner',
				Owner: 'owner',
				Ref_Key: 'ref',
				Ссылка: 'ref',
				LineNumber: 'row',
			};
			if (synJS[v])
				return synJS[v];
			return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
		};
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
				row: 'LineNumber',
			};
			if (syn1c[v])
				return syn1c[v];
			return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
		};
		this.printing_plates = function (pp) {
			if (pp)
				for (var i in pp.doc)
					_m.doc[i].printing_plates = pp.doc[i];
		};
		this.mgr_by_class_name = function (class_name) {
			if (class_name) {
				let np = class_name.split('.');
				if (np[1] && $p[np[0]])
					return $p[np[0]][np[1]];
				const pos = class_name.indexOf('_');
				if (pos) {
					np = [class_name.substr(0, pos), class_name.substr(pos + 1)];
					if (np[1] && $p[np[0]])
						return $p[np[0]][np[1]];
				}
			}
		};
		this.load_doc_ram = function () {
			const res = [];
			const {pouch} = $p.adapters;
			['cat', 'cch', 'ireg'].forEach((kind) => {
				for (let name in _m[kind]) {
					if (_m[kind][name].cachable == 'doc_ram') {
						res.push(kind + '.' + name);
					}
				}
			});
			return pouch.local.doc.find({
				selector: {class_name: {$in: res}},
				limit: 10000,
			})
				.then((data) => pouch.load_changes(data));
		};
	}
	sql_type(mgr, f, mf, pg) {
		var sql;
		if ((f == 'type' && mgr.table_name == 'cch_properties') || (f == 'svg' && mgr.table_name == 'cat_production_params'))
			sql = ' JSON';
		else if (mf.is_ref || mf.types.indexOf('guid') != -1) {
			if (!pg)
				sql = ' CHAR';
			else if (mf.types.every((v) => v.indexOf('enm.') == 0))
				sql = ' character varying(100)';
			else if (!mf.hasOwnProperty('str_len'))
				sql = ' uuid';
			else
				sql = ' character varying(' + Math.max(36, mf.str_len) + ')';
		} else if (mf.hasOwnProperty('str_len'))
			sql = pg ? (mf.str_len ? ' character varying(' + mf.str_len + ')' : ' text') : ' CHAR';
		else if (mf.date_part)
			if (!pg || mf.date_part == 'date')
				sql = ' Date';
			else if (mf.date_part == 'date_time')
				sql = ' timestamp with time zone';
			else
				sql = ' time without time zone';
		else if (mf.hasOwnProperty('digits')) {
			if (mf.fraction_figits == 0)
				sql = pg ? (mf.digits < 7 ? ' integer' : ' bigint') : ' INT';
			else
				sql = pg ? (' numeric(' + mf.digits + ',' + mf.fraction_figits + ')') : ' FLOAT';
		} else if (mf.types.indexOf('boolean') != -1)
			sql = ' BOOLEAN';
		else if (mf.types.indexOf('json') != -1)
			sql = ' JSON';
		else
			sql = pg ? ' character varying(255)' : ' CHAR';
		return sql;
	}
	sql_mask(f, t) {
		return ', ' + (t ? '_t_.' : '') + ('`' + f + '`');
	}
	ts_captions(class_name, ts_name, source) {
		if (!source)
			source = {};
		var mts = this.get(class_name).tabular_sections[ts_name],
			mfrm = this.get(class_name).form,
			fields = mts.fields, mf;
		if (mfrm && mfrm.obj) {
			if (!mfrm.obj.tabular_sections[ts_name])
				return;
			utils._mixin(source, mfrm.obj.tabular_sections[ts_name]);
		} else {
			if (ts_name === 'contact_information')
				fields = {type: '', kind: '', presentation: ''};
			source.fields = ['row'];
			source.headers = '№';
			source.widths = '40';
			source.min_widths = '';
			source.aligns = '';
			source.sortings = 'na';
			source.types = 'cntr';
			for (var f in fields) {
				mf = mts.fields[f];
				if (!mf.hide) {
					source.fields.push(f);
					source.headers += ',' + (mf.synonym ? mf.synonym.replace(/,/g, ' ') : f);
					source.types += ',' + this.control_by_type(mf.type);
					source.sortings += ',na';
				}
			}
		}
		return true;
	}
	class_name_from_1c(name) {
		var pn = name.split('.');
		if (pn.length == 1)
			return 'enm.' + name;
		else if (pn[0] == 'Перечисление')
			name = 'enm.';
		else if (pn[0] == 'Справочник')
			name = 'cat.';
		else if (pn[0] == 'Документ')
			name = 'doc.';
		else if (pn[0] == 'РегистрСведений')
			name = 'ireg.';
		else if (pn[0] == 'РегистрНакопления')
			name = 'areg.';
		else if (pn[0] == 'РегистрБухгалтерии')
			name = 'accreg.';
		else if (pn[0] == 'ПланВидовХарактеристик')
			name = 'cch.';
		else if (pn[0] == 'ПланСчетов')
			name = 'cacc.';
		else if (pn[0] == 'Обработка')
			name = 'dp.';
		else if (pn[0] == 'Отчет')
			name = 'rep.';
		return name + this.syns_js(pn[1]);
	}
	class_name_to_1c(name) {
		var pn = name.split('.');
		if (pn.length == 1)
			return 'Перечисление.' + name;
		else if (pn[0] == 'enm')
			name = 'Перечисление.';
		else if (pn[0] == 'cat')
			name = 'Справочник.';
		else if (pn[0] == 'doc')
			name = 'Документ.';
		else if (pn[0] == 'ireg')
			name = 'РегистрСведений.';
		else if (pn[0] == 'areg')
			name = 'РегистрНакопления.';
		else if (pn[0] == 'accreg')
			name = 'РегистрБухгалтерии.';
		else if (pn[0] == 'cch')
			name = 'ПланВидовХарактеристик.';
		else if (pn[0] == 'cacc')
			name = 'ПланСчетов.';
		else if (pn[0] == 'dp')
			name = 'Обработка.';
		else if (pn[0] == 'rep')
			name = 'Отчет.';
		return name + this.syns_1с(pn[1]);
	}
}
Meta._sys = [{
	enm: {
		accumulation_record_type: [
			{
				order: 0,
				name: 'debit',
				synonym: 'Приход',
			},
			{
				order: 1,
				name: 'credit',
				synonym: 'Расход',
			},
		],
	},
	ireg: {
		log: {
			name: 'log',
			note: '',
			synonym: 'Журнал событий',
			dimensions: {
				date: {
					synonym: 'Дата',
					tooltip: 'Время события',
					type: {
						types: [
							'number',
						],
						digits: 15,
						fraction_figits: 0,
					},
				},
				sequence: {
					synonym: 'Порядок',
					tooltip: 'Порядок следования',
					type: {
						types: [
							'number',
						],
						digits: 6,
						fraction_figits: 0,
					},
				},
			},
			resources: {
				'class': {
					synonym: 'Класс',
					tooltip: 'Класс события',
					type: {
						types: [
							'string',
						],
						str_len: 100,
					},
				},
				note: {
					synonym: 'Комментарий',
					multiline_mode: true,
					tooltip: 'Текст события',
					type: {
						types: [
							'string',
						],
						str_len: 0,
					},
				},
				obj: {
					synonym: 'Объект',
					multiline_mode: true,
					tooltip: 'Объект, к которому относится событие',
					type: {
						types: [
							'string',
						],
						str_len: 0,
					},
				},
			},
		},
	},
}];
Meta.Obj = MetaObj;
Meta.Field = MetaField;

class ManagersCollection {
	constructor($p) {
		this.$p = $p;
	}
	toString(){
		return msg('meta_classes')[this.name];
	}
	create(name, constructor) {
		this[name] = new (constructor || this._constructor)(this, this.name + '.' + name);
	}
}
class Enumerations extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'enm';
		this._constructor = EnumManager$1;
	}
}
class Catalogs extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'cat';
		this._constructor = CatManager$1;
	}
}
class Documents extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'doc';
		this._constructor = DocManager$1;
	}
}
class InfoRegs extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'ireg';
		this._constructor = InfoRegManager;
	}
}
class AccumRegs extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'areg';
		this._constructor = AccumRegManager;
	}
}
class AccountsRegs extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'accreg';
		this._constructor = AccumRegManager;
	}
}
class DataProcessors extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'dp';
		this._constructor = DataProcessorsManager$1;
	}
}
class Reports extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'rep';
		this._constructor = DataProcessorsManager$1;
	}
}
class ChartsOfAccounts extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'cacc';
		this._constructor = ChartOfAccountManager$1;
	}
}
class ChartsOfCharacteristics extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'cch';
		this._constructor = ChartOfCharacteristicManager;
	}
}
class Tasks extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'tsk';
		this._constructor = TaskManager$1;
	}
}
class BusinessProcesses extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'bp';
		this._constructor = BusinessProcessManager$1;
	}
}
function mngrs($p) {
	Object.defineProperties($p, {
		enm: { value: new Enumerations($p) },
		cat: { value: new Catalogs($p) },
		doc: { value: new Documents($p) },
		ireg: { value: new InfoRegs($p) },
		areg: { value: new AccumRegs($p) },
		accreg: { value: new AccountsRegs($p) },
		dp: { value: new DataProcessors($p) },
		rep: { value: new Reports($p) },
		cacc: { value: new ChartsOfAccounts($p) },
		cch: { value: new ChartsOfCharacteristics($p) },
		tsk: { value: new Tasks($p) },
		bp: { value: new BusinessProcesses($p) }
	});
}

class TabularSection$1 {
	constructor(name, owner) {
		if (!owner._obj[name]){
			owner._obj[name] = [];
		}
		Object.defineProperties(this, {
			_name: {
				get: () => name
			},
			_owner: {
				get: () => owner
			},
		});
	}
	toString() {
		return "Табличная часть " + this._owner._manager.class_name + "." + this._name
	}
	get _obj(){
		const {_owner, _name} = this;
		return _owner._obj[_name]
	}
	get(index) {
		const row = this._obj[index];
		return row ? row._row : null
	}
	count() {
		return this._obj.length
	}
	clear(silent) {
		const {_obj, _owner} = this;
		_obj.length = 0;
		if (!silent && !_owner._data._silent){
		}
		return this;
	}
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
		}
		_owner._data._modified = true;
	}
	find(val, columns) {
		var res = utils._find(this._obj, val, columns);
		if (res)
			return res._row;
	}
	find_rows(selection, callback) {
		const cb = callback ? (row) => {
			return callback.call(this, row._row);
		} : null;
		return utils._find_rows.call(this, this._obj, selection, cb);
	}
	swap(rowid1, rowid2) {
		const {_obj} = this;
		[_obj[rowid1], _obj[rowid2]] = [_obj[rowid2], _obj[rowid1]];
		_obj[rowid1].row = rowid2 + 1;
		_obj[rowid2].row = rowid1 + 1;
		if (!this._owner._data._silent){
		}
	}
	add(attr = {}, silent) {
		const {_owner, _name, _obj} = this;
		const row = _owner._manager.obj_constructor(_name, this);
		for (let f in row._metadata().fields){
			row[f] = attr[f] || "";
		}
		row._obj.row = _obj.push(row._obj);
		Object.defineProperty(row._obj, "_row", {
			value: row,
			enumerable: false
		});
		if (!silent && !this._owner._data._silent){
		}
		_owner._data._modified = true;
		return row;
	}
	each(fn) {
		this._obj.forEach((row) => fn.call(this, row._row));
	}
	get forEach() {
		return this.each
	}
	group_by(dimensions, resources) {
		try {
			const res = this.aggregate(dimensions, resources, "SUM", true);
			return this.clear(true).load(res);
		}
		catch (err) {
			this._owner._manager._owner.$p.record_log(err);
		}
	}
	sort(fields) {
		if (typeof fields == "string"){
			fields = fields.split(",");
		}
		let sql = "select * from ? order by ",
			res = true;
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
			this._owner._manager._owner.$p.record_log(err);
		}
	}
	aggregate(dimensions, resources, aggr = "sum", ret_array) {
		if (typeof dimensions == "string"){
			dimensions = dimensions.split(",");
		}
		if (typeof resources == "string"){
			resources = resources.split(",");
		}
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
			this._owner._manager._owner.$p.record_log(err);
		}
	};
	load(aattr) {
		let arr;
		this.clear(true);
		if (aattr instanceof TabularSection$1){
			arr = aattr._obj;
		}
		else if (Array.isArray(aattr)){
			arr = aattr;
		}
		if (arr){
			arr.forEach((row) => {
				this.add(row, true);
			});
		}
		if (!this._owner._data._silent){
		}
		return this;
	}
	unload_column(column) {
		const res = [];
		this.each((row) => {
			res.push(row[column]);
		});
		return res;
	}
	toJSON() {
		return this._obj;
	}
}
class TabularSectionRow$1 {
	constructor(owner) {
		Object.defineProperties(this, {
			_owner: {
				value: owner
			},
			_obj: {
				value: {}
			}
		});
	}
	_metadata(field_name) {
		const {_owner} = this;
		return field_name ? _owner._owner._metadata(_owner._name).fields[field_name] : _owner._owner._metadata(_owner._name)
	}
	get row() {
		return this._obj.row || 0
	}
	_clone() {
		const {_owner, _obj} = this;
		return utils._mixin(_owner._owner._manager.obj_constructor(_owner._name, _owner), _obj)
	}
	get _getter() {
		return DataObj.prototype._getter
	}
	_setter(f, v) {
		const {_owner, _obj} = this;
		const _meta = this._metadata(f);
		if (_obj[f] == v || (!v && _obj[f] == utils.blank.guid))
			return;
		if (!_owner._owner._data._silent){
		}
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


var data_tabulars = Object.freeze({
	TabularSection: TabularSection$1,
	TabularSectionRow: TabularSectionRow$1
});

class AbstracrAdapter extends MetaEventEmitter{
	constructor($p) {
		super();
		this.$p = $p;
	}
	load_obj(tObj) {
		return Promise.resolve(tObj);
	}
	load_array(_mgr, refs, with_attachments) {
		return Promise.resolve([]);
	}
	save_obj(tObj, attr) {
		return Promise.resolve(tObj);
	}
	get_tree(_mgr, attr){
		return Promise.resolve([]);
	}
	get_selection(_mgr, attr){
		return Promise.resolve([]);
	}
	find_rows(_mgr, selection) {
		return Promise.resolve([]);
	}
}

const classes = Object.assign({Meta, MetaEventEmitter, AbstracrAdapter}, data_managers, data_objs, data_tabulars);

class MetaEngine {
	constructor() {
		this.classes = classes;
		this.adapters = {};
		this.aes = new Aes('metadata.js');
		this.job_prm = new JobPrm(this);
		this.wsql = new WSQL(this);
		this.md = new Meta(this);
		mngrs(this);
		this.record_log = this.record_log.bind(this);
		MetaEngine._plugins.forEach((plugin) => plugin.call(this));
		MetaEngine._plugins.length = 0;
	}
	on(type, listener) {
		this.md.on(type, listener);
	}
	off(type, listener) {
		this.md.off(type, listener);
	}
	get version() {
		return '0.12.231';
	}
	toString() {
		return 'Oknosoft data engine. v:' + this.version;
	}
	record_log(err) {
		this && this.ireg && this.ireg.log && this.ireg.log.record(err);
		console && console.log(err);
	}
	get utils() {
		return utils;
	}
	get msg() {
		return msg$1;
	}
	get current_user() {
		const {CatUsers, cat, superlogin, wsql} = this;
		if(CatUsers && !CatUsers.prototype.hasOwnProperty("role_available")){
			CatUsers.prototype.__define({
				role_available: {
					value: (name) => true
				},
				get_acl: {
					value: (class_name) => "rvuidepo"
				},
			});
		}
		let user_name, user;
		if (superlogin) {
			const session = superlogin.getSession();
			user_name = session ? session.user_id : '';
		}
		if (!user_name) {
			user_name = wsql.get_user_param('user_name');
		}
		if (cat && cat.users) {
			user = cat.users.by_id(user_name);
			if (!user || user.empty()) {
				cat.users.find_rows_remote({
					_top: 1,
					id: user_name,
				});
			}
		}
		return user && !user.empty() ? user : null;
	}
	static plugin(obj) {
		if (obj.hasOwnProperty('proto')) {
			if (typeof obj.proto == 'function') {
				obj.proto(MetaEngine);
			}
			else if (typeof obj.proto == 'object') {
				Object.keys(obj.proto).forEach((id) => MetaEngine.prototype[id] = obj.proto[id]);
			}
		}
		if (obj.hasOwnProperty('constructor')) {
			if (typeof obj.constructor != 'function') {
				throw new Error('Invalid plugin: constructor must be a function');
			}
			MetaEngine._plugins.push(obj.constructor);
		}
		return MetaEngine;
	}
}
MetaEngine.classes = classes;
MetaEngine._plugins = [];

var proto = (constructor) => {
	const {DataManager, DataObj, DocObj, TaskObj, BusinessProcessObj} = constructor.classes;
	Object.defineProperties(DataObj.prototype, {
		new_number_doc: {
			value: function (prefix) {
				if (!this._metadata().code_length) {
					return Promise.resolve(this);
				}
				const {date, organization, _manager} = this;
				const {current_user} = _manager._owner.$p;
				if (!prefix) {
					prefix = ((current_user && current_user.prefix) || '') + ((organization && organization.prefix) || '');
				}
				let obj = this,
					part = '',
					year = (date instanceof Date) ? date.getFullYear() : 0,
					code_length = this._metadata().code_length - prefix.length;
				if (_manager.cachable == 'ram') {
					return Promise.resolve(this.new_cat_id(prefix));
				}
				return _manager.pouch_db.query('doc/number_doc',
					{
						limit: 1,
						include_docs: false,
						startkey: [_manager.class_name, year, prefix + '\ufff0'],
						endkey: [_manager.class_name, year, prefix],
						descending: true,
					})
					.then((res) => {
						if (res.rows.length) {
							const num0 = res.rows[0].key[2];
							for (var i = num0.length - 1; i > 0; i--) {
								if (isNaN(parseInt(num0[i])))
									break;
								part = num0[i] + part;
							}
							part = (parseInt(part || 0) + 1).toFixed(0);
						} else {
							part = '1';
						}
						while (part.length < code_length)
							part = '0' + part;
						if (obj instanceof DocObj || obj instanceof TaskObj || obj instanceof BusinessProcessObj)
							obj.number_doc = prefix + part;
						else
							obj.id = prefix + part;
						return obj;
					});
			},
		},
		new_cat_id: {
			value: function (prefix) {
				const {organization, _manager} = this;
				const {current_user, wsql} = _manager._owner.$p;
				if (!prefix)
					prefix = ((current_user && current_user.prefix) || '') +
						(organization && organization.prefix ? organization.prefix : (wsql.get_user_param('zone') + '-'));
				let code_length = this._metadata().code_length - prefix.length,
					field = (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) ? 'number_doc' : 'id',
					part = '',
					res = wsql.alasql('select top 1 ' + field + ' as id from ? where ' + field + ' like "' + prefix + '%" order by ' + field + ' desc', [_manager.alatable]);
				if (res.length) {
					const num0 = res[0].id || '';
					for (var i = num0.length - 1; i > 0; i--) {
						if (isNaN(parseInt(num0[i])))
							break;
						part = num0[i] + part;
					}
					part = (parseInt(part || 0) + 1).toFixed(0);
				} else {
					part = '1';
				}
				while (part.length < code_length)
					part = '0' + part;
				this[field] = prefix + part;
				return this;
			},
		},
	});
	Object.defineProperties(DataManager.prototype, {
		pouch_db: {
			get: function () {
				const cachable = this.cachable.replace("_ram", "");
				const {pouch} = this._owner.$p.adapters;
				if(cachable.indexOf("remote") != -1)
					return pouch.remote[cachable.replace("_remote", "")];
				else
					return pouch.local[cachable] || pouch.remote[cachable];
			}
		},
	});
};

let PouchDB;
if(typeof process !== 'undefined' && process.versions && process.versions.node){
	PouchDB = require('pouchdb-core')
		.plugin(require('pouchdb-adapter-http'))
		.plugin(require('pouchdb-replication'))
		.plugin(require('pouchdb-mapreduce'))
		.plugin(require('pouchdb-find'))
		.plugin(require('pouchdb-adapter-memory'));
}
else{
	if(window.PouchDB){
		PouchDB = window.PouchDB;
	}
	else{
		PouchDB = require('pouchdb-core')
			.plugin(require('pouchdb-adapter-http'))
			.plugin(require('pouchdb-replication'))
			.plugin(require('pouchdb-mapreduce'))
			.plugin(require('pouchdb-find'))
			.plugin(require('pouchdb-authentication'));
		const ua = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
		if(ua.match('safari') && !ua.match('chrome')){
			PouchDB.plugin(require('pouchdb-adapter-websql'));
		}else{
			PouchDB.plugin(require('pouchdb-adapter-idb'));
		}
	}
}
var PouchDB$1 = PouchDB;

function adapter({AbstracrAdapter}) {
	return class AdapterPouch extends AbstracrAdapter {
		constructor($p){
			super($p);
			var t = this,
				_paths = {},
				_local, _remote, _auth, _data_loaded;
			Object.defineProperties(this, {
				init: {
					value: function (attr) {
						Object.assign(_paths, attr);
						if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined"){
							_paths.path = location.protocol + "//" + location.host + _paths.path;
						}
					}
				},
				local: {
					get: function () {
						if(!_local){
							var opts = {auto_compaction: true, revs_limit: 2},
								bases = $p.md.bases();
							_local = { sync: {} };
							["ram", "doc", "meta", "user"].forEach((name) => {
								if(bases.indexOf(name) != -1){
									if(name == "meta"){
										_local[name] = new PouchDB$1(_paths.prefix + "meta", opts);
									}
									else{
										if(_paths.direct){
											_local[name] = this.remote[name];
										}else{
											_local[name] = new PouchDB$1(_paths.prefix + _paths.zone + "_" + name, opts);
										}
									}
								}
							});
						}
						return _local;
					}
				},
				remote: {
					get: function () {
						if(!_remote){
							const opts = {skip_setup: true, adapter: 'http'};
							if(_paths.user_node){
								opts.auth = _paths.user_node;
							}
							_remote = { };
							function dbpath(name) {
								if($p.superlogin){
									return $p.superlogin.getDbUrl(_paths.prefix + (name == "meta" ? name : (_paths.zone + "_" + name)))
								}
								else{
									if(name == "meta"){
										return _paths.path + "meta"
									}
									else if(name == "ram"){
										return _paths.path + _paths.zone + "_ram"
									}
									else{
										return _paths.path + _paths.zone + "_" + name + (_paths.suffix ? "_" + _paths.suffix : "")
									}
								}
							}
							$p.md.bases().forEach((name) => {
								if(name == 'e1cib' || name == 'pgsql'){
									return;
								}
								_remote[name] = new PouchDB$1(dbpath(name), opts);
							});
						}
						return _remote;
					}
				},
				db: {
					value: function(_mgr) {
						const dbid = _mgr.cachable.replace('_remote', '').replace('_ram', '');
						if (dbid.indexOf("remote") != -1 || (
								_paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1
							))
							return this.remote[dbid.replace("_remote", "")];
						else
							return this.local[dbid] || this.remote[dbid];
					}
				},
				log_in: {
					value: function (username, password) {
						if (username == undefined && password == undefined){
							if($p.job_prm.guests && $p.job_prm.guests.length) {
								username = $p.job_prm.guests[0].username;
								password = $p.aes.Ctr.decrypt($p.job_prm.guests[0].password);
							}else{
								return Promise.reject(new Error("username & password not defined"));
							}
						}
						if (_auth) {
							if (_auth.username == username){
								return Promise.resolve();
							} else {
								return Promise.reject(new Error("need logout first"));
							}
						}
						const try_auth = [];
						$p.md.bases().forEach((name) => {
							if(t.remote[name]){
								try_auth.push(
									_paths.user_node ? this.remote[name].info() : this.remote[name].login(username, password)
								);
							}
						});
						return Promise.all(try_auth)
							.then(() => {
								_auth = {username: username};
								setTimeout(() => {
									if($p.wsql.get_user_param("user_name") != username){
										$p.wsql.set_user_param("user_name", username);
									}
									if($p.wsql.get_user_param("enable_save_pwd")){
										if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password){
											$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password));
										}
									}
									else if($p.wsql.get_user_param("user_pwd") != ""){
										$p.wsql.set_user_param("user_pwd", "");
									}
									t.emit('user_log_in', username);
								});
								const sync = {};
								if(_paths.direct) {
									return t.load_data();
								}
								try_auth.length = 0;
								$p.md.bases().forEach((dbid) => {
									if(t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]){
										if(_paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1){
											return
										}
										try_auth.push(t.run_sync(dbid));
									}
								});
								return Promise.all(try_auth);
							})
							.catch(err => {
								t.emit('user_log_fault', err);
							})
					}
				},
				log_out: {
					value: function () {
						if(_auth){
							if(_local.sync.doc){
								try{
									_local.sync.doc.cancel();
								}catch(err){}
							}
							if(_local.sync.ram){
								try{
									_local.sync.ram.cancel();
								}catch(err){}
							}
							_auth = null;
						}
						return _remote.ram.logout()
							.then(() => {
								if(_remote && _remote.doc){
									return _remote.doc.logout()
								}
							})
							.then(() => {
								if(_remote && _remote.ram){
									delete _remote.ram;
								}
								if(_remote && _remote.doc){
									delete _remote.doc;
								}
								_remote = null;
								t.emit('user_log_out');
							})
					}
				},
				reset_local_data: {
					value: function () {
						var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
							destroy_doc = t.local.doc.destroy.bind(t.local.doc),
							do_reload = () => {
								setTimeout(() => {
									location.reload(true);
								}, 1000);
							};
						t.log_out();
						setTimeout(() => {
							destroy_ram()
								.then(destroy_doc)
								.catch(destroy_doc)
								.then(do_reload)
								.catch(do_reload);
						}, 1000);
					}
				},
				load_data: {
					value: function () {
						var options = {
								limit : 800,
								include_docs: true
							},
							_page = {
								total_rows: 0,
								limit: options.limit,
								page: 0,
								start: Date.now()
							};
						return new Promise((resolve, reject) => {
							function fetchNextPage() {
								t.local.ram.allDocs(options, (err, response) => {
									if (response) {
										_page.page++;
										_page.total_rows = response.total_rows;
										_page.duration = Date.now() - _page.start;
										t.emit('pouch_data_page', Object.assign({}, _page));
										if (t.load_changes(response, options)){
											fetchNextPage();
										}
										else{
											t.call_data_loaded(_page);
											resolve();
										}
									}
									else if(err){
										reject(err);
										t.emit('pouch_data_error', "ram", err);
									}
								});
							}
							t.local.ram.info()
								.then((info) => {
									if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){
										t.emit('pouch_load_start', _page);
										fetchNextPage();
									}else{
										t.emit('pouch_no_data', info);
										resolve();
									}
								});
						});
					}
				},
				authorized: {
					get: function () {
						return _auth && _auth.username;
					}
				},
				data_loaded: {
					get: function () {
						return !!_data_loaded;
					}
				},
				call_data_loaded: {
					value: function (page) {
						_data_loaded = true;
						if(!page){
							page = _local.sync._page || {};
						}
						return $p.md.load_doc_ram()
							.then(() => setTimeout(() => t.emit(page.note = 'pouch_data_loaded', page), 1000));
					}
				},
				run_sync: {
					value: function (id){
						let local = t.local[id],
							remote = t.remote[id],
							linfo, _page;
						return local.info()
							.then((info) => {
								linfo = info;
								return remote.info()
							})
							.then((rinfo) => {
								if(id != "ram"){
									return rinfo;
								}
								return remote.get("data_version")
									.then((v) => {
										if(v.version != $p.wsql.get_user_param("couch_ram_data_version")){
											if($p.wsql.get_user_param("couch_ram_data_version")){
												rinfo = t.reset_local_data();
											}
											$p.wsql.set_user_param("couch_ram_data_version", v.version);
										}
										return rinfo;
									})
									.catch((err) => {
										$p.record_log(err);
									})
									.then(() => {
										return rinfo;
									});
							})
							.then((rinfo) => {
								if(!rinfo){
									return;
								}
								if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
									_page = {
										total_rows: rinfo.doc_count,
										local_rows: linfo.doc_count,
										docs_written: 0,
										limit: 300,
										page: 0,
										start: Date.now()
									};
									t.emit('pouch_load_start', _page);
								}else if(id == "doc"){
									setTimeout(() => {
										t.emit('pouch_sync_start');
									});
								}
								var options = {
									live: true,
									retry: true,
									batch_size: 200,
									batches_limit: 6
								};
								if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]){
									options.filter = $p.job_prm.pouch_filter[id];
								}
								else if(id == "meta"){
									options.filter = "auth/meta";
								}
								if(id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo){
									_local.sync[id] = local.replicate.from(remote, options);
								}else{
									_local.sync[id] = local.sync(remote, options);
								}
								_local.sync[id]
									.on('change', (change) => {
										if(id == "ram"){
											t.load_changes(change);
											if(linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
												_page.page++;
												_page.docs_written = change.docs_written;
												_page.duration = Date.now() - _page.start;
												t.emit('pouch_data_page', Object.assign({}, _page));
												if(change.docs.length < _page.limit){
													t.call_data_loaded(_page);
												}
											}
										}else{
											change.update_only = true;
											t.load_changes(change);
										}
										t.emit('pouch_sync_data', id, change);
									})
									.on('paused', (info) => {
										t.emit('pouch_sync_paused', id, info);
									})
									.on('active', (info) => {
										t.emit('pouch_sync_resumed', id, info);
									})
									.on('denied', (info) => {
										t.emit('pouch_sync_denied', id, info);
									})
									.on('error', (err) => {
										t.emit('pouch_sync_error', id, err);
									});
								return _local.sync[id];
							});
					}
				}
			});
		}
		load_obj(tObj) {
			const db = this.db(tObj._manager);
			return db.get(tObj._manager.class_name + "|" + tObj.ref)
				.then((res) => {
					delete res._id;
					delete res._rev;
					Object.assign(tObj, res)._set_loaded();
				})
				.catch((err) => {
					if (err.status != 404)
						throw err;
					else
						console.log({tObj, db});
				})
				.then((res) => {
					return tObj;
				});
		}
		save_obj(tObj, attr) {
			const {_manager, _obj, _data, ref, class_name} = tObj;
			if(!_data || (_data._saving && !_data._modified)){
				return Promise.resolve(tObj);
			}
			if(_data._saving && _data._modified){
				return new Promise((resolve, reject) => {
					setTimeout(() => resolve(this.save_obj(tObj, attr)), 100);
				});
			}
			_data._saving = true;
			const db = this.db(_manager);
			const tmp = Object.assign({_id: class_name + "|" + ref, class_name}, _obj);
			delete tmp.ref;
			if (attr.attachments){
				tmp._attachments = attr.attachments;
			}
			return new Promise((resolve, reject) => {
				const getter = tObj.is_new() ? Promise.resolve() : db.get(tmp._id);
				getter.then((res) => {
					if (res) {
						tmp._rev = res._rev;
						for (var att in res._attachments) {
							if (!tmp._attachments)
								tmp._attachments = {};
							if (!tmp._attachments[att])
								tmp._attachments[att] = res._attachments[att];
						}
					}
				})
					.catch((err) => {
						err && err.status != 404 && reject(err);
					})
					.then(() => {
						return db.put(tmp);
					})
					.then(() => {
						tObj.is_new() && tObj._set_loaded(tObj.ref);
						if (tmp._attachments) {
							if (!tObj._attachments)
								tObj._attachments = {};
							for (var att in tmp._attachments) {
								if (!tObj._attachments[att] || !tmp._attachments[att].stub)
									tObj._attachments[att] = tmp._attachments[att];
							}
						}
						delete _data._saving;
						resolve(tObj);
					})
					.catch((err) => {
						delete _data._saving;
						err && err.status != 404 && reject(err);
					});
			});
		}
		get_tree(_mgr, attr){
		}
		get_selection(_mgr, attr){
		}
		load_array(_mgr, refs, with_attachments) {
			if(!refs.length){
				return Promise.resolve(false);
			}
			const options = {
					limit: refs.length + 1,
					include_docs: true,
					keys: refs.map((v) => _mgr.class_name + "|" + v)
				},
				db = this.db(_mgr);
			if (with_attachments) {
				options.attachments = true;
				options.binary = true;
			}
			return db.allDocs(options).then((result) => this.load_changes(result, {}));
		}
		load_view(_mgr, _view) {
			var doc, res = [],
				db = this.db(_mgr),
				options = {
					limit: 1000,
					include_docs: true,
					startkey: _mgr.class_name + "|",
					endkey: _mgr.class_name + '|\ufff0'
				};
			return new Promise((resolve, reject) => {
				function process_docs(err, result) {
					if (result) {
						if (result.rows.length) {
							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;
							result.rows.forEach((rev) => {
								doc = rev.doc;
								let key = doc._id.split("|");
								doc.ref = key[1];
								res.push(doc);
							});
							_mgr.load_array(res);
							res.length = 0;
							db.query(_view, options, process_docs);
						} else {
							resolve();
						}
					} else if (err) {
						reject(err);
					}
				}
				db.query(_view, options, process_docs);
			});
		}
		find_rows(_mgr, selection) {
			var doc, res = [], utils = this.$p.utils,
				db = this.db(_mgr),
				_raw, _view, _total_count, top, calc_count,
				top_count = 0, skip = 0, skip_count = 0,
				options = {
					limit: 100,
					include_docs: true,
					startkey: _mgr.class_name + "|",
					endkey: _mgr.class_name + '|\ufff0'
				};
			if (selection) {
				if (selection._top) {
					top = selection._top;
					delete selection._top;
				} else
					top = 300;
				if (selection._raw) {
					_raw = selection._raw;
					delete selection._raw;
				}
				if (selection._total_count) {
					_total_count = selection._total_count;
					delete selection._total_count;
				}
				if (selection._view) {
					_view = selection._view;
					delete selection._view;
				}
				if (selection._key) {
					if (selection._key._order_by == "des") {
						options.startkey = selection._key.endkey || selection._key + '\ufff0';
						options.endkey = selection._key.startkey || selection._key;
						options.descending = true;
					} else {
						options.startkey = selection._key.startkey || selection._key;
						options.endkey = selection._key.endkey || selection._key + '\ufff0';
					}
				}
				if (typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}
				if (selection._attachments) {
					options.attachments = true;
					options.binary = true;
					delete selection._attachments;
				}
			}
			if (_total_count) {
				calc_count = true;
				_total_count = 0;
				if (Object.keys(selection).length <= 1) {
					if (selection._key && selection._key.hasOwnProperty("_search")) {
						options.include_docs = false;
						options.limit = 100000;
						return db.query(_view, options)
							.then((result) => {
								result.rows.forEach((row) => {
									if (!selection._key._search || row.key[row.key.length - 1].toLowerCase().indexOf(selection._key._search) != -1) {
										_total_count++;
										if (skip) {
											skip_count++;
											if (skip_count < skip)
												return;
										}
										res.push(row.id);
										if (top) {
											top_count++;
											if (top_count >= top){
												return;
											}
										}
									}
								});
								delete options.startkey;
								delete options.endkey;
								if (options.descending)
									delete options.descending;
								options.keys = res;
								options.include_docs = true;
								return db.allDocs(options);
							})
							.then((result) => {
								return {
									rows: result.rows.map((row) => {
										var doc = row.doc;
										doc.ref = doc._id.split("|")[1];
										if (!_raw) {
											delete doc._id;
											delete doc._rev;
										}
										return doc;
									}),
									_total_count: _total_count
								};
							})
					}
				}
			}
			return new Promise((resolve, reject) => {
				function process_docs(err, result) {
					if (result) {
						if (result.rows.length) {
							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;
							result.rows.forEach((rev) => {
								doc = rev.doc;
								let key = doc._id.split("|");
								doc.ref = key[1];
								if (!_raw) {
									delete doc._id;
									delete doc._rev;
								}
								if (!utils._selection.call(_mgr, doc, selection)){
									return;
								}
								if (calc_count){
									_total_count++;
								}
								if (skip) {
									skip_count++;
									if (skip_count < skip)
										return;
								}
								res.push(doc);
								if (top) {
									top_count++;
									if (top_count >= top){
										return;
									}
								}
							});
							if (top && (top_count >= top || result.rows.length < options.limit) && !calc_count) {
								resolve(_raw ? res : _mgr.load_array(res));
							}
							else{
								fetch_next_page();
							}
						} else {
							if (calc_count) {
								resolve({
									rows: _raw ? res : _mgr.load_array(res),
									_total_count: _total_count
								});
							} else
								resolve(_raw ? res : _mgr.load_array(res));
						}
					} else if (err) {
						reject(err);
					}
				}
				function fetch_next_page() {
					if (_view)
						db.query(_view, options, process_docs);
					else
						db.allDocs(options, process_docs);
				}
				fetch_next_page();
			});
		}
		save_attachment(_mgr, ref, att_id, attachment, type) {
			if (!type)
				type = {type: "text/plain"};
			if (!(attachment instanceof Blob) && type.indexOf("text") == -1)
				attachment = new Blob([attachment], {type: type});
			var _rev,
				db = this.db(_mgr);
			ref = _mgr.class_name + "|" + this.$p.utils.fix_guid(ref);
			return db.get(ref)
				.then((res) => {
					if (res)
						_rev = res._rev;
				})
				.catch((err) => {
					if (err.status != 404)
						throw err;
				})
				.then(() => {
					return db.putAttachment(ref, att_id, _rev, attachment, type);
				});
		}
		get_attachment(_mgr, ref, att_id) {
			return this.db(_mgr).getAttachment(_mgr.class_name + "|" + this.$p.utils.fix_guid(ref), att_id);
		}
		delete_attachment(_mgr, ref, att_id) {
			var _rev,
				db = this.db(_mgr);
			ref = _mgr.class_name + "|" + this.$p.utils.fix_guid(ref);
			return db.get(ref)
				.then((res) => {
					if (res)
						_rev = res._rev;
				})
				.catch((err) => {
					if (err.status != 404)
						throw err;
				})
				.then(() => {
					return db.removeAttachment(ref, att_id, _rev);
				});
		}
		load_changes(changes, options) {
			let docs, doc, res = {}, cn, key, {$p} = this;
			if(!options) {
				if (changes.direction) {
					if (changes.direction != "pull")
						return;
					docs = changes.change.docs;
				}
				else{
					docs = changes.docs;
				}
			}else{
				docs = changes.rows;
			}
			if (docs.length > 0) {
				if (options) {
					options.startkey = docs[docs.length - 1].key;
					options.skip = 1;
				}
				docs.forEach((rev) => {
					doc = options ? rev.doc : rev;
					if (!doc) {
						if ((rev.value && rev.value.deleted))
							doc = {
								_id: rev.id,
								_deleted: true
							};
						else if (rev.error)
							return;
					}
					key = doc._id.split("|");
					cn = key[0].split(".");
					doc.ref = key[1];
					delete doc._id;
					delete doc._rev;
					if (!res[cn[0]])
						res[cn[0]] = {};
					if (!res[cn[0]][cn[1]])
						res[cn[0]][cn[1]] = [];
					res[cn[0]][cn[1]].push(doc);
				});
				for (let mgr in res) {
					for (cn in res[mgr]) {
						if ($p[mgr] && $p[mgr][cn]) {
							$p[mgr][cn].load_array(res[mgr][cn], changes.update_only ? "update_only" : true);
						}
					}
				}
				return true;
			}
			return false;
		}
		backup_database(do_zip){
		}
		restore_database(do_zip){
		}
	}
}
var adapter$1 = (constructor) => {
	const {classes} = constructor;
	classes.PouchDB = PouchDB$1;
	classes.AdapterPouch = adapter(classes);
};

const plugin = {
	proto(constructor) {
		proto(constructor);
		adapter$1(constructor);
	},
	constructor(){
		const {AdapterPouch} = constructor.classes;
		this.adapters.pouch = new AdapterPouch(this);
	}
};

var metadata_abstract_ui_meta = {
	proto(constructor) {
		const {Meta} = constructor.classes;
		Meta._sys.push({
			enm: {
				sort_directions: [
					{
						order: 0,
						name: "asc",
						synonym: "По возрастанию"
					},
					{
						order: 1,
						name: "desc",
						synonym: "По убыванию"
					}
				],
				comparison_types: [
					{
						order: 0,
						name: "gt",
						synonym: "Больше"
					},
					{
						order: 1,
						name: "gte",
						synonym: "Больше или равно"
					},
					{
						order: 2,
						name: "lt",
						synonym: "Меньше"
					},
					{
						order: 3,
						name: "lte",
						synonym: "Меньше или равно "
					},
					{
						order: 4,
						name: "eq",
						synonym: "Равно"
					},
					{
						order: 5,
						name: "ne",
						synonym: "Не равно"
					},
					{
						"order": 6,
						"name": "in",
						"synonym": "В списке"
					},
					{
						order: 7,
						name: "nin",
						synonym: "Не в списке"
					},
					{
						order: 8,
						name: "lke",
						synonym: "Содержит "
					},
					{
						order: 9,
						name: "nlk",
						synonym: "Не содержит"
					}
				],
				label_positions: [
					{
						order: 0,
						name: "auto",
						synonym: "Авто"
					},
					{
						order: 1,
						name: "hide",
						synonym: "Скрыть"
					},
					{
						order: 2,
						name: "left",
						synonym: "Лево"
					},
					{
						order: 3,
						name: "right",
						synonym: "Право"
					},
					{
						order: 4,
						name: "top",
						synonym: "Верх"
					},
					{
						order: 5,
						name: "bottom",
						synonym: "Низ"
					},
				],
				data_field_kinds: [
					{
						order: 0,
						name: "input",
						synonym: "Поле ввода"
					},
					{
						order: 1,
						name: "label",
						synonym: "Поле надписи"
					},
					{
						order: 2,
						name: "toggle",
						synonym: "Поле переключателя"
					},
					{
						order: 3,
						name: "image",
						synonym: "Поле картинки"
					},
					{
						order: 4,
						name: "text",
						synonym: "Редактор многострочного текста"
					},
				]
			},
			cat: {
				meta_objs: {
					fields: {}
				},
				meta_fields: {
					fields: {}
				},
				scheme_settings: {
					name: "scheme_settings",
					synonym: "Настройки отчетов и списков",
					input_by_string: [
						"name"
					],
					hierarchical: false,
					has_owners: false,
					group_hierarchy: true,
					main_presentation_name: true,
					code_length: 0,
					fields: {
						obj: {
							synonym: "Объект",
							tooltip: "Имя класса метаданных",
							type: {
								types: [
									"string"
								],
								str_len: 250
							}
						},
						user: {
							synonym: "Пользователь",
							tooltip: "Если пусто - публичная настройка",
							type: {
								types: [
									"string"
								],
								str_len: 50
							}
						},
						order: {
							synonym: "Порядок",
							tooltip: "Порядок варианта",
							type: {
								types: [
									"number"
								],
								digits: 6,
								fraction_figits: 0,
							}
						},
						query: {
							synonym: "Запрос",
							tooltip: "Индекс CouchDB или текст SQL",
							type: {
								types: [
									"string"
								],
								str_len: 0
							}
						},
						date_from: {
							"synonym": "Начало периода",
							"tooltip": "",
							"type": {
								"types": [
									"date"
								],
								"date_part": "date"
							}
						},
						date_till: {
							"synonym": "Конец периода",
							"tooltip": "",
							"type": {
								"types": [
									"date"
								],
								"date_part": "date"
							}
						},
						formula: {
							synonym: "Формула",
							tooltip: "Формула инициализации",
							type: {
								types: [
									"cat.formulas"
								],
								is_ref: true
							}
						},
						tag: {
							synonym: "Дополнительные свойства",
							type: {
								types: [
									"string"
								],
								str_len: 0
							}
						}
					},
					tabular_sections: {
						fields: {
							name: "fields",
							synonym: "Доступные поля",
							tooltip: "Состав, порядок и ширина колонок",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "Для плоского списка, родитель пустой",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								width: {
									synonym: "Ширина",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 6
									}
								},
								caption: {
									synonym: "Заголовок",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								tooltip: {
									synonym: "Подсказка",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								ctrl_type: {
									synonym: "Тип",
									tooltip: "Тип элемента управления",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								formatter: {
									synonym: "Формат",
									tooltip: "Функция форматирования",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								},
								editor: {
									synonym: "Редактор",
									tooltip: "Компонент редактирования",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								}
							}
						},
						sorting: {
							name: "sorting",
							synonym: "Поля сортировки",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								direction: {
									synonym: "Направление",
									tooltip: "",
									type: {
										types: [
											"enm.sort_directions"
										],
										"is_ref": true
									}
								}
							}
						},
						dimensions: {
							name: "dimensions",
							synonym: "Поля группировки",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								}
							}
						},
						resources: {
							name: "resources",
							synonym: "Ресурсы",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								field: {
									synonym: "Поле",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								formula: {
									synonym: "Формула",
									tooltip: "По умолчанию - сумма",
									type: {
										types: [
											"cat.formulas"
										],
										is_ref: true
									}
								}
							}
						},
						selection: {
							name: "selection",
							synonym: "Отбор",
							tooltip: "",
							fields: {
								parent: {
									synonym: "Родитель",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								left_value: {
									synonym: "Левое значение",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								comparison_type: {
									synonym: "Вид сравнения",
									tooltip: "",
									type: {
										types: [
											"enm.comparison_types"
										],
										is_ref: true
									}
								},
								right_value: {
									synonym: "Правое значение",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								}
							}
						},
						params: {
							name: "params",
							synonym: "Параметры",
							tooltip: "",
							fields: {
								param: {
									synonym: "Параметр",
									tooltip: "",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								value_type: {
									synonym: "Тип",
									tooltip: "Тип значения",
									type: {
										types: [
											"string"
										],
										str_len: 100
									}
								},
								value: {
									synonym: "Значение",
									tooltip: "Может иметь примитивный или ссылочный тип или массив",
									type: {
										types: [
											"string",
											"number",
										],
										str_len: 0,
										digits: 15,
										fraction_figits: 3,
									}
								}
							}
						},
						composition: {
							name: "composition",
							synonym: "Структура",
							tooltip: "",
							fields: {
								parent: {
									"synonym": "Родитель",
									"multiline_mode": false,
									"tooltip": "",
									"type": {
										"types": [
											"string"
										],
										"str_len": 10
									}
								},
								use: {
									synonym: "Использование",
									tooltip: "",
									type: {
										types: [
											"boolean"
										]
									}
								},
								elm: {
									"synonym": "Элемент",
									"tooltip": "Элемент структуры отчета",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								},
								kind: {
									"synonym": "Вид раздела отчета",
									"tooltip": "список, таблица, группировка строк, группировка колонок",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								},
								definition: {
									"synonym": "Описание",
									"tooltip": "Описание раздела структуры",
									"type": {
										"types": [
											"string"
										],
										"str_len": 50
									}
								}
							}
						}
					},
					cachable: "doc"
				}
			},
			dp: {
				scheme_settings: {
					name: "scheme_settings",
					synonym: "Варианты настроек",
					fields: {
						scheme: {
							synonym: "Текущая настройка",
							tooltip: "Текущий вариант настроек",
							mandatory: true,
							type: {
								types: [
									"cat.scheme_settings"
								],
								is_ref: true
							}
						}
					}
				}
			}
		});
	}
};

const ClipboardAction = require('clipboard/lib/clipboard-action');
function tabulars(constructor) {
	const {TabularSection} = constructor.classes;
	Object.defineProperty(TabularSection.prototype, 'export', {
		value: function (format = 'csv', columns = []) {
			const data = [];
			const {utils, wsql} = this._owner._manager._owner.$p;
			const len = columns.length - 1;
			let text;
			this.forEach((row) => {
				const rdata = {};
				columns.forEach((col) => {
					if (utils.is_data_obj(row[col])) {
						if (format == 'json') {
							rdata[col] = {
								ref: row[col].ref,
								type: row[col]._manager.class_name,
								presentation: row[col].presentation,
							};
						}
						else {
							rdata[col] = row[col].presentation;
						}
					}
					else if (typeof(row[col]) == 'number' && format == 'csv') {
						rdata[col] = row[col].toLocaleString('ru-RU', {
							useGrouping: false,
							maximumFractionDigits: 3,
						});
					}
					else if (row[col] instanceof Date && format != 'xls') {
						rdata[col] = utils.moment(row[col]).format(utils.moment._masks.date_time);
					}
					else {
						rdata[col] = row[col];
					}
				});
				data.push(rdata);
			});
			if (format == 'xls') {
				return wsql.alasql.promise(`SELECT * INTO XLSX('${this._name + '_' + utils.moment().format('YYYYMMDDHHmm')}.xlsx',{headers:true}) FROM ? `, [data]);
			}
			else {
				return new Promise((resolve, reject) => {
					if (format == 'json') {
						text = JSON.stringify(data, null, '\t');
					}
					else {
						text = columns.join('\t') + '\n';
						data.forEach((row) => {
							columns.forEach((col, index) => {
								text += row[col];
								if (index < len) {
									text += '\t';
								}
							});
							text += '\n';
						});
					}
					new ClipboardAction({
						action: 'copy',
						text,
						emitter: {emit: resolve},
					});
				});
			}
		},
	});
}

function ui(constructor) {
	Object.defineProperty(constructor.prototype, 'UI', {
		value: {
			control_by_type (type, val) {
				let ft;
				if (typeof val == "boolean" && type.types.indexOf("boolean") != -1) {
					ft = "ch";
				} else if (typeof val == "number" && type.digits) {
					if (type.fraction_figits < 5)
						ft = "calck";
					else
						ft = "edn";
				} else if (val instanceof Date && type.date_part) {
					ft = "dhxCalendar";
				} else if (type.is_ref) {
					ft = "ocombo";
				} else if (type.date_part) {
					ft = "dhxCalendar";
				} else if (type.digits) {
					if (type.fraction_figits < 5)
						ft = "calck";
					else
						ft = "edn";
				} else if (type.types[0] == "boolean") {
					ft = "ch";
				} else if (type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
					ft = "txt";
				} else {
					ft = "ed";
				}
				return ft;
			}
		}
	});
}

function meta_objs() {
	const {classes} = this.constructor;
	const {CatManager, InfoRegManager, CatObj} = this.constructor.classes;
	class MetaObjManager extends CatManager {
	}
	class MetaFieldManager extends CatManager {
	}
	this.CatMeta_objs = class CatMeta_objs extends CatObj {
	};
	this.CatMeta_fields = class CatMeta_fields extends CatObj {
	};
	Object.assign(classes, {MetaObjManager, MetaFieldManager});
	this.cat.create('meta_objs', MetaObjManager);
	this.cat.create('meta_fields', MetaFieldManager);
}

function log_manager() {
	const {classes} = this.constructor;
	class LogManager extends classes.InfoRegManager {
		constructor(owner) {
			super(owner, 'ireg.log');
		}
		record(msg) {
			if (msg instanceof Error) {
				if (console)
					console.log(msg);
				msg = {
					class: 'error',
					note: msg.toString(),
				};
			}
			else if (typeof msg == 'object' && !msg.class && !msg.obj) {
				msg = {
					class: 'obj',
					obj: msg,
					note: msg.note,
				};
			}
			else if (typeof msg != 'object')
				msg = {note: msg};
			msg.date = Date.now() + wsql.time_diff;
			if (!this.smax) {
				this.smax = alasql.compile('select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?');
			}
			var res = this.smax([msg.date]);
			if (!res.length || res[0].sequence === undefined)
				msg.sequence = 0;
			else
				msg.sequence = parseInt(res[0].sequence) + 1;
			if (!msg.class)
				msg.class = 'note';
			wsql.alasql('insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)',
				[msg.date + '¶' + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : '']);
		}
		backup(dfrom, dtill) {
		}
		restore(dfrom, dtill) {
		}
		clear(dfrom, dtill) {
		}
		show(pwnd) {
		}
		get(ref, force_promise, do_not_create) {
			if (typeof ref == 'object')
				ref = ref.ref || '';
			if (!this.by_ref[ref]) {
				if (force_promise === false)
					return undefined;
				var parts = ref.split('¶');
				wsql.alasql('select * from `ireg_log` where date=' + parts[0] + ' and sequence=' + parts[1])
					.forEach(row => new RegisterRow(row, this));
			}
			return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
		}
		get_sql_struct(attr) {
			if (attr && attr.action == 'get_selection') {
				var sql = 'select * from `ireg_log`';
				if (attr.date_from) {
					if (attr.date_till)
						sql += ' where `date` >= ? and `date` <= ?';
					else
						sql += ' where `date` >= ?';
				} else if (attr.date_till)
					sql += ' where `date` <= ?';
				return sql;
			} else
				return classes.InfoRegManager.prototype.get_sql_struct.call(this, attr);
		}
		caption_flds(attr) {
			var _meta = (attr && attr.metadata) || this.metadata(),
				acols = [];
			if (_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;
			} else {
				acols.push(new Col_struct('date', '200', 'ro', 'left', 'server', 'Дата'));
				acols.push(new Col_struct('class', '100', 'ro', 'left', 'server', 'Класс'));
				acols.push(new Col_struct('note', '*', 'ro', 'left', 'server', 'Событие'));
			}
			return acols;
		}
		data_to_grid(data, attr) {
			var xml = '<?xml version="1.0" encoding="UTF-8"?><rows total_count="%1" pos="%2" set_parent="%3">'
					.replace('%1', data.length).replace('%2', attr.start)
					.replace('%3', attr.set_parent || ''),
				caption = this.caption_flds(attr);
			xml += caption.head;
			data.forEach(row => {
				xml += '<row id="' + row.ref + '"><cell>' +
					moment(row.date - wsql.time_diff).format('DD.MM.YYYY HH:mm:ss') + '.' + row.sequence + '</cell>' +
					'<cell>' + (row.class || '') + '</cell><cell>' + (row.note || '') + '</cell></row>';
			});
			return xml + '</rows>';
		}
	}
	this.IregLog = class IregLog extends classes.RegisterRow {
		get date() {
			return this._getter('date');
		}
		set date(v) {
			this._setter('date', v);
		}
		get sequence() {
			return this._getter('sequence');
		}
		set sequence(v) {
			this._setter('sequence', v);
		}
		get class() {
			return this._getter('class');
		}
		set class(v) {
			this._setter('class', v);
		}
		get note() {
			return this._getter('note');
		}
		set note(v) {
			this._setter('note', v);
		}
		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}
	};
	Object.assign(classes, {LogManager});
	this.ireg.create('log', LogManager);
}

function scheme_settings() {
	const {wsql, utils, cat, dp, md, constructor} = this;
	const {CatManager, DataProcessorsManager, DataProcessorObj, CatObj, DocManager, TabularSectionRow} = constructor.classes || this;
	class SchemeSettingsManager extends CatManager {
		get_scheme(class_name) {
			return new Promise((resolve, reject) => {
				const scheme_name = this.scheme_name(class_name);
				const find_scheme = () => {
					const opt = {
						_view: 'doc/scheme_settings',
						_top: 100,
						_skip: 0,
						_key: {
							startkey: [class_name, 0],
							endkey: [class_name, 9999],
						},
					};
					const query = this.find_rows_remote ? this.find_rows_remote(opt) : this.pouch_find_rows(opt);
					query.then((data) => {
						if (data.length == 1) {
							set_default_and_resolve(data[0]);
						}
						else if (data.length) {
							if (!$p.current_user || !$p.current_user.name) {
								set_default_and_resolve(data[0]);
							}
							else {
								const {name} = $p.current_user;
								if (!data.some((scheme) => {
										if (scheme.user == name) {
											set_default_and_resolve(scheme);
											return true;
										}
									})) {
									set_default_and_resolve(data[0]);
								}
							}
						}
						else {
							create_scheme();
						}
					})
						.catch((err) => {
							create_scheme();
						});
				};
				let ref = wsql.get_user_param(scheme_name, 'string');
				function set_default_and_resolve(obj) {
					resolve(obj.set_default());
				}
				function create_scheme() {
					if (!utils.is_guid(ref)) {
						ref = utils.generate_guid();
					}
					cat.scheme_settings.create({ref})
						.then((obj) => obj.fill_default(class_name).save())
						.then((obj) => set_default_and_resolve(obj));
				}
				if (ref) {
					cat.scheme_settings.get(ref, 'promise')
						.then((scheme) => {
							if (scheme && !scheme.is_new()) {
								resolve(scheme);
							}
							else {
								find_scheme();
							}
						})
						.catch((err) => {
							find_scheme();
						});
				} else {
					find_scheme();
				}
			});
		}
		scheme_name(class_name) {
			return 'scheme_settings_' + class_name.replace(/\./g, '_');
		}
	}
	class SchemeSelectManager extends DataProcessorsManager {
		dp(scheme) {
			const _obj = dp.scheme_settings.create();
			_obj.scheme = scheme;
			const _meta = Object.assign({}, this.metadata('scheme'));
			_meta.choice_params = [{
				name: 'obj',
				path: scheme.obj,
			}];
			return {_obj, _meta};
		}
	}
	this.DpScheme_settings = class DpScheme_settings extends DataProcessorObj {
		get scheme() {
			return this._getter('scheme');
		}
		set scheme(v) {
			this._setter('scheme', v);
		}
	};
	this.CatScheme_settings = class CatScheme_settings extends CatObj {
		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}
		get user() {
			return this._getter('user');
		}
		set user(v) {
			this._setter('user', v);
		}
		get order() {
			return this._getter('order');
		}
		set order(v) {
			this._setter('order', v);
		}
		get formula() {
			return this._getter('formula');
		}
		set formula(v) {
			this._setter('formula', v);
		}
		get query() {
			return this._getter('query');
		}
		set query(v) {
			this._setter('query', v);
		}
		get tag() {
			return this._getter('tag');
		}
		set tag(v) {
			this._setter('tag', v);
		}
		get date_from() {
			return this._getter('date_from');
		}
		set date_from(v) {
			this._setter('date_from', v);
		}
		get date_till() {
			return this._getter('date_till');
		}
		set date_till(v) {
			this._setter('date_till', v);
		}
		get fields() {
			return this._getter_ts('fields');
		}
		set fields(v) {
			this._setter_ts('fields', v);
		}
		get sorting() {
			return this._getter_ts('sorting');
		}
		set sorting(v) {
			this._setter_ts('sorting', v);
		}
		get dimensions() {
			return this._getter_ts('dimensions');
		}
		set dimensions(v) {
			this._setter_ts('dimensions', v);
		}
		get resources() {
			return this._getter_ts('resources');
		}
		set resources(v) {
			this._setter_ts('resources', v);
		}
		get selection() {
			return this._getter_ts('selection');
		}
		set selection(v) {
			this._setter_ts('selection', v);
		}
		get params() {
			return this._getter_ts('params');
		}
		set params(v) {
			this._setter_ts('params', v);
		}
		get composition() {
			return this._getter_ts('composition');
		}
		set composition(v) {
			this._setter_ts('composition', v);
		}
		fill_default(class_name) {
			const parts = class_name.split('.'),
				_mgr = md.mgr_by_class_name(class_name),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				columns = [];
			function add_column(fld, use) {
				const id = fld.id || fld,
					fld_meta = _meta.fields[id] || _mgr.metadata(id);
				columns.push({
					field: id,
					caption: fld.caption || fld_meta.synonym,
					tooltip: fld_meta.tooltip,
					width: fld.width || fld_meta.width,
					use: use,
				});
			}
			if (parts.length < 3) {
				if (_meta.form && _meta.form.selection) {
					_meta.form.selection.cols.forEach(fld => {
						add_column(fld, true);
					});
				} else {
					if (_mgr instanceof CatManager) {
						if (_meta.code_length) {
							columns.push('id');
						}
						if (_meta.main_presentation_name) {
							columns.push('name');
						}
					} else if (_mgr instanceof DocManager) {
						columns.push('number_doc');
						columns.push('date');
					}
					columns.forEach((id) => {
						add_column(id, true);
					});
				}
			} else {
				for (var field in _meta.fields) {
					add_column(field, true);
				}
			}
			for (var field in _meta.fields) {
				if (!columns.some(function (column) {
						return column.field == field;
					})) {
					add_column(field, false);
				}
			}
			columns.forEach((column) => {
				this.fields.add(column);
			});
			const {resources} = _mgr.obj_constructor('', true);
			if (resources) {
				resources.forEach(function (column) {
					this.resources.add({field: column});
				});
			}
			this.obj = class_name;
			if (!this.name) {
				this.name = 'Основная';
				this.date_from = new Date((new Date()).getFullYear().toFixed() + '-01-01');
				this.date_till = utils.date_add_day(new Date(), 1);
			}
			return this;
		}
		set_default() {
			wsql.set_user_param(this._manager.scheme_name(this.obj), this.ref);
			return this;
		}
		fix_select(select, key0) {
			const keys = this.query.split('/');
			const {_key, _view} = select;
			let res;
			if (keys.length > 2) {
				key0 = keys[2];
			}
			if (_key.startkey[0] != key0) {
				_key.startkey[0] = _key.endkey[0] = key0;
				res = true;
			}
			if (keys.length > 1) {
				const select_view = keys[0] + '/' + keys[1];
				if (_view != select_view) {
					select._view = select_view;
					res = true;
				}
			}
			if (this.query.match('date')) {
				const {date_from, date_till} = this;
				_key.startkey[1] = date_from.getFullYear();
				_key.startkey[2] = date_from.getMonth() + 1;
				_key.startkey[3] = date_from.getDate();
				_key.endkey[1] = date_till.getFullYear();
				_key.endkey[2] = date_till.getMonth() + 1;
				_key.endkey[3] = date_till.getDate();
			}
			return res;
		}
		columns(mode) {
			const parts = this.obj.split('.'),
				_mgr = md.mgr_by_class_name(this.obj),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				res = [];
			this.fields.find_rows({use: true}, (row) => {
				const fld_meta = _meta.fields[row.field] || _mgr.metadata(row.field);
				let column;
				if (mode == 'ts') {
					column = {
						key: row.field,
						name: row.caption,
						resizable: true,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					};
				} else {
					column = {
						id: row.field,
						synonym: row.caption,
						tooltip: row.tooltip,
						type: fld_meta.type,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					};
				}
				res.push(column);
			});
			return res;
		}
		dims(parent) {
			return this.dimensions._obj.map((row) => row.field);
		}
		used_fields(parent) {
			const res = [];
			this.fields.find_rows({use: true}, (row) => {
				res.push(row.field);
			});
			return res;
		}
		used_fields_list() {
			return this.fields._obj.map((row) => ({
				id: row.field,
				value: row.field,
				text: row.caption,
				title: row.caption,
			}));
		}
	};
	this.CatScheme_settingsDimensionsRow = class CatScheme_settingsDimensionsRow extends TabularSectionRow {
		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}
		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}
		get field() {
			return this._getter('field');
		}
		set field(v) {
			this._setter('field', v);
		}
	};
	this.CatScheme_settingsResourcesRow = class CatScheme_settingsResourcesRow extends this.CatScheme_settingsDimensionsRow {
		get formula() {
			return this._getter('formula');
		}
		set formula(v) {
			this._setter('formula', v);
		}
	};
	this.CatScheme_settingsFieldsRow = class CatScheme_settingsFieldsRow extends this.CatScheme_settingsDimensionsRow {
		get width() {
			return this._getter('width');
		}
		set width(v) {
			this._setter('width', v);
		}
		get caption() {
			return this._getter('caption');
		}
		set caption(v) {
			this._setter('caption', v);
		}
		get tooltip() {
			return this._getter('tooltip');
		}
		set tooltip(v) {
			this._setter('tooltip', v);
		}
		get ctrl_type() {
			return this._getter('ctrl_type');
		}
		set ctrl_type(v) {
			this._setter('ctrl_type', v);
		}
		get formatter() {
			return this._getter('formatter');
		}
		set formatter(v) {
			this._setter('formatter', v);
		}
		get editor() {
			return this._getter('editor');
		}
		set editor(v) {
			this._setter('editor', v);
		}
	};
	this.CatScheme_settingsSortingRow = class CatScheme_settingsSortingRow extends this.CatScheme_settingsDimensionsRow {
		get direction() {
			return this._getter('direction');
		}
		set direction(v) {
			this._setter('direction', v);
		}
	};
	this.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends TabularSectionRow {
		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}
		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}
		get left_value() {
			return this._getter('left_value');
		}
		set left_value(v) {
			this._setter('left_value', v);
		}
		get comparison_type() {
			return this._getter('comparison_type');
		}
		set comparison_type(v) {
			this._setter('comparison_type', v);
		}
		get right_value() {
			return this._getter('right_value');
		}
		set right_value(v) {
			this._setter('right_value', v);
		}
	};
	this.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends TabularSectionRow {
		get param() {
			return this._getter('param');
		}
		set param(v) {
			this._setter('param', v);
		}
		get value() {
			return this._getter('value');
		}
		set value(v) {
			this._setter('value', v);
		}
	};
	this.CatScheme_settingsCompositionRow = class CatScheme_settingsSchemeRow extends this.CatScheme_settingsDimensionsRow {
		get kind() {
			return this._getter('kind');
		}
		set kind(v) {
			this._setter('kind', v);
		}
		get definition() {
			return this._getter('definition');
		}
		set definition(v) {
			this._setter('definition', v);
		}
	};
	cat.create('scheme_settings', SchemeSettingsManager);
	dp.create('scheme_settings', SchemeSelectManager);
}

var metadata_abstract_ui = {
	proto(constructor) {
		ui(constructor);
		tabulars(constructor);
	},
	constructor(){
		meta_objs.call(this);
		log_manager.call(this);
		scheme_settings.call(this);
	}
};

class Col_struct$1 {
  constructor(id,width,type,align,sort,caption){
    this.id = id;
    this.width = width;
    this.type = type;
    this.align = align;
    this.sort = sort;
    this.caption = caption;
  }
}
class InterfaceObjs {
	constructor($p) {
		this.$p = $p;
		this.set_hash = this.set_hash.bind(this);
		this.hash_route = this.hash_route.bind(this);
		this.init_sidebar = this.init_sidebar.bind(this);
		this.check_exit = this.check_exit.bind(this);
	    this.Col_struct = Col_struct$1;
	  }
	get_offset(elm) {
		const offset = {left: 0, top:0};
		if (elm.offsetParent) {
			do {
				offset.left += elm.offsetLeft;
				offset.top += elm.offsetTop;
			} while (elm = elm.offsetParent);
		}
		return offset;
	};
	normalize_xml(str){
		if(!str) return "";
		const entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, (s) => entities[s]);
	};
	scale_svg(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};
		var height = typeof size == "number" ? size : size.height,
			width = typeof size == "number" ? (size * 1.5).round(0) : size.width,
			max_zoom = typeof size == "number" ? Infinity : (size.zoom || Infinity);
		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);
		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if("width,height,x,y".indexOf(svg_current[0]) != -1){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}
		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="' + (svg_j.x || 0) + ' ' + (svg_j.y || 0) + ' ' + (svg_j.width - padding) + ' ' + (svg_j.height - padding) + '"';
		}
		var init_height = svg_j.height,
			init_width = svg_j.width;
		k = (height - padding) / init_height;
		svg_j.height = height;
		svg_j.width = (init_width * k).round(0);
		if(svg_j.width > width){
			k = (width - padding) / init_width;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = width;
		}
		if(k > max_zoom){
			k = max_zoom;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = (init_width * k).round(0);
		}
		svg_j.x = (svg_j.x * k).round(0);
		svg_j.y = (svg_j.y * k).round(0);
		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ' +
			'width="' + svg_j.width + '" ' +
			'height="' + svg_j.height + '" ' +
			'x="' + svg_j.x + '" ' +
			'y="' + svg_j.y + '" ' +
			'xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
	};
	bind_help(wnd, path) {
	  const {msg} = this.$p;
		function frm_help(win){
			if(!win.help_path){
				msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: msg.not_implemented,
				});
				return;
			}
		}
		if(wnd instanceof dhtmlXCellObject) {
		}else{
			if(!wnd.help_path && path)
				wnd.help_path = path;
			wnd.button('help').show();
			wnd.button('help').enable();
			wnd.attachEvent("onHelp", frm_help);
		}
	};
	set_hash(obj, ref, frm, view ) {
		var ext = {},
			hprm = this.$p.job_prm.parse_url();
		if(arguments.length == 1 && typeof obj == "object"){
			ext = obj;
			if(ext.hasOwnProperty("obj")){
				obj = ext.obj;
				delete ext.obj;
			}
			if(ext.hasOwnProperty("ref")){
				ref = ext.ref;
				delete ext.ref;
			}
			if(ext.hasOwnProperty("frm")){
				frm = ext.frm;
				delete ext.frm;
			}
			if(ext.hasOwnProperty("view")){
				view = ext.view;
				delete ext.view;
			}
		}
		if(obj === undefined)
			obj = hprm.obj || "";
		if(ref === undefined)
			ref = hprm.ref || "";
		if(frm === undefined)
			frm = hprm.frm || "";
		if(view === undefined)
			view = hprm.view || "";
		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;
		for(var key in ext){
			hash += "&" + key + "=" + ext[key];
		}
		if(location.hash.substr(1) == hash)
			this.hash_route();
		else
			location.hash = hash;
	};
	hash_route(event) {
	  const {$p, before_route, cancel_bubble, swith_view, docs} = this;
		let hprm = $p.job_prm.parse_url(),
			res = $p.eve.callEvent("hash_route", [hprm]),
			mgr;
		if((res !== false) && (!before_route || before_route(event) !== false)){
			if($p.ajax.authorized){
				if(hprm.ref && typeof _md != "undefined"){
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"](docs, hprm.ref);
				}else if(hprm.view && swith_view){
					swith_view(hprm.view);
				}
			}
		}
    return event && cancel_bubble(event);
	};
	cancel_bubble(e, prevent) {
		const evt = (e || event);
    evt && prevent && evt.preventDefault && evt.preventDefault();
		evt && evt.stopPropagation && evt.stopPropagation();
		if (evt && !evt.cancelBubble){
      evt.cancelBubble = true;
    }
		return false
	};
	init_sidebar(items, buttons, icons_path) {
		this.btn_auth_sync = new this.OBtnAuthSync();
    this.btns_nav = function (wrapper) {
			return this.btn_auth_sync.bind(new this.OTooolBar({
				wrapper: wrapper,
				class_name: 'md_otbnav',
				width: '260px', height: '28px', top: '3px', right: '3px', name: 'right',
				buttons: buttons,
				onclick: function (name) {
          this.main.cells(name).setActive(true);
					return false;
				}
			}))
		};
    this.main = new dhtmlXSideBar({
			parent: document.body,
			icons_path: icons_path || "dist/imgs/",
			width: 180,
			header: true,
			template: "tiles",
			autohide: true,
			items: items,
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
    const {job_prm} = this.$p;
    this.main.attachEvent("onSelect", (id) => {
			var hprm = job_prm.parse_url();
			if(hprm.view != id)
        this.set_hash(hprm.obj, hprm.ref, hprm.frm, id);
      this["view_" + id](this.main.cells(id));
		});
    this.main.progressOn();
		var hprm = job_prm.parse_url();
		if(!hprm.view || this.main.getAllItems().indexOf(hprm.view) == -1){
      this.set_hash(hprm.obj, hprm.ref, hprm.frm, "doc");
		} else
			setTimeout(this.hash_route);
	};
	Setting2col(cont) {
	  const {injected_data, wsql, job_prm, msg} = this.$p;
		cont.attachHTMLString(injected_data['view_settings.html']);
		this.cont = cont.cell.querySelector(".dhx_cell_cont_tabbar");
		this.cont.style.overflow = "auto";
		this.form2 = (function (cont) {
			var form = new dhtmlXForm(cont, [
				{ type:"settings", labelWidth:80, position:"label-left"  },
				{type: "label", labelWidth:320, label: "Адрес CouchDB", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_path", label:"Путь:", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации CouchDB", width: 320}},
				{type: "label", labelWidth:320, label: "Адрес http сервиса 1С", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"rest_path", label:"Путь", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации 1С OData", width: 320}},
				{type: "label", labelWidth:320, label: "Значение разделителя данных", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"zone", label:"Зона:", numberFormat: ["0", "", ""], validate:"NotEmpty,ValidInteger"},
				{type:"template", label:"",value:"", note: {text: "Для неразделенной публикации, зона = 0", width: 320}},
				{type: "label", labelWidth:320, label: "Суффикс базы пользователя", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_suffix", label:"Суффикс:"},
				{type:"template", label:"",value:"",
					note: {text: "Назначается абоненту при регистрации", width: 320}},
				{type:"block", blockOffset: 0, name:"block_buttons", list:[
					{type: "button", name: "save", value: "<i class='fa fa-floppy-o fa-lg'></i>", tooltip: "Применить настройки и перезагрузить программу"},
					{type:"newcolumn"},
					{type: "button", offsetLeft: 20, name: "reset", value: "<i class='fa fa-refresh fa-lg'></i>", tooltip: "Стереть справочники и перезаполнить данными сервера"}
				]
				}
			]);
			form.cont.style.fontSize = "100%";
			["zone", "couch_path", "couch_suffix", "rest_path"].forEach(function (prm) {
				if(prm == "zone")
					form.setItemValue(prm, wsql.get_user_param(prm));
				else
					form.setItemValue(prm, wsql.get_user_param(prm) || job_prm[prm]);
			});
			form.attachEvent("onChange", function (name, value, state){
				wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});
			form.disableItem("couch_suffix");
			if(!job_prm.rest_path)
				form.disableItem("rest_path");
			form.attachEvent("onButtonClick", function(name){
				if(name == "save"){
					wsql.pouch.log_out();
					setTimeout(function () {
						eve.redirect = true;
						location.reload(true);
					}, 1000);
				} else if(name == "reset"){
					dhtmlx.confirm({
						title: "Сброс данных",
						text: "Стереть справочники и перезаполнить данными сервера?",
						cancel: msg.cancel,
						callback: function(btn) {
							if(btn)
								wsql.pouch.reset_local_data();
						}
					});
				}
			});
			return form;
		})(this.cont.querySelector("[name=form2]").firstChild);
		this.form1 = (function (cont) {
			var form = new dhtmlXForm(cont, [
				{ type:"settings", labelWidth:320, position:"label-left"  },
				{type: "label", label: "Тип устройства", className: "label_options"},
				{ type:"block", blockOffset: 0, name:"block_device_type", list:[
					{ type:"settings", labelAlign:"left", position:"label-right"  },
					{ type:"radio" , name:"device_type", labelWidth:120, label:'<i class="fa fa-desktop"></i> Компьютер', value:"desktop"},
					{ type:"newcolumn"   },
					{ type:"radio" , name:"device_type", labelWidth:150, label:'<i class="fa fa-mobile fa-lg"></i> Телефон, планшет', value:"phone"}
				]  },
				{type:"template", label:"",value:"", note: {text: "Класс устройства определяется автоматически, но пользователь может задать его явно", width: 320}},
				{type: "label", label: "Сохранять пароль пользователя", className: "label_options"},
				{type:"checkbox", name:"enable_save_pwd", label:"Разрешить:", labelWidth:90, checked: wsql.get_user_param("enable_save_pwd", "boolean")},
				{type:"template", label:"",value:"", note: {text: "Не рекомендуется, если к компьютеру имеют доступ посторонние лица", width: 320}},
				{type:"template", label:"",value:"", note: {text: "", width: 320}},
				{type: "label", label: "Подключаемые модули", className: "label_options"},
				{type:"input" , position:"label-top", inputWidth: 320, name:"modifiers", label:"Модификаторы:", value: wsql.get_user_param("modifiers"), rows: 3, style:"height:80px;"},
				{type:"template", label:"",value:"", note: {text: "Список дополнительных модулей", width: 320}}
			]);
			form.cont.style.fontSize = "100%";
			form.checkItem("device_type", job_prm.device_type);
			form.attachEvent("onChange", function (name, value, state){
				wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});
			form.disableItem("modifiers");
			form.getInput("modifiers").onchange = function () {
				wsql.set_user_param("modifiers", this.value);
			};
			return form;
		})(this.cont.querySelector("[name=form1]").firstChild);
	}
	do_reload(text, title) {
    const {eve, wsql, msg} = this.$p;
		let confirm_count = 0;
		function do_reload(){
			dhtmlx.confirm({
				title: title || msg.file_new_date_title,
				text: text || msg.file_new_date,
				ok: "Перезагрузка",
				cancel: "Продолжить",
				callback: function(btn) {
					if(btn){
						wsql.pouch.log_out();
						setTimeout(function () {
							eve.redirect = true;
							location.reload(true);
						}, 1000);
					}else{
						confirm_count++;
						setTimeout(do_reload, confirm_count * 30000);
					}
				}
			});
		}
		do_reload();
	}
  check_exit(wnd){
    let do_exit;
    this.w.forEachWindow(function (w) {
      if(w != wnd && (w.isModal() || this.w.getTopmostWindow() == w))
        do_exit = true;
    });
    return do_exit;
  }
}

var widgets = ($p) => {
	const {DataManager, DataObj} = $p.classes;
$p.iface.OBtnAuthSync = function OBtnAuthSync() {
	var bars = [], spin_timer;
	function btn_click(){
		if($p.wsql.pouch.authorized)
			dhtmlx.confirm({
				title: $p.msg.log_out_title,
				text: $p.msg.logged_in + $p.wsql.pouch.authorized + $p.msg.log_out_break,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						$p.wsql.pouch.log_out();
					}
				}
			});
		else
			$p.iface.frm_auth({
				modal_dialog: true
			});
	}
	function set_spin(spin){
		if(spin && spin_timer){
			clearTimeout(spin_timer);
		}else{
			bars.forEach(function (bar) {
				if(spin)
					bar.buttons.sync.innerHTML = '<i class="fa fa-refresh fa-spin md-fa-lg"></i>';
				else{
					if($p.wsql.pouch.authorized)
						bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
					else
						bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
				}
			});
		}
		spin_timer = spin ? setTimeout(set_spin, 3000) : 0;
	}
	function set_auth(){
		bars.forEach(function (bar) {
			if($p.wsql.pouch.authorized){
				bar.buttons.auth.title = "Отключиться от сервера";
				bar.buttons.auth.innerHTML = '<span class="span_user">' + $p.wsql.pouch.authorized + '</span>';
				bar.buttons.sync.title = "Синхронизация выполняется...";
				bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
			}else{
				bar.buttons.auth.title = "Войти на сервер и включить синхронизацию данных";
				bar.buttons.auth.innerHTML = '&nbsp;<i class="fa fa-sign-in md-fa-lg"></i><span class="span_user">Вход...</span>';
				bar.buttons.sync.title = "Синхронизация не выполняется - пользователь не авторизован на сервере";
				bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
			}
		});
	}
	this.bind = function (bar) {
		bar.buttons.auth.onclick = btn_click;
		bar.buttons.sync.onclick = null;
		bars.push(bar);
		setTimeout(set_auth);
		return bar;
	};
	$p.on({
		pouch_load_data_start: function (page) {
			if(!$p.iface.sync)
				$p.iface.wnd_sync();
			$p.iface.sync.create($p.eve.stepper);
			$p.eve.stepper.frm_sync.setItemValue("text_bottom", "Читаем справочники");
			if(page.hasOwnProperty("local_rows") && page.local_rows < 10){
				$p.eve.stepper.wnd_sync.setText("Первый запуск - подготовка данных");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
			}else{
				$p.eve.stepper.wnd_sync.setText("Загрузка данных из IndexedDB");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Извлечение начального образа");
			}
			set_spin(true);
		},
		pouch_load_data_page: function (page) {
			set_spin(true);
			var stepper = $p.eve.stepper;
			if(stepper.wnd_sync){
			  var curr = stepper[page.id || "ram"];
        curr.total_rows = page.total_rows;
        curr.page = page.page;
        curr.docs_written = page.docs_written || page.page * page.limit;
        if(curr.docs_written > curr.total_rows){
          curr.total_rows = (curr.docs_written * 1.05).round(0);
        }
        var text_current, text_bottom;
        if(!stepper.doc.docs_written){
          text_current = "Обработано элементов: " + curr.docs_written + " из " + curr.total_rows;
          text_bottom = "Текущий запрос: " + curr.page + " (" + (100 * curr.docs_written/curr.total_rows).toFixed(0) + "%)";
        }
        else{
          var docs_written = stepper.ram.docs_written + stepper.doc.docs_written;
          var total_rows = stepper.ram.total_rows + stepper.doc.total_rows;
          curr = stepper.ram.page + stepper.doc.page;
          text_current = "Обработано ram: " + stepper.ram.docs_written + " из " + stepper.ram.total_rows + "<br />" +
            "Обработано doc: " + stepper.doc.docs_written + " из " + stepper.doc.total_rows;
          text_bottom = "Текущий запрос: " + curr + " (" + (100 * docs_written/total_rows).toFixed(0) + "%)";
        }
        stepper.frm_sync.setItemValue("text_current", text_current);
        stepper.frm_sync.setItemValue("text_bottom", text_bottom);
			}
		},
		pouch_change: function (id, page) {
			set_spin(true);
		},
		pouch_data_loaded: function (page) {
			$p.eve.stepper.wnd_sync && $p.iface.sync.close();
		},
		pouch_load_data_error: function (err) {
			set_spin();
			$p.eve.stepper.wnd_sync && $p.iface.sync.close();
		},
		user_log_in: function (username) {
			set_auth();
		},
		user_log_fault: function () {
			set_auth();
		},
		user_log_out: function () {
			set_auth();
		}
	});
};
var eXcell_proto = new eXcell();
eXcell_proto.input_keydown = function(e, t){
	function obj_on_select(v){
		if(t.source.on_select)
			t.source.on_select.call(t.source, v);
	}
	if(e.keyCode === 8 || e.keyCode === 46){
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source, "");
	}else if(e.keyCode === 9 || e.keyCode === 13)
		t.grid.editStop();
	else if(e.keyCode === 115)
		t.cell.firstChild.childNodes[1].onclick(e);
	else if(e.keyCode === 113){
		if(t.source.tabular_section){
			t.mgr = _md.value_mgr(t.source.row, t.source.col, t.source.row._metadata.fields[t.source.col].type);
			if(t.mgr){
				var tv = t.source.row[t.source.col];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}else if(t.fpath.length==1){
			t.mgr = _md.value_mgr(t.source.o._obj, t.fpath[0], t.source.o._metadata.fields[t.fpath[0]].type);
			if(t.mgr){
				var tv = t.source.o[t.fpath[0]];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}
	}
	return $p.iface.cancel_bubble(e);
};
function eXcell_ocombo(cell){
	if (!cell)
		return;
	var t = this;
	t.cell = cell;
	t.grid = cell.parentNode.grid;
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : (val || ""));
	};
	t.getValue=function(){
		return t.grid.get_cell_value();
	};
	t.shiftNext = function () {
		t.grid.editStop();
	};
	t.edit=function(){
		if(t.combo)
			return;
		t.val = t.getValue();
		t.cell.innerHTML = "";
		t.combo = new OCombo({
			parent: t.cell,
			grid: t.grid
		}._mixin(t.grid.get_cell_field()));
		t.combo.getInput().focus();
	};
  t.open_selection = function () {
    t.edit();
    t.combo && t.combo.open_selection && t.combo.open_selection();
  };
	t.detach=function(){
		if(t.combo){
			if(t.combo.getComboText){
				t.setValue(t.combo.getComboText());
				if(!t.combo.getSelectedValue())
					t.combo.callEvent("onChange");
				var res = !$p.utils.is_equal(t.val, t.getValue());
				t.combo.unload();
				return res;
			} else if(t.combo.unload){
				t.combo.unload();
			}
		}
		return true;
	};
}
eXcell_ocombo.prototype = eXcell_proto;
window.eXcell_ocombo = eXcell_ocombo;
window.eXcell_ref = eXcell_ocombo;
window.eXcell_refc = eXcell_ocombo;
function eXcell_pwd(cell){
	var fnedit;
	if (cell){
		this.cell = cell;
		this.grid = cell.parentNode.grid;
		eXcell_ed.call(this);
		fnedit = this.edit;
		this.edit = function(){
			fnedit.call(this);
			this.obj.type="password";
		};
		this.setValue=function(){
			this.setCValue("*********");
		};
		this.getValue=function(){
			return this.grid.get_cell_value();
		};
		this.detach=function(){
			if(this.grid.get_cell_field){
				var cf = this.grid.get_cell_field();
				cf.obj[cf.field] = this.obj.value;
			}
			this.setValue();
			fnedit = null;
			return this.val != this.getValue();
		};
	}
}
eXcell_pwd.prototype = eXcell_proto;
window.eXcell_pwd = eXcell_pwd;
dhtmlXCalendarObject.prototype._dateToStr = function(val, format) {
	if(val instanceof Date && val.getFullYear() < 1000)
		return "";
	else
		return window.dhx4.date2str(val, format||this._dateFormat, this._dateStrings());
};
eXcell_dhxCalendar.prototype.edit = function() {
	var arPos = this.grid.getPosition(this.cell);
	this.grid._grid_calendarA._show(false, false);
	this.grid._grid_calendarA.setPosition(arPos[0],arPos[1]+this.cell.offsetHeight);
	this.grid._grid_calendarA._last_operation_calendar = false;
	this.grid.callEvent("onCalendarShow", [this.grid._grid_calendarA, this.cell.parentNode.idd, this.cell._cellIndex]);
	this.cell._cediton = true;
	this.val = this.cell.val;
	if(this.val instanceof Date && this.val.getFullYear() < 1000)
		this.val = new Date();
	this._val = this.cell.innerHTML;
	var t = this.grid._grid_calendarA.draw;
	this.grid._grid_calendarA.draw = function(){};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d.%m.%Y"));
	this.grid._grid_calendarA.setDate(this.val||(new Date()));
	this.grid._grid_calendarA.draw = t;
};
eXcell_dhxCalendar.prototype.setCValue = function(val, val2){
	this.cell.innerHTML = val instanceof Date ? this.grid._grid_calendarA._dateToStr(val) : val;
	this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString();
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		(arguments.length > 1 ? val2 : val)
	]);
};
(function(){
	function fix_auth(t, method, url, async){
		if(url.indexOf("odata/standard.odata") != -1 || url.indexOf("/hs/rest") != -1){
			var username, password;
			if($p.ajax.authorized){
				username = $p.ajax.username;
				password = $p.aes.Ctr.decrypt($p.ajax.password);
			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
				}
			}
			t.open(method, url, async, username, password);
			t.withCredentials = true;
			t.setRequestHeader("Authorization", "Basic " +
				btoa(unescape(encodeURIComponent(username + ":" + password))));
		}else
			t.open(method, url, async);
	}
	dhx4.ajax._call = function(method, url, postData, async, onLoad, longParams, headers) {
		var t = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		var isQt = (navigator.userAgent.match(/AppleWebKit/) != null && navigator.userAgent.match(/Qt/) != null && navigator.userAgent.match(/Safari/) != null);
		if (async == true) {
			t.onreadystatechange = function() {
				if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) {
					if (t.status != 200 || t.responseText == "")
						if (!dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}])) return;
					window.setTimeout(function(){
						if (typeof(onLoad) == "function") {
							onLoad.apply(window, [{xmlDoc:t, filePath:url, async:async}]);
						}
						if (longParams != null) {
							if (typeof(longParams.postData) != "undefined") {
								dhx4.ajax.postLong(longParams.url, longParams.postData, onLoad);
							} else {
								dhx4.ajax.getLong(longParams.url, onLoad);
							}
						}
						onLoad = null;
						t = null;
					},1);
				}
			};
		}
		if (method == "GET") {
			url += this._dhxr(url);
		}
		t.open(method, url, async);
		fix_auth(t, method, url, async);
		if (headers != null) {
			for (var key in headers) t.setRequestHeader(key, headers[key]);
		} else if (method == "POST" || method == "PUT" || method == "DELETE") {
			t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else if (method == "GET") {
			postData = null;
		}
		t.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		t.send(postData);
		if (async != true) {
			if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) {
				if (t.status != 200 || t.responseText == "") dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}]);
			}
		}
		return {xmlDoc:t, filePath:url, async:async};
	};
	dhtmlx.ajax.prototype.send = function(url,params,call){
		var x=this.getXHR();
		if (typeof call == "function")
			call = [call];
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhtmlx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));
			}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}
		fix_auth(x, this.post?"POST":"GET",url,!this._sync);
		if (this.post)
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		var self=this;
		x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				if (call && self)
					for (var i=0; i < call.length; i++)
						if (call[i])
							call[i].call((self.master||self),x.responseText,x.responseXML,x);
				self.master=null;
				call=self=null;
			}
		};
		x.send(params||null);
		return x;
	};
})();
dhtmlXCellObject.prototype.is_visible = function () {
	var rect = this.cell.getBoundingClientRect();
	return rect.right > 0 && rect.bottom > 0;
};
$p.iface.data_to_grid = function (data, attr){
	if(this.data_to_grid)
		return this.data_to_grid(data, attr);
	function cat_picture_class(r){
		var res;
		if(r.hasOwnProperty("posted")){
			res = r.posted ? "cell_doc_posted" : "cell_doc";
		}else{
			res = r.is_folder ? "cell_ref_folder" : "cell_ref_elm";
		}
		if(r._deleted)
			res = res + "_deleted";
		return res ;
	}
	function do_format(v){
		if(v instanceof Date){
			if(v.getHours() || v.getMinutes())
				return $p.moment(v).format($p.moment._masks.date_time);
			else
				return $p.moment(v).format($p.moment._masks.date);
		}else
			return typeof v == "number" ? v : $p.iface.normalize_xml(v || "");
	}
	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", attr._total_count || data.length)
      .replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);
	xml += caption.head;
	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r[caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r[caption.acols[col].id]) + "</cell>";
		xml += "</row>";
	});
	return xml + "</rows>";
};
$p.iface.data_to_tree = function (data) {
	var res = [{id: $p.utils.blank.guid, text: "..."}];
	function add_hierarchically(arr, row){
		var curr = {id: row.ref, text: row.presentation, items: []};
		arr.push(curr);
		$p._find_rows(data, {parent: row.ref}, function(r){
			add_hierarchically(curr.items, r);
		});
		if(!curr.items.length)
			delete curr.items;
	}
	$p._find_rows(data, {parent: $p.utils.blank.guid}, function(r){
		add_hierarchically(res, r);
	});
	return res;
};
function ODropdownList(attr){
	var ul = document.createElement('ul'), li, div, a;
	function set_order_text(silent){
		a.innerHTML = attr.values[a.getAttribute("current")];
		if(attr.event_name && !silent)
			dhx4.callEvent(attr.event_name, [a.getAttribute("current")]);
	}
	function body_click(){
		div.classList.remove("open");
	}
	attr.container.innerHTML = '<div class="dropdown_list">' + attr.title + '<a href="#" class="dropdown_list"></a></div>';
	div = attr.container.firstChild;
	a = div.querySelector("a");
	a.setAttribute("current", Array.isArray(attr.values) ? "0" : Object.keys(attr.values)[0]);
	div.onclick = function (e) {
		if(!div.classList.contains("open")){
			div.classList.add("open");
		}else{
			if(e.target.tagName == "LI"){
				for(var i in ul.childNodes){
					if(ul.childNodes[i] == e.target){
						a.setAttribute("current", e.target.getAttribute("current"));
						set_order_text();
						break;
					}
				}
			}
			body_click();
		}
		return $p.iface.cancel_bubble(e);
	};
	div.appendChild(ul);
	ul.className = "dropdown_menu";
	if(attr.class_name){
		div.classList.add(attr.class_name);
		ul.classList.add(attr.class_name);
	}
	for(var i in attr.values){
		li = document.createElement('li');
		var pos = attr.values[i].indexOf('<i');
		li.innerHTML = attr.values[i].substr(pos) + " " + attr.values[i].substr(0, pos);
		li.setAttribute("current", i);
		ul.appendChild(li);
	}
	document.body.addEventListener("keydown", function (e) {
		if(e.keyCode == 27) {
			div.classList.remove("open");
		}
	});
	document.body.addEventListener("click", body_click);
	this.unload = function () {
		var child;
		while (child = div.lastChild)
			div.removeChild(child);
		attr.container.removeChild(div);
		li = ul = div = a = attr = null;
	};
	set_order_text(true);
}
$p.iface.ODropdownList = ODropdownList;
dhtmlXCellObject.prototype.attachDynTree = function(mgr, filter, callback) {
	if(this.setCollapsedText)
		this.setCollapsedText("Дерево");
	if(!filter)
		filter = {is_folder: true};
	var tree = this.attachTreeView();
	tree.__define({
		filter: {
			get: function () {
			},
			set: function (v) {
				filter = v;
			},
			enumerable: false,
			configurable: false
		}
	});
	setTimeout(function () {
		mgr.sync_grid({
			action: "get_tree",
			filter: filter
		}, tree)
			.then(function (res) {
				if(callback)
					callback(res);
			});
	});
	return tree;
};
function OCombo(attr){
	var _obj, _field, _meta, _mgr, _property, popup_focused,
		t = this,
		_pwnd = {
			on_select: attr.on_select || function (selv) {
				_obj[_field] = selv;
			}
		};
	if(attr.pwnd && attr.pwnd.setModal)
		_pwnd.setModal = attr.pwnd.setModal.bind(attr.pwnd);
	OCombo.superclass.constructor.call(t, attr);
	if(attr.on_select){
		t.getBase().style.border = "none";
		t.getInput().style.left = "-3px";
		if(!attr.is_tabular)
			t.getButton().style.right = "9px";
	} else
		t.getBase().style.marginBottom = "4px";
	if(attr.left)
		t.getBase().style.left = left + "px";
	this.attachEvent("onChange", function(){
		if(_obj && _field){
		  var val = this.getSelectedValue();
		  if(!val && this.getComboText()){
        val = this.getOptionByLabel(this.getComboText());
        if(val){
          val = val.value;
        }
        else{
          this.setComboText("");
        }
      }
      _obj[_field] = val;
    }
	});
	this.attachEvent("onBlur", function(){
		if(!this.getSelectedValue() && this.getComboText()){
      this.setComboText("");
    }
	});
	this.attachEvent("onDynXLS", function (text) {
	  if(!_meta){
	    return;
    }
		if(!_mgr){
      _mgr = _md.value_mgr(_obj, _field, _meta.type);
    }
		if(_mgr){
			t.clearAll();
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, null, get_filter(text))
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						t.openSelect();
					}
				});
		}
	});
	function get_filter(text){
		var filter = {_top: 30}, choice;
		if(_mgr && _mgr.metadata().hierarchical && _mgr.metadata().group_hierarchy){
			if(_meta.choice_groups_elm == "elm")
				filter.is_folder = false;
			else if(_meta.choice_groups_elm == "grp" || _field == "parent")
				filter.is_folder = true;
		}
		if(_meta.choice_links)
			_meta.choice_links.forEach(function (choice) {
				if(choice.name && choice.name[0] == "selection"){
					if(_obj instanceof TabularSectionRow){
						if(choice.path.length < 2)
							filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj._owner._owner[choice.path[0]];
						else{
							if(choice.name[1] == "owner" && !_mgr.metadata().has_owners){
								return;
							}
							filter[choice.name[1]] = _obj[choice.path[1]];
						}
					}else{
						filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj[choice.path[0]];
					}
				}
			});
		if(_meta.choice_params)
			_meta.choice_params.forEach(function (choice) {
				var fval = Array.isArray(choice.path) ? {in: choice.path} : choice.path;
				if(!filter[choice.name])
					filter[choice.name] = fval;
				else if(Array.isArray(filter[choice.name]))
					filter[choice.name].push(fval);
				else{
					filter[choice.name] = [filter[choice.name]];
					filter[choice.name].push(fval);
				}
			});
		if(_meta._option_list_local){
			filter._local = true;
		}
		if(text){
			filter.presentation = {like: text};
		}
		if(attr.property && attr.property.filter_params_links){
			attr.property.filter_params_links(filter, attr);
		}
		return filter;
	}
	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {
					initial_value: _obj[_field].ref,
					selection: [get_filter()]
				});
			else
				aclick.call({name: "type"});
		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj(attr.pwnd);
					});
		}
		else if(this.name == "open"){
			if(_obj && _obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj(attr.pwnd);
		}
		else if(_meta && this.name == "type"){
			var tlist = [], tmgr, tmeta, tobj = _obj, tfield = _field;
			_meta.type.types.forEach(function (o) {
				tmgr = _md.mgr_by_class_name(o);
				tmeta = tmgr.metadata();
				tlist.push({
					presentation: tmeta.synonym || tmeta.name,
					mgr: tmgr,
					selected: _mgr === tmgr
				});
			});
			$p.iface.select_from_list(tlist)
				.then(function(v){
					if(tobj[tfield] && ((tobj[tfield].empty && tobj[tfield].empty()) || tobj[tfield]._manager != v.mgr)){
						_mgr = v.mgr;
						_obj = tobj;
						_field = tfield;
						_meta = _obj._metadata.fields[_field];
						_mgr.form_selection({
							on_select: function (selv) {
								_obj[_field] = selv;
								_obj = null;
								_field = null;
								_meta = null;
							}}, {
							selection: [get_filter()]
						});
					}
					_mgr = null;
					tmgr = null;
					tmeta = null;
					tobj = null;
					tfield = null;
				});
		}
		if(e)
			return $p.iface.cancel_bubble(e);
	}
	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused){
				if($p.iface.popup.p && $p.iface.popup.p.onmouseover)
					$p.iface.popup.p.onmouseover = null;
				if($p.iface.popup.p && $p.iface.popup.p.onmouseout)
					$p.iface.popup.p.onmouseout = null;
				$p.iface.popup.clear();
				$p.iface.popup.hide();
			}
		}, 300);
	}
	function popup_show(){
		if(!_mgr || !_mgr.class_name || _mgr instanceof EnumManager){
      return;
    }
		popup_focused = true;
		var div = document.createElement('div'),
			innerHTML = attr.hide_frm ? "" : "<a href='#' name='select' title='Форма выбора {F4}'>Показать все</a>" +
				"<a href='#' name='open' style='margin-left: 9px;' title='Открыть форму элемента {Ctrl+Shift+F4}'><i class='fa fa-external-link fa-fw'></i></a>";
		if(!attr.hide_frm){
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			if(_acl.indexOf("i") != -1)
				innerHTML += "&nbsp;<a href='#' name='add' title='Создать новый элемент {F8}'><i class='fa fa-plus fa-fwfa-fw'></i></a>";
		}
		if(_meta.type.types.length > 1)
			innerHTML += "&nbsp;<a href='#' name='type' title='Выбрать тип значения {Alt+T}'><i class='fa fa-level-up fa-fw'></i></a>";
		if(innerHTML){
			div.innerHTML = innerHTML;
			for(var i=0; i<div.children.length; i++)
				div.children[i].onclick = aclick;
			$p.iface.popup.clear();
			$p.iface.popup.attachObject(div);
			$p.iface.popup.show(dhx4.absLeft(t.getButton())-77, dhx4.absTop(t.getButton()), t.getButton().offsetWidth, t.getButton().offsetHeight);
			$p.iface.popup.p.onmouseover = function(){
				popup_focused = true;
			};
			$p.iface.popup.p.onmouseout = popup_hide;
		}
	}
	function oncontextmenu(e) {
		setTimeout(popup_show, 10);
		e.preventDefault();
		return false;
	}
	function onkeyup(e) {
		if(!_mgr || _mgr instanceof EnumManager){
      return;
    }
		if(e.keyCode == 115){
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj(attr.pwnd);
			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.iface.cancel_bubble(e);
		}
	}
	function onfocus(e) {
		setTimeout(function () {
			if(t && t.getInput)
				t.getInput().select();
		}, 50);
	}
	t.getButton().addEventListener("mouseover", popup_show);
	t.getButton().addEventListener("mouseout", popup_hide);
	t.getBase().addEventListener("click", $p.iface.cancel_bubble);
	t.getBase().addEventListener("contextmenu", oncontextmenu);
	t.getInput().addEventListener("keyup", onkeyup);
	t.getInput().addEventListener("focus", onfocus);
	function observer(changes){
		if(!t || !t.getBase)
			return;
		else if(!t.getBase().parentElement)
			setTimeout(t.unload);
		else{
			if(_obj instanceof TabularSectionRow){
			}else
				changes.forEach(function(change){
					if(change.name == _field){
						set_value(_obj[_field]);
					}
				});
		}
	}
	function set_value(v){
		if(v && v instanceof DataObj && !v.empty()){
			if(!t.getOption(v.ref))
				t.addOption(v.ref, v.presentation);
			if(t.getSelectedValue() == v.ref)
				return;
			t.setComboValue(v.ref);
		}else if(!t.getSelectedValue()){
			t.setComboValue("");
			t.setComboText("");
		}
	}
	this.attach = function (attr) {
		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}
		_obj = attr.obj;
		_field = attr.field;
		_property = attr.property;
		if(attr.metadata)
			_meta = attr.metadata;
		else if(_property){
			_meta = _obj._metadata.fields[_field]._clone();
			_meta.type = _property.type;
		}else
			_meta = _obj._metadata.fields[_field];
		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);
		if(_mgr || attr.get_option_list){
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, _obj[_field], get_filter())
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						set_value(_obj[_field]);
					}
				});
		}
		if(_obj instanceof TabularSectionRow)
			Object.observe(_obj._owner._owner, observer, ["row"]);
		else
			Object.observe(_obj, observer, ["update"]);
	};
  this.open_selection = function () {
    aclick.call({name: "select"});
  };
	var _unload = this.unload;
	this.unload = function () {
		popup_hide();
		t.getButton().removeEventListener("mouseover", popup_show);
		t.getButton().removeEventListener("mouseout", popup_hide);
		t.getBase().removeEventListener("click", $p.iface.cancel_bubble);
		t.getBase().removeEventListener("contextmenu", oncontextmenu);
		t.getInput().removeEventListener("keyup", onkeyup);
		t.getInput().removeEventListener("focus", onfocus);
		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}
		if(t.conf && t.conf.tm_confirm_blur)
			clearTimeout(t.conf.tm_confirm_blur);
		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		try{ _unload.call(t); }catch(e){}
	};
	if(attr.obj && attr.field)
		this.attach(attr);
	this.enableFilteringMode("between", "dummy", false, false);
	this.__define({
		value: {
			get: function () {
				if(_obj)
					return _obj[_field];
			}
		}
	});
}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;
$p.iface.select_from_list = function (list, multy) {
	return new Promise(function(resolve, reject){
		if(!Array.isArray(list) || !list.length)
			resolve(undefined);
		else if(list.length == 1)
			resolve(list[0]);
		var options = {
				name: 'wnd_select_from_list',
				wnd: {
					id: 'wnd_select_from_list',
					width: 300,
					height: 300,
					modal: true,
					center: true,
					caption: $p.msg.select_from_list,
					allow_close: true,
					on_close: function () {
						if(rid)
							resolve(list[parseInt(rid)-1]);
						return true;
					}
				}
			},
			rid, sid,
			wnd = $p.iface.dat_blank(null, options.wnd),
			_grid = wnd.attachGrid(),
			_toolbar = wnd.attachToolbar({
				items:[
					{id: "select", type: "button", text: $p.msg.select_from_list},
					{id: "cancel", type: "button", text: "Отмена"}
				],
				onClick: do_select
			});
		function do_select(id){
			if(id != "cancel")
				rid = _grid.getSelectedRowId();
			wnd.close();
		}
		_grid.setIconsPath(dhtmlx.image_path);
		_grid.setImagePath(dhtmlx.image_path);
		_grid.setHeader($p.msg.value);
		_grid.setColTypes("ro");
		_grid.enableAutoWidth(true, 1200, 600);
		_grid.attachEvent("onRowDblClicked", do_select);
		_grid.enableMultiselect(!!multy);
		_grid.setNoHeader(true);
		_grid.init();
		_toolbar.addSpacer("select");
		wnd.hideHeader();
		wnd.cell.offsetParent.querySelector(".dhxwin_brd").style.border = "none";
		list.forEach(function (o, i) {
			var text;
			if(typeof o == "object")
				text = o.presentation || o.text || o.toString();
			else
				text = o.toString();
			_grid.addRow(1+i, text);
			if(o.selected)
				sid = 1+i;
		});
		if(sid)
			_grid.selectRowById(sid);
	});
};
$p.iface.query_value = function (initial, caption) {
  return new Promise(function(resolve, reject){
    var options = {
        name: 'wnd_query_value',
        wnd: {
          width: 300,
          height: 160,
          modal: true,
          center: true,
          caption: caption || 'Введите значение',
          allow_close: true,
          on_close: function () {
            reject();
            return true;
          }
        }
      },
      wnd = $p.iface.dat_blank(null, options.wnd),
      _toolbar = wnd.attachToolbar({
        items:[
          {id: "select", type: "button", text: "<b>Ok</b>"},
          {id: "sp", type: "spacer"},
          {id: "cancel", type: "button", text: "Отмена"}
        ],
        onClick: function (id){
          if(id == "cancel"){
            wnd.close();
          }
          else{
            resolve(wnd.cell.querySelector('INPUT').value);
            wnd.close();
          }
        }
      });
    wnd.attachHTMLString("<input type='text' style='width: 94%; padding: 4px;' value='" + initial + "' />");
  });
};
function ODateRangePicker(container, attr) {
	var _cont = this._cont = document.createElement('div');
	if(container instanceof dhtmlXCellObject){
		container.appendObject(this._cont);
	}else{
		container.appendChild(this._cont);
	}
	this._cont.className = "odaterangepicker";
	this._cont.innerHTML = '<i class="fa fa-calendar"></i>&nbsp; <span></span> &nbsp;<i class="fa fa-caret-down"></i>';
	this.__define({
		set_text: {
			value: 	function() {
				$('span', _cont).html(this.date_from.format('DD MMM YY') + ' - ' + this.date_till.format('DD MMM YY'));
			}
		},
		on: {
			value: function (event, fn) {
				return $(_cont).on(event, fn);
			}
		},
		date_from: {
			get: function () {
				return $(_cont).data('daterangepicker').startDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setStartDate(v);
				this.set_text();
			}
		},
		date_till: {
			get: function () {
				return $(_cont).data('daterangepicker').endDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setEndDate(v);
				this.set_text();
			}
		}
	});
	$(_cont).daterangepicker({
		startDate: attr.date_from ? moment(attr.date_from) : moment().subtract(29, 'days'),
		endDate: moment(attr.date_till),
		showDropdowns: true,
		alwaysShowCalendars: true,
		opens: "left",
		ranges: {
			'Сегодня': [moment(), moment()],
			'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Последние 7 дней': [moment().subtract(6, 'days'), moment()],
			'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
			'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
			'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, this.set_text.bind(this));
	this.set_text();
}
$p.iface.ODateRangePicker = ODateRangePicker;
dhtmlXCellObject.prototype.attachHeadFields = function(attr) {
	var _obj,
		_oxml,
		_meta,
		_mgr,
		_selection,
		_tsname,
		_extra_fields,
		_pwnd,
		_cell = this,
		_grid = _cell.attachGrid(),
		_destructor = _grid.destructor;
	function observer(changes){
		if(!_obj){
			var stack = [];
			changes.forEach(function(change){
				if(stack.indexOf[change.object]==-1){
					stack.push(change.object);
					Object.unobserve(change.object, observer);
					if(_extra_fields && _extra_fields instanceof TabularSection)
						Object.unobserve(change.object, observer_rows);
				}
			});
			stack = null;
		}else if(_grid.entBox && !_grid.entBox.parentElement)
			setTimeout(_grid.destructor);
		else
			changes.forEach(function(change){
				if(change.type == "unload"){
					if(_cell && _cell.close)
						_cell.close();
					else
						_grid.destructor();
				}else
					_grid.forEachRow(function(id){
						if (id == change.name)
							_grid.cells(id,1).setValue(_obj[change.name]);
					});
			});
	}
	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _grid.clearAll && _tsname == change.tabular){
				synced = true;
				_grid.clearAll();
				_grid.parse(_mgr.get_property_grid_xml(_oxml, _obj, {
					title: attr.ts_title,
					ts: _tsname,
					selection: _selection,
					metadata: _meta
				}), function(){
				}, "xml");
			}
		});
	}
	new dhtmlXPropertyGrid(_grid);
	_grid.setInitWidthsP("40,60");
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.init();
	_grid.setSizes();
	_grid.attachEvent("onPropertyChanged", function(pname, new_value, old_value){
    if(pname || _grid && _grid.getSelectedRowId()){
      return _pwnd.on_select(new_value);
    }
	});
	_grid.attachEvent("onCheckbox", function(rId, cInd, state){
		if(_obj[rId] != undefined)
			return _pwnd.on_select(state, {obj: _obj, field: rId});
		if(rId.split("|").length > 1)
			return _pwnd.on_select(state, _grid.get_cell_field(rId));
	});
	_grid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
		switch(code) {
			case 13:
			case 9:
				if (_grid.editStop)
					_grid.editStop();
				break;
			case 46:
				break;
		}
	});
	if(attr.read_only){
		_grid.setEditable(false);
	}
	_grid.__define({
		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				this.reload();
			}
		},
		reload: {
			value: function () {
				observer_rows([{tabular: _tsname}]);
			}
		},
		get_cell_field: {
			value: function (rId) {
				if(!_obj)
					return;
				var res = {row_id: rId || _grid.getSelectedRowId()},
					fpath = res.row_id.split("|");
				if(fpath.length < 2){
					return {obj: _obj, field: fpath[0]}._mixin(_pwnd);
				}else {
					var vr;
					if(_selection){
						_obj[fpath[0]].find_rows(_selection, function (row) {
							if(row.property == fpath[1] || row.param == fpath[1] || row.Свойство == fpath[1] || row.Параметр == fpath[1]){
								vr = row;
								return false;
							}
						});
					}else{
						vr = _obj[fpath[0]].find(fpath[1]);
					}
					if(vr){
						res.obj = vr;
						if(vr["Значение"]){
							res.field = "Значение";
							res.property = vr.Свойство || vr.Параметр;
						} else{
							res.field = "value";
							res.property = vr.property || vr.param;
						}
						return res._mixin(_pwnd);
					}
				}
			},
			enumerable: false
		},
		_obj: {
			get: function () {
				return _obj;
			}
		},
		_owner_cell: {
			get: function () {
				return _cell;
			}
		},
		destructor: {
			value: function () {
				if(_obj)
					Object.unobserve(_obj, observer);
				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_extra_fields, observer_rows);
				_obj = null;
				_extra_fields = null;
				_meta = null;
				_mgr = null;
				_pwnd = null;
				_destructor.call(_grid);
			}
		},
		attach: {
			value: function (attr) {
				if (_obj)
					Object.unobserve(_obj, observer);
				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_obj, observer_rows);
				if(attr.oxml)
					_oxml = attr.oxml;
				if(attr.selection)
					_selection = attr.selection;
				_obj = attr.obj;
				_meta = attr.metadata || _obj._metadata.fields;
				_mgr = _obj._manager;
				_tsname = attr.ts || "";
				_extra_fields = _tsname ? _obj[_tsname] : (_obj.extra_fields || _obj["ДополнительныеРеквизиты"]);
				if(_extra_fields && !_tsname)
					_tsname = _obj.extra_fields ? "extra_fields" :  "ДополнительныеРеквизиты";
				_pwnd = {
					on_select: function (selv, cell_field) {
						if(!cell_field)
							cell_field = _grid.get_cell_field();
						if(cell_field){
							var ret_code = _mgr.handle_event(_obj, "value_change", {
								field: cell_field.field,
								value: selv,
								tabular_section: cell_field.row_id ? _tsname : "",
								grid: _grid,
								cell: _grid.cells(cell_field.row_id || cell_field.field, 1),
								wnd: _pwnd.pwnd
							});
							if(typeof ret_code !== "boolean"){
								cell_field.obj[cell_field.field] = selv;
								ret_code = true;
							}
							return ret_code;
						}
					},
					pwnd: attr.pwnd || _cell
				};
				Object.observe(_obj, observer, ["update", "unload"]);
				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.observe(_obj, observer_rows, ["row", "rows"]);
				if(_tsname && !attr.ts_title)
					attr.ts_title = _obj._metadata.tabular_sections[_tsname].synonym;
				observer_rows([{tabular: _tsname}]);
			}
		}
	});
	if(attr)
		_grid.attach(attr);
	return _grid;
};
dhtmlXGridObject.prototype.get_cell_value = function () {
	var cell_field = this.get_cell_field();
	if(cell_field && cell_field.obj)
		return cell_field.obj[cell_field.field];
};
dhtmlXCellObject.prototype.attachTabular = function(attr) {
	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.metadata || _mgr.metadata().tabular_sections[_tsname].fields,
		_cell = this,
		_source = attr.ts_captions || {},
    _input_filter = "",
    _input_filter_changed = 0,
		_selection = attr.selection || {};
	if(!attr.ts_captions && !_md.ts_captions(_mgr.class_name, _tsname, _source)){
    return;
  }
  _selection.filter_selection = filter_selection;
	var _grid = this.attachGrid(),
		_toolbar = this.attachToolbar(),
		_destructor = _grid.destructor,
		_pwnd = {
			on_select: function (selv) {
				tabular_on_edit(2, null, null, selv);
			},
			pwnd: attr.pwnd || _cell,
			is_tabular: true
		};
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.enableAccessKeyMap();
	_grid._add_row = function(){
		if(!attr.read_only && !attr.disable_add_del){
			var proto;
			if(_selection){
				for(var sel in _selection){
					if(!_meta[sel] || (typeof _selection[sel] == 'function') || (typeof _selection[sel] == 'object' && !$p.is_data_obj(_selection[sel]))){
						continue;
					}
					if(!proto){
						proto = {};
					}
					proto[sel] = _selection[sel];
				}
			}
      _ts._owner._silent(false);
			var row = _ts.add(proto);
			if(_mgr.handle_event(_obj, "add_row",
					{
						tabular_section: _tsname,
						grid: _grid,
						row: row,
						wnd: _pwnd.pwnd
					}) === false)
				return;
			setTimeout(function () {
				_grid.selectRowById(row.row);
			}, 100);
		}
	};
  _grid._move_row = function(direction){
    if(attr.read_only){
      return;
    }
    var rId = get_sel_index();
    if(rId != undefined){
      _ts._owner._silent(false);
      if(direction == "up"){
        if(rId != 0){
          _ts.swap(rId-1, rId);
          setTimeout(function () {
            _grid.selectRow(rId-1, true);
          }, 100);
        }
      }
      else{
        if(rId < _ts.count() - 1){
          _ts.swap(rId, rId+1);
          setTimeout(function () {
            _grid.selectRow(rId+1, true);
          }, 100);
        }
      }
    }
  };
	_grid._del_row = function(keydown){
		if(!attr.read_only && !attr.disable_add_del){
			var rId = get_sel_index();
			if(rId != undefined){
        _ts._owner._silent(false);
				if(_mgr.handle_event(_obj, "del_row",
						{
							tabular_section: _tsname,
							grid: _grid,
							row: rId,
							wnd: _pwnd.pwnd
						}) === false)
					return;
				_ts.del(rId);
				setTimeout(function () {
					_grid.selectRowById(rId < _ts.count() ? rId + 1 : rId, true);
				}, 100);
			}
		}
	};
	function get_sel_index(silent){
		var selId = _grid.getSelectedRowId();
		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;
		if(!silent)
			$p.msg.show_msg({
				type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", _obj._metadata.tabular_sections[_tsname].synonym || _tsname),
				title: (_obj._metadata.obj_presentation || _obj._metadata.synonym) + ': ' + _obj.presentation
			});
	}
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){
		if(stage != 2 || nValue == oValue)
			return true;
		var cell_field = _grid.get_cell_field();
		if(!cell_field){
      return true;
    }
		var	ret_code = _mgr.handle_event(_obj, "value_change", {
				field: cell_field.field,
				value: nValue,
				tabular_section: _tsname,
				grid: _grid,
				row: cell_field.obj,
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : (_grid.getSelectedCellIndex() >=0 ? _grid.cells() : null),
				wnd: _pwnd.pwnd
			});
		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}
	function observer_rows(changes){
		if(_grid.clearAll){
			changes.some(function(change){
				if (change.type == "rows" && change.tabular == _tsname){
					_ts.sync_grid(_grid, _selection);
					return true;
				}
			});
		}
	}
	function observer(changes){
		if(changes.length > 20){
			try{_ts.sync_grid(_grid, _selection);} catch(err){}
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(!change.row || _grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						if(_grid.getColIndexById(change.name) != undefined){
              if(typeof change.oldValue != "boolean" || typeof change.row[change.name] != "boolean"){
                _grid.cells(change.row.row, _grid.getColIndexById(change.name))
                  .setCValue($p.utils.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
              }
            }
					}
				}
			});
	}
	function onpaste(e) {
		if(e.clipboardData.types.indexOf('text/plain') != -1){
			try{
				$p.eve.callEvent("tabular_paste", [{
					obj: _obj,
					grid: _grid,
					tsname: _tsname,
					e: e,
					data: e.clipboardData.getData('text/plain')
				}]);
			}catch(e){
				return;
			}
		}
	}
  function filter_selection(row) {
	  if(!_input_filter){
	    return true;
    }
    var res;
    _source.fields.some(function (fld) {
      var v = row._row[fld];
      if($p.utils.is_data_obj(v)){
        if(!v.is_new() && v.presentation.match(_input_filter)){
          return res = true;
        }
      }
      else if(typeof v == 'number'){
        return res = v.toLocaleString().match(_input_filter);
      }
      else if(v instanceof Date){
        return res = $p.moment(v).format($p.moment._masks.date_time).match(_input_filter);
      }
      else if(v.match){
        return res = v.match(_input_filter);
      }
    });
    return res;
  }
	function filter_change() {
    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
      _input_filter_changed = 0;
    }
    if(_input_filter != _cell.input_filter.value){
      _input_filter = new RegExp(_cell.input_filter.value, 'i');
      observer_rows([{tabular: _tsname, type: "rows"}]);
    }
  }
  function filter_click() {
    var val = _cell.input_filter.value;
    setTimeout(function () {
      if(val != _cell.input_filter.value)
        filter_change();
    });
  }
  function filter_keydown() {
    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
    }
    _input_filter_changed = setTimeout(function () {
      if(_input_filter_changed)
        filter_change();
    }, 500);
  }
	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){
    this.forEachItem(function(id) {
      if(id == "input_filter"){
        _cell.input_filter = _toolbar.getInput(id);
        _cell.input_filter.onchange = filter_change;
        _cell.input_filter.onclick = filter_click;
        _cell.input_filter.onkeydown = filter_keydown;
        _cell.input_filter.type = "search";
        _cell.input_filter.setAttribute("placeholder", "Фильтр");
      }
    });
		this.attachEvent("onclick", function(btn_id){
			switch(btn_id) {
				case "btn_add":
					_grid._add_row();
					break;
				case "btn_delete":
					_grid._del_row();
					break;
        case "btn_up":
          _grid._move_row("up");
          break;
        case "btn_down":
          _grid._move_row("down");
          break;
			}
		});
	});
	_grid.setIconsPath(dhtmlx.image_path);
	_grid.setImagePath(dhtmlx.image_path);
	_grid.setHeader(_source.headers);
	if(_source.min_widths)
		_grid.setInitWidths(_source.widths);
	if(_source.min_widths)
		_grid.setColumnMinWidth(_source.min_widths);
	if(_source.aligns)
		_grid.setColAlign(_source.aligns);
	_grid.setColSorting(_source.sortings);
	_grid.setColTypes(_source.types);
	_grid.setColumnIds(_source.fields.join(","));
	_grid.enableAutoWidth(true, 1200, 600);
	_grid.enableEditTabOnly(true);
	_grid.init();
	if(attr.read_only || attr.disable_add_del){
	  if(attr.read_only){
      _grid.setEditable(false);
    }
		_toolbar.forEachItem(function (name) {
			if(["btn_add", "btn_delete"].indexOf(name) != -1)
				_toolbar.disableItem(name);
		});
	}
	if(attr.reorder){
    var pos = _toolbar.getPosition("btn_delete");
    if(pos){
      _toolbar.addSeparator("sep_up", pos+1);
      _toolbar.addButton("btn_up", pos+2, '<i class="fa fa-arrow-up fa-fw"></i>');
      _toolbar.addButton("btn_down", pos+3, '<i class="fa fa-arrow-down fa-fw"></i>');
      _toolbar.setItemToolTip("btn_up", "Переместить строку вверх");
      _toolbar.setItemToolTip("btn_down", "Переместить строку вниз");
    }
  }
	_grid.__define({
    _obj: {
      get: function () {
        return _obj;
      }
    },
		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				observer_rows([{tabular: _tsname, type: "rows"}]);
			}
		},
		destructor: {
			value: function () {
				if(_obj){
					Object.unobserve(_obj, observer);
					Object.unobserve(_obj, observer_rows);
				}
				_obj = null;
				_ts = null;
				_meta = null;
				_mgr = null;
				_pwnd = null;
				_cell.detachToolbar();
				_grid.entBox.removeEventListener("paste", onpaste);
				_destructor.call(_grid);
			}
		},
		get_cell_field: {
			value: function () {
				if(_ts){
					var rindex = get_sel_index(true),
						cindex = _grid.getSelectedCellIndex(),
						row, col;
					if(rindex != undefined){
						row = _ts.get(rindex);
					}else if(_grid._last){
						row = _ts.get(_grid._last.row);
					}
					if(cindex >=0){
						col = _grid.getColumnId(cindex);
					}else if(_grid._last){
						col = _grid.getColumnId(_grid._last.cindex);
					}
					if(row && col){
						return {obj: row, field: col, metadata: _meta[col]}._mixin(_pwnd);
					}
				}
			}
		},
		refresh_row: {
			value: function (row) {
				_grid.selectRowById(row.row);
				_grid.forEachCell(row.row, function(cellObj,ind){
					var val = row[_grid.getColumnId(ind)];
					cellObj.setCValue($p.utils.is_data_obj(val) ? val.presentation : val);
				});
			}
		}
	});
	_grid.attachEvent("onEditCell", tabular_on_edit);
  _grid.attachEvent("onCheck", function(rId,cInd,state){
    _grid.selectCell(rId-1, cInd);
    tabular_on_edit(2, rId, cInd, state);
  });
	_grid.attachEvent("onRowSelect", function(rid,ind){
		if(_ts){
			_grid._last = {
				row: rid-1,
				cindex: ind
			};
		}
	});
  _grid.attachEvent("onHeaderClick", function(ind,obj){
    var field = _source.fields[ind];
    if(_grid.disable_sorting || field == 'row'){
      return;
    }
    if(!_grid.sort_fields){
      _grid.sort_fields = [];
      _grid.sort_directions = [];
    }
    var index = _grid.sort_fields.indexOf(field);
    function add_field() {
      if(index == -1){
        _grid.sort_fields.push(field);
        _grid.sort_directions.push("asc");
      }
      else{
        if(_grid.sort_directions[index] == "asc"){
          _grid.sort_directions[index] = "desc";
        }
        else{
          _grid.sort_directions[index] = "asc";
        }
      }
    }
    if(window.event && window.event.shiftKey){
      add_field();
    }
    else{
      if(index == -1){
        _grid.sort_fields.length = 0;
        _grid.sort_directions.length = 0;
      }
      add_field();
    }
    _ts.sort(_grid.sort_fields.map(function (field, index) {
      return field + " " + _grid.sort_directions[index];
    }));
    _ts.sync_grid(_grid);
    for(var col = 0; col < _source.fields.length; col++){
      var field = _source.fields[col];
      var index = _grid.sort_fields.indexOf(field);
      if(index == -1){
        _grid.setSortImgState(false, col);
      }
      else{
        _grid.setSortImgState(true, col, _grid.sort_directions[index]);
        setTimeout(function () {
          if(_grid && _grid.sortImg){
            _grid.sortImg.style.display="inline";
          }
        }, 200);
        break;
      }
    }
  });
	observer_rows([{tabular: _tsname, type: "rows"}]);
	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);
	_grid.entBox.addEventListener('paste', onpaste);
	return _grid;
};
$p.iface.Toolbar_filter = function Toolbar_filter(attr) {
	var t = this,
		input_filter_changed = 0,
		input_filter_width = $p.job_prm.device_type == "desktop" ? 200 : 120,
		custom_selection = {};
	if(!attr.pos)
		attr.pos = 6;
	t.__define({
		custom_selection: {
			get: function () {
				return custom_selection;
			}
		},
		toolbar: {
			get: function () {
				return attr.toolbar;
			}
		},
		call_event: {
			value: function () {
				if(input_filter_changed){
					clearTimeout(input_filter_changed);
					input_filter_changed = 0;
				}
				attr.onchange.call(t, t.get_filter());
			}
		}
	});
	function onkeydown(){
		if(input_filter_changed)
			clearTimeout(input_filter_changed);
		input_filter_changed = setTimeout(function () {
      input_filter_changed && t._prev_input_filter != t.input_filter.value && t.call_event();
		}, 500);
	}
	t.toolbar.addText("div_filter", attr.pos, "");
	t.div = t.toolbar.objPull[t.toolbar.idPrefix + "div_filter"];
	attr.pos++;
	if(attr.manager instanceof DocManager || attr.manager instanceof BusinessProcessManager || attr.manager instanceof TaskManager || attr.period){
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}
		input_filter_width = $p.job_prm.device_type == "desktop" ? 160 : 120;
		t.toolbar.addInput("input_date_from", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
		attr.pos++;
		t.toolbar.addText("lbl_date_till", attr.pos, "-");
		attr.pos++;
		t.toolbar.addInput("input_date_till", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
		attr.pos++;
		t.input_date_from = t.toolbar.getInput("input_date_from");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };
		t.input_date_till = t.toolbar.getInput("input_date_till");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", t.call_event);
		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.utils.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.moment(attr.date_from).format("L");
		t.input_date_till.value=$p.moment(attr.date_till).format("L");
		if(attr.manager.cachable == "doc" && !attr.custom_selection){
			custom_selection._view = {
				get value(){
					return 'doc/by_date';
				}
			};
			custom_selection._key = {
				get value(){
					var filter = t.get_filter(true);
					return {
						startkey: [attr.manager.class_name, filter.date_from.getFullYear(), filter.date_from.getMonth()+1, filter.date_from.getDate()],
						endkey: [attr.manager.class_name, filter.date_till.getFullYear(), filter.date_till.getMonth()+1, filter.date_till.getDate()],
						_drop_date: true,
						_order_by: true,
						_search: filter.filter.toLowerCase()
					};
				}
			};
		}
	}
	if(!attr.hide_filter){
		t.toolbar.addSeparator("filter_sep", attr.pos);
		attr.pos++;
		t.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = t.toolbar.getInput("input_filter");
		t.input_filter.onchange = function () {
		  t._prev_input_filter != t.input_filter.value && t.call_event();
    };
		t.input_filter.onclick = function () {
			var val = t.input_filter.value;
			setTimeout(function () {
				if(val != t.input_filter.value)
					t.call_event();
			});
		};
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";
		t.input_filter.setAttribute("placeholder", "Фильтр");
		t.toolbar.addSpacer("input_filter");
	}else if(t.input_date_till)
		t.toolbar.addSpacer("input_date_till");
	else
		t.toolbar.addSpacer("div_filter");
};
$p.iface.Toolbar_filter.prototype.__define({
	get_filter: {
		value: function (exclude_custom) {
		  if(this.input_filter){
        this._prev_input_filter = this.input_filter.value;
      }
			var res = {
				date_from: this.input_date_from ? $p.utils.date_add_day(dhx4.str2date(this.input_date_from.value), 0, true) : "",
				date_till: this.input_date_till ? $p.utils.date_add_day(dhx4.str2date(this.input_date_till.value), 0, true) : "",
				filter: this.input_filter ? this.input_filter.value : ""
			}, fld, flt;
			if(!exclude_custom){
				for(fld in this.custom_selection){
					if(!res.selection)
						res.selection = [];
					flt = {};
					flt[fld] = this.custom_selection[fld].value;
					res.selection.push(flt);
				}
			}
			return res;
		}
	},
	add_filter: {
		value: function (elm) {
			var pos = this.toolbar.getPosition("input_filter") - 2,
				id = dhx4.newId(),
				width = (this.toolbar.getWidth("input_filter") / 2).round(0);
			this.toolbar.setWidth("input_filter", width);
			this.toolbar.addText("lbl_"+id, pos, elm.text || "");
			pos++;
			this.toolbar.addInput("input_"+id, pos, "", width);
			this.custom_selection[elm.name] = this.toolbar.getInput("input_"+id);
		}
	}
});
$p.iface.dat_blank = function(_dxw, attr) {
	if(!attr)
		attr = {};
	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: dhx4.newId(),
		left: attr.left || 700,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});
	var _dxw_area = {
		x: (_dxw || $p.iface.w).vp.clientWidth,
		y: (_dxw || $p.iface.w).vp.clientHeight
	}, _move;
	if(wnd_dat.getPosition()[0] + wnd_dat.getDimension()[0] > _dxw_area.x){
		_dxw_area.x = _dxw_area.x - wnd_dat.getDimension()[0];
		_move = true;
	}else
		_dxw_area.x = wnd_dat.getPosition()[0];
	if(wnd_dat.getPosition()[1] + wnd_dat.getDimension()[1] > _dxw_area.y){
		_dxw_area.y = _dxw_area.y - wnd_dat.getDimension()[1];
		_move = true;
	}else
		_dxw_area.y = wnd_dat.getPosition()[1];
	if(_move){
		if(_dxw_area.x<0 || _dxw_area.y<0)
			wnd_dat.maximize();
		else
			wnd_dat.setPosition(_dxw_area.x, _dxw_area.y);
	}
	_dxw = null;
	if(attr.hasOwnProperty('allow_minmax') && !attr.allow_minmax)
		wnd_dat.button('minmax').hide();
	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();
	wnd_dat.attachEvent("onClose", function () {
		var allow_close = typeof attr.on_close == "function" ? attr.on_close(wnd_dat) : true;
		if(allow_close){
			if(attr.pwnd_modal && attr.pwnd && attr.pwnd.setModal)
				attr.pwnd.setModal(1);
			return allow_close;
		}
	});
	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');
	$p.iface.bind_help(wnd_dat, attr.help_path);
	wnd_dat.elmnts = {grids: {}};
	wnd_dat.wnd_options = function (options) {
		var pos = wnd_dat.getPosition(),
			sizes = wnd_dat.getDimension(),
			parked = wnd_dat.isParked();
		options.left = pos[0];
		options.top = pos[1];
		options.width = sizes[0];
		options.parked = parked;
		if(!parked)
			options.height = sizes[1];
	};
	wnd_dat.bottom_toolbar = function(oattr){
		var attr = ({
				wrapper: wnd_dat.cell,
				width: '100%',
				height: '28px',
				bottom: '0px',
				left: '0px',
				name: 'tb_bottom',
				buttons: [
					{name: 'btn_cancel', text: 'Отмена', title: 'Закрыть без сохранения', width:'60px', float: 'right'},
					{name: 'btn_ok', b: 'Ок', title: 'Применить изменения', width:'30px', float: 'right'}
				],
				onclick: function (name) {
					return false;
				}
			})._mixin(oattr),
			tb_bottom = new OTooolBar(attr),
			sbar = wnd_dat.attachStatusBar({height: 12});
		sbar.style.zIndex = -1000;
		sbar.firstChild.style.backgroundColor = "transparent";
		sbar.firstChild.style.border = "none";
		return tb_bottom;
	};
	if(attr.modal){
		if(attr.pwnd && attr.pwnd.setModal){
			attr.pwnd_modal = attr.pwnd.isModal();
			attr.pwnd.setModal(0);
		}
		wnd_dat.setModal(1);
	}
	return wnd_dat;
};
$p.iface.pgrid_on_select = function(selv){
	if(selv===undefined)
		return;
	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source"),
		f = pgrid.getSelectedRowId();
	if(source.o[f] != undefined){
		if(typeof source.o[f] == "number")
			source.o[f] = $p.utils.fix_number(selv, true);
		else
			source.o[f] = selv;
	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}
	pgrid.cells().setValue($p.utils.is_data_obj(selv) ? selv.presentation : selv || "");
	if(source.grid_on_change)
		source.grid_on_change.call(pgrid, f, selv);
};
$p.iface.pgrid_on_change = function(pname, new_value, old_value){
	if(pname)
		$p.iface.pgrid_on_select.call(this, new_value);
};
$p.iface.pgrid_on_checkbox = function(rId, cInd, state){
	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source");
	if(source.o[rId] != undefined)
		source.o[rId] = state;
	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};
$p.iface.frm_auth = function (attr, resolve, reject) {
	if(!attr)
		attr = {};
	var _cell, _frm, w, were_errors;
	if(attr.modal_dialog){
		if(!attr.options)
			attr.options = {
				name: "frm_auth",
				caption: "Вход на сервер",
				width: 360,
				height: 300,
				center: true,
				allow_close: true,
				allow_minmax: true,
				modal: true
			};
		_cell = this.auth = this.dat_blank(attr._dxw, attr.options);
		_cell.attachEvent("onClose", function(win){
			if(were_errors){
				reject && reject(err);
			}else if(resolve)
				resolve();
			return true;
		});
    _frm = _cell.attachForm();
	}else{
		_cell = attr.cell || this.docs;
		_frm = this.auth = _cell.attachForm();
		$p.msg.show_msg($p.msg.init_login, _cell);
	}
	function do_auth(login, password){
		$p.ajax.username = login;
		$p.ajax.password = $p.aes.Ctr.encrypt(password);
		if(login){
			if($p.wsql.get_user_param("user_name") != login)
				$p.wsql.set_user_param("user_name", login);
      var observer = $p.eve.attachEvent("user_log_in", function () {
        $p.eve.detachEvent(observer);
        _cell && _cell.close && _cell.close();
      });
			$p.wsql.pouch.log_in(login, password)
				.then(function () {
					if($p.wsql.get_user_param("enable_save_pwd")){
						if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password)
							$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password));
					}else if($p.wsql.get_user_param("user_pwd") != "")
						$p.wsql.set_user_param("user_pwd", "");
					$p.eve.logged_in = true;
					if(attr.modal_dialog)
            _cell && _cell.close && _cell.close();
					else if(resolve)
						resolve();
				})
				.catch(function (err) {
					were_errors = true;
          _frm && _frm.onerror &&_frm.onerror(err);
				})
				.then(function () {
					if($p.iface.sync)
						$p.iface.sync.close();
					if(_cell && _cell.progressOff){
						_cell.progressOff();
						if(!were_errors && attr.hide_header)
							_cell.hideHeader();
					}
					if($p.iface.cell_tree && !were_errors)
						$p.iface.cell_tree.expand();
				});
		} else
			this.validate();
	}
	function auth_click(name){
		were_errors = false;
		this.resetValidateCss();
		if(this.getCheckedValue("type") == "guest"){
			var login = this.getItemValue("guest"),
				password = "";
			if($p.job_prm.guests && $p.job_prm.guests.length){
				$p.job_prm.guests.some(function (g) {
					if(g.username == login){
						password = $p.aes.Ctr.decrypt(g.password);
						return true;
					}
				});
			}
			do_auth.call(this, login, password);
		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));
		}
	}
	_frm.loadStruct($p.injected_data["form_auth.xml"], function(){
		var selected;
		if($p.job_prm.guests && $p.job_prm.guests.length){
			var guests = $p.job_prm.guests.map(function (g) {
					var v = {
						text: g.username,
						value: g.username
					};
					if($p.wsql.get_user_param("user_name") == g.username){
						v.selected = true;
						selected = g.username;
					}
					return v;
				});
			if(!selected){
				guests[0].selected = true;
				selected = guests[0].value;
			}
			_frm.reloadOptions("guest", guests);
		}
		if($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_name") != selected){
			_frm.setItemValue("login", $p.wsql.get_user_param("user_name"));
			_frm.setItemValue("type", "auth");
			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				_frm.setItemValue("password", $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")));
			}
		}
		if(!attr.modal_dialog){
			if((w = ((_cell.getWidth ? _cell.getWidth() : _cell.cell.offsetWidth) - 500)/2) >= 10)
				_frm.cont.style.paddingLeft = w.toFixed() + "px";
			else
				_frm.cont.style.paddingLeft = "20px";
		}
		setTimeout(function () {
			dhx4.callEvent("on_draw_auth", [_frm]);
			if(($p.wsql.get_user_param("autologin") || attr.try_auto) && (selected || ($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_pwd"))))
				auth_click.call(_frm);
		});
	});
	_frm.attachEvent("onButtonClick", auth_click);
	_frm.attachEvent("onKeyDown",function(inp, ev, name, value){
		if(ev.keyCode == 13){
			if(name == "password" || this.getCheckedValue("type") == "guest"){
				auth_click.call(this);
			}
		}
	});
	_frm.onerror = function (err) {
		$p.ajax.authorized = false;
		var emsg = err.message.toLowerCase();
		if(emsg.indexOf("auth") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_auth
			});
			_frm.setItemValue("password", "");
			_frm.validate();
		}else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_network
			});
		}
	};
};
$p.iface.open_settings = function (e) {
	var evt = (e || (typeof event != "undefined" ? event : undefined));
	if(evt)
		evt.preventDefault();
	var hprm = $p.job_prm.parse_url();
	$p.iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "settings");
	return $p.iface.cancel_bubble(evt);
};
$p.iface.swith_view = function(name){
	var state,
		iface = $p.iface,
		swith_tree = function(name){
			function compare_text(a, b) {
				if (a.text > b.text) return 1;
				if (a.text < b.text) return -1;
			}
			if(!iface.tree){
				var hprm = $p.job_prm.parse_url();
				if(hprm.obj) {
					var parts = hprm.obj.split('.');
					if(parts.length > 1){
						var mgr = $p.md.mgr_by_class_name(hprm.obj);
						if(typeof iface.docs.close === "function" )
							iface.docs.close();
						if(mgr)
							mgr.form_list(iface.docs, {});
					}
				}
				return;
			}else if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;
			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]},
					{id:"oper_cch", text: $p.msg.meta_cch, item:[]},
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]},
					{id:"oper_tsk", text: $p.msg.meta_tsk, item:[]}
				]}, mdn, md,
					tlist = meta_tree.item[0].item;
				for(mdn in $p.cat){
					if(typeof $p.cat[mdn] == "function")
						continue;
					md = $p.cat[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);
				tlist = meta_tree.item[1].item;
				for(mdn in $p.doc){
					if(typeof $p.doc[mdn] == "function")
						continue;
					md = $p.doc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);
				tlist = meta_tree.item[2].item;
				for(mdn in $p.cch){
					if(typeof $p.cch[mdn] == "function")
						continue;
					md = $p.cch[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);
				tlist = meta_tree.item[3].item;
				for(mdn in $p.cacc){
					if(typeof $p.cacc[mdn] == "function")
						continue;
					md = $p.cacc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);
				tlist = meta_tree.item[4].item;
				for(mdn in $p.tsk){
					if(typeof $p.tsk[mdn] == "function")
						continue;
					md = $p.tsk[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.tsk." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);
				iface.tree.parse(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				}, "json");
			}else{
				iface.tree.loadXML(iface.tree.tree_filteres, function(){
				});
			}
			iface.tree._view = name;
		};
	if(name.indexOf(iface.docs.getViewName())==0)
		return iface.docs.getViewName();
	state = iface.docs.showView(name);
	if (state == true) {
		if(name=="cal" && !window.dhtmlXScheduler){
			$p.load_script("dist/dhtmlxscheduler.min.js", "script", function(){
				scheduler.config.first_hour = 8;
				scheduler.config.last_hour = 22;
				iface.docs.scheduler = iface.docs.attachScheduler(new Date("2015-11-20"), "week", "scheduler_here");
				iface.docs.scheduler.attachEvent("onBeforeViewChange", function(old_mode, old_date, mode, date){
					if(mode == "timeline"){
						$p.msg.show_not_implemented();
						return false;
					}
					return true;
				});
			});
			$p.load_script("dist/dhtmlxscheduler.css", "link");
		}
	}
	swith_tree(name);
	if(name == "def")
		iface.main.showStatusBar();
	else
		iface.main.hideStatusBar();
};
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;
	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path;
	if(attr.hasOwnProperty("class_name"))
		div.className = attr.class_name;
	else
		div.className = 'md_otooolbar';
	_this.cell = div;
	_this.buttons = {};
	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			div.children[i].classList.remove('selected');
		}
		if(select && !this.classList.contains('selected'))
			this.classList.add('selected');
	}
	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}
	function btn_click(){
		if(attr.onclick)
			attr.onclick.call(_this, this.name.replace(attr.name + '_', ''), attr.name);
	}
	this.add = function(battr){
		var bdiv = $p.iface.add_button(div, attr, battr);
		bdiv.onclick = btn_click;
		bdiv.onmouseover = function(){
			if(battr.title && !battr.sub){
				popup_focused = true;
				$p.iface.popup.clear();
				$p.iface.popup.attachHTML(battr.title);
				$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);
				$p.iface.popup.p.onmouseover = function(){
					popup_focused = true;
				};
				$p.iface.popup.p.onmouseout = popup_hide;
				if(attr.on_popup)
					attr.on_popup($p.iface.popup, bdiv);
			}
		};
		bdiv.onmouseout = popup_hide;
		_this.buttons[battr.name] = bdiv;
		if(battr.sub){
			function remove_sub(parent){
				if(!parent)
					parent = bdiv;
				if(parent.subdiv && !sub_focused && !btn_focused){
					while(parent.subdiv.firstChild)
						parent.subdiv.removeChild(parent.subdiv.firstChild);
					parent.subdiv.parentNode.removeChild(parent.subdiv);
					parent.subdiv = null;
				}
			}
			bdiv.onmouseover = function(){
				for(var i=0; i<bdiv.parentNode.children.length; i++){
					if(bdiv.parentNode.children[i] != bdiv && bdiv.parentNode.children[i].subdiv){
						remove_sub(bdiv.parentNode.children[i]);
						break;
					}
				}
				btn_focused = true;
				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'md_otooolbar';
					offset = $p.iface.get_offset(bdiv);
					if(battr.sub.align == 'right')
						this.subdiv.style.left = (offset.left + bdiv.offsetWidth - (parseInt(battr.sub.width.replace(/\D+/g,"")) || 56)) + 'px';
					else
						this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = battr.sub.height || '198px';
					this.subdiv.style.width = battr.sub.width || '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = btn_click;
					}
					attr.wrapper.appendChild(this.subdiv);
					this.subdiv.onmouseover = function () {
						sub_focused = true;
					};
					this.subdiv.onmouseout = function () {
						sub_focused = false;
						setTimeout(remove_sub, 500);
					};
					if(battr.title)
						$p.iface.popup.show(dhx4.absLeft(this.subdiv), dhx4.absTop(this.subdiv), this.subdiv.offsetWidth, this.subdiv.offsetHeight);
				}
			};
			bdiv.onmouseout = function(){
				btn_focused = false;
				setTimeout(remove_sub, 500);
			};
		}
	};
	this.select = function(name){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.name == attr.name + '_' + name){
				bselect.call(btn, true);
				return;
			}
		}
	};
	this.get_selected = function () {
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				return btn.name;
		}
	};
	this.unload = function(){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		attr.wrapper.removeChild(div);
	};
	attr.wrapper.appendChild(div);
	div.style.width = attr.width || '28px';
	div.style.height = attr.height || '150px';
	div.style.position = 'absolute';
	if(attr.top) div.style.top = attr.top;
	if(attr.left) div.style.left = attr.left;
	if(attr.bottom) div.style.bottom = attr.bottom;
	if(attr.right) div.style.right = attr.right;
	if(attr.paddingRight) div.style.paddingRight = attr.paddingRight;
	if(attr.paddingLeft) div.style.paddingLeft = attr.paddingLeft;
	if(attr.buttons)
		attr.buttons.forEach(function(battr){
			_this.add(battr);
		});
}
$p.iface.OTooolBar = OTooolBar;
$p.iface.add_button = function(parent, attr, battr) {
	var bdiv = document.createElement('div'), html = '';
	bdiv.name = (attr ? attr.name + '_' : '') + battr.name;
	parent.appendChild(bdiv);
	bdiv.className = (battr.name.indexOf("sep_") == 0) ? 'md_otooolbar_sep' : 'md_otooolbar_button';
	if(battr.hasOwnProperty("class_name"))
		bdiv.classList.add(battr.class_name);
	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	else if(battr.css)
		bdiv.classList.add(battr.css);
	bdiv.innerHTML = html;
	if(battr.float) bdiv.style.float = battr.float;
	if(battr.clear) bdiv.style.clear = battr.clear;
	if(battr.width) bdiv.style.width = battr.width;
	if(battr.paddingRight) bdiv.style.paddingRight = battr.paddingRight;
	if(battr.paddingLeft) bdiv.style.paddingLeft = battr.paddingLeft;
	if(battr.tooltip)
		bdiv.title = battr.tooltip;
	return bdiv;
};
DataManager.prototype.form_obj = function(pwnd, attr){
	var _mgr = this,
		_meta = _mgr.metadata(),
		o = attr.o,
		wnd, options, created, create_id, _title, close_confirmed;
	function frm_create(){
		if(created)
			return;
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {
			if(typeof pwnd.close == "function")
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;
				if(on_create || check_modified()){
					if(_wnd){
						if(_wnd.elmnts)
							["vault", "vault_pop"].forEach(function (elm) {
								if (_wnd.elmnts[elm] && _wnd.elmnts[elm].unload)
									_wnd.elmnts[elm].unload();
							});
						if(_mgr && _mgr.class_name)
							$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);
						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);
				}
			};
			wnd.elmnts = {grids: {}};
		}else{
			options = {
				name: 'wnd_obj_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}
		if(!wnd.ref)
			wnd.__define({
				ref: {
					get: function(){
						return o ? o.ref : $p.utils.blank.guid;
					},
					enumerable: false,
					configurable: true
				},
				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){
							var title = o.presentation;
							if(!title)
								return;
							if(o instanceof CatObj)
								title = (_meta.obj_presentation || _meta.synonym) + ': ' + title;
							else if(o instanceof DocObj)
								title += o.posted ? " (проведен)" : " (не проведен)";
							if(o._modified && title.lastIndexOf("*")!=title.length-1)
								title += " *";
							else if(!o._modified && title.lastIndexOf("*")==title.length-1)
								title = title.replace(" *", "");
							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					enumerable: false,
					configurable: true
				}
			});
		wnd.elmnts.frm_tabs = wnd.attachTabbar({
			arrows_mode: "auto",
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_obj.xml"], function(){
			if(wnd === pwnd)
				this.cont.style.top = "4px";
			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			if(_mgr instanceof DocManager && _acl.indexOf("p") != -1){
				this.enableItem("btn_post");
				if(!attr.toolbar_struct)
					this.setItemText("btn_save_close", "<b>Провести и закрыть</b>");
			}else
				this.hideItem("btn_post");
			if(_mgr instanceof DocManager && _acl.indexOf("o") != -1)
				this.enableItem("btn_unpost");
			else
				this.hideItem("btn_unpost");
			if(_acl.indexOf("e") == -1){
				this.hideItem("btn_save_close");
				this.disableItem("btn_save");
			}
			if(attr.on_select)
				this.setItemText("btn_save_close", "Записать и выбрать");
			if(_mgr instanceof CatManager || _mgr instanceof DocManager){
				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.frm_toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
				});
				wnd.elmnts.vault_pop = new dhtmlXPopup({
					toolbar: this,
					id: "btn_files"
				});
				wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);
			}else
				this.disableItem("bs_print");
			if(wnd != pwnd){
				this.hideItem("btn_close");
			}
		});
		created = true;
	}
	function observer(changes) {
		if(o && wnd && wnd.set_text){
      wnd.set_text();
    }
	}
	function frm_fill(){
		if(!created){
			clearTimeout(create_id);
			frm_create();
		}
		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader){
      wnd.showHeader();
    }
		if(attr.draw_tabular_sections)
			attr.draw_tabular_sections(o, wnd, tabular_init);
		else if(!o.is_folder){
			if(_meta.form && _meta.form.obj && _meta.form.obj.tabular_sections_order)
				_meta.form.obj.tabular_sections_order.forEach(function (ts) {
					tabular_init(ts);
				});
			else
				for(var ts in _meta.tabular_sections){
					if(ts==="extra_fields")
						continue;
					if(o[ts] instanceof TabularSection){
						tabular_init(ts);
					}
				}
		}
		if(attr.draw_pg_header)
			attr.draw_pg_header(o, wnd);
		else{
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({
				obj: o,
				pwnd: wnd,
				read_only: _acl.indexOf("e") == -1
			});
			wnd.attachEvent("onResizeFinish", function(win){
				wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
			});
		}
		Object.observe(o, observer, ["update", "row"]);
		return {wnd: wnd, o: o};
	}
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");
		else if(btn_id=="btn_save")
			save("save");
		else if(btn_id=="btn_post")
			save("post");
		else if(btn_id=="btn_unpost")
			save("unpost");
		else if(btn_id=="btn_close")
			wnd.close();
		else if(btn_id=="btn_go_connection")
			go_connection();
		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o, btn_id, wnd);
		else if(btn_id=="btn_import")
			_mgr.import(null, o);
		else if(btn_id=="btn_export")
			_mgr.export({items: [o], pwnd: wnd, obj: true} );
	}
	function go_connection(){
		$p.msg.show_not_implemented();
	}
	function show_vault(){
		if (!wnd.elmnts.vault) {
			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				_obj:  o,
				buttonClear: false,
				autoStart: true,
				filesLimit: 10,
				mode: "pouch"
			});
			wnd.elmnts.vault.conf.wnd = wnd;
		}
	}
	function tabular_init(name, toolbar_struct){
		if(!_md.ts_captions(_mgr.class_name, name))
			return;
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+_meta.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);
		var _acl = $p.current_user.get_acl(_mgr.class_name);
		wnd.elmnts.grids[name] = wnd.elmnts.tabs['tab_'+name].attachTabular({
			obj: o,
			ts: name,
			pwnd: wnd,
			read_only: _acl.indexOf("e") == -1,
			toolbar_struct: toolbar_struct
		});
		if(_acl.indexOf("e") == -1){
			var tabular = wnd.elmnts.tabs['tab_'+name].getAttachedToolbar();
			tabular.disableItem("btn_add");
			tabular.disableItem("btn_delete");
		}
	}
	function save(action){
		wnd.progressOn();
		var post;
		if(o instanceof DocObj){
			if(action == "post")
				post = true;
			else if(action == "unpost")
				post = false;
			else if(action == "close"){
				if($p.current_user.get_acl(_mgr.class_name).indexOf("p") != -1)
					post = true;
			}
		}
		o.save(post)
			.then(function(){
				wnd.progressOff();
				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();
				}else
					wnd.set_text();
			})
			.catch(function(err){
				wnd.progressOff();
				if(err instanceof Error)
					$p.record_log(err);
			});
	}
	function frm_unload(on_create){
		if(attr && attr.on_close && !on_create)
			attr.on_close();
		if(!on_create){
			delete wnd.ref;
			delete wnd.set_text;
			Object.unobserve(o, observer);
			_mgr = wnd = o = _meta = options = pwnd = attr = null;
		}
	}
	function check_modified() {
		if(o._modified && !close_confirmed){
			dhtmlx.confirm({
				title: o.presentation,
				text: $p.msg.modified_close,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						close_confirmed = true;
						if(o._manager.cachable == "ram")
							this.close();
						else{
							if(o.is_new()){
								o.unload();
								this.close();
							}else{
								setTimeout(o.load.bind(o), 100);
								this.close();
							}
						}
					}
				}.bind(wnd)
			});
			return false;
		}
		return true;
	}
	function frm_close(wnd){
		if(check_modified()){
			setTimeout(frm_unload);
			if(wnd && wnd.elmnts)
				["vault", "vault_pop"].forEach(function (elm) {
					if (wnd.elmnts[elm] && wnd.elmnts[elm].unload)
						wnd.elmnts[elm].unload();
				});
			if(_mgr && _mgr.class_name)
				$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);
			return true;
		}
	}
	create_id = setTimeout(frm_create);
	if($p.utils.is_data_obj(o)){
		if(o.is_new() && attr.on_select)
			return _mgr.create({}, true)
				.then(function (tObj) {
					o = tObj;
					tObj = null;
					return frm_fill();
				});
		else if(o.is_new() && !o.empty()){
			return o.load()
				.then(frm_fill);
		}else
			return Promise.resolve(frm_fill());
	}else{
		if(pwnd && pwnd.progressOn)
			pwnd.progressOn();
		return _mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				return frm_fill();
			})
			.catch(function (err) {
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				wnd.close();
				$p.record_log(err);
			});
	}
};
DataObj.prototype.form_obj = function (pwnd, attr) {
	if(!attr)
		attr = {};
	attr.o = this;
	return this._manager.form_obj(pwnd, attr);
};
DataProcessorsManager.prototype.form_rep = function(pwnd, attr) {
	var _mgr = this,
		_meta = _mgr.metadata(),
		wnd, options, _title, close_confirmed;
	if(!attr)
		attr = {};
	if(!attr.date_from)
		attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
	if(!attr.date_till)
		attr.date_till = new Date((new Date()).getFullYear().toFixed() + "-12-31");
	function frm_create(){
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {
			if(wnd == pwnd && wnd._mgr == _mgr)
				return;
			if(typeof pwnd.close == "function")
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;
				if(on_create || check_modified()){
					if(_wnd){
						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);
				}
			};
			wnd.elmnts = {grids: {}};
		}else{
			options = {
				name: 'wnd_rep_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}
		wnd._mgr = _mgr;
		wnd.report = _mgr.create();
		if(!wnd.set_text)
			wnd.__define({
				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){
							var title = (_meta.obj_presentation || _meta.synonym);
							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					configurable: true
				}
			});
		wnd.elmnts.layout = wnd.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Отчет",
				header: false
			}, {
				id: "b",
				text: "Параметры",
				collapsed_text: "Параметры",
				width: 220
			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_rep.xml"], function(){
			if(wnd === pwnd)
				this.cont.style.top = "4px";
			this.addSpacer("btn_run");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);
		});
		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();
		wnd.elmnts.table = new $p.HandsontableDocument(wnd.elmnts.layout.cells("a"),
			{allow_offline: wnd.report.allow_offline, autorun: false})
			.then(function (rep) {
				if(!rep._online)
					return wnd.elmnts.table = null;
			});
		wnd.elmnts.frm_prm = document.createElement("DIV");
		wnd.elmnts.frm_prm.style = "height: 100%; min-height: 300px; width: 100%";
		wnd.elmnts.layout.cells("b").attachObject(wnd.elmnts.frm_prm);
		wnd.report.daterange = new $p.iface.ODateRangePicker(wnd.elmnts.frm_prm, attr);
	}
	function toolbar_click(btn_id){
		if(btn_id=="btn_close"){
			wnd.close();
		}else if(btn_id=="btn_run"){
			wnd.report.build().then(show).catch(show);
		}else if(btn_id=="btn_print"){
		}else if(btn_id=="btn_save"){
		}else if(btn_id=="btn_load"){
		}else if(btn_id=="btn_export"){
		}
	}
	function show(data) {
		wnd.elmnts.table.requery(data);
	}
	function frm_unload(on_create){
		if(attr && attr.on_close && !on_create)
			attr.on_close();
		if(!on_create){
			delete wnd.set_text;
			if(wnd.elmnts.table)
				wnd.elmnts.table.hot.destroy();
			if(wnd.report.daterange)
				wnd.report.daterange.remove();
			wnd.report = null;
			_mgr = wnd = _meta = options = pwnd = attr = null;
		}
	}
	frm_create();
	return wnd;
};
DataManager.prototype.form_selection = function(pwnd, attr){
	if(!pwnd)
		pwnd = attr && attr.pwnd ? attr.pwnd : {};
	if(!attr && !(pwnd instanceof dhtmlXCellObject)){
		attr = pwnd;
		pwnd = {};
	}
	if(!attr)
		attr = {};
	var _mgr = this,
		_meta = attr.metadata || _mgr.metadata(),
		has_tree = _meta["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0, a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;
	function frm_create(){
		if(pwnd instanceof dhtmlXCellObject) {
			if(!(pwnd instanceof dhtmlXTabBarCell) && (typeof pwnd.close == "function"))
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				if(wnd || pwnd){
					(wnd || pwnd).detachToolbar();
					(wnd || pwnd).detachStatusBar();
					if((wnd || pwnd).conf)
						(wnd || pwnd).conf.unloading = true;
					(wnd || pwnd).detachObject(true);
				}
				frm_unload(on_create);
			};
			if(!attr.hide_header){
				setTimeout(function () {
					wnd.showHeader();
				});
			}
		}else{
			wnd = $p.iface.w.createWindow(null, 0, 0, 700, 500);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}
		$p.iface.bind_help(wnd);
		if(wnd.setText && !attr.hide_text)
			wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (_meta["list_presentation"] || _meta.synonym) + '"');
		document.body.addEventListener("keydown", body_keydown, false);
		wnd.elmnts = {};
		if(attr.status_bar || !attr.smart_rendering){
			wnd.elmnts.status_bar = wnd.attachStatusBar();
		}
		if(!attr.smart_rendering){
			wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");
		}
		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_selection.xml"], function(){
			this.attachEvent("onclick", toolbar_click);
			if(wnd === pwnd){
				this.cont.parentElement.classList.add("dhx_cell_toolbar_no_borders");
				this.cont.parentElement.classList.remove("dhx_cell_toolbar_def");
				this.cont.style.top = "4px";
			}
			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter,
				custom_selection: attr.custom_selection
			};
			if(attr.date_from) tbattr.date_from = attr.date_from;
			if(attr.date_till) tbattr.date_till = attr.date_till;
			if(attr.period) tbattr.period = attr.period;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			if(_acl.indexOf("i") == -1)
				this.hideItem("btn_new");
			if(_acl.indexOf("v") == -1)
				this.hideItem("btn_edit");
			if(_acl.indexOf("d") == -1)
				this.hideItem("btn_delete");
			if(!on_select){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
					this.addListOption("bs_more", "btn_order_list", "~", "button", "<i class='fa fa-briefcase fa-lg fa-fw'></i> Список заказов");
			}
			this.addListOption("bs_more", "btn_import", "~", "button", "<i class='fa fa-upload fa-lg fa-fw'></i> Загрузить из файла");
			this.addListOption("bs_more", "btn_export", "~", "button", "<i class='fa fa-download fa-lg fa-fw'></i> Выгрузить в файл");
			if(_mgr.printing_plates)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
						added = true;
					}
					if(!added)
						wnd.elmnts.toolbar.hideItem("bs_print");
				});
			else
				wnd.elmnts.toolbar.hideItem("bs_print");
			create_tree_and_grid();
		});
		wnd._mgr = _mgr;
		return wnd;
	}
	function body_keydown(evt){
		if(wnd && wnd.is_visible && wnd.is_visible()){
			if (evt.ctrlKey && evt.keyCode == 70){
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.iface.cancel_bubble(evt);
				}
			} else if(evt.shiftKey && evt.keyCode == 116){
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.iface.cancel_bubble(evt);
				}
			} else if(evt.keyCode == 27){
				if(wnd instanceof dhtmlXWindowsCell && !$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.close();
					});
				}
			}
		}
	}
	function input_filter_change(flt){
		if(wnd && wnd.elmnts){
			if(has_tree){
				if(flt.filter || flt.hide_tree)
					wnd.elmnts.cell_tree.collapse();
				else
					wnd.elmnts.cell_tree.expand();
			}
			wnd.elmnts.grid.reload();
		}
	}
	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;
		if(has_tree){
			layout = wnd.attachLayout('2U');
			cell_grid = layout.cells('b');
			cell_grid.hideHeader();
			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();
			tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, null, function(){
				setTimeout(function(){
					if(grid && grid.reload)
						grid.reload();
				}, 20);
			});
			tree.attachEvent("onSelect", function(id, mode){
				if(!mode)
					return;
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					setTimeout(function(){
						if(grid && grid.reload)
							grid.reload();
					}, 20);
			});
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});
		}else{
			cell_grid = wnd;
			setTimeout(function(){
				if(grid && grid.reload)
					grid.reload();
			}, 20);
		}
		grid = wnd.elmnts.grid = cell_grid.attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = get_filter(start,count);
			if(!filter)
				return;
			_mgr.sync_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			if(tree && tree.items[rId]){
				tree.selectItem(rId);
				var pid = tree.getParentId(rId);
				if(pid && pid != $p.utils.blank.guid)
					tree.openItem(pid);
			}else
				select(rId);
		});
		if(attr.smart_rendering){
			grid.enableSmartRendering(true, 50);
		}else{
			grid.setPagingWTMode(true,true,true,[20,30,60]);
			grid.enablePaging(true, 30, 8, _mgr.class_name.replace(".", "_") + "_select_recinfoArea");
			grid.setPagingSkin("toolbar", dhtmlx.skin);
		}
		if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);
		grid.reload = function(){
			var filter = get_filter();
			if(!filter)
				return Promise.resolve();
			cell_grid.progressOn();
			grid.clearAll();
			return _mgr.sync_grid(filter, grid)
				.then(function(xml){
					if(typeof xml === "object"){
						$p.msg.check_soap_result(xml);
					}else if(!grid_inited){
						if(filter.initial_value){
							var xpos = xml.indexOf("set_parent"),
								xpos2 = xml.indexOf("'>", xpos),
								xh = xml.substr(xpos+12, xpos2-xpos-12);
							if($p.utils.is_guid(xh)){
								if(has_tree){
									tree.do_not_reload = true;
									tree.selectItem(xh, false);
								}
							}
							grid.selectRowById(filter.initial_value);
						}else if(filter.parent && $p.utils.is_guid(filter.parent) && has_tree){
							tree.do_not_reload = true;
							tree.selectItem(filter.parent, false);
						}
						grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
						grid.enableAutoWidth(true, 1200, 600);
						grid.setSizes();
						grid_inited = true;
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();
						if(attr.on_grid_inited)
							attr.on_grid_inited();
					}
					if (a_direction && grid_inited)
						grid.setSortImgState(true, s_col, a_direction);
					cell_grid.progressOff();
				});
		};
	}
	function toolbar_click(btn_id){
		if(attr.toolbar_click && attr.toolbar_click(btn_id, wnd, _mgr) === false){
			return;
		}
		if(btn_id=="btn_select"){
			select();
		}else if(btn_id=="btn_new"){
			_mgr.create({}, true)
				.then(function (o) {
					if(attr.on_new)
						attr.on_new(o, wnd);
					else if($p.job_prm.keep_hash){
						o.form_obj(wnd);
					} else{
						o._set_loaded(o.ref);
						$p.iface.set_hash(_mgr.class_name, o.ref);
					}
				});
		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId){
				if(attr.on_edit)
					attr.on_edit(_mgr, rId, wnd);
				else if($p.job_prm.keep_hash){
					_mgr.form_obj(wnd, {ref: rId});
				} else
					$p.iface.set_hash(_mgr.class_name, rId);
			}else
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title
				});
		}else if(btn_id.substr(0,4)=="prn_"){
				print(btn_id);
		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");
		}else if(btn_id=="btn_delete"){
			mark_deleted();
		}else if(btn_id=="btn_import"){
			_mgr.import();
		}else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());
		}else if(btn_id=="btn_requery"){
			previous_filter = {};
			wnd.elmnts.grid.reload();
		}
	}
	function select(rId){
		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();
		var folders;
		if(attr.selection){
			attr.selection.forEach(function(sel){
				for(var key in sel){
					if(key=="is_folder")
						folders = sel[key];
				}
			});
		}
		if(wnd.elmnts.tree &&
			wnd.elmnts.tree.items[rId] &&
			wnd.elmnts.tree.getSelectedId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}
		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}
		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedId();
		}
		if(rId){
			if(attr.on_edit)
				attr.on_edit(_mgr, rId, wnd);
			else if(on_select){
				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});
			} else if($p.job_prm.keep_hash){
				_mgr.form_obj(wnd, {ref: rId});
			} else
				$p.iface.set_hash(_mgr.class_name, rId);
		}
	}
	function print(pid){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId)
			_mgr.print(rId, pid, wnd);
		else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}
	function mark_deleted(){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId){
			_mgr.get(rId, true, true)
				.then(function (o) {
					dhtmlx.confirm({
						title: $p.msg.main_title,
						text: o._deleted ? $p.msg.mark_undelete_confirm.replace("%1", o.presentation) : $p.msg.mark_delete_confirm.replace("%1", o.presentation),
						cancel: "Отмена",
						callback: function(btn) {
							if(btn)
								o.mark_deleted(!o._deleted);
						}
					});
				});
		}else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}
	function frm_unload(on_create){
		document.body.removeEventListener("keydown", body_keydown);
		if(attr && attr.on_close && !on_create)
			attr.on_close();
		if(!on_create){
			_mgr = wnd = _meta = previous_filter = on_select = pwnd = attr = null;
		}
	}
	function frm_close(){
		setTimeout(frm_unload, 10);
		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);
		if(_frm_close){
			$p.eve.detachEvent(_frm_close);
			_frm_close = null;
		}
		return true;
	}
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					metadata: _meta,
					class_name: _mgr.class_name,
					order_by: wnd.elmnts.grid.columnIds[s_col] || s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				}),
			tparent = has_tree ? wnd.elmnts.tree.getSelectedId() : null;
		if(attr.smart_rendering)
			filter.smart_rendering = true;
		if(attr.date_from && !filter.date_from)
			filter.date_from = attr.date_from;
		if(attr.date_till && !filter.date_till)
			filter.date_till = attr.date_till;
		if(attr.initial_value)
			filter.initial_value = attr.initial_value;
		if(attr.custom_selection)
			filter.custom_selection = attr.custom_selection;
		if(attr.selection){
			if(!filter.selection)
				filter.selection = attr.selection;
			else if(Array.isArray(attr.selection)){
				attr.selection.forEach(function (flt) {
					filter.selection.push(flt);
				});
			}else{
				for(var fld in attr.selection){
					if(!res.selection)
						res.selection = [];
					var flt = {};
					flt[fld] = attr.selection[fld];
					filter.selection.push(flt);
				}
			}
		}
		if(attr.owner && !filter.owner)
			filter.owner = attr.owner;
		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.utils.blank.guid;
		for(var f in filter){
			if(previous_filter[f] != filter[f]){
				previous_filter = filter;
				return filter;
			}
		}
	}
	function customColumnSort(ind){
		var a_state = wnd.elmnts.grid.getSortingState();
		s_col=ind;
		a_direction = ((a_state[1] == "des")?"asc":"des");
		wnd.elmnts.grid.reload();
		return true;
	}
	var _frm_close = $p.eve.attachEvent("frm_close", function (class_name, ref) {
		if(_mgr && _mgr.class_name == class_name && wnd && wnd.elmnts){
			wnd.elmnts.grid.reload()
				.then(function () {
					if(!$p.utils.is_empty_guid(ref))
						wnd.elmnts.grid.selectRowById(ref, false, true, true);
				});
		}
	});
	if(has_tree && attr.initial_value && attr.initial_value!= $p.utils.blank.guid && !attr.parent)
		return _mgr.get(attr.initial_value, true)
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				return frm_create();
			});
	else
		return frm_create();
};
DataManager.prototype.form_list = function(pwnd, attr){
	return this.form_selection(pwnd, attr);
};
$p.iface.wnd_sync = function() {
	var _sync = $p.iface.sync = {},
		_stepper;
	_sync.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};
	_sync.update = function(cats){
		_stepper.frm_sync.setItemValue("text_processed", "Обработано элементов: " + _stepper.step * _stepper.step_size + " из " + _stepper.count_all);
		var cat_list = "", md, rcount = 0;
		for(var cat_name in cats){
			rcount++;
			if(rcount > 4)
				break;
			if(cat_list)
				cat_list+= "<br />";
			md = $p.cat[cat_name].metadata();
			cat_list+= (md.list_presentation || md.synonym) + " (" + cats[cat_name].length + ")";
		}
		_stepper.frm_sync.setItemValue("text_current", "Текущий запрос: " + _stepper.step + " (" + Math.round(_stepper.step * _stepper.step_size * 100 / _stepper.count_all) + "%)");
		_stepper.frm_sync.setItemValue("text_bottom", cat_list);
	};
	_sync.close = function(){
		if(_stepper && _stepper.wnd_sync){
			_stepper.wnd_sync.close();
			delete _stepper.wnd_sync;
			delete _stepper.frm_sync;
		}
	};
	function frm_create(){
		var options = {
			name: 'wnd_sync',
			wnd: {
				id: 'wnd_sync',
				top: 130,
				left: 200,
				width: 496,
				height: 290,
				modal: true,
				center: true,
				caption: "Подготовка данных"
			}
		};
		_stepper.wnd_sync = $p.iface.dat_blank(null, options.wnd);
		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_data },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_sync = _stepper.wnd_sync.attachForm(str);
		_stepper.frm_sync.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});
		_stepper.frm_sync.setItemValue("text_processed", "Инициализация");
		_stepper.frm_sync.setItemValue("text_bottom", "Загружается структура таблиц...");
	}
};
};

class AppEvents {
	constructor($p) {
		this.$p = $p;
		if(typeof window !== "undefined" && window.dhx4){
			for(var p in dhx4){
				this[p] = dhx4[p];
				delete dhx4[p];
			}
			window.dhx4 = this;
		}
		this.steps = {
			load_meta: 0,
			authorization: 1,
			create_managers: 2,
			process_access:  3,
			load_data_files: 4,
			load_data_db: 5,
			load_data_wsql: 6,
			save_data_wsql: 7
		};
		this.initialize();
		const eve = this;
		const {msg, job_prm} = $p;
		window.addEventListener('online', this.set_offline.bind(this));
		window.addEventListener('offline', this.set_offline.bind(this, true));
		window.addEventListener('load', () => {
			setTimeout(() => {
				function init_params(){
					function load_css(){
						var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
						if(surl.indexOf("cdn.jsdelivr.net")!=-1)
							surl = "//cdn.jsdelivr.net/metadata/latest/";
						for(var i=0; i < document.styleSheets.length; i++){
							if(document.styleSheets[i].href){
								if(document.styleSheets[i].href.indexOf("dhx_web")!=-1 || document.styleSheets[i].href.indexOf("dhx_terrace")!=-1)
									load_dhtmlx = false;
								if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
									load_meta = false;
							}
						}
						dhtmlx.skin = $p.wsql.get_user_param("skin") || job_prm.skin || "dhx_web";
						if(load_dhtmlx)
							$p.load_script(surl + (dhtmlx.skin == "dhx_web" ? "dhx_web.css" : "dhx_terrace.css"), "link");
						if(load_meta)
							$p.load_script(surl + "metadata.css", "link");
						if(job_prm.additional_css)
							job_prm.additional_css.forEach(function (name) {
								if(dhx4.isIE || name.indexOf("ie_only") == -1)
									$p.load_script(name, "link");
							});
						dhtmlx.image_path = "//oknosoft.github.io/metadata.js/lib/imgs/";
						dhtmlx.skin_suffix = function () {
							return dhtmlx.skin.replace("dhx", "") + "/"
						};
						dhx4.ajax.cache = true;
						$p.iface.__define("w", {
							value: new dhtmlXWindows(),
							enumerable: false
						});
						$p.iface.w.setSkin(dhtmlx.skin);
						$p.iface.__define("popup", {
							value: new dhtmlXPopup(),
							enumerable: false
						});
					}
					function load_data() {
						$p.wsql.pouch.load_data()
							.catch($p.record_log);
						if(document.querySelector("#splash")){
							document.querySelector("#splash").parentNode.removeChild(splash);
						}
						eve.callEvent("iface_init", [$p]);
					}
					$p.wsql.init_params();
					if("dhtmlx" in window)
						load_css();
					if(typeof(window.orientation)=="undefined"){
						job_prm.device_orient = window.innerWidth>window.innerHeight ? "landscape" : "portrait";
					}
					else{
						eve.on_rotate();
					}
					window.addEventListener("orientationchange", eve.on_rotate.bind(eve), false);
					eve.stepper = {
						step: 0,
						count_all: 0,
						step_size: 57,
						files: 0,
						ram: {},
						doc: {},
					};
					eve.set_offline(!navigator.onLine);
					if($p.wsql.get_user_param("couch_direct")){
						var on_user_log_in = eve.attachEvent("user_log_in", function () {
							eve.detachEvent(on_user_log_in);
							load_data();
						});
						if($p.wsql.get_user_param("zone") == job_prm.zone_demo &&
							!$p.wsql.get_user_param("user_name") && job_prm.guests.length){
							$p.wsql.set_user_param("enable_save_pwd", true);
							$p.wsql.set_user_param("user_name", job_prm.guests[0].username);
							$p.wsql.set_user_param("user_pwd", job_prm.guests[0].password);
						}
						setTimeout(function () {
							$p.iface.frm_auth({
								modal_dialog: true,
								try_auto: false
							});
						}, 100);
					}
					else{
						setTimeout(load_data, 20);
					}
					if (cache = window.applicationCache){
						cache.addEventListener('noupdate', function(e){
						}, false);
						cache.addEventListener('cached', function(e){
							timer_setted = true;
							if($p.iface.appcache)
								$p.iface.appcache.close();
						}, false);
						cache.addEventListener('updateready', function(e) {
							try{
								cache.swapCache();
							}catch(e){}
							$p.iface.do_reload();
						}, false);
						cache.addEventListener('error', $p.record_log, false);
					}
				}
				if(job_prm.use_ip_geo || job_prm.use_google_geo){
					$p.ipinfo = new IPInfo();
				}
				if (job_prm.use_google_geo) {
					if(!window.google || !window.google.maps){
						$p.on("iface_init", function () {
							setTimeout(function(){
								$p.load_script("https://maps.google.com/maps/api/js?key=" + job_prm.use_google_geo + "&callback=$p.ipinfo.location_callback", "script", function(){});
							}, 100);
						});
					}
					else{
						$p.ipinfo.location_callback();
					}
				}
				if(job_prm.allow_post_message){
					window.addEventListener("message", function(event) {
						if(job_prm.allow_post_message == "*" || job_prm.allow_post_message == event.origin){
							if(typeof event.data == "string"){
								try{
									var res = eval(event.data);
									if(res && event.source){
										if(typeof res == "object")
											res = JSON.stringify(res);
										else if(typeof res == "function")
											return;
										event.source.postMessage(res, "*");
									}
								}catch(e){
									$p.record_log(e);
								}
							}
						}
					});
				}
				job_prm.__define("device_type", {
					get: function () {
						var device_type = $p.wsql.get_user_param("device_type");
						if(!device_type){
							device_type = (function(i){return (i<800?"phone":(i<1024?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
							$p.wsql.set_user_param("device_type", device_type);
						}
						return device_type;
					},
					set: function (v) {
						$p.wsql.set_user_param("device_type", v);
					}
				});
				document.body.addEventListener("keydown", (ev) => eve.callEvent("keydown", [ev]), false);
				setTimeout(init_params, 10);
			}, 10);
		}, false);
		window.onbeforeunload = () => !eve.redirect && msg.onbeforeunload;
		window.addEventListener("popstat", $p.iface.hash_route);
		window.addEventListener("hashchange", $p.iface.hash_route);
	}
	set_offline(offline){
		const {job_prm} = this.$p;
		var current_offline = job_prm['offline'];
		job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
		if(current_offline != job_prm['offline']){
			current_offline = job_prm['offline'];
		}
	}
	on_rotate(e) {
		const {job_prm} = this.$p;
		job_prm.device_orient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
		if (typeof(e) != "undefined")
			$p.eve.callEvent("onOrientationChange", [job_prm.device_orient]);
	}
	log_in(onstep){
		const {job_prm, ajax} = this.$p;
		const {steps} = this;
		let irest_attr = {},
			mdd;
		onstep(steps.load_meta);
		ajax.default_attr(irest_attr, job_prm.irest_url());
		return (job_prm.offline ? Promise.resolve({responseURL: "", response: ""}) : ajax.get_ex(irest_attr.url, irest_attr))
			.then(function (req) {
				if(!job_prm.offline)
					job_prm.irest_enabled = true;
				if(req.response[0] == "{")
					return JSON.parse(req.response);
			})
			.catch(function () {
			})
			.then(function (res) {
				onstep(steps.authorization);
				mdd = res;
				mdd.root = true;
				if(job_prm.offline || job_prm.irest_enabled)
					return mdd;
				else
					return ajax.get_ex(job_prm.rest_url()+"?$format=json", true)
						.then(function () {
							return mdd;
						});
			})
			.catch(function (err) {
				if($p.iface.auth.onerror)
					$p.iface.auth.onerror(err);
				throw err;
			})
			.then(function (res) {
				onstep(steps.load_data_files);
				if(job_prm.offline)
					return res;
				$p.eve.callEvent("user_log_in", [ajax.authorized = true]);
				if(typeof res == "string")
					res = JSON.parse(res);
				if($p.msg.check_soap_result(res))
					return;
				if($p.wsql.get_user_param("enable_save_pwd"))
					$p.wsql.set_user_param("user_pwd", ajax.password);
				else if($p.wsql.get_user_param("user_pwd"))
					$p.wsql.set_user_param("user_pwd", "");
				if(res.now_1c && res.now_js)
					$p.wsql.set_user_param("time_diff", res.now_1c - res.now_js);
			})
			.then(function () {
				_md.printing_plates(mdd.printing_plates);
			});
	}
}
var events = ($p) => {
	$p.eve = new AppEvents($p);
};

var metadata_dhtmlx = {
	proto(constructor) {
		constructor.classes.InterfaceObjs = InterfaceObjs;
		constructor.prototype.load_script = function (src, type, callback) {
			return new Promise(function(resolve, reject){
				var s = document.createElement(type);
				if (type == "script") {
					s.type = "text/javascript";
					s.src = src;
					s.async = true;
					s.addEventListener('load', callback ? function () {
						callback();
						resolve();
					} : resolve, false);
				} else {
					s.type = "text/css";
					s.rel = "stylesheet";
					s.href = src;
				}
				document.head.appendChild(s);
				if(type != "script")
					resolve();
			});
		};
	},
	constructor(){
		this.iface =  new InterfaceObjs(this);
		const {load_script, wsql, utils} = this;
		utils.docxtemplater = function (blob) {
			return (window.Docxtemplater ?
				Promise.resolve() :
				Promise.all([
					load_script("https://cdn.jsdelivr.net/jszip/2/jszip.min.js", "script"),
					load_script("https://cdn.jsdelivr.net/combine/gh/open-xml-templating/docxtemplater-build/build/docxtemplater-latest.min.js,gh/open-xml-templating/docxtemplater-image-module-build/build/docxtemplater-image-module-latest.min.js", "script"),
				]))
				.then(function () {
					if(!Docxtemplater.prototype.saveAs){
						Docxtemplater.prototype.saveAs = function (name) {
							var out = this.getZip().generate({type: "blob", mimeType: utils.mime_lookup('docx')});
							wsql.alasql.utils.saveAs(out, name);
						};
					}
					return utils.blob_as_text(blob, 'array');
				})
				.then(function (buffer) {
					return new Docxtemplater().loadZip(new JSZip(buffer));
				});
		};
		widgets(this);
		events(this);
	}
};

MetaEngine
  .plugin(plugin)
  .plugin(metadata_abstract_ui_meta)
  .plugin(metadata_abstract_ui)
  .plugin(metadata_dhtmlx);
const $p$1 = new MetaEngine();

return $p$1;

})));
