/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataCell from 'metadata-react/DataField/DataCell';
import TypeFieldCell from 'metadata-react/DataField/FieldTypeCell';
import PathFieldCell from 'metadata-react/DataField/FieldPathCell';
import PropsFieldCell from 'metadata-react/DataField/FieldPropsCell';
import dialogs from 'metadata-react/App/dialogs';
import {Editors, Formatters} from 'metadata-external/react-data-grid-addons.min';
const {CheckboxEditor, DropDownEditor} = Editors;
const {DropDownFormatter, ImageFormatter} = Formatters;

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


function rx_columns({utils: {moment}, enm, md}) {

  const date_formatter = {
    date: ({value}) => {
      const presentation = !value || value.length < 5 ? value || '' : moment(value).format(moment._masks.date);
      return <div title={presentation}>{presentation}</div>;
    },
    date_time: ({value}) => {
      const presentation = !value || value.length < 5 ? value || '' : moment(value).format(moment._masks.date_time);
      return <div title={presentation}>{presentation}</div>;
    }
  };

  const presentation_formatter = ({value}) => {
    let text = typeof value === 'string' ? value : (value && value.presentation) || '';
    if(text === '_') {
      text = '';
    }
    return <div title={text}>{text}</div>;
  };

  const number_formatter = (fraction_figits = 0) => ({value}) => {
    const text = typeof value === 'number' ? value.toFixed(fraction_figits) : value.toString();
    return <div title={text} style={{textAlign: 'right'}}>{text}</div>;
  };

  const bool_formatter = ({value}) => {
    return <div>{value ? 'Да' : 'Нет'}</div>;
  };

  const props_formatter = ({value}) => {
    return <div title={value.toString()}>{value.presentation}</div>;
  };

  return function columns({mode, fields, _obj}) {

    const res = this.columns(mode);
    const {input, text, label, link, cascader, toggle, image, type, path, props} = enm.data_field_kinds;
    const editable = _obj._manager.class_name.indexOf('rep.') !== 0 || this.obj.indexOf(`.${_obj._manager._tabular || 'data'}`) === -1;

    if(fields) {
      res.forEach((column) => {

        const keys = column.key.split('.');
        let _fld = column._meta = fields[keys[0]];
        for(let i = 1; i < keys.length; i++) {
          const pmeta = md.get(_fld.type.types[0]);
          if(pmeta) {
            _fld = column._meta = pmeta.fields[keys[i]];
          }
        }

        if(!column.formatter && _fld && _fld.type) {

          if(column.key === 'ref' || _fld.type.is_ref) {
            column.formatter = presentation_formatter;
          }
          else if(_fld.type.date_part) {
            column.formatter = date_formatter[_fld.type.date_part];
          }
          else if(_fld.type.digits && _fld.type.types.length === 1){
            column.formatter = number_formatter(_fld.type.fraction_figits);
          }
          else if(_fld.type.types.includes('boolean')) {
            column.formatter = bool_formatter;
          }
        }

        let options;
        switch (column.ctrl_type) {

        case label:
          break;

        case input:
        case text:
        case link:
        case cascader:
          column.editable = editable;
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
          if(editable){
            column.editor = <DropDownEditor options={toggle_options}/>;
          }
          column.formatter = <DropDownFormatter options={toggle_options} value={''}/>;
          break;

        case path:
          column.editor = PathFieldCell;
          break;

        case type:
          column.editor = TypeFieldCell;
          break;

        case props:
          column.editor = PropsFieldCell;
          column.formatter = props_formatter;
          break;

        default:
          if(editable){
            column.editor = DataCell;
          }
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

  this.doExport = (format, evt) => {
    const {handleMenuClose, props: {_obj, _tabular, _columns}} = this;
    const t = typeof _tabular === 'object' && _tabular.export ? _tabular : _obj && _obj[_tabular];
    t && t.export(format, _columns.map(({key}) => key), evt && evt.target);
    handleMenuClose && handleMenuClose();
  };

  this.handleExportXLS = (evt) => this.doExport('xls', evt);
  this.handleExportJSON = (evt) => this.doExport('json', evt);
  this.handleExportCSV = (evt) => this.doExport('csv', evt);

  this.handleMenuOpen = (evt) => this.setState({menuOpen: true, anchorEl: evt.currentTarget});
  this.handleMenuClose = (evt) => this.setState({menuOpen: false});

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

    // публичные методы ui
    Object.defineProperty(this, 'ui', {
      value: {dialogs}
    });

  }
};
