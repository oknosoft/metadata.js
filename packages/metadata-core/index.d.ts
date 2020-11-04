
// Type definitions for metadata-core
// Project: https://github.com/oknosoft/metadata.js
// Definitions by: Oknosoft <https://github.com/oknosoft>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


declare class MetaEngine {

  utils: MetaEngine.Utils;

  enm: MetaEngine.Enumerations;
  cat: MetaEngine.Catalogs;
  doc: MetaEngine.Documents;
  ireg: MetaEngine.InfoRegs;
  areg: MetaEngine.AccumRegs;
  accreg: MetaEngine.AccountsRegs;
  dp: MetaEngine.DataProcessors;
  rep: MetaEngine.Reports;
  cacc: MetaEngine.ChartsOfAccounts;
  cch: MetaEngine.ChartsOfCharacteristics;
  tsk: MetaEngine.Tasks;
  bp: MetaEngine.BusinessProcesses;


}

declare namespace MetaEngine {

  /// Utils
  ////////////////

  /**
   * Defines the floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the cursor is updated.
   **/
  export class Utils {

    /**
     * Загружает скрипты и стили синхронно и асинхронно
     * @param src - url ресурса
     * @param type - "link" или "script"
     * @param [callback] - функция обратного вызова после загрузки скрипта
     */
    load_script(src: string, type: ['link', 'script'], callback: Function): Promise;
  }

  export class MetaEventEmitter extends NodeJS.EventEmitter {

  }

  export class DataManager extends MetaEventEmitter {

  }

  export class RefDataManager extends DataManager {

  }

  export class DataProcessorsManager extends DataManager {

  }

  export class EnumManager extends RefDataManager {

  }

  export class RegisterManager extends DataManager {

  }

  export class InfoRegManager extends RegisterManager {

  }

  export class AccumRegManager extends RegisterManager {

  }

  export class CatManager extends RefDataManager {

  }

  export class ChartOfCharacteristicManager extends CatManager {

  }

  export class ChartOfAccountManager extends CatManager {

  }

  export class DocManager extends RefDataManager {

  }

  /**
   * ### Абстрактный менеджер задач
   * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
   * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Tasks"}}{{/crossLink}}
   *
   * @class TaskManager
   * @extends CatManager
   * @constructor
   * @param class_name {string}
   */
  export class TaskManager extends CatManager {

  }

  /**
   * ### Абстрактный менеджер бизнес-процессов
   * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
   * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "BusinessProcesses"}}{{/crossLink}}
   *
   * @class BusinessProcessManager
   * @extends CatManager
   * @constructor
   * @param class_name {string}
   */
  export class BusinessProcessManager extends CatManager {

  }

  export class ManagersCollection {

    constructor($p: MetaEngine) {};

    name: string;

    toString(): string;

    create(name: string, constructor: Class, freeze: boolean): DataManager;

    forEach(cb: Function): void;
  }

  /**
   * ### Коллекция менеджеров перечислений
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
   *
   * @class Enumerations
   * @static
   */
  export class Enumerations extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров справочников
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
   *
   * @class Catalogs
   * @static
   */
  export class Catalogs extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров документов
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
   *
   * @class Documents
   * @static
   */
  export class Documents extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров регистров сведений
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
   *
   * @class InfoRegs
   * @static
   */
  export class InfoRegs extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров регистров накопления
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
   *
   * @class AccumRegs
   * @static
   */
  export class AccumRegs extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров регистров бухгалтерии
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
   *
   * @class AccountsRegs
   * @static
   */
  export class AccountsRegs extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров обработок
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
   *
   * @class DataProcessors
   * @static
   */
  export class DataProcessors extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров отчетов
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
   *
   * @class Reports
   * @static
   */
  export class Reports extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров планов счетов
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
   *
   * @class ChartsOfAccounts
   * @static
   */
  export class ChartsOfAccounts extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров планов видов характеристик
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
   *
   * @class ChartsOfCharacteristics
   * @static
   */
  export class ChartsOfCharacteristics extends ManagersCollection {}

  /**
   * ### Коллекция менеджеров задач
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "TaskManager"}}{{/crossLink}}
   *
   * @class Tasks
   * @static
   */
  export class Tasks extends ManagersCollection {}

  /**
   * ### Коллекция бизнес-процессов
   * - Состав коллекции определяется метаданными используемой конфигурации
   * - Тип элементов коллекции: {{#crossLink "BusinessProcessManager"}}{{/crossLink}}
   *
   * @class BusinessProcesses
   * @static
   */
  export class BusinessProcesses extends ManagersCollection {}


}

declare var $p: MetaEngine;
