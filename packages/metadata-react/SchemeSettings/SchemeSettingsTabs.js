/**
 * ### Табы сохраненных настроек
 * По умолчанию, приклеены к диалогу, но их можно расположить где угодно
 *
 * @module SchemeSettings
 *
 * Created 19.12.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import {DialogActions, DialogContent} from 'material-ui/Dialog';
import {FormGroup} from 'material-ui/Form';
import Tabs, {Tab} from 'material-ui/Tabs';

import TabularSection from '../TabularSection';
import SchemeSettingsSelect from './SchemeSettingsSelect';
import DataField, {FieldSelect} from '../DataField';
import Divider from 'material-ui/Divider';

import spacing from 'material-ui/styles/spacing';


/**
 * Wrapper for tabs whitch returned function above.
 */
export default class SchemeSettingsTabs extends Component {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    handleDialogClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired,
    tabParams: PropTypes.object,
  };

  static contextTypes = {
    dnr: PropTypes.object
  };

  state = {value: 0};

  handleTabChange = (event, value) => {
    this.setState({value});
  };

  get sizes() {
    const {dnr} = this.context;
    let {width, height} = this.props;
    if(!height) {
      height = dnr && parseInt(dnr.frameRect.height) - 130;
    }
    if(!height || height < 260) {
      height = 260;
    }
    if(!width) {
      width = dnr && parseInt(dnr.frameRect.width);
    }
    if(!width || width < 480) {
      width = 480;
    }
    return {width, height};
  }

  rowSelection() {
    return {
      showCheckbox: true,
      enableShiftSelect: true,
      selectBy: {
        keys: {
          rowKey: 'field',
          markKey: 'use',
          values: this.scheme.used_fields()
        }
      }
    }
  }

  render() {

    const {state, props, sizes} = this;
    const {scheme, handleSchemeChange, handleDialogClose, handleOk, tabParams} = props;
    const {value} = state;

    return <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="auto"
        >
          <Tab label="Параметры"/>
          <Tab label="Колонки"/>
          <Tab label="Отбор"/>
          <Tab label="Группировка"/>
          <Tab label="Сортировка"/>
          <Tab label="Вариант"/>
        </Tabs>
      </AppBar>

      <div style={{height: sizes.height}}>
        {value === 0 &&
        (tabParams ? tabParams : (
          scheme.query.match('date') ?
            <div>
              <DataField _obj={scheme} _fld="date_from"/>
              <DataField _obj={scheme} _fld="date_till"/>
            </div>
            :
            <TabularSection _obj={scheme} _tabular="params"/>
        ))}

        {value === 1 && <TabularSection _obj={scheme} _tabular="fields" rowSelection={this.rowSelection()} denyAddDel={true}/>}

        {value === 2 && <TabularSection _obj={scheme} _tabular="selection" rowSelection={this.rowSelection()}/>}

        {value === 3 && <FormGroup style={{minHeight: 340, margin: 8}}>
          <FormGroup row style={{minHeight: 160, height: '50%'}}>
            <TabularSection _obj={scheme} _tabular="dimensions" rowSelection={this.rowSelection()} minHeight={130} />
          </FormGroup>
          <FormGroup row>
            <TabularSection _obj={scheme} _tabular="resources" minHeight={130}/>
          </FormGroup>
        </FormGroup>}

        {value === 4 && <TabularSection _obj={scheme} _tabular="sorting" rowSelection={this.rowSelection()}/>}

        {value === 5 && <SchemeSettingsSelect scheme={scheme} handleSchemeChange={handleSchemeChange} />}
      </div>

      <DialogActions style={{margin: 0}}>
        <Button dense onClick={handleDialogClose} style={{margin: spacing.unit}}>Отмена</Button>
        <Button dense onClick={handleOk} style={{margin: spacing.unit}}>Применить</Button>
      </DialogActions>

    </div>;
  }
}
