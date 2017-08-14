import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {GridList, GridTile} from 'material-ui/GridList';
import Layout from '../FlexPanel/react-flex-layout/react-flex-layout'
import LayoutSplitter from '../FlexPanel/react-flex-layout/react-flex-layout-splitter'
import Toolbar from "./Toolbar";
import DataField from '../DataField'
import TabularSection from '../TabularSection'
import classes from './DataObj.scss'
import classnames from "classnames"

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


  static propTypes = {
    _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
    _acl: PropTypes.string.isRequired,  // Права на чтение-изменение
    _meta: PropTypes.object,            // Здесь можно переопределить метаданные
    _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

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
    const {_mgr, _meta, match} = props;

    this.state = {
      _meta: _meta || _mgr.metadata(),
      _obj: _mgr.get(match.params.ref),
    };
  }

  handleSave() {
    this.props.handleSave(this.state._obj)
  }

  handleSend() {
    this.props.handleSave(this.state._obj)
  }

  handleClose() {
  }

  handleMarkDeleted() {
  }

  handlePrint() {
  }

  handleAttachment() {
  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {_obj, handleValueChange} = this.props
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
    const {_meta, _obj} = this.state;

    for (const fieldName in _meta.fields) {
      elements.push(
        <div key={fieldName} className={classes.field}>
          <DataField _obj={_obj} _fld={fieldName}/>
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
    const {_meta, _obj} = this.state;
    const style = Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_TABULAR_SECTION);

    for (const tabularSectionName in _meta.tabular_sections) {
      elements.push(
        <Paper key={tabularSectionName} style={style}>
          <TabularSection _obj={_obj} _tabular={tabularSectionName}/>
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
    if (!this.state._obj) {
      return (
        <div>loading</div>
      );
    }

    return (
      <div className={"content-with-toolbar-layout"}>
        <Toolbar
          handleSave={this.handleSave.bind(this)}
          handleSend={this.handleSend.bind(this)}
          handleMarkDeleted={this.handleMarkDeleted.bind(this)}
          handlePrint={this.handlePrint.bind(this)}
          handleAttachment={this.handleAttachment.bind(this)}
          handleClose={this.handleClose.bind(this)}/>

        <div className={"content-with-toolbar-layout__content"}>
          {this.renderFields()}
          {this.renderTabularSections()}
        </div>
      </div>
    );
  }
}

