import {
  EnumManager, CatManager, DocManager, InfoRegManager, AccumRegManager, DataProcessorsManager,
  ChartOfAccountManager, ChartOfCharacteristicManager, TaskManager, BusinessProcessManager
} from './mngrs';

class ManagersCollection {

  /**
   * Ссылка на владельца
   */
  #owner;

  /**
   * Ссылка на конструктор членов
   */
  #Manager;

  constructor(owner, name, Manager) {
    this.#owner = owner;
    this.#Manager = Manager;
    this.name = name;
  }

  toString() {
    return this.owner.msg.meta_classes[this.name];
  }

  get owner() {
    return this.#owner;
  }

  create(name, Constructor, freeze) {
    this[name] = new (Constructor || this.#Manager)(this, this.name + '.' + name);
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
 * ### Коллекция менеджеров перечислений
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
 *
 * @class Enumerations
 * @static
 */
class Enumerations extends ManagersCollection {
  //#Manager;
  constructor(owner) {
    super(owner, 'enm', EnumManager);
    //console.log(this.#Manager)
  }
}

/**
 * ### Коллекция менеджеров справочников
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
 *
 * @class Catalogs
 * @static
 */
class Catalogs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cat', CatManager);
  }
}

/**
 * ### Коллекция менеджеров документов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
 *
 * @class Documents
 * @static
 */
class Documents extends ManagersCollection {
  constructor(owner) {
    super(owner, 'doc', DocManager);
  }
}

/**
 * ### Коллекция менеджеров регистров сведений
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
 *
 * @class InfoRegs
 * @static
 */
class InfoRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'ireg', InfoRegManager);
  }
}

/**
 * ### Коллекция менеджеров регистров накопления
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
 *
 * @class AccumRegs
 * @static
 */
class AccumRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'areg', AccumRegManager);
  }
}

/**
 * ### Коллекция менеджеров регистров бухгалтерии
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
 *
 * @class AccountsRegs
 * @static
 */
class AccountsRegs extends ManagersCollection {
  constructor(owner) {
    super(owner, 'accreg', AccumRegManager);
  }
}

/**
 * ### Коллекция менеджеров обработок
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 * @class DataProcessors
 * @static
 */
class DataProcessors extends ManagersCollection {
  constructor(owner) {
    super(owner, 'dp', DataProcessorsManager);
  }
}

/**
 * ### Коллекция менеджеров отчетов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 * @class Reports
 * @static
 */
class Reports extends ManagersCollection {
  constructor(owner) {
    super(owner, 'rep', DataProcessorsManager);
  }
}

/**
 * ### Коллекция менеджеров планов счетов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
 *
 * @class ChartsOfAccounts
 * @static
 */
class ChartsOfAccounts extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cacc', ChartOfAccountManager);
  }
}

/**
 * ### Коллекция менеджеров планов видов характеристик
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
 *
 * @class ChartsOfCharacteristics
 * @static
 */
class ChartsOfCharacteristics extends ManagersCollection {
  constructor(owner) {
    super(owner, 'cch', ChartOfCharacteristicManager);
  }
}

/**
 * ### Коллекция менеджеров задач
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "TaskManager"}}{{/crossLink}}
 *
 * @class Tasks
 * @static
 */
class Tasks extends ManagersCollection {
  constructor(owner) {
    super(owner, 'tsk', TaskManager);
  }
}

/**
 * ### Коллекция бизнес-процессов
 * - Состав коллекции определяется метаданными используемой конфигурации
 * - Тип элементов коллекции: {{#crossLink "BusinessProcessManager"}}{{/crossLink}}
 *
 * @class BusinessProcesses
 * @static
 */
class BusinessProcesses extends ManagersCollection {
  constructor(owner) {
    super(owner, 'bp', BusinessProcessManager);
  }
}

function mngrs($p) {

  // создаём коллекции менеджеров
  Object.defineProperties($p, {

    /**
     * Коллекция менеджеров перечислений
     * @property enm
     * @type Enumerations
     * @static
     */
    enm: {value: new Enumerations($p)},

    /**
     * Коллекция менеджеров справочников
     * @property cat
     * @type Catalogs
     * @static
     */
    cat: {value: new Catalogs($p)},

    /**
     * Коллекция менеджеров документов
     * @property doc
     * @type Documents
     * @static
     */
    doc: {value: new Documents($p)},

    /**
     * Коллекция менеджеров регистров сведений
     * @property ireg
     * @type InfoRegs
     * @static
     */
    ireg: {value: new InfoRegs($p)},

    /**
     * Коллекция менеджеров регистров накопления
     * @property areg
     * @type AccumRegs
     * @static
     */
    areg: {value: new AccumRegs($p)},

    /**
     * Коллекция менеджеров регистров бухгалтерии
     * @property accreg
     * @type AccountsRegs
     * @static
     */
    accreg: {value: new AccountsRegs($p)},

    /**
     * Коллекция менеджеров обработок
     * @property dp
     * @type DataProcessors
     * @static
     */
    dp: {value: new DataProcessors($p)},

    /**
     * Коллекция менеджеров отчетов
     * @property rep
     * @type Reports
     * @static
     */
    rep: {value: new Reports($p)},

    /**
     * Коллекция менеджеров планов счетов
     * @property cacc
     * @type ChartsOfAccounts
     * @static
     */
    cacc: {value: new ChartsOfAccounts($p)},

    /**
     * Коллекция менеджеров планов видов характеристик
     * @property cch
     * @type ChartsOfCharacteristics
     * @static
     */
    cch: {value: new ChartsOfCharacteristics($p)},

    /**
     * Коллекция менеджеров задач
     * @property tsk
     * @type Tasks
     * @static
     */
    tsk: {value: new Tasks($p)},

    /**
     * Коллекция менеджеров бизнес-процессов
     * @property bp
     * @type Tasks
     * @static
     */
    bp: {value: new BusinessProcesses($p)}

  });

}

export default mngrs;
