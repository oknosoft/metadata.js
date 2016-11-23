'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MetaDesigner = function (_Component) {
  _inherits(MetaDesigner, _Component);

  function MetaDesigner() {
    _classCallCheck(this, MetaDesigner);

    return _possibleConstructorReturn(this, (MetaDesigner.__proto__ || Object.getPrototypeOf(MetaDesigner)).apply(this, arguments));
  }

  _createClass(MetaDesigner, [{
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