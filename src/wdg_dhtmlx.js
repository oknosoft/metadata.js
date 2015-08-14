/**
 * Расширение типов ячеек dhtmlXGrid
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 *
 * Экспортирует конструкторы:
 * * **eXcell_ref** - поля ввода значений ссылочных типов
 * * **eXcell_refc** - комбобокс ссылочных типов (перечисления и короткие справочники)
 *
 * @module  wdg_dhtmlx
 * @requires common
 */

var eXcell_proto = new eXcell();

/**
 * Обработчик клавиш {tab}, {enter} и {F4} в поле ввода
 */
eXcell_proto.input_keydown = function(e, t){

	function obj_on_select(v){
		if(t.source.on_select)
			t.source.on_select.call(t.source, v);
	}

	if(e.keyCode == 8 || e.keyCode == 46){          // по {del} и {bs} очищаем значение
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source, "");

	}else if(e.keyCode == 9 || e.keyCode == 13)
		t.grid.editStop();                          // по {tab} и {enter} заканчиваем редактирование

	else if(e.keyCode == 115)
		t.cell.firstChild.childNodes[1].onclick(e); // по {F4} открываем редактор

	else if(e.keyCode == 113){                      // по {F2} открываем форму объекта
		if(t.source.tabular_section){
			t.mgr = _md.value_mgr(t.source.row, t.source.col, t.source.row._metadata.fields[t.source.col].type);
			if(t.mgr){
				var tv = t.source.row[t.source.col];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}

		}else if(t.fpath.length==1){
			t.mgr = _md.value_mgr(t.source.o._obj, t.fpath[0], t.source.o._metadata.fields[t.fpath[0]].type);
			if(t.mgr){
				var tv = t.source.o[t.fpath[0]];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}
	}

	return $p.cancel_bubble(e);
};


/**
 * Конструктор поля ввода значений ссылочных типов для грида
 * @param cell
 */
function eXcell_ref(cell){

	if (!cell) return;

	var t = this, td,

		ti_keydown=function(e){
			return eXcell_proto.input_keydown(e, t);
		},

		open_selection=function(e) {

			var fmd, rt, at, cl, acl, sval,
				attr = {
					initial_value: t.val.ref,
					parent: null,
					owner: null};

			t.mgr = null;

			if(t.source.slist)
				t.source.slist.call(t);

			else if(t.source.tabular_section){
				fmd = t.source.row._metadata.fields[t.source.col];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
				if(t.mgr){
					if(t.source["choice_links"] && t.source["choice_links"][t.source.tabular_section + "_" + t.source.col])
						acl = t.source["choice_links"][t.source.tabular_section + "_" + t.source.col];
					else
						acl = fmd["choice_links"];
					if(acl){
						for(var icl in acl){
							if((cl = acl[icl]).name[1] == "owner")
								attr.owner = cl.path.length == 2 ? t.source.row[cl.path[1]].ref : t.source.o[cl.path[0]].ref;
						}
					}
					t.mgr.form_selection(t.source, attr);
				}

			}else{
				if(t.fpath.length < 2){
					fmd = t.source.o._manager.metadata(t.fpath[0]);
					t.mgr = _md.value_mgr(t.source.o, t.fpath[0], fmd.type);

					if(t.source["choice_links"] && t.source["choice_links"][t.fpath[0]])
						acl = t.source["choice_links"][t.fpath[0]];
					else
						acl = fmd["choice_links"];
					if(t.source["choice_params"] && t.source["choice_params"][t.fpath[0]])
						for(var icl in t.source["choice_params"][t.fpath[0]]){
							if(!attr.selection)
								attr.selection = [];
							attr.selection.push(t.source["choice_params"][t.fpath[0]][icl]);
						}
				}else{
					fmd = t.source.o._metadata["tabular_sections"][t.fpath[0]].fields[t.fpath[1]];
					t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
				}

				if(t.mgr){
					if(acl){
						for(var icl in acl){
							if((cl = acl[icl]).path.length == 1)
								sval = t.source.o[cl.path[0]].ref;
							else{
								// TODO: связь по подчиненному реквизиту. надо разыменовать ссылку поля
								// !!! пока не неализовано
								sval = t.source.o[cl.path[0]].ref;
							}
							if(cl.name[1] == "owner")
								attr.owner = sval ;
							else if(cl.name[0] == "selection"){
								if(!attr.selection)
									attr.selection = [];
								var selection = {};
								selection[cl.name[1]] = sval;
								attr.selection.push(selection);
							}
						}
					}
					t.mgr.form_selection(t.source, attr);
				}
			}

			return $p.cancel_bubble(e);
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;
	t.open_selection = open_selection;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : val);
	};

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			if(t.source.tabular_section){
				t.source.row = t.source.o[t.source.tabular_section].get(t.cell.parentNode.idd-1);
				t.source.col = t.source.fields[t.cell.cellIndex];
				t.source.cell = t;
				return t.source.row[t.source.col];
			}else{
				t.fpath = t.grid.getSelectedRowId().split("|");
				if(t.fpath.length < 2) return t.source.o[t.fpath[0]];
				else {
					var vr = t.source.o[t.fpath[0]].find(t.fpath[1]);
					if(vr) return (vr["value"] || vr["Значение"]);
				}
			}
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){
		var ti;
		t.val = t.getValue();		//save current value
		if(t.source.tabular_section){
			t.cell.innerHTML = '<div class="ref_div23"><input type="text" class="dhx_combo_edit" style="height: 22px;"><div class="ref_field23">&nbsp;</div></div>';
		}else{
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';
		}

		td = t.cell.firstChild;
		ti = td.childNodes[0];
		ti.value=t.val ? t.val.presentation : '';
		ti.onclick=$p.cancel_bubble;		//blocks onclick event
		ti.readOnly = true;
		ti.focus();
		ti.onkeydown=ti_keydown;
		td.childNodes[1].onclick=open_selection;
	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.cell.firstChild && t.cell.firstChild.childNodes.length)
			t.setValue(t.cell.firstChild.childNodes[0].value);	//sets the new value
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}
}
eXcell_ref.prototype = eXcell_proto;
window.eXcell_ref = eXcell_ref;

