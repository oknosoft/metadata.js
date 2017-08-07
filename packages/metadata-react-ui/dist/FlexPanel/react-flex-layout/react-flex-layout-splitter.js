'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFlexLayoutEvents = require('./react-flex-layout-events.jsx');

var _reactFlexLayoutEvents2 = _interopRequireDefault(_reactFlexLayoutEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import splittercss from './react-flex-layout-splitter.css'

class LayoutSplitter extends _react2.default.Component {

  constructor(props) {
    super(props);
    this.document = props.document || document;

    this.state = {
      active: false
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  componentDidMount() {
    this.document.addEventListener('mouseup', this.handleMouseUp);
    this.document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    this.document.removeEventListener('mouseup', this.handleMouseUp);
    this.document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove(event) {
    if (this.state.active) {
      let currentPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
      this.state.newPositionHandler(currentPosition);
      _reactFlexLayoutEvents2.default.emit('layout-changed');
    }
  }

  handleMouseUp() {
    if (this.state.active) {
      this.setState({ active: false }, () => {
        this.props.restoreSelection();
        if (this.props.onResizeComplete) {
          this.props.onResizeComplete();
        }
      });
    }
  }

  markEventAsHandled(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }

  handleMouseDown(event) {
    let downPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
    let layoutProp = this.props.orientation === 'horizontal' ? 'layoutWidth' : 'layoutHeight';
    let minSizeProp = this.props.orientation === 'horizontal' ? 'minWidth' : 'minHeight';
    let updateFunctionName = this.props.orientation === 'horizontal' ? 'setWidth' : 'setHeight';
    let getSizeFunctionName = this.props.orientation === 'horizontal' ? 'getWidth' : 'getHeight';
    let layout1 = this.props.getPreviousLayout();
    let layout2 = this.props.getNextLayout();

    if (layout1 && layout2) {
      const isLayout1Flex = layout1.props[layoutProp] === 'flex';
      const isLayout2Flex = layout2.props[layoutProp] === 'flex';
      if (isLayout1Flex && isLayout2Flex) {
        throw new Error('You cannot place a LayoutSplitter between two flex Layouts');
      }

      const availableSize = layout1[getSizeFunctionName]() + layout2[getSizeFunctionName]();
      const layout1MinSize = layout1.props[minSizeProp];
      const layout2MinSize = layout2.props[minSizeProp];
      const layout1MaxSize = availableSize - layout2MinSize;
      const layout2MaxSize = availableSize - layout1MinSize;

      this.markEventAsHandled(event);

      let newPositionHandler;
      if (isLayout1Flex) {
        // Layout 2 has fixed size
        let originalSize = layout2.state[layoutProp];
        newPositionHandler = currentPosition => {
          let delta = downPosition - currentPosition;
          let newSize = originalSize + delta;
          newSize = Math.max(layout2MinSize, Math.min(newSize, layout2MaxSize));
          layout2[updateFunctionName](newSize);
        };
      } else if (isLayout2Flex) {
        // Layout 1 has fixed size
        let originalSize = layout1.state[layoutProp];
        newPositionHandler = currentPosition => {
          let delta = currentPosition - downPosition;
          let newSize = originalSize + delta;
          newSize = Math.max(layout1MinSize, Math.min(newSize, layout1MaxSize));
          layout1[updateFunctionName](newSize);
        };
      } else {
        // Both are fixed width
        let originalSize1 = layout1.state[layoutProp];
        newPositionHandler = currentPosition => {
          let delta = currentPosition - downPosition;
          const layout1NewSize = Math.max(layout1MinSize, Math.min(originalSize1 + delta, layout1MaxSize));
          const layout2NewSize = availableSize - layout1NewSize;
          layout1[updateFunctionName](layout1NewSize);
          layout2[updateFunctionName](layout2NewSize);
        };
      }

      this.setState({
        active: true,
        newPositionHandler: newPositionHandler
      }, () => {
        if (this.props.onResizing) {
          this.props.onResizing();
        }
      });
    }
  }

  render() {
    //let orientation = this.props.orientation;
    let classes = ['LayoutSplitter', this.props.orientation];
    let style = {
      width: this.props.orientation === 'horizontal' ? LayoutSplitter.defaultSize : this.props.containerWidth,
      height: this.props.orientation === 'vertical' ? LayoutSplitter.defaultSize : this.props.containerHeight
    };

    return _react2.default.createElement('div', { className: classes.join(' '), style: style, onMouseDown: this.handleMouseDown });
  }
}
exports.default = LayoutSplitter;
LayoutSplitter.propTypes = {
  orientation: _react2.default.PropTypes.string,
  getPreviousLayout: _react2.default.PropTypes.func,
  getNextLayout: _react2.default.PropTypes.func,
  onResizing: _react2.default.PropTypes.func,
  onResizeComplete: _react2.default.PropTypes.func
};
LayoutSplitter.defaultSize = 11;