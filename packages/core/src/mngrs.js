/**
 * Конструкторы менеджеров данных
 *
 */


import msg from './i18n.ru';
import {BaseDataObj, DataObj, EnumObj, DocObj, RegisterRow} from './objs';
import MetaEventEmitter from './meta/emitter';
import camelcase from 'camelcase';

const string = 'string';
const pascal = {pascalCase: true, preserveConsecutiveUppercase: true};

class Iterator {

  constructor(alatable) {
    this.alatable = alatable;
    this.idx = 0;
  }

  value(alatable) {
    const value = alatable[this.idx];
    this.idx++;
    return value?.empty?.() ? null : value;
  }

  next() {
    const {alatable} = this;
    let value = this.value(alatable);
    while (!value && (this.idx < alatable.length)) {
      value = this.value(alatable);
    }
    return {value, done: !value || this.idx > alatable.length};
  }
}


/**
 * Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumManager"}}{{/crossLink}} - менеджер перечислений
 * - {{#crossLink "RefDataManager"}}{{/crossLink}} - абстрактный менеджер ссылочных данных
 * - {{#crossLink "CatManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DocManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DataProcessorsManager"}}{{/crossLink}} - менеджер обработок
 * - {{#crossLink "RegisterManager"}}{{/crossLink}} - абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 * - {{#crossLink "InfoRegManager"}}{{/crossLink}} - менеджер регистров сведений
 * - {{#crossLink "LogManager"}}{{/crossLink}} - менеджер журнала регистрации
 * - {{#crossLink "AccumRegManager"}}{{/crossLink}} - менеджер регистров накопления
 *
 * @abstract
 * @param {ManagersCollection} owner - коллекция менеджеров
 * @param {string} className  - имя типа менеджера объекта. например, "doc.calc_order"
 */
export class DataManager extends MetaEventEmitter{

  /**
   * Хранилище объектов данного менеджера
   * @type Object
   */
  #byRef = {};

  /**
   * Те же объекты в виде массива
   * @type Array.<DataObj>
   */
  #alatable = [];

