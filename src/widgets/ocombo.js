/**
 * ### Визуальный компонент OCombo
 * Поле с выпадающим списком + функция выбора из списка
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module widgets
 * @submodule wdg_ocombo
 * @requires common
 */

/**
 * ### Визуальный компонент - поле с выпадающим списком
 * - Предназначен для отображения и редактирования ссылочных, в том числе, составных типов данных
 * - Унаследован от [dhtmlXCombo](http://docs.dhtmlx.com/combo__index.html)
 * - Строки списка формируются автоматически по описанию метаданных
 * - Автоматическая привязка к данным (байндинг) - при изменении значения в поле объекта, синхронно изменяются данные в элементе управления
 * - Автоматическая фильтрация по части кода или наименования
 * - Лаконичный код инициализации компонента [см. пример в Codex](http://www.oknosoft.ru/metadata/codex/#obj=0116&view=js)
 *
 * @class OCombo
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj|TabularSectionRow} - ссылка на редактируемый объект
 * @param attr.field {String} - имя поля редактируемого объекта
 * @param [attr.metadata] {Object} - описание метаданных поля. Если не указано, описание запрашивается у объекта
 * @param [attr.width] {Number} - если указано, фиксирует ширину элемента
 * @constructor
 * @menuorder 51
 * @tooltip Поле со списком
 */