/**
 * Конструктор комбобокса кешируемых ссылочных типов для грида
 */
function eXcell_refc(cell){

	if (!cell) return;

	var t = this,
		slist=function() {
			t.mgr = null;
			var fmd, rt, at, res = [{value:"1", text:"One"}];

			if(t.source.slist)
				return t.source.slist.call(t);

			else if(t.source.tabular_section){
				fmd = t.source.row._metadata.fields[t.source.col];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);

			}else if(t.fpath.length < 2){
				fmd = t.source.o._manager.metadata(t.fpath[0]);
				t.mgr = _md.value_mgr(t.source.o, t.fpath[0], fmd.type);

			}else if(t.fpath[0] == "extra_fields" || t.fpath[0] == "params"){
				return _cch.properties.slist(t.fpath[1]);

			} else{
				fmd = t.source.o._metadata["tabular_sections"][t.fpath[0]].fields[t.fpath[1]];
				t.mgr = _md.value_mgr(t.source.row, t.source.col, fmd.type);
			}

			// если менеджер найден, получаем список у него
			if(t.mgr)
				res = t.mgr.get_option_list(t.val);

			return res;
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : val);
	};

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			if(t.source.tabular_section){
				t.source.row = t.source.o[t.source.tabular_section].get(t.cell.parentNode.idd-1);
				t.source.col = t.source.fields[t.cell.cellIndex];
				t.source.cell = t;
				return t.source.row[t.source.col];
			}else{
				t.fpath = t.grid.getSelectedRowId().split("|");
				if(t.fpath.length < 2)
					return t.source.o[t.fpath[0]];
				else {
					var collection = t.source.o[t.fpath[0]],
						vr = collection.find ? collection.find(t.fpath[1]) : $p._find(collection, t.fpath[1]);
					if(vr)
						return (vr["value"] || vr["Значение"]);
				}
			}
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){

		if(t.combo) return;

		t.val = t.getValue();		//save current value
		t.cell.innerHTML = "";
		t.combo = new dhtmlXCombo({
			parent: t.cell,
			items: slist()
		});

		t.combo.DOMelem.style.border = "none";
		t.combo.DOMelem.style.height = "21px";
		t.combo.DOMelem.style.width = (t.cell.offsetWidth - 8) + "px";
		t.combo.DOMelem_input.style.fontSize = "11px";
		t.combo.DOMelem_input.style.margin = 0;
		t.combo.DOMlist.style.fontSize = "11px";

		t.combo.setFocus();
		t.combo.setComboValue(t.val ? t.val.ref : "");
		t.combo.readonly(true, true);
		t.combo.openSelect();
		t.combo.attachEvent("onChange", function(){
			if(t.source.on_select){
				var sval = (t.mgr || $p.cat["property_values"]).get(t.combo.getSelectedValue(), false);
				setTimeout( function(){t.source.on_select(sval); }, 0 );
			}
		});

	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.combo)
			t.setValue(t.combo.getComboText());
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}

}
eXcell_refc.prototype = eXcell_proto;
window.eXcell_refc = eXcell_refc;

