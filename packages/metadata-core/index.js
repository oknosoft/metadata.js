'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.classes = undefined;

var _metadataAbstractAdapter = require('metadata-abstract-adapter');

const moment = require('moment');
const moment_ru = require('moment/locale/ru.js');
moment._masks = {
	date: "DD.MM.YY",
	date_time: "DD.MM.YYYY HH:mm",
	ldt: "DD MMMM YYYY, HH:mm",
	iso: "YYYY-MM-DDTHH:mm:ss"
};

const alasql = require("alasql/dist/alasql.js");

if (!Number.prototype.round) Number.prototype.round = function (places) {
	var multiplier = Math.pow(10, places);
	return Math.round(this * multiplier) / multiplier;
};

if (!Number.prototype.pad) Number.prototype.pad = function (size) {
	var s = String(this);
	while (s.length < (size || 2)) {
		s = "0" + s;
	}
	return s;
};

class Utils {

	constructor() {

		this.moment = moment;

		this.blank = {
			date: this.fix_date("0001-01-01T00:00:00"),
			guid: "00000000-0000-0000-0000-000000000000",
			by_type: function (mtype) {
				var v;
				if (mtype.is_ref) v = this.guid;else if (mtype.date_part) v = this.date;else if (mtype["digits"]) v = 0;else if (mtype.types && mtype.types[0] == "boolean") v = false;else v = "";
				return v;
			}
		};
	}

	fix_date(str, strict) {

		if (str instanceof Date) return str;else {
			var m = moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", moment.ISO_8601]);
			return m.isValid() ? m.toDate() : strict ? this.blank.date : str;
		}
	}

	fix_guid(ref, generate) {

		if (ref && typeof ref == "string") {} else if (ref instanceof DataObj) return ref.ref;else if (ref && typeof ref == "object") {
			if (ref.presentation) {
				if (ref.ref) return ref.ref;else if (ref.name) return ref.name;
			} else ref = typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref") ? ref.ref.ref : ref.ref;
		}

		if (this.is_guid(ref) || generate === false) return ref;else if (generate) return this.generate_guid();else return this.blank.guid;
	}

	fix_number(str, strict) {
		var v = parseFloat(str);
		if (!isNaN(v)) return v;else if (strict) return 0;else return str;
	}

	fix_boolean(str) {
		if (typeof str === "string") return !(!str || str.toLowerCase() == "false");else return !!str;
	}

	fetch_type(str, mtype) {
		if (mtype.is_ref) {
			return this.fix_guid(str);
		}
		if (mtype.date_part) {
			return this.fix_date(str, true);
		}
		if (mtype["digits"]) {
			return this.fix_number(str, true);
		}
		if (mtype.types && mtype.types[0] == "boolean") {
			return this.fix_boolean(str);
		}
		return str;
	}

	date_add_day(date, days, reset_time) {
		const newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if (reset_time) {
			newDt.setHours(0, -newDt.getTimezoneOffset(), 0, 0);
		}
		return newDt;
	}

	generate_guid() {
		let d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
			const r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
		});
	}

	is_guid(v) {
		if (typeof v !== "string" || v.length < 36) {
			return false;
		} else if (v.length > 36) {
			const parts = v.split("|");
			v = parts.length == 2 ? parts[1] : v.substr(0, 36);
		}
		return (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
		);
	}

	is_empty_guid(v) {
		return !v || v === this.blank.guid;
	}

	is_data_obj(v) {
		return v && v instanceof DataObj;
	}

	is_data_mgr(v) {
		return v && v instanceof classes.DataManager;
	}

	is_equal(v1, v2) {
		if (v1 == v2) {
			return true;
		} else if (typeof v1 === 'string' && typeof v2 === 'string' && v1.trim() === v2.trim()) {
			return true;
		} else if (typeof v1 === typeof v2) {
			return false;
		}
		return this.fix_guid(v1, false) == this.fix_guid(v2, false);
	}

	blob_as_text(blob, type) {

		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			reader.onload = function (event) {
				resolve(reader.result);
			};
			reader.onerror = function (err) {
				reject(err);
			};
			if (type == "data_url") reader.readAsDataURL(blob);else reader.readAsText(blob);
		});
	}

	get_and_show_blob(url, post_data, method) {

		var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
		    req;

		function show_blob(req) {
			url = window.URL.createObjectURL(req.response);
			var wnd_print = window.open(url, "wnd_print", params);
			wnd_print.onload = e => window.URL.revokeObjectURL(url);
			return wnd_print;
		}

		if (!method || typeof method == "string" && method.toLowerCase().indexOf("post") != -1) req = this.post_ex(url, typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, xhr => xhr.responseType = "blob");else req = this.get_ex(url, true, xhr => xhr.responseType = "blob");

		return show_blob(req);
	}

	get_and_save_blob(url, post_data, file_name) {

		return this.post_ex(url, typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function (xhr) {
			xhr.responseType = "blob";
		}).then(function (req) {
			saveAs(req.response, file_name);
		});
	}

	_mixin(obj, src, include, exclude) {
		var tobj = {},
		    i,
		    f;
		if (include && include.length) {
			for (i = 0; i < include.length; i++) {
				f = include[i];
				if (exclude && exclude.indexOf(f) != -1) continue;

				if (typeof tobj[f] == "undefined" || tobj[f] != src[f]) obj[f] = src[f];
			}
		} else {
			for (f in src) {
				if (exclude && exclude.indexOf(f) != -1) continue;

				if (typeof tobj[f] == "undefined" || tobj[f] != src[f]) obj[f] = src[f];
			}
		}
		return obj;
	}

	_patch(obj, patch) {
		for (var area in patch) {

			if (typeof patch[area] == "object") {
				if (obj[area] && typeof obj[area] == "object") this._patch(obj[area], patch[area]);else obj[area] = patch[area];
			} else obj[area] = patch[area];
		}
		return obj;
	}

	_clone(obj) {
		if (!obj || "object" !== typeof obj) return obj;
		var p,
		    v,
		    c = "function" === typeof obj.pop ? [] : {};
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				v = obj[p];
				if (v) {
					if ("function" === typeof v || v instanceof DataObj || v instanceof classes.DataManager || v instanceof Date) c[p] = v;else if ("object" === typeof v) c[p] = this._clone(v);else c[p] = v;
				} else c[p] = v;
			}
		}
		return c;
	}

	_find(a, val, columns) {
		var o, i, finded;
		if (typeof val != "object") {
			for (i in a) {
				o = a[i];
				for (var j in o) {
					if (typeof o[j] !== "function" && utils.is_equal(o[j], val)) return o;
				}
			}
		} else {
			for (i in a) {
				o = a[i];
				finded = true;
				for (var j in val) {
					if (typeof o[j] !== "function" && !utils.is_equal(o[j], val[j])) {
						finded = false;
						break;
					}
				}
				if (finded) return o;
			}
		}
	}

	_selection(o, selection) {

		let ok = true;

		if (selection) {
			if (typeof selection == "function") ok = selection.call(this, o);else {
				for (let j in selection) {

					const sel = selection[j];
					const is_obj = sel && typeof sel === "object";

					if (j.substr(0, 1) == "_") {
						continue;
					} else if (typeof sel == "function") {
							ok = sel.call(this, o, j);
							if (!ok) break;
						} else if (j == "or" && Array.isArray(sel)) {
								ok = sel.some(function (element) {
									var key = Object.keys(element)[0];
									if (element[key].hasOwnProperty("like")) return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase()) != -1;else return utils.is_equal(o[key], element[key]);
								});
								if (!ok) break;
							} else if (is_obj && sel.hasOwnProperty("like")) {
									if (!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase()) == -1) {
										ok = false;
										break;
									}
								} else if (is_obj && sel.hasOwnProperty("not")) {
										if (utils.is_equal(o[j], sel.not)) {
											ok = false;
											break;
										}
									} else if (is_obj && sel.hasOwnProperty("in")) {
											ok = sel.in.some(function (element) {
												return utils.is_equal(element, o[j]);
											});
											if (!ok) break;
										} else if (is_obj && sel.hasOwnProperty("lt")) {
												ok = o[j] < sel.lt;
												if (!ok) break;
											} else if (is_obj && sel.hasOwnProperty("gt")) {
													ok = o[j] > sel.gt;
													if (!ok) break;
												} else if (is_obj && sel.hasOwnProperty("between")) {
														var tmp = o[j];
														if (typeof tmp != "number") tmp = utils.fix_date(o[j]);
														ok = tmp >= sel.between[0] && tmp <= sel.between[1];
														if (!ok) break;
													} else if (!utils.is_equal(o[j], sel)) {
														ok = false;
														break;
													}
				}
			}
		}

		return ok;
	}

	_find_rows(arr, selection, callback) {

		var o,
		    res = [],
		    top,
		    count = 0;

		if (selection) {
			if (selection._top) {
				top = selection._top;
				delete selection._top;
			} else top = 300;
		}

		for (var i in arr) {
			o = arr[i];

			if (utils._selection.call(this, o, selection)) {
				if (callback) {
					if (callback.call(this, o) === false) break;
				} else res.push(o);

				if (top) {
					count++;
					if (count >= top) break;
				}
			}
		}
		return res;
	}

}

const utils = new Utils();

function msg(id) {
	return msg.i18n[msg.lang][id];
}

msg.lang = 'ru';

