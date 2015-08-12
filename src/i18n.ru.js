/**
 * Строковые константы интернационализации
 * @module common
 * @submodule i18n
 */

var msg = $p.msg;

/**
 * русификация dateFormat
 */
$p.dateFormat.i18n = {
	dayNames: [
		"Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
		"Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
	],
	monthNames: [
		"Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек",
		"Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"
	]
};

if(typeof window !== "undefined" && "dhx4" in window){
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
 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
 * @method russian_names
 * @for Messages
 */
$p.msg.russian_names = function(){
	if($p.job_prm.russian_names){

		// глобальный контекст
		window._define({
			"Метаданные": {
				get: function(){return _md},
				enumerable: false
			},
			"Справочники": {
				get: function(){return _cat},
				enumerable: false
			},
			"Документы": {
				get: function(){return _doc},
				enumerable: false
			},
			"РегистрыСведений": {
				get: function(){return _ireg},
				enumerable: false
			},
			"РегистрыНакопления": {
				get: function(){return _areg},
				enumerable: false
			},
			"РегистрыБухгалтерии": {
				get: function(){return _aссreg},
				enumerable: false
			},
			"Обработки": {
				get: function(){return _dp},
				enumerable: false
			},
			"Отчеты": {
				get: function(){return _rep},
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
		DataManager.prototype._define({
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
				}
			}
		);

		// свойства и методы объектов данных
		DataObj.prototype._define({
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				}
			}
		);

	}
};

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


// публичные методы, экспортируемые, как свойства $p.msg
msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

msg.align_node_right = "Уравнять вертикально вправо";
msg.align_node_bottom = "Уравнять горизонтально вниз";
msg.align_node_top = "Уравнять горизонтально вверх";
msg.align_node_left = "Уравнять вертикально влево";
msg.align_set_right = "Установить размер сдвигом вправо";
msg.align_set_bottom = "Установить размер сдвигом вниз";
msg.align_set_top = "Установить размер сдвигом вверх";
msg.align_set_left = "Установить размер сдвигом влево";
msg.align_invalid_direction = "Неприменимо для элемента с данной ориентацией";

msg.argument_is_not_ref = "Аргумент не является ссылкой";
msg.addr_title = "Ввод адреса";

msg.cache_update_title = "Обновление кеша браузера";
msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";
msg.delivery_area_empty = "Укажите район доставки";
msg.empty_login_password = "Не указаны имя пользователя или пароль";
msg.empty_response = "Пустой ответ сервера";
msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";

msg.error_auth = "Авторизация пользователя не выполнена";
msg.error_critical = "Критическая ошибка";
msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
msg.error_network = "Ошибка сети или сервера - запрос отклонен";
msg.error_rights = "Ограничение доступа";

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
msg.main_title = "Окнософт: заказ дилера ";
msg.meta_cat = "Справочники";
msg.meta_doc = "Документы";
msg.meta_cch = "Планы видов характеристик";
msg.meta_cacc = "Планы счетов";
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
msg.meta_reports_mgr = "Менеджер отчетов";
msg.meta_charts_of_accounts_mgr = "Менеджер планов счетов";
msg.meta_charts_of_characteristic_mgr = "Менеджер планов видов характеристик";
msg.meta_extender = "Модификаторы объектов и менеджеров";
msg.no_metadata = "Не найдены метаданные объекта '%1'";
msg.no_selected_row = "Не выбрана строка табличной части '%1'";
msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
msg.not_implemented = "Не реализовано в текущей версии";
msg.offline_request = "Запрос к серверу в автономном режиме";
msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
msg.order_sent_title = "Подтвердите отправку заказа";
msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";
msg.request_title = "Окнософт: Запрос регистрации";
msg.request_message = "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо";
msg.srv_overload = "Сервер перегружен";
msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
msg.long_operation = "Длительная операция";
msg.sync_script = "Обновление скриптов приложения:";
msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
msg.sync_break = "Прервать синхронизацию";
msg.unsupported_browser_title = "Браузер не поддерживается";
msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
msg.unsupported_mode_title = "Режим не поддерживается";
msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
msg.unknown_error = "Неизвестная ошибка в функции '%1'";



msg.bld_constructor = "Конструктор объектов графического построителя";
msg.bld_title = "Графический построитель";
msg.bld_empty_param = "Не заполнен обязательный параметр <br />";
msg.bld_not_product = "В текущей строке нет изделия построителя";
msg.bld_not_draw = "Отсутствует эскиз или не указана система профилей";
msg.bld_wnd_title = "Построитель изделия № ";
msg.bld_from_blocks_title = "Выбор типового блока";
msg.bld_from_blocks = "Текущее изделие будет заменено конфигурацией типового блока. Продолжить?";
msg.bld_split_imp = "В параметрах продукции<br />'%1'<br />запрещены незамкнутые контуры<br />" +
	"Для включения деления импостом,<br />установите это свойство в 'Истина'";
