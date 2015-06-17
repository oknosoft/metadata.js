/**
 * Параметры работы программы
 * @module  settings
 */

$p.settings = function (prm, modifiers) {

	prm.offline = false;            // автономная работа запрещена
	if(localStorage)
		localStorage.setItem("offline", "");

};