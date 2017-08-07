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

var _Calculator = require('../Calculator');

var _Calculator2 = _interopRequireDefault(_Calculator);

var _FieldNumber = require('./styles/FieldNumber.scss');

var _FieldNumber2 = _interopRequireDefault(_FieldNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FieldNumber extends _react.Component {

  constructor(props) {
    super(props);

    this.onChange = (event, newValue) => {
      this.setState({
        value: newValue
      }, () => {
        if (this.props.handleValueChange) {
          this.props.handleValueChange(this.state.value);
        }
      });
    };

    this.state = {
      isCalculatorVisible: false,
      value: this.props._obj[this.props._fld]
    };
  }

  handleInputClick() {
    this.setState({
      isCalculatorVisible: true
    });
  }

  handleValueChange(value) {
    let floatValue = parseFloat(value);

    if (isNaN(floatValue)) {
      floatValue = 0.0;
    }

    this.setState({
      value: floatValue
    });
  }

  handleCalculatorClose(value) {
    this.setState({
      value: value,
      isCalculatorVisible: false
    });
  }

  render() {
    const name = this.props._fld;

    let input = null;
    if (this.props.partOfTabularSection) {
      // Render plain html input in cell of table.
      input = _react2.default.createElement('input', {
        type: 'text',
        name: name,
        value: this.state.value,

        className: _FieldNumber2.default['meta-field-number__input'],
        onChange: (event, value) => {
          this.handleValueChange(value);
        },
        onClick: () => {
          this.handleInputClick();
        } });
    } else {
      input = _react2.default.createElement(_TextField2.default, {
        name: name,
        value: this.state.value,

        fullWidth: true,
        hintText: this.props._meta.tooltip || this.props._meta.synonym,
        onChange: (event, value) => {
          this.handleValueChange(value);
        },
        onClick: () => {
          this.handleInputClick();
        } });
    }

    return _react2.default.createElement(
      'div',
      { className: _FieldNumber2.default['meta-field-number'] },
      _react2.default.createElement(_Calculator2.default, {
        position: 'bottom',
        visible: this.state.isCalculatorVisible,
        value: this.state.value,
        onChange: value => {
          this.setState({ value });
        },
        onClose: value => {
          this.handleCalculatorClose(value);
        } }),
      input
    );
  }
}
exports.default = FieldNumber; /**
                                * ### Поле ввода числовых данных с калькулятором
                                *
                                * @module FieldNumber
                                *
                                * Created 22.09.2016
                                */

FieldNumber.propTypes = {
  _obj: _propTypes2.default.object.isRequired,
  _fld: _propTypes2.default.string.isRequired,
  _meta: _propTypes2.default.object.isRequired,
  handleValueChange: _propTypes2.default.func,
  partOfTabularSection: _propTypes2.default.bool
};
FieldNumber.defaultProps = {
  partOfTabularSection: false
};