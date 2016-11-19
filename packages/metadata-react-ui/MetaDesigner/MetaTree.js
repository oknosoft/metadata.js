'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  _inherits(Container, _TreebeardContainer);

  function Container() {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
  }

  _createClass(Container, [{
    key: 'renderToggleDecorator',
    value: function renderToggleDecorator() {
      var _props = this.props,
          style = _props.style,
          decorators = _props.decorators,
          node = _props.node;

      return _react2.default.createElement(decorators.Toggle, { style: style.toggle, node: node });
    }
  }]);

  return Container;
}(TreebeardContainer);

_reactTreebeard.decorators.Container = Container;

var MetaTree = function (_Component) {
  _inherits(MetaTree, _Component);

  function MetaTree(props) {
    _classCallCheck(this, MetaTree);

    var _this2 = _possibleConstructorReturn(this, (MetaTree.__proto__ || Object.getPrototypeOf(MetaTree)).call(this, props));

    _this2.state = { data: _meta2.default };
    _this2.onToggle = _this2.onToggle.bind(_this2);
    return _this2;
  }

  _createClass(MetaTree, [{
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