import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, {MenuItem} from 'material-ui/Menu';

import AddIcon from 'material-ui-icons/AddCircleOutline';
import RemoveIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import PrintIcon from 'material-ui-icons/Print';
import AttachIcon from 'material-ui-icons/AttachFile';
import SelectIcon from 'material-ui-icons/PlaylistAddCheck';

import SchemeSettings from '../SchemeSettings';
import withStyles from '../Header/toolbar';

class DataListToolbar extends Component {

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

    const buttons = [];

    if(props.selection_mode) {
      buttons.push(
        <IconButton key="select" title="Выбрать из списка" onClick={props.handleSelect}>
          <SelectIcon/>
        </IconButton>
      );
    }

    if(!props.deny_add_del) {
      buttons.push(
        <IconButton key="create" title="Создать объект" onClick={props.handleAdd}>
          <AddIcon/>
        </IconButton>
      );
      buttons.push(
        <IconButton key="edit" title="Открыть форму объекта" onClick={props.handleEdit}>
          <EditIcon/>
        </IconButton>
      );
      buttons.push(
        <IconButton key="del" title="Пометить на удаление" onClick={props.handleRemove}>
          <RemoveIcon/>
        </IconButton>
      );
    }

    return (
      <Toolbar className={props.classes.bar}>
        <div>
          {buttons}
        </div>

        <Typography type="title" color="inherit" className={props.classes.flex} > </Typography>

        <div>
          <SchemeSettings
            handleSchemeChange={props.handleSchemeChange}
            scheme={props.scheme}
            show_search={props.show_search}
            show_variants={props.show_variants}/>

          <IconButton onClick={this.handleClick} title="Дополнительно">
            <MoreVertIcon/>
          </IconButton>

          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
          >

            <MenuItem onClick={props.handlePrint}><PrintIcon/> &nbsp;Печать</MenuItem>
            <MenuItem onClick={props.handleAttachment}><AttachIcon/> &nbsp;Вложения</MenuItem>

          </Menu>
        </div>
      </Toolbar>
    );
  }
}

DataListToolbar.propTypes = {
  selection_mode: PropTypes.bool,                   // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
  deny_add_del: PropTypes.bool,                     // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

  handleAdd: PropTypes.func.isRequired,             // обработчик добавления объекта
  handleEdit: PropTypes.func.isRequired,            // обработчик открфтия формы редактора
  handleRemove: PropTypes.func.isRequired,          // обработчик удаления строки

  handleSchemeChange: PropTypes.func.isRequired,    // обработчик при изменении настроек компоновки
  scheme: PropTypes.object.isRequired,              // значение настроек компоновки

  handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
  handleAttachment: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
};

export default withStyles(DataListToolbar);

