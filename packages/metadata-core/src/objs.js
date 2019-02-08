/**
 * Конструкторы объектов данных
 *
 * @module  metadata
 * @submodule meta_objs
 */

import utils from './utils';
import {DataManager, DataProcessorsManager, EnumManager, RegisterManager} from './mngrs';
import {TabularSection, TabularSectionRow} from './tabulars';

class InnerData {

  constructor(owner, loading) {
    this._ts_ = {};
    this._is_new = !(owner instanceof EnumObj);
    this._loading = !!loading;
    this._saving = 0;
    this._saving_trans = false;
    this._modified = false;
  }

}

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
 * @param [loading] {Boolean}
 * @constructor
 * @menuorder 20
 * @tooltip Объект данных
 */
export class DataObj {

  constructor(attr, manager, loading, direct) {

    // если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
    if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager)) {
      const tmp = manager.get(attr, true);
      if(tmp) {
        return tmp;
      }
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
        value: direct ? attr : {
          ref: manager instanceof EnumManager ? attr.name : (manager instanceof RegisterManager ? manager.get_ref(attr) : utils.fix_guid(attr))
        },
        configurable: true
      },

      /**
       * Указатель на менеджер данного объекта
       * @property _manager
       * @type DataManager
       * @final
       */
      _manager: {
        value: manager
      },

      /**
       * Внутренние и пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
       * @property _data
       * @type InnerData
       * @final
       */
      _data: {
        value: new InnerData(this, loading),
        configurable: true
      }

    });

    if(manager.alatable && manager.push) {
      manager.alatable.push(this._obj);
      manager.push(this, this._obj.ref);
    }

  }

  _getter(f) {

    const mf = this._metadata(f).type;
    const {_obj} = this;
    const res = _obj ? _obj[f] : '';

    if(f == 'type' && typeof res == 'object') {
      return res;
    }
    else if(f == 'ref') {
      return res;
    }
    else if(mf.is_ref) {

      if(mf.digits && typeof res === 'number') {
        return res;
      }

      if(mf.hasOwnProperty('str_len') && !utils.is_guid(res)) {
        return res;
      }

      let mgr = this._manager.value_mgr(_obj, f, mf);
      if(mgr) {
        if(utils.is_data_mgr(mgr)) {
          return mgr.get(res, false, false);
        }
        else {
          return utils.fetch_type(res, mgr);
        }
      }

      if(res) {
        console.log([f, mf, _obj]);
        return null;
      }

    }
    else if(mf.date_part) {
      return utils.fix_date(_obj[f], true);
    }
    else if(mf.digits) {
      return utils.fix_number(_obj[f], !mf.hasOwnProperty('str_len'));
    }
    else if(mf.types[0] == 'boolean') {
      return utils.fix_boolean(_obj[f]);
    }
    else {
      return _obj[f] || '';
    }
  }

  /**
   * Устанваливает значение реквизита с приведением типов без проверки, отличается ли оно от предыдущего
   * @param f
   * @param v
   * @param [mf]
   * @private
   */
  __setter(f, v, mf) {

    const {_obj, _data} = this;

    if(!mf){
      mf = this._metadata(f).type;
    }

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
      _obj[f] = v;
    }
    else if(f === 'ref') {
      _obj[f] = utils.fix_guid(v);
    }
    else if(mf instanceof DataObj || mf instanceof DataManager) {
      _obj[f] = utils.fix_guid(v, false);
    }
    else if(mf.is_ref) {

      if(mf.digits && typeof v === 'number' || mf.hasOwnProperty('str_len') && typeof v === 'string' && !utils.is_guid(v)) {
        _obj[f] = v;
      }
      else if(typeof v === 'boolean' && mf.types.indexOf('boolean') != -1) {
        _obj[f] = v;
      }
      else if(mf.date_part && v instanceof Date) {
        _obj[f] = v;
      }
      else {
        _obj[f] = utils.fix_guid(v);

        if(utils.is_data_obj(v) && mf.types.indexOf(v._manager.class_name) != -1) {

        }
        else {
          let mgr = this._manager.value_mgr(_obj, f, mf, false, v);
          if(mgr) {
            if(mgr instanceof EnumManager) {
              if(typeof v === 'string') {
                _obj[f] = v;
              }
              else if(!v) {
                _obj[f] = '';
              }
              else if(typeof v === 'object') {
                _obj[f] = v.ref || v.name || '';
              }

            }
            else if(v && v.presentation) {
              if(v.type && !(v instanceof DataObj)) {
                delete v.type;
              }
              mgr.create(v);
            }
            else if(!utils.is_data_mgr(mgr)) {
              _obj[f] = utils.fetch_type(v, mgr);
            }
          }
          else {
            if(typeof v !== 'object') {
              _obj[f] = v;
            }
          }
        }
      }
    }
    else if(mf.date_part) {
      _obj[f] = utils.fix_date(v, !mf.hasOwnProperty('str_len'));
    }
    else if(mf.digits) {
      _obj[f] = utils.fix_number(v, !mf.hasOwnProperty('str_len'));
    }
    else if(mf.types[0] == 'boolean') {
      _obj[f] = utils.fix_boolean(v);
    }
    else {
      _obj[f] = v;
    }

  }

  __notify(f) {
    const {_data, _manager} = this;
    if(_data && !_data._loading) {
      _data._modified = true;
      _manager.emit_async('update', this, {[f]: this._obj[f]});
    }
  }

  /**
   * Устанваливает значение, если оно отличается от предыдущего
   * @param f
   * @param v
   * @private
   */
  _setter(f, v) {
    if(this._obj[f] != v) {
      this.__notify(f);
      this.__setter(f, v);
    }
  }

  /**
   * Получает (при необходимости - конструирует) табличную часть
   * @param f {String} - имя табчасти
   * @return {TabularSection}
   * @private
   */
  _getter_ts(f) {
    const {_ts_} = this._data;
    return _ts_[f] || (_ts_[f] = new TabularSection(f, this));
  }

  _setter_ts(f, v) {
    const ts = this._getter_ts(f);
    ts instanceof TabularSection && Array.isArray(v) && ts.load(v);
  }

  /**
   * ### valueOf
   * для операций сравнения возвращаем guid
   */
  valueOf() {
    return this.ref;
  }

  /**
   * ### toJSON
   * для сериализации возвращаем внутренний _obj
   */
  toJSON() {
    return this._obj;
  }

  /**
   * ### toString
   * для строкового представления используем
   */
  toString() {
    return this.presentation;
  }

  /**
   * Метаданные текущего объекта
   * @method _metadata
   * @for DataObj
   * @param field_name
   * @type Object
   * @final
   */
  _metadata(field_name) {
    return this._manager.metadata(field_name);
  }

  /**
   * Пометка удаления
   * @property _deleted
   * @for DataObj
   * @type Boolean
   */
  get _deleted() {
    return !!this._obj._deleted;
  }
  set _deleted(v) {
    this._obj._deleted = !!v;
  }

  /**
   * ### Ревизия
   * Eё устанваливает адаптер при чтении и записи
   * @property _rev
   * @for DataObj
   * @type Boolean
   */
  get _rev() {
    return this._obj._rev || '';
  }
  set _rev(v) {
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
   * @method is_new
   * @for DataObj
   * @return {boolean}
   */
  is_new() {
    return !this._data || this._data._is_new;
  }

  /**
   * Метод для ручной установки признака _прочитан_ (не новый)
   */
  _set_loaded(ref) {
    this._manager.push(this, ref);
    Object.assign(this._data, {
      _modified: false,
      _is_new: false,
      _loading: false,
    });
    return this;
  }

  /**
   * Установить пометку удаления
   * @method mark_deleted
   * @for DataObj
   * @param deleted {Boolean}
   */
  mark_deleted(deleted) {
    this._obj._deleted = !!deleted;
    return this.save();
  }

  get class_name() {
    return this._manager.class_name;
  }
  set class_name(v) {
    return this._obj.class_name = v;
  }

  /**
   * Проверяет, является ли ссылка объекта пустой
   * @method empty
   * @return {boolean} - true, если ссылка пустая
   */
  empty() {
    return !this._obj || utils.is_empty_guid(this._obj.ref);
  }

  /**
   * Читает объект из внешней или внутренней датабазы асинхронно.
   * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
   * @method load
   * @for DataObj
   * @return {Promise.<DataObj>} - промис с результатом выполнения операции
   * @async
   */
  load() {
    const {_data} = this;
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
          resolve(_data._loading ? this.load() : this);
        }, 1000);
      });
    }
    else {
      _data._loading = true;
      return this._manager.adapter.load_obj(this)
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
    const {_data} = this;
    _data._saving_trans = true;
    return Promise.resolve()
      .then(() => this.before_save())
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
          _data._saving_trans = false;
          return this;
        };


        // если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
        if(before_save_res === false) {
          return Promise.reject(reset_modified());
        }

        // этот код выполняем в случае ошибки незаполненных реквизитов
        const reset_mandatory = (msg) => {
          before_save_res = false;
          reset_modified();
          md.emit('alert', msg);
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
          if(this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) {
            if(utils.blank.date == this.date) {
              this.date = new Date();
            }
            if(!this.number_doc) {
              numerator = this.new_number_doc();
            }
          }
          else {
            if(!this.id) {
              numerator = this.new_number_doc();
            }
          }
        }

        // если не указаны обязательные реквизиты...
        const {fields, tabular_sections} = this._metadata();
        const {msg, md, cch: {properties}, classes} = this._manager._owner.$p;
        const flds = Object.assign({}, fields);
        if(this._manager instanceof classes.CatManager) {
          flds.name = this._metadata('name') || {};
          flds.id = this._metadata('id') || {};
        }
        for (const mf in flds) {
          if (flds[mf] && flds[mf].mandatory && (!this._obj[mf] || this._obj[mf] === utils.blank.guid)) {
            return reset_mandatory({
              obj: this,
              title: msg.mandatory_title,
              type: 'alert-error',
              text: msg.mandatory_field.replace('%1', this._metadata(mf).synonym)
            });
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
                if(utils.is_data_obj(value) ? value.empty() : !value) {
                  return reset_mandatory({
                    obj: this,
                    row: row._row || row,
                    title: msg.mandatory_title,
                    type: 'alert-error',
                    text: msg.mandatory_field.replace('%1', property.caption || property.name)
                  });
                }
              }
            }
          }
        }

        // в зависимости от типа кеширования, получаем saver и сохраняем объект во внешней базе
        return (numerator || Promise.resolve())
          .then(() => this._manager.adapter.save_obj(this, {post, operational, attachments }))
          // и выполняем обработку после записи
          .then(() => this.after_save())
          .then(reset_modified)
          .catch((err) => {
            reset_modified();
            throw err;
          });

      });

  }


  /**
   * ### Возвращает присоединенный объект или файл
   * @method get_attachment
   * @for DataObj
   * @param att_id {String} - идентификатор (имя) вложения
   */
  get_attachment(att_id) {
    const {_manager, ref} = this;
    return _manager.adapter.get_attachment(_manager, ref, att_id);
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
    const {_manager, ref, _attachments} = this;
    return _manager.save_attachment(ref, att_id, attachment, type)
      .then((att) => {
        if(!_attachments) {
          this._attachments = {};
        }
        if(!this._attachments[att_id] || !att.stub) {
          this._attachments[att_id] = att;
        }
        return att;
      });
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
    const {_manager, ref, _attachments} = this;
    return _manager.delete_attachment(ref, att_id)
      .then((att) => {
        if(_attachments) {
          delete _attachments[att_id];
        }
        return att;
      });
  }

  /**
   * Применяет атрибуты к объекту
   * @param attr
   * @private
   */
  _mixin(attr, include, exclude, silent) {
    if(Object.isFrozen(this)) {
      return;
    }
    if(attr && typeof attr == 'object') {
      const {_not_set_loaded} = attr;
      _not_set_loaded && delete attr._not_set_loaded;
      const {_data} = this;
      if(silent) {
        if(_data._loading) {
          silent = false;
        }
        _data._loading = true;
      }
      utils._mixin(this, attr, include, exclude);
      if(silent) {
        _data._loading = false;
      }
      if(!_not_set_loaded && (_data._loading || (!utils.is_empty_guid(this.ref) && (attr.id || attr.name || attr.number_doc)))) {
        this._set_loaded(this.ref);
      }
    }
  }

  /**
   * ### Приводит строки дат к датам, ссылки к ссылкам
   * @param obj
   * @param _obj
   * @param fields
   */
  static fix_collection(obj, _obj, fields) {
    for (const fld in fields) {
      if(_obj[fld]) {
        let {type, choice_type} = fields[fld];
        if(choice_type && choice_type.path){
          const prop = obj[choice_type.path[choice_type.path.length - 1]];
          if(prop && prop.type) {
            type = prop.type;
          }
        }
        if (type.is_ref && typeof _obj[fld] === 'object') {
          if(!(fld === 'type' && obj.class_name && obj.class_name.indexOf('cch.') === 0)) {
            _obj[fld] = utils.fix_guid(_obj[fld], false);
          }
        }
        else if (type.date_part && typeof _obj[fld] === 'string') {
          _obj[fld] = utils.fix_date(_obj[fld], type.types.length === 1);
        }
      }
    }
  }

  /**
   * ### Приводит строки дат к датам, ссылки к ссылкам в реквизитах объекта, создаёт табчасти
   */
  _fix_plain() {
    const {_obj, _manager} = this;
    const {fields, tabular_sections, hierarchical, has_owners} = this._metadata();

    // корректируем реквизиты
    DataObj.fix_collection(this, _obj, fields);

    // корректируем системные реквизиты
    if(hierarchical || has_owners) {
      const sys_fields = {};
      if(hierarchical) {
        sys_fields.parent = this._metadata('parent');
      }
      if(has_owners) {
        sys_fields.owner = this._metadata('owner');
      }
      DataObj.fix_collection(this, _obj, sys_fields);
    }

    for (const ts in tabular_sections) {
      if(Array.isArray(_obj[ts])){
        const tabular = this[ts];
        const Constructor = _manager.obj_constructor(ts, true);
        const {fields} = tabular_sections[ts];
        for(let i = 0; i < _obj[ts].length; i++) {
          const row = _obj[ts][i];
          const _row = new Constructor(tabular, row);
          row.row = i + 1;
          Object.defineProperty(row, '_row', {value: _row});
          DataObj.fix_collection(_row, row, fields);
        }
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

  /**
   * ### После создания
   * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
   * или заполнить объект на основании данных связанного объекта
   *
   * @event AFTER_CREATE
   */
  after_create() {
    return this;
  }

  /**
   * ### После чтения объекта с сервера
   * Имеет смысл для объектов с типом кеширования ("doc", "remote", "meta", "e1cib").
   * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
   *
   * @event AFTER_LOAD
   */
  after_load() {
    return this;
  }

  /**
   * ### Перед записью
   * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
   * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
   *
   * @event BEFORE_SAVE
   */
  before_save() {
    return this;
  }

  /**
   * ### После записи
   *
   * @event AFTER_SAVE
   */
  after_save() {
    return this;
  }

  /**
   * ### При изменении реквизита шапки или табличной части
   *
   * @event VALUE_CHANGE
   */
  value_change(f, mf, v) {
    return this;
  }

  /**
   * ### При добавлении строки табличной части
   *
   * @event ADD_ROW
   */
  add_row(row) {
    return this;
  }

  /**
   * ### При удалении строки табличной части
   *
   * @event DEL_ROW
   */
  del_row(row) {
    return this;
  }

  /**
   * ### После удаления строки табличной части
   *
   * @event AFTER_DEL_ROW
   */
  after_del_row(name) {
    return this;
  }

}

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
Object.defineProperty(DataObj.prototype, 'ref', {
  get: function () {
    return this._obj ? this._obj.ref : utils.blank.guid;
  },
  set: function (v) {
    this._obj.ref = utils.fix_guid(v);
  },
  enumerable: true,
  configurable: true
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;
TabularSectionRow.prototype.__setter = DataObj.prototype.__setter;


/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
export class CatObj extends DataObj {

  constructor(attr, manager, loading) {

    const direct = loading && attr && utils.is_guid(attr.ref);

    // выполняем конструктор родительского объекта
    super(attr, manager, loading, direct);

    if(direct) {
      this._fix_plain();
    }
    else {
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
    return this.name || this.id || this._presentation || '';
  }
  set presentation(v) {
    if(v) {
      this._presentation = String(v);
    }
  }

  /**
   * ### Код элемента справочника
   * @property id
   * @type String|Number
   */
  get id() {
    return this._obj.id || '';
  }
  set id(v) {
    this.__notify('id');
    this._obj.id = v;
  }

  /**
   * ### Наименование элемента справочника
   * @property name
   * @type String
   */
  get name() {
    return this._obj.name || '';
  }
  set name(v) {
    this.__notify('name');
    this._obj.name = String(v);
  }


  /**
   * ### Дети
   * Возвращает массив элементов, находящихся в иерархии текущего
   */
  _children(folders) {
    const res = [];
    this._manager.forEach((o) => {
      if(o != this && (!folders || o.is_folder) && o._hierarchy(this)) {
        res.push(o);
      }
    });
    return res;
  }

  /**
   * ### Родители
   * Возвращает массив родителей, в иерархии которых находится текущий элемент
   * @private
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
   * ### В иерархии
   * Выясняет, находится ли текущий объект в указанной группе
   *
   * @param group {Object|Array} - папка или массив папок
   *
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
    return group == utils.blank.guid;
  }


}

/**
 * mixin свойств дата и номер документа к базовому классу
 * @param superclass
 * @constructor
 */
export const NumberDocAndDate = (superclass) => class extends superclass {

  /**
   * Номер документа
   * @property number_doc
   * @type {String|Number}
   */
  get number_doc() {
    return this._obj.number_doc || '';
  }

  set number_doc(v) {
    this.__notify('number_doc');
    this._obj.number_doc = v;
  }

  /**
   * Дата документа
   * @property date
   * @type {Date}
   */
  get date() {
    return this._obj.date instanceof Date ? this._obj.date : utils.blank.date;
  }

  set date(v) {
    this.__notify('date');
    this._obj.date = utils.fix_date(v, true);
  }

};

/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
export class DocObj extends NumberDocAndDate(DataObj) {

  constructor(attr, manager, loading) {

    const direct = loading && attr && utils.is_guid(attr.ref);

    // выполняем конструктор родительского объекта
    super(attr, manager, loading, direct);

    if(direct) {
      this._fix_plain(this);
    }
    else {
      this._mixin(attr);
    }

  }

  /**
   * Представление объекта
   * @property presentation
   * @for DocObj
   * @type String
   */
  get presentation() {
    const meta = this._metadata();
    const {number_doc, date, posted, _modified} = this;
    return number_doc ?
      `${meta.obj_presentation || meta.synonym}  №${number_doc} от ${moment(date).format(moment._masks.date_time)} (${posted ? '' : 'не '}проведен)${_modified ? ' *' : ''}`
      :
      `${meta.obj_presentation || meta.synonym} ${moment(date).format(moment._masks.date_time)} (${posted ? '' : 'не '}проведен)${_modified ? ' *' : ''}`;
  }

  set presentation(v) {
    if(v) {
      this._presentation = String(v);
    }
  }

  /**
   * Признак проведения
   * @property posted
   * @type {Boolean}
   */
  get posted() {
    return this._obj.posted || false;
  }

  set posted(v) {
    this.__notify('posted');
    this._obj.posted = utils.fix_boolean(v);
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
          attr[fld] = utils.fetch_type('', fields[fld].type);
        }
      }
      for (const fld in tabular_sections) {
        if(!attr[fld]) {
          attr[fld] = [];
        }
      }
    }

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
export class TaskObj extends NumberDocAndDate(CatObj) {

}


/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
export class BusinessProcessObj extends NumberDocAndDate(CatObj) {

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

    // выполняем конструктор родительского объекта
    super(attr, manager, loading);

    if(attr && typeof attr == 'object') {
      const {_obj} = this;
      if(!_obj.ref && _obj.name) {
        _obj.ref = _obj.name;
      }
      _obj !== attr && utils._mixin(this, attr);
    }

  }

  /**
   * Порядок элемента перечисления
   * @property order
   * @for EnumObj
   * @type Number
   */
  get order() {
    return this._obj.sequence;
  }

  /**
   * @type Number
   */
  set order(v) {
    this._obj.sequence = parseInt(v);
  }


  /**
   * Наименование элемента перечисления
   * @property name
   * @for EnumObj
   * @type String
   */
  get name() {
    return this._obj.ref;
  }

  /**
   * @type String
   */
  set name(v) {
    this._obj.ref = String(v);
  }

  /**
   * Синоним элемента перечисления
   * @property synonym
   * @for EnumObj
   * @type String
   */
  get synonym() {
    return this._obj.synonym || '';
  }

  /**
   * @type String
   */
  set synonym(v) {
    this._obj.synonym = String(v);
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
    return !this.ref || this.ref == '_';
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
      utils._mixin(this, attr);
      if(tref) {
        attr.ref = tref;
      }
    }

    for (var check in manager.metadata().dimensions) {
      if(!attr.hasOwnProperty(check) && attr.ref) {
        var keys = attr.ref.split('¶');
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
    return this._manager.get_ref(this);
  }

  set ref(v) {

  }

  get presentation() {
    return this._metadata().obj_presentation || this._metadata().synonym;
  }
}



