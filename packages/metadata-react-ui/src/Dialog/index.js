import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import IconButton from "material-ui/IconButton";
import FullscreenIcon from "material-ui/svg-icons/navigation/fullscreen";
import FullscreenExitIcon from "material-ui/svg-icons/navigation/fullscreen-exit";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import ReactPortal from "react-portal";

import {
  Button,
  Content,
  FloatingPanel,
  Footer,
  Tab,
  Toolbar,
} from "react-panels";

/**
 * Dialog
 * This component use portal for mounting self into document.body.
 */
export default class Dialog extends Component {
  static get defaultProps() {
    return {
      title: "",
      tabs: {},
      left: 0,
      top: 50,
      width: 420,
      height: 400,
      isVisible: false,
      isFullscreen: false,
      isResizable: false,
      onCloseClick: null,
      onFullScreenClick: null
    }
  }

  static get propTypes() {
    return {
      title: PropTypes.string,
      tabs: PropTypes.object, // Object with title:tab pairs.
      isVisible: PropTypes.bool,
      isFullscreen: PropTypes.bool,
      isResizable: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      onCloseClick: PropTypes.func,
      onFullScreenClick: PropTypes.func,
    }
  }

  constructor(props) {
    super(props);
  }

  renderTabs() {
    const elements = [];

    for (const tabName in this.props.tabs) {
      elements.push(<Tab title={tabName} key={tabName}>
        <Content>
          {this.props.tabs[tabName]}
        </Content>
      </Tab>);
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
    return (
      <ReactPortal isOpened={this.props.isVisible}>
        <FloatingPanel
          theme={"material-ui"}
          isResizable={this.props.isResizable}
          isFullscreen={this.props.isFullscreen}
          title={this.props.title}
          width={this.props.width}
          height={this.props.height}
          left={this.props.left}
          top={this.props.top}
          buttons={[
            <IconButton tooltip={"развернуть"} onTouchTap={() => this.handleFullscreenClick()}>
              {this.props.isFullscreen ? <FullscreenExitIcon color={"white"} /> : <FullscreenIcon color={"white"} />}
            </IconButton>,

            <IconButton tooltip={"закрыть"} onTouchTap={() => this.handleCloseClick()}>
              <CloseIcon color={"white"} />
            </IconButton>,
          ]}>

          {this.renderTabs()}
        </FloatingPanel>
      </ReactPortal>
    );
  }
}