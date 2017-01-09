/**
 * ### Табы сохраненных настроек
 * По умолчанию, приклеены к диалогу, но их можно расположить где угодно
 *
 * @module SchemeSettings
 *
 * Created 19.12.2016
 */

import React, {Component, PropTypes} from "react";
import {Tabs, Tab} from "material-ui/Tabs";
import TabularSection from "../TabularSection";
import SchemeSettingsSelect from "./SchemeSettingsSelect"


export default class SchemeSettingsTabs extends Component {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    tabParams: PropTypes.object
  }

  state = {
    tab_value: 'p'
  }

  handleTabChange = (tab_value) => {
    this.setState({tab_value})
  }

  render() {

    const {handleSchemeChange, scheme, tabParams} = this.props

    return (

      <Tabs
        value={this.state.tab_value}
        onChange={this.handleTabChange}
      >

        <Tab label="Параметры" value="p">

          {
            tabParams ?
              tabParams
              :
              <TabularSection
                _obj={scheme}
                _tabular="params"
                minHeight={160}
              />
          }

          <TabularSection
            _obj={scheme}
            _tabular="selection"
            minHeight={120}

            rowSelection={{
              showCheckbox: true,
              enableShiftSelect: true,
              selectBy: {
                keys: {
                  rowKey: "field",
                  markKey: "use",
                  values: scheme.used_fields()
                }
              }
            }}

          />

        </Tab>

        <Tab label="Колонки" value="c">

          <TabularSection
            _obj={scheme}
            _tabular="fields"
            deny_add_del={true}
            minHeight={328}

            rowSelection={{
              showCheckbox: true,
              enableShiftSelect: true,
              selectBy: {
                keys: {
                  rowKey: "field",
                  markKey: "use",
                  values: scheme.used_fields()
                }
              }
            }}
          />

        </Tab>

        <Tab label="Группировка" value="g">

          <TabularSection
            _obj={scheme}
            _tabular="dimensions"
            minHeight={140}
          />

          <TabularSection
            _obj={scheme}
            _tabular="resources"
            minHeight={140}
          />

        </Tab>

        <Tab label="Сортировка" value="s">

          <TabularSection
            _obj={scheme}
            _tabular="sorting"
            minHeight={328}
          />

        </Tab>

        <Tab label="Вариант" value="v">

          <SchemeSettingsSelect
            scheme={scheme}
            handleSchemeChange={handleSchemeChange}
            minHeight={376}
          />

        </Tab>

      </Tabs>
    )
  }

}
