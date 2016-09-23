import React, { Component, PropTypes } from 'react';
import classes from './DataObj.scss'

import DataField from '../DataField'

import TextField from '../DataField/FieldText'



import CircularProgress from 'material-ui/CircularProgress';

export default class DataObj extends Component {

  static propTypes = {
    _obj: PropTypes.object,
    _acl: PropTypes.string.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleRevert: PropTypes.func.isRequired,
    handleMarkDeleted: PropTypes.func.isRequired,
    handlePost: PropTypes.func.isRequired,
    handleUnPost: PropTypes.func.isRequired,
    handlePrint: PropTypes.func.isRequired,
    handleAttachment: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddRow: PropTypes.func.isRequired,
    handleDelRow: PropTypes.func.isRequired
  }

  render() {
    return (

      this.props._obj
        ?
      <div className={classes.table}>

        <div className={classes.row}>{this.props._obj.presentation}</div>

        <DataField _obj={this.props._obj} _fld="cash_flow_article" />

        <TextField _obj={this.props._obj} _fld="cash_flow_article" />



      </div>
        :
      <div ><CircularProgress size={1.5} className={classes.progress} /></div>

    );
  }
}

