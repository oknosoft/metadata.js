
import MetaUtils from './utils';
import {JobPrm} from './jobprm';
import AppMetadata from './meta';
import msg from './i18n.ru';
import classes from './classes';
import * as symbols from './meta/symbols';
import {DataAdapters} from './adapter';


/**
 * @summary Глобальный объект metadata.js
 * @desc Обычно, создаётся на старте приложения в единственном экземпляре,
 * но при необходимости, в памяти одного процесса можно создать несколько MetaEngine
 * с разными или одинаковыми метаданными и данными
 *
 * Внутри MetaEngine, создаются коллекции менеджеров данных, внутри которых,
 * в свою очередь сами менеджеры и коллекции их data-объектов
 *
 * @example
 *   import MetaEngine from '@oknosoft/metadata';
 * // Создаём экземпляр глобальной области metadata.js
 * const $p = new MetaEngine();
 * @order 000
 */
class MetaEngine {

  static #plugins = [];

  constructor() {

    /**
     * Вспомогательные методы
     * @type MetaUtils
     * @final
     */
    this.utils = new MetaUtils(this);

    /**
     * Адаптеры для PouchDB, Postgres и т.д.
     * @type DataAdapters
     * @final
     */
    this.adapters = new DataAdapters(this);

    /**
     * Параметры работы программы
     * @type JobPrm
     * @final
     */
    this.jobPrm = new JobPrm(this);

    /**
     * Mетаданные конфигурации
     * @type AppMetadata
     * @final
     */
    this.md = new AppMetadata(this);

    // начинаем следить за ошибками
    let emitter;
    if(typeof process !== 'undefined' && process.addEventListener) {
      emitter = process;
    }
    else if(typeof window !== 'undefined' && window.addEventListener) {
      emitter = window;
    }
    if(emitter) {
      emitter.addEventListener('error', this.utils.recordLog, false);
      //emitter.addEventListener('unhandledRejection', this.recordLog, false);
    }

    // при налчии расширений, выполняем их методы инициализации
    for(const plugin of MetaEngine.#plugins) {
      plugin.call(this);
    }

  }

  get version() {
    return "3.0.1";
  }

  toString() {
    return 'Oknosoft data engine. v:' + this.version;
  }

  /**
   * @final
   */
  get msg() {
    return msg;
  }

  /**
   * дублируем ссылку на конструкторы в объекте
   * @type {Object}
   * @final
   */
  get classes() {
    return classes;
  };

  /**
   * дублируем ссылку на конструкторы в конструкторе
   * @type {Object}
   */
  static get classes() {
    return classes;
  };

  /**
   * дублируем ссылку на символы в объекте
   * @type {Object}
   * @final
   */
  get symbols() {
    return symbols;
  };

  /**
   * дублируем ссылку на символы в конструкторе
   * @type {Object}
   */
  static get symbols() {
    return symbols;
  };

  /**
   * Текущий пользователь
   * Свойство определено после загрузки метаданных и входа в программу
   * @property currentUser
   * @type CatUsers
   * @final
   */
  get currentUser() {
    let {cat, jobPrm, adapters: {user}} = this;
    if (cat?.users && !user) {
      const userName = jobPrm.get('userName');
      user = userName && (cat.users.byId(userName) || cat.users.byName(userName));
    }
    return user && !user.empty() ? user : null;
  }

  /**
   * @summary Подключает расширения metadata
   * @desc Принимает в качестве параметра объект с полями `proto` и `constructor` типа _function_
   * proto выполняется в момент подключения, constructor - после основного конструктора при создании объекта
   *
   * @param obj
   * @return {MetaEngine}
   */
  static plugin(obj) {

    if (!obj) {
      throw new TypeError('Invalid empty plugin');
    }

    if (obj.hasOwnProperty('proto')) {
      if (typeof obj.proto == 'function') {         // function style for plugins
        obj.proto(MetaEngine);
      }
      else if (typeof obj.proto == 'object') {     // object style for plugins
        for(const id in obj.proto) {
          MetaEngine.prototype[id] = obj.proto[id];
        }
      }
    }

    if (obj.hasOwnProperty('constructor')) {
      if (typeof obj.constructor != 'function') {
        throw new TypeError('Invalid plugin: constructor must be a function');
      }
      MetaEngine.#plugins.push(obj.constructor);
    }

    return MetaEngine;
  }
}


export default MetaEngine;
