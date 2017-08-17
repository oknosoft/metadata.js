import React, {Component} from "react";
import PropTypes from 'prop-types';

import {Utils} from './utils'
import {PanelWrapper, Transitions} from './mixins';
import {TabGroup} from './tab';

export class FloatingPanel extends PanelWrapper {

  constructor(props, state) {
    super(props, state);
    this.wrapperRef = null;
    this.tempLeft = 0;
    this.tempTop = 0;
    this.tempWidth = 0;
    this.tempHeight = 0;

    this.MIN_WIDTH = 100;
    this.MIN_HEIGHT = 100;

    this.documentMouseDownHandler = null;

    var top = 0;
    var left = 0;

    if (props.top === null) {
      var windowHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

      top = (windowHeight / 2) - (props.height / 2);
    } else {
      top = props.top;
    }

    if (props.left === null) {
      var windowWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

      left = (windowWidth / 2) - (props.width / 2);
    } else {
      left = props.left;
    }

    this.state = {
      top: top,
      left: left,
      width: parseInt(props.width),
      height: parseInt(props.height),

      floating: true,
      dragModeOn: false,
      resizeModeOn: false,
      focused: false,
    };
  }

  componentDidMount() {
    this.documentMouseDownHandler = this.documentMouseDownHandler.bind(this);
    document.addEventListener("mousedown", this.documentMouseDownHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.documentMouseDownHandler);
  }

  enable() {
  }

  disable() {
  }

  documentMouseDownHandler(e) {
    if (this.wrapperRef === null) {
      return;
    }

    var target = e.target;
    var wrapperFound = false;

    while (target) {
      if (target === this.wrapperRef) {
        wrapperFound = true;
        break;
      }

      target = target.parentNode;
    }

    if (wrapperFound === false) {
      this.setState({
        focused: false,
      });
    }
  }

  dragStart (e) {
    this.panelBounds = {
      startLeft: this.state.left,
      startTop: this.state.top,
      startPageX: e.pageX,
      startPageY: e.pageY
    };

    try {
      const img = document.createElement("img");
      img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==";
      img.width = 1;
      e.dataTransfer.setData('text/plain', "Panel");
      e.dataTransfer.setDragImage(img, -1000, -1000);
    } catch (err) { /* Fix for IE */ }

    window.addEventListener('dragover', this.dragOver);

    this.tempTop = this.state.top;
    this.tempLeft = this.state.left;

    var newState = {
      dragModeOn: true
    };

    if (this.props.fullscreen === true) {
      newState.floating = false;
    }

    this.setState(newState);
  }

  dragEnd() {
    delete this.panelBounds;
    window.removeEventListener("dragover", this.dragOver);

    this.setState({
      top: this.tempTop,
      left: this.tempLeft,
      floating: true,
      dragModeOn: false
    });
  }

  dragOver(e) {
    if (this.panelBounds || false) {
      this.tempLeft = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX);
      this.tempTop = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);

