/*!
 metadata-abstract-ui v2.0.30-beta.8, built:2022-08-19
 © 2014-2022 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
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
