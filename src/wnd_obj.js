/**
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, отчетов и обработок
 *
 * &copy; http://www.oknosoft.ru 2014-2016
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
 * @param attr {Object|DataObj|String} - параметры инициализации формы
 */
DataManager.prototype.form_obj = function(pwnd, attr){

	var _mgr = this,
		_meta = _mgr.metadata(),
		o = attr.o,
		wnd, options, created, create_id, _title;

	/**
	 * ПриСозданииНаСервере - инициализация при создании формы, до чтения объекта
	 */
	function frm_create(){

		if(created)
			return;

		// создаём и настраиваем окно формы
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {
			// форма объекта приклеена к области контента или другой форме
			if(typeof pwnd.close == "function")
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;
				if(_wnd){

					// выгружаем попапы
					if(_wnd.elmnts)
						["vault", "vault_pop"].forEach(function (elm) {
							if (_wnd.elmnts[elm])
								_wnd.elmnts[elm].unload();
						});

					// информируем мир о закрытии формы
					if(_mgr && _mgr.class_name)
						dhx4.callEvent("frm_close", [_mgr.class_name, o ? o.ref : ""]);

					_wnd.detachToolbar();
					_wnd.detachStatusBar();
					if(_wnd.conf)
						_wnd.conf.unloading = true;
					_wnd.detachObject(true);
				}
				frm_unload(on_create);
			};
			wnd.elmnts = {grids: {}};

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
					caption: (_meta.obj_presentation || _meta.synonym)
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

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_obj.xml"], function(){

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd)
				this.cont.style.top = "4px";

			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

			// TODO: учитывать права для каждой роли на каждый объект
			if(_mgr instanceof DocManager && $p.ajax.root){
				this.enableItem("btn_post");
				this.enableItem("btn_unpost");
			}else{
				this.hideItem("btn_post");
				this.hideItem("btn_unpost");
			}
			if(!$p.ajax.root){
				this.hideItem("btn_save_close");
				this.disableItem("btn_save");
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

			// кнопка закрытия для приклеенной формы
			if(wnd != pwnd){
				this.hideItem("btn_close");
			}

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

		created = true;
	}

	/**
	 * Обновляет текст заголовка формы
	 */
	function set_text() {
		if(attr.set_text || wnd.setText){
			//var title = (_meta.obj_presentation || _meta.synonym) + ': ' + o.presentation;
			var title = o.presentation;

			if(o._modified && title.lastIndexOf("*")!=title.length-1)
				title += " *";

			else if(!o._modified && title.lastIndexOf("*")==title.length-1)
				title = title.replace(" *", "");

			if(_title !== title){
				_title !== title;
				if(attr.set_text)
					attr.set_text(title);
				else
					wnd.setText(title);
			}
		}
	}

	/**
	 * Наблюдатель за изменением объекта
	 * Пока здесь только установка заголовка формы
	 * @param changes
	 */
	function observer(changes) {
		if(o)
			set_text();
	}

	/**
	 * ПриЧтенииНаСервере - инициализация при чтении объекта
	 */
	function frm_fill(){

		if(!created){
			clearTimeout(create_id);
			frm_create();
		}

		/**
		 * Устанавливаем текст заголовка формы
		 */
		set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();

		/**
		 * закладки табличных частей
		 */
		if(attr.draw_tabular_sections)
			attr.draw_tabular_sections(o, wnd, tabular_init);

		else if(!o.is_folder){
			if(_meta.form && _meta.form.obj && _meta.form.obj.tabular_sections_order)
				_meta.form.obj.tabular_sections_order.forEach(function (ts) {
					tabular_init(ts);
				});

			else
				for(var ts in _meta.tabular_sections){
					if(ts==="extra_fields")
						continue;

					if(o[ts] instanceof TabularSection){
						// настройка табличной части
						tabular_init(ts);
					}
				}
		}

		/**
		 *	закладка шапка
		 */
		if(attr.draw_pg_header)
			attr.draw_pg_header(o, wnd);
		else{
			wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({
				obj: o,
				pwnd: wnd,
				read_only: !$p.ajax.root    // TODO: учитывать права для каждой роли на каждый объект
			});
			wnd.attachEvent("onResizeFinish", function(win){
				wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
			});
		}

		/**
		 * начинаем следить за объектом
		 */
		Object.observe(o, observer, ["update", "row"]);


		return {wnd: wnd, o: o};

	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_close")
			wnd.close();

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

			var rattr = {};
			$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
			rattr.url += _mgr.rest_name + "(guid'" + o.ref + "')/Files?$format=json";

			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				uploadUrl:  rattr.url,
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
	 * настройка (инициализация) табличной части
	 */
	function tabular_init(name, toolbar_struct){

		// с помощью метода ts_captions(), выясняем, надо ли добавлять данную ТЧ и формируем описание колонок табчасти
		if(!_md.ts_captions(_mgr.class_name, name))
			return;

		// закладка табов табличной части
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+_meta.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);

		wnd.elmnts.grids[name] = wnd.elmnts.tabs['tab_'+name].attachTabular({
			obj: o,
			ts: name,
			pwnd: wnd,
			read_only: !$p.ajax.root,
			toolbar_struct: toolbar_struct
		});

	}

	function save(action){

		wnd.progressOn();

		o.save()
			.then(function(){

				wnd.progressOff();

				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();
					
				}else
					set_text();
			})
			.catch(function(err){
				wnd.progressOff();
				$p.record_log(err);
			});
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			delete wnd.ref;
			Object.unobserve(o, observer);
			_mgr = wnd = o = _meta = options = pwnd = attr = null;
		}
	}

	function frm_close(win){

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		setTimeout(frm_unload);

		// выгружаем попапы
		if(wnd && wnd.elmnts)
			["vault", "vault_pop"].forEach(function (elm) {
				if (wnd.elmnts[elm])
					wnd.elmnts[elm].unload();
			});

		// информируем мир о закрытии формы
		if(_mgr && _mgr.class_name)
			dhx4.callEvent("frm_close", [_mgr.class_name, o ? o.ref : ""]);

		return true;
	}

	// (пере)создаём статическую часть формы
	create_id = setTimeout(frm_create);

	// читаем объект из локального SQL или получаем с сервера
	if($p.is_data_obj(o)){
		if(o.is_new() && attr.on_select)
			return _mgr.create({}, true)
				.then(function (tObj) {
					o = tObj;
					tObj = null;
					return frm_fill();
				});
		else if(o.is_new() && !o.empty()){
			return o.load()
				.then(frm_fill);
		}else
			return Promise.resolve(frm_fill());
	}else{

		pwnd.progressOn();

		return _mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				pwnd.progressOff();
				return frm_fill();
			})
			.catch(function (err) {
				pwnd.progressOff();
				wnd.close();
				$p.record_log(err);
			});
	}

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