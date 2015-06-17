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

	var _mgr = this, o = attr.o, wnd, md;

	// читаем объект из локального SQL или из 1С
	if($p.is_data_obj(o))
		initialize();
	else{
		pwnd.progressOn();

		_mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				md = _mgr.metadata();
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
		wnd = $p.iface.w.createWindow(_mgr.class_name, 0, 0, 900, 600);

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

		wnd.elmnts = {};
		wnd.modified = false;

		wnd.setText(md["obj_presentation"] + ': ' + o.presentation);
		wnd.centerOnScreen();
		wnd.button('stick').hide();
		wnd.button('park').hide();
		wnd.attachEvent("onClose", frm_close);
		$p.bind_help(wnd);

		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		wnd.elmnts.frm_toolbar.loadStruct('data/toolbar_obj.xml?v='+$p.job_prm.files_date, function(){
			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", toolbar_click);

			if(o.hasOwnProperty("posted")){
				this.enableItem("btn_post");
				this.enableItem("btn_unpost");
			}else{
				this.hideItem("btn_post");
				this.hideItem("btn_unpost");
			}

			// добавляем команды печати
			var pp = md["printing_plates"];
			for(var pid in pp)
				this.addListOption("bs_print", pid, "~", "button", pp[pid]);

			// попап для присоединенных файлов
			wnd.elmnts.vault_pop = new dhtmlXPopup({
				toolbar: this,
				id: "btn_files"
			});
			wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

		});


		/**
		 *	Закладки: шапка и табличные части
		 */
		wnd.elmnts.frm_tabs = wnd.attachTabbar();
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};
		if(!o.is_folder){
			for(var ts in md.tabular_sections){
				if(ts !== "extra_fields" && o[ts] instanceof TabularSection && !md.tabular_sections[ts].hide){
					wnd.elmnts.frm_tabs.addTab('tab_'+ts, '&nbsp;'+md.tabular_sections[ts].synonym+'&nbsp;');
					wnd.elmnts.tabs['tab_'+ts] = wnd.elmnts.frm_tabs.cells('tab_'+ts);

					// настройка табличной части
					tabular_init(wnd.elmnts.tabs['tab_'+ts], ts);
				}
			}
		}
		wnd.attachEvent("onResizeFinish", function(win){
			wnd.elmnts.pg_header.enableAutoHeight(false,wnd.elmnts.tabs.tab_header._getHeight()-20,true);
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
				grid_on_change: property_on_select
			});
			wnd.elmnts.pg_header.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
			wnd.elmnts.pg_header.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
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

		else if(btn_id=="btn_add_row")
			add_row();

		else if(btn_id=="btn_delete_row")
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
	 * обработчик выбора значения в таблице продукции (ссылочные типы)
	 */
	function tabular_on_value_select(selv){

		if(selv===undefined)
			return;

		this.row[this.col] = selv;
		this.cell.setValue(selv.presentation);
	}


	/**
	 * Перечитать табчасть продукции из объекта
	 */
	function refresh_tabulars(){
		for(var ts in md.tabular_sections){
			if(ts !== "extra_fields" && o[ts] instanceof TabularSection){
				o[ts].sync_grid(wnd.elmnts["grid_" + name]);
			}
		}
	}


	/**
	 * обработчик изменения значения в таблице продукции (примитивные типы)
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){
		if(stage != 2 || nValue == oValue)
			return true;
		var source = this.getUserData("", "source"),
			fName = source.fields[cInd], ret_code;

		if(fName == "note"){
			ret_code = true;
			o[source.tabular_section].get(rId-1)[fName] = nValue;
		} else if (!isNaN(Number(nValue))){
			ret_code = true;
			o[source.tabular_section].get(rId-1)[fName] = Number(nValue);
		}
		if(ret_code){
			setTimeout(function(){ production_on_value_change(rId-1); } , 0);
			return ret_code;
		}
	}

	/**
	 * дополнительный обработчик выбора значения в шапке документа (ссылочные типы)
	 */
	function property_on_select(f, selv){


	}


	/**
	 * настройка (инициализация) табличной части продукции
	 */
	function tabular_init(tab, name){

		// панель инструментов табличной части
		var tb = wnd.elmnts["tb_" + name] = tab.attachToolbar();
		tb.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
		tb.loadStruct('data/toolbar_add_del.xml', function(){
			this.attachEvent("onclick", toolbar_click);
		});


		// собственно табличная часть
		var grid = wnd.elmnts["grid_" + name] = tab.attachGrid(),
			source = {
				o: o,
				wnd: wnd,
				on_select: tabular_on_value_select,
				tabular_section: name
			};

		_md.ts_captions(_mgr.class_name, name, source);

		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);


		grid.setHeader(source.headers);
		//grid.setInitWidths(source.widths);
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

	function tabular_new_row(){
		var row = o["production"].add({qty: 1, quantity: 1, discount_percent_internal: $p.wsql.get_user_param("discount", "number")});
		refresh_tabulars();
		wnd.elmnts.detales_grid.selectRowById(row.row);
		return row;
	}

	function tabular_get_sel_index(){
		var selId = wnd.elmnts.detales_grid.getSelectedRowId();
		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;
		$p.msg.show_msg({type: "alert-warning",
			text: $p.msg.no_selected_row.replace("%1", "Продукция"),
			title: md["obj_presentation"] + ': ' + o.presentation});
	}

	function del_row(){

		var rId = tabular_get_sel_index(), row;

		if(rId == undefined)
			return;
		else
			row = o["production"].get(rId);


		//wnd.progressOn();
		//_mgr.save({
		//	ref: o.ref,
		//	del_row: rId,
		//	o: o._obj,
		//	action: "calc",
		//	specify: "production"
		//}).then(function(res){
		//	if(!$p.msg.check_soap_result(res))			// сервер об ошибках не сообщил. считаем, что данные записались
		//		wnd.reflect_change(res); // - перезаполнить шапку и табчасть
		//	wnd.progressOff();
		//});
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

		if(action == "close")
			wnd.close();
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
		var row = tabular_new_row(), cell, grid = wnd.elmnts.detales_grid;
		grid.selectCell(row.row-1, grid.getColIndexById("nom"), false, true, true);
		cell = grid.cells();
		cell.edit();
		cell.open_selection();
	}

}