msg.i18n = {
	ru: {

		fias: {
			types: ["владение", "здание", "помещение"],

			"1010": { name: "дом", type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"] },
			"1020": { name: "владение", type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"] },
			"1030": { name: "домовладение", type: 1, order: 3, fid: 3 },

			"1050": { name: "корпус", type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"] },
			"1060": { name: "строение", type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"] },
			"1080": { name: "литера", type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"] },
			"1070": { name: "сооружение", type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"] },
			"1040": { name: "участок", type: 2, order: 5, syn: [" уч.", " уч ", "участок"] },

			"2010": { name: "квартира", type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"] },
			"2030": { name: "офис", type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"] },
			"2040": { name: "бокс", type: 3, order: 3 },
			"2020": { name: "помещение", type: 3, order: 4 },
			"2050": { name: "комната", type: 3, order: 5, syn: ["комн.", "комн ", "комната"] },

			"10100000": { name: "Почтовый индекс" },
			"10200000": { name: "Адресная точка" },
			"10300000": { name: "Садовое товарищество" },
			"10400000": { name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента" },
			"10500000": { name: "Промышленная зона" },
			"10600000": { name: "Гаражно-строительный кооператив" },
			"10700000": { name: "Территория" }
		},

		store_url_od: "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage",

		argument_is_not_ref: "Аргумент не является ссылкой",
		addr_title: "Ввод адреса",

		cache_update_title: "Обновление кеша браузера",
		cache_update: "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера",
		cancel: "Отмена",

		delivery_area_empty: "Укажите район доставки",

		empty_login_password: "Не указаны имя пользователя или пароль",
		empty_response: "Пустой ответ сервера",
		empty_geocoding: "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера",
		error_geocoding: "Ошибка геокодера",

		error_auth: "Авторизация пользователя не выполнена",
		error_critical: "Критическая ошибка",
		error_metadata: "Ошибка загрузки метаданных конфигурации",
		error_network: "Ошибка сети или сервера - запрос отклонен",
		error_rights: "Ограничение доступа",
		error_low_acl: "Недостаточно прав для выполнения операции",

		file_size: "Запрещена загрузка файлов<br/>размером более ",
		file_confirm_delete: "Подтвердите удаление файла ",
		file_new_date: "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления",
		file_new_date_title: "Версия файлов",

		init_catalogues: "Загрузка справочников с сервера",
		init_catalogues_meta: ": Метаданные объектов",
		init_catalogues_tables: ": Реструктуризация таблиц",
		init_catalogues_nom: ": Базовые типы + номенклатура",
		init_catalogues_sys: ": Технологические справочники",
		init_login: "Укажите имя пользователя и пароль",

		requery: "Повторите попытку через 1-2 минуты",

		get limit_query() {
			return "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + this.requery;
		},

		long_operation: "Длительная операция",
		logged_in: "Авторизован под именем: ",
		log_out_title: "Отключиться от сервера?",
		log_out_break: "<br/>Завершить синхронизацию?",
		sync_title: "Обмен с сервером",
		sync_complite: "Синхронизация завершена",

		main_title: "Окнософт: заказ дилера ",
		mark_delete_confirm: "Пометить объект %1 на удаление?",
		mark_undelete_confirm: "Снять пометку удаления с объекта %1?",
		meta: {
			enm: "Перечисление",
			cat: "Справочник",
			doc: "Документ",
			cch: "План видов характеристик",
			cacc: "План счетов",
			tsk: "Задача",
			ireg: "Регистр сведений",
			areg: "Регистр накопления",
			accreg: "Регистр бухгалтерии",
			bp: "Бизнес процесс",
			ts_row: "Строка табличной части",
			dp: "Обработка",
			rep: "Отчет"
		},
		meta_classes: {
			enm: "Перечисления",
			cat: "Справочники",
			doc: "Документы",
			cch: "Планы видов характеристик",
			cacc: "Планы счетов",
			tsk: "Задачи",
			ireg: "Регистры сведений",
			areg: "Регистры накопления",
			accreg: "Регистры бухгалтерии",
			bp: "Бизнес процессы",
			dp: "Обработки",
			rep: "Отчеты"
		},
		meta_mgrs: {
			mgr: "Менеджер",
			get enm() {
				return this.mgr + " перечислений";
			},
			get cat() {
				return this.mgr + " справочников";
			},
			get doc() {
				return this.mgr + " документов";
			},
			get cch() {
				return this.mgr + " планов видов характеристик";
			},
			get cacc() {
				return this.mgr + " планов счетов";
			},
			get tsk() {
				return this.mgr + " задач";
			},
			get ireg() {
				return this.mgr + " регистров сведений";
			},
			get areg() {
				return this.mgr + " регистров накопления";
			},
			get accreg() {
				return this.mgr + " регистров бухгалтерии";
			},
			get bp() {
				return this.mgr + " бизнес-процессов";
			},
			get dp() {
				return this.mgr + " обработок";
			},
			get rep() {
				return this.mgr + " отчетов";
			}
		},
		meta_cat_mgr: "Менеджер справочников",
		meta_doc_mgr: "Менеджер документов",
		meta_enn_mgr: "Менеджер перечислений",
		meta_ireg_mgr: "Менеджер регистров сведений",
		meta_areg_mgr: "Менеджер регистров накопления",
		meta_accreg_mgr: "Менеджер регистров бухгалтерии",
		meta_dp_mgr: "Менеджер обработок",
		meta_task_mgr: "Менеджер задач",
		meta_bp_mgr: "Менеджер бизнес-процессов",
		meta_reports_mgr: "Менеджер отчетов",
		meta_charts_of_accounts_mgr: "Менеджер планов счетов",
		meta_charts_of_characteristic_mgr: "Менеджер планов видов характеристик",
		meta_extender: "Модификаторы объектов и менеджеров",

		modified_close: "Объект изменен<br/>Закрыть без сохранения?",
		mandatory_title: "Обязательный реквизит",
		mandatory_field: "Укажите значение реквизита '%1'",

		no_metadata: "Не найдены метаданные объекта '%1'",
		no_selected_row: "Не выбрана строка табличной части '%1'",
		no_dhtmlx: "Библиотека dhtmlx не загружена",
		not_implemented: "Не реализовано в текущей версии",

		offline_request: "Запрос к серверу в автономном режиме",
		onbeforeunload: "Окнософт: легкий клиент. Закрыть программу?",
		order_sent_title: "Подтвердите отправку заказа",
		order_sent_message: "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу",

		report_error: "<i class='fa fa-exclamation-circle fa-2x fa-fw'></i> Ошибка",
		report_prepare: "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета",
		report_need_prepare: "<i class='fa fa-info fa-2x fa-fw'></i> Нажмите 'Сформировать' для получения отчета",
		report_need_online: "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме",

		request_title: "Запрос регистрации",
		request_message: "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо",

		select_from_list: "Выбор из списка",
		select_grp: "Укажите группу, а не элемент",
		select_elm: "Укажите элемент, а не группу",
		select_file_import: "Укажите файл для импорта",

		srv_overload: "Сервер перегружен",
		sub_row_change_disabled: "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель",
		sync_script: "Обновление скриптов приложения:",
		sync_data: "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников",
		sync_break: "Прервать синхронизацию",
		sync_no_data: "Файл не содержит подходящих элементов для загрузки",

		tabular_will_cleared: "Табличная часть '%1' будет очищена. Продолжить?",

		unsupported_browser_title: "Браузер не поддерживается",
		unsupported_browser: "Несовместимая версия браузера<br/>Рекомендуется Google Chrome",
		supported_browsers: "Рекомендуется Chrome, Safari или Opera",
		unsupported_mode_title: "Режим не поддерживается",
		get unsupported_mode() {
			return "Программа не установлена<br/> в <a href='" + this.store_url_od + "'>приложениях Google Chrome</a>";
		},
		unknown_error: "Неизвестная ошибка в функции '%1'",

		value: "Значение"

	}
};

for (let id in msg.i18n.ru) {
	Object.defineProperty(msg, id, {
		get: function () {
			return msg.i18n.ru[id];
		}
	});
}

class JobPrm {

	constructor() {

		Object.defineProperties(this, {

			local_storage_prefix: {
				value: "",
				writable: true
			},

			create_tables: {
				value: true,
				writable: true
			},

			irest_url: {
				value: function () {
					var url = base_url(),
					    zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
					url = url.replace("odata/standard.odata", "hs/rest");
					if (zone) return url.replace("%1", zone);else return url.replace("%1/", "");
				}
			}
		});
	}

	init(settings) {
		if (typeof settings == "function") settings(this);
	}

	base_url() {
		return $p.wsql.get_user_param("rest_path") || this.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	rest_url() {
		var url = this.base_url(),
		    zone = $p.wsql.get_user_param("zone", this.zone_is_string ? "string" : "number");
		if (zone) return url.replace("%1", zone);else return url.replace("%1/", "");
	}

	ajax_attr(attr, url) {
		if (!attr.url) attr.url = url;
		if (!attr.username) attr.username = this.username;
		if (!attr.password) attr.password = this.password;
		attr.hide_headers = true;
	}

}

class WSQL {

	constructor($p) {

		var user_params = {
			value: {}
		};

		Object.defineProperties(this, {
			_ls: {
				get: function () {

					if (typeof localStorage === "undefined") {

						return {
							setItem: function (name, value) {},
							getItem: function (name) {}
						};

						if (typeof WorkerGlobalScope === "undefined") {
							return new _ls('./localstorage');
						} else {
							return {
								setItem: function (name, value) {},
								getItem: function (name) {}
							};
						}
					} else return localStorage;
				}
			},

			init: {
				value: function (settings, meta) {

					alasql.utils.isBrowserify = false;

					$p.job_prm.init(settings);

					if (!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables) return;

					var nesessery_params = [{ p: "user_name", v: "", t: "string" }, { p: "user_pwd", v: "", t: "string" }, { p: "browser_uid", v: utils.generate_guid(), t: "string" }, {
						p: "zone",
						v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1,
						t: $p.job_prm.zone_is_string ? "string" : "number"
					}, { p: "enable_save_pwd", v: true, t: "boolean" }, { p: "rest_path", v: "", t: "string" }, { p: "couch_path", v: "", t: "string" }],
					    zone;

					if ($p.job_prm.additional_params) nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

					if (!this._ls.getItem($p.job_prm.local_storage_prefix + "zone")) zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;

					if (zone !== undefined) this.set_user_param("zone", zone);

					nesessery_params.forEach(o => {
						if (!this.prm_is_set(o.p)) this.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
					});

					if ($p.adapters.pouch) {
						const pouch_prm = {
							path: this.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
							zone: this.get_user_param("zone", "number"),
							prefix: $p.job_prm.local_storage_prefix,
							suffix: this.get_user_param("couch_suffix", "string") || "",
							user_node: $p.job_prm.user_node,
							noreplicate: $p.job_prm.noreplicate
						};
						if (pouch_prm.path) {

							$p.adapters.pouch.init(pouch_prm);
						}
					}

					meta($p);
				}
			},

			set_user_param: {
				value: function (prm_name, prm_value) {

					var str_prm = prm_value;
					if (typeof prm_value == "object") str_prm = JSON.stringify(prm_value);else if (prm_value === false) str_prm = "";

					this._ls.setItem($p.job_prm.local_storage_prefix + prm_name, str_prm);
					user_params[prm_name] = prm_value;
				}
			},

			get_user_param: {
				value: function (prm_name, type) {

					if (!user_params.hasOwnProperty(prm_name) && this._ls) user_params[prm_name] = this.fetch_type(this._ls.getItem($p.job_prm.local_storage_prefix + prm_name), type);

					return user_params[prm_name];
				}
			},

			prm_is_set: {
				value: function (prm_name) {
					return user_params.hasOwnProperty(prm_name) || this._ls && this._ls.hasOwnProperty($p.job_prm.local_storage_prefix + prm_name);
				}
			},

			aladb: {
				value: new alasql.Database('md')
			}

		});
	}

	get alasql() {
		return alasql;
	}

	get js_time_diff() {
		return -new Date("0001-01-01").valueOf();
	}

	get time_diff() {
		var diff = this.get_user_param("time_diff", "number");
		return !diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000 ? this.js_time_diff : diff;
	}

	save_options(prefix, options) {
		return this.set_user_param(prefix + "_" + options.name, options);
	}

	restore_options(prefix, options) {
		var options_saved = this.get_user_param(prefix + "_" + options.name, "object");
		for (var i in options_saved) {
			if (typeof options_saved[i] != "object") options[i] = options_saved[i];else {
				if (!options[i]) options[i] = {};
				for (var j in options_saved[i]) options[i][j] = options_saved[i][j];
			}
		}
		return options;
	}

	fetch_type(prm, type) {
		if (type == "object") {
			try {
				prm = JSON.parse(prm);
			} catch (e) {
				prm = {};
			}
			return prm;
		} else if (type == "number") return utils.fix_number(prm, true);else if (type == "date") return utils.fix_date(prm, true);else if (type == "boolean") return utils.fix_boolean(prm);else return prm;
	}

}

function mngrs($p) {

	const { wsql, md } = $p;

	class DataManager extends _metadataAbstractAdapter.MetaEventEmitter {

		constructor(class_name) {

			super();

			this.constructor_names = {};
			this.by_ref = {};
			Object.defineProperties(this, {
				class_name: {
					get: () => class_name
				}
			});
		}

		metadata(field_name) {

			if (!this._meta) {
				this._meta = md.get(this.class_name);
			}

			if (field_name) {
				return this._meta && this._meta.fields && this._meta.fields[field_name] || md.get(this.class_name, field_name);
			} else {
				return this._meta;
			}
		}

		get alatable() {
			const { table_name } = this;
			return wsql.aladb.tables[table_name] ? wsql.aladb.tables[table_name].data : [];
		}

		get cachable() {

			const { class_name } = this;
			const _meta = this.metadata();

			if (class_name.indexOf("enm.") != -1) return "ram";

			if (_meta && _meta.cachable) return _meta.cachable;

			if (class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1) return "doc";

			return "ram";
		}

		get family_name() {
			return msg('meta_mgrs')[this.class_name.split(".")[0]].replace(msg('meta_mgrs').mgr + " ", "");
		}

		get table_name() {
			return this.class_name.replace(".", "_");
		}

		find_rows(selection, callback) {
			return utils._find_rows.call(this, this.by_ref, selection, callback);
		}

		find_rows_remote(selection) {
			return this.adapter.find_rows(this, selection);
		}

		extra_fields(obj) {
			var destinations = $p.cat.destinations || $p.cch.destinations,
			    pn = md.class_name_to_1c(this.class_name).replace(".", "_"),
			    res = [];

			if (destinations) {
				destinations.find_rows({ predefined_name: pn }, destination => {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if (ts) {
						ts.each(row => {
							if (!row._deleted && !row.ПометкаУдаления) res.push(row.property || row.Свойство);
						});
					}
					return false;
				});
			}

			return res;
		}

		extra_properties(obj) {
			return [];
		}

		obj_constructor(ts_name = "", mode) {

			if (!this.constructor_names[ts_name]) {
				var parts = this.class_name.split("."),
				    fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);
				this.constructor_names[ts_name] = ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;
			}

			ts_name = this.constructor_names[ts_name];

			if (!mode) {
				return ts_name;
			}

			if (mode === true) {
				return $p[ts_name];
			}

			if (Array.isArray(mode)) {
				return new $p[ts_name](...mode);
			}

			return new $p[ts_name](mode);
		}

		sync_grid(attr, grid) {

			var mgr = this;

			function request() {

				if (typeof attr.custom_selection == "function") {
					return attr.custom_selection(attr);
				} else if (mgr.cachable == "ram") {
					if (attr.action == "get_tree") return wsql.promise(mgr.get_sql_struct(attr), []).then($p.iface.data_to_tree);else if (attr.action == "get_selection") return wsql.promise(mgr.get_sql_struct(attr), []).then(data => $p.iface.data_to_grid.call(mgr, data, attr));
				} else if (mgr.cachable.indexOf("doc") == 0) {
					if (attr.action == "get_tree") return mgr.pouch_tree(attr);else if (attr.action == "get_selection") return mgr.pouch_selection(attr);
				} else {
					if (attr.action == "get_tree") return mgr.rest_tree(attr);else if (attr.action == "get_selection") return mgr.rest_selection(attr);
				}
			}

			function to_grid(res) {

				return new Promise(function (resolve, reject) {

					if (typeof res == "string") {

						if (res.substr(0, 1) == "{") res = JSON.parse(res);

						if (grid && grid.parse) {
							grid.xmlFileUrl = "exec";
							grid.parse(res, function () {
								resolve(res);
							}, "xml");
						} else resolve(res);
					} else if (grid instanceof dhtmlXTreeView && grid.loadStruct) {
						grid.loadStruct(res, function () {
							resolve(res);
						});
					} else resolve(res);
				});
			}

			return request().then(to_grid).catch($p.record_log);
		}

		get_option_list(selection) {

			var t = this,
			    l = [],
			    input_by_string,
			    text,
			    sel;

			if (selection.presentation && (input_by_string = t.metadata().input_by_string)) {
				text = selection.presentation.like;
				delete selection.presentation;
				selection.or = [];
				input_by_string.forEach(function (fld) {
					sel = {};
					sel[fld] = { like: text };
					selection.or.push(sel);
				});
			}

			if (t.cachable == "ram" || selection && selection._local) {
				t.find_rows(selection, function (v) {
					l.push(v);
				});
				return Promise.resolve(l);
			} else if (t.cachable != "e1cib") {
				return t.adapter.find_rows(t, selection).then(function (data) {
					data.forEach(function (v) {
						l.push(v);
					});
					return l;
				});
			} else {
				var attr = { selection: selection, top: selection._top },
				    is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
				delete selection._top;

				if (is_doc) attr.fields = ["ref", "date", "number_doc"];else if (t.metadata().main_presentation_name) attr.fields = ["ref", "name"];else attr.fields = ["ref", "id"];

				return _rest.load_array(attr, t).then(function (data) {
					data.forEach(function (v) {
						l.push({
							text: is_doc ? v.number_doc + " от " + moment(v.date).format(moment._masks.ldt) : v.name || v.id,
							value: v.ref });
					});
					return l;
				});
			}
		}

		printing_plates() {
			var rattr = {},
			    t = this;

			if (!t._printing_plates) {
				if (t.metadata().printing_plates) t._printing_plates = t.metadata().printing_plates;else if (t.metadata().cachable == "ram" || t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0) {
					t._printing_plates = {};
				}
			}

			if (!t._printing_plates && $p.ajax.authorized) {
				$p.ajax.default_attr(rattr, job_prm.irest_url());
				rattr.url += t.rest_name + "/Print()";
				return $p.ajax.get_ex(rattr.url, rattr).then(function (req) {
					t._printing_plates = JSON.parse(req.response);
					return t._printing_plates;
				}).catch(function () {}).then(function (pp) {
					return pp || (t._printing_plates = {});
				});
			}

			return Promise.resolve(t._printing_plates);
		}

		brodcast_event(name, attr) {
			md.emit(name, attr);
		}

		get adapter() {
			switch (this.cachable) {
				case undefined:
				case "ram":
				case "doc":
				case "doc_remote":
				case "remote":
				case "user":
				case "meta":
					return $p.adapters.pouch;
			}
			return $p.adapters[this.cachable];
		}

		static get EVENTS() {
			return {
				AFTER_CREATE: "AFTER_CREATE",

				AFTER_LOAD: "AFTER_LOAD",

				BEFORE_SAVE: "BEFORE_SAVE",

				BEFORE_SAVE: "BEFORE_SAVE",

				VALUE_CHANGE: "VALUE_CHANGE",

				ADD_ROW: "ADD_ROW",

				DEL_ROW: "DEL_ROW"
			};
		}

	}

	class RefDataManager extends DataManager {
		push(o, new_ref) {
			if (new_ref && new_ref != o.ref) {
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			} else this.by_ref[o.ref] = o;
		}

		each(fn) {
			for (var i in this.by_ref) {
				if (!i || i == utils.blank.guid) continue;
				if (fn.call(this, this.by_ref[i]) == true) break;
			}
		}

		forEach(fn) {
			return this.each.call(this, fn);
		}

		get(ref, do_not_create) {

			let o = this.by_ref[ref] || this.by_ref[ref = utils.fix_guid(ref)];

			if (!o) {
				if (do_not_create && do_not_create != 'promise') {
					return;
				} else {
					o = this.obj_constructor('', [ref, this, true]);
				}
			}

			if (ref === utils.blank.guid) {
				return do_not_create == 'promise' ? Promise.resolve(o) : o;
			}

			if (o.is_new()) {
				if (do_not_create == 'promise') {
					return o.load();
				} else {
					return o;
				}
			} else {
				return do_not_create == 'promise' ? Promise.resolve(o) : o;
			}
		}

		create(attr, fill_default) {

			if (!attr || typeof attr != "object") {
				attr = {};
			} else if (utils.is_data_obj(attr)) {
				return Promise.resolve(attr);
			}

			if (!attr.ref || !utils.is_guid(attr.ref) || utils.is_empty_guid(attr.ref)) {
				attr.ref = utils.generate_guid();
			}

			let o = this.by_ref[attr.ref];

			if (!o) {

				o = this.obj_constructor('', [attr, this]);

				if (!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2) {} else {

					if (o instanceof DocObj && o.date == utils.blank.date) {
						o.date = new Date();
					}

					let after_create_res = {};
					this.emit("after_create", o, after_create_res);

					let call_new_number_doc;
					if (this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager) {
						if (!o.number_doc) {
							call_new_number_doc = true;
						}
					} else {
						if (!o.id) {
							call_new_number_doc = true;
						}
					}

					return (call_new_number_doc ? o.new_number_doc() : Promise.resolve(o)).then(() => {

						if (after_create_res === false) return o;else if (typeof after_create_res === "object" && after_create_res.then) return after_create_res;

						if (this.cachable == "e1cib" && fill_default) {
							var rattr = {};
							$p.ajax.default_attr(rattr, job_prm.irest_url());
							rattr.url += this.rest_name + "/Create()";
							return $p.ajax.get_ex(rattr.url, rattr).then(function (req) {
								return utils._mixin(o, JSON.parse(req.response), undefined, ["ref"]);
							});
						} else return o;
					});
				}
			}

			return Promise.resolve(o);
		}

		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if (o.ref == ref) {
					a.splice(i, 1);
					return true;
				}
			});
		}

		find(val, columns) {
			return utils._find(this.by_ref, val, columns);
		}

		load_array(aattr, forse) {

			var ref,
			    obj,
			    res = [];

			for (var i = 0; i < aattr.length; i++) {

				ref = utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if (!obj) {

					if (forse == "update_only") {
						continue;
					}

					obj = this.obj_constructor('', [aattr[i], this]);
					if (forse) obj._set_loaded();
				} else if (obj.is_new() || forse) {
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}

		first_folder(owner) {
			for (var i in this.by_ref) {
				var o = this.by_ref[i];
				if (o.is_folder && (!owner || utils.is_equal(owner, o.owner))) return o;
			}
			return this.get();
		}

		get_sql_struct(attr) {
			var t = this,
			    cmd = t.metadata(),
			    res = {},
			    f,
			    f0,
			    trunc_index = 0,
			    action = attr && attr.action ? attr.action : "create_table";

			function sql_selection() {

				var ignore_parent = !attr.parent,
				    parent = attr.parent || utils.blank.guid,
				    owner,
				    initial_value = attr.initial_value || utils.blank.guid,
				    filter = attr.filter || "",
				    set_parent = utils.blank.guid;

				function list_flds() {
					var flds = [],
					    s = "_t_.ref, _t_.`_deleted`";

					if (cmd.form && cmd.form.selection) {
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});
					} else if (t instanceof DocManager) {
						flds.push("posted");
						flds.push("date");
						flds.push("number_doc");
					} else {

						if (cmd["hierarchical"] && cmd["group_hierarchy"]) flds.push("is_folder");else flds.push("0 as is_folder");

						if (t instanceof ChartOfAccountManager) {
							flds.push("id");
							flds.push("name as presentation");
						} else if (cmd["main_presentation_name"]) flds.push("name as presentation");else {
							if (cmd["code_length"]) flds.push("id as presentation");else flds.push("'...' as presentation");
						}

						if (cmd["has_owners"]) flds.push("owner");

						if (cmd["code_length"]) flds.push("id");
					}

					flds.forEach(fld => {
						if (fld.indexOf(" as ") != -1) s += ", " + fld;else s += md.sql_mask(fld, true);
					});
					return s;
				}

				function join_flds() {

					var s = "",
					    parts;

					if (cmd.form && cmd.form.selection) {
						for (var i in cmd.form.selection.fields) {
							if (cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1) continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if (parts[0].length > 1) {
								if (s) s += "\n";
								s += "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds() {

					var s;

					if (t instanceof ChartOfAccountManager) {
						s = " WHERE (" + (filter ? 0 : 1);
					} else if (cmd["hierarchical"]) {
						if (cmd["has_owners"]) s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);else s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);
					} else {
						if (cmd["has_owners"]) s = " WHERE (" + (owner == utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);else s = " WHERE (" + (filter ? 0 : 1);
					}

					if (t.sql_selection_where_flds) {
						s += t.sql_selection_where_flds(filter);
					} else if (t instanceof DocManager) s += " OR _t_.number_doc LIKE '" + filter + "'";else {
						if (cmd["main_presentation_name"] || t instanceof ChartOfAccountManager) s += " OR _t_.name LIKE '" + filter + "'";

						if (cmd["code_length"]) s += " OR _t_.id LIKE '" + filter + "'";
					}

					s += ") AND (_t_.ref != '" + utils.blank.guid + "')";

					if (attr.selection) {
						if (typeof attr.selection == "function") {} else attr.selection.forEach(sel => {
							for (var key in sel) {

								if (typeof sel[key] == "function") {
									s += "\n AND " + sel[key](t, key) + " ";
								} else if (cmd.fields.hasOwnProperty(key) || key === "ref") {
									if (sel[key] === true) s += "\n AND _t_." + key + " ";else if (sel[key] === false) s += "\n AND (not _t_." + key + ") ";else if (typeof sel[key] == "object") {

										if (utils.is_data_obj(sel[key]) || utils.is_guid(sel[key])) s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else {
											var keys = Object.keys(sel[key]),
											    val = sel[key][keys[0]],
											    mf = cmd.fields[key],
											    vmgr;

											if (mf && mf.type.is_ref) {
												vmgr = utils.value_mgr({}, key, mf.type, true, val);
											}

											if (keys[0] == "not") s += "\n AND (not _t_." + key + " = '" + val + "') ";else if (keys[0] == "in") s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce((sum, val) => {
												if (sum) {
													sum += ",";
												}
												if (typeof val == "number") {
													sum += val.toString();
												} else {
													sum += "'" + val + "'";
												}
												return sum;
											}, "") + ")) ";else s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									} else if (typeof sel[key] == "string") s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if (key == "is_folder" && cmd.hierarchical && cmd.group_hierarchy) {}
							}
						});
					}

					return s;
				}

				function order_flds() {

					if (t instanceof ChartOfAccountManager) {
						return "ORDER BY id";
					} else if (cmd["hierarchical"]) {
						if (cmd["group_hierarchy"]) return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";else return "ORDER BY _t_.parent desc, is_initial_value, presentation";
					} else return "ORDER BY is_initial_value, presentation";
				}

				function selection_prms() {
					function on_parent(o) {
						if (o) {
							set_parent = attr.set_parent = o.parent.ref;
							parent = set_parent;
							ignore_parent = false;
						}

						if (filter && filter.indexOf("%") == -1) filter = "%" + filter + "%";
					}

					if (cmd["has_owners"]) {
						owner = attr.owner;
						if (attr.selection && typeof attr.selection != "function") {
							attr.selection.forEach(sel => {
								if (sel.owner) {
									owner = typeof sel.owner == "object" ? sel.owner.valueOf() : sel.owner;
									delete sel.owner;
								}
							});
						}
						if (!owner) owner = utils.blank.guid;
					}

					if (initial_value != utils.blank.guid && ignore_parent) {
						if (cmd["hierarchical"]) {
							on_parent(t.get(initial_value));
						} else on_parent();
					} else on_parent();
				}

				selection_prms();

				var sql;
				if (t.sql_selection_list_flds) sql = t.sql_selection_list_flds(initial_value);else sql = ("SELECT %2, case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300").replace("%2", list_flds()).replace("%j", join_flds());

				return sql.replace("%3", where_flds()).replace("%4", order_flds());
			}

			function sql_create() {

				var sql = "CREATE TABLE IF NOT EXISTS ";

				if (attr && attr.postgres) {
					sql += t.table_name + " (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

					if (t instanceof DocManager) sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";else {
						if (cmd.code_length) sql += ", id character(" + cmd.code_length + ")";
						sql += ", name character varying(50), is_folder boolean";
					}

					for (f in cmd.fields) {
						if (f.length > 30) {
							if (cmd.fields[f].short_name) f0 = cmd.fields[f].short_name;else {
								trunc_index++;
								f0 = f[0] + trunc_index + f.substr(f.length - 27);
							}
						} else f0 = f;
						sql += ", " + f0 + md.sql_type(t, f, cmd.fields[f].type, true);
					}

					for (f in cmd["tabular_sections"]) sql += ", " + "ts_" + f + " JSON";
				} else {
					sql += "`" + t.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					if (t instanceof DocManager) sql += ", posted boolean, date Date, number_doc CHAR";else sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

					for (f in cmd.fields) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.fields[f].type);

					for (f in cmd["tabular_sections"]) sql += ", " + "`ts_" + f + "` JSON";
				}

				sql += ")";

				return sql;
			}

			function sql_update() {
				var fields = ["ref", "_deleted"],
				    sql = "INSERT INTO `" + t.table_name + "` (ref, `_deleted`",
				    values = "(?";

				if (t.class_name.substr(0, 3) == "cat") {
					sql += ", id, name, is_folder";
					fields.push("id");
					fields.push("name");
					fields.push("is_folder");
				} else if (t.class_name.substr(0, 3) == "doc") {
					sql += ", posted, date, number_doc";
					fields.push("posted");
					fields.push("date");
					fields.push("number_doc");
				}
				for (f in cmd.fields) {
					sql += md.sql_mask(f);
					fields.push(f);
				}
				for (f in cmd["tabular_sections"]) {
					sql += ", `ts_" + f + "`";
					fields.push("ts_" + f);
				}
				sql += ") VALUES ";
				for (f = 1; f < fields.length; f++) {
					values += ", ?";
				}
				values += ")";
				sql += values;

				return { sql: sql, fields: fields, values: values };
			}

			if (action == "create_table") res = sql_create();else if (["insert", "update", "replace"].indexOf(action) != -1) res[t.table_name] = sql_update();else if (action == "select") res = "SELECT * FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "select_all") res = "SELECT * FROM `" + t.table_name + "`";else if (action == "delete") res = "DELETE FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "drop") res = "DROP TABLE IF EXISTS `" + t.table_name + "`";else if (action == "get_tree") {
				if (!attr.filter || attr.filter.is_folder) res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";else res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
			} else if (action == "get_selection") res = sql_selection();

			return res;
		}

		caption_flds(attr) {
			return [];
		}

		load_cached_server_array(list, alt_rest_name) {

			var query = [],
			    obj,
			    t = this,
			    mgr = alt_rest_name ? { class_name: t.class_name, rest_name: alt_rest_name } : t,
			    check_loaded = !alt_rest_name;

			list.forEach(o => {
				obj = t.get(o.ref || o, true);
				if (!obj || check_loaded && obj.is_new()) query.push(o.ref || o);
			});
			if (query.length) {

				var attr = {
					url: "",
					selection: { ref: { in: query } }
				};
				if (check_loaded) attr.fields = ["ref"];

				$p.rest.build_select(attr, mgr);


				return $p.ajax.get_ex(attr.url, attr).then(function (req) {
					var data = JSON.parse(req.response);

					if (check_loaded) data = data.value;else {
						data = data.data;
						for (var i in data) {
							if (!data[i].ref && data[i].id) data[i].ref = data[i].id;
							if (data[i].Код) {
								data[i].id = data[i].Код;
								delete data[i].Код;
							}
							data[i]._not_set_loaded = true;
						}
					}

					t.load_array(data);
					return list;
				});
			} else return Promise.resolve(list);
		}

		predefined(name) {

			if (!this._predefined) this._predefined = {};

			if (!this._predefined[name]) {

				this._predefined[name] = this.get();

				this.find_rows({ predefined_name: name }, function (el) {
					this._predefined[name] = el;
					return false;
				});
			}

			return this._predefined[name];
		}

	}

	class DataProcessorsManager extends DataManager {
		create() {
			return this.obj_constructor('', [{}, this]);
		}

		get(ref) {
			if (ref) {
				if (!this.by_ref[ref]) {
					this.by_ref[ref] = this.create();
				}
				return this.by_ref[ref];
			} else return this.create();
		}

		unload_obj(ref) {}
	}

	class EnumManager extends RefDataManager {

		constructor(class_name) {
			super(class_name);

			for (var v of md.get(class_name)) new EnumObj(v, this);
		}

		get(ref, do_not_create) {

			if (ref instanceof EnumObj) return ref;else if (!ref || ref == utils.blank.guid) ref = "_";

			var o = this[ref];
			if (!o) o = new EnumObj({ name: ref }, this);

			return o;
		}

		push(o, new_ref) {
			Object.defineProperty(this, new_ref, {
				value: o
			});
		}

		each(fn) {
			this.alatable.forEach(v => {
				if (v.ref && v.ref != "_" && v.ref != utils.blank.guid) fn.call(this[v.ref]);
			});
		}

		get_sql_struct(attr) {

			var res = "CREATE TABLE IF NOT EXISTS ",
			    action = attr && attr.action ? attr.action : "create_table";

			if (attr && attr.postgres) {
				if (action == "create_table") res += this.table_name + " (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";else if (["insert", "update", "replace"].indexOf(action) != -1) {
					res = {};
					res[this.table_name] = {
						sql: "INSERT INTO " + this.table_name + " (ref, sequence, synonym) VALUES ($1, $2, $3)",
						fields: ["ref", "sequence", "synonym"],
						values: "($1, $2, $3)"
					};
				} else if (action == "delete") res = "DELETE FROM " + this.table_name + " WHERE ref = $1";
			} else {
				if (action == "create_table") res += "`" + this.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";else if (["insert", "update", "replace"].indexOf(action) != -1) {
					res = {};
					res[this.table_name] = {
						sql: "INSERT INTO `" + this.table_name + "` (ref, sequence, synonym) VALUES (?, ?, ?)",
						fields: ["ref", "sequence", "synonym"],
						values: "(?, ?, ?)"
					};
				} else if (action == "delete") res = "DELETE FROM `" + this.table_name + "` WHERE ref = ?";
			}

			return res;
		}

		get_option_list(selection) {
			var l = [],
			    synonym = "",
			    sref;

			if (selection) {
				for (var i in selection) {
					if (i.substr(0, 1) != "_") {
						if (i == "ref") {
							sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
						} else synonym = selection[i];
					}
				}
			}

			if (typeof synonym == "object") {
				if (synonym.like) synonym = synonym.like;else synonym = "";
			}
			synonym = synonym.toLowerCase();

			this.alatable.forEach(v => {
				if (synonym) {
					if (!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1) return;
				}
				if (sref) {
					if (Array.isArray(sref)) {
						if (!sref.some(sv => sv.name == v.ref || sv.ref == v.ref || sv == v.ref)) return;
					} else {
						if (sref.name != v.ref && sref.ref != v.ref && sref != v.ref) return;
					}
				}
				l.push(this[v.ref]);
			});

			return Promise.resolve(l);
		}

	}

	class RegisterManager extends DataManager {
		push(o, new_ref) {
			if (new_ref && new_ref != o.ref) {
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			} else this.by_ref[o.ref] = o;
		}
		get(attr, return_row) {

			if (!attr) attr = {};else if (typeof attr == "string") attr = { ref: attr };

			if (attr.ref && return_row) return this.by_ref[attr.ref];

			attr.action = "select";

			var arr = wsql.alasql(this.get_sql_struct(attr), attr._values),
			    res;

			delete attr.action;
			delete attr._values;

			if (arr.length) {
				if (return_row) res = this.by_ref[this.get_ref(arr[0])];else {
					res = [];
					for (var i in arr) res.push(this.by_ref[this.get_ref(arr[i])]);
				}
			}

			return res;
		}
		unload_obj(ref) {
			delete this.by_ref[ref];
			this.alatable.some((o, i, a) => {
				if (o.ref == ref) {
					a.splice(i, 1);
					return true;
				}
			});
		}
		load_array(aattr, forse) {

			var ref,
			    obj,
			    res = [];

			for (var i = 0; i < aattr.length; i++) {

				ref = this.get_ref(aattr[i]);
				obj = this.by_ref[ref];

				if (!obj && !aattr[i]._deleted) {
					obj = this.obj_constructor('', [aattr[i], this]);
					if (forse) obj._set_loaded();
				} else if (obj && aattr[i]._deleted) {
					obj.unload();
					continue;
				} else if (obj.is_new() || forse) {
					utils._mixin(obj, aattr[i])._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}
		get_sql_struct(attr) {
			var t = this,
			    cmd = t.metadata(),
			    res = {},
			    f,
			    action = attr && attr.action ? attr.action : "create_table";

			function sql_selection() {

				var filter = attr.filter || "";

				function list_flds() {
					var flds = [],
					    s = "_t_.ref";

					if (cmd.form && cmd.form.selection) {
						cmd.form.selection.fields.forEach(fld => flds.push(fld));
					} else {

						for (var f in cmd["dimensions"]) {
							flds.push(f);
						}
					}

					flds.forEach(fld => {
						if (fld.indexOf(" as ") != -1) s += ", " + fld;else s += md.sql_mask(fld, true);
					});
					return s;
				}

				function join_flds() {

					var s = "",
					    parts;

					if (cmd.form && cmd.form.selection) {
						for (var i in cmd.form.selection.fields) {
							if (cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1) continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if (parts[0].length > 1) {
								if (s) s += "\n";
								s += "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds() {

					var s = " WHERE (" + (filter ? 0 : 1);

					if (t.sql_selection_where_flds) {
						s += t.sql_selection_where_flds(filter);
					}

					s += ")";

					if (attr.selection) {
						if (typeof attr.selection == "function") {} else attr.selection.forEach(sel => {
							for (var key in sel) {

								if (typeof sel[key] == "function") {
									s += "\n AND " + sel[key](t, key) + " ";
								} else if (cmd.fields.hasOwnProperty(key)) {
									if (sel[key] === true) s += "\n AND _t_." + key + " ";else if (sel[key] === false) s += "\n AND (not _t_." + key + ") ";else if (typeof sel[key] == "object") {

										if (utils.is_data_obj(sel[key])) s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else {
											var keys = Object.keys(sel[key]),
											    val = sel[key][keys[0]],
											    mf = cmd.fields[key],
											    vmgr;

											if (mf && mf.type.is_ref) {
												vmgr = utils.value_mgr({}, key, mf.type, true, val);
											}

											if (keys[0] == "not") s += "\n AND (not _t_." + key + " = '" + val + "') ";else s += "\n AND (_t_." + key + " = '" + val + "') ";
										}
									} else if (typeof sel[key] == "string") s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";else s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
								} else if (key == "is_folder" && cmd.hierarchical && cmd.group_hierarchy) {}
							}
						});
					}

					return s;
				}

				function order_flds() {

					return "";
				}

				if (filter && filter.indexOf("%") == -1) filter = "%" + filter + "%";

				var sql;
				if (t.sql_selection_list_flds) sql = t.sql_selection_list_flds();else sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300").replace("%2", list_flds()).replace("%j", join_flds());

				return sql.replace("%3", where_flds()).replace("%4", order_flds());
			}

			function sql_create() {

				var sql = "CREATE TABLE IF NOT EXISTS ",
				    first_field = true;

				if (attr && attr.postgres) {
					sql += t.table_name + " (";

					if (cmd.splitted) {
						sql += "zone integer";
						first_field = false;
					}

					for (f in cmd.dimensions) {
						if (first_field) {
							sql += f;
							first_field = false;
						} else sql += ", " + f;
						sql += md.sql_type(t, f, cmd.dimensions[f].type, true);
					}

					for (f in cmd.resources) sql += ", " + f + md.sql_type(t, f, cmd.resources[f].type, true);

					for (f in cmd.attributes) sql += ", " + f + md.sql_type(t, f, cmd.attributes[f].type, true);

					sql += ", PRIMARY KEY (";
					first_field = true;
					if (cmd.splitted) {
						sql += "zone";
						first_field = false;
					}
					for (f in cmd["dimensions"]) {
						if (first_field) {
							sql += f;
							first_field = false;
						} else sql += ", " + f;
					}
				} else {
					sql += "`" + t.table_name + "` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					for (f in cmd.dimensions) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.dimensions[f].type);

					for (f in cmd.resources) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.resources[f].type);

					for (f in cmd.attributes) sql += md.sql_mask(f) + md.sql_type(t, f, cmd.attributes[f].type);
				}

				sql += ")";

				return sql;
			}

			function sql_update() {
				var sql = "INSERT OR REPLACE INTO `" + t.table_name + "` (",
				    fields = [],
				    first_field = true;

				for (f in cmd.dimensions) {
					if (first_field) {
						sql += f;
						first_field = false;
					} else sql += ", " + f;
					fields.push(f);
				}
				for (f in cmd.resources) {
					sql += ", " + f;
					fields.push(f);
				}
				for (f in cmd.attributes) {
					sql += ", " + f;
					fields.push(f);
				}

				sql += ") VALUES (?";
				for (f = 1; f < fields.length; f++) {
					sql += ", ?";
				}
				sql += ")";

				return { sql: sql, fields: fields };
			}

			function sql_select() {
				var sql = "SELECT * FROM `" + t.table_name + "` WHERE ",
				    first_field = true;
				attr._values = [];

				for (var f in cmd["dimensions"]) {

					if (first_field) first_field = false;else sql += " and ";

					sql += "`" + f + "`" + "=?";
					attr._values.push(attr[f]);
				}

				if (first_field) sql += "1";

				return sql;
			}

			if (action == "create_table") res = sql_create();else if (action in { insert: "", update: "", replace: "" }) res[t.table_name] = sql_update();else if (action == "select") res = sql_select();else if (action == "select_all") res = sql_select();else if (action == "delete") res = "DELETE FROM `" + t.table_name + "` WHERE ref = ?";else if (action == "drop") res = "DROP TABLE IF EXISTS `" + t.table_name + "`";else if (action == "get_selection") res = sql_selection();

			return res;
		}

		get_ref(attr) {

			if (attr instanceof RegisterRow) attr = attr._obj;

			if (attr.ref) return attr.ref;

			var key = "",
			    dimensions = this.metadata().dimensions;

			for (var j in dimensions) {
				key += key ? "¶" : "";
				if (dimensions[j].type.is_ref) key += utils.fix_guid(attr[j]);else if (!attr[j] && dimensions[j].type.digits) key += "0";else if (dimensions[j].date_part) key += moment(attr[j] || utils.blank.date).format(moment.defaultFormatUtc);else if (attr[j] != undefined) key += String(attr[j]);else key += "$";
			}
			return key;
		}

		caption_flds(attr) {
			return [];
		}

		create(attr) {

			if (!attr || typeof attr != "object") attr = {};

			var o = this.by_ref[attr.ref];
			if (!o) {

				o = this.obj_constructor('', [attr, this]);

				let after_create_res = {};
				this.emit("after_create", o, after_create_res);

				if (after_create_res === false) return Promise.resolve(o);else if (typeof after_create_res === "object" && after_create_res.then) return after_create_res;
			}

			return Promise.resolve(o);
		}

	}

	class InfoRegManager extends RegisterManager {
		slice_first(filter) {}

		slice_last(filter) {}
	}

	class AccumRegManager extends RegisterManager {}

	class CatManager extends RefDataManager {

		constructor(class_name) {

			super(class_name);

			const _meta = this.metadata() || {};

			if (_meta.hierarchical && _meta.group_hierarchy) {
				Object.defineProperty(this.obj_constructor('', true).prototype, 'is_folder', {
					get: function () {
						return this._obj.is_folder || false;
					},
					set: function (v) {
						this._obj.is_folder = utils.fix_boolean(v);
					},
					enumerable: true,
					configurable: true
				});
			}
		}

		by_name(name) {

			var o;

			this.find_rows({ name: name }, obj => {
				o = obj;
				return false;
			});

			if (!o) o = this.get();

			return o;
		}

		by_id(id) {

			var o;

			this.find_rows({ id: id }, obj => {
				o = obj;
				return false;
			});

			if (!o) o = this.get();

			return o;
		}
		path(ref) {
			var res = [],
			    tobj;

			if (ref instanceof DataObj) tobj = ref;else tobj = this.get(ref, true);

			if (tobj) res.push({ ref: tobj.ref, presentation: tobj.presentation });

			if (tobj && this.metadata().hierarchical) {
				while (true) {
					tobj = tobj.parent;
					if (tobj.empty()) break;
					res.push({ ref: tobj.ref, presentation: tobj.presentation });
				}
			}

			return res;
		}
	}

	class ChartOfCharacteristicManager extends CatManager {
		toString() {
			return msg('meta_mgrs').cch;
		}
	}

	class ChartOfAccountManager extends CatManager {
		toString() {
			return msg('meta_mgrs').cacc;
		}
	}

	class DocManager extends RefDataManager {
		toString() {
			return msg('meta_mgrs').doc;
		}
	}

	class TaskManager extends CatManager {
		toString() {
			return msg('meta_mgrs').tsk;
		}
	}

	class BusinessProcessManager extends CatManager {
		toString() {
			return msg('meta_mgrs').bp;
		}
	}

	class Enumerations {
		toString() {
			return msg('meta_classes').enm;
		}
	}

	class Catalogs {
		toString() {
			return msg('meta_classes').cat;
		}
	}

	class Documents {
		toString() {
			return msg('meta_classes').doc;
		}
	}

	class InfoRegs {
		toString() {
			return msg('meta_classes').ireg;
		}
	}

	class AccumRegs {
		toString() {
			return msg('meta_classes').areg;
		}
	}

	class AccountsRegs {
		toString() {
			return msg('meta_classes').accreg;
		}
	}

	class DataProcessors {
		toString() {
			return msg('meta_classes').dp;
		}
	}

	class Reports {
		toString() {
			return msg('meta_classes').rep;
		}
	}

	class ChartsOfAccounts {
		toString() {
			return msg('meta_classes').cacc;
		}
	}

	class ChartsOfCharacteristics {
		toString() {
			return msg('meta_classes').cch;
		}
	}

	class Tasks {
		toString() {
			return msg('meta_classes').tsk;
		}
	}

	class BusinessProcesses {
		toString() {
			return msg('meta_classes').bp;
		}
	}

	if (!classes.DataManager) {

		Object.defineProperties(classes, {

			$p: {
				get: function () {
					return $p;
				}
			},

			DataManager: { value: DataManager },

			RefDataManager: { value: RefDataManager },

			DataProcessorsManager: { value: DataProcessorsManager },

			EnumManager: { value: EnumManager },

			RegisterManager: { value: RegisterManager },

			InfoRegManager: { value: InfoRegManager },

			AccumRegManager: { value: AccumRegManager },

			CatManager: { value: CatManager },

			ChartOfCharacteristicManager: { value: ChartOfCharacteristicManager },

			ChartOfAccountManager: { value: ChartOfAccountManager },

			DocManager: { value: DocManager },

			TaskManager: { value: TaskManager },

			BusinessProcessManager: { value: BusinessProcessManager }

		});
	}

	Object.defineProperties($p, {
		enm: { value: new Enumerations() },

		cat: { value: new Catalogs() },

		doc: { value: new Documents() },

		ireg: { value: new InfoRegs() },

		areg: { value: new AccumRegs() },

		accreg: { value: new AccountsRegs() },

		dp: { value: new DataProcessors() },

		rep: { value: new Reports() },

		cacc: { value: new ChartsOfAccounts() },

		cch: { value: new ChartsOfCharacteristics() },

		tsk: { value: new Tasks() },

		bp: { value: new BusinessProcesses() }

	});

	if (!utils.value_mgr) {
		Object.defineProperty(utils, 'value_mgr', {

			value: function (row, f, mf, array_enabled, v) {

				let property, oproperty, tnames, rt, mgr;

				if (mf._mgr) {
					return mf._mgr;
				}

				function mf_mgr(mgr) {
					if (mgr && mf.types.length == 1) {
						mf._mgr = mgr;
					}
					return mgr;
				}

				if (mf.types.length == 1) {
					tnames = mf.types[0].split(".");
					if (tnames.length > 1 && $p[tnames[0]]) return mf_mgr($p[tnames[0]][tnames[1]]);
				} else if (v && v.type) {
					tnames = v.type.split(".");
					if (tnames.length > 1 && $p[tnames[0]]) return mf_mgr($p[tnames[0]][tnames[1]]);
				}

				property = row.property || row.param;
				if (f != "value" || !property) {

					rt = [];
					mf.types.forEach(function (v) {
						tnames = v.split(".");
						if (tnames.length > 1 && $p[tnames[0]][tnames[1]]) {
							rt.push($p[tnames[0]][tnames[1]]);
						}
					});
					if (rt.length == 1 || row[f] == utils.blank.guid) {
						return mf_mgr(rt[0]);
					} else if (array_enabled) {
						return rt;
					} else if ((property = row[f]) instanceof DataObj) {
						return property._manager;
					} else if (utils.is_guid(property) && property != utils.blank.guid) {
						for (var i in rt) {
							mgr = rt[i];
							if (mgr.get(property, true)) {
								return mgr;
							}
						}
					}
				} else {
					if (utils.is_data_obj(property)) {
						oproperty = property;
					} else if (utils.is_guid(property)) {
						oproperty = $p.cch.properties.get(property);
					} else {
						return;
					}

					if (utils.is_data_obj(oproperty)) {

						if (oproperty.is_new()) {
							return $p.cat.property_values;
						}

						for (rt in oproperty.type.types) {
							if (oproperty.type.types[rt].indexOf(".") > -1) {
								tnames = oproperty.type.types[rt].split(".");
								break;
							}
						}
						if (tnames && tnames.length > 1 && $p[tnames[0]]) {
							return mf_mgr($p[tnames[0]][tnames[1]]);
						} else {
							return oproperty.type;
						}

						rt = [];
						oproperty.type.types.some(v => {
							tnames = v.split(".");
							if (tnames.length > 1 && $p[tnames[0]][tnames[1]]) {
								rt.push($p[tnames[0]][tnames[1]]);
							} else if (v == "boolean") {
								rt.push({ types: ["boolean"] });
								return true;
							}
						});
						if (rt.length == 1 || row[f] == utils.blank.guid) {
							return mf_mgr(rt[0]);
						} else if (array_enabled) {
							return rt;
						} else if ((property = row[f]) instanceof DataObj) {
							return property._manager;
						} else if (utils.is_guid(property) && property != utils.blank.guid) {
							for (let i in rt) {
								mgr = rt[i];
								if (mgr.get(property, false, true)) {
									return mgr;
								}
							}
						}
					}
				}
			}
		});
	}
}

class DataObj {

	constructor(attr, manager) {
		if (!(manager instanceof classes.DataProcessorsManager) && !(manager instanceof classes.EnumManager)) {
			const tmp = manager.get(attr, true);
			if (tmp) {
				return tmp;
			}
		}

		const _obj = {
			ref: manager instanceof classes.EnumManager ? attr.name : !(manager instanceof classes.RegisterManager) ? utils.fix_guid(attr) : manager.get_ref(attr)
		};
		const _ts_ = {};

		Object.defineProperties(this, {
			_obj: {
				value: _obj,
				configurable: true
			},

			_ts_: {
				value: name => _ts_[name] || (_ts_[name] = new TabularSection(name, this)),
				configurable: true
			},

			_manager: {
				value: manager
			},

			_data: {
				value: {
					_is_new: !(this instanceof EnumObj)
				},
				configurable: true
			}

		});

		if (manager.alatable && manager.push) {
			manager.alatable.push(_obj);
			manager.push(this, _obj.ref);
		}

		attr = null;
	}

	_getter(f) {

		const mf = this._metadata(f).type;
		const res = this._obj ? this._obj[f] : "";

		if (f == "type" && typeof res == "object") {
			return res;
		} else if (f == "ref") {
			return res;
		} else if (mf.is_ref) {

			if (mf.digits && typeof res === "number") {
				return res;
			}

			if (mf.hasOwnProperty("str_len") && !utils.is_guid(res)) {
				return res;
			}

			let mgr = utils.value_mgr(this._obj, f, mf);
			if (mgr) {
				if (utils.is_data_mgr(mgr)) {
					return mgr.get(res);
				} else {
					return utils.fetch_type(res, mgr);
				}
			}

			if (res) {
				console.log([f, mf, this._obj]);
				return null;
			}
		} else if (mf.date_part) {
			return utils.fix_date(this._obj[f], true);
		} else if (mf.digits) {
			return utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));
		} else if (mf.types[0] == "boolean") {
			return utils.fix_boolean(this._obj[f]);
		} else {
			return this._obj[f] || "";
		}
	}

	__setter(f, v) {

		const { _obj } = this;
		const mf = this._metadata(f).type;

		if (f == "type" && v.types) {
			_obj[f] = v;
		} else if (f == "ref") {
			_obj[f] = utils.fix_guid(v);
		} else if (mf.is_ref) {

			if (mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !utils.is_guid(v)) {
				_obj[f] = v;
			} else if (typeof v == "boolean" && mf.types.indexOf("boolean") != -1) {
				_obj[f] = v;
			} else {
				_obj[f] = utils.fix_guid(v);

				if (utils.is_data_obj(v) && mf.types.indexOf(v._manager.class_name) != -1) {} else {
					let mgr = utils.value_mgr(_obj, f, mf, false, v);
					if (mgr) {
						if (mgr instanceof classes.EnumManager) {
							if (typeof v == "string") _obj[f] = v;else if (!v) _obj[f] = "";else if (typeof v == "object") _obj[f] = v.ref || v.name || "";
						} else if (v && v.presentation) {
							if (v.type && !(v instanceof DataObj)) delete v.type;
							mgr.create(v);
						} else if (!utils.is_data_mgr(mgr)) _obj[f] = utils.fetch_type(v, mgr);
					} else {
						if (typeof v != "object") _obj[f] = v;
					}
				}
			}
		} else if (mf.date_part) {
			_obj[f] = utils.fix_date(v, true);
		} else if (mf.digits) {
			_obj[f] = utils.fix_number(v, !mf.hasOwnProperty("str_len"));
		} else if (mf.types[0] == "boolean") {
			_obj[f] = utils.fix_boolean(v);
		} else {
			_obj[f] = v;
		}
	}

	__notify(f) {
		if (!this._data._silent) {}
	}

	_setter(f, v) {
		if (this._obj[f] != v) {
			this.__notify(f);
			this.__setter(f, v);
			this._data._modified = true;
		}
	}

	_getter_ts(f) {
		return this._ts_(f);
	}

	_setter_ts(f, v) {
		const ts = this._ts_(f);
		if (ts instanceof TabularSection && Array.isArray(v)) {
			ts.load(v);
		}
	}

	valueOf() {
		return this.ref;
	}

	toJSON() {
		return this._obj;
	}

	toString() {
		return this.presentation;
	}

	_metadata(field_name) {
		return this._manager.metadata(field_name);
	}

	get _deleted() {
		return !!this._obj._deleted;
	}

	get _modified() {
		return !!this._data._modified;
	}

	is_new() {
		return this._data._is_new;
	}

	_set_loaded(ref) {
		this._manager.push(this, ref);
		this._data._modified = false;
		this._data._is_new = false;
		return this;
	}

	mark_deleted(deleted) {
		this._obj._deleted = !!deleted;
		return this.save();
	}

	empty() {
		return utils.is_empty_guid(this._obj.ref);
	}

	load() {

		if (this.ref == utils.blank.guid) {

			if (this instanceof CatObj) this.id = "000000000";else this.number_doc = "000000000";

			return Promise.resolve(this);
		} else {

			return this._manager.adapter.load_obj(this).then(() => {
				this._data._modified = false;
				setTimeout(() => {
					this._manager.brodcast_event("obj_loaded", this);
				});
				return this;
			});
		}
	}

	unload() {

		const { obj, ref, _observers, _notis, _manager } = this;

		_manager.unload_obj(ref);

		if (_observers) {
			_observers.length = 0;
		}

		if (_notis) {
			_notis.length = 0;
		}

		for (let f in this._metadata().tabular_sections) {
			this[f].clear(true);
		}

		for (let f in this) {
			if (this.hasOwnProperty(f)) {
				delete this[f];
			}
		}

		for (let f in obj) {
			delete obj[f];
		}

		["_ts_", "_obj", "_data"].forEach(f => {
			delete this[f];
		});
	}

	save(post, operational, attachments) {

		if (this instanceof DocObj && typeof post == "boolean") {
			var initial_posted = this.posted;
			this.posted = post;
		}

		let saver,
		    before_save_res = {},
		    reset_modified = () => {

			if (before_save_res === false) {
				if (this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted) {
					this.posted = initial_posted;
				}
			} else this._data._modified = false;

			saver = null;
			before_save_res = null;
			reset_modified = null;

			return this;
		};

		this._manager.emit("before_save", this, before_save_res);

		if (before_save_res === false) {
			return Promise.reject(reset_modified());
		} else if (before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then) {
			return before_save_res.then(reset_modified);
		}

		if (this._metadata().hierarchical && !this._obj.parent) this._obj.parent = utils.blank.guid;

		if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) {

			if (utils.blank.date == this.date) {
				this.date = new Date();
			}

			if (!this.number_doc) {
				this.new_number_doc();
			}
		} else {
			if (!this.id) {
				this.new_number_doc();
			}
		}

		return this._manager.adapter.save_obj(this, {
			post: post,
			operational: operational,
			attachments: attachments
		}).then(function (obj) {
			obj._manager.emit("after_save", obj);
			return obj;
		}).then(reset_modified);
	}

	get_attachment(att_id) {
		const { _manager, ref } = this;
		return _manager.adapter.get_attachment(_manager, ref, att_id);
	}

	save_attachment(att_id, attachment, type) {
		const { _manager, ref, _attachments } = this;
		return _manager.save_attachment(ref, att_id, attachment, type).then(att => {
			if (!_attachments) this._attachments = {};
			if (!this._attachments[att_id] || !att.stub) this._attachments[att_id] = att;
			return att;
		});
	}

	delete_attachment(att_id) {
		const { _manager, ref, _attachments } = this;
		return _manager.delete_attachment(ref, att_id).then(att => {
			if (_attachments) delete _attachments[att_id];
			return att;
		});
	}

	_silent(v) {
		const { _data } = this;
		if (typeof v == "boolean") {
			_data._silent = v;
		} else {
			_data._silent = true;
			setTimeout(() => {
				_data._silent = false;
			});
		}
	}

	_mixin_attr(attr) {

		if (attr && typeof attr == "object") {
			if (attr._not_set_loaded) {
				delete attr._not_set_loaded;
				utils._mixin(this, attr);
			} else {
				utils._mixin(this, attr);

				if (!utils.is_empty_guid(this.ref) && (attr.id || attr.name)) this._set_loaded(this.ref);
			}
		}
	}

	print(model, wnd) {
		return this._manager.print(this, model, wnd);
	}

}

Object.defineProperty(DataObj.prototype, "ref", {
	get: function () {
		return this._obj.ref;
	},
	set: function (v) {
		this._obj.ref = utils.fix_guid(v);
	},
	enumerable: true,
	configurable: true
});

class CatObj extends DataObj {

	constructor(attr, manager) {
		super(attr, manager);

		this._mixin_attr(attr);
	}

	get presentation() {
		if (this.name || this.id) {
			return this.name || this.id || this._metadata().obj_presentation || this._metadata().synonym;
		} else return this._presentation || '';
	}
	set presentation(v) {
		if (v) this._presentation = String(v);
	}

	get id() {
		return this._obj.id || "";
	}
	set id(v) {
		this.__notify('id');
		this._obj.id = v;
	}

	get name() {
		return this._obj.name || "";
	}
	set name(v) {
		this.__notify('name');
		this._obj.name = String(v);
	}

}

let NumberDocAndDate = superclass => class extends superclass {
	get number_doc() {
		return this._obj.number_doc || "";
	}
	set number_doc(v) {
		this.__notify('number_doc');
		this._obj.number_doc = v;
	}

	get date() {
		return this._obj.date instanceof Date ? this._obj.date : utils.blank.date;
	}
	set date(v) {
		this.__notify('date');
		this._obj.date = utils.fix_date(v, true);
	}

};

class DocObj extends NumberDocAndDate(DataObj) {

	constructor(attr, manager) {
		super(attr, manager);

		this._mixin_attr(attr);
	}

	get presentation() {
		if (this.number_doc) return (this._metadata().obj_presentation || this._metadata().synonym) + ' №' + this.number_doc + " от " + moment(this.date).format(moment._masks.ldt);else return this._presentation || "";
	}
	set presentation(v) {
		if (v) this._presentation = String(v);
	}

	get posted() {
		return this._obj.posted || false;
	}
	set posted(v) {
		this.__notify('posted');
		this._obj.posted = utils.fix_boolean(v);
	}

}

class DataProcessorObj extends DataObj {

	constructor(attr, manager) {
		super(attr, manager);

		const cmd = manager.metadata();

		for (let f in cmd.fields) {
			attr[f] = utils.fetch_type("", cmd.fields[f].type);
		}

		for (let f in cmd["tabular_sections"]) {
			attr[f] = [];
		}

		utils._mixin(this, attr);
	}
}

class TaskObj extends NumberDocAndDate(CatObj) {}

class BusinessProcessObj extends NumberDocAndDate(CatObj) {}

class EnumObj extends DataObj {

	constructor(attr, manager) {
		super(attr, manager);

		if (attr && typeof attr == "object") utils._mixin(this, attr);
	}

	get order() {
		return this._obj.sequence;
	}

	set order(v) {
		this._obj.sequence = parseInt(v);
	}

	get name() {
		return this._obj.ref;
	}

	set name(v) {
		this._obj.ref = String(v);
	}

	get synonym() {
		return this._obj.synonym || "";
	}

	set synonym(v) {
		this._obj.synonym = String(v);
	}

	get presentation() {
		return this.synonym || this.name;
	}

	empty() {
		return !this.ref || this.ref == "_";
	}
}

class RegisterRow extends DataObj {

	constructor(attr, manager) {
		super(attr, manager);

		if (attr && typeof attr == "object") {
			let tref = attr.ref;
			if (tref) {
				delete attr.ref;
			}
			utils._mixin(this, attr);
			if (tref) {
				attr.ref = tref;
			}
		}

		for (var check in manager.metadata().dimensions) {
			if (!attr.hasOwnProperty(check) && attr.ref) {
				var keys = attr.ref.split("¶");
				Object.keys(manager.metadata().dimensions).forEach((fld, ind) => {
					this[fld] = keys[ind];
				});
				break;
			}
		}
	}

	_metadata(field_name) {
		const _meta = this._manager.metadata();
		if (!_meta.fields) {
			_meta.fields = Object.assign({}, _meta.dimensions, _meta.resources, _meta.attributes);
		}
		return field_name ? _meta.fields[field_name] : _meta;
	}

	get ref() {
		return this._manager.get_ref(this);
	}

	get presentation() {
		return this._metadata().obj_presentation || this._metadata().synonym;
	}
}

const classes = exports.classes = { DataObj, CatObj, DocObj, DataProcessorObj, TaskObj, BusinessProcessObj, EnumObj, RegisterRow };

class TabularSection {

	constructor(name, owner) {
		if (!owner._obj[name]) {
			owner._obj[name] = [];
		}

		Object.defineProperties(this, {
			_name: {
				get: () => name
			},

			_owner: {
				get: () => owner
			}

		});
	}

	toString() {
		return "Табличная часть " + this._owner._manager.class_name + "." + this._name;
	}

	get _obj() {
		const { _owner, _name } = this;
		return _owner._obj[_name];
	}

	get(index) {
		const row = this._obj[index];
		return row ? row._row : null;
	}

	count() {
		return this._obj.length;
	}

	clear(silent) {

		const { _obj, _owner } = this;

		_obj.length = 0;

		if (!silent && !_owner._data._silent) {}
		return this;
	}

	del(val, silent) {

		const { _obj, _owner } = this;

		let index;

		if (typeof val == "undefined") return;else if (typeof val == "number") index = val;else if (_obj[val.row - 1]._row === val) index = val.row - 1;else {
			for (var i in _obj) if (_obj[i]._row === val) {
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
		}
		if (index == undefined) return;

		_obj.splice(index, 1);

		_obj.forEach(function (row, index) {
			row.row = index + 1;
		});

		if (!silent && !_owner._data._silent) {}

		_owner._data._modified = true;
	}

	find(val, columns) {
		var res = utils._find(this._obj, val, columns);
		if (res) return res._row;
	}

	find_rows(selection, callback) {

		const cb = callback ? row => {
			return callback.call(this, row._row);
		} : null;

		return utils._find_rows.call(this, this._obj, selection, cb);
	}

	swap(rowid1, rowid2) {

		const { _obj } = this;
		[_obj[rowid1], _obj[rowid2]] = [_obj[rowid2], _obj[rowid1]];
		_obj[rowid1].row = rowid2 + 1;
		_obj[rowid2].row = rowid1 + 1;

		if (!this._owner._data._silent) {}
	}

	add(attr = {}, silent) {

		const { _owner, _name, _obj } = this;
		const row = _owner._manager.obj_constructor(_name, this);

		for (let f in row._metadata().fields) {
			row[f] = attr[f] || "";
		}

		row._obj.row = _obj.push(row._obj);
		Object.defineProperty(row._obj, "_row", {
			value: row,
			enumerable: false
		});

		if (!silent && !this._owner._data._silent) {}

		_owner._data._modified = true;

		return row;
	}

	each(fn) {
		this._obj.forEach(row => fn.call(this, row._row));
	}

	get forEach() {
		return this.each;
	}

	group_by(dimensions, resources) {

		try {
			const res = this.aggregate(dimensions, resources, "SUM", true);
			return this.clear(true).load(res);
		} catch (err) {
			utils.record_log(err);
		}
	}

	sort(fields) {

		if (typeof fields == "string") {
			fields = fields.split(",");
		}

		let sql = "select * from ? order by ",
		    res = true;
		has_dot;

		fields.forEach(function (f) {
			has_dot = has_dot || f.match('.');
			f = f.trim().replace(/\s{1,}/g, " ").split(" ");
			if (res) {
				res = false;
			} else {
				sql += ", ";
			}

			sql += "`" + f[0] + "`";
			if (f[1]) {
				sql += " " + f[1];
			}
		});

		try {
			res = alasql(sql, [has_dot ? this._obj.map(row => row._row) : this._obj]);
			return this.clear(true).load(res);
		} catch (err) {
			utils.record_log(err);
		}
	}

	aggregate(dimensions, resources, aggr = "sum", ret_array) {

		if (typeof dimensions == "string") {
			dimensions = dimensions.split(",");
		}
		if (typeof resources == "string") {
			resources = resources.split(",");
		}

		if (!dimensions.length && resources.length == 1 && aggr == "sum") {
			return this._obj.reduce(function (sum, row, index, array) {
				return sum + row[resources[0]];
			}, 0);
		}

		let sql,
		    res = true;

		resources.forEach(function (f) {
			if (!sql) sql = "select " + aggr + "(`" + f + "`) `" + f + "`";else sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
		});
		dimensions.forEach(function (f) {
			if (!sql) sql = "select `" + f + "`";else sql += ", `" + f + "`";
		});
		sql += " from ? ";
		dimensions.forEach(function (f) {
			if (res) {
				sql += "group by ";
				res = false;
			} else sql += ", ";
			sql += "`" + f + "`";
		});

		try {
			res = alasql(sql, [this._obj]);
			if (!ret_array) {
				if (resources.length == 1) res = res.length ? res[0][resources[0]] : 0;else res = res.length ? res[0] : {};
			}
			return res;
		} catch (err) {
			utils.record_log(err);
		}
	}
	load(aattr) {

		let arr;

		this.clear(true);

		if (aattr instanceof TabularSection) {
			arr = aattr._obj;
		} else if (Array.isArray(aattr)) {
			arr = aattr;
		}

		if (arr) {
			arr.forEach(row => {
				this.add(row, true);
			});
		}

		if (!this._owner._data._silent) {}

		return this;
	}

	unload_column(column) {

		const res = [];

		this.each(row => {
			res.push(row[column]);
		});

		return res;
	}

	toJSON() {
		return this._obj;
	}
}

class TabularSectionRow {

	constructor(owner) {

		Object.defineProperties(this, {
			_owner: {
				value: owner
			},

			_obj: {
				value: {}
			}
		});
	}

	_metadata(field_name) {
		const { _owner } = this;
		return field_name ? _owner._owner._metadata(_owner._name).fields[field_name] : _owner._owner._metadata(_owner._name);
	}

	get row() {
		return this._obj.row || 0;
	}

	_clone() {
		const { _owner, _obj } = this;
		return utils._mixin(_owner._owner._manager.obj_constructor(_owner._name, _owner), _obj);
	}

	get _getter() {
		return DataObj.prototype._getter;
	}

	_setter(f, v) {

		const { _owner, _obj } = this;
		const _meta = this._metadata(f);

		if (_obj[f] == v || !v && _obj[f] == utils.blank.guid) return;

		if (!_owner._owner._data._silent) {}

		if (_meta.choice_type) {
			let prop;
			if (_meta.choice_type.path.length == 2) prop = this[_meta.choice_type.path[1]];else prop = _owner._owner[_meta.choice_type.path[0]];
			if (prop && prop.type) v = utils.fetch_type(v, prop.type);
		}

		DataObj.prototype.__setter.call(this, f, v);
		_owner._owner._data._modified = true;
	}

}

classes.TabularSection = TabularSection;
classes.TabularSectionRow = TabularSectionRow;

class MetaObj {}

class MetaField {}

class Meta extends _metadataAbstractAdapter.MetaEventEmitter {

	constructor($p) {

		super();

		const _m = {};
		Meta._sys.forEach(patch => {
			utils._patch(_m, patch);
		});
		Meta._sys.length = 0;

		this.init = function (patch) {
			return utils._patch(_m, patch);
		};

		this.get = function (class_name, field_name) {

			const np = class_name.split(".");

			if (!_m || !_m[np[0]]) {
				return;
			}

			const _meta = _m[np[0]][np[1]];

			if (!field_name) {
				return _meta;
			} else if (_meta && _meta.fields[field_name]) {
				return _meta.fields[field_name];
			} else if (_meta && _meta.tabular_sections && _meta.tabular_sections[field_name]) {
				return _meta.tabular_sections[field_name];
			}

			const res = {
				multiline_mode: false,
				note: "",
				synonym: "",
				tooltip: "",
				type: {
					is_ref: false,
					types: ["string"]
				}
			},
			      is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			      is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

			if (is_doc && field_name == "number_doc") {
				res.synonym = "Номер";
				res.tooltip = "Номер документа";
				res.type.str_len = 11;
			} else if (is_doc && field_name == "date") {
				res.synonym = "Дата";
				res.tooltip = "Дата документа";
				res.type.date_part = "date_time";
				res.type.types[0] = "date";
			} else if (is_doc && field_name == "posted") {
				res.synonym = "Проведен";
				res.type.types[0] = "boolean";
			} else if (is_cat && field_name == "id") {
				res.synonym = "Код";
			} else if (is_cat && field_name == "name") {
				res.synonym = "Наименование";
			} else if (field_name == "_deleted") {
				res.synonym = "Пометка удаления";
				res.type.types[0] = "boolean";
			} else if (field_name == "is_folder") {
				res.synonym = "Это группа";
				res.type.types[0] = "boolean";
			} else if (field_name == "ref") {
				res.synonym = "Ссылка";
				res.type.is_ref = true;
				res.type.types[0] = class_name;
			} else {
				return;
			}

			return res;
		};

		this.classes = function () {
			var res = {};
			for (var i in _m) {
				res[i] = [];
				for (var j in _m[i]) res[i].push(j);
			}
			return res;
		};

		this.bases = function () {
			var res = {};
			for (var i in _m) {
				for (var j in _m[i]) {
					if (_m[i][j].cachable) {
						let _name = _m[i][j].cachable.replace('_remote', '');
						if (!res[_name]) res[_name] = _name;
					}
				}
			}
			return Object.keys(res);
		};

		this.create_tables = function (callback, attr) {

			var cstep = 0,
			    data_names = [],
			    managers = this.classes(),
			    class_name,
			    create = attr && attr.postgres ? "" : "USE md; ";

			function on_table_created() {

				cstep--;
				if (cstep == 0) {
					if (callback) callback(create);else $p.wsql.alasql.utils.saveFile("create_tables.sql", create);
				} else iteration();
			}

			function iteration() {
				var data = data_names[cstep - 1];
				create += data["class"][data.name].get_sql_struct(attr) + "; ";
				on_table_created();
			}

			"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
				for (class_name in managers[mgr]) data_names.push({ "class": $p[mgr], "name": managers[mgr][class_name] });
			});
			cstep = data_names.length;

			iteration();
		};

		this.syns_js = function (v) {
			var synJS = {
				DeletionMark: '_deleted',
				Description: 'name',
				DataVersion: 'data_version',
				IsFolder: 'is_folder',
				Number: 'number_doc',
				Date: 'date',
				Дата: 'date',
				Posted: 'posted',
				Code: 'id',
				Parent_Key: 'parent',
				Owner_Key: 'owner',
				Owner: 'owner',
				Ref_Key: 'ref',
				Ссылка: 'ref',
				LineNumber: 'row'
			};
			if (synJS[v]) return synJS[v];
			return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
		};

		this.syns_1с = function (v) {
			var syn1c = {
				_deleted: 'DeletionMark',
				name: 'Description',
				is_folder: 'IsFolder',
				number_doc: 'Number',
				date: 'Date',
				posted: 'Posted',
				id: 'Code',
				ref: 'Ref_Key',
				parent: 'Parent_Key',
				owner: 'Owner_Key',
				row: 'LineNumber'
			};
			if (syn1c[v]) return syn1c[v];
			return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
		};

		this.printing_plates = function (pp) {
			if (pp) for (var i in pp.doc) _m.doc[i].printing_plates = pp.doc[i];
		};

		this.mgr_by_class_name = function (class_name) {
			if (class_name) {

				let np = class_name.split(".");
				if (np[1] && $p[np[0]]) return $p[np[0]][np[1]];

				const pos = class_name.indexOf("_");
				if (pos) {
					np = [class_name.substr(0, pos), class_name.substr(pos + 1)];
					if (np[1] && $p[np[0]]) return $p[np[0]][np[1]];
				}
			}
		};
	}

	sql_type(mgr, f, mf, pg) {
		var sql;
		if (f == "type" && mgr.table_name == "cch_properties" || f == "svg" && mgr.table_name == "cat_production_params") sql = " JSON";else if (mf.is_ref || mf.types.indexOf("guid") != -1) {
			if (!pg) sql = " CHAR";else if (mf.types.every(function (v) {
				return v.indexOf("enm.") == 0;
			})) sql = " character varying(100)";else if (!mf.hasOwnProperty("str_len")) sql = " uuid";else sql = " character varying(" + Math.max(36, mf.str_len) + ")";
		} else if (mf.hasOwnProperty("str_len")) sql = pg ? mf.str_len ? " character varying(" + mf.str_len + ")" : " text" : " CHAR";else if (mf.date_part) {
			if (!pg || mf.date_part == "date") sql = " Date";else if (mf.date_part == "date_time") sql = " timestamp with time zone";else sql = " time without time zone";
		} else if (mf.hasOwnProperty("digits")) {
			if (mf.fraction_figits == 0) sql = pg ? mf.digits < 7 ? " integer" : " bigint" : " INT";else sql = pg ? " numeric(" + mf.digits + "," + mf.fraction_figits + ")" : " FLOAT";
		} else if (mf.types.indexOf("boolean") != -1) sql = " BOOLEAN";else if (mf.types.indexOf("json") != -1) sql = " JSON";else sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	}

	sql_mask(f, t) {
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	}

	ts_captions(class_name, ts_name, source) {
		if (!source) source = {};

		var mts = this.get(class_name).tabular_sections[ts_name],
		    mfrm = this.get(class_name).form,
		    fields = mts.fields,
		    mf;

		if (mfrm && mfrm.obj) {

			if (!mfrm.obj.tabular_sections[ts_name]) return;

			utils._mixin(source, mfrm.obj.tabular_sections[ts_name]);
		} else {

			if (ts_name === "contact_information") fields = { type: "", kind: "", presentation: "" };

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for (var f in fields) {
				mf = mts.fields[f];
				if (!mf.hide) {
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + this.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;
	}

	class_name_from_1c(name) {

		var pn = name.split(".");
		if (pn.length == 1) return "enm." + name;else if (pn[0] == "Перечисление") name = "enm.";else if (pn[0] == "Справочник") name = "cat.";else if (pn[0] == "Документ") name = "doc.";else if (pn[0] == "РегистрСведений") name = "ireg.";else if (pn[0] == "РегистрНакопления") name = "areg.";else if (pn[0] == "РегистрБухгалтерии") name = "accreg.";else if (pn[0] == "ПланВидовХарактеристик") name = "cch.";else if (pn[0] == "ПланСчетов") name = "cacc.";else if (pn[0] == "Обработка") name = "dp.";else if (pn[0] == "Отчет") name = "rep.";

		return name + this.syns_js(pn[1]);
	}

	class_name_to_1c(name) {

		var pn = name.split(".");
		if (pn.length == 1) return "Перечисление." + name;else if (pn[0] == "enm") name = "Перечисление.";else if (pn[0] == "cat") name = "Справочник.";else if (pn[0] == "doc") name = "Документ.";else if (pn[0] == "ireg") name = "РегистрСведений.";else if (pn[0] == "areg") name = "РегистрНакопления.";else if (pn[0] == "accreg") name = "РегистрБухгалтерии.";else if (pn[0] == "cch") name = "ПланВидовХарактеристик.";else if (pn[0] == "cacc") name = "ПланСчетов.";else if (pn[0] == "dp") name = "Обработка.";else if (pn[0] == "rep") name = "Отчет.";

		return name + this.syns_1с(pn[1]);
	}

}

Meta._sys = [{
	enm: {
		accumulation_record_type: [{
			order: 0,
			name: "debit",
			synonym: "Приход"
		}, {
			order: 1,
			name: "credit",
			synonym: "Расход"
		}]
	},
	ireg: {
		log: {
			name: "log",
			note: "",
			synonym: "Журнал событий",
			dimensions: {
				date: {
					synonym: "Дата",
					tooltip: "Время события",
					type: {
						types: ["number"],
						digits: 15,
						fraction_figits: 0
					}
				},
				sequence: {
					synonym: "Порядок",
					tooltip: "Порядок следования",
					type: {
						types: ["number"],
						digits: 6,
						fraction_figits: 0
					}
				}
			},
			resources: {
				"class": {
					synonym: "Класс",
					tooltip: "Класс события",
					type: {
						types: ["string"],
						str_len: 100
					}
				},
				note: {
					synonym: "Комментарий",
					multiline_mode: true,
					tooltip: "Текст события",
					type: {
						types: ["string"],
						str_len: 0
					}
				},
				obj: {
					synonym: "Объект",
					multiline_mode: true,
					tooltip: "Объект, к которому относится событие",
					type: {
						types: ["string"],
						str_len: 0
					}
				}
			}
		}
	}
}];
Meta.Obj = MetaObj;
Meta.Field = MetaField;
classes.Meta = Meta;

function Aes(default_key) {

	'use strict';

	var Aes = this;

	Aes.cipher = function (input, w) {
		var Nb = 4;
		var Nr = w.length / Nb - 1;

		var state = [[], [], [], []];
		for (var i = 0; i < 4 * Nb; i++) state[i % 4][Math.floor(i / 4)] = input[i];

		state = Aes.addRoundKey(state, w, 0, Nb);

		for (var round = 1; round < Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}

		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);

		var output = new Array(4 * Nb);
		for (var i = 0; i < 4 * Nb; i++) output[i] = state[i % 4][Math.floor(i / 4)];

		return output;
	};

	Aes.keyExpansion = function (key) {
		var Nb = 4;
		var Nk = key.length / 4;
		var Nr = Nk + 6;

		var w = new Array(Nb * (Nr + 1));
		var temp = new Array(4);

		for (var i = 0; i < Nk; i++) {
			var r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
			w[i] = r;
		}

		for (var i = Nk; i < Nb * (Nr + 1); i++) {
			w[i] = new Array(4);
			for (var t = 0; t < 4; t++) temp[t] = w[i - 1][t];

			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t = 0; t < 4; t++) temp[t] ^= Aes.rCon[i / Nk][t];
			} else if (Nk > 6 && i % Nk == 4) {
					temp = Aes.subWord(temp);
				}

			for (var t = 0; t < 4; t++) w[i][t] = w[i - Nk][t] ^ temp[t];
		}

		return w;
	};

	Aes.subBytes = function (s, Nb) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};

	Aes.shiftRows = function (s, Nb) {
		var t = new Array(4);
		for (var r = 1; r < 4; r++) {
			for (var c = 0; c < 4; c++) t[c] = s[r][(c + r) % Nb];
			for (var c = 0; c < 4; c++) s[r][c] = t[c];
		}
		return s;
	};

	Aes.mixColumns = function (s, Nb) {
		for (var c = 0; c < 4; c++) {
			var a = new Array(4);
			var b = new Array(4);
			for (var i = 0; i < 4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;
			}

			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
		}
		return s;
	};

	Aes.addRoundKey = function (state, w, rnd, Nb) {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < Nb; c++) state[r][c] ^= w[rnd * 4 + c][r];
		}
		return state;
	};

	Aes.subWord = function (w) {
		for (var i = 0; i < 4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};

	Aes.rotWord = function (w) {
		var tmp = w[0];
		for (var i = 0; i < 3; i++) w[i] = w[i + 1];
		w[3] = tmp;
		return w;
	};

	Aes.sBox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

	Aes.rCon = [[0x00, 0x00, 0x00, 0x00], [0x01, 0x00, 0x00, 0x00], [0x02, 0x00, 0x00, 0x00], [0x04, 0x00, 0x00, 0x00], [0x08, 0x00, 0x00, 0x00], [0x10, 0x00, 0x00, 0x00], [0x20, 0x00, 0x00, 0x00], [0x40, 0x00, 0x00, 0x00], [0x80, 0x00, 0x00, 0x00], [0x1b, 0x00, 0x00, 0x00], [0x36, 0x00, 0x00, 0x00]];

	Aes.Ctr = {};

	Aes.Ctr.encrypt = function (plaintext, password, nBits) {
		var blockSize = 16;
		if (!(nBits == 128 || nBits == 192 || nBits == 256)) nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);

		var nBytes = nBits / 8;
		var pwBytes = new Array(nBytes);
		for (var i = 0; i < nBytes; i++) {
			pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes - 16));
		var counterBlock = new Array(blockSize);

		var nonce = new Date().getTime();
		var nonceMs = nonce % 1000;
		var nonceSec = Math.floor(nonce / 1000);
		var nonceRnd = Math.floor(Math.random() * 0xffff);


		for (var i = 0; i < 2; i++) counterBlock[i] = nonceMs >>> i * 8 & 0xff;
		for (var i = 0; i < 2; i++) counterBlock[i + 2] = nonceRnd >>> i * 8 & 0xff;
		for (var i = 0; i < 4; i++) counterBlock[i + 4] = nonceSec >>> i * 8 & 0xff;

		var ctrTxt = '';
		for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

		var keySchedule = Aes.keyExpansion(key);

		var blockCount = Math.ceil(plaintext.length / blockSize);
		var ciphertext = '';

		for (var b = 0; b < blockCount; b++) {
			for (var c = 0; c < 4; c++) counterBlock[15 - c] = b >>> c * 8 & 0xff;
			for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = b / 0x100000000 >>> c * 8;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);
			var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
			var cipherChar = new Array(blockLength);

			for (var i = 0; i < blockLength; i++) {
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');

			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b % 1000 == 0) self.postMessage({ progress: b / blockCount });
			}
		}

		ciphertext = base64Encode(ctrTxt + ciphertext);

		return ciphertext;
	};

	Aes.Ctr.decrypt = function (ciphertext, password, nBits) {
		var blockSize = 16;
		if (!(nBits == 128 || nBits == 192 || nBits == 256)) nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);

		var nBytes = nBits / 8;
		var pwBytes = new Array(nBytes);
		for (var i = 0; i < nBytes; i++) {
			pwBytes[i] = i < password.length ? password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes - 16));
		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

		var keySchedule = Aes.keyExpansion(key);

		var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
		ciphertext = ct;
		var plaintext = '';

		for (var b = 0; b < nBlocks; b++) {
			for (var c = 0; c < 4; c++) counterBlock[15 - c] = b >>> c * 8 & 0xff;
			for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b + 1) / 0x100000000 - 1 >>> c * 8 & 0xff;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);

			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i = 0; i < ciphertext[b].length; i++) {
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');

			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b % 1000 == 0) self.postMessage({ progress: b / nBlocks });
			}
		}

		plaintext = utf8Decode(plaintext);

		return plaintext;
	};

	function utf8Encode(str) {

		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}

	function utf8Decode(str) {
		try {
			return decodeURIComponent(escape(str));
		} catch (e) {
			return str;
		}
	}

	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str);
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64');
		throw new Error('No Base64 Encode');
	}

	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str);
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary');
		throw new Error('No Base64 Decode');
	}
}

