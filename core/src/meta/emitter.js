

import {own} from './symbols';

/**
 * MetaEventEmitter будет прототипом менеджеров данных
 */
export default class MetaEventEmitter {

  /**
   * Ссылка на владельца
   */
  #own;

  /**
   * Хранилище обработчиков
   * @type {{}}
   */
  #events = {};

  constructor(owner) {
    this.#own = owner;
  }

  get [own]() {
    return this.#own;
  }

	/**
	 * Расширяем метод _on_, чтобы в него можно было передать объект
	 * @param type
	 * @param listener
	 */
	on(type, listener){

		if(typeof listener == 'function' && typeof type != 'object'){
      (this.#events[type] ??= []).push(listener);
			return [type, listener];
		}
		else{
			for(const fld in type){
        typeof type[fld] === 'function' && (this.#events[fld] ??= []).push(type[fld]);
			}
			return this;
		}
	}

  once(type, listener) {
    if(typeof type === 'object'){
      for(const fld in type){
        if(typeof type[fld] === 'function') {
          this.once(type, type[fld]);
        }
      }
    }
    else {
      Object.defineProperty(listener, 'once', {value: true});
      this.on(type, listener);
    }
  }

  /**
   * Отключатель с поддержкой разных аргументоа для совместимости со старым API
   * @param {String|Object|Array} type
   * @param {Function} [listener]
   */
	off(type, listener){
		if(Array.isArray(type)){
      this.off(...type);
		}
		else if(typeof type === 'object'){
      for(const fld in type){
        if(typeof type[fld] === 'function') {
          this.off(type, type[fld]);
        }
      }
    }
		else{
      this.#events[type] = this.#events[type]?.filter(cb => cb !== listener) || [];
		}
	}

  listeners(type) {
    return this.#events[type] || [];
  }

  emit(type, ...args) {
    const rm = [];
    this.listeners(type).forEach(cb => {
      cb(...args);
      if(cb.once) {
        rm.push(cb);
      }
    });
    rm.forEach(cb => this.off(type, cb));
  }

  /**
   * @summary Вызывает обработчики в асинхронном цикле
   * @param type
   * @param [...args]
   */
  emitPromise(type, ...args) {
    const rm = [];
    let res = Promise.resolve();
    this.listeners(type).forEach(cb => {
      res = res.then(() => cb(...args));
      if(cb.once) {
        rm.push(cb);
      }
    });
    rm.forEach(cb => this.off(type, cb));
    return res;
  }

}
