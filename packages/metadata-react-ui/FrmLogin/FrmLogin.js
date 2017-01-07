'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TabsLogin = require('./TabsLogin');

var _TabsLogin2 = _interopRequireDefault(_TabsLogin);

var _TabsUser = require('./TabsUser');

var _TabsUser2 = _interopRequireDefault(_TabsUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FrmLogin extends _react.Component {

  render() {

    const { props } = this;

    return _react2.default.createElement(
      'div',
      null,
      props.state_user.logged_in ? _react2.default.createElement(_TabsUser2.default, props) : _react2.default.createElement(_TabsLogin2.default, props)
    );
  }
}
exports.default = FrmLogin;