dhtmlXForm.prototype.btn_click = function (id) {

	var t = this, btn, obtn = find_btn.call(t);

	function find_btn(){
		if (!this.itemPull[this.idPrefix+id]) {
			var res = null;
			for (var k in this.itemPull) {
				if (this.itemPull[k]._list && !res) {
					for (var q=0; q<this.itemPull[k]._list.length; q++) {
						if (res == null)
							res = find_btn.call(this.itemPull[k]._list[q]);
					}
				}
			}
			return res;
		} else {
			btn = this.itemPull[this.idPrefix+id];
			return this.objPull[this.idPrefix+id];
		}
	}

	if(btn){

		btn.firstChild.dispatchEvent(new MouseEvent("mousedown"), {
			bubbles: true,
			cancelable: true,
			view: window
		});
		setTimeout(function () {
			btn.firstChild.dispatchEvent(new MouseEvent("mouseup"), {
				bubbles: true,
				cancelable: true,
				view: window
			});
		}, 1);
	}
};

/**
 * ### Визуальный компонент - поле с выпадающим списком
 * - Предназначен для отображения и редактирования ссылочных, в том числе, составных типов данных
 * - Состав списка, фильтрация, редактирование и автообновление значения (байндинг), настраиваются автоматически по описанию метаданных поля, к которому подключается элемент
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

	var _obj, _field, _meta, _mgr, popup_focused, html_btn,
		t = this,
		_pwnd = {on_select: function (selv) {
			_obj[_field] = selv;
		}};

	// выполняем конструктор родительского объекта
	OCombo.superclass.constructor.call(this, attr);
	this.DOMelem.style.marginBottom = "4px";
	if(attr.left)
		this.DOMelem.style.left = left + "px";

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
			t.addOption(_mgr.get_option_list(null, {presentation: {like: text}}, 30));
			t.openSelect();
		}

	});

	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {initial_value: _obj[_field].ref});

		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj();
					});

		} else if(this.name == "open"){
			if(!_obj[_field].empty())
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
	html_btn = this.DOMelem_button;
	dhtmlxEvent(html_btn, "mouseover", function(){

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
		$p.iface.popup.show(dhx4.absLeft(html_btn)-70, dhx4.absTop(html_btn), html_btn.offsetWidth, html_btn.offsetHeight);

		$p.iface.popup.p.onmouseover = function(){
			popup_focused = true;
		};

		$p.iface.popup.p.onmouseout = popup_hide;

	});

	dhtmlxEvent(html_btn, "mouseout", popup_hide);

	dhtmlxEvent(this.DOMelem_input, "keyup", function (e) {

		if(_mgr instanceof EnumManager)
			return;

		if(e.keyCode == 115){ // F4
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj();
			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {initial_value: _obj[_field].ref});
			}
		}
	});

	function observer(changes){
		if(!t.DOMelem.parentElement)
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
		_obj = obj;
		_field = field;
		_meta = meta || obj._metadata.fields[field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr){
			// загружаем список в 30 строк
			t.addOption(_mgr.get_option_list(_obj[_field], null, 30));

			// если поле имеет значение - устанавливаем
			set_value(_obj[_field]);
		}

		// начинаем следить за объектом
		Object.observe(_obj, observer, ["update"]);

	};

	var _unload = this.unload;
	this.unload = function () {
		Object.unobserve(_obj, observer);
		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_unload.call(t);
	};

	// биндим поле объекта
	if(attr.obj && attr.field)
		this.attach(attr.obj, attr.field, attr.meta);
	// устанавливаем url фильтрации
	this.enableFilteringMode("between", "dummy", false, false);

}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;

function data_to_grid(data, attr){

	function cat_picture_class(r){
		var res;
		if(r.is_folder)
			res = "cell_ref_folder";
		else
			res = "cell_ref_elm";
		if(r.deleted)
			res = res + "_deleted";
		return res ;
	}

	function do_format(r, f){
		if(f == "svg")
			return $p.iface.normalize_xml(r[f]);
		if(r[f] instanceof Date){
			if(r[f].getHours() || r.date.getMinutes())
				return $p.dateFormat(r[f], $p.dateFormat.masks.date_time);
			else
				return $p.dateFormat(r[f], $p.dateFormat.masks.date)
		}else
			return r[f] || "";
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", data.length).replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);

	// при первом обращении к методу добавляем описание колонок
	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r, [caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r, [caption.acols[col].id]) + "</cell>";

		xml += "</row>";
	});

	return xml + "</rows>";
}


