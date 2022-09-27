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
export class MetaObj extends OwnerObj {

  /**
   * Имя коллекции
   * @type String
   */
  #area;

  /**
   *
   * @param {Meta} owner - Корень метаданных
   * @param {String} area - Имя коллекции
   * @param {Object} raw - Сырое описание метаданных
   */
  constructor(owner, area, raw) {

    super(owner);

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

  get(field) {
    const {fields, tabulars} = this;
    if(fields[field]) {
      return fields[field];
    }
    else if(tabulars[field]) {
      return tabulars[field];
    }
    return this.system(field);
  }

  toString() {
    const {msg} = this.owner.owner;
    return `${msg.meta[this.#area]}.${this.name}`;
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
        //res.type.types[0] = `${type._owner.name}.${type.name}`;
        return res;
    }

    switch (this.#area) {
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
