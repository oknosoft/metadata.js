/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component, PropTypes} from "react";
import {DataCell} from "metadata-react-ui/DataField";
import {Editors, Formatters} from "react-data-grid/addons";

const AutoCompleteEditor = Editors.AutoComplete;
const DropDownEditor = Editors.DropDownEditor;
const DropDownFormatter = Formatters.DropDownFormatter;


function rx_columns({mode, fields, _obj}) {

  const res = this.columns(mode);

  if (fields) {
    res.forEach((column) => {

      const _fld = fields[column.key]

      if (!column.formatter) {

        if (_fld.type.is_ref) {
          column.formatter = (v) => {
            const {presentation} = v.value
            return <div title={presentation}>{presentation}</div>
          }
        }
      }

      switch (column.ctrl_type) {

        case 'input':
          column.editable = true;
          break;

        case 'ocombo':
          column.editor = <DataCell />;
          break;

        case 'ofields':
          const options = _obj.used_fields_list()
          column.editor = <DropDownEditor options={options}/>
          column.formatter = <DropDownFormatter options={options}/>
          break;

        case 'dhxCalendar':
          column.editor = <DataCell />;
          break;

        default:
          ;
      }

    })
  }

  return res;
}
