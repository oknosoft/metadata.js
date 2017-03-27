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
import DataField, {FieldSelect} from "../DataField";
import Divider from 'material-ui/Divider';
import styles from "./styles/SchemeSettingsTabs.scss";

export function getTabsContent(scheme, handleSchemeChange, tabParams) {
  return {
    "Параметры": tabParams ? tabParams : (scheme.query.match('date') ?
      <div style={{height: 356}}>
        <DataField _obj={scheme} _fld="date_from" />
        <DataField _obj={scheme} _fld="date_till" />
      </div>
      :
      <TabularSection _obj={scheme} _tabular="params" minHeight={308} />
    ),

    "Колонки": (<TabularSection _obj={scheme} _tabular="fields" deny_add_del={true} minHeight={308}
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
      }} />),

    "Отбор": (<TabularSection _obj={scheme} _tabular="selection" minHeight={308}
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
      }} />),

    "Группировка": (<div className={styles.groups}>
      <div className={styles.groupDimensions}>
        <TabularSection _obj={scheme} _tabular="dimensions" minHeight={130} />
      </div>

      <div className={styles.groupResources}>
        <TabularSection _obj={scheme} _tabular="resources"  minHeight={130} />
      </div>
    </div>),

    "Сортировка": (
      <TabularSection _obj={scheme} _tabular="sorting" minHeight={308} />
    ),

    "Вариант": (
      <SchemeSettingsSelect scheme={scheme} handleSchemeChange={handleSchemeChange} minHeight={356} />
    )
  }
}

/**
 * Wrapper for tabs whitch returned function above.
 */
export class SchemeSettingsTabs extends Component {
  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    tabParams: PropTypes.object
  }

  state = {
    tab_value: 0
  }

  handleTabChange = (tab_value) => {
    this.setState({
      tab_value
    });
  }

  render() {
    const tabs = getTabsContent(this.props.scheme, this.props.handleSchemeChange, this.props.tabParams);

    // если панель параметров передали снаружи, показываем её
    // если в scheme.query есть 'date', показываем выбор периода
    // по умолчанию, показываем табчать параметров

    const elements = [];
    let tabIndex = 0;

    for (const tabName in tabs) {
      if (Object.prototype.hasOwnProperty.apply(tabs, [tabName]) === false) {
        continue;
      }

      elements.push(<Tab label={tabName} value={tabIndex++} key={tabIndex}>
        {tabs[tabName]}
      </Tab>);
    }

    return (
      <Tabs value={this.state.tab_value} onChange={this.handleTabChange}>
        {elements}
      </Tabs>
    );
  }
}