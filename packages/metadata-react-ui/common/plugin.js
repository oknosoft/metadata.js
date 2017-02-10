/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component, PropTypes} from "react";
import {DataCell} from "metadata-react-ui/DataField";
import {Editors, Formatters} from "react-data-grid-addons";

const AutoCompleteEditor = Editors.AutoComplete;
const DropDownEditor = Editors.DropDownEditor;
const DropDownFormatter = Formatters.DropDownFormatter;


function rx_columns($p) {

  const {moment} = $p.utils;

  const date_formatter = {
    date: (v) => {
      const {presentation} = moment(v).format(moment._masks.date);
      return <div title={presentation}>{presentation}</div>
    },
    date_time: (v) => {
      const {presentation} = moment(v).format(moment._masks.date_time);
      return <div title={presentation}>{presentation}</div>
    }
  }

  const presentation_formatter = (v) => {
    const {presentation} = v.value
    return <div title={presentation}>{presentation}</div>
  }

  return function columns({mode, fields, _obj}) {

    const res = this.columns(mode);

    if (fields) {
      res.forEach((column) => {

        const _fld = fields[column.key]

        if (!column.formatter) {

          if (_fld.type.is_ref) {
            column.formatter = presentation_formatter
          }
          else if(_fld.type.date_part){
            column.formatter = date_formatter[_fld.type.date_part]
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
}

/**
 * ### Обработчики экспорта
 *
 * @module export_handlers
 *
 * Created 10.01.2017
 */


function export_handlers(constructor, classes) {

  /**
   * mixin свойств дата и номер документа к базовому классу
   * @param superclass
   * @constructor
   */
  Object.defineProperty(constructor.prototype.UI, 'export_handlers', {

    value: function() {

      this.doExport = (format) => {
        const {_obj, _tabular, _columns} = this.props;
        _obj[_tabular].export(format, _columns.map((column) => column.key))
          .then((res) => {
            if (res == 'success') {
              console.log(res)
            }
          })
      }

      this.handleExportXLS = () => {
        const {$p} = this.context
        const doExport = ::this.doExport
        require.ensure(["xlsx"], function () {
          if (!window.XLSX) {
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
  })

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
function print (ref, model, wnd) {

  function tune_wnd_print(wnd_print){
    if(wnd && wnd.progressOff)
      wnd.progressOff();
    if(wnd_print)
      wnd_print.focus();
  }

  if(wnd && wnd.progressOn)
    wnd.progressOn();

  setTimeout(tune_wnd_print, 3000);

  // если _printing_plates содержит ссылку на обрабочтик печати, используем его
  if(this._printing_plates[model] instanceof DataObj)
    model = this._printing_plates[model];

  // если существует локальный обработчик, используем его
  if(model instanceof DataObj && model.execute){

    if(ref instanceof DataObj)
      return model.execute(ref)
        .then(tune_wnd_print);
    else
      return this.get(ref, true)
        .then(model.execute.bind(model))
        .then(tune_wnd_print);

  }else{

    // иначе - печатаем средствами 1С или иного сервера
    var rattr = {};
    $p.ajax.default_attr(rattr, job_prm.irest_url());
    rattr.url += this.rest_name + "(guid'" + utils.fix_guid(ref) + "')" +
      "/Print(model=" + model + ", browser_uid=" + wsql.get_user_param("browser_uid") +")";

    return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
      .then(tune_wnd_print);
  }

}/**
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

    export_handlers(constructor, classes)

  },

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor(){

    // модифицируем метод columns() справочника scheme_settings - добавляем форматтеры и редакторы
    Object.defineProperty(this.CatScheme_settings.prototype, 'rx_columns', {
      value: rx_columns(this)
    })

    // методы печати в прототип DataManager
    Object.defineProperties(this.classes.DataManager, {
      value: print
    })

  }
}
