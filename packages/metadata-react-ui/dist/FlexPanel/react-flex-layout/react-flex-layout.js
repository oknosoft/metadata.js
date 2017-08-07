'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactFlexLayoutSplitter = require('./react-flex-layout-splitter.jsx');

var _reactFlexLayoutSplitter2 = _interopRequireDefault(_reactFlexLayoutSplitter);

var _reactFlexLayoutEvents = require('./react-flex-layout-events.jsx');

var _reactFlexLayoutEvents2 = _interopRequireDefault(_reactFlexLayoutEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layout extends _react2.default.Component {

  constructor(props) {
    super(props);
    this.state = {
      hideSelection: false
    };
    if (props.layoutWidth !== 'flex') {
      if (props.layoutWidth && !this.isNumber(props.layoutWidth)) {
        throw new Error('layoutWidth should be a number or flex');
      }
      this.state.layoutWidth = props.layoutWidth;
    }
    if (props.layoutHeight !== 'flex') {
      if (props.layoutHeight && !this.isNumber(props.layoutHeight)) {
        throw new Error('layoutHeight should be a number or flex');
      }
      this.state.layoutHeight = props.layoutHeight;
    }

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    _reactFlexLayoutEvents2.default.addListener('layout-changed', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    _reactFlexLayoutEvents2.default.removeListener('layout-changed', this.handleResize);
  }

  handleResize() {
    let newWidth = this.state.layoutWidth;
    let newHeight = this.state.layoutHeight;
    if (this.props.fill === 'window' && window) {
      newWidth = window.innerWidth;
      newHeight = window.innerHeight;
    } else if (!this.props.layoutWidth && !this.props.layoutHeight) {
      const domNode = _reactDom2.default.findDOMNode(this);
      newHeight = domNode.parentElement.clientHeight;
      newWidth = domNode.parentElement.clientWidth;
    }
    // Only setState if the available size has actually changed.
    if (this.state.layoutWidth !== newWidth || this.state.layoutHeight !== newHeight) {
      this.state.layoutWidth = newWidth;
      this.state.layoutHeight = newHeight;
      this.setState(this.state);
    }
  }

  getWidth() {
    return _reactDom2.default.findDOMNode(this).offsetWidth;
  }

  setWidth(newWidth) {
    this.state.layoutWidth = newWidth;
    this.setState(this.state);
    if (this.props.layoutChanged) {
      this.props.layoutChanged();
    }
  }

  getHeight() {
    return _reactDom2.default.findDOMNode(this).offsetHeight;
  }

  setHeight(newHeight) {
    this.state.layoutHeight = newHeight;
    this.setState(this.state);
    if (this.props.layoutChanged) {
      this.props.layoutChanged();
    }
  }

  childLayoutChanged() {
    // State hasn't changed but render relies on child properties
    this.setState(this.state);
  }

  recalculateFlexLayout() {
    let newFlexDimentions = {};
    if (this.props.children) {
      let numberOfFlexWidths = 0;
      let totalAllocatedWidth = 0;
      let numberOfFlexHeights = 0;
      let totalAllocatedHeight = 0;
      let numberOfSplitters = 0;
      let i = 0;
      _react2.default.Children.map(this.props.children, childDefinition => {
        var childType = childDefinition.type;
        if (childType === Layout && !childDefinition.props.layoutWidth && !childDefinition.props.layoutHeight) {
          throw new Error('Child Layouts must have either layoutWidth or layoutHeight set');
        }

        if (childType === _reactFlexLayoutSplitter2.default) {
          numberOfSplitters++;
        } else if (childType === Layout) {
          let child = this.refs['layout' + i];
          if (childDefinition.props.layoutWidth === 'flex') {
            numberOfFlexWidths++;
          } else if (!child && this.isNumber(childDefinition.props.layoutWidth)) {
            totalAllocatedWidth += childDefinition.props.layoutWidth;
          } else if (child && this.isNumber(child.state.layoutWidth)) {
            totalAllocatedWidth += child.state.layoutWidth;
          }

          if (childDefinition.props.layoutHeight === 'flex') {
            numberOfFlexHeights++;
          } else if (!child && this.isNumber(childDefinition.props.layoutHeight)) {
            totalAllocatedHeight += childDefinition.props.layoutHeight;
          } else if (child && this.isNumber(child.state.layoutHeight)) {
            totalAllocatedHeight += child.state.layoutHeight;
          }
        }
        i++;
      });

      if (numberOfFlexHeights > 0 && numberOfFlexWidths > 0) {
        throw new Error('Cannot have layout children with both flex widths and heights');
      }
      if (numberOfFlexWidths > 0) {
        var thisWidth = this.state.layoutWidth || this.props.containerWidth;
        totalAllocatedWidth = totalAllocatedWidth + numberOfSplitters * _reactFlexLayoutSplitter2.default.defaultSize;
        newFlexDimentions.width = (thisWidth - totalAllocatedWidth) / numberOfFlexWidths;
      } else if (numberOfFlexHeights > 0) {
        var thisHeight = this.state.layoutHeight || this.props.containerHeight;
        totalAllocatedHeight = totalAllocatedHeight + numberOfSplitters * _reactFlexLayoutSplitter2.default.defaultSize;
        newFlexDimentions.height = (thisHeight - totalAllocatedHeight) / numberOfFlexHeights;
      }

      let isHorizontal = numberOfFlexWidths > 0 || totalAllocatedWidth > 0;
      let isVertical = numberOfFlexHeights > 0 || totalAllocatedHeight > 0;
      if (isHorizontal && isVertical) {
        throw new Error('You can only specify layoutHeight or layoutWidth at a single level');
      } else if (isHorizontal) {
        newFlexDimentions.orientation = 'horizontal';
      } else if (isVertical) {
        newFlexDimentions.orientation = 'vertical';
      }
    }

    return newFlexDimentions;
  }

  render() {
    let width = this.props.layoutWidth === 'flex' ? this.props.calculatedFlexWidth : this.state.layoutWidth || this.props.containerWidth;
    let height = this.props.layoutHeight === 'flex' ? this.props.calculatedFlexHeight : this.state.layoutHeight || this.props.containerHeight;

    if (!width || !height) {
      // We don't know our size yet (maybe initial render)
      return _react2.default.createElement('div', null);
    }
    let count = -1;
    let calculatedFlexDimentions = this.recalculateFlexLayout();
    let children = _react2.default.Children.map(this.props.children, child => {
      count++;
      if (child.type === Layout) {
        let newProps = {
          layoutChanged: this.childLayoutChanged.bind(this),
          calculatedFlexWidth: calculatedFlexDimentions.width,
          calculatedFlexHeight: calculatedFlexDimentions.height,
          containerHeight: height,
          containerWidth: width,
          ref: 'layout' + count
        };
        if (calculatedFlexDimentions.orientation === 'horizontal') {
          let childStyle = child.props.style || {};
          childStyle.float = 'left';
          newProps.style = childStyle;
        }
        let cloned = _react2.default.cloneElement(child, newProps);
        return cloned;
      } else if (child.type === _reactFlexLayoutSplitter2.default) {
        let newProps = {
          layoutChanged: this.childLayoutChanged.bind(this),
          orientation: calculatedFlexDimentions.orientation,
          containerHeight: height,
          containerWidth: width,
          ref: 'layout' + count,
          hideSelection: () => {
            this.setState({ hideSelection: true });
          },
          restoreSelection: () => {
            this.clearSelection();
            this.setState({ hideSelection: false });
          },
          getPreviousLayout: () => {
            let index = this.props.children.indexOf(child);
            return this.refs['layout' + (index - 1)];
          },
          getNextLayout: () => {
            let index = this.props.children.indexOf(child);
            return this.refs['layout' + (index + 1)];
          }
        };
        let cloned = _react2.default.cloneElement(child, newProps);
        return cloned;
      }
      return child;
    });

    let className = null;
    if (this.props.className) {
      className = this.props.className;
    }
    if (this.state.hideSelection) {
      if (className) {
        className += ' ';
      }
      className += 'hideSelection';
    }
    const style = Object.assign({}, this.props.style, { overflow: 'auto', width: width, height: height }, this.props.fill === 'window' ? { position: 'absolute', top: 0, left: 0 } : {});

    return _react2.default.createElement(
      'div',
      { style: style, className: className },
      children
    );
  }

  isNumber(value) {
    return typeof value === 'number';
  }

  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  }
}
exports.default = Layout;
Layout.propTypes = {
  hideSelection: _react2.default.PropTypes.bool,
  minWidth: _react2.default.PropTypes.number,
  minHeight: _react2.default.PropTypes.number,
  onResize: _react2.default.PropTypes.func
};
Layout.defaultProps = {
  minWidth: 50,
  minHeight: 50
};