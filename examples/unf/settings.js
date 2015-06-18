/**
 * Параметры работы программы
 * @module  settings
 */

$p.settings = function (prm, modifiers) {

	prm.check_app_installed = false; // установленность приложения в ChromeStore НЕ проверяем

	prm.rest = true;                // для транспорта используем rest, а не сервис http

	prm.offline = false;            // автономная работа запрещена
	if(localStorage)
		localStorage.setItem("offline", "");

	prm.create_tables = true;       // будем использовать объекты данных, для которых создаём таблицы
	$p.ajax.get("/examples/unf/data/create_tables.sql")
		.then(function (req) {
			prm.create_tables_sql = req.response;     // текст запроса
		});

	prm.settings_url = "/examples/unf/settings.html";// расположение страницы настроек

};