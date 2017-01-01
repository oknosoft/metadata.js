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
		sort_directions: [
			{
				order: 0,
				name: "asc",
				synonym: "По возрастанию"
			},
			{
				order: 1,
				name: "desc",
				synonym: "По убыванию"
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
					synonym: "Объект",
					multiline_mode: false,
					tooltip: "Имя класса метаданных",
					type: {
						types: [
							"string"
						],
						str_len: 250
					}
				},
				user: {
					synonym: "Пользователь",
					multiline_mode: false,
					tooltip: "Если пусто - публичная настройка",
					type: {
						types: [
							"string"
						],
						str_len: 50
					}
				}
			},
			tabular_sections: {
				available_fields: {
					name: "available_fields",
					synonym: "Доступные поля",
					tooltip: "Состав, порядок и ширина колонок",
					fields: {
						parent: {
							synonym: "Родитель",
							multiline_mode: false,
							tooltip: "Для плоского списка, родитель пустой",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						use: {
							synonym: "Использование",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"boolean"
								]
							}
						},
						field: {
							synonym: "Поле",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						width: {
							synonym: "Ширина",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"number"
								],
								digits: 6,
								fraction_figits: 0
							}
						},
						caption: {
							synonym: "Заголовок",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						tooltip: {
							synonym: "Подсказка",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						type: {
							synonym: "Тип",
							multiline_mode: false,
							tooltip: "Тип элемента управления",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						}

					}
				},
				sort_fields: {
					name: "sort_fields",
					synonym: "Поля сортировки",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						field: {
							synonym: "Поле",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						direction: {
							synonym: "Направление",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"enm.sort_directions"
								],
								"is_ref": true
							}
						}
					}
				},
				grouping_fields: {
					name: "grouping_fields",
					synonym: "Поля группировки",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						field: {
							synonym: "Поле",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						}
					}
				},
				selection: {
					name: "selection",
					synonym: "Отбор",
					tooltip: "",
					fields: {
						parent: {
							synonym: "Родитель",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						use: {
							synonym: "Использование",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"boolean"
								]
							}
						},
						left_value: {
							synonym: "Левое значение",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						comparison_type: {
							synonym: "Вид сравнения",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"enm.comparison_types"
								],
								is_ref: true
							}
						},
						right_value: {
							synonym: "Правое значение",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						}
					}
				},
				params: {
					name: "params",
					synonym: "Параметры",
					tooltip: "",
					fields: {
						param: {
							synonym: "Параметр",
							multiline_mode: false,
							tooltip: "",
							type: {
								types: [
									"string"
								],
								str_len: 100
							}
						},
						value: {
							synonym: "Значение",
							multiline_mode: false,
							tooltip: "Может иметь примитивный или ссылочный тип или массив",
							type: {
								types: [
									"string"
								],
								str_len: 0
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

function meta_sys_init($p) {

	/**
	 * ### Менеджер объектов метаданных
	 * Используется для формирования списков типов документов, справочников и т.д.
	 * Например, при работе в интерфейсе с составными типами
	 */
	class MetaObjManager extends classes.CatManager{

	}

	/**
	 * ### Менеджер доступных полей
	 * Используется при настройке отчетов и динамических списков
	 */
	class MetaFieldManager extends classes.CatManager{

	}

	/**
	 * ### Виртуальный справочник MetaObjs
	 * undefined
	 * @class CatMeta_objs
	 * @extends CatObj
	 * @constructor
	 */
	$p.CatMeta_objs = class CatMeta_objs extends classes.CatObj{}

	/**
	 * ### Виртуальный справочник MetaFields
	 * undefined
	 * @class CatMeta_fields
	 * @extends CatObj
	 * @constructor
	 */
	$p.CatMeta_fields = class CatMeta_fields extends classes.CatObj{}

	// публикуем системные менеджеры
	Object.defineProperties(classes, {

		MetaObjManager: { value: MetaObjManager },

		MetaFieldManager: { value: MetaFieldManager }

	})

	// создаём системные менеджеры метаданных
	Object.defineProperties($p.cat, {
		meta_objs: {
			value: new MetaObjManager('cat.meta_objs')
		},
		meta_fields: {
			value: new MetaFieldManager('cat.meta_fields')
		}
	})

}