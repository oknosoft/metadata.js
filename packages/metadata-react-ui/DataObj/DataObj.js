import React, { Component, PropTypes } from 'react';
import classes from './DataObj.scss'

import Toolbar from "./Toolbar";
import DataField from '../DataField'
import Subheader from 'material-ui/Subheader';


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
      <div>

        <Toolbar
          handleSave={this.handleSave}
          handleSend={this.handleSend}
          handleRemove={this.handleRemove}
          handlePrint={this.handlePrint}
          handleAttachment={this.handleAttachment}
        />

        <Subheader>{this.props._obj.presentation}</Subheader>

        <div className={classes.table50}>
          <DataField _obj={this.props._obj} _fld="number_doc" />
          <DataField _obj={this.props._obj} _fld="КатегорияНомера" />

        </div>


      </div>
        :
      <div ><CircularProgress size={1.5} className={classes.progress} /></div>

    );
  }
}

