
/**
 * ### Moment для операций с интервалами и датами
 *
 * @property moment
 * @type Function
 * @final
 */
const moment = require('moment');
const moment_ru = require('moment/locale/ru.js');
moment._masks = {
	date:       "DD.MM.YY",
	date_time:  "DD.MM.YYYY HH:mm",
	ldt:        "DD MMMM YYYY, HH:mm",
	iso:        "YYYY-MM-DDTHH:mm:ss"
};

/**
 * ### alasql для работы с кешируемым данным
 */
const alasql = require("alasql/dist/alasql.js")


/**
 * Метод округления в прототип числа
 * @method round
 * @for Number
 */
if(!Number.prototype.round)
	Number.prototype.round = function(places) {
		var multiplier = Math.pow(10, places);
		return (Math.round(this * multiplier) / multiplier);
	};

/**
 * Метод дополнения лидирующими нулями в прототип числа
 * @method pad
 * @for Number
 *
 * @example
 *      (5).pad(6) // '000005'
 */
if(!Number.prototype.pad)
	Number.prototype.pad = function(size) {
		var s = String(this);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};



/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
class Utils{

	constructor() {

		this.moment = moment;

		/**
		 * ### Пустые значения даты и уникального идентификатора
		 *
		 * @property blank
		 * @type Blank
		 * @final
		 */
		this.blank = {
			date: this.fix_date("0001-01-01T00:00:00"),
			guid: "00000000-0000-0000-0000-000000000000",
			by_type: function(mtype){
				var v;
				if(mtype.is_ref)
					v = this.guid;
				else if(mtype.date_part)
					v = this.date;
				else if(mtype["digits"])
					v = 0;
				else if(mtype.types && mtype.types[0]=="boolean")
					v = false;
				else
					v = "";
				return v;
			}
		};

	}

