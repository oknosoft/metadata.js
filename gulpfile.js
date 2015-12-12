/**
 * gulpfile.js for metadata.js
 *
 * Created 12.12.2015<br />
 * @author  Evgeniy Malyarov
 * @module  gulpfile.js
 */

var closure = false;

var gulp = require('gulp');
module.exports = gulp;
//var connect = require('gulp-connect');
//var livereload = require('gulp-livereload');
//var changed = require('gulp-changed');
//var concat = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var dereserve = require('gulp-dereserve');
var argv = require('yargs').argv || {};

gulp.task('js-merge', function () {
	return gulp.src([
			'./src/common.js',
			'./src/i18n.ru.js',
			'./src/wdg_dhtmlx.js',
			'./src/wdg_dropdown_list.js',
			'./src/wdg_ocombo.js',
			'./src/wdg_ohead_fields.js',
			'./src/wdg_otabular.js',
			'./src/wdg_rsvg.js',
			'./src/wdg_filter.js',
			'./src/wdg_dyn_tree.js',
			'./src/wnd_dat.js',
			'./src/wnd_oaddress.js',
			'./src/meta_meta.js',
			'./src/meta_mngrs.js',
			'./src/meta_objs.js',
			'./src/meta_tabulars.js',
			'./src/meta_rest.js',
			'./src/import_export.js',
			'./src/wnd_appcache.js',
			'./src/wnd_sync.js',
			'./src/wnd_obj.js',
			'./src/wnd_selection.js',
			'./src/events.js'
		])
		.pipe(concat('metadata1.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(dereserve())
		.pipe(rename('metadata1.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});


/** @todo Replace UglifyJS with Closure */
gulp.task('uglify', function () {
	return gulp.src('dist/alasql.js', {read: false})
		.pipe(shell([
			'uglifyjs dist/alasql.js -o dist/alasql.min.js',
			'uglifyjs dist/alasql-worker.js -o dist/alasql-worker.min.js',
			//'cd test && (mocha . --reporter dot || if [ $? -ne 0 ] ; then say -v karen Tests failed ; else tput bel; fi)',

//      'java -jar utils/compiler.jar -O "SIMPLE_OPTIMIZATIONS" dist/alasql.js --language_in=ECMASCRIPT5 --js_output_file dist/alasql.min.js',
//      'java -jar utils/compiler.jar -O "SIMPLE_OPTIMIZATIONS" dist/alasql-worker.js --language_in=ECMASCRIPT5 --js_output_file dist/alasql-worker.min.js'
		]));
});

/*
 gulp.task('copy-dist', function(){
 //  gulp.src(['./dist/alasql.js'/*,'./alasql.js.map'* /])
 //    .pipe(gulp.dest('./'));
 });
 */



// Сборка сервера для Node.js
gulp.task('core', function(){
	gulp.src([
		'./src/common.js',
		'./src/i18n.ru.js',
		'./src/meta_meta.js',
		'./src/meta_mngrs.js',
		'./src/meta_tabulars.js',
		'./src/meta_objs.js',
		'./src/meta_rest.js',
		'./src/events.js'
	])
		.pipe(concat('metadata.core.js'))
		.pipe(gulp.dest('./lib'));
});


var toRun = ['js-merge' ];


// Главная задача
gulp.task('default', toRun, function(){});

gulp.task('watch', toRun, function(){
	gulp.watch('./src/*.js',function(){ gulp.run('core'); });
});


gulp.task('doc', function(){
	//return gulp.src('./alasql.js', {read: false})
	//	.pipe(shell([
	//		'jsdoc dist/alasql.js -d ../alasql-org/api',
	//	]));
});
