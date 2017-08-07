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

var _IconMenu = require("material-ui/IconMenu");

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _MenuItem = require("material-ui/MenuItem");

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Save = require("material-ui-icons/Save");

var _Save2 = _interopRequireDefault(_Save);

var _Send = require("material-ui-icons/Send");

var _Send2 = _interopRequireDefault(_Send);

var _Delete = require("material-ui-icons/Delete");

var _Delete2 = _interopRequireDefault(_Delete);

var _Close = require("material-ui-icons/Close");

var _Close2 = _interopRequireDefault(_Close);

var _MoreVert = require("material-ui-icons/MoreVert");

var _MoreVert2 = _interopRequireDefault(_MoreVert);

var _Print = require("material-ui-icons/Print");

var _Print2 = _interopRequireDefault(_Print);

var _AttachFile = require("material-ui-icons/AttachFile");

var _AttachFile2 = _interopRequireDefault(_AttachFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataObjToolbar extends _react.Component {

  render() {
    const props = this.props;
    return _react2.default.createElement(
      _Toolbar.Toolbar,
      null,
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group", firstChild: true },
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C", tooltipPosition: "bottom-right", onTouchTap: props.handleSave },
          _react2.default.createElement(_Save2.default, null)
        ),
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043D\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435", tooltipPosition: "bottom-right",
            onTouchTap: props.handleSend },
          _react2.default.createElement(_Send2.default, null)
        ),
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u041E\u0442\u043E\u0437\u0432\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437", onTouchTap: props.handleMarkDeleted },
          _react2.default.createElement(_Delete2.default, null)
        )
      ),
      _react2.default.createElement(
        _Toolbar.ToolbarGroup,
        { className: "meta-toolbar-group" },
        _react2.default.createElement(
          _IconMenu2.default,
          {
            iconButtonElement: _react2.default.createElement(
              _IconButton2.default,
              { touch: true, tooltip: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E" },
              _react2.default.createElement(_MoreVert2.default, null)
            )
          },
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u041F\u0435\u0447\u0430\u0442\u044C", leftIcon: _react2.default.createElement(_Print2.default, null), onTouchTap: props.handlePrint }),
          _react2.default.createElement(_MenuItem2.default, { primaryText: "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F", leftIcon: _react2.default.createElement(_AttachFile2.default, null), onTouchTap: props.handleAttachment })
        ),
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443", tooltipPosition: "bottom-left", onTouchTap: props.handleClose },
          _react2.default.createElement(_Close2.default, null)
        )
      )
    );
  }
}
exports.default = DataObjToolbar;
DataObjToolbar.propTypes = {

  handleSave: _propTypes2.default.func.isRequired, // обработчик добавления объекта
  handleSend: _propTypes2.default.func.isRequired, // команда Отправить
  handleMarkDeleted: _propTypes2.default.func.isRequired, // команда Отозвать

  handlePrint: _propTypes2.default.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _propTypes2.default.func.isRequired, // обработчик открытия диалога присоединенных файлов
  handleClose: _propTypes2.default.func.isRequired // команда Закрыть форму

};