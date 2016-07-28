/**
 * Строковые константы интернационализации
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule i18n
 */


/**
 * ### Сообщения пользователю и строки интернационализации
 *
 * @class Messages
 * @static
 * @menuorder 61
 * @tooltip i18n
 */
function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};


	/**
	 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
	 * @method russian_names
	 */
	this.russian_names = function(){
		if($p.job_prm.russian_names){

			// глобальный контекст
			window.__define({
				"Метаданные": {
					get: function(){return $p.md},
					enumerable: false
				},
				"Справочники": {
					get: function(){return $p.cat},
					enumerable: false
				},
				"Документы": {
					get: function(){return $p.doc},
					enumerable: false
				},
				"РегистрыСведений": {
					get: function(){return $p.ireg},
					enumerable: false
				},
				"РегистрыНакопления": {
					get: function(){return $p.areg},
					enumerable: false
				},
				"РегистрыБухгалтерии": {
					get: function(){return $p.accreg},
					enumerable: false
				},
				"Обработки": {
					get: function(){return $p.dp},
					enumerable: false
				},
				"Отчеты": {
					get: function(){return $p.rep},
					enumerable: false
				},
				"ОбластьКонтента": {
					get: function(){return $p.iface.docs},
					enumerable: false
				},
				"Сообщить": {
					get: function(){return $p.msg.show_msg},
					enumerable: false
				},
				"Истина": {
					value: true,
					enumerable: false
				},
				"Ложь": {
					value: false,
					enumerable: false
				}

			});

			// свойства и методы менеджеров
			DataManager.prototype.__define({
					"ФормаВыбора": {
						get: function(){return this.form_selection},
						enumerable: false
					},
					"ФормаОбъекта": {
						get: function(){return this.form_obj},
						enumerable: false
					},
					"Найти": {
						get: function(){return this.find},
						enumerable: false
					},
					"НайтиСтроки": {
						get: function(){return this.find_rows},
						enumerable: false
					},
					"НайтиПоНаименованию": {
						get: function(){return this.by_name},
						enumerable: false
					}
				}
			);

			// свойства и методы объектов данных
			DataObj.prototype.__define({
					"ФормаОбъекта": {
						get: function(){return this.form_obj},
						enumerable: false
					}
				}
			);

		}
	};
	
	/**
	 * расширяем мессанджер
	 */
	if(typeof window !== "undefined" && "dhtmlx" in window){

		/**
		 * Показывает информационное сообщение или confirm
		 * @method show_msg
		 * @param attr {object} - атрибуты сообщения attr.type - [info, alert, confirm, modalbox, info-error, alert-warning, confirm-error]
		 * @param [delm] - элемент html в тексте которого сообщение будет продублировано
		 * @example
		 *  $p.msg.show_msg({
		 *      title:"Important!",
		 *      type:"alert-error",
		 *      text:"Error"});
		 */
		this.show_msg = function(attr, delm){
			if(!attr)
				return;
			if(typeof attr == "string"){
				if($p.iface.synctxt){
					$p.iface.synctxt.show_message(attr);
					return;
				}
				attr = {type:"info", text:attr };
			}
			if(delm && typeof delm.setText == "function")
				delm.setText(attr.text);
			dhtmlx.message(attr);
		};

		/**
		 * Проверяет корректность ответа сервера
		 * @method check_soap_result
		 * @param res {XMLHttpRequest|Object} - полученный с сервера xhr response
		 * @return {boolean} - true, если нет ошибки
		 */
		this.check_soap_result = function(res){
			if(!res){
				$p.msg.show_msg({
					type: "alert-error",
					text: $p.msg.empty_response,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error=="limit_query"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.limit_query.replace("%1", res["queries"]).replace("%2", res["queries_avalable"]),
					title: $p.msg.srv_overload});
				return true;

			}else if(res.error=="network" || res.error=="empty"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.error_network,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error && res.error_description){
				$p.iface.docs.progressOff();
				if(res.error_description.indexOf("Недостаточно прав") != -1){
					res["error_type"] = "alert-warning";
					res["error_title"] = $p.msg.error_rights;
				}
				$p.msg.show_msg({
					type: res["error_type"] || "alert-error",
					text: res.error_description,
					title: res["error_title"] || $p.msg.error_critical
				});
				return true;

			}else if(res.error && !res.messages){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-error",
					title: $p.msg.error_critical,
					text: $p.msg.unknown_error.replace("%1", "unknown_error")
				});
				return true;
			}

		};

		/**
		 * Показывает модальное сообщение о нереализованной функциональности
		 * @method show_not_implemented
		 */
		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

