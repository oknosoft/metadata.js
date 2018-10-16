/**
 * ### Moment для операций с интервалами и датами
 *
 * @property moment
 * @type Function
 * @final
 */


const moment = require('moment');
require('moment/locale/ru');
moment.locale('ru');
moment._masks = {
	date: 'DD.MM.YY',
	date_time: 'DD.MM.YYYY HH:mm',
	ldt: 'DD MMM YYYY, HH:mm',
	iso: 'YYYY-MM-DDTHH:mm:ss',
};
if(typeof global != 'undefined'){
  global.moment = moment;
}

import {DataManager, EnumManager} from './mngrs';
import {DataObj, DocObj} from './objs';
import {TabularSection, TabularSectionRow} from './tabulars';

/**
 * Отбрасываем часовой пояс при сериализации даты
 * @method toJSON
 * @for Date
 */
Date.prototype.toJSON = Date.prototype.toISOString = function () {
	return moment(this).format(moment._masks.iso);
};


/**
 * Метод округления в прототип числа
 * @method round
 * @for Number
 */
if (!Number.prototype.round) {
	Number.prototype.round = function (places) {
		var multiplier = Math.pow(10, places || 0);
		return (Math.round(this * multiplier) / multiplier);
	};
}

/**
 * Метод дополнения лидирующими нулями в прототип числа
 * @method pad
 * @for Number
 *
 * @example
 *      (5).pad(6) // '000005'
 */
if (!Number.prototype.pad) {
	Number.prototype.pad = function (size) {
		var s = String(this);
		while (s.length < (size || 2)) {
			s = '0' + s;
		}
		return s;
	};
}

/**
 * Создаёт копию объекта
 * @method _clone
 * @for Object
 * @param src {Object|Array} - исходный объект
 * @param [exclude] {Array} - объект, в ключах которого имена свойств, которые не надо копировать
 * @returns {Object|Array} - копия объекта
 */
if (!Object.prototype._clone) {
	Object.defineProperty(Object.prototype, '_clone', {
		value: function () {
			return utils._clone(this);
		},
	});
}

/**
 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
 * @method _mixin
 * @for Object
 * @param src {Object} - источник
 * @param include {Array}
 * @param exclude {Array}
 * @return {Object}
 */
if (!Object.prototype._mixin) {
	Object.defineProperty(Object.prototype, '_mixin', {
		value: function (src, include, exclude) {
			return utils._mixin(this, src, include, exclude);
		},
	});
}

/**
 * Синтаксический сахар для defineProperty
 * @method __define
 * @for Object
 */
if (!Object.prototype.__define) {
	Object.defineProperty(Object.prototype, '__define', {
		value: function (key, descriptor) {
			if (descriptor) {
				Object.defineProperty(this, key, descriptor);
			} else {
				Object.defineProperties(this, key);
			}
			return this;
		},
	});
}

