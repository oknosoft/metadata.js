/*
 * Конструкторы объектов данных
 *
 */

import {string} from './utils';
import {own, get, set, hash, notify} from './meta/symbols';
import {OwnerObj} from './meta/classes';
import {TabularSection} from './tabulars';

class InnerData {
  constructor(owner, loading) {
    /**
     * Признак прочитанности объекта из базы
     * @type {boolean}
     */
    this.isNew = !(owner instanceof EnumObj);
    /**
     * Признак, что в текущий момент, объект "загружается"
     * Аналог РежимЗаписи.Загрузка в 1С
     * @type {boolean}
     */
    this.loading = Boolean(loading);
    /**
     * Счётчик циклической записи
     * @type {number}
     */
    this.saving = 0;
    /**
     * Признак, что в текущий момент, объект "записывается"
     * @type {boolean}
     */
    this.trans = false;
    /**
     * Признак модифицированности
     * @type {boolean}
     */
    this.modified = false;
  }
}

export class BaseDataObj extends OwnerObj {

  /**
   * Фактическое хранилище данных объекта
   * @type Object
   * @final
   */
  #obj;

  constructor(attr, manager, loading, direct) {

    super(manager);

    if(Array.isArray(manager)) {
      this.#obj = direct ? attr : {};
      Object.defineProperties(this, {
        _data: {value: manager.owner._data},
      });
    }
    else {
      // в режиме direct, новый объект не создаём - используем сырые данные
      this.#obj = direct ? attr : {ref: manager.getRef(attr)};

      Object.defineProperties(this, {

        /**
         * Внутренние и пользовательские данные - аналог `AdditionalProperties` _Дополнительные свойства_ в 1С
         * @property _data
         * @type InnerData
         * @final
         */
        _data: {value: new InnerData(this, loading)}

      });
    }

    for(const name in this._metadata().tabulars) {
      this.#obj[name] = new TabularSection(this, name, this.#obj[name]);
    }

  }

  /**
   * Указатель на менеджера данного объекта
   * @property _manager
   * @type DataManager
   * @final
   */
  get _manager() {
    return this[own];
  }

  /**
   * Метаданные текущего объекта
   * @param field_name
   * @type MetaObj
   */
  _metadata(field_name) {
    return this._manager.metadata(field_name);
  }

  get className() {
    return this._manager.className;
  }

