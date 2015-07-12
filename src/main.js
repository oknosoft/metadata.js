/**
 * Created by unpete on 30.04.2015.
 */

var $p = require("common");

/**
 * Обёртка для подключения через AMD или CommonJS
 * https://github.com/umdjs/umd
 */
if (typeof define === 'function' && define.amd) {
	// Support AMD (e.g. require.js)
	define('$p', $p);
} else if (typeof module === 'object' && module) { // could be `null`
	// Support CommonJS module
	module.exports = $p;
}