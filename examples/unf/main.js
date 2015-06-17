/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  unf-main
 */

/**
 * основное окно интерфейса unf demo
 */

function on_log_in_step(step){

	switch(step) {

		case $p.eve.steps.authorization:

			$p.iface.synctxt.show_message("Авторизация");

			break;

		case $p.eve.steps.load_meta:

			// индикатор прогресса и малое всплывающее сообщение
			$p.iface.docs.progressOn();
			$p.iface.synctxt.show_message($p.msg.init_catalogues + $p.msg.init_catalogues_meta);

			break;

		case $p.eve.steps.create_managers:

			$p.iface.synctxt.show_message("Создаём объекты менеджеров данных...");

			break;

		case $p.eve.steps.process_access:

			break;

		case $p.eve.steps.load_data_files:

			$p.iface.synctxt.show_message("Читаем файлы данных зоны...");

			break;

		case $p.eve.steps.load_data_db:

			$p.iface.synctxt.show_message("Читаем изменённые справочники из 1С...");

			break;

		case $p.eve.steps.load_data_wsql:

			break;

		case $p.eve.steps.save_data_wsql:

			$p.iface.synctxt.show_message("Сохраняем таблицы в локальном SQL...");

			break;

		default:

			break;
	}

}

function create_main_form(){


}


/**
 * инициализация dhtmlXWindows и анализ WebSQL при готовности документа
 */
$p.iface.oninit = function() {

	$p.eve.redirect = true;

	// при первой возможности создаём layout
	$p.iface.docs = new dhtmlXLayoutObject({
		parent: document.getElementById("ldemo"),
		pattern: "1C"
	});

	// приклеиваем к layout-у таблицу для вывода сообщений
	$p.iface.main = $p.iface.docs.cells("a");
	$p.iface.main.setText("Графический построитель - загрузка справочников при первом запуске");
	$p.iface.synctxt = $p.iface.main.attachGrid();
	$p.iface.synctxt.setIconsPath(dhtmlx.image_path);
	$p.iface.synctxt.setImagePath(dhtmlx.image_path);
	$p.iface.synctxt.setHeader(["Время","Сообщение"]);
	$p.iface.synctxt.setNoHeader(true);
	$p.iface.synctxt.setColTypes("ro,ro");
	$p.iface.synctxt.setColSorting('str,na');
	$p.iface.synctxt.setInitWidths('100,*');
	$p.iface.synctxt.enableKeyboardSupport(false);
	$p.iface.synctxt.init();
	$p.iface.synctxt.show_message = function(msg){
		var d = new Date(),
			newId = d.valueOf(),
			h = d.getHours(),
			m = d.getMinutes(),
			s = d.getSeconds(),
			dfmt = "" + (h < 10 ? "0" + h : h) + ":" +
				(m < 10 ? "0" + m : m) + ":" +
				(s < 10 ? "0" + s : s);
		this.addRow(newId, [dfmt, msg], 0);
		this.moveRowUp(newId);
		this.selectRowById(newId);
	};

	//$p.switchmode('video');

	// к сожалению, в совсем старых браузерах работать не будет
	if(!window.JSON || !window.localStorage){
		$p.iface.synctxt.show_message($p.msg.supported_browsers);
		$p.iface.synctxt.show_message($p.msg.unsupported_browser_title);

	}else{

		$p.eve.log_in(on_log_in_step)

			.then(create_main_form)

			.catch(function (err) {
				$p.iface.synctxt.show_message(err.message);
			});
	}

};

