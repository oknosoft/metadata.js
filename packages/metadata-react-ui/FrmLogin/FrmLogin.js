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

var _TabsLogin = require('./TabsLogin');

var _TabsLogin2 = _interopRequireDefault(_TabsLogin);

var _User = require('components/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FrmLogin = function (_Component) {
  (0, _inherits3.default)(FrmLogin, _Component);

  function FrmLogin() {
    (0, _classCallCheck3.default)(this, FrmLogin);
    return (0, _possibleConstructorReturn3.default)(this, (FrmLogin.__proto__ || (0, _getPrototypeOf2.default)(FrmLogin)).apply(this, arguments));
  }

  (0, _createClass3.default)(FrmLogin, [{
    key: 'render',
    value: function render() {
      var props = this.props;


      return _react2.default.createElement(
        'div',
        null,
        props.state_user.logged_in ? _react2.default.createElement(_User2.default, props) : _react2.default.createElement(_TabsLogin2.default, props)
      );
    }
  }]);
  return FrmLogin;
}(_react.Component);

exports.default = FrmLogin;