"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DataCell = require("../DataField/DataCell");

var _DataCell2 = _interopRequireDefault(_DataCell);

var _addons = require("react-data-grid/addons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AutoCompleteEditor = _addons.Editors.AutoComplete; /**
                                                          * Плагин-модификатор react-ui для metadata.js
                                                          *
                                                          * @module plugin
                                                          *
                                                          * Created 07.01.2017
                                                          */

const DropDownEditor = _addons.Editors.DropDownEditor;
const DropDownFormatter = _addons.Formatters.DropDownFormatter;

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
exports.default = {

  proto(constructor) {

    const { UI } = constructor.prototype;

    Object.defineProperties(UI, {

      /**
       * Подклеивает редакторы и форматтеры к колонкам
       * @param columns {Array} - колонки табличной части
       * @param fields {Array} - матаданные полей
       * @param _obj {DataObj} - объект, которому принадлежит табчасть
       */
      fix_columns: {
        value: (columns, fields, _obj) => {

          columns.forEach(column => {

            const _fld = fields[column.key];

            if (!column.formatter) {

              if (_fld.type.is_ref) {
                column.formatter = v => {
                  const { presentation } = v.value;
                  return _react2.default.createElement(
                    "div",
                    { title: presentation },
                    presentation
                  );
                };
              }
            }

            switch (column.ctrl_type) {

              case 'input':
                column.editable = true;
                break;

              case 'ocombo':
                column.editor = _react2.default.createElement(_DataCell2.default, null);
                break;

              case 'ofields':
                const options = _obj.used_fields_list();
                column.editor = _react2.default.createElement(DropDownEditor, { options: options });
                column.formatter = _react2.default.createElement(DropDownFormatter, { options: options });
                break;

              case 'dhxCalendar':
                column.editor = _react2.default.createElement(_DataCell2.default, null);
                break;

              default:
                ;
            }
          });
        }
      }

    });
  }
};
