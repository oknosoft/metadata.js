import React, {Component, PropTypes} from "react";
import {Toolbar, ToolbarGroup, ToolbarSeparator} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import AddIcon from "material-ui/svg-icons/content/add-circle-outline";
import RemoveIcon from "material-ui/svg-icons/action/delete";
import ArrowUpIcon from "material-ui/svg-icons/navigation/arrow-upward";
import ArrowDownIcon from "material-ui/svg-icons/navigation/arrow-downward";


export default class TabularSectionToolbar extends Component {

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,     // обработчик добавления объекта
    handleRemove: PropTypes.func.isRequired,  // обработчик удаления строки
    handleUp: PropTypes.func.isRequired,      // обработчик удаления строки
    handleDown: PropTypes.func.isRequired,    // обработчик удаления строки

    deny_add_del: PropTypes.bool,             // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    deny_reorder: PropTypes.bool,             // Запрет изменения порядка строк

  }

  render() {

    const {handleAdd, handleRemove, handleUp, handleDown, deny_add_del, deny_reorder} = this.props

    const first_group = [];

    if(!deny_add_del){
      first_group.push(
        <IconButton key="btn_add" touch={true} tooltip="Добавить строку" tooltipPosition="bottom-right" onTouchTap={handleAdd}>
          <AddIcon key="icon_add" />
        </IconButton>)
      first_group.push(
        <IconButton key="btn_del" touch={true} tooltip="Удалить строку" tooltipPosition="bottom-right" onTouchTap={handleRemove}>
          <RemoveIcon key="icon_del" />
        </IconButton>)

      if(!deny_reorder){
        first_group.push(<ToolbarSeparator key="sep1" />)
      }
    }

    if(!deny_reorder){
      first_group.push(
        <IconButton key="btn_up" touch={true} tooltip="Переместить вверх" tooltipPosition="bottom-right" onTouchTap={handleUp}>
          <ArrowUpIcon key="icon_up" />
        </IconButton>
      )
      first_group.push(
        <IconButton key="btn_down" touch={true} tooltip="Переместить вниз" tooltipPosition="bottom-right" onTouchTap={handleDown}>
          <ArrowDownIcon key="icon_down" />
        </IconButton>
      )
    }

    return (
      <Toolbar>
        <ToolbarGroup className={"meta-toolbar-group"} firstChild={true}>
          {first_group}
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