function OCombo(attr){

	var _obj, _field, _meta, _mgr, _property, popup_focused,
		t = this,
		_pwnd = {
			on_select: attr.on_select || function (selv) {
				_obj[_field] = selv;
			}
		};

	// если нас открыли из окна,
	// которое может быть модальным - сохраняем указатель на метод модальности родительского окна
	if(attr.pwnd && attr.pwnd.setModal)
		_pwnd.setModal = attr.pwnd.setModal.bind(attr.pwnd);

	// выполняем конструктор родительского объекта
	OCombo.superclass.constructor.call(t, attr);

	if(attr.on_select){
		t.getBase().style.border = "none";
		t.getInput().style.left = "-3px";
		if(!attr.is_tabular)
			t.getButton().style.right = "9px";
	} else
		t.getBase().style.marginBottom = "4px";

	if(attr.left)
		t.getBase().style.left = left + "px";

	this.attachEvent("onChange", function(){
		if(_obj && _field){
		  var val = this.getSelectedValue();
		  if(!val && this.getComboText()){
        val = this.getOptionByLabel(this.getComboText());
        if(val){
          val = val.value;
        }
        else{
          this.setComboText("");
        }
      }
      _obj[_field] = val;
    }
	});

	this.attachEvent("onBlur", function(){
		if(!this.getSelectedValue() && this.getComboText()){
      this.setComboText("");
    }
	});

	this.attachEvent("onDynXLS", function (text) {

	  if(!_meta){
	    return;
    }
		if(!_mgr){
      _mgr = _md.value_mgr(_obj, _field, _meta.type);
    }
		if(_mgr){
			t.clearAll();
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, get_filter(text))
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						t.openSelect();
					}
				});
		}

	});

	function get_filter(text){
		var filter = {_top: 50, _dhtmlx: true};

    if(_mgr && _mgr.metadata().hierarchical && _mgr.metadata().group_hierarchy) {
      if(_meta.choice_groups_elm == 'elm') {
        filter.is_folder = false;
      }
      else if(_meta.choice_groups_elm == 'grp' || _field == 'parent') {
        filter.is_folder = true;
      }
    }

    // для связей параметров выбора, значение берём из объекта
		if(_meta.choice_links)
			_meta.choice_links.forEach(({name, path}) => {
				if(name && name[0] == "selection"){
					if(_obj instanceof TabularSectionRow){
						if(path.length < 2)
							filter[name[1]] = typeof path[0] == "function" ? path[0] : _obj._owner._owner[path[0]];
						else{
							if(name[1] == "owner" && !_mgr.metadata().has_owners){
								return;
							}
							filter[name[1]] = _obj[path[1]];
						}
					}else{
						filter[name[1]] = typeof path[0] == "function" ? path[0] : _obj[path[0]];
					}
				}
			});

		// у параметров выбора, значение живёт внутри отбора
		if(_meta.choice_params){
      _meta.choice_params.forEach(({name, path}) => {
        const fval = Array.isArray(path) ? {in: path} : path;
        if(!filter[name]) {
          filter[name] = fval;
        }
        else if(Array.isArray(filter[name])) {
          filter[name].push(fval);
        }
        else {
          filter[name] = [filter[name]];
          filter[name].push(fval);
        }
      });
    }

		// если в метаданных указано строить список по локальным данным, подмешиваем эту информацию в фильтр
    if(_meta._option_list_local) {
      filter._local = true;
    }

    // навешиваем фильтр по подстроке
    if(text) {
      filter.presentation = {like: text};
    }

    // если включен справочник связей параметров - дополнительно фильтруем результат
    if(attr.property && attr.property.filter_params_links) {
      attr.property.filter_params_links(filter, attr);
    }

		return filter;
	}

	// обработчики событий

	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {
					initial_value: _obj[_field].ref,
					selection: [get_filter()]
				});
			else
				aclick.call({name: "type"});

		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj(attr.pwnd);
					});
		}
		else if(this.name == "open"){
			if(_obj && _obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj(attr.pwnd);
		}
		else if(_meta && this.name == "type"){
			var tlist = [], tmgr, tmeta, tobj = _obj, tfield = _field;
			_meta.type.types.forEach(function (o) {
				tmgr = _md.mgr_by_class_name(o);
				tmeta = tmgr.metadata();
				tlist.push({
					presentation: tmeta.synonym || tmeta.name,
					mgr: tmgr,
					selected: _mgr === tmgr
				});
			});
			$p.iface.select_from_list(tlist)
				.then(function(v){
					if(tobj[tfield] && ((tobj[tfield].empty && tobj[tfield].empty()) || tobj[tfield]._manager != v.mgr)){
						_mgr = v.mgr;
						_obj = tobj;
						_field = tfield;
						_meta = typeof _obj._metadata == 'function' ? _obj._metadata(_field) : _obj._metadata.fields[_field];
						_mgr.form_selection({
							on_select: function (selv) {
								_obj[_field] = selv;
								_obj = null;
								_field = null;
								_meta = null;

							}}, {
							selection: [get_filter()]
						});
					}
					_mgr = null;
					tmgr = null;
					tmeta = null;
					tobj = null;
					tfield = null;
				});
		}

		if(e)
			return $p.iface.cancel_bubble(e);
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused){
				if($p.iface.popup.p && $p.iface.popup.p.onmouseover)
					$p.iface.popup.p.onmouseover = null;
				if($p.iface.popup.p && $p.iface.popup.p.onmouseout)
					$p.iface.popup.p.onmouseout = null;
				$p.iface.popup.clear();
				$p.iface.popup.hide();
			}
		}, 300);
	}

	function popup_show(){

		if(!_mgr || !_mgr.class_name || _mgr instanceof EnumManager){
      return;
    }

		popup_focused = true;
		var div = document.createElement('div'),
			innerHTML = attr.hide_frm ? "" : "<a href='#' name='select' title='Форма выбора {F4}'>Показать все</a>" +
				"<a href='#' name='open' style='margin-left: 9px;' title='Открыть форму элемента {Ctrl+Shift+F4}'><i class='fa fa-external-link fa-fw'></i></a>";

		// для полных прав разрешаем добавление элементов
		// TODO: учесть реальные права на добавление
		if(!attr.hide_frm){
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			if(_acl.indexOf("i") != -1)
				innerHTML += "&nbsp;<a href='#' name='add' title='Создать новый элемент {F8}'><i class='fa fa-plus fa-fwfa-fw'></i></a>";
		}

		// для составных типов разрешаем выбор типа
		// TODO: реализовать поддержку примитивных типов
		if(_meta.type.types.length > 1)
			innerHTML += "&nbsp;<a href='#' name='type' title='Выбрать тип значения {Alt+T}'><i class='fa fa-level-up fa-fw'></i></a>";

		if(innerHTML){
			div.innerHTML = innerHTML;
			for(var i=0; i<div.children.length; i++)
				div.children[i].onclick = aclick;

			$p.iface.popup.clear();
			$p.iface.popup.attachObject(div);
			$p.iface.popup.show(dhx4.absLeft(t.getButton())-77, dhx4.absTop(t.getButton()), t.getButton().offsetWidth, t.getButton().offsetHeight);

			$p.iface.popup.p.onmouseover = function(){
				popup_focused = true;
			};

			$p.iface.popup.p.onmouseout = popup_hide;
		}
	}

	function oncontextmenu(e) {
		setTimeout(popup_show, 10);
		e.preventDefault();
		return false;
	}

	function onkeyup(e) {

		if(!_mgr || _mgr instanceof EnumManager){
      return;
    }

		if(e.keyCode == 115){ // F4
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj(attr.pwnd);

			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.iface.cancel_bubble(e);
		}
	}

	function onfocus(e) {
		setTimeout(function () {
			if(t && t.getInput)
				t.getInput().select();
		}, 50);
	}

	t.getButton().addEventListener("mouseover", popup_show);

	t.getButton().addEventListener("mouseout", popup_hide);

	t.getBase().addEventListener("click", $p.iface.cancel_bubble);

	t.getBase().addEventListener("contextmenu", oncontextmenu);

	t.getInput().addEventListener("keyup", onkeyup);

	t.getInput().addEventListener("focus", onfocus);


	function listener(obj, fields){
	  if(!_obj || !t.getBase().parentElement){
      setTimeout(t.unload);
    }
		if(!t || !t.getBase || obj !== _obj){
      return;
    }
    fields[_field] && set_value(_obj[_field]);
  }

	function set_value(v){
		if(v && v instanceof DataObj && !v.empty()){
			if(!t.getOption(v.ref))
				t.addOption(v.ref, v.presentation);
			if(t.getSelectedValue() == v.ref)
				return;
			t.setComboValue(v.ref);
		}
		else if(!t.getSelectedValue()){
			t.setComboValue("");
			t.setComboText("")
		}
	}

	/**
	 * Подключает поле объекта к элементу управления<br />
	 * Параметры аналогичны конструктору
	 */
	this.attach = function (attr) {
		_obj = attr.obj;
		_field = attr.field;
		_property = attr.property;

		if(attr.metadata)
			_meta = attr.metadata;

		else if(_property){
			_meta = (typeof _obj._metadata == 'function' ? _obj._metadata(_field) : _obj._metadata.fields[_field])._clone();
			_meta.type = _property.type;

		}else
			_meta = typeof _obj._metadata == 'function' ? _obj._metadata(_field) : _obj._metadata.fields[_field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr || attr.get_option_list){
			// загружаем список в 30 строк
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, get_filter(), _obj[_field])
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						// если поле имеет значение - устанавливаем
						set_value(_obj[_field]);
					}
				});
		}

		// начинаем следить за объектом
    if(_mgr){
      _mgr.off('update', listener);
      _mgr.on('update', listener);
    }

	};

  this.open_selection = function () {
    aclick.call({name: "select"});
  }

	const _unload = this.unload;
	this.unload = function () {
    popup_hide();
    if(t.getButton){
      t.getButton().removeEventListener("mouseover", popup_show);
      t.getButton().removeEventListener("mouseout", popup_hide);
      t.getBase().removeEventListener("click", $p.iface.cancel_bubble);
      t.getBase().removeEventListener("contextmenu", oncontextmenu);
      t.getInput().removeEventListener("keyup", onkeyup);
      t.getInput().removeEventListener("focus", onfocus);
    }
    if(t.conf && t.conf.tm_confirm_blur){
      clearTimeout(t.conf.tm_confirm_blur);
    }
    _mgr && _mgr.off('update', listener);
    this.list && this.list.parentElement && this.list.parentElement.removeChild(this.list);
    _obj = null;
    _field = null;
    _meta = null;
    _mgr = null;
    _pwnd = null;

    try{ _unload && _unload.call(t); }catch(e){}
	};

	// биндим поле объекта
	attr.obj && attr.field && this.attach(attr);

	// устанавливаем url фильтрации
	this.enableFilteringMode("between", "dummy", false, false);

	// свойство для единообразного доступа к значению
	this.__define({
		value: {
			get: function () {
				if(_obj)
					return _obj[_field];
			}
		}
	});

}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;

