import {
  EnumManager, CatManager, DocManager, InfoRegManager, AccumRegManager,
  DataProcessorsManager, ChartOfCharacteristicManager} from './mngrs';
import {own, alias} from './meta/symbols';

import {OwnerObj} from './meta/metaObjs';

class ManagersCollection extends OwnerObj {

  /**
   * Ссылка на конструктор членов
   */
  #Manager;

  constructor(owner, name, Manager) {
    super(owner, name);
    this.#Manager = Manager;
  }

  toString() {
    return this[owner].msg.meta_classes[this[alias]];
  }

  /**
   * toJSON
   * для сериализации возвращаем представление
   */
  toJSON() {
    return {type: this.constructor.name, name: this.toString()};
  }

  create(name, Constructor, freeze) {
    this[name] = new (Constructor || this.#Manager)(this, this[alias] + '.' + name);
    freeze && Object.freeze(this[name]);
  }

  forEach(cb) {
    for(const el in this) {
      if(this[el] instanceof this.#Manager) {
        cb(this[el]);
      }
    }
  }
}

/**
 * @summary Коллекция менеджеров перечислений
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
 */
class Enumerations extends ManagersCollection {
  //#Manager;
  constructor(owner) {
    super(owner, 'enm', EnumManager);
    //console.log(this.#Manager)
  }
}

/**
 * @summary Коллекция менеджеров справочников
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
 */
class Catalogs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cat', CatManager);
  }
}

/**
 * @summary Коллекция менеджеров документов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
 *
 */
class Documents extends ManagersCollection {
  constructor(owner) {
    super(owner, 'doc', DocManager);
  }
}

/**
 * @summary Коллекция менеджеров регистров сведений
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
 *
 */
class InfoRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'ireg', InfoRegManager);
  }
}

/**
 * @summary Коллекция менеджеров регистров накопления
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
 *
 */
class AccumRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'areg', AccumRegManager);
  }
}

/**
 * @summary Коллекция менеджеров обработок
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 */
class DataProcessors extends ManagersCollection {
  constructor(owner) {
    super(owner, 'dp', DataProcessorsManager);
  }
}

/**
 * @summary Коллекция менеджеров отчетов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 */
class Reports extends ManagersCollection {
  constructor(owner) {
    super(owner, 'rep', DataProcessorsManager);
  }
}


/**
 * @summary Коллекция менеджеров планов видов характеристик
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
 *
 */
class ChartsOfCharacteristics extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cch', ChartOfCharacteristicManager);
  }
}

function mngrs(owner, meta, raw) {

  // создаём коллекции менеджеров
  Object.defineProperties(owner, {

    /**
     * Коллекция менеджеров перечислений
     * @type Enumerations
     * @memberOf MetaEngine#
     */
    enm: {value: new Enumerations(owner)},

    /**
     * Коллекция менеджеров справочников
     * @type Catalogs
     * @memberOf MetaEngine#
     */
    cat: {value: new Catalogs(owner)},

    /**
     * Коллекция менеджеров документов
     * @type Documents
     * @memberOf MetaEngine#
     */
    doc: {value: new Documents(owner)},

    /**
     * Коллекция менеджеров регистров сведений
     * @type InfoRegs
     * @memberOf MetaEngine#
     */
    ireg: {value: new InfoRegs(owner)},

    /**
     * Коллекция менеджеров регистров накопления
     * @type AccumRegs
     * @memberOf MetaEngine#
     */
    areg: {value: new AccumRegs(owner)},

    /**
     * Коллекция менеджеров обработок
     * @type DataProcessors
     * @memberOf MetaEngine#
     */
    dp: {value: new DataProcessors(owner)},

    /**
     * Коллекция менеджеров отчетов
     * @type Reports
     * @memberOf MetaEngine#
     */
    rep: {value: new Reports(owner)},

    /**
     * Коллекция менеджеров планов видов характеристик
     * @type ChartsOfCharacteristics
     * @memberOf MetaEngine#
     */
    cch: {value: new ChartsOfCharacteristics(owner)},

  });

}

export default mngrs;
