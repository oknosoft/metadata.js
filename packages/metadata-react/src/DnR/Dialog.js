/**
 *
 *
 * @module Dialog
 *
 * Created by Evgeniy Malyarov on 12.09.2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Portal} from 'react-portal';
import DnR from './DnR';
import {WindowsTheme} from './themes';

const paneStyle = {
  width: '60%',
  height: '70%',
  top: '20%',
  left: '10%',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0'
};

export default class Dialog extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      minimize: false
    };
    this.Windows = WindowsTheme({
      title: props.title || 'React DnR',
      onClose: this.onClose.bind(this),
      onMinimize: ()=>this._dnr.restore(),
      onMaximize: ()=>this._dnr.maximize(),
    });
  }

  onClose() {

    const {_dnr, props} = this;
    if(_dnr.state.cursor && _dnr.state.cursor.indexOf('resize') == -1){
      _dnr.minimize();
      props.onClose && setTimeout(props.onClose, 200);
    }
  }

  render() {
    const {children, ...others} = this.props;
    return <Portal isOpened>
      <DnR
        ref={(el) => this._dnr = el}
        {...this.Windows}
        cursorRemap={(c) => c === 'move' ? 'default' : null}
        style={paneStyle}
        //contentStyle={{overflow: 'auto'}}
        {...others}
      >
        {children}
      </DnR>
    </Portal>
  }
}
