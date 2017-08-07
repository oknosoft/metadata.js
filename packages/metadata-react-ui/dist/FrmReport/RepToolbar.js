"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _Toolbar = require("material-ui/Toolbar");

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _FlatButton = require("material-ui/FlatButton");

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _IconMenu = require("material-ui/IconMenu");

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _PlayArrow = require("material-ui-icons/PlayArrow");

var _PlayArrow2 = _interopRequireDefault(_PlayArrow);

var _MoreVert = require("material-ui-icons/MoreVert");

var _MoreVert2 = _interopRequireDefault(_MoreVert);

var _Print = require("material-ui-icons/Print");

var _Print2 = _interopRequireDefault(_Print);

var _ContentCopy = require("material-ui-icons/ContentCopy");

var _ContentCopy2 = _interopRequireDefault(_ContentCopy);

var _CloudDownload = require("material-ui-icons/CloudDownload");

var _CloudDownload2 = _interopRequireDefault(_CloudDownload);

var _FileDownload = require("material-ui-icons/FileDownload");

var _FileDownload2 = _interopRequireDefault(_FileDownload);

var _SchemeSettings = require("../SchemeSettings");

var _SchemeSettings2 = _interopRequireDefault(_SchemeSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RepToolbar extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    context.$p.UI.export_handlers.call(this);
  }

  render() {

    const { handleExportXLS, handleExportJSON, handleExportCSV, props } = this;
    const { handleSave, handleClose, handleSchemeChange, handlePrint, scheme, _obj, _tabular, TabParams } = props;

    return _react2.default.createElement(
      _Toolbar.Toolbar,
      null,
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group", firstChild: true },
        _react2.default.createElement(_FlatButton2.default, {
          label: "\u0421\u0444\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
          onTouchTap: handleSave,
          icon: _react2.default.createElement(_PlayArrow2.default, null)
        })
      ),
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group" },
        _react2.default.createElement(_SchemeSettings2.default, {
          handleSchemeChange: handleSchemeChange,
          scheme: scheme,
          tabParams: TabParams ? _react2.default.createElement(TabParams, {
            _obj: _obj,
            scheme: scheme
          }) : null,
          show_variants: true
        }),
        _react2.default.createElement(
          _IconMenu2.default,
          {
            iconButtonElement: _react2.default.createElement(
              _IconButton2.default,
              { touch: true, tooltip: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E", tooltipPosition: "bottom-left" },
              _react2.default.createElement(_MoreVert2.default, null)
            )
          },
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041F\u0435\u0447\u0430\u0442\u044C", leftIcon: _react2.default.createElement(_Print2.default, null), disabled: true, onTouchTap: handlePrint }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C CSV", leftIcon: _react2.default.createElement(_ContentCopy2.default, null), onTouchTap: handleExportCSV }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C JSON", leftIcon: _react2.default.createElement(_CloudDownload2.default, null), onTouchTap: handleExportJSON }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432 XLS", leftIcon: _react2.default.createElement(_FileDownload2.default, null), onTouchTap: handleExportXLS })
        )
      )
    );
  }
}
exports.default = RepToolbar;
RepToolbar.propTypes = {

  handleSave: _propTypes2.default.func.isRequired, // обработчик формирования отчета
  handlePrint: _propTypes2.default.func.isRequired, // обработчик открытия диалога печати
  handleClose: _propTypes2.default.func.isRequired, // команда закрытия формы

  handleSchemeChange: _propTypes2.default.func.isRequired, // обработчик при изменении настроек компоновки
  scheme: _propTypes2.default.object.isRequired, // значение настроек компоновки

  TabParams: _propTypes2.default.func, // внешний компонент страницы параметров

  _obj: _propTypes2.default.object,
  _tabular: _propTypes2.default.string.isRequired

};