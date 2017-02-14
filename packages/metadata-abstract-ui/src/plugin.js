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
		ui(constructor, classes)
		tabulars(constructor, classes)
	},

	/**
	 * ### Модификатор конструктора MetaEngine
	 * Вызывается в контексте экземпляра MetaEngine
	 */
	constructor(){

		meta_objs.call(this)
		log_manager.call(this)
		scheme_settings.call(this)

	}
}
