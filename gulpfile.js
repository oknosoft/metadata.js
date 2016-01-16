/**
 * gulpfile.js for metadata.js
 *
 * Created 12.12.2015<br />
 * @author  Evgeniy Malyarov
 */

var gulp = require('gulp');
module.exports = gulp;
var base64 = require('gulp-base64');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var resources = require('./lib/gulp-resource-concat.js');
var path = require('path');
var umd = require('gulp-umd');

gulp.task('build-metadata', function () {
	return gulp.src([
			'./src/common.js',
			'./src/i18n.ru.js',
			'./src/wdg_dhtmlx.js',
			'./src/wdg_dropdown_list.js',
			'./src/wdg_ocombo.js',
			'./src/wdg_ohead_fields.js',
			'./src/wdg_otabular.js',
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
			'./src/events_browser.js',
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

// dhtmlx
gulp.task('build-dhtmlx', function(){
	//gulp.src(['./lib/dhtmlx_debug.js'])
	//	.pipe(rename('dhtmlx.min.js'))
	//	.pipe(uglify({
	//		preserveComments: "license"
	//	}))
	//	.pipe(gulp.dest('./lib'))
	//	.pipe(gulp.dest('./dist'));

	gulp.src([
			'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcommon.js',
			'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcore.js',
			'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcontainer.js',
			'./src/dhtmlx/sources/dhtmlxCalendar/codebase/dhtmlxcalendar.js',
			'./src/dhtmlx/patches/dhtmlxcalendar_lang_ru.js',
			'./src/dhtmlx/sources/dhtmlxCalendar/codebase/ext/dhtmlxcalendar_double.js',
			'./src/dhtmlx/sources/dhtmlxCombo/codebase/dhtmlxcombo.js',

			'./src/dhtmlx/sources/dhtmlxPopup/codebase/dhtmlxpopup.js',
			'./src/dhtmlx/sources/dhtmlxMenu/codebase/dhtmlxmenu.js',
			'./src/dhtmlx/sources/dhtmlxMenu/codebase/ext/dhtmlxmenu_ext.js',
			'./src/dhtmlx/sources/dhtmlxMenu/codebase/ext/dhtmlxmenu_effects.js',

			'./src/dhtmlx/patches/dhtmlxtoolbar.js',
			'./src/dhtmlx/sources/dhtmlxEditor/codebase/dhtmlxeditor.js',
			//'./src/dhtmlx/patches/dhtmlxeditor_ext.js',
			//'./src/dhtmlx/sources/dhtmlxChart/codebase/dhtmlxchart.js',
			'./src/dhtmlx/sources/dhtmlxDataView/codebase/dhtmlxdataview.js',
			//'./src/dhtmlx/sources/dhtmlxList/codebase/dhtmlxlist.js',
			'./src/dhtmlx/sources/dhtmlxTree/codebase/dhtmlxtree.js',
			'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_dragin.js',
			'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_ed.js',
			'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_json.js',
			'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_start.js',
			'./src/dhtmlx/patches/dhtmlxtree_kn.js',
			'./src/dhtmlx/patches/dhtmlxgrid.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_drag.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_export.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_filter.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_nxml.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_selection.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_srnd.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_validation.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_tree.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_link.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_grid.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_dhxcalendar.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_cntr.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_acheck.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_context.js',
			'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_start.js',
			'./src/dhtmlx/patches/dhtmlxgrid_keymap.js',
			'./src/dhtmlx/patches/dhtmlxgrid_excell_calck.js',
			'./src/dhtmlx/patches/dhtmlxgrid_pgn.js',
			'./src/dhtmlx/patches/dhtmlxtreegrid.js',
			'./src/dhtmlx/patches/dhtmlxtreegrid_property.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/dhtmlxform.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_combo.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_calendar.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_btn2state.js',

			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_container.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_editor.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_image.js',

			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_backup.js',
			'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_dyn.js',
			'./src/dhtmlx/patches/dhtmlxform.js',
			'./src/dhtmlx/sources/dhtmlxAccordion/codebase/dhtmlxaccordion.js',
			'./src/dhtmlx/sources/dhtmlxAccordion/codebase/ext/dhtmlxaccordion_dnd.js',
			'./src/dhtmlx/sources/dhtmlxLayout/codebase/dhtmlxlayout.js',
			'./src/dhtmlx/sources/dhtmlxTabbar/codebase/dhtmlxtabbar.js',
			'./src/dhtmlx/sources/dhtmlxTabbar/codebase/dhtmlxtabbar_start.js',
			'./src/dhtmlx/sources/dhtmlxSidebar/codebase/dhtmlxsidebar.js',
			'./src/dhtmlx/sources/dhtmlxCarousel/codebase/dhtmlxcarousel.js',
			'./src/dhtmlx/sources/dhtmlxWindows/codebase/dhtmlxwindows.js',
			'./src/dhtmlx/sources/dhtmlxWindows/codebase/ext/dhtmlxwindows_dnd.js',
			'./src/dhtmlx/sources/dhtmlxWindows/codebase/ext/dhtmlxwindows_resize.js',
			'./src/dhtmlx/sources/dhtmlxWindows/codebase/ext/dhtmlxwindows_menu.js',
			'./src/dhtmlx/sources/dhtmlxMessage/codebase/dhtmlxmessage.js',
			'./src/dhtmlx/sources/dhtmlxDataStore/codebase/datastore.js',
			'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxdataprocessor.js',
			'./src/dhtmlx/sources/dhtmlxCommon/codebase/connector.js',
			'./src/dhtmlx/patches/dhtmlxvault.js',

			'./src/dhtmlx/patches/images.js'

		])
		.pipe(concat('dhtmlx_debug.js'))
		.pipe(gulp.dest('./lib'))
		.pipe(rename('dhtmlx.min.js'))
		.pipe(uglify({
			preserveComments: "license"
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(gulp.dest('./dist'));
});

// dhtmlx css
gulp.task('css-dhtmlx', function () {
	return gulp.src([
			'./lib/dhx_terrace.css',
			'./lib/dhx_web.css'
		])
		.pipe(base64())
		.pipe(csso())
		.pipe(gulp.dest('./dist'));
});

gulp.task('css-dhtmlx-images', function () {
	return gulp.src([
			'./src/dhtmlx/patches/images.css'
		])
		.pipe(base64())
		.pipe(rename('images64.css'))
		.pipe(gulp.dest('./src/dhtmlx/patches'));
});

// metadata css
gulp.task('css-metadata', function () {
	return gulp.src([
			'./src/dhtmlx/patches/dhtmlxtreegrid_property.css',
			'./src/css/upzp20.css',
			'./src/css/options.css'
		])
		.pipe(base64())
		.pipe(concat('metadata.css'))
		.pipe(gulp.dest('./lib'))
		.pipe(csso())
		.pipe(gulp.dest('./dist'));
});

// Сборка сервера для Node.js
gulp.task('build-metadata-core', function(){
	gulp.src([
		'./src/common.js',
		'./src/i18n.ru.js',
		'./src/meta_meta.js',
		'./src/meta_mngrs.js',
		'./src/meta_tabulars.js',
		'./src/meta_objs.js',
		'./src/meta_rest.js',
		'./src/events_node.js',
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
//gulp.task('codex', ['injected-codres', 'injected-codex', 'build-codres', 'build-codex'], function(){});


// Главная задача
//gulp.task('default', ['js-merge' ], function(){});

//gulp.task('watch', ['js-merge' ], function(){
//	gulp.watch('./src/*.js',function(){ gulp.run('core'); });
//});
