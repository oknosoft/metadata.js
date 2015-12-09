/**
 *
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  adm
 */

/**
 * Процедура устанавливает параметры работы программы, специфичные для текущей сборки
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 * @param modifiers {Array} - сюда можно добавить обработчики, переопределяющие функциональность объектов данных
 */
$p.settings = function (prm, modifiers) {

	// для транспорта используем irest, а не сервис http
	prm.rest = false;
	prm.irest_enabled = true;

	// разделитель для localStorage
	prm.local_storage_prefix = "adm_";

	// расположение rest-сервиса ut
	prm.rest_path = "/kademo/%1/odata/standard.odata/";

	// адрес команды регистрации
	prm.reg_path = "/kademo/hs/rest/Module_пзБезбумажкаСервер/ЗарегистрироватьМассивШтрихкодов/";

	// по умолчанию, обращаемся к зоне %%%
	prm.zone = 0;

	// расположение файлов данных
	//prm.data_url = "data/";

	// расположение файла инициализации базы sql
	//prm.create_tables = "data/create_tables.sql";

	// используем геокодер
	prm.use_google_geo = false;

	// разрешаем покидать страницу без лишних вопросов
	$p.eve.redirect = true;

	// скин по умолчанию
	prm.skin = "dhx_terrace";

	// модификаторы пока не нужны
	//modifiers.push(function($p){
	//
	//});

};

/**
 * Рисуем основное окно при инициализации документа
 */
$p.iface.oninit = function() {

	var hprm = $p.job_prm.parse_url();       // параметры URL

	// менеджеры закладок - их можно растащить по разным файлам
	$p.iface.tabmgrs = {

		const: function(cell){

			if($p.iface._const)
				return;

			$p.iface._const = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._const.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._const.cont.style.overflow = "auto";

				})
				.catch($p.record_log);

		},

		meta: function(cell){

			if($p.iface._meta)
				return;

			$p.iface._meta = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._meta.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._meta.cont.style.overflow = "auto";

				})
				.catch($p.record_log);


		},

		syns: function(cell){
			if($p.iface._syns)
				return;

			$p.iface._syns = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._syns.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._syns.cont.style.overflow = "auto";

				})
				.catch($p.record_log);
		},

		about: function(cell){
			if($p.iface._about)
				return;

			$p.iface._about = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._about.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._about.cont.style.overflow = "auto";

				})
				.catch($p.record_log);
		},

		reg_1c: function(cell){

			if($p.iface._reg_1c)
				return;

			$p.iface._reg_1c = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._reg_1c.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._reg_1c.cont.style.overflow = "auto";

				})
				.catch($p.record_log);


		},

		reg_web: function(cell){

			if($p.iface._reg_web)
				return;

			$p.iface._reg_web = {};
			$p.ajax.get("about.html")
				.then(function (req) {
					cell.attachHTMLString(req.response);
					$p.iface._reg_web.cont = cell.cell.querySelector(".dhx_cell_cont_tabbar");
					$p.iface._reg_web.cont.style.overflow = "auto";

				})
				.catch($p.record_log);


		}

	};


	// основа интерфейса - панель закладок
	$p.iface.main = new dhtmlXTabBar({
		parent:             document.body,
		arrows_mode:        "auto",
		offsets: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		tabs: [
			{
				id:      "const",
				text:    "Константы"
			},
			{
				id:      "meta",
				text:    "Метаданные"
			},
			{
				id:      "syns",
				text:    "Синонимы"
			},
			{
				id:      "reg_1c",
				text:    "Регистрация 1С"
			},
			{
				id:      "reg_web",
				text:    "Регистрация web"
			},
			{
				id:      "about",
				text:    "О программе"
			}

		]
	});
	$p.iface.docs = $p.iface.main.cells("report");

	$p.iface.main.attachEvent("onSelect", function(id){

		hprm = $p.job_prm.parse_url();
		if(hprm.view != id)
			$p.iface.set_hash(hprm.obj, hprm.ref, hprm.frm, id);

		setTimeout(function () {
			$p.iface.tabmgrs[id]($p.iface.main.cells(id))
		});

		return true;

	});

	// маршрутизация URL
	$p.eve.hash_route.push(function (hprm) {

		// view отвечает за переключение закладки в TabBar
		if(hprm.view && $p.iface.main.getActiveTab() != hprm.view){
			$p.iface.main.getAllTabs().forEach(function(item){
				if(item == hprm.view)
					$p.iface.main.tabs(item).setActive();
			});
		}

		return false;
	});

	setTimeout(function(){
		if(!hprm.view || $p.iface.main.getAllTabs().indexOf(hprm.view) == -1){
			var last_hprm = $p.wsql.get_user_param("last_hash_url", "object");
			if(last_hprm)
				$p.iface.set_hash(last_hprm.obj, last_hprm.ref, last_hprm.frm, last_hprm.view || "const");
			else
				$p.iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "const");
		} else
			$p.iface.hash_route();
	}, 100);


};

