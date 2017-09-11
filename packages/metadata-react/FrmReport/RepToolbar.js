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

import withStyles from '../Header/toolbar';

class RepToolbar extends Component {

  static propTypes = {

    handleSave: PropTypes.func.isRequired,          // обработчик формирования отчета
    handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
    handleClose: PropTypes.func.isRequired,         // команда закрытия формы

    handleSchemeChange: PropTypes.func.isRequired,  // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,            // значение настроек компоновки

    TabParams: PropTypes.func,                      // внешний компонент страницы параметров

    _obj: PropTypes.object,
    _tabular: PropTypes.string.isRequired,

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
    const {handleSave, handleClose, handleSchemeChange, handlePrint, scheme, _obj, _tabular, TabParams, classes} = props;

    return (

      <Toolbar className={classes.bar}>
        <Button dense onClick={handleSave}><RunIcon/> Сформировать</Button>

        <Typography type="title" color="inherit" className={classes.flex}> </Typography>

        <SchemeSettings
          handleSchemeChange={handleSchemeChange}
          scheme={scheme}
          tabParams={
            TabParams ? <TabParams
                _obj={_obj}
                scheme={scheme}
              />
              : null
          }
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

