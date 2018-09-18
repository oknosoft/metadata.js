import React, {Component} from "react";
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/Delete';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileDownloadIcon from '@material-ui/icons/ArrowDropDownCircle';
import IconSettings from '@material-ui/icons/Settings';
import IconSettingsCancel from '@material-ui/icons/HighlightOff';
import IconSettingsDone from '@material-ui/icons/Done';

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
    const {handleAdd, handleRemove, handleUp, handleDown, denyAddDel, denyReorder, classes, width, settings_open} = props;

    return (
      <Toolbar disableGutters className={classes.toolbar} style={{width: width || '100%'}}>
        {[
          !denyAddDel && <IconButton key="btn_add" title="Добавить строку" onClick={handleAdd}><AddIcon /></IconButton>,
          !denyAddDel && <IconButton key="btn_del" title="Удалить строку" onClick={handleRemove}><RemoveIcon /></IconButton>,
          !denyAddDel && !denyReorder && <IconButton key="sep1" disabled>|</IconButton>,
          !denyReorder && <IconButton key="btn_up" title="Переместить вверх" onClick={handleUp}><ArrowUpIcon/></IconButton>,
          !denyReorder && <IconButton key="btn_down"  title="Переместить вниз" onClick={handleDown}><ArrowDownIcon/></IconButton>,

          <Typography key="space" variant="title" color="inherit" className={classes.flex}> </Typography>,

          !settings_open && <IconButton key="more" onClick={this.handleMenuOpen} title="Дополнительно">
            <MoreVertIcon/>
          </IconButton>,

          !settings_open && <Menu key="menu" anchorEl={state.anchorEl} open={state.menuOpen} onClose={this.handleMenuClose}>
            <MenuItem onClick={this.handleExportCSV}><CopyIcon/> &nbsp;Копировать CSV</MenuItem>
            <MenuItem onClick={this.handleExportJSON}><CloudDownloadIcon/> &nbsp;Копировать JSON</MenuItem>
            <MenuItem onClick={this.handleExportXLS}><FileDownloadIcon/> &nbsp;Экспорт в XLS</MenuItem>

            <MenuItem onClick={() => {
              this.handleMenuClose();
              props.handleSettingsOpen();
            }}><IconSettings/> &nbsp;Настройка списка</MenuItem>

          </Menu>,

          settings_open && <IconButton key="ss4" title="Применить настройки" onClick={props.handleSettingsClose}><IconSettingsDone/></IconButton>,
          settings_open && <IconButton key="ss5" title="Скрыть настройки" onClick={props.handleSettingsClose}><IconSettingsCancel/></IconButton>

        ]}
      </Toolbar>
    )
  }
}

export default withStyles(TabularSectionToolbar);
