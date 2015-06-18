/**
 * Форма dat.GUI - визуализация и изменение параметров объекта<br />
 * &copy; http://www.oknosoft.ru 2009-2015
 * @module common
 * @submodule wnd_dat
 */

$p.iface.dat_gui = function(_dxw, attr) {

	dat.GUI.DEFAULT_WIDTH = '100%';

	var wnd_dat = $p.iface.dat_blank(_dxw, attr),
		gui = new dat.GUI({ autoPlace: false }),
		_updating = false;
	_dxw = null;

	wnd_dat.attachObject(gui.domElement);
	wnd_dat.setMinDimension(240, 280);

	gui.domElement.removeChild(gui.__closeButton);
	delete gui.__closeButton;

	if(attr.parked)
		wnd_dat.park();

	gui.wnd = wnd_dat;

	gui.clear = function(){

		function removeFolder(folder){

			for(var f in folder.__folders){
				removeFolder(folder.__folders[f]);
				delete folder.__folders[f];
			}

			while(folder.__controllers.length)
				folder.__controllers[0].remove();
			folder.__ul.parentNode.removeChild(folder.__ul);
		}

		for(var f in gui.__folders){
			removeFolder(gui.__folders[f]);
			delete gui.__folders[f];
		}

		while(gui.__controllers.length)
			gui.__controllers[0].remove();
	};

	gui.update = function() {
		for(var f in gui.__folders){
			gui.__folders[f].__controllers.forEach(function(c){
				c.updateDisplay();
			});
		}
		gui.__controllers.forEach(function(c){
			c.updateDisplay();
		});
		if(gui.after_update)
			gui.after_update();

		_updating = false;
	};

	gui.lazy_update = function() {
		if(!_updating){
			_updating = true;
			setTimeout(gui.update, 10);
		}
	};

	gui.first_obj = function (instance) {
		var c;
		for(var f in gui.__folders){
			for(var i in gui.__folders[f].__controllers){
				c = gui.__folders[f].__controllers[i];
				if(c.object instanceof instance){
					return c.object;
				}
			}
		}
		for(var i in gui.__controllers){
			c = gui.__controllers[i];
			if(c.object instanceof instance){
				return c.object;
			}
		}
	};

	gui.close = function () {
		gui.clear();
		wnd_dat.close();
		wnd_dat = null;
		gui = null;
	};

	gui.wnd_options = wnd_dat.wnd_options;

	return gui;
};

/**
 * Форма dat - шаблон окна инструментов
 */
$p.iface.dat_blank = function(_dxw, attr) {

	if(!attr)
		attr = {};

	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: attr.id || 'wnd_dat_' + dhx4.newId(),
		left: attr.left || 900,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});
	_dxw = null;

	if(!attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {};
	wnd_dat.modified = false;

	wnd_dat.wnd_options = function (options) {
		var pos = wnd_dat.getPosition(),
			sizes = wnd_dat.getDimension(),
			parked = wnd_dat.isParked();
		options.left = pos[0];
		options.top = pos[1];
		options.width = sizes[0];
		options.parked = parked;
		if(!parked)
			options.height = sizes[1];

	};

	wnd_dat.bottom_toolbar = function(oattr){

		var attr = ({
				wrapper: wnd_dat.cell,
				width: '100%',
				height: '28px',
				bottom: '0px',
				left: '0px',
				name: 'tb_bottom',
				buttons: [
					{name: 'btn_cancel', text: 'Отмена', title: 'Закрыть без сохранения', width:'60px', float: 'right'},
					{name: 'btn_ok', b: 'Ок', title: 'Применить изменения', width:'30px', float: 'right'}
				],
				onclick: function (name) {
					return false;
				}
			})._mixin(oattr),

			tb_bottom = new OTooolBar(attr),
			sbar = wnd_dat.attachStatusBar({height: 12});
		sbar.style.zIndex = -1000;
		sbar.firstChild.style.backgroundColor = "transparent";
		sbar.firstChild.style.border = "none";
		return tb_bottom;
	};

	if(attr.modal){
		if(attr.pwnd && attr.pwnd.setModal)
			attr.pwnd.setModal(0);
		wnd_dat.setModal(1);
	}

	return wnd_dat;
};

/**
 * Форма dat.tree - дерево с галочками
 */