/**
 * ### Форма выбора из списка значений
 * @method select_from_list
 * @for InterfaceObjs
 * @param list
 * @param multy
 * @return {Promise}
 */
$p.iface.select_from_list = function (list, multy) {

	return new Promise(function(resolve, reject){

		if(!Array.isArray(list) || !list.length)
			resolve(undefined);

		else if(list.length == 1)
			resolve(list[0]);

		// создаём и показываем диалог со списком

		// параметры открытия формы
		var options = {
				name: 'wnd_select_from_list',
				wnd: {
					id: 'wnd_select_from_list',
					width: 300,
					height: 300,
					modal: true,
					center: true,
					caption: $p.msg.select_from_list,
					allow_close: true,
					on_close: function () {
						if(rid)
							resolve(list[parseInt(rid)-1]);
						return true;
					}
				}
			},
			rid, sid,
			wnd = $p.iface.dat_blank(null, options.wnd),
			_grid = wnd.attachGrid(),
			_toolbar = wnd.attachToolbar({
				items:[
					{id: "select", type: "button", text: $p.msg.select_from_list},
					{id: "cancel", type: "button", text: "Отмена"}
				],
				onClick: do_select
			});

		function do_select(id){
			if(id != "cancel")
				rid = _grid.getSelectedRowId();
			wnd.close();
		}

		_grid.setIconsPath(dhtmlx.image_path);
		_grid.setImagePath(dhtmlx.image_path);
		_grid.setHeader($p.msg.value);
		_grid.setColTypes("ro");
		_grid.enableAutoWidth(true, 1200, 600);
		_grid.attachEvent("onRowDblClicked", do_select);
		_grid.enableMultiselect(!!multy);
		_grid.setNoHeader(true);
		_grid.init();

		_toolbar.addSpacer("select");

		wnd.hideHeader();
		wnd.cell.offsetParent.querySelector(".dhxwin_brd").style.border = "none"

		// заполняем его данными
		list.forEach(function (o, i) {
			var text;
			if(typeof o == "object")
				text = o.presentation || o.text || o.toString();
			else
				text = o.toString();
			_grid.addRow(1+i, text);
			if(o.selected)
				sid = 1+i;
		});
		if(sid)
			_grid.selectRowById(sid);

	});
};

/**
 * ### Форма ввода значения
 * @method query_value
 * @for InterfaceObjs
 * @param initial
 * @param caption
 * @return {Promise}
 */
$p.iface.query_value = function (initial, caption) {

  return new Promise(function(resolve, reject){

    // создаём и показываем диалог со списком

    // параметры открытия формы
    var options = {
        name: 'wnd_query_value',
        wnd: {
          width: 300,
          height: 160,
          modal: true,
          center: true,
          caption: caption || 'Введите значение',
          allow_close: true,
          on_close: function () {
            reject();
            return true;
          }
        }
      },
      wnd = $p.iface.dat_blank(null, options.wnd),
      _toolbar = wnd.attachToolbar({
        items:[
          {id: "select", type: "button", text: "<b>Ok</b>"},
          {id: "sp", type: "spacer"},
          {id: "cancel", type: "button", text: "Отмена"}
        ],
        onClick: function (id){
          if(id == "cancel"){
            wnd.close()
          }
          else{
            resolve(wnd.cell.querySelector('INPUT').value);
            wnd.close();
          }
        }
      });

    wnd.attachHTMLString("<input type='text' style='width: 94%; padding: 4px;' value='" + initial + "' />");

  });
};