  /**
   * guid ссылки объекта
   * @type String
   */
  get ref() {
    return this._manager.getRef(this.#obj);
  }

  /**
   * Дополняет сырые данные #obj не генерируя событий
   * @param {Object} raw
   */
  _assign(raw) {
    Object.assign(this.#obj, raw);
  }

  [get](f) {

    const res = this.#obj[f];
    const {_manager} = this;

    // для перечислений и табличных частей, возвращаем значение в лоб
    if(_manager.isEnum) {
      return res;
    }

    const rtype = typeof res;

    if(f === 'type' && rtype === 'object') {
      return res;
    }

    const {utils} = _manager;
    const {type} = this._metadata(f);
    if(f == 'ref') {
      return _manager.getRef(res);
    }
    else if(type.isRef) {

      if(type.digits && rtype === 'number') {
        return res;
      }

      if(type.hasOwnProperty('str_len') && !utils.is.guid(res)) {
        return res;
      }

      const mgr = _manager.value_mgr(_obj, f, type);
      if(mgr) {
        if(utils.is.dataMgr(mgr)) {
          return mgr.get(res, false, false);
        }
        else {
          return utils.fetch_type(res, mgr);
        }
      }

      if(res) {
        // управляемый лог
        //typeof utils.debug === 'function' && utils.debug([f, type, _obj]);
        return null;
      }

    }
    else if(type.date_part) {
      return utils.fix.date(res, true);
    }
    else if(type.digits) {
      return utils.fix.number(res, !type.hasOwnProperty('str_len'));
    }
    else if(type.types[0] == 'boolean') {
      return utils.fix.boolean(res);
    }
    else if(type.types[0] == 'json') {
      return rtype === 'object' ? res : {};
    }
    else {
      return res;
    }
  }

  [notify](f) {
    const {_data, _manager} = this;
    if(_data && !_data._loading) {
      _data._modified = true;
      _manager.emit_async('update', this, {[f]: this.#obj[f]});
    }
  }

  /**
   * Устанваливает значение реквизита с приведением типов
   * @param {String} f - имя поля
   * @param {*} v - значение
   * @private
   */
  [set](f, v) {
    const {_data, _manager: {utils}} = this;
    const mf = this._metadata(f).type;
    const obj = this.#obj;

    // выполняем value_change с блокировкой эскалации
    if(!_data._loading) {
      _data._loading = true;
      const res = this.value_change(f, mf, v);
      _data._loading = false;
      if(res === false) {
        return;
      }
    }

    if(f === 'type' && v.types) {
      obj[f] = v;
    }
    else if(f === 'ref') {
      obj[f] = utils.fix.guid(v);
    }
    else if(mf instanceof DataObj) {
      obj[f] = utils.fix.guid(v, false);
    }
    else if(mf.isRef) {

      if(mf.digits && typeof v === 'number' || mf.hasOwnProperty('str_len') && typeof v === string && !utils.is.guid(v)) {
        obj[f] = v;
      }
      else if(typeof v === 'boolean' && mf.types.indexOf('boolean') != -1) {
        obj[f] = v;
      }
      else if(mf.date_part && v instanceof Date) {
        obj[f] = v;
      }
      else {
        obj[f] = utils.fix.guid(v);

        if(utils.is.dataObj(v) && mf.types.indexOf(v._manager.className) != -1) {

        }
        else {
          let mgr = this._manager.value_mgr(obj, f, mf, false, v);
          if(mgr) {
            if(mgr.isEnum()) {
              if(typeof v === string) {
                obj[f] = v;
              }
              else if(!v) {
                obj[f] = '';
              }
              else if(typeof v === 'object') {
                obj[f] = v.ref || v.name || '';
              }

            }
            else if(v && v.presentation) {
              if(v.type && !(v instanceof DataObj)) {
                delete v.type;
              }
              mgr.create(v);
            }
            else if(!utils.is.dataMgr(mgr)) {
              obj[f] = this.fetch_type(v, mgr);
            }
          }
          else {
            if(typeof v !== 'object') {
              obj[f] = v;
            }
          }
        }
      }
    }
    else if(mf.date_part) {
      obj[f] = utils.fix.date(v, !mf.hasOwnProperty('str_len'));
    }
    else if(mf.digits) {
      obj[f] = utils.fix_number(v, !mf.hasOwnProperty('str_len'));
    }
    else if(mf.types[0] == 'boolean') {
      obj[f] = utils.fix_boolean(v);
    }
    else if(mf.types[0] == 'json') {
      if(v && typeof v === string) {
        try {
          v = JSON.parse(v);
        }
        catch (e) {}
      }
      if(typeof v === 'object') {
        const tmp = utils._clone(v);
        if(tmp && typeof obj[f] === 'object') {
          Object.assign(obj[f], tmp);
        }
        else {
          obj[f] = tmp;
        }
      }
    }
    else {
      obj[f] = v;
    }
  }

  /**
   * Рассчитывает hash объекта
   * @return {Number}
   */
  [hash]() {
    // накапливаем строку из всех реквизитов и табличных частей
    let str = '';
    const {_obj, _manager} = this;
    const {fields, tabular_sections} = _manager.metadata();
    const sfields = ['date','numberDoc','posted','id','name','_deleted','is_folder','ref'];

    for(const fld of Object.keys(fields).concat(sfields)) {
      const v = _obj[fld];
      if(v !== undefined && v !== null) {
        str += v.valueOf();
      }
    }

    for (const ts in tabular_sections) {
      if(Array.isArray(_obj[ts])) {
        const fields = Object.keys(tabular_sections[ts].fields);
        for(const row of _obj[ts]) {
          for(const fld of fields) {
            const v = row[fld];
            if(v !== undefined && v !== null) {
              str += v.valueOf();
            }
          }
        }
      }
    }

    return _manager.utils.crc32(str);
  }

  /**
   * @summary Для операций сравнения возвращаем guid
   */
  valueOf() {
    return this.ref;
  }

  /**
   * @summary Сериализация
   * @desc Для сериализации возвращаем внутренний _obj
   */
  toJSON() {
    const res = {};
    const {_obj, _manager} = this;
    const {utils: {blank}, classes: {Meta}} = _manager.root;

    for(const fld in _obj) {
      const mfld = _manager.metadata(fld);
      if(mfld || fld === '_attachments') {
        if(Array.isArray(_obj[fld])) {
          res[fld] = this[fld].toJSON();
        }
        else {
          if(!Meta.sysFields.includes(fld) &&
            (_obj[fld] === blank.guid || (_obj[fld] === '' && mfld.type.types.length === 1 && mfld.type.types[0] === string))) {
            continue;
          }
          res[fld] = _obj[fld];
          if(fld === 'type' && typeof res[fld] === 'object') {
            delete res[fld]._mgr;
          }
        }
      }
    }
    return res;
  }

  /**
   * @summary Приведение к строке
   * @desc для строкового представления используем presentation
   */
  toString() {
    return this.presentation;
  }


  /**
   * Пометка удаления
   * @property _deleted
   * @for DataObj
   * @type Boolean
   */
  get _deleted() {
    return Boolean(this.#obj._deleted);
  }
  set _deleted(v) {
    this.#obj._deleted = !!v;
  }

  /**
   * Признак модифицированности
   */
  get _modified() {
    return !!this._data._modified;
  }
  set _modified(v) {
    this._data._modified = !!v;
  }

  /**
   * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
   * @return {Boolean}
   */
  isNew() {
    return !this._data || this._data.isNew;
  }

  /**
   * Метод для ручной установки признака _прочитан_ (не новый)
   */
  _set_loaded(ref) {
    this._manager.push(this, ref || this.ref);
    Object.assign(this._data, {
      modified: false,
      isNew: false,
      loading: false,
    });
    return this;
  }


  /**
   * Проверяет, является ли ссылка объекта пустой
   * @method empty
   * @return {boolean} - true, если ссылка пустая
   */
  empty() {
    return this._manager.utils.is.emptyGuid(this.ref);
  }

  /**
   * Применяет атрибуты к объекту
   *
   * @param {Object} attr
   * @param {Array.<String>} [include]
   * @param {Array.<String>} [exclude]
   * @param {Boolean} [silent]
   * @return {DataObj}
   * @private
   */
  _mixin(attr, include, exclude, silent) {
    if(Object.isFrozen(this)) {
      return this;
    }
    if(attr && typeof attr == 'object') {
      const {_not_set_loaded} = attr;
      const {_data, _manager} = this;
      const {utils} = _manager;
      _not_set_loaded && delete attr._not_set_loaded;
      if(silent) {
        if(_data._loading) {
          silent = false;
        }
        _data._loading = true;
      }
      utils._mixin(this, attr, include, exclude);
      if(_data._loading) {
        _manager.emit('mixin', this);
      }
      if(silent) {
        _data._loading = false;
      }
      if(!_not_set_loaded && (_data._loading || (!utils.is.emptyGuid(this.ref) && (attr.id || attr.name || attr.numberDoc)))) {
        this._set_loaded(this.ref);
      }
    }
    return this;
  }


  /**
   * После создания
   * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
   * или заполнить объект на основании данных связанного объекта
   *
   * @event AFTER_CREATE
   */
  after_create() {
    return this;
  }

  /**
   * После чтения объекта с сервера
   * Имеет смысл для объектов с типом кеширования ("doc", "remote", "meta", "e1cib").
   * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
   *
   * @event AFTER_LOAD
   */
  after_load() {
    return this;
  }

  /**
   * Перед записью
   * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
   * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
   *
   * @event BEFORE_SAVE
   */
  before_save() {
    return this;
  }

  /**
   * После записи
   *
   * @event AFTER_SAVE
   */
  after_save() {
    return this;
  }

  /**
   * При изменении реквизита шапки или табличной части
   *
   * @event VALUE_CHANGE
   */
  value_change(f, mf, v) {
    return this;
  }

  /**
   * При добавлении строки табличной части
   *
   * @event ADD_ROW
   */
  add_row(row) {
    return this;
  }

  /**
   * При удалении строки табличной части
   *
   * @event DEL_ROW
   */
  del_row(row) {
    return this;
  }

  /**
   * После удаления строки табличной части
   *
   * @event AFTER_DEL_ROW
   */
  after_del_row(name) {
    return this;
  }

}

/**
 * Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumObj"}}{{/crossLink}} - ПеречислениеОбъект
 * - {{#crossLink "CatObj"}}{{/crossLink}} - СправочникОбъект
 * - {{#crossLink "DocObj"}}{{/crossLink}} - ДокументОбъект
 * - {{#crossLink "DataProcessorObj"}}{{/crossLink}} - ОбработкаОбъект
 * - {{#crossLink "RegisterRow"}}{{/crossLink}} - ЗаписьРегистраОбъект
 * @extends BaseDataObj
 *
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @param [loading] {Boolean}
 */
export class DataObj extends BaseDataObj {

  constructor(attr, manager, loading, direct) {
    // если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
    if(manager.storable !== false) {
      const tmp = manager.get(attr, false);
      if(tmp) {
        return tmp;
      }
    }

    super(attr, manager, loading, direct);

    manager.push(this);

  }

  /**
   * Ревизия
   * Eё устанваливает адаптер при чтении и записи
   * @type String
   */
  get _rev() {
    return this[get]('_rev') || '';
  }
  set _rev(v) {
  }

  /**
   * Читает объект из внешней или внутренней датабазы асинхронно.
   * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
   * @method load
   * @for DataObj
   * @param attr {Object} - дополнительные параметры чтения, например, db
   * @return {Promise.<DataObj>} - промис с результатом выполнения операции
   * @async
   */
  load(attr) {
    const {_data, _manager: {utils}} = this;
    if(this.ref == utils.blank.guid) {
      if(_data) {
        _data._loading = false;
        _data._modified = false;
      }
      return Promise.resolve(this);
    }
    else if(_data._loading) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(_data._loading ? this.load(attr) : this);
        }, 1000);
      });
    }
    else {
      _data._loading = true;
      return this._manager.adapter.load_obj(this, attr)
        .then(() => {
          _data._loading = false;
          _data._modified = false;
          return this.after_load();
        });
    }
  }