  /**
   * Индекс по коду-дате-номеру
   * @type Object
   */
  #index = {
    predefined: {},
    id: {},
    year: {},
  };

  /**
   * В этом свойстве хранятся имена конструктора объекта и конструкторов табличных частей
   * @type Object
   */
  #constructorNames = {};

	constructor(owner, className) {

		super(owner);

		/**
		 * Имя типа объектов этого менеджера
		 * @type String
		 * @final
		 */
		this.className = className;

	}

	toString(){
		return msg.meta_mgrs[this.owner.name]
	}

  /**
   * toJSON
   * для сериализации возвращаем представление
   */
  toJSON() {
    return {type: 'DataManager', className: this.className};
  }

  /**
   * Имя типа объектов этого менеджера
   * @type String
   * @final
   */
  get name() {
    return this.className.split('.')[1];
  }

  /**
   * Корень метадаты
   * @type {MetaEngine}
   */
  get root() {
    return this.owner.owner;
  }

  /**
   * @type {MetaUtils}
   */
  get utils() {
    return this.root.utils;
  }

	/**
	 * Метаданные объекта
	 * указатель на фрагмент глобальных метаданных, относящийся к текущему классу данных
	 * @param {String} [field]
	 * @return {MetaObj} - объект метаданных
	 */
	metadata(field) {
    return this.root.md.get(this, field);
	}

  /**
   * Помещает элемент ссылочных данных в локальную коллекцию
   * Попутно, включает их в индексы и alatable
   * @param obj {DataObj}
   * @param [new_ref] {String} - новое значение ссылки объекта
   */
  push(obj, new_ref){
    if (new_ref && (new_ref != obj.ref)) {
      delete this.#byRef[obj.ref];
      this.#byRef[new_ref] = obj;
    }
    else {
      this.#byRef[obj.ref] = obj;
    }
  }

  /**
   * Возвращает объект по ссылке (читает из локального кеша)
   * Если нет в кеше и идентификатор не пуст, создаёт новый объект
   * @param {String|Object} [ref] - ссылочный идентификатор
   * @param {Boolean} [create=false] - Если false - не создавать новый. Например, при поиске элемента из конструктора
   * @return {DataObj|undefined}
   */
  get(ref, create = true) {
    ref = this.utils.fix.guid(ref);
    let o = this.#byRef[ref];
    if (!o && !create) {
      o = this.objConstructor('', [ref, this]);
    }
    return o;
  }

  /**
   * Извлекает ссылку из сырых данных
   * @param {Object} attr
   * @return {String}
   */
  get_ref(attr){
    return this.utils.fix.guid(attr);
  }

  /**
   * Возаращает элемент по имени предопределенных данных
   * @param {String} name - имя предопределенного
   * @return {DataObj}
   */
  predefined(name) {
    return this.#index.predefined[name];
  }

	/**
	 * Указатель на адаптер данных этого менеджера
	 */
	get adapter(){
    const {adapters} = this.root;
    return adapters[this.cachable] || adapters.pouch;
	}

	/**
	 * Способ (место) хранения объектов этого менеджера
	 *
	 * Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
	 * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
   * ("ram", "doc", "remote", "meta", "e1cib")
	 * @type String
	 * @final
	 */
  get cachable() {
    return this.metadata().cachable;
  }


	/**
	 * Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере.
	 * Имеет смысл для объектов, у которых _cachable = "ram"_
	 * @param {Object} selection - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param {Function} [callback] - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
  find_rows(selection, callback) {
    return this.utils._find_rows.call(this, this, selection, callback);
  }

  /**
   * Находит первый элемент, в любом поле которого есть искомое значение
   * либо, ищет по ключам или методу условия
   * @param val - значение или правило или метод для поиска
   * @param columns {String|Array} - колонки, в которых искать
   * @return {DataObj}
   */
  find(val, columns) {
    return this.utils._find(this.#byRef, val, columns);
  }

	/**
	 * Имя функции - конструктора объектов или строк табличных частей
	 *
	 * @method objConstructor
	 * @param {String} [tsName]
	 * @param {Boolean|Object} [mode]
	 * @return {String|Function|DataObj}
	 */
	objConstructor(tsName = '', mode) {

		if(!this.#constructorNames[tsName]){
			const fnName = camelcase(this.className, pascal);
			this.#constructorNames[tsName] = tsName ? `${fnName}${camelcase(tsName, pascal)}Row` : fnName;
		}

		tsName = this.#constructorNames[tsName];

		// если режим не указан, возвращаем имя функции - конструктора
		if(!mode){
			return tsName;
		}
		// если булево - возвращаем саму функцию - конструктор
		const constructor = this.root.classes[tsName];
		if(mode === true ){
			return constructor;
		}
		// если массив - создаём объект с параметрами, указанными в массиве
		if(Array.isArray(mode)){
			return new constructor(...mode);
		}
		// иначе - создаём объект и передаём в конструктор единственный параметр
		return new constructor(mode);
	}

	/**
	 * Возвращает массив доступных значений для комбобокса
	 * @param [selection] {Object} - отбор, который будет наложен на список
	 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
	 * @return {Promise.<Array>}
	 */
	optionList(selection = {}, val){

		let l = [], input_by_string, text;

    function push(v) {
      if (selection._dhtmlx) {
        const opt = {
          text: v.presentation,
          value: v.ref
        }
        if (this.utils.is.equal(opt.value, val)) {
          opt.selected = true;
        }
        if (v.className === 'cat.property_values' && v.css) {
          opt.css = v.css;
        }
        l.push(opt);
      }
      else if (!v.empty()) {
        l.push(v);
      }
    }

    // поиск по строке
    if(selection.presentation && (input_by_string = this.metadata().input_by_string)) {
      text = selection.presentation.like;
      delete selection.presentation;
      selection.or = [];
      input_by_string.forEach((fld) => {
        const sel = {};
        sel[fld] = {like: text};
        selection.or.push(sel);
      });
    }

    if(this.cachable.endsWith('ram') || this._direct_ram || (selection && selection._local)) {
      this.find_rows(selection._mango ? selection.selector : selection, push);
      return Promise.resolve(l);
    }
    return this.adapter.find_rows(this, selection)
      .then((data) => {
        for (const v of data) {
          push(v);
        };
        return l;
      });
  }


	/**
	 * Возвращает промис со структурой печатных форм объекта
	 * @return {Object}
	 */
	printingPlates(){
		return this.metadata().printing_plates;
	}

  /**
   * Удаляет объект из alatable и локального кеша
   * @param obj
   */
  unloadObj(obj) {
    const {ref, id, date, numberDoc} = obj;
    delete this.#byRef[ref];
    const ind = this.#alatable.indexOf(obj);
    if(ind >= 0) {
      this.#alatable.splice(ind, 1);
    }
    if(id && this.#index.id[id]) {
      delete this.#index.id[id];
    }
    else if(date && numberDoc) {
      const by_id = this.#index.year[this.utils.moment(date).format('YYYYMM')];
      if(by_id[numberDoc]) {
        delete by_id[numberDoc];
      }
    }
  }

  /**
   * Перебор объектов в ОЗУ
   */
  forEach(...args) {
    return this.#alatable.forEach(...args);
  }

  /**
   * Map объектов в ОЗУ
   */
  map(...args) {
    return this.#alatable.forEach(...args);
  }

  /**
   * Итератор
   * @return {Iterator}
   */
  [Symbol.iterator]() {
    return new Iterator(this.#alatable);
  }

}

/**
 * ### Aбстрактный менеджер ссылочных данных
 * От него унаследованы менеджеры документов, справочников, планов видов характеристик и планов счетов
 *
 * @class RefDataManager
 * @extends DataManager
 * @constructor
 * @param className {string} - имя типа менеджера объекта
 */
export class RefDataManager extends DataManager {

	/**
	 * Создаёт новый объект типа объектов текущего менеджера
	 * Для кешируемых объектов, все действия происходят на клиенте<br />
	 * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
	 *
	 * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
	 * @param [do_after_create] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
	 * @return {Promise.<DataObj>}
	 */
  create(attr, do_after_create, force_obj) {

    const {utils} = this;

		if(!attr || typeof attr !== "object"){
			attr = {};
		}
		else if(utils.is.dataObj(attr)){
			return Promise.resolve(attr);
		}

		if(!attr.ref || !utils.is.guid(attr.ref) || utils.is.emptyGuid(attr.ref)){
			attr.ref = utils.generate_guid();
		}

		let o = this.byRef[attr.ref];

		if(!o){

			o = this.objConstructor('', [attr, this]);

      // Триггер после создания
      const after_create_res = do_after_create === false ? false : o.after_create();

      if(o instanceof DocObj && o.date == utils.blank.date){
        o.date = new Date();
      }

      if(force_obj){
        return o;
      }

      // Если новый код или номер не были назначены в триггере - устанавливаем стандартное значение
      let callNumberDoc;
      if((this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager)){
        callNumberDoc = !o.numberDoc;
      }
      else{
        callNumberDoc = !o.id;
      }

      return (callNumberDoc ? o.newNumberDoc() : Promise.resolve(o))
        .then(() => {
          // выполняем обработчик после создания объекта и стандартные действия, если их не запретил обработчик
          return after_create_res instanceof Promise ? after_create_res : o;
        });
		}

		return force_obj ? o : Promise.resolve(o);

	}

	/**
	 * Сохраняет массив объектов в менеджере
	 *
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param {Boolean|String} [forse] - перезаполнять объект
   * при forse == "update_only", новые объекты не создаются, а только перезаполняются ранее загруженные в озу
	 */
	loadArray(aattr, forse){
		const res = [];
    const {jobPrm} = this.root;
    const {grouping, tabular_sections} = this.metadata();
		for(const attr of aattr){
		  if(grouping === 'array' && attr.ref.length <= 3) {
		    res.push.apply(res, this.loadArray(attr.rows, forse));
		    continue;
      }
			let obj = this.get(attr, false);
			if(!obj){
        if(forse === 'update_only') {
					continue;
				}
				obj = this.objConstructor('', [attr, this, true]);
				obj.is_new() && obj._set_loaded();
			}
			else if(obj.is_new() || forse){
			  if(obj.is_new() || forse !== 'update_only') {
          obj._data._loading = true;
        }
        else if(forse === 'update_only' && attr.timestamp) {
          if(attr.timestamp.user === (this.adapter.authorized || jobPrm.get('user_name'))) {
            if(new Date() - moment(attr.timestamp.moment, "YYYY-MM-DDTHH:mm:ss ZZ").toDate() < 30000) {
              attr._rev && (obj._obj._rev = attr._rev);
              continue;
            }
          }
        }
				obj._mixin(attr);
        attr._rev && (obj._obj._rev = attr._rev);
			}
      for(const ts in tabular_sections) {
        obj[ts]._index && obj[ts]._index.clear();
      }
			res.push(obj);
		}
		return res;
	}

	/**
	 * Находит перую папку в пределах подчинения владельцу
	 * @method firstFolder
	 * @param owner {DataObj|String}
	 * @return {DataObj} - ссылка найденной папки или пустая ссылка
	 */
	firstFolder(owner){
		for(let i in this.byRef){
			const o = this.byRef[i];
			if(o.is_folder && (!owner || utils.is_equal(owner, o.owner))) return o;
		}
		return this.get();
	}

	/**
	 * Возаращает текст запроса для создания таблиц объекта и его табличных частей
	 * @param attr {Object}
	 * @param attr.postgres {Boolean} - использовать синтаксис postgres
	 * @return {Object|String}
	 */
	sqlCreate(attr){
		const {sqlMask, sqlType} = this.$p.md;
		let t = this,
      sql = "CREATE TABLE IF NOT EXISTS ",
			cmd = t.metadata(),
			res = {}, f, f0, trunc_index = 0;

    if(attr?.postgres){
      sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

      if (t instanceof DocManager) {
        sql += ", posted boolean, date timestamp with time zone, numberDoc character(11)";
      }
      else {
        if (cmd.code_length)
          sql += ", id character(" + cmd.code_length + ")";
        sql += ", name character varying(50), is_folder boolean";
      }

      for(f in cmd.fields){
        if(f.length > 30){
          if(cmd.fields[f].short_name)
            f0 = cmd.fields[f].short_name;
          else{
            trunc_index++;
            f0 = f[0] + trunc_index + f.substr(f.length-27);
          }
        }else
          f0 = f;
        sql += ", " + f0 + sqlType(t, f, cmd.fields[f].type, true);
      }

      for(f in cmd["tabular_sections"])
        sql += ", " + "ts_" + f + " JSON";

    }
    else {
      sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

      if(t instanceof DocManager)
        sql += ", posted boolean, date Date, numberDoc CHAR";
      else
        sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

      for(f in cmd.fields)
        sql += sql_mask(f) + sqlType(t, f, cmd.fields[f].type);

      for(f in cmd["tabular_sections"])
        sql += ", " + "`ts_" + f + "` JSON";
    }

    sql += ")";

    return sql;
	}

  /**
   * Получает присоединенный к объекту файл
   * @param ref
   * @param att_id
   * @return {Promise}
   */
  get_attachment(ref, att_id) {
    const {adapter} = this;
    return adapter.get_attachment ? adapter.get_attachment(this, ref, att_id) : Promise.reject();
  }

  /**
   * ### Сохраняет присоединенный файл
   *
   * @method save_attachment
   * @for DataManager
   * @param ref
   * @param att_id
   * @param attachment
   * @param type
   * @return {Promise}
   * @async
   */
  save_attachment(ref, att_id, attachment, type) {
    const {adapter} = this;
    return adapter.save_attachment ? adapter.save_attachment(this, ref, att_id, attachment, type) : Promise.reject();
  }

  /**
   * Удаляет присоединенный к объекту файл
   * @param ref
   * @param att_id
   * @return {Promise}
   */
  delete_attachment(ref, att_id) {
    const {adapter} = this;
    return adapter.delete_attachment ? adapter.delete_attachment(this, ref, att_id) : Promise.reject();
  }

  /**
   * Возвращает массив оборванных ссылок в объектах текущего менеджера
   * @return {Array}
   */
  broken_links() {
    const res = [];
    const push = res.push.bind(res);
    for(const ref in this.byRef) {
      this.byRef[ref].broken_links().forEach(push);
    }
    return res;
  }

}

/**
 * ### Абстрактный менеджер обработок
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "DataProcessors"}}{{/crossLink}}
 *
 * @class DataProcessorsManager
 * @extends DataManager
 * @param className {string} - имя типа менеджера объекта
 * @constructor
 */
export class DataProcessorsManager extends DataManager{

	/**
	 * Создаёт экземпляр объекта обработки
	 * @method create
	 * @return {DataProcessorObj}
	 */
	create(attr = {}, loading){
		return this.objConstructor('', [attr, this, loading]);
	}

	/**
	 * Создаёт экземпляр объекта обработки - псевдоним create()
	 * @method get
	 * @return {DataProcessorObj}
	 */
	get(ref){
		if(ref){
			if(!this.byRef[ref]){
				this.byRef[ref] = this.create()
			}
			return this.byRef[ref];
		}else
			return this.create();
	}

	/**
	 * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql
   * Добавлен для унификации формы объекта при закрытии
	 * @method unloadObj
	 */
	unloadObj() {	}
}

/**
 * ### Абстрактный менеджер перечисления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
 *
 * @class EnumManager
 * @extends RefDataManager
 * @param className {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
export class EnumManager extends RefDataManager{

	constructor(owner, className) {
		super(owner, className);
    const meta = this.metadata();
		for(var v of meta.values){
      const value = new EnumObj(v, this);
      if(v.latin) {
        Object.defineProperty(this, v.latin, {value});
      }
		}
    if(meta.default) {
      Object.defineProperty(this, '_', {value: this.get(meta.default)});
    }
	}

  get(ref, create) {
    if (!ref || ref == this.utils.blank.guid) {
      ref = "_";
    }
    return super.get(ref, create);
  }

  /**
   * Извлекает ссылку из сырых данных
   * @param {Object} attr
   * @return {String}
   */
  get_ref(attr){
    return attr.name;
  }

	push(value, new_ref){
    super.push(value, new_ref);
		Object.defineProperty(this, new_ref, {value});
	}

	/**
	 * Bозаращает запрос для создания таблиц объекта
	 * @param attr {Object}
	 * @param attr.postgres {Boolean} - использовать синтаксис postgres
	 * @return {String}
	 */
  sqlCreate(attr){

		var res = "CREATE TABLE IF NOT EXISTS ",
			action = attr && attr.action ? attr.action : "create_table";

		if(attr && attr.postgres){
			if(action == "create_table")
				res += this.table_name+
					" (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";
			else if(["insert", "update", "replace"].indexOf(action) != -1){
				res = {};
				res[this.table_name] = {
					sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES ($1, $2, $3)",
					fields: ["ref", "sequence", "synonym"],
					values: "($1, $2, $3)"
				};

			}else if(action == "delete")
				res = "DELETE FROM "+this.table_name+" WHERE ref = $1";

		}else {
			if(action == "create_table")
				res += "`"+this.table_name+
					"` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";

			else if(["insert", "update", "replace"].indexOf(action) != -1){
				res = {};
				res[this.table_name] = {
					sql: "INSERT INTO `"+this.table_name+"` (ref, sequence, synonym) VALUES (?, ?, ?)",
					fields: ["ref", "sequence", "synonym"],
					values: "(?, ?, ?)"
				};

			}else if(action == "delete")
				res = "DELETE FROM `"+this.table_name+"` WHERE ref = ?";
		}



		return res;

	}

	/**
	 * Возвращает массив доступных значений для комбобокса
	 * @param [selection] {Object}
	 * @param [selection._top] {Number}
	 * @return {Promise.<Array>}
	 */
  optionList(selection = {}, val){
		let l = [], synonym = "", sref;
    const {is} = this.utils;

    function push(v){
      if(selection._dhtmlx){
        v = {
          text: v.presentation,
          value: v.ref
        }
        if(is.equal(v.value, val)){
          v.selected = true;
        }
        l.push(v);
      }
      else if(!v.empty()){
        l.push(v);
      }
    }

    for(const i in selection){
      if(i.substr(0,1)!="_"){
        if(i == "ref"){
          sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
        }
        else
          synonym = selection[i];
      }
    }

		if(!selection._dhtmlx){
      l.push(this.get());
		}

		if(typeof synonym == "object"){
      synonym = synonym.like ? synonym.like : '';
		}
		synonym = synonym.toLowerCase();

		this.alatable.forEach(v => {
			if(synonym){
				if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1){
          return;
        }
			}
			if(sref){
				if(Array.isArray(sref)){
					if(!sref.some(sv => sv.name == v.ref || sv.ref == v.ref || sv == v.ref))
						return;
				}else{
					if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
						return;
				}
			}
			push(this[v.ref]);
		});

		return Promise.resolve(l);
	}

}

