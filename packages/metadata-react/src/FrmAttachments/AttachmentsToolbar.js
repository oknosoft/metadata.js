import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/CloudUpload';
import RemoveIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

import withStyles from '../Header/toolbar';
import classnames from 'classnames';

function AttachmentsToolbar (props) {

  return (
    <Toolbar disableGutters className={props.classes.toolbar}>
      {!props.short && <IconButton title="Добавить" onClick={props.handleAdd}><UploadIcon/></IconButton>}
      <IconButton title="Получить" onClick={props.handleDownload}><DownloadIcon/></IconButton>
      {!props.short && <IconButton title="Удалить" onClick={props.handleDelete}><RemoveIcon/></IconButton>}

      <Typography variant="h6" color="inherit" className={props.classes.flex}> </Typography>

      {props.closeButton && props.handleClose && <IconButton title="Закрыть форму" onClick={props.handleClose}><CloseIcon/></IconButton>}

    </Toolbar>
  );
};

AttachmentsToolbar.propTypes = {
  handleAdd: PropTypes.func,
  handleDelete: PropTypes.func,
  handleDownload: PropTypes.func,
  handleClose: PropTypes.func,
  closeButton: PropTypes.bool,
  short: PropTypes.bool,
};

export default withStyles(AttachmentsToolbar);

