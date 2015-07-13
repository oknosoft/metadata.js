/**
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, отчетов и обработок<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module metadata
 * @submodule wnd_obj
 */


/**
 * Форма объекта данных
 * @method form_obj
 * @for DataManager
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_obj = function(pwnd, attr){

	// если существует переопределенная форма, открываем её
	var frm = require("wnd/wnd_" + this.class_name.replace('.', "_") + "_obj");
	if(frm)
		return frm($p, pwnd, attr);

	var _mgr = this,
		o = attr.o,
		cmd = _mgr.metadata(),
		wnd, options;

	// читаем объект из локального SQL или получаем с сервера
	if($p.is_data_obj(o)){
		if(o.is_new() && attr.on_select)
			_mgr.create({}, true)
				.then(function (tObj) {
					o = tObj;
					tObj = null;
					initialize();
				});
		else
			initialize();
	}else{
		pwnd.progressOn();

		_mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				pwnd.progressOff();
				initialize();
			})
			.catch(function (err) {
				pwnd.progressOff();
				console.log(err);
			});
	}


	/**
	 * инициализация до создания формы, но после чтения объекта
	 */
	function initialize(){

		// создаём форму
		options = {
			name: 'wnd_obj_' + _mgr.class_name,
			wnd: {
				id: 'wnd_obj_' + _mgr.class_name,
				top: 80 + Math.random()*40,
				left: 120 + Math.random()*80,
				width: 900,
				height: 600,
				modal: true,
				center: false,
				pwnd: pwnd,
				allow_close: true,
				allow_minmax: true,
				on_close: frm_close,
				caption: (cmd.obj_presentation || cmd.synonym) + ': ' + o.presentation
			}
		};

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd._define("ref", {
			get: function(){
				return o.ref;
			},
			enumerable: false,
			configurable: false
		});

		/**
		 * перезаполняет шапку и табчасть документа данными "attr"
		 * @param [attr] {object}
		 */
		wnd.reflect_change = function(attr){
			if(attr)
				o._mixin(attr);
			refresh_tabulars();
			header_refresh();
		};

		// настраиваем форму
		frm_create();

	}

	/**
	 * ПриСозданииНаСервере()
	 */
	function frm_create(){

		/**
		 *	Закладки: шапка и табличные части
		 */
		wnd.elmnts.frm_tabs = wnd.attachTabbar();
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};
		if(!o.is_folder){
			for(var ts in cmd.tabular_sections){
				if(ts==="extra_fields")
					continue;

				if(o[ts] instanceof TabularSection){

					// настройка табличной части
					tabular_init(ts);
				}
			}
		}
		wnd.attachEvent("onResizeFinish", function(win){
			wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
		});

		/**
		 *	закладка шапка
		 */
		wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachPropertyGrid();
		wnd.elmnts.pg_header.setDateFormat("%d.%m.%Y %H:%i");
		wnd.elmnts.pg_header.init();
		wnd.elmnts.pg_header.loadXMLString(_mgr.get_property_grid_xml(null, o), function(){
			wnd.elmnts.pg_header.enableAutoHeight(false,wnd.elmnts.tabs.tab_header._getHeight()-20,true);
			wnd.elmnts.pg_header.setSizes();
			wnd.elmnts.pg_header.setUserData("", "source", {
				o: o,
				wnd: wnd,
				grid: wnd.elmnts.pg_header,
				on_select: $p.iface.pgrid_on_select,
				grid_on_change: header_change
			});
			wnd.elmnts.pg_header.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
			wnd.elmnts.pg_header.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
		});

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.frm_toolbar.loadStruct(require("toolbar_obj"), function(){
			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", toolbar_click);

			if(o.hasOwnProperty("posted")){
				this.enableItem("btn_post");
				this.enableItem("btn_unpost");
			}else{
				this.hideItem("btn_post");
				this.hideItem("btn_unpost");
			}

			if(attr.on_select)
				this.setItemText("btn_save_close", "Записать и выбрать");

			// добавляем команды печати
			var pp = cmd["printing_plates"];
			for(var pid in pp)
				this.addListOption("bs_print", pid, "~", "button", pp[pid]);

			// попап для присоединенных файлов
			wnd.elmnts.vault_pop = new dhtmlXPopup({
				toolbar: this,
				id: "btn_files"
			});
			wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

		});


	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_add")
			add_row();

		else if(btn_id=="btn_delete")
			del_row();

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o.ref, btn_id, wnd);

		else if(btn_id=="btn_import")
			$p.msg.show_not_implemented();

		else if(btn_id=="btn_export")
			_mgr.export(o.ref);

	}

	/**
	 * показывает список связанных документов
	 */
	function go_connection(){
		$p.msg.show_not_implemented();
	}

	/**
	 * создаёт и показывает диалог присоединенных файлов
	 */
	function show_vault(){

		if (!wnd.elmnts.vault) {

			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				uploadUrl:  $p.job_prm.hs_url() + "/files/?class_name=" + _mgr.class_name + "&ref=" + o.ref,
				buttonClear: false,
				autoStart: true,
				filesLimit: 10
			});
			wnd.elmnts.vault.conf.wnd = wnd;

			// действия после загрузки файла
			wnd.elmnts.vault.attachEvent("onUploadFile", function(v, e){


			});

			// действия перед загрузкой файла
			wnd.elmnts.vault.attachEvent("onBeforeFileAdd", function(file){
				if(file.size <= this.getMaxFileSize())
					return true;
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.file_size + this._readableSize(this.getMaxFileSize()),
					title: $p.msg.main_title});
				return false;
			});

			// действия перед удалением файла
			wnd.elmnts.vault.attachEvent("onBeforeFileRemove", function(file){

				if(wnd.elmnts.vault.file_data[file.id].delete_confirmed)
					return true;

				dhtmlx.confirm({
					title: $p.msg.main_title,
					text: $p.msg.file_confirm_delete + file.name,
					cancel: "Отмена",
					callback: function(btn) {
						if(btn)
							$p.ajax.post_ex(wnd.elmnts.vault.actionUrl(file.id, "drop"), "", true)
								.then(function(req){
									wnd.elmnts.vault.file_data[file.id].delete_confirmed = true;
									wnd.elmnts.vault._removeFileFromQueue(file.id);
								});
					}
				});
				return false;

			});

			// обновляем список присоединенных файлов

		}

	}


	/**
	 * Перечитать табчасть продукции из объекта
	 */
	function refresh_tabulars(){
		for(var ts in cmd.tabular_sections){
			if(ts !== "extra_fields" && o[ts] instanceof TabularSection){
				o[ts].sync_grid(wnd.elmnts["grid_" + ts]);
			}
		}
	}


	/**
	 * обработчик выбора значения в таблице продукции (ссылочные типы)
	 */
	function tabular_on_value_select(selv){

		if(selv===undefined)
			return;

		var ret_code = _mgr.handle_event(o, "value_change", {
				field: this.col,
				value: selv,
				tabular_section: this.tabular_section,
				grid: wnd.elmnts["grid_" + this.tabular_section],
				row: this.row,
				wnd: wnd
			});

		if(typeof ret_code !== "boolean"){
			this.row[this.col] = selv;
			this.cell.setValue(selv.presentation);
		}
	}

	/**
	 * обработчик изменения значения в таблице продукции (примитивные типы)
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var source = this.getUserData("", "source"),
			row = o[source.tabular_section].get(rId-1),
			fName = source.fields[cInd],
			ret_code = _mgr.handle_event(o, "value_change", {
				field: fName,
				value: nValue,
				tabular_section: source.tabular_section,
				grid: this,
				row: row,
				cell: this.cells(rId, cInd),
				wnd: wnd
			});

		if(typeof ret_code !== "boolean"){
			row[fName] = $p.fetch_type(nValue, row._metadata.fields[fName].type);
			ret_code = true;
		}

		return ret_code;
	}

	/**
	 * дополнительный обработчик изменения значения в шапке документа (ссылочные и примитивные типы)
	 */
	function header_change(f, selv){
		_mgr.handle_event(o, "value_change", {
			field: f,
			value: selv,
			tabular_section: "",
			grid: this.cells ? this : this.grid,
			cell: this.cells ? this.cells() : this.grid.cells(),
			wnd: wnd
		})
	}

	/**
	 * настройка (инициализация) табличной части продукции
	 */
	function tabular_init(name){

		// с помощью метода ts_captions(), выясняем, надо ли добавлять данную ТЧ и формируем описание колонок табчасти
		var source = {
				o: o,
				wnd: wnd,
				on_select: tabular_on_value_select,
				tabular_section: name
			};
		if(!_md.ts_captions(_mgr.class_name, name, source))
			return;

		// закладка табов табличной части
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+cmd.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);


		// панель инструментов табличной части
		var tb = wnd.elmnts["tb_" + name] = wnd.elmnts.tabs['tab_'+name].attachToolbar();
		tb.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		tb.loadStruct(require("toolbar_add_del"), function(){
			this.attachEvent("onclick", toolbar_click);
		});

		// собственно табличная часть
		var grid = wnd.elmnts["grid_" + name] = wnd.elmnts.tabs['tab_'+name].attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setHeader(source.headers);
		if(source.min_widths)
			grid.setInitWidths(source.widths);
		if(source.min_widths)
			grid.setColumnMinWidth(source.min_widths);
		if(source.aligns)
			grid.setColAlign(source.aligns);
		grid.setColSorting(source.sortings);
		grid.setColTypes(source.types);
		grid.setColumnIds(source.fields.join(","));
		grid.enableAutoWidth(true, 1200, 600);
		grid.enableEditTabOnly(true);

		grid.init();

		grid.setUserData("", "source", source);
		grid.attachEvent("onEditCell", tabular_on_edit);

		o[name].sync_grid(grid);
	}


	/**
	 * перечитывает реквизиты шапки из объекта в гриды
	 */
	function header_refresh(){
		function reflect(id){
			if(typeof id == "string"){
				var fv = o[id]
				if(fv != undefined){
					if($p.is_data_obj(fv))
						this.cells(id, 1).setValue(fv.presentation);
					else if(fv instanceof Date)
						this.cells(id, 1).setValue($p.dateFormat(fv, ""));
					else
						this.cells(id, 1).setValue(fv);

				}else if(id.indexOf("extra_fields") > -1){
					var row = o["extra_fields"].find(id.split("|")[1]);
				}
			}
		}
		wnd.elmnts.pg_header.forEachRow(function(id){	reflect.call(wnd.elmnts.pg_header, id); });
	}

	function tabular_get_sel_index(tabular){
		var selId = wnd.elmnts["grid_" + tabular].getSelectedRowId();

		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;

		$p.msg.show_msg({type: "alert-warning",
			text: $p.msg.no_selected_row.replace("%1", cmd.tabular_sections[tabular].synonym || cmd.tabular_sections[tabular].name),
			title: cmd.obj_presentation || cmd.synonym + ': ' + o.presentation});
	}

	function del_row(){

		var tabular = wnd.elmnts.frm_tabs.getActiveTab().replace("tab_", ""),
			rId = tabular_get_sel_index(tabular);

		if(rId == undefined)
			return;

		o[tabular].del(rId);
		o[tabular].sync_grid(wnd.elmnts["grid_" + tabular]);

	}

	function save(action){

		function do_save(){

			//wnd.progressOn();
			//_mgr.save({
			//	ref: o.ref,
			//	o: o._obj,
			//	action: "calc"
			//});
		}

		do_save();

		if(action == "close"){
			if(attr.on_select)
				attr.on_select(o);
			wnd.close();
		}

	}

	function frm_close(win){

		if (wnd.elmnts.vault)
			wnd.elmnts.vault.unload();

		if (wnd.elmnts.vault_pop)
			wnd.elmnts.vault_pop.unload();

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		return true;
	}


	/**
	 * добавляет строку табчасти
	 */
	function add_row(){
		var tabular = wnd.elmnts.frm_tabs.getActiveTab().replace("tab_", ""),
			grid = wnd.elmnts["grid_" + tabular],
			row = o[tabular].add();
		o[tabular].sync_grid(grid);
		grid.selectRowById(row.row);
	}

};