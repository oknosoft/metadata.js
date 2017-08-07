'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

class MetaDesigner extends _react.Component {

  render() {
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

}
exports.default = MetaDesigner;