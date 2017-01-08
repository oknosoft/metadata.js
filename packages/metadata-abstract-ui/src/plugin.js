/**
 * Плагин-модификатор abstract-ui для metadata.js
 *
 * @module plugin
 *
 * Created 05.10.2016
 */

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

	/**
	 * ### Модификатор прототипов
	 * @param constructor {MetaEngine}
	 * @param classes {Object}
	 */
	proto(constructor, classes) {

		Object.defineProperty(constructor.prototype, 'UI', {

			value: {

				/**
				 * ### Возвращает имя типа элемента управления для типа поля
				 * TODO: перенести этот метод в плагин
				 *
				 * @method control_by_type
				 * @param type
				 * @return {*}
				 */
				control_by_type (type, val) {
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

	/**
	 * ### Модификатор конструктора MetaEngine
	 * Вызывается в контексте экземпляра MetaEngine
	 */
	constructor(){

		//Метаданные системных перечислений, регистров и справочников

		const {classes} = this

		/**
		 * ### Менеджер объектов метаданных
		 * Используется для формирования списков типов документов, справочников и т.д.
		 * Например, при работе в интерфейсе с составными типами
		 */
		class MetaObjManager extends classes.CatManager{

		}

		/**
		 * ### Менеджер доступных полей
		 * Используется при настройке отчетов и динамических списков
		 */
		class MetaFieldManager extends classes.CatManager{

		}

		/**
		 * ### Виртуальный справочник MetaObjs
		 * undefined
		 * @class CatMeta_objs
		 * @extends CatObj
		 * @constructor
		 */
		this.CatMeta_objs = class CatMeta_objs extends classes.CatObj{}

		/**
		 * ### Виртуальный справочник MetaFields
		 * undefined
		 * @class CatMeta_fields
		 * @extends CatObj
		 * @constructor
		 */
		this.CatMeta_fields = class CatMeta_fields extends classes.CatObj{}

		// публикуем конструкторы системных менеджеров
		Object.defineProperties(classes, {

			MetaObjManager: { value: MetaObjManager },

			MetaFieldManager: { value: MetaFieldManager }

		})

		// создаём системные менеджеры метаданных
		Object.defineProperties(this.cat, {
			meta_objs: {
				value: new MetaObjManager('cat.meta_objs')
			},
			meta_fields: {
				value: new MetaFieldManager('cat.meta_fields')
			}
		})

	}
}
