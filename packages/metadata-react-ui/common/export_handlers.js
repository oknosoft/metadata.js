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

