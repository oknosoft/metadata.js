/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов
 *
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author	Evgeniy Malyarov
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

	if(!pwnd)
		pwnd = attr && attr.pwnd ? attr.pwnd : {};

	if(!attr && !(pwnd instanceof dhtmlXCellObject)){
		attr = pwnd;
		pwnd = {};
	}

	if(!attr)
		attr = {};


	var _mgr = this,
		_meta = attr.metadata || _mgr.metadata(),
		has_tree = _meta["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0,
		a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;


	// создаём и настраиваем форму
	if(has_tree && attr.initial_value && attr.initial_value!= $p.blank.guid && !attr.parent)
		_mgr.get(attr.initial_value, true)
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				frm_create();
			});
	else
		frm_create();


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
			wnd = $p.iface.w.createWindow(null, 0, 0, 900, 600);
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
		wnd.elmnts = {
			status_bar: wnd.attachStatusBar()
		};
		wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");

		// командная панель формы
		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_selection.xml"], function(){

			this.attachEvent("onclick", toolbar_click);

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd)
				this.cont.style.top = "4px";

			// текстовое поле фильтра по подстроке
			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter
			};
			if(attr.date_from)
				tbattr.date_from = attr.date_from;
			if(attr.date_till)
				tbattr.date_till = attr.date_till;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);

			// Если нет полных прав - разрешен только просмотр и выбор элементов
			// TODO: учитывать права для каждой роли на каждый объект
			if(!$p.ajax.root){
				this.hideItem("btn_new");
				this.hideItem("btn_edit");
				this.hideItem("btn_delete");
			}

			if(!on_select){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
					this.addListOption("bs_more", "btn_order_list", "~", "button", "<i class='fa fa-briefcase fa-lg fa-fw'></i> Список заказов");
			}
			this.addListOption("bs_more", "btn_import", "~", "button", "<i class='fa fa-upload fa-lg fa-fw'></i> Загрузить из файла");
			this.addListOption("bs_more", "btn_export", "~", "button", "<i class='fa fa-download fa-lg fa-fw'></i> Выгрузить в файл");


			// добавляем команды печати
			if(_mgr instanceof CatManager || _mgr instanceof DocManager)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid]);
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
	}

	/**
	 * Устанавливает фокус в поле фильтра
	 * @param evt {KeyboardEvent}
	 * @return {Boolean}
	 */
	function body_keydown(evt){

		/**
		 * Проверяет, нет ли других модальных форм
		 */
		function check_exit(){
			var do_exit;
			// если есть внешнее модальное, ничего обрабатывать не надо
			$p.iface.w.forEachWindow(function (w) {
				if(w.isModal() && w != wnd)
					do_exit = true;
			});
			return do_exit;
		}

		if(wnd){
			if (evt.keyCode == 113 || evt.keyCode == 115){ //{F2} или {F4}
				if(!check_exit()){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter)
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.cancel_bubble(evt);
				}

			} else if(evt.shiftKey && evt.keyCode == 116){ // requery по {Shift+F5}
				if(!check_exit()){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.cancel_bubble(evt);
				}

			} else if(evt.keyCode == 27){ // закрытие по {ESC}
				if(!check_exit()){

				}
			}
		}
	}

	function input_filter_change(flt){
		if(has_tree){
			if(flt.filter)
				wnd.elmnts.cell_tree.collapse();
			else
				wnd.elmnts.cell_tree.expand();
		}
		wnd.elmnts.grid.reload();
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

			tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, null, function(){
				setTimeout(function(){ grid.reload(); }, 20);
			});
			tree.attachEvent("onSelect", function(){	// довешиваем обработчик на дерево
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					setTimeout(function(){ grid.reload(); }, 20);
			});
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});

		}else{
			cell_grid = wnd;
			setTimeout(function(){ grid.reload(); }, 20);
		}

		// настройка грида
		grid = wnd.elmnts.grid = cell_grid.attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setPagingWTMode(true,true,true,[20,30,60]);
		grid.enablePaging(true, 30, 8, _mgr.class_name.replace(".", "_") + "_select_recinfoArea");
		grid.setPagingSkin("toolbar", dhtmlx.skin);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = get_filter(start,count);
			if(!filter)
				return;
			_mgr.sync_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			var tree_row_index=null;
			if(tree)
				tree_row_index = tree.getIndexById(rId);
			if(tree_row_index!=null)
				tree.selectItem(rId, true);
			else select(rId);
		});

		if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		// эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){
			var filter = get_filter();
			if(!filter) return;
			cell_grid.progressOn();
			grid.clearAll();
			_mgr.sync_grid(filter, grid)
				.then(function(xml){
				if(typeof xml === "object"){
					$p.msg.check_soap_result(xml);

				}else if(!grid_inited){
					if(filter.initial_value){
						var xpos = xml.indexOf("set_parent"),
							xpos2 = xml.indexOf("'>", xpos),
							xh = xml.substr(xpos+12, xpos2-xpos-12);
						if($p.is_guid(xh)){
							if(has_tree){
								tree.do_not_reload = true;
								tree.selectItem(xh, false);
							}
						}
						grid.selectRowById(filter.initial_value);

					}else if(filter.parent && $p.is_guid(filter.parent) && has_tree){
						tree.do_not_reload = true;
						tree.selectItem(filter.parent, false);
					}
					grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
					grid.enableAutoWidth(true, 1200, 600);
					grid.setSizes();
					grid_inited = true;
					if(wnd.elmnts.filter.input_filter)
						wnd.elmnts.filter.input_filter.focus();

					if(attr.on_grid_inited)
						attr.on_grid_inited();
				}
				if (a_direction && grid_inited)
					grid.setSortImgState(true, s_col, a_direction);
				cell_grid.progressOff();
			});
		};
	}

	/**
	 *	@desc: 	обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		if(btn_id=="btn_select"){
			select();

		}else if(btn_id=="btn_new"){

			_mgr.create({}, true)
				.then(function (o) {

					if(attr.on_new)
						attr.on_new(o, wnd);

					else if($p.job_prm.keep_hash){
						o.form_obj(wnd);

					} else{
						o._set_loaded(o.ref);
						$p.iface.set_hash(_mgr.class_name, o.ref);
					}
				});


		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId){
				if(attr.on_edit)
					attr.on_edit(_mgr, rId, wnd);

				else if($p.job_prm.keep_hash){

					_mgr.form_obj(wnd, {ref: rId});

				} else
					$p.iface.set_hash(_mgr.class_name, rId);
			}else
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title
				});

		}else if(btn_id.substr(0,4)=="prn_"){
				print(btn_id);

		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");

		}else if(btn_id=="btn_delete"){
			mark_deleted();

		}else if(btn_id=="btn_import"){
			_mgr.import();

		}else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
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
			wnd.elmnts.tree.getIndexById(rId) != null &&
			wnd.elmnts.tree.getSelectedItemId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		// запрещаем выбирать элементы, если в метаданных указано выбирать только папки
		// TODO: спозиционировать сообщение над выбранным элементом
		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}


		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedItemId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedItemId();
		}

		if(rId){
			if(on_select)
				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});
			else
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
			_mgr.get(rId, true, true)
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

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			_mgr = wnd = _meta = previous_filter = on_select = pwnd = attr = null;
		}
	}

	function frm_close(){

		setTimeout(frm_unload, 10);

		// если в родительском установлен обработчик выгрузки нашего - вызываем с контекстом грида
		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		return true;
	}

	/**
	 * формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 * @param start {Number} - начальная запись = skip
	 * @param count {Number} - количество записей на странице
	 * @return {*|{value, enumerable}}
	 */
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					metadata: _meta,
					class_name: _mgr.class_name,
					order_by: wnd.elmnts.grid.columnIds[s_col] || s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				}),
			tparent = has_tree ? wnd.elmnts.tree.getSelectedItemId() : null;

		if(attr.date_from && !filter.date_from)
			filter.date_from = attr.date_from;

		if(attr.date_till && !filter.date_till)
			filter.date_till = attr.date_till;

		if(attr.initial_value)
			filter.initial_value = attr.initial_value;

		if(attr.custom_selection)
			filter.custom_selection = attr.custom_selection;

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

		if(attr.owner && !filter.owner)
			filter.owner = attr.owner;

		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.blank.guid;


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

	return wnd;
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