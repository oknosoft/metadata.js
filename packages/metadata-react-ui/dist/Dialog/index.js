"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Fullscreen = require("material-ui-icons/Fullscreen");

var _Fullscreen2 = _interopRequireDefault(_Fullscreen);

var _FullscreenExit = require("material-ui-icons/FullscreenExit");

var _FullscreenExit2 = _interopRequireDefault(_FullscreenExit);

var _Close = require("material-ui-icons/Close");

var _Close2 = _interopRequireDefault(_Close);

var _reactPortal = require("react-portal");

var _reactPortal2 = _interopRequireDefault(_reactPortal);

var _reactPanels = require("react-panels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Dialog
 * This component use portal for mounting self into document.body.
 */
class Dialog extends _react.Component {
  static get defaultProps() {
    return {
      title: "",
      tabs: {},
      left: null,
      top: null,
      width: 420,
      height: 400,
      visible: false,
      fullscreen: false,
      resizable: false,
      onCloseClick: null,
      onFullScreenClick: null,
      actions: []
    };
  }

  static get propTypes() {
    return {
      title: _propTypes2.default.string,
      tabs: _propTypes2.default.object, // Object with title:tab pairs.
      visible: _propTypes2.default.bool,
      fullscreen: _propTypes2.default.bool,
      resizable: _propTypes2.default.bool,
      width: _propTypes2.default.number,
      height: _propTypes2.default.number,
      left: _propTypes2.default.number,
      top: _propTypes2.default.number,
      onCloseClick: _propTypes2.default.func,
      onFullScreenClick: _propTypes2.default.func,
      actions: _propTypes2.default.array
    };
  }

  renderActions() {
    if (this.props.actions.length === 0) {
      return null;
    }

    return _react2.default.createElement(
      _reactPanels.Footer,
      null,
      this.props.actions
    );
  }

  renderTabs() {
    const elements = [];

    for (const tabName in this.props.tabs) {
      elements.push(_react2.default.createElement(
        _reactPanels.Tab,
        { title: tabName, key: tabName },
        _react2.default.createElement(
          _reactPanels.Content,
          null,
          this.props.tabs[tabName]
        ),
        this.renderActions()
      ));
    }

    return elements;
  }

  handleFullscreenClick() {
    if (this.props.onFullScreenClick !== null) {
      this.props.onFullScreenClick();
    }
  }

  handleCloseClick() {
    if (this.props.onCloseClick !== null) {
      this.props.onCloseClick();
    }
  }

  render() {
    return _react2.default.createElement(
      _reactPortal2.default,
      { isOpened: this.props.visible },
      _react2.default.createElement(
        _reactPanels.FloatingPanel,
        {
          theme: "material-ui",
          resizable: this.props.resizable,
          fullscreen: this.props.fullscreen,
          title: this.props.title,
          width: this.props.width,
          height: this.props.height,
          left: this.props.left,
          top: this.props.top,
          buttons: [_react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: "развернуть", onTouchTap: () => this.handleFullscreenClick() },
            this.props.fullscreen ? _react2.default.createElement(_FullscreenExit2.default, { color: "white" }) : _react2.default.createElement(_Fullscreen2.default, { color: "white" })
          ), _react2.default.createElement(
            _IconButton2.default,
            { touch: true, tooltip: "закрыть", onTouchTap: () => this.handleCloseClick() },
            _react2.default.createElement(_Close2.default, { color: "white" })
          )] },
        this.renderTabs()
      )
    );
  }
}
exports.default = Dialog;