  /**
   * Освобождает память и уничтожает объект
   * @method unload
   * @for DataObj
   */
  unload() {
    const {_obj, ref, _data, _manager} = this;
    _manager.unload_obj(ref);
    _data._loading = true;
    //_manager.emit_async('unload', this);
    for (const ts in this._metadata().tabular_sections) {
      this[ts].clear();
    }
    for (const f in this) {
      if(this.hasOwnProperty(f)) {
        delete this[f];
      }
    }
    for (const f in _obj) {
      delete _obj[f];
    }
    delete this._obj;
  }

  /**
   * Проверяет заполненность реквизитов
   * и прочие ограничения, заданные в метаданных
   * @param {Object} [attr] - массив полей, которые нужно проверить. Если не задан, проверяются все поля
   * @param {Array} [attr.fields] - массив полей, которые нужно проверить. Если не задан, проверяются все поля
   * @return {boolean}
   */
  checkMandatory(attr) {
    const {fields, tabular_sections} = this._metadata();
    const {_manager} = this;
    const {msg, cch: {properties}, classes, utils} = _manager.root;
    const flds = Object.assign({}, fields);
    if(_manager instanceof classes.CatManager) {
      flds.name = this._metadata('name') || {};
      flds.id = this._metadata('id') || {};
    }
    for (const mf in flds) {
      if (flds[mf] && flds[mf].mandatory && (!this._obj[mf] || this._obj[mf] === utils.blank.guid)) {
        throw {
          obj: this,
          title: msg.mandatory_title,
          type: 'alert-error',
          text: msg.mandatory_field.replace('%1', this._metadata(mf).synonym)
        };
      }
    }
    if(properties) {
      for (const prts of ['extra_fields', 'product_params', 'params']) {
        if(!tabular_sections[prts]) {
          continue;
        }
        for (const row of this[prts]._obj) {
          const property = properties.get(row.property || row.param);
          if(property && property.mandatory) {
            const {value} = (row._row || row);
            if(utils.is.dataObj(value) ? value.empty() : !value) {
              throw {
                obj: this,
                row: row._row || row,
                title: msg.mandatory_title,
                type: 'alert-error',
                text: msg.mandatory_field.replace('%1', property.caption || property.name)
              };
            }
          }
        }
      }
    }
    return true;
  }

