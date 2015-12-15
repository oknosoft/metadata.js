/**
 *
 * Created 14.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  gulp-resource-concat
 */

"use strict";

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function (fileName, converter) {
	if (!fileName) {
		throw new PluginError('gulp-jsonconcat', 'Missing fileName option for gulp-jsonconcat');
	}

	var data = {};
	var firstFile = null;
	//We keep track of when we should skip the conversion for error cases
	var skipConversion = false;

	function bufferContents(file, enc, cb) {
		// ignore empty files
		if (file.isNull()) {
			cb();
			return;
		}

		// we don't do streams (yet)
		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-concat',  'Streaming not supported'));
			cb();
			return;
		}

		if (!firstFile) {
			firstFile = file;
		}

		data[path.basename(file.path)] = path.extname(file.path) == ".json" ? JSON.parse(file.contents.toString()) : file.contents.toString();

		cb();
	}

	function endStream(cb) {

		// no files passed in, no file goes out
		if (!firstFile) {
			cb();
			return;
		}

		var joinedFile;

		// if file opt was a file path
		// clone everything from the latest file
		if (typeof fileName === 'string') {
			joinedFile = firstFile.clone({contents: false});
			joinedFile.path = path.join(firstFile.base, fileName);
		} else {
			joinedFile = new File(fileName);
		}

		joinedFile.contents = converter(data);

		this.push(joinedFile);
		cb();
	}

	return through.obj(bufferContents, endStream);
};
