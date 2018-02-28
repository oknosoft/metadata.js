/**
 * Расширение типов ячеек dhtmlXGrid
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует конструкторы:
 * * **eXcell_ref** - поля ввода значений ссылочных типов
 * * **eXcell_refc** - комбобокс ссылочных типов (перечисления и короткие справочники)
 *
 * @module  wdg_dhtmlx
 * @requires common
 */

// Прототип кустомных ячеек для грида
var eXcell_proto = new eXcell();

/**
 * Обработчик клавиш {tab}, {enter} и {F4} в поле ввода
 */
eXcell_proto.input_keydown = function(e, t){

	function obj_on_select(v){
    t.source && t.source.on_select && t.source.on_select.call(t.source, v);
	}

	if(e.keyCode === 8 || e.keyCode === 46){          // по {del} и {bs} очищаем значение
		t.setValue("");
		t.grid.editStop();
    t.source && t.source.on_select && t.source.on_select.call(t.source, "");
	}
	else if(e.keyCode === 9 || e.keyCode === 13)
		t.grid.editStop();                          // по {tab} и {enter} заканчиваем редактирование

	else if(e.keyCode === 115)
		t.cell.firstChild.childNodes[1].onclick(e); // по {F4} открываем форму списка

	else if(e.keyCode === 113){                      // по {F2} открываем форму объекта
		if(t.source.tabular_section){
			t.mgr = _md.value_mgr(t.source.row, t.source.col, typeof t.source.row._metadata == 'function' ?
        t.source.row._metadata(t.source.col).type : t.source.row._metadata.fields[t.source.col].type);
			if(t.mgr){
				var tv = t.source.row[t.source.col];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}

		}else if(t.fpath.length==1){
			t.mgr = _md.value_mgr(t.source.o._obj, t.fpath[0], typeof t.source.o._metadata == 'function' ?
        t.source.o._metadata(t.fpath[0]).type : t.source.o._metadata.fields[t.fpath[0]].type);
			if(t.mgr){
				var tv = t.source.o[t.fpath[0]];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}
	}

	return $p.iface.cancel_bubble(e);
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
			parent: t.cell,
			grid: t.grid
		}._mixin(t.grid.get_cell_field()));
		t.combo.getInput().focus();
	};

  t.open_selection = function () {
    t.edit();
    t.combo && t.combo.open_selection && t.combo.open_selection();
  }

	/**
	 * вызывается при отключении редактора
	 * @return {boolean} - если "истина", значит объект был изменён
	 */
	t.detach=function(){
		if(t.combo){

			if(t.combo.getComboText){
				t.setValue(t.combo.getComboText());         // текст в элементе управления
				if(!t.combo.getSelectedValue())
					t.combo.callEvent("onChange");
				var res = !$p.utils.is_equal(t.val, t.getValue());// compares the new and the old values
				t.combo.unload();
				return res;

			} else if(t.combo.unload){
				t.combo.unload();
			}
		}
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

eXcell_dhxCalendar.prototype.setCValue = function(val, val2){
	this.cell.innerHTML = val instanceof Date ? this.grid._grid_calendarA._dateToStr(val) : val;
	this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString()
//#__pro_feature:21092006{
//#on_cell_changed:23102006{
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		(arguments.length > 1 ? val2 : val)
	]);
//#}
//#}
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
				password = $p.aes.Ctr.decrypt($p.ajax.password);

			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);

				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
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

		var t = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
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

		if (method == "GET") {
			url += this._dhxr(url);
		}

		t.open(method, url, async);

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

		if (async != true) {
			if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) {
				if (t.status != 200 || t.responseText == "") dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}]);
			}
		}

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

/**
 * Проверяет, видна ли ячейка
 * TODO: учесть слой, модальность и т.д.
 */
dhtmlXCellObject.prototype.is_visible = function () {
	var rect = this.cell.getBoundingClientRect();
	return rect.right > 0 && rect.bottom > 0;
};


$p.iface.data_to_grid = function (data, attr){

	if(this.data_to_grid)
		return this.data_to_grid(data, attr);

	function cat_picture_class(r){
		var res;
		if(r.hasOwnProperty("posted")){
			res = r.posted ? "cell_doc_posted" : "cell_doc";
		}else{
			res = r.is_folder ? "cell_ref_folder" : "cell_ref_elm";
		}

		if(r._deleted)
			res = res + "_deleted";
		return res ;
	}

	function do_format(v){

		if(v instanceof Date){
			if(v.getHours() || v.getMinutes())
				return $p.moment(v).format($p.moment._masks.date_time);
			else
				return $p.moment(v).format($p.moment._masks.date);

		}else
			return typeof v == "number" ? v : $p.iface.normalize_xml(v || "");
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", attr._total_count || data.length)
      .replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);

	// при первом обращении к методу добавляем описание колонок
	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r[caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r[caption.acols[col].id]) + "</cell>";

		xml += "</row>";
	});

	return xml + "</rows>";
};

/**
 * Создаёт иерархический объект для построения dhtmlxTreeView
 * @param data
 * @return {*[]}
 */
$p.iface.data_to_tree = function (data) {

	var res = [{id: $p.utils.blank.guid, text: "..."}];

	function add_hierarchically(arr, row){
		var curr = {id: row.ref, text: row.presentation, items: []};
		arr.push(curr);
		$p.utils._find_rows(data, {parent: row.ref}, function(r){
			add_hierarchically(curr.items, r);
		});
		if(!curr.items.length)
			delete curr.items;
	}
	$p.utils._find_rows(data, {parent: $p.utils.blank.guid}, function(r){
		add_hierarchically(res, r);
	});

	return res;
};