/**
 * ### Абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 *
 * @class RegisterManager
 * @extends DataManager
 * @constructor
 * @param className {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
export class RegisterManager extends DataManager{

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {RegisterRow}
	 * @param [new_ref] {String} - новое значение ссылки объекта
	 */
	push(o, new_ref) {
		if (new_ref && (new_ref != o.ref)) {
			delete this.byRef[o.ref];
			this.byRef[new_ref] = o;
		} else
			this.byRef[o.ref] = o;
	}

	/**
	 * Возвращает массив записей c заданным отбором либо запись по ключу
	 * @method get
	 * @for InfoRegManager
	 * @param attr {Object} - объект {key:value...}
	 * @param return_row {Boolean} - возвращать запись, а не массив
	 * @return {*}
	 */
	get(attr, return_row) {

		if (!attr)
			attr = {};
		else if (typeof attr == string)
			attr = {ref: attr};

		if (attr.ref && return_row)
			return this.byRef[attr.ref];

		attr.action = "select";

		const {alasql} = this.$p.wsql;
		const arr = wsql.alasql(this.get_sql_struct(attr), attr._values);

		let res;

		delete attr.action;
		delete attr._values;

		if (arr.length) {
			if (return_row)
				res = this.byRef[this.get_ref(arr[0])];
			else {
				res = [];
				for (var i in arr)
					res.push(this.byRef[this.get_ref(arr[i])]);
			}
		}

		return res;
	}

	/**
	 * сохраняет массив объектов в менеджере
	 * @method loadArray
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 */
	load_array(aattr, forse) {

		const res = [];

    for (const row of aattr) {
      const ref = this.get_ref(row);
      let obj = this.byRef[ref];

      if (!obj && !row._deleted) {
        obj = this.objConstructor('', [row, this, true]);
        obj.is_new() && obj._set_loaded();
      }
      else if (obj && row._deleted) {
        obj.unload();
        continue;
      }
      else if (forse) {
        obj._data._loading = true;
        obj._mixin(row);
      }

      res.push(obj);
    }

		return res;
	}

	/**
	 * Возаращает запрос для создания таблиц или извлечения данных
	 * @method get_sql_struct
	 * @for RegisterManager
	 * @param attr {Object}
	 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
	 * @return {Object|String}
	 */
	get_sql_struct(attr) {
		const {md: {sqlMask, sqlType}, utils}  = this.root;
		var t = this,
			cmd = t.metadata(),
			res = {}, f,
			action = attr && attr.action ? attr.action : "create_table";

		function sql_selection(){

			var filter = attr.filter || "";

			function list_flds(){
				var flds = [], s = "_t_.ref";

        if(cmd.form && cmd.form.selection) {
          cmd.form.selection.fields.forEach(fld => flds.push(fld));
        }
        else {
          for (var f in cmd.dimensions) {
            flds.push(f);
          }
        }

        flds.forEach(fld => {
          if(fld.indexOf(' as ') != -1) {
            s += ', ' + fld;
          }
          else {
            s += sql_mask(fld, true);
          }
        });
        return s;

			}

			function join_flds(){

				var s = "", parts;

				if(cmd.form && cmd.form.selection){
					for(var i in cmd.form.selection.fields){
						if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
							continue;
						parts = cmd.form.selection.fields[i].split(" as ");
						parts[0] = parts[0].split(".");
						if(parts[0].length > 1){
							if(s)
								s+= "\n";
							s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
						}
					}
				}
				return s;
			}

			function where_flds(){

				var s = " WHERE (" + (filter ? 0 : 1);

				if(t.sql_selection_where_flds){
					s += t.sql_selection_where_flds(filter);

				}

				s += ")";


				// допфильтры форм и связей параметров выбора
				if(attr.selection){
					if(typeof attr.selection == "function"){

					}
					else
						attr.selection.forEach(sel => {
							for(var key in sel){

								if(typeof sel[key] == "function"){
									s += "\n AND " + sel[key](t, key) + " ";

								}else if(cmd.fields.hasOwnProperty(key)){
									if(sel[key] === true)
										s += "\n AND _t_." + key + " ";

									else if(sel[key] === false)
										s += "\n AND (not _t_." + key + ") ";

									else if(typeof sel[key] == "object"){

                    if(utils.is.dataObj(sel[key])) {
                      s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
                    }
                    else {
											const keys = Object.keys(sel[key]), val = sel[key][keys[0]];

											if(['not', 'ne', '$ne'].includes(keys[0]))
												s += "\n AND (not _t_." + key + " = '" + val.valueOf() + "') ";

											else
												s += "\n AND (_t_." + key + " = '" + val.valueOf() + "') ";
										}

									}
									else if(typeof sel[key] === string)
										s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

									else
										s += "\n AND (_t_." + key + " = " + sel[key] + ") ";

								} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
									//if(sel[key])
									//	s += "\n AND _t_." + key + " ";
									//else
									//	s += "\n AND (not _t_." + key + ") ";
								}
							}
						});
				}

				return s;
			}

			function order_flds(){

				return "";
			}

			// строка фильтра
			if(filter && filter.indexOf("%") == -1)
				filter = "%" + filter + "%";

			var sql;
			if(t.sql_selection_list_flds)
				sql = t.sql_selection_list_flds();
			else
				sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
					.replace("%2", list_flds())
					.replace("%j", join_flds())
				;

			return sql.replace("%3", where_flds()).replace("%4", order_flds());

		}

		function sql_create(){

			var sql = "CREATE TABLE IF NOT EXISTS ",
				first_field = true;

			if(attr && attr.postgres){
				sql += t.table_name+" (";

				if(cmd.splitted){
					sql += "zone integer";
					first_field = false;
				}

				for(f in cmd.dimensions){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
					sql += sqlType(t, f, cmd.dimensions[f].type, true);
				}

				for(f in cmd.resources)
					sql += ", " + f + sqlType(t, f, cmd.resources[f].type, true);

				for(f in cmd.attributes)
					sql += ", " + f + sqlType(t, f, cmd.attributes[f].type, true);

				sql += ", PRIMARY KEY (";
				first_field = true;
				if(cmd.splitted){
					sql += "zone";
					first_field = false;
				}
				for(f in cmd["dimensions"]){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
				}

			}else{
				sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

				//sql += md.sqlMask(f) + md.sqlType(t, f, cmd.dimensions[f].type);

				for(f in cmd.dimensions)
					sql += sql_mask(f) + sqlType(t, f, cmd.dimensions[f].type);

				for(f in cmd.resources)
					sql += sql_mask(f) + sqlType(t, f, cmd.resources[f].type);

				for(f in cmd.attributes)
					sql += sql_mask(f) + sqlType(t, f, cmd.attributes[f].type);

				// sql += ", PRIMARY KEY (";
				// first_field = true;
				// for(f in cmd["dimensions"]){
				// 	if(first_field){
				// 		sql += "`" + f + "`";
				// 		first_field = false;
				// 	}else
				// 		sql += md.sqlMask(f);
				// }
			}

			sql += ")";

			return sql;
		}

		function sql_update(){
			// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
			var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
				fields = [],
				first_field = true;

			for(f in cmd.dimensions){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
				fields.push(f);
			}
			for(f in cmd.resources){
				sql += ", " + f;
				fields.push(f);
			}
			for(f in cmd.attributes){
				sql += ", " + f;
				fields.push(f);
			}

			sql += ") VALUES (?";
			for(f = 1; f<fields.length; f++){
				sql += ", ?";
			}
			sql += ")";

			return {sql: sql, fields: fields};
		}

		function sql_select(){
			var sql = "SELECT * FROM `"+t.table_name+"` WHERE ",
				first_field = true;
			attr._values = [];

			for(var f in cmd["dimensions"]){

				if(first_field)
					first_field = false;
				else
					sql += " and ";

				sql += "`" + f + "`" + "=?";
				attr._values.push(attr[f]);
			}

			if(first_field)
				sql += "1";

			return sql;
		}


		if(action == "create_table")
			res = sql_create();

		else if(action in {insert:"", update:"", replace:""})
			res[t.table_name] = sql_update();

		else if(action == "select")
			res = sql_select();

		else if(action == "select_all")
			res = sql_select();

		else if(action == "delete")
			res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

		else if(action == "drop")
			res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

		else if(action == "get_selection")
			res = sql_selection();

		return res;
	}

	get_ref(attr){

		if(attr instanceof RegisterRow)
			attr = attr._obj;

		if(attr.ref)
			return attr.ref;

		var key = "",
			dimensions = this.metadata().dimensions;

		for(var j in dimensions){
			key += (key ? "¶" : "");
			if(dimensions[j].type.isRef)
				key += this.utils.fix.guid(attr[j]);

			else if(!attr[j] && dimensions[j].type.digits)
				key += "0";

			else if(dimensions[j].date_part)
				key += moment(attr[j] || this.utils.blank.date).format(moment.defaultFormatUtc);

			else if(attr[j]!=undefined)
				key += String(attr[j]);

			else
				key += "$";
		}
		return key;
	}

  create(attr) {

    if(!attr || typeof attr != 'object') {
      attr = {};
    }

    let o = this.byRef[attr.ref];
    if(!o) {

      o = this.objConstructor('', [attr, this]);

      // Триггер после создания
      let after_create_res = {};
      this.emit('after_create', o, after_create_res);

      if(after_create_res === false) {
        return Promise.resolve(o);
      }
      else if(typeof after_create_res === 'object' && after_create_res.then) {
        return after_create_res;
      }
    }

    return Promise.resolve(o);
  }

  /**
   * Выполняет перебор элементов локальной коллекции
   * @method each
   * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
   */
  each(fn) {
    for (const i in this.byRef) {
      if(fn.call(this, this.byRef[i]) === true) {
        break;
      }
    }
  }

}

