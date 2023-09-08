
export const meta = {
  cat: {
    branches: {
      name: "ИнтеграцияОтделыАбонентов",
      splitted: false,
      synonym: "Отделы абонентов",
      illustration: "",
      objPresentation: "Отдел абонента",
      listPresentation: "",
      inputBy: ["name", "suffix"],
      hierarchical: true,
      hasOwners: true,
      groupHierarchy: false,
      mainPresentation: "name",
      codeLength: 11,
      id: "br",
      fields: {
        suffix: {
          synonym: "Суффикс CouchDB",
          multiline: false,
          "tooltip": "Для разделения данных в CouchDB",
          "mandatory": true,
          "type": {
            "types": [
              "string"
            ],
            "str_len": 4
          }
        },
        lang: {
          synonym: "Язык",
          multiline: false,
          "tooltip": "Язык интерфейса пользователя",
          "type": {
            "types": [
              "string"
            ],
            "str_len": 2,
            "str_fix": true
          }
        },
        server: {
          synonym: "Сервер",
          multiline: false,
          "tooltip": "Если указано, используется этот сервер, а не основной сервер абонента",
          choiceGrp: "elm",
          "type": {
            "types": [
              "cat.servers"
            ]
          }
        },
        back_server: {
          synonym: "Обратный сервер",
          multiline: false,
          "tooltip": "Если указано, этот сервер, для настройки репликации от сервера отдела к родителю",
          choiceGrp: "elm",
          "type": {
            "types": [
              "cat.servers"
            ]
          }
        },
        repl_server: {
          synonym: "Сервер репликатора",
          multiline: false,
          "tooltip": "Если указано, задание репликации будет запущено на этом сервере",
          choiceGrp: "elm",
          "type": {
            "types": [
              "cat.servers"
            ]
          }
        },
        direct: {
          synonym: "Direct",
          multiline: false,
          "tooltip": "Для пользователя запрещен режим offline",
          "type": {
            "types": [
              "boolean"
            ]
          }
        },
        use: {
          synonym: "Используется",
          multiline: false,
          "tooltip": "Использовать данный отдел при создании баз и пользователей",
          "type": {
            "types": [
              "boolean"
            ]
          }
        },
        mode: {
          synonym: "Режим",
          multiline: false,
          "tooltip": "Режим репликации текущего отдела",
          "type": {
            "types": [
              "number"
            ],
            "digits": 1,
            "fraction": 0
          }
        },
        no_mdm: {
          synonym: "NoMDM",
          multiline: false,
          "tooltip": "Отключить MDM для данного отдела (напрмиер, если это dev-база)",
          "type": {
            "types": [
              "boolean"
            ]
          }
        },
        no_partners: {
          synonym: "NoPartners",
          multiline: false,
          "tooltip": "Не использовать фильтр по контрагенту в репликации (только по подразделению)",
          "type": {
            "types": [
              "boolean"
            ]
          }
        },
        no_divisions: {
          synonym: "NoDivisions",
          multiline: false,
          "tooltip": "Не использовать фильтр по подразделению в репликации (только по контрагенту)",
          "type": {
            "types": [
              "boolean"
            ]
          }
        },
        filter: {
          synonym: "Фильтр технологии",
          multiline: false,
          "tooltip": "Если указано, используется индивидуальный образ справочников",
          "choice_params": [
            {
              "name": "area",
              "path": true
            }
          ],
          choiceGrp: "elm",
          "type": {
            "types": [
              "cat.abonents"
            ]
          }
        },
        owner: {
          synonym: "Владелец репликаций",
          multiline: false,
          "tooltip": "Абонент, которому принадлежит отдел",
          "choice_params": [
            {
              "name": "area",
              "path": false
            }
          ],
          "mandatory": true,
          "type": {
            "types": [
              "cat.abonents"
            ]
          }
        },
        parent: {
          synonym: "Ведущий отдел",
          multiline: false,
          "tooltip": "Заполняется в случае иерархической репликации",
          "type": {
            "types": [
              "cat.branches"
            ]
          }
        }
      },
      tabular_sections: {
        organizations: {
          "name": "Организации",
          synonym: "Организации",
          "tooltip": "Организации, у которых дилер может заказывать продукцию и услуги",
          "fields": {
            "acl_obj": {
              synonym: "Объект доступа",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.organizations"
                ]
              }
            },
            "by_default": {
              synonym: "По умолчанию",
              multiline: false,
              "tooltip": "",
              "type": {
                "types": [
                  "boolean"
                ]
              }
            }
          }
        },
        partners: {
          "name": "Контрагенты",
          synonym: "Контрагенты",
          "tooltip": "Юридические лица дилера, от имени которых он оформляет заказы",
          "fields": {
            "acl_obj": {
              synonym: "Объект доступа",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.partners"
                ]
              }
            },
            "by_default": {
              synonym: "По умолчанию",
              multiline: false,
              "tooltip": "",
              "type": {
                "types": [
                  "boolean"
                ]
              }
            }
          }
        },
        divisions: {
          "name": "Подразделения",
          synonym: "Подразделения",
          "tooltip": "Подразделения, к данным которых, дилеру предоставлен доступ",
          "fields": {
            "acl_obj": {
              synonym: "Объект доступа",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.divisions"
                ]
              }
            },
            "by_default": {
              synonym: "По умолчанию",
              multiline: false,
              "tooltip": "",
              "type": {
                "types": [
                  "boolean"
                ]
              }
            }
          }
        },
        price_types: {
          "name": "ТипыЦен",
          synonym: "Типы цен",
          "tooltip": "Типы цен, привязанные к дилеру",
          "fields": {
            "acl_obj": {
              synonym: "Объект доступа",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.nom_prices_types",
                  "cat.branches"
                ]
              }
            }
          }
        },
        keys: {
          "name": "Ключи",
          synonym: "Ключи",
          "tooltip": "Ключи параметров, привязанные к дилеру",
          "fields": {
            "acl_obj": {
              synonym: "Объект доступа",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.parameters_keys"
                ]
              }
            }
          }
        },
        extra_fields: {
          "name": "ДополнительныеРеквизиты",
          synonym: "Дополнительные реквизиты",
          "tooltip": "Дополнительные реквизиты объекта",
          "fields": {
            "property": {
              synonym: "Свойство",
              multiline: false,
              "tooltip": "Дополнительный реквизит",
              choiceGrp: "elm",
              "type": {
                "types": [
                  "cch.properties"
                ]
              }
            },
            "value": {
              synonym: "Значение",
              multiline: false,
              "tooltip": "Значение дополнительного реквизита",
              "choice_links": [
                {
                  "name": [
                    "selection",
                    "owner"
                  ],
                  "path": [
                    "extra_fields",
                    "property"
                  ]
                }
              ],
              choiceGrp: "elm",
              "choice_type": {
                "path": [
                  "extra_fields",
                  "property"
                ],
                "elm": 0
              },
              "type": {
                "types": [
                  "enm.sketch_view",
                  "cat.nom_groups",
                  "enm.coloring",
                  "cat.production_params",
                  "enm.opening",
                  "cat.inserts",
                  "cat.templates",
                  "cat.price_groups",
                  "cat.currencies",
                  "enm.open_directions",
                  "cat.characteristics",
                  "cat.projects",
                  "cat.individuals",
                  "cat.users",
                  "cat.values_options",
                  "cat.delivery_areas",
                  "cat.color_price_groups",
                  "cat.elm_visualization",
                  "cat.property_values_hierarchy",
                  "cat.formulas",
                  "cat.delivery_directions",
                  "cat.property_values",
                  "boolean",
                  "cat.nom_prices_types",
                  "cat.divisions",
                  "enm.elm_types",
                  "enm.align_types",
                  "cat.parameters_keys",
                  "cat.partners",
                  "string",
                  "enm.sz_line_types",
                  "enm.orientations",
                  "cat.organizations",
                  "date",
                  "cat.units",
                  "number",
                  "enm.plan_detailing",
                  "cat.abonents",
                  "cat.work_center_kinds",
                  "enm.positions",
                  "cat.branches",
                  "cat.cashboxes",
                  "enm.open_types",
                  "cat.nom",
                  "cat.cnns",
                  "cat.furns",
                  "enm.vat_rates",
                  "enm.nested_object_editing_mode",
                  "cat.stores",
                  "cch.properties",
                  "cat.clrs"
                ],
                "str_len": 1024,
                "date_part": "date_time",
                "digits": 15,
                "fraction": 3
              }
            },
            "txt_row": {
              synonym: "Текстовая строка",
              multiline: false,
              "tooltip": "Полный текст строкового дополнительного реквизита",
              "type": {
                "types": [
                  "string"
                ],
                "str_len": 0
              }
            }
          }
        },
        servers: {
          "name": "ИнтеграцияСерверы",
          synonym: "Серверы",
          "tooltip": "",
          "fields": {
            "key": {
              synonym: "Год",
              multiline: false,
              "tooltip": "",
              "mandatory": true,
              "type": {
                "types": [
                  "number"
                ],
                "digits": 4,
                "fraction": 0
              }
            },
            "server": {
              synonym: "Сервер",
              multiline: false,
              "tooltip": "",
              choiceGrp: "elm",
              "mandatory": true,
              "type": {
                "types": [
                  "cat.servers"
                ]
              }
            },
            "name": {
              synonym: "Имя базы",
              multiline: false,
              "tooltip": "Указывается, если имя архивной базы отличается от типового",
              "type": {
                "types": [
                  "string"
                ],
                "str_len": 255
              }
            }
          }
        }
      },
      cachable: "ram"
    },
  },
};