if(typeof window !== "undefined" && window.dhx4){
	dhx4.dateFormat.ru = "%d.%m.%Y";
	dhx4.dateLang = "ru";
	dhx4.dateStrings = {
		ru: {
			monthFullName:	["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август","Сентябрь","Oктябрь","Ноябрь","Декабрь"],
			monthShortName:	["Янв","Фев","Maр","Aпр","Maй","Июн","Июл","Aвг","Сен","Окт","Ноя","Дек"],
			dayFullName:	["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
			dayShortName:	["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
		}
	};
}

/**
 *  строки ФИАС адресного классификатора
 */
$p.fias = function FIAS(){};
(function (fias){

	fias.toString = function(){return "Коды адресного классификатора"};

	fias.types = ["владение", "здание", "помещение"];

	// Код, Наименование, Тип, Порядок, КодФИАС
	fias["1010"] = {name: "дом",			type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"]};
	fias["1020"] = {name: "владение",		type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"]};
	fias["1030"] = {name: "домовладение",	type: 1, order: 3, fid: 3};

	fias["1050"] = {name: "корпус",		type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"]};
	fias["1060"] = {name: "строение",	type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"]};
	fias["1080"] = {name: "литера",		type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"]};
	fias["1070"] = {name: "сооружение",	type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"]};
	fias["1040"] = {name: "участок",	type: 2, order: 5, syn: [" уч.", " уч ", "участок"]};

	fias["2010"] = {name: "квартира",	type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"]};
	fias["2030"] = {name: "офис",		type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"]};
	fias["2040"] = {name: "бокс",		type: 3, order: 3};
	fias["2020"] = {name: "помещение",	type: 3, order: 4};
	fias["2050"] = {name: "комната",	type: 3, order: 5, syn: ["комн.", "комн ", "комната"]};

	//	//  сокращения 1C для поддержки обратной совместимости при парсинге
	//	fias["2010"] = {name: "кв.",	type: 3, order: 6};
	//	fias["2030"] = {name: "оф.",	type: 3, order: 7};

	// Уточняющие объекты
	fias["10100000"] = {name: "Почтовый индекс"};
	fias["10200000"] = {name: "Адресная точка"};
	fias["10300000"] = {name: "Садовое товарищество"};
	fias["10400000"] = {name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента"};
	fias["10500000"] = {name: "Промышленная зона"};
	fias["10600000"] = {name: "Гаражно-строительный кооператив"};
	fias["10700000"] = {name: "Территория"};

})($p.fias);

/**
 * Строки сообщений и элементов интерфейса
 */
(function (msg){

	// публичные методы, экспортируемые, как свойства $p.msg
	msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

	msg.argument_is_not_ref = "Аргумент не является ссылкой";
	msg.addr_title = "Ввод адреса";

	msg.cache_update_title = "Обновление кеша браузера";
	msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";
	msg.cancel = "Отмена";

	msg.delivery_area_empty = "Укажите район доставки";

	msg.empty_login_password = "Не указаны имя пользователя или пароль";
	msg.empty_response = "Пустой ответ сервера";
	msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";
	msg.error_geocoding = "Ошибка геокодера";

	msg.error_auth = "Авторизация пользователя не выполнена";
	msg.error_critical = "Критическая ошибка";
	msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
	msg.error_network = "Ошибка сети или сервера - запрос отклонен";
	msg.error_rights = "Ограничение доступа";
	msg.error_low_acl = "Недостаточно прав для выполнения операции";

	msg.file_size = "Запрещена загрузка файлов<br/>размером более ";
	msg.file_confirm_delete = "Подтвердите удаление файла ";
	msg.file_new_date = "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления";
	msg.file_new_date_title = "Версия файлов";

	msg.init_catalogues = "Загрузка справочников с сервера";
	msg.init_catalogues_meta = ": Метаданные объектов";
	msg.init_catalogues_tables = ": Реструктуризация таблиц";
	msg.init_catalogues_nom = ": Базовые типы + номенклатура";
	msg.init_catalogues_sys = ": Технологические справочники";
	msg.init_login = "Укажите имя пользователя и пароль";

	msg.requery = "Повторите попытку через 1-2 минуты";

	msg.limit_query = "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + msg.requery;
	msg.long_operation = "Длительная операция";
	msg.logged_in = "Авторизован под именем: ";
	msg.log_out_title = "Отключиться от сервера?";
	msg.log_out_break = "<br/>Завершить синхронизацию?";
	msg.sync_title = "Обмен с сервером";
	msg.sync_complite = "Синхронизация завершена";

	msg.main_title = "Окнософт: заказ дилера ";
	msg.mark_delete_confirm = "Пометить объект %1 на удаление?";
	msg.mark_undelete_confirm = "Снять пометку удаления с объекта %1?";
	msg.meta = {
		cat: "Справочник",
		doc: "Документ",
		cch: "План видов характеристик",
		cacc: "Планы счетов",
		tsk : "Задача",
		ireg: "Регистр сведений",
		areg: "Регистр накопления",
		bp: "Бизнес процесс",
		ts_row: "Строка табличной части",
		dp: "Обработка",
		rep: "Отчет"
	},
	msg.meta_cat = "Справочники";
	msg.meta_doc = "Документы";
	msg.meta_cch = "Планы видов характеристик";
	msg.meta_cacc = "Планы счетов";
	msg.meta_tsk = "Задачи";
	msg.meta_ireg = "Регистры сведений";
	msg.meta_areg = "Регистры накопления";
	msg.meta_mgr = "Менеджер";
	msg.meta_cat_mgr = "Менеджер справочников";
	msg.meta_doc_mgr = "Менеджер документов";
	msg.meta_enn_mgr = "Менеджер перечислений";
	msg.meta_ireg_mgr = "Менеджер регистров сведений";
	msg.meta_areg_mgr = "Менеджер регистров накопления";
	msg.meta_accreg_mgr = "Менеджер регистров бухгалтерии";
	msg.meta_dp_mgr = "Менеджер обработок";
	msg.meta_task_mgr = "Менеджер задач";
	msg.meta_bp_mgr = "Менеджер бизнес-процессов";
	msg.meta_reports_mgr = "Менеджер отчетов";
	msg.meta_charts_of_accounts_mgr = "Менеджер планов счетов";
	msg.meta_charts_of_characteristic_mgr = "Менеджер планов видов характеристик";
	msg.meta_extender = "Модификаторы объектов и менеджеров";

	msg.modified_close = "Объект изменен<br/>Закрыть без сохранения?";
	msg.mandatory_title = "Обязательный реквизит";
	msg.mandatory_field = "Укажите значение реквизита '%1'";

	msg.no_metadata = "Не найдены метаданные объекта '%1'";
	msg.no_selected_row = "Не выбрана строка табличной части '%1'";
	msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
	msg.not_implemented = "Не реализовано в текущей версии";

	msg.offline_request = "Запрос к серверу в автономном режиме";
	msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
	msg.order_sent_title = "Подтвердите отправку заказа";
	msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

	msg.report_prepare = "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета";
	msg.report_need_online = "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме";

	msg.request_title = "Окнософт: Запрос регистрации";
	msg.request_message = "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо";

	msg.select_from_list = "Выбор из списка";
	msg.select_grp = "Укажите группу, а не элемент";
	msg.select_elm = "Укажите элемент, а не группу";
	msg.select_file_import = "Укажите файл для импорта";
		
	msg.srv_overload = "Сервер перегружен";
	msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
	msg.sync_script = "Обновление скриптов приложения:";
	msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
	msg.sync_break = "Прервать синхронизацию";
	msg.sync_no_data = "Файл не содержит подходящих элементов для загрузки";

	msg.unsupported_browser_title = "Браузер не поддерживается";
	msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
	msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
	msg.unsupported_mode_title = "Режим не поддерживается";
	msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
	msg.unknown_error = "Неизвестная ошибка в функции '%1'";

	msg.value = "Значение";

})($p.msg);




