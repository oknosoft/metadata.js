/**
 * gulpfile.js for metadata.js
 *
 * Created 12.12.2015<br />
 * @author  Evgeniy Malyarov
 */

var gulp = require('gulp');
module.exports = gulp;
//var changed = require('gulp-changed');
//var concat = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var resources = require('./lib/gulp-resource-concat.js');
var path = require('path');
var umd = require('gulp-umd');

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
			'./src/events.js',
			'./data/merged_data.js',
			'./lib/xml_to_json.js',
			'./lib/filesaver.js'
		])
		.pipe(concat('metadata.js'))
		.pipe(umd({
			exports: function(file) {
				return '$p';
			},
			namespace: function(file) {
				return '$p';
			},
			template: path.join(__dirname, 'lib/gulp-umd-exports-oknosoft.js')
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(gulp.dest('./dist'))
		.pipe(rename('metadata.min.js'))
		.pipe(uglify({
			preserveComments: "license"
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(gulp.dest('./dist'));
});


gulp.task('injected_main', function(){
   gulp.src(['./data/*.xml', './data/log.json'])
	   .pipe(resources('merged_data.js', function (data) {
		   return new Buffer('$p.injected_data._mixin(' + JSON.stringify(data) + ');');
	   }))
	   .pipe(gulp.dest('./data'));
});

// Сжатие dhtmlx
gulp.task('dhtmlx', function(){
	gulp.src(['./lib/dhtmlx_debug.js'])
		.pipe(rename('dhtmlx.min.js'))
		.pipe(uglify({
			preserveComments: "license"
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(gulp.dest('./dist'));
});

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
		'./src/events.js',
		'./src/server.js'
	])
		.pipe(concat('metadata.core.js'))
		.pipe(umd({
			exports: function(file) {
				return '$p';
			},
			namespace: function(file) {
				return '$p';
			},
			template: path.join(__dirname, 'lib/gulp-umd-exports-oknosoft.js')
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(rename('metadata.core.min.js'))
		.pipe(uglify({
			preserveComments: "license"
		}))
		.pipe(gulp.dest('./dist'));
});

// Ресурсы для codres
gulp.task('injected-codres', function(){
	gulp.src([
		'./examples/codex/data/*.html',
		'./examples/codex/data/create_tables.sql',
		'./examples/codex/data/meta.json',
		'./examples/codex/data/data.json'
	])
		.pipe(resources('injected_codres.js', function (data) {
			return new Buffer('$p.injected_data._mixin(' + JSON.stringify(data) + ');');
		}))
		.pipe(gulp.dest('./examples/codex/data'));
});

// Сборка скрипта codres
gulp.task('build-codres', function(){
	gulp.src([
			'./examples/codex/js/codres.js',
			'./examples/codex/data/injected_codres.js'
		])
		.pipe(concat('result.js'))
		.pipe(gulp.dest('./examples/codex/js'));
});

// Ресурсы для codex
gulp.task('injected-codex', function(){
	gulp.src([
		'./examples/codex/data/*.md',
		'./examples/codex/data/*.code',
		'./examples/codex/data/tree.json'
	])
		.pipe(resources('injected_codex.js', function (data) {
			return new Buffer('$p.injected_data._mixin(' + JSON.stringify(data) + ');');
		}))
		.pipe(gulp.dest('./examples/codex/data'));
});

// Сборка скрипта codex
gulp.task('build-codex', function(){
	gulp.src([
			'./examples/codex/js/codex.js',
			'./examples/codex/data/injected_codex.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./examples/codex/js'));
});

// Сборка codex
gulp.task('codex', ['injected-codres', 'injected-codex', 'build-codres', 'build-codex'], function(){});

var toRun = ['js-merge' ];


// Главная задача
gulp.task('default', toRun, function(){});

gulp.task('watch', toRun, function(){
	gulp.watch('./src/*.js',function(){ gulp.run('core'); });
});
