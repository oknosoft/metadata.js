/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
class Utils{

	constructor() {

		/**
		 * ### Moment для операций с интервалами и датами
		 *
		 * @property moment
		 * @type Function
		 * @final
		 */
		this.moment = typeof moment == "function" ? moment : require('moment');
		this.moment._masks = {
			date:       "DD.MM.YY",
			date_time:  "DD.MM.YYYY HH:mm",
			ldt:        "DD MMMM YYYY, HH:mm",
			iso:        "YYYY-MM-DDTHH:mm:ss"
		};

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
			var m = this.moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", this.moment.ISO_8601]);
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
		return v && v instanceof DataManager;
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

		if (v1 == v2)
			return true;
		else if (typeof v1 === typeof v2)
			return false;

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


}

