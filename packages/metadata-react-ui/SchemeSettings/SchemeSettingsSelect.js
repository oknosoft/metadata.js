"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Toolbar = require("material-ui/Toolbar");

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _DataField = require("../DataField");

var _DataField2 = _interopRequireDefault(_DataField);

var _Divider = require("material-ui/Divider");

var _Divider2 = _interopRequireDefault(_Divider);

var _save = require("material-ui/svg-icons/content/save");

var _save2 = _interopRequireDefault(_save);

var _contentCopy = require("material-ui/svg-icons/content/content-copy");

var _contentCopy2 = _interopRequireDefault(_contentCopy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SchemeSettingsSelect extends _react.Component {

  constructor(props, context) {

    super(props, context);

    _initialiseProps.call(this);

    const { scheme } = props;
    const { $p } = context;

    this.state = $p.dp.scheme_settings.dp(scheme);
  }

  render() {

    const { state, props, handleCreate, handleSave, handleNameChange } = this;
    const { _obj, _meta } = state;
    const { scheme, handleSchemeChange, minHeight } = props;

    return _react2.default.createElement(
      "div",
      { style: { height: minHeight } },
      _react2.default.createElement(
        _Toolbar.Toolbar,
        null,
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          { className: "meta-toolbar-group", firstChild: true },
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A", tooltipPosition: "bottom-right", onTouchTap: handleSave },
            _react2.default.createElement(_save2.default, null)
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u043F\u0438\u044E \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A", tooltipPosition: "bottom-right", onTouchTap: handleCreate },
            _react2.default.createElement(_contentCopy2.default, null)
          )
        ),
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          { className: "meta-toolbar-group" },
          _react2.default.createElement(_Toolbar.ToolbarTitle, { text: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430" }),
          _react2.default.createElement(
            "div",
            { style: { width: 200 } },
            _react2.default.createElement(_DataField.FieldSelect, {
              ref: "fld_scheme",
              _obj: _obj,
              _fld: "scheme",
              _meta: _meta,
              handleValueChange: handleSchemeChange
            })
          )
        )
      ),
      _react2.default.createElement("div", { style: { marginTop: 16 } }),
      _react2.default.createElement(_DataField2.default, {
        _obj: scheme,
        _fld: "name",
        handleValueChange: handleNameChange
      }),
      _react2.default.createElement(_DataField2.default, {
        _obj: scheme,
        _fld: "query"
      })
    );
  }
}
exports.default = SchemeSettingsSelect; /**
                                         * ### Выбор варианта сохраненных настроек
                                         * @module SchemeSettingsSelect
                                         *
                                         * Created 19.12.2016
                                         */

SchemeSettingsSelect.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
SchemeSettingsSelect.propTypes = {
  scheme: _react.PropTypes.object.isRequired,
  handleSchemeChange: _react.PropTypes.func.isRequired,
  minHeight: _react.PropTypes.number
};

var _initialiseProps = function () {
  this.handleSave = () => {
    const { scheme, handleSchemeChange } = this.props;
    scheme.save().then(() => {
      handleSchemeChange(scheme);
    });
  };

  this.handleCreate = () => {
    const { scheme, handleSchemeChange } = this.props;
    const proto = Object.assign({}, scheme._obj);
    proto.name = proto.name.replace(/[0-9]/g, '') + Math.floor(10 + Math.random() * 21);
    proto.ref = "";

    scheme._manager.create(proto).then(scheme => {
      handleSchemeChange(scheme);
    });
  };

  this.handleNameChange = () => {
    this.refs.fld_scheme.forceUpdate();
  };
};