$p.iface.dat_tree = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr),
		layout = document.createElement("div"),
		cell_a = document.createElement("div"),
		cell_b = document.createElement("div"),
		str_form = [
			{ type:"combo" , name:"cb_sys", label:"Система"  },
			{ type:"combo" , name:"cb_clr", label:"Цвет"  },
			{ type:"settings" , labelWidth:50, inputWidth:160, offsetLeft: 0, offsetTop: 0  }
		];

	_dxw = null;

	wnd_dat.setMinDimension(250, 300);
	wnd_dat.attachObject(layout);
	layout.appendChild(cell_a);
	layout.appendChild(cell_b);
	wnd_dat.cell_a = cell_a;

	wnd_dat.tree = new dhtmlXTreeObject(cell_b, "100%", "100%", 0);
	wnd_dat.tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	wnd_dat.tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	wnd_dat.tree.enableCheckBoxes(true, true);
	wnd_dat.tree.enableTreeImages(false);

	return wnd_dat;
};

/**
 * Форма dat.pgrid - таблица свойств
 */
$p.iface.dat_pgrid = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr);

	_dxw = null;

	wnd_dat.setMinDimension(320, 300);

	var pgrid = wnd_dat.elmnts.pgrid = wnd_dat.attachPropertyGrid();
	pgrid.setDateFormat("%d.%m.%Y %H:%i");
	pgrid.init();
	if(attr.grid_struct)
		pgrid.loadXMLString(
			attr.o._manager.get_property_grid_xml(attr.grid_struct, attr.v), function(){
				pgrid.enableAutoHeight(false);
				pgrid.setSizes();
				pgrid.setUserData("", "source",	{
					o: attr.v,
					grid: pgrid,
					on_select: $p.iface.pgrid_on_select,
					slist: attr.grid_slist,
					grid_on_change: attr.grid_on_change,
					wnd: wnd_dat
				});
				pgrid.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
				pgrid.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
			});

	return wnd_dat;
};

/**
 * обработчик выбора значения в свойствах (ссылочные типы)
 * вызывается в контексте this = pgrid
 * @param selv {*} выбранное значение
 */
$p.iface.pgrid_on_select = function(selv){

	if(selv===undefined)
		return;

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source"),
		f = pgrid.getSelectedRowId();

	if(source.o[f] != undefined){
		if(typeof source.o[f] == "number")
			source.o[f] = $p.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.is_data_obj(selv) ? selv.presentation : selv || "");

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change.call(pgrid, f, selv);
};

/**
 * обработчик изменения значения в свойствах (примитивные типы)
 * @param pname {String} - имя измененного свойства
 * @param new_value {*} - новое значение
 * @param old_value {*} - предыдущее значение
 */
$p.iface.pgrid_on_change = function(pname, new_value, old_value){
	if(pname)
		$p.iface.pgrid_on_select.call(this, new_value);
};

/**
 * обработчик изменения флажка в свойствах (bit)
 * @param rId {String} - идентификатор строки
 * @param cInd {Number} - идентификатор колонки
 * @param state {Boolean} - состояние чекбокса
 */
$p.iface.pgrid_on_checkbox = function(rId, cInd, state){

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source")

	if(source.o[rId] != undefined)
		source.o[rId] = state;

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};

/**
 * Рисует стандартную раскладку (XLayout) с деревом в левой части
 * @method layout_2u
 * @for InterfaceObjs
 * @param [tree_filteres] {String} - путь к файлу структуры дерева
 * @return {Object} - Псевдопромис
 */
