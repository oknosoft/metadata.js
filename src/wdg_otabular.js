/**
 * ### Визуальный компонент - табличное поле объекта
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  wdg_otabular
 * @requires common
 */


/**
 * ### Визуальный компонент - табличное поле объекта
 * - Предназначен для отображения и редактирования {{#crossLink "TabularSection"}}табличной части{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы колонок формируются автоматически по описанию метаданны
 * - Программное изменение состава строк и значений в полях строк синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства табличной части связанного объекта
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachTabular` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class OTabular
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя табличной части
 * @param [attr.meta] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @param [attr.selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @constructor
 */
dhtmlXCellObject.prototype.attachTabular = function(attr) {


	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.meta || _mgr.metadata().tabular_sections[_tsname].fields,
		_cell = this,
		_source = {},
		_selection = attr.selection;
	if(!_md.ts_captions(_mgr.class_name, _tsname, _source))
		return;

	var _grid = this.attachGrid(),
		_toolbar = this.attachToolbar(),
		_destructor = _grid.destructor,
		_pwnd = {
			// обработчик выбора ссылочных значений из внешних форм, открываемых полями со списками
			on_select: function (selv) {
				tabular_on_edit(2, null, null, selv);
			},
			pwnd: attr.pwnd || _cell,
			is_tabular: true
		};
	_grid.setDateFormat("%d.%m.%Y %H:%i");

	function get_sel_index(silent){
		var selId = _grid.getSelectedRowId();

		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;

		if(!silent)
			$p.msg.show_msg({
				type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", _obj._metadata.tabular_sections[_tsname].synonym || _tsname),
				title: (_obj._metadata.obj_presentation || _obj._metadata.synonym) + ': ' + _obj.presentation
			});
	}

	/**
	 * добавляет строку табчасти
	 */
	function add_row(){
		var row = _ts.add();
		setTimeout(function () {
			_grid.selectRowById(row.row);
		}, 100);
	}

	function del_row(){
		var rId = get_sel_index();
		if(rId != undefined)
			_ts.del(rId);
	}

	/**
	 * обработчик изменения значения в таблице продукции (примитивные типы)
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var cell_field = _grid.get_cell_field(),
			ret_code = _mgr.handle_event(_obj, "value_change", {
				field: cell_field.field,
				value: nValue,
				tabular_section: _tsname,
				grid: _grid,
				row: cell_field.obj,
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : _grid.cells(),
				wnd: _pwnd.pwnd
			});

		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}

	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _tsname == change.tabular){
				synced = true;
				_ts.sync_grid(_grid, _selection);
			}
		});
	}

	function observer(changes){
		if(changes.length > 4){
			try{_ts.sync_grid(_grid, _selection);} catch(err){};
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(_grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						var xcell = _grid.cells(change.row.row, _grid.getColIndexById(change.name));
						xcell.setCValue($p.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
					}
				}
			});
	}


	// панель инструментов табличной части
	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){
		this.attachEvent("onclick", function(btn_id){
			if(btn_id=="btn_add")
				add_row();

			else if(btn_id=="btn_delete")
				del_row();

		});
	});

	// собственно табличная часть
	_grid.setIconsPath(dhtmlx.image_path);
	_grid.setImagePath(dhtmlx.image_path);
	_grid.setHeader(_source.headers);
	if(_source.min_widths)
		_grid.setInitWidths(_source.widths);
	if(_source.min_widths)
		_grid.setColumnMinWidth(_source.min_widths);
	if(_source.aligns)
		_grid.setColAlign(_source.aligns);
	_grid.setColSorting(_source.sortings);
	_grid.setColTypes(_source.types);
	_grid.setColumnIds(_source.fields.join(","));
	_grid.enableAutoWidth(true, 1200, 600);
	_grid.enableEditTabOnly(true);
	_grid.init();

	if(attr.read_only){
		_grid.setEditable(false);
		_toolbar.disableItem("btn_add");
		_toolbar.disableItem("btn_delete");
	}

	_grid.attachEvent("onEditCell", tabular_on_edit);

	_grid.get_cell_field = function () {
		var rindex = get_sel_index(true), cindex = _grid.getSelectedCellIndex(), row, col;
		if(_ts && rindex != undefined && cindex >=0){
			row = _ts.get(rindex);
			col = _grid.getColumnId(cindex);
			return {obj: row, field: col}._mixin(_pwnd);
		}
	};

	_grid.destructor = function () {

		if(_obj){
			Object.unobserve(_obj, observer);
			Object.unobserve(_obj, observer_rows);
		}

		_obj = null;
		_ts = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		_cell.detachToolbar();

		_destructor.call(_grid);
	};

	// TODO: реализовать свойство selection и его инициализацию через attr
	_grid.__define("selection", {
		get: function () {
			return _selection;
		},
		set: function (sel) {
			_selection = sel;
			observer_rows([{tabular: _tsname}]);
		},
		enumerable: false
	});

	// заполняем табчасть данными
	observer_rows([{tabular: _tsname}]);

	// начинаем следить за объектом и, его табчастью допреквизитов
	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);

	return _grid;
};

