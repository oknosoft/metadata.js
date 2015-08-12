(function (require) {
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
						"МногострочныйРежим": false,
						"Подсказка": "Идентификационный номер контрагента, для отражения в печатных формах документов.",
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
						"МногострочныйРежим": true,
						"Подсказка": "Любая дополнительная информация",
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
						"МногострочныйРежим": false,
						"Подсказка": "Группа, в которую входит данный контрагент.",
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
						"МногострочныйРежим": false,
						"Подсказка": "Цифровой код товара. Текстовое значение, используется в печатных формах документов.",
						"type": {
							"types": [
								"string"
							],
							"str_len": 25
						}
					}
					,
					"ТипНоменклатуры": {
						"synonym": "Тип",
						"МногострочныйРежим": false,
						"Подсказка": "Тип позиции номенклатуры, определяющий ее сущность и поведение: запас - складируемые запасы, работа - подрядные работы, услуга - сервисные услуги, услуги сторонних организаций.",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"enm.ТипыНоменклатуры"
							],
							"is_ref": true
						}
					}
					,
					"Комментарий": {
						"synonym": "Описание",
						"МногострочныйРежим": false,
						"Подсказка": "Любая дополнительная информация",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					}
					,
					"СрокИсполненияЗаказа": {
						"synonym": "Срок исполнения (дн.)",
						"МногострочныйРежим": false,
						"Подсказка": "Стандартный срок исполнения заказа покупателя, в днях.",
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
						"МногострочныйРежим": false,
						"Подсказка": "Группа, в которую входит данная позиция номенклатуры.",
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
						"МногострочныйРежим": false,
						"Подсказка": "",
						"type": {
							"types": [
								"date"
							],
							"date_part": "date_time"
						}
					},
					"ДатаОтгрузки": {
						"synonym": "Дата отгрузки",
						"МногострочныйРежим": false,
						"Подсказка": "Желаемая дата отгрузки по заказу",
						"type": {
							"types": [
								"date"
							],
							"date_part": "date"
						}
					},
					"Комментарий": {
						"synonym": "Комментарий",
						"МногострочныйРежим": false,
						"Подсказка": "Произвольный комментарий",
						"type": {
							"types": [
								"string"
							],
							"str_len": 0
						}
					},
					"Контрагент": {
						"synonym": "Контрагент",
						"МногострочныйРежим": false,
						"Подсказка": "Покупатель, заказчик",
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
						"МногострочныйРежим": false,
						"Подсказка": "Заполняется сумма документа",
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
						"МногострочныйРежим": false,
						"Подсказка": "Список номенклатуры. Используется для отображения в списке документов.",
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
						"Подсказка": "Товары, работы, услуги, продукция",
						"fields": {
							"Номенклатура": {
								"synonym": "Номенклатура",
								"МногострочныйРежим": false,
								"Подсказка": "Заказываемая номенклатура",
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
								"МногострочныйРежим": false,
								"Подсказка": "Заказываемое количество",
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
								"МногострочныйРежим": false,
								"Подсказка": "Цена номенклатуры",
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
								"МногострочныйРежим": false,
								"Подсказка": "Процент скидки, наценки по строке документа",
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
								"МногострочныйРежим": false,
								"Подсказка": "Сумма по строке документа",
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
								"widths": "40,*,80,80,80,80",
								"min_widths": "40,200,70,70,70,70",
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
})