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

var _styles = {};

var _styles2 = _interopRequireDefault(_styles);

var _styles3 = {};

var _styles4 = _interopRequireDefault(_styles3);

var _MetaDesigner = {
  'span': 'MetaDesigner__span___3e_VE',
  'searchBox': 'MetaDesigner__searchBox___1ZAFp',
  'input': 'MetaDesigner__input___1pzzS',
  'component': 'MetaDesigner__component___1XOAC',
  'content': 'MetaDesigner__content___3Q0Su',
  'draggableHandle': 'MetaDesigner__draggableHandle___2YFoE',
  'icon_1c_accreg': 'MetaDesigner__icon_1c_accreg___2eOjp',
  'icon_1c_areg': 'MetaDesigner__icon_1c_areg___1Fhpx',
  'icon_1c_bp': 'MetaDesigner__icon_1c_bp___1Y16V',
  'icon_1c_cacc': 'MetaDesigner__icon_1c_cacc___39H8m',
  'icon_1c_cat': 'MetaDesigner__icon_1c_cat___1MZd1',
  'icon_1c_cch': 'MetaDesigner__icon_1c_cch___3Be8V',
  'icon_1c_doc': 'MetaDesigner__icon_1c_doc___oLXkt',
  'icon_1c_dp': 'MetaDesigner__icon_1c_dp___3S8g2',
  'icon_1c_ireg': 'MetaDesigner__icon_1c_ireg___3GD-8',
  'icon_1c_rep': 'MetaDesigner__icon_1c_rep___2eiXa',
  'icon_1c_tsk': 'MetaDesigner__icon_1c_tsk___5IEae',
  'icon_1c_enm': 'MetaDesigner__icon_1c_enm___uqPxI',
  'icon_1c_frm': 'MetaDesigner__icon_1c_frm___1ac7A',
  'icon_1c_cmd': 'MetaDesigner__icon_1c_cmd___2PU1d',
  'icon_1c_resource': 'MetaDesigner__icon_1c_resource___1dvnC',
  'icon_1c_props': 'MetaDesigner__icon_1c_props___Gz_w1',
  'icon_1c_dimension': 'MetaDesigner__icon_1c_dimension___3N66_',
  'icon_1c_root': 'MetaDesigner__icon_1c_root___QRgpD',
  'icon_1c_tabular': 'MetaDesigner__icon_1c_tabular___229bs'
};

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