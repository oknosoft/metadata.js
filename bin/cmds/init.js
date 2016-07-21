/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module init.js
 * Created 20.07.2016
 */

/**
 *  /data
 *  /dist
 *  /dist/imgs
 *  /src
 *  /src/modifiers
 *  /src/templates
 *  /src/templates/cursors
 *  /src/templates/printing_plates
 *  /src/templates/imgs
 *  /src/templates/xml
 */
/*

 */

exports.command = 'init [dir]';
exports.desc = 'Create an empty repo';
exports.builder = {
	dir: {
		default: '.'
	}
};
exports.handler = function (argv) {
	console.log('init called for dir', argv.dir)
};