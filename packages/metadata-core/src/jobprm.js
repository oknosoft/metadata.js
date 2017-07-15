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
export default class JobPrm {

	constructor($p) {
		this.$p = $p;
		this.local_storage_prefix = '';
		this.create_tables = true;
	}

	init(settings) {
		// подмешиваем параметры, заданные в файле настроек сборки
		if (typeof settings == 'function')
			settings(this);
	}

	base_url() {
		return this.$p.wsql.get_user_param('rest_path') || this.rest_path || '/a/zd/%1/odata/standard.odata/';
	}

	/**
	 * Адрес стандартного интерфейса 1С OData
	 * @method rest_url
	 * @return {string}
	 */
	rest_url() {
		const url = this.base_url();
		const zone = this.$p.wsql.get_user_param('zone', this.zone_is_string ? 'string' : 'number');
		return zone ? url.replace('%1', zone) : url.replace('%1/', '');
	}

	/**
	 * Адрес http интерфейса библиотеки интеграции
	 * @method irest_url
	 * @return {string}
	 */
	irest_url() {
		const url = this.base_url().replace('odata/standard.odata', 'hs/rest');
		const zone = this.$p.wsql.get_user_param('zone', this.zone_is_string ? 'string' : 'number');
		return zone ? url.replace('%1', zone) : url.replace('%1/', '');
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
