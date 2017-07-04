import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";

import AddIcon from "material-ui-icons/AddCircleOutline";
import RemoveIcon from "material-ui-icons/Delete";
import EditIcon from "material-ui-icons/Edit";
import MoreVertIcon from "material-ui-icons/MoreVert";
import PrintIcon from "material-ui-icons/Print";
import AttachIcon from "material-ui-icons/AttachFile";
import SelectIcon from "material-ui-icons/PlaylistAddCheck";

import SchemeSettings from "../SchemeSettings";
import styles from "./DataListToolbar.scss";

export default class DataListToolbar extends Component {

  static propTypes = {
    selection_mode: PropTypes.bool,                   // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
    deny_add_del: PropTypes.bool,                     // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

    handleAdd: PropTypes.func.isRequired,             // обработчик добавления объекта
    handleEdit: PropTypes.func.isRequired,            // обработчик открфтия формы редактора
    handleRemove: PropTypes.func.isRequired,          // обработчик удаления строки

    handleSchemeChange: PropTypes.func.isRequired,    // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,              // значение настроек компоновки

    handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
  }

  render() {

    const {props} = this;

    const buttons = [];

    if (props.selection_mode) {
      buttons.push(
        <IconButton key="select" touch={true} tooltip="Выбрать из списка" tooltipPosition="bottom-right" onTouchTap={props.handleSelect}>
          <SelectIcon />
        </IconButton>
      );
    }

    if (!props.deny_add_del) {
      buttons.push(
        <IconButton key="create" touch={true} tooltip="Создать объект" tooltipPosition="bottom-right" onTouchTap={props.handleAdd}>
          <AddIcon />
        </IconButton>
      );
      buttons.push(
        <IconButton key="edit" touch={true} tooltip="Открыть форму объекта" tooltipPosition="bottom-right" onTouchTap={props.handleEdit}>
          <EditIcon />
        </IconButton>
      );
      buttons.push(
        <IconButton key="del" touch={true} tooltip="Пометить на удаление" tooltipPosition="bottom-center" onTouchTap={props.handleRemove}>
          <RemoveIcon />
        </IconButton>
      );
    }

    return (
      <Toolbar className={styles.dataListToolbar}>
        <ToolbarGroup className={"meta-toolbar-group"} firstChild={true}>
          {buttons}
        </ToolbarGroup>

        <ToolbarGroup className={"meta-toolbar-group"}>
          <SchemeSettings
            handleSchemeChange={props.handleSchemeChange}
            scheme={props.scheme}
            show_search={props.show_search}
            show_variants={props.show_variants}/>

          <IconMenu
            iconButtonElement={
              <IconButton touch={true} tooltip="Дополнительно" tooltipPosition="bottom-left">
                <MoreVertIcon />
              </IconButton>
            }>

            <MenuItem primaryText="Печать" leftIcon={<PrintIcon />} onTouchTap={props.handlePrint}/>
            <MenuItem primaryText="Вложения" leftIcon={<AttachIcon />} onTouchTap={props.handleAttachment}/>

          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

