/**
 * Плагин-модификатор react-ui для metadata.js
 *
 * @module plugin
 *
 * Created 07.01.2017
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

    export_handlers(constructor, classes)

  },

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor(){

    // модифицируем метод columns() справочника scheme_settings - добавляем форматтеры и редакторы
    Object.defineProperty(this.CatScheme_settings.prototype, 'rx_columns', {
      value: rx_columns(this)
    })

    // методы печати в прототип DataManager
    Object.defineProperties(this.classes.DataManager, {
      value: print
    })

  }
}
