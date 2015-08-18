/**
 * ### Визуальный компонент - поле с выпадающим списком
 * &copy; http://www.oknosoft.ru 2009-2015
 *
 * @module  wdg_ocombo
 * @requires common
 */

/**
 * ### Визуальный компонент - поле с выпадающим списком
 * - Предназначен для отображения и редактирования ссылочных, в том числе, составных типов данных
 * - Унаследован от [dhtmlXCombo](http://docs.dhtmlx.com/combo__index.html)
 * - Строки списка формируются автоматически по описанию метаданных
 * - Автоматическая привязка к данным (байндинг) - при изменении значения в поле объекта, синхронно изменяются данные в элементе управления
 * - Автоматическая фильтрация по части кода или наименования
 * - Лаконичный код инициализации компонента [см. пример в Codex](http://www.oknosoft.ru/metadata/codex/#obj=0116&view=js)</li>
 *
 * @class OCombo
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj|TabularSectionRow} - ссылка на редактируемый объект
 * @param attr.field {String} - имя поля редактируемого объекта
 * @param [attr.meta] {Object} - описание метаданных поля. Если не указано, описание запрашивается у объекта
 * @param [attr.width] {Number} - если указано, фиксирует ширину элемента
 * @constructor
 */
function OCombo(attr){

	var _obj, _field, _meta, _mgr, popup_focused,
		t = this,
		_pwnd = {on_select: attr.on_select || function (selv) {
			_obj[_field] = selv;
		}};

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
		_obj[_field] = this.getSelectedValue();
	});

	this.attachEvent("onBlur", function(){
		if(!this.getSelectedValue() && this.getComboText())
			this.setComboText("");
	});

	this.attachEvent("onDynXLS", function (text) {

		if(!_mgr)
			_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr){
			t.clearAll();
			t.addOption(_mgr.get_option_list(null, get_filter(text), 30));
			t.openSelect();
		}

	});

	function get_filter(text){
		var filter = {};
		if(_mgr && _mgr.metadata().hierarchical && _mgr.metadata().group_hierarchy){
			if(_meta.choice_groups_elm == "elm")
				filter.is_folder = false;
			else if(_meta.choice_groups_elm == "grp" || _field == "parent")
				filter.is_folder = true;
		}
		if(text)
			filter.presentation = {like: text};
		return filter;
	}

	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {
					initial_value: _obj[_field].ref,
					selection: [get_filter()]
				});

		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj();
					});

		} else if(this.name == "open"){
			if(_obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj();
		}

		if(e)
			return $p.cancel_bubble(e);
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}

	function popup_show(){

		if(_mgr instanceof EnumManager)
			return;

		popup_focused = true;
		var div = document.createElement('div'),
			innerHTML = "<a href='#' name='select' title='Форма выбора {F4}'>Показать все</a>" +
				"<img src='"+dhtmlx.image_path+"dhxtoolbar_web/blank9.png' />" +
				"&nbsp;<a href='#' name='open' title='Открыть форму элемента {Ctrl+Shift+F4}'><img src='"+dhtmlx.image_path+"dhxtoolbar_web/tb_open.png' /></a>";

		// для полных прав разрешаем добавление элементов
		// TODO: учесть реальные права на добавление
		if($p.ajax.root)
			innerHTML += "&nbsp;<a href='#' name='add' title='Создать новый элемент {F8}'><img src='"+dhtmlx.image_path+"dhxtoolbar_web/tb_add.png' /></a>";

		// для составных типов разрешаем выбор типа
		// TODO: реализовать поддержку примитивных типов
		if(_meta.type.types.length > 1)
			innerHTML += "&nbsp;<a href='#' name='type' title='Выбрать тип значения {Alt+T}'><img src='"+dhtmlx.image_path+"custom_field/icss_text.png' /></a>";

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

	dhtmlxEvent(t.getButton(), "mouseover", popup_show);

	dhtmlxEvent(t.getButton(), "mouseout", popup_hide);

	dhtmlxEvent(t.getBase(), "click", function (e) {
		return $p.cancel_bubble(e);
	});

	dhtmlxEvent(t.getInput(), "contextmenu", function (e) {
		popup_show();
		return $p.cancel_bubble(e);
	});

	dhtmlxEvent(t.getInput(), "keyup", function (e) {

		if(_mgr instanceof EnumManager)
			return;

		if(e.keyCode == 115){ // F4
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj();
			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.cancel_bubble(e);
		}
	});

	function observer(changes){
		if(!t.getBase().parentElement)
			setTimeout(t.unload);
		else
			changes.forEach(function(change){
				if(change.name == _field){
					set_value(_obj[_field]);
				}
			});
	}

	function set_value(v){
		if(v && v instanceof DataObj && !v.empty()){
			if(!t.getOption(v.ref))
				t.addOption(v.ref, v.presentation);
			if(t.getSelectedValue() == v.ref)
				return;
			t.setComboValue(v.ref);
		}else if(t.getSelectedValue()){
			t.setComboValue("");
			t.setComboText("")
		}
	}

	/**
	 * Подключает поле объекта к элементу управления
	 * @param obj
	 * @param field
	 * @param [meta]
	 */
	this.attach = function (obj, field, meta) {

		if(_obj)
			Object.unobserve(_obj, observer);

		_obj = obj;
		_field = field;
		_meta = meta || obj._metadata.fields[field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr){
			// загружаем список в 30 строк
			t.addOption(_mgr.get_option_list(_obj[_field], get_filter(), 30));

			// если поле имеет значение - устанавливаем
			set_value(_obj[_field]);
		}

		// начинаем следить за объектом
		Object.observe(_obj, observer, ["update"]);

	};

	var _unload = this.unload;
	this.unload = function () {
		if(_obj)
			Object.unobserve(_obj, observer);
		if(t.conf && t.conf.tm_confirm_blur)
			clearTimeout(t.conf.tm_confirm_blur);
		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		try{ _unload.call(t); }catch(e){};

	};

	// биндим поле объекта
	if(attr.obj && attr.field)
		this.attach(attr.obj, attr.field, attr.meta);
	// устанавливаем url фильтрации
	this.enableFilteringMode("between", "dummy", false, false);

}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;

