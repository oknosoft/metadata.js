import React, { Component, PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/image/edit';

import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import PrintIcon from 'material-ui/svg-icons/action/print';
import AttachIcon from 'material-ui/svg-icons/editor/attach-file';

import Filter from '../DataSelection';

import classes from './DataList.scss'

export default class DataListToolbar extends Component{

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,             // обработчик добавления объекта
    handleEdit: PropTypes.func.isRequired,            // обработчик открфтия формы редактора
    handleRemove: PropTypes.func.isRequired,          // обработчик удаления строки

    handleSelectionChange: PropTypes.func.isRequired, // ??? обработчик при изменении фильтра
    selectionValue: PropTypes.object.isRequired,      // значение фильтра

    handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
  }

  render(){
    const props = this.props;
    return (

      <Toolbar className={classes.toolbar}>
        <ToolbarGroup firstChild={true}>

          <IconButton touch={true} tooltip="Создать объект" tooltipPosition="bottom-right" onTouchTap={props.handleAdd}>
            <AddIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Открыть форму объекта" tooltipPosition="bottom-right" onTouchTap={props.handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Пометить на удаление" onTouchTap={props.handleRemove}>
            <RemoveIcon />
          </IconButton>

          <ToolbarSeparator />
          <Filter selectionChange={props.handleSelectionChange} selectionValue={props.selectionValue} />
        </ToolbarGroup>

        <ToolbarGroup>

          <IconMenu
            iconButtonElement={
              <IconButton touch={true} tooltip="Дополнительно" tooltipPosition="bottom-left">
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

