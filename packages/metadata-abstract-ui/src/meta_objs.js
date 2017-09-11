/**
 * ### Метаданные системных перечислений, регистров и справочников
 *
 * @module meta_objs
 *
 * Created 08.01.2017
 */

export default function meta_objs() {

	const {classes} = this;
	const {CatManager, InfoRegManager, CatObj} = classes;

	/**
	 * ### Менеджер объектов метаданных
	 * Используется для формирования списков типов документов, справочников и т.д.
	 * Например, при работе в интерфейсе с составными типами
	 */
	class MetaObjManager extends CatManager {

	}

	/**
	 * ### Менеджер доступных полей
	 * Используется при настройке отчетов и динамических списков
	 */
	class MetaFieldManager extends CatManager {

	}

	/**
	 * ### Виртуальный справочник MetaObjs
	 * undefined
	 * @class CatMeta_objs
	 * @extends CatObj
	 * @constructor
	 */
	this.CatMeta_objs = class CatMeta_objs extends CatObj {
	};

	/**
	 * ### Виртуальный справочник MetaFields
	 * undefined
	 * @class CatMeta_fields
	 * @extends CatObj
	 * @constructor
	 */
	this.CatMeta_fields = class CatMeta_fields extends CatObj {
	};

	// публикуем конструкторы системных менеджеров
	Object.assign(classes, {MetaObjManager, MetaFieldManager});

	// создаём системные менеджеры метаданных
	this.cat.create('meta_objs', MetaObjManager);
	this.cat.create('meta_fields', MetaFieldManager);

}