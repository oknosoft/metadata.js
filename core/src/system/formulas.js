
const prmTypes = [
  "cch.properties",
  "cat.property_values",
  "cat.property_values_hierarchy",
  "cat.parameters_keys",
  "cat.formulas",
  "cat.abonents",
  "cat.accounts",
  "cat.branches",
  "cat.users",
  "cat.values_options",
  "boolean",
  "string",
  "date",
  "number"
];

export const meta = {
  cat: {
    formulas: {
      name: "Формулы",
      synonym: "Формулы",
      illustration: "Формулы пользователя, для выполнения при расчете спецификаций, модификаторы, вычисляемые свойства",
      objPresentation: "Формула",
      listPresentation: "",
      inputBy: ["name"],
      hierarchical: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "Fs",
      fields: {
        formula: {
          synonym: "Формула",
          multiline: false,
          tooltip: "Текст функции на языке javascript",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        leading_formula: {
          synonym: "Ведущая формула",
          multiline: false,
          tooltip: "Если указано, выполняется код ведущей формулы с параметрами, заданными для текущей формулы",
          choiceParams: [
            {
              name: "leading_formula",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.formulas"
            ]
          }
        },
        condition_formula: {
          synonym: "Это формула условия",
          multiline: false,
          tooltip: "Формула используется, как фильтр, а не как алгоритм расчета количества.\nЕсли возвращает не Истина, строка в спецификацию не добавляется",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        definition: {
          synonym: "Описание",
          multiline: true,
          tooltip: "Описание в формате html",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        template: {
          synonym: "Шаблон",
          multiline: true,
          tooltip: "html или jsx шаблон отчета",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        sorting_field: {
          synonym: "Порядок",
          multiline: false,
          tooltip: "Используется для упорядочивания (служебный)",
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        async: {
          synonym: "Асинхронный режим",
          multiline: false,
          tooltip: "Создавать асинхронную функцию",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        disabled: {
          synonym: "Отключена",
          multiline: false,
          tooltip: "Имеет смысл только для печатных форм и модификаторов",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        context: {
          synonym: "Контекст",
          multiline: false,
          tooltip: "Выполнять в браузере, node или везде",
          max: 2,
          min: 0,
          type: {
            types: [
              "number"
            ],
            digits: 6,
            fraction: 0
          }
        },
        jsx: {
          synonym: "JSX",
          multiline: false,
          tooltip: "Транспилировать формулу из шаблона jsx",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        captured: {
          synonym: "Захвачен",
          multiline: false,
          tooltip: "Реквизит подсистемы MDM. Указывает, что объект в настоящий момент, захвачен для редактирования",
          choiceGrp: "elm",
          type: {
            types: [
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
            types: [
              "cat.users"
            ]
          }
        },
        predefined_name: {
          synonym: "",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 256
          }
        },
        parent: {
          synonym: "Группа",
          multiline: false,
          tooltip: "Группа формул",
          mandatory: true,
          type: {
            types: [
              "cat.formulas"
            ]
          }
        }
      },
      tabulars: {
        params: {
          name: "Параметры",
          synonym: "Параметры",
          tooltip: "",
          fields: {
            param: {
              synonym: "Параметр",
              multiline: false,
              tooltip: "",
              choiceGrp: "elm",
              type: {
                types: prmTypes,
                strLen: 1024,
                datePart: "date_time",
                digits: 15,
                fraction: 3
              }
            },
            value: {
              synonym: "Значение",
              multiline: false,
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "params",
                    "param"
                  ]
                }
              ],
              type: {
                types: prmTypes,
                strLen: 1024,
                datePart: "date_time",
                digits: 15,
                fraction: 3
              }
            }
          }
        }
      },
      cachable: "ram"
    },
  }
};

export default function formulasClasses({cat, classes, symbols, md, utils}, exclude) {

  md.get('Fs').constructorBase();
  const {CatFormulas: CatObj, CatFormulasManager: CatManager} = classes;
  const {get, set, state, mgr} = symbols;

  /**
   * @summary Менеджер справочника формул
   * @extends CatManager
   */
  class CatFormulasManager extends CatManager {

    loadFormulas(src) {
      const {node, browser} = utils.is;
      const compare = utils.sort('name');
      const parents = [this.predefined('printing_plates'), this.predefined('modifiers')];
      const filtered = [];
      (src || this).forEach((v) => {
        if(!v.disabled && parents.includes(v.parent)){
          if(v.context === 1 && !browser || v.context === 2 && !node) {
            return;
          }
          filtered.push(v);
        }
      });


      filtered.sort(utils.sort('sorting_field')).forEach((formula) => {
        // формируем списки печатных форм и внешних обработок
        if(formula.parent == parents[0]) {
          formula.params.findRows({param: 'destination'}, (dest) => {
            const dmeta = md.get(dest.value);
            if(dmeta) {
              const tmp = dmeta.printing_plates ? Object.values(dmeta.printing_plates) : [];
              tmp.push(formula);
              tmp.sort(compare);
              dmeta.printing_plates = {};
              for(const elm of tmp) {
                dmeta.printing_plates[`prn_${elm.ref}`] = elm;
              }
            }
          });
        }
        else {
          // выполняем модификаторы
          try {
            const res = formula.execute();
            // еслм модификатор вернул задание кроносу - добавляем планировщик
            //res && utils.cron && utils.cron(res);
          }
          catch (err) {
            console.error(err);
          }
        }
      });
    }

  }
  classes.CatFormulasManager = CatFormulasManager;

  /**
   * @summary Формулы
   * @desc Фрагменты кода javascript (функции, модификаторы, печатные формы) которые можно создавать
   * и редактировать со стороны интерфейса. Они исполняются либо на старте приложения,
   * либо при извлечении значения параметра, вызове печатной формы или обработке заполнения объекта
   * @extends CatObj
   */
  class CatFormulas extends CatObj {

    execute(obj, attr) {
      const {root} = this[mgr];
      const st = this[state];
      if(!st._formula) {
        try{
          if(this.jsx) {
            st._formula = new Function('$p', this.formula)(root);
          }
          else {
            if(this.async) {
              const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
              st._formula = (new AsyncFunction('obj,$p,attr', this.formula)).bind(this);
            }
            else {
              st._formula = (new Function('obj,$p,attr', this.formula)).bind(this);
            }
          }
        }
        catch(err){
          st._formula = () => false;
          root.utils.recordLog(err);
        }
      }
      return st._formula(obj, root, attr);
    }

  }
  classes.CatFormulas = CatFormulas;

  exclude.push('cat.formulas');

  md.once('complete_loaded', () => {
    cat.formulas.loadFormulas();
  });
};
