"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _FieldSelect = require("./FieldSelect");

var _FieldSelect2 = _interopRequireDefault(_FieldSelect);

var _FieldText = require("./FieldText");

var _FieldText2 = _interopRequireDefault(_FieldText);

var _FieldDate = require("./FieldDate");

var _FieldDate2 = _interopRequireDefault(_FieldDate);

var _FieldNumber = require("./FieldNumber");

var _FieldNumber2 = _interopRequireDefault(_FieldNumber);

var _FieldToggle = require("./FieldToggle");

var _FieldToggle2 = _interopRequireDefault(_FieldToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module DataField
 *
 */

class DataField extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    };
  }

  render() {

    const { $p } = this.context;
    const { _meta } = this.state;
    const { _obj, _fld, handleValueChange, label_position } = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      handleValueChange: handleValueChange
    };

    let Control;

    switch ($p.UI.control_by_type(_meta.type, _val)) {

      case 'ocombo':
        Control = _FieldSelect2.default;
        break;

      case 'calck':
      case 'edn':
        Control = _FieldNumber2.default;
        break;

      case 'dhxCalendar':
        Control = _FieldDate2.default;
        break;

      case 'ch':
        Control = _FieldToggle2.default;
        break;

      default:
        Control = _FieldText2.default;

    }

    if (label_position == $p.enm.label_positions.hide) {
      return _react2.default.createElement(Control, subProps);
    } else {
      return _react2.default.createElement(
        "div",
        { className: 'meta-datafield-field' },
        _react2.default.createElement(
          "div",
          { className: 'meta-datafield-label' },
          _meta.synonym
        ),
        _react2.default.createElement(
          "div",
          { className: 'meta-datafield-data' },
          _react2.default.createElement(Control, subProps)
        )
      );
    }
  }
}
exports.default = DataField;
DataField.propTypes = {
  _obj: _propTypes2.default.object.isRequired, // DataObj, к реквизиту которого будет привязано поле
  _fld: _propTypes2.default.string.isRequired, // имя поля объекта - путь к данным
  _meta: _propTypes2.default.object, // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

  label_position: _propTypes2.default.object, // положение заголовка, $p.enm.label_positions
  read_only: _propTypes2.default.bool, // поле только для чтения
  mandatory: _propTypes2.default.bool, // поле обязательно для заполнения
  multi: _propTypes2.default.bool, // множественный выбор - значение является массивом
  handleValueChange: _propTypes2.default.func // обработчик при изменении значения в поле
};