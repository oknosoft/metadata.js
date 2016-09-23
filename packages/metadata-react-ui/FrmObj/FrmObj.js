import React, { Component, PropTypes } from 'react';
import classes from './FrmObj.scss'
import DataObj from '../DataObj'

export default class FrmObj extends Component {

  render() {
    return (
      <DataObj
        {...this.props}
      />
    );
  }
}
