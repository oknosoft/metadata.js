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

    value: function (format = 'csv', columns = [], container) {

      if(!columns.length) {
        columns = Object.keys(this._owner._metadata(this._name).fields);
      }

      const data = [];
      const {utils, wsql} = this._owner._manager._owner.$p;
      const len = columns.length - 1;

      let text;

      this.forEach((row) => {
        const rdata = {};
        columns.forEach((col) => {
          if(utils.is_data_obj(row[col])) {
            if(format == 'json') {
              rdata[col] = {
                ref: row[col].ref,
                type: row[col]._manager.class_name,
                presentation: row[col].presentation,
              };
            }
            else {
              rdata[col] = row[col].presentation;
            }
          }
          else if(typeof(row[col]) == 'number' && format == 'csv') {
            rdata[col] = row[col].toLocaleString('ru-RU', {
              useGrouping: false,
              maximumFractionDigits: 3,
            });
          }
          else if(row[col] instanceof Date && format != 'xls') {
            rdata[col] = utils.moment(row[col]).format(utils.moment._masks.date_time);
          }
          else {
            rdata[col] = row[col];
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
            text = columns.join('\t') + '\n';
            data.forEach((row) => {
              columns.forEach((col, index) => {
                text += row[col];
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
