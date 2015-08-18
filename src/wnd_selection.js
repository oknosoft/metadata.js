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

	var _mgr = this,
		md = _mgr.metadata(),
		has_tree = md["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0,
		a_direction = "asc",
		previous_filter = {};


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
		if(pwnd instanceof dhtmlXLayoutCell) {
			if(typeof pwnd.close == "function")
				pwnd.close();
			wnd = pwnd;
			wnd.close = function () {
				(wnd || pwnd).detachToolbar();
				(wnd || pwnd).detachStatusBar();
				(wnd || pwnd).detachObject(true);
				frm_unload();
			};
			setTimeout(function () {
				wnd.showHeader();
			});
		}else{
			wnd = $p.iface.w.createWindow('wnd_' + _mgr.class_name.replace(".", "_") + '_select', 0, 0, 900, 600);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.iface.bind_help(wnd);
		wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (md["list_presentation"] || md.synonym) + '"');

		dhtmlxEvent(document.body, "keydown", body_keydown);

		// статусбар
		wnd.elmnts = {
			status_bar: wnd.attachStatusBar()
		};
		wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");

		// командная панель формы

		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.toolbar.loadStruct(require("toolbar_selection"), function(){

			this.attachEvent("onclick", toolbar_click);

			// текстовое поле фильтра по подстроке
			wnd.elmnts.filter = new $p.iface.Toolbar_filter({
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change
			});

			// Если нет полных прав - разрешен только просмотр и выбор элементов
			// TODO: учитывать права для каждой роли на каждый объект
			if(!$p.ajax.root){
				this.disableItem("btn_new");
				this.disableItem("btn_edit");
				this.disableItem("btn_delete");
			}

			if(!pwnd.on_select && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper"){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				this.addListOption("bs_more", "btn_order_list", "~", "button", "Список заказов", "tb_autocad.png");

			}
			this.addListOption("bs_more", "btn_import", "~", "button", "Загрузить из файла", "document_load.png");
			this.addListOption("bs_more", "btn_export", "~", "button", "Выгрузить в файл", "document_save.png");

			// добавляем команды печати
			if(_mgr instanceof CatManager || _mgr instanceof DocManager)
				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid]);
				});
			else
				this.disableItem("bs_print");

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

		if(wnd && (evt.keyCode == 113 || evt.keyCode == 115)){ //"F2" или "F4"

			var do_exit;
			// если есть внешнее модальное, ничего обрабатывать не надо
			$p.iface.w.forEachWindow(function (w) {
				if(w.isModal() && w != wnd)
					do_exit = true;
			});
			if(do_exit)
				return;

			setTimeout(function(){
				wnd.elmnts.filter.input_filter.focus();
			}, 0);
			return $p.cancel_bubble(evt);

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
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});

			// !!! проверить закешированность дерева
			// !!! для неиерархических справочников дерево можно спрятать
			$p.cat.load_soap_to_grid({
				action: "get_tree",
				class_name: _mgr.class_name
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
			var filter = get_filter();
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
					wnd.elmnts.filter.input_filter.focus();
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
			// TODO: м.б. записывать пустой объект и получать код-номер??
			_mgr.create({}, true)
				.then(function (o) {
					o._set_loaded(o.ref);
					$p.iface.set_hash(_mgr.class_name, o.ref);
				});


		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId)
				$p.iface.set_hash(_mgr.class_name, rId);
			else
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
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_import"){
			_mgr.import();

		}else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
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
			if(pwnd.on_select)
				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						pwnd.on_select.call(pwnd.grid || pwnd, selv);
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

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(){
		_mgr = null;
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
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					class_name: _mgr.class_name,
					order_by: s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				})
				._mixin(attr),

			tparent = has_tree ? wnd.elmnts.tree.getSelectedItemId() : null;

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