const date_frmts = ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm', 'YYYYDDMMHHmmss', moment.ISO_8601];
const rxref = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
const utils = {

	moment,

  /**
   * Загружает скрипты и стили синхронно и асинхронно
   * @method load_script
   * @for MetaEngine
   * @param src {String} - url ресурса
   * @param type {String} - "link" или "script"
   * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
   * @async
   */
  load_script(src, type, callback) {

    return new Promise((resolve, reject) => {

      const s = document.createElement(type);
      if (type == 'script') {
        s.type = 'text/javascript';
        s.src = src;
        s.async = true;
        const listener = () => {
          s.removeEventListener('load', listener);
          callback && callback();
          resolve();
        };
        s.addEventListener('load', listener, false);
      }
      else {
        s.type = 'text/css';
        s.rel = 'stylesheet';
        s.href = src;
      }
      document.head.appendChild(s);

      (type != 'script') && resolve();

    });
  },

	/**
	 * ### Приводит значение к типу Дата
	 *
	 * @method fix_date
	 * @param str {String|Number|Date} - приводиме значение
	 * @param [strict=false] {Boolean} - если истина и значение не приводится к дате, возвращать пустую дату
	 * @return {Date|*}
	 */
	fix_date(str, strict) {
		if (str instanceof Date || (!strict && (this.is_guid(str) || (str && (str.length === 11 || str.length === 9))))){
      return str;
    }
		else {
			const m = moment(str, date_frmts);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	},

	/**
	 * ### Извлекает guid из строки или ссылки или объекта
	 *
	 * @method fix_guid
	 * @param ref {*} - значение, из которого надо извлечь идентификатор
	 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
	 * @return {String}
	 */
	fix_guid(ref, generate) {

		if (ref && typeof ref == 'string') {

		}
		else if (ref instanceof DataObj) {
			return ref.ref;
		}
		else if (ref && typeof ref == 'object') {
			if (ref.hasOwnProperty('presentation')) {
				if (ref.hasOwnProperty('ref')){
          return ref.ref || this.blank.guid;
        }
				else if (ref.hasOwnProperty('name')){
          return ref.name;
        }
			}
			else {
				ref = (typeof ref.ref == 'object' && ref.ref.hasOwnProperty('ref')) ? ref.ref.ref : ref.ref;
			}
		}

		if (generate === false || this.is_guid(ref)) {
			return ref;
		}
		else if (generate) {
			return this.generate_guid();
		}
		return this.blank.guid;
	},

	/**
	 * ### Приводит значение к типу Число
	 *
	 * @method fix_number
	 * @param str {*} - приводиме значение
	 * @param [strict=false] {Boolean} - конвертировать NaN в 0
	 * @return {Number}
	 */
	fix_number(str, strict) {
		const v = parseFloat(str);
		if (!isNaN(v)) {
			return v;
		}
		else if (strict) {
			return 0;
		}
		return str;
	},

	/**
	 * ### Приводит значение к типу Булево
	 *
	 * @method fix_boolean
	 * @param str {String}
	 * @return {boolean}
	 */
	fix_boolean(str) {
		if (typeof str === 'string') {
			return !(!str || str.toLowerCase() == 'false');
		}
		return !!str;
	},

	/**
	 * ### Приводит тип значения v к типу метаданных
	 *
	 * @method fetch_type
	 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
	 * @param type {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	fetch_type(str, type) {
		if (type.is_ref) {
      if(type.types && type.types.some((type) => type.indexOf('enm') == 0 || type.indexOf('string') == 0)){
        return str;
      }
			return this.fix_guid(str);
		}
		if (type.date_part) {
			return this.fix_date(str, true);
		}
		if (type['digits']) {
			return this.fix_number(str, true);
		}
		if (type.types && type.types[0] == 'boolean') {
			return this.fix_boolean(str);
		}
		return str;
	},

	/**
	 * ### Добавляет days дней к дате
	 *
	 * @method date_add_day
	 * @param date {Date} - исходная дата
	 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
	 * @return {Date}
	 */
	date_add_day(date, days, reset_time) {
		const newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if (reset_time) {
			newDt.setHours(0, -newDt.getTimezoneOffset(), 0, 0);
		}
		return newDt;
	},

	/**
	 * ### Генерирует новый guid
	 *
	 * @method generate_guid
	 * @return {String}
	 */
	generate_guid() {
		let d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
	},

	/**
	 * ### Проверяет, является ли значение guid-ом
	 *
	 * @method is_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
	 */
	is_guid(v) {
		if (typeof v !== 'string' || v.length < 36) {
			return false;
		}
		else if (v.length > 36) {
			const parts = v.split('|');
			v = parts.length == 2 ? parts[1] : v.substr(0, 36);
		}
		return rxref.test(v);
	},

	/**
	 * ### Проверяет, является ли значение пустым идентификатором
	 *
	 * @method is_empty_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если v эквивалентен пустому guid
	 */
	is_empty_guid(v) {
		return !v || v === this.blank.guid;
	},

	/**
	 * ### Проверяет, является ли значенние Data-объектным типом
	 *
	 * @method is_data_obj
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	is_data_obj(v) {
		return v instanceof DataObj;
	},

  /**
   * ### Проверяет, является ли значенние Data-документом
   *
   * @method is_doc_obj
   * @param v {*} - проверяемое значение
   * @return {Boolean} - true, если значение является ссылкой
   */
  is_doc_obj(v) {
    return v instanceof DocObj;
  },

	/**
	 * ### Проверяет, является ли значенние менеджером объектов данных
	 *
	 * @method is_data_mgr
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является менеджером данных
	 */
	is_data_mgr(v) {
		return v instanceof DataManager;
	},

  /**
   * ### Проверяет, является ли значенние менеджером перечисления
   *
   * @method is_enm_mgr
   * @param v {*} - проверяемое значение
   * @return {Boolean} - true, если значение является менеджером данных
   */
  is_enm_mgr(v) {
    return v instanceof EnumManager;
  },

  /**
   * ### Проверяет, является ли значенние табличной частью или строкой табличной части
   *
   * @method is_tabular
   * @param v {*} - проверяемое значение
   * @return {Boolean} - true, если значение является табличной частью
   */
  is_tabular(v) {
    return v instanceof TabularSectionRow || v instanceof TabularSection;
  },

	/**
	 * ### Сравнивает на равенство ссылочные типы и примитивные значения
	 *
	 * @method is_equal
	 * @param v1 {DataObj|String}
	 * @param v2 {DataObj|String}
	 * @return {boolean} - true, если значенния эквивалентны
	 */
	is_equal(v1, v2) {
		if (v1 == v2) {
			return true;
		}
		else if (typeof v1 === 'string' && typeof v2 === 'string' && v1.trim() === v2.trim()) {
			return true;
		}
		else if (typeof v1 === typeof v2) {
			return false;
		}
		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	},

  /**
   * Заменяет в ссылке минусы '_' и добавляет '_' в начало
   * @param ref
   * @return {string}
   */
  snake_ref(ref) {
    return '_' + ref.replace(/-/g, '_');
  },

	/**
	 * ### Читает данные из блоба
	 * Возвращает промис с прочитанными данными
	 *
	 * @param blob {Blob}
	 * @param [type] {String} - если type == "data_url", в промисе будет возвращен DataURL, а не текст
	 * @return {Promise}
	 */
	blob_as_text(blob, type) {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      switch (type) {
        case "array" :
          reader.readAsArrayBuffer(blob);
          break;
        case "data_url":
          reader.readAsDataURL(blob);
          break;
        default:
          reader.readAsText(blob);
      }
    });

	},

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
	 * @method get_and_show_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param [method] {String}
	 * @async
	 */
	get_and_show_blob(url, post_data, method) {

		var params = 'menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes',
			req;

		function show_blob(req) {
			url = window.URL.createObjectURL(req.response);
			var wnd_print = window.open(url, 'wnd_print', params);
			wnd_print.onload = (e) => window.URL.revokeObjectURL(url);
			return wnd_print;
		}

		if (!method || (typeof method == 'string' && method.toLowerCase().indexOf('post') != -1))
			req = this.post_ex(url,
				typeof post_data == 'object' ? JSON.stringify(post_data) : post_data,
				true,
				xhr => xhr.responseType = 'blob');
		else
			req = this.get_ex(url, true, xhr => xhr.responseType = 'blob');

		return show_blob(req);
	},

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает диалог сохранения в файл
	 * @method get_and_save_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param file_name {String} - имя файла для сохранения
	 * @return {Promise.<T>}
	 */
	get_and_save_blob(url, post_data, file_name) {

		return this.post_ex(url,
			typeof post_data == 'object' ? JSON.stringify(post_data) : post_data, true, function (xhr) {
				xhr.responseType = 'blob';
			})
			.then(function (req) {
				saveAs(req.response, file_name);
			});
	},

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param obj {Object} - приемник
	 * @param src {Object} - источник
	 * @param include {Array}
	 * @param exclude {Array}
	 * @return {Object}
	 */
	_mixin(obj, src, include, exclude) {
		const tobj = {}; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа

		function exclude_cpy(f) {
			if (!(exclude && exclude.includes(f))) {
				// копируем в dst свойства src, кроме тех, которые унаследованы от Object
				if ((typeof tobj[f] == 'undefined') || (tobj[f] != src[f])) {
					obj[f] = src[f];
				}
			}
		}

    if(include && include.length) {
      for (let i = 0; i < include.length; i++) {
        exclude_cpy(include[i]);
      }
    }
    else {
      for (let f in src) {
        exclude_cpy(f);
      }
    }
		return obj;

	},

	/**
	 * ### Подмешивает в объект свойства с иерархией объекта patch
	 * В отличии от `_mixin`, не замещает, а дополняет одноименные свойства
	 *
	 * @method _patch
	 * @param obj {Object}
	 * @param patch {Object}
	 * @return {Object} - исходный объект с подмешанными свойствами
	 */
	_patch(obj, patch) {
		for (let area in patch) {
			if (typeof patch[area] == 'object') {
				if (obj[area] && typeof obj[area] == 'object') {
					this._patch(obj[area], patch[area]);
				}
				else {
					obj[area] = patch[area];
				}
			} else {
				obj[area] = patch[area];
			}
		}
		return obj;
	},

	/**
	 * ### Создаёт копию объекта и вложенных объектов
	 * @method _clone
	 * @for Object
	 * @param obj {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	_clone(obj) {
		if (!obj || 'object' !== typeof obj)
			return obj;
		var p, v, c = 'function' === typeof obj.pop ? [] : {};
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				v = obj[p];
				if (v) {
					if ('function' === typeof v || v instanceof DataObj || v instanceof DataManager || v instanceof Date)
						c[p] = v;

					else if ('object' === typeof v)
						c[p] = this._clone(v);

					else
						c[p] = v;
				} else
					c[p] = v;
			}
		}
		return c;
	},

	/**
	 * Абстрактный поиск значения в коллекции
	 * @method _find
	 * @param src {Array|Object}
	 * @param val {DataObj|String}
	 * @param columns {Array|String} - имена полей, в которых искать
	 * @return {*}
	 * @private
	 */
	_find(src, val, columns) {
		if (typeof val != 'object') {
			for (let i in src) { // ищем по всем полям объекта
				const o = src[i];
				for (let j in o) {
					if (typeof o[j] !== 'function' && utils.is_equal(o[j], val)) {
						return o;
					}
				}
			}
		} else {
			for (let i in src) { // ищем по ключам из val
				const o = src[i];
				let finded = true;
				for (let j in val) {
					if (typeof o[j] !== 'function' && !utils.is_equal(o[j], val[j])) {
						finded = false;
						break;
					}
				}
				if (finded) {
					return o;
				}
			}
		}
	},

  /**
   * Сравнивает левое значение с правым
   * @param left              {Any}
   * @param right             {Any}
   * @param comparison_type   {EnumObj}
   * @param comparison_types  {EnumManager}
   * @return {*}
   */
  check_compare(left, right, comparison_type, comparison_types) {
      const {ne, gt, gte, lt, lte, nin, inh, ninh, lke, nlk} = comparison_types;
      switch (comparison_type) {
      case ne:
        return left != right;
      case gt:
        return left > right;
      case gte:
        return left >= right;
      case lt:
        return left < right;
      case lte:
        return left <= right;
      case nin:
        if(Array.isArray(left) && !Array.isArray(right)) {
          return left.indexOf(right) == -1;
        }
        else if(!Array.isArray(left) && Array.isArray(right)) {
          return right.indexOf(left) == -1;
        }
        else if(!Array.isArray(left) && !Array.isArray(right)) {
          return right != left;
        }
        break;
      case comparison_types.in:
        if(Array.isArray(left) && !Array.isArray(right)) {
          return left.indexOf(right) != -1;
        }
        else if(!Array.isArray(left) && Array.isArray(right)) {
          return right.indexOf(left) != -1;
        }
        else if(!Array.isArray(left) && !Array.isArray(right)) {
          return left == right;
        }
        break;
      case inh:
        return utils.is_data_obj(left) ? left._hierarchy(right) : left == right;
      case ninh:
        return utils.is_data_obj(left) ? !left._hierarchy(right) : left != right;
      case lke:
        return left.indexOf && right && left.indexOf(right) !== -1;
      case nlk:
        return left.indexOf && left.indexOf(right) === -1;
      default:
        return left == right;
      }
    },

	/**
	 * Выясняет, удовлетворяет ли объект `o` условию `selection`
	 * @method _selection
	 * @param o {Object}
	 * @param [selection]
	 * @private
	 */
	_selection(o, selection) {

		let ok = true;

		if (selection) {
			// если отбор является функцией, выполняем её, передав контекст
			if (typeof selection == 'function') {
				ok = selection.call(this, o);
			}
			else {
				// бежим по всем свойствам `selection`
				for (let j in selection) {

					const sel = selection[j];
					const is_obj = sel && typeof(sel) === 'object';

					// пропускаем служебные свойства
					if (j.substr(0, 1) == '_') {
						continue;
					}
					// если свойство отбора является функцией, выполняем её, передав контекст
					else if (typeof sel == 'function') {
						ok = sel.call(this, o, j);
						if (!ok)
							break;
					}
					// если свойство отбора является объектом `or`, выполняем Array.some() TODO: здесь напрашивается рекурсия
					else if (j == 'or' && Array.isArray(sel)) {
						ok = sel.some((el) => {
							const key = Object.keys(el)[0];
							if (el[key].hasOwnProperty('like'))
								return o[key] && o[key].toLowerCase().indexOf(el[key].like.toLowerCase()) != -1;
							else
								return utils.is_equal(o[key], el[key]);
						});
						if (!ok)
							break;
					}
					// если свойство отбора является объектом `like`, сравниваем подстроку
					else if (is_obj && sel.hasOwnProperty('like')) {
						if (!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase()) == -1) {
							ok = false;
							break;
						}
					}
					// это синоним `like`
          else if (is_obj && sel.hasOwnProperty('lke')) {
            if (!o[j] || o[j].toLowerCase().indexOf(sel.lke.toLowerCase()) == -1) {
              ok = false;
              break;
            }
          }
          // это вид сравнения `не содержит`
          else if (is_obj && sel.hasOwnProperty('nlk')) {
            if (o[j] && o[j].toLowerCase().indexOf(sel.nlk.toLowerCase()) != -1) {
              ok = false;
              break;
            }
          }
					// если свойство отбора является объектом `not`, сравниваем на неравенство
					else if (is_obj && (sel.hasOwnProperty('not') || sel.hasOwnProperty('$ne'))) {
					  const not = sel.hasOwnProperty('not') ? sel.not : sel.$ne;
						if (utils.is_equal(o[j], not)) {
							ok = false;
							break;
						}
					}
					// если свойство отбора является объектом `in`, выполняем Array.some()
					else if (is_obj && (sel.hasOwnProperty('in') || sel.hasOwnProperty('$in'))) {
					  const arr = sel.in || sel.$in;
						ok = arr.some((el) => utils.is_equal(el, o[j]));
						if (!ok)
							break;
					}
          // если свойство отбора является объектом `inh`, вычисляем иерархию
          else if (is_obj && sel.hasOwnProperty('inh')) {
            ok = j === 'ref' ? o._hierarchy && o._hierarchy(sel.inh) : o[j]._hierarchy && o[j]._hierarchy(sel.inh);
            if (!ok)
              break;
          }
          // если свойство отбора является объектом `ninh`, вычисляем иерархию
          else if (is_obj && sel.hasOwnProperty('ninh')) {
            ok = !(j === 'ref' ? o._hierarchy && o._hierarchy(sel.inh) : o[j]._hierarchy && o[j]._hierarchy(sel.inh));
            if (!ok)
              break;
          }
					// если свойство отбора является объектом `lt`, сравниваем на _меньше_
					else if (is_obj && sel.hasOwnProperty('lt')) {
						ok = o[j] < sel.lt;
						if (!ok)
							break;
					}
					// если свойство отбора является объектом `gt`, сравниваем на _больше_
					else if (is_obj && sel.hasOwnProperty('gt')) {
						ok = o[j] > sel.gt;
						if (!ok)
							break;
					}
					// если свойство отбора является объектом `between`, сравниваем на _вхождение_
					else if (is_obj && sel.hasOwnProperty('between')) {
						var tmp = o[j];
						if (typeof tmp != 'number')
							tmp = utils.fix_date(o[j]);
						ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
						if (!ok)
							break;
					}
					else if (!utils.is_equal(o[j], sel)) {
						ok = false;
						break;
					}
				}
			}
		}

		return ok;
	},

	/**
	 * ### Поиск массива значений в коллекции
	 * Кроме стандартного поиска по равенству значений,
	 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
	 * @method _find_rows
	 * @param src {Object|Array}
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param callback {Function}
	 * @return {Array}
	 * @private
	 */
	_find_rows(src, selection, callback) {

		const res = [];
		let top, skip, count = 0, skipped = 0;

    if(selection) {
      if(selection.hasOwnProperty('_top')) {
        top = selection._top;
        delete selection._top;
      }
      else {
        top = 300;
      }
      if(selection.hasOwnProperty('_skip')) {
        skip = selection._skip;
        delete selection._skip;
      }
      else {
        skip = 0;
      }
    }

		for (let i in src) {
			const o = src[i];
			// выполняем колбэк с элементом и пополняем итоговый массив
			if (utils._selection.call(this, o, selection)) {
			  if(skip){
          skipped++;
          if (skipped <= skip) {
            continue;
          }
        }
				if (callback) {
					if (callback.call(this, o) === false) {
						break;
					}
				} else {
					res.push(o);
				}
				// ограничиваем кол-во возвращаемых элементов
				if (top) {
					count++;
					if (count >= top) {
						break;
					}
				}
			}

		}
		return res;
	},

};

/**
 * ### Пустые значения даты и уникального идентификатора
 *
 * @property blank
 * @type Blank
 * @final
 */
utils.__define('blank', {
	value: Object.freeze({
		date: utils.fix_date('0001-01-01T00:00:00'),
		guid: '00000000-0000-0000-0000-000000000000',
		by_type: function (mtype) {
			let v;
			if (mtype.is_ref)
				v = this.guid;
			else if (mtype.date_part)
				v = this.date;
			else if (mtype['digits'])
				v = 0;
			else if (mtype.types && mtype.types[0] == 'boolean')
				v = false;
			else
				v = '';
			return v;
		},
	}),
	enumerable: true,
	configurable: false,
	writable: false,
});

export default utils;

