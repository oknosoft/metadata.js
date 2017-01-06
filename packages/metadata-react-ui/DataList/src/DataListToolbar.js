import React, {Component, PropTypes} from "react";
import {Toolbar, ToolbarGroup, ToolbarSeparator} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";

import AddIcon from "material-ui/svg-icons/content/add-circle-outline";
import RemoveIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import MenuItem from "material-ui/MenuItem";
import PrintIcon from "material-ui/svg-icons/action/print";
import AttachIcon from "material-ui/svg-icons/editor/attach-file";
import SelectIcon from "material-ui/svg-icons/av/playlist-add-check";
import SchemeSettings from "../SchemeSettings";

export default class DataListToolbar extends Component {

  static propTypes = {

    selection_mode: PropTypes.bool,                   // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора

    handleAdd: PropTypes.func.isRequired,             // обработчик добавления объекта
    handleEdit: PropTypes.func.isRequired,            // обработчик открфтия формы редактора
    handleRemove: PropTypes.func.isRequired,          // обработчик удаления строки

    handleSchemeChange: PropTypes.func.isRequired,    // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,              // значение настроек компоновки

    handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
  }

  render() {
    const props = this.props;
    return (

      <Toolbar>
        <ToolbarGroup className={"meta-toolbar-group"} firstChild={true}>

          {
            props.selection_mode ?
              <IconButton touch={true} tooltip="Выбрать из списка" tooltipPosition="bottom-right"
                          onTouchTap={props.handleSelect}>
                <SelectIcon />
              </IconButton>
              :
              null
          }

          <IconButton touch={true} tooltip="Создать объект" tooltipPosition="bottom-right" onTouchTap={props.handleAdd}>
            <AddIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Открыть форму объекта" tooltipPosition="bottom-right"
                      onTouchTap={props.handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton touch={true} tooltip="Пометить на удаление" tooltipPosition="bottom-center"
                      onTouchTap={props.handleRemove}>
            <RemoveIcon />
          </IconButton>

        </ToolbarGroup>

        <ToolbarGroup className={"meta-toolbar-group"}>

          <SchemeSettings
            handleSchemeChange={props.handleSchemeChange}
            scheme={props.scheme}
          />

          <IconMenu
            iconButtonElement={
              <IconButton touch={true} tooltip="Дополнительно" tooltipPosition="bottom-left">
                <MoreVertIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Печать" leftIcon={<PrintIcon />} onTouchTap={props.handlePrint}/>
            <MenuItem primaryText="Вложения" leftIcon={<AttachIcon />} onTouchTap={props.handleAttachment}/>

          </IconMenu>

        </ToolbarGroup>

      </Toolbar>
    )
  }
}

