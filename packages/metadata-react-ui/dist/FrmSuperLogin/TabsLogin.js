'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Tabs = require('material-ui/Tabs');

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Divider = require('material-ui/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Subheader = require('material-ui/Subheader');

var _Subheader2 = _interopRequireDefault(_Subheader);

var _colors = require('material-ui/styles/colors');

var _icons = require('./assets/icons');

var _FrmSuperLogin = require('./FrmSuperLogin.scss');

var _FrmSuperLogin2 = _interopRequireDefault(_FrmSuperLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabsLogin extends _react2.default.Component {

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

    this.handleRegister = () => {

      this.props.handleRegister({
        name: this.refs.reg_name.input.value,
        username: this.refs.reg_username.input.value,
        email: this.refs.reg_email.input.value,
        password: this.refs.reg_password.input.value,
        confirmPassword: this.refs.reg_confirmPassword.input.value
      });
    };

    this.state = {
      tab_value: 'a',
      btn_login_disabled: !this.props.login || !this.props.password
    };
  }

  buttonTouchTap(provider) {
    return () => {
      this.props.handleSocialAuth(provider);
    };
  }

  render() {
    return _react2.default.createElement(
      'div',
      { className: _FrmSuperLogin2.default.paper },
      _react2.default.createElement(
        _Paper2.default,
        { zDepth: 3, rounded: false },
        _react2.default.createElement(
          _Tabs.Tabs,
          {
            value: this.state.tab_value,
            onChange: this.tabChange
          },
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u0412\u0445\u043E\u0434', value: 'a' },
            _react2.default.createElement(
              'div',
              { className: _FrmSuperLogin2.default.sub_paper },
              _react2.default.createElement(_TextField2.default, {
                ref: 'login',
                hintText: 'login',
                floatingLabelText: '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F',
                defaultValue: this.props.login,
                onChange: this.handleTextChange
              }),
              _react2.default.createElement(_TextField2.default, {
                ref: 'password',
                hintText: 'password',
                floatingLabelText: '\u041F\u0430\u0440\u043E\u043B\u044C',
                type: 'password',
                defaultValue: this.props.password,
                onChange: this.handleTextChange
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0412\u043E\u0439\u0442\u0438',
                disabled: this.state.btn_login_disabled,
                className: _FrmSuperLogin2.default.button,
                onTouchTap: this.handleLogin }),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?',
                disabled: true,
                className: _FrmSuperLogin2.default.button })
            ),
            _react2.default.createElement(
              'div',
              { className: _FrmSuperLogin2.default.sub_paper },
              _react2.default.createElement(
                _Subheader2.default,
                { className: _FrmSuperLogin2.default.subheader },
                '\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u043C\u043E\u0449\u0438 \u0443\u0447\u0435\u0442\u043D\u044B\u0445 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0435\u0442\u0435\u0439:'
              ),
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Google',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.GoogleIcon, { viewBox: '0 0 256 262', style: { width: 18, height: 18 }, color: _colors.blue500 }),
                onTouchTap: this.buttonTouchTap("google")
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: '\u042F\u043D\u0434\u0435\u043A\u0441',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.YandexIcon, { viewBox: '0 0 180 190', style: { width: 18, height: 18 }, color: _colors.red500 }),
                onTouchTap: this.buttonTouchTap("yandex")
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Facebook',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.FacebookIcon, { viewBox: '0 0 450 450', style: { width: 18, height: 18 }, color: '#3A559F' }),
                onTouchTap: this.buttonTouchTap("facebook")
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: '\u0412 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0435',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.VkontakteIcon, { viewBox: '50 50 400 400', style: { width: 18, height: 18 }, color: '#4c75a3' }),
                onTouchTap: this.buttonTouchTap("vkontakte")
              })
            )
          ),
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F', value: 'b' },
            _react2.default.createElement(
              'div',
              { style: { padding: 18 } },
              _react2.default.createElement(_TextField2.default, {
                ref: 'reg_name',
                hintText: 'name',
                fullWidth: true,
                floatingLabelText: '\u041F\u043E\u043B\u043D\u043E\u0435 \u0438\u043C\u044F'
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_TextField2.default, {
                ref: 'reg_username',
                hintText: 'username',
                fullWidth: true,
                floatingLabelText: '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F'
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_TextField2.default, {
                ref: 'reg_email',
                hintText: 'email',
                fullWidth: true,
                floatingLabelText: '\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430'
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_TextField2.default, {
                ref: 'reg_password',
                hintText: 'password',
                fullWidth: true,
                floatingLabelText: '\u041F\u0430\u0440\u043E\u043B\u044C',
                type: 'password'
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_TextField2.default, {
                ref: 'reg_confirmPassword',
                hintText: 'confirmPassword',
                fullWidth: true,
                floatingLabelText: '\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C',
                type: 'password'
              }),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F',
                className: _FrmSuperLogin2.default.button,
                onTouchTap: this.handleRegister })
            )
          )
        )
      )
    );
  }
}
exports.default = TabsLogin;