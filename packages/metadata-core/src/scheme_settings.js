/**
 * ### Менеджер настроек отчетов и динсписков
 *
 * @module scheme_settings
 *
 * Created 19.12.2016
 */

function scheme_settings($p) {

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
		get_settings(class_name) {

		}

		/**
		 * ### Выбор варизанта настроек
		 *
		 * @param class_name
		 */
		select_settings(class_name) {

		}

	}

	/**
	 * ### Справочник scheme_settings
	 * Настройки отчетов и списков
	 * @class CatScheme_settings
	 * @extends CatObj
	 * @constructor
	 */
	$p.CatScheme_settings = class CatScheme_settings extends classes.CatObj {

		get obj() {
			return this._getter('obj')
		}
		set obj(v) {
			this._setter('obj', v)
		}

		get user() {
			return this._getter('user')
		}
		set user(v) {
			this._setter('user', v)
		}

		get available_fields() {
			return this._getter_ts('available_fields')
		}
		set available_fields(v) {
			this._setter_ts('available_fields', v)
		}

		get sort_fields() {
			return this._getter_ts('sort_fields')
		}
		set sort_fields(v) {
			this._setter_ts('sort_fields', v)
		}

		get grouping_fields() {
			return this._getter_ts('grouping_fields')
		}
		set grouping_fields(v) {
			this._setter_ts('grouping_fields', v)
		}

		get selection() {
			return this._getter_ts('selection')
		}
		set selection(v) {
			this._setter_ts('selection', v)
		}


		get params() {
			return this._getter_ts('params')
		}
		set params(v) {
			this._setter_ts('params', v)
		}

		get scheme() {
			return this._getter_ts('scheme')
		}
		set scheme(v) {
			this._setter_ts('scheme', v)
		}

		/**
		 * ### Заполняет настройки по метаданным
		 *
		 * @param class_name
		 */
		fill_default(class_name) {

		}

	}

	$p.CatScheme_settingsAvailable_fieldsRow = class CatScheme_settingsAvailable_fieldsRow extends classes.TabularSectionRow {

		get parent() {
			return this._getter('parent')
		}
		set parent(v) {
			this._setter('parent', v)
		}

		get use() {
			return this._getter('use')
		}
		set use(v) {
			this._setter('use', v)
		}

		get field() {
			return this._getter('field')
		}
		set field(v) {
			this._setter('field', v)
		}

		get width() {
			return this._getter('width')
		}
		set width(v) {
			this._setter('width', v)
		}

		get caption() {
			return this._getter('caption')
		}
		set caption(v) {
			this._setter('caption', v)
		}

	}

	$p.CatScheme_settingsSort_fieldsRow = class CatScheme_settingsSort_fieldsRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent')
		}
		set parent(v) {
			this._setter('parent', v)
		}

		get field() {
			return this._getter('field')
		}
		set field(v) {
			this._setter('field', v)
		}

		get direction() {
			return this._getter('direction')
		}
		set direction(v) {
			this._setter('direction', v)
		}
	}

	$p.CatScheme_settingsGrouping_fieldsRow = class CatScheme_settingsGrouping_fieldsRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent')
		}
		set parent(v) {
			this._setter('parent', v)
		}

		get field() {
			return this._getter('field')
		}
		set field(v) {
			this._setter('field', v)
		}
	}

	$p.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent')
		}
		set parent(v) {
			this._setter('parent', v)
		}

		get use() {
			return this._getter('use')
		}
		set use(v) {
			this._setter('use', v)
		}

		get left_value() {
			return this._getter('left_value')
		}
		set left_value(v) {
			this._setter('left_value', v)
		}

		get comparison_type() {
			return this._getter('comparison_type')
		}
		set comparison_type(v) {
			this._setter('comparison_type', v)
		}

		get right_value() {
			return this._getter('right_value')
		}
		set right_value(v) {
			this._setter('right_value', v)
		}
	}

	$p.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends TabularSectionRow {

		get param() {
			return this._getter('param')
		}
		set param(v) {
			this._setter('param', v)
		}

		get value() {
			return this._getter('value')
		}
		set value(v) {
			this._setter('value', v)
		}
	}

	$p.CatScheme_settingsSchemeRow = class CatScheme_settingsSchemeRow extends TabularSectionRow {

		get parent() {
			return this._getter('parent')
		}
		set parent(v) {
			this._setter('parent', v)
		}

		get kind() {
			return this._getter('kind')
		}
		set kind(v) {
			this._setter('kind', v)
		}

	}

	Object.defineProperties($p.cat, {
		scheme_settings: {
			value: new SchemeSettingsManager('cat.scheme_settings')
		}
	})
}