	/**
	 * ### Приводит значение к типу Дата
	 *
	 * @method fix_date
	 * @param str {String|Number|Date} - приводиме значение
	 * @param [strict=false] {Boolean} - если истина и значение не приводится к дате, возвращать пустую дату
	 * @return {Date|*}
	 */
	fix_date(str, strict) {

		if (str instanceof Date)
			return str;
		else {
			var m = moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", moment.ISO_8601]);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	}

	/**
	 * ### Извлекает guid из строки или ссылки или объекта
	 *
	 * @method fix_guid
	 * @param ref {*} - значение, из которого надо извлечь идентификатор
	 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
	 * @return {String}
	 */
	fix_guid(ref, generate) {

		if (ref && typeof ref == "string") {

		} else if (ref instanceof DataObj)
			return ref.ref;

		else if (ref && typeof ref == "object") {
			if (ref.presentation) {
				if (ref.ref)
					return ref.ref;
				else if (ref.name)
					return ref.name;
			}
			else
				ref = (typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref")) ? ref.ref.ref : ref.ref;
		}

		if (this.is_guid(ref) || generate === false)
			return ref;

		else if (generate)
			return this.generate_guid();

		else
			return this.blank.guid;
	}

	/**
	 * ### Приводит значение к типу Число
	 *
	 * @method fix_number
	 * @param str {*} - приводиме значение
	 * @param [strict=false] {Boolean} - конвертировать NaN в 0
	 * @return {Number}
	 */
	fix_number(str, strict) {
		var v = parseFloat(str);
		if (!isNaN(v))
			return v;
		else if (strict)
			return 0;
		else
			return str;
	}

	/**
	 * ### Приводит значение к типу Булево
	 *
	 * @method fix_boolean
	 * @param str {String}
	 * @return {boolean}
	 */
	fix_boolean(str) {
		if (typeof str === "string")
			return !(!str || str.toLowerCase() == "false");
		else
			return !!str;
	}


	/**
	 * ### Приводит тип значения v к типу метаданных
	 *
	 * @method fetch_type
	 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
	 * @param mtype {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	fetch_type(str, mtype) {
		var v = str;
		if (mtype.is_ref)
			v = this.fix_guid(str);
		else if (mtype.date_part)
			v = this.fix_date(str, true);
		else if (mtype["digits"])
			v = this.fix_number(str, true);
		else if (mtype.types[0] == "boolean")
			v = this.fix_boolean(str);
		return v;
	}

	/**
	 * ### Добавляет days дней к дате
	 *
	 * @method date_add_day
	 * @param date {Date} - исходная дата
	 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
	 * @return {Date}
	 */
	date_add_day(date, days, reset_time) {
		var newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if (reset_time)
			newDt.setHours(0, -newDt.getTimezoneOffset(), 0, 0);
		return newDt;
	}

	/**
	 * ### Генерирует новый guid
	 *
	 * @method generate_guid
	 * @return {String}
	 */
	generate_guid() {
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
	}

	/**
	 * ### Проверяет, является ли значение guid-ом
	 *
	 * @method is_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
	 */
	is_guid(v) {
		if (typeof v !== "string" || v.length < 36)
			return false;
		else if (v.length > 36)
			v = v.substr(0, 36);
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
	}

	/**
	 * ### Проверяет, является ли значение пустым идентификатором
	 *
	 * @method is_empty_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если v эквивалентен пустому guid
	 */
	is_empty_guid(v) {
		return !v || v === this.blank.guid;
	}

	/**
	 * ### Проверяет, является ли значенние Data-объектным типом
	 *
	 * @method is_data_obj
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	is_data_obj(v) {
		return v && v instanceof DataObj;
	}

	/**
	 * ### Проверяет, является ли значенние менеджером объектов данных
	 *
	 * @method is_data_mgr
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	is_data_mgr(v) {
		return v && v instanceof classes.DataManager;
	}

	/**
	 * ### Сравнивает на равенство ссылочные типы и примитивные значения
	 *
	 * @method is_equal
	 * @param v1 {DataObj|String}
	 * @param v2 {DataObj|String}
	 * @return {boolean} - true, если значенния эквивалентны
	 */
	is_equal(v1, v2) {

		if (v1 == v2){
			return true;

		}else if(typeof v1 === 'string' &&  typeof v2 === 'string' && v1.trim() === v2.trim()){
			return true;

		}else if (typeof v1 === typeof v2){
			return false;
		}

		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	}

	/**
	 * ### Читает данные из блоба
	 * Возвращает промис с прочитанными данными
	 *
	 * @param blob {Blob}
	 * @param [type] {String} - если type == "data_url", в промисе будет возвращен DataURL, а не текст
	 * @return {Promise}
	 */
	blob_as_text(blob, type) {

		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			reader.onload = function (event) {
				resolve(reader.result);
			};
			reader.onerror = function (err) {
				reject(err);
			};
			if (type == "data_url")
				reader.readAsDataURL(blob);
			else
				reader.readAsText(blob);
		});

	}

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
	 * @method get_and_show_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param [method] {String}
	 * @async
	 */
	get_and_show_blob(url, post_data, method) {

		var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
			req;

		function show_blob(req) {
			url = window.URL.createObjectURL(req.response);
			var wnd_print = window.open(url, "wnd_print", params);
			wnd_print.onload = (e) => window.URL.revokeObjectURL(url);
			return wnd_print;
		}

		if (!method || (typeof method == "string" && method.toLowerCase().indexOf("post") != -1))
			req = this.post_ex(url,
				typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
				true,
				xhr => xhr.responseType = "blob");
		else
			req = this.get_ex(url, true, xhr => xhr.responseType = "blob");

		return show_blob(req)
	}

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
			typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function (xhr) {
				xhr.responseType = "blob";
			})
			.then(function (req) {
				saveAs(req.response, file_name);
			});
	}

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param src {Object} - источник
	 * @return {Object}
	 */
	_mixin(obj, src, include, exclude) {
		var tobj = {}, i, f; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа
		if (include && include.length) {
			for (i = 0; i < include.length; i++) {
				f = include[i];
				if (exclude && exclude.indexOf(f) != -1)
					continue;
				// копируем в dst свойства src, кроме тех, которые унаследованы от Object
				if ((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
					obj[f] = src[f];
			}
		} else {
			for (f in src) {
				if (exclude && exclude.indexOf(f) != -1)
					continue;
				// копируем в dst свойства src, кроме тех, которые унаследованы от Object
				if ((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
					obj[f] = src[f];
			}
		}
		return obj;

	}

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
		for (var area in patch) {

			if (typeof patch[area] == "object") {
				if (obj[area] && typeof obj[area] == "object")
					this._patch(obj[area], patch[area]);
				else
					obj[area] = patch[area];
			} else
				obj[area] = patch[area];
		}
		return obj;
	}

	/**
	 * Создаёт копию объекта
	 * @method _clone
	 * @for Object
	 * @param obj {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	_clone(obj) {
		if (!obj || "object" !== typeof obj)
			return obj;
		var p, v, c = "function" === typeof obj.pop ? [] : {};
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				v = obj[p];
				if (v) {
					if ("function" === typeof v || v instanceof DataObj || v instanceof classes.DataManager || v instanceof Date)
						c[p] = v;

					else if ("object" === typeof v)
						c[p] = this._clone(v);

					else
						c[p] = v;
				} else
					c[p] = v;
			}
		}
		return c;
	}

	/**
	 * Абстрактный поиск значения в коллекции
	 * @method _find
	 * @param a {Array}
	 * @param val {DataObj|String}
	 * @param val {Array|String} - имена полей, в которых искать
	 * @return {*}
	 * @private
	 */
	_find(a, val, columns) {
		//TODO переписать с учетом html5 свойств массивов
		var o, i, finded;
		if (typeof val != "object") {
			for (i in a) { // ищем по всем полям объекта
				o = a[i];
				for (var j in o) {
					if (typeof o[j] !== "function" && utils.is_equal(o[j], val))
						return o;
				}
			}
		} else {
			for (i in a) { // ищем по ключам из val
				o = a[i];
				finded = true;
				for (var j in val) {
					if (typeof o[j] !== "function" && !utils.is_equal(o[j], val[j])) {
						finded = false;
						break;
					}
				}
				if (finded)
					return o;
			}
		}
	}


	/**
	 * Выясняет, удовлетворяет ли объект `o` условию `selection`
	 * @method _selection
	 * @param o {Object}
	 * @param [selection]
	 * @private
	 */
	_selection(o, selection) {

		var ok = true, j, sel, is_obj;

		if (selection) {
			// если отбор является функцией, выполняем её, передав контекст
			if (typeof selection == "function")
				ok = selection.call(this, o);

			else {
				// бежим по всем свойствам `selection`
				for (j in selection) {

					sel = selection[j];
					is_obj = typeof(sel) === "object";

					// пропускаем служебные свойства
					if (j.substr(0, 1) == "_")
						continue;

					// если свойство отбора является функцией, выполняем её, передав контекст
					else if (typeof sel == "function") {
						ok = sel.call(this, o, j);
						if (!ok)
							break;

						// если свойство отбора является объектом `or`, выполняем Array.some() TODO: здесь напрашивается рекурсия
					} else if (j == "or" && Array.isArray(sel)) {
						ok = sel.some(function (element) {
							var key = Object.keys(element)[0];
							if (element[key].hasOwnProperty("like"))
								return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase()) != -1;
							else
								return utils.is_equal(o[key], element[key]);
						});
						if (!ok)
							break;

						// если свойство отбора является объектом `like`, сравниваем подстроку
					} else if (is_obj && sel.hasOwnProperty("like")) {
						if (!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase()) == -1) {
							ok = false;
							break;
						}

						// если свойство отбора является объектом `not`, сравниваем на неравенство
					} else if (is_obj && sel.hasOwnProperty("not")) {
						if (utils.is_equal(o[j], sel.not)) {
							ok = false;
							break;
						}

						// если свойство отбора является объектом `in`, выполняем Array.some()
					} else if (is_obj && sel.hasOwnProperty("in")) {
						ok = sel.in.some(function (element) {
							return utils.is_equal(element, o[j]);
						});
						if (!ok)
							break;

						// если свойство отбора является объектом `lt`, сравниваем на _меньше_
					} else if (is_obj && sel.hasOwnProperty("lt")) {
						ok = o[j] < sel.lt;
						if (!ok)
							break;

						// если свойство отбора является объектом `gt`, сравниваем на _больше_
					} else if (is_obj && sel.hasOwnProperty("gt")) {
						ok = o[j] > sel.gt;
						if (!ok)
							break;

						// если свойство отбора является объектом `between`, сравниваем на _вхождение_
					} else if (is_obj && sel.hasOwnProperty("between")) {
						var tmp = o[j];
						if (typeof tmp != "number")
							tmp = utils.fix_date(o[j]);
						ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
						if (!ok)
							break;

					} else if (!utils.is_equal(o[j], sel)) {
						ok = false;
						break;
					}
				}
			}
		}

		return ok;
	}


	/**
	 * ### Поиск массива значений в коллекции
	 * Кроме стандартного поиска по равенству значений,
	 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
	 * @method _find_rows
	 * @param arr {Array}
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param callback {Function}
	 * @return {Array}
	 * @private
	 */
	_find_rows(arr, selection, callback) {

		var o, res = [], top, count = 0;

		if (selection) {
			if (selection._top) {
				top = selection._top;
				delete selection._top;
			} else
				top = 300;
		}

		for (var i in arr) {
			o = arr[i];

			// выполняем колбэк с элементом и пополняем итоговый массив
			if (utils._selection.call(this, o, selection)) {
				if (callback) {
					if (callback.call(this, o) === false)
						break;
				} else
					res.push(o);

				// ограничиваем кол-во возвращаемых элементов
				if (top) {
					count++;
					if (count >= top)
						break;
				}
			}

		}
		return res;
	}

}

const utils = new Utils();

/**
 * Здесь живут ссылки на конструкторы классов
 * @type {{}}
 */
export const classes = {};
