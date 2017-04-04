import React, { Component, PropTypes } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Layout from '../FlexPanel/react-flex-layout/react-flex-layout'
import LayoutSplitter from '../FlexPanel/react-flex-layout/react-flex-layout-splitter'
import Toolbar from "./Toolbar";
import DataField from '../DataField'
import TabularSection from '../TabularSection'
import classes from './DataObj.scss'
import classnames from "classnames"
import CircularProgress from 'material-ui/CircularProgress';
import Paper from "material-ui/Paper"

export default class DataObj extends Component {
  static PAPER_STYLE = {
    margin: "10px",
  }

  static PAPER_STYLE_FIELDS = {
    padding: "10px",
  }

  static PAPER_STYLE_TABULAR_SECTION = {
    height: "100%",
  }

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {
    _obj: PropTypes.object,             // DataObj, с которым будет связан компонент
    _acl: PropTypes.string.isRequired,  // Права на чтение-изменение

    read_only: PropTypes.object,        // Элемент только для чтения

    handleSave: PropTypes.func,
    handleRevert: PropTypes.func,
    handleMarkDeleted: PropTypes.func,
    handlePost: PropTypes.func,
    handleUnPost: PropTypes.func,
    handlePrint: PropTypes.func,
    handleAttachment: PropTypes.func,
    handleValueChange: PropTypes.func,
    handleAddRow: PropTypes.func,
    handleDelRow: PropTypes.func
  }

  constructor(props) {
    super(props);
    const metadata = this.props._obj._manager.metadata();

    this.state = {
      fields: metadata.fields || {},
      tabularSections: metadata.tabular_sections || {},
    };
  }

  handleSave() {
    this.props.handleSave(this.props._obj)
  }

  handleSend() {
    this.props.handleSave(this.props._obj)
  }

  handleMarkDeleted() {
  }

  handlePrint() {
  }

  handleAttachment() {
  }

  handleValueChange(_fld){
    return (event, value) => {
      const { _obj, handleValueChange } = this.props
      const old_value = _obj[_fld]
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''))
      handleValueChange(_fld, old_value)
    }
  }

  /**
   * Render part with fields.
   * @return {Element}
   */
  renderFields() {
    const elements = [];

    for (const fieldName in this.state.fields) {
      elements.push(
        <div key={fieldName} className={classes.field}>
          <DataField _obj={this.props._obj} _fld={fieldName} />
        </div>
      );
    }

    if (elements.length === 0) {
      return null;
    }

    return (
      <Paper style={Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_FIELDS)}>
        <div className={classes.fields}>
          {elements}
        </div>
      </Paper>
    );
  }

  /**
   * Render part with tabular sections.
   * @return {Element} [description]
   */
  renderTabularSections() {
    const elements = [];
    const style = Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_TABULAR_SECTION);

    for (const tabularSectionName in this.state.tabularSections) {
      elements.push(
        <Paper key={tabularSectionName} style={style}>
          <TabularSection _obj={this.props._obj} _tabular={tabularSectionName} />
        </Paper>
      );
    }

    if (elements.length === 0) {
      return null;
    }

    return (
      <div className={classes.tabularSections}>
        {elements}
      </div>
    );
  }

  render() {
    if (!this.props._obj) {
      return (
        <div>
          <CircularProgress size={120} thickness={5} className={classes.progress} />
        </div>
      );
    }

    return (
      <div className={"content-with-toolbar-layout"}>
        <div className={"content-with-toolbar-layout__toolbar"}>
          <Toolbar
            handleSave={::this.handleSave}
            handleSend={::this.handleSend}
            handleMarkDeleted={::this.handleMarkDeleted}
            handlePrint={::this.handlePrint}
            handleAttachment={::this.handleAttachment}
            handleClose={this.props.handleClose} />
        </div>

        <div className={"content-with-toolbar-layout__content"}>
          {this.renderFields()}
          {this.renderTabularSections()}
        </div>
      </div>
    );
  }
}

