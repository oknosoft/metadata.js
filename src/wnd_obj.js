/**
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, отчетов и обработок
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module metadata
 * @submodule wnd_obj
 */


/**
 * ### Форма объекта данных
 * По умолчанию, форма строится автоматически по описанию метаданных.<br />
 * Метод можно переопределить для конкретного менеджера
 *
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
					frm_create();
				});
		else if(o.is_new() && !o.empty()){
			o.load()
				.then(frm_create);
		}else
			frm_create();
	}else{
		pwnd.progressOn();

		_mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				pwnd.progressOff();
				frm_create();
			})
			.catch(function (err) {
				pwnd.progressOff();
				$p.record_log(err);
			});
	}


	/**
	 * ПриСозданииНаСервере - инициализация до создания формы, но после чтения объекта
	 */
	function frm_create(){

		// создаём и настраиваем окно формы
		if(pwnd instanceof dhtmlXLayoutCell && (attr.bind_pwnd || attr.Приклеить)) {
			// форма объекта приклеена к области контента или другой форме
			if(typeof pwnd.close == "function")
				pwnd.close();
			wnd = pwnd;
			wnd.close = function () {
				if(wnd || pwnd){
					(wnd || pwnd).detachToolbar();
					(wnd || pwnd).detachStatusBar();
					(wnd || pwnd).detachObject(true);	
				}
				frm_unload();
			};
			wnd.elmnts = {};
			setTimeout(function () {
				wnd.showHeader();
				wnd.setText((cmd.obj_presentation || cmd.synonym) + ': ' + o.presentation);
			});

		}else{
			// форма в модальном диалоге
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
		}

		if(!wnd.ref)
			wnd.__define("ref", {
				get: function(){
					return o ? o.ref : $p.blank.guid;
				},
				enumerable: false,
				configurable: true
			});

		/**
		 *	Закладки: шапка и табличные части
		 */
		wnd.elmnts.frm_tabs = wnd.attachTabbar({
			arrows_mode: "auto",
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
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
		wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({obj: o, pwnd: wnd});

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
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
			if(_mgr instanceof CatManager || _mgr instanceof DocManager)
				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.frm_toolbar.addListOption("bs_print", pid, "~", "button", pp[pid]);
				});
			else
				this.disableItem("bs_print");

			// попап для присоединенных файлов
			wnd.elmnts.vault_pop = new dhtmlXPopup({
				toolbar: this,
				id: "btn_files"
			});
			wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

		});

		if($p.job_prm.russian_names){
			if(!wnd.Элементы)
				wnd.__define({
					"Элементы": {
						get: function () {
							return this.elmnts;
						},
						enumerable: false
					}
				});
			if(!wnd.elmnts.Шапка)
				wnd.elmnts.__define({
					"Шапка": {
						get: function () {
							return this.pg_header;
						},
						enumerable: false
					}
				});
		}

	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o.ref, btn_id, wnd);

		else if(btn_id=="btn_import")
			_mgr.import(null, o);

		else if(btn_id=="btn_export")
			_mgr.export({items: [o], pwnd: wnd, obj: true} );

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
	 * настройка (инициализация) табличной части продукции
	 */
	function tabular_init(name){

		// с помощью метода ts_captions(), выясняем, надо ли добавлять данную ТЧ и формируем описание колонок табчасти
		if(!_md.ts_captions(_mgr.class_name, name))
			return;

		// закладка табов табличной части
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+cmd.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);

		wnd.elmnts.tabs['tab_'+name].attachTabular({obj: o, ts: name,  pwnd: wnd});

	}

	function save(action){

		wnd.progressOn();

		o.save()
			.then(function(){

				wnd.progressOff();
				wnd.modified = false;

				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();
				}
			})
			.catch(function(err){
				wnd.progressOff();
				$p.record_log(err);
			});
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(){

		if (wnd && wnd.elmnts && wnd.elmnts.vault)
			wnd.elmnts.vault.unload();

		if (wnd && wnd.elmnts && wnd.elmnts.vault_pop)
			wnd.elmnts.vault_pop.unload();

		_mgr = null;
		wnd = null;
	}

	function frm_close(win){

		setTimeout(frm_unload, 1);

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		return true;
	}

	return wnd;
};

/**
 * ### Форма объекта данных
 * По умолчанию, форма строится автоматически по описанию метаданных.<br />
 * Метод можно переопределить для конкретного менеджера
 *
 * @method form_obj
 * @for DataObj
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataObj.prototype.form_obj = function (pwnd, attr) {
	if(!attr)
		attr = {};
	attr.o = this;
	return this._manager.form_obj(pwnd, attr);
};