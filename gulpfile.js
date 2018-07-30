/**
 * gulpfile.js for metadata.js
 *
 * Created 12.12.2015<br />
 * @author  Evgeniy Malyarov
 */

const gulp = require('gulp'),
	base64 = require('gulp-base64'),
	csso = require('gulp-csso'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	resources = require('./src/utils/resource-concat.js'),
	path = require('path'),
  strip = require('gulp-strip-comments'),
	umd = require('gulp-umd'),
  wrap = require('gulp-wrap'),
	replace = require('gulp-replace');

module.exports = gulp;

// данные файла package.json
var package_data = require('./package.json');


gulp.task('prebuild', function(){

	var prebuild = require('./src/utils/prebuild.js');

	return gulp.src(['./src/utils/prebuild.js'])
		.pipe(prebuild(package_data))
		.pipe(gulp.dest('./tmp'));

});

gulp.task('dhtmlx-ui', function () {
  return gulp.src([
    './src/widgets/*.js',
    './src/reporting.js',
    './src/import_export.js',
    './data/merged_data.js',
  ])
    .pipe(concat('dhtmlx-widgets.js'))
    .pipe(wrap({ src: './packages/metadata-dhtmlx/src/wrapper.js'}))
    .pipe(gulp.dest('./packages/metadata-dhtmlx/src'))
});


gulp.task('injected_main', function(){
    return gulp.src(['./data/*.xml'])
    .pipe(resources('merged_data.js', function (data) {
        return new Buffer('$p.injected_data._mixin(' + JSON.stringify(data) + ');');
	}))
	.pipe(gulp.dest('./data'));
});

// dhtmlxscheduler
gulp.task('build-scheduler', function(){

	return gulp.src([
			'./lib/dhtmlxscheduler/license.js',
			'./lib/dhtmlxscheduler/dhtmlxscheduler.js',
			'./lib/dhtmlxscheduler/dhtmlxscheduler_locale_ru.js',
			'./lib/dhtmlxscheduler/dhtmlxscheduler_minical.js'
			// './lib/dhtmlxscheduler/dhtmlxscheduler_timeline.js',
			// './lib/dhtmlxscheduler/dhtmlxscheduler_treetimeline.js'
		])
		.pipe(concat('scheduler.js'))
		.pipe(gulp.dest('./lib/dhtmlxscheduler'))
		.pipe(rename('dhtmlxscheduler.min.js'))
		.pipe(uglify({
			preserveComments: function (node, comment) {
				return comment.value[0]=="!";
			}
		}))
		.pipe(gulp.dest('./lib/dhtmlxscheduler'));
		//.pipe(gulp.dest('./dist'));
});

// dhtmlx
gulp.task('build-dhtmlx', function(){

	return gulp.src([
		'./src/dhtmlx/patches/license.js',
		'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcommon.js',
		'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcore.js',
		'./src/dhtmlx/sources/dhtmlxCommon/codebase/dhtmlxcontainer.js',
		'./src/dhtmlx/sources/dhtmlxCalendar/codebase/dhtmlxcalendar.js',
		'./src/dhtmlx/patches/dhtmlxcalendar_lang_ru.js',
		'./src/dhtmlx/sources/dhtmlxCalendar/codebase/ext/dhtmlxcalendar_double.js',
		'./src/dhtmlx/patches/dhtmlxcombo.js',
		'./src/dhtmlx/sources/dhtmlxPopup/codebase/dhtmlxpopup.js',
		'./src/dhtmlx/sources/dhtmlxMenu/codebase/dhtmlxmenu.js',
		'./src/dhtmlx/sources/dhtmlxMenu/codebase/ext/dhtmlxmenu_ext.js',
		'./src/dhtmlx/sources/dhtmlxMenu/codebase/ext/dhtmlxmenu_effects.js',
		'./src/dhtmlx/patches/dhtmlxtoolbar.js',
		//'./src/dhtmlx/sources/dhtmlxEditor/codebase/dhtmlxeditor.js',
		//'./src/dhtmlx/patches/dhtmlxeditor_ext.js',
		//'./src/dhtmlx/sources/dhtmlxChart/codebase/dhtmlxchart.js',
		'./src/dhtmlx/sources/dhtmlxDataView/codebase/dhtmlxdataview.js',
		//'./src/dhtmlx/sources/dhtmlxList/codebase/dhtmlxlist.js',
		//'./src/dhtmlx/sources/dhtmlxTree/codebase/dhtmlxtree.js',
		//'./src/dhtmlx/patches/dhtmlxtree.js',
		//'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_dragin.js',
		//'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_ed.js',
		//'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_json.js',
		//'./src/dhtmlx/sources/dhtmlxTree/codebase/ext/dhtmlxtree_start.js',
		//'./src/dhtmlx/patches/dhtmlxtree_kn.js',
		'./src/dhtmlx/patches/dhtmlxgrid.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_drag.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_export.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_filter.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_selection.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_srnd.js',
		//'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_nxml.js',
		//'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_start.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/ext/dhtmlxgrid_validation.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_tree.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_link.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_grid.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_dhxcalendar.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_cntr.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_acheck.js',
		'./src/dhtmlx/sources/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_context.js',
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
			//'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_editor.js',
		'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_item_image.js',
			//'./src/dhtmlx/sources/dhtmlxForm/codebase/ext/dhtmlxform_backup.js',
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

		'./src/dhtmlx/patches/images.js',

		'./src/dhtmlx/dhtmlxTreeView/codebase/dhtmlxtreeview.js'

		])
		.pipe(concat('dhtmlx_debug.js'))
    //.pipe(strip({safe: true}))
		.pipe(gulp.dest('./lib'))
		.pipe(rename('dhtmlx.min.js'))
		.pipe(uglify({
			preserveComments: function (node, comment) {
				return comment.value[0]=="!";
			}
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(gulp.dest('./packages/metadata-dhtmlx'));
});

// dhtmlx css
gulp.task('css-dhtmlx', function () {
	return gulp.src([
			'./lib/dhx_terrace.css',
			'./lib/dhx_web.css'
		])
		.pipe(base64())
		.pipe(csso())
		.pipe(gulp.dest('./packages/metadata-dhtmlx'));
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
		'./src/dhtmlx/dhtmlxTreeView/codebase/skins/dhtmlxtreeview_dhx_terrace.css',
		//'./lib/daterangepicker/daterangepicker.css',
		'./src/css/upzp20.css'
			//'./src/css/options.css'
		])
		.pipe(base64())
		.pipe(concat('metadata.css'))
		//.pipe(gulp.dest('./lib'))
    .pipe(csso())
		.pipe(gulp.dest('./packages/metadata-dhtmlx'));
});

// metadata css
gulp.task('css-icon1c', function () {
	return gulp.src([
		'./src/css/icon1c.css'
		//'./src/css/options.css'
	])
		.pipe(base64())
		.pipe(concat('icon1c.min.css'))
		//.pipe(csso())
		.pipe(gulp.dest('./src/css'));
});


const metadataCoreFiles = [
    './packages/metadata-core/src/utils.js',
    './packages/metadata-core/src/i18n.ru.js',
    './packages/metadata-core/src/jobprm.js',
    './packages/metadata-core/src/wsql.js',
    './packages/metadata-core/src/mngrs.js',
    './packages/metadata-core/src/objs.js',
    './packages/metadata-core/src/tabulars.js',
    './packages/metadata-core/src/meta.js',
    './packages/metadata-core/lib/aes.js',
    './packages/metadata-core/src/common.js'
];


// Ресурсы для codres
gulp.task('injected-codres', function(){
	return gulp.src([
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
	return gulp.src([
			'./examples/codex/js/codres.js',
			'./examples/codex/data/injected_codres.js'
		])
		.pipe(concat('result.js'))
		.pipe(gulp.dest('./examples/codex/js'));
});

// Ресурсы для codex
gulp.task('injected-codex', function(){
	return gulp.src([
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
	return gulp.src([
			'./examples/codex/js/codex.js',
			'./examples/codex/data/injected_codex.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./examples/codex/js'));
});

gulp.task('paper-minify', () => {
	return gulp.src(['./lib/paper-core.js'])
		.pipe(rename('paper-core.min.js'))
		.pipe(uglify({
			preserveComments: function (node, comment) {
				return comment.value[0]=="!";
			}
		}))
		.pipe(gulp.dest('./lib'))
	}
);

