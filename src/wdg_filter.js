/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wdg_filter
 * @requires common
 */

/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * @param attr {Object} - параметры создаваемого виджета
 * @param attr.manager {DataManager}
 * @param attr.toolbar {dhtmlXToolbarObject}
 * @param [attr.pos=7] {Number} - номер элемента на тулбаре, после которого вставлять виджет
 * @param [attr.date_from]
 * @param [attr.date_till]
 * @constructor
 */
$p.iface.Toolbar_filter = function (attr) {

	var t = this,
		input_filter_width = 350,
		input_filter_changed = 0;

	if(!attr.pos)
		attr.pos = 6;

	function onchange(){

		if(input_filter_changed){
			clearTimeout(input_filter_changed);
			input_filter_changed = 0;
		}

		attr.onchange.call(t, t.get_filter());
	}

	function onkeydown(){

		if(input_filter_changed)
			clearTimeout(input_filter_changed);

		input_filter_changed = setTimeout(function () {
			if(input_filter_changed)
				onchange();
		}, 600);
	}

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.period){

		// управляем доступностью дат в миникалендаре
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		input_filter_width = 180;

		attr.toolbar.addText("lbl_date_from", attr.pos, "Период с:");
		attr.pos++;
		attr.toolbar.addInput("input_date_from", attr.pos, "", 72);
		attr.pos++;
		attr.toolbar.addText("lbl_date_till", attr.pos, "по:");
		attr.pos++;
		attr.toolbar.addInput("input_date_till", attr.pos, "", 72);
		attr.pos++;

		t.input_date_from = attr.toolbar.getInput("input_date_from");
		t.input_date_from.setAttribute("readOnly", "true");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = attr.toolbar.getInput("input_date_till");
		t.input_date_till.setAttribute("readOnly", "true");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		// подключаем календарь к инпутам
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", onchange);

		// начальные значения периода
		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.dateFormat(attr.date_from, $p.dateFormat.masks.short_ru);
		t.input_date_till.value=$p.dateFormat(attr.date_till, $p.dateFormat.masks.short_ru);

	}

	// текстовое поле фильтра по подстроке
	if(!attr.hide_filter){
		attr.toolbar.addText("lbl_filter", attr.pos, "Фильтр");
		attr.pos++;
		attr.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = attr.toolbar.getInput("input_filter");
		t.input_filter.onchange = onchange;
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";

		attr.toolbar.addSpacer("input_filter");

	}else
		attr.toolbar.addSpacer("input_date_till");

	t.get_filter = function () {
		return {
			date_from: t.input_date_from ? dhx4.str2date(t.input_date_from.value) : "",
			date_till: t.input_date_till ? dhx4.str2date(t.input_date_till.value) : "",
			filter: t.input_filter ? t.input_filter.value : ""
		}
	}


};
