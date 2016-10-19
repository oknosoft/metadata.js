/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module plugin
 * Created 05.10.2016
 */



/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

	proto(constructor) {

		Object.defineProperties(constructor.prototype, {

      /**
       * ### Возвращает имя типа элемента управления для типа поля
       * TODO: перенести этот метод в плагин
       *
       * @method control_by_type
       * @param type
       * @return {*}
       */
			rx_control_by_type: {
				value: function (type, val) {
          let ft;

          if (typeof val == "boolean" && type.types.indexOf("boolean") != -1) {
            ft = "ch";

          } else if (typeof val == "number" && type.digits) {
            if (type.fraction_figits < 5)
              ft = "calck";
            else
              ft = "edn";

          } else if (val instanceof Date && type.date_part) {
            ft = "dhxCalendar";

          } else if (type.is_ref) {
            ft = "ocombo";

          } else if (type.date_part) {
            ft = "dhxCalendar";

          } else if (type.digits) {
            if (type.fraction_figits < 5)
              ft = "calck";
            else
              ft = "edn";

          } else if (type.types[0] == "boolean") {
            ft = "ch";

          } else if (type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
            ft = "txt";

          } else {
            ft = "ed";

          }
          return ft;
        }
			}
		})
	}
}
