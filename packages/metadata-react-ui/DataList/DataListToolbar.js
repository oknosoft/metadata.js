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

var _edit = require("material-ui/svg-icons/image/edit");

var _edit2 = _interopRequireDefault(_edit);

var _IconMenu = require("material-ui/IconMenu");

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _moreVert = require("material-ui/svg-icons/navigation/more-vert");

var _moreVert2 = _interopRequireDefault(_moreVert);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _print = require("material-ui/svg-icons/action/print");

var _print2 = _interopRequireDefault(_print);

var _attachFile = require("material-ui/svg-icons/editor/attach-file");

var _attachFile2 = _interopRequireDefault(_attachFile);

var _playlistAddCheck = require("material-ui/svg-icons/av/playlist-add-check");

var _playlistAddCheck2 = _interopRequireDefault(_playlistAddCheck);

var _SchemeSettings = require("../SchemeSettings");

var _SchemeSettings2 = _interopRequireDefault(_SchemeSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataListToolbar extends _react.Component {

  render() {
    const props = this.props;
    return _react2.default.createElement(
      _Toolbar.Toolbar,
      null,
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group", firstChild: true },
        props.selection_mode ? _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430", tooltipPosition: "bottom-right",
            onTouchTap: props.handleSelect },
          _react2.default.createElement(_playlistAddCheck2.default, null)
        ) : null,
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442", tooltipPosition: "bottom-right", onTouchTap: props.handleAdd },
          _react2.default.createElement(_addCircleOutline2.default, null)
        ),
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443 \u043E\u0431\u044A\u0435\u043A\u0442\u0430", tooltipPosition: "bottom-right",
            onTouchTap: props.handleEdit },
          _react2.default.createElement(_edit2.default, null)
        ),
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u041F\u043E\u043C\u0435\u0442\u0438\u0442\u044C \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435", tooltipPosition: "bottom-center",
            onTouchTap: props.handleRemove },
          _react2.default.createElement(_delete2.default, null)
        )
      ),
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group" },
        _react2.default.createElement(_SchemeSettings2.default, {
          handleSchemeChange: props.handleSchemeChange,
          scheme: props.scheme
        }),
        _react2.default.createElement(
          _IconMenu2.default,
          {
            iconButtonElement: _react2.default.createElement(
              _IconButton2.default,
              { touch: true, tooltip: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E", tooltipPosition: "bottom-left" },
              _react2.default.createElement(_moreVert2.default, null)
            )
          },
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041F\u0435\u0447\u0430\u0442\u044C", leftIcon: _react2.default.createElement(_print2.default, null), onTouchTap: props.handlePrint }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F", leftIcon: _react2.default.createElement(_attachFile2.default, null), onTouchTap: props.handleAttachment })
        )
      )
    );
  }
}
exports.default = DataListToolbar;
DataListToolbar.propTypes = {

  selection_mode: _react.PropTypes.bool, // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора

  handleAdd: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleEdit: _react.PropTypes.func.isRequired, // обработчик открфтия формы редактора
  handleRemove: _react.PropTypes.func.isRequired, // обработчик удаления строки

  handleSchemeChange: _react.PropTypes.func.isRequired, // обработчик при изменении настроек компоновки
  scheme: _react.PropTypes.object.isRequired, // значение настроек компоновки

  handlePrint: _react.PropTypes.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func.isRequired };