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
class Col_struct {
  constructor(id,width,type,align,sort,caption){
    this.id = id;
    this.width = width;
    this.type = type;
    this.align = align;
    this.sort = sort;
    this.caption = caption;
  }
}

/**
 * ### Объекты интерфейса пользователя
 * @class InterfaceObjs
 * @static
 * @menuorder 40
 * @tooltip Контекст UI
 */
export default class InterfaceObjs {

	constructor($p) {

		this.$p = $p;

		this.set_hash = this.set_hash.bind(this);
		this.hash_route = this.hash_route.bind(this);
		this.check_exit = this.check_exit.bind(this);

	    /**
	     * Конструктор описания колонки динамического списка
	     * @type {Col_struct}
	     * @constructor
	     */
	    $p.classes.Col_struct = Col_struct;

		if (typeof window !== 'undefined' && window.dhx4) {
			dhx4.dateFormat.ru = "%d.%m.%Y";
			dhx4.dateLang = "ru";
			dhx4.dateStrings = {
				ru: {
					monthFullName:	["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август","Сентябрь","Oктябрь","Ноябрь","Декабрь"],
					monthShortName:	["Янв","Фев","Maр","Aпр","Maй","Июн","Июл","Aвг","Сен","Окт","Ноя","Дек"],
					dayFullName:	["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
					dayShortName:	["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
				}
			};

      /**
       * Показывает информационное сообщение или confirm
       * @method show_msg
       * @param attr {object} - атрибуты сообщения attr.type - [info, alert, confirm, modalbox, info-error, alert-warning, confirm-error]
       * @param [delm] - элемент html в тексте которого сообщение будет продублировано
       * @example
       *  $p.msg.show_msg({
		 *      title:"Important!",
		 *      type:"alert-error",
		 *      text:"Error"});
       */
			$p.msg.show_msg = (attr, delm) => {
        if(!attr){
          return;
        }
        if(typeof attr == "string"){
          if(this.synctxt){
            this.synctxt.show_message(attr);
            return;
          }
          attr = {type:"info", text:attr };
        }
        else if(Array.isArray(attr) && attr.length > 1){
          attr = {type: "info", text: '<b>' + attr[0] + '</b><br />' + attr[1]};
        }
        if(delm && typeof delm.setText == "function"){
          delm.setText(attr.text);
        }
        dhtmlx.message(attr);
      }

      dhtmlx.message.position = "bottom";
		}

	  }

	/**
	 * Возвращает координату левого верхнего угла элемента относительно документа
	 * @method get_offset
	 * @param elm {HTMLElement} - элемент, координату которого, необходимо определить
	 * @return {Object} - {left: number, top: number}
	 */
	get_offset(elm) {
		const offset = {left: 0, top:0};
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
	normalize_xml(str){
    if(!str) {
      return '';
    }
    else if(typeof str === 'object') {
      return str.toString();
    }
		const entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, (s) => entities[s]);
	};

	/**
	 * Масштабирует svg
	 * @method scale_svg
	 * @param svg_current {String} - исходная строка svg
	 * @param size {Number|Object} - требуемый размер картинки
	 * @param padding {Number} - отступ от границы viewBox
	 * @return {String} - отмасштабированная строка svg
	 */
	scale_svg(svg_current, size, padding){
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
	bind_help(wnd, path) {

	  const {msg} = this.$p;

		function frm_help(win){
			if(!win.help_path){
				msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: msg.not_implemented,
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
	set_hash(obj, ref, frm, view ) {

		var ext = {},
			hprm = this.$p.job_prm.parse_url();

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
			this.hash_route();
		else
			location.hash = hash;
	};

	/**
	 * Выполняет навигацию при изменении хеша url
	 * @method hash_route
	 * @param event {HashChangeEvent}
	 * @return {Boolean}
	 */
	hash_route(event) {

	  const {$p, before_route, cancel_bubble, swith_view, docs} = this;
		let hprm = $p.job_prm.parse_url(),
			res = $p.eve.callEvent("hash_route", [hprm]),
			mgr;

		if((res !== false) && (!before_route || before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					// если задана ссылка, открываем форму объекта
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"](docs, hprm.ref)

				}else if(hprm.view && swith_view){
					// если задано имя представления, переключаем главную форму
					swith_view(hprm.view);

				}

			}
		}

    return event && cancel_bubble(event);
	};

	/**
	 * Запрещает всплывание события
	 * @param e {MouseEvent|KeyboardEvent}
	 * @returns {Boolean}
	 */
	cancel_bubble(e, prevent) {
		const evt = (e || event);
    evt && prevent && evt.preventDefault && evt.preventDefault();
		evt && evt.stopPropagation && evt.stopPropagation();
		if (evt && !evt.cancelBubble){
      evt.cancelBubble = true;
    }
		return false
	};

	/**
	 * ### Страница общих настроек
	 * @param cont {dhtmlXCellObject} - контейнер для размещения страницы
	 * @constructor
	 */
	Setting2col(cont) {

	  const {injected_data, wsql, job_prm, msg} = this.$p;

		// закладка основных настроек
		cont.attachHTMLString(injected_data['view_settings.html']);
		this.cont = cont.cell.querySelector(".dhx_cell_cont_tabbar");
		this.cont.style.overflow = "auto";

		// первая колонка настроек
		this.form2 = (function (cont) {

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

				{type:"block", blockOffset: 0, name:"block_buttons", list:[
					{type: "button", name: "save", value: "<i class='fa fa-floppy-o fa-lg'></i>", tooltip: "Применить настройки и перезагрузить программу"},
					{type:"newcolumn"},
					{type: "button", offsetLeft: 20, name: "reset", value: "<i class='fa fa-refresh fa-lg'></i>", tooltip: "Стереть справочники и перезаполнить данными сервера"}
				]
				}
			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			["zone", "couch_path", "rest_path"].forEach(function (prm) {
				if(prm == "zone")
					form.setItemValue(prm, wsql.get_user_param(prm));
				else
					form.setItemValue(prm, wsql.get_user_param(prm) || job_prm[prm]);
			});

			form.attachEvent("onChange", function (name, value, state){
				wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});

			if(!job_prm.rest_path)
				form.disableItem("rest_path");

			form.attachEvent("onButtonClick", function(name){

				if(name == "save"){

					// завершаем синхронизацию
					wsql.pouch.log_out();

					// перезагружаем страницу
					setTimeout(function () {
						eve.redirect = true;
						location.reload(true);
					}, 1000);

				} else if(name == "reset"){

					dhtmlx.confirm({
						title: "Сброс данных",
						text: "Стереть справочники и перезаполнить данными сервера?",
						cancel: msg.cancel,
						callback: function(btn) {
							if(btn)
								wsql.pouch.reset_local_data();
						}
					});
				}
			});

			return form;

		})(this.cont.querySelector("[name=form2]").firstChild);

		// вторая колонка настроек
		this.form1 = (function (cont) {

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

				{type: "label", label: "Сохранять пароль пользователя", className: "label_options"},
				{type:"checkbox", name:"enable_save_pwd", label:"Разрешить:", labelWidth:90, checked: wsql.get_user_param("enable_save_pwd", "boolean")},
				{type:"template", label:"",value:"", note: {text: "Не рекомендуется, если к компьютеру имеют доступ посторонние лица", width: 320}},
				{type:"template", label:"",value:"", note: {text: "", width: 320}},

				{type: "label", label: "Подключаемые модули", className: "label_options"},
				{type:"input" , position:"label-top", inputWidth: 320, name:"modifiers", label:"Модификаторы:", value: wsql.get_user_param("modifiers"), rows: 3, style:"height:80px;"},
				{type:"template", label:"",value:"", note: {text: "Список дополнительных модулей", width: 320}}

			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			form.checkItem("device_type", job_prm.device_type);

			// подключаем обработчик изменения значений в форме
			form.attachEvent("onChange", function (name, value, state){
				wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);

			});

			form.disableItem("modifiers");
			form.getInput("modifiers").onchange = function () {
				wsql.set_user_param("modifiers", this.value);
			};

			return form;

		})(this.cont.querySelector("[name=form1]").firstChild);

	}

  /**
   * Перезагружает интерфейс
   * @param text
   * @param title
   */
	do_reload(text, title) {

    const {eve, wsql, msg} = this.$p;

		let confirm_count = 0;

		function do_reload(){

			dhtmlx.confirm({
				title: title || msg.file_new_date_title,
				text: text || msg.file_new_date,
        ok: 'Перезагрузка',
        cancel: 'Продолжить',
				callback: function(btn) {

					if(btn){

						wsql.pouch.log_out();

						setTimeout(function () {
							eve.redirect = true;
							location.reload(true);
						}, 1000);

					}else{

						confirm_count++;
						setTimeout(do_reload, confirm_count * 30000);

					}
				}
			});

		}

		do_reload();
	}

  /**
   * Проверяет, нет ли других модальных форм
   */
  check_exit(wnd){
    let do_exit;
    // если есть внешнее модальное, ничего обрабатывать не надо
    this.w.forEachWindow((w) => {
      if(w != wnd && (w.isModal() || this.w.getTopmostWindow() == w)){
        do_exit = true;
      }
    });
    return do_exit;
  }
}

