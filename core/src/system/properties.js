
export const meta = {
  cch: {
    properties: {
      name: "ДополнительныеРеквизитыИСведения",
      synonym: "Дополнительные реквизиты и сведения",
      illustration: "",
      objPresentation: "Дополнительный реквизит / сведение",
      listPresentation: "",
      inputBy: ["name"],
      hierarchical: false,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 0,
      id: "pr",
      fields: {
        shown: {
          synonym: "Виден",
          multiline: false,
          tooltip: "Настройка видимости дополнительного реквизита",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        sorting_field: {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания (служебный)",
          type: {
            "types": [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        extra_values_owner: {
          synonym: "Владелец дополнительных значений",
          multiline: false,
          tooltip: "Свойство-образец, с которым у этого свойства одинаковый список дополнительных значений",
          choiceGrp: "elm",
          type: {
            "types": [
              "cch.properties"
            ]
          }
        },
        available: {
          synonym: "Доступен",
          multiline: false,
          tooltip: "Настройка доступности дополнительного реквизита",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        mandatory: {
          synonym: "Заполнять обязательно",
          multiline: false,
          tooltip: "Настройка проверки заполненности дополнительного реквизита",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        include_to_name: {
          synonym: "Включать в наименование",
          multiline: false,
          tooltip: "Добавлять значение параметра в наименование продукции",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        list: {
          synonym: "Список",
          multiline: false,
          tooltip: "Реквизит подсистемы интеграции metadata.js - реализует функциональность списка опций",
          type: {
            "types": [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        caption: {
          synonym: "Наименование",
          multiline: false,
          tooltip: "Краткое представление свойства, которое\nвыводится в формах редактирования его значения",
          mandatory: true,
          type: {
            "types": [
              "string"
            ],
            strLen: 75
          }
        },
        note: {
          synonym: "Комментарий",
          multiline: false,
          tooltip: "Поясняет назначение свойства",
          type: {
            "types": [
              "string"
            ],
            strLen: 0
          }
        },
        destination: {
          synonym: "Набор свойств",
          multiline: false,
          tooltip: "Набор свойств, которому принадлежит уникальное свойство. Если не задан, значит свойство общее.",
          choiceGrp: "elm",
          type: {
            "types": [
              "cat.destinations"
            ]
          }
        },
        tooltip: {
          synonym: "Подсказка",
          multiline: false,
          tooltip: "Показывается пользователю при редактировании свойства в форме объекта",
          type: {
            "types": [
              "string"
            ],
            strLen: 0
          }
        },
        is_extra_property: {
          synonym: "Это дополнительное сведение",
          multiline: false,
          tooltip: "Свойство является дополнительным сведением, а не дополнительным реквизитом",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        include_to_description: {
          synonym: "Включать в описание",
          multiline: false,
          tooltip: "Добавлять имя и значение параметра в строку описания продукции",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        calculated: {
          synonym: "Вычисляемый",
          multiline: false,
          tooltip: "Если параметр вычисляемый, здесь указываем формулу",
          choiceGrp: "elm",
          type: {
            "types": [
              "cat.formulas"
            ]
          }
        },
        showcalc: {
          synonym: "Показывать вычисляемый",
          multiline: false,
          tooltip: "Показывать параметр в списках свойств объекта ",
          type: {
            "types": [
              "boolean"
            ]
          }
        },
        inheritance: {
          synonym: "Наследование",
          multiline: false,
          tooltip: "Правило уточнения значений свойства\n0 - Обычный параметр\n1 - Переопределять для элемента\n2 - Только для элемента\n3 - Переопределять для отдела абонента\n4 - Умолчание для отдела\n6 - Значение из шаблона",
          type: {
            "types": [
              "number"
            ],
            "digits": 6,
            "fraction": 0
          }
        },
        captured: {
          synonym: "Захвачен",
          multiline: false,
          tooltip: "Реквизит подсистемы MDM. Указывает, что объект в настоящий момент, захвачен для редактирования",
          choiceGrp: "elm",
          type: {
            "types": [
              "boolean",
              "string"
            ],
            strLen: 50
          }
        },
        editor: {
          synonym: "Редактор",
          multiline: false,
          tooltip: "Реквизит подсистемы MDM, указывает на {@link CatUsers|Пользователя}, захватившего объект для редактирования",
          choiceGrp: "elm",
          type: {
            "types": [
              "cat.users"
            ]
          }
        },
        predefined_name: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            "types": [
              "string"
            ],
            strLen: 256
          }
        },
        type: {
          synonym: "",
          multiline: false,
          tooltip: "Типы значения, которое можно ввести при заполнении свойства.",
          mandatory: true,
          type: {
            types: [
              "cat.abonents",
              "cat.accounts",
              "cat.branches",
              "cat.users",
              "cat.values_options",
              "cat.property_values_hierarchy",
              "cat.formulas",
              "cat.property_values",
              "cat.parameters_keys",
              "cch.properties",
              "boolean",
              "string",
              "date",
              "number"
            ],
            "strLen": 1024,
            "datePart": "date_time",
            "digits": 15,
            "fraction": 3
          }
        }
      },
      tabulars: {
        hide: {
          name: "Скрыть",
          synonym: "Скрываемые значения",
          tooltip: "Для печатных форм. Значения, перечисленные в данной табчасти, могут быть скрыты",
          fields: {
            value: {
              synonym: "Скрывать значения",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  "name": [
                    "selection",
                    "owner"
                  ],
                  "path": [
                    "ref"
                  ]
                }
              ],
              choiceGrp: "elm",
              choiceType: {
                "path": [
                  "type"
                ],
                "elm": 0
              },
              type: {
                "types": [
                  "cat.abonents",
                  "cat.accounts",
                  "cat.branches",
                  "cat.users",
                  "cat.values_options",
                  "cat.property_values_hierarchy",
                  "cat.formulas",
                  "cat.property_values",
                  "cat.parameters_keys",
                  "cch.properties",
                  "boolean",
                  "string",
                  "date",
                  "number"
                ],
                "strLen": 1024,
                "datePart": "date_time",
                "digits": 15,
                "fraction": 3
              }
            }
          }
        }
      },
      cachable: "ram"
    }
  }
};

export default function propertiesClasses({cat, classes, symbols}, exclude) {

  const {CchObj, ChartOfCharacteristicManager, TabularSectionRow} = classes;
  const {get, set} = symbols;

  /**
   * @summary Свойства объектов
   * @desc План видов характеристик _Свойства объектов_ позволяет задать
   * дополнительные реквизиты документов и справочников со стороны приложения
   */
  class CchProperties extends CchObj {
    get shown(){return this[get]('shown')}
    set shown(v){this[set]('shown',v)}
    get sorting_field(){return this[get]('sorting_field')}
    set sorting_field(v){this[set]('sorting_field',v)}
    get extra_values_owner(){return this[get]('extra_values_owner')}
    set extra_values_owner(v){this[set]('extra_values_owner',v)}
    get available(){return this[get]('available')}
    set available(v){this[set]('available',v)}
    get mandatory(){return this[get]('mandatory')}
    set mandatory(v){this[set]('mandatory',v)}
    get include_to_name(){return this[get]('include_to_name')}
    set include_to_name(v){this[set]('include_to_name',v)}
    get list(){return this[get]('list')}
    set list(v){this[set]('list',v)}
    get caption(){return this[get]('caption')}
    set caption(v){this[set]('caption',v)}
    get note(){return this[get]('note')}
    set note(v){this[set]('note',v)}
    get destination(){return this[get]('destination')}
    set destination(v){this[set]('destination',v)}
    get tooltip(){return this[get]('tooltip')}
    set tooltip(v){this[set]('tooltip',v)}
    get is_extra_property(){return this[get]('is_extra_property')}
    set is_extra_property(v){this[set]('is_extra_property',v)}
    get include_to_description(){return this[get]('include_to_description')}
    set include_to_description(v){this[set]('include_to_description',v)}
    get calculated(){return this[get]('calculated')}
    set calculated(v){this[set]('calculated',v)}
    get showcalc(){return this[get]('showcalc')}
    set showcalc(v){this[set]('showcalc',v)}
    get inheritance(){return this[get]('inheritance')}
    set inheritance(v){this[set]('inheritance',v)}
    get captured(){return this[get]('captured')}
    set captured(v){this[set]('captured',v)}
    get editor(){return this[get]('editor')}
    set editor(v){this[set]('editor',v)}
    get predefined_name(){return this[get]('predefined_name')}
    set predefined_name(v){this[set]('predefined_name',v)}
    get type(){return this[get]('type')}
    set type(v){this[set]('type',v)}
    get applying(){return this[get]('applying')}
    set applying(v){this[get]('applying').load(v)}
    get use(){return this[get]('use')}
    set use(v){this[get]('use').load(v)}
    get hide(){return this[get]('hide')}
    set hide(v){this[get]('hide').load(v)}

    get isCalculated() {
      return !this.calculated.empty();
    }

    calculatedValue(obj) {
      return this.calculated.execute(obj);
    }
  }
  classes.CchProperties = CchProperties;

  class CchPropertiesHideRow extends TabularSectionRow {
    get value(){return this[get]('value')}
    set value(v){this[set]('value',v)}
  }
  classes.CchPropertiesHideRow = CchPropertiesHideRow;

  class CchPropertiesApplyingRow extends TabularSectionRow {
    get elm_type(){return this[get]('elm_type')}
    set elm_type(v){this[set]('elm_type',v)}
    get pos(){return this[get]('pos')}
    set pos(v){this[set]('pos',v)}
  }
  classes.CchPropertiesApplyingRow = CchPropertiesApplyingRow;

  class CchPropertiesUseRow extends TabularSectionRow{
    get count_calc_method(){return this[get]('count_calc_method')}
    set count_calc_method(v){this[set]('count_calc_method',v)}
  }
  classes.CchPropertiesUseRow = CchPropertiesUseRow;

  class CchPropertiesManager extends ChartOfCharacteristicManager {

  }
  classes.CchPropertiesManager = CchPropertiesManager;

  exclude.push('cch.properties');

};
