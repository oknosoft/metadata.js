"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DatePicker = require("material-ui/DatePicker");

var _DatePicker2 = _interopRequireDefault(_DatePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

const DateTimeFormat = global.Intl.DateTimeFormat;

class FieldDate extends _react.Component {

  constructor(props) {

    super(props);

    _initialiseProps.call(this);

    const { _obj, _fld } = this.props;

    this.state = {
      controlledDate: _obj[_fld]
    };
  }

  render() {

    const { props, state, handleChange } = this;
    const { _obj, _fld, _meta } = props;

    return _react2.default.createElement(_DatePicker2.default, {
      name: _fld,
      hintText: "_meta.tooltip || _meta.synonym",
      value: state.controlledDate,
      onChange: handleChange,
      DateTimeFormat: DateTimeFormat,
      autoOk: true,
      mode: "landscape",
      cancelLabel: "\u041E\u0442\u043C\u0435\u043D\u0430",
      locale: "ru-RU"
    });
  }

}
exports.default = FieldDate;
FieldDate.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object.isRequired,
  handleValueChange: _react.PropTypes.func
};

var _initialiseProps = function () {
  this.handleChange = (event, newValue) => {

    this.setState({
      controlledDate: newValue
    });

    const { _obj, _fld, handleValueChange } = this.props;
    _obj[_fld] = newValue;
    if (handleValueChange) {
      handleValueChange(newValue);
    }
  };
};