/**
 * ### Абстрактный менеджер регистра сведений
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "InfoRegs"}}{{/crossLink}}
 *
 * @class InfoRegManager
 * @extends RegisterManager
 * @constructor
 * @param className {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
export class InfoRegManager extends RegisterManager{

	/**
	 * Возаращает массив записей - срез первых значений по ключам отбора
	 * @method slice_first
	 * @for InfoRegManager
	 * @param filter {Object} - отбор + период
	 */
	sliceFirst(filter){

	}

	/**
	 * Возаращает массив записей - срез последних значений по ключам отбора
	 * @method slice_last
	 * @for InfoRegManager
	 * @param filter {Object} - отбор + период
	 */
	sliceLast(filter){

	}
}

/**
 * ### Абстрактный менеджер регистра накопления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "AccumRegs"}}{{/crossLink}}
 *
 * @class AccumRegManager
 * @extends RegisterManager
 * @constructor
 * @param className {string} - имя типа менеджера объекта. например, "areg.goods_on_stores"
 */
export class AccumRegManager extends RegisterManager{

}

/**
 * ### Абстрактный менеджер справочника
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Catalogs"}}{{/crossLink}}
 *
 * @class CatManager
 * @extends RefDataManager
 * @constructor
 * @param className {string}
 */
export class CatManager extends RefDataManager{