$p.iface.layout_2u = function (tree_filteres) {

	var iface = $p.iface;

	iface.main = new dhtmlXLayoutObject({
		parent: document.body,
		pattern: "2U"
	});
	iface.main.attachEvent("onCollapse", function(name){
		if(name=="b"){
			iface.docs.expand();
			return false;
		}
	});
	iface.docs = iface.main.cells('b');

	iface.cell_tree = iface.main.cells('a');
	iface.cell_tree.setText('Режим');
	iface.cell_tree.setWidth('190');
	iface.cell_tree.fixSize(false, false);
	iface.cell_tree.collapse();

	iface.tree = iface.cell_tree.attachTree();
	iface.tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	iface.tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	iface.tree.attachEvent("onSelect", function(id){    // довешиваем обработчик на дерево

		var sv = iface.swith_view(id.split('.')[0]);

		if(sv == "oper"){		// открываем форму списка текущего метаданного

			var mgr = $p.md.mgr_by_class_name(id.substr(5));

			if(typeof iface.docs.close === "function" )
				iface.docs.close();

			if(mgr)
				mgr.form_list(iface.docs, {});

		}else if(sv == "def"){	// обновляем форму списка заказов
			setTimeout(function () {
				iface.grid_calc_order.reload(null, true);
			}, 200);
		}

	});
	
	if(tree_filteres){
		var fpromise = new Promise();
		iface.tree.loadXML(tree_filteres+'?v='+$p.job_prm.files_date, function(){

			this.tree_filteres = tree_filteres;
			fpromise.resolve(this);
		});
		return fpromise;
	}else
		return Promise.resolve(iface.tree);
};

/**
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param [onstep] {function} - обработчик визуализации шагов входа в систему. Если не указан, рисуется стандарное окно
 * @param [paths] {Object} - объект с путями к файлам метаданных и данных. Если не указан, файлы ищутся по стандартному пути /data/
 * @param resolve {function} - обработчик успешной авторизации и начальной загрузки данных
 * @param reject {function} - обработчик, который вызывается в случае ошибок на старте программы
 */
$p.iface.frm_auth = function (onstep, paths, resolve, reject) {

	var frm_auth = $p.iface.auth = $p.iface.docs.attachForm(), w;

	if(!onstep)
		onstep = function (step){

			var stepper = $p.eve.stepper;

			switch(step) {

				case $p.eve.steps.authorization:

					stepper.frm_sync.setItemValue("text_processed", "Авторизация");

					break;

				case $p.eve.steps.load_meta:

					// индикатор прогресса и малое всплывающее сообщение
					$p.iface.docs.progressOn();
					$p.msg.show_msg($p.msg.init_catalogues + $p.msg.init_catalogues_meta, $p.iface.docs);
					if(!$p.iface.sync)
						$p.iface.wnd_sync();
					$p.iface.sync.create(stepper);

					break;

				case $p.eve.steps.create_managers:

					stepper.frm_sync.setItemValue("text_processed", "Обработка метаданных");
					stepper.frm_sync.setItemValue("text_bottom", "Создаём объекты менеджеров данных...");

					break;

				case $p.eve.steps.process_access:

					break;

				case $p.eve.steps.load_data_files:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем файлы данных зоны...");

					break;

				case $p.eve.steps.load_data_db:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка изменений из 1С");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем изменённые справочники");

					break;

				case $p.eve.steps.load_data_wsql:

					break;

				case $p.eve.steps.save_data_wsql:

					stepper.frm_sync.setItemValue("text_processed", "Кеширование данных");
					stepper.frm_sync.setItemValue("text_bottom", "Сохраняем таблицы в локальном SQL...");

					break;

				default:

					break;
			}

		};

	function do_auth(login, password, is_guest){
		$p.ajax.username = login;
		$p.ajax.password = password;

		if(login){
			if(!is_guest)
				$p.wsql.set_user_param("user_name", login);					// сохраняем имя пользователя в базе
			if(!$p.is_guid($p.wsql.get_user_param("browser_uid")))
				$p.wsql.set_user_param("browser_uid", $p.generate_guid());	// проверяем guid браузера

			$p.eve.log_in(onstep, paths)
				.then(resolve)
				.catch(reject)
				.then(function (err) {
					if($p.iface.sync)
						$p.iface.sync.close();
					if($p.iface.docs){
						$p.iface.docs.progressOff();
						$p.iface.docs.hideHeader();
					}
					if($p.iface.cell_tree)
						$p.iface.cell_tree.expand();
				});

		} else
			this.validate();
	}

	// обработчик кнопки "войти" формы авторизации
	function auth_click(name){

		this.resetValidateCss();

		if(this.getCheckedValue("type") == "guest"){
			do_auth.call(this, this.getItemValue("guest"), "", true);
			$p.wsql.set_user_param("user_name", "");

		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

		}
	}

	// загружаем структуру
	frm_auth.loadStruct('data/form_auth.xml?v='+$p.job_prm.files_date, function(){

		// после готовности формы читаем пользователя из локальной датабазы
		if($p.wsql.get_user_param("user_name")){
			frm_auth.setItemValue("login", $p.wsql.get_user_param("user_name"));
			frm_auth.setItemValue("type", "auth");

			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				frm_auth.setItemValue("password", $p.wsql.get_user_param("user_pwd"));

				if($p.wsql.get_user_param("autologin"))
					auth_click();
			}
		}

		// позиционируем форму по центру
		if((w = ($p.iface.docs.getWidth() - 500)/2) >= 10)
			frm_auth.cont.style.paddingLeft = w.toFixed() + "px";
		else
			frm_auth.cont.style.paddingLeft = "20px";

	});

	// назначаем обработчик нажатия на кнопку
	frm_auth.attachEvent("onButtonClick", auth_click);

	frm_auth.attachEvent("onKeyDown",function(inp, ev, name, value){
		if(ev.keyCode == 13){
			if(name == "password" || this.getCheckedValue("type") == "guest"){
				auth_click.call(this);
			}
		}
	});


	$p.msg.show_msg($p.msg.init_login, $p.iface.docs);

};

