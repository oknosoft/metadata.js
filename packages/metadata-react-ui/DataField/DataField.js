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

var _FieldSelect = require('./FieldSelect');

var _FieldSelect2 = _interopRequireDefault(_FieldSelect);

var _FieldText = require('./FieldText');

var _FieldText2 = _interopRequireDefault(_FieldText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataField = function (_Component) {
  (0, _inherits3.default)(DataField, _Component);

  function DataField(props) {
    (0, _classCallCheck3.default)(this, DataField);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DataField.__proto__ || (0, _getPrototypeOf2.default)(DataField)).call(this, props));

    _this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    };
    return _this;
  }

  (0, _createClass3.default)(DataField, [{
    key: 'render',
    value: function render() {
      var $p = this.context.$p;
      var _meta = this.state._meta;

      var _val = this.props._obj[this.props._fld];
      var subProps = {
        _meta: this.state._meta,
        _obj: this.props._obj,
        _fld: this.props._fld,
        _val: _val
      };

      switch ($p.rx_control_by_type(this.state._meta.type, _val)) {

        case 'ocombo':
          return _react2.default.createElement(_FieldSelect2.default, subProps);

        default:
          return _react2.default.createElement(_FieldText2.default, subProps);

      }

      ;
    }
  }]);
  return DataField;
}(_react.Component);

DataField.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
exports.default = DataField;
process.env.NODE_ENV !== "production" ? DataField.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,
  handleValueChange: _react.PropTypes.func
} : void 0;