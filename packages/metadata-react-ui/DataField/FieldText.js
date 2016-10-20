'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataField = {
  'label': 'DataField__label___1MXSv',
  'data': 'DataField__data___E9DYW',
  'field': 'DataField__field___3McQ6',
  'dataselect': 'DataField__dataselect___1mT91'
};

var _DataField2 = _interopRequireDefault(_DataField);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldText = function (_Component) {
  (0, _inherits3.default)(FieldText, _Component);

  function FieldText() {
    (0, _classCallCheck3.default)(this, FieldText);
    return (0, _possibleConstructorReturn3.default)(this, (FieldText.__proto__ || (0, _getPrototypeOf2.default)(FieldText)).apply(this, arguments));
  }

  (0, _createClass3.default)(FieldText, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: _DataField2.default.field },
        _react2.default.createElement(
          'div',
          { className: _DataField2.default.label },
          this.props._meta.synonym
        ),
        _react2.default.createElement(
          'div',
          { className: _DataField2.default.data },
          _react2.default.createElement(_TextField2.default, {
            name: this.props._meta.name,
            fullWidth: true,
            defaultValue: this.props._val
          })
        )
      );
    }
  }]);
  return FieldText;
}(_react.Component);

exports.default = FieldText;
process.env.NODE_ENV !== "production" ? FieldText.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object.isRequired,
  handleValueChange: _react.PropTypes.func
} : void 0;