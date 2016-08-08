/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module odaterangepicker
 * Created 02.08.2016
 */

function ODateRangePicker(container, attr) {

	var _cont = this._cont = document.createElement('div');

	if(container instanceof dhtmlXCellObject){
		container.appendObject(this._cont);
	}else{
		container.appendChild(this._cont);
	}

	this._cont.className = "odaterangepicker";
	this._cont.innerHTML = '<i class="fa fa-calendar"></i>&nbsp; <span></span> &nbsp;<i class="fa fa-caret-down"></i>';

	this.__define({

		set_text: {
			value: 	function() {
				$('span', _cont).html(this.date_from.format('DD MMM YY') + ' - ' + this.date_till.format('DD MMM YY'));
			}
		},

		on: {
			value: function (event, fn) {
				return $(_cont).on(event, fn);
			}
		},

		date_from: {
			get: function () {
				return $(_cont).data('daterangepicker').startDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setStartDate(v);
				this.set_text()
			}
		},

		date_till: {
			get: function () {
				return $(_cont).data('daterangepicker').endDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setEndDate(v);
				this.set_text()
			}
		}
	});

	$(_cont).daterangepicker({
		startDate: attr.date_from ? moment(attr.date_from) : moment().subtract(29, 'days'),
		endDate: moment(attr.date_till),
		showDropdowns: true,
		alwaysShowCalendars: true,
		opens: "left",
		ranges: {
			'Сегодня': [moment(), moment()],
			'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Последние 7 дней': [moment().subtract(6, 'days'), moment()],
			'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
			'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
			'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, this.set_text.bind(this));

	this.set_text();

}

$p.iface.ODateRangePicker = ODateRangePicker;