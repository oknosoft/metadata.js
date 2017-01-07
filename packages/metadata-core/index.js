'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.classes = undefined;

var _metadataAbstractAdapter = require('metadata-abstract-adapter');

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
	date: "DD.MM.YY",
	date_time: "DD.MM.YYYY HH:mm",
	ldt: "DD MMMM YYYY, HH:mm",
	iso: "YYYY-MM-DDTHH:mm:ss"
};

/**
 * ### alasql для работы с кешируемым данным
 */
const alasql = require("alasql/dist/alasql.js");

/**
 * Метод округления в прототип числа
 * @method round
 * @for Number
 */
if (!Number.prototype.round) Number.prototype.round = function (places) {
	var multiplier = Math.pow(10, places);
	return Math.round(this * multiplier) / multiplier;
};

/**
 * Метод дополнения лидирующими нулями в прототип числа
 * @method pad
 * @for Number
 *
 * @example
 *      (5).pad(6) // '000005'
 */
if (!Number.prototype.pad) Number.prototype.pad = function (size) {
	var s = String(this);
	while (s.length < (size || 2)) {
		s = "0" + s;
	}
	return s;
};

/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
class Utils {

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
			by_type: function (mtype) {
				var v;
				if (mtype.is_ref) v = this.guid;else if (mtype.date_part) v = this.date;else if (mtype["digits"]) v = 0;else if (mtype.types && mtype.types[0] == "boolean") v = false;else v = "";
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

		if (str instanceof Date) return str;else {
			var m = moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", moment.ISO_8601]);
			return m.isValid() ? m.toDate() : strict ? this.blank.date : str;
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

		if (ref && typeof ref == "string") {} else if (ref instanceof DataObj) return ref.ref;else if (ref && typeof ref == "object") {
			if (ref.presentation) {
				if (ref.ref) return ref.ref;else if (ref.name) return ref.name;
			} else ref = typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref") ? ref.ref.ref : ref.ref;
		}

		if (this.is_guid(ref) || generate === false) return ref;else if (generate) return this.generate_guid();else return this.blank.guid;
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
		if (!isNaN(v)) return v;else if (strict) return 0;else return str;
	}

	/**
  * ### Приводит значение к типу Булево
  *
  * @method fix_boolean
  * @param str {String}
  * @return {boolean}
  */
	fix_boolean(str) {
		if (typeof str === "string") return !(!str || str.toLowerCase() == "false");else return !!str;
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
		if (mtype.is_ref) v = this.fix_guid(str);else if (mtype.date_part) v = this.fix_date(str, true);else if (mtype["digits"]) v = this.fix_number(str, true);else if (mtype.types[0] == "boolean") v = this.fix_boolean(str);
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
		if (reset_time) newDt.setHours(0, -newDt.getTimezoneOffset(), 0, 0);
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
			return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
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
		if (typeof v !== "string" || v.length < 36) return false;else if (v.length > 36) v = v.substr(0, 36);
		return (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
		);
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

		if (v1 == v2) {
			return true;
		} else if (typeof v1 === 'string' && typeof v2 === 'string' && v1.trim() === v2.trim()) {
			return true;
		} else if (typeof v1 === typeof v2) {
			return false;
		}

		return this.fix_guid(v1, false) == this.fix_guid(v2, false);
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
			if (type == "data_url") reader.readAsDataURL(blob);else reader.readAsText(blob);
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
			wnd_print.onload = e => window.URL.revokeObjectURL(url);
			return wnd_print;
		}

		if (!method || typeof method == "string" && method.toLowerCase().indexOf("post") != -1) req = this.post_ex(url, typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, xhr => xhr.responseType = "blob");else req = this.get_ex(url, true, xhr => xhr.responseType = "blob");

		return show_blob(req);
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

		return this.post_ex(url, typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function (xhr) {
			xhr.responseType = "blob";
		}).then(function (req) {
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
		var tobj = {},
		    i,
		    f; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа
		if (include && include.length) {
			for (i = 0; i < include.length; i++) {
				f = include[i];
				if (exclude && exclude.indexOf(f) != -1) continue;
				// копируем в dst свойства src, кроме тех, которые унаследованы от Object
				if (typeof tobj[f] == "undefined" || tobj[f] != src[f]) obj[f] = src[f];
			}
		} else {
			for (f in src) {
				if (exclude && exclude.indexOf(f) != -1) continue;
				// копируем в dst свойства src, кроме тех, которые унаследованы от Object
				if (typeof tobj[f] == "undefined" || tobj[f] != src[f]) obj[f] = src[f];
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
				if (obj[area] && typeof obj[area] == "object") this._patch(obj[area], patch[area]);else obj[area] = patch[area];
			} else obj[area] = patch[area];
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
		if (!obj || "object" !== typeof obj) return obj;
		var p,
		    v,
		    c = "function" === typeof obj.pop ? [] : {};
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				v = obj[p];
				if (v) {
					if ("function" === typeof v || v instanceof DataObj || v instanceof classes.DataManager || v instanceof Date) c[p] = v;else if ("object" === typeof v) c[p] = this._clone(v);else c[p] = v;
				} else c[p] = v;
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
			for (i in a) {
				// ищем по всем полям объекта
				o = a[i];
				for (var j in o) {
					if (typeof o[j] !== "function" && utils.is_equal(o[j], val)) return o;
				}
			}
		} else {
			for (i in a) {
				// ищем по ключам из val
				o = a[i];
				finded = true;
				for (var j in val) {
					if (typeof o[j] !== "function" && !utils.is_equal(o[j], val[j])) {
						finded = false;
						break;
					}
				}
				if (finded) return o;
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

		var ok = true,
		    j,
		    sel,
		    is_obj;

		if (selection) {
			// если отбор является функцией, выполняем её, передав контекст
			if (typeof selection == "function") ok = selection.call(this, o);else {
				// бежим по всем свойствам `selection`
				for (j in selection) {

					sel = selection[j];
					is_obj = typeof sel === "object";

					// пропускаем служебные свойства
					if (j.substr(0, 1) == "_") continue;

					// если свойство отбора является функцией, выполняем её, передав контекст
					else if (typeof sel == "function") {
							ok = sel.call(this, o, j);
							if (!ok) break;

							// если свойство отбора является объектом `or`, выполняем Array.some() TODO: здесь напрашивается рекурсия
						} else if (j == "or" && Array.isArray(sel)) {
							ok = sel.some(function (element) {
								var key = Object.keys(element)[0];
								if (element[key].hasOwnProperty("like")) return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase()) != -1;else return utils.is_equal(o[key], element[key]);
							});
							if (!ok) break;

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
							if (!ok) break;

							// если свойство отбора является объектом `lt`, сравниваем на _меньше_
						} else if (is_obj && sel.hasOwnProperty("lt")) {
							ok = o[j] < sel.lt;
							if (!ok) break;

							// если свойство отбора является объектом `gt`, сравниваем на _больше_
						} else if (is_obj && sel.hasOwnProperty("gt")) {
							ok = o[j] > sel.gt;
							if (!ok) break;

							// если свойство отбора является объектом `between`, сравниваем на _вхождение_
						} else if (is_obj && sel.hasOwnProperty("between")) {
							var tmp = o[j];
							if (typeof tmp != "number") tmp = utils.fix_date(o[j]);
							ok = tmp >= sel.between[0] && tmp <= sel.between[1];
							if (!ok) break;
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

		var o,
		    res = [],
		    top,
		    count = 0;

		if (selection) {
			if (selection._top) {
				top = selection._top;
				delete selection._top;
			} else top = 300;
		}

		for (var i in arr) {
			o = arr[i];

			// выполняем колбэк с элементом и пополняем итоговый массив
			if (utils._selection.call(this, o, selection)) {
				if (callback) {
					if (callback.call(this, o) === false) break;
				} else res.push(o);

				// ограничиваем кол-во возвращаемых элементов
				if (top) {
					count++;
					if (count >= top) break;
				}
			}
		}
		return res;
	}

}

const utils = new Utils();

/**
 * Строковые константы интернационализации
 *
 * @module metadata
 * @submodule i18n
 */

/**
 * Возвращает текст строковой константы с учетом текущего языка
 *
 * @param id {String}
 * @return {String|Object}
 */
function msg(id) {
	return msg.i18n[msg.lang][id];
}

msg.lang = 'ru';

msg.i18n = {
	ru: {

		fias: {
			types: ["владение", "здание", "помещение"],
			// Код, Наименование, Тип, Порядок, КодФИАС
			"1010": { name: "дом", type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"] },
			"1020": { name: "владение", type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"] },
			"1030": { name: "домовладение", type: 1, order: 3, fid: 3 },

			"1050": { name: "корпус", type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"] },
			"1060": { name: "строение", type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"] },
			"1080": { name: "литера", type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"] },
			"1070": { name: "сооружение", type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"] },
			"1040": { name: "участок", type: 2, order: 5, syn: [" уч.", " уч ", "участок"] },

			"2010": { name: "квартира", type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"] },
			"2030": { name: "офис", type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"] },
			"2040": { name: "бокс", type: 3, order: 3 },
			"2020": { name: "помещение", type: 3, order: 4 },
			"2050": { name: "комната", type: 3, order: 5, syn: ["комн.", "комн ", "комната"] },

			//	//  сокращения 1C для поддержки обратной совместимости при парсинге
			//	this["2010"]:{name: "кв.",	type: 3, order: 6},
			// 	this["2030"]:{name: "оф.",	type: 3, order: 7},
			// Уточняющие объекты
			"10100000": { name: "Почтовый индекс" },
			"10200000": { name: "Адресная точка" },
			"10300000": { name: "Садовое товарищество" },
			"10400000": { name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента" },
			"10500000": { name: "Промышленная зона" },
			"10600000": { name: "Гаражно-строительный кооператив" },
			"10700000": { name: "Территория" }
		},

		// публичные методы, экспортируемые, как свойства $p.msg
		store_url_od: "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage",

		argument_is_not_ref: "Аргумент не является ссылкой",
		addr_title: "Ввод адреса",

		cache_update_title: "Обновление кеша браузера",
		cache_update: "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера",
		cancel: "Отмена",

		delivery_area_empty: "Укажите район доставки",

		empty_login_password: "Не указаны имя пользователя или пароль",
		empty_response: "Пустой ответ сервера",
		empty_geocoding: "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера",
		error_geocoding: "Ошибка геокодера",

		error_auth: "Авторизация пользователя не выполнена",
		error_critical: "Критическая ошибка",
		error_metadata: "Ошибка загрузки метаданных конфигурации",
		error_network: "Ошибка сети или сервера - запрос отклонен",
		error_rights: "Ограничение доступа",
		error_low_acl: "Недостаточно прав для выполнения операции",

		file_size: "Запрещена загрузка файлов<br/>размером более ",
		file_confirm_delete: "Подтвердите удаление файла ",
		file_new_date: "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления",
		file_new_date_title: "Версия файлов",

		init_catalogues: "Загрузка справочников с сервера",
		init_catalogues_meta: ": Метаданные объектов",
		init_catalogues_tables: ": Реструктуризация таблиц",
		init_catalogues_nom: ": Базовые типы + номенклатура",
		init_catalogues_sys: ": Технологические справочники",
		init_login: "Укажите имя пользователя и пароль",

		requery: "Повторите попытку через 1-2 минуты",

		get limit_query() {
			return "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + this.requery;
		},

		long_operation: "Длительная операция",
		logged_in: "Авторизован под именем: ",
		log_out_title: "Отключиться от сервера?",
		log_out_break: "<br/>Завершить синхронизацию?",
		sync_title: "Обмен с сервером",
		sync_complite: "Синхронизация завершена",

		main_title: "Окнософт: заказ дилера ",
		mark_delete_confirm: "Пометить объект %1 на удаление?",
		mark_undelete_confirm: "Снять пометку удаления с объекта %1?",
		meta: {
			enm: "Перечисление",
			cat: "Справочник",
			doc: "Документ",
			cch: "План видов характеристик",
			cacc: "План счетов",
			tsk: "Задача",
			ireg: "Регистр сведений",
			areg: "Регистр накопления",
			accreg: "Регистр бухгалтерии",
			bp: "Бизнес процесс",
			ts_row: "Строка табличной части",
			dp: "Обработка",
			rep: "Отчет"
		},
		meta_classes: {
			enm: "Перечисления",
			cat: "Справочники",
			doc: "Документы",
			cch: "Планы видов характеристик",
			cacc: "Планы счетов",
			tsk: "Задачи",
			ireg: "Регистры сведений",
			areg: "Регистры накопления",
			accreg: "Регистры бухгалтерии",
			bp: "Бизнес процессы",
			dp: "Обработки",
			rep: "Отчеты"
		},
		meta_mgrs: {
			mgr: "Менеджер",
			get enm() {
				return this.mgr + " перечислений";
			},
			get cat() {
				return this.mgr + " справочников";
			},
			get doc() {
				return this.mgr + " документов";
			},
			get cch() {
				return this.mgr + " планов видов характеристик";
			},
			get cacc() {
				return this.mgr + " планов счетов";
			},
			get tsk() {
				return this.mgr + " задач";
			},
			get ireg() {
				return this.mgr + " регистров сведений";
			},
			get areg() {
				return this.mgr + " регистров накопления";
			},
			get accreg() {
				return this.mgr + " регистров бухгалтерии";
			},
			get bp() {
				return this.mgr + " бизнес-процессов";
			},
			get dp() {
				return this.mgr + " обработок";
			},
			get rep() {
				return this.mgr + " отчетов";
			}
		},
		meta_cat_mgr: "Менеджер справочников",
		meta_doc_mgr: "Менеджер документов",
		meta_enn_mgr: "Менеджер перечислений",
		meta_ireg_mgr: "Менеджер регистров сведений",
		meta_areg_mgr: "Менеджер регистров накопления",
		meta_accreg_mgr: "Менеджер регистров бухгалтерии",
		meta_dp_mgr: "Менеджер обработок",
		meta_task_mgr: "Менеджер задач",
		meta_bp_mgr: "Менеджер бизнес-процессов",
		meta_reports_mgr: "Менеджер отчетов",
		meta_charts_of_accounts_mgr: "Менеджер планов счетов",
		meta_charts_of_characteristic_mgr: "Менеджер планов видов характеристик",
		meta_extender: "Модификаторы объектов и менеджеров",

		modified_close: "Объект изменен<br/>Закрыть без сохранения?",
		mandatory_title: "Обязательный реквизит",
		mandatory_field: "Укажите значение реквизита '%1'",

		no_metadata: "Не найдены метаданные объекта '%1'",
		no_selected_row: "Не выбрана строка табличной части '%1'",
		no_dhtmlx: "Библиотека dhtmlx не загружена",
		not_implemented: "Не реализовано в текущей версии",

		offline_request: "Запрос к серверу в автономном режиме",
		onbeforeunload: "Окнософт: легкий клиент. Закрыть программу?",
		order_sent_title: "Подтвердите отправку заказа",
		order_sent_message: "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу",

		report_error: "<i class='fa fa-exclamation-circle fa-2x fa-fw'></i> Ошибка",
		report_prepare: "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета",
		report_need_prepare: "<i class='fa fa-info fa-2x fa-fw'></i> Нажмите 'Сформировать' для получения отчета",
		report_need_online: "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме",

		request_title: "Запрос регистрации",
		request_message: "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо",

		select_from_list: "Выбор из списка",
		select_grp: "Укажите группу, а не элемент",
		select_elm: "Укажите элемент, а не группу",
		select_file_import: "Укажите файл для импорта",

		srv_overload: "Сервер перегружен",
		sub_row_change_disabled: "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель",
		sync_script: "Обновление скриптов приложения:",
		sync_data: "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников",
		sync_break: "Прервать синхронизацию",
		sync_no_data: "Файл не содержит подходящих элементов для загрузки",

		tabular_will_cleared: "Табличная часть '%1' будет очищена. Продолжить?",

		unsupported_browser_title: "Браузер не поддерживается",
		unsupported_browser: "Несовместимая версия браузера<br/>Рекомендуется Google Chrome",
		supported_browsers: "Рекомендуется Chrome, Safari или Opera",
		unsupported_mode_title: "Режим не поддерживается",
		get unsupported_mode() {
			return "Программа не установлена<br/> в <a href='" + this.store_url_od + "'>приложениях Google Chrome</a>";
		},
		unknown_error: "Неизвестная ошибка в функции '%1'",

		value: "Значение"

	}
};

// временная мера: дублируем свойсва i18n внутри msg()
for (let id in msg.i18n.ru) {
	Object.defineProperty(msg, id, {
		get: function () {
			return msg.i18n.ru[id];
		}
	});
}

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 *
 * @class JobPrm
 * @static
 * @menuorder 04
 * @tooltip Параметры приложения
 */
class JobPrm {

	constructor() {

		Object.defineProperties(this, {

			local_storage_prefix: {
				value: "",
				writable: true
			},

			create_tables: {
				value: true,
				writable: true
			},

			/**
    * Адрес http интерфейса библиотеки интеграции
    * @method irest_url
    * @return {string}
    */
			irest_url: {
				value: function () {
					var url = base_url(),
					    zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
					url = url.replace("odata/standard.odata", "hs/rest");
					if (zone) return url.replace("%1", zone);else return url.replace("%1/", "");
				}
			}
		});
	}

	init(settings) {

		// подмешиваем параметры, заданные в файле настроек сборки
		if (typeof settings == "function") settings(this);
	}

	base_url() {
		return $p.wsql.get_user_param("rest_path") || this.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	/**
  * Адрес стандартного интерфейса 1С OData
  * @method rest_url
  * @return {string}
  */
	rest_url() {
		var url = this.base_url(),
		    zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
		if (zone) return url.replace("%1", zone);else return url.replace("%1/", "");
	}

	/**
  * Параметры запроса по умолчанию
  * @param attr
  * @param url
  */
	ajax_attr(attr, url) {
		if (!attr.url) attr.url = url;
		if (!attr.username) attr.username = this.username;
		if (!attr.password) attr.password = this.password;
		attr.hide_headers = true;
	}

}

/**
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * @module  metadata
 * @submodule wsql
 */

//const _ls = require("node-localstorage").LocalStorage

/**
 * ### Интерфейс к localstorage, alasql и pouchdb
 * - Обеспечивает взаимодействие с локальными и серверными данными
 * - Обслуживает локальные параметры пользователя
 *
 * @class WSQL
 * @static
 * @menuorder 33
 * @tooltip Данные localstorage
 */
class WSQL {

	constructor($p) {

		var user_params = {
			value: {}
		};

		Object.defineProperties(this, {

			// TODO: отказаться от localStorage
			_ls: {
				get: function () {

					if (typeof localStorage === "undefined") {

						return {
							setItem: function (name, value) {},
							getItem: function (name) {}
						};

						// локальное хранилище внутри node.js
						if (typeof WorkerGlobalScope === "undefined") {
							return new _ls('./localstorage');
						} else {
							return {
								setItem: function (name, value) {},
								getItem: function (name) {}
							};
						}
					} else return localStorage;
				}
			},

			/**
    * ### Создаёт и заполняет умолчаниями таблицу параметров
    *
    * @method init_params
    * @param settings {Function}
    * @param meta {Function}
    * @async
    */
			init: {
				value: function (settings, meta) {

					$p.job_prm.init(settings);

					// префикс параметров LocalStorage
					// TODO: отразить в документации, что если префикс пустой, то параметры не инициализируются
					if (!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables) return;

					// значения базовых параметров по умолчанию
					var nesessery_params = [{ p: "user_name", v: "", t: "string" }, { p: "user_pwd", v: "", t: "string" }, { p: "browser_uid", v: utils.generate_guid(), t: "string" }, {
						p: "zone",
						v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1,
						t: $p.job_prm.zone_is_string ? "string" : "number"
					}, { p: "enable_save_pwd", v: true, t: "boolean" }, { p: "rest_path", v: "", t: "string" }, { p: "couch_path", v: "", t: "string" }],
					    zone;

					// подмешиваем к базовым параметрам настройки приложения
					if ($p.job_prm.additional_params) nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

					// если зона не указана, устанавливаем "1"
					if (!this._ls.getItem($p.job_prm.local_storage_prefix + "zone")) zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;

					if (zone !== undefined) this.set_user_param("zone", zone);

					// дополняем хранилище недостающими параметрами
					nesessery_params.forEach(o => {
						if (!this.prm_is_set(o.p)) this.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
					});

					// сообщяем движку pouch пути и префиксы
					if ($p.adapters.pouch) {
						const pouch_prm = {
							path: this.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
							zone: this.get_user_param("zone", "number"),
							prefix: $p.job_prm.local_storage_prefix,
							suffix: this.get_user_param("couch_suffix", "string") || "",
							user_node: $p.job_prm.user_node,
							noreplicate: $p.job_prm.noreplicate
						};
						if (pouch_prm.path) {

							$p.adapters.pouch.init(pouch_prm);
						}
					}

					meta($p);
				}
			},

			/**
    * ### Устанавливает параметр в user_params и localStorage
    *
    * @method set_user_param
    * @param prm_name {string} - имя параметра
    * @param prm_value {string|number|object|boolean} - значение
    * @async
    */
			set_user_param: {
				value: function (prm_name, prm_value) {

					var str_prm = prm_value;
					if (typeof prm_value == "object") str_prm = JSON.stringify(prm_value);else if (prm_value === false) str_prm = "";

					this._ls.setItem($p.job_prm.local_storage_prefix + prm_name, str_prm);
					user_params[prm_name] = prm_value;
				}
			},

			/**
    * ### Возвращает значение сохраненного параметра из localStorage
    * Параметр извлекается с приведением типа
    *
    * @method get_user_param
    * @param prm_name {String} - имя параметра
    * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
    * @return {*} - значение параметра
    */
			get_user_param: {
				value: function (prm_name, type) {

					if (!user_params.hasOwnProperty(prm_name) && this._ls) user_params[prm_name] = this.fetch_type(this._ls.getItem($p.job_prm.local_storage_prefix + prm_name), type);

					return user_params[prm_name];
				}
			},

			/**
    * ### Проверяет, установлено ли свойство в
    */
			prm_is_set: {
				value: function (prm_name) {
					return user_params.hasOwnProperty(prm_name) || this._ls && this._ls.hasOwnProperty($p.job_prm.local_storage_prefix + prm_name);
				}
			},

			/**
    * ### Указатель на aladb
    * @property aladb
    * @type alasql.Database
    */
			aladb: {
				value: new alasql.Database('md')
			}

		});
	}

	/**
  * ### Указатель на alasql
  * @property alasql
  * @type Function
  */
	get alasql() {
		return alasql;
	}

	/**
  * ### Поправка времени javascript
  * @property js_time_diff
  * @type Number
  */
	get js_time_diff() {
		return -new Date("0001-01-01").valueOf();
	}

	/**
  * ### Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
  * @property time_diff
  * @type Number
  */
	get time_diff() {
		var diff = this.get_user_param("time_diff", "number");
		return !diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000 ? this.js_time_diff : diff;
	}

	/**
  * ### Сохраняет настройки формы или иные параметры объекта _options_
  * @method save_options
  * @param prefix {String} - имя области
  * @param options {Object} - сохраняемые параметры
  * @return {Promise}
  * @async
  */
	save_options(prefix, options) {
		return this.set_user_param(prefix + "_" + options.name, options);
	}

	/**
  * ### Восстанавливает сохраненные параметры в объект _options_
  * @method restore_options
  * @param prefix {String} - имя области
  * @param options {Object} - объект, в который будут записаны параметры
  */
	restore_options(prefix, options) {
		var options_saved = this.get_user_param(prefix + "_" + options.name, "object");
		for (var i in options_saved) {
			if (typeof options_saved[i] != "object") options[i] = options_saved[i];else {
				if (!options[i]) options[i] = {};
				for (var j in options_saved[i]) options[i][j] = options_saved[i][j];
			}
		}
		return options;
	}

	/**
  * ### Приведение типов при операциях с `localStorage`
  * @method fetch_type
  * @param prm
  * @param type
  * @returns {*}
  */
	fetch_type(prm, type) {
		if (type == "object") {
			try {
				prm = JSON.parse(prm);
			} catch (e) {
				prm = {};
			}
			return prm;
		} else if (type == "number") return utils.fix_number(prm, true);else if (type == "date") return utils.fix_date(prm, true);else if (type == "boolean") return utils.fix_boolean(prm);else return prm;
	}

}

/**
 * Конструкторы менеджеров данных
 *
 * @module  metadata
 * @submodule meta_mngrs
 */

/**
 * ### Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumManager"}}{{/crossLink}} - менеджер перечислений
 * - {{#crossLink "RefDataManager"}}{{/crossLink}} - абстрактный менеджер ссылочных данных
 * - {{#crossLink "CatManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfAccountManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DocManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DataProcessorsManager"}}{{/crossLink}} - менеджер обработок
 * - {{#crossLink "RegisterManager"}}{{/crossLink}} - абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 * - {{#crossLink "InfoRegManager"}}{{/crossLink}} - менеджер регистров сведений
 * - {{#crossLink "LogManager"}}{{/crossLink}} - менеджер журнала регистрации
 * - {{#crossLink "AccumRegManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "TaskManager"}}{{/crossLink}} - менеджер задач
 * - {{#crossLink "BusinessProcessManager"}}{{/crossLink}} - менеджер бизнес-процессов
 *
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 * @menuorder 10
 * @tooltip Менеджер данных
 */

/**
 * Описание структуры колонки формы списка
 * @class Col_struct
 * @param id
 * @param width
 * @param type
 * @param align
 * @param sort
 * @param caption
 * @constructor
 */
function Col_struct(id, width, type, align, sort, caption) {
	this.id = id;
	this.width = width;
	this.type = type;
	this.align = align;
	this.sort = sort;
	this.caption = caption;
}

// isNode
// if(typeof process !== 'undefined' && process.versions && process.versions.node){
// 	MetaEventEmitter = require('metadata-abstract-adapter/index.js').MetaEventEmitter;
// }else{
// 	MetaEventEmitter = require('metadata-abstract-adapter').MetaEventEmitter;
// }

function mngrs($p) {

	const { wsql, md } = $p;

	class DataManager extends _metadataAbstractAdapter.MetaEventEmitter {

		constructor(class_name) {

			super();

			const _meta = md.get(class_name) || (this.metadata ? this.metadata() : {});

			Object.defineProperties(this, {

				/**
     * ### Имя типа объектов этого менеджера
     * @property class_name
     * @for DataManager
     * @type String
     * @final
     */
				class_name: {
					get: () => class_name
				},

				/**
     * ### Метаданные объекта
     * указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту
     *
     * @method metadata
     * @for DataManager
     * @return {Object} - объект метаданных
     */
				metadata: {
					value: field_name => {

						if (field_name) return _meta.fields[field_name] || md.get(class_name, field_name) || _meta.tabular_sections[field_name];else return _meta;
					}
				},

				/**
     * В этой переменной хранятся имена конструктора объекта и конструкторов табличных частей
     */
				constructor_names: {
					value: {}
				},

				/**
     * ### Хранилище объектов данного менеджера
     */
				by_ref: {
					value: {}
				}
			});
		}

		/**
   * ### Указатель на массив, сопоставленный с таблицей локальной базы данных
   * Фактически - хранилище объектов данного класса
   * @property alatable
   * @for DataManager
   * @type Array
   * @final
   */
		get alatable() {
			const { table_name } = this;
			return wsql.aladb.tables[table_name] ? wsql.aladb.tables[table_name].data : [];
		}

		/**
   * ### Способ кеширования объектов этого менеджера
   *
   * Выполняет две функции:
   * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
   * - Указывает, нужно ли запоминать представления ссылок (инверсно).
   * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
   * @property cachable
   * @for DataManager
   * @type String - ("ram", "doc", "doc_remote", "meta", "e1cib")
   * @final
   */
		get cachable() {

			const { class_name } = this;
			const _meta = this.metadata();

			// перечисления кешируются всегда
			if (class_name.indexOf("enm.") != -1) return "ram";

			// Если в метаданных явно указано правило кеширования, используем его
			if (_meta.cachable) return _meta.cachable;

			// документы, отчеты и обработки по умолчанию кешируем в idb, но в память не загружаем
			if (class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1) return "doc";

			// остальные классы по умолчанию кешируем и загружаем в память при старте
			return "ram";
		}

		/**
   * ### Имя семейства объектов данного менеджера
   * Примеры: "справочников", "документов", "регистров сведений"
   * @property family_name
   * @for DataManager
   * @type String
   * @final
   */
		get family_name() {
			return msg.meta_mgrs[this.class_name.split(".")[0]].replace(msg.meta_mgrs.mgr + " ", "");
		}

		/**
   * ### Имя таблицы объектов этого менеджера в базе alasql
   * @property table_name
   * @type String
   * @final
   */
		get table_name() {
			return this.class_name.replace(".", "_");
		}

		/**
   * ### Найти строки
   * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
   * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере.
   * Имеет смысл для объектов, у которых _cachable = "ram"_
   * @method find_rows
   * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
   * @param [callback] {Function} - в который передается текущий объект данных на каждой итерации
   * @return {Array}
   */
		find_rows(selection, callback) {
			return utils._find_rows.call(this, this.by_ref, selection, callback);
		}

		/**
   * ### Найти строки на сервере
   * @param selection
   * @async
   */
		find_rows_remote(selection) {
			return this.adapter.find_rows(this, selection);
		}

		/**
   * ### Дополнительные реквизиты
   * Массив дополнителных реквизитов (аналог подсистемы `Свойства` БСП) вычисляется через
   * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
   *
   * @property extra_fields
   * @type Array
   */
		extra_fields(obj) {
			// ищем предопределенный элемент, сответствующий классу данных
			var destinations = $p.cat.destinations || $p.cch.destinations,
			    pn = md.class_name_to_1c(this.class_name).replace(".", "_"),
			    res = [];

			if (destinations) {
				destinations.find_rows({ predefined_name: pn }, destination => {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if (ts) {
						ts.each(row => {
							if (!row._deleted && !row.ПометкаУдаления) res.push(row.property || row.Свойство);
						});
					}
					return false;
				});
			}

			return res;
		}

		/**
   * ### Дополнительные свойства
   * Массив дополнителных свойств (аналог подсистемы `Свойства` БСП) вычисляется через
   * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
   *
   * @property extra_properties
   * @type Array
   */
		extra_properties(obj) {
			return [];
		}

		/**
   * ### Имя функции - конструктора объектов или строк табличных частей
   *
   * @method obj_constructor
   * @param [ts_name] {String}
   * @param [mode] {Boolean | Object }
   * @return {String | Function | DataObj}
   */
		obj_constructor(ts_name = "", mode) {

			if (!this.constructor_names[ts_name]) {
				var parts = this.class_name.split("."),
				    fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);
				this.constructor_names[ts_name] = ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;
			}

			ts_name = this.constructor_names[ts_name];

			// если режим не указан, возвращаем имя функции - конструктора
			if (!mode) {
				return ts_name;
			}
			// если булево - возвращаем саму функцию - конструктор
			if (mode === true) {
				return $p[ts_name];
			}
			// если массив - создаём объект с параметрами, указанными в массиве
			if (Array.isArray(mode)) {
				return new $p[ts_name](...mode);
			}
			// иначе - создаём объект и передаём в конструктор единственный параметр
			return new $p[ts_name](mode);
		}

		/**
   * ### Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
   *
   * @method sync_grid
   * @for DataManager
   * @param grid {dhtmlXGridObject}
   * @param attr {Object}
   */
		sync_grid(attr, grid) {

			var mgr = this;

			function request() {

				if (typeof attr.custom_selection == "function") {
					return attr.custom_selection(attr);
				} else if (mgr.cachable == "ram") {

					// запрос к alasql
					if (attr.action == "get_tree") return wsql.promise(mgr.get_sql_struct(attr), []).then($p.iface.data_to_tree);else if (attr.action == "get_selection") return wsql.promise(mgr.get_sql_struct(attr), []).then(data => $p.iface.data_to_grid.call(mgr, data, attr));
				} else if (mgr.cachable.indexOf("doc") == 0) {

					// todo: запрос к pouchdb
					if (attr.action == "get_tree") return mgr.pouch_tree(attr);else if (attr.action == "get_selection") return mgr.pouch_selection(attr);
				} else {

					// запрос к серверу по сети
					if (attr.action == "get_tree") return mgr.rest_tree(attr);else if (attr.action == "get_selection") return mgr.rest_selection(attr);
				}
			}

			function to_grid(res) {

				return new Promise(function (resolve, reject) {

					if (typeof res == "string") {

						if (res.substr(0, 1) == "{") res = JSON.parse(res);

						// загружаем строку в грид
						if (grid && grid.parse) {
							grid.xmlFileUrl = "exec";
							grid.parse(res, function () {
								resolve(res);
							}, "xml");
						} else resolve(res);
					} else if (grid instanceof dhtmlXTreeView && grid.loadStruct) {
						grid.loadStruct(res, function () {
							resolve(res);
						});
					} else resolve(res);
				});
			}

			// TODO: переделать обработку catch()
			return request().then(to_grid).catch($p.record_log);
		}

		/**
   * ### Возвращает массив доступных значений для комбобокса
   * @method get_option_list
   * @for DataManager
   * @param [selection] {Object} - отбор, который будет наложен на список
   * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
   * @return {Promise.<Array>}
   */
		get_option_list(selection) {

			var t = this,
			    l = [],
			    input_by_string,
			    text,
			    sel;

			// поиск по строке
			if (selection.presentation && (input_by_string = t.metadata().input_by_string)) {
				text = selection.presentation.like;
				delete selection.presentation;
				selection.or = [];
				input_by_string.forEach(function (fld) {
					sel = {};
					sel[fld] = { like: text };
					selection.or.push(sel);
				});
			}

			if (t.cachable == "ram" || selection && selection._local) {
				t.find_rows(selection, function (v) {
					l.push(v);
				});
				return Promise.resolve(l);
			} else if (t.cachable != "e1cib") {
				return t.adapter.find_rows(t, selection).then(function (data) {
					data.forEach(function (v) {
						l.push(v);
					});
					return l;
				});
			} else {
				// для некешируемых выполняем запрос к серверу
				var attr = { selection: selection, top: selection._top },
				    is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
				delete selection._top;

				if (is_doc) attr.fields = ["ref", "date", "number_doc"];else if (t.metadata().main_presentation_name) attr.fields = ["ref", "name"];else attr.fields = ["ref", "id"];

				return _rest.load_array(attr, t).then(function (data) {
					data.forEach(function (v) {
						l.push({
							text: is_doc ? v.number_doc + " от " + moment(v.date).format(moment._masks.ldt) : v.name || v.id,
							value: v.ref });
					});
					return l;
				});
			}
		}

		/**
   * Заполняет свойства в объекте source в соответствии с реквизитами табчасти
   * @param tabular {String} - имя табчасти
   * @param source {Object}
   */
		tabular_captions(tabular, source) {}

		/**
   * Печатает объект
   * @method print
   * @param ref {DataObj|String} - guid ссылки на объект
   * @param model {String|DataObj.cat.formulas} - идентификатор команды печати
   * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
   */
		print(ref, model, wnd) {

			function tune_wnd_print(wnd_print) {
				if (wnd && wnd.progressOff) wnd.progressOff();
				if (wnd_print) wnd_print.focus();
			}

			if (wnd && wnd.progressOn) wnd.progressOn();

			setTimeout(tune_wnd_print, 3000);

			// если _printing_plates содержит ссылку на обрабочтик печати, используем его
			if (this._printing_plates[model] instanceof DataObj) model = this._printing_plates[model];

			// если существует локальный обработчик, используем его
			if (model instanceof DataObj && model.execute) {

				if (ref instanceof DataObj) return model.execute(ref).then(tune_wnd_print);else return this.get(ref, true).then(model.execute.bind(model)).then(tune_wnd_print);
			} else {

				// иначе - печатаем средствами 1С или иного сервера
				var rattr = {};
				$p.ajax.default_attr(rattr, job_prm.irest_url());
				rattr.url += this.rest_name + "(guid'" + utils.fix_guid(ref) + "')" + "/Print(model=" + model + ", browser_uid=" + wsql.get_user_param("browser_uid") + ")";

				return $p.ajax.get_and_show_blob(rattr.url, rattr, "get").then(tune_wnd_print);
			}
		}

		/**
   * Возвращает промис со структурой печатных форм объекта
   * @return {Promise.<Object>}
   */
		printing_plates() {
			var rattr = {},
			    t = this;

			if (!t._printing_plates) {
				if (t.metadata().printing_plates) t._printing_plates = t.metadata().printing_plates;else if (t.metadata().cachable == "ram" || t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0) {
					t._printing_plates = {};
				}
			}

			if (!t._printing_plates && $p.ajax.authorized) {
				$p.ajax.default_attr(rattr, job_prm.irest_url());
				rattr.url += t.rest_name + "/Print()";
				return $p.ajax.get_ex(rattr.url, rattr).then(function (req) {
					t._printing_plates = JSON.parse(req.response);
					return t._printing_plates;
				}).catch(function () {}).then(function (pp) {
					return pp || (t._printing_plates = {});
				});
			}

			return Promise.resolve(t._printing_plates);
		}

		/**
   * Широковещательное событие на объекте `md`
   * @param name
   * @param attr
   */
		brodcast_event(name, attr) {
			md.emit(name, attr);
		}

		/**
   * Указатель на адаптер данных этого менеджера
   */
		get adapter() {
			switch (this.cachable) {
				case undefined:
				case "ram":
				case "doc":
				case "doc_remote":
				case "remote":
				case "user":
				case "meta":
					return $p.adapters.pouch;
			}
			return $p.adapters[this.cachable];
		}

		static get EVENTS() {
			return {

				/**
     * ### После создания
     * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
     * или заполнить объект на основании данных связанного объекта
     *
     * @event AFTER_CREATE
     * @for DataManager
     */
				AFTER_CREATE: "AFTER_CREATE",

				/**
     * ### После чтения объекта с сервера
     * Имеет смысл для объектов с типом кеширования ("doc", "doc_remote", "meta", "e1cib").
     * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
     *
     * @event AFTER_LOAD
     * @for DataManager
     */
				AFTER_LOAD: "AFTER_LOAD",

				/**
     * ### Перед записью
     * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
     * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
     *
     * @event BEFORE_SAVE
     * @for DataManager
     */
				BEFORE_SAVE: "BEFORE_SAVE",

				/**
     * ### После записи
     *
     * @event AFTER_SAVE
     * @for DataManager
     */
				BEFORE_SAVE: "BEFORE_SAVE",

				/**
     * ### При изменении реквизита шапки или табличной части
     *
     * @event VALUE_CHANGE
     * @for DataManager
     */
				VALUE_CHANGE: "VALUE_CHANGE",

				/**
     * ### При добавлении строки табличной части
     *
     * @event ADD_ROW
     * @for DataManager
     */
				ADD_ROW: "ADD_ROW",

				/**
     * ### При удалении строки табличной части
     *
     * @event DEL_ROW
     * @for DataManager
     */
				DEL_ROW: "DEL_ROW"
			};
		}

	}

	/**
  * ### Aбстрактный менеджер ссылочных данных
  * От него унаследованы менеджеры документов, справочников, планов видов характеристик и планов счетов
  *
  * @class RefDataManager
  * @extends DataManager
  * @constructor
  * @param class_name {string} - имя типа менеджера объекта
  */
	class RefDataManager extends DataManager {

		/**
   * Помещает элемент ссылочных данных в локальную коллекцию
   * @method push
   * @param o {DataObj}
   * @param [new_ref] {String} - новое значение ссылки объекта
   */
		push(o, new_ref) {
			if (new_ref && new_ref != o.ref) {
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			} else this.by_ref[o.ref] = o;
		}

		/**
   * Выполняет перебор элементов локальной коллекции
   * @method each
   * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
   */
		each(fn) {
			for (var i in this.by_ref) {
				if (!i || i == utils.blank.guid) continue;
				if (fn.call(this, this.by_ref[i]) == true) break;
			}
		}

		/**
   * Синоним для each()
   */
		forEach(fn) {
			return this.each.call(this, fn);
		}

		/**
   * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
   * @method get
   * @param [ref] {String|Object} - ссылочный идентификатор
   * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
   * @return {DataObj|undefined}
   */
		get(ref, do_not_create) {

			let o = this.by_ref[ref] || this.by_ref[ref = utils.fix_guid(ref)];

			if (!o) {
				if (do_not_create && do_not_create != 'promise') {
					return;
				} else {
					o = this.obj_constructor('', [ref, this, true]);
				}
			}

			if (ref === utils.blank.guid) {
				return do_not_create == 'promise' ? Promise.resolve(o) : o;
			}

			if (o.is_new()) {
				if (do_not_create == 'promise') {
					return o.load(); // читаем из 1С или иного сервера
				} else {
					return o;
				}
			} else {
				return do_not_create == 'promise' ? Promise.resolve(o) : o;
			}
		}

		/**
   * ### Создаёт новый объект типа объектов текущего менеджера
   * Для кешируемых объектов, все действия происходят на клиенте<br />
   * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
   *
   * @method create
   * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
   * @param [fill_default] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
   * @return {Promise.<*>}
   */
		create(attr, fill_default) {

			if (!attr || typeof attr != "object") {
				attr = {};
			} else if (utils.is_data_obj(attr)) {
				return Promise.resolve(attr);
			}

			if (!attr.ref || !utils.is_guid(attr.ref) || utils.is_empty_guid(attr.ref)) {
				attr.ref = utils.generate_guid();
			}

			let o = this.by_ref[attr.ref];

			if (!o) {

				o = this.obj_constructor('', [attr, this]);

				if (!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2) {
					// заглушка ссылки объекта

				} else {

					if (o instanceof DocObj && o.date == utils.blank.date) o.date = new Date();

					// Триггер после создания
					let after_create_res = {};
					this.emit("after_create", o, after_create_res);

					// Если новый код или номер не были назначены в триггере - устанавливаем стандартное значение
					let call_new_number_doc;
					if (this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager) {
						if (!o.number_doc) {
							call_new_number_doc = true;
						}
					} else {
						if (!o.id) {
							call_new_number_doc = true;
						}
					}

					return (call_new_number_doc ? o.new_number_doc() : Promise.resolve(o)).then(() => {

						if (after_create_res === false) return o;else if (typeof after_create_res === "object" && after_create_res.then) return after_create_res;

						// выполняем обработчик после создания объекта и стандартные действия, если их не запретил обработчик
						if (this.cachable == "e1cib" && fill_default) {
							var rattr = {};
							$p.ajax.default_attr(rattr, job_prm.irest_url());
							rattr.url += this.rest_name + "/Create()";
							return $p.ajax.get_ex(rattr.url, rattr).then(function (req) {
								return utils._mixin(o, JSON.parse(req.response), undefined, ["ref"]);
							});
						} else return o;
					});
				}
			}

			return Promise.resolve(o);
		}

		/**
   * Удаляет объект из alasql и локального кеша
   * @method unload_obj
   * @param ref
   */
		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if (o.ref == ref) {
					a.splice(i, 1);
					return true;
				}
			});
		}

		/**
   * Находит первый элемент, в любом поле которого есть искомое значение
   * @method find
   * @param val {*} - значение для поиска
   * @param columns {String|Array} - колонки, в которых искать
   * @return {DataObj}
   */
		find(val, columns) {
			return utils._find(this.by_ref, val, columns);
		}

		/**
   * ### Сохраняет массив объектов в менеджере
   *
   * @method load_array
   * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
   * @param [forse] {Boolean|String} - перезаполнять объект
   */
		load_array(aattr, forse) {

			var ref,
			    obj,
			    res = [];

			for (var i = 0; i < aattr.length; i++) {

				ref = utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if (!obj) {

					if (forse == "update_only") {
						continue;
					}

					obj = this.obj_constructor('', [aattr[i], this]);
					if (forse) obj._set_loaded();
				} else if (obj.is_new() || forse) {
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}

		/**
   * Находит перую папку в пределах подчинения владельцу
   * @method first_folder
   * @param owner {DataObj|String}
   * @return {DataObj} - ссылка найденной папки или пустая ссылка
   */
		first_folder(owner) {
			for (var i in this.by_ref) {
				var o = this.by_ref[i];
				if (o.is_folder && (!owner || utils.is_equal(owner, o.owner))) return o;
			}
			return this.get();
		}

		/**
   * Возаращает массив запросов для создания таблиц объекта и его табличных частей
   * @method get_sql_struct
   * @param attr {Object}
   * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
   * @return {Object|String}
   */
		get_sql_struct(attr) {
			var t = this,
			    cmd = t.metadata(),
			    res = {},
			    f,
			    f0,
			    trunc_index = 0,
			    action = attr && attr.action ? attr.action : "create_table";

			function sql_selection() {

				var ignore_parent = !attr.parent,
				    parent = attr.parent || utils.blank.guid,
				    owner,
				    initial_value = attr.initial_value || utils.blank.guid,
				    filter = attr.filter || "",
				    set_parent = utils.blank.guid;

				function list_flds() {
					var flds = [],
					    s = "_t_.ref, _t_.`_deleted`";

					if (cmd.form && cmd.form.selection) {
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});
					} else if (t instanceof DocManager) {
						flds.push("posted");
						flds.push("date");
						flds.push("number_doc");
					} else {

						if (cmd["hierarchical"] && cmd["group_hierarchy"]) flds.push("is_folder");else flds.push("0 as is_folder");

						if (t instanceof ChartOfAccountManager) {
							flds.push("id");
							flds.push("name as presentation");
						} else if (cmd["main_presentation_name"]) flds.push("name as presentation");else {
							if (cmd["code_length"]) flds.push("id as presentation");else flds.push("'...' as presentation");
						}

						if (cmd["has_owners"]) flds.push("owner");

						if (cmd["code_length"]) flds.push("id");
					}

					flds.forEach(fld => {
						if (fld.indexOf(" as ") != -1) s += ", " + fld;else s += md.sql_mask(fld, true);
					});
					return s;
				}

				function join_flds() {

					var s = "",
					    parts;

					if (cmd.form && cmd.form.selection) {
						for (var i in cmd.form.selection.fields) {
							if (cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1) continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if (parts[0].length > 1) {
								if (s) s += "\n";
								s += "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds() {

					var s;

					if (t instanceof ChartOfAccountManager) {
						s = " WHERE (" + (filter ? 0 : 1);
					} else if (cmd["hierarchical"]) {
						if (cmd["has_owners"]) s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);else s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);
					} else {
						if (cmd["has_owners"]) s = " WHERE (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);else s = " WHERE (" + (filter ? 0 : 1);
					}

					if (t.sql_selection_where_flds) {
						s += t.sql_selection_where_flds(filter);
					} else if (t instanceof DocManager) s += " OR _t_.number_doc LIKE '" + filter + "'";else {
						if (cmd["main_presentation_name"] || t instanceof ChartOfAccountManager) s += " OR _t_.name LIKE '" + filter + "'";

						if (cmd["code_length"]) s += " OR _t_.id LIKE '" + filter + "'";
					}

					s += ") AND (_t_.ref != '" + utils.blank.guid + "')";

					// допфильтры форм и связей параметров выбора
					if (attr.selection) {
						if (typeof attr.selection == "function") {} else attr.selection.forEach(sel => {
							for (var key in sel) {

								if (typeof sel[key] == "function") {
									s += "\n AND " + sel[key](t, key) + " ";
								} else if (cmd.fields.hasOwnProperty(key) || key === "ref") {
									if (sel[key] === true) s += "\n AND _t_." + key + " ";else if (sel[key] === false) s += "\n AND (not _t_." + key + ") ";else if (typeof sel[key] == "object") {

										if (utils.is_data_obj(sel[key]) || utils.is_guid(sel[key])) s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else {
											var keys = Object.keys(sel[key]),
											    val = sel[key][keys[0]],
											    mf = cmd.fields[key],
											    vmgr;

											if (mf && mf.type.is_ref) {
												vmgr = utils.value_mgr({}, key, mf.type, true, val);
											}

											if (keys[0] == "not") s += "\n AND (not _t_." + key + " = '" + val + "') ";else if (keys[0] == "in") s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce((sum, val) => {
												if (sum) {
													sum += ",";
												}
												if (typeof val == "number") {
													sum += val.toString();
												} else {
													sum += "'" + val + "'";
												}
												return sum;
											}, "") + ")) ";else s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									} else if (typeof sel[key] == "string") s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if (key == "is_folder" && cmd.hierarchical && cmd.group_hierarchy) {
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

				function order_flds() {

					if (t instanceof ChartOfAccountManager) {
						return "ORDER BY id";
					} else if (cmd["hierarchical"]) {
						if (cmd["group_hierarchy"]) return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";else return "ORDER BY _t_.parent desc, is_initial_value, presentation";
					} else return "ORDER BY is_initial_value, presentation";
				}

				function selection_prms() {

					// т.к. в процессе установки может потребоваться получение объектов, код асинхронный
					function on_parent(o) {

						// ссылка родителя для иерархических справочников
						if (o) {
							set_parent = attr.set_parent = o.parent.ref;
							parent = set_parent;
							ignore_parent = false;
						}

						// строка фильтра
						if (filter && filter.indexOf("%") == -1) filter = "%" + filter + "%";
					}

					// установим владельца
					if (cmd["has_owners"]) {
						owner = attr.owner;
						if (attr.selection && typeof attr.selection != "function") {
							attr.selection.forEach(sel => {
								if (sel.owner) {
									owner = typeof sel.owner == "object" ? sel.owner.valueOf() : sel.owner;
									delete sel.owner;
								}
							});
						}
						if (!owner) owner = utils.blank.guid;
					}

					// ссылка родителя во взаимосвязи с начальным значением выбора
					if (initial_value != utils.blank.guid && ignore_parent) {
						if (cmd["hierarchical"]) {
							on_parent(t.get(initial_value));
						} else on_parent();
					} else on_parent();
				}

				selection_prms();

				var sql;
				if (t.sql_selection_list_flds) sql = t.sql_selection_list_flds(initial_value);else sql = ("SELECT %2, case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300").replace("%2", list_flds()).replace("%j", join_flds());

				return sql.replace("%3", where_flds()).replace("%4", order_flds());
			}

			function sql_create() {

				var sql = "CREATE TABLE IF NOT EXISTS ";

				if (attr && attr.postgres) {
					sql += t.table_name + " (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

					if (t instanceof DocManager) sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";else {
						if (cmd.code_length) sql += ", id character(" + cmd.code_length + ")";
						sql += ", name character varying(50), is_folder boolean";
					}

					for (f in cmd.fields) {
						if (f.length > 30) {
							if (cmd.fields[f].short_name) f0 = cmd.fields[f].short_name;else {
								trunc_index++;
								f0 = f[0] + trunc_index + f.substr(f.length - 27);
							}
						} else f0 = f;
						sql += ", " + f0 + md.sql_type(t, f, cmd.fields[f].type, true);
					}

					for (f in cmd["tabular_sections"]) sql += ", " + "ts_" + f + " JSON";
				} else {
					sql += "`" + t.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					if (t instanceof DocManager) sql += ", posted boolean, date Date, number_doc CHAR";else sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

					for (f in cmd.fields) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.fields[f].type);

					for (f in cmd["tabular_sections"]) sql += ", " + "`ts_" + f + "` JSON";
				}

				sql += ")";

				return sql;
			}

			function sql_update() {
				// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
				var fields = ["ref", "_deleted"],
				    sql = "INSERT INTO `" + t.table_name + "` (ref, `_deleted`",
				    values = "(?";

				if (t.class_name.substr(0, 3) == "cat") {
					sql += ", id, name, is_folder";
					fields.push("id");
					fields.push("name");
					fields.push("is_folder");
				} else if (t.class_name.substr(0, 3) == "doc") {
					sql += ", posted, date, number_doc";
					fields.push("posted");
					fields.push("date");
					fields.push("number_doc");
				}
				for (f in cmd.fields) {
					sql += md.sql_mask(f);
					fields.push(f);
				}
				for (f in cmd["tabular_sections"]) {
					sql += ", `ts_" + f + "`";
					fields.push("ts_" + f);
				}
				sql += ") VALUES ";
				for (f = 1; f < fields.length; f++) {
					values += ", ?";
				}
				values += ")";
				sql += values;

				return { sql: sql, fields: fields, values: values };
			}

			if (action == "create_table") res = sql_create();else if (["insert", "update", "replace"].indexOf(action) != -1) res[t.table_name] = sql_update();else if (action == "select") res = "SELECT * FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "select_all") res = "SELECT * FROM `" + t.table_name + "`";else if (action == "delete") res = "DELETE FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "drop") res = "DROP TABLE IF EXISTS `" + t.table_name + "`";else if (action == "get_tree") {
				if (!attr.filter || attr.filter.is_folder) res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";else res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
			} else if (action == "get_selection") res = sql_selection();

			return res;
		}

		/**
   * ШапкаТаблицыПоИмениКласса
   */
		caption_flds(attr) {

			var _meta = attr && attr.metadata || this.metadata(),
			    acols = [];

			if (_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;
			} else if (this instanceof DocManager) {
				acols.push(new Col_struct("date", "160", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("number_doc", "140", "ro", "left", "server", "Номер"));

				if (_meta.fields.note) acols.push(new Col_struct("note", "*", "ro", "left", "server", _meta.fields.note.synonym));

				if (_meta.fields.responsible) acols.push(new Col_struct("responsible", "*", "ro", "left", "server", _meta.fields.responsible.synonym));
			} else if (this instanceof CatManager) {

				if (_meta.code_length) acols.push(new Col_struct("id", "140", "ro", "left", "server", "Код"));

				if (_meta.main_presentation_name) acols.push(new Col_struct("name", "*", "ro", "left", "server", "Наименование"));
			} else {

				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				//if(_meta.has_owners){
				//	acols.push(new Col_struct("owner", "*", "ro", "left", "server", _meta.fields.owner.synonym));
				//}
			}

			return acols;
		}

		/**
   * Догружает с сервера объекты, которых нет в локальном кеше
   * @method load_cached_server_array
   * @param list {Array} - массив строк ссылок или объектов со свойством ref
   * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
   * @return {Promise}
   */
		load_cached_server_array(list, alt_rest_name) {

			var query = [],
			    obj,
			    t = this,
			    mgr = alt_rest_name ? { class_name: t.class_name, rest_name: alt_rest_name } : t,
			    check_loaded = !alt_rest_name;

			list.forEach(o => {
				obj = t.get(o.ref || o, true);
				if (!obj || check_loaded && obj.is_new()) query.push(o.ref || o);
			});
			if (query.length) {

				var attr = {
					url: "",
					selection: { ref: { in: query } }
				};
				if (check_loaded) attr.fields = ["ref"];

				$p.rest.build_select(attr, mgr);
				//if(dhx4.isIE)
				//	attr.url = encodeURI(attr.url);

				return $p.ajax.get_ex(attr.url, attr).then(function (req) {
					var data = JSON.parse(req.response);

					if (check_loaded) data = data.value;else {
						data = data.data;
						for (var i in data) {
							if (!data[i].ref && data[i].id) data[i].ref = data[i].id;
							if (data[i].Код) {
								data[i].id = data[i].Код;
								delete data[i].Код;
							}
							data[i]._not_set_loaded = true;
						}
					}

					t.load_array(data);
					return list;
				});
			} else return Promise.resolve(list);
		}

		/**
   * Возаращает предопределенный элемент по имени предопределенных данных
   * @method predefined
   * @param name {String} - имя предопределенного
   * @return {DataObj}
   */
		predefined(name) {

			if (!this._predefined) this._predefined = {};

			if (!this._predefined[name]) {

				this._predefined[name] = this.get();

				this.find_rows({ predefined_name: name }, function (el) {
					this._predefined[name] = el;
					return false;
				});
			}

			return this._predefined[name];
		}

	}

	/**
  * ### Абстрактный менеджер обработок
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "DataProcessors"}}{{/crossLink}}
  *
  * @class DataProcessorsManager
  * @extends DataManager
  * @param class_name {string} - имя типа менеджера объекта
  * @constructor
  */
	class DataProcessorsManager extends DataManager {

		/**
   * Создаёт экземпляр объекта обработки
   * @method create
   * @return {DataProcessorObj}
   */
		create() {
			return this.obj_constructor('', [{}, this]);
		}

		/**
   * Создаёт экземпляр объекта обработки - псевдоним create()
   * @method get
   * @return {DataProcessorObj}
   */
		get(ref) {
			if (ref) {
				if (!this.by_ref[ref]) {
					this.by_ref[ref] = this.create();
				}
				return this.by_ref[ref];
			} else return this.create();
		}

		/**
   * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql. Добавлен, чтобы не ругалась форма объекта при закрытии
   * @method unload_obj
   * @param [ref]
   */
		unload_obj(ref) {}
	}

	/**
  * ### Абстрактный менеджер перечисления
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
  *
  * @class EnumManager
  * @extends RefDataManager
  * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
  * @constructor
  */
	class EnumManager extends RefDataManager {

		constructor(class_name) {
			super(class_name);

			for (var v of md.get(class_name)) new EnumObj(v, this);
		}

		get(ref, do_not_create) {

			if (ref instanceof EnumObj) return ref;else if (!ref || ref == utils.blank.guid) ref = "_";

			var o = this[ref];
			if (!o) o = new EnumObj({ name: ref }, this);

			return o;
		}

		push(o, new_ref) {
			Object.defineProperty(this, new_ref, {
				value: o
			});
		}

		each(fn) {
			this.alatable.forEach(v => {
				if (v.ref && v.ref != "_" && v.ref != utils.blank.guid) fn.call(this[v.ref]);
			});
		}

		/**
   * Bозаращает массив запросов для создания таблиц объекта и его табличных частей
   * @param attr {Object}
   * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
   * @return {Object|String}
   */
		get_sql_struct(attr) {

			var res = "CREATE TABLE IF NOT EXISTS ",
			    action = attr && attr.action ? attr.action : "create_table";

			if (attr && attr.postgres) {
				if (action == "create_table") res += this.table_name + " (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";else if (["insert", "update", "replace"].indexOf(action) != -1) {
					res = {};
					res[this.table_name] = {
						sql: "INSERT INTO " + this.table_name + " (ref, sequence, synonym) VALUES ($1, $2, $3)",
						fields: ["ref", "sequence", "synonym"],
						values: "($1, $2, $3)"
					};
				} else if (action == "delete") res = "DELETE FROM " + this.table_name + " WHERE ref = $1";
			} else {
				if (action == "create_table") res += "`" + this.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";else if (["insert", "update", "replace"].indexOf(action) != -1) {
					res = {};
					res[this.table_name] = {
						sql: "INSERT INTO `" + this.table_name + "` (ref, sequence, synonym) VALUES (?, ?, ?)",
						fields: ["ref", "sequence", "synonym"],
						values: "(?, ?, ?)"
					};
				} else if (action == "delete") res = "DELETE FROM `" + this.table_name + "` WHERE ref = ?";
			}

			return res;
		}

		/**
   * Возвращает массив доступных значений для комбобокса
   * @method get_option_list
   * @param [selection] {Object}
   * @param [selection._top] {Number}
   * @return {Promise.<Array>}
   */
		get_option_list(selection) {
			var l = [],
			    synonym = "",
			    sref;

			if (selection) {
				for (var i in selection) {
					if (i.substr(0, 1) != "_") {
						if (i == "ref") {
							sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
						} else synonym = selection[i];
					}
				}
			}

			if (typeof synonym == "object") {
				if (synonym.like) synonym = synonym.like;else synonym = "";
			}
			synonym = synonym.toLowerCase();

			this.alatable.forEach(v => {
				if (synonym) {
					if (!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1) return;
				}
				if (sref) {
					if (Array.isArray(sref)) {
						if (!sref.some(sv => sv.name == v.ref || sv.ref == v.ref || sv == v.ref)) return;
					} else {
						if (sref.name != v.ref && sref.ref != v.ref && sref != v.ref) return;
					}
				}
				l.push(this[v.ref]);
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
  * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
  */
	class RegisterManager extends DataManager {

		/**
   * Помещает элемент ссылочных данных в локальную коллекцию
   * @method push
   * @param o {RegisterRow}
   * @param [new_ref] {String} - новое значение ссылки объекта
   */
		push(o, new_ref) {
			if (new_ref && new_ref != o.ref) {
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			} else this.by_ref[o.ref] = o;
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

			if (!attr) attr = {};else if (typeof attr == "string") attr = { ref: attr };

			if (attr.ref && return_row) return this.by_ref[attr.ref];

			attr.action = "select";

			var arr = wsql.alasql(this.get_sql_struct(attr), attr._values),
			    res;

			delete attr.action;
			delete attr._values;

			if (arr.length) {
				if (return_row) res = this.by_ref[this.get_ref(arr[0])];else {
					res = [];
					for (var i in arr) res.push(this.by_ref[this.get_ref(arr[i])]);
				}
			}

			return res;
		}

		/**
   * Удаляет объект из alasql и локального кеша
   * @method unload_obj
   * @param ref
   */
		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some((o, i, a) => {
				if (o.ref == ref) {
					a.splice(i, 1);
					return true;
				}
			});
		}

		/**
   * сохраняет массив объектов в менеджере
   * @method load_array
   * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
   * @param forse {Boolean} - перезаполнять объект
   * @async
   */
		load_array(aattr, forse) {

			var ref,
			    obj,
			    res = [];

			for (var i = 0; i < aattr.length; i++) {

				ref = this.get_ref(aattr[i]);
				obj = this.by_ref[ref];

				if (!obj && !aattr[i]._deleted) {
					obj = this.obj_constructor('', [aattr[i], this]);
					if (forse) obj._set_loaded();
				} else if (obj && aattr[i]._deleted) {
					obj.unload();
					continue;
				} else if (obj.is_new() || forse) {
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}

		/**
   * Возаращает запросов для создания таблиц или извлечения данных
   * @method get_sql_struct
   * @for RegisterManager
   * @param attr {Object}
   * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
   * @return {Object|String}
   */
		get_sql_struct(attr) {
			var t = this,
			    cmd = t.metadata(),
			    res = {},
			    f,
			    action = attr && attr.action ? attr.action : "create_table";

			function sql_selection() {

				var filter = attr.filter || "";

				function list_flds() {
					var flds = [],
					    s = "_t_.ref";

					if (cmd.form && cmd.form.selection) {
						cmd.form.selection.fields.forEach(fld => flds.push(fld));
					} else {

						for (var f in cmd["dimensions"]) {
							flds.push(f);
						}
					}

					flds.forEach(fld => {
						if (fld.indexOf(" as ") != -1) s += ", " + fld;else s += md.sql_mask(fld, true);
					});
					return s;
				}

				function join_flds() {

					var s = "",
					    parts;

					if (cmd.form && cmd.form.selection) {
						for (var i in cmd.form.selection.fields) {
							if (cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1) continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if (parts[0].length > 1) {
								if (s) s += "\n";
								s += "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds() {

					var s = " WHERE (" + (filter ? 0 : 1);

					if (t.sql_selection_where_flds) {
						s += t.sql_selection_where_flds(filter);
					}

					s += ")";

					// допфильтры форм и связей параметров выбора
					if (attr.selection) {
						if (typeof attr.selection == "function") {} else attr.selection.forEach(sel => {
							for (var key in sel) {

								if (typeof sel[key] == "function") {
									s += "\n AND " + sel[key](t, key) + " ";
								} else if (cmd.fields.hasOwnProperty(key)) {
									if (sel[key] === true) s += "\n AND _t_." + key + " ";else if (sel[key] === false) s += "\n AND (not _t_." + key + ") ";else if (typeof sel[key] == "object") {

										if (utils.is_data_obj(sel[key])) s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else {
											var keys = Object.keys(sel[key]),
											    val = sel[key][keys[0]],
											    mf = cmd.fields[key],
											    vmgr;

											if (mf && mf.type.is_ref) {
												vmgr = utils.value_mgr({}, key, mf.type, true, val);
											}

											if (keys[0] == "not") s += "\n AND (not _t_." + key + " = '" + val + "') ";else s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									} else if (typeof sel[key] == "string") s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if (key == "is_folder" && cmd.hierarchical && cmd.group_hierarchy) {
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

				function order_flds() {

					return "";
				}

				// строка фильтра
				if (filter && filter.indexOf("%") == -1) filter = "%" + filter + "%";

				var sql;
				if (t.sql_selection_list_flds) sql = t.sql_selection_list_flds();else sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300").replace("%2", list_flds()).replace("%j", join_flds());

				return sql.replace("%3", where_flds()).replace("%4", order_flds());
			}

			function sql_create() {

				var sql = "CREATE TABLE IF NOT EXISTS ",
				    first_field = true;

				if (attr && attr.postgres) {
					sql += t.table_name + " (";

					if (cmd.splitted) {
						sql += "zone integer";
						first_field = false;
					}

					for (f in cmd.dimensions) {
						if (first_field) {
							sql += f;
							first_field = false;
						} else sql += ", " + f;
						sql += md.sql_type(t, f, cmd.dimensions[f].type, true);
					}

					for (f in cmd.resources) sql += ", " + f + md.sql_type(t, f, cmd.resources[f].type, true);

					for (f in cmd.attributes) sql += ", " + f + md.sql_type(t, f, cmd.attributes[f].type, true);

					sql += ", PRIMARY KEY (";
					first_field = true;
					if (cmd.splitted) {
						sql += "zone";
						first_field = false;
					}
					for (f in cmd["dimensions"]) {
						if (first_field) {
							sql += f;
							first_field = false;
						} else sql += ", " + f;
					}
				} else {
					sql += "`" + t.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					//sql += md.sql_mask(f) + md.sql_type(t, f, cmd.dimensions[f].type);

					for (f in cmd.dimensions) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.dimensions[f].type);

					for (f in cmd.resources) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.resources[f].type);

					for (f in cmd.attributes) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.attributes[f].type);

					// sql += ", PRIMARY KEY (";
					// first_field = true;
					// for(f in cmd["dimensions"]){
					// 	if(first_field){
					// 		sql += "`" + f + "`";
					// 		first_field = false;
					// 	}else
					// 		sql += md.sql_mask(f);
					// }
				}

				sql += ")";

				return sql;
			}

			function sql_update() {
				// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
				var sql = "INSERT OR REPLACE INTO `" + t.table_name + "` (",
				    fields = [],
				    first_field = true;

				for (f in cmd.dimensions) {
					if (first_field) {
						sql += f;
						first_field = false;
					} else sql += ", " + f;
					fields.push(f);
				}
				for (f in cmd.resources) {
					sql += ", " + f;
					fields.push(f);
				}
				for (f in cmd.attributes) {
					sql += ", " + f;
					fields.push(f);
				}

				sql += ") VALUES (?";
				for (f = 1; f < fields.length; f++) {
					sql += ", ?";
				}
				sql += ")";

				return { sql: sql, fields: fields };
			}

			function sql_select() {
				var sql = "SELECT * FROM `" + t.table_name + "` WHERE ",
				    first_field = true;
				attr._values = [];

				for (var f in cmd["dimensions"]) {

					if (first_field) first_field = false;else sql += " and ";

					sql += "`" + f + "`" + "=?";
					attr._values.push(attr[f]);
				}

				if (first_field) sql += "1";

				return sql;
			}

			if (action == "create_table") res = sql_create();else if (action in { insert: "", update: "", replace: "" }) res[t.table_name] = sql_update();else if (action == "select") res = sql_select();else if (action == "select_all") res = sql_select();else if (action == "delete") res = "DELETE FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "drop") res = "DROP TABLE IF EXISTS `" + t.table_name + "`";else if (action == "get_selection") res = sql_selection();

			return res;
		}

		get_ref(attr) {

			if (attr instanceof RegisterRow) attr = attr._obj;

			if (attr.ref) return attr.ref;

			var key = "",
			    dimensions = this.metadata().dimensions;

			for (var j in dimensions) {
				key += key ? "¶" : "";
				if (dimensions[j].type.is_ref) key += utils.fix_guid(attr[j]);else if (!attr[j] && dimensions[j].type.digits) key += "0";else if (dimensions[j].date_part) key += moment(attr[j] || utils.blank.date).format(moment.defaultFormatUtc);else if (attr[j] != undefined) key += String(attr[j]);else key += "$";
			}
			return key;
		}

		caption_flds(attr) {

			var _meta = attr && attr.metadata || this.metadata(),
			    acols = [];

			if (_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;
			} else {

				for (var f in _meta["dimensions"]) {
					acols.push(new Col_struct(f, "*", "ro", "left", "server", _meta["dimensions"][f].synonym));
				}
			}

			return acols;
		}

		create(attr) {

			if (!attr || typeof attr != "object") attr = {};

			var o = this.by_ref[attr.ref];
			if (!o) {

				o = this.obj_constructor('', [attr, this]);

				// Триггер после создания
				let after_create_res = {};
				this.emit("after_create", o, after_create_res);

				if (after_create_res === false) return Promise.resolve(o);else if (typeof after_create_res === "object" && after_create_res.then) return after_create_res;
			}

			return Promise.resolve(o);
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
  * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
  */
	class InfoRegManager extends RegisterManager {

		/**
   * Возаращает массив записей - срез первых значений по ключам отбора
   * @method slice_first
   * @for InfoRegManager
   * @param filter {Object} - отбор + период
   */
		slice_first(filter) {}

		/**
   * Возаращает массив записей - срез последних значений по ключам отбора
   * @method slice_last
   * @for InfoRegManager
   * @param filter {Object} - отбор + период
   */
		slice_last(filter) {}
	}

	/**
  * ### Абстрактный менеджер регистра накопления
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "AccumRegs"}}{{/crossLink}}
  *
  * @class AccumRegManager
  * @extends RegisterManager
  * @constructor
  * @param class_name {string} - имя типа менеджера объекта. например, "areg.goods_on_stores"
  */
	class AccumRegManager extends RegisterManager {}

	/**
  * ### Абстрактный менеджер справочника
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Catalogs"}}{{/crossLink}}
  *
  * @class CatManager
  * @extends RefDataManager
  * @constructor
  * @param class_name {string}
  */
	class CatManager extends RefDataManager {

		constructor(class_name) {
			super(class_name);

			// реквизиты по метаданным
			if (this.metadata().hierarchical && this.metadata().group_hierarchy) {

				/**
     * ### Признак "это группа"
     * @property is_folder
     * @for CatObj
     * @type {Boolean}
     */
				Object.defineProperty(this.obj_constructor('', true).prototype, 'is_folder', {
					get: function () {
						return this._obj.is_folder || false;
					},
					set: function (v) {
						this._obj.is_folder = utils.fix_boolean(v);
					},
					enumerable: true,
					configurable: true
				});
			}
		}

		/**
   * Возвращает объект по наименованию
   * @method by_name
   * @param name {String|Object} - искомое наименование
   * @return {DataObj}
   */
		by_name(name) {

			var o;

			this.find_rows({ name: name }, obj => {
				o = obj;
				return false;
			});

			if (!o) o = this.get();

			return o;
		}

		/**
   * Возвращает объект по коду
   * @method by_id
   * @param id {String|Object} - искомый код
   * @return {DataObj}
   */
		by_id(id) {

			var o;

			this.find_rows({ id: id }, obj => {
				o = obj;
				return false;
			});

			if (!o) o = this.get();

			return o;
		}

		/**
   * Для иерархических справочников возвращает путь элемента
   * @param ref {String|CatObj} - ссылка или объект данных
   * @return {string} - строка пути элемента
   */
		path(ref) {
			var res = [],
			    tobj;

			if (ref instanceof DataObj) tobj = ref;else tobj = this.get(ref, true);

			if (tobj) res.push({ ref: tobj.ref, presentation: tobj.presentation });

			if (tobj && this.metadata().hierarchical) {
				while (true) {
					tobj = tobj.parent;
					if (tobj.empty()) break;
					res.push({ ref: tobj.ref, presentation: tobj.presentation });
				}
			}

			return res;
		}
	}

	/**
  * ### Абстрактный менеджер плана видов характеристик
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfCharacteristics"}}{{/crossLink}}
  *
  * @class ChartOfCharacteristicManager
  * @extends CatManager
  * @constructor
  * @param class_name {string}
  */
	class ChartOfCharacteristicManager extends CatManager {
		toString() {
			return msg.meta_mgrs.cch;
		}
	}

	/**
  * ### Абстрактный менеджер плана счетов
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfAccounts"}}{{/crossLink}}
  *
  * @class ChartOfAccountManager
  * @extends CatManager
  * @constructor
  * @param class_name {string}
  */
	class ChartOfAccountManager extends CatManager {
		toString() {
			return msg.meta_mgrs.cacc;
		}
	}

	/**
  * ### Абстрактный менеджер документов
  * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
  * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Documents"}}{{/crossLink}}
  *
  * @class DocManager
  * @extends RefDataManager
  * @constructor
  * @param class_name {string}
  */
	class DocManager extends RefDataManager {
		toString() {
			return msg.meta_mgrs.doc;
		}
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
	class TaskManager extends CatManager {
		toString() {
			return msg.meta_mgrs.tsk;
		}
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
	class BusinessProcessManager extends CatManager {
		toString() {
			return msg.meta_mgrs.bp;
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
	class Enumerations {
		toString() {
			return msg('meta_classes').enm;
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
	class Catalogs {
		toString() {
			return msg('meta_classes').cat;
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
	class Documents {
		toString() {
			return msg('meta_classes').doc;
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
	class InfoRegs {
		toString() {
			return msg('meta_classes').ireg;
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
	class AccumRegs {
		toString() {
			return msg('meta_classes').areg;
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
	class AccountsRegs {
		toString() {
			return msg('meta_classes').accreg;
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
	class DataProcessors {
		toString() {
			return msg('meta_classes').dp;
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
	class Reports {
		toString() {
			return msg('meta_classes').rep;
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
	class ChartsOfAccounts {
		toString() {
			return msg('meta_classes').cacc;
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
	class ChartsOfCharacteristics {
		toString() {
			return msg('meta_classes').cch;
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
	class Tasks {
		toString() {
			return msg('meta_classes').tsk;
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
	class BusinessProcesses {
		toString() {
			return msg('meta_classes').bp;
		}
	}

	// экспортируем ссылки на конструкторы
	if (!classes.DataManager) {

		Object.defineProperties(classes, {

			DataManager: { value: DataManager },

			RefDataManager: { value: RefDataManager },

			DataProcessorsManager: { value: DataProcessorsManager },

			EnumManager: { value: EnumManager },

			RegisterManager: { value: RegisterManager },

			InfoRegManager: { value: InfoRegManager },

			AccumRegManager: { value: AccumRegManager },

			CatManager: { value: CatManager },

			ChartOfCharacteristicManager: { value: ChartOfCharacteristicManager },

			ChartOfAccountManager: { value: ChartOfAccountManager },

			DocManager: { value: DocManager },

			TaskManager: { value: TaskManager },

			BusinessProcessManager: { value: BusinessProcessManager }

		});
	}

	// создаём коллекции менеджеров
	Object.defineProperties($p, {

		/**
   * Коллекция менеджеров перечислений
   * @property enm
   * @type Enumerations
   * @static
   */
		enm: { value: new Enumerations() },

		/**
   * Коллекция менеджеров справочников
   * @property cat
   * @type Catalogs
   * @static
   */
		cat: { value: new Catalogs() },

		/**
   * Коллекция менеджеров документов
   * @property doc
   * @type Documents
   * @static
   */
		doc: { value: new Documents() },

		/**
   * Коллекция менеджеров регистров сведений
   * @property ireg
   * @type InfoRegs
   * @static
   */
		ireg: { value: new InfoRegs() },

		/**
   * Коллекция менеджеров регистров накопления
   * @property areg
   * @type AccumRegs
   * @static
   */
		areg: { value: new AccumRegs() },

		/**
   * Коллекция менеджеров регистров бухгалтерии
   * @property accreg
   * @type AccountsRegs
   * @static
   */
		accreg: { value: new AccountsRegs() },

		/**
   * Коллекция менеджеров обработок
   * @property dp
   * @type DataProcessors
   * @static
   */
		dp: { value: new DataProcessors() },

		/**
   * Коллекция менеджеров отчетов
   * @property rep
   * @type Reports
   * @static
   */
		rep: { value: new Reports() },

		/**
   * Коллекция менеджеров планов счетов
   * @property cacc
   * @type ChartsOfAccounts
   * @static
   */
		cacc: { value: new ChartsOfAccounts() },

		/**
   * Коллекция менеджеров планов видов характеристик
   * @property cch
   * @type ChartsOfCharacteristics
   * @static
   */
		cch: { value: new ChartsOfCharacteristics() },

		/**
   * Коллекция менеджеров задач
   * @property tsk
   * @type Tasks
   * @static
   */
		tsk: { value: new Tasks() },

		/**
   * Коллекция менеджеров бизнес-процессов
   * @property bp
   * @type Tasks
   * @static
   */
		bp: { value: new BusinessProcesses() }

	});

	// создаём менеджеры виртуальных таблиц метаданных
	meta_sys_init($p);

	// создаём менеджер журнала регистрации
	log_mngr($p);

	// создаём менеджер настроек компоновки
	scheme_settings($p);

	// экспортируем метод получения менеджера значения в utils
	if (!utils.value_mgr) {
		/**
   * ### Возвращает менеджер значения по свойству строки
   * @method value_mgr
   * @param row {Object|TabularSectionRow} - строка табчасти или объект
   * @param f {String} - имя поля
   * @param mf {Object} - описание типа поля mf.type
   * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
   * @param v {*} - устанавливаемое значение
   * @return {DataManager|Array|undefined}
   */
		Object.defineProperty(utils, 'value_mgr', {

			value: function (row, f, mf, array_enabled, v) {
				var property, oproperty, tnames, rt, mgr;
				if (mf._mgr) return mf._mgr;

				function mf_mgr(mgr) {
					if (mgr && mf.types.length == 1) mf._mgr = mgr;
					return mgr;
				}

				if (mf.types.length == 1) {
					tnames = mf.types[0].split(".");
					if (tnames.length > 1 && $p[tnames[0]]) return mf_mgr($p[tnames[0]][tnames[1]]);
				} else if (v && v.type) {
					tnames = v.type.split(".");
					if (tnames.length > 1 && $p[tnames[0]]) return mf_mgr($p[tnames[0]][tnames[1]]);
				}

				property = row.property || row.param;
				if (f != "value" || !property) {

					rt = [];
					mf.types.forEach(function (v) {
						tnames = v.split(".");
						if (tnames.length > 1 && $p[tnames[0]][tnames[1]]) rt.push($p[tnames[0]][tnames[1]]);
					});
					if (rt.length == 1 || row[f] == utils.blank.guid) return mf_mgr(rt[0]);else if (array_enabled) return rt;else if ((property = row[f]) instanceof DataObj) return property._manager;else if (utils.is_guid(property) && property != utils.blank.guid) {
						for (var i in rt) {
							mgr = rt[i];
							if (mgr.get(property, true)) return mgr;
						}
					}
				} else {

					// Получаем объект свойства
					if (utils.is_data_obj(property)) oproperty = property;else if (utils.is_guid(property)) oproperty = $p.cch.properties.get(property);else return;

					if (utils.is_data_obj(oproperty)) {

						if (oproperty.is_new()) return $p.cat.property_values;

						// и через его тип выходми на мнеджера значения
						for (rt in oproperty.type.types) if (oproperty.type.types[rt].indexOf(".") > -1) {
							tnames = oproperty.type.types[rt].split(".");
							break;
						}
						if (tnames && tnames.length > 1 && $p[tnames[0]]) return mf_mgr($p[tnames[0]][tnames[1]]);else return oproperty.type;
					}
				}
			}
		});
	}
}

/**
 * Конструкторы объектов данных
 *
 * @module  metadata
 * @submodule meta_objs
 */

/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumObj"}}{{/crossLink}} - ПеречислениеОбъект
 * - {{#crossLink "CatObj"}}{{/crossLink}} - СправочникОбъект
 * - {{#crossLink "DocObj"}}{{/crossLink}} - ДокументОбъект
 * - {{#crossLink "DataProcessorObj"}}{{/crossLink}} - ОбработкаОбъект
 * - {{#crossLink "TaskObj"}}{{/crossLink}} - ЗадачаОбъект
 * - {{#crossLink "BusinessProcessObj"}}{{/crossLink}} - БизнеспроцессОбъект
 * - {{#crossLink "RegisterRow"}}{{/crossLink}} - ЗаписьРегистраОбъект
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 * @menuorder 20
 * @tooltip Объект данных
 */
class DataObj {

	constructor(attr, manager) {

		var tmp,
		    _ts_ = {},
		    _obj = {},
		    _data = {
			_is_new: !(this instanceof EnumObj)
		};

		// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
		if (!(manager instanceof classes.DataProcessorsManager) && !(manager instanceof classes.EnumManager)) {
			tmp = manager.get(attr, true);
		}

		if (tmp) {
			attr = null;
			return tmp;
		}

		if (manager instanceof classes.EnumManager) {
			_obj.ref = attr.name;
		} else if (!(manager instanceof classes.RegisterManager)) {
			_obj.ref = utils.fix_guid(attr);
		} else {
			_obj.ref = manager.get_ref(attr);
		}

		Object.defineProperties(this, {

			/**
    * ### Фактическое хранилище данных объекта
    * Оно же, запись в таблице объекта локальной базы данных
    * @property _obj
    * @type Object
    * @final
    */
			_obj: {
				value: _obj,
				configurable: true
			},

			/**
    * Хранилище ссылок на табличные части - не сохраняется в базе данных
    * @property _ts_
    */
			_ts_: {
				value: name => _ts_[name] || (_ts_[name] = new TabularSection(name, this)),
				configurable: true
			},

			/**
    * Указатель на менеджер данного объекта
    * @property _manager
    * @type DataManager
    * @final
    */
			_manager: {
				value: manager
			},

			/**
    * Пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
    * @property _data
    * @type DataManager
    * @final
    */
			_data: {
				value: _data,
				configurable: true
			}

		});

		if (manager.alatable && manager.push) {
			manager.alatable.push(_obj);
			manager.push(this, _obj.ref);
		}

		attr = null;
	}

	_getter(f) {

		var mf = this._metadata(f).type,
		    res = this._obj ? this._obj[f] : "",
		    mgr,
		    ref;

		if (f == "type" && typeof res == "object") return res;else if (f == "ref") {
			return res;
		} else if (mf.is_ref) {
			if (mf.digits && typeof res === "number") return res;

			if (mf.hasOwnProperty("str_len") && !utils.is_guid(res)) return res;

			if (mgr = utils.value_mgr(this._obj, f, mf)) {
				if (utils.is_data_mgr(mgr)) return mgr.get(res);else return utils.fetch_type(res, mgr);
			}

			if (res) {
				console.log([f, mf, this._obj]);
				return null;
			}
		} else if (mf.date_part) return utils.fix_date(this._obj[f], true);else if (mf.digits) return utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));else if (mf.types[0] == "boolean") return utils.fix_boolean(this._obj[f]);else return this._obj[f] || "";
	}

	__setter(f, v) {

		const { _obj } = this;
		const mf = this._metadata(f).type;
		let mgr;

		if (f == "type" && v.types) {
			_obj[f] = v;
		} else if (f == "ref") {
			_obj[f] = utils.fix_guid(v);
		} else if (mf.is_ref) {

			if (mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !utils.is_guid(v)) {
				_obj[f] = v;
			} else {
				_obj[f] = utils.fix_guid(v);

				if ($p.utils.is_data_obj(v) && mf.types.indexOf(v._manager.class_name) != -1) {} else {
					mgr = utils.value_mgr(_obj, f, mf, false, v);
					if (mgr) {
						if (mgr instanceof classes.EnumManager) {
							if (typeof v == "string") _obj[f] = v;else if (!v) _obj[f] = "";else if (typeof v == "object") _obj[f] = v.ref || v.name || "";
						} else if (v && v.presentation) {
							if (v.type && !(v instanceof DataObj)) delete v.type;
							mgr.create(v);
						} else if (!utils.is_data_mgr(mgr)) _obj[f] = utils.fetch_type(v, mgr);
					} else {
						if (typeof v != "object") _obj[f] = v;
					}
				}
			}
		} else if (mf.date_part) {
			_obj[f] = utils.fix_date(v, true);
		} else if (mf.digits) {
			_obj[f] = utils.fix_number(v, !mf.hasOwnProperty("str_len"));
		} else if (mf.types[0] == "boolean") {
			_obj[f] = utils.fix_boolean(v);
		} else {
			_obj[f] = v;
		}
	}

	__notify(f) {
		if (!this._data._silent) {
			// TODO: observe
			// Object.getNotifier(this).notify({
			// 	type: 'update',
			// 	name: f,
			// 	oldValue: this._obj[f]
			// });
		}
	}

	_setter(f, v) {
		if (this._obj[f] != v) {
			this.__notify(f);
			this.__setter(f, v);
			this._data._modified = true;
		}
	}

	_getter_ts(f) {
		return this._ts_(f);
	}

	_setter_ts(f, v) {
		const ts = this._ts_(f);
		if (ts instanceof TabularSection && Array.isArray(v)) {
			ts.load(v);
		}
	}

	/**
  * ### valueOf
  * для операций сравнения возвращаем guid
  */
	valueOf() {
		return this.ref;
	}

	/**
  * ### toJSON
  * для сериализации возвращаем внутренний _obj
  */
	toJSON() {
		return this._obj;
	}

	/**
  * ### toString
  * для строкового представления используем
  */
	toString() {
		return this.presentation;
	}

	/**
  * Метаданные текущего объекта
  * @method _metadata
  * @for DataObj
  * @param field_name
  * @type Object
  * @final
  */
	_metadata(field_name) {
		return this._manager.metadata(field_name);
	}

	/**
  * Пометка удаления
  * @property _deleted
  * @for DataObj
  * @type Boolean
  */
	get _deleted() {
		return !!this._obj._deleted;
	}

	/**
  * Признак модифицированности
  */
	get _modified() {
		if (!this._data) return false;
		return !!this._data._modified;
	}

	/**
  * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
  * @method is_new
  * @for DataObj
  * @return {boolean}
  */
	is_new() {
		return this._data._is_new;
	}

	/**
  * Метод для ручной установки признака _прочитан_ (не новый)
  */
	_set_loaded(ref) {
		this._manager.push(this, ref);
		this._data._modified = false;
		this._data._is_new = false;
		return this;
	}

	/**
  * Установить пометку удаления
  * @method mark_deleted
  * @for DataObj
  * @param deleted {Boolean}
  */
	mark_deleted(deleted) {
		this._obj._deleted = !!deleted;
		return this.save();
	}

	/**
  * Проверяет, является ли ссылка объекта пустой
  * @method empty
  * @return {boolean} - true, если ссылка пустая
  */
	empty() {
		return utils.is_empty_guid(this._obj.ref);
	}

	/**
  * Читает объект из внешней или внутренней датабазы асинхронно.
  * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
  * @method load
  * @for DataObj
  * @return {Promise.<DataObj>} - промис с результатом выполнения операции
  * @async
  */
	load() {

		if (this.ref == utils.blank.guid) {

			if (this instanceof CatObj) this.id = "000000000";else this.number_doc = "000000000";

			return Promise.resolve(this);
		} else {

			return this._manager.adapter.load_obj(this).then(() => {
				this._data._modified = false;
				setTimeout(() => {
					this._manager.brodcast_event("obj_loaded", this);
				});
				return this;
			});
		}
	}

	/**
  * Освобождает память и уничтожает объект
  * @method unload
  * @for DataObj
  */
	unload() {
		var f,
		    obj = this._obj;

		this._manager.unload_obj(this.ref);

		if (this._observers) this._observers.length = 0;

		if (this._notis) this._notis.length = 0;

		for (f in this._metadata().tabular_sections) this[f].clear(true);

		for (f in this) {
			if (this.hasOwnProperty(f)) delete this[f];
		}
		for (f in obj) delete obj[f];
		["_ts_", "_obj", "_data"].forEach(f => {
			delete this[f];
		});
		f = obj = null;
	}

	/**
  * ### Записывает объект
  * Ввыполняет подписки на события перед записью и после записи<br />
  * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
  *
  * @method save
  * @for DataObj
  * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
  * @param [operational] {Boolean} - режим проведения документа (Оперативный, Неоперативный)
  * @param [attachments] {Array} - массив вложений
  * @return {Promise.<DataObj>} - промис с результатом выполнения операции
  * @async
  */
	save(post, operational, attachments) {

		if (this instanceof DocObj && typeof post == "boolean") {
			var initial_posted = this.posted;
			this.posted = post;
		}

		var saver,
		    before_save_res = {},
		    reset_modified = () => {

			if (before_save_res === false) {
				if (this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted) {
					this.posted = initial_posted;
				}
			} else this._data._modified = false;

			saver = null;
			before_save_res = null;
			reset_modified = null;

			return this;
		};

		this._manager.emit("before_save", this, before_save_res);

		// если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
		if (before_save_res === false) {
			return Promise.reject(reset_modified());
		} else if (before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then) {
			// если пользовательский обработчик перед записью вернул промис, его и возвращаем
			return before_save_res.then(reset_modified);
		}

		// для объектов с иерархией установим пустого родителя, если иной не указан
		if (this._metadata().hierarchical && !this._obj.parent) this._obj.parent = utils.blank.guid;

		// для документов, контролируем заполненность даты
		if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) {

			if (utils.blank.date == this.date) {
				this.date = new Date();
			}

			if (!this.number_doc) {
				this.new_number_doc();
			}
		} else {
			if (!this.id) {
				this.new_number_doc();
			}
		}

		// если не указаны обязательные реквизиты
		// TODO: show_msg alert-error
		// if (msg && msg.show_msg) {
		// 	for (var mf in this._metadata().fields) {
		// 		if (this._metadata().fields[mf].mandatory && !this._obj[mf]) {
		// 			msg.show_msg({
		// 				title: msg.mandatory_title,
		// 				type: "alert-error",
		// 				text: msg.mandatory_field.replace("%1", this._metadata(mf).synonym)
		// 			});
		// 			before_save_res = false;
		// 			return Promise.reject(reset_modified());
		// 		}
		// 	}
		// }

		// в зависимости от типа кеширования, получаем saver и сохраняем объект во внешней базе
		return this._manager.adapter.save_obj(this, {
			post: post,
			operational: operational,
			attachments: attachments
		})
		// и выполняем обработку после записи
		.then(function (obj) {
			obj._manager.emit("after_save", obj);
			return obj;
		}).then(reset_modified);
	}

	/**
  * ### Возвращает присоединенный объект или файл
  * @method get_attachment
  * @for DataObj
  * @param att_id {String} - идентификатор (имя) вложения
  */
	get_attachment(att_id) {
		return this._manager.adapter.get_attachment(this._manager, this.ref, att_id);
	}

	/**
  * ### Сохраняет объект или файл во вложении
  * Вызывает {{#crossLink "DataManager/save_attachment:method"}} одноименный метод менеджера {{/crossLink}} и передаёт ссылку на себя в качестве контекста
  *
  * @method save_attachment
  * @for DataObj
  * @param att_id {String} - идентификатор (имя) вложения
  * @param attachment {Blob|String} - вложениe
  * @param [type] {String} - mime тип
  * @return Promise.<DataObj>
  * @async
  */
	save_attachment(att_id, attachment, type) {
		return this._manager.save_attachment(this.ref, att_id, attachment, type).then(function (att) {
			if (!this._attachments) this._attachments = {};
			if (!this._attachments[att_id] || !att.stub) this._attachments[att_id] = att;
			return att;
		}.bind(this));
	}

	/**
  * ### Удаляет присоединенный объект или файл
  * Вызывает одноименный метод менеджера и передаёт ссылку на себя в качестве контекста
  *
  * @method delete_attachment
  * @for DataObj
  * @param att_id {String} - идентификатор (имя) вложения
  * @async
  */
	delete_attachment(att_id) {
		return this._manager.delete_attachment(this.ref, att_id).then(function (att) {
			if (this._attachments) delete this._attachments[att_id];
			return att;
		}.bind(this));
	}

	/**
  * ### Включает тихий режим
  * Режим, при котором объект не информирует мир об изменениях своих свойств.<br />
  * Полезно, например, при групповых изменениях, чтобы следящие за объектом формы не тратили время на перерисовку при изменении каждого совйтсва
  *
  * @method _silent
  * @for DataObj
  * @param [v] {Boolean}
  */
	_silent(v) {
		if (typeof v == "boolean") this._data._silent = v;else {
			this._data._silent = true;
			setTimeout(function () {
				this._data._silent = false;
			}.bind(this));
		}
	}

	_mixin_attr(attr) {

		if (attr && typeof attr == "object") {
			if (attr._not_set_loaded) {
				delete attr._not_set_loaded;
				utils._mixin(this, attr);
			} else {
				utils._mixin(this, attr);

				if (!utils.is_empty_guid(this.ref) && (attr.id || attr.name)) this._set_loaded(this.ref);
			}
		}
	}

	/**
  * ### Выполняет команду печати
  * Вызывает одноименный метод менеджера и передаёт себя в качестве объекта печати
  *
  * @method print
  * @for DataObj
  * @param model {String} - идентификатор макета печатной формы
  * @param [wnd] - указатель на форму, из которой произведён вызов команды печати
  * @return {*|{value}|void}
  * @async
  */
	print(model, wnd) {
		return this._manager.print(this, model, wnd);
	}

}

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
Object.defineProperty(DataObj.prototype, "ref", {
	get: function () {
		return this._obj.ref;
	},
	set: function (v) {
		this._obj.ref = utils.fix_guid(v);
	},
	enumerable: true,
	configurable: true
});

/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
class CatObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		this._mixin_attr(attr);
	}

	/**
  * Представление объекта
  * @property presentation
  * @for CatObj
  * @type String
  */
	get presentation() {
		if (this.name || this.id) {
			// return this._metadata().obj_presentation || this._metadata().synonym + " " + this.name || this.id;
			return this.name || this.id || this._metadata().obj_presentation || this._metadata().synonym;
		} else return this._presentation || '';
	}
	/**
  * @type String
  */
	set presentation(v) {
		if (v) this._presentation = String(v);
	}

}
Object.defineProperties(CatObj.prototype, {

	/**
  * ### Код элемента справочника
  * @property id
  * @type String|Number
  */
	id: {
		get: function () {
			return this._obj.id || "";
		},
		set: function (v) {
			this.__notify('id');
			this._obj.id = v;
		},
		enumerable: true
	},

	/**
  * ### Наименование элемента справочника
  * @property name
  * @type String
  */
	name: {
		get: function () {
			return this._obj.name || "";
		},
		set: function (v) {
			this.__notify('name');
			this._obj.name = String(v);
		},
		enumerable: true
	}
});

/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 */
class DocObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		this._mixin_attr(attr);
	}

	/**
  * Представление объекта
  * @property presentation
  * @for DocObj
  * @type String
  */
	get presentation() {
		if (this.number_doc) return (this._metadata().obj_presentation || this._metadata().synonym) + ' №' + this.number_doc + " от " + moment(this.date).format(moment._masks.ldt);else return this._presentation || "";
	}
	/**
  * @type String
  */
	set presentation(v) {
		if (v) this._presentation = String(v);
	}

}

function doc_props_date_number(proto) {

	Object.defineProperties(proto, {

		/**
   * Номер документа
   * @property number_doc
   * @type {String|Number}
   */
		number_doc: {
			get: function () {
				return this._obj.number_doc || "";
			},
			set: function (v) {
				this.__notify('number_doc');
				this._obj.number_doc = v;
			},
			enumerable: true
		},

		/**
   * Дата документа
   * @property date
   * @type {Date}
   */
		date: {
			get: function () {
				return this._obj.date || utils.blank.date;
			},
			set: function (v) {
				this.__notify('date');
				this._obj.date = utils.fix_date(v, true);
			},
			enumerable: true
		}

	});
}

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
Object.defineProperty(DocObj.prototype, "posted", {
	get: function () {
		return this._obj.posted || false;
	},
	set: function (v) {
		this.__notify('posted');
		this._obj.posted = utils.fix_boolean(v);
	},
	enumerable: true
});
doc_props_date_number(DocObj.prototype);

/**
 * ### Абстрактный класс ОбработкаОбъект
 * @class DataProcessorObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
class DataProcessorObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		var f,
		    cmd = manager.metadata();
		for (f in cmd.fields) attr[f] = utils.fetch_type("", cmd.fields[f].type);
		for (f in cmd["tabular_sections"]) attr[f] = [];

		utils._mixin(this, attr);
	}
}

/**
 * ### Абстрактный класс ЗадачаОбъект
 * @class TaskObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
class TaskObj extends CatObj {}
doc_props_date_number(TaskObj.prototype);

/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
class BusinessProcessObj extends CatObj {}
doc_props_date_number(BusinessProcessObj.prototype);

/**
 * ### Абстрактный класс значения перечисления
 * Имеет fake-ссылку и прочие атрибуты объекта данных, но фактически - это просто значение перечисления
 *
 * @class EnumObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {EnumManager}
 */
class EnumObj extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		if (attr && typeof attr == "object") utils._mixin(this, attr);
	}

	/**
  * Порядок элемента перечисления
  * @property order
  * @for EnumObj
  * @type Number
  */
	get order() {
		return this._obj.sequence;
	}
	/**
  * @type Number
  */
	set order(v) {
		this._obj.sequence = parseInt(v);
	}

	/**
  * Наименование элемента перечисления
  * @property name
  * @for EnumObj
  * @type String
  */
	get name() {
		return this._obj.ref;
	}
	/**
  * @type String
  */
	set name(v) {
		this._obj.ref = String(v);
	}

	/**
  * Синоним элемента перечисления
  * @property synonym
  * @for EnumObj
  * @type String
  */
	get synonym() {
		return this._obj.synonym || "";
	}
	/**
  * @type String
  */
	set synonym(v) {
		this._obj.synonym = String(v);
	}

	/**
  * Представление объекта
  * @property presentation
  * @for EnumObj
  * @type String
  */
	get presentation() {
		return this.synonym || this.name;
	}

	/**
  * Проверяет, является ли ссылка объекта пустой
  * @method empty
  * @for EnumObj
  * @return {boolean} - true, если ссылка пустая
  */
	empty() {
		return !this.ref || this.ref == "_";
	}
}

/**
 * ### Запись (строка) регистра
 * Используется во всех типах регистров (сведений, накопления, бухгалтерии)
 *
 * @class RegisterRow
 * @extends DataObj
 * @constructor
 * @param attr {object} - объект, по которому запись будет заполнена
 * @param manager {InfoRegManager|AccumRegManager}
 */
class RegisterRow extends DataObj {

	constructor(attr, manager) {

		// выполняем конструктор родительского объекта
		super(attr, manager);

		if (attr && typeof attr == "object") {
			var tref = attr.ref;
			if (tref) {
				delete attr.ref;
			}
			utils._mixin(this, attr);
			if (tref) {
				attr.ref = tref;
			}
		}

		for (var check in manager.metadata().dimensions) {
			if (!attr.hasOwnProperty(check) && attr.ref) {
				var keys = attr.ref.split("¶");
				Object.keys(manager.metadata().dimensions).forEach((fld, ind) => {
					this[fld] = keys[ind];
				});
				break;
			}
		}
	}

	/**
  * Метаданные строки регистра
  * @method _metadata
  * @for RegisterRow
  * @param field_name
  * @type Object
  */
	_metadata(field_name) {
		var _meta = this._manager.metadata();
		if (!_meta.fields) _meta.fields = Object.assign({}, _meta.dimensions, _meta.resources, _meta.attributes);
		return field_name ? _meta.fields[field_name] : _meta;
	}

	/**
  * Ключ записи регистра
  */
	get ref() {
		return this._manager.get_ref(this);
	}

	get presentation() {
		return this._metadata().obj_presentation || this._metadata().synonym;
	}
}

/**
 * Здесь живут ссылки на конструкторы классов
 * @type {{}}
 */
const classes = exports.classes = { DataObj, CatObj, DocObj, DataProcessorObj, TaskObj, BusinessProcessObj, EnumObj, RegisterRow };

/**
 * Конструкторы табличных частей
 *
 * @module  metadata
 * @submodule meta_tabulars
 */

/**
 * ### Абстрактный объект табличной части
 * - Физически, данные хранятся в {{#crossLink "DataObj"}}{{/crossLink}}, а точнее - в поле типа массив и именем табчасти объекта `_obj`
 * - Класс предоставляет методы для доступа и манипуляции данными табчасти
 *
 * @class TabularSection
 * @constructor
 * @param name {String} - имя табчасти
 * @param owner {DataObj} - владелец табличной части
 * @menuorder 21
 * @tooltip Табличная часть
 */
class TabularSection {

	constructor(name, owner) {

		// Если табчасти нет в данных владельца - создаём
		if (!owner._obj[name]) {
			owner._obj[name] = [];
		}

		Object.defineProperties(this, {

			/**
    * Имя табличной части
    * @property _name
    * @type String
    */
			_name: {
				get: () => name
			},

			/**
    * Объект-владелец табличной части
    * @property _owner
    * @type DataObj
    */
			_owner: {
				get: () => owner
			}

		});
	}

	toString() {
		return "Табличная часть " + this._owner._manager.class_name + "." + this._name;
	}

	/**
  * ### Фактическое хранилище данных объекта
  * Оно же, запись в таблице объекта локальной базы данных
  * @property _obj
  * @type Object
  */
	get _obj() {
		const { _owner, _name } = this;
		return _owner._obj[_name];
	}

	/**
  * ### Возвращает строку табчасти по индексу
  * @method get
  * @param index {Number} - индекс строки табчасти
  * @return {TabularSectionRow}
  */
	get(index) {
		const row = this._obj[index];
		return row ? row._row : null;
	}

	/**
  * ### Возвращает количество элементов в табчасти
  * @method count
  * @return {Number}
  *
  * @example
  *     // количество элементов в табчасти
  *     var count = ts.count();
  */
	count() {
		return this._obj.length;
	}

	/**
  * ### Очищает табличнут часть
  * @method clear
  * @return {TabularSection}
  *
  * @example
  *     // Очищает табличнут часть
  *     ts.clear();
  *
  */
	clear(silent) {

		const { _obj, _owner } = this;

		// for (var i = 0; i < _obj.length; i++){
		// 	delete _obj[i]
		// }
		_obj.length = 0;

		if (!silent && !_owner._data._silent) {
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}
		return this;
	}

	/**
  * ### Удаляет строку табличной части
  * @method del
  * @param val {Number|TabularSectionRow} - индекс или строка табчасти
  */
	del(val, silent) {

		const { _obj, _owner } = this;

		let index;

		if (typeof val == "undefined") return;else if (typeof val == "number") index = val;else if (_obj[val.row - 1]._row === val) index = val.row - 1;else {
			for (var i in _obj) if (_obj[i]._row === val) {
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
		}
		if (index == undefined) return;

		_obj.splice(index, 1);

		_obj.forEach(function (row, index) {
			row.row = index + 1;
		});

		if (!silent && !_owner._data._silent) {
			// TODO: observe
			// Object.getNotifier(_owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}

		_owner._data._modified = true;
	}

	/**
  * ### Находит первую строку, содержащую значение
  * @method find
  * @param val {*} - значение для поиска
  * @param columns {String|Array} - колонки, в которых искать
  * @return {TabularSectionRow}
  */
	find(val, columns) {
		var res = utils._find(this._obj, val, columns);
		if (res) return res._row;
	}

	/**
  * ### Находит строки, соответствующие отбору
  * Если отбор пустой, возвращаются все строки табчасти
  *
  * @method find_rows
  * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
  * @param [callback] {Function} - в который передается строка табчасти на каждой итерации
  * @return {Array}
  */
	find_rows(selection, callback) {

		var t = this,
		    cb = callback ? function (row) {
			return callback.call(t, row._row);
		} : null;

		return utils._find_rows.call(t, t._obj, selection, cb);
	}

	/**
  * ### Меняет местами строки табчасти
  * @method swap
  * @param rowid1 {number}
  * @param rowid2 {number}
  */
	swap(rowid1, rowid2) {
		var tmp = this._obj[rowid1];
		this._obj[rowid1] = this._obj[rowid2];
		this._obj[rowid2] = tmp;

		if (!this._owner._data._silent) {
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}
	}

	/**
  * ### Добавляет строку табчасти
  * @method add
  * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
  * @return {TabularSectionRow}
  *
  * @example
  *     // Добавляет строку в табчасть и заполняет её значениями, переданными в аргументе
  *     var row = ts.add({field1: value1});
  */
	add(attr, silent) {

		var row = this._owner._manager.obj_constructor(this._name, this);

		if (!attr) attr = {};

		// присваиваем типизированные значения по умолчанию
		for (var f in row._metadata().fields) row[f] = attr[f] || "";

		row._obj.row = this._obj.push(row._obj);
		Object.defineProperty(row._obj, "_row", {
			value: row,
			enumerable: false
		});

		if (!silent && !this._owner._data._silent) {
			// TODO: observe
			// Object.getNotifier(this._owner).notify({
			// 	type: 'rows',
			// 	tabular: this._name
			// });
		}

		attr = null;

		this._owner._data._modified = true;

		return row;
	}

	/**
  * ### Выполняет цикл "для каждого"
  * @method each
  * @param fn {Function} - callback, в который передается строка табчасти
  */
	each(fn) {
		this._obj.forEach(row => fn.call(this, row._row));
	}

	/**
  * ### Псевдоним для each
  * @method forEach
  * @type {TabularSection.each|*}
  */
	get forEach() {
		return this.each;
	}

	/**
  * ### Сворачивает табличную часть
  * детали см. в {{#crossLink "TabularSection/aggregate:method"}}{{/crossLink}}
  * @method group_by
  * @param [dimensions] {Array|String}
  * @param [resources] {Array|String}
  */
	group_by(dimensions, resources) {

		try {
			var res = this.aggregate(dimensions, resources, "SUM", true);
			return this.clear(true).load(res);
		} catch (err) {}
	}

	/**
  * ### Сортирует табличную часть
  *
  * @method sort
  * @param fields {Array|String}
  */
	sort(fields) {

		if (typeof fields == "string") fields = fields.split(",");

		var sql = "select * from ? order by ",
		    res = true;
		fields.forEach(function (f) {
			f = f.trim().replace(/\s{1,}/g, " ").split(" ");
			if (res) res = false;else sql += ", ";
			sql += "`" + f[0] + "`";
			if (f[1]) sql += " " + f[1];
		});

		try {
			res = alasql(sql, [this._obj]);
			return this.clear(true).load(res);
		} catch (err) {
			utils.record_log(err);
		}
	}

	/**
  * ### Вычисляет агрегатную функцию по табличной части
  * - Не изменяет исходный объект. Если пропущен аргумент `aggr` - вычисляет сумму.
  * - Стандартные агрегаторы: SUM, COUNT, MIN, MAX, FIRST, LAST, AVG, AGGR, ARRAY, REDUCE
  * - AGGR - позволяет задать собственный агрегатор (функцию) для расчета итогов
  *
  * @method aggregate
  * @param [dimensions] {Array|String} - список измерений
  * @param [resources] {Array|String} - список ресурсов
  * @param [aggr] {String} - агрегатная функция
  * @param [ret_array] {Boolran} - указывает возвращать массив значений
  * @return {Number|Array} - Значение агрегатной фукнции или массив значений
  *
  * @example
  *     // вычисляем сумму (итог) по полю amount табличной части
  *     var total = ts.aggregate("", "amount");
  *
  *     // вычисляем максимальные суммы для всех номенклатур табличной части
  *     // вернёт массив объектов {nom, amount}
  *     var total = ts.aggregate("nom", "amount", "MAX", true);
  */
	aggregate(dimensions, resources, aggr, ret_array) {

		if (typeof dimensions == "string") dimensions = dimensions.split(",");
		if (typeof resources == "string") resources = resources.split(",");
		if (!aggr) aggr = "sum";

		// для простых агрегатных функций, sql не используем
		if (!dimensions.length && resources.length == 1 && aggr == "sum") {
			return this._obj.reduce(function (sum, row, index, array) {
				return sum + row[resources[0]];
			}, 0);
		}

		var sql,
		    res = true;

		resources.forEach(function (f) {
			if (!sql) sql = "select " + aggr + "(`" + f + "`) `" + f + "`";else sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
		});
		dimensions.forEach(function (f) {
			if (!sql) sql = "select `" + f + "`";else sql += ", `" + f + "`";
		});
		sql += " from ? ";
		dimensions.forEach(function (f) {
			if (res) {
				sql += "group by ";
				res = false;
			} else sql += ", ";
			sql += "`" + f + "`";
		});

		try {
			res = alasql(sql, [this._obj]);
			if (!ret_array) {
				if (resources.length == 1) res = res.length ? res[0][resources[0]] : 0;else res = res.length ? res[0] : {};
			}
			return res;
		} catch (err) {
			utils.record_log(err);
		}
	}

	/**
  * ### Загружает табличнут часть из массива объектов
  *
  * @method load
  * @param aattr {Array} - массив объектов к загрузке
  */
	load(aattr) {

		var t = this,
		    arr;

		t.clear(true);
		if (aattr instanceof TabularSection) arr = aattr._obj;else if (Array.isArray(aattr)) arr = aattr;
		if (arr) arr.forEach(function (row) {
			t.add(row, true);
		});

		if (!this._owner._data._silent) {
			// TODO: observe
			// Object.getNotifier(t._owner).notify({
			// 	type: 'rows',
			// 	tabular: t._name
			// });
		}

		return t;
	}

	/**
  * ### Перезаполняет грид данными табчасти с учетом отбора
  * @method sync_grid
  * @param grid {dhtmlxGrid} - элемент управления
  * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
  */
	sync_grid(grid, selection) {
		var grid_data = { rows: [] },
		    columns = [];

		for (var i = 0; i < grid.getColumnCount(); i++) columns.push(grid.getColumnId(i));

		grid.clearAll();
		this.find_rows(selection, function (r) {
			var data = [];
			columns.forEach(function (f) {
				if (utils.is_data_obj(r[f])) data.push(r[f].presentation);else data.push(r[f]);
			});
			grid_data.rows.push({ id: r.row, data: data });
		});
		if (grid.objBox) {
			try {
				grid.parse(grid_data, "json");
				//grid.callEvent("onGridReconstructed", []);
			} catch (e) {}
		}
	}

	toJSON() {
		return this._obj;
	}
}

/**
 * ### Aбстрактная строка табличной части
 *
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 * @menuorder 22
 * @tooltip Строка табчасти
 */
class TabularSectionRow {

	constructor(owner) {

		//var _obj = {};

		Object.defineProperties(this, {

			/**
    * Указатель на владельца данной строки табличной части
    * @property _owner
    * @type TabularSection
    */
			_owner: {
				get: () => owner

			},

			/**
    * ### Фактическое хранилище данных объекта
    * Отображается в поле типа json записи в таблице объекта локальной базы данных
    * @property _obj
    * @type Object
    */
			_obj: {
				value: {}
			}
		});
	}

	/**
  * ### Метаданые строки табличной части
  * @property _metadata
  * @for TabularSectionRow
  * @type Number
  */
	_metadata(field_name) {
		return field_name ? this._owner._owner._metadata(this._owner._name).fields[field_name] : this._owner._owner._metadata(this._owner._name);
	}

	/**
  * ### Номер строки табличной части
  * @property row
  * @for TabularSectionRow
  * @type Number
  * @final
  */
	get row() {
		return this._obj.row || 0;
	}

	/**
  * ### Копирует строку табличной части
  * @method _clone
  * @for TabularSectionRow
  * @type Number
  */
	_clone() {
		return utils._mixin(this._owner._owner._manager.obj_constructor(this._owner._name, this._owner), this._obj);
	}

	get _getter() {
		return DataObj.prototype._getter;
	}

	_setter(f, v) {
		if (this._obj[f] == v || !v && this._obj[f] == utils.blank.guid) return;

		if (!this._owner._owner._data._silent) {}
		// TODO: observe
		// Object.getNotifier(this._owner._owner).notify({
		// 	type: 'row',
		// 	row: this,
		// 	tabular: this._owner._name,
		// 	name: f,
		// 	oldValue: this._obj[f]
		// });


		// учтём связь по типу
		if (this._metadata(f).choice_type) {
			var prop;
			if (this._metadata(f).choice_type.path.length == 2) prop = this[this._metadata(f).choice_type.path[1]];else prop = this._owner._owner[this._metadata(f).choice_type.path[0]];
			if (prop && prop.type) v = utils.fetch_type(v, prop.type);
		}

		DataObj.prototype.__setter.call(this, f, v);
		this._owner._owner._data._modified = true;
	}

}

classes.TabularSection = TabularSection;
classes.TabularSectionRow = TabularSectionRow;

/**
 * Метаданные системных перечислений, регистров и справочников
 *
 * @module  metadata
 * @submodule sys_types
 *
 * Created 28.11.2016
 */

const meta_sys = {
	_id: "meta_sys",
	enm: {
		accumulation_record_type: [{
			order: 0,
			name: "debit",
			synonym: "Приход"
		}, {
			order: 1,
			name: "credit",
			synonym: "Расход"
		}],
		sort_directions: [{
			order: 0,
			name: "asc",
			synonym: "По возрастанию"
		}, {
			order: 1,
			name: "desc",
			synonym: "По убыванию"
		}],
		comparison_types: [{
			order: 0,
			name: "gt",
			synonym: "Больше"
		}, {
			order: 1,
			name: "gte",
			synonym: "Больше или равно"
		}, {
			order: 2,
			name: "lt",
			synonym: "Меньше"
		}, {
			order: 3,
			name: "lte",
			synonym: "Меньше или равно "
		}, {
			order: 4,
			name: "eq",
			synonym: "Равно"
		}, {
			order: 5,
			name: "ne",
			synonym: "Не равно"
		}, {
			"order": 6,
			"name": "in",
			"synonym": "В списке"
		}, {
			order: 7,
			name: "nin",
			synonym: "Не в списке"
		}, {
			order: 8,
			name: "lke",
			synonym: "Подобно "
		}, {
			order: 9,
			name: "nlk",
			synonym: "Не подобно"
		}]
	},
	cat: {
		meta_objs: {},
		meta_fields: {},
		scheme_settings: {
			name: "scheme_settings",
			synonym: "Настройки отчетов и списков",
			input_by_string: ["name"],
			hierarchical: false,
			has_owners: false,
			group_hierarchy: true,
			main_presentation_name: true,
			code_length: 0,
			fields: {
				obj: {
					synonym: "Объект",
					tooltip: "Имя класса метаданных",
					type: {
						types: ["string"],
						str_len: 250
					}
				},
				user: {
					synonym: "Пользователь",
					tooltip: "Если пусто - публичная настройка",
					type: {
						types: ["string"],
						str_len: 50
					}
				},
				query: {
					synonym: "Запрос",
					tooltip: "Индекс CouchDB или текст SQL",
					type: {
						types: ["string"],
						str_len: 0
					}
				}
			},
			tabular_sections: {
				fields: {
					name: "fields",
					synonym: "Доступные поля",
					tooltip: "Состав, порядок и ширина колонок",
					fields: {
						parent: {
							synonym: "Родитель",
							tooltip: "Для плоского списка, родитель пустой",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						use: {
							synonym: "Использование",
							tooltip: "",
							type: {
								types: ["boolean"]
							}
						},
						field: {
							synonym: "Поле",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						width: {
							synonym: "Ширина",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 6
							}
						},
						caption: {
							synonym: "Заголовок",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						tooltip: {
							synonym: "Подсказка",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						ctrl_type: {
							synonym: "Тип",
							tooltip: "Тип элемента управления",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						formatter: {
							synonym: "Формат",
							tooltip: "Функция форматирования",
							type: {
								types: ["cat.formulas"],
								is_ref: true
							}
						},
						editor: {
							synonym: "Редактор",
							tooltip: "Компонент редактирования",
							type: {
								types: ["cat.formulas"],
								is_ref: true
							}
						}

					}
				},
				sorting: {
					name: "sorting",
					synonym: "Поля сортировки",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						field: {
							synonym: "Поле",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						direction: {
							synonym: "Направление",
							tooltip: "",
							type: {
								types: ["enm.sort_directions"],
								"is_ref": true
							}
						}
					}
				},
				dimensions: {
					name: "dimensions",
					synonym: "Поля группировки",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						field: {
							synonym: "Поле",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						}
					}
				},
				resources: {
					name: "resources",
					synonym: "Ресурсы",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						field: {
							synonym: "Поле",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						formula: {
							synonym: "Формула",
							tooltip: "По умолчанию - сумма",
							type: {
								types: ["cat.formulas"],
								is_ref: true
							}
						}
					}
				},
				selection: {
					name: "selection",
					synonym: "Отбор",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						use: {
							synonym: "Использование",
							tooltip: "",
							type: {
								types: ["boolean"]
							}
						},
						left_value: {
							synonym: "Левое значение",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						comparison_type: {
							synonym: "Вид сравнения",
							tooltip: "",
							type: {
								types: ["enm.comparison_types"],
								is_ref: true
							}
						},
						right_value: {
							synonym: "Правое значение",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						}
					}
				},
				params: {
					name: "params",
					synonym: "Параметры",
					tooltip: "",
					fields: {
						param: {
							synonym: "Параметр",
							tooltip: "",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						value_type: {
							synonym: "Тип",
							tooltip: "Тип значения",
							type: {
								types: ["string"],
								str_len: 100
							}
						},
						value: {
							synonym: "Значение",
							tooltip: "Может иметь примитивный или ссылочный тип или массив",
							type: {
								types: ["string", "number"],
								str_len: 0,
								digits: 15,
								fraction_figits: 3
							}
						}
					}
				},
				scheme: {
					"name": "scheme",
					"synonym": "Структура",
					"tooltip": "",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": ["string"],
								"str_len": 10
							}
						},
						"kind": {
							"synonym": "Вид раздела отчета",
							"multiline_mode": false,
							"tooltip": "список, таблица, группировка строк, группировка колонок",
							"type": {
								"types": ["string"],
								"str_len": 10
							}
						}
					}
				}
			},
			cachable: "doc"
		}
	},
	doc: {},
	ireg: {
		"log": {
			name: "log",
			note: "",
			synonym: "Журнал событий",
			dimensions: {
				date: {
					synonym: "Дата",
					tooltip: "Время события",
					type: {
						types: ["number"],
						digits: 15,
						fraction_figits: 0
					}
				},
				sequence: {
					synonym: "Порядок",
					tooltip: "Порядок следования",
					type: {
						types: ["number"],
						digits: 6,
						fraction_figits: 0
					}
				}
			},
			resources: {
				"class": {
					synonym: "Класс",
					tooltip: "Класс события",
					type: {
						types: ["string"],
						str_len: 100
					}
				},
				note: {
					synonym: "Комментарий",
					multiline_mode: true,
					tooltip: "Текст события",
					type: {
						types: ["string"],
						str_len: 0
					}
				},
				obj: {
					synonym: "Объект",
					multiline_mode: true,
					tooltip: "Объект, к которому относится событие",
					type: {
						types: ["string"],
						str_len: 0
					}
				}
			}
		}
	},
	areg: {},
	dp: {
		scheme_settings: {
			name: "scheme_settings",
			synonym: "Варианты настроек",
			fields: {
				scheme: {
					synonym: "Текущая настройка",
					tooltip: "Текущий вариант настроек",
					mandatory: true,
					type: {
						types: ["cat.scheme_settings"],
						is_ref: true
					}
				}
			}
		}
	},
	rep: {},
	cch: {},
	cacc: {}
};

function meta_sys_init($p) {

	/**
  * ### Менеджер объектов метаданных
  * Используется для формирования списков типов документов, справочников и т.д.
  * Например, при работе в интерфейсе с составными типами
  */
	class MetaObjManager extends classes.CatManager {}

	/**
  * ### Менеджер доступных полей
  * Используется при настройке отчетов и динамических списков
  */
	class MetaFieldManager extends classes.CatManager {}

	/**
  * ### Виртуальный справочник MetaObjs
  * undefined
  * @class CatMeta_objs
  * @extends CatObj
  * @constructor
  */
	$p.CatMeta_objs = class CatMeta_objs extends classes.CatObj {};

	/**
  * ### Виртуальный справочник MetaFields
  * undefined
  * @class CatMeta_fields
  * @extends CatObj
  * @constructor
  */
	$p.CatMeta_fields = class CatMeta_fields extends classes.CatObj {};

	// публикуем системные менеджеры
	Object.defineProperties(classes, {

		MetaObjManager: { value: MetaObjManager },

		MetaFieldManager: { value: MetaFieldManager }

	});

	// создаём системные менеджеры метаданных
	Object.defineProperties($p.cat, {
		meta_objs: {
			value: new MetaObjManager('cat.meta_objs')
		},
		meta_fields: {
			value: new MetaFieldManager('cat.meta_fields')
		}
	});
}
/**
 * ### Журнал регистрации
 *
 * @module log_mngr
 *
 * Created 19.12.2016
 */

function log_mngr($p) {

	/**
  * ### Журнал событий
  * Хранит и накапливает события сеанса
  * Является наследником регистра сведений
  * @extends InfoRegManager
  * @class LogManager
  * @static
  */
	class LogManager extends classes.InfoRegManager {

		constructor() {
			super("ireg.log");
		}

		/**
   * Добавляет запись в журнал
   * @param msg {String|Object|Error} - текст + класс события
   * @param [msg.obj] {Object} - дополнительный json объект
   */
		record(msg) {

			if (msg instanceof Error) {
				if (console) console.log(msg);
				msg = {
					class: "error",
					note: msg.toString()
				};
			} else if (typeof msg == "object" && !msg.class && !msg.obj) {
				msg = {
					class: "obj",
					obj: msg,
					note: msg.note
				};
			} else if (typeof msg != "object") msg = { note: msg };

			msg.date = Date.now() + wsql.time_diff;

			// уникальность ключа
			if (!this.smax) this.smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?");
			var res = this.smax([msg.date]);
			if (!res.length || res[0].sequence === undefined) msg.sequence = 0;else msg.sequence = parseInt(res[0].sequence) + 1;

			// класс сообщения
			if (!msg.class) msg.class = "note";

			wsql.alasql("insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)", [msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);
		}

		/**
   * Сбрасывает события на сервер
   * @method backup
   * @param [dfrom] {Date}
   * @param [dtill] {Date}
   */
		backup(dfrom, dtill) {}

		/**
   * Восстанавливает события из архива на сервере
   * @method restore
   * @param [dfrom] {Date}
   * @param [dtill] {Date}
   */
		restore(dfrom, dtill) {}

		/**
   * Стирает события в указанном диапазоне дат
   * @method clear
   * @param [dfrom] {Date}
   * @param [dtill] {Date}
   */
		clear(dfrom, dtill) {}

		show(pwnd) {}

		get(ref, force_promise, do_not_create) {

			if (typeof ref == "object") ref = ref.ref || "";

			if (!this.by_ref[ref]) {

				if (force_promise === false) return undefined;

				var parts = ref.split("¶");
				wsql.alasql("select * from `ireg_log` where date=" + parts[0] + " and sequence=" + parts[1]).forEach(row => new RegisterRow(row, this));
			}

			return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
		}

		get_sql_struct(attr) {

			if (attr && attr.action == "get_selection") {
				var sql = "select * from `ireg_log`";
				if (attr.date_from) {
					if (attr.date_till) sql += " where `date` >= ? and `date` <= ?";else sql += " where `date` >= ?";
				} else if (attr.date_till) sql += " where `date` <= ?";

				return sql;
			} else return classes.InfoRegManager.prototype.get_sql_struct.call(this, attr);
		}

		caption_flds(attr) {

			var _meta = attr && attr.metadata || this.metadata(),
			    acols = [];

			if (_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;
			} else {
				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
				acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));
			}

			return acols;
		}

		data_to_grid(data, attr) {
			var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>".replace("%1", data.length).replace("%2", attr.start).replace("%3", attr.set_parent || ""),
			    caption = this.caption_flds(attr);

			// при первом обращении к методу добавляем описание колонок
			xml += caption.head;

			data.forEach(row => {
				xml += "<row id=\"" + row.ref + "\"><cell>" + moment(row.date - wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + row.sequence + "</cell>" + "<cell>" + (row.class || "") + "</cell><cell>" + (row.note || "") + "</cell></row>";
			});

			return xml + "</rows>";
		}

	}

	/**
  * ### Регистр сведений log
  * Журнал событий
  * @class IregLog
  * @extends RegisterRow
  * @constructor
  */
	$p.IregLog = class IregLog extends classes.RegisterRow {

		get date() {
			return this._getter('date');
		}
		set date(v) {
			this._setter('date', v);
		}

		get sequence() {
			return this._getter('sequence');
		}
		set sequence(v) {
			this._setter('sequence', v);
		}

		get class() {
			return this._getter('class');
		}
		set class(v) {
			this._setter('class', v);
		}

		get note() {
			return this._getter('note');
		}
		set note(v) {
			this._setter('note', v);
		}

		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}

	};

	// публикуем конструктор журнала регистрации
	Object.defineProperties(classes, {

		LogManager: { value: LogManager }

	});

	// создаём менеджер журнала регистрации
	Object.defineProperty($p.ireg, 'log', {
		value: new LogManager('ireg.log')
	});
}
/**
 * ### Менеджер настроек отчетов и динсписков
 *
 * @module scheme_settings
 *
 * Created 19.12.2016
 */

function scheme_settings($p) {

	/**
  * ### Менеджер настроек отчетов и динсписков
  */
	class SchemeSettingsManager extends classes.CatManager {

		/**
   * ### Возвращает объект текущих настроек
   * - если не существует ни одной настройки для _class_name_, создаёт элемент справочника _SchemeSettings_
   * - если в localstorage есть настройка для текущего пользователя, возвращает её
   *
   * @param class_name
   */
		get_scheme(class_name) {
			return new Promise(function (resolve, reject) {

				// получаем сохраненную настройку
				const scheme_name = "scheme_settings_" + class_name.replace(/\./g, "_");
				let ref = $p.wsql.get_user_param(scheme_name, "string");

				function set_param_and_resolve(obj) {
					$p.wsql.set_user_param(scheme_name, obj.ref);
					resolve(obj);
				}

				function find_scheme() {
					$p.cat.scheme_settings.find_rows_remote({
						_view: 'doc/scheme_settings',
						_top: 100,
						_skip: 0,
						_key: {
							startkey: class_name,
							endkey: class_name
						}
					}).then(function (data) {
						// если существует с текущим пользователем, берём его, иначе - первый попавшийся
						if (data.length == 1) {
							set_param_and_resolve(data[0]);
						} else if (data.length) {} else {
							create_scheme();
						}
					}).catch(function (err) {
						create_scheme();
					});
				}

				function create_scheme() {
					if (!$p.utils.is_guid(ref)) {
						ref = $p.utils.generate_guid();
					}
					$p.cat.scheme_settings.create({ ref }).then(function (obj) {
						return obj.fill_default(class_name).save();
					}).then(function (obj) {
						set_param_and_resolve(obj);
					});
				}

				if (ref) {
					// получаем по гвиду
					$p.cat.scheme_settings.get(ref, "promise").then(function (scheme) {
						if (scheme && !scheme.is_new()) {
							resolve(scheme);
						} else {
							find_scheme();
						}
					}).catch(function (err) {
						find_scheme();
					});
				} else {
					find_scheme();
				}
			});
		}

		/**
   * ### Выбор варизанта настроек
   *
   * @param class_name
   */
		select_scheme(class_name) {
			return {};
		}

	}

	/**
  * ### Обработка выбора варианта настроек scheme_settings
  * @class CatScheme_settings
  * @extends DataProcessorObj
  * @constructor
  */
	$p.DpScheme_settings = class DpScheme_settings extends DataProcessorObj {
		get scheme() {
			return this._getter('scheme');
		}
		set scheme(v) {
			this._setter('scheme', v);
		}
	};

	/**
  * ### Справочник scheme_settings
  * Настройки отчетов и списков
  * @class CatScheme_settings
  * @extends CatObj
  * @constructor
  */
	$p.CatScheme_settings = class CatScheme_settings extends classes.CatObj {

		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}

		get user() {
			return this._getter('user');
		}
		set user(v) {
			this._setter('user', v);
		}

		get query() {
			return this._getter('query');
		}
		set query(v) {
			this._setter('query', v);
		}

		get fields() {
			return this._getter_ts('fields');
		}
		set fields(v) {
			this._setter_ts('fields', v);
		}

		get sorting() {
			return this._getter_ts('sorting');
		}
		set sorting(v) {
			this._setter_ts('sorting', v);
		}

		get dimensions() {
			return this._getter_ts('dimensions');
		}
		set dimensions(v) {
			this._setter_ts('dimensions', v);
		}

		get resources() {
			return this._getter_ts('resources');
		}
		set resources(v) {
			this._setter_ts('resources', v);
		}

		get selection() {
			return this._getter_ts('selection');
		}
		set selection(v) {
			this._setter_ts('selection', v);
		}

		get params() {
			return this._getter_ts('params');
		}
		set params(v) {
			this._setter_ts('params', v);
		}

		get scheme() {
			return this._getter_ts('scheme');
		}
		set scheme(v) {
			this._setter_ts('scheme', v);
		}

		/**
   * ### Заполняет настройки по метаданным
   *
   * @param class_name
   */
		fill_default(class_name) {

			const parts = class_name.split("."),
			      _mgr = $p.md.mgr_by_class_name(class_name),
			      _meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
			      fields = this.fields,
			      columns = [];

			function add_column(fld, use) {
				const id = fld.id || fld,
				      fld_meta = _meta.fields[id] || _mgr.metadata(id);
				columns.push({
					field: id,
					caption: fld.caption || fld_meta.synonym,
					tooltip: fld_meta.tooltip,
					width: fld.width || fld_meta.width,
					use: use
				});
			}

			// набираем поля
			if (parts.length < 3) {
				// поля динсписка

				if (_meta.form && _meta.form.selection) {

					_meta.form.selection.cols.forEach(fld => {
						add_column(fld, true);
					});
				} else {

					if (_mgr instanceof $p.classes.CatManager) {
						if (_meta.code_length) {
							columns.push('id');
						}

						if (_meta.main_presentation_name) {
							columns.push('name');
						}
					} else if (_mgr instanceof $p.classes.DocManager) {
						columns.push('number_doc');
						columns.push('date');
					}

					columns.forEach(id => {
						// id, synonym, tooltip, type, width
						add_column(id, true);
					});
				}
			} else {
				// поля табличной части

				for (var field in _meta.fields) {
					add_column(field, true);
				}
			}

			for (var field in _meta.fields) {
				if (!columns.some(function (column) {
					return column.field == field;
				})) {
					add_column(field, false);
				}
			}

			// заполняем табчасть доступных полей
			columns.forEach(function (column) {
				fields.add(column);
			});

			this.obj = class_name;

			if (!this.name) {
				this.name = "Основная";
			}

			return this;
		}

		/**
   * ### Устанавливает _view и _key в параметрах запроса
   */
		fix_select(select, key0) {

			const keys = this.query.split("/");
			const { _key, _view } = select;
			let res;

			if (keys.length > 2) {
				key0 = keys[2];
			}

			if (_key.startkey[0] != key0) {
				_key.startkey[0] = _key.endkey[0] = key0;
				res = true;
			}

			if (keys.length > 1) {
				const select_view = keys[0] + "/" + keys[1];
				if (_view != select_view) {
					select._view = select_view;
					res = true;
				}
			}

			// если есть параметр период, установим значения ключа

			return res;
		}

		/**
   * ### Возвращает массив колонок для динсписка или табчасти
   * @param mode {String} - режим формирования колонок
   * @return {Array}
   */
		columns(mode) {

			const parts = this.obj.split("."),
			      _mgr = $p.md.mgr_by_class_name(this.obj),
			      _meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
			      res = [];

			this.fields.find_rows({ use: true }, function (row) {

				const fld_meta = _meta.fields[row.field] || _mgr.metadata(row.field);
				let column;

				if (mode == "ts") {
					column = {
						key: row.field,
						name: row.caption,
						resizable: true,
						width: row.width == '*' ? 250 : parseInt(row.width) || 140,
						ctrl_type: row.ctrl_type
					};
				} else {
					column = {
						id: row.field,
						synonym: row.caption,
						tooltip: row.tooltip,
						type: fld_meta.type,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : parseInt(row.width) || 140
					};
				}
				res.push(column);
			});
			return res;
		}

		/**
   * ### Возвращает массив имён используемых колонок
   * @return {Array}
   */
		used_fields() {
			const res = [];
			this.fields.find_rows({ use: true }, row => {
				res.push(row.field);
			});
			return res;
		}

		/**
   * ### Возвращает массив элементов для поля выбора
   * @return {Array}
   */
		used_fields_list() {
			return this.fields._obj.map(row => ({
				id: row.field,
				value: row.field,
				text: row.caption,
				title: row.caption
			}));
		}
	};

	$p.CatScheme_settingsDimensionsRow = class CatScheme_settingsDimensionsRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}

		get field() {
			return this._getter('field');
		}
		set field(v) {
			this._setter('field', v);
		}
	};

	$p.CatScheme_settingsResourcesRow = class CatScheme_settingsResourcesRow extends $p.CatScheme_settingsDimensionsRow {

		get formula() {
			return this._getter('formula');
		}
		set formula(v) {
			this._setter('formula', v);
		}
	};

	$p.CatScheme_settingsFieldsRow = class CatScheme_settingsFieldsRow extends $p.CatScheme_settingsDimensionsRow {

		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}

		get width() {
			return this._getter('width');
		}
		set width(v) {
			this._setter('width', v);
		}

		get caption() {
			return this._getter('caption');
		}
		set caption(v) {
			this._setter('caption', v);
		}

		get tooltip() {
			return this._getter('tooltip');
		}
		set tooltip(v) {
			this._setter('tooltip', v);
		}

		get ctrl_type() {
			return this._getter('ctrl_type');
		}
		set ctrl_type(v) {
			this._setter('ctrl_type', v);
		}

		get formatter() {
			return this._getter('formatter');
		}
		set formatter(v) {
			this._setter('formatter', v);
		}

		get editor() {
			return this._getter('editor');
		}
		set editor(v) {
			this._setter('editor', v);
		}

	};

	$p.CatScheme_settingsSortingRow = class CatScheme_settingsSortingRow extends $p.CatScheme_settingsDimensionsRow {

		get direction() {
			return this._getter('direction');
		}
		set direction(v) {
			this._setter('direction', v);
		}
	};

	$p.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}

		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}

		get left_value() {
			return this._getter('left_value');
		}
		set left_value(v) {
			this._setter('left_value', v);
		}

		get comparison_type() {
			return this._getter('comparison_type');
		}
		set comparison_type(v) {
			this._setter('comparison_type', v);
		}

		get right_value() {
			return this._getter('right_value');
		}
		set right_value(v) {
			this._setter('right_value', v);
		}
	};

	$p.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends TabularSectionRow {

		get param() {
			return this._getter('param');
		}
		set param(v) {
			this._setter('param', v);
		}

		get value() {
			return this._getter('value');
		}
		set value(v) {
			this._setter('value', v);
		}
	};

	$p.CatScheme_settingsSchemeRow = class CatScheme_settingsSchemeRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}

		get kind() {
			return this._getter('kind');
		}
		set kind(v) {
			this._setter('kind', v);
		}

	};

	Object.defineProperties($p.cat, {
		scheme_settings: {
			value: new SchemeSettingsManager('cat.scheme_settings')
		}
	});

	Object.defineProperties($p.dp, {
		scheme_settings: {
			value: new classes.DataProcessorsManager('dp.scheme_settings')
		}
	});
}
/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * @module  metadata
 * @submodule meta_meta
 */

/**
 * ### Описание метаданных объекта
 *
 * @class MetaObj
 */
class MetaObj {}

/**
 * ### Описание метаданных поля
 *
 * @class MetaField
 */
class MetaField {}

/**
 * ### Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 *
 * @class Meta
 * @static
 * @menuorder 02
 * @tooltip Описание метаданных
 */

class Meta extends _metadataAbstractAdapter.MetaEventEmitter {

	constructor($p) {

		super();

		let _m = Object.assign({}, meta_sys);

		/**
   * ### Инициализирует метаданные
   * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
   *
   * @method init
   * @for Meta
   * @param [meta_db] {Object|String}
   */
		this.init = function (meta_db) {
			return utils._patch(_m, meta_db);
		};

		/**
   * ### Возвращает описание объекта метаданных
   *
   * @method get
   * @param class_name {String} - например, "doc.calc_order"
   * @param [field_name] {String}
   * @return {Object}
   */
		this.get = function (class_name, field_name) {

			var np = class_name.split(".");

			if (!_m || !_m[np[0]]) {
				return;
			}

			if (!field_name) {
				return _m[np[0]][np[1]];
			}

			var res = { multiline_mode: false, note: "", synonym: "", tooltip: "", type: { is_ref: false, types: ["string"] } },
			    is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			    is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

			if (is_doc && field_name == "number_doc") {
				res.synonym = "Номер";
				res.tooltip = "Номер документа";
				res.type.str_len = 11;
			} else if (is_doc && field_name == "date") {
				res.synonym = "Дата";
				res.tooltip = "Дата документа";
				res.type.date_part = "date_time";
				res.type.types[0] = "date";
			} else if (is_doc && field_name == "posted") {
				res.synonym = "Проведен";
				res.type.types[0] = "boolean";
			} else if (is_cat && field_name == "id") {
				res.synonym = "Код";
			} else if (is_cat && field_name == "name") {
				res.synonym = "Наименование";
			} else if (field_name == "_deleted") {
				res.synonym = "Пометка удаления";
				res.type.types[0] = "boolean";
			} else if (field_name == "is_folder") {
				res.synonym = "Это группа";
				res.type.types[0] = "boolean";
			} else if (field_name == "ref") {
				res.synonym = "Ссылка";
				res.type.is_ref = true;
				res.type.types[0] = class_name;
			} else if (field_name) res = _m[np[0]][np[1]].fields[field_name];else res = _m[np[0]][np[1]];

			return res;
		};

		/**
   * ### Возвращает структуру имён объектов метаданных конфигурации
   *
   * @method classes
   * @return {Object}
   */
		this.classes = function () {
			var res = {};
			for (var i in _m) {
				res[i] = [];
				for (var j in _m[i]) res[i].push(j);
			}
			return res;
		};

		/**
   * ### Возвращает массив используемых баз
   *
   * @method bases
   * @return {Array}
   */
		this.bases = function () {
			var res = {};
			for (var i in _m) {
				for (var j in _m[i]) {
					if (_m[i][j].cachable) {
						let _name = _m[i][j].cachable.replace('_remote', '');
						if (!res[_name]) res[_name] = _name;
					}
				}
			}
			return Object.keys(res);
		};

		/**
   * ### Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
   * @method create_tables
   */
		this.create_tables = function (callback, attr) {

			var cstep = 0,
			    data_names = [],
			    managers = this.classes(),
			    class_name,
			    create = attr && attr.postgres ? "" : "USE md; ";

			function on_table_created() {

				cstep--;
				if (cstep == 0) {
					if (callback) callback(create);else $p.wsql.alasql.utils.saveFile("create_tables.sql", create);
				} else iteration();
			}

			function iteration() {
				var data = data_names[cstep - 1];
				create += data["class"][data.name].get_sql_struct(attr) + "; ";
				on_table_created();
			}

			// TODO переписать на промисах и генераторах и перекинуть в синкер
			"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
				for (class_name in managers[mgr]) data_names.push({ "class": $p[mgr], "name": managers[mgr][class_name] });
			});
			cstep = data_names.length;

			iteration();
		};

		/**
   * ### Возвращает англоязычный синоним строки
   * TODO: перенести этот метод в плагин
   *
   * @method syns_js
   * @param v {String}
   * @return {String}
   */
		this.syns_js = function (v) {
			var synJS = {
				DeletionMark: '_deleted',
				Description: 'name',
				DataVersion: 'data_version', // todo: не сохранять это поле в pouchdb
				IsFolder: 'is_folder',
				Number: 'number_doc',
				Date: 'date',
				Дата: 'date',
				Posted: 'posted',
				Code: 'id',
				Parent_Key: 'parent',
				Owner_Key: 'owner',
				Owner: 'owner',
				Ref_Key: 'ref',
				Ссылка: 'ref',
				LineNumber: 'row'
			};
			if (synJS[v]) return synJS[v];
			return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
		};

		/**
   * ### Возвращает русскоязычный синоним строки
   * TODO: перенести этот метод в плагин
   *
   * @method syns_1с
   * @param v {String}
   * @return {String}
   */
		this.syns_1с = function (v) {
			var syn1c = {
				_deleted: 'DeletionMark',
				name: 'Description',
				is_folder: 'IsFolder',
				number_doc: 'Number',
				date: 'Date',
				posted: 'Posted',
				id: 'Code',
				ref: 'Ref_Key',
				parent: 'Parent_Key',
				owner: 'Owner_Key',
				row: 'LineNumber'
			};
			if (syn1c[v]) return syn1c[v];
			return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
		};

		/**
   * ### Возвращает список доступных печатных форм
   * @method printing_plates
   * @return {Object}
   */
		this.printing_plates = function (pp) {
			if (pp) for (var i in pp.doc) _m.doc[i].printing_plates = pp.doc[i];
		};

		/**
   * ### Возвращает менеджер объекта по имени класса
   * @method mgr_by_class_name
   * @param class_name {String}
   * @return {DataManager|undefined}
   * @private
   */
		this.mgr_by_class_name = function (class_name) {
			if (class_name) {

				let np = class_name.split(".");
				if (np[1] && $p[np[0]]) return $p[np[0]][np[1]];

				const pos = class_name.indexOf("_");
				if (pos) {
					np = [class_name.substr(0, pos), class_name.substr(pos + 1)];
					if (np[1] && $p[np[0]]) return $p[np[0]][np[1]];
				}
			}
		};
	}

	/**
  * ### Возвращает тип поля sql для типа данных
  *
  * @method sql_type
  * @param mgr {DataManager}
  * @param f {String}
  * @param mf {Object} - описание метаданных поля
  * @param pg {Boolean} - использовать синтаксис postgreSQL
  * @return {*}
  */
	sql_type(mgr, f, mf, pg) {
		var sql;
		if (f == "type" && mgr.table_name == "cch_properties" || f == "svg" && mgr.table_name == "cat_production_params") sql = " JSON";else if (mf.is_ref || mf.types.indexOf("guid") != -1) {
			if (!pg) sql = " CHAR";else if (mf.types.every(function (v) {
				return v.indexOf("enm.") == 0;
			})) sql = " character varying(100)";else if (!mf.hasOwnProperty("str_len")) sql = " uuid";else sql = " character varying(" + Math.max(36, mf.str_len) + ")";
		} else if (mf.hasOwnProperty("str_len")) sql = pg ? mf.str_len ? " character varying(" + mf.str_len + ")" : " text" : " CHAR";else if (mf.date_part) {
			if (!pg || mf.date_part == "date") sql = " Date";else if (mf.date_part == "date_time") sql = " timestamp with time zone";else sql = " time without time zone";
		} else if (mf.hasOwnProperty("digits")) {
			if (mf.fraction_figits == 0) sql = pg ? mf.digits < 7 ? " integer" : " bigint" : " INT";else sql = pg ? " numeric(" + mf.digits + "," + mf.fraction_figits + ")" : " FLOAT";
		} else if (mf.types.indexOf("boolean") != -1) sql = " BOOLEAN";else if (mf.types.indexOf("json") != -1) sql = " JSON";else sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	}

	/**
  * ### Заключает имя поля в аппострофы
  * @method sql_mask
  * @param f
  * @param t
  * @return {string}
  * @private
  */
	sql_mask(f, t) {
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	}

	/**
  * ### Возвращает структуру для инициализации таблицы на форме
  * TODO: перенести этот метод в плагин
  *
  * @method ts_captions
  * @param class_name
  * @param ts_name
  * @param source
  * @return {boolean}
  */
	ts_captions(class_name, ts_name, source) {
		if (!source) source = {};

		var mts = this.get(class_name).tabular_sections[ts_name],
		    mfrm = this.get(class_name).form,
		    fields = mts.fields,
		    mf;

		// если имеются метаданные формы, используем их
		if (mfrm && mfrm.obj) {

			if (!mfrm.obj.tabular_sections[ts_name]) return;

			utils._mixin(source, mfrm.obj.tabular_sections[ts_name]);
		} else {

			if (ts_name === "contact_information") fields = { type: "", kind: "", presentation: "" };

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for (var f in fields) {
				mf = mts.fields[f];
				if (!mf.hide) {
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + this.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;
	}

	/**
  * ### Возвращает имя класса по полному имени объекта метаданных 1С
  * TODO: перенести этот метод в плагин
  *
  * @method class_name_from_1c
  * @param name
  */
	class_name_from_1c(name) {

		var pn = name.split(".");
		if (pn.length == 1) return "enm." + name;else if (pn[0] == "Перечисление") name = "enm.";else if (pn[0] == "Справочник") name = "cat.";else if (pn[0] == "Документ") name = "doc.";else if (pn[0] == "РегистрСведений") name = "ireg.";else if (pn[0] == "РегистрНакопления") name = "areg.";else if (pn[0] == "РегистрБухгалтерии") name = "accreg.";else if (pn[0] == "ПланВидовХарактеристик") name = "cch.";else if (pn[0] == "ПланСчетов") name = "cacc.";else if (pn[0] == "Обработка") name = "dp.";else if (pn[0] == "Отчет") name = "rep.";

		return name + this.syns_js(pn[1]);
	}

	/**
  * ### Возвращает полное именя объекта метаданных 1С по имени класса metadata
  * TODO: перенести этот метод в плагин
  *
  * @method class_name_to_1c
  * @param name
  */
	class_name_to_1c(name) {

		var pn = name.split(".");
		if (pn.length == 1) return "Перечисление." + name;else if (pn[0] == "enm") name = "Перечисление.";else if (pn[0] == "cat") name = "Справочник.";else if (pn[0] == "doc") name = "Документ.";else if (pn[0] == "ireg") name = "РегистрСведений.";else if (pn[0] == "areg") name = "РегистрНакопления.";else if (pn[0] == "accreg") name = "РегистрБухгалтерии.";else if (pn[0] == "cch") name = "ПланВидовХарактеристик.";else if (pn[0] == "cacc") name = "ПланСчетов.";else if (pn[0] == "dp") name = "Обработка.";else if (pn[0] == "rep") name = "Отчет.";

		return name + this.syns_1с(pn[1]);
	}

}

Meta.Obj = MetaObj;
Meta.Field = MetaField;

classes.Meta = Meta;

/**
* AES implementation in JavaScript                                   (c) Chris Veness 2005-2016
*                                                                                   MIT Licence
* www.movable-type.co.uk/scripts/aes.html
*/

/**
 * AES (Rijndael cipher) encryption routines,
 *
 * Reference implementation of FIPS-197 http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf.
 *
 * @namespace
 */
function Aes(default_key) {

	'use strict';

	var Aes = this;

	/**
  * AES Cipher function: encrypt 'input' state with Rijndael algorithm [§5.1];
  *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage.
  *
  * @param   {number[]}   input - 16-byte (128-bit) input state array.
  * @param   {number[][]} w - Key schedule as 2D byte-array (Nr+1 x Nb bytes).
  * @returns {number[]}   Encrypted output state array.
  */
	Aes.cipher = function (input, w) {
		var Nb = 4; // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nr = w.length / Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

		var state = [[], [], [], []]; // initialise 4xNb byte-array 'state' with input [§3.4]
		for (var i = 0; i < 4 * Nb; i++) state[i % 4][Math.floor(i / 4)] = input[i];

		state = Aes.addRoundKey(state, w, 0, Nb);

		for (var round = 1; round < Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}

		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);

		var output = new Array(4 * Nb); // convert state to 1-d array before returning [§3.4]
		for (var i = 0; i < 4 * Nb; i++) output[i] = state[i % 4][Math.floor(i / 4)];

		return output;
	};

	/**
  * Perform key expansion to generate a key schedule from a cipher key [§5.2].
  *
  * @param   {number[]}   key - Cipher key as 16/24/32-byte array.
  * @returns {number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes).
  */
	Aes.keyExpansion = function (key) {
		var Nb = 4; // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nk = key.length / 4; // key length (in words): 4/6/8 for 128/192/256-bit keys
		var Nr = Nk + 6; // no of rounds: 10/12/14 for 128/192/256-bit keys

		var w = new Array(Nb * (Nr + 1));
		var temp = new Array(4);

		// initialise first Nk words of expanded key with cipher key
		for (var i = 0; i < Nk; i++) {
			var r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
			w[i] = r;
		}

		// expand the key into the remainder of the schedule
		for (var i = Nk; i < Nb * (Nr + 1); i++) {
			w[i] = new Array(4);
			for (var t = 0; t < 4; t++) temp[t] = w[i - 1][t];
			// each Nk'th word has extra transformation
			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t = 0; t < 4; t++) temp[t] ^= Aes.rCon[i / Nk][t];
			}
			// 256-bit key has subWord applied every 4th word
			else if (Nk > 6 && i % Nk == 4) {
					temp = Aes.subWord(temp);
				}
			// xor w[i] with w[i-1] and w[i-Nk]
			for (var t = 0; t < 4; t++) w[i][t] = w[i - Nk][t] ^ temp[t];
		}

		return w;
	};

	/**
  * Apply SBox to state S [§5.1.1]
  * @private
  */
	Aes.subBytes = function (s, Nb) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};

	/**
  * Shift row r of state S left by r bytes [§5.1.2]
  * @private
  */
	Aes.shiftRows = function (s, Nb) {
		var t = new Array(4);
		for (var r = 1; r < 4; r++) {
			for (var c = 0; c < 4; c++) t[c] = s[r][(c + r) % Nb]; // shift into temp copy
			for (var c = 0; c < 4; c++) s[r][c] = t[c]; // and copy back
		} // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
		return s; // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
	};

	/**
  * Combine bytes of each col of state S [§5.1.3]
  * @private
  */
	Aes.mixColumns = function (s, Nb) {
		for (var c = 0; c < 4; c++) {
			var a = new Array(4); // 'a' is a copy of the current column from 's'
			var b = new Array(4); // 'b' is a•{02} in GF(2^8)
			for (var i = 0; i < 4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;
			}
			// a[n] ^ b[n] is a•{03} in GF(2^8)
			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
		}
		return s;
	};

	/**
  * Xor Round Key into state S [§5.1.4]
  * @private
  */
	Aes.addRoundKey = function (state, w, rnd, Nb) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < Nb; c++) state[r][c] ^= w[rnd * 4 + c][r];
		}
		return state;
	};

	/**
  * Apply SBox to 4-byte word w
  * @private
  */
	Aes.subWord = function (w) {
		for (var i = 0; i < 4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};

	/**
  * Rotate 4-byte word w left by one byte
  * @private
  */
	Aes.rotWord = function (w) {
		var tmp = w[0];
		for (var i = 0; i < 3; i++) w[i] = w[i + 1];
		w[3] = tmp;
		return w;
	};

	// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
	Aes.sBox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

	// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
	Aes.rCon = [[0x00, 0x00, 0x00, 0x00], [0x01, 0x00, 0x00, 0x00], [0x02, 0x00, 0x00, 0x00], [0x04, 0x00, 0x00, 0x00], [0x08, 0x00, 0x00, 0x00], [0x10, 0x00, 0x00, 0x00], [0x20, 0x00, 0x00, 0x00], [0x40, 0x00, 0x00, 0x00], [0x80, 0x00, 0x00, 0x00], [0x1b, 0x00, 0x00, 0x00], [0x36, 0x00, 0x00, 0x00]];

	/**
  * Aes.Ctr: Counter-mode (CTR) wrapper for AES.
  *
  * This encrypts a Unicode string to produces a base64 ciphertext using 128/192/256-bit AES,
  * and the converse to decrypt an encrypted ciphertext.
  *
  * See http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
  *
  * @augments Aes
  */
	Aes.Ctr = {};

	/**
  * Encrypt a text using AES encryption in Counter mode of operation.
  *
  * Unicode multi-byte character safe
  *
  * @param   {string} plaintext - Source text to be encrypted.
  * @param   {string} password - The password to use to generate a key for encryption.
  * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
  * @returns {string} Encrypted text.
  *
  * @example
  *   var encr = Aes.Ctr.encrypt('big secret', 'pāşšŵōřđ', 256); // 'lwGl66VVwVObKIr6of8HVqJr'
  */
	Aes.Ctr.encrypt = function (plaintext, password, nBits) {
		var blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits == 128 || nBits == 192 || nBits == 256)) nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);

		// use AES itself to encrypt password to get cipher key (using plain password as source for key
		// expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
		var nBytes = nBits / 8; // no bytes in key (16/24/32)
		var pwBytes = new Array(nBytes);
		for (var i = 0; i < nBytes; i++) {
			// use 1st 16/24/32 chars of password for key
			pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes)); // gives us 16-byte key
		key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

		// initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
		// [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
		var counterBlock = new Array(blockSize);

		var nonce = new Date().getTime(); // timestamp: milliseconds since 1-Jan-1970
		var nonceMs = nonce % 1000;
		var nonceSec = Math.floor(nonce / 1000);
		var nonceRnd = Math.floor(Math.random() * 0xffff);
		// for debugging: nonce = nonceMs = nonceSec = nonceRnd = 0;

		for (var i = 0; i < 2; i++) counterBlock[i] = nonceMs >>> i * 8 & 0xff;
		for (var i = 0; i < 2; i++) counterBlock[i + 2] = nonceRnd >>> i * 8 & 0xff;
		for (var i = 0; i < 4; i++) counterBlock[i + 4] = nonceSec >>> i * 8 & 0xff;

		// and convert it to a string to go on the front of the ciphertext
		var ctrTxt = '';
		for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

		// generate key schedule - an expansion of the key into distinct Key Rounds for each round
		var keySchedule = Aes.keyExpansion(key);

		var blockCount = Math.ceil(plaintext.length / blockSize);
		var ciphertext = '';

		for (var b = 0; b < blockCount; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			// done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
			for (var c = 0; c < 4; c++) counterBlock[15 - c] = b >>> c * 8 & 0xff;
			for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = b / 0x100000000 >>> c * 8;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule); // -- encrypt counter block --

			// block size is reduced on final block
			var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
			var cipherChar = new Array(blockLength);

			for (var i = 0; i < blockLength; i++) {
				// -- xor plaintext with ciphered counter char-by-char --
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b % 1000 == 0) self.postMessage({ progress: b / blockCount });
			}
		}

		ciphertext = base64Encode(ctrTxt + ciphertext);

		return ciphertext;
	};

	/**
  * Decrypt a text encrypted by AES in counter mode of operation
  *
  * @param   {string} ciphertext - Cipher text to be decrypted.
  * @param   {string} password - Password to use to generate a key for decryption.
  * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
  * @returns {string} Decrypted text
  *
  * @example
  *   var decr = Aes.Ctr.decrypt('lwGl66VVwVObKIr6of8HVqJr', 'pāşšŵōřđ', 256); // 'big secret'
  */
	Aes.Ctr.decrypt = function (ciphertext, password, nBits) {
		var blockSize = 16; // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits == 128 || nBits == 192 || nBits == 256)) nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);

		// use AES to encrypt password (mirroring encrypt routine)
		var nBytes = nBits / 8; // no bytes in key
		var pwBytes = new Array(nBytes);
		for (var i = 0; i < nBytes; i++) {
			pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes - 16)); // expand key to 16/24/32 bytes long

		// recover nonce from 1st 8 bytes of ciphertext
		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

		// generate key schedule
		var keySchedule = Aes.keyExpansion(key);

		// separate ciphertext into blocks (skipping past initial 8 bytes)
		var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
		ciphertext = ct; // ciphertext is now array of block-length strings

		// plaintext will get generated block-by-block into array of block-length strings
		var plaintext = '';

		for (var b = 0; b < nBlocks; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			for (var c = 0; c < 4; c++) counterBlock[15 - c] = b >>> c * 8 & 0xff;
			for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b + 1) / 0x100000000 - 1 >>> c * 8 & 0xff;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule); // encrypt counter block

			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i = 0; i < ciphertext[b].length; i++) {
				// -- xor plaintext with ciphered counter byte-by-byte --
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b % 1000 == 0) self.postMessage({ progress: b / nBlocks });
			}
		}

		plaintext = utf8Decode(plaintext); // decode from UTF8 back to Unicode multi-byte chars

		return plaintext;
	};

	/* Extend String object with method to encode multi-byte string to utf8
  * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
  * - note utf8Encode is an identity function with 7-bit ascii strings, but not with 8-bit strings;
  * - utf8Encode('x') = 'x', but utf8Encode('ça') = 'Ã§a', and utf8Encode('Ã§a') = 'ÃÂ§a'*/
	function utf8Encode(str) {
		//return unescape( encodeURIComponent( str ) );

		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}

	/* Extend String object with method to decode utf8 string to multi-byte */
	function utf8Decode(str) {
		try {
			return decodeURIComponent(escape(str));
		} catch (e) {
			return str; // invalid UTF-8? return as-is
		}
	}

	/* Extend String object with method to encode base64
  * - developer.mozilla.org/en-US/docs/Web/API/window.btoa, nodejs.org/api/buffer.html
  * - note: btoa & Buffer/binary work on single-byte Unicode (C0/C1), so ok for utf8 strings, not for general Unicode...
  * - note: if btoa()/atob() are not available (eg IE9-), try github.com/davidchambers/Base64.js */
	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
		throw new Error('No Base64 Encode');
	}

	/* Extend String object with method to decode base64 */
	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary'); // Node.js
		throw new Error('No Base64 Decode');
	}
}

//if (typeof module != 'undefined' && module.exports) module.exports = Aes;


/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  metadata
 */

/**
 * ### Metadata.js - проект с открытым кодом
 * Приглашаем к сотрудничеству всех желающих. Будем благодарны за любую помощь
 *
 * ### Почему Metadata.js?
 * Библиотека предназначена для разработки бизнес-ориентированных и учетных offline-first браузерных приложений
 * и содержит JavaScript реализацию [Объектной модели 1С](http://v8.1cru/overview/Platform.htm).
 * Библиотека эмулирует наиболее востребованные классы API 1С внутри браузера или Node.js, дополняя их средствами автономной работы и обработки данных на клиенте.
 *
 * ### Для кого?
 * Для разработчиков мобильных и браузерных приложений, которым близка парадигма 1С _на базе бизнес-объектов: документов и справочников_,
 * но которым тесно в рамках традиционной платформы 1С.<br />
 * Metadata.js предоставляет программисту:
 * - высокоуровневые [data-объекты](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html), схожие по функциональности с документами, регистрами и справочниками платформы 1С
 * - инструменты декларативного описания метаданных и автогенерации интерфейса, схожие по функциональности с метаданными и формами платформы 1С
 * - средства событийно-целостной репликации и эффективные классы обработки данных, не имеющие прямых аналогов в 1С
 *
 *
 * @class MetaEngine
 * @static
 * @menuorder 00
 * @tooltip Контекст metadata.js
 */
class MetaEngine {

	constructor() {

		// инициируем базовые свойства
		Object.defineProperties(this, {

			version: {
				value: "2.0.0-beta.13",
				writable: false
			},

			toString: { value: () => "Oknosoft data engine. v:" + this.version },

			/**
    * ### Адаптеры для PouchDB, 1С и т.д.
    * @property adapters
    * @type Object
    * @final
    */
			adapters: {
				value: {}
			},

			/**
    * ### Параметры работы программы
    * @property job_prm
    * @type JobPrm
    * @final
    */
			job_prm: { value: new JobPrm() },

			/**
    * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
    * @property wsql
    * @type WSQL
    * @final
    */
			wsql: { value: new WSQL(this) },

			/**
    * Aes для шифрования - дешифрования данных
    *
    * @property aes
    * @type Aes
    * @final
    */
			aes: { value: new Aes("metadata.js") },

			/**
    * ### Mетаданные конфигурации
    * @property md
    * @type Meta
    * @static
    */
			md: { value: new Meta(this) }

		});

		// создаём конструкторы менеджеров данных
		mngrs(this);

		// дублируем метод record_log в utils
		utils.record_log = this.record_log;

		// при налчии расширений, выполняем их методы инициализации
		if (MetaEngine._constructors && Array.isArray(MetaEngine._constructors)) {
			for (var i = 0; i < MetaEngine._constructors.length; i++) {
				MetaEngine._constructors[i].call(this);
			}
		}
	}

	/**
  * ### Запись журнала регистрации
  *
  * @method record_log
  * @param err
  */
	record_log(err) {
		if (this.ireg && this.ireg.log) {
			this.ireg.log.record(err);
		}
		console.log(err);
	}

	/**
  * Вспомогательные методы
  */
	get utils() {
		return utils;
	}

	/**
  * i18n
  */
	get msg() {
		return msg;
	}

	/**
  * Конструкторы объектов данных
  */
	get classes() {
		//noinspection JSUnresolvedVariable
		return classes;
	}

	/**
  * ### Текущий пользователь
  * Свойство определено после загрузки метаданных и входа впрограмму
  * @property current_user
  * @type CatUsers
  * @final
  */
	get current_user() {

		let user_name, user;

		if (this.superlogin) {
			const session = this.superlogin.getSession();
			user_name = session ? session.user_id : "";
		}

		if (!user_name) {
			user_name = this.wsql.get_user_param("user_name");
		}

		if (this.cat && this.cat.users) {
			user = this.cat.users.by_id(user_name);
			if (!user) {
				this.cat.users.find_rows_remote({
					_view: 'doc/number_doc',
					_key: {
						startkey: ['cat.users', 0, user_name],
						endkey: ['cat.users', 0, user_name]
					}
				});
			}
		}

		return user && !user.empty() ? user : null;
	}

	/**
  * ### Подключает расширения metadata
  * Принимает в качестве параметра объект с полями `proto` и `constructor` типа _function_
  * proto выполняется в момент подключения, constructor - после основного конструктора при создании объекта
  *
  * @param obj
  * @return {MetaEngine}
  */
	static plugin(obj) {

		if (typeof obj.proto == "function") {
			// function style for plugins
			obj.proto(MetaEngine);
		} else if (typeof obj.proto == 'object') {
			Object.keys(obj.proto).forEach(function (id) {
				// object style for plugins
				MetaEngine.prototype[id] = obj.proto[id];
			});
		}

		if (obj.constructor) {

			if (typeof obj.constructor != "function") {
				throw new Error('Invalid plugin: constructor must be a function');
			}

			if (!MetaEngine._constructors) {
				MetaEngine._constructors = [];
			}

			MetaEngine._constructors.push(obj.constructor);
		}

		return MetaEngine;
	}
}
exports.default = MetaEngine;