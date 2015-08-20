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

	// TODO: реализовать undock для аккордиона

	if(!attr)
		attr = {};
	var wnd_dat, _modified = false, wid = attr.id || 'wnd_dat_' + dhx4.newId();

	wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: wid,
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

	if(typeof attr.on_close == "function")
		wnd_dat.attachEvent("onClose", attr.on_close);

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.iface.bind_help(wnd_dat, attr.help_path);


	wnd_dat.elmnts = {};
	wnd_dat._define("modified", {
		get: function () {
			return _modified;
		},
		set: function (v) {
			_modified = v;
			var title = wnd_dat.getText();
			if(_modified && title.lastIndexOf("*")!=title.length-1)
				wnd_dat.setText(title + " *");
			else if(!_modified && title.lastIndexOf("*")==title.length-1)
				wnd_dat.setText(title.replace(" *", ""));
		},
		enumerable: false,
		configurable: false
	});

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
		source = pgrid.getUserData("", "source");

	if(source.o[rId] != undefined)
		source.o[rId] = state;

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};


function _clear_all(){
	$p.iface.docs._define({
		clear_all: {
			value: function () {
				this.detachToolbar();
				this.detachStatusBar();
				this.detachObject(true);
			},
			enumerable: false
		},
		"Очистить": {
			get: function () {
				return this.clear_all;
			},
			enumerable: false
		},
		"Контейнер": {
			get: function () {
				return this.cell.querySelector(".dhx_cell_cont_layout");
			},
			enumerable: false
		}
	});
}

/**
 * Рисует стандартную раскладку (XLayout) с деревом в левой части
 * @method layout_2u
 * @for InterfaceObjs
 * @param [tree_attr] {String} - путь к файлу структуры дерева
 * @return {Object} - Псевдопромис
 */
$p.iface.layout_2u = function (tree_attr) {

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
	_clear_all();

	iface.cell_tree = iface.main.cells('a');
	iface.cell_tree.setText('Режим');
	iface.cell_tree.setWidth('190');
	iface.cell_tree.fixSize(false, false);
	iface.cell_tree.collapse();

	iface.tree = iface.cell_tree.attachTree();
	iface.tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	iface.tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');

	
	if(tree_attr){

		// довешиваем обработчик на дерево
		iface.tree.attachEvent("onSelect", tree_attr.onselect);

		return new Promise(function(resolve, reject) {
			iface.tree.loadXML(tree_attr.path+'?v='+$p.job_prm.files_date, function(){
				this.tree_filteres = tree_attr.path;
				resolve(this);
			});
		});

	}else{
		iface.tree.attachEvent("onSelect", function(id){    // довешиваем обработчик на дерево

			var parts = id.split('.');

			if(parts.length > 1){

				if(iface.swith_view(parts[0]) == "oper"){		// открываем форму списка текущего метаданного

					var mgr = $p.md.mgr_by_class_name(id.substr(5));

					if(typeof iface.docs.close === "function" )
						iface.docs.close();

					if(mgr)
						mgr.form_list(iface.docs, {});

				}
			}
		});
		return Promise.resolve(iface.tree);
	}

};

/**
 * Рисует стандартную раскладку (XLayout) с единственной областью во весь экран.
 * В созданной области, как правило, размещают форму списка основного документа
 * @method layout_1c
 * @for InterfaceObjs
 * @return {Promise.<boolean>}
 */
$p.iface.layout_1c = function () {

	var iface = $p.iface;

	return new Promise(function(resolve, reject) {
		try{
			iface.main = new dhtmlXLayoutObject({
				parent: document.body,
				pattern: "1C",
				offsets: {top: 4, right: 4, bottom: 4, left: 4}
			});
			iface.docs = iface.main.cells('a');
			_clear_all();
			resolve(true);
		}catch(err){
			reject(err);
		}
	});
};

/**
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param [onstep] {function} - обработчик визуализации шагов входа в систему. Если не указан, рисуется стандарное окно
 * @param resolve {function} - обработчик успешной авторизации и начальной загрузки данных
 * @param reject {function} - обработчик, который вызывается в случае ошибок на старте программы
 * @param [on_draw_auth] {function} - обработчик, который вызывается после отрисовки формы
 */
$p.iface.frm_auth = function (onstep, resolve, reject, on_draw_auth) {

	var frm_auth = $p.iface.auth = $p.iface.docs.attachForm(),
		w, were_errors, auth_struct;

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

			$p.eve.log_in(onstep)
				.then(frm_auth.on_auth || resolve)
				.catch(function (err) {
					were_errors = true;
					if(frm_auth.on_error || reject)
						(frm_auth.on_error || reject)(err);
				})
				.then(function (err) {
					if($p.iface.sync)
						$p.iface.sync.close();
					if($p.iface.docs){
						$p.iface.docs.progressOff();
						if(!were_errors)
							$p.iface.docs.hideHeader();
					}
					if($p.iface.cell_tree && !were_errors)
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
	auth_struct = require("form_auth").replace(/\/imgs\//g, dhtmlx.image_path);
	frm_auth.loadStruct(auth_struct, function(){

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

		setTimeout(on_draw_auth);
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

	frm_auth.onerror = function (err) {

		$p.ajax.authorized = false;

		var emsg = err.message.toLowerCase();

		if(emsg.indexOf("auth") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_auth
			});
			frm_auth.setItemValue("password", "");
			frm_auth.validate();

		}else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_network
			});
		}
	}

};

