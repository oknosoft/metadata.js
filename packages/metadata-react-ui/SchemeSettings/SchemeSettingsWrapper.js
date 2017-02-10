"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _settings = require("material-ui/svg-icons/action/settings");

var _settings2 = _interopRequireDefault(_settings);

var _Dialog = require("material-ui/Dialog");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _FlatButton = require("material-ui/FlatButton");

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _TextField = require("material-ui/TextField");

var _TextField2 = _interopRequireDefault(_TextField);

var _DropDownMenu = require("material-ui/DropDownMenu");

var _DropDownMenu2 = _interopRequireDefault(_DropDownMenu);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _SchemeSettingsTabs = require("./SchemeSettingsTabs");

var _SchemeSettingsTabs2 = _interopRequireDefault(_SchemeSettingsTabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SchemeSettingsWrapper extends _react.Component {

  constructor(props, context) {

    super(props, context);

    _initialiseProps.call(this);

    const { scheme } = props;

    this.state = {
      scheme,
      open: false,
      variants: [scheme]
    };

    scheme._manager.get_option_list({
      _top: 40,
      obj: scheme.obj
    }).then(variants => {
      this.setState({ variants });
    });
  }

  render() {

    const { props, state, handleOpen, handleOk, handleClose, handleSchemeChange, handleSearchChange, handleVariantChange } = this;
    const { open, scheme, variants } = state;
    const { show_search, show_variants, tabParams } = props;

    const actions = [_react2.default.createElement(_FlatButton2.default, {
      label: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",
      primary: true,
      keyboardFocused: true,
      onTouchTap: handleOk
    }), _react2.default.createElement(_FlatButton2.default, {
      label: "\u041E\u0442\u043C\u0435\u043D\u0430",
      secondary: true,
      onTouchTap: handleClose
    })];

    const menuitems = [];
    if (show_variants && scheme) {
      variants.forEach(v => {
        menuitems.push(_react2.default.createElement(_MenuItem2.default, { value: v.ref, key: v.ref, primaryText: v.name }));
      });
    }

    return _react2.default.createElement(
      "div",
      null,
      show_search ? _react2.default.createElement(_TextField2.default, {
        name: "search",
        ref: search => {
          this.searchInput = search;
        },
        width: 300,
        underlineShow: false,
        style: { backgroundColor: 'white', height: 36, top: -6, padding: 6 },
        onChange: handleSearchChange,
        disabled: true
      }) : null,
      show_variants && scheme ? _react2.default.createElement(
        _DropDownMenu2.default,
        {
          ref: ref => {
            if (ref) {
              const { style } = ref.rootNode.firstChild.children[1];
              style.lineHeight = '36px';
              style.top = '6px';
            }
          },
          maxHeight: 300,
          value: scheme.ref,
          onChange: handleVariantChange },
        menuitems
      ) : null,
      _react2.default.createElement(
        _IconButton2.default,
        { touch: true, tooltip: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430", onTouchTap: handleOpen },
        _react2.default.createElement(_settings2.default, null)
      ),
      _react2.default.createElement(
        _Dialog2.default,
        {
          title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430",
          actions: actions,
          modal: false,
          autoScrollBodyContent: true,
          open: open,
          onRequestClose: handleClose
        },
        _react2.default.createElement(_SchemeSettingsTabs2.default, {
          handleSchemeChange: handleSchemeChange,
          scheme: scheme,
          tabParams: tabParams
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
  tabParams: _react.PropTypes.object, // конструктор пользовательской панели параметров
  show_search: _react.PropTypes.bool, // показывать поле поиска
  show_variants: _react.PropTypes.bool };

var _initialiseProps = function () {
  this.handleOpen = () => {
    this.setState({ open: true });
  };

  this.handleClose = () => {
    this.setState({ open: false });
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