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
import {export_handlers} from '../plugin';


class TabularSectionToolbar extends Component {

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,     // обработчик добавления объекта
    handleRemove: PropTypes.func.isRequired,  // обработчик удаления строки
    handleUp: PropTypes.func.isRequired,      // обработчик удаления строки
    handleDown: PropTypes.func.isRequired,    // обработчик удаления строки

    denyAddDel: PropTypes.bool,             // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    denyReorder: PropTypes.bool,             // Запрет изменения порядка строк

  }

  constructor(props, context) {

    super(props, context);

    this.state = {
      anchorEl: undefined,
      menuOpen: false,
    };

    export_handlers.call(this);
  }

  render() {

    const {props, state} = this;
    const {handleAdd, handleRemove, handleUp, handleDown, denyAddDel, denyReorder, classes} = props;

    return (
      <Toolbar className={classes.bar}>
        {!denyAddDel && <IconButton key="btn_add" title="Добавить строку" onClick={handleAdd}><AddIcon /></IconButton>}
        {!denyAddDel && <IconButton key="btn_del" title="Удалить строку" onClick={handleRemove}><RemoveIcon /></IconButton>}
        {!denyAddDel && !denyReorder && <IconButton key="sep1" disabled>|</IconButton>}
        {!denyReorder && <IconButton key="btn_up" title="Переместить вверх" onClick={handleUp}><ArrowUpIcon/></IconButton>}
        {!denyReorder && <IconButton key="btn_down"  title="Переместить вниз" onClick={handleDown}><ArrowDownIcon/></IconButton>}

        <Typography type="title" color="inherit" className={classes.flex}> </Typography>

        <IconButton onClick={this.handleMenuOpen} title="Дополнительно">
          <MoreVertIcon/>
        </IconButton>
        <Menu
          anchorEl={state.anchorEl}
          open={state.menuOpen}
          onRequestClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.handleExportCSV}><CopyIcon/> &nbsp;Копировать CSV</MenuItem>
          <MenuItem onClick={this.handleExportJSON}><CloudDownloadIcon/> &nbsp;Копировать JSON</MenuItem>
          <MenuItem onClick={this.handleExportXLS}><FileDownloadIcon/> &nbsp;Экспорт в XLS</MenuItem>

        </Menu>

      </Toolbar>
    )
  }
}

export default withStyles(TabularSectionToolbar);
