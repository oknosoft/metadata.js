'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _reactFlexLayout = require('./react-flex-layout.jsx');

var _reactFlexLayout2 = _interopRequireDefault(_reactFlexLayout);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reactFlexLayoutEvents = require('./react-flex-layout-events.jsx');

var _reactFlexLayoutEvents2 = _interopRequireDefault(_reactFlexLayoutEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.body.style.margin = 0;

class TestThingo extends _react2.default.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return _react2.default.createElement(
      'div',
      null,
      'Test thingo content'
    );
  }
}

describe('react-flex-layout', function () {
  it('can fill the browser frame', function () {
    var layout = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(_reactFlexLayout2.default, { fill: 'window' }));
    var domLayout = _reactDom2.default.findDOMNode(layout);
    (0, _expect2.default)(domLayout.style.height).toBe(window.innerHeight + 'px');
    (0, _expect2.default)(domLayout.style.width).toBe(window.innerWidth + 'px');
    (0, _expect2.default)(domLayout.style.position).toBe('absolute');
    (0, _expect2.default)(domLayout.style.left).toBe('0px');
    (0, _expect2.default)(domLayout.style.top).toBe('0px');
  });

  it('can fill the containing element', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '50%';
    document.body.appendChild(container);
    var layout = _reactDom2.default.render(_react2.default.createElement(_reactFlexLayout2.default, { fill: 'container' }), container);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    (0, _expect2.default)(domLayout.offsetHeight).toBe(500);
    var difference = domLayout.offsetWidth - window.innerWidth / 2;
    (0, _expect2.default)(difference).toBeLessThan(1, 'differnce was greater than 1');
  });

  it('can have two flex width children', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var layout = _reactDom2.default.render(toRender, container);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    var flex1 = domLayout.children[0];
    var flex2 = domLayout.children[1];
    (0, _expect2.default)(flex1.offsetHeight).toBe(500);
    (0, _expect2.default)(flex1.offsetWidth).toBe(250);
    (0, _expect2.default)(flex2.offsetHeight).toBe(500);
    (0, _expect2.default)(flex2.offsetWidth).toBe(250);
  });

  it('can have two flex height children', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 'flex' }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 'flex' })
    );
    var layout = _reactDom2.default.render(toRender, container);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    var flex1 = domLayout.children[0];
    var flex2 = domLayout.children[1];
    (0, _expect2.default)(flex1.offsetHeight).toBe(250);
    (0, _expect2.default)(flex1.offsetWidth).toBe(500);
    (0, _expect2.default)(flex2.offsetHeight).toBe(250);
    (0, _expect2.default)(flex2.offsetWidth).toBe(500);
  });

  it('can have one fixed and one flex width children', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var layout = _reactDom2.default.render(toRender, container);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    var flex1 = domLayout.children[0];
    var flex2 = domLayout.children[1];
    (0, _expect2.default)(flex1.offsetWidth).toBe(100);
    (0, _expect2.default)(flex2.offsetWidth).toBe(400);
  });

  it('can have one fixed and one flex height children', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 100 }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 'flex' })
    );
    var layout = _reactDom2.default.render(toRender, container);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    var flex1 = domLayout.children[0];
    var flex2 = domLayout.children[1];
    (0, _expect2.default)(flex1.offsetHeight).toBe(100);
    (0, _expect2.default)(flex2.offsetHeight).toBe(400);
  });

  it('when child is resized flex widths are recalculated', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var layout = _reactDom2.default.render(toRender, container);
    layout.refs.layout0.setWidth(110);
    var domLayout = _reactDom2.default.findDOMNode(layout);
    var fixed = domLayout.children[0];
    var flex2 = domLayout.children[1];
    (0, _expect2.default)(fixed.offsetWidth).toBe(110);
    (0, _expect2.default)(flex2.offsetWidth).toBe(390);
  });

  it('throws when invalid layout width is specified', function () {
    (0, _expect2.default)(() => _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: '100' }))).toThrow();
  });

  it('Children of layout are rendered', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutWidth: 100 },
        _react2.default.createElement(TestThingo, null)
      ),
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutWidth: 'flex' },
        _react2.default.createElement(TestThingo, null)
      )
    );
    var layout = _reactDom2.default.render(toRender, container);
    var found = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(layout, TestThingo);
    (0, _expect2.default)(found.length).toBe(2);
  });

  it('Child text of layout is rendered', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutWidth: 100 },
        _react2.default.createElement(TestThingo, null)
      ),
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutWidth: 'flex' },
        'SomethingElse'
      )
    );
    var layout = _reactDom2.default.render(toRender, container);
    var layoutNode = _reactDom2.default.findDOMNode(layout.refs.layout1);
    (0, _expect2.default)(layoutNode.innerText).toContain('SomethingElse');
  });

  it('Can nest', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutHeight: 100 },
        'Header'
      ),
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutHeight: 'flex' },
        _react2.default.createElement(
          _reactFlexLayout2.default,
          { layoutWidth: 100 },
          'Column 1'
        ),
        _react2.default.createElement(
          _reactFlexLayout2.default,
          { layoutWidth: 'flex' },
          'Flex column'
        )
      )
    );
    var layout = _reactDom2.default.render(toRender, container);
    var verticalContainer = layout.refs.layout1;
    var layoutNode = _reactDom2.default.findDOMNode(layout);
    (0, _expect2.default)(layoutNode.children[0].offsetHeight).toBe(100);
    (0, _expect2.default)(layoutNode.children[1].offsetHeight).toBe(400);
    (0, _expect2.default)(layoutNode.children[0].offsetWidth).toBe(500);
    (0, _expect2.default)(layoutNode.children[1].offsetWidth).toBe(500);

    var verticalContainerNode = _reactDom2.default.findDOMNode(verticalContainer);
    (0, _expect2.default)(verticalContainerNode.children[0].offsetWidth).toBe(100);
    (0, _expect2.default)(verticalContainerNode.children[1].offsetWidth).toBe(400);
    (0, _expect2.default)(verticalContainerNode.children[0].offsetHeight).toBe(400);
    (0, _expect2.default)(verticalContainerNode.children[1].offsetHeight).toBe(400);
  });

  it('Resizes when layout-changed is triggered', () => {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var toRender = _react2.default.createElement(
      _reactFlexLayout2.default,
      { fill: 'container' },
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutHeight: 100 },
        'Header'
      ),
      _react2.default.createElement(
        _reactFlexLayout2.default,
        { layoutHeight: 'flex' },
        'Content'
      )
    );
    var layout = _reactDom2.default.render(toRender, container);
    var layoutNode = _reactDom2.default.findDOMNode(layout);

    container.style.height = '400px';
    _reactFlexLayoutEvents2.default.emit('layout-changed');

    (0, _expect2.default)(layoutNode.children[0].offsetHeight).toBe(100);
    (0, _expect2.default)(layoutNode.children[1].offsetHeight).toBe(300);
  });

  it('throws when invalid layout width is specified', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    (0, _expect2.default)(() => _reactDom2.default.render(_react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, null)
    ), container)).toThrow();
  });

  it('Can add classname to layout', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var rendered = _reactDom2.default.render(_react2.default.createElement(
      _reactFlexLayout2.default,
      { className: 'outer' },
      _react2.default.createElement(_reactFlexLayout2.default, { className: 'inner', layoutWidth: 'flex' })
    ), container);
    var renderedNode = _reactDom2.default.findDOMNode(rendered);
    var innerNode = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    (0, _expect2.default)(renderedNode.className).toBe('outer');
    (0, _expect2.default)(innerNode.className).toBe('inner');
  });

  it('Can add style to layout', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var rendered = _reactDom2.default.render(_react2.default.createElement(
      _reactFlexLayout2.default,
      { style: { border: '1px solid #000' } },
      _react2.default.createElement(_reactFlexLayout2.default, { style: { backgroundColor: '#eee' }, layoutWidth: 'flex' })
    ), container);
    var renderedNode = _reactDom2.default.findDOMNode(rendered);
    var innerNode = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    (0, _expect2.default)(renderedNode.getAttribute('style')).toContain('border: 1px solid rgb(0, 0, 0)');
    (0, _expect2.default)(innerNode.getAttribute('style')).toContain('background-color:#eee');
  });
});