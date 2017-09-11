/**
 * Форма абстрактного отчета {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module wnd_rep
 *
 * Created 03.08.2016
 */

DataProcessorsManager.prototype.form_rep = function(pwnd, attr) {

	var _mgr = this,
		_meta = _mgr.metadata(),
		wnd, options, _title, close_confirmed;

	if(!attr)
		attr = {};
	if(!attr.date_from)
		attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
	if(!attr.date_till)
		attr.date_till = new Date((new Date()).getFullYear().toFixed() + "-12-31");

	/**
	 * ПриСозданииНаСервере - инициализация при создании формы, до чтения объекта
	 */
	function frm_create(){


		// создаём и настраиваем окно формы
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {

			// если вернулись на ту же самую закладку, ничего делать не надо
			if(wnd == pwnd && wnd._mgr == _mgr)
				return;

			// форма объекта приклеена к области контента или другой форме
			if(typeof pwnd.close == "function")
				pwnd.close(true);

			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;

				if(on_create){

					if(_wnd){

						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);

				}
			};
			wnd.elmnts = {grids: {}};

		}else{
			// форма в модальном диалоге
			options = {
				name: 'wnd_rep_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
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

		// указатели на объект и менеджер
		wnd._mgr = _mgr;
		wnd.report = _mgr.create();


		if(!wnd.set_text)
			wnd.__define({

				/**
				 * Обновляет текст заголовка формы
				 */
				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){

							var title = (_meta.obj_presentation || _meta.synonym);

							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					configurable: true
				}
			});

		/**
		 *	Разбивка на отчет и параметры
		 */
		wnd.elmnts.layout = wnd.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Отчет",
				header: false
			}, {
				id: "b",
				text: "Параметры",
				collapsed_text: "Параметры",
				width: 220

			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_rep.xml"], function(){

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			// if(wnd === pwnd)
			// 	this.cont.style.top = "4px";

			this.addSpacer("btn_run");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

		});

		// устанавливаем текст заголовка формы
		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();

		// создаём HandsontableDocument
		wnd.elmnts.table = new $p.HandsontableDocument(wnd.elmnts.layout.cells("a"),
			{allow_offline: wnd.report.allow_offline, autorun: false})
			.then(function (rep) {
				if(!rep._online)
					return wnd.elmnts.table = null;
			});

		// контейнер для элементов параметров отчета
		wnd.elmnts.frm_prm = document.createElement("DIV");
		wnd.elmnts.frm_prm.style = "height: 100%; min-height: 300px; width: 100%";
		wnd.elmnts.layout.cells("b").attachObject(wnd.elmnts.frm_prm);

		// daterangepicker
		wnd.report.daterange = new $p.iface.ODateRangePicker(wnd.elmnts.frm_prm, attr);

	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		if(btn_id=="btn_close"){
			wnd.close();

		}else if(btn_id=="btn_run"){
			wnd.report.build().then(show).catch(show);

		}else if(btn_id=="btn_print"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_save"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_load"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_export"){
			//_mgr.export({items: [wnd.report], pwnd: wnd, obj: true} );
		}

	}

	/**
	 * показывает отчет или ошибку (если data instanceof error)
	 */
	function show(data) {
		wnd.elmnts.table.requery(data);
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create){
      attr.on_close();
    }

		if(!on_create && wnd){

		  delete wnd.set_text;

			// уничтожаем табличный документ
			if(wnd.elmnts.table){
        wnd.elmnts.table.hot.destroy();
      }

			// уничтожаем daterangepicker
			if(wnd.report.daterange){
        wnd.report.daterange.remove();
      }

			wnd.report = null;

			_mgr = wnd = _meta = options = pwnd = attr = null;
		}
	}

	frm_create();

	return wnd;

};
