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
import IconSettings from 'material-ui/svg-icons/action/settings';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SchemeSettingsTabs from './SchemeSettingsTabs';


export default class SchemeSettingsWrapper extends Component{

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    tabParams: PropTypes.object
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

  handleOk = () => {
    this.handleClose();
    this.props.handleSchemeChange(this.state.scheme || this.props.scheme);
  }

  handleSchemeChange = (scheme) => {
    this.props.handleSchemeChange(scheme)
    this.setState({scheme});
  }


  render(){

    const {props, state, handleOpen, handleOk, handleClose, handleSchemeChange} = this;
    const {open, scheme} = state

    const actions = [
      <FlatButton
        label="Применить"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleOk}
      />,
      <FlatButton
        label="Отмена"
        secondary={true}
        onTouchTap={handleClose}
      />,
    ];

    return(

      <div>

        <IconButton touch={true} tooltip="Настройка списка" onTouchTap={handleOpen}>
          <IconSettings />
        </IconButton>

        <Dialog
          title="Настройка списка"
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={open}
          onRequestClose={handleClose}
        >

          <SchemeSettingsTabs
            handleSchemeChange={handleSchemeChange}
            scheme={scheme || props.scheme}
            tabParams={props.tabParams}
          />

        </Dialog>

      </div>
    )
  }

}