class MetaEngine {

	constructor() {
		this.adapters = {};

		Object.defineProperties(this, {
			job_prm: { value: new JobPrm() },

			wsql: { value: new WSQL(this) },

			aes: { value: new Aes("metadata.js") },

			md: { value: new Meta(this) }

		});

		mngrs(this);

		utils.record_log = this.record_log;

		MetaEngine._plugins.forEach(plugin => plugin.call(this));
		MetaEngine._plugins.length = 0;
	}

	get version() {
		return "2.0.0-beta.14";
	}

	toString() {
		return "Oknosoft data engine. v:" + this.version;
	}

	record_log(err) {
		const { ireg } = this;
		if (ireg && ireg.log) {
			ireg.log.record(err);
		}
		console.log(err);
	}

	get utils() {
		return utils;
	}

	get msg() {
		return msg;
	}

	get classes() {
		return classes;
	}

	get current_user() {

		let user_name, user;

		if (this.superlogin) {
			const session = this.superlogin.getSession();
			user_name = session ? session.user_id : "";
		}

		if (!user_name) {
			user_name = this.wsql.get_user_param("user_name");
		}

		if (this.cat && this.cat.users) {
			user = this.cat.users.by_id(user_name);
			if (!user || user.empty()) {
				this.cat.users.find_rows_remote({
					_top: 1,
					id: user_name
				});
			}
		}

		return user && !user.empty() ? user : null;
	}

	static plugin(obj) {

		if (typeof obj.proto == "function") {
			obj.proto(MetaEngine, classes);
		} else if (typeof obj.proto == 'object') {
			Object.keys(obj.proto).forEach(function (id) {
				MetaEngine.prototype[id] = obj.proto[id];
			});
		}

		if (obj.constructor) {
			if (typeof obj.constructor != "function") {
				throw new Error('Invalid plugin: constructor must be a function');
			}
			MetaEngine._plugins.push(obj.constructor);
		}

		return MetaEngine;
	}
}
exports.default = MetaEngine;
MetaEngine._plugins = [];