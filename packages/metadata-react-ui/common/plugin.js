/**
 * Плагин-модификатор react-ui для metadata.js
 *
 * @module plugin
 *
 * Created 07.01.2017
 */

import React, {Component, PropTypes} from "react";
import DataCell from '../DataField/DataCell'
import {Editors, Formatters} from "react-data-grid/addons";
const AutoCompleteEditor = Editors.AutoComplete;
const DropDownEditor = Editors.DropDownEditor;
const DropDownFormatter = Formatters.DropDownFormatter;


/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

	proto(constructor) {

	  const {UI} = constructor.prototype

		Object.defineProperties(UI, {

      /**
       * Подклеивает редакторы и форматтеры к колонкам
       * @param columns {Array} - колонки табличной части
       * @param fields {Array} - матаданные полей
       * @param _obj {DataObj} - объект, которому принадлежит табчасть
       */
      fix_columns: {
        value: (columns, fields, _obj) => {

          columns.forEach((column) => {

            const _fld = fields[column.key]

            if(!column.formatter){

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
                column.editor = <DropDownEditor options={options} />
                column.formatter = <DropDownFormatter options={options} />
                break;

              case 'dhxCalendar':
                column.editor = <DataCell />;
                break;

              default:
                ;
            }

          })
        }
			}

		})
	}
}
