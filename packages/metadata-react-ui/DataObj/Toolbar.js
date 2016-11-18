'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Toolbar = require('material-ui/Toolbar');

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _save = require('material-ui/svg-icons/content/save');

var _save2 = _interopRequireDefault(_save);

var _send = require('material-ui/svg-icons/content/send');

var _send2 = _interopRequireDefault(_send);

var _delete = require('material-ui/svg-icons/action/delete');

var _delete2 = _interopRequireDefault(_delete);

var _close = require('material-ui/svg-icons/navigation/close');

var _close2 = _interopRequireDefault(_close);

var _IconMenu = require('material-ui/IconMenu');

var _IconMenu2 = _interopRequireDefault(_IconMenu);

var _moreVert = require('material-ui/svg-icons/navigation/more-vert');

var _moreVert2 = _interopRequireDefault(_moreVert);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _print = require('material-ui/svg-icons/action/print');

var _print2 = _interopRequireDefault(_print);

var _attachFile = require('material-ui/svg-icons/editor/attach-file');

var _attachFile2 = _interopRequireDefault(_attachFile);

var _DataObj = require('./DataObj.scss');

var _DataObj2 = _interopRequireDefault(_DataObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataObjToolbar = function (_Component) {
  _inherits(DataObjToolbar, _Component);

  function DataObjToolbar() {
    _classCallCheck(this, DataObjToolbar);

    return _possibleConstructorReturn(this, (DataObjToolbar.__proto__ || Object.getPrototypeOf(DataObjToolbar)).apply(this, arguments));
  }

  _createClass(DataObjToolbar, [{
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        _Toolbar.Toolbar,
        { className: _DataObj2.default.toolbar },
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          { firstChild: true },
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C', tooltipPosition: 'bottom-right', onTouchTap: props.handleSave },
            _react2.default.createElement(_save2.default, null)
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043D\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u0438\u0435', tooltipPosition: 'bottom-right', onTouchTap: props.handleSend },
            _react2.default.createElement(_send2.default, null)
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u041E\u0442\u043E\u0437\u0432\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437', onTouchTap: props.handleMarkDeleted },
            _react2.default.createElement(_delete2.default, null)
          )
        ),
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          null,
          _react2.default.createElement(
            _IconMenu2.default,
            {
              iconButtonElement: _react2.default.createElement(
                _IconButton2.default,
                { touch: true, tooltip: '\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E' },
                _react2.default.createElement(_moreVert2.default, null)
              )
            },
            _react2.default.createElement(_MenuItem2.default, { primaryText: '\u041F\u0435\u0447\u0430\u0442\u044C', leftIcon: _react2.default.createElement(_print2.default, null), onTouchTap: props.handlePrint }),
            _react2.default.createElement(_MenuItem2.default, { primaryText: '\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F', leftIcon: _react2.default.createElement(_attachFile2.default, null), onTouchTap: props.handleAttachment })
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443', tooltipPosition: 'bottom-left', onTouchTap: props.handleClose },
            _react2.default.createElement(_close2.default, null)
          )
        )
      );
    }
  }]);

  return DataObjToolbar;
}(_react.Component);

DataObjToolbar.propTypes = {

  handleSave: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleSend: _react.PropTypes.func.isRequired, // команда Отправить
  handleMarkDeleted: _react.PropTypes.func.isRequired, // команда Отозвать

  handlePrint: _react.PropTypes.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func.isRequired, // обработчик открытия диалога присоединенных файлов
  handleClose: _react.PropTypes.func.isRequired };
exports.default = DataObjToolbar;