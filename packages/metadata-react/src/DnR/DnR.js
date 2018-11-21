import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export const disableSelect = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  MozUserSelect: 'none',
  OUserSelect: 'none'
};

export const defaultTheme = {
  title: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    MozUserSelect: 'none',
    OUserSelect: 'none',
    overflow: 'hidden',
    width: '100%',
    height: 30,
  },
  frame: {
    position: 'absolute',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
  transition: 'all 0.25s ease-in-out'
};

function prefixedTransition(transition) {
  return transition ? {
    transition: transition,
    WebkitTransition: transition,
    msTransition: transition,
    MozTransition: transition,
    OTransition: transition,
  } : {};
}

export default class DnR extends React.Component {

  constructor(props) {
    super(props);
    const {
      transition,
      theme
    } = this.props;
    this.cursorX = 0;
    this.cursorY = 0;
    this.clicked = null;
    this.allowTransition = false;
    this.frameRect = {};
    this.state = {
      cursor: 'auto',
      transition: prefixedTransition(transition ? transition : theme.transition)
    };

    this.mouseMoveListener = this._onMove.bind(this);
    this.mouseUpListener = this._onUp.bind(this);
  }

  componentDidMount() {
    const {
      initialWidth,
      initialHeight,
      initialTop,
      initialLeft,
      attachedTo,
    } = this.props;

    const boundingBox = this.getFrameRect();
    this.frameRect.width = initialWidth || boundingBox.width;
    this.frameRect.height = initialHeight || boundingBox.height;
    this.frameRect.top = initialTop || this.refs.frame.offsetTop;
    this.frameRect.left = initialLeft || this.refs.frame.offsetLeft;

    attachedTo.addEventListener('mousemove', this.mouseMoveListener);
    attachedTo.addEventListener('mouseup', this.mouseUpListener);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.transition !== this.props.transition) {
      this.setState({transition: prefixedTransition(nextProps.transition)});
    }
  }

  componentWillUnmount() {
    this.props.attachedTo.removeEventListener('mousemove', this.mouseMoveListener);
    this.props.attachedTo.removeEventListener('mouseup', this.mouseUpListener);
  }

  transform(state, allowTransition = true, updateHistory = true) {
    const boundingBox = this.getFrameRect();

    let top = this.refs.frame.offsetTop;
    let left = this.refs.frame.offsetLeft;
    let width = boundingBox.width;
    let height = boundingBox.height;

    if(updateHistory) {
      this.prevState = {
        top: top,
        left: left,
        width: width,
        height: height,
      };
    }

    if(!state) return;

    this.frameRect.top = typeof state.top === 'number' ? state.top :
      state.bottom ? (state.bottom - (state.height || height)) : top;
    this.frameRect.left = typeof state.left === 'number' ? state.left :
      state.right ? (state.right - (state.width || width)) : left;
    this.frameRect.width = typeof state.width === 'number' ? state.width :
      (typeof state.right === 'number' && typeof state.left === 'number') ? state.right - state.left :
        typeof state.right === 'number' ? state.right - this.frameRect.left : width;
    this.frameRect.height = typeof state.height === 'number' ? state.height :
      (typeof state.bottom === 'number' && typeof state.top === 'number') ? state.top - state.bottom :
        typeof state.bottom === 'number' ? state.bottom - this.frameRect.top : height;
    this.allowTransition = allowTransition;

    if(this.props.onTransform) {
      setTimeout(this.props.onTransform.bind(this, this.frameRect, this.prevState));
    }
    this.forceUpdate();
  }

  restore(allowTransition = true) {
    this.transform(this.prevState, allowTransition);
  }

  minimize(allowTransition = true) {
    this.transform({width: 0, height: 0}, allowTransition);
  }

  maximize(allowTransition = true) {
    this.transform({top: 0, left: 0, width: this.props.attachedTo.innerWidth, height: this.props.attachedTo.innerHeight}, allowTransition);
  }

  render() {
    const {
      style,
      contentStyle,
      contentClassName,
      titleStyle,
      theme,
      minWidth,
      minHeight,
      animate,
      cursorRemap,
      children,
      boundary,
      onMove,
      onResize
    } = this.props;

    const pervFrameRect = {...this.frameRect};

    if(this.clicked) {
      let hits = this.hitEdges;
      const boundingBox = this.clicked.boundingBox;

      if(hits.top || hits.bottom || hits.left || hits.right) {
        if(hits.right) this.frameRect.width = Math.max(this.cursorX - boundingBox.left, minWidth) + 'px';
        if(hits.bottom) this.frameRect.height = Math.max(this.cursorY - boundingBox.top, minHeight) + 'px';

        if(hits.left) {
          let currentWidth = boundingBox.right - this.cursorX;
          if(currentWidth > minWidth) {
            this.frameRect.width = currentWidth;
            this.frameRect.left = this.clicked.frameLeft + this.cursorX - this.clicked.x;
          }
        }

        if(hits.top) {
          let currentHeight = boundingBox.bottom - this.cursorY;
          if(currentHeight > minHeight) {
            this.frameRect.height = currentHeight;
            this.frameRect.top = this.clicked.frameTop + this.cursorY - this.clicked.y;
          }
        }
      }
      else if(this.state.cursor === 'move') {
        this.frameRect.top = this.clicked.frameTop + this.cursorY - this.clicked.y;
        this.frameRect.left = this.clicked.frameLeft + this.cursorX - this.clicked.x;
      }
    }

    if(boundary) {
      let {
        top,
        left,
        width,
        height
      } = this.frameRect;
      if(typeof boundary.top === 'number' && top < boundary.top) {
        this.frameRect.top = boundary.top;
      }
      if(typeof boundary.bottom === 'number' && top + height > boundary.bottom) {
        this.frameRect.top = boundary.bottom - height;
        if(typeof boundary.top === 'number' && this.frameRect.top < boundary.top) {
          this.frameRect.top = boundary.top;
          this.frameRect.height = boundary.bottom - boundary.top;
        }
      }
      if(typeof boundary.left === 'number' && left < boundary.left) {
        this.frameRect.left = boundary.left;
      }
      if(typeof boundary.right === 'number' && top + height > boundary.right) {
        this.frameRect.left = boundary.right - width;
        if(typeof boundary.left === 'number' && this.frameRect.left < boundary.left) {
          this.frameRect.left = boundary.left;
          this.frameRect.width = boundary.right - boundary.left;
        }
      }
    }

    let cursor = this.state.cursor;

    if(cursorRemap) {
      let res = cursorRemap.call(this, cursor);

      if(res && typeof res === 'string') cursor = res;
    }


    const dnrState = {
      cursor,
      clicked: this.clicked,
      frameRect: this.frameRect,
      allowTransition: this.allowTransition
    };

    let titleBar = (
      <div ref="title"
           style={{
             ...theme.title,
             ...titleStyle,
             cursor
           }}>
        {typeof this.props.titleBar !== 'string' ?
          React.cloneElement(this.props.titleBar, {dnrState}) : this.props.titleBar}
      </div>);

    const childrenWithProps = React.Children.map(children, function (child) {
      return typeof child === 'string' ? child : React.cloneElement(child, {dnrState});
    });

    let frameTransition = (animate && this.allowTransition) ? this.state.transition : {};

    if(onMove && (pervFrameRect.top !== this.frameRect.top ||
        pervFrameRect.left !== this.frameRect.left)) {
      setTimeout(onMove.bind(this, this.frameRect, pervFrameRect));
    }

    if(onResize && (pervFrameRect.width !== this.frameRect.width ||
        pervFrameRect.height !== this.frameRect.height)) {
      setTimeout(onResize.bind(this, this.frameRect, pervFrameRect));
    }
    return (
      <div ref="frame"
           onMouseDownCapture={this._onDown.bind(this)}
           onMouseMoveCapture={(e) => {
             if(this.clicked !== null) {
               e.preventDefault();
             }
           }}
           style={{
             ...theme.frame,
             ...frameTransition,
             cursor: cursor,
             ...style,
             ...this.frameRect,
             ...(this.clicked ? disableSelect : {})
           }}>
        {titleBar}
        <div ref='content'
             className={contentClassName}
             style={{position: 'absolute', width: '100%', top: theme.title.height, bottom: 0, ...contentStyle}}>
          {childrenWithProps}
        </div>
      </div>
    );
  }

  getChildContext() {
    return {dnr: this};
  }

  getFrameRect() {
    return this.refs.frame.getBoundingClientRect();
  }

  getDOMFrame() {
    return this.refs.frame;
  }

  getTitleRect() {
    return this.refs.title.getBoundingClientRect();
  }

  _cursorStatus(e) {
    const boundingBox = this.getFrameRect();
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;

    if(this.clicked) return;

    let hitRange = this.props.edgeDetectionRange;
    let hitTop = this.cursorY <= boundingBox.top + hitRange;
    let hitBottom = this.cursorY >= boundingBox.bottom - hitRange;
    let hitLeft = this.cursorX <= boundingBox.left + hitRange;
    let hitRight = this.cursorX >= boundingBox.right - hitRange;

    let cursor = 'auto';

    if(hitTop || hitBottom || hitLeft || hitRight) {
      if(hitRight && hitBottom || hitLeft && hitTop) {
        cursor = 'nwse-resize';
      }
      else if(hitRight && hitTop || hitBottom && hitLeft) {
        cursor = 'nesw-resize';
      }
      else if(hitRight || hitLeft) {
        cursor = 'ew-resize';
      }
      else if(hitBottom || hitTop) {
        cursor = 'ns-resize';
      }
      e.stopPropagation();
    }
    else {
      const titleBounding = this.getTitleRect();
      if(this.cursorX > titleBounding.left && this.cursorX < titleBounding.right &&
        this.cursorY > titleBounding.top && this.cursorY < titleBounding.bottom) {
        cursor = 'move';
      }
    }

    this.hitEdges = {
      top: hitTop,
      bottom: hitBottom,
      left: hitLeft,
      right: hitRight
    };

    if(cursor !== this.state.cursor) {
      this.setState({cursor: cursor});
    }

  }

  _onDown(e) {
    this.allowTransition = false;
    this._cursorStatus(e);
    const boundingBox = this.getFrameRect();
    this.clicked = {
      x: e.clientX, y: e.clientY, boundingBox: boundingBox,
      frameTop: this.refs.frame.offsetTop, frameLeft: this.refs.frame.offsetLeft
    };
  }

  _onUp(e) {
    this.clicked = null;
    this._cursorStatus(e);
  }

  _onMove(e) {
    this._cursorStatus(e);
    if(this.clicked !== null) {
      this.forceUpdate();
    }
  }
}

DnR.propTypes = {
  titleBar: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  style: PropTypes.object,
  contentClassName: PropTypes.object,
  contentStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  theme: PropTypes.object,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  edgeDetectionRange: PropTypes.number,
  initialWidth: PropTypes.number,
  initialHeight: PropTypes.number,
  initialTop: PropTypes.number,
  initialLeft: PropTypes.number,
  transition: PropTypes.string,
  animate: PropTypes.bool,
  onMove: PropTypes.func,
  onResize: PropTypes.func,
  onTransform: PropTypes.func,
  cursorRemap: PropTypes.func,
  boundary: PropTypes.object,
  attachedTo: PropTypes.object,
};

DnR.defaultProps = {
  minWidth: 300,
  minHeight: 200,
  edgeDetectionRange: 5,
  theme: defaultTheme,
  initialWidth: null,
  initialHeight: null,
  initialTop: null,
  initialLeft: null,
  animate: true,
  attachedTo: window,
};

DnR.childContextTypes = {
  dnr: PropTypes.object
};
