/**
 * ### Менеджер настроек отчетов и динсписков
 *
 * @module scheme_settings
 *
 * Created 19.12.2016
 */

function scheme_settings() {

	const {wsql, utils, cat, dp, md} = this;
	const classes = this.classes || this;

	/**
	 * ### Менеджер настроек отчетов и динсписков
	 */
	class SchemeSettingsManager extends classes.CatManager {


		/**
		 * ### Возвращает объект текущих настроек
		 * - если не существует ни одной настройки для _class_name_, создаёт элемент справочника _SchemeSettings_
		 * - если в localstorage есть настройка для текущего пользователя, возвращает её
		 *
		 * @param class_name
		 */
		get_scheme(class_name) {

			return new Promise((resolve, reject) => {

				// получаем сохраненную настройку
				const scheme_name = this.scheme_name(class_name);

				const find_scheme = () => {

					const opt = {
						_view: 'doc/scheme_settings',
						_top: 100,
						_skip: 0,
						_key: {
							startkey: [class_name, 0],
							endkey: [class_name, 9999]
						}
					}

					const query = this.find_rows_remote ? this.find_rows_remote(opt) : this.pouch_find_rows(opt);

					query.then((data) => {
						// если существует с текущим пользователем, берём его, иначе - первый попавшийся
						if(data.length == 1){
							set_default_and_resolve(data[0])
						}
						else if(data.length){
							if(!$p.current_user || !$p.current_user.name){
								set_default_and_resolve(data[0])
							}
							else {
								const {name} = $p.current_user;
								if(!data.some((scheme) => {
										if(scheme.user == name){
											set_default_and_resolve(scheme);
											return true;
										}
									})) {
									set_default_and_resolve(data[0])
								}
							}
						}
						else{
							create_scheme()
						}
					})
						.catch((err) => {
							create_scheme()
						})
				}

				let ref = wsql.get_user_param(scheme_name, "string");

				function set_default_and_resolve(obj){
					resolve(obj.set_default());
				}

				function create_scheme() {
					if(!utils.is_guid(ref)){
						ref = utils.generate_guid()
					}
					cat.scheme_settings.create({ref})
						.then((obj) => obj.fill_default(class_name).save())
						.then((obj) => set_default_and_resolve(obj))
				}

				if(ref){
					// получаем по гвиду
					cat.scheme_settings.get(ref, "promise")
						.then((scheme) => {
							if(scheme && !scheme.is_new()){
								resolve(scheme)
							}
							else{
								find_scheme()
							}
						})
						.catch((err) => {
							find_scheme()
						})

				}else{
					find_scheme()
				}
			})
		}

		/**
		 * ### Имя сохраненных настроек
		 * @param class_name
		 */
		scheme_name(class_name) {
			return "scheme_settings_" + class_name.replace(/\./g, "_");
		}

	}

	/**
	 * ### Менеджер настроек отчетов и динсписков
	 */
	class SchemeSelectManager extends classes.DataProcessorsManager {

		/**
		 * ### Экземпляр обработки для выбора варианта
		 * @param scheme
		 * @return {_obj, _meta}
		 */
		dp(scheme) {

			// экземпляр обработки для выбора варианта
			const _obj =  dp.scheme_settings.create();
			_obj.scheme = scheme;

			// корректируем метаданные поля выбора варианта
			const _meta = Object.assign({}, this.metadata("scheme"))
			_meta.choice_params = [{
				name: "obj",
				path: scheme.obj
			}]

			return {_obj, _meta};

		}
	}

	/**
	 * ### Обработка выбора варианта настроек scheme_settings
	 * @class CatScheme_settings
	 * @extends DataProcessorObj
	 * @constructor
	 */
	this.DpScheme_settings = class DpScheme_settings extends classes.DataProcessorObj{

		get scheme() {return this._getter('scheme')}
		set scheme(v) {this._setter('scheme', v)}
	}

	/**
	 * ### Справочник scheme_settings
	 * Настройки отчетов и списков
	 * @class CatScheme_settings
	 * @extends CatObj
	 * @constructor
	 */
	this.CatScheme_settings = class CatScheme_settings extends classes.CatObj {

		get obj() {return this._getter('obj')}
		set obj(v) {this._setter('obj', v)}

		get user() {return this._getter('user')}
		set user(v) {this._setter('user', v)}

		get order() {return this._getter('order')}
		set order(v) {this._setter('order', v)}

		get formula() {return this._getter('formula')}
		set formula(v) {this._setter('formula', v)}

		get query() {return this._getter('query')}
		set query(v) {this._setter('query', v)}

		get tag() {return this._getter('tag')}
		set tag(v) {this._setter('tag', v)}

		get date_from() {return this._getter('date_from')}
		set date_from(v) {this._setter('date_from', v)}

		get date_till() {return this._getter('date_till')}
		set date_till(v) {this._setter('date_till', v)}

		get fields() {return this._getter_ts('fields')}
		set fields(v) {this._setter_ts('fields', v)}

		get sorting() {return this._getter_ts('sorting')}
		set sorting(v) {this._setter_ts('sorting', v)}

		get dimensions() {return this._getter_ts('dimensions')}
		set dimensions(v) {this._setter_ts('dimensions', v)}

		get resources() {return this._getter_ts('resources')}
		set resources(v) {this._setter_ts('resources', v)}

		get selection() {return this._getter_ts('selection')}
		set selection(v) {this._setter_ts('selection', v)}

		get params() {return this._getter_ts('params')}
		set params(v) {this._setter_ts('params', v)}

		get composition() {return this._getter_ts('composition')}
		set composition(v) {this._setter_ts('composition', v)}

		/**
		 * ### Заполняет настройки по метаданным
		 *
		 * @param class_name
		 */
		fill_default(class_name) {

			const parts = class_name.split("."),
				_mgr = md.mgr_by_class_name(class_name),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				columns = [];

			function add_column(fld, use) {
				const id = fld.id || fld,
					fld_meta = _meta.fields[id] || _mgr.metadata(id)
				columns.push({
					field: id,
					caption: fld.caption || fld_meta.synonym,
					tooltip: fld_meta.tooltip,
					width: fld.width || fld_meta.width,
					use: use
				});
			}

			// набираем поля
			if(parts.length < 3){   // поля динсписка

				if (_meta.form && _meta.form.selection) {

					_meta.form.selection.cols.forEach(fld => {
						add_column(fld, true)
					});

				} else {

					if (_mgr instanceof classes.CatManager) {
						if (_meta.code_length) {
							columns.push('id')
						}

						if (_meta.main_presentation_name) {
							columns.push('name')
						}

					} else if (_mgr instanceof classes.DocManager) {
						columns.push('number_doc')
						columns.push('date')
					}

					columns.forEach((id) => {
						// id, synonym, tooltip, type, width
						add_column(id, true)
					})
				}

			}else{ // поля табличной части

				for(var field in _meta.fields){
					add_column(field, true)
				}
			}

			for(var field in _meta.fields){
				if(!columns.some(function (column) { return column.field == field })){
					add_column(field, false)
				}
			}

			// заполняем табчасть доступных полей
			columns.forEach((column) => {
				this.fields.add(column)
			})

			// если для объекта определены измерения по умолчанию - используем
			const {resources} = _mgr.obj_constructor('', true)
			if(resources){
				resources.forEach(function (column) {
					this.resources.add({field: column})
				})
			}

			this.obj = class_name

			// наименование и период по умолчанию
			if(!this.name){
				this.name = "Основная"
				this.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
				this.date_till = utils.date_add_day(new Date(), 1);
			}

			return this
		}

		/**
		 * ### Устанавливает текущую настройку по умолчанию
		 */
		set_default() {
			wsql.set_user_param(this._manager.scheme_name(this.obj), this.ref);
			return this;
		}

		/**
		 * ### Устанавливает _view и _key в параметрах запроса
		 */
		fix_select(select, key0) {

			const keys = this.query.split("/")
			const {_key, _view} = select
			let res

			if(keys.length > 2){
				key0 = keys[2]
			}

			if (_key.startkey[0] != key0) {
				_key.startkey[0] = _key.endkey[0] = key0
				res = true
			}

			if(keys.length > 1){
				const select_view = keys[0] + "/" + keys[1]
				if(_view != select_view){
					select._view = select_view
					res = true
				}
			}

			// если есть параметр период, установим значения ключа
			if(this.query.match('date')){
				const {date_from, date_till} = this;

				_key.startkey[1] = date_from.getFullYear();
				_key.startkey[2] = date_from.getMonth()+1;
				_key.startkey[3] = date_from.getDate();

				_key.endkey[1] = date_till.getFullYear();
				_key.endkey[2] = date_till.getMonth()+1;
				_key.endkey[3] = date_till.getDate();
			}

			return res
		}

		/**
		 * ### Возвращает массив колонок для динсписка или табчасти
		 * @param mode {String} - режим формирования колонок
		 * @return {Array}
		 */
		columns(mode) {

			const parts = this.obj.split("."),
				_mgr = md.mgr_by_class_name(this.obj),
				_meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
				res = [];

			this.fields.find_rows({use: true}, (row) => {

				const fld_meta = _meta.fields[row.field] || _mgr.metadata(row.field)
				let column

				if(mode == "ts"){
					column = {
						key: row.field,
						name: row.caption,
						resizable : true,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					}
				}else{
					column = {
						id: row.field,
						synonym: row.caption,
						tooltip: row.tooltip,
						type: fld_meta.type,
						ctrl_type: row.ctrl_type,
						width: row.width == '*' ? 250 : (parseInt(row.width) || 140),
					}
				}
				res.push(column)
			})
			return res;
		}

		/**
		 * ### Возвращает массив измерений группировки
		 * @param [parent] - родитель, для многоуровневой группировки
		 * @return {Array}
		 */
		dims(parent) {
			return this.dimensions._obj.map((row) => row.field)
		}

		/**
		 * ### Возвращает массив имён используемых колонок
		 * @param [parent] - родитель, для многоуровневой группировки
		 * @return {Array}
		 */
		used_fields(parent) {
			const res = []
			this.fields.find_rows({use: true}, (row) => {
				res.push(row.field)
			})
			return res
		}

		/**
		 * ### Возвращает массив элементов для поля выбора
		 * @return {Array}
		 */
		used_fields_list() {
			return this.fields._obj.map((row) => ({
				id: row.field,
				value: row.field,
				text: row.caption,
				title: row.caption
			}))
		}
	}

	this.CatScheme_settingsDimensionsRow = class CatScheme_settingsDimensionsRow extends classes.TabularSectionRow {

		get parent() {return this._getter('parent')}
		set parent(v) {this._setter('parent', v)}

		get use() {return this._getter('use')}
		set use(v) {this._setter('use', v)}

		get field() {return this._getter('field')}
		set field(v) {this._setter('field', v)}
	}

	this.CatScheme_settingsResourcesRow = class CatScheme_settingsResourcesRow extends this.CatScheme_settingsDimensionsRow {

		get formula() {return this._getter('formula')}
		set formula(v) {this._setter('formula', v)}
	}

	this.CatScheme_settingsFieldsRow = class CatScheme_settingsFieldsRow extends this.CatScheme_settingsDimensionsRow {

		get width() {return this._getter('width')}
		set width(v) {this._setter('width', v)}

		get caption() {return this._getter('caption')}
		set caption(v) {this._setter('caption', v)}

		get tooltip() {return this._getter('tooltip')}
		set tooltip(v) {this._setter('tooltip', v)}

		get ctrl_type() {return this._getter('ctrl_type')}
		set ctrl_type(v) {this._setter('ctrl_type', v)}

		get formatter() {return this._getter('formatter')}
		set formatter(v) {this._setter('formatter', v)}

		get editor() {return this._getter('editor')}
		set editor(v) {this._setter('editor', v)}

	}

	this.CatScheme_settingsSortingRow = class CatScheme_settingsSortingRow extends this.CatScheme_settingsDimensionsRow {

		get direction() {return this._getter('direction')}
		set direction(v) {this._setter('direction', v)}
	}

	this.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends classes.TabularSectionRow {

		get parent() {return this._getter('parent')}
		set parent(v) {this._setter('parent', v)}

		get use() {return this._getter('use')}
		set use(v) {this._setter('use', v)}

		get left_value() {return this._getter('left_value')}
		set left_value(v) {this._setter('left_value', v)}

		get comparison_type() {return this._getter('comparison_type')}
		set comparison_type(v) {this._setter('comparison_type', v)}

		get right_value() {return this._getter('right_value')}
		set right_value(v) {this._setter('right_value', v)}
	}

	this.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends classes.TabularSectionRow {

		get param() {return this._getter('param')}
		set param(v) {this._setter('param', v)}

		get value() {return this._getter('value')}
		set value(v) {this._setter('value', v)}
	}

	this.CatScheme_settingsCompositionRow = class CatScheme_settingsSchemeRow extends this.CatScheme_settingsDimensionsRow {

		get kind() {return this._getter('kind')}
		set kind(v) {this._setter('kind', v)}

		get definition() {return this._getter('definition')}
		set definition(v) {this._setter('definition', v)}

	}

	Object.defineProperties(cat, {
		scheme_settings: {
			value: new SchemeSettingsManager('cat.scheme_settings')
		}
	})

	Object.defineProperties(dp, {
		scheme_settings: {
			value: new SchemeSelectManager('dp.scheme_settings')
		}
	})

};