  /**
   * Записывает объект
   * Ввыполняет подписки на события перед записью и после записи<br />
   * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
   *
   * @method save
   * @for DataObj
   * @param {Boolean} [post] - проведение или отмена проведения или просто запись
   * @param {Boolean} [operational] - режим проведения документа (Оперативный, Неоперативный)
   * @param {Array} [attachments] - массив вложений
   * @param {Object} [attr] - дополнительные параметры записи
   * @return {Promise.<DataObj>} - промис с результатом выполнения операции
   * @async
   */
  save(post, operational, attachments, attr) {

    const {utils} = this._manager;

    if(utils.is_empty_guid(this.ref)) {
      return Promise.resolve(this);
    }

    // запоминаем признак проведенности, чтобы восстановить его в случае неудачной записи
    let initial_posted;
    if(this instanceof DocObj && typeof post == 'boolean') {
      initial_posted = this.posted;
      this.posted = post;
    }

    // выполняем обработчик перед записью
    const {_data, _manager} = this;
    _data.trans = true;
    return _manager.emit_promise('before_save', this, attr)
      .then(() => {
        return this.before_save(attr);
      })
      .then((before_save_res) => {

        // этот код выполним в самом конце, после записи
        const reset_modified = () => {
          if(before_save_res === false) {
            if(this instanceof DocObj && typeof initial_posted == 'boolean' && this.posted !== initial_posted) {
              this.posted = initial_posted;
            }
          }
          else {
            _data._modified = false;
          }
          _data._saving = 0;
          _data.trans = false;
          return this;
        };

        // если процедуры перед записью завершились неудачно - не продолжаем
        if(before_save_res === false) {
          return Promise.reject(reset_modified());
        }
        // если запись переопределена в before_save, выходим без лишних движений
        else if(before_save_res === null) {
          return Promise.resolve(reset_modified());
        }
        // TODO: обработать bulk_docs
        else if(Array.isArray(before_save_res)) {
          ;
        }

        // этот код выполняем в случае ошибки незаполненных реквизитов
        const reset_mandatory = (msg) => {
          before_save_res = false;
          reset_modified();
          _manager._owner.$p.md.emit('alert', msg);
          const err = new Error(msg.text);
          err.msg = msg;
          return Promise.reject(err);
        };

        // для объектов с иерархией установим пустого родителя, если иной не указан
        if(this._metadata().hierarchical && !this._obj.parent) {
          this._obj.parent = utils.blank.guid;
        }

        // для документов, контролируем заполненность даты и номера
        let numerator;
        if(!this._deleted) {
          if(this instanceof DocObj) {
            if(utils.blank.date == this.date) {
              this.date = new Date();
            }
            if(!this.numberDoc) {
              numerator = this.newNumberDoc();
            }
          }
          else {
            if(!this.id) {
              numerator = this.newNumberDoc();
            }
          }
        }

        // если не указаны обязательные реквизиты...
        try {
          this.checkMandatory();
        }
        catch (e) {
          return reset_mandatory(e);
        }

        // в зависимости от типа кеширования, получаем saver и сохраняем объект во внешней базе
        return (numerator || Promise.resolve())
          .then(() => _manager.adapter.save_obj(this, Object.assign({post, operational, attachments}, attr)))
          // и выполняем обработку после записи
          .then(() => this.after_save())
          .then(() => _manager.emit_promise('after_save', this))
          .then(reset_modified)
          .catch((err) => {
            reset_modified();
            throw err;
          });

      });

  }

