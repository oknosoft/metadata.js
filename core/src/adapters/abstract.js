
import MetaEventEmitter from '../meta/emitter.js'

export class AbstractAdapter extends MetaEventEmitter {


  constructor(owner) {
    super(owner);
    this.attachment = {
      get() {},
      save() {},
      delete() {},
    };
  }

  /**
   * @summary Читает сырые данные из базы данных по массиву ссылок
   *
   * @param {DataManager} mgr
   * @param {Array.<String>} refs
   * @return {Promise.<Array>}
   */
  load(mgr, refs) {
    return Promise.resolve([]);
  }

  /**
   * @summary Читает объект из внешней базы
   *
   * @param {DataObj} obj - объект данных, который необходимо прочитать - дозаполнить
   * @return {Promise.<DataObj>} - промис с загруженным объектом
   */
  loadObj(obj) {
    return Promise.resolve(obj);
  }

  /**
   * @summary Записывает объект в базу данных
   *
   * @param {DataObj} obj - записываемый объект
   * @param {Object} attr - дополнительные параметры записи
   * @return {Promise.<DataObj>} - промис с записанным объектом
   */
  saveObj(obj, attr) {
    return Promise.resolve(obj);
  }

  /**
   * @summary Возвращает набор данных для дерева динсписка
   *
   * @param {DataManager} mgr
   * @param {Object} [selection]
   * @return {Promise.<Array>}
   */
  tree(mgr, selection){
    return Promise.resolve([]);
  }

  /**
   * @summary Найти строки
   * @desc Возвращает массив дата-объектов, обрезанный отбором _selection_
   * Eсли отбор пустой, возвращаются все строки из базы
   *
   * @param {DataManager} mgr
   * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
   * @param {Number} [selection._top]
   * @param {Number} [selection._skip]
   * @param {Boolean} [selection._raw] - если _истина_, возвращаются сырые данные, а не дата-объекты
   * @param {Boolean} [selection._total_count] - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
   * @return {Promise.<Array>}
   */
  rows(mgr, selection) {
    return Promise.resolve([]);
  }
}
