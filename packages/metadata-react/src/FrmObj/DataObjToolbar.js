import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuPrint from '../DynList/MenuPrint';

import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import AttachIcon from '@mui/icons-material/AttachFile';

import withStyles from '../Header/toolbar';
import classnames from 'classnames';

class DataObjToolbar extends Component {

  static propTypes = {

    handleSave: PropTypes.func.isRequired,        // обработчик добавления объекта
    handlePost: PropTypes.func,                   // обработчик проведения
    handleMarkDeleted: PropTypes.func.isRequired, // обработчик пометки удаления
    handlePrint: PropTypes.func,                  // обработчик открытия диалога печати
    handleAttachments: PropTypes.func,            // обработчик открытия диалога присоединенных файлов
    handleClose: PropTypes.func,                  // команда Закрыть форму

    postable: PropTypes.bool,                     // объект можно провести-распровести
    posted: PropTypes.bool,                       // объект проведён
    deletable: PropTypes.bool,                    // объект можно пометить на удаление или снять пометку
    deleted: PropTypes.bool,                      // объект помечен на удаление

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
    const showMenu = props.showMenu || props.handleAttachments || props.handlePrint;
    return (

      <Toolbar disableGutters className={props.classes.toolbar}>
        {props.handleSaveClose && !props.read_only && <Button
          title="Записать и закрыть"
          size="small"
          variant="outlined"
          className={props.classes.spaceLeft}
          onClick={props.handleSaveClose}>Записать и закрыть</Button>}
        {!props.read_only && <IconButton title="Записать" onClick={props.handleSave}><SaveIcon/></IconButton>}
        {!props.read_only && props.postable &&
          <IconButton title={props.posted ? 'Отменить проведение' : 'Провести'} onClick={() => props.handleSave(!props.posted)}><SendIcon/></IconButton>}
        {!props.read_only && props.deletable &&
          <IconButton title={props.deleted ? 'Снять пометку удаления' : 'Пометить на удаление'} onClick={props.handleMarkDeleted}><RemoveIcon/></IconButton>}

        {props.buttons}

        <Typography variant="h6" color="inherit" className={props.classes.flex}> </Typography>

        {showMenu && <IconButton onClick={this.handleClick} title="Дополнительно"><MoreVertIcon/></IconButton>}

        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {props.handlePrint && <MenuPrint
            scheme={{child_meta() {
              return {_mgr: props._obj._manager};
            }}}
            handlePrint={(ref) => {
              return props.handlePrint(ref);
            }}
          />}
          {props.handleAttachments && <MenuItem onClick={props.handleAttachments}><AttachIcon/> &nbsp;Вложения</MenuItem>}
          {props.menu_buttons}
        </Menu>

        {props.closeButton && <IconButton title="Закрыть форму" onClick={props.handleClose}><CloseIcon/></IconButton>}

      </Toolbar>
    );
  }
};

export default withStyles(DataObjToolbar);

