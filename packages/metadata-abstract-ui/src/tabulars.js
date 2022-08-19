/**
 * Плагин-модификатор для metadata.js
 * Расширение функциональности TabularSection + docx + xlsx
 *
 * Created 09.01.2017
 */

import docxtemplater from './docxtemplater';

const Clipboard = require('clipboard/lib/clipboard-action');

function tabulars(constructor) {

  const {TabularSection} = constructor.classes;

  Object.defineProperty(TabularSection.prototype, 'export', {
    configurable: true,
    value: function (format = 'csv', columns = [], container) {

      if(!columns.length) {
        columns = Object.keys(this._owner._metadata(this._name).fields);
      }
      columns = columns.map(col => col.key ? col : {key: col, name: col});

      const data = [];
      const {utils, wsql} = this._owner._manager._owner.$p;
      const len = columns.length - 1;

      let text;

      this.forEach((row) => {
        const rdata = {};
        columns.forEach(({key, name, formatter}) => {
          const val = formatter ? formatter({value: row[key], raw: true}) : row[key];
          const col = format === 'xls' ? name : key;
          if(utils.is_data_obj(val)) {
            if(format == 'json') {
              rdata[key] = {
                ref: val.ref,
                type: val._manager.class_name,
                presentation: val.presentation,
              };
            }
            else {
              rdata[col] = val.presentation;
            }
          }
          else if(typeof(val) == 'number' && format == 'csv') {
            rdata[col] = val.toLocaleString('ru-RU', {
              useGrouping: false,
              maximumFractionDigits: 3,
            });
          }
          else if(val instanceof Date && format != 'xls') {
            rdata[col] = utils.moment(val).format(utils.moment._masks.date_time);
          }
          else {
            rdata[col] = val;
          }
        });
        data.push(rdata);
      });

      if(format == 'xls') {
        return utils.xlsx().then(() =>
          wsql.alasql.promise(`SELECT * INTO XLSX('${this._name + '_' + utils.moment().format('YYYYMMDDHHmm')}.xlsx',{headers:true}) FROM ? `, [data]));
      }
      else {
        return new Promise((resolve, reject) => {

          if(format == 'json') {
            text = JSON.stringify(data, null, '\t');
          }
          else {
            text = columns.map(col => col.key).join('\t') + '\n';
            data.forEach((row) => {
              columns.forEach(({key}, index) => {
                text += row[key];
                if(index < len) {
                  text += '\t';
                }
              });
              text += '\n';
            });
          }

          const action = {
            action: 'copy',
            text,
            emitter: {emit: resolve},
            container: container || document.body,
          };
          const clipboardAction = new Clipboard(action);
          clipboardAction.destroy();

        });
      }
    },
  });

}

export default {

  /**
   * ### Модификатор прототипов
   * @param constructor {MetaEngine}
   * @param classes {Object}
   */
  proto(constructor) {
    tabulars(constructor);
  },

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor() {
    docxtemplater(this);
  }
};