  /**
   * Загружает недостающие объекты, ссылки на которые есть в текущем объекте
   * @return {Promise<DataObj>}
   */
  loadLinked() {
    const adapters = new Map();
    const {fields, tabular_sections} = this._metadata();

    function add_refs(obj, meta) {
      for(const fld in meta) {
        if(meta[fld].type.isRef) {
          const v = obj[fld];
          if(v instanceof DataObj && !v.empty() && v.isNew()) {
            const {_manager} = v;
            const {adapter} = _manager;
            const db = adapter.db(_manager);
            if(!adapters.get(adapter)) {
              adapters.set(adapter, new Map());
            }
            if(!adapters.get(adapter).get(db)){
              adapters.get(adapter).set(db, new Set());
            }
            adapters.get(adapter).get(db).add(`${v.className}|${v.ref}`);
          }
        }
      }
    }

    add_refs(this, fields);
    for(const tsname in tabular_sections) {
      const meta = tabular_sections[tsname].fields;
      for(const row of this[tsname]) {
        row && add_refs(row, meta);
      }
    }

    const res = [];
    for(const [adapter, mdb] of adapters) {
      for(const [db, refs] of mdb) {
        res.push(adapter
          .load(null, Array.from(refs), false, db)
          .catch((err) => null));
      }
    }

    return Promise.all(res).then(() => this);
  }

  /**
   * @summary Возвращает присоединенный объект или файл
   * @for DataObj
   * @param att_id {String} - идентификатор (имя) вложения
   */
  getAttachment(att_id) {
    const {_manager, ref} = this;
    return _manager.adapter.getAttachment(_manager, ref, att_id);
  }

  /**
   * Сохраняет объект или файл во вложении
   * Вызывает {{#crossLink "DataManager/save_attachment:method"}} одноименный метод менеджера {{/crossLink}} и передаёт ссылку на себя в качестве контекста
   *
   * @param {String} name - идентификатор (имя) вложения
   * @param {Blob|String} attachment - вложение
   * @param {String} [type]- mime тип
   * @return Promise.<DataObj>
   * @async
   */
  save_attachment(name, attachment, type) {
    const {_manager, ref, _obj, _attachments} = this;
    return _manager.save_attachment(ref, name, attachment, type)
      .then((att) => {
        if(!_attachments) {
          this._attachments = {};
        }
        if(att.rev && _obj) {
          _obj._rev = att.rev;
        }
        if(!this._attachments[name] || !att.stub) {
          this._attachments[name] = att;
        }
        return att;
      });
  }

