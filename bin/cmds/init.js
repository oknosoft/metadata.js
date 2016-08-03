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

	var fs = require('fs');
	var path = require('path');
	const decompress = require('decompress');

	console.log('init called for dir', argv.dir);
	decompress(path.join(__dirname, 'helloworld.zip'), argv.dir)
		.then(function (files) {
			console.log('done');
		})
		.catch(function (err) {
			console.log(err);
		});

};