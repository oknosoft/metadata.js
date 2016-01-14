/**
 * Основное окно интерфейса accounting demo
 *
 * Created 17.07.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  main
 */

/**
 * Глобальная переменная демки БП (не фреймворка _metadata.js_, а конкретного прикладного решения)<br />
 * в её свойстве _modifiers_ располагаем модификаторы объектов, подписки на события и прочую бизнес-логику,
 * которая должна обрабатываться на клиенте
 * @type {Accounting}
 */
var _accounting = new function Accounting() {
	this.modifiers = [];
};

/**
 * Процедура устанавливает параметры работы программы, специфичные для текущей сборки
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 * @param modifiers {Array} - сюда можно добавить обработчики, переопределяющие функциональность объектов данных
 */
$p.settings = function (prm, modifiers) {

	// для транспорта используем rest, а не сервис http
	prm.rest = true;

	// разделитель для localStorage
	prm.local_storage_prefix = "acc_";

	// скин по умолчанию
	localStorage.setItem("acc_skin", prm.skin = "dhx_terrace");

	// используем русскоязычные синонимы классов и методов
	prm.russian_names = true;

	// расположение rest-сервиса accounting
	prm.rest_path = location.host.indexOf("oknosoft.") == -1 ? "/ea/odata/standard.odata/" : "/a/ea/%1/odata/standard.odata/";

	// по умолчанию, обращаемся к зоне 1392
	prm.zone = location.host.indexOf("oknosoft.") == -1 ? 0 : 1392;

	// расположение файлов данных
	prm.data_url = "examples/accounting/data/";

	// расположение файла инициализации базы sql
	prm.create_tables = "examples/accounting/data/create_tables.sql";


	// подключаем модификаторы
	_accounting.modifiers.forEach(function (func) {
		modifiers.push(func);
	});

};


/**
 * Обработчик события при начале работы программы
 */
$p.iface.oninit = function() {


	/**
	 * Используем разбивку экрана в одну колонку с динсписком в центре
	 */
	$p.iface.layout_1c();

	/**
	 * Используем стандартную процедуру аутентификации.
	 * При необходимости, можно реализовать клиентские сертификаты, двухфакторную авторизацию с одноразовыми sms и т.д.
	 */
	$p.iface.frm_auth(

		/**
		 * Используем стандартную визуализацию входа в программу.
		 * При необходимости, можно показать свои диалоги, оповещения, рекламу и т.д.
		 */
		null,

		/**
		 *  открываем окно "все функции" с деревом метаданных
		 *  это место можно переопределить и открывать, например, специальную форму списка заказов
		 */
		function () {
			$p.iface.set_hash("doc.СчетНаОплатуПокупателю", "", "", "oper");
			$p.iface.docs.hideHeader();

		},

		/**
		 * в случае ошибки входа в программу, просто пишем информацию в лог
		 * здесь можно реализовать некий алгоритм recovery - подключиться к резервному серверу, перейти в автономный режим и т.д.
		 */
		function (err) {
			var emsg = err.message.toLowerCase();
			if(emsg.indexOf("not found")!=-1)
				$p.msg.show_msg({
					type: "alert-error",
					text: "Проверьте строку подключения к 1С<br /> и номер зоны публикации 1С",
					title: "Сервис 1с-rest не найден"});

			$p.record_log(err);
		}
	);

};

/**
 * Обработчик события перед маршрутизацией
 * @param event
 * @return {boolean}
 */
$p.iface.before_route = function (event) {
	var route_prm = $p.job_prm.parse_url();
	if(route_prm.view && route_prm.view!="oper"){
		setTimeout(function () {
			$p.iface.set_hash("", "", "", "oper");
		}, 0);
		return false;
	}
};