  /**
   * Удаляет присоединенный объект или файл
   * Вызывает одноименный метод менеджера и передаёт ссылку на себя в качестве контекста
   *
   * @param {String} name - идентификатор (имя) вложения
   * @async
   */
  delete_attachment(name) {
    const {_manager, ref, _obj, _attachments} = this;
    return _manager.delete_attachment(ref, name)
      .then((att) => {
        if(_attachments) {
          delete _attachments[name];
        }
        if(att.rev && _obj) {
          _obj._rev = att.rev;
        }
        return att;
      });
  }

  /**
   * Возвращает массив оборванных ссылок в реквизитах и табличных частях объекта
   * @return {Array}
   */
  broken_links() {
    const res = [];
    const {fields, tabular_sections} = this._metadata();
    const {_obj, _manager: {root}} = this;
    const {md, utils} = root;

    if(this.empty() || this.isNew()){
      return res;
    }

    for (const fld in fields) {
      const {type} = fields[fld];
      if (type.isRef && _obj.hasOwnProperty(fld) && _obj[fld] && !utils.is_empty_guid(_obj[fld])) {
        const finded = type.types.some((type) => {
          const _mgr = md.mgr_by_className(type);
          return _mgr && !_mgr.get(_obj[fld], false, false).isNew();
        });
        if (!finded) {
          res.push({'obj': _obj, fld, 'ts': '', 'row': 0, 'value': _obj[fld], type});
        }
      }
    }

    for(const ts in tabular_sections) {
      if (_obj.hasOwnProperty(ts)) {
        const {fields} = tabular_sections[ts];
        _obj[ts].forEach((row) => {
          for(const fld in fields) {
            const {type} = fields[fld];
            if (type.isRef && row.hasOwnProperty(fld) && row[fld] && !utils.is_empty_guid(row[fld])) {
              const finded = type.types.some((type) => {
                const _mgr = md.mgr_by_className(type);
                return _mgr && !_mgr.get(_obj[fld], false, false).isNew();
              });
              if (!finded) {
                res.push({'obj': _obj, fld, ts, 'row': row.row, 'value': row[fld], type});
              }
            }
          }
        })
      }
    }

    return res;
  }

  /**
   * Значение допреквизита по имени или свойству
   * @param {String|CchProperties} property - имя параметра
   * @param {*} [value] - если задано, устанавливает
   * @param {Number} [list] - если задано, переопределяет list свойства
   */
  _extra(property, value, list) {
    const {extra_fields, _manager: {root: {cch, md}}} = this;
    if(!extra_fields || !cch.properties) {
      return;
    }
    if(typeof property === string) {
      property = cch.properties.predefined(property);
    }
    if(!property) {
      return;
    }

    const row = extra_fields.find({property});
    if(value !== undefined) {
      if(row) {
        row.value = value;
      }
      else {
        extra_fields.add({property, value});
      }
    }
    else {
      const {type: {types, isSingleRef}} = property;
      if(!list) {
        list = property.list;
      }
      if(list === 4) {
        const res = new Map();
        try {
          const mgr = md.mgr_by_className(types[0]);
          const raw = row?.txt_row ? JSON.parse(row.txt_row) : {};
          for(const ref in raw) {
            res.set(mgr.get(ref), raw[ref]);
          }
        }
        catch (e) {}
        return res;
      }
      if(row) {
        return row.value;
      }
      if(isSingleRef) {
        const mgr = md.mgr_by_className(types[0]);
        return mgr && mgr.get();
      }
    }
  }

  /**
   * Дополнительные реквизиты
   * Массив дополнителных реквизитов (аналог подсистемы `Свойства` БСП) вычисляется через
   * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
   *
   * @type Array.<CchProperties>
   */
  get _extra_props() {
    const {cat, cch, md} = this._manager.root;
    // ищем предопределенный элемент, сответствующий классу данных
    const dests = cat.destinations || cch.destinations;
    const res = [];
    if(dests) {
      const condition = obj?._destinations_condition || {predefined_name: md.className_to_1c(this.className).replace('.', '_')};
      dests.find_rows(condition, destination => {
        const ts = destination.extra_fields;
        if(ts) {
          ts.each(row => {
            if(!row._deleted) {
              res.push(row.property);
            }
          });
        }
        return false;
      });
    }
    return res;
  }
}

