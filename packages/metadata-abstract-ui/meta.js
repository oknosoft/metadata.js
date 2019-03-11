/*!
 metadata-abstract-ui v2.0.18-beta.4, built:2019-03-07
 © 2014-2019 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

var meta = {
  proto(constructor) {
    const {Meta} = constructor.classes;
    Meta._sys.push({
      enm: {
        sort_directions: [
          {
            order: 0,
            name: 'asc',
            synonym: 'По возрастанию',
            'default': true,
          },
          {
            order: 1,
            name: 'desc',
            synonym: 'По убыванию'
          }
        ],
        comparison_types: [
          {
            order: 0,
            name: 'gt',
            synonym: 'Больше'
          },
          {
            order: 1,
            name: 'gte',
            synonym: 'Больше или равно'
          },
          {
            order: 2,
            name: 'lt',
            synonym: 'Меньше'
          },
          {
            order: 3,
            name: 'lte',
            synonym: 'Меньше или равно '
          },
          {
            order: 4,
            name: 'eq',
            synonym: 'Равно',
            'default': true,
          },
          {
            order: 5,
            name: 'ne',
            synonym: 'Не равно'
          },
          {
            'order': 6,
            'name': 'in',
            'synonym': 'В списке'
          },
          {
            order: 7,
            name: 'nin',
            synonym: 'Не в списке'
          },
          {
            order: 8,
            name: 'lke',
            synonym: 'Содержит '
          },
          {
            order: 9,
            name: 'nlk',
            synonym: 'Не содержит'
          },
          {
            order: 10,
            name: 'filled',
            synonym: 'Заполнено '
          },
          {
            order: 11,
            name: 'nfilled',
            synonym: 'Не заполнено'
          }
        ],
        label_positions: [
          {
            order: 0,
            name: 'inherit',
            synonym: 'Наследовать',
            'default': true,
          },
          {
            order: 1,
            name: 'hide',
            synonym: 'Скрыть'
          },
          {
            order: 2,
            name: 'left',
            synonym: 'Лево'
          },
          {
            order: 3,
            name: 'right',
            synonym: 'Право'
          },
          {
            order: 4,
            name: 'top',
            synonym: 'Верх'
          },
          {
            order: 5,
            name: 'bottom',
            synonym: 'Низ'
          },
        ],
        data_field_kinds: [
          {
            order: 0,
            name: 'field',
            synonym: 'Поле ввода',
            'default': true,
          },
          {
            order: 1,
            name: 'input',
            synonym: 'Простой текст'
          },
          {
            order: 2,
            name: 'text',
            synonym: 'Многострочный текст'
          },
          {
            order: 3,
            name: 'label',
            synonym: 'Надпись'
          },
          {
            order: 4,
            name: 'link',
            synonym: 'Гиперссылка'
          },
          {
            order: 5,
            name: 'cascader',
            synonym: 'Каскадер'
          },
          {
            order: 6,
            name: 'toggle',
            synonym: 'Переключатель'
          },
          {
            order: 7,
            name: 'image',
            synonym: 'Картинка'
          },
          {
            order: 8,
            name: 'type',
            synonym: 'Тип значения'
          },
          {
            order: 9,
            name: 'path',
            synonym: 'Путь к данным'
          },
          {
            order: 10,
            name: 'typed_field',
            synonym: 'Поле связи по типу'
          },
          {
            order: 11,
            name: 'props',
            synonym: 'Свойства объекта'
          },
          {
            order: 12,
            name: 'star',
            synonym: 'Пометка'
          },
        ],
        standard_period: [
          {
            order: 0,
            name: 'custom',
            synonym: 'Произвольный',
            'default': true,
          },
          {
            order: 1,
            name: 'yesterday',
            synonym: 'Вчера'
          },
          {
            order: 2,
            name: 'today',
            synonym: 'Сегодня'
          },
          {
            order: 3,
            name: 'tomorrow',
            synonym: 'Завтра'
          },
          {
            order: 4,
            name: 'last7days',
            synonym: 'Последние 7 дней'
          },
          {
            order: 5,
            name: 'last30days',
            synonym: 'Последние 30 дней'
          },
          {
            order: 6,
            name: 'last3Month',
            synonym: 'Последние 3 месяца'
          },
          {
            order: 7,
            name: 'lastWeek',
            synonym: 'Прошлая неделя'
          },
          {
            order: 8,
            name: 'lastTendays',
            synonym: 'Прошлая декада'
          },
          {
            order: 9,
            name: 'lastMonth',
            synonym: 'Прошлый месяц'
          },
          {
            order: 10,
            name: 'lastQuarter',
            synonym: 'Прошлый квартал'
          },
          {
            order: 11,
            name: 'lastHalfYear',
            synonym: 'Прошлое полугодие'
          },
          {
            order: 12,
            name: 'lastYear',
            synonym: 'Прошлый год'
          },
          {
            order: 13,
            name: 'next7Days',
            synonym: 'Следующие 7 дней'
          },
          {
            order: 14,
            name: 'nextTendays',
            synonym: 'Следующая декада'
          },
          {
            order: 15,
            name: 'nextWeek',
            synonym: 'Следующая неделя'
          },
          {
            order: 16,
            name: 'nextMonth',
            synonym: 'Следующий месяц'
          },
          {
            order: 17,
            name: 'nextQuarter',
            synonym: 'Следующий квартал'
          },
          {
            order: 18,
            name: 'nextHalfYear',
            synonym: 'Следующее полугодие'
          },
          {
            order: 19,
            name: 'nextYear',
            synonym: 'Следующий год'
          },
          {
            order: 20,
            name: 'tillEndOfThisYear',
            synonym: 'До конца этого года'
          },
          {
            order: 21,
            name: 'tillEndOfThisQuarter',
            synonym: 'До конца этого квартала'
          },
          {
            order: 22,
            name: 'tillEndOfThisMonth',
            synonym: 'До конца этого месяца'
          },
          {
            order: 23,
            name: 'tillEndOfThisHalfYear',
            synonym: 'До конца этого полугодия'
          },
          {
            order: 24,
            name: 'tillEndOfThistendays',
            synonym: 'До конца этой декады'
          },
          {
            order: 25,
            name: 'tillEndOfThisweek',
            synonym: 'До конца этой недели'
          },
          {
            order: 26,
            name: 'fromBeginningOfThisYear',
            synonym: 'С начала этого года'
          },
          {
            order: 27,
            name: 'fromBeginningOfThisQuarter',
            synonym: 'С начала этого квартала'
          },
          {
            order: 28,
            name: 'fromBeginningOfThisMonth',
            synonym: 'С начала этого месяца'
          },
          {
            order: 29,
            name: 'fromBeginningOfThisHalfYear',
            synonym: 'С начала этого полугодия'
          },
          {
            order: 30,
            name: 'fromBeginningOfThisTendays',
            synonym: 'С начала этой декады'
          },
          {
            order: 31,
            name: 'fromBeginningOfThisWeek',
            synonym: 'С начала этой недели'
          },
          {
            order: 32,
            name: 'thisTenDays',
            synonym: 'Эта декада'
          },
          {
            order: 33,
            name: 'thisWeek',
            synonym: 'Эта неделя'
          },
          {
            order: 34,
            name: 'thisHalfYear',
            synonym: 'Это полугодие'
          },
          {
            order: 35,
            name: 'thisYear',
            synonym: 'Этот год'
          },
          {
            order: 36,
            name: 'thisQuarter',
            synonym: 'Этот квартал'
          },
          {
            order: 37,
            name: 'thisMonth',
            synonym: 'Этот месяц'
          },
        ],
        quick_access: [
          {
            order: 0,
            name: 'none',
            synonym: 'Нет',
            'default': true,
          },
          {
            order: 1,
            name: 'toolbar',
            synonym: 'Панель инструментов'
          },
          {
            order: 2,
            name: 'drawer',
            synonym: 'Панель формы'
          },
        ],
        report_output: [
          {
            order: 0,
            name: 'grid',
            synonym: 'Таблица',
            'default': true
          },
          {
            order: 1,
            name: 'chart',
            synonym: 'Диаграмма'
          },
          {
            order: 2,
            name: 'pivot',
            synonym: 'Cводная таблица'
          },
          {
            order: 3,
            name: 'html',
            synonym: 'Документ HTML'
          },
        ],
      },
      cat: {
        meta_objs: {
          fields: {}
        },
        meta_fields: {
          fields: {}
        },
        scheme_settings: {
          name: 'scheme_settings',
          synonym: 'Настройки отчетов и списков',
          input_by_string: [
            'name'
          ],
          hierarchical: false,
          has_owners: false,
          group_hierarchy: true,
          main_presentation_name: true,
          code_length: 0,
          fields: {
            obj: {
              synonym: 'Объект',
              tooltip: 'Имя класса метаданных',
              type: {
                types: ['string'],
                str_len: 250
              }
            },
            user: {
              synonym: 'Пользователь',
              tooltip: 'Если пусто - публичная настройка',
              type: {
                types: ['string'],
                str_len: 50
              }
            },
            order: {
              synonym: 'Порядок',
              tooltip: 'Порядок варианта',
              type: {
                types: ['number'],
                digits: 6,
                fraction_figits: 0,
              }
            },
            query: {
              synonym: 'Запрос',
              tooltip: 'Индекс CouchDB или текст SQL',
              type: {
                types: ['string'],
                str_len: 0
              }
            },
            date_from: {
              synonym: 'Начало периода',
              tooltip: '',
              type: {
                types: ['date'],
                date_part: 'date'
              }
            },
            date_till: {
              synonym: 'Конец периода',
              tooltip: '',
              type: {
                types: ['date'],
                date_part: 'date'
              }
            },
            standard_period: {
              synonym: 'Стандартный период',
              tooltip: 'Использование стандартного периода',
              type: {
                types: ['enm.standard_period'],
                is_ref: true
              }
            },
            formula: {
              synonym: 'Формула',
              tooltip: 'Формула инициализации',
              type: {
                types: ['cat.formulas'],
                is_ref: true
              }
            },
            output: {
              synonym: 'Вывод',
              tooltip: 'Вывод результата',
              type: {
                types: ['enm.report_output'],
                is_ref: true
              }
            },
            tag: {
              synonym: 'Дополнительные свойства',
              type: {
                types: ['string'],
                str_len: 0
              }
            }
          },
          tabular_sections: {
            fields: {
              name: 'fields',
              synonym: 'Доступные поля',
              tooltip: 'Состав, порядок и ширина колонок',
              fields: {
                parent: {
                  synonym: 'Родитель',
                  tooltip: 'Для плоского списка, родитель пустой',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                field: {
                  synonym: 'Поле',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                width: {
                  synonym: 'Ширина',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 6
                  }
                },
                caption: {
                  synonym: 'Заголовок',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                tooltip: {
                  synonym: 'Подсказка',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                ctrl_type: {
                  synonym: 'Тип',
                  tooltip: 'Тип элемента управления',
                  type: {
                    types: ['enm.data_field_kinds'],
                    is_ref: true
                  }
                },
                formatter: {
                  synonym: 'Формат',
                  tooltip: 'Функция форматирования',
                  type: {
                    types: ['cat.formulas'],
                    is_ref: true
                  }
                },
                editor: {
                  synonym: 'Редактор',
                  tooltip: 'Компонент редактирования',
                  type: {
                    types: ['cat.formulas'],
                    is_ref: true
                  }
                }
              }
            },
            sorting: {
              name: 'sorting',
              synonym: 'Поля сортировки',
              tooltip: '',
              fields: {
                parent: {
                  synonym: 'Родитель',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                field: {
                  synonym: 'Поле',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                direction: {
                  synonym: 'Направление',
                  tooltip: '',
                  type: {
                    types: ['enm.sort_directions'],
                    is_ref: true
                  }
                }
              }
            },
            dimensions: {
              name: 'dimensions',
              synonym: 'Поля группировки',
              tooltip: '',
              fields: {
                parent: {
                  synonym: 'Родитель',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                field: {
                  synonym: 'Поле',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                }
              }
            },
            resources: {
              name: 'resources',
              synonym: 'Ресурсы',
              tooltip: '',
              fields: {
                parent: {
                  synonym: 'Родитель',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                field: {
                  synonym: 'Поле',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                formula: {
                  synonym: 'Формула',
                  tooltip: 'По умолчанию - сумма',
                  type: {
                    types: ['cat.formulas'],
                    is_ref: true
                  }
                }
              }
            },
            selection: {
              name: 'selection',
              synonym: 'Отбор',
              tooltip: '',
              fields: {
                parent: {
                  synonym: 'Родитель',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                left_value: {
                  synonym: 'Левое значение',
                  tooltip: 'Путь к данным',
                  type: {
                    types: ['string'],
                    str_len: 255
                  }
                },
                left_value_type: {
                  synonym: 'Тип слева',
                  tooltip: 'Тип значения слева',
                  default: 'path',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                comparison_type: {
                  synonym: 'Вид сравнения',
                  tooltip: '',
                  type: {
                    types: ['enm.comparison_types'],
                    is_ref: true
                  }
                },
                right_value: {
                  synonym: 'Правое значение',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                right_value_type: {
                  synonym: 'Тип справа',
                  tooltip: 'Тип значения справа',
                  default: 'path',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
              }
            },
            params: {
              name: 'params',
              synonym: 'Параметры',
              tooltip: '',
              fields: {
                param: {
                  synonym: 'Параметр',
                  tooltip: '',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                value_type: {
                  synonym: 'Тип',
                  tooltip: 'Тип значения',
                  type: {
                    types: ['string'],
                    str_len: 100
                  }
                },
                value: {
                  synonym: 'Значение',
                  tooltip: 'Может иметь примитивный или ссылочный тип или массив',
                  type: {
                    types: [
                      'string',
                      'number',
                    ],
                    str_len: 0,
                    digits: 15,
                    fraction_figits: 3,
                    date_part: 'date'
                  }
                },
                quick_access: {
                  synonym: 'Быстрый доступ',
                  tooltip: 'Размещать на нанели инструментов',
                  type: {
                    types: ['boolean']
                  }
                }
              }
            },
            composition: {
              name: 'composition',
              synonym: 'Структура',
              tooltip: '',
              fields: {
                parent: {
                  'synonym': 'Родитель',
                  'multiline_mode': false,
                  'tooltip': '',
                  'type': {
                    'types': ['string'],
                    'str_len': 10
                  }
                },
                use: {
                  synonym: 'Использование',
                  tooltip: '',
                  type: {
                    types: ['boolean']
                  }
                },
                field: {
                  'synonym': 'Элемент',
                  'tooltip': 'Элемент структуры отчета',
                  'type': {
                    'types': ['string'],
                    'str_len': 50
                  }
                },
                kind: {
                  'synonym': 'Вид раздела отчета',
                  'tooltip': 'список, таблица, группировка строк, группировка колонок',
                  'type': {
                    'types': ['string'],
                    'str_len': 50
                  }
                },
                definition: {
                  'synonym': 'Описание',
                  'tooltip': 'Описание раздела структуры',
                  'type': {
                    'types': ['string'],
                    'str_len': 50
                  }
                }
              }
            },
            conditional_appearance: {
              name: 'conditional_appearance',
              synonym: 'Условное оформление',
              tooltip: '',
              fields: {}
            }
          },
          cachable: 'doc'
        }
      },
      dp: {
        scheme_settings: {
          name: 'scheme_settings',
          synonym: 'Варианты настроек',
          fields: {
            scheme: {
              synonym: 'Текущая настройка',
              tooltip: 'Текущий вариант настроек',
              mandatory: true,
              type: {
                types: ['cat.scheme_settings'],
                is_ref: true
              }
            }
          }
        }
      }
    });
  }
};

module.exports = meta;
//# sourceMappingURL=meta.js.map
