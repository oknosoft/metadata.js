'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DateTimeFormat = global.Intl.DateTimeFormat; /**
                                                    * ### Поле ввода даты
                                                    *
                                                    * @module FieldDate
                                                    *
                                                    * Created 22.09.2016
                                                    */

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

    return _react2.default.createElement(_TextField2.default, {
      name: _fld,
      type: 'date',
      hintText: '_meta.tooltip || _meta.synonym',
      value: state.controlledDate,
      onChange: handleChange,
      DateTimeFormat: DateTimeFormat,
      locale: 'ru-RU'
    });
  }

}
exports.default = FieldDate;
FieldDate.propTypes = {
  _obj: _propTypes2.default.object.isRequired,
  _fld: _propTypes2.default.string.isRequired,
  _meta: _propTypes2.default.object.isRequired,
  handleValueChange: _propTypes2.default.func
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