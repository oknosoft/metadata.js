import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, {MenuItem} from 'material-ui/Menu';

import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import RemoveIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintIcon from '@material-ui/icons/Print';
import AttachIcon from '@material-ui/icons/AttachFile';

import withStyles from '../Header/toolbar';
import classnames from 'classnames';

class DataObjToolbar extends Component {

  static propTypes = {

    handleSave: PropTypes.func.isRequired,        // обработчик добавления объекта
    handleMarkDeleted: PropTypes.func.isRequired, // команда Отозвать
    handlePrint: PropTypes.func.isRequired,       // обработчик открытия диалога печати
    handleAttachments: PropTypes.func.isRequired,  // обработчик открытия диалога присоединенных файлов
    handleClose: PropTypes.func.isRequired,       // команда Закрыть форму

    postable: PropTypes.bool,                     // объект можно провести-распровести
    posted: PropTypes.bool,                       // объект проведён
    deletable: PropTypes.bool,                    // объект можно пометить на удаление или снять пометку
    deleted: PropTypes.bool,                      // объект помечен на удаление

    handleSend: PropTypes.func,                   // команда Отправить

  };

  state = {
    anchorEl: undefined,
    open: false,
  };

  handleClick = event => {
    this.setState({open: true, anchorEl: event.currentTarget});
  };

  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {
    const {props} = this;
    return (

      <Toolbar disableGutters className={props.classes.toolbar}>

        <IconButton title="Записать" onClick={props.handleSave}><SaveIcon/></IconButton>
        {props.postable && <IconButton title={props.posted ? 'Отменить проведение' : 'Провести'} onClick={() => props.handleSave(!props.posted)}><SendIcon/></IconButton>}
        {props.deletable && <IconButton title={props.deleted ? 'Снять пометку удаления' : 'Пометить на удаление'} onClick={props.handleMarkDeleted}><RemoveIcon/></IconButton>}

        <Typography variant="title" color="inherit" className={props.classes.flex}> </Typography>

        <IconButton onClick={this.handleClick} title="Дополнительно"><MoreVertIcon/></IconButton>

        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          <MenuItem onClick={props.handlePrint}><PrintIcon/> &nbsp;Печать</MenuItem>
          <MenuItem onClick={props.handleAttachments}><AttachIcon/> &nbsp;Вложения</MenuItem>
        </Menu>

        {props.closeButton && <IconButton title="Закрыть форму" onClick={props.handleClose}><CloseIcon/></IconButton>}

      </Toolbar>
    );
  }
};

export default withStyles(DataObjToolbar);

