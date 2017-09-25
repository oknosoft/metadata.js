/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Editors, Formatters} from 'react-data-grid-addons';
const {CheckboxEditor, DropDownEditor} = Editors;
const {DropDownFormatter, ImageFormatter} = Formatters;

import DataCell from './DataField/DataCell';
import TypeFieldCell from './DataField/FieldTypeCell';
import PathFieldCell from './DataField/FieldPathCell';

class ToggleEditor extends CheckboxEditor {

  getInputNode() {

  }

  getValue() {
    return this.props.rowData[this.props.column.key];
  }

  handleChange(e) {
    const {rowData, column} = this.props;
    rowData[column.key] = !rowData[column.key];
    //this.props.column.onCellChange(this.props.rowIdx, this.props.column.key, this.props.dependentValues, e);
  }
}


function rx_columns($p) {

  const {moment} = $p.utils;

  const date_formatter = {
    date: ({value}) => {
      const presentation = moment(value).format(moment._masks.date);
      return <div title={presentation}>{presentation}</div>;
    },
    date_time: ({value}) => {
      const presentation = moment(value).format(moment._masks.date_time);
      return <div title={presentation}>{presentation}</div>;
    }
  };

  const presentation_formatter = ({value}) => {
    const {presentation} = value;
    return <div title={presentation}>{presentation}</div>;
  };

  return function columns({mode, fields, _obj}) {

    const res = this.columns(mode);
    const {input, text, label, link, cascader, toggle, image, type, path} = $p.enm.data_field_kinds;

    if(fields) {
      res.forEach((column) => {

        const _fld = fields[column.key];

        if(!column.formatter) {

          if(_fld.type.is_ref) {
            column.formatter = presentation_formatter;
          }
          else if(_fld.type.date_part) {
            column.formatter = date_formatter[_fld.type.date_part];
          }
        }

        let options;
        switch (column.ctrl_type) {

        case input:
        case text:
        case label:
        case link:
        case cascader:
          column.editable = true;
          break;

        case toggle:
          const toggle_options = [
            {
              id: 0,
              value: false,
              text: 'Нет',
              title: 'Нет',
            },
            {
              id: 1,
              value: true,
              text: 'Да',
              title: 'Да',
            }
          ];
          column.editor = <DropDownEditor options={toggle_options}/>;
          column.formatter = <DropDownFormatter options={toggle_options} value={''}/>;
          break;

        case path:
          // options = _obj.used_fields_list();
          // column.editor = <DropDownEditor options={options}/>;
          // column.formatter = <DropDownFormatter options={options} value=""/>;
          column.editor = <PathFieldCell />;
          break;

        case type:
          column.editor = <TypeFieldCell />;
          //column.formatter = <DropDownFormatter options={[]} value=""/>;
          break;

        default:
          column.editor = <DataCell />;
        }

      });
    }

    return res;
  };
}

/**
 * ### Обработчики экспорта
 *
 * @module export_handlers
 *
 * Created 10.01.2017
 */

export function export_handlers() {

  this.doExport = (format) => {
    setTimeout(() => {
      const {_obj, _tabular, _columns} = this.props;
      _obj[_tabular].export(format, _columns.map((column) => column.key))
    });
    this.handleMenuClose && this.handleMenuClose();
  };

  this.handleExportXLS = (evt) => this.doExport('xls');
  this.handleExportJSON = (evt) => this.doExport('json');
  this.handleExportCSV = (evt) => this.doExport('csv');

  this.handleMenuOpen = (evt) =>
    this.setState({menuOpen: true, anchorEl: evt.currentTarget});
  this.handleMenuClose = (evt) =>
    this.setState({menuOpen: false});

}

/**
 * ### Методы печати в прототип DataManager
 *
 * @module print
 *
 * Created 10.01.2017
 */


/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String|DataObj.cat.formulas} - идентификатор команды печати
 * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
 */
function print(ref, model, wnd) {

  function tune_wnd_print(wnd_print) {
    if(wnd && wnd.progressOff) {
      wnd.progressOff();
    }
    if(wnd_print) {
      wnd_print.focus();
    }
  }

  if(wnd && wnd.progressOn) {
    wnd.progressOn();
  }

  setTimeout(tune_wnd_print, 3000);

  // если _printing_plates содержит ссылку на обрабочтик печати, используем его
  if(this._printing_plates[model] instanceof DataObj) {
    model = this._printing_plates[model];
  }

  // если существует локальный обработчик, используем его
  if(model instanceof DataObj && model.execute) {

    if(ref instanceof DataObj) {
      return model.execute(ref)
        .then(tune_wnd_print);
    }
    else {
      return this.get(ref, true)
        .then(model.execute.bind(model))
        .then(tune_wnd_print);
    }

  }
  else {

    // иначе - печатаем средствами 1С или иного сервера
    var rattr = {};
    $p.ajax.default_attr(rattr, job_prm.irest_url());
    rattr.url += this.rest_name + '(guid\'' + utils.fix_guid(ref) + '\')' +
      '/Print(model=' + model + ', browser_uid=' + wsql.get_user_param('browser_uid') + ')';

    return $p.ajax.get_and_show_blob(rattr.url, rattr, 'get')
      .then(tune_wnd_print);
  }

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
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor() {

    // модифицируем метод columns() справочника scheme_settings - добавляем форматтеры и редакторы
    Object.defineProperty(this.CatScheme_settings.prototype, 'rx_columns', {
      value: rx_columns(this)
    });

    // методы печати в прототип DataManager
    Object.defineProperties(this.classes.DataManager, {
      value: print
    });

  }
};
