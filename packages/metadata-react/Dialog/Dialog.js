import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import FullscreenIcon from 'material-ui-icons/Fullscreen';
import FullscreenExitIcon from 'material-ui-icons/FullscreenExit';
import CloseIcon from 'material-ui-icons/Close';
import ReactPortal from 'react-portal';

import {Content, Toolbar, Footer} from '../Panels/ext';
import {FloatingPanel} from '../Panels/panel';
import {Tab} from '../Panels/tab';

/**
 * Dialog
 * This component use portal for mounting self into document.body.
 */
export default class Dialog extends Component {

  static defaultProps = {
    title: '',
    tabs: {},
    actions: [],
    left: null,
    top: null,
    width: 480,
    height: 400,
    visible: false,
    fullscreen: false,
    resizable: false,
    onCloseClick: null,
    onFullScreenClick: null,
  };

  static propTypes = {
    title: PropTypes.string,
    tabs: PropTypes.object, // Object with title:tab pairs.
    actions: PropTypes.array,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    visible: PropTypes.bool,
    fullscreen: PropTypes.bool,
    resizable: PropTypes.bool,
    onCloseClick: PropTypes.func,
    onFullScreenClick: PropTypes.func,
  };

  renderActions() {
    const {actions} = this.props;
    return actions.length === 0 ? null : <Footer>{actions}</Footer>;
  }

  renderTabs() {
    const {tabs} = this.props;
    const elements = [];
    for (const tabName in tabs) {
      elements.push(<Tab title={tabName} key={tabName}><Content>{tabs[tabName]}</Content>{this.renderActions()}</Tab>);
    }
    // for (const tabName in tabs) {
    //   elements.push(<Tab title={tabName} key={tabName}><Content>{tabName}</Content>{this.renderActions()}</Tab>);
    // }
    return elements;
  }

  handleFullscreenClick() {
    if(this.props.onFullScreenClick !== null) {
      this.props.onFullScreenClick();
    }
  }

  handleCloseClick() {
    if(this.props.onCloseClick !== null) {
      this.props.onCloseClick();
    }
  }

  headerButtons() {
    const {fullscreen} = this.props;
    return [
      <IconButton title={fullscreen ? 'свернуть' : 'развернуть'} onClick={() => this.handleFullscreenClick()}>
        {fullscreen ? <FullscreenExitIcon color={'white'}/> : <FullscreenIcon color={'white'}/>}
      </IconButton>,

      <IconButton title="закрыть" onClick={() => this.handleCloseClick()}>
        <CloseIcon color={'white'}/>
      </IconButton>,
    ];
  }

  render() {

    const {props} = this;

    //{props.visible && props.children}

    return (
      <ReactPortal isOpened={props.visible}>
        <FloatingPanel
          theme={'material-ui'}
          resizable={props.resizable}
          fullscreen={props.fullscreen}
          title={props.title}
          width={props.width}
          height={props.height}
          left={props.left}
          top={props.top}
          buttons={this.headerButtons()}>

          {props.visible && this.renderTabs()}

        </FloatingPanel>
      </ReactPortal>
    );
  }
}
