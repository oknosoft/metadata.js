/*!
 metadata-abstract-ui v2.0.2-beta.27, built:2017-09-12
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

function meta_objs() {
	const {classes} = this;
	const {CatManager, InfoRegManager, CatObj} = classes;
	class MetaObjManager extends CatManager {
	}
	class MetaFieldManager extends CatManager {
	}
	this.CatMeta_objs = class CatMeta_objs extends CatObj {
	};
	this.CatMeta_fields = class CatMeta_fields extends CatObj {
	};
	Object.assign(classes, {MetaObjManager, MetaFieldManager});
	this.cat.create('meta_objs', MetaObjManager);
	this.cat.create('meta_fields', MetaFieldManager);
}

function log_manager() {
	const {classes} = this;
	const {InfoRegManager, RegisterRow} = classes;
	class LogManager extends InfoRegManager {
		constructor(owner) {
			super(owner, 'ireg.log');
		}
		record(msg) {
			const {wsql} = this._owner.$p;
			if (msg instanceof Error) {
				if (console)
					console.log(msg);
				msg = {
					class: 'error',
					note: msg.toString(),
				};
			}
			else if (typeof msg == 'object' && !msg.class && !msg.obj) {
				msg = {
					class: 'obj',
					obj: msg,
					note: msg.note,
				};
			}
			else if (typeof msg != 'object')
				msg = {note: msg};
			msg.date = Date.now() + wsql.time_diff;
			if (!this.smax) {
				this.smax = alasql.compile('select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?');
			}
			var res = this.smax([msg.date]);
			if (!res.length || res[0].sequence === undefined)
				msg.sequence = 0;
			else
				msg.sequence = parseInt(res[0].sequence) + 1;
			if (!msg.class)
				msg.class = 'note';
			wsql.alasql('insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)',
				[msg.date + '¶' + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : '']);
		}
		backup(dfrom, dtill) {
		}
		restore(dfrom, dtill) {
		}
		clear(dfrom, dtill) {
		}
		show(pwnd) {
		}
		get(ref, force_promise, do_not_create) {
			if (typeof ref == 'object')
				ref = ref.ref || '';
			if (!this.by_ref[ref]) {
				if (force_promise === false)
					return undefined;
				var parts = ref.split('¶');
				this._owner.$p.wsql.alasql('select * from `ireg_log` where date=' + parts[0] + ' and sequence=' + parts[1])
					.forEach(row => new RegisterRow(row, this));
			}
			return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
		}
		get_sql_struct(attr) {
			if (attr && attr.action == 'get_selection') {
				var sql = 'select * from `ireg_log`';
				if (attr.date_from) {
					if (attr.date_till)
						sql += ' where `date` >= ? and `date` <= ?';
					else
						sql += ' where `date` >= ?';
				} else if (attr.date_till)
					sql += ' where `date` <= ?';
				return sql;
			} else
				return InfoRegManager.prototype.get_sql_struct.call(this, attr);
		}
	}
	this.IregLog = class IregLog extends RegisterRow {
		get date() {
			return this._getter('date');
		}
		set date(v) {
			this._setter('date', v);
		}
		get sequence() {
			return this._getter('sequence');
		}
		set sequence(v) {
			this._setter('sequence', v);
		}
		get class() {
			return this._getter('class');
		}
		set class(v) {
			this._setter('class', v);
		}
		get note() {
			return this._getter('note');
		}
		set note(v) {
			this._setter('note', v);
		}
		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}
	};
	classes.LogManager = LogManager;
	this.ireg.create('log', LogManager);
}

function scheme_settings() {
	const {wsql, utils, cat, dp, md, constructor} = this;
	const {CatManager, DataProcessorsManager, DataProcessorObj, CatObj, DocManager, TabularSectionRow} = constructor.classes || this;
	class SchemeSettingsManager extends CatManager {
		get_scheme(class_name) {
			return new Promise((resolve, reject) => {
				const scheme_name = this.scheme_name(class_name);
				const find_scheme = () => {
					const opt = {
						_view: 'doc/scheme_settings',
						_top: 100,
						_skip: 0,
						_key: {
							startkey: [class_name, 0],
							endkey: [class_name, 9999],
						},
					};
					const query = this.find_rows_remote ? this.find_rows_remote(opt) : this.pouch_find_rows(opt);
					query.then((data) => {
						if (data.length == 1) {
							set_default_and_resolve(data[0]);
						}
						else if (data.length) {
							if (!$p.current_user || !$p.current_user.name) {
								set_default_and_resolve(data[0]);
							}
							else {
								const {name} = $p.current_user;
								if (!data.some((scheme) => {
										if (scheme.user == name) {
											set_default_and_resolve(scheme);
											return true;
										}
									})) {
									set_default_and_resolve(data[0]);
								}
							}
						}
						else {
							create_scheme();
						}
					})
						.catch((err) => {
							create_scheme();
						});
				};
				let ref = wsql.get_user_param(scheme_name, 'string');
				function set_default_and_resolve(obj) {
					resolve(obj.set_default());
				}
				function create_scheme() {
					if (!utils.is_guid(ref)) {
						ref = utils.generate_guid();
					}
					cat.scheme_settings.create({ref})
						.then((obj) => obj.fill_default(class_name).save())
						.then((obj) => set_default_and_resolve(obj));
				}
				if (ref) {
					cat.scheme_settings.get(ref, 'promise')
						.then((scheme) => {
							if (scheme && !scheme.is_new()) {
								resolve(scheme);
							}
							else {
								find_scheme();
							}
						})
						.catch((err) => {
							find_scheme();
						});
				} else {
					find_scheme();
				}
			});
		}
		scheme_name(class_name) {
			return 'scheme_settings_' + class_name.replace(/\./g, '_');
		}
	}
	class SchemeSelectManager extends DataProcessorsManager {
		dp(scheme) {
			const _obj = dp.scheme_settings.create();
			_obj.scheme = scheme;
			const _meta = Object.assign({}, this.metadata('scheme'));
			_meta.choice_params = [{
				name: 'obj',
				path: scheme.obj,
			}];
			return {_obj, _meta};
		}
	}
	this.DpScheme_settings = class DpScheme_settings extends DataProcessorObj {
		get scheme() {
			return this._getter('scheme');
		}
		set scheme(v) {
			this._setter('scheme', v);
		}
	};
	this.CatScheme_settings = class CatScheme_settings extends CatObj {
		get obj() {
			return this._getter('obj');
		}
		set obj(v) {
			this._setter('obj', v);
		}
		get user() {
			return this._getter('user');
		}
		set user(v) {
			this._setter('user', v);
		}
		get order() {
			return this._getter('order');
		}
		set order(v) {
			this._setter('order', v);
		}
		get formula() {
			return this._getter('formula');
		}
		set formula(v) {
			this._setter('formula', v);
		}
		get query() {
			return this._getter('query');
		}
		set query(v) {
			this._setter('query', v);
		}
		get tag() {
			return this._getter('tag');
		}
		set tag(v) {
			this._setter('tag', v);
		}
		get date_from() {
			return this._getter('date_from');
		}
		set date_from(v) {
			this._setter('date_from', v);
		}
		get date_till() {
			return this._getter('date_till');
		}
		set date_till(v) {
			this._setter('date_till', v);
		}
		get fields() {
			return this._getter_ts('fields');
		}
		set fields(v) {
			this._setter_ts('fields', v);
		}
		get sorting() {
			return this._getter_ts('sorting');
		}
		set sorting(v) {
			this._setter_ts('sorting', v);
		}
		get dimensions() {
			return this._getter_ts('dimensions');
		}
		set dimensions(v) {
			this._setter_ts('dimensions', v);
		}
		get resources() {
			return this._getter_ts('resources');
		}
		set resources(v) {
			this._setter_ts('resources', v);
		}
		get selection() {
			return this._getter_ts('selection');
		}
		set selection(v) {
			this._setter_ts('selection', v);
		}
		get params() {
			return this._getter_ts('params');
		}
		set params(v) {
			this._setter_ts('params', v);
		}
		get composition() {
			return this._getter_ts('composition');
		}
		set composition(v) {
			this._setter_ts('composition', v);
		}
		fill_default(class_name) {
			const parts = class_name.split('.'),
				_mgr = md.mgr_by_class_name(class_name),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				columns = [];
			function add_column(fld, use) {
				const id = fld.id || fld,
					fld_meta = _meta.fields[id] || _mgr.metadata(id);
				columns.push({
					field: id,
					caption: fld.caption || fld_meta.synonym,
					tooltip: fld_meta.tooltip,
					width: fld.width || fld_meta.width,
					use: use,
				});
			}
			if (parts.length < 3) {
				if (_meta.form && _meta.form.selection) {
					_meta.form.selection.cols.forEach(fld => {
						add_column(fld, true);
					});
				} else {
					if (_mgr instanceof CatManager) {
						if (_meta.code_length) {
							columns.push('id');
						}
						if (_meta.main_presentation_name) {
							columns.push('name');
						}
					} else if (_mgr instanceof DocManager) {
						columns.push('number_doc');
						columns.push('date');
					}
					columns.forEach((id) => {
						add_column(id, true);
					});
				}
			} else {
				for (var field in _meta.fields) {
					add_column(field, true);
				}
			}
			for (var field in _meta.fields) {
				if (!columns.some(function (column) {
						return column.field == field;
					})) {
					add_column(field, false);
				}
			}
			columns.forEach((column) => {
				this.fields.add(column);
			});
			const {resources} = _mgr.obj_constructor('', true);
			if (resources) {
				resources.forEach(function (column) {
					this.resources.add({field: column});
				});
			}
			this.obj = class_name;
			if (!this.name) {
				this.name = 'Основная';
				this.date_from = new Date((new Date()).getFullYear().toFixed() + '-01-01');
				this.date_till = utils.date_add_day(new Date(), 1);
			}
			return this;
		}
		set_default() {
			wsql.set_user_param(this._manager.scheme_name(this.obj), this.ref);
			return this;
		}
		fix_select(select, key0) {
			const keys = this.query.split('/');
			const {_key, _view} = select;
			let res;
			if (keys.length > 2) {
				key0 = keys[2];
			}
			if (_key.startkey[0] != key0) {
				_key.startkey[0] = _key.endkey[0] = key0;
				res = true;
			}
			if (keys.length > 1) {
				const select_view = keys[0] + '/' + keys[1];
				if (_view != select_view) {
					select._view = select_view;
					res = true;
				}
			}
			if (this.query.match('date')) {
				const {date_from, date_till} = this;
				_key.startkey[1] = date_from.getFullYear();
				_key.startkey[2] = date_from.getMonth() + 1;
				_key.startkey[3] = date_from.getDate();
				_key.endkey[1] = date_till.getFullYear();
				_key.endkey[2] = date_till.getMonth() + 1;
				_key.endkey[3] = date_till.getDate();
			}
			return res;
		}
		columns(mode) {
			const parts = this.obj.split('.'),
				_mgr = md.mgr_by_class_name(this.obj),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				res = [];
			this.fields.find_rows({use: true}, (row) => {
				const fld_meta = _meta.fields[row.field] || _mgr.metadata(row.field);
				let column;
				if (mode == 'ts') {
					column = {
						key: row.field,
						name: row.caption,
						resizable: true,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					};
				} else {
					column = {
						id: row.field,
						synonym: row.caption,
						tooltip: row.tooltip,
						type: fld_meta.type,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					};
				}
				res.push(column);
			});
			return res;
		}
		dims(parent) {
			return this.dimensions._obj.map((row) => row.field);
		}
		used_fields(parent) {
			const res = [];
			this.fields.find_rows({use: true}, (row) => {
				res.push(row.field);
			});
			return res;
		}
		used_fields_list() {
			return this.fields._obj.map((row) => ({
				id: row.field,
				value: row.field,
				text: row.caption,
				title: row.caption,
			}));
		}
	};
	this.CatScheme_settingsDimensionsRow = class CatScheme_settingsDimensionsRow extends TabularSectionRow {
		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}
		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}
		get field() {
			return this._getter('field');
		}
		set field(v) {
			this._setter('field', v);
		}
	};
	this.CatScheme_settingsResourcesRow = class CatScheme_settingsResourcesRow extends this.CatScheme_settingsDimensionsRow {
		get formula() {
			return this._getter('formula');
		}
		set formula(v) {
			this._setter('formula', v);
		}
	};
	this.CatScheme_settingsFieldsRow = class CatScheme_settingsFieldsRow extends this.CatScheme_settingsDimensionsRow {
		get width() {
			return this._getter('width');
		}
		set width(v) {
			this._setter('width', v);
		}
		get caption() {
			return this._getter('caption');
		}
		set caption(v) {
			this._setter('caption', v);
		}
		get tooltip() {
			return this._getter('tooltip');
		}
		set tooltip(v) {
			this._setter('tooltip', v);
		}
		get ctrl_type() {
			return this._getter('ctrl_type');
		}
		set ctrl_type(v) {
			this._setter('ctrl_type', v);
		}
		get formatter() {
			return this._getter('formatter');
		}
		set formatter(v) {
			this._setter('formatter', v);
		}
		get editor() {
			return this._getter('editor');
		}
		set editor(v) {
			this._setter('editor', v);
		}
	};
	this.CatScheme_settingsSortingRow = class CatScheme_settingsSortingRow extends this.CatScheme_settingsDimensionsRow {
		get direction() {
			return this._getter('direction');
		}
		set direction(v) {
			this._setter('direction', v);
		}
	};
	this.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends TabularSectionRow {
		get parent() {
			return this._getter('parent');
		}
		set parent(v) {
			this._setter('parent', v);
		}
		get use() {
			return this._getter('use');
		}
		set use(v) {
			this._setter('use', v);
		}
		get left_value() {
			return this._getter('left_value');
		}
		set left_value(v) {
			this._setter('left_value', v);
		}
		get comparison_type() {
			return this._getter('comparison_type');
		}
		set comparison_type(v) {
			this._setter('comparison_type', v);
		}
		get right_value() {
			return this._getter('right_value');
		}
		set right_value(v) {
			this._setter('right_value', v);
		}
	};
	this.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends TabularSectionRow {
		get param() {
			return this._getter('param');
		}
		set param(v) {
			this._setter('param', v);
		}
		get value() {
			return this._getter('value');
		}
		set value(v) {
			this._setter('value', v);
		}
	};
	this.CatScheme_settingsCompositionRow = class CatScheme_settingsCompositionRow extends this.CatScheme_settingsDimensionsRow {
		get kind() {
			return this._getter('kind');
		}
		set kind(v) {
			this._setter('kind', v);
		}
		get definition() {
			return this._getter('definition');
		}
		set definition(v) {
			this._setter('definition', v);
		}
	};
	cat.create('scheme_settings', SchemeSettingsManager);
	dp.create('scheme_settings', SchemeSelectManager);
}

function mngrs() {
  const {classes, msg} = this;
  Object.defineProperties(classes.DataManager.prototype, {
    family_name: {
      get: function () {
        return msg.meta_mgrs[this.class_name.split('.')[0]].replace(msg.meta_mgrs.mgr + ' ', '');
      }
    },
    frm_selection_name: {
      get: function () {
        return `${msg.open_frm} ${msg.selection_parent} ${msg.meta_parents[this.class_name.split('.')[0]]} '${this._meta.synonym || this._meta.name}'`;
      }
    },
    frm_obj_name: {
      get: function () {
        return `${msg.open_frm} ${msg.obj_parent} ${msg.meta_parents[this.class_name.split('.')[0]]} '${this._meta.synonym || this._meta.name}'`;
      }
    }
  });
}

var plugin = {
  constructor() {
    meta_objs.call(this);
    log_manager.call(this);
    scheme_settings.call(this);
    mngrs.call(this);
  }
};

module.exports = plugin;
//# sourceMappingURL=index.js.map