/**
 * Абстрактный класс СправочникОбъект
 * @extends DataObj
 * @param {Object} attr - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
export class CatObj extends DataObj {

  constructor(attr, manager, loading) {

    const direct = loading && attr && manager.utils.is.guid(attr.ref);

    // выполняем конструктор родительского объекта
    super(attr, manager, loading, direct);

    if(!direct) {
      this._mixin(attr);
    }

  }

  /**
   * Представление объекта
   * @property presentation
   * @for CatObj
   * @type String
   */
  get presentation() {
    return this.name || this.id || '';
  }

  /**
   * Код элемента справочника
   * @type String|Number
   */
  get id() {
    return this[get]('id') || '';
  }
  set id(v) {
    this[set]('id', v);
  }

  /**
   * Наименование элемента справочника
   * @type String
   */
  get name() {
    return this[get]('name') || '';
  }
  set name(v) {
    this[set]('name', v);
  }


  /**
   * Дети
   * Возвращает массив элементов, находящихся в иерархии текущего
   *
   * @param foldersOnly {Boolean}
   * @return {Array.<DataObj>}
   */
  _children(foldersOnly) {
    const res = [];
    this._manager.forEach((o) => {
      if(o != this && (!foldersOnly || o.is_folder) && o._hierarchy(this)) {
        res.push(o);
      }
    });
    return res;
  }

  /**
   * Родители
   * Возвращает массив родителей, в иерархии которых находится текущий элемент
   */
  _parents() {
    const res = [];
    let {parent} = this;
    while (parent && !parent.empty()) {
      res.push(parent);
      parent = parent.parent;
    }
    return res;
  }

  /**
   * В иерархии
   * Выясняет, находится ли текущий объект в указанной группе
   * @param group {Object|Array} - папка или массив папок
   */
  _hierarchy(group) {
    if(Array.isArray(group)) {
      return group.some((v) => this._hierarchy(v));
    }
    const {parent} = this;
    if(this == group || parent == group) {
      return true;
    }
    if(parent && !parent.empty()) {
      return parent._hierarchy(group);
    }
    return group == this._manager.utils.blank.guid;
  }

  /**
   * Для иерархических справочников возвращает путь элемента
   * @param ref {String|CatObj} - ссылка или объект данных
   * @return {string} - строка пути элемента
   */
  _path() {
    let tobj = this;
    const res = [{ref: tobj.ref, presentation: tobj.presentation}];

    while (true) {
      tobj = tobj.parent;
      if (!tobj || tobj.empty()) {
        break;
      }
      res.push({ref: tobj.ref, presentation: tobj.presentation});
    }

    return res;
  }

}

/**
 * Абстрактный класс ДокументОбъект
 * @extends DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
export class DocObj extends DataObj {

  constructor(attr, manager, loading) {

    const direct = loading && attr && manager.utils.is_guid(attr.ref);

    // выполняем конструктор родительского объекта
    super(attr, manager, loading, direct);

    if(!direct) {
      this._mixin(attr);
    }

  }

  /**
   * Номер документа
   * @property numberDoc
   * @type {String|Number}
   */
  get numberDoc() {
    return this[get]('numberDoc') || '';
  }
  set numberDoc(v) {
    this[notify]('numberDoc');
    this[set](numberDoc, v);
  }

  /**
   * Дата документа
   * @property date
   * @type {Date}
   */
  get date() {
    return this[get]('date') || '';
  }
  set date(v) {
    this[notify]('date');
    this[set]('date', v);
  }

  /**
   * Представление объекта
   * @property presentation
   * @for DocObj
   * @type String
   */
  get presentation() {
    const meta = this._metadata();
    const {numberDoc, date, posted, _modified} = this;
    return numberDoc ?
      `${meta.obj_presentation || meta.synonym}  №${numberDoc} от ${moment(date).format(moment._masks.date_time)} (${posted ? '' : 'не '}проведен)${_modified ? ' *' : ''}`
      :
      `${meta.obj_presentation || meta.synonym} ${moment(date).format(moment._masks.date_time)} (${posted ? '' : 'не '}проведен)${_modified ? ' *' : ''}`;
  }

  /**
   * Признак проведения
   * @property posted
   * @type Boolean
   */
  get posted() {
    return this._obj.posted || false;
  }
  set posted(v) {
    this[notify]('posted');
    this._obj.posted = this._manager.utils.fix.boolean(v);
  }

}


