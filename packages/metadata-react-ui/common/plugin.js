/**
 * ### Обработчики экспорта
 *
 * @module export_handlers
 *
 * Created 10.01.2017
 */

function export_handlers() {

  this.doExport = (format) => {
    const {_obj, _tabular, _columns} = this.props;
    _obj[_tabular].export(format, _columns.map((column) => column.key))
      .then((res) => {
      if(res=='success'){
        console.log(res)
      }
    })
  }

  this.handleExportXLS = () => {
    const {$p} = this.context
    const doExport = ::this.doExport
    require.ensure(["xlsx"], function() {
      if(!window.XLSX){
        window.XLSX = require("xlsx");
      }
      doExport('xls')
    });
  }

  this.handleExportJSON = () => {
    this.doExport('json')
  }

  this.handleExportCSV = () => {
    this.doExport('csv')
  }
}
/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component, PropTypes} from "react";
import DataCell from "metadata-react-ui/DataCell";
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
/**
 * Плагин-модификатор react-ui для metadata.js
 *
 * @module plugin
 *
 * Created 07.01.2017
 */


/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

  /**
   * ### Модификатор прототипов
   * @param constructor {MetaEngine}
   * @param classes {Object}
   */
  proto(constructor, classes) {

    Object.defineProperty(constructor.prototype.UI, 'export_handlers', {
      value: export_handlers
    })

  },

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor(){

    // модифицируем метод columns() справочника scheme_settings - добавляем форматтеры и редакторы
    Object.defineProperty(this.CatScheme_settings.prototype, 'rx_columns', {
      value: rx_columns
    })

  }
}
