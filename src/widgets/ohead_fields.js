/**
 * ### Визуальный компонент - реквизиты шапки объекта
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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
 * @param attr.ts {String} - имя табличной части c дополнительными реквизитами
 * @param [attr.metadata] {Object} - описание метаданных реквизитов. Если не указано, описание запрашивается у объекта
 * @constructor
 */
dhtmlXCellObject.prototype.attachHeadFields = function(attr) {

	var _obj,
		_oxml,
		_meta,
		_mgr,
		_selection,
		_tsname,
		_extra_fields,
		_pwnd,
		_cell = this,
		_grid = _cell.attachGrid(),
		_destructor = _grid.destructor;

	// задача обсервера - перерисовать поле при изменении свойств объекта
	function observer(changes){
		if(!_obj){
			var stack = [];
			changes.forEach(function(change){
				if(stack.indexOf[change.object]==-1){
					stack.push(change.object);
					Object.unobserve(change.object, observer);
					if(_extra_fields && _extra_fields instanceof TabularSection)
						Object.unobserve(change.object, observer_rows);
				}
			});
			stack = null;

		}else if(_grid.entBox && !_grid.entBox.parentElement)
			setTimeout(_grid.destructor);

		else
			changes.forEach(function(change){
				if(change.type == "unload"){
					if(_cell && _cell.close)
						_cell.close();
					else
						_grid.destructor();
				}else
					_grid.forEachRow(function(id){
						if (id == change.name)
							_grid.cells(id,1).setValue(_obj[change.name]);
					});
			});
	}

	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _grid.clearAll && _tsname == change.tabular){
				synced = true;
				_grid.clearAll();
				_grid.parse(_mgr.get_property_grid_xml(_oxml, _obj, {
					title: attr.ts_title,
					ts: _tsname,
					selection: _selection,
					metadata: _meta
				}), function(){

				}, "xml");
			}
		});
	}


	new dhtmlXPropertyGrid(_grid);

	_grid.setInitWidthsP("40,60");
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.init();
	//t.enableAutoHeight(false,_cell._getHeight()-20,true);
	_grid.setSizes();
	_grid.attachEvent("onPropertyChanged", function(pname, new_value, old_value){
		if(pname || _grid && _grid.getSelectedRowId())
			return _pwnd.on_select(new_value);
	});
	_grid.attachEvent("onCheckbox", function(rId, cInd, state){
		if(_obj[rId] != undefined)
			return _pwnd.on_select(state, {obj: _obj, field: rId});
	});
	_grid.attachEvent("onKeyPress", function(code,cFlag,sFlag){

		switch(code) {
			case 13:    //  enter
			case 9:     //  tab
				if (_grid.editStop)
					_grid.editStop();
				break;

			case 46:    //  del
				break;
		};

	});
	if(attr.read_only){
		_grid.setEditable(false);
	}

	_grid.__define({

		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				this.reload;
			}
		},
		
		reload: {
			value: function () {
				observer_rows([{tabular: _tsname}]);
			}
		},

		get_cell_field: {
			value: function () {

				if(!_obj)
					return;

				var res = {row_id: _grid.getSelectedRowId()},
					fpath = res.row_id.split("|");

				if(fpath.length < 2)
					return {obj: _obj, field: fpath[0]}._mixin(_pwnd);
				else {
					var vr;
					if(_selection){
						_obj[fpath[0]].find_rows(_selection, function (row) {
							if(row.property == fpath[1] || row.param == fpath[1] || row.Свойство == fpath[1] || row.Параметр == fpath[1]){
								vr = row;
								return false;
							}
						});
					}else
						vr = _obj[fpath[0]].find(fpath[1]);
					if(vr){
						res.obj = vr;
						if(vr["Значение"]){
							res.field = "Значение";
							res.property = vr.Свойство || vr.Параметр;
						} else{
							res.field = "value";
							res.property = vr.property || vr.param;
						}
						return res._mixin(_pwnd);
					}
				}
			},
			enumerable: false
		},

		_obj: {
			get: function () {
				return _obj;
			}
		},

		_owner_cell: {
			get: function () {
				return _cell;
			}
		},

		destructor: {
			value: function () {

				if(_obj)
					Object.unobserve(_obj, observer);
				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_extra_fields, observer_rows);

				_obj = null;
				_extra_fields = null;
				_meta = null;
				_mgr = null;
				_pwnd = null;

				_destructor.call(_grid);
			}
		},

		/**
		 * Подключает поле объекта к элементу управления<br />
		 * Параметры аналогичны конструктору
		 */
		attach: {
			value: function (attr) {

				if (_obj)
					Object.unobserve(_obj, observer);

				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_obj, observer_rows);

				if(attr.oxml)
					_oxml = attr.oxml;

				if(attr.selection)
					_selection = attr.selection;

				_obj = attr.obj;
				_meta = attr.metadata || _obj._metadata.fields;
				_mgr = _obj._manager;
				_tsname = attr.ts || "";
				_extra_fields = _tsname ? _obj[_tsname] : (_obj.extra_fields || _obj["ДополнительныеРеквизиты"]);
				if(_extra_fields && !_tsname)
					_tsname = _obj.extra_fields ? "extra_fields" :  "ДополнительныеРеквизиты";
				_pwnd = {
					// обработчик выбора ссылочных значений из внешних форм, открываемых полями со списками
					on_select: function (selv, cell_field) {
						if(!cell_field)
							cell_field = _grid.get_cell_field();
						if(cell_field){

							var ret_code = _mgr.handle_event(_obj, "value_change", {
								field: cell_field.field,
								value: selv,
								tabular_section: cell_field.row_id ? _tsname : "",
								grid: _grid,
								cell: _grid.cells(cell_field.row_id || cell_field.field, 1),
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


				// начинаем следить за объектом и, его табчастью допреквизитов
				Object.observe(_obj, observer, ["update", "unload"]);

				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.observe(_obj, observer_rows, ["row", "rows"]);

				// заполняем табчасть данными
				if(_tsname && !attr.ts_title)
					attr.ts_title = _obj._metadata.tabular_sections[_tsname].synonym;
				observer_rows([{tabular: _tsname}]);

			}
		}

	});


	//TODO: контекстные меню для элементов и табличных частей

	//TODO: HeadFields для редактирования строки табчасти. Она ведь - тоже DataObj

	if(attr)
		_grid.attach(attr);

	return _grid;
};

dhtmlXGridObject.prototype.get_cell_value = function () {
	var cell_field = this.get_cell_field();
	if(cell_field && cell_field.obj)
		return cell_field.obj[cell_field.field];
};

