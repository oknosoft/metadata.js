/**
 * Динамическое dataview иерархического справочника
 *
 * Created 22.10.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  wdg_dyn_dataview
 */

/**
 * ### Визуальный компонент - динамическое представление элементов справочника
 * - Отображает коллекцию объектов на основе пользовательских шаблонов (список, мозаика, иконы и т.д.)
 * - Унаследован от [dhtmlXDataView](http://docs.dhtmlx.com/dataview__index.html)
 * - Автоматически связывается с irest-сервисом библиотеки интеграции 1С
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachDynDataView` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class ODynDataView
 * @param mgr {DataManager}
 * @param attr {Object} - параметры создаваемого компонента
 * @param attr.type {Object} - шаблон и параметры
 * @param [attr.filter] {Object} - отбор + период
 * @param [callback] {Function} - если указано, будет вызвана после инициализации компонента
 * @constructor
 */
dhtmlXCellObject.prototype.attachDynDataView = function(mgr, attr) {

	if(!attr)
		attr = {};
	var conf = {
		type: attr.type || { template:"#name#" }
	};
	if(attr.pager)
		conf.pager = attr.pager;
	if(attr.hasOwnProperty("drag"))
		conf.drag = attr.drag;
	if(attr.hasOwnProperty("select"))
		conf.select = attr.select;
	if(attr.hasOwnProperty("multiselect"))
		conf.multiselect = attr.multiselect;
	if(attr.hasOwnProperty("height"))
		conf.height = attr.height;
	if(attr.hasOwnProperty("tooltip"))
		conf.tooltip = attr.tooltip;
	if(attr.hasOwnProperty("autowidth"))
		conf.autowidth = attr.autowidth;

	var dv = this.attachDataView(conf);

	dv.__define({
		/**
		 * Фильтр, налагаемый на дерево
		 */
		filter: {
			get: function () {

			},
			set: function (v) {
				attr.filter = v;
			}
		},
		requery: {
			value: function () {
				_rest.build_select(attr, mgr);
				dv.clearAll();
				dv.load(attr.url, "json", function(v){
					if(v){

					}
				});
			}
		}
	});

	setTimeout(function () {
		dv.requery();
	}, 100);

	return dv;

};
