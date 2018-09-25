import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintIcon from '@material-ui/icons/Print';
import AttachIcon from '@material-ui/icons/AttachFile';
import SelectIcon from '@material-ui/icons/PlaylistAddCheck';

import SchemeSettingsButtons from '../SchemeSettings/SchemeSettingsButtons';
import DateRange from '../SchemeSettings/DateRange';

import compose from 'recompose/compose';
import classnames from 'classnames';
import withStyles from '../Header/toolbar';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';


class DataListToolbar extends Component {

  static propTypes = {
    selectionMode: PropTypes.bool,                   // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
    denyAddDel: PropTypes.bool,                     // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

    handleAdd: PropTypes.func.isRequired,             // обработчик добавления объекта
    handleEdit: PropTypes.func.isRequired,            // обработчик открфтия формы редактора
    handleRemove: PropTypes.func.isRequired,          // обработчик удаления строки

    handleSchemeChange: PropTypes.func.isRequired,    // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,              // значение настроек компоновки

    handlePrint: PropTypes.func.isRequired,           // обработчик открытия диалога печати
    handleAttachments: PropTypes.func.isRequired,      // обработчик открытия диалога присоединенных файлов
  };

  static defaultProps = {
    show_search: true
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

    const {props, state} = this;
    const {classes, width} = props;

    return (
      <Toolbar disableGutters className={classes.toolbar}>

        {props.selectionMode && <Button
          key="select"
          title="Выбрать из списка"
          size="small"
          variant="outlined"
          onClick={props.handleSelect}><SelectIcon/>Выбрать</Button>}
        {!props.denyAddDel && <IconButton key="create" title="Создать объект" onClick={props.handleAdd}><AddIcon/></IconButton>}
        {!props.denyAddDel && <IconButton key="edit" title="Открыть форму объекта" onClick={props.handleEdit}><EditIcon/></IconButton>}
        {!props.denyAddDel && <IconButton key="del" title="Пометить на удаление" onClick={props.handleRemove}><RemoveIcon/></IconButton>}

        {!props.scheme.standard_period.empty() && isWidthUp('sm', width) && <IconButton disabled>|</IconButton>}
        {!props.scheme.standard_period.empty() && <DateRange
          _obj={props.scheme}
          _fld={'date'}
          _meta={{synonym: 'Период'}}
          classes={classes}
          handleChange={props.handleFilterChange}
        />}

        <Typography variant="caption" color="inherit" className={classes.flex} > </Typography>

        {/* кнопки настройки компоновки */}
        <SchemeSettingsButtons
          handleSettingsOpen={props.handleSettingsOpen}
          handleSettingsClose={props.handleSettingsClose}
          handleSchemeChange={props.handleSchemeChange}
          handleFilterChange={props.handleFilterChange}
          settings_open={props.settings_open}
          classes={classes}
          scheme={props.scheme}
          show_search={props.show_search}
          show_variants={props.show_variants}
        />

        {/* меню дополнительных действий */}
        <IconButton onClick={this.handleClick} title="Дополнительно"><MoreVertIcon/></IconButton>
        <Menu
          anchorEl={state.anchorEl}
          open={state.open}
          onClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleDnROpen}><PrintIcon/> &nbsp;Печать</MenuItem>
          <MenuItem onClick={props.handleAttachments}><AttachIcon/> &nbsp;Вложения</MenuItem>
        </Menu>

      </Toolbar>
    );
  }
}


export default compose(withStyles, withWidth())(DataListToolbar);

