/**
 * Форма обновления кеша appcache
 */

function wnd_appcache ($p) {
	var _appcache = $p.iface.appcache = {},
		_stepper;

	_appcache.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_appcache.update = function(){
		_stepper.frm_appcache.setItemValue("text_processed", "Обработано элементов: " + _stepper.loaded + " из " + _stepper.total);

	};

	_appcache.close = function(){
		if(_stepper && _stepper.wnd_appcache){
			_stepper.wnd_appcache.close();
			delete _stepper.wnd_appcache;
		}
	};


	function frm_create(){
		_stepper.wnd_appcache = $p.iface.w.createWindow('wnd_appcache', 0, 0, 490, 250);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_script },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_appcache = _stepper.wnd_appcache.attachForm(str);
		_stepper.frm_appcache.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.wnd_appcache.setText($p.msg.long_operation);
		_stepper.wnd_appcache.denyResize();
		_stepper.wnd_appcache.centerOnScreen();
		_stepper.wnd_appcache.button('park').hide();
		_stepper.wnd_appcache.button('minmax').hide();
		_stepper.wnd_appcache.button('close').hide();
	}

}