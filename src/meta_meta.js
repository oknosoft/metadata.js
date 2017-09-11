/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_meta
 * @requires common
 */

var _md;

/**
 * ### Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 *
 * @class Meta
 * @static
 * @menuorder 02
 * @tooltip Описание метаданных
 */
function Meta() {

	var _m = {
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
      meta_objs: {
        fields: {}
      },
      meta_fields: {
        fields: {}
      },
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Настройки отчетов и списков",
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
            tooltip: "Если пусто - публичная настройка",
            type: {
              types: [
                "string"
              ],
              str_len: 50
            }
          },
          order: {
            synonym: "Порядок",
            tooltip: "Порядок варианта",
            type: {
              types: [
                "number"
              ],
              digits: 6,
              fraction_figits: 0,
            }
          },
          query: {
            synonym: "Запрос",
            tooltip: "Индекс CouchDB или текст SQL",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          },
          date_from: {
            "synonym": "Начало периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          date_till: {
            "synonym": "Конец периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          formula: {
            synonym: "Формула",
            tooltip: "Формула инициализации",
            type: {
              types: [
                "cat.formulas"
              ],
              is_ref: true
            }
          },
          tag: {
            synonym: "Дополнительные свойства",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          }
        },
        tabular_sections: {
          fields: {
            name: "fields",
            synonym: "Доступные поля",
            tooltip: "Состав, порядок и ширина колонок",
            fields: {
              parent: {
                synonym: "Родитель",
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
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
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
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 6
                }
              },
              caption: {
                synonym: "Заголовок",
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
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              ctrl_type: {
                synonym: "Тип",
                tooltip: "Тип элемента управления",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formatter: {
                synonym: "Формат",
                tooltip: "Функция форматирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              },
              editor: {
                synonym: "Редактор",
                tooltip: "Компонент редактирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              }
            }
          },
          sorting: {
            name: "sorting",
            synonym: "Поля сортировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
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
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
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
          dimensions: {
            name: "dimensions",
            synonym: "Поля группировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
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
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
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
          resources: {
            name: "resources",
            synonym: "Ресурсы",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
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
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formula: {
                synonym: "Формула",
                tooltip: "По умолчанию - сумма",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
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
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              left_value: {
                synonym: "Левое значение",
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
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value_type: {
                synonym: "Тип",
                tooltip: "Тип значения",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value: {
                synonym: "Значение",
                tooltip: "Может иметь примитивный или ссылочный тип или массив",
                type: {
                  types: [
                    "string",
                    "number",
                    // "date",
                    // "array"
                  ],
                  str_len: 0,
                  digits: 15,
                  fraction_figits: 3,
                  // date_part: "date"
                }
              }
            }
          },
          composition: {
            name: "composition",
            synonym: "Структура",
            tooltip: "",
            fields: {
              parent: {
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
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                "synonym": "Элемент",
                "tooltip": "Элемент структуры отчета",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              kind: {
                "synonym": "Вид раздела отчета",
                "tooltip": "список, таблица, группировка строк, группировка колонок",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              definition: {
                "synonym": "Описание",
                "tooltip": "Описание раздела структуры",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
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
			log: {
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
		dp: {
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Варианты настроек",
        fields: {
          scheme: {
            synonym: "Текущая настройка",
            tooltip: "Текущий вариант настроек",
            mandatory: true,
            type: {
              types: [
                "cat.scheme_settings"
              ],
              is_ref: true
            }
          }
        }
      }
    },
		rep: {},
		cch: {},
		cacc: {}
	};

	_md = this;

	// загружает метаданные из pouchdb
	function meta_from_pouch(meta_db){

		return meta_db.info()
			.then(function () {
				return meta_db.get('meta');

			})
			.then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				return meta_db.get('meta_patch');

			}).then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				delete _m._id;
				delete _m._rev;
				return _m;
			});
	}


	/**
	 * ### Cоздаёт объекты менеджеров
	 * @method create_managers
	 */
	_md.create_managers = function(){};

  /**
   * ### Возвращает массив используемых баз
   *
   * @method bases
   * @return {Array}
   */
  _md.bases = function () {
    var res = {};
    for(var i in _m){
      for(var j in _m[i]){
        if(_m[i][j].cachable){
          var _name = _m[i][j].cachable.replace('_remote', '').replace('_ram', '');
          if(_name != 'meta' && _name != 'e1cib' && !res[_name])
            res[_name] = _name;
        }
      }
    }
    return Object.keys(res);
  }

  /**
   * ### Загружает объекты с типом кеширования doc_ram в ОЗУ
   * @method load_doc_ram
   */
  _md.load_doc_ram = function() {
    var res = [];
    ['cat','cch','ireg'].forEach(function (kind) {
      for (var name in _m[kind]) {
        if (_m[kind][name].cachable == 'doc_ram') {
          res.push(kind + '.' + name);
        }
      }
    });
    return $p.wsql.pouch.local.doc.find({
      selector: {class_name: {$in: res}},
      limit: 10000
    })
      .then($p.wsql.pouch.load_changes);
  }

	/**
	 * ### Инициализирует метаданные
	 * загружает описание метаданных из локального или сетевого хранилища или из объекта, переданного в параметре
	 *
	 * @method create_managers
	 * @for Meta
	 * @param [meta_db] {Object|String}
	 */
	_md.init = function (meta_db) {

		var is_local = !meta_db || ($p.wsql.pouch && meta_db == $p.wsql.pouch.local.meta),
			is_remote = meta_db && ($p.wsql.pouch && meta_db == $p.wsql.pouch.local._meta);

		function do_init(){

			if(meta_db && !is_local && !is_remote){
				$p._patch(_m, meta_db);
				meta_db = null;

				_md.create_managers();

			}else{

				return meta_from_pouch(meta_db || $p.wsql.pouch.local.meta)
					.then(function () {
						if(is_local){
							_md.create_managers();

						}else{
							return _m;
						}
					})
					.catch($p.record_log);
			}
		}



		// этот обработчик нужен только при инициализации, когда в таблицах meta еще нет данных
		$p.on("pouch_change", function (dbid, change) {

			if (dbid != "meta")
				return;

			if(!_m)
				do_init();

			else if($p.iface && $p.iface.do_reload && change.docs && change.docs.length < 4){

				// если изменились метаданные, запланировать перезагрузку
				setTimeout(function () {
					$p.iface.do_reload();
				}, 10000);

			}

		});

		return do_init();

	};

	/**
	 * ### Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){

		var np = class_name.split(".");

		if(!field_name)
			return _m[np[0]][np[1]];

		var res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}},
			is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

		if(is_doc && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;

		}else if(is_doc && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";

		}else if(is_doc && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";

		}else if(is_cat && field_name=="id"){
			res.synonym = "Код";

		}else if(is_cat && field_name=="name"){
			res.synonym = "Наименование";

		}else if(field_name=="_deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";

		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";

		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;

		}else if(field_name)
			res = _m[np[0]][np[1]].fields[field_name];

		else
			res = _m[np[0]][np[1]];

		return res;
	};

	/**
	 * ### Возвращает структуру имён объектов метаданных конфигурации
	 *
	 * @method get_classes
	 */
	_md.get_classes = function () {
		var res = {};
		for(var i in _m){
			res[i] = [];
			for(var j in _m[i])
				res[i].push(j);
		}
		return res;
	};

	/**
	 * ### Возвращает тип поля sql для типа данных
	 *
	 * @method sql_type
	 * @param mgr {DataManager}
	 * @param f {String}
	 * @param mf {Object} - описание метаданных поля
	 * @param pg {Boolean} - использовать синтаксис postgreSQL
	 * @return {*}
	 */
	_md.sql_type = function (mgr, f, mf, pg) {
		var sql;
		if((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if(mf.is_ref || mf.types.indexOf("guid") != -1){
			if(!pg)
				sql = " CHAR";

			else if(mf.types.every(function(v){return v.indexOf("enm.") == 0}))
				sql = " character varying(100)";

			else if (!mf.hasOwnProperty("str_len"))
				sql = " uuid";

			else
				sql = " character varying(" + Math.max(36, mf.str_len) + ")";

		}else if(mf.hasOwnProperty("str_len"))
			sql = pg ? (mf.str_len ? " character varying(" + mf.str_len + ")" : " text") : " CHAR";

		else if(mf.date_part)
			if(!pg || mf.date_part == "date")
				sql = " Date";

			else if(mf.date_part == "date_time")
				sql = " timestamp with time zone";

			else
				sql = " time without time zone";

		else if(mf.hasOwnProperty("digits")){
			if(mf.fraction_figits==0)
				sql = pg ? (mf.digits < 7 ? " integer" : " bigint") : " INT";
			else
				sql = pg ? (" numeric(" + mf.digits + "," + mf.fraction_figits + ")") : " FLOAT";

		}else if(mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else if(mf.types.indexOf("json") != -1)
			sql = " JSON";

		else
			sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	};

	/**
	 * ### Для полей составного типа, добавляет в sql поле описания типа
	 * @param mf
	 * @param f
	 * @param pg
	 * @return {string}
	 */
	_md.sql_composite = function (mf, f, f0, pg){
		var res = "";
		if(mf[f].type.types.length > 1 && f != "type"){
			if(!f0)
				f0 = f.substr(0, 29) + "_T";
			else{
				f0 = f0.substr(0, 29) + "_T";
			}

			if(pg)
				res = ', "' + f0 + '" character varying(255)';
			else
				res = _md.sql_mask(f0) + " CHAR";
		}
		return res;
	};

	/**
	 * ### Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 * @private
	 */
	_md.sql_mask = function(f, t){
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	/**
	 * ### Возвращает менеджер объекта по имени класса
	 * @method mgr_by_class_name
	 * @param class_name {String}
	 * @return {DataManager|undefined}
	 * @private
	 */
	_md.mgr_by_class_name = function(class_name){
		if(class_name){
			var np = class_name.split(".");
			if(np[1] && $p[np[0]])
				return $p[np[0]][np[1]];
		}
	};

	/**
	 * ### Возвращает менеджер значения по свойству строки
	 * @method value_mgr
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - описание типа поля mf.type
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	_md.value_mgr = function(row, f, mf, array_enabled, v){

		var property, oproperty, tnames, rt, mgr;

		if(mf._mgr instanceof DataManager){
			return mf._mgr;
		}

		function mf_mgr(mgr){
			if(mgr instanceof DataManager && mf.types.length == 1){
				mf._mgr = mgr;
			}
			return mgr;
		}

		if(mf.types.length == 1){
			tnames = mf.types[0].split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);

		}else if(v && v.type){
			tnames = v.type.split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}

		property = row.property || row.param;
		if(f != "value" || !property){

			rt = [];
			mf.types.forEach(function(v){
				tnames = v.split(".");
				if(tnames.length > 1 && $p[tnames[0]][tnames[1]])
					rt.push($p[tnames[0]][tnames[1]]);
			});
			if(rt.length == 1 || row[f] == $p.utils.blank.guid)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			// Получаем объект свойства
			if($p.utils.is_data_obj(property)){
				oproperty = property;
			}
			else if($p.utils.is_guid(property)){
				oproperty = $p.cch.properties.get(property, false);
			}
			else{
				return;
			}

			if($p.utils.is_data_obj(oproperty)){

				// затычка для неизвестных свойств используем значения свойств объектов
				if(oproperty.is_new()){
					return $p.cat.property_values;
				}

				// и через его тип выходми на мнеджера значения
				rt = [];
				oproperty.type.types.some(function(v){
					tnames = v.split(".");
					if(tnames.length > 1 && $p[tnames[0]][tnames[1]]){
						rt.push($p[tnames[0]][tnames[1]]);
					}
					else if(v == "boolean"){
						rt.push({types: ["boolean"]});
						return true
					}
				});
				if(rt.length == 1 || row[f] == $p.utils.blank.guid){
					return mf_mgr(rt[0]);
				}
				else if(array_enabled){
					return rt;
				}
				else if((property = row[f]) instanceof DataObj){
					return property._manager;
				}
				else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
					for(var i in rt){
						mgr = rt[i];
						if(mgr.get(property, false, true))
							return mgr;
					}
				}
			}
		}
	};

	/**
	 * ### Возвращает имя типа элемента управления для типа поля
	 * @method control_by_type
	 * @param type
	 * @return {*}
	 */
	_md.control_by_type = function (type, val) {
		var ft;

		if(typeof val == "boolean" && type.types.indexOf("boolean") != -1){
			ft = "ch";

		} else if(typeof val == "number" && type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(val instanceof Date && type.date_part){
			ft = "dhxCalendar";

		} else if(type.is_ref){
			ft = "ocombo";

		} else if(type.date_part) {
			ft = "dhxCalendar";

		} else if(type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(type.types[0]=="boolean") {
			ft = "ch";

		} else if(type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
			ft = "txt";

		} else {
			ft = "ed";

		}
		return ft;
	};

	/**
	 * ### Возвращает структуру для инициализации таблицы на форме
	 * @method ts_captions
	 * @param class_name
	 * @param ts_name
	 * @param source
	 * @return {boolean}
	 */
	_md.ts_captions = function (class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = _md.get(class_name).tabular_sections[ts_name],
			mfrm = _md.get(class_name).form,
			fields = mts.fields, mf;

		// если имеются метаданные формы, используем их
		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			source._mixin(mfrm.obj.tabular_sections[ts_name]);

		}else{

			if(ts_name==="contact_information")
				fields = {type: "", kind: "", presentation: ""};

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for(var f in fields){
				mf = mts.fields[f];
				if(!mf.hide){
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + _md.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	};

	/**
	 * ### Возвращает англоязычный синоним строки
	 * @method syns_js
	 * @param v {String}
	 * @return {String}
	 */
	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: '_deleted',
			Description: 'name',
			DataVersion: 'data_version',    // todo: не сохранять это поле в pouchdb
			IsFolder: 'is_folder',
			Number: 'number_doc',
			Date: 'date',
			Дата: 'date',
			Posted: 'posted',
			Code: 'id',
			Parent_Key: 'parent',
			Owner_Key: 'owner',
			Owner:     'owner',
			Ref_Key: 'ref',
			Ссылка: 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
	};

	/**
	 * ### Возвращает русскоязычный синоним строки
	 * @method syns_1с
	 * @param v {String}
	 * @return {String}
	 */
	_md.syns_1с = function (v) {
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
		if(syn1c[v])
			return syn1c[v];
		return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
	};

	/**
	 * ### Возвращает список доступных печатных форм
	 * @method printing_plates
	 * @return {Object}
	 */
	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				_m.doc[i].printing_plates = pp.doc[i];

	};

	/**
	 * ### Возвращает имя класса по полному имени объекта метаданных 1С
	 * @method class_name_from_1c
	 * @param name
	 */
	_md.class_name_from_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "enm." + name;
		else if(pn[0] == "Перечисление")
			name = "enm.";
		else if(pn[0] == "Справочник")
			name = "cat.";
		else if(pn[0] == "Документ")
			name = "doc.";
		else if(pn[0] == "РегистрСведений")
			name = "ireg.";
		else if(pn[0] == "РегистрНакопления")
			name = "areg.";
		else if(pn[0] == "РегистрБухгалтерии")
			name = "accreg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";
		else if(pn[0] == "Обработка")
			name = "dp.";
		else if(pn[0] == "Отчет")
			name = "rep.";

		return name + _md.syns_js(pn[1]);

	};

	/**
	 * ### Возвращает полное именя объекта метаданных 1С по имени класса metadata
	 * @method class_name_to_1c
	 * @param name
	 */
	_md.class_name_to_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "Перечисление." + name;
		else if(pn[0] == "enm")
			name = "Перечисление.";
		else if(pn[0] == "cat")
			name = "Справочник.";
		else if(pn[0] == "doc")
			name = "Документ.";
		else if(pn[0] == "ireg")
			name = "РегистрСведений.";
		else if(pn[0] == "areg")
			name = "РегистрНакопления.";
		else if(pn[0] == "accreg")
			name = "РегистрБухгалтерии.";
		else if(pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if(pn[0] == "cacc")
			name = "ПланСчетов.";
		else if(pn[0] == "dp")
			name = "Обработка.";
		else if(pn[0] == "rep")
			name = "Отчет.";

		return name + _md.syns_1с(pn[1]);

	};


	/**
	 * ### Создаёт строку SQL с командами создания таблиц для всех объектов метаданных
	 * @method create_tables
	 */
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md; ";

		function on_table_created(){

			cstep--;
			if(cstep==0){
				if(callback)
					callback(create);
				else
					alasql.utils.saveFile("create_tables.sql", create);
			} else
				iteration();
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + "; ";
			on_table_created();
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер
		"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
			for(class_name in managers[mgr])
				data_names.push({"class": $p[mgr], "name": managers[mgr][class_name]});
		});
		cstep = data_names.length;

		iteration();

	};


}