	constructor(owner, className) {

		super(owner, className);

		const _meta = this.metadata() || {}

		// реквизиты по метаданным
		if (_meta.hierarchical && _meta.group_hierarchy) {

			/**
			 * Признак "это группа"
			 * @property is_folder
			 * @for CatObj
			 * @type {Boolean}
			 */
			Object.defineProperty(this.objConstructor('', true).prototype, 'is_folder', {
				get(){ return this._obj.is_folder || false},
				set(v){ this._obj.is_folder = this.utils.fix.boolean(v)},
				enumerable: true,
				configurable: true
			})
		}
	}

	/**
	 * Возвращает объект по наименованию
	 * @method by_name
	 * @param name {String|Object} - искомое наименование
	 * @return {DataObj}
	 */
	by_name(name) {
		return this.find({name}) || this.get();
	}

	/**
	 * Возвращает объект по коду
	 * @method by_id
	 * @param id {String|Object} - искомый код
	 * @return {DataObj}
	 */
	by_id(id) {
    let o = this._by_id[id];
    if(!o) {
      this.find_rows({id}, obj => {
        o = obj;
        this._by_id[id] = o;
        return false;
      });
    }
    return o || this.get();
	};

	/**
	 * Для иерархических справочников возвращает путь элемента
	 * @param ref {String|CatObj} - ссылка или объект данных
	 * @return {string} - строка пути элемента
	 */
	path(ref) {
		var res = [], tobj;

		if (ref instanceof DataObj)
			tobj = ref;
		else
			tobj = this.get(ref, true);

		if (tobj)
			res.push({ref: tobj.ref, presentation: tobj.presentation});

		if (tobj && this.metadata().hierarchical) {
			while (true) {
				tobj = tobj.parent;
				if (tobj.empty())
					break;
				res.push({ref: tobj.ref, presentation: tobj.presentation});
			}
		}

		return res;
	};

}

/**
 * ### Абстрактный менеджер плана видов характеристик
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfCharacteristics"}}{{/crossLink}}
 *
 * @class ChartOfCharacteristicManager
 * @extends CatManager
 * @constructor
 * @param className {string}
 */
export class ChartOfCharacteristicManager extends CatManager{

}

/**
 * ### Абстрактный менеджер документов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Documents"}}{{/crossLink}}
 *
 * @extends RefDataManager
 * @param className {string}
 */
export class DocManager extends RefDataManager{

}


