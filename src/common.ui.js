/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule common.ui
 */


/**
 * Описание структуры колонки формы списка
 * @class Col_struct
 * @param id
 * @param width
 * @param type
 * @param align
 * @param sort
 * @param caption
 * @constructor
 */
function Col_struct(id,width,type,align,sort,caption){
	this.id = id;
	this.width = width;
	this.type = type;
	this.align = align;
	this.sort = sort;
	this.caption = caption;
}

/**
 * ### Объекты интерфейса пользователя
 * @class InterfaceObjs
 * @static
 * @menuorder 40
 * @tooltip Контекст UI
 */
function InterfaceObjs(){

	var iface = this;

	/**
	 * Очищает область (например, удаляет из div все дочерние элементы)
	 * @method clear_svgs
	 * @param area {HTMLElement|String}
	 */
	this.clear_svgs = function(area){
		if(typeof area === "string")
			area = document.getElementById(area);
		while (area.firstChild)
			area.removeChild(area.firstChild);
	};

	/**
	 * Возвращает координату левого верхнего угла элемента относительно документа
	 * @method get_offset
	 * @param elm {HTMLElement} - элемент, координату которого, необходимо определить
	 * @return {Object} - {left: number, top: number}
	 */
	this.get_offset = function(elm) {
		var offset = {left: 0, top:0};
		if (elm.offsetParent) {
			do {
				offset.left += elm.offsetLeft;
				offset.top += elm.offsetTop;
			} while (elm = elm.offsetParent);
		}
		return offset;
	};

	/**
	 * Заменяет в строке критичные для xml символы
	 * @method normalize_xml
	 * @param str {string} - исходная строка, в которой надо замаскировать символы
	 * @return {XML|string}
	 */
	this.normalize_xml = function(str){
		if(!str) return "";
		var entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, function (s) {return entities[s];});
	};

	/**
	 * Масштабирует svg
	 * @method scale_svg
	 * @param svg_current {String} - исходная строка svg
	 * @param size {Number|Object} - требуемый размер картинки
	 * @param padding {Number} - отступ от границы viewBox
	 * @return {String} - отмасштабированная строка svg
	 */
	this.scale_svg = function(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};

		var height = typeof size == "number" ? size : size.height,
			width = typeof size == "number" ? (size * 1.5).round(0) : size.width,
			max_zoom = typeof size == "number" ? Infinity : (size.zoom || Infinity);

		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);

		// получаем w, h и формируем viewBox="0 0 400 100"
		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if("width,height,x,y".indexOf(svg_current[0]) != -1){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}

		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="' + (svg_j.x || 0) + ' ' + (svg_j.y || 0) + ' ' + (svg_j.width - padding) + ' ' + (svg_j.height - padding) + '"';
		}

		var init_height = svg_j.height,
			init_width = svg_j.width;

		k = (height - padding) / init_height;
		svg_j.height = height;
		svg_j.width = (init_width * k).round(0);

		if(svg_j.width > width){
			k = (width - padding) / init_width;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = width;
		}

		if(k > max_zoom){
			k = max_zoom;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = (init_width * k).round(0);
		}

		svg_j.x = (svg_j.x * k).round(0);
		svg_j.y = (svg_j.y * k).round(0);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ' +
			'width="' + svg_j.width + '" ' +
			'height="' + svg_j.height + '" ' +
			'x="' + svg_j.x + '" ' +
			'y="' + svg_j.y + '" ' +
			'xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
	};

	/**
	 * Добавляет в форму функциональность вызова справки
	 * @method bind_help
	 * @param wnd {dhtmlXWindowsCell}
	 * @param [path] {String} - url справки
	 */
	this.bind_help = function (wnd, path) {

		function frm_help(win){
			if(!win.help_path){
				$p.msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: $p.msg.not_implemented
				});
				return;
			}
		}

		if(wnd instanceof dhtmlXCellObject) {
			// TODO реализовать кнопку справки для приклеенной формы
		}else{
			if(!wnd.help_path && path)
				wnd.help_path = path;

			wnd.button('help').show();
			wnd.button('help').enable();
			wnd.attachEvent("onHelp", frm_help);
		}

	};

	/**
	 * Устанавливает hash url для сохранения истории и последующей навигации
	 * @method set_hash
	 * @param [obj] {String|Object} - имя класса или объект со свойствами к установке в хеш адреса
	 * @param [ref] {String} - ссылка объекта
	 * @param [frm] {String} - имя формы объекта
	 * @param [view] {String} - имя представления главной формы
	 */
	this.set_hash = function (obj, ref, frm, view ) {

		var ext = {},
			hprm = $p.job_prm.parse_url();

		if(arguments.length == 1 && typeof obj == "object"){
			ext = obj;
			if(ext.hasOwnProperty("obj")){
				obj = ext.obj;
				delete ext.obj;
			}
			if(ext.hasOwnProperty("ref")){
				ref = ext.ref;
				delete ext.ref;
			}
			if(ext.hasOwnProperty("frm")){
				frm = ext.frm;
				delete ext.frm;
			}
			if(ext.hasOwnProperty("view")){
				view = ext.view;
				delete ext.view;
			}
		}

		if(obj === undefined)
			obj = hprm.obj || "";
		if(ref === undefined)
			ref = hprm.ref || "";
		if(frm === undefined)
			frm = hprm.frm || "";
		if(view === undefined)
			view = hprm.view || "";

		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;
		for(var key in ext){
			hash += "&" + key + "=" + ext[key];
		}

		if(location.hash.substr(1) == hash)
			iface.hash_route();
		else
			location.hash = hash;
	};

	/**
	 * Выполняет навигацию при изменении хеша url
	 * @method hash_route
	 * @param event {HashChangeEvent}
	 * @return {Boolean}
	 */
	this.hash_route = function (event) {

		var hprm = $p.job_prm.parse_url(),
			res = $p.eve.callEvent("hash_route", [hprm]),
			mgr;

		if((res !== false) && (!iface.before_route || iface.before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					// если задана ссылка, открываем форму объекта
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"](iface.docs, hprm.ref)

				}else if(hprm.view && iface.swith_view){
					// если задано имя представления, переключаем главную форму
					iface.swith_view(hprm.view);

				}

			}
		}

		if(event)
			return iface.cancel_bubble(event);
	};

	/**
	 * Запрещает всплывание события
	 * @param e {MouseEvent|KeyboardEvent}
	 * @returns {Boolean}
	 */
	this.cancel_bubble = function(e) {
		var evt = (e || event);
		if (evt && evt.stopPropagation)
			evt.stopPropagation();
		if (evt && !evt.cancelBubble)
			evt.cancelBubble = true;
		return false
	};

	/**
	 * Конструктор описания колонки динамического списка
	 * @type {Col_struct}
	 * @constructor
	 */
	this.Col_struct = Col_struct;

	/**
	 *
	 * @param items {Array} - закладки сайдбара
	 * @param buttons {Array} - кнопки дополнительной навигации
	 * @param [icons_path] {String} - путь к иконам сайдбара
	 */
	this.init_sidebar = function (items, buttons, icons_path) {

		// наблюдатель за событиями авторизации и синхронизации
		iface.btn_auth_sync = new iface.OBtnAuthSync();

		// кнопки навигации справа сверху
		iface.btns_nav = function (wrapper) {
			return iface.btn_auth_sync.bind(new iface.OTooolBar({
				wrapper: wrapper,
				class_name: 'md_otbnav',
				width: '260px', height: '28px', top: '3px', right: '3px', name: 'right',
				buttons: buttons,
				onclick: function (name) {
					iface.main.cells(name).setActive(true);
					return false;
				}
			}))
		};

		// основной сайдбар
		iface.main = new dhtmlXSideBar({
			parent: document.body,
			icons_path: icons_path || "dist/imgs/",
			width: 180,
			header: true,
			template: "tiles",
			autohide: true,
			items: items,
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});

		// подписываемся на событие навигации по сайдбару
		iface.main.attachEvent("onSelect", function(id){

			var hprm = $p.job_prm.parse_url();
			if(hprm.view != id)
				iface.set_hash(hprm.obj, hprm.ref, hprm.frm, id);

			iface["view_" + id](iface.main.cells(id));

		});

		// включаем индикатор загрузки
		iface.main.progressOn();

		// активируем страницу
		hprm = $p.job_prm.parse_url();
		if(!hprm.view || iface.main.getAllItems().indexOf(hprm.view) == -1){
			iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "doc");
		} else
			setTimeout(iface.hash_route);
	};

	/**
	 * ### Страница "Все объекты"
	 * похожа на подменю "все функции" тонкого клиента 1С
	 *
	 * @class All_meta_objs
	 * @param cont {dhtmlXCellObject} - контейнер для размещения страницы
	 * @param [classes] {Array} - список классов. Если параметр пропущен, будут показаны все классы метаданных
	 * @param [frm_attr] {Object} - дополнительные настройки, которые будут переданы создаваемым формам списка
	 * @constructor
	 */
	function All_meta_objs(cont, classes, frm_attr) {

		this.layout = cont.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Разделы",
				collapsed_text: "Разделы",
				width: 220
			}, {
				id: "b",
				text: "Раздел",
				header: false
			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		// дерево используемых метаданных
		this.tree = this.layout.cells("a").attachTreeView();
		this.tree.attachEvent("onSelect", function (name, mode) {
			if(!mode)
				return;
			var mgr = $p.md.mgr_by_class_name(name);
			if(mgr instanceof DataProcessorsManager){
				// для отчетов и обработок используем форму отчета
				mgr.form_rep(this.layout.cells("b"), frm_attr || {hide_header: true});

			}else if(mgr){
				// для остальных объектов показываем форму списка
				mgr.form_list(this.layout.cells("b"), frm_attr || {hide_header: true});
			}

		}.bind(this));


		if(!classes){
			var md_classes = $p.md.get_classes();
			classes = [];
			for(var cl in md_classes){
				if(md_classes[cl].length)
					classes.push(cl);
			}
		}

		// если тип объектов только один, скрываем иерархию
		if(classes.length == 1){
			$p.md.get_classes()[classes[0]].forEach(function (name) {
				var key = classes[0]+"."+name,
					meta = $p.md.get(key);
				if(!meta.hide){
					this.tree.addItem(key, meta.list_presentation || meta.synonym);
					this.tree.setItemIcons(key, {file: "icon_1c_"+classes[0]});
				}
			}.bind(this));

		}else{
			classes.forEach(function (id) {
				this.tree.addItem(id, $p.msg["meta_"+id]);
				this.tree.setItemIcons(id, {file: "icon_1c_"+id, folder_opened: "icon_1c_"+id, folder_closed: "icon_1c_"+id});
				$p.md.get_classes()[id].forEach(function (name) {
					var key = id+"."+name,
						meta = $p.md.get(key);
					if(!meta.hide){
						this.tree.addItem(key, meta.list_presentation || meta.synonym, id);
						this.tree.setItemIcons(key, {file: "icon_1c_"+id});
					}
				}.bind(this));
			}.bind(this));
		}
	}

	/**
	 * ### Страница "Все объекты"
	 * @property All_meta_objs
	 * @type {All_meta_objs}
	 */
	this.All_meta_objs = All_meta_objs;

	/**
	 * ### Страница общих настроек
	 * @param cont {dhtmlXCellObject} - контейнер для размещения страницы
	 * @constructor
	 */
	function Setting2col(cont) {

		// закладка основных настроек
		cont.attachHTMLString($p.injected_data['view_settings.html']);
		this.cont = cont.cell.querySelector(".dhx_cell_cont_tabbar");
		this.cont.style.overflow = "auto";

		// первая колонка настроек
		this.form1 = (function (cont) {

			var form = new dhtmlXForm(cont, [

				{ type:"settings", labelWidth:80, position:"label-left"  },

				{type: "label", labelWidth:320, label: "Адрес CouchDB", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_path", label:"Путь:", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации CouchDB", width: 320}},

				{type: "label", labelWidth:320, label: "Адрес http сервиса 1С", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"rest_path", label:"Путь", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации 1С OData", width: 320}},

				{type: "label", labelWidth:320, label: "Значение разделителя данных", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"zone", label:"Зона:", numberFormat: ["0", "", ""], validate:"NotEmpty,ValidInteger"},
				{type:"template", label:"",value:"", note: {text: "Для неразделенной публикации, зона = 0", width: 320}},

				{type: "label", labelWidth:320, label: "Суффикс базы пользователя", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_suffix", label:"Суффикс:"},
				{type:"template", label:"",value:"",
					note: {text: "Назначается абоненту при регистрации", width: 320}},

				{type: "label", labelWidth:320, label: "Сохранять пароль пользователя", className: "label_options"},
				{type:"checkbox", name:"enable_save_pwd", label:"Разрешить:", checked: $p.wsql.get_user_param("enable_save_pwd", "boolean")},
				{type:"template", label:"",value:"", note: {text: "Не рекомендуется, если к компьютеру имеют доступ посторонние лица", width: 320}},
				{type:"template", label:"",value:"", note: {text: "", width: 320}},

				{type:"block", blockOffset: 0, name:"block_buttons", list:[
					{type: "button", name: "save", value: "<i class='fa fa-floppy-o fa-lg'></i>", tooltip: "Применить настройки и перезагрузить программу"},
					{type:"newcolumn"},
					{type: "button", offsetLeft: 20, name: "reset", value: "<i class='fa fa-refresh fa-lg'></i>", tooltip: "Стереть справочники и перезаполнить данными сервера"}
				]
				}
			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			["zone", "couch_path", "couch_suffix", "rest_path"].forEach(function (prm) {
				if(prm == "zone")
					form.setItemValue(prm, $p.wsql.get_user_param(prm));
				else
					form.setItemValue(prm, $p.wsql.get_user_param(prm) || $p.job_prm[prm]);
			});

			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});

			form.disableItem("couch_suffix");

			if(!$p.job_prm.rest_path)
				form.disableItem("rest_path");

			form.attachEvent("onButtonClick", function(name){

				if(name == "save"){

					// завершаем синхронизацию
					$p.wsql.pouch.log_out();

					// перезагружаем страницу
					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);

				} else if(name == "reset"){

					dhtmlx.confirm({
						title: "Сброс данных",
						text: "Стереть справочники и перезаполнить данными сервера?",
						cancel: $p.msg.cancel,
						callback: function(btn) {
							if(btn)
								$p.wsql.pouch.reset_local_data();
						}
					});
				}
			});

			return form;

		})(this.cont.querySelector("[name=form1]").firstChild);

		// вторая колонка настроек
		this.form2 = (function (cont) {

			var form = new dhtmlXForm(cont, [
				{ type:"settings", labelWidth:320, position:"label-left"  },

				{type: "label", label: "Тип устройства", className: "label_options"},
				{ type:"block", blockOffset: 0, name:"block_device_type", list:[
					{ type:"settings", labelAlign:"left", position:"label-right"  },
					{ type:"radio" , name:"device_type", labelWidth:120, label:'<i class="fa fa-desktop"></i> Компьютер', value:"desktop"},
					{ type:"newcolumn"   },
					{ type:"radio" , name:"device_type", labelWidth:150, label:'<i class="fa fa-mobile fa-lg"></i> Телефон, планшет', value:"phone"}
				]  },
				{type:"template", label:"",value:"", note: {text: "Класс устройства определяется автоматически, но пользователь может задать его явно", width: 320}},

				{type: "label", label: "Подключаемые модули", className: "label_options"},
				{type:"input" , position:"label-top", inputWidth: 320, name:"modifiers", label:"Модификаторы:", value: $p.wsql.get_user_param("modifiers"), rows: 3, style:"height:80px;"},
				{type:"template", label:"",value:"", note: {text: "Список дополнительных модулей", width: 320}}

			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			form.checkItem("device_type", $p.job_prm.device_type);

			// подключаем обработчик изменения значений в форме
			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, value);

			});

			form.disableItem("modifiers");
			form.getInput("modifiers").onchange = function () {
				$p.wsql.set_user_param("modifiers", this.value);
			};

			return form;

		})(this.cont.querySelector("[name=form2]").firstChild);

	}

	/**
	 * ### Страница общих настроек
	 * @property Setting2col
	 * @type {Setting2col}
	 */
	this.Setting2col = Setting2col;
}

