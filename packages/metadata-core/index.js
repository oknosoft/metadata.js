/*!
 metadata-core v2.0.2-beta.28, built:2017-09-16
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('events'));

class I18Handler {
	get(target, name, receiver) {
		switch (name){
			case 'lang':
				return target._lang;
			case 'show_msg':
				return target._show_msg || function () {
				};
			default:
				return target.i18n[target._lang][name];
		}
	}
	set (target, name, val, receiver) {
		switch (name){
			case 'lang':
				target._lang = val;
				break;
			case 'show_msg':
        target._show_msg = val;
        break;
			default:
				target.i18n[target._lang][name] = val;
		}
		return true;
	}
}
class I18n {
	constructor(syn) {
		this.i18n = syn;
		this._lang = Object.keys(syn)[0];
		return new Proxy(this, new I18Handler());
	}
}
const msg$1 = new I18n({
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
    meta_parents: {
      enm: 'перечисления',
      cat: 'справочника',
      doc: 'документа',
      cch: 'плана видов характеристик',
      cacc: 'плана счетов',
      tsk: 'задачи',
      ireg: 'регистра сведений',
      areg: 'регистра накопления',
      accreg: 'регистра бухгалтерии',
      bp: 'бизнес процесса',
      ts_row: 'строки табличной части',
      dp: 'обработки',
      rep: 'отчета',
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
    obj_parent: 'объекта',
		offline_request: 'Запрос к серверу в автономном режиме',
		onbeforeunload: 'Окнософт: легкий клиент. Закрыть программу?',
    open_frm: 'Открыть форму',
		order_sent_title: 'Подтвердите отправку заказа',
		order_sent_message: 'Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу',
		report_error: '<i class="fa fa-exclamation-circle fa-2x fa-fw"></i> Ошибка',
		report_prepare: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i> Подготовка отчета',
		report_need_prepare: '<i class="fa fa-info fa-2x fa-fw"></i> Нажмите "Сформировать" для получения отчета',
		report_need_online: '<i class="fa fa-plug fa-2x fa-fw"></i> Нет подключения. Отчет недоступен в автономном режиме',
		request_title: 'Запрос регистрации',
		request_message: 'Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо',
    selection_parent: 'выбора',
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
});

class TabularSection {
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
	clear(selection) {
		const {_obj, _owner, _name} = this;
    if(!selection){
      _obj.length = 0;
      !_owner._data._loading && _owner._manager.emit_async('rows', _owner, {[_name]: true});
    }
    else{
      this.find_rows(selection).forEach((row) => this.del(row.row-1));
    }
		return this;
	}
	del(val) {
		const {_obj, _owner, _name} = this;
    const {_data, _manager} = _owner;
		let index;
		if (typeof val == "undefined"){
      return;
    }
		else if (typeof val == "number"){
      index = val;
    }
		else if (_obj[val.row - 1]._row === val){
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
		if (index == undefined){
      return;
    }
    if(!_data._loading && _owner.del_row(_obj[index]._row) === false){
      return;
    }
		_obj.splice(index, 1);
		_obj.forEach((row, index) => row.row = index + 1);
    !_data._loading && _manager.emit_async('rows', _owner, {[_name]: true});
		_data._modified = true;
	}
	find(val, columns) {
		const res = utils._find(this._obj, val, columns);
		return res && res._row;
	}
	find_rows(selection, callback) {
		const cb = callback ? (row) => {
			return callback.call(this, row._row);
		} : null;
		return utils._find_rows.call(this, this._obj, selection, cb);
	}
	swap(rowid1, rowid2) {
    const {_obj, _owner, _name} = this;
		[_obj[rowid1], _obj[rowid2]] = [_obj[rowid2], _obj[rowid1]];
		_obj[rowid1].row = rowid2 + 1;
		_obj[rowid2].row = rowid1 + 1;
    const {_data, _manager} = _owner;
    !_data._loading && _manager.emit_async('rows', _owner, {[_name]: true});
    _data._modified = true;
	}
	add(attr = {}, silent) {
		const {_owner, _name, _obj} = this;
    const {_manager, _data} = _owner;
		const row = _manager.obj_constructor(_name, this);
		if(!_data._loading && _owner.add_row(row) === false){
		  return;
    }
		for (let f in row._metadata().fields){
			row[f] = attr[f] || "";
		}
		row._obj.row = _obj.push(row._obj);
		Object.defineProperty(row._obj, "_row", {
			value: row,
			enumerable: false
		});
    !_data._loading && !silent && _manager.emit_async('rows', _owner, {[_name]: true});
		_data._modified = true;
		return row;
	}
	each(fn) {
	  for(let row of this._obj){
	    if(fn.call(this, row._row) === false) break;
    }
	}
	get forEach() {
		return this.each
	}
	group_by(dimensions, resources) {
		try {
			const res = this.aggregate(dimensions, resources, "SUM", true);
			return this.load(res);
		}
		catch (err) {
			this._owner._manager._owner.$p.record_log(err);
		}
	}
	sort(fields) {
		if (typeof fields == "string"){
			fields = fields.split(",");
		}
		let sql = "select * from ? order by ";
		let	res = true;
		let	has_dot;
		for(let f of fields){
      has_dot = has_dot || f.indexOf('.') !== -1;
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
    _data._loading = _loading;
    !_loading && _manager.emit_async('rows', _owner, {[_name]: true});
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
class TabularSectionRow {
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
	get _manager() {
		return this._owner._owner._manager;
	}
	get _data() {
    return this._owner._owner._data;
  }
	get row() {
		return this._obj.row || 0
	}
	_clone() {
		const {_owner, _obj} = this;
		return utils._mixin(_owner._owner._manager.obj_constructor(_owner._name, _owner), _obj)
	}
	_setter(f, v) {
		const {_owner, _obj} = this;
		const _meta = this._metadata(f);
		if (_obj[f] == v || (!v && _obj[f] == utils.blank.guid)){
      return;
    }
    const {_manager, _data} = _owner._owner;
    !_data._loading && _manager.emit_async('update', this, {[f]: _obj[f]});
		if (_meta.choice_type) {
			let prop;
			if (_meta.choice_type.path.length == 2)
				prop = this[_meta.choice_type.path[1]];
			else
				prop = _owner._owner[_meta.choice_type.path[0]];
			if (prop && prop.type){
        v = utils.fetch_type(v, prop.type);
      }
		}
		this.__setter(f, v);
		_data._modified = true;
	}
  value_change(f, mf, v) {
    return this;
  }
}


var data_tabulars = Object.freeze({
	TabularSection: TabularSection,
	TabularSectionRow: TabularSectionRow
});

class DataObj {
	constructor(attr, manager, loading) {
		if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager)){
			const tmp = manager.get(attr, true);
			if(tmp){
				return tmp;
			}
		}
		const _ts_ = {};
		Object.defineProperties(this, {
			_obj: {
				value: {
					ref: manager instanceof EnumManager ? attr.name : (manager instanceof RegisterManager ? manager.get_ref(attr) : utils.fix_guid(attr))
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
					_is_new: !(this instanceof EnumObj),
          _loading: !!loading
				},
				configurable: true
			}
		});
		if(manager.alatable && manager.push){
			manager.alatable.push(this._obj);
			manager.push(this, this._obj.ref);
		}
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
    const {_obj, _data} = this;
		if(!_data._loading){
      _data._loading = true;
      const res = this.value_change(f, mf, v);
      _data._loading = false;
      if(res === false){
        return;
      }
    }
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
						if(mgr instanceof EnumManager){
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
	  const {_data, _manager} = this;
    _data && !_data._loading && _manager.emit_async('update', this, {[f]: this._obj[f]});
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
		const {_data} = this;
		_data._modified = false;
		_data._is_new = false;
		_data._loading = false;
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
		  const {_data} = this;
			if (_data){
        _data._loading = false;
        _data._modified = false;
      }
			return Promise.resolve(this);
		}
		else {
		  this._data._loading = true;
			return this._manager.adapter.load_obj(this)
				.then(() => {
          this._data._loading = false;
					this._data._modified = false;
					return this.after_load()
				});
		}
	}
	unload() {
		const {_obj, ref, _data, _manager} = this;
		_manager.unload_obj(ref);
    _data._loading = true;
		for (const ts in this._metadata().tabular_sections){
			this[ts].clear();
		}
		for (const f in this) {
			if (this.hasOwnProperty(f)){
				delete this[f];
			}
		}
		for (const f in _obj){
			delete _obj[f];
		}
    delete this._ts_;
    delete this._obj;
	}
	save(post, operational, attachments) {
	  if(utils.is_empty_guid(this.ref)){
	    return Promise.resolve(this);
    }
    let initial_posted;
		if (this instanceof DocObj && typeof post == "boolean") {
			initial_posted = this.posted;
			this.posted = post;
		}
		const before_save_res = this.before_save();
		const reset_modified = () => {
      if (before_save_res === false) {
        if (this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted) {
          this.posted = initial_posted;
        }
      }
      else{
        this._data._modified = false;
      }
      return this;
    };
		if (before_save_res === false) {
			return Promise.reject(reset_modified());
		}
		else if (before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then) {
			return before_save_res.then(reset_modified);
		}
		if (this._metadata().hierarchical && !this._obj.parent){
      this._obj.parent = utils.blank.guid;
    }
		if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) {
			if (utils.blank.date == this.date){
				this.date = new Date();
			}
			if (!this.number_doc){
				this.new_number_doc();
			}
		}
		else {
			if (!this.id){
				this.new_number_doc();
			}
		}
		return this._manager.adapter.save_obj(this, {
		  post: post,
      operational: operational,
      attachments: attachments
		})
      .then(() => {
		  this.after_save();
		  return this;
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
	_mixin(attr, include, exclude, silent){
		if(Object.isFrozen(this)){
			return;
		}
		if(attr && typeof attr == "object"){
		  const {_not_set_loaded} = attr;
      delete attr._not_set_loaded;
      const {_data} = this;
      if(silent){
        if(_data._loading){
          silent = false;
        }
        _data._loading = true;
      }
      utils._mixin(this, attr, include, exclude);
      if(silent){
        _data._loading = false;
      }
			if(!_not_set_loaded && (_data._loading || (!utils.is_empty_guid(this.ref) && (attr.id || attr.name || attr.number_doc)))){
        this._set_loaded(this.ref);
			}
		}
	}
	print(model, wnd) {
		return this._manager.print(this, model, wnd);
	}
  after_create() {
    return this;
  }
  after_load() {
    return this;
  }
  before_save() {
    return this;
  }
  after_save() {
    return this;
  }
  value_change(f, mf, v) {
    return this;
  }
  add_row(row) {
    return this;
  }
  del_row(row) {
    return this;
  }
}
Object.defineProperty(DataObj.prototype, "ref", {
	get : function(){ return this._obj ? this._obj.ref : utils.blank.guid},
	set : function(v){ this._obj.ref = utils.fix_guid(v);},
	enumerable : true,
	configurable: true
});
TabularSectionRow.prototype._getter = DataObj.prototype._getter;
TabularSectionRow.prototype.__setter = DataObj.prototype.__setter;
class CatObj extends DataObj {
	constructor(attr, manager, loading){
		super(attr, manager, loading);
		this._mixin(attr);
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
class DocObj extends NumberDocAndDate(DataObj) {
	constructor(attr, manager, loading){
		super(attr, manager, loading);
		this._mixin(attr);
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
class DataProcessorObj extends DataObj {
	constructor(attr, manager, loading) {
		super(attr, manager, loading);
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
class TaskObj extends NumberDocAndDate(CatObj) {
}
class BusinessProcessObj extends NumberDocAndDate(CatObj) {
}
class EnumObj extends DataObj {
	constructor(attr, manager, loading) {
		super(attr, manager, loading);
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
class RegisterRow extends DataObj {
	constructor(attr, manager, loading) {
		super(attr, manager, loading);
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
	set ref(v) {
	}
	get presentation() {
		return this._metadata().obj_presentation || this._metadata().synonym;
	}
}


var data_objs = Object.freeze({
	DataObj: DataObj,
	CatObj: CatObj,
	NumberDocAndDate: NumberDocAndDate,
	DocObj: DocObj,
	DataProcessorObj: DataProcessorObj,
	TaskObj: TaskObj,
	BusinessProcessObj: BusinessProcessObj,
	EnumObj: EnumObj,
	RegisterRow: RegisterRow
});

class MetaEventEmitter extends EventEmitter{
  constructor() {
    super();
    this.setMaxListeners(20);
  }
	on(type, listener){
		if(typeof listener == 'function' && typeof type != 'object'){
			super.on(type, listener);
			return [type, listener];
		}
		else{
			for(let fld in type){
				if(typeof type[fld] == 'function'){
					super.on(fld, type[fld]);
				}
			}
			return this;
		}
	}
	off(type, listener){
		if(listener){
			super.removeListener(type, listener);
		}
		else if(Array.isArray(type)){
			super.removeListener(...type);
		}
		else if(typeof type == 'function'){
			throw new TypeError('MetaEventEmitter.off: type must be a string')
		}
		else{
			super.removeAllListeners(type);
		}
	}
  _distinct(type, handler) {
    const res = [];
    switch (type){
      case 'update':
      case 'rows':
        for(const arg of handler.args){
          if(res.some(row => {
              if(row[0] == arg[0]){
                if(!row[1].hasOwnProperty(Object.keys(arg[1])[0])){
                  Object.assign(row[1], arg[1]);
                }
                return true;
              }
            })){
            continue;
          }
          res.push(arg);
        }
        break;
      default:
        let len = 0;
        for(const arg of handler.args){
          len = Math.max(len, arg.length);
          if(res.some(row => {
              for(let i = 0; i < len; i++){
                if(arg[i] != row[i]){
                  return true;
                }
              }
            })){
            continue;
          }
          res.push(arg);
        }
    }
    handler.timer = 0;
    handler.args.length = 0;
    return res;
  }
	_emit(type) {
    for(const args of this._distinct(type, this._async[type])){
      this.emit(type, ...args);
    }
  }
  emit_async(type, ...args) {
    if (!this._events || !this._events[type]){
      return;
    }
    if (!this._async){
      this._async = {};
    }
    if (!this._async[type]){
      this._async[type] = {'args': []};
    }
    const handler = this._async[type];
    handler.timer && clearTimeout(handler.timer);
    handler.args.push(args);
    handler.timer = setTimeout(this._emit.bind(this, type), 4);
  }
  emit_add_fields(obj, fields){
    const {_async} = this;
    _async && _async.update && _async.update.args.some(attr => {
      if(attr[0] === obj) {
        for(const fld of fields){
          if(!attr[1].hasOwnProperty(fld)){
            attr[1][fld] = undefined;
          }
        }
        return true;
      }
    });
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
		return msg$1.meta_mgrs[this._owner.name]
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
	get acl() {
	  const {current_user} = this._owner.$p;
    return current_user ? current_user.get_acl(this.class_name) : 'r';
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
	get_option_list(selection = {}, val){
		let t = this, l = [], input_by_string, text;
		function push(v){
			if(selection._dhtmlx){
				v = {
					text: v.presentation,
					value: v.ref
				};
				if(utils.is_equal(v.value, val)){
					v.selected = true;
				}
			}
			l.push(v);
		}
		if(selection.presentation && (input_by_string = t.metadata().input_by_string)){
			text = selection.presentation.like;
			delete selection.presentation;
			selection.or = [];
			input_by_string.forEach((fld) => {
				const sel = {};
				sel[fld] = {like: text};
				selection.or.push(sel);
			});
		}
		if(t.cachable == "ram" || (selection && selection._local)) {
			t.find_rows(selection, push);
			return Promise.resolve(l);
		}
		else if(t.cachable != "e1cib"){
		  return t.adapter.find_rows(t, selection)
        .then((data) => {
		    for(const v of data){
		      push(v);
		    }
		    return l;
		  });
		}
		else{
			var attr = { selection: selection, top: selection._top},
				is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
			delete selection._top;
			if(is_doc)
				attr.fields = ["ref", "date", "number_doc"];
			else if(t.metadata().main_presentation_name)
				attr.fields = ["ref", "name"];
			else
				attr.fields = ["ref", "id"];
			return _rest.load_array(attr, t)
				.then((data) => {
					data.forEach(push);
					return l;
				});
		}
	}
	value_mgr(row, f, mf, array_enabled, v) {
		const {$p} = this._owner;
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
					if (mgr.by_ref[property]){
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
						if(mgr.by_ref[property]){
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
  unload_obj(ref) {
    delete this.by_ref[ref];
    this.alatable.some((o, i, a) => {
      if(o.ref == ref){
        a.splice(i, 1);
        return true;
      }
    });
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
		const rp = 'promise';
		if(typeof ref === 'object'){
      ref = utils.fix_guid(ref);
    }
		let o = this.by_ref[ref];
		if(arguments.length == 3){
			if(do_not_create){
				do_not_create = rp;
			}
			else{
				do_not_create = arguments[2];
			}
		}
		if(!o){
			if(do_not_create && do_not_create != rp){
				return;
			}
			else{
				o = this.obj_constructor('', [ref, this]);
			}
		}
		if(ref === utils.blank.guid){
			return do_not_create == rp ? Promise.resolve(o) : o;
		}
		if(o.is_new()){
			if(do_not_create == rp){
				return o.load();
			}
			else{
				return o;
			}
		}else{
			return do_not_create == rp ? Promise.resolve(o) : o;
		}
	}
	create(attr, fill_default, force_obj){
		if(!attr || typeof attr !== "object"){
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
			if(force_obj){
				return o;
			}
			if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
			}else{
				if(o instanceof DocObj && o.date == utils.blank.date){
					o.date = new Date();
				}
				const after_create_res = o.after_create();
				let call_new_number_doc;
				if((this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager)){
					if(!o.number_doc){
						call_new_number_doc = true;
					}
				}
				else{
					if(!o.id){
						call_new_number_doc = true;
					}
				}
				return (call_new_number_doc ? o.new_number_doc() : Promise.resolve(o))
					.then(() => {
						if(after_create_res === false)
							return o;
						else if(typeof after_create_res === "object" && after_create_res.then)
							return after_create_res;
						if(this.cachable == "e1cib" && fill_default){
              const {ajax} = this._owner.$p;
              const rattr = {};
							ajax.default_attr(rattr, job_prm.irest_url());
							rattr.url += this.rest_name + "/Create()";
							return ajax.get_ex(rattr.url, rattr)
								.then(function (req) {
									return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
								});
						}else
							return o;
					})
			}
		}
		return force_obj ? o : Promise.resolve(o);
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
				obj = this.obj_constructor('', [attr, this, true]);
				forse && obj.is_new() && obj._set_loaded();
			}
			else if(obj.is_new() || forse){
        obj._data._loading = true;
				obj._mixin(attr);
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
				}else if(t instanceof DocManager){
					flds.push("posted");
					flds.push("date");
					flds.push("number_doc");
				}else{
					if(cmd["hierarchical"] && cmd["group_hierarchy"])
						flds.push("is_folder");
					else
						flds.push("0 as is_folder");
					if(t instanceof ChartOfAccountManager){
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
				if(t instanceof ChartOfAccountManager){
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
				}else if(t instanceof DocManager)
					s += " OR _t_.number_doc LIKE '" + filter + "'";
				else{
					if(cmd["main_presentation_name"] || t instanceof ChartOfAccountManager)
						s += " OR _t_.name LIKE '" + filter + "'";
					if(cmd["code_length"])
						s += " OR _t_.id LIKE '" + filter + "'";
				}
				s += ") AND (_t_.ref != '" + utils.blank.guid + "')";
				if(attr.selection){
					if(typeof attr.selection === "function"){
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
				if(t instanceof ChartOfAccountManager){
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
			const sql = t.sql_selection_list_flds ? t.sql_selection_list_flds(initial_value) :
        `SELECT ${list_flds()}, case when _t_.ref = '${initial_value}' then 0 else 1 end as is_initial_value
				 FROM ${t.table_name} AS _t_ ${join_flds()} %3 %4 LIMIT 300`;
			return sql.replace("%3", where_flds()).replace("%4", order_flds());
		}
		function sql_create(){
			var sql = "CREATE TABLE IF NOT EXISTS ";
			if(attr && attr.postgres){
				sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";
				if(t instanceof DocManager)
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
				if(t instanceof DocManager)
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
		if(!this._predefined){
      const predefined = this._predefined = {};
      this.find_rows({predefined_name: {not: ''}}, (el) => {
        predefined[el.predefined_name] = el;
      });
    }
		return this._predefined[name];
	}
}
class DataProcessorsManager extends DataManager{
	create(attr = {}){
		return this.obj_constructor('', [attr, this]);
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
	unload_obj() {	}
}
class EnumManager extends RefDataManager{
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
	get_option_list(selection = {}, val){
		var l = [], synonym = "", sref;
    function push(v){
      if(selection._dhtmlx){
        v = {
          text: v.presentation,
          value: v.ref
        };
        if(utils.is_equal(v.value, val)){
          v.selected = true;
        }
      }
      l.push(v);
    }
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
			push(this[v.ref]);
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
	load_array(aattr, forse) {
		var ref, obj, res = [];
		for (var i = 0; i < aattr.length; i++) {
			ref = this.get_ref(aattr[i]);
			obj = this.by_ref[ref];
			if (!obj && !aattr[i]._deleted) {
				obj = this.obj_constructor('', [aattr[i], this, true]);
				forse && obj.is_new() && obj._set_loaded();
			}
			else if (obj && aattr[i]._deleted) {
				obj.unload();
				continue;
			}
			else if (forse) {
        obj._data._loading = true;
				obj._mixin(aattr[i]);
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
class CatManager extends RefDataManager{
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
		let o;
		this.find_rows({name: name}, obj => {
			o = obj;
			return false;
		});
		return o || this.get();
	}
	by_id(id) {
    let o;
		this.find_rows({id: id}, obj => {
			o = obj;
			return false;
		});
    return o || this.get();
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
class ChartOfCharacteristicManager extends CatManager{
}
class ChartOfAccountManager extends CatManager{
}
class DocManager extends RefDataManager{
}
class TaskManager extends CatManager{
}
class BusinessProcessManager extends CatManager{
}


var data_managers = Object.freeze({
	DataManager: DataManager,
	RefDataManager: RefDataManager,
	DataProcessorsManager: DataProcessorsManager,
	EnumManager: EnumManager,
	RegisterManager: RegisterManager,
	InfoRegManager: InfoRegManager,
	AccumRegManager: AccumRegManager,
	CatManager: CatManager,
	ChartOfCharacteristicManager: ChartOfCharacteristicManager,
	ChartOfAccountManager: ChartOfAccountManager,
	DocManager: DocManager,
	TaskManager: TaskManager,
	BusinessProcessManager: BusinessProcessManager
});

var mime = function (target) {
  Object.defineProperties(target, {
    mime_db: {
      value: {
        'application/andrew-inset': {
          'extensions': ['ez'],
        },
        'application/applixware': {
          'extensions': ['aw'],
        },
        'application/atom+xml': {
          'compressible': true,
          'extensions': ['atom'],
        },
        'application/atomcat+xml': {
          'extensions': ['atomcat'],
        },
        'application/atomsvc+xml': {
          'extensions': ['atomsvc'],
        },
        'application/bdoc': {
          'compressible': false,
          'extensions': ['bdoc'],
        },
        'application/ccxml+xml': {
          'extensions': ['ccxml'],
        },
        'application/cdmi-capability': {
          'extensions': ['cdmia'],
        },
        'application/cdmi-container': {
          'extensions': ['cdmic'],
        },
        'application/cdmi-domain': {
          'extensions': ['cdmid'],
        },
        'application/cdmi-object': {
          'extensions': ['cdmio'],
        },
        'application/cdmi-queue': {
          'extensions': ['cdmiq'],
        },
        'application/cu-seeme': {
          'extensions': ['cu'],
        },
        'application/dash+xml': {
          'extensions': ['mpd'],
        },
        'application/davmount+xml': {
          'extensions': ['davmount'],
        },
        'application/docbook+xml': {
          'extensions': ['dbk'],
        },
        'application/dssc+der': {
          'extensions': ['dssc'],
        },
        'application/dssc+xml': {
          'extensions': ['xdssc'],
        },
        'application/ecmascript': {
          'compressible': true,
          'extensions': ['ecma'],
        },
        'application/emma+xml': {
          'extensions': ['emma'],
        },
        'application/epub+zip': {
          'extensions': ['epub'],
        },
        'application/exi': {
          'extensions': ['exi'],
        },
        'application/font-tdpfr': {
          'extensions': ['pfr'],
        },
        'application/font-woff': {
          'compressible': false,
          'extensions': ['woff'],
        },
        'application/font-woff2': {
          'compressible': false,
          'extensions': ['woff2'],
        },
        'application/gml+xml': {
          'extensions': ['gml'],
        },
        'application/gpx+xml': {
          'extensions': ['gpx'],
        },
        'application/gxf': {
          'extensions': ['gxf'],
        },
        'application/hyperstudio': {
          'extensions': ['stk'],
        },
        'application/inkml+xml': {
          'extensions': ['ink', 'inkml'],
        },
        'application/ipfix': {
          'extensions': ['ipfix'],
        },
        'application/java-archive': {
          'compressible': false,
          'extensions': ['jar', 'war', 'ear'],
        },
        'application/java-serialized-object': {
          'compressible': false,
          'extensions': ['ser'],
        },
        'application/java-vm': {
          'compressible': false,
          'extensions': ['class'],
        },
        'application/javascript': {
          'charset': 'UTF-8',
          'compressible': true,
          'extensions': ['js'],
        },
        'application/json': {
          'charset': 'UTF-8',
          'compressible': true,
          'extensions': ['json', 'map'],
        },
        'application/json-patch+json': {
          'compressible': true,
        },
        'application/json5': {
          'extensions': ['json5'],
        },
        'application/jsonml+json': {
          'compressible': true,
          'extensions': ['jsonml'],
        },
        'application/ld+json': {
          'compressible': true,
          'extensions': ['jsonld'],
        },
        'application/lost+xml': {
          'extensions': ['lostxml'],
        },
        'application/mac-binhex40': {
          'extensions': ['hqx'],
        },
        'application/mac-compactpro': {
          'extensions': ['cpt'],
        },
        'application/mads+xml': {
          'extensions': ['mads'],
        },
        'application/manifest+json': {
          'charset': 'UTF-8',
          'compressible': true,
          'extensions': ['webmanifest'],
        },
        'application/marc': {
          'extensions': ['mrc'],
        },
        'application/marcxml+xml': {
          'extensions': ['mrcx'],
        },
        'application/mathematica': {
          'extensions': ['ma', 'nb', 'mb'],
        },
        'application/mathml+xml': {
          'extensions': ['mathml'],
        },
        'application/mbox': {
          'extensions': ['mbox'],
        },
        'application/mediaservercontrol+xml': {
          'extensions': ['mscml'],
        },
        'application/metalink+xml': {
          'extensions': ['metalink'],
        },
        'application/metalink4+xml': {
          'extensions': ['meta4'],
        },
        'application/mets+xml': {
          'extensions': ['mets'],
        },
        'application/mods+xml': {
          'extensions': ['mods'],
        },
        'application/mp21': {
          'extensions': ['m21', 'mp21'],
        },
        'application/mp4': {
          'extensions': ['mp4s', 'm4p'],
        },
        'application/msword': {
          'compressible': false,
          'extensions': ['doc', 'dot'],
        },
        'application/mxf': {
          'extensions': ['mxf'],
        },
        'application/octet-stream': {
          'compressible': false,
          'extensions': ['bin', 'dms', 'lrf', 'mar', 'so', 'dist', 'distz', 'pkg', 'bpk', 'dump', 'elc', 'deploy', 'exe', 'dll', 'deb', 'dmg', 'iso', 'img', 'msi', 'msp', 'msm', 'buffer'],
        },
        'application/oda': {
          'extensions': ['oda'],
        },
        'application/oebps-package+xml': {
          'extensions': ['opf'],
        },
        'application/ogg': {
          'compressible': false,
          'extensions': ['ogx'],
        },
        'application/omdoc+xml': {
          'extensions': ['omdoc'],
        },
        'application/onenote': {
          'extensions': ['onetoc', 'onetoc2', 'onetmp', 'onepkg'],
        },
        'application/oxps': {
          'extensions': ['oxps'],
        },
        'application/patch-ops-error+xml': {
          'extensions': ['xer'],
        },
        'application/pdf': {
          'compressible': false,
          'extensions': ['pdf'],
        },
        'application/pgp-encrypted': {
          'compressible': false,
          'extensions': ['pgp'],
        },
        'application/pgp-signature': {
          'extensions': ['asc', 'sig'],
        },
        'application/pics-rules': {
          'extensions': ['prf'],
        },
        'application/pkcs10': {
          'extensions': ['p10'],
        },
        'application/pkcs7-mime': {
          'extensions': ['p7m', 'p7c'],
        },
        'application/pkcs7-signature': {
          'extensions': ['p7s'],
        },
        'application/pkcs8': {
          'extensions': ['p8'],
        },
        'application/pkix-attr-cert': {
          'extensions': ['ac'],
        },
        'application/pkix-cert': {
          'extensions': ['cer'],
        },
        'application/pkix-crl': {
          'extensions': ['crl'],
        },
        'application/pkix-pkipath': {
          'extensions': ['pkipath'],
        },
        'application/pkixcmp': {
          'extensions': ['pki'],
        },
        'application/pls+xml': {
          'extensions': ['pls'],
        },
        'application/postscript': {
          'compressible': true,
          'extensions': ['ai', 'eps', 'ps'],
        },
        'application/prs.cww': {
          'extensions': ['cww'],
        },
        'application/pskc+xml': {
          'extensions': ['pskcxml'],
        },
        'application/rdf+xml': {
          'compressible': true,
          'extensions': ['rdf'],
        },
        'application/reginfo+xml': {
          'extensions': ['rif'],
        },
        'application/relax-ng-compact-syntax': {
          'extensions': ['rnc'],
        },
        'application/resource-lists+xml': {
          'extensions': ['rl'],
        },
        'application/resource-lists-diff+xml': {
          'extensions': ['rld'],
        },
        'application/rls-services+xml': {
          'extensions': ['rs'],
        },
        'application/rpki-ghostbusters': {
          'extensions': ['gbr'],
        },
        'application/rpki-manifest': {
          'extensions': ['mft'],
        },
        'application/rpki-roa': {
          'extensions': ['roa'],
        },
        'application/rsd+xml': {
          'extensions': ['rsd'],
        },
        'application/rss+xml': {
          'compressible': true,
          'extensions': ['rss'],
        },
        'application/rtf': {
          'compressible': true,
          'extensions': ['rtf'],
        },
        'application/sbml+xml': {
          'extensions': ['sbml'],
        },
        'application/scvp-cv-request': {
          'extensions': ['scq'],
        },
        'application/scvp-cv-response': {
          'extensions': ['scs'],
        },
        'application/scvp-vp-request': {
          'extensions': ['spq'],
        },
        'application/scvp-vp-response': {
          'extensions': ['spp'],
        },
        'application/sdp': {
          'extensions': ['sdp'],
        },
        'application/set-payment-initiation': {
          'extensions': ['setpay'],
        },
        'application/set-registration-initiation': {
          'extensions': ['setreg'],
        },
        'application/shf+xml': {
          'extensions': ['shf'],
        },
        'application/smil+xml': {
          'extensions': ['smi', 'smil'],
        },
        'application/sparql-query': {
          'extensions': ['rq'],
        },
        'application/sparql-results+xml': {
          'extensions': ['srx'],
        },
        'application/srgs': {
          'extensions': ['gram'],
        },
        'application/srgs+xml': {
          'extensions': ['grxml'],
        },
        'application/sru+xml': {
          'extensions': ['sru'],
        },
        'application/ssdl+xml': {
          'extensions': ['ssdl'],
        },
        'application/ssml+xml': {
          'extensions': ['ssml'],
        },
        'application/tei+xml': {
          'extensions': ['tei', 'teicorpus'],
        },
        'application/thraud+xml': {
          'extensions': ['tfi'],
        },
        'application/timestamped-data': {
          'extensions': ['tsd'],
        },
        'application/vnd.3gpp.pic-bw-large': {
          'extensions': ['plb'],
        },
        'application/vnd.3gpp.pic-bw-small': {
          'extensions': ['psb'],
        },
        'application/vnd.3gpp.pic-bw-var': {
          'extensions': ['pvb'],
        },
        'application/vnd.3gpp2.tcap': {
          'extensions': ['tcap'],
        },
        'application/vnd.3m.post-it-notes': {
          'extensions': ['pwn'],
        },
        'application/vnd.accpac.simply.aso': {
          'extensions': ['aso'],
        },
        'application/vnd.accpac.simply.imp': {
          'extensions': ['imp'],
        },
        'application/vnd.acucobol': {
          'extensions': ['acu'],
        },
        'application/vnd.acucorp': {
          'extensions': ['atc', 'acutc'],
        },
        'application/vnd.adobe.air-application-installer-package+zip': {
          'extensions': ['air'],
        },
        'application/vnd.adobe.formscentral.fcdt': {
          'extensions': ['fcdt'],
        },
        'application/vnd.adobe.fxp': {
          'extensions': ['fxp', 'fxpl'],
        },
        'application/vnd.adobe.xdp+xml': {
          'extensions': ['xdp'],
        },
        'application/vnd.adobe.xfdf': {
          'extensions': ['xfdf'],
        },
        'application/vnd.ahead.space': {
          'extensions': ['ahead'],
        },
        'application/vnd.airzip.filesecure.azf': {
          'extensions': ['azf'],
        },
        'application/vnd.airzip.filesecure.azs': {
          'extensions': ['azs'],
        },
        'application/vnd.amazon.ebook': {
          'extensions': ['azw'],
        },
        'application/vnd.americandynamics.acc': {
          'extensions': ['acc'],
        },
        'application/vnd.amiga.ami': {
          'extensions': ['ami'],
        },
        'application/vnd.android.package-archive': {
          'compressible': false,
          'extensions': ['apk'],
        },
        'application/vnd.anser-web-certificate-issue-initiation': {
          'extensions': ['cii'],
        },
        'application/vnd.anser-web-funds-transfer-initiation': {
          'extensions': ['fti'],
        },
        'application/vnd.antix.game-component': {
          'extensions': ['atx'],
        },
        'application/vnd.apple.installer+xml': {
          'extensions': ['mpkg'],
        },
        'application/vnd.apple.mpegurl': {
          'extensions': ['m3u8'],
        },
        'application/vnd.apple.pkpass': {
          'compressible': false,
          'extensions': ['pkpass'],
        },
        'application/vnd.aristanetworks.swi': {
          'extensions': ['swi'],
        },
        'application/vnd.astraea-software.iota': {
          'extensions': ['iota'],
        },
        'application/vnd.audiograph': {
          'extensions': ['aep'],
        },
        'application/vnd.blueice.multipass': {
          'extensions': ['mpm'],
        },
        'application/vnd.bmi': {
          'extensions': ['bmi'],
        },
        'application/vnd.businessobjects': {
          'extensions': ['rep'],
        },
        'application/vnd.chemdraw+xml': {
          'extensions': ['cdxml'],
        },
        'application/vnd.chipnuts.karaoke-mmd': {
          'extensions': ['mmd'],
        },
        'application/vnd.cinderella': {
          'extensions': ['cdy'],
        },
        'application/vnd.claymore': {
          'extensions': ['cla'],
        },
        'application/vnd.cloanto.rp9': {
          'extensions': ['rp9'],
        },
        'application/vnd.clonk.c4group': {
          'extensions': ['c4g', 'c4d', 'c4f', 'c4p', 'c4u'],
        },
        'application/vnd.cluetrust.cartomobile-config': {
          'extensions': ['c11amc'],
        },
        'application/vnd.cluetrust.cartomobile-config-pkg': {
          'extensions': ['c11amz'],
        },
        'application/vnd.commonspace': {
          'extensions': ['csp'],
        },
        'application/vnd.contact.cmsg': {
          'extensions': ['cdbcmsg'],
        },
        'application/vnd.cosmocaller': {
          'extensions': ['cmc'],
        },
        'application/vnd.crick.clicker': {
          'extensions': ['clkx'],
        },
        'application/vnd.crick.clicker.keyboard': {
          'extensions': ['clkk'],
        },
        'application/vnd.crick.clicker.palette': {
          'extensions': ['clkp'],
        },
        'application/vnd.crick.clicker.template': {
          'extensions': ['clkt'],
        },
        'application/vnd.crick.clicker.wordbank': {
          'extensions': ['clkw'],
        },
        'application/vnd.criticaltools.wbs+xml': {
          'extensions': ['wbs'],
        },
        'application/vnd.ctc-posml': {
          'extensions': ['pml'],
        },
        'application/vnd.cups-ppd': {
          'extensions': ['ppd'],
        },
        'application/vnd.curl.car': {
          'extensions': ['car'],
        },
        'application/vnd.curl.pcurl': {
          'extensions': ['pcurl'],
        },
        'application/vnd.dart': {
          'compressible': true,
          'extensions': ['dart'],
        },
        'application/vnd.data-vision.rdz': {
          'extensions': ['rdz'],
        },
        'application/vnd.dece.data': {
          'extensions': ['uvf', 'uvvf', 'uvd', 'uvvd'],
        },
        'application/vnd.dece.ttml+xml': {
          'extensions': ['uvt', 'uvvt'],
        },
        'application/vnd.dece.unspecified': {
          'extensions': ['uvx', 'uvvx'],
        },
        'application/vnd.dece.zip': {
          'extensions': ['uvz', 'uvvz'],
        },
        'application/vnd.denovo.fcselayout-link': {
          'extensions': ['fe_launch'],
        },
        'application/vnd.dna': {
          'extensions': ['dna'],
        },
        'application/vnd.dolby.mlp': {
          'extensions': ['mlp'],
        },
        'application/vnd.dpgraph': {
          'extensions': ['dpg'],
        },
        'application/vnd.dreamfactory': {
          'extensions': ['dfac'],
        },
        'application/vnd.ds-keypoint': {
          'extensions': ['kpxx'],
        },
        'application/vnd.dvb.ait': {
          'extensions': ['ait'],
        },
        'application/vnd.dvb.service': {
          'extensions': ['svc'],
        },
        'application/vnd.dynageo': {
          'extensions': ['geo'],
        },
        'application/vnd.ecowin.chart': {
          'extensions': ['mag'],
        },
        'application/vnd.enliven': {
          'extensions': ['nml'],
        },
        'application/vnd.epson.esf': {
          'extensions': ['esf'],
        },
        'application/vnd.epson.msf': {
          'extensions': ['msf'],
        },
        'application/vnd.epson.quickanime': {
          'extensions': ['qam'],
        },
        'application/vnd.epson.salt': {
          'extensions': ['slt'],
        },
        'application/vnd.epson.ssf': {
          'extensions': ['ssf'],
        },
        'application/vnd.eszigno3+xml': {
          'extensions': ['es3', 'et3'],
        },
        'application/vnd.ezpix-album': {
          'extensions': ['ez2'],
        },
        'application/vnd.ezpix-package': {
          'extensions': ['ez3'],
        },
        'application/vnd.fdf': {
          'extensions': ['fdf'],
        },
        'application/vnd.fdsn.mseed': {
          'extensions': ['mseed'],
        },
        'application/vnd.fdsn.seed': {
          'extensions': ['seed', 'dataless'],
        },
        'application/vnd.flographit': {
          'extensions': ['gph'],
        },
        'application/vnd.fluxtime.clip': {
          'extensions': ['ftc'],
        },
        'application/vnd.framemaker': {
          'extensions': ['fm', 'frame', 'maker', 'book'],
        },
        'application/vnd.frogans.fnc': {
          'extensions': ['fnc'],
        },
        'application/vnd.frogans.ltf': {
          'extensions': ['ltf'],
        },
        'application/vnd.fsc.weblaunch': {
          'extensions': ['fsc'],
        },
        'application/vnd.fujitsu.oasys': {
          'extensions': ['oas'],
        },
        'application/vnd.fujitsu.oasys2': {
          'extensions': ['oa2'],
        },
        'application/vnd.fujitsu.oasys3': {
          'extensions': ['oa3'],
        },
        'application/vnd.fujitsu.oasysgp': {
          'extensions': ['fg5'],
        },
        'application/vnd.fujitsu.oasysprs': {
          'extensions': ['bh2'],
        },
        'application/vnd.fujixerox.ddd': {
          'extensions': ['ddd'],
        },
        'application/vnd.fujixerox.docuworks': {
          'extensions': ['xdw'],
        },
        'application/vnd.fujixerox.docuworks.binder': {
          'extensions': ['xbd'],
        },
        'application/vnd.fuzzysheet': {
          'extensions': ['fzs'],
        },
        'application/vnd.genomatix.tuxedo': {
          'extensions': ['txd'],
        },
        'application/vnd.geogebra.file': {
          'extensions': ['ggb'],
        },
        'application/vnd.geogebra.tool': {
          'extensions': ['ggt'],
        },
        'application/vnd.geometry-explorer': {
          'extensions': ['gex', 'gre'],
        },
        'application/vnd.geonext': {
          'extensions': ['gxt'],
        },
        'application/vnd.geoplan': {
          'extensions': ['g2w'],
        },
        'application/vnd.geospace': {
          'extensions': ['g3w'],
        },
        'application/vnd.gmx': {
          'extensions': ['gmx'],
        },
        'application/vnd.google-apps.document': {
          'compressible': false,
          'extensions': ['gdoc'],
        },
        'application/vnd.google-apps.presentation': {
          'compressible': false,
          'extensions': ['gslides'],
        },
        'application/vnd.google-apps.spreadsheet': {
          'compressible': false,
          'extensions': ['gsheet'],
        },
        'application/vnd.google-earth.kml+xml': {
          'compressible': true,
          'extensions': ['kml'],
        },
        'application/vnd.google-earth.kmz': {
          'compressible': false,
          'extensions': ['kmz'],
        },
        'application/vnd.grafeq': {
          'extensions': ['gqf', 'gqs'],
        },
        'application/vnd.groove-account': {
          'extensions': ['gac'],
        },
        'application/vnd.groove-help': {
          'extensions': ['ghf'],
        },
        'application/vnd.groove-identity-message': {
          'extensions': ['gim'],
        },
        'application/vnd.groove-injector': {
          'extensions': ['grv'],
        },
        'application/vnd.groove-tool-message': {
          'extensions': ['gtm'],
        },
        'application/vnd.groove-tool-template': {
          'extensions': ['tpl'],
        },
        'application/vnd.groove-vcard': {
          'extensions': ['vcg'],
        },
        'application/vnd.hal+xml': {
          'extensions': ['hal'],
        },
        'application/vnd.handheld-entertainment+xml': {
          'extensions': ['zmm'],
        },
        'application/vnd.hbci': {
          'extensions': ['hbci'],
        },
        'application/vnd.hhe.lesson-player': {
          'extensions': ['les'],
        },
        'application/vnd.hp-hpgl': {
          'extensions': ['hpgl'],
        },
        'application/vnd.hp-hpid': {
          'extensions': ['hpid'],
        },
        'application/vnd.hp-hps': {
          'extensions': ['hps'],
        },
        'application/vnd.hp-jlyt': {
          'extensions': ['jlt'],
        },
        'application/vnd.hp-pcl': {
          'extensions': ['pcl'],
        },
        'application/vnd.hp-pclxl': {
          'extensions': ['pclxl'],
        },
        'application/vnd.hydrostatix.sof-data': {
          'extensions': ['sfd-hdstx'],
        },
        'application/vnd.ibm.minipay': {
          'extensions': ['mpy'],
        },
        'application/vnd.ibm.modcap': {
          'extensions': ['afp', 'listafp', 'list3820'],
        },
        'application/vnd.ibm.rights-management': {
          'extensions': ['irm'],
        },
        'application/vnd.ibm.secure-container': {
          'extensions': ['sc'],
        },
        'application/vnd.iccprofile': {
          'extensions': ['icc', 'icm'],
        },
        'application/vnd.igloader': {
          'extensions': ['igl'],
        },
        'application/vnd.immervision-ivp': {
          'extensions': ['ivp'],
        },
        'application/vnd.immervision-ivu': {
          'extensions': ['ivu'],
        },
        'application/vnd.insors.igm': {
          'extensions': ['igm'],
        },
        'application/vnd.intercon.formnet': {
          'extensions': ['xpw', 'xpx'],
        },
        'application/vnd.intergeo': {
          'extensions': ['i2g'],
        },
        'application/vnd.intu.qbo': {
          'extensions': ['qbo'],
        },
        'application/vnd.intu.qfx': {
          'extensions': ['qfx'],
        },
        'application/vnd.ipunplugged.rcprofile': {
          'extensions': ['rcprofile'],
        },
        'application/vnd.irepository.package+xml': {
          'extensions': ['irp'],
        },
        'application/vnd.is-xpr': {
          'extensions': ['xpr'],
        },
        'application/vnd.isac.fcs': {
          'extensions': ['fcs'],
        },
        'application/vnd.jam': {
          'extensions': ['jam'],
        },
        'application/vnd.jcp.javame.midlet-rms': {
          'extensions': ['rms'],
        },
        'application/vnd.jisp': {
          'extensions': ['jisp'],
        },
        'application/vnd.joost.joda-archive': {
          'extensions': ['joda'],
        },
        'application/vnd.kahootz': {
          'extensions': ['ktz', 'ktr'],
        },
        'application/vnd.kde.karbon': {
          'extensions': ['karbon'],
        },
        'application/vnd.kde.kchart': {
          'extensions': ['chrt'],
        },
        'application/vnd.kde.kformula': {
          'extensions': ['kfo'],
        },
        'application/vnd.kde.kivio': {
          'extensions': ['flw'],
        },
        'application/vnd.kde.kontour': {
          'extensions': ['kon'],
        },
        'application/vnd.kde.kpresenter': {
          'extensions': ['kpr', 'kpt'],
        },
        'application/vnd.kde.kspread': {
          'extensions': ['ksp'],
        },
        'application/vnd.kde.kword': {
          'extensions': ['kwd', 'kwt'],
        },
        'application/vnd.kenameaapp': {
          'extensions': ['htke'],
        },
        'application/vnd.kidspiration': {
          'extensions': ['kia'],
        },
        'application/vnd.kinar': {
          'extensions': ['kne', 'knp'],
        },
        'application/vnd.koan': {
          'extensions': ['skp', 'skd', 'skt', 'skm'],
        },
        'application/vnd.kodak-descriptor': {
          'extensions': ['sse'],
        },
        'application/vnd.las.las+xml': {
          'extensions': ['lasxml'],
        },
        'application/vnd.llamagraphics.life-balance.desktop': {
          'extensions': ['lbd'],
        },
        'application/vnd.llamagraphics.life-balance.exchange+xml': {
          'extensions': ['lbe'],
        },
        'application/vnd.lotus-1-2-3': {
          'extensions': ['123'],
        },
        'application/vnd.lotus-approach': {
          'extensions': ['apr'],
        },
        'application/vnd.lotus-freelance': {
          'extensions': ['pre'],
        },
        'application/vnd.lotus-notes': {
          'extensions': ['nsf'],
        },
        'application/vnd.lotus-organizer': {
          'extensions': ['org'],
        },
        'application/vnd.lotus-screencam': {
          'extensions': ['scm'],
        },
        'application/vnd.lotus-wordpro': {
          'extensions': ['lwp'],
        },
        'application/vnd.macports.portpkg': {
          'extensions': ['portpkg'],
        },
        'application/vnd.mcd': {
          'extensions': ['mcd'],
        },
        'application/vnd.medcalcdata': {
          'extensions': ['mc1'],
        },
        'application/vnd.mediastation.cdkey': {
          'extensions': ['cdkey'],
        },
        'application/vnd.mfer': {
          'extensions': ['mwf'],
        },
        'application/vnd.mfmp': {
          'extensions': ['mfm'],
        },
        'application/vnd.micrografx.flo': {
          'extensions': ['flo'],
        },
        'application/vnd.micrografx.igx': {
          'extensions': ['igx'],
        },
        'application/vnd.mif': {
          'extensions': ['mif'],
        },
        'application/vnd.mobius.daf': {
          'extensions': ['daf'],
        },
        'application/vnd.mobius.dis': {
          'extensions': ['dis'],
        },
        'application/vnd.mobius.mbk': {
          'extensions': ['mbk'],
        },
        'application/vnd.mobius.mqy': {
          'extensions': ['mqy'],
        },
        'application/vnd.mobius.msl': {
          'extensions': ['msl'],
        },
        'application/vnd.mobius.plc': {
          'extensions': ['plc'],
        },
        'application/vnd.mobius.txf': {
          'extensions': ['txf'],
        },
        'application/vnd.mophun.application': {
          'extensions': ['mpn'],
        },
        'application/vnd.mophun.certificate': {
          'extensions': ['mpc'],
        },
        'application/vnd.mozilla.xul+xml': {
          'compressible': true,
          'extensions': ['xul'],
        },
        'application/vnd.ms-cab-compressed': {
          'extensions': ['cab'],
        },
        'application/vnd.ms-excel': {
          'compressible': false,
          'extensions': ['xls', 'xlm', 'xla', 'xlc', 'xlt', 'xlw'],
        },
        'application/vnd.ms-excel.addin.macroenabled.12': {
          'extensions': ['xlam'],
        },
        'application/vnd.ms-excel.sheet.binary.macroenabled.12': {
          'extensions': ['xlsb'],
        },
        'application/vnd.ms-excel.sheet.macroenabled.12': {
          'extensions': ['xlsm'],
        },
        'application/vnd.ms-excel.template.macroenabled.12': {
          'extensions': ['xltm'],
        },
        'application/vnd.ms-fontobject': {
          'compressible': true,
          'extensions': ['eot'],
        },
        'application/vnd.ms-htmlhelp': {
          'extensions': ['chm'],
        },
        'application/vnd.ms-ims': {
          'extensions': ['ims'],
        },
        'application/vnd.ms-lrm': {
          'extensions': ['lrm'],
        },
        'application/vnd.ms-officetheme': {
          'extensions': ['thmx'],
        },
        'application/vnd.ms-opentype': {
          'compressible': true,
        },
        'application/vnd.ms-pki.seccat': {
          'extensions': ['cat'],
        },
        'application/vnd.ms-pki.stl': {
          'extensions': ['stl'],
        },
        'application/vnd.ms-powerpoint': {
          'compressible': false,
          'extensions': ['ppt', 'pps', 'pot'],
        },
        'application/vnd.ms-powerpoint.addin.macroenabled.12': {
          'extensions': ['ppam'],
        },
        'application/vnd.ms-powerpoint.presentation.macroenabled.12': {
          'extensions': ['pptm'],
        },
        'application/vnd.ms-powerpoint.slide.macroenabled.12': {
          'extensions': ['sldm'],
        },
        'application/vnd.ms-powerpoint.slideshow.macroenabled.12': {
          'extensions': ['ppsm'],
        },
        'application/vnd.ms-powerpoint.template.macroenabled.12': {
          'extensions': ['potm'],
        },
        'application/vnd.ms-project': {
          'extensions': ['mpp', 'mpt'],
        },
        'application/vnd.ms-word.document.macroenabled.12': {
          'extensions': ['docm'],
        },
        'application/vnd.ms-word.template.macroenabled.12': {
          'extensions': ['dotm'],
        },
        'application/vnd.ms-works': {
          'extensions': ['wps', 'wks', 'wcm', 'wdb'],
        },
        'application/vnd.ms-wpl': {
          'extensions': ['wpl'],
        },
        'application/vnd.ms-xpsdocument': {
          'compressible': false,
          'extensions': ['xps'],
        },
        'application/vnd.mseq': {
          'extensions': ['mseq'],
        },
        'application/vnd.musician': {
          'extensions': ['mus'],
        },
        'application/vnd.muvee.style': {
          'extensions': ['msty'],
        },
        'application/vnd.mynfc': {
          'extensions': ['taglet'],
        },
        'application/vnd.neurolanguage.nlu': {
          'extensions': ['nlu'],
        },
        'application/vnd.nitf': {
          'extensions': ['ntf', 'nitf'],
        },
        'application/vnd.noblenet-directory': {
          'extensions': ['nnd'],
        },
        'application/vnd.noblenet-sealer': {
          'extensions': ['nns'],
        },
        'application/vnd.noblenet-web': {
          'extensions': ['nnw'],
        },
        'application/vnd.nokia.n-gage.data': {
          'extensions': ['ngdat'],
        },
        'application/vnd.nokia.n-gage.symbian.install': {
          'extensions': ['n-gage'],
        },
        'application/vnd.nokia.radio-preset': {
          'extensions': ['rpst'],
        },
        'application/vnd.nokia.radio-presets': {
          'extensions': ['rpss'],
        },
        'application/vnd.novadigm.edm': {
          'extensions': ['edm'],
        },
        'application/vnd.novadigm.edx': {
          'extensions': ['edx'],
        },
        'application/vnd.novadigm.ext': {
          'extensions': ['ext'],
        },
        'application/vnd.oasis.opendocument.chart': {
          'extensions': ['odc'],
        },
        'application/vnd.oasis.opendocument.chart-template': {
          'extensions': ['otc'],
        },
        'application/vnd.oasis.opendocument.database': {
          'extensions': ['odb'],
        },
        'application/vnd.oasis.opendocument.formula': {
          'extensions': ['odf'],
        },
        'application/vnd.oasis.opendocument.formula-template': {
          'extensions': ['odft'],
        },
        'application/vnd.oasis.opendocument.graphics': {
          'compressible': false,
          'extensions': ['odg'],
        },
        'application/vnd.oasis.opendocument.graphics-template': {
          'extensions': ['otg'],
        },
        'application/vnd.oasis.opendocument.image': {
          'extensions': ['odi'],
        },
        'application/vnd.oasis.opendocument.image-template': {
          'extensions': ['oti'],
        },
        'application/vnd.oasis.opendocument.presentation': {
          'compressible': false,
          'extensions': ['odp'],
        },
        'application/vnd.oasis.opendocument.presentation-template': {
          'extensions': ['otp'],
        },
        'application/vnd.oasis.opendocument.spreadsheet': {
          'compressible': false,
          'extensions': ['ods'],
        },
        'application/vnd.oasis.opendocument.spreadsheet-template': {
          'extensions': ['ots'],
        },
        'application/vnd.oasis.opendocument.text': {
          'compressible': false,
          'extensions': ['odt'],
        },
        'application/vnd.oasis.opendocument.text-master': {
          'extensions': ['odm'],
        },
        'application/vnd.oasis.opendocument.text-template': {
          'extensions': ['ott'],
        },
        'application/vnd.oasis.opendocument.text-web': {
          'extensions': ['oth'],
        },
        'application/vnd.olpc-sugar': {
          'extensions': ['xo'],
        },
        'application/vnd.oma.dd2+xml': {
          'extensions': ['dd2'],
        },
        'application/vnd.openofficeorg.extension': {
          'extensions': ['oxt'],
        },
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
          'compressible': false,
          'extensions': ['pptx'],
        },
        'application/vnd.openxmlformats-officedocument.presentationml.slide': {
          'extensions': ['sldx'],
        },
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': {
          'extensions': ['ppsx'],
        },
        'application/vnd.openxmlformats-officedocument.presentationml.template': {
          'extensions': ['potx'],
        },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          'compressible': false,
          'extensions': ['xlsx'],
        },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': {
          'extensions': ['xltx'],
        },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          'compressible': false,
          'extensions': ['docx'],
        },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': {
          'extensions': ['dotx'],
        },
        'application/vnd.osgeo.mapguide.package': {
          'extensions': ['mgp'],
        },
        'application/vnd.osgi.dp': {
          'extensions': ['dp'],
        },
        'application/vnd.osgi.subsystem': {
          'extensions': ['esa'],
        },
        'application/vnd.palm': {
          'extensions': ['pdb', 'pqa', 'oprc'],
        },
        'application/vnd.pawaafile': {
          'extensions': ['paw'],
        },
        'application/vnd.pg.format': {
          'extensions': ['str'],
        },
        'application/vnd.pg.osasli': {
          'extensions': ['ei6'],
        },
        'application/vnd.picsel': {
          'extensions': ['efif'],
        },
        'application/vnd.pmi.widget': {
          'extensions': ['wg'],
        },
        'application/vnd.pocketlearn': {
          'extensions': ['plf'],
        },
        'application/vnd.powerbuilder6': {
          'extensions': ['pbd'],
        },
        'application/vnd.previewsystems.box': {
          'extensions': ['box'],
        },
        'application/vnd.proteus.magazine': {
          'extensions': ['mgz'],
        },
        'application/vnd.publishare-delta-tree': {
          'extensions': ['qps'],
        },
        'application/vnd.pvi.ptid1': {
          'extensions': ['ptid'],
        },
        'application/vnd.quark.quarkxpress': {
          'extensions': ['qxd', 'qxt', 'qwd', 'qwt', 'qxl', 'qxb'],
        },
        'application/vnd.realvnc.bed': {
          'extensions': ['bed'],
        },
        'application/vnd.recordare.musicxml': {
          'extensions': ['mxl'],
        },
        'application/vnd.recordare.musicxml+xml': {
          'extensions': ['musicxml'],
        },
        'application/vnd.rig.cryptonote': {
          'extensions': ['cryptonote'],
        },
        'application/vnd.rim.cod': {
          'extensions': ['cod'],
        },
        'application/vnd.rn-realmedia': {
          'extensions': ['rm'],
        },
        'application/vnd.rn-realmedia-vbr': {
          'extensions': ['rmvb'],
        },
        'application/vnd.route66.link66+xml': {
          'extensions': ['link66'],
        },
        'application/vnd.sailingtracker.track': {
          'extensions': ['st'],
        },
        'application/vnd.seemail': {
          'extensions': ['see'],
        },
        'application/vnd.sema': {
          'extensions': ['sema'],
        },
        'application/vnd.semd': {
          'extensions': ['semd'],
        },
        'application/vnd.semf': {
          'extensions': ['semf'],
        },
        'application/vnd.shana.informed.formdata': {
          'extensions': ['ifm'],
        },
        'application/vnd.shana.informed.formtemplate': {
          'extensions': ['itp'],
        },
        'application/vnd.shana.informed.interchange': {
          'extensions': ['iif'],
        },
        'application/vnd.shana.informed.package': {
          'extensions': ['ipk'],
        },
        'application/vnd.simtech-mindmapper': {
          'extensions': ['twd', 'twds'],
        },
        'application/vnd.smaf': {
          'extensions': ['mmf'],
        },
        'application/vnd.smart.teacher': {
          'extensions': ['teacher'],
        },
        'application/vnd.solent.sdkm+xml': {
          'extensions': ['sdkm', 'sdkd'],
        },
        'application/vnd.spotfire.dxp': {
          'extensions': ['dxp'],
        },
        'application/vnd.spotfire.sfs': {
          'extensions': ['sfs'],
        },
        'application/vnd.stardivision.calc': {
          'extensions': ['sdc'],
        },
        'application/vnd.stardivision.draw': {
          'extensions': ['sda'],
        },
        'application/vnd.stardivision.impress': {
          'extensions': ['sdd'],
        },
        'application/vnd.stardivision.math': {
          'extensions': ['smf'],
        },
        'application/vnd.stardivision.writer': {
          'extensions': ['sdw', 'vor'],
        },
        'application/vnd.stardivision.writer-global': {
          'extensions': ['sgl'],
        },
        'application/vnd.stepmania.package': {
          'extensions': ['smzip'],
        },
        'application/vnd.stepmania.stepchart': {
          'extensions': ['sm'],
        },
        'application/vnd.sun.xml.calc': {
          'extensions': ['sxc'],
        },
        'application/vnd.sun.xml.calc.template': {
          'extensions': ['stc'],
        },
        'application/vnd.sun.xml.draw': {
          'extensions': ['sxd'],
        },
        'application/vnd.sun.xml.draw.template': {
          'extensions': ['std'],
        },
        'application/vnd.sun.xml.impress': {
          'extensions': ['sxi'],
        },
        'application/vnd.sun.xml.impress.template': {
          'extensions': ['sti'],
        },
        'application/vnd.sun.xml.math': {
          'extensions': ['sxm'],
        },
        'application/vnd.sun.xml.writer': {
          'extensions': ['sxw'],
        },
        'application/vnd.sun.xml.writer.global': {
          'extensions': ['sxg'],
        },
        'application/vnd.sun.xml.writer.template': {
          'extensions': ['stw'],
        },
        'application/vnd.sus-calendar': {
          'extensions': ['sus', 'susp'],
        },
        'application/vnd.svd': {
          'extensions': ['svd'],
        },
        'application/vnd.symbian.install': {
          'extensions': ['sis', 'sisx'],
        },
        'application/vnd.syncml+xml': {
          'extensions': ['xsm'],
        },
        'application/vnd.syncml.dm+wbxml': {
          'extensions': ['bdm'],
        },
        'application/vnd.syncml.dm+xml': {
          'extensions': ['xdm'],
        },
        'application/vnd.tao.intent-module-archive': {
          'extensions': ['tao'],
        },
        'application/vnd.tcpdump.pcap': {
          'extensions': ['pcap', 'cap', 'dmp'],
        },
        'application/vnd.tmobile-livetv': {
          'extensions': ['tmo'],
        },
        'application/vnd.trid.tpt': {
          'extensions': ['tpt'],
        },
        'application/vnd.triscape.mxs': {
          'extensions': ['mxs'],
        },
        'application/vnd.trueapp': {
          'extensions': ['tra'],
        },
        'application/vnd.ufdl': {
          'extensions': ['ufd', 'ufdl'],
        },
        'application/vnd.uiq.theme': {
          'extensions': ['utz'],
        },
        'application/vnd.umajin': {
          'extensions': ['umj'],
        },
        'application/vnd.unity': {
          'extensions': ['unityweb'],
        },
        'application/vnd.uoml+xml': {
          'extensions': ['uoml'],
        },
        'application/vnd.vcx': {
          'extensions': ['vcx'],
        },
        'application/vnd.visio': {
          'extensions': ['vsd', 'vst', 'vss', 'vsw'],
        },
        'application/vnd.visionary': {
          'extensions': ['vis'],
        },
        'application/vnd.vsf': {
          'extensions': ['vsf'],
        },
        'application/vnd.wap.wbxml': {
          'extensions': ['wbxml'],
        },
        'application/vnd.wap.wmlc': {
          'extensions': ['wmlc'],
        },
        'application/vnd.wap.wmlscriptc': {
          'extensions': ['wmlsc'],
        },
        'application/vnd.webturbo': {
          'extensions': ['wtb'],
        },
        'application/vnd.wolfram.player': {
          'extensions': ['nbp'],
        },
        'application/vnd.wordperfect': {
          'extensions': ['wpd'],
        },
        'application/vnd.wqd': {
          'extensions': ['wqd'],
        },
        'application/vnd.wt.stf': {
          'extensions': ['stf'],
        },
        'application/vnd.xara': {
          'extensions': ['xar'],
        },
        'application/vnd.xfdl': {
          'extensions': ['xfdl'],
        },
        'application/vnd.yamaha.hv-dic': {
          'extensions': ['hvd'],
        },
        'application/vnd.yamaha.hv-script': {
          'extensions': ['hvs'],
        },
        'application/vnd.yamaha.hv-voice': {
          'extensions': ['hvp'],
        },
        'application/vnd.yamaha.openscoreformat': {
          'extensions': ['osf'],
        },
        'application/vnd.yamaha.openscoreformat.osfpvg+xml': {
          'extensions': ['osfpvg'],
        },
        'application/vnd.yamaha.smaf-audio': {
          'extensions': ['saf'],
        },
        'application/vnd.yamaha.smaf-phrase': {
          'extensions': ['spf'],
        },
        'application/vnd.yellowriver-custom-menu': {
          'extensions': ['cmp'],
        },
        'application/vnd.zul': {
          'extensions': ['zir', 'zirz'],
        },
        'application/vnd.zzazz.deck+xml': {
          'extensions': ['zaz'],
        },
        'application/voicexml+xml': {
          'extensions': ['vxml'],
        },
        'application/widget': {
          'extensions': ['wgt'],
        },
        'application/winhlp': {
          'extensions': ['hlp'],
        },
        'application/wsdl+xml': {
          'extensions': ['wsdl'],
        },
        'application/wspolicy+xml': {
          'extensions': ['wspolicy'],
        },
        'application/x-7z-compressed': {
          'compressible': false,
          'extensions': ['7z'],
        },
        'application/x-abiword': {
          'extensions': ['abw'],
        },
        'application/x-ace-compressed': {
          'extensions': ['ace'],
        },
        'application/x-apple-diskimage': {
          'extensions': ['dmg'],
        },
        'application/x-authorware-bin': {
          'extensions': ['aab', 'x32', 'u32', 'vox'],
        },
        'application/x-authorware-map': {
          'extensions': ['aam'],
        },
        'application/x-authorware-seg': {
          'extensions': ['aas'],
        },
        'application/x-bcpio': {
          'extensions': ['bcpio'],
        },
        'application/x-bdoc': {
          'compressible': false,
          'extensions': ['bdoc'],
        },
        'application/x-bittorrent': {
          'extensions': ['torrent'],
        },
        'application/x-blorb': {
          'extensions': ['blb', 'blorb'],
        },
        'application/x-bzip': {
          'compressible': false,
          'extensions': ['bz'],
        },
        'application/x-bzip2': {
          'compressible': false,
          'extensions': ['bz2', 'boz'],
        },
        'application/x-cbr': {
          'extensions': ['cbr', 'cba', 'cbt', 'cbz', 'cb7'],
        },
        'application/x-cdlink': {
          'extensions': ['vcd'],
        },
        'application/x-cfs-compressed': {
          'extensions': ['cfs'],
        },
        'application/x-chat': {
          'extensions': ['chat'],
        },
        'application/x-chess-pgn': {
          'extensions': ['pgn'],
        },
        'application/x-chrome-extension': {
          'extensions': ['crx'],
        },
        'application/x-cocoa': {
          'source': 'nginx',
          'extensions': ['cco'],
        },
        'application/x-conference': {
          'extensions': ['nsc'],
        },
        'application/x-cpio': {
          'extensions': ['cpio'],
        },
        'application/x-csh': {
          'extensions': ['csh'],
        },
        'application/x-debian-package': {
          'extensions': ['deb', 'udeb'],
        },
        'application/x-dgc-compressed': {
          'extensions': ['dgc'],
        },
        'application/x-director': {
          'extensions': ['dir', 'dcr', 'dxr', 'cst', 'cct', 'cxt', 'w3d', 'fgd', 'swa'],
        },
        'application/x-doom': {
          'extensions': ['wad'],
        },
        'application/x-dtbncx+xml': {
          'extensions': ['ncx'],
        },
        'application/x-dtbook+xml': {
          'extensions': ['dtb'],
        },
        'application/x-dtbresource+xml': {
          'extensions': ['res'],
        },
        'application/x-dvi': {
          'compressible': false,
          'extensions': ['dvi'],
        },
        'application/x-envoy': {
          'extensions': ['evy'],
        },
        'application/x-eva': {
          'extensions': ['eva'],
        },
        'application/x-font-bdf': {
          'extensions': ['bdf'],
        },
        'application/x-font-ghostscript': {
          'extensions': ['gsf'],
        },
        'application/x-font-linux-psf': {
          'extensions': ['psf'],
        },
        'application/x-font-otf': {
          'compressible': true,
          'extensions': ['otf'],
        },
        'application/x-font-pcf': {
          'extensions': ['pcf'],
        },
        'application/x-font-snf': {
          'extensions': ['snf'],
        },
        'application/x-font-ttf': {
          'compressible': true,
          'extensions': ['ttf', 'ttc'],
        },
        'application/x-font-type1': {
          'extensions': ['pfa', 'pfb', 'pfm', 'afm'],
        },
        'application/x-freearc': {
          'extensions': ['arc'],
        },
        'application/x-futuresplash': {
          'extensions': ['spl'],
        },
        'application/x-gca-compressed': {
          'extensions': ['gca'],
        },
        'application/x-glulx': {
          'extensions': ['ulx'],
        },
        'application/x-gnumeric': {
          'extensions': ['gnumeric'],
        },
        'application/x-gramps-xml': {
          'extensions': ['gramps'],
        },
        'application/x-gtar': {
          'extensions': ['gtar'],
        },
        'application/x-hdf': {
          'extensions': ['hdf'],
        },
        'application/x-httpd-php': {
          'compressible': true,
          'extensions': ['php'],
        },
        'application/x-install-instructions': {
          'extensions': ['install'],
        },
        'application/x-iso9660-image': {
          'extensions': ['iso'],
        },
        'application/x-java-archive-diff': {
          'source': 'nginx',
          'extensions': ['jardiff'],
        },
        'application/x-java-jnlp-file': {
          'compressible': false,
          'extensions': ['jnlp'],
        },
        'application/x-latex': {
          'compressible': false,
          'extensions': ['latex'],
        },
        'application/x-lua-bytecode': {
          'extensions': ['luac'],
        },
        'application/x-lzh-compressed': {
          'extensions': ['lzh', 'lha'],
        },
        'application/x-makeself': {
          'source': 'nginx',
          'extensions': ['run'],
        },
        'application/x-mie': {
          'extensions': ['mie'],
        },
        'application/x-mobipocket-ebook': {
          'extensions': ['prc', 'mobi'],
        },
        'application/x-ms-application': {
          'extensions': ['application'],
        },
        'application/x-ms-shortcut': {
          'extensions': ['lnk'],
        },
        'application/x-ms-wmd': {
          'extensions': ['wmd'],
        },
        'application/x-ms-wmz': {
          'extensions': ['wmz'],
        },
        'application/x-ms-xbap': {
          'extensions': ['xbap'],
        },
        'application/x-msaccess': {
          'extensions': ['mdb'],
        },
        'application/x-msbinder': {
          'extensions': ['obd'],
        },
        'application/x-mscardfile': {
          'extensions': ['crd'],
        },
        'application/x-msclip': {
          'extensions': ['clp'],
        },
        'application/x-msdos-program': {
          'extensions': ['exe'],
        },
        'application/x-msdownload': {
          'extensions': ['exe', 'dll', 'com', 'bat', 'msi'],
        },
        'application/x-msmediaview': {
          'extensions': ['mvb', 'm13', 'm14'],
        },
        'application/x-msmetafile': {
          'extensions': ['wmf', 'wmz', 'emf', 'emz'],
        },
        'application/x-msmoney': {
          'extensions': ['mny'],
        },
        'application/x-mspublisher': {
          'extensions': ['pub'],
        },
        'application/x-msschedule': {
          'extensions': ['scd'],
        },
        'application/x-msterminal': {
          'extensions': ['trm'],
        },
        'application/x-mswrite': {
          'extensions': ['wri'],
        },
        'application/x-netcdf': {
          'extensions': ['nc', 'cdf'],
        },
        'application/x-ns-proxy-autoconfig': {
          'compressible': true,
          'extensions': ['pac'],
        },
        'application/x-nzb': {
          'extensions': ['nzb'],
        },
        'application/x-perl': {
          'source': 'nginx',
          'extensions': ['pl', 'pm'],
        },
        'application/x-pilot': {
          'source': 'nginx',
          'extensions': ['prc', 'pdb'],
        },
        'application/x-pkcs12': {
          'compressible': false,
          'extensions': ['p12', 'pfx'],
        },
        'application/x-pkcs7-certificates': {
          'extensions': ['p7b', 'spc'],
        },
        'application/x-pkcs7-certreqresp': {
          'extensions': ['p7r'],
        },
        'application/x-rar-compressed': {
          'compressible': false,
          'extensions': ['rar'],
        },
        'application/x-redhat-package-manager': {
          'source': 'nginx',
          'extensions': ['rpm'],
        },
        'application/x-research-info-systems': {
          'extensions': ['ris'],
        },
        'application/x-sea': {
          'source': 'nginx',
          'extensions': ['sea'],
        },
        'application/x-sh': {
          'compressible': true,
          'extensions': ['sh'],
        },
        'application/x-shar': {
          'extensions': ['shar'],
        },
        'application/x-shockwave-flash': {
          'compressible': false,
          'extensions': ['swf'],
        },
        'application/x-silverlight-app': {
          'extensions': ['xap'],
        },
        'application/x-sql': {
          'extensions': ['sql'],
        },
        'application/x-stuffit': {
          'compressible': false,
          'extensions': ['sit'],
        },
        'application/x-stuffitx': {
          'extensions': ['sitx'],
        },
        'application/x-subrip': {
          'extensions': ['srt'],
        },
        'application/x-sv4cpio': {
          'extensions': ['sv4cpio'],
        },
        'application/x-sv4crc': {
          'extensions': ['sv4crc'],
        },
        'application/x-t3vm-image': {
          'extensions': ['t3'],
        },
        'application/x-tads': {
          'extensions': ['gam'],
        },
        'application/x-tar': {
          'compressible': true,
          'extensions': ['tar'],
        },
        'application/x-tcl': {
          'extensions': ['tcl', 'tk'],
        },
        'application/x-tex': {
          'extensions': ['tex'],
        },
        'application/x-tex-tfm': {
          'extensions': ['tfm'],
        },
        'application/x-texinfo': {
          'extensions': ['texinfo', 'texi'],
        },
        'application/x-tgif': {
          'extensions': ['obj'],
        },
        'application/x-ustar': {
          'extensions': ['ustar'],
        },
        'application/x-wais-source': {
          'extensions': ['src'],
        },
        'application/x-web-app-manifest+json': {
          'compressible': true,
          'extensions': ['webapp'],
        },
        'application/x-x509-ca-cert': {
          'extensions': ['der', 'crt', 'pem'],
        },
        'application/x-xfig': {
          'extensions': ['fig'],
        },
        'application/x-xliff+xml': {
          'extensions': ['xlf'],
        },
        'application/x-xpinstall': {
          'compressible': false,
          'extensions': ['xpi'],
        },
        'application/x-xz': {
          'extensions': ['xz'],
        },
        'application/x-zmachine': {
          'extensions': ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8'],
        },
        'application/xaml+xml': {
          'extensions': ['xaml'],
        },
        'application/xcap-diff+xml': {
          'extensions': ['xdf'],
        },
        'application/xenc+xml': {
          'extensions': ['xenc'],
        },
        'application/xhtml+xml': {
          'compressible': true,
          'extensions': ['xhtml', 'xht'],
        },
        'application/xml': {
          'compressible': true,
          'extensions': ['xml', 'xsl', 'xsd', 'rng'],
        },
        'application/xml-dtd': {
          'compressible': true,
          'extensions': ['dtd'],
        },
        'application/xop+xml': {
          'compressible': true,
          'extensions': ['xop'],
        },
        'application/xproc+xml': {
          'extensions': ['xpl'],
        },
        'application/xslt+xml': {
          'extensions': ['xslt'],
        },
        'application/xspf+xml': {
          'extensions': ['xspf'],
        },
        'application/xv+xml': {
          'extensions': ['mxml', 'xhvml', 'xvml', 'xvm'],
        },
        'application/yang': {
          'extensions': ['yang'],
        },
        'application/yin+xml': {
          'extensions': ['yin'],
        },
        'application/zip': {
          'compressible': false,
          'extensions': ['zip'],
        },
        'audio/3gpp': {
          'compressible': false,
          'extensions': ['3gpp'],
        },
        'audio/adpcm': {
          'extensions': ['adp'],
        },
        'audio/basic': {
          'compressible': false,
          'extensions': ['au', 'snd'],
        },
        'audio/midi': {
          'extensions': ['mid', 'midi', 'kar', 'rmi'],
        },
        'audio/mp4': {
          'compressible': false,
          'extensions': ['m4a', 'mp4a'],
        },
        'audio/mpeg': {
          'compressible': false,
          'extensions': ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a'],
        },
        'audio/ogg': {
          'compressible': false,
          'extensions': ['oga', 'ogg', 'spx'],
        },
        'audio/s3m': {
          'extensions': ['s3m'],
        },
        'audio/silk': {
          'extensions': ['sil'],
        },
        'audio/vnd.dece.audio': {
          'extensions': ['uva', 'uvva'],
        },
        'audio/vnd.digital-winds': {
          'extensions': ['eol'],
        },
        'audio/vnd.dra': {
          'extensions': ['dra'],
        },
        'audio/vnd.dts': {
          'extensions': ['dts'],
        },
        'audio/vnd.dts.hd': {
          'extensions': ['dtshd'],
        },
        'audio/vnd.lucent.voice': {
          'extensions': ['lvp'],
        },
        'audio/vnd.ms-playready.media.pya': {
          'extensions': ['pya'],
        },
        'audio/vnd.nuera.ecelp4800': {
          'extensions': ['ecelp4800'],
        },
        'audio/vnd.nuera.ecelp7470': {
          'extensions': ['ecelp7470'],
        },
        'audio/vnd.nuera.ecelp9600': {
          'extensions': ['ecelp9600'],
        },
        'audio/vnd.rip': {
          'extensions': ['rip'],
        },
        'audio/wav': {
          'compressible': false,
          'extensions': ['wav'],
        },
        'audio/wave': {
          'compressible': false,
          'extensions': ['wav'],
        },
        'audio/webm': {
          'compressible': false,
          'extensions': ['weba'],
        },
        'audio/x-aac': {
          'compressible': false,
          'extensions': ['aac'],
        },
        'audio/x-aiff': {
          'extensions': ['aif', 'aiff', 'aifc'],
        },
        'audio/x-caf': {
          'compressible': false,
          'extensions': ['caf'],
        },
        'audio/x-flac': {
          'extensions': ['flac'],
        },
        'audio/x-m4a': {
          'source': 'nginx',
          'extensions': ['m4a'],
        },
        'audio/x-matroska': {
          'extensions': ['mka'],
        },
        'audio/x-mpegurl': {
          'extensions': ['m3u'],
        },
        'audio/x-ms-wax': {
          'extensions': ['wax'],
        },
        'audio/x-ms-wma': {
          'extensions': ['wma'],
        },
        'audio/x-pn-realaudio': {
          'extensions': ['ram', 'ra'],
        },
        'audio/x-pn-realaudio-plugin': {
          'extensions': ['rmp'],
        },
        'audio/x-realaudio': {
          'source': 'nginx',
          'extensions': ['ra'],
        },
        'audio/x-wav': {
          'extensions': ['wav'],
        },
        'audio/xm': {
          'extensions': ['xm'],
        },
        'chemical/x-cdx': {
          'extensions': ['cdx'],
        },
        'chemical/x-cif': {
          'extensions': ['cif'],
        },
        'chemical/x-cmdf': {
          'extensions': ['cmdf'],
        },
        'chemical/x-cml': {
          'extensions': ['cml'],
        },
        'chemical/x-csml': {
          'extensions': ['csml'],
        },
        'chemical/x-xyz': {
          'extensions': ['xyz'],
        },
        'font/opentype': {
          'compressible': true,
          'extensions': ['otf'],
        },
        'image/bmp': {
          'compressible': true,
          'extensions': ['bmp'],
        },
        'image/cgm': {
          'extensions': ['cgm'],
        },
        'image/g3fax': {
          'extensions': ['g3'],
        },
        'image/gif': {
          'compressible': false,
          'extensions': ['gif'],
        },
        'image/ief': {
          'extensions': ['ief'],
        },
        'image/jpeg': {
          'compressible': false,
          'extensions': ['jpeg', 'jpg', 'jpe'],
        },
        'image/ktx': {
          'extensions': ['ktx'],
        },
        'image/png': {
          'compressible': false,
          'extensions': ['png'],
        },
        'image/prs.btif': {
          'extensions': ['btif'],
        },
        'image/sgi': {
          'extensions': ['sgi'],
        },
        'image/svg+xml': {
          'compressible': true,
          'extensions': ['svg', 'svgz'],
        },
        'image/tiff': {
          'compressible': false,
          'extensions': ['tiff', 'tif'],
        },
        'image/vnd.adobe.photoshop': {
          'compressible': true,
          'extensions': ['psd'],
        },
        'image/vnd.dece.graphic': {
          'extensions': ['uvi', 'uvvi', 'uvg', 'uvvg'],
        },
        'image/vnd.djvu': {
          'extensions': ['djvu', 'djv'],
        },
        'image/vnd.dvb.subtitle': {
          'extensions': ['sub'],
        },
        'image/vnd.dwg': {
          'extensions': ['dwg'],
        },
        'image/vnd.dxf': {
          'extensions': ['dxf'],
        },
        'image/vnd.fastbidsheet': {
          'extensions': ['fbs'],
        },
        'image/vnd.fpx': {
          'extensions': ['fpx'],
        },
        'image/vnd.fst': {
          'extensions': ['fst'],
        },
        'image/vnd.fujixerox.edmics-mmr': {
          'extensions': ['mmr'],
        },
        'image/vnd.fujixerox.edmics-rlc': {
          'extensions': ['rlc'],
        },
        'image/vnd.ms-modi': {
          'extensions': ['mdi'],
        },
        'image/vnd.ms-photo': {
          'extensions': ['wdp'],
        },
        'image/vnd.net-fpx': {
          'extensions': ['npx'],
        },
        'image/vnd.wap.wbmp': {
          'extensions': ['wbmp'],
        },
        'image/vnd.xiff': {
          'extensions': ['xif'],
        },
        'image/webp': {
          'extensions': ['webp'],
        },
        'image/x-3ds': {
          'extensions': ['3ds'],
        },
        'image/x-cmu-raster': {
          'extensions': ['ras'],
        },
        'image/x-cmx': {
          'extensions': ['cmx'],
        },
        'image/x-freehand': {
          'extensions': ['fh', 'fhc', 'fh4', 'fh5', 'fh7'],
        },
        'image/x-icon': {
          'compressible': true,
          'extensions': ['ico'],
        },
        'image/x-jng': {
          'source': 'nginx',
          'extensions': ['jng'],
        },
        'image/x-mrsid-image': {
          'extensions': ['sid'],
        },
        'image/x-ms-bmp': {
          'source': 'nginx',
          'compressible': true,
          'extensions': ['bmp'],
        },
        'image/x-pcx': {
          'extensions': ['pcx'],
        },
        'image/x-pict': {
          'extensions': ['pic', 'pct'],
        },
        'image/x-portable-anymap': {
          'extensions': ['pnm'],
        },
        'image/x-portable-bitmap': {
          'extensions': ['pbm'],
        },
        'image/x-portable-graymap': {
          'extensions': ['pgm'],
        },
        'image/x-portable-pixmap': {
          'extensions': ['ppm'],
        },
        'image/x-rgb': {
          'extensions': ['rgb'],
        },
        'image/x-tga': {
          'extensions': ['tga'],
        },
        'image/x-xbitmap': {
          'extensions': ['xbm'],
        },
        'image/x-xpixmap': {
          'extensions': ['xpm'],
        },
        'image/x-xwindowdump': {
          'extensions': ['xwd'],
        },
        'message/rfc822': {
          'compressible': true,
          'extensions': ['eml', 'mime'],
        },
        'model/iges': {
          'compressible': false,
          'extensions': ['igs', 'iges'],
        },
        'model/mesh': {
          'compressible': false,
          'extensions': ['msh', 'mesh', 'silo'],
        },
        'model/vnd.collada+xml': {
          'extensions': ['dae'],
        },
        'model/vnd.dwf': {
          'extensions': ['dwf'],
        },
        'model/vnd.gdl': {
          'extensions': ['gdl'],
        },
        'model/vnd.gtw': {
          'extensions': ['gtw'],
        },
        'model/vnd.mts': {
          'extensions': ['mts'],
        },
        'model/vnd.vtu': {
          'extensions': ['vtu'],
        },
        'model/vrml': {
          'compressible': false,
          'extensions': ['wrl', 'vrml'],
        },
        'model/x3d+binary': {
          'compressible': false,
          'extensions': ['x3db', 'x3dbz'],
        },
        'model/x3d+vrml': {
          'compressible': false,
          'extensions': ['x3dv', 'x3dvz'],
        },
        'model/x3d+xml': {
          'compressible': true,
          'extensions': ['x3d', 'x3dz'],
        },
        'text/cache-manifest': {
          'compressible': true,
          'extensions': ['appcache', 'manifest'],
        },
        'text/calendar': {
          'extensions': ['ics', 'ifb'],
        },
        'text/coffeescript': {
          'extensions': ['coffee', 'litcoffee'],
        },
        'text/css': {
          'compressible': true,
          'extensions': ['css'],
        },
        'text/csv': {
          'compressible': true,
          'extensions': ['csv'],
        },
        'text/hjson': {
          'extensions': ['hjson'],
        },
        'text/html': {
          'compressible': true,
          'extensions': ['html', 'htm', 'shtml'],
        },
        'text/jade': {
          'extensions': ['jade'],
        },
        'text/jsx': {
          'compressible': true,
          'extensions': ['jsx'],
        },
        'text/less': {
          'extensions': ['less'],
        },
        'text/mathml': {
          'source': 'nginx',
          'extensions': ['mml'],
        },
        'text/n3': {
          'compressible': true,
          'extensions': ['n3'],
        },
        'text/plain': {
          'compressible': true,
          'extensions': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
        },
        'text/prs.lines.tag': {
          'extensions': ['dsc'],
        },
        'text/richtext': {
          'compressible': true,
          'extensions': ['rtx'],
        },
        'text/rtf': {
          'compressible': true,
          'extensions': ['rtf'],
        },
        'text/sgml': {
          'extensions': ['sgml', 'sgm'],
        },
        'text/slim': {
          'extensions': ['slim', 'slm'],
        },
        'text/stylus': {
          'extensions': ['stylus', 'styl'],
        },
        'text/tab-separated-values': {
          'compressible': true,
          'extensions': ['tsv'],
        },
        'text/troff': {
          'extensions': ['t', 'tr', 'roff', 'man', 'me', 'ms'],
        },
        'text/turtle': {
          'extensions': ['ttl'],
        },
        'text/uri-list': {
          'compressible': true,
          'extensions': ['uri', 'uris', 'urls'],
        },
        'text/vcard': {
          'compressible': true,
          'extensions': ['vcard'],
        },
        'text/vnd.curl': {
          'extensions': ['curl'],
        },
        'text/vnd.curl.dcurl': {
          'extensions': ['dcurl'],
        },
        'text/vnd.curl.mcurl': {
          'extensions': ['mcurl'],
        },
        'text/vnd.curl.scurl': {
          'extensions': ['scurl'],
        },
        'text/vnd.dvb.subtitle': {
          'extensions': ['sub'],
        },
        'text/vnd.fly': {
          'extensions': ['fly'],
        },
        'text/vnd.fmi.flexstor': {
          'extensions': ['flx'],
        },
        'text/vnd.graphviz': {
          'extensions': ['gv'],
        },
        'text/vnd.in3d.3dml': {
          'extensions': ['3dml'],
        },
        'text/vnd.in3d.spot': {
          'extensions': ['spot'],
        },
        'text/vnd.sun.j2me.app-descriptor': {
          'extensions': ['jad'],
        },
        'text/vnd.wap.wml': {
          'extensions': ['wml'],
        },
        'text/vnd.wap.wmlscript': {
          'extensions': ['wmls'],
        },
        'text/vtt': {
          'charset': 'UTF-8',
          'compressible': true,
          'extensions': ['vtt'],
        },
        'text/x-asm': {
          'extensions': ['s', 'asm'],
        },
        'text/x-c': {
          'extensions': ['c', 'cc', 'cxx', 'cpp', 'h', 'hh', 'dic'],
        },
        'text/x-component': {
          'source': 'nginx',
          'extensions': ['htc'],
        },
        'text/x-fortran': {
          'extensions': ['f', 'for', 'f77', 'f90'],
        },
        'text/x-handlebars-template': {
          'extensions': ['hbs'],
        },
        'text/x-java-source': {
          'extensions': ['java'],
        },
        'text/x-lua': {
          'extensions': ['lua'],
        },
        'text/x-markdown': {
          'compressible': true,
          'extensions': ['markdown', 'md', 'mkd'],
        },
        'text/x-nfo': {
          'extensions': ['nfo'],
        },
        'text/x-opml': {
          'extensions': ['opml'],
        },
        'text/x-pascal': {
          'extensions': ['p', 'pas'],
        },
        'text/x-processing': {
          'compressible': true,
          'extensions': ['pde'],
        },
        'text/x-sass': {
          'extensions': ['sass'],
        },
        'text/x-scss': {
          'extensions': ['scss'],
        },
        'text/x-setext': {
          'extensions': ['etx'],
        },
        'text/x-sfv': {
          'extensions': ['sfv'],
        },
        'text/x-suse-ymp': {
          'compressible': true,
          'extensions': ['ymp'],
        },
        'text/x-uuencode': {
          'extensions': ['uu'],
        },
        'text/x-vcalendar': {
          'extensions': ['vcs'],
        },
        'text/x-vcard': {
          'extensions': ['vcf'],
        },
        'text/xml': {
          'source': 'iana',
          'compressible': true,
          'extensions': ['xml'],
        },
        'text/yaml': {
          'extensions': ['yaml', 'yml'],
        },
        'video/3gpp': {
          'extensions': ['3gp', '3gpp'],
        },
        'video/3gpp2': {
          'extensions': ['3g2'],
        },
        'video/h261': {
          'extensions': ['h261'],
        },
        'video/h263': {
          'extensions': ['h263'],
        },
        'video/h264': {
          'extensions': ['h264'],
        },
        'video/jpeg': {
          'extensions': ['jpgv'],
        },
        'video/jpm': {
          'extensions': ['jpm', 'jpgm'],
        },
        'video/mj2': {
          'extensions': ['mj2', 'mjp2'],
        },
        'video/mp2t': {
          'extensions': ['ts'],
        },
        'video/mp4': {
          'compressible': false,
          'extensions': ['mp4', 'mp4v', 'mpg4'],
        },
        'video/mpeg': {
          'compressible': false,
          'extensions': ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v'],
        },
        'video/ogg': {
          'compressible': false,
          'extensions': ['ogv'],
        },
        'video/quicktime': {
          'compressible': false,
          'extensions': ['qt', 'mov'],
        },
        'video/vnd.dece.hd': {
          'extensions': ['uvh', 'uvvh'],
        },
        'video/vnd.dece.mobile': {
          'extensions': ['uvm', 'uvvm'],
        },
        'video/vnd.dece.pd': {
          'extensions': ['uvp', 'uvvp'],
        },
        'video/vnd.dece.sd': {
          'extensions': ['uvs', 'uvvs'],
        },
        'video/vnd.dece.video': {
          'extensions': ['uvv', 'uvvv'],
        },
        'video/vnd.dvb.file': {
          'extensions': ['dvb'],
        },
        'video/vnd.fvt': {
          'extensions': ['fvt'],
        },
        'video/vnd.mpegurl': {
          'extensions': ['mxu', 'm4u'],
        },
        'video/vnd.ms-playready.media.pyv': {
          'extensions': ['pyv'],
        },
        'video/vnd.uvvu.mp4': {
          'extensions': ['uvu', 'uvvu'],
        },
        'video/vnd.vivo': {
          'extensions': ['viv'],
        },
        'video/webm': {
          'compressible': false,
          'extensions': ['webm'],
        },
        'video/x-f4v': {
          'extensions': ['f4v'],
        },
        'video/x-fli': {
          'extensions': ['fli'],
        },
        'video/x-flv': {
          'compressible': false,
          'extensions': ['flv'],
        },
        'video/x-m4v': {
          'extensions': ['m4v'],
        },
        'video/x-matroska': {
          'compressible': false,
          'extensions': ['mkv', 'mk3d', 'mks'],
        },
        'video/x-mng': {
          'extensions': ['mng'],
        },
        'video/x-ms-asf': {
          'extensions': ['asf', 'asx'],
        },
        'video/x-ms-vob': {
          'extensions': ['vob'],
        },
        'video/x-ms-wm': {
          'extensions': ['wm'],
        },
        'video/x-ms-wmv': {
          'compressible': false,
          'extensions': ['wmv'],
        },
        'video/x-ms-wmx': {
          'extensions': ['wmx'],
        },
        'video/x-ms-wvx': {
          'extensions': ['wvx'],
        },
        'video/x-msvideo': {
          'extensions': ['avi'],
        },
        'video/x-sgi-movie': {
          'extensions': ['movie'],
        },
        'video/x-smv': {
          'extensions': ['smv'],
        },
        'x-conference/x-cooltalk': {
          'extensions': ['ice'],
        },
      },
    },
    mime_lookup: {
      value: function (ext) {
        if (!ext)
          return 'application/octet-stream';
        ext = ext.toLowerCase();
        for (var mtype in this.mime_db) {
          if (this.mime_db[mtype].extensions && this.mime_db[mtype].extensions.indexOf(ext) != -1)
            return mtype;
        }
        return 'application/octet-stream';
      },
    },
  });
  return target;
};

const moment$1 = require('moment');
require('moment/locale/ru');
moment$1.locale('ru');
moment$1._masks = {
	date: 'DD.MM.YY',
	date_time: 'DD.MM.YYYY HH:mm',
	ldt: 'DD MMMM YYYY, HH:mm',
	iso: 'YYYY-MM-DDTHH:mm:ss',
};
if(typeof global != 'undefined'){
  global.moment = moment$1;
}
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
const utils = mime({
	moment: moment$1,
  load_script(src, type, callback) {
    return new Promise((resolve, reject) => {
      const s = document.createElement(type);
      if (type == 'script') {
        s.type = 'text/javascript';
        s.src = src;
        s.async = true;
        const listener = () => {
          s.removeEventListener('load', listener);
          callback && callback();
          resolve();
        };
        s.addEventListener('load', listener, false);
      }
      else {
        s.type = 'text/css';
        s.rel = 'stylesheet';
        s.href = src;
      }
      document.head.appendChild(s);
      (type != 'script') && resolve();
    });
  },
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
		else if (ref instanceof DataObj) {
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
      if(mtype.types && mtype.types.some((type) => type.indexOf('enm') == 0 || type.indexOf('string') == 0)){
        return str;
      }
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
		return v instanceof DataObj;
	},
	is_data_mgr(v) {
		return v instanceof DataManager;
	},
  is_enm_mgr(v) {
    return v instanceof EnumManager;
  },
  is_tabular(v) {
    return v instanceof TabularSectionRow || v instanceof TabularSection;
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      switch (type) {
        case "array" :
          reader.readAsArrayBuffer(blob);
          break;
        case "data_url":
          reader.readAsDataURL(blob);
          break;
        default:
          reader.readAsText(blob);
      }
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
					if ('function' === typeof v || v instanceof DataObj || v instanceof DataManager || v instanceof Date)
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
		let top, skip, count = 0, skipped = 0;
		if (selection) {
			if (selection.hasOwnProperty('_top')) {
				top = selection._top;
				delete selection._top;
			} else {
				top = 300;
			}
      if (selection.hasOwnProperty('_skip')) {
        skip = selection._skip;
        delete selection._skip;
      } else {
        skip = 0;
      }
		}
		for (let i in src) {
			const o = src[i];
			if (utils._selection.call(this, o, selection)) {
			  if(skip){
          skipped++;
          if (skipped <= skip) {
            continue;
          }
        }
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
});
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

const alasql = (typeof window != 'undefined' && window.alasql) || require('alasql/dist/alasql.min');
const fake_ls = {
	setItem(name, value) {},
	getItem(name) {}
};
class WSQL {
	constructor($p) {
		this.$p = $p;
		this._params = {};
		this.aladb = new alasql.Database('md');
		this.alasql = alasql;
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
		alasql.utils.isBrowserify = false;
		const {job_prm, adapters} = this.$p;
		job_prm.init(settings);
		if (!job_prm.local_storage_prefix && !job_prm.create_tables)
			return;
		var nesessery_params = [
			{p: "user_name", v: "", t: "string"},
			{p: "user_pwd", v: "", t: "string"},
			{p: "browser_uid", v: utils.generate_guid(), t: "string"},
			{p: "zone", v: job_prm.hasOwnProperty("zone") ? job_prm.zone : 1, t: job_prm.zone_is_string ? "string" : "number"},
			{p: "rest_path", v: "", t: "string"},
			{p: "couch_path", v: "", t: "string"},
      {p: "couch_suffix", v: "", t: "string"},
      {p: "couch_direct", v: true, t: "boolean"},
      {p: "enable_save_pwd", v: true, t: "boolean"},
		], zone;
		if (job_prm.additional_params){
      nesessery_params = nesessery_params.concat(job_prm.additional_params);
    }
		if (!this._ls.getItem(job_prm.local_storage_prefix + "zone")){
      zone = job_prm.hasOwnProperty("zone") ? job_prm.zone : 1;
    }
		if (zone !== undefined){
      this.set_user_param("zone", zone);
    }
		nesessery_params.forEach((prm) => {
		  if(job_prm.url_prm && job_prm.url_prm.hasOwnProperty(prm.p)) {
        this.set_user_param(prm.p, this.fetch_type(job_prm.url_prm[prm.p], prm.t));
      }
			else if (!this.prm_is_set(prm.p)){
        this.set_user_param(prm.p, this.fetch_type(job_prm.hasOwnProperty(prm.p) ? job_prm[prm.p] : prm.v, prm.t));
      }
		});
		for(let i in adapters){
			adapters[i].init(this, job_prm);
		}
		meta && meta(this.$p);
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
		Object.defineProperties(this, {
      _m: {value: {}},
      $p: {value: $p},
    });
		Meta._sys.forEach((patch) => utils._patch(this._m, patch));
		Meta._sys.length = 0;
	}
  init(patch) {
    return utils._patch(this._m, patch);
  }
  get(class_name, field_name) {
    const np = class_name.split('.');
    if (!this._m[np[0]]) {
      return;
    }
    const _meta = this._m[np[0]][np[1]];
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
  }
  classes() {
    const res = {};
    for (const i in this._m) {
      res[i] = [];
      for (const j in this._m[i])
        res[i].push(j);
    }
    return res;
  }
  bases() {
    const res = {};
    const {_m} = this;
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
  }
  syns_js(v) {
    const synJS = {
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
    return synJS[v] || this._m.syns_js[this._m.syns_1с.indexOf(v)] || v;
  }
  syns_1с(v) {
    const syn1c = {
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
    return syn1c[v] || this._m.syns_1с[this._m.syns_js.indexOf(v)] || v;
  }
  printing_plates(pp) {
    if (pp){
      for (const i in pp.doc){
        this._m.doc[i].printing_plates = pp.doc[i];
      }
    }
  }
  mgr_by_class_name(class_name) {
    if (class_name) {
      const {$p} = this;
      let np = class_name.split('.');
      if (np[1] && $p[np[0]]){
        return $p[np[0]][np[1]];
      }
      const pos = class_name.indexOf('_');
      if (pos) {
        np = [class_name.substr(0, pos), class_name.substr(pos + 1)];
        if (np[1] && $p[np[0]])
          return $p[np[0]][np[1]];
      }
    }
  }
  create_tables(callback, attr) {
    const {$p} = this;
    const data_names = [];
    const managers = this.classes();
    let cstep = 0, create = (attr && attr.postgres) ? '' : 'USE md; ';
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
		return msg.meta_classes[this.name];
	}
	create(name, constructor) {
		this[name] = new (constructor || this._constructor)(this, this.name + '.' + name);
	}
}
class Enumerations extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'enm';
		this._constructor = EnumManager;
	}
}
class Catalogs extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'cat';
		this._constructor = CatManager;
	}
}
class Documents extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'doc';
		this._constructor = DocManager;
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
		this._constructor = DataProcessorsManager;
	}
}
class Reports extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'rep';
		this._constructor = DataProcessorsManager;
	}
}
class ChartsOfAccounts extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'cacc';
		this._constructor = ChartOfAccountManager;
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
		this._constructor = TaskManager;
	}
}
class BusinessProcesses extends ManagersCollection {
	constructor($p) {
		super($p);
		this.name = 'bp';
		this._constructor = BusinessProcessManager;
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

class MetaEngine$1 {
  constructor() {
    this.classes = classes;
    this.adapters = {};
    this.aes = new Aes('metadata.js');
    this.job_prm = new JobPrm(this);
    this.wsql = new WSQL(this);
    this.md = new Meta(this);
    mngrs(this);
    this.record_log = this.record_log.bind(this);
    MetaEngine$1._plugins.forEach((plugin) => plugin.call(this));
    MetaEngine$1._plugins.length = 0;
  }
  on(type, listener) {
    this.md.on(type, listener);
  }
  off(type, listener) {
    this.md.off(type, listener);
  }
  get version() {
    return '2.0.2-beta.28';
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
    if (CatUsers && !CatUsers.prototype.hasOwnProperty('role_available')) {
      CatUsers.prototype.role_available = function (name) {
        return this.acl_objs ? this.acl_objs._obj.some((row) => row.type == name) : true;
      };
      CatUsers.prototype.get_acl = function(class_name) {
        const {_acl} = this._obj;
        let res = 'rvuidepo';
        if(Array.isArray(_acl)){
          _acl.some((acl) => {
            if(acl.hasOwnProperty(class_name)) {
              res = acl[class_name];
              return true;
            }
          });
          return res;
        }
        else{
          const acn = class_name.split('.');
          return _acl && _acl[acn[0]] && _acl[acn[0]][acn[1]] ? _acl[acn[0]][acn[1]] : res;
        }
      };
      Object.defineProperty(CatUsers.prototype, 'partners_uids', {
        get: function () {
          const res = [];
          this.acl_objs && this.acl_objs.each((row) => {
            if (row.acl_obj instanceof this._manager._owner.$p.CatPartners) {
              res.push(row.acl_obj.ref);
            }
          });
          return res;
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
    if (!obj) {
      throw new TypeError('Invalid empty plugin');
    }
    if (obj.hasOwnProperty('proto')) {
      if (typeof obj.proto == 'function') {
        obj.proto(MetaEngine$1);
      }
      else if (typeof obj.proto == 'object') {
        Object.keys(obj.proto).forEach((id) => MetaEngine$1.prototype[id] = obj.proto[id]);
      }
    }
    if (obj.hasOwnProperty('constructor')) {
      if (typeof obj.constructor != 'function') {
        throw new TypeError('Invalid plugin: constructor must be a function');
      }
      MetaEngine$1._plugins.push(obj.constructor);
    }
    return MetaEngine$1;
  }
}
MetaEngine$1.classes = classes;
MetaEngine$1._plugins = [];

module.exports = MetaEngine$1;
//# sourceMappingURL=index.js.map
