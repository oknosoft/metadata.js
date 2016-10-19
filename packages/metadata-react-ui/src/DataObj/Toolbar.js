import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import SendIcon from 'material-ui/svg-icons/content/send';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import PrintIcon from 'material-ui/svg-icons/action/print';
import AttachIcon from 'material-ui/svg-icons/editor/attach-file';


import classes from './DataObj.scss'

export default class DataObjToolbar extends Component{

  static propTypes = {

    handleSave: PropTypes.func.isRequired,        // обработчик добавления объекта
    handleSend: PropTypes.func.isRequired,        // команда Отправить
    handleMarkDeleted: PropTypes.func.isRequired,      // команда Отозвать

    handlePrint: PropTypes.func.isRequired,       // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,  // обработчик открытия диалога присоединенных файлов
    handleClose: PropTypes.func.isRequired,       // команда Закрыть форму

  }

  render(){
    const props = this.props;
    return (

      <Toolbar className={classes.toolbar}>
        <ToolbarGroup firstChild={true}>
          <IconButton touch={true} tooltip="Записать" tooltipPosition="bottom-right" onTouchTap={props.handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Отправить на согласование" tooltipPosition="bottom-right" onTouchTap={props.handleSend}>
            <SendIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Отозвать заказ" onTouchTap={props.handleMarkDeleted}>
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

          <IconButton touch={true} tooltip="Закрыть форму" tooltipPosition="bottom-left" onTouchTap={props.handleClose}>
            <CloseIcon />
          </IconButton>

        </ToolbarGroup>

      </Toolbar>
    )
  }
}

