/**
 *
 *
 * @module Dialog
 *
 * Created by Evgeniy Malyarov on 12.09.2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Portal from 'react-portal';
import DnR from './DnR';
import {WindowsTheme} from './themes';

const paneStyle = {
  width: '80%',
  height: '50%',
  top: '25%',
  left: '10%',
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
};

export default class Dialog extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      minimize: false
    };
    this.Windows = WindowsTheme({
      title: props.title || 'React DnR',
      onClose: ()=>this.refs.dnr.minimize(),
      onMinimize: ()=>this.refs.dnr.minimize(),
      onMaximize: ()=>this.refs.dnr.maximize(),
    });
  }

  render() {
    return <Portal isOpened>
      <DnR
        ref='dnr'
        {...this.Windows}
        cursorRemap={(c) => c === 'move' ? 'default' : null}
        style={paneStyle}>
        {this.props.children}
      </DnR>
    </Portal>
  }
}