/**
 * Служебная функция для открытия окна настроек из гиперссылки
 * @param e
 * @return {Boolean}
 */
$p.iface.open_settings = function (e) {
	(e || event).preventDefault();
	window.open(($p.job_prm.settings_url || 'order_dealer/options.html')+'?v='+$p.job_prm.files_date);
	return $p.cancel_bubble(e);
};

/**
 * Переключает вид формы между списком, календаарём и отчетами
 * @method swith_view
 * @for InterfaceObjs
 * @param name {String} - имя представления
 */
$p.iface.swith_view = function(name){

	var state,
		iface = $p.iface,

		/**
		 * Переключает состав элементов дерева
		 * @param view
		 */
		swith_tree = function(name){

			function compare_text(a, b) {
				if (a.text > b.text) return 1;
				if (a.text < b.text) return -1;
			}

			if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;

			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]}
				]}, mdn, md, tlist = meta_tree.item[0].item;
				// бежим по справочникам
				for(mdn in $p.cat){
					if(typeof $p.cat[mdn] == "function")
						continue;
					md = $p.cat[mdn].metadata();
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по документам
				tlist = meta_tree.item[1].item;
				for(mdn in $p.doc){
					if(typeof $p.doc[mdn] == "function")
						continue;
					md = $p.doc[mdn].metadata();
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				iface.tree.loadJSONObject(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				});

			}else{
				iface.tree.loadXML(iface.tree.tree_filteres+'?v='+$p.job_prm.files_date, function(){

				});

			}

			iface.tree._view = name;
		};

	if(iface.docs.getViewName() == name)
		return name;

	state = iface.docs.showView(name);
	if (state == true) {
		// first call, init corresponding components
		// календарь
		if(name=="cal" && !window.dhtmlXScheduler){
			$p.load_script("lib/dhtmlxscheduler.js", "script", function(){
				$p.load_script("lib/ext/dhtmlxscheduler_minical.js", "script");
				$p.load_script("lib/ext/dhtmlxscheduler_timeline.js", "script");
				$p.load_script("lib/ext/dhtmlxscheduler_locale_ru.js", "script", function(){
					//scheduler.config.xml_date="%Y-%m-%d %H:%i";
					scheduler.config.first_hour = 8;
					scheduler.config.last_hour = 22;
					iface.docs.scheduler = iface.docs.attachScheduler(new Date("2015-03-20"), "week", "scheduler_here");
					iface.docs.scheduler.attachEvent("onBeforeViewChange", function(old_mode, old_date, mode, date){
						if(mode == "timeline"){
							$p.msg.show_not_implemented();
							return false;
						}
						return true;
					});
				});
			});

			$p.load_script("lib/dhtmlxscheduler.css", "link");

			//}else if(name=="rep"){
			//	// подключаемый отчет
			//
			//}else if(name=="oper"){
			//	// в дереве - список метаданных, в окне - список текущего метаданного
			//

		}
	}

	swith_tree(name);

	if(name == "def")
		iface.main.showStatusBar();
	else
		iface.main.hideStatusBar();
};


