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

var _AddCircleOutline = require("material-ui-icons/AddCircleOutline");

var _AddCircleOutline2 = _interopRequireDefault(_AddCircleOutline);

var _Delete = require("material-ui-icons/Delete");

var _Delete2 = _interopRequireDefault(_Delete);

var _ArrowUpward = require("material-ui-icons/ArrowUpward");

var _ArrowUpward2 = _interopRequireDefault(_ArrowUpward);

var _ArrowDownward = require("material-ui-icons/ArrowDownward");

var _ArrowDownward2 = _interopRequireDefault(_ArrowDownward);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabularSectionToolbar extends _react.Component {

  render() {

    const { handleAdd, handleRemove, handleUp, handleDown, deny_add_del, deny_reorder } = this.props;

    const first_group = [];

    if (!deny_add_del) {
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_add", touch: true, tooltip: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443", tooltipPosition: "bottom-right", onTouchTap: handleAdd },
        _react2.default.createElement(_AddCircleOutline2.default, { key: "icon_add" })
      ));
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_del", touch: true, tooltip: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443", tooltipPosition: "bottom-right", onTouchTap: handleRemove },
        _react2.default.createElement(_Delete2.default, { key: "icon_del" })
      ));

      if (!deny_reorder) {
        first_group.push(_react2.default.createElement(_Toolbar.ToolbarSeparator, { key: "sep1" }));
      }
    }

    if (!deny_reorder) {
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_up", touch: true, tooltip: "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432\u0432\u0435\u0440\u0445", tooltipPosition: "bottom-right", onTouchTap: handleUp },
        _react2.default.createElement(_ArrowUpward2.default, { key: "icon_up" })
      ));
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_down", touch: true, tooltip: "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u0437", tooltipPosition: "bottom-right", onTouchTap: handleDown },
        _react2.default.createElement(_ArrowDownward2.default, { key: "icon_down" })
      ));
    }

    return _react2.default.createElement(
      _Toolbar.Toolbar,
      null,
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group", firstChild: true },
        first_group
      )
    );
  }
}
exports.default = TabularSectionToolbar;
TabularSectionToolbar.propTypes = {

  handleAdd: _propTypes2.default.func.isRequired, // обработчик добавления объекта
  handleRemove: _propTypes2.default.func.isRequired, // обработчик удаления строки
  handleUp: _propTypes2.default.func.isRequired, // обработчик удаления строки
  handleDown: _propTypes2.default.func.isRequired, // обработчик удаления строки

  deny_add_del: _propTypes2.default.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  deny_reorder: _propTypes2.default.bool // Запрет изменения порядка строк

};