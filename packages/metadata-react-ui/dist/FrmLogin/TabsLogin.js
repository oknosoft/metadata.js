'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Tabs = require('material-ui/Tabs');

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _CnnSettings = require('./CnnSettings');

var _CnnSettings2 = _interopRequireDefault(_CnnSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabsLogin extends _react.Component {

  constructor(props) {

    super(props);

    this.tabChange = tab_value => {
      if (tab_value === 'a' || tab_value === 'b') {
        this.setState({
          tab_value: tab_value
        });
      }
    };

    this.handleTextChange = () => {
      this.setState({
        btn_login_disabled: !this.refs.login.input.value || !this.refs.password.input.value
      });
    };

    this.handleLogin = () => {
      this.props.handleLogin(this.refs.login.input.value, this.refs.password.input.value);
    };

    this.state = {
      tab_value: 'a',
      btn_login_disabled: !props.login || !props.password
    };
  }

  render() {

    const { props, state, handleTextChange, handleLogin } = this;

    return _react2.default.createElement(
      'div',
      { className: 'meta-paper' },
      _react2.default.createElement(
        _Paper2.default,
        { zDepth: 3, rounded: false },
        _react2.default.createElement(
          _Tabs.Tabs,
          {
            value: state.tab_value,
            onChange: this.tabChange },
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u0412\u0445\u043E\u0434', value: 'a' },
            _react2.default.createElement(
              'div',
              { className: 'meta-padding-18' },
              _react2.default.createElement(_TextField2.default, {
                ref: 'login',
                hintText: 'login',
                floatingLabelText: '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F',
                fullWidth: true,
                defaultValue: props.login,
                onChange: handleTextChange
              }),
              _react2.default.createElement(_TextField2.default, {
                ref: 'password',
                hintText: 'password',
                floatingLabelText: '\u041F\u0430\u0440\u043E\u043B\u044C',
                fullWidth: true,
                type: 'password',
                defaultValue: props.password,
                onChange: handleTextChange
              }),
              _react2.default.createElement('br', null),
              props.state_user.logged_in ? _react2.default.createElement(_RaisedButton2.default, { label: '\u0412\u044B\u0439\u0442\u0438',
                className: 'meta-button-18-0',
                onTouchTap: props.handleLogOut }) : _react2.default.createElement(_RaisedButton2.default, { label: '\u0412\u043E\u0439\u0442\u0438',
                disabled: state.btn_login_disabled,
                className: 'meta-button-18-0',
                onTouchTap: handleLogin }),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?',
                disabled: true,
                className: 'meta-button-18-0' })
            )
          ),
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435', value: 'b' },
            _react2.default.createElement(_CnnSettings2.default, props)
          )
        )
      )
    );
  }
}
exports.default = TabsLogin;
TabsLogin.propTypes = {

  zone: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  couch_path: _propTypes2.default.string.isRequired,
  enable_save_pwd: _propTypes2.default.bool.isRequired,
  handleSetPrm: _propTypes2.default.func.isRequired,

  handleLogin: _propTypes2.default.func.isRequired,
  handleLogOut: _propTypes2.default.func.isRequired
};