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

var _addCircleOutline = require('material-ui/svg-icons/content/add-circle-outline');

var _addCircleOutline2 = _interopRequireDefault(_addCircleOutline);

var _delete = require('material-ui/svg-icons/action/delete');

var _delete2 = _interopRequireDefault(_delete);

var _edit = require('material-ui/svg-icons/image/edit');

var _edit2 = _interopRequireDefault(_edit);

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

var _DataSelection = require('../DataSelection');

var _DataSelection2 = _interopRequireDefault(_DataSelection);

var _DataList = {
  'toolbar': 'DataList__toolbar___3Q5r-',
  'List': 'DataList__List___3p2A7',
  'row': 'DataList__row___1c_lE',
  'placeholder': 'DataList__placeholder___J261_',
  'cacheButtonAndCountRow': 'DataList__cacheButtonAndCountRow___egWjE',
  'button': 'DataList__button___19gJP',
  'cacheCountRow': 'DataList__cacheCountRow___3UENX',
  'GridRow': 'DataList__GridRow___3PGBi',
  'GridColumn': 'DataList__GridColumn___1USDI',
  'LeftSideGridContainer': 'DataList__LeftSideGridContainer___3Uunq',
  'BodyGrid': 'DataList__BodyGrid___1XFoZ',
  'evenRow': 'DataList__evenRow___1XGC4',
  'oddRow': 'DataList__oddRow___2fnJh',
  'hoveredItem': 'DataList__hoveredItem___19vQ-',
  'selectedItem': 'DataList__selectedItem___1U89O',
  'cell': 'DataList__cell___1VYGH',
  'headerCell': 'DataList__headerCell___3j1ZO',
  'centeredCell': 'DataList__centeredCell___-B0cc',
  'letterCell': 'DataList__letterCell___2vRdC',
  'noCells': 'DataList__noCells___1iZxL'
};

var _DataList2 = _interopRequireDefault(_DataList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataListToolbar = function (_Component) {
  (0, _inherits3.default)(DataListToolbar, _Component);

  function DataListToolbar() {
    (0, _classCallCheck3.default)(this, DataListToolbar);
    return (0, _possibleConstructorReturn3.default)(this, (DataListToolbar.__proto__ || (0, _getPrototypeOf2.default)(DataListToolbar)).apply(this, arguments));
  }

  (0, _createClass3.default)(DataListToolbar, [{
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        _Toolbar.Toolbar,
        { className: _DataList2.default.toolbar },
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          { firstChild: true },
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442', tooltipPosition: 'bottom-right', onTouchTap: props.handleAdd },
            _react2.default.createElement(_addCircleOutline2.default, null)
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443 \u043E\u0431\u044A\u0435\u043A\u0442\u0430', tooltipPosition: 'bottom-right', onTouchTap: props.handleEdit },
            _react2.default.createElement(_edit2.default, null)
          ),
          _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: '\u041F\u043E\u043C\u0435\u0442\u0438\u0442\u044C \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435', onTouchTap: props.handleRemove },
            _react2.default.createElement(_delete2.default, null)
          ),
          _react2.default.createElement(_Toolbar.ToolbarSeparator, null),
          _react2.default.createElement(_DataSelection2.default, { selectionChange: props.handleSelectionChange, selectionValue: props.selectionValue })
        ),
        _react2.default.createElement(
          _Toolbar.ToolbarGroup,
          null,
          _react2.default.createElement(
            _IconMenu2.default,
            {
              iconButtonElement: _react2.default.createElement(
                _IconButton2.default,
                { touch: true, tooltip: '\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E', tooltipPosition: 'bottom-left' },
                _react2.default.createElement(_moreVert2.default, null)
              )
            },
            _react2.default.createElement(_MenuItem2.default, { primaryText: '\u041F\u0435\u0447\u0430\u0442\u044C', leftIcon: _react2.default.createElement(_print2.default, null), onTouchTap: props.handlePrint }),
            _react2.default.createElement(_MenuItem2.default, { primaryText: '\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F', leftIcon: _react2.default.createElement(_attachFile2.default, null), onTouchTap: props.handleAttachment })
          )
        )
      );
    }
  }]);
  return DataListToolbar;
}(_react.Component);

exports.default = DataListToolbar;
process.env.NODE_ENV !== "production" ? DataListToolbar.propTypes = {

  handleAdd: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleEdit: _react.PropTypes.func.isRequired, // обработчик открфтия формы редактора
  handleRemove: _react.PropTypes.func.isRequired, // обработчик удаления строки

  handleSelectionChange: _react.PropTypes.func.isRequired, // ??? обработчик при изменении фильтра
  selectionValue: _react.PropTypes.object.isRequired, // значение фильтра

  handlePrint: _react.PropTypes.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func.isRequired } : void 0;