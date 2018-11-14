/**
 * ### Виртуальная табличная часть
 * внутри строки табличной части
 *
 * @module row_props
 *
 * Created by Evgeniy Malyarov on 09.07.2018.
 */

export default function (classes) {
  const {TabularSection, TabularSectionRow} = classes;

  class RowPropsRow extends TabularSectionRow {

    /**
     * ### Метаданые строки табличной части
     * @property _metadata
     * @for TabularSectionRow
     * @type Number
     */
    _metadata(field_name) {
      const {_metadata} = RowPropsRow;
      return field_name ? _metadata.fields[field_name] : _metadata;
    }

    get use(){return this._getter('use');}
    set use(v){this._setter('use',v);}
    get param(){return this._getter('param');}
    set param(v){this._setter('param',v);}
    get comparison_type(){return this._getter('comparison_type');}
    set comparison_type(v){this._setter('comparison_type',v);}
    get value(){return this._getter('value');}
    set value(v){
      this._setter('value',v);
      if(!this._owner._owner._data._loading) {
        const {value} = this;
        value.is_new && value.is_new() && value.load();
      }
    }

  }
  RowPropsRow._metadata = {
    name: "Свойства",
    synonym: "Свойства",
    tooltip: "Дополнительные свойства",
    fields: {
      use: {
        synonym: 'Использование',
        tooltip: '',
        type: {
          types: ['boolean']
        }
      },
      param: {
        synonym: "Параметр",
        tooltip: "",
        mandatory: true,
        type: {
          types: [
            "cch.properties"
          ],
          is_ref: true
        }
      },
      comparison_type: {
        synonym: "Вид сравнения",
        tooltip: "",
        choice_params: [
          {
            name: "ref",
            path: [
              "gt",
              "gte",
              "lt",
              "lte",
              "eq",
              "ne",
              "in",
              "nin",
              "inh",
              "ninh"
            ]
          }
        ],
        type: {
          types: [
            "enm.comparison_types"
          ],
          is_ref: true
        }
      },
      value: {
        synonym: "Значение",
        tooltip: "",
        choice_links: [
          {
            name: [
              "selection",
              "owner"
            ],
            path: [
              "props",
              "param"
            ]
          }
        ],
        choice_type: {
          path: [
            "props",
            "param"
          ],
          elm: 0
        },
        mandatory: true,
        type: {
          types: [
            "boolean",
            "cat.currencies",
            "cat.divisions",
            "cat.formulas",
            "cat.nom",
            "cat.nom_groups",
            "cat.parameters_keys",
            "cat.partners",
            "cat.property_values",
            "cat.retailers",
            "cat.settlements",
            "cat.stores",
            "cat.units",
            "cch.properties",
            "date",
            "enm.vat_rates",
            "number",
            "string",
          ],
          is_ref: true,
          str_len: 1024,
          date_part: "date_time",
          digits: 15,
          fraction_figits: 3
        }
      },
      txt_row: {
        synonym: "Текстовая строка",
        multiline_mode: false,
        tooltip: "Полный текст строкового реквизита либо сериализация списочного значения",
        type: {
          types: ["string"],
          str_len: 0
        }
      }
    }
  };

  class RowProps extends TabularSection {

    /**
     * Значение - владелец свойств
     * @property _owner
     * @type DataObj
     */
    get _props_owner() {
      const {_owner, _name} = this;
      const {path} = _owner._metadata(_name).choice_type;
      return path && path.length > 1 && _owner[path[1]];
    }

    toString() {
      const {_owner: {_manager, _owner}, _name, _props_owner} = this;
      if(_props_owner && _props_owner.toString()) {
        return `Свойства ${_props_owner.toString()}`;
      }
      return `Свойства ${_manager.class_name}.${_owner._name}.${_name}`;
    }

    get presentation() {
      let text = '';
      this.forEach((row) => {
        if(text) {
          text += '; ';
        }
        text += row.param.toString() + ':' + row.value.toString();
      });
      return text;
    }

    add(attr, silent) {
      return super.add(attr, silent, RowPropsRow);
    }
  }

  classes.RowPropsRow = RowPropsRow;
  classes.RowProps = RowProps;

  return {RowPropsRow, RowProps};

}




