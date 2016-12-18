'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataField = require('./DataField.scss');

var _DataField2 = _interopRequireDefault(_DataField);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FieldText extends _react.Component {

  render() {
    return _react2.default.createElement(_TextField2.default, {
      name: this.props._fld,
      fullWidth: true,
      defaultValue: this.props._val,
      hintText: this.props._meta.tooltip || this.props._meta.synonym
    });
  }
}
exports.default = FieldText;
FieldText.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object.isRequired,
  handleValueChange: _react.PropTypes.func
};