/**
 * Created 08.08.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  codres
 */

$p.eve.redirect = true;

$p.settings = function (prm, modifiers) {
	prm.create_tables_sql = $p.injected_data['create_tables.sql'];
	prm.allow_post_message = "*";   // разрешаем обрабатывать сообщения от других окон (обязательно для файлового режима)
	prm.russian_names = true;       // создаём русскоязычные синонимы
	prm.use_google_geo = true;      // используем геолокатор
};

$p.iface.oninit = function() {

	$p.job_prm.offline = true;

	// создаём основное окно
	$p.iface.layout_1c();
	$p.iface.docs.hideHeader();

	// говорим, что мы уже авторизованы на "сервере"
	$p.ajax.authorized = true;
	$p.ajax.root = true;

	// инициализируем метаданные
	new $p.Meta($p.injected_data['meta.json']);

	// загружаем данные
	$p.eve.from_json_to_data_obj($p.injected_data['data.json']);

};
