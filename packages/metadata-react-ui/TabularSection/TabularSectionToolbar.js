"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Toolbar = require("material-ui/Toolbar");

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _addCircleOutline = require("material-ui/svg-icons/content/add-circle-outline");

var _addCircleOutline2 = _interopRequireDefault(_addCircleOutline);

var _delete = require("material-ui/svg-icons/action/delete");

var _delete2 = _interopRequireDefault(_delete);

var _arrowUpward = require("material-ui/svg-icons/navigation/arrow-upward");

var _arrowUpward2 = _interopRequireDefault(_arrowUpward);

var _arrowDownward = require("material-ui/svg-icons/navigation/arrow-downward");

var _arrowDownward2 = _interopRequireDefault(_arrowDownward);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabularSectionToolbar extends _react.Component {

  render() {

    const { handleAdd, handleRemove, handleUp, handleDown, deny_add_del, deny_reorder } = this.props;

    const first_group = [];

    if (!deny_add_del) {
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_add", touch: true, tooltip: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443", tooltipPosition: "bottom-right", onTouchTap: handleAdd },
        _react2.default.createElement(_addCircleOutline2.default, { key: "icon_add" })
      ));
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_del", touch: true, tooltip: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443", tooltipPosition: "bottom-right", onTouchTap: handleRemove },
        _react2.default.createElement(_delete2.default, { key: "icon_del" })
      ));

      if (!deny_reorder) {
        first_group.push(_react2.default.createElement(_Toolbar.ToolbarSeparator, { key: "sep1" }));
      }
    }

    if (!deny_reorder) {
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_up", touch: true, tooltip: "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432\u0432\u0435\u0440\u0445", tooltipPosition: "bottom-right", onTouchTap: handleUp },
        _react2.default.createElement(_arrowUpward2.default, { key: "icon_up" })
      ));
      first_group.push(_react2.default.createElement(
        _IconButton2.default,
        { key: "btn_down", touch: true, tooltip: "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u0437", tooltipPosition: "bottom-right", onTouchTap: handleDown },
        _react2.default.createElement(_arrowDownward2.default, { key: "icon_down" })
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

  handleAdd: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleRemove: _react.PropTypes.func.isRequired, // обработчик удаления строки
  handleUp: _react.PropTypes.func.isRequired, // обработчик удаления строки
  handleDown: _react.PropTypes.func.isRequired, // обработчик удаления строки

  deny_add_del: _react.PropTypes.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  deny_reorder: _react.PropTypes.bool };