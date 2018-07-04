/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  wnd_selection
 */

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindowsCell} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 * @param [attr.initial_value] {DataObj} - начальное значение выбора
 * @param [attr.parent] {DataObj} - начальное значение родителя для иерархических справочников
 * @param [attr.on_select] {Function} - callback при выборе значения
 * @param [attr.on_grid_inited] {Function} - callback после инициализации грида
 * @param [attr.on_new] {Function} - callback после создания нового объекта
 * @param [attr.on_edit] {Function} - callback перед вызовом редактора
 * @param [attr.on_close] {Function} - callback при закрытии формы
 */
DataManager.prototype.form_selection = function(pwnd, attr){

  if(!pwnd) {
    pwnd = attr && attr.pwnd ? attr.pwnd : {};
  }

  if(!attr && !(pwnd instanceof dhtmlXCellObject)){
		attr = pwnd;
		pwnd = {};
	}

  if(!attr) {
    attr = {};
  }


  var _mgr = this,
		_meta = attr.metadata || _mgr.metadata(),
		has_tree = _meta["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0, a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;


	/**
	 *	раздел вспомогательных функций
	 */

	/**
	 * аналог 1С-ного ПриСозданииНаСервере()
	 */
	function frm_create(){

		// создаём и настраиваем окно формы
		if(pwnd instanceof dhtmlXCellObject) {
			if(!(pwnd instanceof dhtmlXTabBarCell) && (typeof pwnd.close == "function"))
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				if(wnd || pwnd){
					(wnd || pwnd).detachToolbar();
					(wnd || pwnd).detachStatusBar();
					if((wnd || pwnd).conf)
						(wnd || pwnd).conf.unloading = true;
					(wnd || pwnd).detachObject(true);
				}
				frm_unload(on_create);
			};
			if(!attr.hide_header){
				setTimeout(function () {
					wnd.showHeader();
				});
			}
		}else{
			wnd = $p.iface.w.createWindow(null, 0, 0, 760, 540);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.iface.bind_help(wnd);

		if(wnd.setText && !attr.hide_text)
			wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (_meta["list_presentation"] || _meta.synonym) + '"');

		document.body.addEventListener("keydown", body_keydown, false);

		// статусбар
		wnd.elmnts = {}

		if(attr.status_bar || !attr.smart_rendering){
			wnd.elmnts.status_bar = wnd.attachStatusBar();
		}

		if(!attr.smart_rendering){
			wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");
		}

		// командная панель формы
		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_selection.xml"], function(){

			this.attachEvent("onclick", toolbar_click);

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd){
				this.cont.parentElement.classList.add("dhx_cell_toolbar_no_borders");
				this.cont.parentElement.classList.remove("dhx_cell_toolbar_def");
				//this.cont.style.top = "4px";
			}

			// текстовое поле фильтра по подстроке
			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter,
				custom_selection: attr.custom_selection
			};
			if(attr.date_from) tbattr.date_from = attr.date_from;
			if(attr.date_till) tbattr.date_till = attr.date_till;
			if(attr.period) tbattr.period = attr.period;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);


			// учтём права для каждой роли на каждый объект
			var _acl = $p.current_user.get_acl(_mgr.class_name);

			if(_acl.indexOf("i") == -1)
				this.hideItem("btn_new");

			if(_acl.indexOf("v") == -1)
				this.hideItem("btn_edit");

			if(_acl.indexOf("d") == -1)
				this.hideItem("btn_delete");

			if(!on_select){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
					this.addListOption("bs_more", "btn_order_list", "~", "button", "<i class='fa fa-briefcase fa-lg fa-fw'></i> Список заказов");
			}
			this.addListOption("bs_more", "btn_import", "~", "button", "<i class='fa fa-upload fa-lg fa-fw'></i> Загрузить из файла");
			this.addListOption("bs_more", "btn_export", "~", "button", "<i class='fa fa-download fa-lg fa-fw'></i> Выгрузить в файл");


			// добавляем команды печати
			if(_mgr.printing_plates)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
						added = true;
					}
					if(!added)
						wnd.elmnts.toolbar.hideItem("bs_print");
				});
			else
				wnd.elmnts.toolbar.hideItem("bs_print");

			//
			create_tree_and_grid();
		});

		wnd._mgr = _mgr;

		return wnd;
	}

	/**
	 * Устанавливает фокус в поле фильтра
	 * @param evt {KeyboardEvent}
	 * @return {Boolean}
	 */
	function body_keydown(evt){

		if(wnd && wnd.is_visible && wnd.is_visible()){
			if (evt.ctrlKey && evt.keyCode == 70){ // фокус на поиск по {Ctrl+F}
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.shiftKey && evt.keyCode == 116){ // requery по {Shift+F5}
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.keyCode == 27){ // закрытие по {ESC}
				if(wnd instanceof dhtmlXWindowsCell && !$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.close();
					});
				}
			}
		}
	}

	function input_filter_change(flt){
		if(wnd && wnd.elmnts){
			if(has_tree){
				if(flt.filter || flt.hide_tree)
					wnd.elmnts.cell_tree.collapse();
				else
					wnd.elmnts.cell_tree.expand();
			}
			wnd.elmnts.grid.reload();
		}
	}

	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;

		if(has_tree){
			layout = wnd.attachLayout('2U');

			cell_grid = layout.cells('b');
			cell_grid.hideHeader();

			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();

			const filter = {is_folder: true};
      const {selection} = get_filter(0, 1000);
      previous_filter = {};
      if(Array.isArray(selection)) {
        const set = new Set();
        for (const sel of selection) {
          for (let key in sel) {
            if(key === 'ref') {
              const cmp = sel[key].in ? 'in' : (sel[key].inh ? 'inh' : '')
              if(cmp) {
                sel[key][cmp].forEach((v) => {
                  const o = _mgr.get(v);
                  if(!o || o.empty()) {
                    return;
                  }
                  o.is_folder && set.add(o);
                  for (const elm of o._parents()) {
                    set.add(elm);
                  }
                  for (const elm of o._children(true)) {
                    set.add(elm);
                  }
                });
              }
            }
          }
        }
        if(set.size) {
          filter.ref = {in: Array.from(set)};
        }
      }
      tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, filter, function(){
        setTimeout(function () {
          if(grid && grid.reload) {
            grid.reload();
          }
        }, 20);
      });
      tree.attachEvent('onSelect', function (id, mode) {	// довешиваем обработчик на дерево
        if(!mode) {
          return;
        }
        if(this.do_not_reload) {
          delete this.do_not_reload;
        }
        else {
          setTimeout(function () {
            if(grid && grid.reload) {
              grid.reload();
            }
          }, 20);
        }
      });
      tree.attachEvent("onDblClick", function(id){
				select(id);
			});
		}
		else{
			cell_grid = wnd;
      setTimeout(function () {
        if(grid && grid.reload) {
          grid.reload();
        }
      }, 20);
    }

		// настройка грида
		grid = wnd.elmnts.grid = cell_grid.attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
      var filter = get_filter(start, count);
      if(!filter) {
        return;
      }
      _mgr.sync_grid(filter, grid);
      return false;
    });
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
      if(tree && tree.items[rId]) {
        tree.selectItem(rId);
        var pid = tree.getParentId(rId);
        if(pid && pid != $p.utils.blank.guid) {
          tree.openItem(pid);
        }
      }
      else {
        select(rId);
      }
    });

    if(attr.smart_rendering) {
      grid.enableSmartRendering(true, 50);
    }
    else {
      grid.setPagingWTMode(true, true, true, [20, 30, 60]);
      grid.enablePaging(true, 30, 8, _mgr.class_name.replace('.', '_') + '_select_recinfoArea');
      grid.setPagingSkin('toolbar', dhtmlx.skin);
    }

    if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == 'oper') {
      grid.enableMultiselect(true);
    }

    // эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){

			var filter = get_filter();
      if(!filter) {
        return Promise.resolve();
      }

      cell_grid.progressOn();
			grid.clearAll();

			return _mgr.sync_grid(filter, grid)
				.then(function(xml){
					if(typeof xml === "object"){
						$p.msg.check_soap_result(xml);
					}
					else if(!grid_inited){
						if(filter.initial_value){
							var xpos = xml.indexOf("set_parent"),
								xpos2 = xml.indexOf("'>", xpos),
								xh = xml.substr(xpos+12, xpos2-xpos-12);
							if($p.utils.is_guid(xh)){
								if(has_tree){
									tree.do_not_reload = true;
									tree.selectItem(xh, false);
								}
							}
							grid.selectRowById(filter.initial_value);

						}else if(filter.parent && $p.utils.is_guid(filter.parent) && has_tree){
							tree.do_not_reload = true;
							tree.selectItem(filter.parent, false);
						}
						grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
						grid.enableAutoWidth(true, 1200, 600);
						grid.setSizes();
						grid_inited = true;
            if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == 'desktop') {
              wnd.elmnts.filter.input_filter.focus();
            }

            if(attr.on_grid_inited) {
              attr.on_grid_inited();
            }
          }

          if(a_direction && grid_inited) {
            grid.setSortImgState(true, s_col, a_direction);
          }

          cell_grid.progressOff();

				});
		};
	}

	/**
	 *	обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		// если внешний обработчик вернул false - выходим
		if(attr.toolbar_click && attr.toolbar_click(btn_id, wnd, _mgr) === false){
			return;
		}

		if(btn_id=="btn_select"){
			select();
		}
		else if(btn_id=="btn_new"){
			_mgr.create({}, true)
				.then(function (o) {
					if(attr.on_new){
            attr.on_new(o, wnd);
          }
					else if($p.job_prm.keep_hash){
						o.form_obj(wnd);
					}
					else{
						o._set_loaded(o.ref);
						$p.iface.set_hash(_mgr.class_name, o.ref);
					}
				});
		}
		else if(btn_id=="btn_edit") {
			const rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId){
				if(attr.on_edit){
          attr.on_edit(_mgr, rId, wnd);
        }
        else if($p.job_prm.keep_hash){
					_mgr.form_obj(wnd, {ref: rId});

				}
				else{
          $p.iface.set_hash(_mgr.class_name, rId);
        }
			}
			else{
        $p.msg.show_msg({
          type: "alert-warning",
          text: $p.msg.no_selected_row.replace("%1", ""),
          title: $p.msg.main_title
        });
      }
		}
		else if(btn_id.substr(0,4)=="prn_"){
				print(btn_id);
		}
		else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");
		}
		else if(btn_id=="btn_delete"){
			mark_deleted();
		}
		else if(btn_id=="btn_import"){
			_mgr.import();
		}
		else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());
		}
		else if(btn_id=="btn_requery"){
			previous_filter = {};
			wnd.elmnts.grid.reload();
		}
	}

	/**
	 * выбор значения в гриде
	 * @param rId - идентификтор строки грида или дерева
	 */
	function select(rId){

		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();

		var folders;
		if(attr.selection){
			attr.selection.forEach(function(sel){
				for(var key in sel){
					if(key=="is_folder")
						folders = sel[key];
				}
			});
		}

		// запрещаем выбирать папки
		if(wnd.elmnts.tree &&
			wnd.elmnts.tree.items[rId] &&
			wnd.elmnts.tree.getSelectedId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		// запрещаем выбирать элементы, если в метаданных указано выбирать только папки
		// TODO: спозиционировать сообщение над выбранным элементом
		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}


		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedId();
		}

		if(rId){

			if(attr.on_edit)
				attr.on_edit(_mgr, rId, wnd);

			else if(on_select){

				_mgr.get(rId, 'promise')
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});

			} else if($p.job_prm.keep_hash){

				_mgr.form_obj(wnd, {ref: rId});

			} else
				$p.iface.set_hash(_mgr.class_name, rId);

		}
	}

	/**
	 *	Печатает документ
	 */
	function print(pid){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId)
			_mgr.print(rId, pid, wnd);
		else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}

	function mark_deleted(){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId){
			_mgr.get(rId, 'promise')
				.then(function (o) {

					dhtmlx.confirm({
						title: $p.msg.main_title,
						text: o._deleted ? $p.msg.mark_undelete_confirm.replace("%1", o.presentation) : $p.msg.mark_delete_confirm.replace("%1", o.presentation),
						cancel: "Отмена",
						callback: function(btn) {
							if(btn)
								o.mark_deleted(!o._deleted);
						}
					});
				});
		}else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		document.body.removeEventListener("keydown", body_keydown);

		if(attr && attr.on_close && !on_create){
      attr.on_close();
    }

		if(!on_create){
			_mgr = wnd = _meta = previous_filter = on_select = pwnd = attr = null;
		}
	}

	function frm_close(){

		setTimeout(frm_unload, 10);

		// если в родительском установлен обработчик выгрузки нашего - вызываем с контекстом грида
		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		if(_frm_close){
			$p.eve.detachEvent(_frm_close);
			_frm_close = null;
		}

		return true;
	}

	/**
	 * формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 * @param start {Number} - начальная запись = skip
	 * @param count {Number} - количество записей на странице
	 * @return {*|{value, enumerable}}
	 */
	function get_filter(start, count){
	  const {grid, tree} = wnd.elmnts;
    const filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					metadata: _meta,
					class_name: _mgr.class_name,
					order_by: (grid && grid.columnIds[s_col]) || s_col,
					direction: a_direction,
          start: start || (grid ? ((grid.currentPage || 1) - 1) * grid.rowsBufferOutSize : 0),
					count: count || (grid ? grid.rowsBufferOutSize : 50),
					get_header: (previous_filter.get_header == undefined)
				}),
			tparent = (has_tree && tree) ? tree.getSelectedId() : null;

    if(attr.smart_rendering) {
      filter.smart_rendering = true;
    }

    if(attr.date_from && !filter.date_from) {
      filter.date_from = attr.date_from;
    }

    if(attr.date_till && !filter.date_till) {
      filter.date_till = attr.date_till;
    }

    if(attr.initial_value) {
      filter.initial_value = attr.initial_value;
    }

    if(attr.custom_selection) {
      filter.custom_selection = attr.custom_selection;
    }

    if(attr.selection){
			if(!filter.selection)
				filter.selection = attr.selection;

			else if(Array.isArray(attr.selection)){
				attr.selection.forEach(function (flt) {
					filter.selection.push(flt);
				});

			}else{
				for(var fld in attr.selection){
					if(!res.selection)
						res.selection = [];
					var flt = {};
					flt[fld] = attr.selection[fld];
					filter.selection.push(flt);
				}
			}
			//if(Array.isArray(attr.selection) && attr.selection.length){
			//	filter._mixin(attr.selection[0]);
			//}
		}

    if(attr.owner && !filter.owner) {
      filter.owner = attr.owner;
    }

    filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
    if(has_tree && !filter.parent) {
      filter.parent = $p.utils.blank.guid;
    }


    for(var f in filter){
			if(previous_filter[f] != filter[f]){
				previous_filter = filter;
				return filter;
			}
		}
	}

	function customColumnSort(ind){
		var a_state = wnd.elmnts.grid.getSortingState();
		s_col=ind;
		a_direction = ((a_state[1] == "des")?"asc":"des");
		wnd.elmnts.grid.reload();
		return true;
	}

	/**
	 * подписываемся на событие закрытия формы объекта, чтобы обновить список и попытаться спозиционироваться на нужной строке
	 */
	var _frm_close = $p.eve.attachEvent("frm_close", function (class_name, ref) {
		if(_mgr && _mgr.class_name == class_name && wnd && wnd.elmnts){
			wnd.elmnts.grid.reload()
				.then(function () {
					if(!$p.utils.is_empty_guid(ref))
						wnd.elmnts.grid.selectRowById(ref, false, true, true);
				});
		}
	});

	// создаём и настраиваем форму
	if(has_tree && attr.initial_value && attr.initial_value!= $p.utils.blank.guid && !attr.parent)
		return _mgr.get(attr.initial_value, 'promise')
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				return frm_create();
			});
	else
		return frm_create();
};

/**
 * Форма списка объектов данных
 * @method form_list
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_list = function(pwnd, attr){
	return this.form_selection(pwnd, attr);
};
