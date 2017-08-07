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

class FieldText extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onChange = (event, newValue) => {
      const { _obj, _fld, handleValueChange } = this.props;
      _obj[_fld] = newValue;
      if (handleValueChange) {
        handleValueChange(newValue);
      }
    }, _temp;
  }

  render() {
    const { onChange, props } = this;
    const { _obj, _fld, _meta } = props;

    return _react2.default.createElement(_TextField2.default, {
      name: _fld,
      fullWidth: true,
      defaultValue: _obj[_fld],
      hintText: _meta.tooltip || _meta.synonym,
      onChange: onChange
    });
  }
}
exports.default = FieldText; /**
                              * ### Поле ввода текстовых данных
                              *
                              * @module FieldText
                              *
                              */

FieldText.propTypes = {
  _obj: _propTypes2.default.object.isRequired,
  _fld: _propTypes2.default.string.isRequired,
  _meta: _propTypes2.default.object.isRequired,
  handleValueChange: _propTypes2.default.func
};