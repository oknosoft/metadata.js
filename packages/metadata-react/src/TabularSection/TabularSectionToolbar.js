import React, {Component} from "react";
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import RemoveAllIcon from '@material-ui/icons/DeleteSweep';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileDownloadIcon from '@material-ui/icons/ArrowDropDownCircle';
import IconSettings from '@material-ui/icons/Settings';
import IconSettingsCancel from '@material-ui/icons/HighlightOff';
import IconSettingsDone from '@material-ui/icons/Done';

import withStyles from '../Header/toolbar';
import SearchBox from '../SchemeSettings/SearchBox';
import {export_handlers} from '../plugin';

class TabularSectionToolbar extends Component {

  static propTypes = {

    handleAdd: PropTypes.func.isRequired,     // обработчик добавления объекта
    handleRemove: PropTypes.func.isRequired,  // обработчик удаления строки
    handleClear: PropTypes.func.isRequired,   // обработчик очистки табчасти
    handleUp: PropTypes.func.isRequired,      // обработчик перемещения строки вверх
    handleDown: PropTypes.func.isRequired,    // обработчик перемещения строки вниз

    denyAddDel: PropTypes.bool,               // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    denyReorder: PropTypes.bool,              // Запрет изменения порядка строк

    btns: PropTypes.node,                     // дополнительные кнопки
    menu_items: PropTypes.node,               // дополнительные пункты меню

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
    const {handleUp, handleDown, denyAddDel, denyReorder, classes, width, settings_open, scheme,
      _obj, _tabular, _columns, btns, end_btns, menu_items, owner} = props;
    const widthUpSm = width > 600;
    
    const ext = {btns, end_btns, menu_items};
    for(const elm in ext) {
      if(typeof ext[elm] === "function") {
        const Ext = ext[elm]; 
        ext[elm] = <Ext
          _obj={_obj}
          _tabular={_tabular}
          _columns={_columns}
          scheme={scheme}
          owner={owner}
        />;
      }
    }

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
          ext.btns,

          <Typography key="space" variant="h6" color="inherit" className={classes.flex}> </Typography>,

          // дополнительные кнопки
          ext.end_btns,

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
              ext.menu_items
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
