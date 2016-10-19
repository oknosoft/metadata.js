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

var _reactTreebeard = require('react-treebeard');

var _treebeardTheme = require('./assets/treebeard-theme');

var _treebeardTheme2 = _interopRequireDefault(_treebeardTheme);

var _filter = require('./filter');

var filters = _interopRequireWildcard(_filter);

var _MetaDesigner = require('./MetaDesigner.scss');

var _MetaDesigner2 = _interopRequireDefault(_MetaDesigner);

var _treebeardStyles = require('./assets/treebeard-styles');

var _treebeardStyles2 = _interopRequireDefault(_treebeardStyles);

var _meta = require('./assets/meta');

var _meta2 = _interopRequireDefault(_meta);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Example: Customising The Header Decorator To Include Icons
_reactTreebeard.decorators.Header = function (props) {
  var style = props.style;
  return _react2.default.createElement(
    'div',
    { style: style.base },
    _react2.default.createElement(
      'div',
      { style: style.title },
      _react2.default.createElement('div', { style: _treebeardStyles2.default.treeview_icon, className: _MetaDesigner2.default[props.node.icon] }),
      _react2.default.createElement(
        'div',
        { className: _MetaDesigner2.default.span },
        props.node.name
      )
    )
  );
};

_reactTreebeard.decorators.Toggle = function (props) {
  var style = props.style;
  var height = style.height;
  var width = style.width;
  var r = (height - 4) / 2;
  var path = 'M' + r / 2 + ',' + r * 1.5 + 'a' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0a' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';
  if (props.node.toggled === true) path += 'M' + r * 1.5 + ',' + r + 'l0,' + r;else path += 'M' + r + ',' + r * 1.5 + 'l' + r + ',0M' + r * 1.5 + ',' + r + 'l0,' + r;

  return _react2.default.createElement(
    'div',
    { style: style.base },
    _react2.default.createElement(
      'div',
      { style: style.wrapper },
      _react2.default.createElement(
        'svg',
        { height: height, width: width },
        _react2.default.createElement('path', { d: path, fill: 'none', stroke: 'black' })
      )
    )
  );
};

var TreebeardContainer = _reactTreebeard.decorators.Container;

var Container = function (_TreebeardContainer) {
  (0, _inherits3.default)(Container, _TreebeardContainer);

  function Container() {
    (0, _classCallCheck3.default)(this, Container);
    return (0, _possibleConstructorReturn3.default)(this, (Container.__proto__ || (0, _getPrototypeOf2.default)(Container)).apply(this, arguments));
  }

  (0, _createClass3.default)(Container, [{
    key: 'renderToggleDecorator',
    value: function renderToggleDecorator() {
      var _props = this.props;
      var style = _props.style;
      var decorators = _props.decorators;
      var node = _props.node;

      return _react2.default.createElement(decorators.Toggle, { style: style.toggle, node: node });
    }
  }]);
  return Container;
}(TreebeardContainer);

_reactTreebeard.decorators.Container = Container;

var MetaTree = function (_Component) {
  (0, _inherits3.default)(MetaTree, _Component);

  function MetaTree(props) {
    (0, _classCallCheck3.default)(this, MetaTree);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (MetaTree.__proto__ || (0, _getPrototypeOf2.default)(MetaTree)).call(this, props));

    _this2.state = { data: _meta2.default };
    _this2.onToggle = _this2.onToggle.bind(_this2);
    return _this2;
  }

  (0, _createClass3.default)(MetaTree, [{
    key: 'onToggle',
    value: function onToggle(node, toggled) {
      if (this.state.cursor) {
        this.state.cursor.active = false;
      }
      node.active = true;
      if (node.children) {
        node.toggled = toggled;
      }
      this.setState({ cursor: node });
    }
  }, {
    key: 'onFilterMouseUp',
    value: function onFilterMouseUp(e) {
      var filter = e.target.value.trim();
      if (!filter) {
        return this.setState({ data: _meta2.default });
      }
      var filtered = filters.filterTree(_meta2.default, filter);
      filtered = filters.expandFilteredNodes(filtered, filter);
      this.setState({ data: filtered });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: _MetaDesigner2.default.component },
        _react2.default.createElement('div', { className: _MetaDesigner2.default.draggableHandle }),
        _react2.default.createElement(
          'div',
          { className: _MetaDesigner2.default.content },
          _react2.default.createElement(
            'div',
            { className: _MetaDesigner2.default.searchBox },
            _react2.default.createElement('input', { type: 'text',
              className: _MetaDesigner2.default.input,
              placeholder: '\u041F\u043E\u0438\u0441\u043A \u0432 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0445...',
              onKeyUp: this.onFilterMouseUp.bind(this)
            })
          ),
          _react2.default.createElement(_reactTreebeard.Treebeard, {
            data: this.state.data,
            style: _treebeardTheme2.default,
            onToggle: this.onToggle,
            decorators: _reactTreebeard.decorators
          })
        )
      );
    }
  }]);
  return MetaTree;
}(_react.Component);

exports.default = MetaTree;