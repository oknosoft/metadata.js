/**
 * Параметры работы программы
 * @module  settings
 */

$p.settings = function (prm, modifiers) {

	prm.offline = false;            // автономная работа запрещена
	if(localStorage)
		localStorage.setItem("offline", "");

	prm.create_tables = true;       // будем использовать объекты данных, для которых создаём таблицы
	prm.create_tables_sql = 'USE osde;\
		CREATE TABLE IF NOT EXISTS refs (ref CHAR);';   // текст запроса

};