      if (this.wrapperRef !== null) {
        Object.assign(this.wrapperRef.style, this.getTransform(this.tempLeft, this.tempTop));
      }
    }
  }

  shouldComponentUpdate () {
    return (false === (this.state.dragModeOn || this.state.resizeModeOn));
  }

  handleMouseClick (e) {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(e);
    }
  }

  handleMouseDown() {
    if (this.props.fullscreen === true) {
      return;
    }

    const mouseMoveEventListener = (e) => {
      if (this.wrapperRef !== null) {
        if (this.tempWidth + e.movementX < this.MIN_WIDTH || this.tempHeight + e.movementY < this.MIN_HEIGHT) {
          return;
        }

        this.tempWidth  += e.movementX;
        this.tempHeight += e.movementY;

        this.wrapperRef.style.width  = Utils.pixelsOf(this.tempWidth);
        this.wrapperRef.style.height = Utils.pixelsOf(this.tempHeight);
      }
    };

    const mouseUpEventListener = () => {
      document.removeEventListener("mouseup", mouseUpEventListener);
      document.removeEventListener("mousemove", mouseMoveEventListener);

      this.setState({
        width: this.tempWidth,
        height: this.tempHeight,
        resizeModeOn: false,
      });

    };

    document.addEventListener("mouseup", mouseUpEventListener);
    document.addEventListener("mousemove", mouseMoveEventListener);

    this.tempWidth = this.state.width;
    this.tempHeight = this.state.height;

    this.setState({
      resizeModeOn: true
    });
  }

  getTransform (left, top) {
    if (this.props.fullscreen === true) {
      left = 0;
      top = 0;
    }

    var transform = "translate3d(" + Utils.pixelsOf(left) + ", " + Utils.pixelsOf(top)  + ", 0)";

    return {
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      transform: transform,
    };
  }

  handleWrapperMouseDown() {
    this.setState({
      focused: true,
    });
  }

  render() {
    var inner = (React.createElement(ReactPanel, Object.assign({}, {
      key: "key0",
      floating: true,
      onDragStart: this.dragStart,
      onDragEnd: this.dragEnd,
      title: this.props.title,
      icon: this.props.icon,
      buttons: this.props.buttons,
    }, this.config), this.props.children));

    var corner = null;
    if (this.props.resizable === true) {
      corner = React.createElement("div", {
        key: "key1",
        onMouseDown: this.handleMouseDown,
        style: {
          position: "absolute",
          right: 0,
          bottom: 0,
          cursor: "se-resize",
          border: "10px solid #00bcd4",
          borderLeft: "10px solid transparent",
          borderTop: "10px solid transparent",
        },
      });
    }

    var fullscreenStyle = {};
    if (this.props.fullscreen === true) {
      fullscreenStyle = {
        width: "100%",
        height: "100%"
      };
    }

    return React.createElement("div", {
      ref: function (reference) {
        this.wrapperRef = reference;
      }.bind(this),

      style: Object.assign({}, {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: this.props.zIndex + (this.state.focused ? 10 : 0),
        width: Utils.pixelsOf(this.state.width),
        height: Utils.pixelsOf(this.state.height),
        minWidth: Utils.pixelsOf(this.MIN_WIDTH),
        minHeight: Utils.pixelsOf(this.MIN_HEIGHT),
      },

      this.props.style,
      this.getTransform(this.state.left, this.state.top),
      fullscreenStyle),

      onClick: this.handleMouseClick,
      onMouseDown: this.handleWrapperMouseDown
    }, [ inner, corner ]);
  }

  static propTypes = {
    buttons: React.PropTypes.array,
    height: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    resizable: React.PropTypes.bool,
    left: React.PropTypes.number,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    title: React.PropTypes.string,
    top: React.PropTypes.number,
    width: React.PropTypes.number,
    zIndex: React.PropTypes.number
  }

  static defaultProps = {
    fullscreen: false,
    resizable: true,
    top: null,
    left: null,
    onClick: null,
    style: {},
    width: 420,
    height: 500,
    zIndex: 2000
  }
}

export class Panel extends PanelWrapper {
  render() {
    var props = update({}, {$merge: this.config}),
      keys = Object.keys(this.props);

    for (var i = keys.length; --i >= 0;) {
      if (["children"].indexOf(keys[i]) != -1) continue;
      props[keys[i]] = this.props[keys[i]];
    }
    return React.createElement(ReactPanel, props,
      this.props.children
    );
  }
}

export class ReactPanel extends Transitions {

  constructor(props, state) {
    super(props, state);
    this. state = {
      compacted: (props.autocompact)
    };
  }

  getSelectedIndex () {
    return this.context.selectedIndex;
  }

  handleClick (event, index) {
    this.context.onTabChange(parseInt(index));
  }

