import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import SendIcon from 'material-ui/svg-icons/content/send';
import RemoveIcon from 'material-ui/svg-icons/action/delete';

import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import PrintIcon from 'material-ui/svg-icons/action/print';
import AttachIcon from 'material-ui/svg-icons/editor/attach-file';


import classes from './DataObj.scss'

export default class DataListToolbar extends Component{

  static propTypes = {

    handleSave: PropTypes.func.isRequired,             // обработчик добавления объекта
    handleSend: PropTypes.func.isRequired,            // команда Отправить
    handleRemove: PropTypes.func.isRequired,          // команда Отозвать

    handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
  }

  render(){
    const props = this.props;
    return (

      <Toolbar className={classes.toolbar}>
        <ToolbarGroup firstChild={true}>
          <IconButton touch={true} onTouchTap={props.handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton touch={true} onTouchTap={props.handleSend}>
            <SendIcon />
          </IconButton>
          <IconButton touch={true} onTouchTap={props.handleRemove}>
            <RemoveIcon />
          </IconButton>

        </ToolbarGroup>

        <ToolbarGroup>

          <IconMenu
            iconButtonElement={
              <IconButton touch={true} tooltip="Дополнительно">
                <MoreVertIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Печать" leftIcon={<PrintIcon />} onTouchTap={props.handlePrint} />
            <MenuItem primaryText="Вложения" leftIcon={<AttachIcon />} onTouchTap={props.handleAttachment} />

          </IconMenu>
        </ToolbarGroup>

      </Toolbar>
    )
  }
}

