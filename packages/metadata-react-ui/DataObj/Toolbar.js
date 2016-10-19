'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

var DataObjToolbar = function (_Component) {
  (0, _inherits3.default)(DataObjToolbar, _Component);

  function DataObjToolbar() {
    (0, _classCallCheck3.default)(this, DataObjToolbar);
    return (0, _possibleConstructorReturn3.default)(this, (DataObjToolbar.__proto__ || (0, _getPrototypeOf2.default)(DataObjToolbar)).apply(this, arguments));
  }

  (0, _createClass3.default)(DataObjToolbar, [{
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

exports.default = DataObjToolbar;
process.env.NODE_ENV !== "production" ? DataObjToolbar.propTypes = {

  handleSave: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleSend: _react.PropTypes.func.isRequired, // команда Отправить
  handleMarkDeleted: _react.PropTypes.func.isRequired, // команда Отозвать

  handlePrint: _react.PropTypes.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func.isRequired, // обработчик открытия диалога присоединенных файлов
  handleClose: _react.PropTypes.func.isRequired } : void 0;