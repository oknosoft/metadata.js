import React, {Component} from "react";
import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/DeleteOutline';
import RemoveAllIcon from '@mui/icons-material/DeleteSweep';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import CopyIcon from '@mui/icons-material/FileCopy';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/ArrowDropDownCircle';
import IconSettings from '@mui/icons-material/Settings';
import IconSettingsCancel from '@mui/icons-material/HighlightOff';
import IconSettingsDone from '@mui/icons-material/Done';

import withStyles from '../Header/toolbar';
import SearchBox from '../SchemeSettings/SearchBox';
import {export_handlers} from '../plugin';

const cmpType = PropTypes.oneOfType([PropTypes.object, PropTypes.array]);

class TabularSectionToolbar extends Component {

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,     // обработчик добавления объекта
    handleRemove: PropTypes.func.isRequired,  // обработчик удаления строки
    handleClear: PropTypes.func.isRequired,   // обработчик очистки табчасти
    handleUp: PropTypes.func.isRequired,      // обработчик перемещения строки вверх
    handleDown: PropTypes.func.isRequired,    // обработчик перемещения строки вниз

    denyAddDel: PropTypes.bool,               // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    denyReorder: PropTypes.bool,              // Запрет изменения порядка строк

    btns: cmpType,                            // дополнительные кнопки
    menu_items: cmpType,                      // дополнительные пункты меню

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
    const {handleUp, handleDown, denyAddDel, denyReorder, classes, width, settings_open, btns, end_btns, menu_items, scheme} = props;
    const widthUpSm = width > 600;

    return (
      <Toolbar disableGutters className={classes.toolbar} style={{width: width || '100%'}}>
        {[
          !denyAddDel && <IconButton key="btn_add" title="Добавить строку" onClick={props.handleAdd}><AddIcon /></IconButton>,
          !denyAddDel && <IconButton key="btn_del" title="Удалить строку" onClick={props.handleRemove}><RemoveIcon /></IconButton>,
          !denyAddDel && <IconButton key="btn_clear" title="Удалить все строки" onClick={props.handleClear}><RemoveAllIcon /></IconButton>,
          !denyAddDel && !denyReorder && <IconButton key="sep1" disabled>|</IconButton>,
          !denyReorder && <IconButton key="btn_up" title="Переместить вверх" onClick={handleUp}><ArrowUpIcon/></IconButton>,
          !denyReorder && <IconButton key="btn_down"  title="Переместить вниз" onClick={handleDown}><ArrowDownIcon/></IconButton>,

          // дополнительные кнопки
          btns,

          <Typography key="space" variant="h6" color="inherit" className={classes.flex}> </Typography>,

          // дополнительные кнопки
          end_btns,

          !settings_open && <SearchBox
            key="search"
            scheme={scheme}
            handleFilterChange={props.handleFilterChange}
            isWidthUp={widthUpSm}
          />,

          !settings_open && <IconButton key="more" onClick={this.handleMenuOpen} title="Дополнительно">
            <MoreVertIcon/>
          </IconButton>,

          !settings_open && <Menu key="menu" anchorEl={state.anchorEl} open={state.menuOpen} onClose={this.handleMenuClose}>
            <MenuItem onClick={this.handleExportCSV}><CopyIcon/> &nbsp;Копировать CSV</MenuItem>
            <MenuItem onClick={this.handleExportJSON}><CloudDownloadIcon/> &nbsp;Копировать JSON</MenuItem>
            <MenuItem onClick={this.handleExportXLS}><FileDownloadIcon/> &nbsp;Экспорт в XLS</MenuItem>
            {
              // дополнительные пункты меню
              menu_items
            }
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
export {withStyles, TabularSectionToolbar};
