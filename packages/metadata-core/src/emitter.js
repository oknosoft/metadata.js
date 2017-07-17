

import EventEmitter from 'events'

/**
 * ### MetaEventEmitter будет прототипом менеджеров данных
 */
export default class MetaEventEmitter extends EventEmitter{

	/**
	 * Расширяем метод _on_, чтобы в него можно было передать объект
	 * @param type
	 * @param listener
	 */
	on(type, listener){

		if(typeof listener == 'function' && typeof type != 'object'){
			super.on(type, listener);
			return [type, listener];
		}
		else{
			for(let fld in type){
				if(typeof type[fld] == 'function'){
					super.on(fld, type[fld]);
				}
			}
		}
	}

	off(type, listener){
		if(listener){
			super.removeListener(type, listener);
		}
		else if(Array.isArray(type)){
			super.removeListener(...type);
		}
		else if(typeof type == 'function'){
			throw new TypeError('MetaEventEmitter.off: type must be a string')
		}
		else{
			super.removeAllListeners(type);
		}
	}

}
