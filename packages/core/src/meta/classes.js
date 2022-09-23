/**
 * Абстрактный класс со ссылкой на владельца
 */
export class OwnerObj {
  /**
   * Ссылка на владельца
   */
  #owner;

  constructor(owner) {
    this.#owner = owner;
  }

  get owner() {
    return this.#owner;
  }
}

/**
 * Описание метаданных объекта
 * Не путать с виртуальным справочником CatMeta_objs
 * @class MetaObj
 */
export class MetaObj {

  /**
   * Имя коллекции
   * @type String
   */
  #area;

  /**
   *
   * @param {String} area - Имя коллекции
   * @param {Object} raw - Сырое описание метаданных
   */
  constructor(area, raw) {
    this.#area = area;

    if(Array.isArray(raw)) {
      this.values = [];
      for(const row of raw) {
        if('order' in row && row.name) {
          this.values.push(row);
        }
        else {
          for(const fld in row) {
            this[fld] = row[fld];
          }
        }
      }
      this.cachable = 'ram';
    }
    else {
      Object.assign(this, raw);
    }
  }
}

/**
 * Описание метаданных поля
 * Не путать с виртуальным справочником CatMeta_fields
 * @class MetaField
 */
export class MetaField {

}

/**
 * Коллекция полей метаданных
 */
export class MetaFields extends OwnerObj {

  constructor(owner, fields) {
    super(owner);
    Object.assign(this, fields);
  }
}

/**
 * Коллекция метаданных табличных частей
 */
export class MetaTabulars extends OwnerObj {
  constructor(owner, tabulars) {
    super(owner);
    Object.assign(this, tabulars);
  }
}

/**
 * Метаданные табчасти
 */
export class MetaTabular extends OwnerObj {
  constructor(owner, tabular) {
    super(owner);
    Object.assign(this, tabular);
  }
}

/**
 * Описание типа
 */
export class TypeDef {
  constructor(def) {
    Object.assign(this, def);
  }
}
