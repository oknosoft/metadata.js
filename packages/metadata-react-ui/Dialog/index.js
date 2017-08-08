import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import IconButton from "material-ui/IconButton";
import FullscreenIcon from "material-ui-icons/Fullscreen";
import FullscreenExitIcon from "material-ui-icons/FullscreenExit";
import CloseIcon from "material-ui-icons/Close";
import ReactPortal from "react-portal";

import {
  Content,
  FloatingPanel,
  Tab,
  Footer
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
      left: null,
      top: null,
      width: 420,
      height: 400,
      visible: false,
      fullscreen: false,
      resizable: false,
      onCloseClick: null,
      onFullScreenClick: null,
      actions: [],
    }
  }

  static get propTypes() {
    return {
      title: PropTypes.string,
      tabs: PropTypes.object, // Object with title:tab pairs.
      visible: PropTypes.bool,
      fullscreen: PropTypes.bool,
      resizable: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      onCloseClick: PropTypes.func,
      onFullScreenClick: PropTypes.func,
      actions: PropTypes.array,
    }
  }

  renderActions() {
    if (this.props.actions.length === 0) {
      return null;
    }

    return (
      <Footer>
        {this.props.actions}
      </Footer>
    );
  }

  renderTabs() {
    const elements = [];

    for (const tabName in this.props.tabs) {
      elements.push(<Tab title={tabName} key={tabName}>
        <Content>
          {this.props.tabs[tabName]}
        </Content>

        {this.renderActions()}
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
      <ReactPortal isOpened={this.props.visible}>
        <FloatingPanel
          theme={"material-ui"}
          resizable={this.props.resizable}
          fullscreen={this.props.fullscreen}
          title={this.props.title}
          width={this.props.width}
          height={this.props.height}
          left={this.props.left}
          top={this.props.top}
          buttons={[
            <IconButton touch={true} title="развернуть" onClick={() => this.handleFullscreenClick()}>
              {this.props.fullscreen ? <FullscreenExitIcon color={"white"}/> : <FullscreenIcon color={"white"}/>}
            </IconButton>,

            <IconButton touch={true} title="закрыть" onClick={() => this.handleCloseClick()}>
              <CloseIcon color={"white"}/>
            </IconButton>,
          ]}>

          {this.renderTabs()}
        </FloatingPanel>
      </ReactPortal>
    );
  }
}
