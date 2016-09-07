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
class JobPrm{

	constructor(){

		this.__define({

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
			},



			/**
			 * Адрес http интерфейса библиотеки интеграции
			 * @method irest_url
			 * @return {string}
			 */
			irest_url: {
				value: function () {
					var url = base_url(),
						zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
					url = url.replace("odata/standard.odata", "hs/rest");
					if(zone)
						return url.replace("%1", zone);
					else
						return url.replace("%1/", "");
				}
			}
		});

	}

	init_params(){

		// подмешиваем параметры, заданные в файле настроек сборки
		// TODO обработать установку параметров более цивилизованным способом
		// $p.eve.callEvent("settings", [this]);

		// подмешиваем параметры url
		// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
		for(var prm_name in this){
			if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
				this[prm_name] = this.url_prm[prm_name];
		}
	}

	base_url(){
		return $p.wsql.get_user_param("rest_path") || this.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	/**
	 * Осуществляет синтаксический разбор параметров url
	 * @method parse_url
	 * @return {Object}
	 */
	parse_url(){

		function parse(url_prm){
			var prm = {}, tmp = [], pairs;

			if(url_prm.substr(0, 1) === "#" || url_prm.substr(0, 1) === "?")
				url_prm = url_prm.substr(1);

			if(url_prm.length > 2){

				pairs = decodeURI(url_prm).split('&');

				// берём параметры из url
				for (var i in pairs){   //разбиваем пару на ключ и значение, добавляем в их объект
					tmp = pairs[i].split('=');
					if(tmp[0] == "m"){
						try{
							prm[tmp[0]] = JSON.parse(tmp[1]);
						}catch(e){
							prm[tmp[0]] = {};
						}
					}else
						prm[tmp[0]] = tmp[1] || "";
				}
			}

			return prm;
		}

		return utils._mixin(parse(location.search), parse(location.hash));
	}

	/**
	 * Адрес стандартного интерфейса 1С OData
	 * @method rest_url
	 * @return {string}
	 */
	rest_url() {
		var url = this.base_url(),
		zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
		if(zone)
		return url.replace("%1", zone);
		else
		return url.replace("%1/", "");
	}

	/**
	 * Параметры запроса по умолчанию
	 * @param attr
	 * @param url
	 */
	ajax_attr(attr, url) {
		if (!attr.url)
			attr.url = url;
		if (!attr.username)
			attr.username = this.username;
		if (!attr.password)
			attr.password = this.password;
		attr.hide_headers = true;
	}

}