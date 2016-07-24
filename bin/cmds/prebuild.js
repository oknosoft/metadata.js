/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module prebuild
 * Created 20.07.2016
 */

exports.command = 'prebuild [dir]';
exports.desc = 'Prebuild js files with metadata';
exports.builder = {
	dir: {
		default: '.'
	}
};
exports.handler = function (argv) {
	console.log('prebuild called for dir', argv.dir)
};