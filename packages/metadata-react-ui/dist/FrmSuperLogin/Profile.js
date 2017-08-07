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

var _Divider = require('material-ui/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _DataField = require('../DataField');

var _DataField2 = _interopRequireDefault(_DataField);

var _Subheader = require('material-ui/Subheader');

var _Subheader2 = _interopRequireDefault(_Subheader);

var _colors = require('material-ui/styles/colors');

var _icons = require('./assets/icons');

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _FrmSuperLogin = require('./FrmSuperLogin.scss');

var _FrmSuperLogin2 = _interopRequireDefault(_FrmSuperLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: '8px'
  },
  block: {
    //flex: '1 100%',
    fontWeight: 'bold'
  }
};

class UserObj extends _react.Component {

  constructor(props) {
    super(props);

    this.tabChange = tab_value => {
      if (tab_value === 'a' || tab_value === 'b') {
        this.setState({
          tab_value: tab_value
        });
      }
    };

    this.handleLogOut = () => {
      this.props.handleLogOut();
    };

    this.state = {
      tab_value: 'a',
      btn_login_disabled: !this.props.login || !this.props.password
    };
  }

  handleSave() {}

  handleSend() {}

  handleMarkDeleted() {}

  handlePrint() {}

  handleAttachment() {}

  render() {

    const { screen } = this.context;
    const { _obj } = this.props;

    return _react2.default.createElement(
      'div',
      { className: _FrmSuperLogin2.default.paper },
      _obj ? _react2.default.createElement(
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
            { label: '\u0424\u0438\u0437\u043B\u0438\u0446\u043E', value: 'a' },
            _react2.default.createElement(
              'div',
              { className: _FrmSuperLogin2.default.padding18 },
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'id' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'name' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'sex' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'birth_date' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'birth_place' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'category' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'inn' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'snils' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'citizenship' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0435\u0423\u0434\u043E\u0441\u0442\u043E\u0432\u0435\u0440\u0435\u043D\u0438\u0435' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0441\u0442\u0440\u041C\u0435\u0441\u0442\u043E\u0420\u0430\u0431\u043E\u0442\u044B' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0441\u0442\u0440\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0410\u0434\u0440\u0435\u0441\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0410\u0434\u0440\u0435\u0441\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'phone' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'email' }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'rank' }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_Divider2.default, null),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
                className: _FrmSuperLogin2.default.button,
                onTouchTap: this.handleSave }),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0412\u044B\u0439\u0442\u0438',
                className: _FrmSuperLogin2.default.button,
                onTouchTap: this.handleLogOut })
            )
          ),
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0435\u0442\u0438', value: 'b' },
            _react2.default.createElement(
              'div',
              { className: _FrmSuperLogin2.default.padding18 },
              _react2.default.createElement(
                _Subheader2.default,
                null,
                '\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0430 \u043F\u0440\u043E\u0444\u0438\u043B\u0435\u0439 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0435\u0442\u0435\u0439'
              ),
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Google',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.GoogleIcon, { viewBox: '0 0 256 262', style: { width: 18, height: 18 }, color: _colors.blue500 })
                //onTouchTap={this.buttonTouchTap("google")}
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: '\u042F\u043D\u0434\u0435\u043A\u0441',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.YandexIcon, { viewBox: '0 0 180 190', style: { width: 18, height: 18 }, color: _colors.red500 })
                //onTouchTap={this.buttonTouchTap("yandex")}
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Facebook',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.FacebookIcon, { viewBox: '0 0 450 450', style: { width: 18, height: 18 }, color: '#3A559F' })
                //onTouchTap={this.buttonTouchTap("facebook")}
              }),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_RaisedButton2.default, {
                label: '\u0412 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0435',
                className: _FrmSuperLogin2.default.social_button,
                labelStyle: { width: 120, textAlign: 'left', display: 'inline-block' },
                icon: _react2.default.createElement(_icons.VkontakteIcon, { viewBox: '50 50 400 400', style: { width: 18, height: 18 }, color: '#4c75a3' })
                //onTouchTap={this.buttonTouchTap("vkontakte")}
              })
            )
          )
        )
      ) : _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _FrmSuperLogin2.default.progress })
      )
    );
  }
}
exports.default = UserObj;
UserObj.contextTypes = {
  screen: _react2.default.PropTypes.object.isRequired
};
UserObj.propTypes = {

  _obj: _propTypes2.default.object,
  _acl: _propTypes2.default.string.isRequired,

  handleSave: _propTypes2.default.func.isRequired,
  handleRevert: _propTypes2.default.func.isRequired,
  handleMarkDeleted: _propTypes2.default.func.isRequired,
  handlePost: _propTypes2.default.func.isRequired,
  handleUnPost: _propTypes2.default.func.isRequired,
  handlePrint: _propTypes2.default.func.isRequired,
  handleAttachment: _propTypes2.default.func.isRequired,
  handleValueChange: _propTypes2.default.func.isRequired,
  handleAddRow: _propTypes2.default.func.isRequired,
  handleDelRow: _propTypes2.default.func.isRequired
};