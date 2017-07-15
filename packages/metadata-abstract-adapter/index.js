/*!
 metadata-abstract-adapter v2.0.1-beta.18, built:2017-07-15
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT. To obtain "Commercial License", contact info@oknosoft.ru
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('events'));

class MetaEventEmitter extends EventEmitter{
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
class AbstracrAdapter extends MetaEventEmitter{
	constructor($p) {
		super();
		this.$p = $p;
	}
	load_obj(tObj) {
		return Promise.resolve(tObj);
	}
	load_array(_mgr, refs, with_attachments) {
		return Promise.resolve([]);
	}
	save_obj(tObj, attr) {
		return Promise.resolve(tObj);
	}
	get_tree(_mgr, attr){
		return Promise.resolve([]);
	}
	get_selection(_mgr, attr){
		return Promise.resolve([]);
	}
	find_rows(_mgr, selection) {
		return Promise.resolve([]);
	}
}

exports.MetaEventEmitter = MetaEventEmitter;
exports.AbstracrAdapter = AbstracrAdapter;
