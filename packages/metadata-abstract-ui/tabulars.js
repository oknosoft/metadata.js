/*!
 metadata-abstract-ui v2.0.18-beta.4, built:2019-03-07
 © 2014-2019 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

function docxtemplater ({wsql, utils}) {
  utils.docxtemplater = function (blob) {
    let docx;
    if('Docxtemplater' in window) {
      docx = Promise.resolve();
    }
    else {
      docx = ('JSZip' in window ? Promise.resolve() : utils.load_script('https://cdn.jsdelivr.net/jszip/2/jszip.min.js', 'script'))
        .then(() => utils.load_script('https://cdn.jsdelivr.net/combine/gh/open-xml-templating/docxtemplater-build@3.1.5/build/docxtemplater-latest.min.js,gh/open-xml-templating/docxtemplater-image-module-build@3.0.2/build/docxtemplater-image-module-latest.min.js', 'script'));
    }
    return docx.then(function () {
      if(!Docxtemplater.prototype.saveAs) {
        Docxtemplater.prototype.saveAs = function (name) {
          const out = this.getZip().generate({type: 'blob', mimeType: utils.mime_lookup('docx')});
          wsql.alasql.utils.saveAs(out, name);
        };
      }
      return utils.blob_as_text(blob, 'array');
    })
      .then((buffer) => new Docxtemplater().loadZip(new JSZip(buffer)));
  };
  utils.xlsx = function () {
    if('XLSX' in window) {
      return Promise.resolve();
    }
    return ('JSZip' in window ? Promise.resolve() : utils.load_script('https://cdn.jsdelivr.net/jszip/2/jszip.min.js', 'script'))
      .then(() => utils.load_script('https://cdn.jsdelivr.net/npm/xlsx@0.11.3/dist/xlsx.min.js', 'script'));
  };
}

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
var tabulars$1 = {
  proto(constructor) {
    tabulars(constructor);
  },
  constructor() {
    docxtemplater(this);
  }
};

module.exports = tabulars$1;
//# sourceMappingURL=tabulars.js.map
