'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
_reactTreebeard.decorators.Header = props => {
  const style = props.style;
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

_reactTreebeard.decorators.Toggle = props => {
  const style = props.style;
  const height = style.height;
  const width = style.width;
  let r = (height - 4) / 2;
  let path = `M${ r / 2 },${ r * 1.5 }a${ r },${ r } 0 1,0 ${ r * 2 },0a${ r },${ r } 0 1,0 -${ r * 2 },0`;
  if (props.node.toggled === true) path += `M${ r * 1.5 },${ r }l0,${ r }`;else path += `M${ r },${ r * 1.5 }l${ r },0M${ r * 1.5 },${ r }l0,${ r }`;

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

const TreebeardContainer = _reactTreebeard.decorators.Container;
class Container extends TreebeardContainer {
  renderToggleDecorator() {
    const { style, decorators, node } = this.props;
    return _react2.default.createElement(decorators.Toggle, { style: style.toggle, node: node });
  }
}
_reactTreebeard.decorators.Container = Container;

class MetaTree extends _react.Component {

  constructor(props) {
    super(props);
    this.state = { data: _meta2.default };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim();
    if (!filter) {
      return this.setState({ data: _meta2.default });
    }
    var filtered = filters.filterTree(_meta2.default, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    this.setState({ data: filtered });
  }

  render() {
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
}
exports.default = MetaTree;