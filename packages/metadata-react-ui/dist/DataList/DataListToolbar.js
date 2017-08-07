"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Toolbar = require("material-ui/Toolbar");

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _IconMenu = require("material-ui/IconMenu");

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _AddCircleOutline = require("material-ui-icons/AddCircleOutline");

var _AddCircleOutline2 = _interopRequireDefault(_AddCircleOutline);

var _Delete = require("material-ui-icons/Delete");

var _Delete2 = _interopRequireDefault(_Delete);

var _Edit = require("material-ui-icons/Edit");

var _Edit2 = _interopRequireDefault(_Edit);

var _MoreVert = require("material-ui-icons/MoreVert");

var _MoreVert2 = _interopRequireDefault(_MoreVert);

var _Print = require("material-ui-icons/Print");

var _Print2 = _interopRequireDefault(_Print);

var _AttachFile = require("material-ui-icons/AttachFile");

var _AttachFile2 = _interopRequireDefault(_AttachFile);

var _PlaylistAddCheck = require("material-ui-icons/PlaylistAddCheck");

var _PlaylistAddCheck2 = _interopRequireDefault(_PlaylistAddCheck);

var _SchemeSettings = require("../SchemeSettings");

var _SchemeSettings2 = _interopRequireDefault(_SchemeSettings);

var _DataListToolbar = require("./DataListToolbar.scss");

var _DataListToolbar2 = _interopRequireDefault(_DataListToolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataListToolbar extends _react.Component {

  render() {

    const { props } = this;

    const buttons = [];

    if (props.selection_mode) {
      buttons.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "select", touch: true, tooltip: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430", tooltipPosition: "bottom-right", onTouchTap: props.handleSelect },
        _react2.default.createElement(_PlaylistAddCheck2.default, null)
      ));
    }

    if (!props.deny_add_del) {
      buttons.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "create", touch: true, tooltip: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442", tooltipPosition: "bottom-right", onTouchTap: props.handleAdd },
        _react2.default.createElement(_AddCircleOutline2.default, null)
      ));
      buttons.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "edit", touch: true, tooltip: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443 \u043E\u0431\u044A\u0435\u043A\u0442\u0430", tooltipPosition: "bottom-right", onTouchTap: props.handleEdit },
        _react2.default.createElement(_Edit2.default, null)
      ));
      buttons.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "del", touch: true, tooltip: "\u041F\u043E\u043C\u0435\u0442\u0438\u0442\u044C \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435", tooltipPosition: "bottom-center", onTouchTap: props.handleRemove },
        _react2.default.createElement(_Delete2.default, null)
      ));
    }

    return _react2.default.createElement(
      _Toolbar.Toolbar,
      { className: _DataListToolbar2.default.dataListToolbar },
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group", firstChild: true },
        buttons
      ),
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group" },
        _react2.default.createElement(_SchemeSettings2.default, {
          handleSchemeChange: props.handleSchemeChange,
          scheme: props.scheme,
          show_search: props.show_search,
          show_variants: props.show_variants }),
        _react2.default.createElement(
          _IconMenu2.default,
          {
            iconButtonElement: _react2.default.createElement(
              _IconButton2.default,
              { touch: true, tooltip: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E", tooltipPosition: "bottom-left" },
              _react2.default.createElement(_MoreVert2.default, null)
            ) },
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041F\u0435\u0447\u0430\u0442\u044C", leftIcon: _react2.default.createElement(_Print2.default, null), onTouchTap: props.handlePrint }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F", leftIcon: _react2.default.createElement(_AttachFile2.default, null), onTouchTap: props.handleAttachment })
        )
      )
    );
  }
}
exports.default = DataListToolbar;
DataListToolbar.propTypes = {
  selection_mode: _propTypes2.default.bool, // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
  deny_add_del: _propTypes2.default.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

  handleAdd: _propTypes2.default.func.isRequired, // обработчик добавления объекта
  handleEdit: _propTypes2.default.func.isRequired, // обработчик открфтия формы редактора
  handleRemove: _propTypes2.default.func.isRequired, // обработчик удаления строки

  handleSchemeChange: _propTypes2.default.func.isRequired, // обработчик при изменении настроек компоновки
  scheme: _propTypes2.default.object.isRequired, // значение настроек компоновки

  handlePrint: _propTypes2.default.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _propTypes2.default.func.isRequired // обработчик открытия диалога присоединенных файлов
};