/**
 * ### Контейнер сохраненных настроек
 * Кнопка открытия + диалог
 *
 * @module SchemeSettingsWrapper
 *
 * Created 31.12.2016
 */

import React, { Component, PropTypes } from 'react';

import IconButton from 'material-ui/IconButton';
import IconFilter from 'material-ui/svg-icons/content/filter-list';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SchemeSettingsTabs from './SchemeSettingsTabs';


export default class SchemeSettingsWrapper extends Component{

  static propTypes = {
    handleSchemeChange: PropTypes.func.isRequired,
    scheme: PropTypes.object.isRequired,
    schemas: PropTypes.object.isRequired
  }

  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }


  render(){

    const actions = [
      <FlatButton
        label="Отмена"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return(

      <div>

        <IconButton touch={true} tooltip="Настройка списка" onTouchTap={this.handleOpen}>
          <IconFilter />
        </IconButton>

        <Dialog
          title="Настройка списка"
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          <SchemeSettingsTabs {...this.props} />

        </Dialog>

      </div>
    )
  }

}