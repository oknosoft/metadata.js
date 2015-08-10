/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 08.08.2015
 * @module  codres
 */

$p.eve.redirect = true;

$p.settings = function (prm, modifiers) {
	prm.create_tables = true;
	prm.create_tables_sql = require('create_tables');
	prm.allow_post_message = "*";
};

$p.iface.oninit = function() {

	$p.job_prm.offline = true;

	// создаём основное окно
	$p.iface.layout_1c();
	$p.iface.docs.hideHeader();

	// говорим, что мы уже авторизованы на "сервере"
	$p.ajax.authorized = true;

	// инициализируем метаданные
	new $p.Meta(require('meta'));

	// загружаем данные
	$p.eve.from_json_to_data_obj(require('data'));

};
