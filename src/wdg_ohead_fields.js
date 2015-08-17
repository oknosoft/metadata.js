/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * &copy; http://www.oknosoft.ru 2009-2015
 *
 * @module  wdg_ohead_fields
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
		_grid = this.attachGrid(),
		_destructor = _grid.destructor,
		_extra_fields = _obj.extra_fields || _obj["ДополнительныеРеквизиты"],
		_pwnd = {
			// обработчик выбора ссылочных значений из внешних форм, открываемых полями со списками
			on_select: function (selv, cell_field) {

				if(!cell_field)
					cell_field = _grid.get_cell_field();

				if(cell_field){

					var ret_code = _mgr.handle_event(_obj, "value_change", {
						field: cell_field.field,
						value: selv,
						tabular_section: "",
						grid: _grid,
						cell: _grid.cells(cell_field.field, 1),
						wnd: _pwnd.pwnd
					});
					if(typeof ret_code !== "boolean"){
						cell_field.obj[cell_field.field] = selv;
						ret_code = true;
					}
					return ret_code;
				}

			},
			pwnd: attr.pwnd || _cell
		};

	// задача обсервера - перерисовать поле при изменении свойств объекта
	function observer(changes){
		if(!_grid.entBox.parentElement)
			setTimeout(_grid.destructor);
		else
			changes.forEach(function(change){
				_grid.forEachRow(function(id){
					if (id == change.name)
						_grid.cells(id,1).setValue(_obj[change.name]);
				});
			});
	}

	function observer_extra_fields(changes){
		console.log(changes);
	}


	new dhtmlXPropertyGrid(_grid);

	_grid.setInitWidthsP("40,60");
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.init();
	_grid.loadXMLString(_mgr.get_property_grid_xml(attr.oxml, _obj), function(){
		//t.enableAutoHeight(false,_cell._getHeight()-20,true);
		_grid.setSizes();
		_grid.attachEvent("onPropertyChanged", function(pname, new_value, old_value){
			if(pname)
				return _pwnd.on_select(new_value);
		});
		_grid.attachEvent("onCheckbox", function(rId, cInd, state){
			if(_obj[rId] != undefined)
				return _pwnd.on_select(state, {obj: _obj, field: rId});
		});
	});

	_grid.get_cell_field = function () {

		var fpath = _grid.getSelectedRowId().split("|");

		if(fpath.length < 2)
			return {obj: _obj, field: fpath[0]}._mixin(_pwnd);
		else {
			var vr = _obj[_grid.fpath[0]].find(fpath[1]);
			if(vr){
				if(vr["Значение"])
					return {obj: vr, field: "Значение"}._mixin(_pwnd);
				else
					return {obj: vr, field: "value"}._mixin(_pwnd);
			}
		}
	};

	_grid.destructor = function () {

		if(_obj)
			Object.unobserve(_obj, observer);
		if(_extra_fields && _extra_fields instanceof TabularSection)
			Object.unobserve(_extra_fields, observer_extra_fields);

		_obj = null;
		_extra_fields = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;

		_destructor.call(_grid);
	};

	// начинаем следить за объектом и, его табчастью допреквизитов
	Object.observe(_obj, observer, ["update"]);

	if(_extra_fields && _extra_fields instanceof TabularSection)
		Object.observe(_extra_fields, observer_extra_fields, ["row"]);

	return _grid;
};

dhtmlXGridObject.prototype.get_cell_value = function () {
	var cell_field = this.get_cell_field();
	if(cell_field && cell_field.obj)
		return cell_field.obj[cell_field.field];
};