/**
 * ### Абстрактный класс ОбработкаОбъект
 * @class DataProcessorObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
export class DataProcessorObj extends DataObj {

  constructor(attr, manager, loading) {

    // выполняем конструктор родительского объекта
    super(attr, manager, loading);

    if(!loading) {
      const {fields, tabular_sections} = manager.metadata();
      for (const fld in fields) {
        if(!attr[fld]) {
          attr[fld] = this.fetch_type('', fields[fld].type);
        }
      }
      for (const fld in tabular_sections) {
        if(!attr[fld]) {
          attr[fld] = [];
        }
      }
    }

    manager.utils._mixin(this, attr);
  }
}

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
export class EnumObj extends DataObj {

  constructor(attr, manager, loading) {

    const {ref, ...other} = attr;
    // выполняем конструктор родительского объекта
    super(other, manager, loading, true);
    // дозаполняем при необходисомти
    if(!loading) {
      super._assign(other);
    }
  }

  /**
   * Порядок элемента перечисления
   * @property order
   * @for EnumObj
   * @type Number
   */
  get order() {
    return this[get]('order');
  }

  /**
   * Ссылка перечисления
   * @type {String}
   */
  get ref() {
    return this._manager.getRef(this);
  }

  /**
   * Имя элемента перечисления
   * @type String
   */
  get name() {
    return this[get]('name');
  }

  /**
   * Latin-имя элемента перечисления
   * @type String
   */
  get latin() {
    return this[get]('latin');
  }

  /**
   * Синоним элемента перечисления
   * @type String
   */
  get synonym() {
    return this[get]('synonym');
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
   * @return {boolean} - true, если ссылка пустая
   */
  empty() {
    const {ref} = this;
    return !ref || ref == '_';
  }

  /**
   * Проверяет на равенство по имени
   * т.к. знаяения перечислений могут иметь синонимы,
   * метод `is()` - эффективнее прямого сравнения со строкой имени значения перечисления
   * @param name {String}
   * @return {Boolean}
   */
  is(name) {
    return this._manager[name] === this;
  }

  /**
   * Проверяет на вхождение в список
   * @param {Array.<String>|String} names
   * @return {boolean}
   */
  in(names) {
    if(typeof names === "string") {
      names = names.split(',').map(v => v.trim());
    }
    for(const name of names) {
      if(this.is(name)) {
        return true;
      }
    }
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
export class RegisterRow extends DataObj {

  constructor(attr, manager, loading) {

    // выполняем конструктор родительского объекта
    super(attr, manager, loading);

    if(attr && typeof attr == 'object') {
      let tref = attr.ref;
      if(tref) {
        delete attr.ref;
      }
      manager.utils._mixin(this, attr);
      if(tref) {
        attr.ref = tref;
      }
    }

    for (const check in manager.metadata().dimensions) {
      if(!attr.hasOwnProperty(check) && attr.ref) {
        let keys = attr.ref.split('¶');
        Object.keys(manager.metadata().dimensions).forEach((fld, ind) => {
          this[fld] = keys[ind];
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
    const _meta = this._manager.metadata();
    if(!_meta.fields) {
      _meta.fields = Object.assign({}, _meta.dimensions, _meta.resources, _meta.attributes);
    }
    return field_name ? _meta.fields[field_name] : _meta;
  }

  /**
   * Ключ записи регистра
   */
  get ref() {
    return this._manager.getRef(this);
  }

  set ref(v) {

  }

  get presentation() {
    return this._metadata().obj_presentation || this._metadata().synonym;
  }
}

/**
 * Aбстрактная строка табличной части
 *
 * @extends BaseDataObj
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 */
export class TabularSectionRow extends BaseDataObj {

  constructor(attr, owner, loading, direct) {

    super(attr, owner, loading, direct);

    Object.defineProperties(this, {

      /**
       * Указатель на владельца данной строки табличной части
       * @property _owner
       * @type TabularSection
       */
      _owner: {
        value: owner
      },
    });
  }


  /**
   * ### Метаданые строки табличной части
   * @property _metadata
   * @for TabularSectionRow
   * @type Number
   */
  _metadata(field_name) {
    const {_owner} = this;
    return field_name ? _owner._owner._metadata(_owner._name).fields[field_name] : _owner._owner._metadata(_owner._name);
  }

  get _manager() {
    return this[own]._manager;
  }

  get _data() {
    return this[own]._owner._data;
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
    const {_manager} = th
    return this[own]._manager.utils._mixin(_owner._owner._manager.objConstructor(_owner._name, _owner), _obj)
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



