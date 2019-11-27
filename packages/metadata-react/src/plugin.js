/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import DataCell from 'metadata-react/DataField/DataCell';
import TypeFieldCell from 'metadata-react/DataField/FieldTypeCell';
import PathFieldCell from 'metadata-react/DataField/FieldPathCell';
import PropsFieldCell from 'metadata-react/DataField/FieldPropsCell';
import dialogs from 'metadata-react/App/dialogs';
import {Editors, Formatters} from 'react-data-grid-addons';
import DataGrid from 'react-data-grid';
import {withStyles} from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
const {CheckboxEditor, DropDownEditor, SimpleTextEditor} = Editors;
const {editors: {EditorBase}, Row, RowComparer} = DataGrid;

const {DropDownFormatter, ImageFormatter} = Formatters;
const stub = {presentation: ''};

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

EditorBase.prototype.getInputNode = SimpleTextEditor.prototype.getInputNode = function () {
  let domNode = ReactDOM.findDOMNode(this);
  if (domNode.tagName === 'INPUT' || domNode.tagName === 'SELECT') {
    return domNode;
  }

  return domNode.querySelector('input:not([type=hidden])');
}

Row.prototype.shouldComponentUpdate = function(nextProps) {
  const res = RowComparer(nextProps, this.props);
  if(!res && nextProps.row._modified) {
    Promise.resolve().then(() => {delete nextProps.row._modified});
    return true;
  }
  return res;
}

function rx_columns({utils: {moment}, enm, md}) {

  const typed_formatters = {};

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

  const typed_formatter = (type) => {
    if(typed_formatters[type]) {
      return typed_formatters[type];
    }
    const _mgr = md.mgr_by_class_name(type);
    if(_mgr) {
      typed_formatters[type] = (row) => {
        return presentation_formatter({value: _mgr.get(row.value, true) || stub});
      };
      return typed_formatters[type];
    }
  }

  const number_formatter = (fraction = 0) => ({value}) => {
    if(!value && value !== 0) value = 0;
    const text = typeof value === 'number' ? value.toFixed(fraction) : value.toString();
    return <div title={text} style={{textAlign: 'right'}}>{text}</div>;
  };

  const bool_formatter = ({value}) => {
    return <div>{value ? 'Да' : 'Нет'}</div>;
  };

  const props_formatter = ({value}) => {
    return <div title={value.toString()}>{value.presentation}</div>;
  };

  return function columns({mode, fields, _obj, _mgr}) {

    const res = this.columns(mode);
    const {input, text, label, link, cascader, toggle, image, type, path, props} = enm.data_field_kinds;
    if(!_mgr && _obj) {
      _mgr = _obj._manager;
    }
    const editable = _obj ? _mgr.class_name.indexOf('rep.') !== 0 || this.obj.indexOf(`.${_mgr._tabular || 'data'}`) === -1 : false;

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
        if(!_fld && _mgr) {
          _fld = column._meta = _mgr.metadata(keys[0]);
        }

        if(!column.formatter && _fld && _fld.type) {

          if(column.key === 'ref' || _fld.type.is_ref) {
            column.formatter = !_obj && _fld.type.types[0].includes('.') ? typed_formatter(_fld.type.types[0]) : presentation_formatter;
          }
          else if(_fld.type.date_part) {
            column.formatter = date_formatter[_fld.type.date_part];
          }
          else if(_fld.type.digits && _fld.type.types.length === 1){
            column.formatter = number_formatter(_fld.type.fraction);
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
          if(editable){
            column.editor = PathFieldCell;
          }
          break;

        case type:
          if(editable){
            column.editor = TypeFieldCell;
          }
          break;

        case props:
          if(editable){
            column.editor = PropsFieldCell;
          }
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
    wnd && wnd.progressOff && wnd.progressOff()
    wnd_print && wnd_print.focus();
  }

  wnd && wnd.progressOn && wnd.progressOn();

  setTimeout(tune_wnd_print, 3000);

  // если _printing_plates содержит ссылку на обрабочтик печати, используем его
  if(this._printing_plates[model] instanceof DataObj) {
    model = this._printing_plates[model];
  }

  // если существует локальный обработчик, используем его
  if(model instanceof DataObj && model.execute) {
    return this.get(ref, true)
      .then(model.execute.bind(model))
      .then(tune_wnd_print);
  }
  else {

    // иначе - печатаем средствами 1С или иного сервера
    const rattr = {};
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
      value: {
        dialogs,
        React,
        ReactDOM,
        withStyles,
        Typography,
        Grid,
        FormControl,
        FormLabel,
        FormControlLabel,
        RadioGroup,
        Radio,
        Paper,
        Button,
      }
    });

  }
};
