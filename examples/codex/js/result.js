// This file was automatically generated from "codres.lmd.json"
(function(global,main,modules,modules_options,options){var initialized_modules={},global_eval=function(code){return global.Function("return "+code)()},global_document=global.document,local_undefined,register_module=function(moduleName,module){var output={exports:{}};initialized_modules[moduleName]=1;modules[moduleName]=output.exports;if(!module){module=module||global[moduleName]}else if(typeof module==="function"){var module_require=lmd_require;if(modules_options[moduleName]&&modules_options[moduleName].sandbox&&typeof module_require==="function"){module_require=local_undefined}module=module(module_require,output.exports,output)||output.exports}module=module;return modules[moduleName]=module},lmd_require=function(moduleName){var module=modules[moduleName];var replacement=[moduleName,module];if(replacement){moduleName=replacement[0];module=replacement[1]}if(initialized_modules[moduleName]&&module){return module}if(typeof module==="string"&&module.indexOf("(function(")===0){module=global_eval(module)}return register_module(moduleName,module)},output={exports:{}};for(var moduleName in modules){initialized_modules[moduleName]=0}main(lmd_require,output.exports,output)})
(this,(function (require, exports, module) { /* wrapped by builder */
/**
 * Created 08.08.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  codres
 */

$p.eve.redirect = true;

$p.require = function(name){
	return require(name);
};

$p.settings = function (prm, modifiers) {
	prm.create_tables = true;
	prm.create_tables_sql = require('create_tables');
	prm.allow_post_message = "*";   // разрешаем обрабатывать сообщения от других окон (обязательно для файлового режима)
	prm.russian_names = true;       // создаём русскоязычные синонимы
	prm.use_google_geo = true;      // используем геолокатор
};

$p.iface.oninit = function() {

	$p.job_prm.offline = true;

	// создаём основное окно
	$p.iface.layout_1c();
	$p.iface.docs.hideHeader();

	// говорим, что мы уже авторизованы на "сервере"
	$p.ajax.authorized = true;
	$p.ajax.root = true;

	// инициализируем метаданные
	new $p.Meta(require('meta'));

	// загружаем данные
	$p.eve.from_json_to_data_obj(require('data'));

};

}),{
"meta": ﻿(function (require) {
	return {
		"enm": {
			"ТипыНоменклатуры": [
				{
					"order": 0,
					"name": "Запас",
					"synonym": "Запас"
				},
				{
					"order": 1,
					"name": "Услуга",
					"synonym": "Услуга"
				},
				{
					"order": 2,
					"name": "Работа",
					"synonym": "Работа"
				},
				{
					"order": 3,
					"name": "Операция",
					"synonym": "Операция"
				},
				{
					"order": 4,
					"name": "ВидРабот",
					"synonym": "Вид работ"
				}
			]
		},
		"cat": {
			"Контрагенты": {
				"name": "Контрагенты",
				"synonym": "Контрагенты",
				"illustration": "Контрагенты организаций - поставщики и покупатели, прочие организации и частные лица",
				"obj_presentation": "Контрагент",
				"list_presentation": "",
				"input_by_string": [
					"name",
					"ИНН",
					"id"
				],
				"hierarchical": true,
				"has_owners": false,
				"group_hierarchy": true,
				"main_presentation_name": true,
				"code_length": 9,
				"fields": {
					"ИНН": {
						"synonym": "ИНН",
						"multiline_mode": false,
						"tooltip": "Идентификационный номер контрагента, для отражения в печатных формах документов.",
						"type": {
							"types": [
								"string"
							],
							"str_len": 12
						}
					}
					,
					"Комментарий": {
						"synonym": "Дополнительная информация",
						"multiline_mode": true,
						"tooltip": "Любая дополнительная информация",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					}
					,
					"parent": {
						"synonym": "Группа",
						"multiline_mode": false,
						"tooltip": "Группа, в которую входит данный контрагент.",
						"type": {
							"types": [
								"cat.Контрагенты"
							],
							"is_ref": true
						}
					}
				}
				,
				"tabular_sections": {}
			},
			"Номенклатура": {
				"name": "Номенклатура",
				"synonym": "Номенклатура",
				"illustration": "Номенклатура товаров, материалов, продукции, полуфабрикатов, объектов вложений в имущество, работ, услуг, технологических операций, видов работ, услуг сторонних контрагентов",
				"obj_presentation": "Номенклатура",
				"list_presentation": "",
				"input_by_string": [
					"name",
					"Артикул",
					"id"
				],
				"hierarchical": true,
				"has_owners": false,
				"group_hierarchy": true,
				"main_presentation_name": true,
				"code_length": 11,
				"fields": {
					"Артикул": {
						"synonym": "Артикул",
						"multiline_mode": false,
						"tooltip": "Цифровой код товара. Текстовое значение, используется в печатных формах документов.",
						"type": {
							"types": [
								"string"
							],
							"str_len": 25
						}
					},
					"ТипНоменклатуры": {
						"synonym": "Тип",
						"multiline_mode": false,
						"tooltip": "Тип позиции номенклатуры, определяющий ее сущность и поведение: запас - складируемые запасы, работа - подрядные работы, услуга - сервисные услуги, услуги сторонних организаций.",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"enm.ТипыНоменклатуры"
							],
							"is_ref": true
						}
					},
					"Комментарий": {
						"synonym": "Описание",
						"multiline_mode": false,
						"tooltip": "Любая дополнительная информация",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					},
					"СрокИсполненияЗаказа": {
						"synonym": "Срок исполнения (дн.)",
						"multiline_mode": false,
						"tooltip": "Стандартный срок исполнения заказа покупателя, в днях.",
						"type": {
							"types": [
								"number"
							],
							"digits": 10,
							"fraction_figits": 0
						}
					}
					,
					"parent": {
						"synonym": "Группа",
						"multiline_mode": false,
						"tooltip": "Группа, в которую входит данная позиция номенклатуры.",
						"type": {
							"types": [
								"cat.Номенклатура"
							],
							"is_ref": true
						}
					}
				}
				,
				"tabular_sections": {}
			},
			"delivery_areas": {
				"name": "РайоныДоставки",
				"synonym": "Районы доставки",
				"illustration": "",
				"obj_presentation": "Район доставки",
				"list_presentation": "Районы доставки",
				"input_by_string": [
					"name",
					"id"
				],
				"hierarchical": false,
				"has_owners": false,
				"group_hierarchy": true,
				"main_presentation_name": true,
				"code_length": 9,
				"fields": {
					"region": {
						"synonym": "Регион",
						"multiline_mode": false,
						"tooltip": "Регион, край, область",
						"type": {
							"types": [
								"string"
							],
							"str_len": 50
						}
					},
					"city": {
						"synonym": "Город (населенный пункт)",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"string"
							],
							"str_len": 50
						}
					},
					"latitude": {
						"synonym": "Гео. коорд. Широта",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"number"
							],
							"digits": 15,
							"fraction_figits": 12
						}
					},
					"longitude": {
						"synonym": "Гео. коорд. Долгота",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"number"
							],
							"digits": 15,
							"fraction_figits": 12
						}
					},
					"ind": {
						"synonym": "Индекс",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"string"
							],
							"str_len": 6
						}
					},
					"delivery_area": {
						"synonym": "Район (внутри города)",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"string"
							],
							"str_len": 50
						}
					},
					"specify_area_by_geocoder": {
						"synonym": "Уточнять район геокодером",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"boolean"
							]
						}
					}
				},
				"tabular_sections": {}
			}
		},
		"doc": {
			"ЗаказПокупателя": {
				"name": "ЗаказПокупателя",
				"synonym": "Заказ покупателя",
				"illustration": "Заказы покупателей на приобретение товаров, продукции, работ, услуг",
				"obj_presentation": "",
				"list_presentation": "Заказы покупателей",
				"input_by_string": [
					"number_doc"
				],
				"hierarchical": false,
				"has_owners": false,
				"group_hierarchy": false,
				"main_presentation_name": false,
				"code_length": 0,
				"fields": {
					"ДатаИзменения": {
						"synonym": "Дата изменения",
						"multiline_mode": false,
						"tooltip": "",
						"type": {
							"types": [
								"date"
							],
							"date_part": "date_time"
						}
					},
					"ДатаОтгрузки": {
						"synonym": "Дата отгрузки",
						"multiline_mode": false,
						"tooltip": "Желаемая дата отгрузки по заказу",
						"type": {
							"types": [
								"date"
							],
							"date_part": "date"
						}
					},
					"Комментарий": {
						"synonym": "Комментарий",
						"multiline_mode": false,
						"tooltip": "Произвольный комментарий",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					},
					"Контрагент": {
						"synonym": "Контрагент",
						"multiline_mode": false,
						"tooltip": "Покупатель, заказчик",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"cat.Контрагенты"
							],
							"is_ref": true
						}
					},
					"delivery_area": {
						"synonym": "Район",
						"multiline_mode": false,
						"tooltip": "Район (зона, направление) доставки для группировки при планировании и оптимизации маршрута геокодером",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"cat.delivery_areas"
							],
							"is_ref": true
						}
					},
					"shipping_address": {
						"synonym": "Адрес доставки",
						"multiline_mode": false,
						"tooltip": "Адрес доставки изделий заказа",
						"type": {
							"types": [
								"string"
							],
							"str_len": 255
						}
					},
					"coordinates": {
						"synonym": "Координаты",
						"multiline_mode": false,
						"tooltip": "Гео - координаты адреса доставки",
						"type": {
							"types": [
								"string"
							],
							"str_len": 50
						}
					},
					"address_fields": {
						"synonym": "Значения полей адреса",
						"multiline_mode": false,
						"tooltip": "Служебный реквизит",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					},
					"СуммаДокумента": {
						"synonym": "Сумма",
						"multiline_mode": false,
						"tooltip": "Заполняется сумма документа",
						"type": {
							"types": [
								"number"
							],
							"digits": 15,
							"fraction_figits": 2
						}
					},
					"СписокНоменклатуры": {
						"synonym": "Список номенклатуры",
						"multiline_mode": false,
						"tooltip": "Список номенклатуры. Используется для отображения в списке документов.",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					}
				},
				"tabular_sections": {
					"Запасы": {
						"name": "Запасы",
						"synonym": "Товары, работы, услуги",
						"tooltip": "Товары, работы, услуги, продукция",
						"fields": {
							"Номенклатура": {
								"synonym": "Номенклатура",
								"multiline_mode": false,
								"tooltip": "Заказываемая номенклатура",
								"choice_params": [
									{
										"name": "ТипНоменклатуры",
										"path": [
											{
												"name": "Запас",
												"presentation": "Запас",
												"type": "enm.ТипыНоменклатуры"
											},
											{
												"name": "Услуга",
												"presentation": "Услуга",
												"type": "enm.ТипыНоменклатуры"
											},
											{
												"name": "Работа",
												"presentation": "Работа",
												"type": "enm.ТипыНоменклатуры"
											}
										]
									},
									{
										"name": "ОграничениеТипа",
										"path": [
											{
												"name": "Запас",
												"presentation": "Запас",
												"type": "enm.ТипыНоменклатуры"
											},
											{
												"name": "Услуга",
												"presentation": "Услуга",
												"type": "enm.ТипыНоменклатуры"
											},
											{
												"name": "Работа",
												"presentation": "Работа",
												"type": "enm.ТипыНоменклатуры"
											}
										]
									}
								],
								"choice_groups_elm": "elm",
								"type": {
									"types": [
										"cat.Номенклатура"
									],
									"is_ref": true
								}
							}
							,
							"Количество": {
								"synonym": "Количество",
								"multiline_mode": false,
								"tooltip": "Заказываемое количество",
								"type": {
									"types": [
										"number"
									],
									"digits": 15,
									"fraction_figits": 3
								}
							}
							,
							"Цена": {
								"synonym": "Цена",
								"multiline_mode": false,
								"tooltip": "Цена номенклатуры",
								"type": {
									"types": [
										"number"
									],
									"digits": 15,
									"fraction_figits": 2
								}
							}
							,
							"ПроцентСкидкиНаценки": {
								"synonym": "% Скидки",
								"multiline_mode": false,
								"tooltip": "Процент скидки, наценки по строке документа",
								"type": {
									"types": [
										"number"
									],
									"digits": 5,
									"fraction_figits": 2
								}
							}
							,
							"Сумма": {
								"synonym": "Сумма",
								"multiline_mode": false,
								"tooltip": "Сумма по строке документа",
								"type": {
									"types": [
										"number"
									],
									"digits": 15,
									"fraction_figits": 2
								}
							}
						}
					}
				},
				"cachable": true,
				"form": {
					"selection": {
						"fields": [
							"date",
							"number_doc",
							"`cat_Контрагенты`.name as `Контрагент`",
							"СуммаДокумента",
							"posted",
							"СписокНоменклатуры",
							"Комментарий"
						],
						"cols": [
							{"id": "date", "width": "130", "type": "ro", "align": "left", "sort": "server", "caption": "Дата"},
							{"id": "number_doc", "width": "130", "type": "ro", "align": "left", "sort": "server", "caption": "Номер"},
							{"id": "Контрагент", "width": "170", "type": "ro", "align": "left", "sort": "server", "caption": "Контрагент"},
							{"id": "СуммаДокумента", "width": "120", "type": "ron", "align": "right", "sort": "server", "caption": "Сумма"},
							{"id": "СписокНоменклатуры", "width": "170", "type": "ro", "align": "left", "sort": "server", "caption": "Номенклатура"},
							{"id": "Комментарий", "width": "*", "type": "ro", "align": "left", "sort": "server", "caption": "Комментарий"}
						]
					},
					"obj": {
						"head": {
							" ": ["number_doc", "date", "Контрагент"],
							"Планирование": [
								"ДатаОтгрузки",
								{id: "shipping_address", path: "o.shipping_address", synonym: "Адрес доставки", type: "addr"}
							],
							"Дополнительно": [
								{"id": "СписокНоменклатуры", "path": "o.СписокНоменклатуры", "synonym": "Список номенклатуры", "type": "ro"},
								{"id": "СуммаДокумента", "path": "o.СуммаДокумента", "synonym": "Сумма документа", "type": "ro"}
							]
						},
						"tabular_sections": {
							"Запасы":  {
								"fields": ["row","Номенклатура","Количество","Цена","ПроцентСкидкиНаценки","Сумма"],
								"headers": "№,Номенклатура,Колич.,Цена,% Скидки,Сумма",
								"widths": "40,*,90,90,90,90",
								"min_widths": "40,200,75,75,75,75",
								"aligns": "",
								"sortings": "na,na,na,na,na,na",
								"types": "cntr,ref,calck,calck,calck,ron"
							}
						}
					}
				}
			}
		},
		"ireg": {},
		"areg": {},
		"dp": {},
		"rep": {},
		"cch": {},
		"cacc": {},
		"syns_1с": [
			"Булево",
			"ВводПоСтроке",
			"Владелец",
			"ВыборГруппИЭлементов",
			"Дата",
			"ДлинаКода",
			"ДополнительныеРеквизиты",
			"ДополнительныеРеквизитыИСведения",
			"ДополнительныеСведения",
			"Значение",
			"Значения",
			"ЗначенияПолей",
			"ЗначенияПолейАдреса",
			"ЗначенияСвойствОбъектов",
			"ЗначенияСвойствОбъектовИерархия",
			"Идентификатор",
			"Иерархический",
			"ИерархияГруппИЭлементов",
			"ИмяПредопределенныхДанных",
			"ИнтеграцияКешСсылок",
			"ИнтеграцияСостоянияТранспорта",
			"Календари",
			"КалендариGoogle",
			"Календарь",
			"Код",
			"Наименование",
			"Номер",
			"НомерСтроки",
			"ОсновноеПредставлениеИмя",
			"Параметр",
			"Параметры",
			"ПараметрыВыбора",
			"ПараметрыОтбора",
			"Подчиненый",
			"ПометкаУдаления",
			"Порядок",
			"Пояснение",
			"Предопределенный",
			"Представление",
			"ПредставлениеИдентификатора",
			"ПредставлениеОбъекта",
			"ПредставлениеСписка",
			"Префикс",
			"Принудительно",
			"Приоритет",
			"Проведен",
			"Реквизит",
			"Реквизиты",
			"Родитель",
			"Свойство",
			"СвязиПараметровВыбора",
			"СвязьПоТипу",
			"Синоним",
			"Скрыть",
			"Служебный",
			"Соответствие",
			"СостояниеТранспорта",
			"Ссылка",
			"Строка",
			"ТабличнаяЧасть",
			"ТабличныеЧасти",
			"Тип",
			"ТипСчета",
			"Число",
			"ЭтоГруппа"
		],
		"syns_js": [
			"boolean",
			"input_by_string",
			"owner",
			"choice_groups_elm",
			"date",
			"code_length",
			"extra_fields",
			"properties",
			"extra_properties",
			"value",
			"values",
			"values_fields",
			"address_fields",
			"property_values",
			"property_values_hierarchy",
			"identifier",
			"hierarchical",
			"group_hierarchy",
			"predefined_name",
			"integration_links_cache",
			"obj_delivery_states",
			"calendars",
			"calendars_google",
			"calendar",
			"id",
			"name",
			"number_doc",
			"row",
			"main_presentation_name",
			"param",
			"params",
			"choice_params",
			"selection_params",
			"has_owners",
			"deleted",
			"sequence",
			"illustration",
			"predefined",
			"presentation",
			"identifier_presentation",
			"obj_presentation",
			"list_presentation",
			"prefix",
			"forcibly",
			"priority",
			"posted",
			"field",
			"fields",
			"parent",
			"property",
			"choice_links",
			"choice_type",
			"synonym",
			"hide",
			"ancillary",
			"conformity",
			"obj_delivery_state",
			"ref",
			"string",
			"tabular_section",
			"tabular_sections",
			"type",
			"account_type",
			"number",
			"is_folder"
		]
	};
}),
"data": (function (require) {
	return {
		"enm": {},
		"cat": {
			"Контрагенты": [
				{
					"predefined_name": "",
					"ref": {
						"ref": "fae8993d-34a8-11de-b590-00055d80a2b9",
						"presentation": "Алхимов А.А.",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "fae8993c-34a8-11de-b590-00055d80a2b9",
						"presentation": "Покупатели и заказчики",
						"type": "cat.Контрагенты"
					},
					"name": "Алхимов А.А.",
					"id": "000000002",
					"ИНН": "0461111101",
					"Комментарий": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "bcc42423-3986-11de-b595-00055d80a2b9",
						"presentation": "Арендодатель",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "77f23aab-3576-11de-b591-00055d80a2b9",
						"presentation": "Поставщики и подрядчики",
						"type": "cat.Контрагенты"
					},
					"name": "Арендодатель",
					"id": "000000011",
					"ИНН": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23aad-3576-11de-b591-00055d80a2b9",
						"presentation": "Баев и Ко",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "fae8993c-34a8-11de-b590-00055d80a2b9",
						"presentation": "Покупатели и заказчики",
						"type": "cat.Контрагенты"
					},
					"name": "Баев и Ко",
					"id": "000000004",
					"ИНН": "0461111103"
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23ab9-3576-11de-b591-00055d80a2b9",
						"presentation": "База комплектующих",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "77f23aab-3576-11de-b591-00055d80a2b9",
						"presentation": "Поставщики и подрядчики",
						"type": "cat.Контрагенты"
					},
					"name": "База комплектующих",
					"id": "000000009",
					"ИНН": "0122909098"
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23ab0-3576-11de-b591-00055d80a2b9",
						"presentation": "Белявский",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "fae8993c-34a8-11de-b590-00055d80a2b9",
						"presentation": "Покупатели и заказчики",
						"type": "cat.Контрагенты"
					},
					"name": "Белявский",
					"id": "000000005",
					"ИНН": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23ab2-3576-11de-b591-00055d80a2b9",
						"presentation": "Иваночкин",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "fae8993c-34a8-11de-b590-00055d80a2b9",
						"presentation": "Покупатели и заказчики",
						"type": "cat.Контрагенты"
					},
					"name": "Иваночкин",
					"id": "000000006",
					"ИНН": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23ab6-3576-11de-b591-00055d80a2b9",
						"presentation": "Лайт",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "77f23aab-3576-11de-b591-00055d80a2b9",
						"presentation": "Поставщики и подрядчики",
						"type": "cat.Контрагенты"
					},
					"name": "Лайт",
					"id": "000000008",
					"ИНН": "7721049193"
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23abc-3576-11de-b591-00055d80a2b9",
						"presentation": "Мир кондиционеров",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "77f23aab-3576-11de-b591-00055d80a2b9",
						"presentation": "Поставщики и подрядчики",
						"type": "cat.Контрагенты"
					},
					"name": "Мир кондиционеров",
					"id": "000000010",
					"ИНН": "0777909089"
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "28e56109-3af2-11de-b597-00055d80a2b9",
						"presentation": "Налоговая инспекция",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Контрагенты"
					},
					"name": "Налоговая инспекция",
					"id": "000000012",
					"ИНН": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "fae8993c-34a8-11de-b590-00055d80a2b9",
						"presentation": "Покупатели и заказчики",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Контрагенты"
					},
					"name": "Покупатели и заказчики",
					"id": "000000001",
					"ИНН": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23aab-3576-11de-b591-00055d80a2b9",
						"presentation": "Поставщики и подрядчики",
						"type": "cat.Контрагенты"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Контрагенты"
					},
					"name": "Поставщики и подрядчики",
					"id": "000000003",
					"ИНН": ""
				}
			],
			"Номенклатура": [
				{
					"predefined_name": "",
					"ref": {
						"ref": "357c3c87-33e5-11de-b58f-00055d80a2b9",
						"presentation": "Автомобиль \"Mercedes\"",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ad-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Имущество",
						"type": "cat.Номенклатура"
					},
					"name": "Автомобиль \"Mercedes\"",
					"id": "00000000010",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "bcc42427-3986-11de-b595-00055d80a2b9",
						"presentation": "Аренда оборудования",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"name": "Аренда оборудования",
					"id": "00000000048",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "68d86826-277c-11df-b679-00055d80a2b9",
						"presentation": "Бумага",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Бумага",
					"id": "00000000054",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1,
					"extra_fields": []
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Виды работ",
					"id": "00000000007",
					"Артикул": "",
					"ТипНоменклатуры": "",
					"СрокИсполненияЗаказа": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87ad-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Имущество",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Имущество",
					"id": "00000000001",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "feca59b5-3aee-11de-b597-00055d80a2b9",
						"presentation": "Инвентаризация",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"name": "Инвентаризация",
					"id": "00000000049",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "ВидРабот",
						"presentation": "Вид работ",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf9-3565-11de-b591-00055d80a2b9",
						"presentation": "Испаритель",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Испаритель",
					"id": "00000000019",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bfa-3565-11de-b591-00055d80a2b9",
						"presentation": "Кабель электрический",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Кабель электрический",
					"id": "00000000020",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf8-3565-11de-b591-00055d80a2b9",
						"presentation": "Калькулятор",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Калькулятор",
					"id": "00000000018",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bfb-3565-11de-b591-00055d80a2b9",
						"presentation": "Комплект клапанов и вентилей",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Комплект клапанов и вентилей",
					"id": "00000000021",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bfc-3565-11de-b591-00055d80a2b9",
						"presentation": "Комплект трубок",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Комплект трубок",
					"id": "00000000022",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bfd-3565-11de-b591-00055d80a2b9",
						"presentation": "Компрессор",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Компрессор",
					"id": "00000000023",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bfe-3565-11de-b591-00055d80a2b9",
						"presentation": "Конденсатор (теплообменник)",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Конденсатор (теплообменник)",
					"id": "00000000024",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87b7-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Кондиционер \"Самсунг\"",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87af-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Продукция, товары",
						"type": "cat.Номенклатура"
					},
					"name": "Кондиционер \"Самсунг\"",
					"id": "00000000008",
					"Артикул": "123",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87bd-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Кондиционер Ветерок",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87af-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Продукция, товары",
						"type": "cat.Номенклатура"
					},
					"name": "Кондиционер Ветерок",
					"id": "00000000009",
					"Артикул": "345",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c11-3565-11de-b591-00055d80a2b9",
						"presentation": "Контроль основного блока",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"name": "Контроль основного блока",
					"id": "00000000039",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Операция",
						"presentation": "Операция",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf1-3565-11de-b591-00055d80a2b9",
						"presentation": "Коробка картонная",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Коробка картонная",
					"id": "00000000012",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bff-3565-11de-b591-00055d80a2b9",
						"presentation": "Корпус",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Корпус",
					"id": "00000000025",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "c13b4170-395e-11de-b595-00055d80a2b9",
						"presentation": "Курьерская доставка",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"name": "Курьерская доставка",
					"id": "00000000047",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "357c3c88-33e5-11de-b58f-00055d80a2b9",
						"presentation": "Лицензия",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ad-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Имущество",
						"type": "cat.Номенклатура"
					},
					"name": "Лицензия",
					"id": "00000000011",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Материалы и комплектующие",
					"id": "00000000002",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87ad-33d5-11de-b58f-00055d80a2b8",
						"presentation": "Новая папка",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Новая папка",
					"id": "00-00000001",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf5-3565-11de-b591-00055d80a2b9",
						"presentation": "Обрезки кабеля",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Обрезки кабеля",
					"id": "00000000016",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "bbb812da-2b8d-11df-b67b-00055d80a2b9",
						"presentation": "Оплата по договору подряда",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"name": "Оплата по договору подряда",
					"id": "00000000055",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c04-3565-11de-b591-00055d80a2b9",
						"presentation": "Основной блок Ветерок",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87af-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Продукция, товары",
						"type": "cat.Номенклатура"
					},
					"name": "Основной блок Ветерок",
					"id": "00000000030",
					"Артикул": "567",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "2d70a7ad-269f-11df-b677-00055d80a2b9",
						"presentation": "Пена монтажная",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Пена монтажная",
					"id": "00000000051",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf2-3565-11de-b591-00055d80a2b9",
						"presentation": "Пенопласт",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Пенопласт",
					"id": "00000000013",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "47ea5fb0-393f-11de-b595-00055d80a2b9",
						"presentation": "Подготовка проектного решения",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Подготовка проектного решения",
					"id": "00000000044",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Работа",
						"presentation": "Работа",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "47ea5fb5-393f-11de-b595-00055d80a2b9",
						"presentation": "Подготовка проектной документации",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Подготовка проектной документации",
					"id": "00000000045",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Работа",
						"presentation": "Работа",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf3-3565-11de-b591-00055d80a2b9",
						"presentation": "Полиэтилен",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Полиэтилен",
					"id": "00000000014",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c0a-3565-11de-b591-00055d80a2b9",
						"presentation": "Приемо-сдаточные испытания",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Приемо-сдаточные испытания",
					"id": "00000000034",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Работа",
						"presentation": "Работа",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87af-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Продукция, товары",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Продукция, товары",
					"id": "00000000003",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c00-3565-11de-b591-00055d80a2b9",
						"presentation": "Пульт управления",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Пульт управления",
					"id": "00000000026",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "cc34be73-3ba9-11de-b598-00055d80a2b9",
						"presentation": "Работа с документами",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"name": "Работа с документами",
					"id": "00000000050",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "ВидРабот",
						"presentation": "Вид работ",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Работы и услуги",
					"id": "00000000004",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c08-3565-11de-b591-00055d80a2b9",
						"presentation": "Разработка проектного решения",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"name": "Разработка проектного решения",
					"id": "00000000032",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "ВидРабот",
						"presentation": "Вид работ",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "28927071-2c21-11df-b67c-00055d80a2b9",
						"presentation": "Расходные материалы",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Расходные материалы",
					"id": "00000000056",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "47ea5fab-393f-11de-b595-00055d80a2b9",
						"presentation": "Резка кабеля",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"name": "Резка кабеля",
					"id": "00000000043",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Операция",
						"presentation": "Операция",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c0b-3565-11de-b591-00055d80a2b9",
						"presentation": "Ремонт",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"name": "Ремонт",
					"id": "00000000035",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "ВидРабот",
						"presentation": "Вид работ",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "10466615-26a7-11df-b677-00055d80a2b9",
						"presentation": "Ремонт кондиционеров",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Ремонт кондиционеров",
					"id": "00000000052",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c01-3565-11de-b591-00055d80a2b9",
						"presentation": "Саморез",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Саморез",
					"id": "00000000027",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "9ade754c-3571-11de-b591-00055d80a2b9",
						"presentation": "Сборка кондиционера Ветерок",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"name": "Сборка кондиционера Ветерок",
					"id": "00000000040",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Операция",
						"presentation": "Операция",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c10-3565-11de-b591-00055d80a2b9",
						"presentation": "Сборка основного блока",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"name": "Сборка основного блока",
					"id": "00000000038",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Операция",
						"presentation": "Операция",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf4-3565-11de-b591-00055d80a2b9",
						"presentation": "Скотч",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Скотч",
					"id": "00000000015",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c02-3565-11de-b591-00055d80a2b9",
						"presentation": "Термостат",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Термостат",
					"id": "00000000028",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c07-3565-11de-b591-00055d80a2b9",
						"presentation": "Технико-экономическое обоснование",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Технико-экономическое обоснование",
					"id": "00000000031",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Работа",
						"presentation": "Работа",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Технологические операции",
					"id": "00000000006",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c0c-3565-11de-b591-00055d80a2b9",
						"presentation": "Транспортировка",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"name": "Транспортировка",
					"id": "00000000036",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "9ade754d-3571-11de-b591-00055d80a2b9",
						"presentation": "Упаковка кондиционера Ветерок",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b2-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Технологические операции",
						"type": "cat.Номенклатура"
					},
					"name": "Упаковка кондиционера Ветерок",
					"id": "00000000041",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Операция",
						"presentation": "Операция",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "77f23aa1-3576-11de-b591-00055d80a2b9",
						"presentation": "Упаковочная единица",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Упаковочная единица",
					"id": "00000000042",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c0d-3565-11de-b591-00055d80a2b9",
						"presentation": "Услуги переработчика",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"name": "Услуги переработчика",
					"id": "00000000037",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Услуга",
						"presentation": "Услуга",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "213d87b1-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Услуги сторонних контрагентов",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": true,
					"parent": {
						"ref": "00000000-0000-0000-0000-000000000000",
						"presentation": "",
						"type": "cat.Номенклатура"
					},
					"name": "Услуги сторонних контрагентов",
					"id": "00000000005",
					"Артикул": ""
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c09-3565-11de-b591-00055d80a2b9",
						"presentation": "Установка и монтаж",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b3-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Виды работ",
						"type": "cat.Номенклатура"
					},
					"name": "Установка и монтаж",
					"id": "00000000033",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "ВидРабот",
						"presentation": "Вид работ",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 0
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "61baf72a-3954-11de-b595-00055d80a2b9",
						"presentation": "Установка, сборка и монтаж",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87b0-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Работы и услуги",
						"type": "cat.Номенклатура"
					},
					"name": "Установка, сборка и монтаж",
					"id": "00000000046",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Работа",
						"presentation": "Работа",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "68d86825-277c-11df-b679-00055d80a2b9",
						"presentation": "Файлы",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Файлы",
					"id": "00000000053",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3bf7-3565-11de-b591-00055d80a2b9",
						"presentation": "Шнур питания (3 м)",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Шнур питания (3 м)",
					"id": "00000000017",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				},
				{
					"predefined_name": "",
					"ref": {
						"ref": "6ebf3c03-3565-11de-b591-00055d80a2b9",
						"presentation": "Электронный блок управления",
						"type": "cat.Номенклатура"
					},
					"deleted": false,
					"is_folder": false,
					"parent": {
						"ref": "213d87ae-33d5-11de-b58f-00055d80a2b9",
						"presentation": "Материалы и комплектующие",
						"type": "cat.Номенклатура"
					},
					"name": "Электронный блок управления",
					"id": "00000000029",
					"Артикул": "",
					"ТипНоменклатуры": {
						"name": "Запас",
						"presentation": "Запас",
						"type": "enm.ТипыНоменклатуры"
					},
					"СрокИсполненияЗаказа": 1
				}
			],
			"delivery_areas": [
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "d231f8eb-eb80-11e1-9add-000c297147a6",
						"presentation": "Ленинский (Челябинск)",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Ленинский (Челябинск)",
					"id": "000000010",
					"region": "Челябинская область",
					"city": "г. Челябинск",
					"latitude": 55.134030619492,
					"longitude": 61.437430428223,
					"ind": "454010",
					"delivery_area": "Ленинский",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "d231f8f3-eb80-11e1-9add-000c297147a6",
						"presentation": "Теплый Стан",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Теплый Стан",
					"id": "000000018",
					"region": "г. Москва",
					"city": "",
					"latitude": 55.626376568423,
					"longitude": 37.492746645508,
					"ind": "",
					"delivery_area": "Теплый Стан",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "d231f903-eb80-11e1-9add-000c297147a6",
						"presentation": "Кутузовский проспект",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Кутузовский проспект",
					"id": "000000034",
					"region": "г. Москва",
					"city": "",
					"latitude": 55.737977985868,
					"longitude": 37.511194661377,
					"ind": "",
					"delivery_area": "Кутузовский проспект",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "f648af23-eb8a-11e1-9add-000c297147a6",
						"presentation": "Бескудниковский",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Бескудниковский",
					"id": "000000038",
					"region": "г. Москва",
					"city": "",
					"latitude": 55.865642642029,
					"longitude": 37.552150984131,
					"ind": "",
					"delivery_area": "Бескудниковский",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "f648af2a-eb8a-11e1-9add-000c297147a6",
						"presentation": "Левобережный",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Левобережный",
					"id": "000000045",
					"region": "г. Москва",
					"city": "",
					"latitude": 55.8673206194,
					"longitude": 37.468912936523,
					"ind": "",
					"delivery_area": "Левобережный",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "f648af42-eb8a-11e1-9add-000c297147a6",
						"presentation": "Чертаново",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Чертаново",
					"id": "000000069",
					"region": "г. Москва",
					"city": "",
					"latitude": 55.58979461973,
					"longitude": 37.604085968262,
					"ind": "",
					"delivery_area": "Чертаново",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "4609e8c3-eb8d-11e1-9add-000c297147a6",
						"presentation": "Зеленоград",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Зеленоград",
					"id": "000000109",
					"region": "Московская обл.",
					"city": "Зеленоград",
					"latitude": 55.98296250772,
					"longitude": 37.175513984131,
					"ind": "",
					"delivery_area": "",
					"specify_area_by_geocoder": false
				},
				{
					"ИмяПредопределенныхДанных": "",
					"ref": {
						"ref": "dc9df9ba-35ba-11e3-bf86-206a8a1a5bb0",
						"presentation": "Краснодар",
						"type": "cat.delivery_areas"
					},
					"deleted": false,
					"name": "Краснодар",
					"id": "000000110",
					"region": "Краснодарcкий край",
					"city": "г. Краснодар",
					"latitude": 45.027163907908,
					"longitude": 38.970328661377,
					"ind": "",
					"delivery_area": "",
					"specify_area_by_geocoder": false
				}
			]
		},
		"doc": {
			"ЗаказПокупателя": [
				{
					"data_version": "",
					"ref": "51012ccc-397d-11de-b595-00055d80a2b9",
					"deleted": false,
					"number_doc": "ПР00-000002",
					"date": "2015-01-17T08:00:00.000Z",
					"posted": true,
					"ДатаИзменения": "2015-07-01T21:44:26.000Z",
					"ДатаОтгрузки": "2012-01-21T00:00:00.000Z",
					"Контрагент": "77f23ab2-3576-11de-b591-00055d80a2b9",
					"СуммаДокумента": 2550,
					"СписокНоменклатуры": "",
					"delivery_area": {
						"ref": "f648af42-eb8a-11e1-9add-000c297147a6",
						"presentation": "Чертаново",
						"type": "cat.delivery_areas"
					},
					"shipping_address": "117545, Москва г, Подольских Курсантов ул, дом № 7 корп с21",
					"coordinates": "",
					"address_fields": "\u003CКонтактнаяИнформация xmlns=\"http://www.v8.1c.ru/ssl/contactinfo\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" Представление=\"117545, Москва г, Подольских Курсантов ул, дом № 7\"\u003E\u003CКомментарий/\u003E\u003CСостав xsi:type=\"Адрес\" Страна=\"РОССИЯ\"\u003E\u003CСостав xsi:type=\"АдресРФ\"\u003E\u003CСубъектРФ\u003EМосква г\u003C/СубъектРФ\u003E\u003CСвРайМО\u003E\u003CРайон/\u003E\u003C/СвРайМО\u003E\u003CГород/\u003E\u003CНаселПункт/\u003E\u003CУлица\u003EПодольских Курсантов ул\u003C/Улица\u003E\u003CДопАдрЭл\u003E\u003CНомер Тип=\"1010\" Значение=\"7\"/\u003E\u003C/ДопАдрЭл\u003E\u003CДопАдрЭл ТипАдрЭл=\"10100000\" Значение=\"117545\"/\u003E\u003C/Состав\u003E\u003C/Состав\u003E\u003C/КонтактнаяИнформация\u003E",
					"Запасы": [
						{
							"Номенклатура": "6ebf3bf7-3565-11de-b591-00055d80a2b9",
							"Количество": 10,
							"Цена": 300,
							"ПроцентСкидкиНаценки": 0,
							"Сумма": 2550,
							"row": 1
						}
					]
				},
				{
					"data_version": "",
					"ref": "bad3fbef-371f-11de-b592-00055d80a2b9",
					"deleted": false,
					"number_doc": "ТД00-000004",
					"date": "2015-07-02T00:00:00.000Z",
					"posted": true,
					"ДатаИзменения": "2015-07-01T21:45:30.000Z",
					"ДатаОтгрузки": "2012-01-10T00:00:00.000Z",
					"Контрагент": "77f23ab0-3576-11de-b591-00055d80a2b9",
					"СуммаДокумента": 46000,
					"СписокНоменклатуры": "",
					"Запасы": [
						{
							"Номенклатура": "213d87bd-33d5-11de-b58f-00055d80a2b9",
							"Количество": 1,
							"Цена": 50000,
							"ПроцентСкидкиНаценки": 0,
							"Сумма": 46000,
							"row": 1
						}
					]
				},
				{
					"data_version": "",
					"ref": "bcc42416-3986-11de-b595-00055d80a2b9",
					"deleted": false,
					"number_doc": "ТД00-000007",
					"date": "2015-01-20T12:00:00.000Z",
					"posted": true,
					"ДатаИзменения": "2015-07-01T21:46:41.000Z",
					"ДатаОтгрузки": "2012-01-24T00:00:00.000Z",
					"Контрагент": "77f23aad-3576-11de-b591-00055d80a2b9",
					"СуммаДокумента": 208000,
					"СписокНоменклатуры": "",
					"Запасы": [
						{
							"Номенклатура": "213d87bd-33d5-11de-b58f-00055d80a2b9",
							"Количество": 10,
							"Цена": 40000,
							"ПроцентСкидкиНаценки": 0,
							"Сумма": 208000,
							"row": 1
						}
					]
				}
			]
		},
		"ireg": {},
		"areg": {},
		"cch": {},
		"cacc": {},
		"current": 1,
		"files": 1,
		"force": true
	}
}),
"create_tables": "USE md;\nCREATE TABLE IF NOT EXISTS refs (ref CHAR);\nCREATE TABLE IF NOT EXISTS `enm_ТипыНоменклатуры` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR);\nCREATE TABLE IF NOT EXISTS `doc_ЗаказПокупателя` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, posted BOOLEAN, date Date, number_doc CHAR, `ДатаИзменения` Date, `ДатаОтгрузки` Date, `Комментарий` CHAR, `Контрагент` CHAR, `delivery_area` CHAR, `shipping_address` CHAR, `coordinates` CHAR, `address_fields` CHAR, `СуммаДокумента` FLOAT, `СписокНоменклатуры` CHAR, `ts_Запасы` JSON);\nCREATE TABLE IF NOT EXISTS `ireg_$log` (`date` Date, `sequence` INT, `class` CHAR, `note` CHAR, PRIMARY KEY (`date`, `sequence`));\nCREATE TABLE IF NOT EXISTS `cat_delivery_areas` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `region` CHAR, `city` CHAR, `latitude` FLOAT, `longitude` FLOAT, `ind` CHAR, `delivery_area` CHAR, `specify_area_by_geocoder` BOOLEAN);\nCREATE TABLE IF NOT EXISTS `cat_Номенклатура` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `Артикул` CHAR, `ТипНоменклатуры` CHAR, `Комментарий` CHAR, `СрокИсполненияЗаказа` INT, `parent` CHAR);\nCREATE TABLE IF NOT EXISTS `cat_Контрагенты` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `ИНН` CHAR, `Комментарий` CHAR, `parent` CHAR);\n",
"select_elm": "<div class=\"otooltip\">\r\n    <p class=\"otooltip\">Инструмент <b>Свойства элемента</b> позволяет:</p>\r\n    <ul class=\"otooltip\">\r\n        <li>Выделить элемент целиком<br />для изменения его свойств или перемещения</li>\r\n        <li>Добавить новый элемент делением текущего<br />(кнопка {+} на цифровой клавиатуре)</li>\r\n        <li>Удалить выделенный элемент<br />(кнопки {del} или {-} на цифровой клавиатуре)</li>\r\n    </ul>\r\n    <hr />\r\n    <a title=\"Видеоролик, иллюстрирующий работу инструмента\" href=\"https://www.youtube.com/embed/UcBGQGqwUro?list=PLiVLBB_TTj5njgxk5E_EjwxzCGM4XyKlQ\" target=\"_blank\">\r\n        <img style=\"margin: 0px; border-style: none;\" src=\"lib/imgs/dhxtoolbar_web/award-video.png\" /> Обучающее видео</a>\r\n    <img src=\"lib/imgs/dhxtoolbar_web/blank9.png\" />\r\n    <a title=\"Справка по инструменту в WIKI\" href=\"http://www.oknosoft.ru/upzp/apidocs/classes/OTooolBar.html\" target=\"_blank\">\r\n        <img style=\"margin: 0px; border-style: none;\" src=\"lib/imgs/dhxtoolbar_web/cloud-question.png\"> Справка в wiki</a>\r\n</div>",
"select_node": "<div class=\"otooltip\">\r\n    <p class=\"otooltip\">Инструмент <b>Свойства узла</b> позволяет:</p>\r\n    <ul class=\"otooltip\">\r\n        <li>Выделить элемент<br />для изменения его свойств или перемещения</li>\r\n        <li>Выделить отдельные узлы и лучи узлов<br />для изменения геометрии</li>\r\n        <li>Добавить новый узел (изгиб)<br />(кнопка {+} на цифровой клавиатуре)</li>\r\n        <li>Удалить выделенный узел (изгиб)<br />(кнопки {del} или {-} на цифровой клавиатуре)</li>\r\n    </ul>\r\n    <hr />\r\n    <a title=\"Видеоролик, иллюстрирующий работу инструмента\" href=\"https://www.youtube.com/embed/UcBGQGqwUro?list=PLiVLBB_TTj5njgxk5E_EjwxzCGM4XyKlQ\" target=\"_blank\">\r\n        <img style=\"margin: 0px; border-style: none;\" src=\"lib/imgs/dhxtoolbar_web/award-video.png\" /> Обучающее видео</a>\r\n    <img src=\"lib/imgs/dhxtoolbar_web/blank9.png\" />\r\n    <a title=\"Справка по инструменту в WIKI\" href=\"http://www.oknosoft.ru/upzp/apidocs/classes/OTooolBar.html\" target=\"_blank\">\r\n        <img style=\"margin: 0px; border-style: none;\" src=\"lib/imgs/dhxtoolbar_web/cloud-question.png\"> Справка в wiki</a>\r\n</div>"
},{},{});
