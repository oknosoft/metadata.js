/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * @module  metadata
 * @submodule meta_meta
 */

import MetaEventEmitter from './emitter';
import {DataManager} from '../mngrs';
import mngrcollections from '../mngrcollections';
import {sys, sysFields} from './system';
import {own} from './symbols';
import {TypeDef, MetaObj, MetaField, MetaFields, MetaTabulars, OwnerObj} from './classes';


/**
 * Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 */
class Meta extends MetaEventEmitter {

  /**
   * Хранилище объектов описания метаданных
   * @type {Object}
   */
  #m = {};

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
  static sysFields = sysFields;

  /**
   * Системные метаданные
   * Это свойство могут дополнять плагины и оно используется в prebuild.js
   * @type {Array}
   * @private
   */
  static _sys = sys;

  /**
   * @param {MetaEngine} owner
   */
  constructor(owner) {
    super(owner);
    // создаём конструкторы менеджеров данных
    mngrcollections(owner, this, this.#m);
  }

  /**
   * Инициализирует метаданные
   * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
   *
   * @param [raw] {Object} - сырой объект с описанием метаданных
   */
  init(raw) {
    const owner = this[own];
    for(const patch of Meta._sys) {
      owner.utils._patch(raw, patch);
    }
    for(const area of Object.keys(raw)) {
      if(owner[area]) {
        // создаём поля метаданных верхнего уровня
        const curr = new OwnerObj(this, area);
        this.#m[area] = curr;
        // и собственно, метаданные на соответствующих уровнях
        for(const el in raw[area]) {
          const obj = new MetaObj(curr, el, raw[area][el]);
          curr[el] = obj;
          const mgr = owner[area][el];
          const {meta, mgrs} = this.#index;
          meta[`${area}.${el}`] = obj;
          mgrs[`${area}.${el}`] = mgr;
          if(obj.id) {
            meta[obj.id] = obj;
            mgrs[obj.id] = mgr;
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
   * Возвращает описание объекта метаданных
   *
   * @param {String|DataManager} type - например, "doc.calc_order"
   * @param {String} [field] - имя поля или табчасти или путь к полю табчасти
   * @return {MetaObj}
   */
  get(type, field) {
    const key = type instanceof DataManager ? type.className : type;
    const meta = this.#index.meta[key];
    if(!meta) {
      throw new Error(`Unknown meta ${type}`);
    }
    return meta.get(field);
  }

  /**
   * @summary Возвращает менеджер объекта по имени или идентификатору класса
   * @param id {String}
   * @return {DataManager|undefined}
   * @private
   */
  mgr(id) {
    return this.#index.mgrs[id];
  }

  /**
   * @summary Возвращает структуру имён объектов метаданных конфигурации
   *
   * @type {Object}
   */
  get classes() {
    const res = {};
    for (const area in this.#m) {
      res[area] = Object.keys(this.#m[area]);
    }
    return res;
  }

  /**
   * @summary Возвращает массив используемых баз (типов кеширования)
   *
   * @type {Array.<String>}
   */
  get bases() {
    const res = new Set();
    const _m = this.#m;
    for (let i in _m) {
      for (let j in _m[i]) {
        if(_m[i][j].cachable) {
          res.add(_m[i][j].cachable.replace(/_.*/, ''));
        }
      }
    }
    return Array.from(res);
  }

  /**
   * @summary Возвращает список доступных печатных форм
   * @method printingPlates
   * @return {Object}
   */
  printingPlates(pp) {
    if(pp) {
      for (const i in pp.doc) {
        this.#m.doc[i].printing_plates = pp.doc[i];
      }
    }
  }

  /**
   * Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
   * @method createTables
   */
  createTables(callback, attr) {

    const owner = this[own];
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
    for (let mgr in managers) {
      for (let className in managers[mgr]) {
        data_names.push({'class': owner[mgr], 'name': managers[mgr][className]});
      }
    }
    cstep = data_names.length;

    iteration();
  }

  /**
   * Возвращает тип поля sql для типа данных
   *
   * @param mgr {DataManager}
   * @param f {String}
   * @param mf {Object} - описание метаданных поля
   * @param pg {Boolean} - использовать синтаксис postgreSQL
   * @return {*}
   */
  sqlType(mgr, f, mf, pg) {
    var sql;
    if((f == 'type' && mgr.table_name == 'cch_properties') || (f == 'svg' && mgr.table_name == 'cat_production_params')) {
      sql = ' JSON';
    }
    else if(mf.isRef || mf.types.indexOf('guid') != -1) {
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
   * @method sqlMask
   * @param f
   * @param t
   * @return {string}
   * @private
   */
  sqlMask(f, t) {
    //var mask_names = ["delete", "set", "value", "json", "primary", "content"];
    return ', ' + (t ? '_t_.' : '') + ('`' + f + '`');
  }



}

export default Meta;

