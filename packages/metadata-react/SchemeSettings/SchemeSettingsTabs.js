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
    tabParams: PropTypes.object,
  };

  static contextTypes = {
    dnr: PropTypes.object
  };

  state = {
    value: 0
  };

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

  rowSelection(scheme, by_row) {
    return {
      showCheckbox: true,
      enableShiftSelect: true,
      selectBy: {
        keys: {
          rowKey: by_row ? 'row' : 'field',
          markKey: 'use',
          values: by_row ? scheme[by_row].find_rows({use: true}).map(r => r.row) : scheme.used_fields()
        }
      }
    }
  }

  render() {

    const {state, props, sizes} = this;
    const {scheme, handleSchemeChange, tabParams} = props;
    const {value} = state;
    const is_tabular = scheme.obj.split('.').length > 2;

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
          {is_tabular && <Tab label="Группировка"/>}
          {is_tabular && <Tab label="Ресурсы"/>}
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

        {value === 1 && <TabularSection _obj={scheme} _tabular="fields" rowSelection={this.rowSelection(scheme)} denyAddDel />}

        {value === 2 && <TabularSection _obj={scheme} _tabular="selection" rowSelection={this.rowSelection(scheme, 'selection')} />}

        {is_tabular && (value === 3) && <TabularSection _obj={scheme} _tabular="dimensions" rowSelection={this.rowSelection(scheme, 'dimensions')} />}

        {is_tabular && (value === 4) && <TabularSection _obj={scheme} _tabular="resources"/> }

        {value === (is_tabular ? 5 : 3) && <TabularSection _obj={scheme} _tabular="sorting" rowSelection={this.rowSelection(scheme, 'sorting')} />}

        {value === (is_tabular ? 6 : 4) && <SchemeSettingsSelect scheme={scheme} handleSchemeChange={handleSchemeChange} />}

      </div>

    </div>;
  }
}
