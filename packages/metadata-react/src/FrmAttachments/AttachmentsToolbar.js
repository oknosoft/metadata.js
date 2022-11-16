import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/CloudUpload';
import LinkIcon from '@material-ui/icons/Link';
import RemoveIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

import withStyles from '../Header/toolbar';
import classnames from 'classnames';

function AttachmentsToolbar ({classes, short, handleAdd, handleAddLink, handleDownload, handleDelete, handleClose, closeButton}) {
  
  return (
    <Toolbar disableGutters className={classes.toolbar}>
      {!short && <IconButton title="Добавить" onClick={handleAdd}><UploadIcon/></IconButton>}
      <IconButton title="Получить" onClick={handleDownload}><DownloadIcon/></IconButton>
      {!short && <IconButton title="Добавить ссылку" onClick={handleAddLink}><LinkIcon/></IconButton>}
      {!short && <IconButton title="Удалить" onClick={handleDelete}><RemoveIcon/></IconButton>}

      <Typography variant="h6" color="inherit" className={classes.flex}> </Typography>

      {closeButton && handleClose && <IconButton title="Закрыть форму" onClick={handleClose}><CloseIcon/></IconButton>}

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

