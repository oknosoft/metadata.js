/**
 * Метаданные системных перечислений, регистров и справочников
 *
 * @module  metadata
 * @submodule sys_types
 *
 * Created 28.11.2016
 */

const meta_sys = {
	_id: "meta_sys",
	enm: {
		accumulation_record_type: [
			{
				order: 0,
				name: "debit",
				synonym: "Приход"
			},
			{
				order: 1,
				name: "credit",
				synonym: "Расход"
			}
		],
		comparison_types: [
			{
				order: 0,
				name: "gt",
				synonym: "Больше"
			},
			{
				order: 1,
				name: "gte",
				synonym: "Больше или равно"
			},
			{
				order: 2,
				name: "lt",
				synonym: "Меньше"
			},
			{
				order: 3,
				name: "lte",
				synonym: "Меньше или равно "
			},
			{
				order: 4,
				name: "eq",
				synonym: "Равно"
			},
			{
				order: 5,
				name: "ne",
				synonym: "Не равно"
			},
			{
				"order": 6,
				"name": "in",
				"synonym": "В списке"
			},
			{
				order: 7,
				name: "nin",
				synonym: "Не в списке"
			},
			{
				order: 8,
				name: "lke",
				synonym: "Подобно "
			},
			{
				order: 9,
				name: "nlk",
				synonym: "Не подобно"
			}
		]
	},
	cat: {
		meta_objs: {},
		meta_fields: {},
		scheme_settings: {
			name: "scheme_settings",
			splitted: true,
			synonym: "Настройки отчетов и списков",
			illustration: "",
			obj_presentation: "",
			list_presentation: "",
			input_by_string: [
				"name"
			],
			hierarchical: false,
			has_owners: false,
			group_hierarchy: true,
			main_presentation_name: true,
			code_length: 0,
			fields: {
				obj: {
					"synonym": "Объект",
					"multiline_mode": false,
					"tooltip": "",
					"type": {
						"types": [
							"string"
						],
						"str_len": 250
					}
				},
				user: {
					"synonym": "Пользователь",
					"multiline_mode": false,
					"tooltip": "",
					"type": {
						"types": [
							"string"
						],
						"str_len": 50
					}
				},
				predefined_name: {
					"synonym": "",
					"multiline_mode": false,
					"tooltip": "",
					"type": {
						"types": [
							"string"
						],
						"str_len": 256
					}
				}
			},
			tabular_sections: {
				available_fields: {
					"name": "available_fields",
					"synonym": "Доступные поля",
					"tooltip": "Состав, порядок и ширина колонок",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "Для плоского списка, родитель пустой",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"use": {
							"synonym": "Использование",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"boolean"
								]
							}
						},
						"field": {
							"synonym": "Поле",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"width": {
							"synonym": "Ширина",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"number"
								],
								"digits": 6,
								"fraction_figits": 0
							}
						},
						"caption": {
							"synonym": "Заголовок",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						}
					}
				},
				sort_fields: {
					"name": "sort_fields",
					"synonym": "Поля сортировки",
					"tooltip": "",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"field": {
							"synonym": "Поле",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						}
					}
				},
				grouping_fields: {
					"name": "grouping_fields",
					"synonym": "Поля группировки",
					"tooltip": "",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"field": {
							"synonym": "Поле",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						}
					}
				},
				selection: {
					"name": "selection",
					"synonym": "Отбор",
					"tooltip": "",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"use": {
							"synonym": "Использование",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"boolean"
								]
							}
						},
						"left_value": {
							"synonym": "Левое значение",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"comparison_type": {
							"synonym": "Вид сравнения",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						},
						"right_value": {
							"synonym": "Правое значение",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 100
							}
						}
					}
				},
				scheme: {
					"name": "scheme",
					"synonym": "Структура",
					"tooltip": "",
					"fields": {
						"parent": {
							"synonym": "Родитель",
							"multiline_mode": false,
							"tooltip": "",
							"type": {
								"types": [
									"string"
								],
								"str_len": 10
							}
						},
						"kind": {
							"synonym": "Вид раздела отчета",
							"multiline_mode": false,
							"tooltip": "список, таблица, группировка строк, группировка колонок",
							"type": {
								"types": [
									"string"
								],
								"str_len": 10
							}
						}
					}
				}
			},
			cachable: "doc"
		}
	},
	doc: {},
	ireg: {
		"log": {
			name: "log",
			note: "",
			synonym: "Журнал событий",
			dimensions: {
				date: {
					synonym: "Дата",
					multiline_mode: false,
					tooltip: "Время события",
					type: {
						types: [
							"number"
						],
						digits: 15,
						fraction_figits: 0
					}
				},
				sequence: {
					synonym: "Порядок",
					multiline_mode: false,
					tooltip: "Порядок следования",
					type: {
						types: [
							"number"
						],
						digits: 6,
						fraction_figits: 0
					}
				}
			},
			resources: {
				"class": {
					synonym: "Класс",
					multiline_mode: false,
					tooltip: "Класс события",
					type: {
						types: [
							"string"
						],
						str_len: 100
					}
				},
				note: {
					synonym: "Комментарий",
					multiline_mode: true,
					tooltip: "Текст события",
					type: {
						types: [
							"string"
						],
						str_len: 0
					}
				},
				obj: {
					synonym: "Объект",
					multiline_mode: true,
					tooltip: "Объект, к которому относится событие",
					type: {
						types: [
							"string"
						],
						str_len: 0
					}
				}
			}
		}
	},
	areg: {},
	dp: {},
	rep: {},
	cch: {},
	cacc: {}
}