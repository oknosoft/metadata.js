'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _settings = require('material-ui/svg-icons/action/settings');

var _settings2 = _interopRequireDefault(_settings);

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _SchemeSettingsTabs = require('./SchemeSettingsTabs');

var _SchemeSettingsTabs2 = _interopRequireDefault(_SchemeSettingsTabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SchemeSettingsWrapper extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      open: false
    }, this.handleOpen = () => {
      this.setState({ open: true });
    }, this.handleClose = () => {
      this.setState({ open: false });
    }, this.handleOk = () => {
      this.handleClose();
      this.props.handleSchemeChange(this.state.scheme || this.props.scheme);
    }, this.handleSchemeChange = scheme => {
      this.props.handleSchemeChange(scheme);
      this.setState({ scheme });
    }, _temp;
  }

  render() {

    const { props, state, handleOpen, handleOk, handleClose, handleSchemeChange } = this;
    const { open, scheme } = state;

    const actions = [_react2.default.createElement(_FlatButton2.default, {
      label: '\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C',
      primary: true,
      keyboardFocused: true,
      onTouchTap: handleOk
    }), _react2.default.createElement(_FlatButton2.default, {
      label: '\u041E\u0442\u043C\u0435\u043D\u0430',
      secondary: true,
      onTouchTap: handleClose
    })];

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _IconButton2.default,
        { touch: true, tooltip: '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430', onTouchTap: handleOpen },
        _react2.default.createElement(_settings2.default, null)
      ),
      _react2.default.createElement(
        _Dialog2.default,
        {
          title: '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430',
          actions: actions,
          modal: false,
          autoScrollBodyContent: true,
          open: open,
          onRequestClose: handleClose
        },
        _react2.default.createElement(_SchemeSettingsTabs2.default, {
          handleSchemeChange: handleSchemeChange,
          scheme: scheme || props.scheme,
          tabParams: props.tabParams
        })
      )
    );
  }

}
exports.default = SchemeSettingsWrapper; /**
                                          * ### Контейнер сохраненных настроек
                                          * Кнопка открытия + диалог
                                          *
                                          * @module SchemeSettingsWrapper
                                          *
                                          * Created 31.12.2016
                                          */

SchemeSettingsWrapper.propTypes = {
  scheme: _react.PropTypes.object.isRequired,
  handleSchemeChange: _react.PropTypes.func.isRequired,
  tabParams: _react.PropTypes.object
};