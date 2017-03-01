import React, {Component, PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import FullscreenIcon from "material-ui/svg-icons/navigation/fullscreen";
import CloseIcon from "material-ui/svg-icons/navigation/close";

import {
  Button,
  Content,
  FloatingPanel,
  Footer,
  Tab,
  Toolbar,
} from "react-panels";

export default class Dialog extends Component {
  static get defaultProps() {
    return {
      title: "",
      tabs: {},
      actions: [],
      width: 420,
      height: 500,
      isVisible: false,
      left: 0,
      top: 0,
      onCloseClick: null,
      onFullScreenClick: null
    }
  }

  static get propTypes() {
    return {
      title: PropTypes.string,
      tabs: PropTypes.object, // Object with title:tab pairs.
      actions: PropTypes.array,
      isVisible: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      onCloseClick: PropTypes.func,
      onFullScreenClick: PropTypes.func,
    }
  }

  constructor(props) {
    super(props)
  }

  renderTabs() {
    const elements = [];

    for (const tabName in this.props.tabs) {
      elements.push(<Tab title={tabName} key={tabName}>
        <Content>
          {this.props.tabs[tabName]}
        </Content>

        <Footer>
          {this.props.actions}
        </Footer>
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
    if (this.props.isVisible === false) {
      return null
    }

    return (
      <FloatingPanel
        theme={"flexbox"}
        skin={"material-ui"}

        title={this.props.title}
        width={this.props.width}
        height={this.props.height}
        left={this.props.left}
        top={this.props.top}

        buttons={[
          <IconButton tooltip={"развернуть"} onTouchTap={() => this.handleFullscreenClick()}>
            <FullscreenIcon color={"white"} />
          </IconButton>,

          <IconButton tooltip={"закрыть"} onTouchTap={() => this.handleCloseClick()}>
            <CloseIcon color={"white"} />
          </IconButton>,
        ]}>

        {this.renderTabs()}
      </FloatingPanel>
    )
  }
}