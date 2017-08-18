import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import AddIcon from "material-ui-icons/AddCircleOutline";
import RemoveIcon from "material-ui-icons/Delete";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";


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

    if (!deny_add_del) {
      first_group.push(
        <IconButton key="btn_add" title="Добавить строку" onClick={handleAdd}>
          <AddIcon key="icon_add"/>
        </IconButton>)
      first_group.push(
        <IconButton key="btn_del" title="Удалить строку" onClick={handleRemove}>
          <RemoveIcon key="icon_del"/>
        </IconButton>)

      if (!deny_reorder) {
        first_group.push(<ToolbarSeparator key="sep1"/>)
      }
    }

    if (!deny_reorder) {
      first_group.push(
        <IconButton key="btn_up" title="Переместить вверх" onClick={handleUp}>
          <ArrowUpIcon key="icon_up"/>
        </IconButton>
      )
      first_group.push(
        <IconButton key="btn_down"  title="Переместить вниз" onClick={handleDown}>
          <ArrowDownIcon key="icon_down"/>
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
