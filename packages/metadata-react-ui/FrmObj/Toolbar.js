import React, {Component} from "react";
import PropTypes from 'prop-types'
import {Toolbar, ToolbarGroup} from "material-ui/Toolbar";

import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from 'material-ui/Menu';

import SaveIcon from "material-ui-icons/Save";
import SendIcon from "material-ui-icons/Send";
import RemoveIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import MoreVertIcon from "material-ui-icons/MoreVert";
import PrintIcon from "material-ui-icons/Print";
import AttachIcon from "material-ui-icons/AttachFile";


export default class DataObjToolbar extends Component {

  static propTypes = {

    handleSave: PropTypes.func.isRequired,        // обработчик добавления объекта
    handleSend: PropTypes.func.isRequired,        // команда Отправить
    handleMarkDeleted: PropTypes.func.isRequired,      // команда Отозвать

    handlePrint: PropTypes.func.isRequired,       // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,  // обработчик открытия диалога присоединенных файлов
    handleClose: PropTypes.func.isRequired,       // команда Закрыть форму

  }

  state = {
    anchorEl: undefined,
    open: false,
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const props = this.props;
    return (

      <Toolbar>
        <ToolbarGroup className={"meta-toolbar-group"} firstChild={true}>
          <IconButton touch={true} title="Записать" onClick={props.handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton touch={true} title="Отправить на согласование" onClick={props.handleSend}>
            <SendIcon />
          </IconButton>
          <IconButton touch={true} title="Отозвать заказ" onClick={props.handleMarkDeleted}>
            <RemoveIcon />
          </IconButton>

        </ToolbarGroup>

        <ToolbarGroup className={"meta-toolbar-group"}>

          <IconButton onClick={this.handleClick} title="Дополнительно" >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
          >
            <MenuItem primaryText="Печать" leftIcon={<PrintIcon />} onClick={props.handlePrint}/>
            <MenuItem primaryText="Вложения" leftIcon={<AttachIcon />} onClick={props.handleAttachment}/>

          </Menu>

          <IconButton touch={true} title="Закрыть форму" onClick={props.handleClose}>
            <CloseIcon />
          </IconButton>

        </ToolbarGroup>

      </Toolbar>
    )
  }
}

