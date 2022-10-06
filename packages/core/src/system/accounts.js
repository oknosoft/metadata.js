// метаданные и класс справочника Учётные записи (логины)

export const meta = {
  cat: {
    accounts: {
      name: "ИнтеграцияПользователи",
      splitted: false,
      synonym: "Пользователи сервиса",
      illustration: "",
      objPresentation: "Пользователь сервиса",
      listPresentation: "",
      inputBy: [],
      hierarchical: false,
      hasOwners: true,
      groupHierarchy: true,
      mainPresentation: "name",
      codeLength: 0,
      id: "a",
      fields: {
        prefix: {
          synonym: "Префикс нумерации",
          multiline: false,
          tooltip: "Префикс номеров документов текущего пользователя",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 2
          }
        },
        branch: {
          synonym: "Отдел",
          tooltip: "",
          choice: "elm",
          type: {
            types: [
              "cat.branches"
            ]
          }
        },
        suffix: {
          synonym: "Суффикс CouchDB",
          multiline: false,
          tooltip: "Для разделения данных в CouchDB",
          mandatory: true,
          type: {
            types: [
              "string"
            ],
            strLen: 4
          }
        },
        roles: {
          synonym: "Роли Couchdb",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "string"
            ],
            strLen: 1000
          }
        },
        pushOnly: {
          synonym: "Только push",
          tooltip: "Для пользователя установлен режим push-only (изменения мигрируют в одну сторону - от пользователя на сервер)",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        subscription: {
          synonym: "Подписан",
          tooltip: "Подписан на рассылку и прочие услуги сервиса",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        ips: {
          synonym: "IP-адреса входа",
          multiline: true,
          tooltip: "Список ip-адресов с маской через запятую, с которых разрешена авторизация\n192.168.9.0/24, 192.168.21.*",
          type: {
            types: [
              "string"
            ],
            strLen: 0
          }
        },
        direct: {
          synonym: "Direct",
          tooltip: "Для пользователя запрещен режим offline",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        owner: {
          synonym: "Пользователь 1С",
          tooltip: "Ссылка на стандартного пользователя",
          type: {
            types: [
              "cat.users"
            ]
          }
        }
      },
      tabulars: {
        aclObjs: {
          name: "ОбъектыДоступа",
          synonym: "Объекты доступа",
          tooltip: "",
          fields: {
            obj: {
              synonym: "Объект доступа",
              tooltip: "",
              type: {
                types: [
                  "cat.individuals",
                  "cat.partners",
                  "cat.organizations",
                  "cat.users"
                ]
              }
            },
            type: {
              synonym: "Тип",
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 50
              }
            },
            byDefault: {
              synonym: "По умолчанию",
              tooltip: "",
              type: {
                types: [
                  "boolean"
                ]
              }
            }
          }
        },
        subscribers: {
          name: "Абоненты",
          synonym: "Абоненты",
          tooltip: "",
          fields: {
            abonent: {
              synonym: "Абонент",
              tooltip: "",
              choice: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.abonents"
                ]
              }
            },
            branch: {
              synonym: "Отдел",
              tooltip: "",
              choiceLinks: [
                {
                  name: [
                    "selection",
                    "owner"
                  ],
                  path: [
                    "subscribers",
                    "abonent"
                  ]
                }
              ],
              choice: "elm",
              type: {
                types: [
                  "cat.branches"
                ]
              }
            },
            roles: {
              synonym: "Роли Couchdb",
              multiline: true,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 1000
              }
            }
          }
        },
        ids: {
          name: "Идентификаторы",
          synonym: "Идентификаторы авторизации",
          tooltip: "",
          fields: {
            identifier: {
              synonym: "Идентификатор",
              multiline: false,
              tooltip: "",
              mandatory: true,
              type: {
                types: [
                  "string"
                ],
                strLen: 255
              }
            },
            server: {
              synonym: "Сервер",
              tooltip: "",
              choice: "elm",
              mandatory: true,
              type: {
                types: [
                  "cat.servers"
                ]
              }
            },
            passwordHash: {
              synonym: "Хеш пароля",
              multiline_mode: false,
              tooltip: "",
              type: {
                types: [
                  "string"
                ],
                strLen: 1000
              }
            }
          }
        }
      },
      cachable: "ram"
    }
  },
};

export default function ({classes}) {

};
