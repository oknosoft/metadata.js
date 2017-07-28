/**
 * ### Кнопки авторизации и синхронизации
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule btn_auth_sync
 * @requires common
 */

/**
 * ### Невизуальный компонент для управления кнопками авторизации и синхронизации на панелях инструментов
 * Изменяет текст, всплывающие подсказки и обработчики нажатий кнопок в зависимости от ...
 *
 * @class OBtnAuthSync
 * @constructor
 * @menuorder 57
 * @tooltip Кнопки авторизации
 */
$p.iface.OBtnAuthSync = function OBtnAuthSync() {

	var bars = [], spin_timer;

	//$(t.tb_nav.buttons.bell).addClass("disabledbutton");

	function btn_click(){

		if($p.wsql.pouch.authorized)
			dhtmlx.confirm({
				title: $p.msg.log_out_title,
				text: $p.msg.logged_in + $p.wsql.pouch.authorized + $p.msg.log_out_break,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						$p.wsql.pouch.log_out();
					}
				}
			});
		else
			$p.iface.frm_auth({
				modal_dialog: true
				//, try_auto: true
			});
	}

	function set_spin(spin){

		if(spin && spin_timer){
			clearTimeout(spin_timer);

		}else{
			bars.forEach(function (bar) {
				if(spin)
					bar.buttons.sync.innerHTML = '<i class="fa fa-refresh fa-spin md-fa-lg"></i>';
				else{
					if($p.wsql.pouch.authorized)
						bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
					else
						bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
				}
			});
		}
		spin_timer = spin ? setTimeout(set_spin, 3000) : 0;
	}

	function set_auth(){

		bars.forEach(function (bar) {

			if($p.wsql.pouch.authorized){
				// bar.buttons.auth.title = $p.msg.logged_in + $p.wsql.pouch.authorized;
				// bar.buttons.auth.innerHTML = '<i class="fa fa-sign-out md-fa-lg"></i>';
				bar.buttons.auth.title = "Отключиться от сервера";
				bar.buttons.auth.innerHTML = '<span class="span_user">' + $p.wsql.pouch.authorized + '</span>';
				bar.buttons.sync.title = "Синхронизация выполняется...";
				bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
			}else{
				bar.buttons.auth.title = "Войти на сервер и включить синхронизацию данных";
				bar.buttons.auth.innerHTML = '&nbsp;<i class="fa fa-sign-in md-fa-lg"></i><span class="span_user">Вход...</span>';
				bar.buttons.sync.title = "Синхронизация не выполняется - пользователь не авторизован на сервере";
				bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
					//'<i class="fa fa-refresh fa-stack-1x"></i>' +
					//'<i class="fa fa-ban fa-stack-2x text-danger"></i>' +
					//'</span>';
			}
		})
	}

	/**
	 * Привязывает обработчики к кнопке
	 * @param btn
	 */
	this.bind = function (bar) {
		bar.buttons.auth.onclick = btn_click;
		//bar.buttons.auth.onmouseover = null;
		//bar.buttons.auth.onmouseout = null;
		bar.buttons.sync.onclick = null;
		// bar.buttons.sync.onmouseover = sync_mouseover;
		// bar.buttons.sync.onmouseout = sync_mouseout;
		bars.push(bar);
		setTimeout(set_auth);
		return bar;
	};

	this.listeners = {

    pouch_load_data_start: function (page) {

      if(!$p.iface.sync)
        $p.iface.wnd_sync();
      $p.iface.sync.create($p.eve.stepper);
      $p.eve.stepper.frm_sync.setItemValue("text_bottom", "Читаем справочники");

      if(page.hasOwnProperty("local_rows") && page.local_rows < 10){
        $p.eve.stepper.wnd_sync.setText("Первый запуск - подготовка данных");
        $p.eve.stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
      }else{
        $p.eve.stepper.wnd_sync.setText("Загрузка данных из IndexedDB");
        $p.eve.stepper.frm_sync.setItemValue("text_processed", "Извлечение начального образа");
      }

      set_spin(true);
    },

    pouch_load_data_page: function (page) {
      set_spin(true);
      var stepper = $p.eve.stepper;
      if(stepper.wnd_sync){
        var curr = stepper[page.id || "ram"];
        curr.total_rows = page.total_rows;
        curr.page = page.page;
        curr.docs_written = page.docs_written || page.page * page.limit;
        if(curr.docs_written > curr.total_rows){
          curr.total_rows = (curr.docs_written * 1.05).round(0);
        }
        var text_current, text_bottom;
        if(!stepper.doc.docs_written){
          text_current = "Обработано элементов: " + curr.docs_written + " из " + curr.total_rows;
          text_bottom = "Текущий запрос: " + curr.page + " (" + (100 * curr.docs_written/curr.total_rows).toFixed(0) + "%)";
        }
        else{
          var docs_written = stepper.ram.docs_written + stepper.doc.docs_written;
          var total_rows = stepper.ram.total_rows + stepper.doc.total_rows;
          curr = stepper.ram.page + stepper.doc.page;
          text_current = "Обработано ram: " + stepper.ram.docs_written + " из " + stepper.ram.total_rows + "<br />" +
            "Обработано doc: " + stepper.doc.docs_written + " из " + stepper.doc.total_rows;
          text_bottom = "Текущий запрос: " + curr + " (" + (100 * docs_written/total_rows).toFixed(0) + "%)";
        };
        stepper.frm_sync.setItemValue("text_current", text_current);
        stepper.frm_sync.setItemValue("text_bottom", text_bottom);
      }
    },

    pouch_change: function (id, page) {
      set_spin(true);
    },

    pouch_data_loaded: function (page) {
      $p.eve.stepper.wnd_sync && $p.iface.sync.close();
    },

    pouch_load_data_error: function (err) {
      set_spin();
      $p.eve.stepper.wnd_sync && $p.iface.sync.close();
    },

    user_log_in: function (username) {
      set_auth();
    },

    user_log_fault: function () {
      set_auth();
    },

    user_log_out: function () {
      set_auth();
    }
  }

  this.unload = function () {
    for(var name in this.listeners){
      $p.adapters.pouch.off(name, this.listeners[name]);
    }
    bars.forEach(function (bar) {

    });
  }

	$p.adapters.pouch.on(this.listeners);
};