export default function ({cat, classes, symbols}, exclude) {

  const {CatObj, CatManager, TabularSectionRow, ExtraFieldsRow} = classes;
  const {get, set} = symbols;

  class CatBranches extends CatObj{
    get suffix(){return this._getter('suffix')}
    set suffix(v){this._setter('suffix',v)}
    get lang(){return this._getter('lang')}
    set lang(v){this._setter('lang',v)}
    get direct(){return this._getter('direct')}
    set direct(v){this._setter('direct',v)}
    get use(){return this._getter('use')}
    set use(v){this._setter('use',v)}
    get no_mdm(){return this._getter('no_mdm')}
    set no_mdm(v){this._setter('no_mdm',v)}
    get no_partners(){return this._getter('no_partners')}
    set no_partners(v){this._setter('no_partners',v)}
    get no_divisions(){return this._getter('no_divisions')}
    set no_divisions(v){this._setter('no_divisions',v)}
    get filter(){return this._getter('filter')}
    set filter(v){this._setter('filter',v)}
    get parent(){return this._getter('parent')}
    set parent(v){this._setter('parent',v)}
    get organizations(){return this._getter_ts('organizations')}
    set organizations(v){this._setter_ts('organizations',v)}
    get partners(){return this._getter_ts('partners')}
    set partners(v){this._setter_ts('partners',v)}
    get divisions(){return this._getter_ts('divisions')}
    set divisions(v){this._setter_ts('divisions',v)}
    get price_types(){return this._getter_ts('price_types')}
    set price_types(v){this._setter_ts('price_types',v)}
    get keys(){return this._getter_ts('keys')}
    set keys(v){this._setter_ts('keys',v)}
    get extra_fields(){return this._getter_ts('extra_fields')}
    set extra_fields(v){this._setter_ts('extra_fields',v)}
  }
  classes.CatBranches = CatBranches;

  class CatBranchesOrganizationsRow extends TabularSectionRow{
    get acl_obj(){return this._getter('acl_obj')}
    set acl_obj(v){this._setter('acl_obj',v)}
    get by_default(){return this._getter('by_default')}
    set by_default(v){this._setter('by_default',v)}
  }
  classes.CatBranchesOrganizationsRow = CatBranchesOrganizationsRow;

  class CatBranchesPartnersRow extends TabularSectionRow{
    get acl_obj(){return this._getter('acl_obj')}
    set acl_obj(v){this._setter('acl_obj',v)}
    get by_default(){return this._getter('by_default')}
    set by_default(v){this._setter('by_default',v)}
  }
  classes.CatBranchesPartnersRow = CatBranchesPartnersRow;

  class CatBranchesDivisionsRow extends TabularSectionRow{
    get acl_obj(){return this._getter('acl_obj')}
    set acl_obj(v){this._setter('acl_obj',v)}
    get by_default(){return this._getter('by_default')}
    set by_default(v){this._setter('by_default',v)}
  }
  classes.CatBranchesDivisionsRow = CatBranchesDivisionsRow;

  class CatBranchesPriceTypesRow extends TabularSectionRow{
    get acl_obj(){return this._getter('acl_obj')}
    set acl_obj(v){this._setter('acl_obj',v)}
  }
  classes.CatBranchesPriceTypesRow = CatBranchesPriceTypesRow;

  class CatBranchesKeysRow extends TabularSectionRow{
    get acl_obj(){return this._getter('acl_obj')}
    set acl_obj(v){this._setter('acl_obj',v)}
  }
  classes.CatBranchesKeysRow = CatBranchesKeysRow;

  class CatBranchesExtraFieldsRow extends ExtraFieldsRow{}
  classes.CatBranchesExtraFieldsRow = CatBranchesExtraFieldsRow;

  class CatBranchesManager extends CatManager {

    constructor (owner, class_name) {
      super(owner, class_name);

      const {adapters: {pouch}, jobPrm, enm, cat, dp} = $p;

      // после загрузки данных, надо настроить отборы в метаданных полей рисовалки
      !jobPrm.isNode && pouch.once('pouch_complete_loaded', () => {
        const {current_user} = $p;

        // если отделы не загружены и полноправный пользователь...
        let next = Promise.resolve();

        if(jobPrm.properties && current_user && !current_user.branch.empty() && jobPrm.builder) {

          const {ПараметрВыбора} = enm.parameters_keys_applying;
          const {furn, sys, client_of_dealer_mode} = jobPrm.properties;

          // накапливаем
          const branch_filter = jobPrm.builder.branch_filter = {furn: [], sys: []};
          next.then(() => current_user.branch.is_new() ? current_user.branch.load() : current_user.branch)
            .then(({keys, divisions}) => {
              const add = ({acl_obj}) => {
                if(acl_obj.applying == ПараметрВыбора) {
                  acl_obj.params.forEach(({property, value}) => {
                    if(property === furn) {
                      !branch_filter.furn.includes(value) && branch_filter.furn.push(value);
                    }
                    else if(property === sys) {
                      !branch_filter.sys.includes(value) && branch_filter.sys.push(value);
                    }
                  });
                }
              };
              keys.forEach(add);
              divisions.forEach(({acl_obj}) => {
                acl_obj.keys.forEach(add);
                acl_obj.extra_fields.find_rows({property: client_of_dealer_mode}, ({value}) => {
                  jobPrm.builder.client_of_dealer_mode = value;
                });
              });
            })
            .then(() => {

              // применяем
              if(branch_filter.furn.length) {
                const mf = cat.characteristics.metadata('constructions').fields.furn;
                mf.choice_params.push({
                  name: 'ref',
                  path: {inh: branch_filter.furn}
                });
              }
              if(branch_filter.sys.length) {
                const mf = dp.buyers_order.metadata().fields.sys;
                mf.choice_params = [{
                  name: 'ref',
                  path: {inh: branch_filter.sys}
                }];
              }

            })
            .catch((err) => null);

        }
      });
    }

  }
  classes.CatBranchesManager = CatBranchesManager;

  if(!exclude.includes('branches')) {
    cat.create('branches');
  }
};
