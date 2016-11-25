'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TabsLogin = require('./TabsLogin');

var _TabsLogin2 = _interopRequireDefault(_TabsLogin);

var _Profile = require('./Profile');

var _Profile2 = _interopRequireDefault(_Profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SuperLogin = function (_Component) {
  _inherits(SuperLogin, _Component);

  function SuperLogin(props) {
    _classCallCheck(this, SuperLogin);

    var _this = _possibleConstructorReturn(this, (SuperLogin.__proto__ || Object.getPrototypeOf(SuperLogin)).call(this, props));

    _this.state = {
      logged_in: props.state_user.logged_in
    };
    return _this;
  }

  _createClass(SuperLogin, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;


      if (!this.state.logged_in && props.state_user.logged_in) {
        setTimeout(function () {
          _this2.context.$p.UI.history.push('/');
        });
      }
      this.state.logged_in = props.state_user.logged_in;

      return _react2.default.createElement(
        'div',
        null,
        props.state_user.logged_in ? _react2.default.createElement(_Profile2.default, props) : _react2.default.createElement(_TabsLogin2.default, props)
      );
    }
  }]);

  return SuperLogin;
}(_react.Component);

SuperLogin.contextTypes = {
  $p: _react2.default.PropTypes.func.isRequired
};
exports.default = SuperLogin;