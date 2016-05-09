/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
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
		input_filter_changed = 0,
		input_filter_width = 350,
		custom_selection = {};

	if(!attr.pos)
		attr.pos = 6;

	t.__define({

		custom_selection: {
			get: function () {
				return custom_selection;
			},
			enumerable: false,
			configurable: false
		},

		toolbar: {
			get: function () {
				return attr.toolbar;
			},
			enumerable: false,
			configurable: false
		},

		call_event: {
			value: function () {

				if(input_filter_changed){
					clearTimeout(input_filter_changed);
					input_filter_changed = 0;
				}

				attr.onchange.call(t, t.get_filter());
			}
		}

	});

	function onkeydown(){

		if(input_filter_changed)
			clearTimeout(input_filter_changed);

		input_filter_changed = setTimeout(function () {
			if(input_filter_changed)
				t.call_event();
		}, 500);
	}

	// заготовка для адаптивного фильтра
	t.toolbar.addText("div_filter", attr.pos, "");
	t.div = t.toolbar.objPull[t.toolbar.idPrefix + "div_filter"];
	attr.pos++;

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

		t.toolbar.addText("lbl_date_from", attr.pos, "Период с:");
		attr.pos++;
		t.toolbar.addInput("input_date_from", attr.pos, "", 72);
		attr.pos++;
		t.toolbar.addText("lbl_date_till", attr.pos, "по:");
		attr.pos++;
		t.toolbar.addInput("input_date_till", attr.pos, "", 72);
		attr.pos++;

		t.input_date_from = t.toolbar.getInput("input_date_from");
		//t.input_date_from.setAttribute("readOnly", "true");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = t.toolbar.getInput("input_date_till");
		//t.input_date_till.setAttribute("readOnly", "true");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		// подключаем календарь к инпутам
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", t.call_event);

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
		t.toolbar.addText("lbl_filter", attr.pos, "Фильтр");
		attr.pos++;
		t.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = t.toolbar.getInput("input_filter");
		t.input_filter.onchange = t.call_event;
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";

		t.toolbar.addSpacer("input_filter");

	}else if(t.input_date_till)
		t.toolbar.addSpacer("input_date_till");

	else if(t.toolbar.getItemText("btn_delete"))
		t.toolbar.addSpacer("btn_delete");


};
$p.iface.Toolbar_filter.prototype.__define({

	get_filter: {
		value: function () {
			var res = {
				date_from: this.input_date_from ? dhx4.str2date(this.input_date_from.value) : "",
				date_till: this.input_date_till ? dhx4.str2date(this.input_date_till.value) : "",
				filter: this.input_filter ? this.input_filter.value : ""
			}, fld, flt;
			
			for(fld in this.custom_selection){
				if(!res.selection)
					res.selection = [];
				flt = {};
				flt[fld] = this.custom_selection[fld].value;
				res.selection.push(flt);				
			}
			return res;
		}
	},

	add_filter: {
		value: function (elm) {

			var pos = this.toolbar.getPosition("input_filter") - 2,
				id = dhx4.newId(),
				width = (this.toolbar.getWidth("input_filter") / 2).round(0);

			this.toolbar.setWidth("input_filter", width);
			this.toolbar.addText("lbl_"+id, pos, elm.text || "");
			pos++;
			this.toolbar.addInput("input_"+id, pos, "", width);

			this.custom_selection[elm.name] = this.toolbar.getInput("input_"+id);
		}
	}
});