  componentDidMount () {
    if (this.props.autocompact) {
      var tabsStart = this.refs['tabs-start'],
        tabsEnd = this.refs['tabs-end'],
        using = this.refs.tabs.offsetWidth,
        total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth);

      if (using * 2 <= total) {   // TODO: ... * 2 is obviously not what it should be
        this.setState({compacted: false});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.autocompact) {
      var childs = React.Children.count(this.props.children),
        next_childs = React.Children.count(nextProps.children);

      if (next_childs > childs && this.props.autocompact && !this.state.compacted) {
        var tabsStart = this.refs['tabs-start'],
          tabsEnd = this.refs['tabs-end'],
          using = this.refs.tabs.offsetWidth,
          total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth),
          maxTabWidth = this.props.maxTitleWidth + 35;

        if (using + maxTabWidth >= total) {
          this.setState({compacted: true});
        }
      } else {
        // TODO
      }
    }
  }

  handleDragStart (e) {
    if (typeof this.props.onDragStart === "function") {
      this.props.onDragStart(e);
    }
  }

  handleDragEnd () {
    if (typeof this.props.onDragEnd === "function") {
      this.props.onDragEnd();
    }
  }

  _getGroupedButtons (buttons) {
    var len = buttons.length,
      i, j, item, group = [], groups = [];

    for (i = 0; i < len; ++i) {
      item = buttons[i];

      if (typeof item === "object" && item instanceof Array) {
        if (group.length) {
          groups.push(group);
          group = [];
        }
        for (j = 0; j < item.length; ++j) {
          group.push(React.cloneElement(item[j], {key: j}));
        }
        if (group.length) {
          groups.push(group);
          group = [];
        }
      } else {
        group.push(React.cloneElement(item, {key: i}));
      }
    }
    if (group.length) {
      groups.push(group);
    }

    return groups;
  }

  render() {
    var self = this,
      draggable = (this.props.floating) ? "true" : "false",
      sheet = this.getSheet("Panel"),
      transitionProps = this.getTransitionProps("Panel");

    var icon = (this.props.icon) ? (
        React.createElement("span", {style:sheet.icon.style},
          React.createElement("i", {className:this.props.icon})
        )
      ) : null,
      title = (this.props.title.length) ? (
        React.createElement("div", {style:sheet.box.style},
          React.createElement("div", {style:sheet.title.style},
            this.props.title
          )
        )
      ) : null;

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [],
      groupIndex = 0;

    React.Children.forEach(self.props.children, function(child) {
      var ref = "tabb-" + tabIndex,
        tabKey = (typeof child.key !== "undefined" && child.key != null) ? child.key : ref,
        showTitle = true,
        props = {
          "icon": child.props.icon,
          "title": child.props.title,
          "pinned": child.props.pinned
        };

      if (self.state.compacted) {
        if (!(props.pinned || selectedIndex == tabIndex)) {
          showTitle = false;
        }
      }

      tabButtons.push({
        key: tabKey, title: props.title, icon: props.icon, index: tabIndex, ref: ref, showTitle: showTitle,
        onClick: self.handleClick, "data-index": tabIndex, "data-key": tabKey
      });

      tabs.push(
        React.cloneElement(child, {
          key: tabKey,
          tabKey: tabKey,
          selectedIndex: selectedIndex,
          index: tabIndex
        })
      );
      ++tabIndex;
    });

    return (
      React.createElement("div", {style: sheet.style},
        React.createElement("header", {draggable: draggable, onDragEnd: self.handleDragEnd,
          onDragStart: self.handleDragStart, ref: "header", style: sheet.header.style},
          icon, title,
          React.createElement("div", {style: sheet.tabsStart.style, ref: "tabs-start"}),
          this._getGroupedButtons(this.props.leftButtons).map(function (group) {
            return React.createElement("ul", {style: sheet.group.style, key: groupIndex++}, group );
          }),

          React.createElement(TabGroup, {
            style: sheet.tabs.style, ref: "tabs", data: tabButtons,
            dragAndDropHandler: this.props.dragAndDropHandler || false,
            transitionProps: transitionProps
          }),

          React.createElement("div", {style: sheet.tabsEnd.style, ref: "tabs-end"}),
          this._getGroupedButtons(this.props.rightButtons||this.props.buttons).map(function (group) {
            return React.createElement("ul", {style: sheet.group.style, key: groupIndex++}, group );
          })
        ),
        React.createElement("div", {style: sheet.body.style}, tabs )
      )
    );
  }

  static defaultProps = {
    "icon": false,
    "title": "",
    "autocompact": true,
    "floating": false,
    "onDragStart": null,
    "onDragEnd": null,
    "maxTitleWidth": 130,
    "buttons": [],
    "leftButtons": []
  }

  static propTypes = {
    dragAndDropHandler: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ])
  }

  static contextTypes = {
    selectedIndex: PropTypes.number,
    sheet: PropTypes.func,
    onTabChange: PropTypes.func,
    globals: PropTypes.object
  }
}

