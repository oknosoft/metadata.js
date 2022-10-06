
import {own, alias} from './symbols';

/**
 * Абстрактный класс со ссылкой на владельца
 */
export class OwnerObj {
  /**
   * Ссылка на владельца
   */
  #own;

  /**
   * Имя коллекции
   */
  #alias;

  constructor(owner, alias) {
    this.#own = owner;
    if(alias) {
      this.#alias = alias;
    }
  }

  get [own]() {
    return this.#own;
  }

  get [alias]() {
    return this.#alias || '';
  }

  toString() {
    return `${this[own].toString()}.${this[alias]}`;
  }
}

/**
 * @summary Описание метаданных объекта
 * Не путать с виртуальным справочником CatMetaObjs
 * @class MetaObj
 */
export class MetaObj extends OwnerObj {

  /**
   *
   * @param {Meta} owner - Корень метаданных
   * @param {String} alias - Имя коллекции
   * @param {Object} raw - Сырое описание метаданных
   */
  constructor(owner, alias, raw) {

    super(owner, alias);

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

  get(field) {
    if(!field) {
      return this;
    }
    const {fields, tabulars} = this;
    if(fields[field]) {
      return fields[field];
    }
    else if(tabulars[field]) {
      return tabulars[field];
    }
    return this.system(field);
  }

  get root() {
    return this[own][own][own];
  }

  toString() {
    const {root} = this;
    return `${root.msg.meta[this[own][alias]]}.${this.name}`;
  }

  system(field) {

    const res = {
      multiline: false,
      note: '',
      synonym: '',
      tooltip: '',
      type: {
        types: ['string'],
      },
    };

    switch (field) {
      case 'presentation':
        res.synonym = 'Представление';
        return res;
      case '_deleted':
        res.synonym = 'Пометка удаления';
        res.type.types[0] = 'boolean';
        return res;
      case '_rev':
        res.synonym = 'Версия данных';
        return res;
      case 'ref':
        res.synonym = 'Ссылка';
        res.type.isRef = true;
        //res.type.types[0] = `${type[owner].name}.${type.name}`;
        return res;
    }

    switch (this[own][alias]) {
      case 'doc':
        switch (field) {
          case 'posted':
            res.synonym = 'Проведен';
            res.type.types[0] = 'boolean';
            return res;
          case 'date':
            res.synonym = 'Дата';
            res.tooltip = 'Дата документа';
            res.type.datePart = 'dateTime';
            res.type.types[0] = 'date';
            return res;
          case 'numberDoc':
            res.synonym = 'Номер';
            res.tooltip = 'Номер документа';
            res.type.strLen = 11;
            return res;
        }
      case 'cat':
      case 'cch':
        switch (field) {
          case 'isFolder':
            res.synonym = 'Это группа';
            res.type.types[0] = 'boolean';
            return res;
          case 'id':
            res.synonym = 'Код';
            res.mandatory = true;
            return res;
          case 'name':
            res.synonym = 'Наименование';
            res.mandatory = this.main_presentation_name;
            return res;
        }
    }
    throw new Error(`Unknown field ${field} in ${this}`);
  }
}

/**
 * @summary Описание метаданных поля
 * @desc Не путать с виртуальным справочником CatMetaFields
 * @class MetaField
 */
export class MetaField extends OwnerObj {
  constructor(owner, name, fields) {
    super(owner, name);
    const {type, ...other} = fields[name];
    this.type = new TypeDef(type);
    Object.assign(this, other);
  }

  toString() {
    return `${this[own].toString()}.${this.synonym}`;
  }

}

/**
 * @summary Коллекция полей метаданных
 */
export class MetaFields extends OwnerObj {

  constructor(owner, fields) {
    super(owner);
    for(const name in fields) {
      this[name] = new MetaField(this, name, fields);
    }
  }

  toString() {
    const owner = this[own];
    const {msg} = owner.root;
    return `${owner.toString()}.${msg.meta.fields}`
  }
}

/**
 * @summary Коллекция метаданных табличных частей
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
 * @summary Метаданные табчасти
 */
export class MetaTabular extends OwnerObj {
  constructor(owner, name, raw) {
    super(owner, name);
    const {fields, tabulars, ...other} = raw[name];
    this.fields = new MetaFields(this, fields);
    this.tabulars = new MetaTabulars(this, tabulars);
    Object.assign(this, other);
  }

  get(name) {
    return name ? (this.fields[name] || this.tabulars[name]) : this;
  }

  get className() {
    const owner = this[own][own];
    return `${owner.className}.${this[alias]}`;
  }
}

/**
 * @summary Описание типа
 */
export class TypeDef {
  constructor(def) {
    Object.assign(this, def);
  }

  /**
   * @summary Среди типов есть ссылочный
   * @type Boolean
   */
  get isRef() {
    return this.types.some(type => type.includes('.'));
  }

  /**
   * @summary Это составной тип
   * @type Boolean
   */
  get isComposite() {
    return this.types.length > 1;
  }

  /**
   * @summary Этот тип не составной и ссылочный
   * @type Boolean
   */
  get isSingleRef() {
    return !this.isComposite && this.isRef;
  }
}
