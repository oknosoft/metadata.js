import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import RunIcon from '@material-ui/icons/PlayArrow';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintIcon from '@material-ui/icons/Print';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileDownloadIcon from '@material-ui/icons/ArrowDropDownCircle';

import {export_handlers} from '../plugin';

import SchemeSettingsButtons from '../SchemeSettings/SchemeSettingsButtons';
import DateRange from '../SchemeSettings/DateRange';

import withStyles from '../Header/toolbar';

class RepToolbar extends Component {

  static propTypes = {
    handleSave: PropTypes.func.isRequired,          // обработчик формирования отчета
    handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
    handleClose: PropTypes.func.isRequired,         // команда закрытия формы
    handleSettingsOpen: PropTypes.func.isRequired,
    handleSettingsClose: PropTypes.func.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,  // обработчик при изменении настроек компоновки
    _obj: PropTypes.object,                         // объект данных - отчет DataProcessorObj
    _tabular: PropTypes.string.isRequired,          // имя табчасти с данными
    scheme: PropTypes.object.isRequired,            // значение настроек компоновки CatSchemeSettings
    settings_open: PropTypes.bool,                  // открыта панель настроек
    ToolbarExt: PropTypes.func,
  };

  constructor(props, context) {

    super(props, context);

    this.state = {
      anchorEl: undefined,
      menuOpen: false,
    };

    export_handlers.call(this);
  }

  handleChange = () => {
    this.props.handleSchemeChange(this.props.scheme);
  }

  render() {

    const {props, state, handleChange} = this;
    const {handleSave, handleClose, handlePrint, _obj, _tabular, classes, scheme, settings_open, ToolbarExt} = props;


    return (

      <Toolbar disableGutters className={classes.toolbar}>
        <Button size="small" onClick={handleSave} disabled={settings_open}><i className="fa fa-play fa-fw"></i> Сформировать</Button>

        {!scheme.standard_period.empty() && <IconButton disabled>|</IconButton>}
        {!scheme.standard_period.empty() && <DateRange
          _obj={scheme}
          _fld={'date'}
          _meta={{synonym: 'Период'}}
          classes={classes}
          handleChange={handleChange}
        />}

        {ToolbarExt && <ToolbarExt />}

        <Typography color="inherit" className={classes.flex}> </Typography>

        <SchemeSettingsButtons
          handleSettingsOpen={props.handleSettingsOpen}
          handleSettingsClose={props.handleSettingsClose}
          handleSchemeChange={props.handleSchemeChange}
          settings_open={settings_open}
          classes={classes}
          scheme={scheme}
          show_variants={true}
        />

        <IconButton onClick={this.handleMenuOpen} title="Дополнительно">
          <MoreVertIcon/>
        </IconButton>

        <Menu
          anchorEl={state.anchorEl}
          open={state.menuOpen}
          onClose={this.handleMenuClose}
        >
          <MenuItem disabled onClick={handlePrint}><PrintIcon/> &nbsp;Печать</MenuItem>
          <MenuItem onClick={this.handleExportCSV}><CopyIcon/> &nbsp;Копировать CSV</MenuItem>
          <MenuItem onClick={this.handleExportJSON}><CloudDownloadIcon/> &nbsp;Копировать JSON</MenuItem>
          <MenuItem onClick={this.handleExportXLS}><FileDownloadIcon/> &nbsp;Экспорт в XLS</MenuItem>

        </Menu>

      </Toolbar>
    );
  }
};

export default withStyles(RepToolbar);

