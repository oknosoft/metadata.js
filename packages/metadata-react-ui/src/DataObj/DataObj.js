import React, { Component, PropTypes } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Layout from '../react-flex-layout/react-flex-layout'
import LayoutSplitter from '../react-flex-layout/react-flex-layout-splitter'

import Toolbar from "./Toolbar";
import DataField from 'components/DataField'

import TabularSection from '../TabularSection'

import classes from './DataObj.scss'


import CircularProgress from 'material-ui/CircularProgress';


export default class DataObj extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

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

  constructor(props) {

    super(props);

    this.state = {};
  }

  handleSave(){

    this.props.handleSave(this.props._obj)
  }

  handleSend(){

    this.props.handleSave(this.props._obj)

  }

  handleMarkDeleted(){

  }

  handlePrint(){

  }

  handleAttachment(){

  }

  handleValueChange(_fld){
    return (event, value) => {
      const { _obj, handleValueChange } = this.props
      const old_value = _obj[_fld]
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''))
      handleValueChange(_fld, old_value)
    }
  }


  render() {

    const { width, height, _obj } = this.props

    return (

      _obj
        ?
      <div>

        <Toolbar
          handleSave={::this.handleSave}
          handleSend={::this.handleSend}
          handleMarkDeleted={::this.handleMarkDeleted}
          handlePrint={::this.handlePrint}
          handleAttachment={::this.handleAttachment}
          handleClose={this.props.handleClose}
        />

        <div className={classes.cont} style={{ width }}>

          {/*
          <DataField _obj={_obj} _fld="note" handleValueChange={this.handleValueChange("note")} />

          <TabularSection _obj={_obj} _tabular="cashboxes"/>
           */}

        </div>

      </div>
        :
      <div ><CircularProgress size={120} thickness={5} className={classes.progress} /></div>

    );
  }
}

