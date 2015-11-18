/**
 * @module  qwery_bonzo_bean
 */

if(typeof $ == "undefined" && !window.jQuery){
	function $(selector, context) {
		return bonzo(qwery(selector, context));
	}
}