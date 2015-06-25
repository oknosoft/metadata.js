/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wdg_filter
 * @requires common
 */

/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * @param attr {Object} - параметры создаваемого виджета
 * @param attr.manager {DataManager}
 * @param attr.toolbar {dhtmlXToolbarObject}
 * @param attr.[pos=7] {Number} - номер элемента на тулбаре, после которого вставлять виджет
 * @constructor
 */
$p.iface.Toolbar_filter = function (attr) {

	var elmnts = {}, input_filter_width = 350;

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.period){
		input_filter_width = 200;
	}

	//<item id="lbl_filter" type="text"  text="Фильтр" />
	//<item id="input_filter" type="buttonInput" width="350"  />
	// текстовое поле фильтра по подстроке
	elmnts.input_filter = attr.toolbar.addInput("input_filter", attr.pos || 7, "", input_filter_width);
	elmnts.input_filter.onchange = attr.onchange;
	elmnts.input_filter.type = "search";

	attr.toolbar.addSpacer("input_filter");
};
