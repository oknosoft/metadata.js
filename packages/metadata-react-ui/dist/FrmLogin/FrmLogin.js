'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TabsLogin = require('./TabsLogin');

var _TabsLogin2 = _interopRequireDefault(_TabsLogin);

var _TabsUser = require('./TabsUser');

var _TabsUser2 = _interopRequireDefault(_TabsUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FrmLogin extends _react.Component {

  render() {

    const { props } = this;

    if (props.state_user.logged_in && props._obj) {
      return _react2.default.createElement(_TabsUser2.default, props);
    } else {
      return _react2.default.createElement(_TabsLogin2.default, props);
    }
  }

}
exports.default = FrmLogin;