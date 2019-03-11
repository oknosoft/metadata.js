/**
 * Формы визуализации и изменения параметров объекта
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule wnd_dat
 */


/**
 * Форма dat - шаблон окна инструментов
 */
$p.iface.dat_blank = function(_dxw, attr) {

	// TODO: реализовать undock для аккордиона

	if(!attr)
		attr = {};

	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: dhx4.newId(),
		left: attr.left || 700,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});

	// если окно не помещается в области - двигаем
	var _dxw_area = {
		x: (_dxw || $p.iface.w).vp.clientWidth,
		y: (_dxw || $p.iface.w).vp.clientHeight
	}, _move;

	if(wnd_dat.getPosition()[0] + wnd_dat.getDimension()[0] > _dxw_area.x){
		_dxw_area.x = _dxw_area.x - wnd_dat.getDimension()[0];
		_move = true;
	}else
		_dxw_area.x = wnd_dat.getPosition()[0];

	if(wnd_dat.getPosition()[1] + wnd_dat.getDimension()[1] > _dxw_area.y){
		_dxw_area.y = _dxw_area.y - wnd_dat.getDimension()[1];
		_move = true;
	}else
		_dxw_area.y = wnd_dat.getPosition()[1];

	if(_move){
		if(_dxw_area.x<0 || _dxw_area.y<0)
			wnd_dat.maximize();
		else
			wnd_dat.setPosition(_dxw_area.x, _dxw_area.y);
	}

	_dxw = null;

	if(attr.hasOwnProperty('allow_minmax') && !attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	// обработчик при закрытии - анализируем модальность
	wnd_dat.attachEvent("onClose", function () {

		var allow_close = typeof attr.on_close == "function" ? attr.on_close(wnd_dat) : true;

		if(allow_close){

			// восстанавливаем модальность родительского окна
			if(attr.pwnd_modal && attr.pwnd && attr.pwnd.setModal)
				attr.pwnd.setModal(1);

			return allow_close;
		}

	});

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.iface.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {grids: {}};

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
		if(attr.pwnd && attr.pwnd.setModal){
			attr.pwnd_modal = attr.pwnd.isModal();
			attr.pwnd.setModal(0);
		}
		wnd_dat.setModal(1);
	}

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
			source.o[f] = $p.utils.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.utils.is_data_obj(selv) ? selv.presentation : selv || "");


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

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
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
 * @menuorder 54
 * @tooltip Командная панель
 */
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path;

	if(attr.hasOwnProperty("class_name"))
		div.className = attr.class_name;
	else
		div.className = 'md_otooolbar';

	_this.cell = div;

	_this.buttons = {};

	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			div.children[i].classList.remove('selected');
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
		if(attr.onclick)
			attr.onclick.call(_this, this.name.replace(attr.name + '_', ''), attr.name);
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

				if(attr.on_popup)
					attr.on_popup($p.iface.popup, bdiv);
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
					this.subdiv.className = 'md_otooolbar';
					offset = $p.iface.get_offset(bdiv);
					if(battr.sub.align == 'right') {
            this.subdiv.style.left = (offset.left + bdiv.offsetWidth - (parseInt(battr.sub.width.replace(/\D+/g,"")) || 56)) + 'px';
          }
					else if(battr.sub.align == 'hor') {
            this.subdiv.style.left = offset.left + bdiv.offsetWidth + 'px';
          }
					else{
            this.subdiv.style.left = offset.left + 'px';
          }
					this.subdiv.style.top = (offset.top + (battr.sub.align == 'hor' ? 0 : div.offsetHeight)) + 'px';
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
	 * Возвращает имя выделенной кнопки
	 */
	this.get_selected = function () {
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				return btn.name;
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

	if(attr.top) div.style.top = attr.top;
	if(attr.left) div.style.left = attr.left;
	if(attr.bottom) div.style.bottom = attr.bottom;
	if(attr.right) div.style.right = attr.right;
	if(attr.paddingRight) div.style.paddingRight = attr.paddingRight;
	if(attr.paddingLeft) div.style.paddingLeft = attr.paddingLeft;

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

	// если имя начинается с sep_ - это разделитель
	bdiv.className = (battr.name.indexOf("sep_") == 0) ? 'md_otooolbar_sep' : 'md_otooolbar_button';
	if(battr.hasOwnProperty("class_name"))
		bdiv.classList.add(battr.class_name);

	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	else if(battr.css){
    battr.css.split(' ').forEach(function (s) {
      s && bdiv.classList.add(s);
    });
  }
	bdiv.innerHTML = html;

	if(battr.float) bdiv.style.float = battr.float;
	if(battr.clear) bdiv.style.clear = battr.clear;
	if(battr.width) bdiv.style.width = battr.width;
	if(battr.paddingRight) bdiv.style.paddingRight = battr.paddingRight;
	if(battr.paddingLeft) bdiv.style.paddingLeft = battr.paddingLeft;

	if(battr.tooltip)
		bdiv.title = battr.tooltip;

	return bdiv;
};
