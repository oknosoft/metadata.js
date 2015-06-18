/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module  wnd_selection
 */

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_selection = function(pwnd, attr){
	var _mngr, md, class_name, wnd, s_col, a_direction, previous_filter;

	// читаем метаданные
	_mngr = this;
	md = _mngr.metadata();
	class_name = _mngr.class_name;
	s_col = 0;
	a_direction = "asc";
	previous_filter = {};

	if(!md){
		$p.msg.show_msg({
			title: $p.msg.error_critical,
			type: "alert-error",
			text: $p.msg.no_metadata.replace("%1", class_name)
		});
		return;
	}

	// создаём и настраиваем форму
	frm_create();


	/**
	 *	раздел вспомогательных функций
	 */

	/**
	 * аналог 1С-ного ПриСозданииНаСервере()
	 */
	function frm_create(){

		// создаём и растраиваем форму
		if(pwnd instanceof dhtmlXLayoutCell) {
			wnd = pwnd;
			wnd.showHeader();
			wnd.close = function () {
				(wnd || pwnd).detachToolbar();
				(wnd || pwnd).detachStatusBar();
				(wnd || pwnd).detachObject(true);
				frm_unload();
			};
		}else{
			wnd = $p.iface.w.createWindow('wnd_' + class_name.replace(".", "_") + '_select', 0, 0, 900, 600);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.bind_help(wnd);
		wnd.setText('Список ' + (class_name.indexOf("cat.") > -1 ? 'справочника "' : 'документов "') + (md["list_presentation"] || md.synonym) + '"');

		dhtmlxEvent(document.body, "keydown", body_keydown);

		// командная панель формы
		wnd.elmnts = {};
		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.toolbar.loadStruct('data/toolbar_selection.xml?v='+$p.job_prm.files_date, function(){
			this.addSpacer("input_filter");
			this.attachEvent("onclick", toolbar_click);
			// текстовое поле фильтра по подстроке
			wnd.elmnts.input_filter = this.getInput("input_filter");
			wnd.elmnts.input_filter.onchange = input_filter_change;
			wnd.elmnts.input_filter.type = "search";

			if(!pwnd.on_select && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper"){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				this.addListOption("bs_more", "btn_order_list", "~", "button", "Список заказов", "tb_autocad.png");
				this.addListOption("bs_more", "btn_import", "~", "button", "Загрузить из файла", "document_load.png");
				this.addListOption("bs_more", "btn_export", "~", "button", "Выгрузить в файл", "document_save.png");

			}else{
				this.disableItem("btn_new");
				this.disableItem("btn_edit");
				this.disableItem("btn_delete");
			}

			//
			create_tree_and_grid();
		});
		// статусбар
		wnd.elmnts.status_bar = wnd.attachStatusBar();
		wnd.elmnts.status_bar.setText("<div id='" + class_name.replace(".", "_") + "_select_recinfoArea'></div>");
	}

	/**
	 * Устанавливает фокус в поле фильтра
	 * @param evt {KeyboardEvent}
	 * @return {Boolean}
	 */
	function body_keydown(evt){
		if(wnd && (evt.keyCode == 113 || evt.keyCode == 115)){ //"F2" или "F4"
			setTimeout(function(){
				wnd.elmnts.input_filter.focus();
			}, 0);
			return $p.cancel_bubble(evt);
		}
	}

	function input_filter_change(){
		if(md["hierarchical"]){
			if(wnd.elmnts.input_filter.value)
				wnd.elmnts.cell_tree.collapse();
			else
				wnd.elmnts.cell_tree.expand();
		}
		wnd.elmnts.grid.reload();
	}

	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;

		if(md["hierarchical"]){
			layout = wnd.attachLayout('2U');

			cell_grid = layout.cells('b');
			cell_grid.hideHeader();
			grid = wnd.elmnts.grid = cell_grid.attachGrid();

			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();
			cell_tree.setCollapsedText("Дерево");
			tree = wnd.elmnts.tree = cell_tree.attachTree();
			tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
			tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
			tree.enableKeyboardNavigation(true);
			tree.attachEvent("onSelect", function(){	// довешиваем обработчик на дерево
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					grid.reload();
			});

			// !!! проверить закешированность дерева
			// !!! для неиерархических справочников дерево можно спрятать
			$p.cat.load_soap_to_grid({
				action: "get_tree",
				class_name: class_name
			}, wnd.elmnts.tree, function(){
				setTimeout(function(){ grid.reload(); }, 20);
			});

		}else{
			cell_grid = wnd;
			grid = wnd.elmnts.grid = wnd.attachGrid();
			setTimeout(function(){ grid.reload(); }, 20);
		}

		// настройка грида
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setPagingWTMode(true,true,true,[20,30,60]);
		grid.enablePaging(true, 30, 8, class_name.replace(".", "_") + "_select_recinfoArea");
		grid.setPagingSkin("toolbar", dhtmlx.skin);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = getFilter(start,count);
			if(!filter)
				return;
			$p.cat.load_soap_to_grid(filter, grid);
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

		if($p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		// эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){
			var filter = getFilter();
			if(!filter) return;
			cell_grid.progressOn();
			grid.clearAll();
			$p.cat.load_soap_to_grid(filter, grid, function(xml){
				if(typeof xml === "object"){
					$p.msg.check_soap_result(xml);

				}else if(!grid_inited){
					if(filter.initial_value){
						var xpos = xml.indexOf("set_parent"),
							xpos2 = xml.indexOf("'>", xpos),
							xh = xml.substr(xpos+12, xpos2-xpos-12);
						if($p.is_guid(xh)){
							if(md["hierarchical"]){
								tree.do_not_reload = true;
								tree.selectItem(xh, false);
							}
						}
						grid.selectRowById(filter.initial_value);

					}else if(filter.parent && $p.is_guid(filter.parent) && md["hierarchical"]){
						tree.do_not_reload = true;
						tree.selectItem(filter.parent, false);
					}
					grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
					grid.enableAutoWidth(true, 1200, 600);
					grid.setSizes();
					grid_inited = true;
					wnd.elmnts.input_filter.focus();
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
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_edit"){
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if(rId)
				$p.iface.set_hash(_mngr.class_name, rId);
			else
				$p.msg.show_msg({type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title});

		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");

		}else if(btn_id=="btn_delete"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_import"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_export"){
			_mngr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
			wnd.elmnts.grid.reload();

		}
	}

	/**
	 * выбор значения в гриде
	 * @param rId - идентификтор строки грида
	 */
	function select(rId){

		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();

		// запрещаем выбирать папки
		if(wnd.elmnts.tree && wnd.elmnts.tree.getIndexById(rId) != null){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		if(rId && pwnd.on_select){
			var fld = _mngr.get(rId);
			wnd.close();
			pwnd.on_select.call(pwnd.grid || pwnd, fld);
		}
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(){
		_mngr = null;
		wnd = null;
		md = null;
		previous_filter = null;
		document.body.removeEventListener("keydown", body_keydown);
	}

	function frm_close(win){
		// проверить на ошибки, записать изменения
		// если проблемы, вернуть false

		setTimeout(frm_unload, 10);

		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		return true;
	}

	/**
	 *	@desc: 	формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 *			переопределяется в каждой форме
	 *	@param:	start, count - начальная запись и количество записей
	 */
	function getFilter(start, count){
		var filter = {
			action: "get_selection",
			class_name: class_name,
			filter: wnd.elmnts.input_filter.value,
			order_by: s_col,
			direction: a_direction,
			start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
			count: count || wnd.elmnts.grid.rowsBufferOutSize,
			get_header: (previous_filter.get_header == undefined)
		}, tparent = md["hierarchical"] ? wnd.elmnts.tree.getSelectedItemId() : null;
		filter._mixin(attr);
		filter.parent = ((tparent || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		for(var f in filter) if(previous_filter[f] != filter[f]){
			previous_filter = filter;
			return filter;
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