import React, {Component} from "react";
import PropTypes from 'prop-types';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from "material-ui/IconButton";
import AddIcon from "material-ui-icons/AddCircleOutline";
import RemoveIcon from "material-ui-icons/Delete";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";

import withStyles from '../Header/toolbar';


class TabularSectionToolbar extends Component {

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,     // обработчик добавления объекта
    handleRemove: PropTypes.func.isRequired,  // обработчик удаления строки
    handleUp: PropTypes.func.isRequired,      // обработчик удаления строки
    handleDown: PropTypes.func.isRequired,    // обработчик удаления строки

    denyAddDel: PropTypes.bool,             // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    denyReorder: PropTypes.bool,             // Запрет изменения порядка строк

  }

  render() {

    const {handleAdd, handleRemove, handleUp, handleDown, denyAddDel, denyReorder, classes} = this.props

    const first_group = [];

    if (!denyAddDel) {
      first_group.push(<IconButton key="btn_add" title="Добавить строку" onClick={handleAdd}><AddIcon /></IconButton>)
      first_group.push(<IconButton key="btn_del" title="Удалить строку" onClick={handleRemove}><RemoveIcon /></IconButton>)

      if (!denyReorder) {
        first_group.push(<IconButton key="sep1" disabled>|</IconButton>)
      }
    }

    if (!denyReorder) {
      first_group.push(
        <IconButton key="btn_up" title="Переместить вверх" onClick={handleUp}><ArrowUpIcon/></IconButton>
      )
      first_group.push(
        <IconButton key="btn_down"  title="Переместить вниз" onClick={handleDown}><ArrowDownIcon/></IconButton>
      )
    }

    return (
      <Toolbar className={classes.bar}>
        {first_group}
      </Toolbar>
    )
  }
}

export default withStyles(TabularSectionToolbar);
