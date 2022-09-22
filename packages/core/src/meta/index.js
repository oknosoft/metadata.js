/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * @module  metadata
 * @submodule meta_meta
 */

import MetaEventEmitter from './emitter';
import utils from '../utils';
import {DataManager} from '../mngrs';
import mngrcollections from '../mngrcollections';
import {sys, sys_fields} from './system';

/**
 * Описание метаданных объекта
 * Не путать с виртуальным справочником CatMeta_objs
 * @class MetaObj
 */
class MetaObj {
  constructor(raw) {
    if(Array.isArray(raw)) {
      this.values = [];
      for(const row of raw) {
        if(typeof row.order === 'number' && row.name) {
          this.values.push(row);
        }
        else {
          for(const fld in row) {
            this[fld] = row[fld];
          }
        }
      }
    }
    else {
      Object.assign(this, raw);
    }
  }
}

/**
 * ### Описание метаданных поля
 * Не путать с виртуальным справочником CatMeta_fields
 * @class MetaField
 */
class MetaField {

}

/**
 * Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 *
 * @class Meta
 * @static
 * @menuorder 02
 * @tooltip Описание метаданных
 */
class Meta extends MetaEventEmitter {

  /**
   * Хранилище объектов описания метаданных
   * @type {Object}
   */
  #m = {
    enm: {},
    cat: {},
    doc: {},
    ireg: {},
    areg: {},
    dp: {},
    rep: {},
    cch: {},
    cacc: {},
    bp: {},
    tsk: {}
  };

  /**
   * Индекс по id и className
   * @type Object
   */
  #index = {
    meta: {},
    mgrs: {},
  };

  /**
   * Служебные поля, которые сохраняем при прочистке
   * @type {Array.<string>}
   */
  static sys_fields = sys_fields;

  /**
   * Системные метаданные
   * Это свойство могут дополнять плагины и оно используется в prebuild.js
   * @type {Array}
   * @private
   */
  static _sys = sys;

  /**
   * Пробрасываем конструктор MetaObj наружу
   */
  static Obj = MetaObj;

  /**
   * Пробрасываем конструктор MetaField наружу
   */
  static Field = MetaField;

  constructor(owner) {
    super(owner);
    // создаём конструкторы менеджеров данных
    mngrcollections(owner);
  }

  /**
   * Инициализирует метаданные
   * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
   *
   * @param [raw] {Object} - сырой объект с описанием метаданных
   */
  init(raw) {
    for(const patch of Meta._sys) {
      utils._patch(raw, patch);
    }
    for(const area of Object.keys(raw)) {
      if(this.#m[area]) {
        for(const el in raw[area]) {
          const obj = new MetaObj(raw[area][el]);
          this.#m[area][el] = obj;
          this.#index.meta[`${area}.${el}`] = obj;
          if(obj.id) {
            this.#index.meta[obj.id] = obj;
          }
          delete raw[area][el];
        };
      }
      else {
        this.#m[area] = raw[area];
        delete raw[area];
      }
    }
    return this;
  }

  /**
   * ### Возвращает описание объекта метаданных
   *
   * @method get
   * @param type {String|DataManager} - например, "doc.calc_order"
   * @param [field_name] {String} - имя поля или табчасти или путь к полю табчасти
   * @return {MetaObj}
   */
  get(type, field_name) {
    const np = type instanceof DataManager ? [type._owner.name, type.name] : type.split('.');
    const np0 = this._m[np[0]];
    if(!np0) {
      return;
    }
    const _meta = np0[np[1]];
    if(!field_name) {
      return _meta;
    }
    else if(_meta && _meta.fields[field_name]) {
      return _meta.fields[field_name];
    }
    else if(_meta && _meta.tabular_sections && _meta.tabular_sections[field_name]) {
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
      is_doc = 'doc,tsk,bp'.includes(np[0]),
      is_cat = 'cat,cch,cacc,tsk'.includes(np[0]);

    if(is_doc && field_name == 'number_doc' && _meta.code_length) {
      res.synonym = 'Номер';
      res.tooltip = 'Номер документа';
      res.type.str_len = 11;
    }
    else if(is_doc && field_name == 'date') {
      res.synonym = 'Дата';
      res.tooltip = 'Дата документа';
      res.type.date_part = 'date_time';
      res.type.types[0] = 'date';
    }
    else if(is_doc && field_name == 'posted') {
      res.synonym = 'Проведен';
      res.type.types[0] = 'boolean';
    }
    else if(is_cat && field_name == 'id' && _meta.code_length) {
      res.synonym = 'Код';
      res.mandatory = true;
    }
    else if(is_cat && field_name == 'name') {
      res.synonym = 'Наименование';
      res.mandatory = _meta.main_presentation_name;
    }
    else if(field_name == '_area') {
      res.synonym = 'Область';
    }
    else if(field_name == 'presentation') {
      res.synonym = 'Представление';
    }
    else if(field_name == '_deleted') {
      res.synonym = 'Пометка удаления';
      res.type.types[0] = 'boolean';
    }
    else if(field_name == 'is_folder') {
      res.synonym = 'Это группа';
      res.type.types[0] = 'boolean';
    }
    else if(field_name == 'ref') {
      res.synonym = 'Ссылка';
      res.type.is_ref = true;
      if(type instanceof DataManager) {
        res.type._mgr = type;
        res.type.types[0] = `${type._owner.name}.${type.name}`;
      }
      else {
        res.type.types[0] = type;
      }
    }
    else {
      return;
    }

    return res;
  }

  /**
   * ### Возвращает структуру имён объектов метаданных конфигурации
   *
   * @method classes
   * @return {Object}
   */
  classes() {
    const res = {};
    for (const i in this._m) {
      res[i] = [];
      for (const j in this._m[i])
        res[i].push(j);
    }
    return res;
  }

  /**
   * ### Возвращает массив используемых баз
   *
   * @method bases
   * @return {Array}
   */
  bases() {
    const res = {};
    const {_m} = this;
    for (let i in _m) {
      for (let j in _m[i]) {
        if(_m[i][j].cachable) {
          let _name = _m[i][j].cachable.replace('_remote', '').replace('_ram', '').replace('_doc', '');
          if(_name != 'meta' && _name != 'templates' && _name != 'e1cib' && !res[_name]) {
            res[_name] = _name;
          }
        }
      }
    }
    return Object.keys(res);
  }

  /**
   * ### Возвращает англоязычный синоним строки
   * TODO: перенести этот метод в плагин
   *
   * @method syns_js
   * @param v {String}
   * @return {String}
   */
  syns_js(v) {
    const synJS = {
      DeletionMark: '_deleted',
      Description: 'name',
      DataVersion: 'data_version',    // todo: не сохранять это поле в pouchdb
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

  /**
   * ### Возвращает русскоязычный синоним строки
   * TODO: перенести этот метод в плагин
   *
   * @method syns_1с
   * @param v {String}
   * @return {String}
   */
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

  /**
   * ### Возвращает список доступных печатных форм
   * @method printing_plates
   * @return {Object}
   */
  printing_plates(pp) {
    if(pp) {
      for (const i in pp.doc) {
        this._m.doc[i].printing_plates = pp.doc[i];
      }
    }
  }

  /**
   * Возвращает менеджер объекта по имени или идентификатору класса
   * @param id {String}
   * @return {DataManager|undefined}
   * @private
   */
  find_mgr(id) {
    return this.#index.mgrs[id];
  }

  /**
   * ### Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
   * @method create_tables
   */
  create_tables(callback, attr) {

    const {owner} = this;
    const data_names = [];
    const managers = this.classes();

    let cstep = 0, create = (attr && attr.postgres) ? '' : 'USE md; ';

    function on_table_created() {

      cstep--;
      if(cstep == 0) {
        if(callback) {
          callback(create);
        }
        else {
          console.log(create);
        }
      }
      else {
        iteration();
      }
    }

    function iteration() {
      const data = data_names[cstep - 1];
      if(data.class[data.name]) {
        create += data.class[data.name].get_sql_struct(attr) + '; ';
      }
      on_table_created();
    }

    // TODO переписать на промисах и генераторах и перекинуть в синкер
    for (let mgr of 'enm,cch,cacc,cat,bp,tsk,doc,ireg,areg'.split(',')) {
      for (let className in managers[mgr]) {
        data_names.push({'class': owner[mgr], 'name': managers[mgr][className]});
      }
    }
    cstep = data_names.length;

    iteration();
  }

  /**
   * ### Возвращает тип поля sql для типа данных
   *
   * @method sql_type
   * @param mgr {DataManager}
   * @param f {String}
   * @param mf {Object} - описание метаданных поля
   * @param pg {Boolean} - использовать синтаксис postgreSQL
   * @return {*}
   */
  sql_type(mgr, f, mf, pg) {
    var sql;
    if((f == 'type' && mgr.table_name == 'cch_properties') || (f == 'svg' && mgr.table_name == 'cat_production_params')) {
      sql = ' JSON';
    }
    else if(mf.is_ref || mf.types.indexOf('guid') != -1) {
      if(!pg) {
        sql = ' CHAR';
      }
      else if(mf.types.every((v) => v.indexOf('enm.') == 0)) {
        sql = ' character varying(100)';
      }
      else if(!mf.hasOwnProperty('str_len')) {
        sql = ' uuid';
      }
      else {
        sql = ' character varying(' + Math.max(36, mf.str_len) + ')';
      }

    }
    else if(mf.hasOwnProperty('str_len')) {
      sql = pg ? (mf.str_len ? ' character varying(' + mf.str_len + ')' : ' text') : ' CHAR';
    }
    else if(mf.date_part) {
      if(!pg || mf.date_part == 'date') {
        sql = ' Date';
      }
      else if(mf.date_part == 'date_time') {
        sql = ' timestamp with time zone';
      }
      else {
        sql = ' time without time zone';
      }
    }
    else if(mf.hasOwnProperty('digits')) {
      if(mf.fraction == 0) {
        sql = pg ? (mf.digits < 7 ? ' integer' : ' bigint') : ' INT';
      }
      else {
        sql = pg ? (' numeric(' + mf.digits + ',' + mf.fraction + ')') : ' FLOAT';
      }

    }
    else if(mf.types.indexOf('boolean') != -1) {
      sql = ' BOOLEAN';
    }
    else if(mf.types.indexOf('json') != -1) {
      sql = ' JSON';
    }
    else {
      sql = pg ? ' character varying(255)' : ' CHAR';
    }

    return sql;
  }

  /**
   * ### Заключает имя поля в аппострофы
   * @method sql_mask
   * @param f
   * @param t
   * @return {string}
   * @private
   */
  sql_mask(f, t) {
    //var mask_names = ["delete", "set", "value", "json", "primary", "content"];
    return ', ' + (t ? '_t_.' : '') + ('`' + f + '`');
  }

  /**
   * ### Возвращает структуру для инициализации таблицы на форме
   * TODO: перенести этот метод в плагин
   *
   * @method ts_captions
   * @param className
   * @param ts_name
   * @param source
   * @return {boolean}
   */
  ts_captions(className, ts_name, source) {
    if(!source) {
      source = {};
    }

    var mts = this.get(className).tabular_sections[ts_name],
      mfrm = this.get(className).form,
      fields = mts ? mts.fields : {}, mf;

    // если имеются метаданные формы, используем их
    if(mfrm && mfrm.obj) {

      if(!mfrm.obj.tabular_sections[ts_name]) {
        return;
      }

      utils._mixin(source, mfrm.obj.tabular_sections[ts_name]);

    }
    else {

      if(ts_name === 'contact_information') {
        fields = {type: '', kind: '', presentation: ''};
      }

      source.fields = ['row'];
      source.headers = '№';
      source.widths = '40';
      source.min_widths = '';
      source.aligns = '';
      source.sortings = 'na';
      source.types = 'cntr';

      for (var f in fields) {
        mf = mts.fields[f];
        if(!mf.hide) {
          source.fields.push(f);
          source.headers += ',' + (mf.synonym ? mf.synonym.replace(/,/g, ' ') : f);
          source.types += ',' + this.control_by_type(mf.type);
          source.sortings += ',na';
        }
      }
    }

    return true;

  }

  /**
   * ### Возвращает имя класса по полному имени объекта метаданных 1С
   * TODO: перенести этот метод в плагин
   *
   * @method className_from_1c
   * @param name
   */
  className_from_1c(name) {

    var pn = name.split('.');
    if(pn.length == 1) {
      return 'enm.' + name;
    }
    else if(pn[0] == 'Перечисление') {
      name = 'enm.';
    }
    else if(pn[0] == 'Справочник') {
      name = 'cat.';
    }
    else if(pn[0] == 'Документ') {
      name = 'doc.';
    }
    else if(pn[0] == 'РегистрСведений') {
      name = 'ireg.';
    }
    else if(pn[0] == 'РегистрНакопления') {
      name = 'areg.';
    }
    else if(pn[0] == 'РегистрБухгалтерии') {
      name = 'accreg.';
    }
    else if(pn[0] == 'ПланВидовХарактеристик') {
      name = 'cch.';
    }
    else if(pn[0] == 'ПланСчетов') {
      name = 'cacc.';
    }
    else if(pn[0] == 'Обработка') {
      name = 'dp.';
    }
    else if(pn[0] == 'Отчет') {
      name = 'rep.';
    }

    return name + this.syns_js(pn[1]);

  }

  /**
   * ### Возвращает полное именя объекта метаданных 1С по имени класса metadata
   * TODO: перенести этот метод в плагин
   *
   * @method className_to_1c
   * @param name
   */
  className_to_1c(name) {

    var pn = name.split('.');
    if(pn.length == 1) {
      return 'Перечисление.' + name;
    }
    else if(pn[0] == 'enm') {
      name = 'Перечисление.';
    }
    else if(pn[0] == 'cat') {
      name = 'Справочник.';
    }
    else if(pn[0] == 'doc') {
      name = 'Документ.';
    }
    else if(pn[0] == 'ireg') {
      name = 'РегистрСведений.';
    }
    else if(pn[0] == 'areg') {
      name = 'РегистрНакопления.';
    }
    else if(pn[0] == 'accreg') {
      name = 'РегистрБухгалтерии.';
    }
    else if(pn[0] == 'cch') {
      name = 'ПланВидовХарактеристик.';
    }
    else if(pn[0] == 'cacc') {
      name = 'ПланСчетов.';
    }
    else if(pn[0] == 'dp') {
      name = 'Обработка.';
    }
    else if(pn[0] == 'rep') {
      name = 'Отчет.';
    }

    return name + this.syns_1с(pn[1]);

  }

}

export default Meta;