$p.__define({

	/**
	 * Объекты интерфейса пользователя
	 * @property iface
	 * @for MetaEngine
	 * @type InterfaceObjs
	 * @static
	 */
	iface: {
		value: new InterfaceObjs(),
		writable: false
	},

	/**
	 * ### Текущий пользователь
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_user
	 * @type CatUsers
	 * @final
	 */
	current_user: {
		get: function () {
			return $p.cat && $p.cat.users ?
				$p.cat.users.by_id($p.wsql.get_user_param("user_name")) :
				$p.utils.blank.guid;
		}
	},

	/**
	 * ### Права доступа текущего пользователя.
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_acl
	 * @type CcatUsers_acl
	 * @final
	 */
	current_acl: {
		get: function () {
			var res = {};
			if($p.cat && $p.cat.users_acl){
				$p.cat.users_acl.find_rows({owner: $p.current_user}, function (o) {
					res = o;
					return false;
				})
			}
			return res;
		}
	},

	/**
	 * Загружает скрипты и стили синхронно и асинхронно
	 * @method load_script
	 * @for MetaEngine
	 * @param src {String} - url ресурса
	 * @param type {String} - "link" или "script"
	 * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
	 * @async
	 */
	load_script: {
		value: function (src, type, callback) {

			return new Promise(function(resolve, reject){

				var s = document.createElement(type);
				if (type == "script") {
					s.type = "text/javascript";
					s.src = src;
					s.async = true;
					s.addEventListener('load', callback ? function () {
						callback();
						resolve();
					} : resolve, false);

				} else {
					s.type = "text/css";
					s.rel = "stylesheet";
					s.href = src;
				}
				document.head.appendChild(s);

				if(type != "script")
					resolve()

			});
		}
	}

});