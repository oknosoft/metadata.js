
const ss_selection_fields = {
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
  area: {
    synonym: 'Гр. ИЛИ',
    tooltip: 'Позволяет формировать условия ИЛИ',
    type: {
      types: ['number'],
      digits: 6,
      fraction: 0
    }
  },
  left_value: {
    synonym: 'Левое значение',
    tooltip: 'Путь к данным',
    type: {
      types: ['string'],
      str_len: 1024
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
    }
  },
  right_value: {
    synonym: 'Правое значение',
    tooltip: 'Значение или путь',
    type: {
      types: ['string'],
      str_len: 1024
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
};

export const sys_fields = ['zone','id','numberDoc','date','parent'];

export const sys = [{
  enm: {
    accumulation_record_type: [
      {
        order: 0,
        name: 'debit',
        synonym: 'Приход',
      },
      {
        order: 1,
        name: 'credit',
        synonym: 'Расход',
      },
      {
        tag: 'Вид движения регистра накопления',
        description: 'Системное перечисление',
      },
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
        'order': 8,
        'name': 'inh',
        'synonym': 'В группе'
      },
      {
        order: 9,
        name: 'ninh',
        synonym: 'Не в группе'
      },
      {
        order: 10,
        name: 'lke',
        synonym: 'Содержит '
      },
      {
        order: 11,
        name: 'nlk',
        synonym: 'Не содержит'
      },
      {
        order: 12,
        name: 'filled',
        synonym: 'Заполнено '
      },
      {
        order: 13,
        name: 'nfilled',
        synonym: 'Не заполнено'
      },
      {
        tag: 'Виды сравнений',
        description: 'Системное перечисление',
      },
    ],
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
      },
      {
        tag: 'Направление сортировки',
        description: 'Для компоновки',
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
        name: 'last6Month',
        synonym: 'Последние 6 месяцев'
      },
      {
        order: 8,
        name: 'lastWeek',
        synonym: 'Прошлая неделя'
      },
      {
        order: 9,
        name: 'lastTendays',
        synonym: 'Прошлая декада'
      },
      {
        order: 10,
        name: 'lastMonth',
        synonym: 'Прошлый месяц'
      },
      {
        order: 11,
        name: 'lastQuarter',
        synonym: 'Прошлый квартал'
      },
      {
        order: 12,
        name: 'lastHalfYear',
        synonym: 'Прошлое полугодие'
      },
      {
        order: 13,
        name: 'lastYear',
        synonym: 'Прошлый год'
      },
      {
        order: 14,
        name: 'next7Days',
        synonym: 'Следующие 7 дней'
      },
      {
        order: 15,
        name: 'nextTendays',
        synonym: 'Следующая декада'
      },
      {
        order: 16,
        name: 'nextWeek',
        synonym: 'Следующая неделя'
      },
      {
        order: 17,
        name: 'nextMonth',
        synonym: 'Следующий месяц'
      },
      {
        order: 18,
        name: 'nextQuarter',
        synonym: 'Следующий квартал'
      },
      {
        order: 19,
        name: 'nextHalfYear',
        synonym: 'Следующее полугодие'
      },
      {
        order: 20,
        name: 'nextYear',
        synonym: 'Следующий год'
      },
      {
        order: 21,
        name: 'tillEndOfThisYear',
        synonym: 'До конца этого года'
      },
      {
        order: 22,
        name: 'tillEndOfThisQuarter',
        synonym: 'До конца этого квартала'
      },
      {
        order: 23,
        name: 'tillEndOfThisMonth',
        synonym: 'До конца этого месяца'
      },
      {
        order: 24,
        name: 'tillEndOfThisHalfYear',
        synonym: 'До конца этого полугодия'
      },
      {
        order: 25,
        name: 'tillEndOfThistendays',
        synonym: 'До конца этой декады'
      },
      {
        order: 26,
        name: 'tillEndOfThisweek',
        synonym: 'До конца этой недели'
      },
      {
        order: 27,
        name: 'fromBeginningOfThisYear',
        synonym: 'С начала этого года'
      },
      {
        order: 28,
        name: 'fromBeginningOfThisQuarter',
        synonym: 'С начала этого квартала'
      },
      {
        order: 29,
        name: 'fromBeginningOfThisMonth',
        synonym: 'С начала этого месяца'
      },
      {
        order: 30,
        name: 'fromBeginningOfThisHalfYear',
        synonym: 'С начала этого полугодия'
      },
      {
        order: 31,
        name: 'fromBeginningOfThisTendays',
        synonym: 'С начала этой декады'
      },
      {
        order: 32,
        name: 'fromBeginningOfThisWeek',
        synonym: 'С начала этой недели'
      },
      {
        order: 33,
        name: 'thisTenDays',
        synonym: 'Эта декада'
      },
      {
        order: 34,
        name: 'thisWeek',
        synonym: 'Эта неделя'
      },
      {
        order: 35,
        name: 'thisHalfYear',
        synonym: 'Это полугодие'
      },
      {
        order: 36,
        name: 'thisYear',
        synonym: 'Этот год'
      },
      {
        order: 37,
        name: 'thisQuarter',
        synonym: 'Этот квартал'
      },
      {
        order: 38,
        name: 'thisMonth',
        synonym: 'Этот месяц'
      },
      {
        tag: 'Стандартный период',
        description: 'Для компоновки',
      },
    ],
  },
  cat: {
    scheme_settings: {
      name: 'scheme_settings',
      synonym: 'Настройки отчетов и списков',
      input_by_string: ['name'],
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
            fraction: 0,
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
          }
        },
        formula: {
          synonym: 'Формула',
          tooltip: 'Формула инициализации',
          type: {
            types: ['cat.formulas'],
          }
        },
        output: {
          synonym: 'Вывод',
          tooltip: 'Вывод результата',
          type: {
            types: ['enm.report_output'],
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
              }
            },
            formatter: {
              synonym: 'Формат',
              tooltip: 'Функция форматирования',
              type: {
                types: ['cat.formulas'],
              },
              choice_params: [
                {
                  name: 'parent',
                  path: []
                }
              ]
            },
            editor: {
              synonym: 'Редактор',
              tooltip: 'Компонент редактирования',
              type: {
                types: ['cat.formulas'],
              },
              choice_params: [
                {
                  name: 'parent',
                  path: []
                }
              ]
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
              }
            }
          }
        },
        selection: {
          name: 'selection',
          synonym: 'Отбор',
          tooltip: '',
          fields: ss_selection_fields,
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
                  //'date',
                  // "array"
                ],
                str_len: 0,
                digits: 15,
                fraction: 3,
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
          fields: Object.assign({}, ss_selection_fields, {
            columns: {
              synonym: 'Колонки',
              tooltip: 'Список колонок через запятую, к которым будет применено оформление (по умолчанию - ко всей строке)',
              type: {
                types: ['string'],
                str_len: 0
              }
            },
            css: {
              synonym: 'Оформление',
              tooltip: 'В синтаксисе css',
              type: {
                types: ['string'],
                str_len: 0
              }
            },
          }),
        }
      },
      cachable: 'ram',
      id: 'ss',
    },
  },
  ireg: {
    log: {
      name: 'log',
      note: '',
      synonym: 'Журнал событий',
      dimensions: {
        date: {
          synonym: 'Дата',
          tooltip: 'Время события',
          type: {types: ['number'], digits: 15, fraction: 0},
        },
        sequence: {
          synonym: 'Порядок',
          tooltip: 'Порядок следования',
          type: {types: ['number'], digits: 6, fraction: 0},
        },
      },
      resources: {
        'class': {
          synonym: 'Класс',
          tooltip: 'Класс события',
          type: {types: ['string'], str_len: 100},
        },
        note: {
          synonym: 'Комментарий',
          multiline_mode: true,
          tooltip: 'Текст события',
          type: {types: ['string'], str_len: 0},
        },
        obj: {
          synonym: 'Объект',
          multiline_mode: true,
          tooltip: 'Объект, к которому относится событие',
          type: {types: ['string'], str_len: 0},
        },
        user: {
          synonym: 'Пользователь',
          tooltip: 'Пользователь, в сеансе которого произошло событие',
          type: {types: ['string'], str_len: 100},
        },
      },
    },
    log_view: {
      name: 'log_view',
      note: '',
      synonym: 'Просмотр журнала событий',
      dimensions: {
        key: {
          synonym: 'Ключ',
          tooltip: 'Ключ события',
          type: {types: ['string'], str_len: 100},
        },
        user: {
          synonym: 'Пользователь',
          tooltip: 'Пользователь, отметивыший событие, как просмотренное',
          type: {types: ['string'], str_len: 100},
        },
      },
    },
  },
}];