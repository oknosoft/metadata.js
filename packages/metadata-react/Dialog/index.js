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
  };

  static propTypes = {
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
  };

  renderActions() {
    const {actions} = this.props;
    return actions.length === 0 ? null : <Footer>{actions}</Footer>;
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
    if(this.props.onFullScreenClick !== null) {
      this.props.onFullScreenClick();
    }
  }

  handleCloseClick() {
    if(this.props.onCloseClick !== null) {
      this.props.onCloseClick();
    }
  }

  render() {

    const {props} = this;

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
          buttons={[
            <IconButton title={props.fullscreen ? 'свернуть' : 'развернуть'} onClick={() => this.handleFullscreenClick()}>
              {props.fullscreen ? <FullscreenExitIcon color={'white'}/> : <FullscreenIcon color={'white'}/>}
            </IconButton>,

            <IconButton title="закрыть" onClick={() => this.handleCloseClick()}>
              <CloseIcon color={'white'}/>
            </IconButton>,
          ]}>

          {/**
           <Tab title="One" icon="fa fa-plane" key="One">
           <Toolbar>Toolbar content of One</Toolbar>
           <Content>Content of One</Content>
           <Footer>Footer content of One</Footer>
           </Tab>
           <Tab title="Two" icon="fa fa-fire" key="Two">
           <Content>Content of Two</Content>
           </Tab>
           **/}

          {this.renderTabs()}

        </FloatingPanel>
      </ReactPortal>
    );
  }
}
