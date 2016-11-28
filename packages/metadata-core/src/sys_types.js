/**
 * Метаданные системных перечислений, регистров и справочников
 *
 * @module  metadata
 * @submodule sys_types
 *
 * Created 28.11.2016
 */

const $scheme = {
	name: "$scheme",
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