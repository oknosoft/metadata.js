"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Settings = require("material-ui-icons/Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _RaisedButton = require("material-ui/RaisedButton");

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _FlatButton = require("material-ui/FlatButton");

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _TextField = require("material-ui/TextField");

var _TextField2 = _interopRequireDefault(_TextField);

var _DropDownMenu = require("material-ui/DropDownMenu");

var _DropDownMenu2 = _interopRequireDefault(_DropDownMenu);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Dialog = require("metadata-ui/Dialog");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _SchemeSettingsTabs = require("./SchemeSettingsTabs");

var _SchemeSettingsWrapper = require("./styles/SchemeSettingsWrapper.scss");

var _SchemeSettingsWrapper2 = _interopRequireDefault(_SchemeSettingsWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Контейнер сохраненных настроек
 * Кнопка открытия + диалог
 *
 * @module SchemeSettingsWrapper
 *
 * Created 31.12.2016
 */

class SchemeSettingsWrapper extends _react.Component {

  constructor(props, context) {
    super(props, context);

    _initialiseProps.call(this);

    const { scheme } = props;

    this.state = {
      scheme,
      open: false,
      fullscreen: false,
      variants: [scheme]
    };

    scheme._manager.get_option_list({
      _top: 40,
      obj: scheme.obj
    }).then(variants => {
      this.setState({ variants });
    });
  }

  handleCloseClick() {
    this.setState({
      open: false
    });
  }

  handleFullscreenClick() {
    this.setState({
      fullscreen: !this.state.fullscreen
    });
  }

  render() {
    const { props, state, handleOpen, handleOk, handleClose, handleSchemeChange, handleSearchChange, handleVariantChange } = this;
    const { open, scheme, variants } = state;
    const { show_search, show_variants, tabParams } = props;

    const actions = [_react2.default.createElement(_FlatButton2.default, {
      key: 0,
      label: "\u041E\u0442\u043C\u0435\u043D\u0430",
      secondary: true,
      onTouchTap: handleClose }), _react2.default.createElement(_RaisedButton2.default, {
      key: 1,
      label: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",
      primary: true,
      onTouchTap: handleOk })];

    const menuitems = [];
    if (show_variants && scheme) {
      variants.forEach(v => {
        menuitems.push(_react2.default.createElement(_MenuItem2.default, { value: v.ref, key: v.ref, primaryText: v.name }));
      });
    }

    return _react2.default.createElement(
      "div",
      { className: _SchemeSettingsWrapper2.default.schemeSettingsWrapper },
      show_search ? _react2.default.createElement(_TextField2.default, {
        name: "search",
        ref: search => {
          this.searchInput = search;
        },
        width: 300,
        underlineShow: false,
        className: _SchemeSettingsWrapper2.default.searchBox,
        onChange: handleSearchChange,
        disabled: true }) : null,
      show_variants && scheme ? _react2.default.createElement(
        _DropDownMenu2.default,
        {
          className: _SchemeSettingsWrapper2.default.schemeVariants,
          maxHeight: 300,
          labelStyle: {
            lineHeight: "48px"
          },
          value: scheme.ref,
          onChange: handleVariantChange },
        menuitems
      ) : null,
      _react2.default.createElement(
        _IconButton2.default,
        { touch: true, tooltip: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430", onTouchTap: handleOpen },
        _react2.default.createElement(_Settings2.default, null)
      ),
      _react2.default.createElement(_Dialog2.default, {
        title: "Настройка моего списка",
        actions: actions,
        tabs: (0, _SchemeSettingsTabs.getTabsContent)(scheme, handleSchemeChange, tabParams),
        resizable: true,
        visible: open,
        width: 700,
        height: 500,
        fullscreen: this.state.fullscreen,
        onFullScreenClick: () => this.handleFullscreenClick(),
        onCloseClick: () => this.handleCloseClick() })
    );
  }
}
exports.default = SchemeSettingsWrapper;
SchemeSettingsWrapper.propTypes = {
  scheme: _propTypes2.default.object.isRequired,
  handleSchemeChange: _propTypes2.default.func.isRequired,
  tabParams: _propTypes2.default.object, // конструктор пользовательской панели параметров
  show_search: _propTypes2.default.bool, // показывать поле поиска
  show_variants: _propTypes2.default.bool // показывать список вариантов настройки динсписка
};

var _initialiseProps = function () {
  this.handleOpen = () => {
    this.setState({
      open: true
    });
  };

  this.handleClose = () => {
    this.setState({
      open: false
    });
  };

  this.handleOk = () => {
    this.handleClose();
    this.props.handleSchemeChange(this.state.scheme);
  };

  this.handleSchemeChange = scheme => {
    this.props.handleSchemeChange(scheme);
    this.setState({ scheme });
  };

  this.handleSearchChange = (event, newValue) => {};

  this.handleVariantChange = (event, index, value) => {
    const { _manager } = this.state.scheme;
    this.handleSchemeChange(_manager.get(value));
  };

  this.componentDidMount = () => {
    if (this.searchInput) {
      this.searchInput.input.placeholder = "Найти...";
    }
  };
};