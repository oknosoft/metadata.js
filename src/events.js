/**
 * Содержит методы обработки событий __при запуске__ программы, __перед закрытием__,<br />
 * при обновлении файлов __ApplicationCache__, а так же, при переходе в __offline__ и __online__
 *
 *	События развиваются в такой последовательности:
 *
 *	1) выясняем, совместим ли браузер. В зависимости от параметров url и параметров по умолчанию,
 *	 может произойти переход в ChromeStore или другие действия
 *
 *	2) анализируем AppCache, при необходимости обновляем скрипты и перезагружаем страницу
 *
 * 	3) инициализируем $p.wsql и комбинируем параметры работы программы с параметрами url
 *
 * 	4) если режим работы предполагает использование построителя, подключаем слушатель его событий.
 *	 по событию построителя "ready", выполняем метод initMainLayout() объекта $p.iface.
 *	 Метод initMainLayout() переопределяется во внешним, по отношению к ядру, модуле
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule events
 */

/**
 * ### Обработчики событий приложения
 *
 * Cм. так же, модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events_browser"}}{{/crossLinkModule}}
 *
 * @class AppEvents
 * @static
 * @menuorder 30
 * @tooltip Движок событий
 */
function AppEvents() {

	this.__define({

		/**
		 * ### Запускает процесс инициализаци параметров и метаданных
		 *
		 * @method run
		 * @for AppEvents
		 *
		 */
		init: {
			value: function () {
				$p.__define("job_prm", {
					value: new JobPrm(),
					writable: false
				});
				$p.wsql.init_params();
			}
		},


	});

	// если мы внутри браузера и загружен dhtmlx, переносим в AppEvents свойства dhx4
	if(typeof window !== "undefined" && window.dhx4){
		for(var p in dhx4){
			this[p] = dhx4[p];
			delete dhx4[p];
		}
		window.dhx4 = this;

	}else if(typeof WorkerGlobalScope === "undefined"){

		// мы внутри Nodejs

		this.do_eventable(this);

	}

}

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 *
 * @class JobPrm
 * @static
 * @menuorder 04
 * @tooltip Параметры приложения
 */
function JobPrm(){

	this.__define({

		offline: {
			value: false,
			writable: true
		},

		local_storage_prefix: {
			value: "",
			writable: true
		},

		create_tables: {
			value: true,
			writable: true
		},

		/**
		 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
		 * @property url_prm
		 * @type {Object}
		 * @static
		 */
		url_prm: {
			value: typeof window != "undefined" ? this.parse_url() : {}
		}

	});

	// подмешиваем параметры, заданные в файле настроек сборки
	$p.eve.callEvent("settings", [this]);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

};

JobPrm.prototype.__define({

  base_url: {
    value: function (){
      return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
    }
  },

  /**
   * Осуществляет синтаксический разбор параметров url
   * @method parse_url
   * @return {Object}
   */
  parse_url_str: {
    value: function (prm_str) {
      var prm = {}, tmp = [], pairs;

      if (prm_str[0] === "#" || prm_str[0] === "?")
        prm_str = prm_str.substr(1);

      if (prm_str.length > 2) {

        pairs = decodeURI(prm_str).split('&');

        // берём параметры из url
        for (var i in pairs) {   //разбиваем пару на ключ и значение, добавляем в их объект
          tmp = pairs[i].split('=');
          if (tmp[0] == "m") {
            try {
              prm[tmp[0]] = JSON.parse(tmp[1]);
            } catch (e) {
              prm[tmp[0]] = {};
            }
          } else
            prm[tmp[0]] = tmp[1] || "";
        }
      }

      return prm;
    }
  },

  /**
   * Осуществляет синтаксический разбор параметров url
   * @method parse_url
   * @return {Object}
   */
  parse_url: {
    value: function () {
      return this.parse_url_str(location.search)._mixin(this.parse_url_str(location.hash));
    }
  },

  /**
   * Адрес стандартного интерфейса 1С OData
   * @method rest_url
   * @return {string}
   */
  rest_url: {
    value: function () {
      var url = this.base_url(),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  },

  /**
   * Адрес http интерфейса библиотеки интеграции
   * @method irest_url
   * @return {string}
   */
  irest_url: {
    value: function () {
      var url = this.base_url().replace("odata/standard.odata", "hs/rest"),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  }

});



