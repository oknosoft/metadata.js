import {
  EnumManager, CatManager, DocManager, InfoRegManager, AccumRegManager,
  DataProcessorsManager, ChartOfCharacteristicManager} from './mngrs';
import {CatObj, DocObj, DataProcessorObj, RegisterRow} from './objs';
import {own, alias} from './meta/symbols';
import {OwnerObj} from './meta/metaObjs';

class ManagersCollection extends OwnerObj {

  constructor(owner, name, Manager, Obj, dir) {
    super(owner, name);
    this.Manager = Manager;
    this.Obj = Obj;
    this.dir = dir;
  }

  toString() {
    return this[own].msg.meta_classes[this[alias]];
  }

  /**
   * toJSON
   * для сериализации возвращаем представление
   */
  toJSON() {
    return {type: this.constructor.name, name: this.toString()};
  }

  create(name) {
    const className = this[alias] + '.' + name;
    const Manager = this[own].classes[this.Manager.objConstructor(className) + 'Manager'];
    this[name] = new (Manager || this.Manager)(this, className);
    return this[name];
  }

  forEach(cb) {
    for(const el in this) {
      if(this[el] instanceof this.Manager) {
        cb(this[el]);
      }
    }
  }
}

/**
 * @summary Коллекция менеджеров перечислений
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link EnumManager}
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
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link CatManager}
 */
class Catalogs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cat', CatManager, CatObj, 'catalogs');
  }
}

/**
 * @summary Коллекция менеджеров документов
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link DocManager}
 *
 */
class Documents extends ManagersCollection {
  constructor(owner) {
    super(owner, 'doc', DocManager, DocObj, 'documents');
  }
}

/**
 * @summary Коллекция менеджеров регистров сведений
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link InfoRegManager}
 *
 */
class InfoRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'ireg', InfoRegManager, RegisterRow, 'ireg');
  }
}

/**
 * @summary Коллекция менеджеров регистров накопления
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link RegisterManager}
 *
 */
class AccumRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'areg', AccumRegManager, RegisterRow, 'areg');
  }
}

/**
 * @summary Коллекция менеджеров обработок
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link DataProcessorsManager}
 *
 */
class DataProcessors extends ManagersCollection {
  constructor(owner) {
    super(owner, 'dp', DataProcessorsManager, DataProcessorObj, 'dataprocessors');
  }
}

/**
 * @summary Коллекция менеджеров отчетов
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link DataProcessorsManager}
 *
 */
class Reports extends ManagersCollection {
  constructor(owner) {
    super(owner, 'rep', DataProcessorsManager, DataProcessorObj, 'reports');
  }
}


/**
 * @summary Коллекция менеджеров планов видов характеристик
 * @desc Состав коллекции определяется метаданными используемой конфигурации
 * Тип элементов коллекции: {@link ChartOfCharacteristicManager}
 *
 */
class ChartsOfCharacteristics extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cch', ChartOfCharacteristicManager, CatObj, 'chartscharacteristics');
  }
}

function mngrs(owner, meta, raw) {

  // создаём коллекции менеджеров
  Object.defineProperties(owner, {

    /**
     * Коллекция менеджеров перечислений
     * @type Enumerations
     * @memberOf MetaEngine#
     * @final
     */
    enm: {value: new Enumerations(owner)},

    /**
     * Коллекция менеджеров справочников
     * @type Catalogs
     * @memberOf MetaEngine#
     * @final
     */
    cat: {value: new Catalogs(owner)},

    /**
     * Коллекция менеджеров документов
     * @type Documents
     * @memberOf MetaEngine#
     * @final
     */
    doc: {value: new Documents(owner)},

    /**
     * Коллекция менеджеров регистров сведений
     * @type InfoRegs
     * @memberOf MetaEngine#
     * @final
     */
    ireg: {value: new InfoRegs(owner)},

    /**
     * Коллекция менеджеров регистров накопления
     * @type AccumRegs
     * @memberOf MetaEngine#
     * @final
     */
    areg: {value: new AccumRegs(owner)},

    /**
     * Коллекция менеджеров обработок
     * @type DataProcessors
     * @memberOf MetaEngine#
     * @final
     */
    dp: {value: new DataProcessors(owner)},

    /**
     * Коллекция менеджеров отчетов
     * @type Reports
     * @memberOf MetaEngine#
     * @final
     */
    rep: {value: new Reports(owner)},

    /**
     * Коллекция менеджеров планов видов характеристик
     * @type ChartsOfCharacteristics
     * @memberOf MetaEngine#
     * @final
     */
    cch: {value: new ChartsOfCharacteristics(owner)},

  });

}

export default mngrs;
