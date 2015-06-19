/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  основное окно интерфейса unf demo
 */

/**
 * Процедура устанавливает параметры работы программы, специфичные для текущей сборки
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

	prm.rest_path = "/a/unf/%1/odata/standard.odata/";// расположение rest-сервиса unf

	/**
	 * для целей демо-примера, методы data-объектов переопределяем здесь в анонимной функции
	 * в реальных проектах, методы каждого data-объекта удобнее расположить в отдельных модулях
	 */
	(function(){

		// методы справочника номенклатуры
		modifiers.push(function nom($p){

			var _mgr = $p.cat.nom;

			// модификаторы
			_mgr.sql_selection_list_flds = function(initial_value){
				return "SELECT _t_.ref, _t_.`deleted`, _t_.is_folder, _t_.id, _t_.article, _t_.name as presentation, _u_.name as nom_unit, _k_.name as nom_group," +
					" case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_nom AS _t_" +
					" left outer join cat_units as _u_ on _u_.ref = _t_.unit" +
					" left outer join cat_nom_groups as _k_ on _k_.ref = _t_.nom_group %3 %4 LIMIT 300";
			};

			_mgr.sql_selection_where_flds = function(filter){
				return " OR _t_.article LIKE '" + filter + "' OR _t_.id LIKE '" + filter + "' OR _t_.name LIKE '" + filter + "'";
			};

			_mgr.sql_selection_caption_flds = function(attr, acols, str_struct){
				acols.push(new str_struct("id", "120", "ro", "left", "server", "Код"));
				acols.push(new str_struct("article", "150", "ro", "left", "server", "Артикул"));
				acols.push(new str_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				acols.push(new str_struct("nom_unit", "70", "ro", "left", "server", "Ед"));
				acols.push(new str_struct("nom_group", "170", "ro", "left", "server", "Номенклатурная группа"));
			};

		});

	})();

};


/**
 * Обработчик события при начале работы программы
 */
$p.iface.oninit = function() {

	$p.iface.layout_2u()

		.then(function (tree) {

			$p.iface.frm_auth(

				/**
				 * используем стандартную визуализацию входа в программу
				 */
				null,

				/**
				 * указываем пути, по которым расположены файлы начальных данных и метаданных
				 */
				{
					meta: "/examples/unf/data/meta.json",
					data: "/examples/unf/data/"
				},

				/**
				 *  открываем окно "все функции" с деревом метаданных
				 *  это место можно переопределить и открывать, например, специальную форму списка заказов
				 */
				function () {
					$p.iface.set_hash("cat.nom", "", "", "oper");

				},

				/**
				 * в случае ошибки входа в программу, просто пишем информацию в лог
				 * здесь можно реализовать некий алгоритм recovery - подключиться к резервному серверу, перейти в автономный режим и т.д.
				 */
				function (err) {
					console.log(err.message);
				}
			);
		}

	);

};