/**
 * Панель инструментов рисовалки и альтернативная панель инструментов прочих форм
 * @class OTooolBar
 * @param attr {Object} - параметры создаваемой панели - родитель, положение, размер и ориентация
 * @constructor
 */
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

	/**
	 * Всплывающие подсказки
	 * @type {dhtmlXPopup}
	 */
	if(!$p.iface.popup)
		$p.iface.popup = new dhtmlXPopup();

	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path + 'custom_field/';

	div.className = 'wb-tools';
	_this.cell = div;

	_this.buttons = {};

	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				btn.classList.remove('selected');
		}
		if(select && !this.classList.contains('selected'))
			this.classList.add('selected');
	}

	/**
	 * Добавляет кнопку
	 * @param battr
	 */
	this.add = function(battr){

		var bdiv = $p.iface.add_button(div, attr, battr);

		dhtmlxEvent(bdiv, "click", function(){
			var tool_name = this.name.replace(attr.name + '_', '');
			if(attr.onclick)
				attr.onclick.call(_this, tool_name);
		});

		dhtmlxEvent(bdiv, "mouseover", function(){
			if(battr.title){
				popup_focused = true;
				$p.iface.popup.attachHTML(battr.title);
				if(!battr.sub)
					$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);
			}
		});

		dhtmlxEvent(bdiv, "mouseout", function () {
			popup_focused = false;
			setTimeout(function () {
				if(!popup_focused)
					$p.iface.popup.hide();
			}, 300);

		});

		_this.buttons[battr.name] = bdiv;

		if(battr.sub){

			function remove_sub(){
				if(bdiv.subdiv && !sub_focused && !btn_focused){
					while(bdiv.subdiv.firstChild)
						bdiv.subdiv.removeChild(bdiv.subdiv.firstChild);
					bdiv.subdiv.parentNode.removeChild(bdiv.subdiv);
					bdiv.subdiv = null;
				}
			}

			bdiv.onmouseover = function(){

				btn_focused = true;

				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'wb-tools';
					offset = $p.get_offset(bdiv);
					this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = '198px';
					this.subdiv.style.width = '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = bdiv.onclick;
					}
					attr.wrapper.appendChild(this.subdiv);

					this.subdiv.onmouseover = function () {
						sub_focused = true;
					};

					this.subdiv.onmouseout = function () {
						sub_focused = false;
						setTimeout(remove_sub, 500);
					};

					if(battr.title)
						$p.iface.popup.show(dhx4.absLeft(this.subdiv), dhx4.absTop(this.subdiv), this.subdiv.offsetWidth, this.subdiv.offsetHeight);
				}

			};

			bdiv.onmouseout = function(){
				btn_focused = false;
				setTimeout(remove_sub, 500);
			}
		}
	};

	/**
	 * Выделяет активную кнопку
	 * @param name
	 */
	this.select = function(name){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.name == attr.name + '_' + name){
				bselect.call(btn, true);
				return;
			}
		}
	};

	this.unload = function(){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		attr.wrapper.removeChild(div);
	};


	attr.wrapper.appendChild(div);
	div.style.width = attr.width || '28px';
	div.style.height = attr.height || '150px';
	div.style.position = 'absolute';
	if(attr.top)
		div.style.top = attr.top;
	if(attr.left)
		div.style.left = attr.left;
	if(attr.bottom)
		div.style.bottom = attr.bottom;
	if(attr.right)
		div.style.right = attr.right;

	if(attr.buttons)
		attr.buttons.forEach(function(battr){
			_this.add(battr);
		});

};
$p.iface.OTooolBar = OTooolBar;

/**
 * Добавляет кнопку на панель инструментов
 * @method add_button
 * @for InterfaceObjs
 * @param parent {Element}
 * @param attr {Object}
 * @param battr {Object}
 * @returns {Element}
 */
$p.iface.add_button = function(parent, attr, battr) {
	var bdiv = document.createElement('div'), html = '';
	bdiv.name = (attr ? attr.name + '_' : '') + battr.name;
	parent.appendChild(bdiv);
	bdiv.className = 'wb-button';
	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	bdiv.innerHTML = html;

	if(battr.float)
		bdiv.style.float = battr.float;
	if(battr.clear)
		bdiv.style.clear = battr.clear;
	if(battr.width)
		bdiv.style.width = battr.width;
	return bdiv;
};



