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

	if(attr.custom_css){
		["list", "large", "small"].forEach(function (type) {
			dhtmlXDataView.prototype.types[type].css = type;
		})
	}

	// создаём DataView
	var dv = this.attachDataView(conf),
		// и элемент управления режимом просмотра
		dv_tools = new $p.iface.OTooolBar({
			wrapper: this.cell, width: '86px', height: '28px', bottom: '2px', right: '28px', name: 'dataview_tools',
			image_path: dhtmlx.image_path + "dhxdataview" + dhtmlx.skin.replace("dhx", "") + "/",
			buttons: [
				{name: 'list', img: 'dataview_list.png', title: 'Список (детально)', float: 'left'},
				{name: 'large', img: 'dataview_large.png', title: 'Крупные значки', float: 'left'},
				{name: 'small', img: 'dataview_small.png', title: 'Мелкие значки', float: 'left'}
			],
			onclick: function (name) {

				var template = dhtmlXDataView.prototype.types[name];

				if(name == "list")
					dv.config.autowidth = 1;
				else
					dv.config.autowidth = Math.floor((dv._dataobj.scrollWidth) / (template.width + template.padding*2 + template.margin*2 + template.border*2));

				dv.define("type", name);

				//dv.refresh();
			}
		}),
		timer_id;

	function lazy_timer(){
		if(timer_id)
			clearTimeout(timer_id);
		timer_id = setTimeout(dv.requery, 100);
	}

	dv.__define({

		/**
		 * Фильтр, налагаемый на DataView
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
				attr.url = "";
				_rest.build_select(attr, mgr);
				dv.clearAll();
				if(dv._settings)
					dv._settings.datatype = "json";
				dv.load(attr.url, "json", function(v){
					if(v){
						dv.show(dv.first());
					}
				});
				timer_id = 0;
			}
		},

		/**
		 * Обработчик маршрутизации
		 */
		hash_route: {
			value: function (hprm) {
				if(hprm.obj && attr.selection.ВидНоменклатуры != hprm.obj){

					// обновляем вид номенклатуры и перевзводим таймер обновления
					attr.selection.ВидНоменклатуры = hprm.obj;
					lazy_timer();

				}
			}
		}
	});

	// слушаем события on_text_filter, on_dyn_filter и hash_route
	$p.eve.hash_route.push(dv.hash_route);
	dhx4.attachEvent("search_text_change", function (text) {

		// обновляем подстроку поиска и перевзводим таймер обновления
		if(text)
			attr.selection.text = function (){
				return "text like '%25" + text + "%25'";
			};
		else if(attr.selection.hasOwnProperty("text"))
			delete attr.selection.text;

		lazy_timer();

	});

	setTimeout(function(){
		dv.hash_route($p.job_prm.parse_url());
	}, 50);

	return dv;

};
