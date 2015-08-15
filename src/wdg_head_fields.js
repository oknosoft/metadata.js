/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * &copy; http://www.oknosoft.ru 2009-2015
 *
 * @module  wdg_head_fields
 * @requires common
 */

/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * - Предназначен для отображения и редактирования полей {{#crossLink "DataObj"}}объекта данных{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы элементов управления в дереве реквизитов формируются автоматически по описанию метаданных
 * - Программное изменение значений реквизитов объекта данных, синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства связанного объекта
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachHeadFields` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class OHeadFields
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя поля табличной части
 * @param [attr.meta] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @constructor
 */
dhtmlXCellObject.prototype.attachHeadFields = function(attr) {

	var _obj = attr.obj,
		_meta = attr.meta || _obj._metadata.fields,
		_mgr = _obj._manager,
		_cell = this,
		t = this.attachGrid();
	new dhtmlXPropertyGrid(t);

	t.get_cell_value = function () {
		var cell_field = t.get_cell_field();
		if(cell_field)
			return cell_field.obj[cell_field.field];
	};

	t.get_cell_field = function () {
		var fpath = t.getSelectedRowId().split("|");
		if(fpath.length < 2)
			return {obj: _obj, field: fpath[0]};
		else {
			var vr = _obj[t.fpath[0]].find(fpath[1]);
			if(vr){
				if(vr["Значение"])
					return {obj: vr, field: "Значение"};
				else
					return {obj: vr, field: "value"};
			}
		}
	};

	t.setDateFormat("%d.%m.%Y %H:%i");
	t.init();
	t.loadXMLString(_mgr.get_property_grid_xml(attr.oxml, _obj), function(){

	});

	return t;
};

