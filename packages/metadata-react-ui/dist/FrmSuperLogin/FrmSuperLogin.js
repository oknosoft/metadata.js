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

var _Profile = require('./Profile');

var _Profile2 = _interopRequireDefault(_Profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SuperLogin extends _react.Component {

  constructor(props) {
    super(props);
    this.state = {
      logged_in: props.state_user.logged_in
    };
  }

  render() {

    const { props } = this;

    if (!this.state.logged_in && props.state_user.logged_in) {
      setTimeout(() => {
        this.context.$p.UI.history.push('/');
      });
    }
    this.state.logged_in = props.state_user.logged_in;

    return _react2.default.createElement(
      'div',
      null,
      props.state_user.logged_in ? _react2.default.createElement(_Profile2.default, props) : _react2.default.createElement(_TabsLogin2.default, props)
    );
  }
}
exports.default = SuperLogin;
SuperLogin.contextTypes = {
  $p: _react2.default.PropTypes.func.isRequired
};