/**
 * Служебная функция для открытия окна настроек из гиперссылки
 * @param e
 * @return {Boolean}
 */
$p.iface.open_settings = function (e) {
	var evt = (e || (typeof event != "undefined" ? event : undefined));
	if(evt)
		evt.preventDefault();
	window.open(($p.job_prm.settings_url || 'order_dealer/options.html')+'?v='+$p.job_prm.files_date);
	return $p.cancel_bubble(evt);
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

			if(!iface.tree){

				var hprm = $p.job_prm.parse_url();
				if(hprm.obj) {
					var parts = hprm.obj.split('.');
					if(parts.length > 1){

						var mgr = $p.md.mgr_by_class_name(hprm.obj);

						if(typeof iface.docs.close === "function" )
							iface.docs.close();

						if(mgr)
							mgr.form_list(iface.docs, {});
					}
				}
				return;

			}else if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;

			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]},
					{id:"oper_cch", text: $p.msg.meta_cch, item:[]},
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]}
				]}, mdn, md,

				// бежим по справочникам
					tlist = meta_tree.item[0].item;
				for(mdn in _cat){
					if(typeof _cat[mdn] == "function")
						continue;
					md = _cat[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по документам
				tlist = meta_tree.item[1].item;
				for(mdn in _doc){
					if(typeof _doc[mdn] == "function")
						continue;
					md = _doc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам видов характеристик
				tlist = meta_tree.item[2].item;
				for(mdn in _cch){
					if(typeof _cch[mdn] == "function")
						continue;
					md = _cch[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам счетов
				tlist = meta_tree.item[3].item;
				for(mdn in _cacc){
					if(typeof _cacc[mdn] == "function")
						continue;
					md = _cacc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
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

	if(name.indexOf(iface.docs.getViewName())==0)
		return iface.docs.getViewName();

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
 * ### Визуальный компонент OTooolBar
 * Панель инструментов рисовалки и альтернативная панель инструментов прочих форм
 * - Гибкое управление размером, положением и выравниванием как самой панели, так и отдельных кнопок
 * - Кнопки и группы кнопок, иконы и текст
 * - Всплывающие подсказки с произвольным html
 *
 * @class OTooolBar
 * @param attr {Object} - параметры создаваемой панели - родитель, положение, размер и ориентация
 * @constructor
 */
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

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

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}

	function btn_click(){
		var tool_name = this.name.replace(attr.name + '_', '');
		if(attr.onclick)
			attr.onclick.call(_this, tool_name);
	}

	/**
	 * Добавляет кнопку на панель инструментов
	 * @method add
	 * @param battr {Object} - атрибуты создаваемой кнопки
	 */
	this.add = function(battr){

		var bdiv = $p.iface.add_button(div, attr, battr);

		bdiv.onclick = btn_click;

		bdiv.onmouseover = function(){
			if(battr.title && !battr.sub){
				popup_focused = true;

				$p.iface.popup.clear();
				$p.iface.popup.attachHTML(battr.title);
				$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);

				$p.iface.popup.p.onmouseover = function(){
					popup_focused = true;
				};

				$p.iface.popup.p.onmouseout = popup_hide;
			}
		};

		bdiv.onmouseout = popup_hide;

		_this.buttons[battr.name] = bdiv;

		if(battr.sub){

			function remove_sub(parent){
				if(!parent)
					parent = bdiv;
				if(parent.subdiv && !sub_focused && !btn_focused){
					while(parent.subdiv.firstChild)
						parent.subdiv.removeChild(parent.subdiv.firstChild);
					parent.subdiv.parentNode.removeChild(parent.subdiv);
					parent.subdiv = null;
				}
			}

			bdiv.onmouseover = function(){

				// нужно погасить сабдивы соседей
				for(var i=0; i<bdiv.parentNode.children.length; i++){
					if(bdiv.parentNode.children[i] != bdiv && bdiv.parentNode.children[i].subdiv){
						remove_sub(bdiv.parentNode.children[i]);
						break;
					}
				}

				btn_focused = true;

				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'wb-tools';
					offset = $p.iface.get_offset(bdiv);
					if(battr.sub.align == 'right')
						this.subdiv.style.left = (offset.left + bdiv.offsetWidth - (parseInt(battr.sub.width.replace(/\D+/g,"")) || 56)) + 'px';
					else
						this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = battr.sub.height || '198px';
					this.subdiv.style.width = battr.sub.width || '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = btn_click;
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
	 * Выделяет кнопку по событию mouseover и снимает выделение с остальных кнопок
	 * @method select
	 * @param name {String} - имя текущей кнопки
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

	/**
	 * Деструктор объекта
	 * @method unload
	 */
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



