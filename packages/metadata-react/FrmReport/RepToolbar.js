import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Menu, {MenuItem} from 'material-ui/Menu';

import RunIcon from 'material-ui-icons/PlayArrow';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import PrintIcon from 'material-ui-icons/Print';
import CopyIcon from 'material-ui-icons/ContentCopy';
import CloudDownloadIcon from 'material-ui-icons/CloudDownload';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

import {export_handlers} from '../plugin';

import SchemeSettings from '../SchemeSettings';
import DateRange from '../SchemeSettings/DateRange';

import withStyles from '../Header/toolbar';

class RepToolbar extends Component {

  static propTypes = {
    handleSave: PropTypes.func.isRequired,          // обработчик формирования отчета
    handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
    handleClose: PropTypes.func.isRequired,         // команда закрытия формы
    handleSchemeChange: PropTypes.func.isRequired,  // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,            // значение настроек компоновки CatSchemeSettings
    _obj: PropTypes.object,                         // объект данных - отчет DataProcessorObj
    _tabular: PropTypes.string.isRequired,          // имя табчасти с данными
  };

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
    const {handleSave, handleClose, handleSchemeChange, handlePrint, scheme, _obj, _tabular, classes} = props;
    const {RepParams} = _obj._manager;

    return (

      <Toolbar disableGutters className={classes.bar}>
        <Button dense onClick={handleSave}><i className="fa fa-play fa-fw"></i> Сформировать</Button>

        <IconButton disabled>|</IconButton>

        <DateRange _obj={scheme} _fld={'date'} _meta={{synonym: 'Период'}} classes={classes} />

        <Typography type="title" color="inherit" className={classes.flex}> </Typography>

        <SchemeSettings
          handleSchemeChange={handleSchemeChange}
          classes={classes}
          scheme={scheme}
          tabParams={RepParams && <RepParams _obj={_obj} scheme={scheme} />}
          show_variants={true}
        />

        <IconButton onClick={this.handleMenuOpen} title="Дополнительно">
          <MoreVertIcon/>
        </IconButton>

        <Menu
          anchorEl={state.anchorEl}
          open={state.menuOpen}
          onRequestClose={this.handleMenuClose}
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

