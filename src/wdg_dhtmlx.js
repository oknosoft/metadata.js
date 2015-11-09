/**
 * Расширение типов ячеек dhtmlXGrid
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
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

	if(e.keyCode === 8 || e.keyCode === 46){          // по {del} и {bs} очищаем значение
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source, "");

	}else if(e.keyCode === 9 || e.keyCode === 13)
		t.grid.editStop();                          // по {tab} и {enter} заканчиваем редактирование

	else if(e.keyCode === 115)
		t.cell.firstChild.childNodes[1].onclick(e); // по {F4} открываем редактор

	else if(e.keyCode === 113){                      // по {F2} открываем форму объекта
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
 * Конструктор поля ввода со списком OCombo
 * @param cell
 */
function eXcell_ocombo(cell){

	if (!cell)
		return;

	var t = this;

	t.cell = cell;
	t.grid = cell.parentNode.grid;

	/**
	 * устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : (val || ""));
	};

	/**
	 * получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		return t.grid.get_cell_value();

	};

	/**
	 * Обрабатывает событие перехода к следующему полю (окончание редактирования)
	 */
	t.shiftNext = function () {
		t.grid.editStop();
	};

	/**
	 * Cоздаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){

		if(t.combo)
			return;

		t.val = t.getValue();		//save current value
		t.cell.innerHTML = "";
		t.combo = new OCombo({
			parent: t.cell
		}._mixin(t.grid.get_cell_field()));
		t.combo.getInput().focus();
	};

	/**
	 * вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.combo && t.combo.getComboText){
			t.setValue(t.combo.getComboText());         // текст в элементе управления
			if(!t.combo.getSelectedValue())
				t.combo.callEvent("onChange");
			var res = !$p.is_equal(t.val, t.getValue());// compares the new and the old values
			t.combo.unload();
			return res;
		} else
			return true;
	}
}
eXcell_ocombo.prototype = eXcell_proto;
window.eXcell_ocombo = eXcell_ocombo;

/**
 * Конструктор поля ввода значений ссылочных типов для грида
 * @param cell
 */
window.eXcell_ref = eXcell_ocombo;

/**
 * Конструктор комбобокса кешируемых ссылочных типов для грида
 */
window.eXcell_refc = eXcell_ocombo;

/**
 * Конструктор поля пароля
 */
function eXcell_pwd(cell){ //the eXcell name is defined here

	var fnedit;
	if (cell){                //the default pattern, just copy it
		this.cell = cell;
		this.grid = cell.parentNode.grid;
		eXcell_ed.call(this); //uses methods of the "ed" type
		fnedit = this.edit;
		this.edit = function(){
			fnedit.call(this);
			this.obj.type="password";
		};
		this.setValue=function(){
			this.setCValue("*********");
		};
		this.getValue=function(){
			return this.grid.get_cell_value();

		};
		this.detach=function(){
			if(this.grid.get_cell_field){
				var cf = this.grid.get_cell_field();
				cf.obj[cf.field] = this.obj.value;
			}
			this.setValue();
			fnedit = null;
			return this.val != this.getValue();
		}
	}
}
eXcell_pwd.prototype = eXcell_proto;
window.eXcell_pwd = eXcell_pwd;

/**
 * Выполняет программный клик по кнопке, расположенной на dhtmlXForm
 * @param id {String} - имя кнопки
 */
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

dhtmlXCalendarObject.prototype._dateToStr = function(val, format) {
	if(val instanceof Date && val.getFullYear() < 1000)
		return "";
	else
		return window.dhx4.date2str(val, format||this._dateFormat, this._dateStrings());
};

eXcell_dhxCalendar.prototype.edit = function() {

	var arPos = this.grid.getPosition(this.cell);
	this.grid._grid_calendarA._show(false, false);
	this.grid._grid_calendarA.setPosition(arPos[0],arPos[1]+this.cell.offsetHeight);
	this.grid._grid_calendarA._last_operation_calendar = false;


	this.grid.callEvent("onCalendarShow", [this.grid._grid_calendarA, this.cell.parentNode.idd, this.cell._cellIndex]);
	this.cell._cediton = true;
	this.val = this.cell.val;
	if(this.val instanceof Date && this.val.getFullYear() < 1000)
		this.val = new Date();
	this._val = this.cell.innerHTML;
	var t = this.grid._grid_calendarA.draw;
	this.grid._grid_calendarA.draw = function(){};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d.%m.%Y"));
	this.grid._grid_calendarA.setDate(this.val||(new Date()));
	this.grid._grid_calendarA.draw = t;

};

/**
 * fix ajax
 */
(function(){

	function fix_auth(t, method, url, async){
		if(url.indexOf("odata/standard.odata") != -1 || url.indexOf("/hs/rest") != -1){
			var username, password;
			if($p.ajax.authorized){
				username = $p.ajax.username;
				password = $p.ajax.password;
			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.job_prm.guest_pwd;
				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.wsql.get_user_param("user_pwd");
				}
			}
			t.open(method, url, async, username, password);
			t.withCredentials = true;
			t.setRequestHeader("Authorization", "Basic " +
				btoa(unescape(encodeURIComponent(username + ":" + password))));
		}else
			t.open(method, url, async);
	}

	dhx4.ajax._call = function(method, url, postData, async, onLoad, longParams, headers) {

		var t = (window.XMLHttpRequest && !dhx4.isIE ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		var isQt = (navigator.userAgent.match(/AppleWebKit/) != null && navigator.userAgent.match(/Qt/) != null && navigator.userAgent.match(/Safari/) != null);

		if (async == true) {
			t.onreadystatechange = function() {
				if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) { // what for long response and status 404?
					if (t.status != 200 || t.responseText == "")
						if (!dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}])) return;

					window.setTimeout(function(){
						if (typeof(onLoad) == "function") {
							onLoad.apply(window, [{xmlDoc:t, filePath:url, async:async}]); // dhtmlx-compat, response.xmlDoc.responseXML/responseText
						}
						if (longParams != null) {
							if (typeof(longParams.postData) != "undefined") {
								dhx4.ajax.postLong(longParams.url, longParams.postData, onLoad);
							} else {
								dhx4.ajax.getLong(longParams.url, onLoad);
							}
						}
						onLoad = null;
						t = null;
					},1);
				}
			}
		}

		if (method == "GET" && this.cache != true) {
			url += (url.indexOf("?")>=0?"&":"?")+"dhxr"+new Date().getTime()+"=1";
		}

		// если обращение по rest или irest, добавляем авторизацию
		fix_auth(t, method, url, async);

		if (headers != null) {
			for (var key in headers) t.setRequestHeader(key, headers[key]);
		} else if (method == "POST" || method == "PUT" || method == "DELETE") {
			t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else if (method == "GET") {
			postData = null;
		}

		t.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		t.send(postData);

		return {xmlDoc:t, filePath:url, async:async}; // dhtmlx-compat, response.xmlDoc.responseXML/responseText

	};

	dhtmlx.ajax.prototype.send = function(url,params,call){
		var x=this.getXHR();
		if (typeof call == "function")
			call = [call];
		//add extra params to the url
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhtmlx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));// utf-8 escaping
			}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}

		//x.open(this.post?"POST":"GET",url,!this._sync);
		fix_auth(x, this.post?"POST":"GET",url,!this._sync);

		if (this.post)
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		//async mode, define loading callback
		//if (!this._sync){
		var self=this;
		x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				//dhtmlx.log_full_time("data_loading");	//log rendering time
				if (call && self)
					for (var i=0; i < call.length; i++)	//there can be multiple callbacks
						if (call[i])
							call[i].call((self.master||self),x.responseText,x.responseXML,x);
				self.master=null;
				call=self=null;	//anti-leak
			}
		};
		//}

		x.send(params||null);
		return x; //return XHR, which can be used in case of sync. mode
	}

})();



$p.iface.data_to_grid = function (data, attr){

	if(this.data_to_grid)
		return this.data_to_grid(data, attr);

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
};

$p.iface.data_to_tree = function (data) {

	var xml = "<?xml version='1.0' encoding='UTF-8'?><tree id=\"0\">";

	function add_hierarchically(row, adata){
		xml = xml + "<item text=\"" +
			row.presentation.replace(/"/g, "'") +	"\" id=\"" +
			row.ref + "\" im0=\"folderClosed.gif\">";
		$p._find_rows(adata, {parent: row.ref}, function(r){
			add_hierarchically(r, adata)
		});
		xml = xml + "</item>";
	}

	add_hierarchically({presentation: "...", ref: $p.blank.guid}, []);
	$p._find_rows(data, {parent: $p.blank.guid}, function(r){
		add_hierarchically(r, data)
	});

	return xml + "</tree>";
};


