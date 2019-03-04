/**
 * ### Виджет элементов фильтра для панели инструментов форм списка и выбора
 * объединяет поля выбора периода и поле ввода фильтра
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule wdg_filter
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
 * @menuorder 57
 * @tooltip Фильтр динсписка
 */
$p.iface.Toolbar_filter = function Toolbar_filter(attr) {

	var t = this,
		input_filter_changed = 0,
		input_filter_width = $p.job_prm.device_type == "desktop" ? 200 : 120,
		custom_selection = {};

	if(!attr.pos)
		attr.pos = 6;

	t.__define({

		custom_selection: {
			get: function () {
				return custom_selection;
			}
		},

		toolbar: {
			get: function () {
				return attr.toolbar;
			}
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

  function onkeydown() {

    if(input_filter_changed) {
      clearTimeout(input_filter_changed);
    }

    if(!t.disable_timer) {
      input_filter_changed = setTimeout(function () {
        input_filter_changed && t._prev_input_filter != t.input_filter.value && t.call_event();
      }, 750);
    }

  }

  // заготовка для адаптивного фильтра
	t.toolbar.addText("div_filter", attr.pos, "");
	t.div = t.toolbar.objPull[t.toolbar.idPrefix + "div_filter"];
	attr.pos++;

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.manager instanceof BusinessProcessManager || attr.manager instanceof TaskManager || attr.period){

		// TODO: подключить вместо календарей daterangepicker

		// управляем доступностью дат в миникалендаре
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		input_filter_width = $p.job_prm.device_type == "desktop" ? 160 : 120;

		t.toolbar.addInput("input_date_from", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
		attr.pos++;
		t.toolbar.addText("lbl_date_till", attr.pos, "-");
		attr.pos++;
		t.toolbar.addInput("input_date_till", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
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
			attr.date_till = $p.utils.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.moment(attr.date_from).format("L");
		t.input_date_till.value=$p.moment(attr.date_till).format("L");

		// для документов, кешируемых в doc, добавляем фильтрацию по индексу
		if(attr.manager.cachable == "doc" && !attr.custom_selection){

			custom_selection._view = {
				get value(){
					return 'doc/by_date';
				}
			};
			custom_selection._key = {
				get value(){
					var filter = t.get_filter(true);
					return {
						startkey: [attr.manager.class_name, filter.date_from.getFullYear(), filter.date_from.getMonth()+1, filter.date_from.getDate()],
						endkey: [attr.manager.class_name, filter.date_till.getFullYear(), filter.date_till.getMonth()+1, filter.date_till.getDate()],
						_drop_date: true,
						_order_by: true,
						_search: filter.filter.toLowerCase()
					};
				}
			};
		}
	}

	// текстовое поле фильтра по подстроке
	if(!attr.hide_filter){

		t.toolbar.addSeparator("filter_sep", attr.pos);
		attr.pos++;

		t.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = t.toolbar.getInput("input_filter");
		t.input_filter.onchange = function () {
		  t._prev_input_filter != t.input_filter.value && t.call_event();
    };
		t.input_filter.onclick = function () {
			var val = t.input_filter.value;
			setTimeout(function () {
				if(val != t.input_filter.value)
					t.call_event();
			})
		};
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";
		t.input_filter.setAttribute("placeholder", "Фильтр");
		if(attr.filter) {
      t.input_filter.value = attr.filter;
    }

		t.toolbar.addSpacer("input_filter");

	}
  else if(t.input_date_till) {
    t.toolbar.addSpacer("input_date_till");
  }
  else {
    t.toolbar.addSpacer('div_filter');
  }

};

$p.iface.Toolbar_filter.prototype.__define({

	get_filter: {
		value: function (exclude_custom) {

		  if(this.input_filter){
        this._prev_input_filter = this.input_filter.value;
      }

			var res = {
				date_from: this.input_date_from ? $p.utils.date_add_day(dhx4.str2date(this.input_date_from.value), 0, true) : "",
				date_till: this.input_date_till ? $p.utils.date_add_day(dhx4.str2date(this.input_date_till.value), 0, true) : "",
				filter: this.input_filter ? this.input_filter.value : ""
			}, fld, flt;

			if(!exclude_custom){
				for(fld in this.custom_selection){
					if(!res.selection)
						res.selection = [];
					flt = {};
					flt[fld] = this.custom_selection[fld].value;
					res.selection.push(flt);
				}
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
			return this;
		}
	}

});
