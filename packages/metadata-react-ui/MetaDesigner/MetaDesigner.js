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

var _reactGridLayout = require('react-grid-layout');

var _reactGridLayout2 = _interopRequireDefault(_reactGridLayout);

var _styles = require('react-grid-layout/css/styles.css');

var _styles2 = _interopRequireDefault(_styles);

var _styles3 = require('react-resizable/css/styles.css');

var _styles4 = _interopRequireDefault(_styles3);

var _MetaDesigner = require('./MetaDesigner.scss');

var _MetaDesigner2 = _interopRequireDefault(_MetaDesigner);

var _MetaTree = require('./MetaTree');

var _MetaTree2 = _interopRequireDefault(_MetaTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaDesigner = function (_Component) {
  (0, _inherits3.default)(MetaDesigner, _Component);

  function MetaDesigner() {
    (0, _classCallCheck3.default)(this, MetaDesigner);
    return (0, _possibleConstructorReturn3.default)(this, (MetaDesigner.__proto__ || (0, _getPrototypeOf2.default)(MetaDesigner)).apply(this, arguments));
  }

  (0, _createClass3.default)(MetaDesigner, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactGridLayout2.default,
        {
          className: 'layout',
          draggableHandle: "." + _MetaDesigner2.default.draggableHandle,
          cols: 10,
          rowHeight: 100,
          width: 1600
        },
        _react2.default.createElement(
          'div',
          { key: 'a', 'data-grid': { x: 0, y: 0, w: 3, h: 5, minW: 2, maxW: 3 } },
          _react2.default.createElement(_MetaTree2.default, null)
        ),
        _react2.default.createElement(
          'div',
          { key: 'b', 'data-grid': { x: 4, y: 0, w: 2, h: 5, minW: 1, maxW: 3 } },
          'b'
        ),
        _react2.default.createElement(
          'div',
          { key: 'c', 'data-grid': { x: 7, y: 0, w: 3, h: 5, minW: 1, maxW: 3 } },
          'c'
        )
      );
    }
  }]);
  return MetaDesigner;
}(_react.Component);

exports.default = MetaDesigner;