import React, { Component, PropTypes } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Layout from '../../react-flex-layout/react-flex-layout'
import LayoutSplitter from '../../react-flex-layout/react-flex-layout-splitter'

import Toolbar from "./Toolbar";
import DataField from '../DataField'

import TabularSection from '../TabularSection'

import classes from './DataObj.scss'


import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: '8px'
  },
  block: {
    //flex: '1 100%',
    fontWeight: 'bold'
  }
}

export default class DataObj extends Component {

  static contextTypes = {
    screen: React.PropTypes.object.isRequired
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

    const { screen } = this.context
    const { _obj } = this.props


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

        <div className={classes.cont} style={{width: screen.width}}>

          <div style={styles.block}>{_obj.presentation}, заявитель: {_obj.partner.presentation}</div>

          <Layout layoutWidth={screen.width - 24} layoutHeight={screen.height - 140} >
            <Layout layoutWidth={'flex'}>

              {/*<DataField _obj={_obj} _fld="partner" />
              <DataField _obj={_obj.partner} _fld="phone" />*/}
              <DataField _obj={_obj} _fld="НачалоПериода" handleValueChange={this.handleValueChange("НачалоПериода")} />
              <DataField _obj={_obj} _fld="КонецПериода" handleValueChange={this.handleValueChange("КонецПериода")} />
              <DataField _obj={_obj} _fld="КоличествоДней" handleValueChange={this.handleValueChange("КоличествоДней")} />
              <DataField _obj={_obj} _fld="note" handleValueChange={this.handleValueChange("note")} />

              <TabularSection _obj={_obj} _tabular="guests"/>

            </Layout>
            <LayoutSplitter />
            <Layout layoutWidth={Math.floor((screen.width - 24)/3)}>

              <DataField _obj={_obj} _fld="Санаторий" handleValueChange={this.handleValueChange("Санаторий")} />
              <DataField _obj={_obj} _fld="КатегорияПутевки" handleValueChange={this.handleValueChange("КатегорияПутевки")} />
              <DataField _obj={_obj} _fld="КатегорияНомера" handleValueChange={this.handleValueChange("КатегорияНомера")} />
              <DataField _obj={_obj} _fld="КоличествоМестЗабронировано" disabled={true} />
              <DataField _obj={_obj} _fld="КоличествоМестОтказано" disabled={true} />
              <DataField _obj={_obj} _fld="АктуальноеКоличествоМест" disabled={true} />
              <DataField _obj={_obj} _fld="organization" handleValueChange={this.handleValueChange("organization")} />

            </Layout>
          </Layout>

        </div>

      </div>
        :
      <div ><CircularProgress size={120} thickness={5} className={classes.progress} /></div>

    );
  }
}

