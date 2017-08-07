'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _reactFlexLayout = require('./react-flex-layout.jsx');

var _reactFlexLayout2 = _interopRequireDefault(_reactFlexLayout);

var _reactFlexLayoutSplitter = require('./react-flex-layout-splitter.jsx');

var _reactFlexLayoutSplitter2 = _interopRequireDefault(_reactFlexLayoutSplitter);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Layout splitter component', function () {
  it('Throws when both previous and next are flex on mouse down', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, null),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    (0, _expect2.default)(() => _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, ClientY: 100 })).toThrow();
  });

  it('Fixed panel on left', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 110, clientY: 100 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetWidth).toBe(110);
    (0, _expect2.default)(layout2.offsetWidth).toBe(390 - 11);
  });

  it('Will inform the user when resizing begins', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };

    var resizeCalled = false;

    function onResizing() {
      resizeCalled = true;
    }

    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { onResizing: onResizing, document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 110, clientY: 100 });

    //expect resizeCalled to be true
    (0, _expect2.default)(resizeCalled).toBe(true);
  });

  it('Will inform the user when resizing completes', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var mouseUp;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
        if (e === 'mouseup') {
          mouseUp = h;
        }
      }
    };

    var resizeCalled = false;

    function onResizeComplete() {
      resizeCalled = true;
    }

    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { onResizeComplete: onResizeComplete, document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 110, clientY: 100 });

    //let go
    mouseUp();

    //expect resizeCalled to be true
    (0, _expect2.default)(resizeCalled).toBe(true);
  });

  it('Fixed panel on right', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 'flex' }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 110, clientY: 100 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetWidth).toBe(410 - 11);
    (0, _expect2.default)(layout2.offsetWidth).toBe(90);
  });

  it('Horizontal with both fixed', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutWidth: 100 })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 110, clientY: 100 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetWidth).toBe(110);
    (0, _expect2.default)(layout2.offsetWidth).toBe(90);
  });

  it('Fixed panel on top', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 'flex' })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 100, clientY: 110 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetHeight).toBe(110);
    (0, _expect2.default)(layout2.offsetHeight).toBe(390 - 11);
  });

  it('Fixed panel on bottom', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 'flex' }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 100 })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 100, clientY: 110 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetHeight).toBe(410 - 11);
    (0, _expect2.default)(layout2.offsetHeight).toBe(90);
  });

  it('Vertical with both fixed', function () {
    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);
    var mouseMove;
    var fakeDocument = {
      addEventListener: (e, h) => {
        if (e === 'mousemove') {
          mouseMove = h;
        }
      }
    };
    var components = _react2.default.createElement(
      _reactFlexLayout2.default,
      null,
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 100 }),
      _react2.default.createElement(_reactFlexLayoutSplitter2.default, { document: fakeDocument }),
      _react2.default.createElement(_reactFlexLayout2.default, { layoutHeight: 100 })
    );
    var rendered = _reactDom2.default.render(components, container);
    var splitterNode = _reactDom2.default.findDOMNode(rendered.refs.layout1);
    _reactAddonsTestUtils2.default.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 });
    mouseMove({ clientX: 100, clientY: 110 });
    var layout1 = _reactDom2.default.findDOMNode(rendered.refs.layout0);
    var layout2 = _reactDom2.default.findDOMNode(rendered.refs.layout2);
    (0, _expect2.default)(layout1.offsetHeight).toBe(110);
    (0, _expect2.default)(layout2.offsetHeight).toBe(90);
  });
});

// TODO Hides selection