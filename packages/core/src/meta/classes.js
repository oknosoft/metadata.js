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
      const {fields, tabulars, ...other} = raw;
      this.fields = new MetaFields(this, fields);
      this.tabulars = new MetaTabulars(this, tabulars);
      Object.assign(this, other);
    }
  }
}

/**
 * Описание метаданных поля
 * Не путать с виртуальным справочником CatMeta_fields
 * @class MetaField
 */
export class MetaField extends OwnerObj {
  constructor(owner, name, fields) {
    super(owner);
    const {type, ...other} = fields[name];
    this.type = new TypeDef(type);
    Object.assign(this, {name, ...other});
  }
}

/**
 * Коллекция полей метаданных
 */
export class MetaFields {

  constructor(owner, fields) {
    this._owner = owner;
    for(const name in fields) {
      this[name] = new MetaField(this, name, fields);
    }
  }
}

/**
 * Коллекция метаданных табличных частей
 */
export class MetaTabulars extends OwnerObj {
  constructor(owner, tabulars) {
    super(owner);
    for(const name in tabulars) {
      this[name] = new MetaTabular(this, name, tabulars);
    }
  }
}

/**
 * Метаданные табчасти
 */
export class MetaTabular extends OwnerObj {
  constructor(owner, name, raw) {
    super(owner);
    const {fields, tabulars, ...other} = raw[name];
    this.fields = new MetaFields(this, fields);
    this.tabulars = new MetaTabulars(this, tabulars);
    Object.assign(this, {name, ...other});
  }
}

/**
 * Описание типа
 */
export class TypeDef {
  constructor(def) {
    Object.assign(this, def);
  }

  /**
   * Среди типов есть ссылочный
   * @type Boolean
   */
  get isRef() {
    return this.types.some(type => type.includes('.'));
  }

  /**
   * Это составной тип
   * @type Boolean
   */
  get isComposite() {
    return this.types.length > 1;
  }

  /**
   * Этот тип не составной и ссылочный
   * @type Boolean
   */
  get isSingleRef() {
    return !this.isComposite && this.isRef;
  }
}
