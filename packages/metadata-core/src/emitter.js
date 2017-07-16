

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
		if(super.off){
			super.off(type, listener);
		}
		else{
			if(listener){
				super.removeListener(type, listener);
			}
			else{
				super.removeAllListeners(type);
			}
		}
	}

}
