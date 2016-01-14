/**
 *
 * Created 15.01.2016<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author Evgeniy Malyarov
 * @module settings
 */

/**
 * Служебная функция для открытия окна настроек из гиперссылки
 * @param e
 * @return {Boolean}
 */
$p.iface.open_settings = function (e) {


	// создаём окно с формой настроек
	var evt = (e || (typeof event != "undefined" ? event : undefined)),
		options = {
			name: 'wnd_settings',
			wnd: {
				id: 'wnd_settings',
				top: 130,
				left: 200,
				width: 420,
				height: 360,
				modal: true,
				center: true,
				caption: "Настройки",
				allow_close: true
			}
		},
		wnd = $p.iface.dat_blank(null, options.wnd),
		frm = wnd.attachForm([

			{ type:"settings", labelWidth:80, position:"label-left"  },

			{type: "label", labelWidth:320, label: "Тип устройства", className: "label_options"},
			{ type:"block" , name:"form_block_2", list:[
				{ type:"settings", labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"device_type", labelWidth:120, label:'<i class="fa fa-desktop"></i> Компьютер', value:"desktop"},
				{ type:"newcolumn"   },
				{ type:"radio" , name:"device_type", labelWidth:150, label:'<i class="fa fa-mobile fa-lg"></i> Телефон, планшет', value:"phone"},
			]  },
			{type:"template", label:"",value:"",
				note: {text: "Класс устройства определяется автоматически, но пользователь может задать его явно", width: 320}},

			{type: "label", labelWidth:320, label: "Адрес http сервиса 1С", className: "label_options"},
			{type:"input" , inputWidth: 220, name:"rest_path", label:"Путь", validate:"NotEmpty"},
			{type:"template", label:"",value:"",
				note: {text: "Можно указать как относительный, так и абсолютный URL публикации 1С OData. " +
				"О настройке кроссдоменных запросов к 1С <a href='#'>см. здесь</a>", width: 320}},

			{type: "label", labelWidth:320, label: "Значение разделителя публикации 1С fresh", className: "label_options"},
			{type:"input" , inputWidth: 220, name:"zone", label:"Зона", numberFormat: ["0", "", ""], validate:"NotEmpty,ValidInteger"},
			{type:"template", label:"",value:"",
				note: {text: "Для неразделенной публикации, зона = 0", width: 320}}
		]);

	// инициализация свойств
	frm.checkItem("device_type", $p.wsql.get_user_param("device_type"));
	["zone", "rest_path"].forEach(function (prm) {
		frm.setItemValue(prm, $p.wsql.get_user_param(prm));
	});
	frm.attachEvent("onChange", function (name, value, state){
		$p.wsql.set_user_param(name, value);
	});

	if(evt)
		evt.preventDefault();

	return $p.cancel_bubble(evt);
};