/**
 * ### Визуальный компонент - табличное поле объекта
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule wdg_otabular
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
 * @param [attr.metadata] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @param [attr.selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @constructor
 * @menuorder 53
 * @tooltip Редактор таличной части
 */
dhtmlXCellObject.prototype.attachTabular = function(attr) {

	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.metadata || _mgr.metadata().tabular_sections[_tsname].fields,
		_cell = this,
		_source = attr.ts_captions || {},
    _input_filter = "",
    _input_filter_changed = 0,
		_selection = attr.selection || {};

	if(!attr.ts_captions && !_md.ts_captions(_mgr.class_name, _tsname, _source)){
    return;
  }

  _selection.filter_selection = filter_selection;

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
	_grid.enableAccessKeyMap();

	/**
	 * добавляет строку табчасти
	 */
	_grid._add_row = function(){
		if(!attr.read_only && !attr.disable_add_del){

			var proto;
			if(_selection){
				for(var sel in _selection){
					if(!_meta[sel] || (typeof _selection[sel] == 'function') || (typeof _selection[sel] == 'object' && !$p.is_data_obj(_selection[sel]))){
						continue;
					}
					if(!proto){
						proto = {};
					}
					proto[sel] = _selection[sel];
				}
			}

      _ts._owner._silent(false);
			var row = _ts.add(proto);

			if(_mgr.handle_event(_obj, "add_row",
					{
						tabular_section: _tsname,
						grid: _grid,
						row: row,
						wnd: _pwnd.pwnd
					}) === false)
				return;

			setTimeout(function () {
				_grid.selectRowById(row.row);
			}, 100);
		}
	};

  _grid._move_row = function(direction){
    if(attr.read_only){
      return;
    }
    var rId = get_sel_index();

    if(rId != undefined){
      _ts._owner._silent(false);
      if(direction == "up"){
        if(rId != 0){
          _ts.swap(rId-1, rId);
          setTimeout(function () {
            _grid.selectRow(rId-1, true);
          }, 100)
        }
      }
      else{
        if(rId < _ts.count() - 1){
          _ts.swap(rId, rId+1);
          setTimeout(function () {
            _grid.selectRow(rId+1, true);
          }, 100)
        }
      }
    }
  }

	/**
	 * удаляет строку табчасти
	 */
	_grid._del_row = function(keydown){

		if(!attr.read_only && !attr.disable_add_del){
			var rId = get_sel_index();

			if(rId != undefined){
        _ts._owner._silent(false);
				if(_mgr.handle_event(_obj, "del_row",
						{
							tabular_section: _tsname,
							grid: _grid,
							row: rId,
							wnd: _pwnd.pwnd
						}) === false)
					return;

				_ts.del(rId);

				setTimeout(function () {
					_grid.selectRowById(rId < _ts.count() ? rId + 1 : rId, true);
				}, 100);
			}
		}
	};


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
	 * обработчик изменения значения примитивного типа
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var cell_field = _grid.get_cell_field();
		if(!cell_field){
      return true;
    }
		var	ret_code = _mgr.handle_event(_obj, "value_change", {
				field: cell_field.field,
				value: nValue,
				tabular_section: _tsname,
				grid: _grid,
				row: cell_field.obj,
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : (_grid.getSelectedCellIndex() >=0 ? _grid.cells() : null),
				wnd: _pwnd.pwnd
			});

		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}

	/**
	 * наблюдатель за изменениями насбор строк табчасти
	 * @param changes
	 */
	function observer_rows(changes){
		if(_grid.clearAll){
			changes.some(function(change){
				if (change.type == "rows" && change.tabular == _tsname){
					_ts.sync_grid(_grid, _selection);
					return true;
				}
			});
		}
	}

	/**
	 * наблюдатель за изменениями значений в строках табчасти
	 * @param changes
	 */
	function observer(changes){
		if(changes.length > 20){
			try{_ts.sync_grid(_grid, _selection);} catch(err){}
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(!change.row || _grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						if(_grid.getColIndexById(change.name) != undefined){
              if(typeof change.oldValue != "boolean" || typeof change.row[change.name] != "boolean"){
                _grid.cells(change.row.row, _grid.getColIndexById(change.name))
                  .setCValue($p.utils.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
              }
            }
					}
				}
			});
	}

	function onpaste(e) {

		if(e.clipboardData.types.indexOf('text/plain') != -1){
			try{
				$p.eve.callEvent("tabular_paste", [{
					obj: _obj,
					grid: _grid,
					tsname: _tsname,
					e: e,
					data: e.clipboardData.getData('text/plain')
				}]);

			}catch(e){
				return;
			}
		}
	}

  function filter_selection(row) {

	  if(!_input_filter){
	    return true;
    }

    var res;
    _source.fields.some(function (fld) {
      var v = row._row[fld];
      if($p.utils.is_data_obj(v)){
        if(!v.is_new() && v.presentation.match(_input_filter)){
          return res = true;
        }
      }
      else if(typeof v == 'number'){
        return res = v.toLocaleString().match(_input_filter);
      }
      else if(v instanceof Date){
        return res = $p.moment(v).format($p.moment._masks.date_time).match(_input_filter);
      }
      else if(v.match){
        return res = v.match(_input_filter);
      }
    })
    return res;
  }

	function filter_change() {

    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
      _input_filter_changed = 0;
    }

    if(_input_filter != _cell.input_filter.value){
      _input_filter = new RegExp(_cell.input_filter.value, 'i');
      observer_rows([{tabular: _tsname, type: "rows"}]);
    }

  }

  function filter_click() {
    var val = _cell.input_filter.value;
    setTimeout(function () {
      if(val != _cell.input_filter.value)
        filter_change();
    })
  }

  function filter_keydown() {

    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
    }

    _input_filter_changed = setTimeout(function () {
      if(_input_filter_changed)
        filter_change();
    }, 500);

  }

	// панель инструментов табличной части
	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){

    this.forEachItem(function(id) {
      if(id == "input_filter"){
        _cell.input_filter = _toolbar.getInput(id);
        _cell.input_filter.onchange = filter_change;
        _cell.input_filter.onclick = filter_click;
        _cell.input_filter.onkeydown = filter_keydown;
        _cell.input_filter.type = "search";
        _cell.input_filter.setAttribute("placeholder", "Фильтр");
      }
    })

		this.attachEvent("onclick", function(btn_id){

			switch(btn_id) {

				case "btn_add":
					_grid._add_row();
					break;

				case "btn_delete":
					_grid._del_row();
					break;

        case "btn_up":
          _grid._move_row("up");
          break;

        case "btn_down":
          _grid._move_row("down");
          break;
			}

		});
	});

	// поле фильтра в панели инструментов

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

	// гасим кнопки, если ro
	if(attr.read_only || attr.disable_add_del){
	  if(attr.read_only){
      _grid.setEditable(false);
    }
		_toolbar.forEachItem(function (name) {
			if(["btn_add", "btn_delete"].indexOf(name) != -1)
				_toolbar.disableItem(name);
		});
	}

  // добавляем кнопки сортировки, если reorder
	if(attr.reorder){
    var pos = _toolbar.getPosition("btn_delete");
    if(pos){
      _toolbar.addSeparator("sep_up", pos+1);
      _toolbar.addButton("btn_up", pos+2, '<i class="fa fa-arrow-up fa-fw"></i>');
      _toolbar.addButton("btn_down", pos+3, '<i class="fa fa-arrow-down fa-fw"></i>');
      _toolbar.setItemToolTip("btn_up", "Переместить строку вверх");
      _toolbar.setItemToolTip("btn_down", "Переместить строку вниз");
    }
  }

	_grid.__define({

    _obj: {
      get: function () {
        return _obj;
      }
    },

		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				observer_rows([{tabular: _tsname, type: "rows"}]);
			}
		},

		destructor: {
			value: function () {

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

				_grid.entBox.removeEventListener("paste", onpaste);

				_destructor.call(_grid);
			}
		},

		get_cell_field: {
			value: function () {

				if(_ts){

					var rindex = get_sel_index(true),
						cindex = _grid.getSelectedCellIndex(),
						row, col;

					if(rindex != undefined){
						row = _ts.get(rindex);

					}else if(_grid._last){
						row = _ts.get(_grid._last.row);
					}

					if(cindex >=0){
						col = _grid.getColumnId(cindex);
					}else if(_grid._last){
						col = _grid.getColumnId(_grid._last.cindex);
					}

					if(row && col){
						return {obj: row, field: col, metadata: _meta[col]}._mixin(_pwnd);
					}

				}
			}
		},

		refresh_row: {
			value: function (row) {
				_grid.selectRowById(row.row);
				_grid.forEachCell(row.row, function(cellObj,ind){
					var val = row[_grid.getColumnId(ind)];
					cellObj.setCValue($p.utils.is_data_obj(val) ? val.presentation : val);
				});
			}
		}
	});

	_grid.attachEvent("onEditCell", tabular_on_edit);

  _grid.attachEvent("onCheck", function(rId,cInd,state){
    _grid.selectCell(rId-1, cInd);
    tabular_on_edit(2, rId, cInd, state);
  });

	_grid.attachEvent("onRowSelect", function(rid,ind){
		if(_ts){
			_grid._last = {
				row: rid-1,
				cindex: ind
			}
		}
	});

  _grid.attachEvent("onHeaderClick", function(ind,obj){

    var field = _source.fields[ind];
    if(_grid.disable_sorting || field == 'row'){
      return;
    }
    if(!_grid.sort_fields){
      _grid.sort_fields = [];
      _grid.sort_directions = [];
    }

    // есть ли уже такая колонка
    var index = _grid.sort_fields.indexOf(field);

    function add_field() {
      if(index == -1){
        _grid.sort_fields.push(field);
        _grid.sort_directions.push("asc");
      }
      else{
        if(_grid.sort_directions[index] == "asc"){
          _grid.sort_directions[index] = "desc";
        }
        else{
          _grid.sort_directions[index] = "asc";
        }
      }
    }

    // если кликнули с шифтом - добавляем
    if(window.event && window.event.shiftKey){
      add_field();
    }
    else{
      if(index == -1){
        _grid.sort_fields.length = 0;
        _grid.sort_directions.length = 0;
      }
      add_field();
    }

    _ts.sort(_grid.sort_fields.map(function (field, index) {
      return field + " " + _grid.sort_directions[index];
    }));

    _ts.sync_grid(_grid);

    for(var col = 0; col < _source.fields.length; col++){
      var field = _source.fields[col];
      var index = _grid.sort_fields.indexOf(field);
      if(index == -1){
        _grid.setSortImgState(false, col);
      }
      else{
        _grid.setSortImgState(true, col, _grid.sort_directions[index]);
        setTimeout(function () {
          if(_grid && _grid.sortImg){
            _grid.sortImg.style.display="inline";
          }
        }, 200);
        break;
      }
    }
  });

	// заполняем табчасть данными
	observer_rows([{tabular: _tsname, type: "rows"}]);

	// начинаем следить за объектом и, его табчастью допреквизитов
	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);

	// начинаем следить за буфером обмена
	_grid.entBox.addEventListener('paste', onpaste);

	return _grid;
};

