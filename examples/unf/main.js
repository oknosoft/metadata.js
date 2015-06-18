/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  основное окно интерфейса unf demo
 */

/**
 * Процедура устанавливаем параметры работы программы, специфичные для текущей сборки
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 * @param modifiers {Array} - сюда можно добавить обработчики, переопределяющие функциональность объектов данных
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


function create_main_form(){

	$p.iface.set_hash("cat.nom", "", "", "oper");
}


/**
 * Обработчик события при начале работы программы
 */
$p.iface.oninit = function() {

	$p.iface.layout_2u()

		.then(function (tree) {

			$p.iface.frm_auth(
				null,
				{
					meta: "/examples/unf/data/meta.json",
					data: "/examples/unf/data/"
				},
				create_main_form,
				function (err) {
					console.log(err.message);
				}
			);
		}

	);

};

