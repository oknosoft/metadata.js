import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintIcon from '@material-ui/icons/Print';
import AttachIcon from '@material-ui/icons/AttachFile';
import SelectIcon from '@material-ui/icons/PlaylistAddCheck';

import SchemeSettingsButtons from '../SchemeSettings/SchemeSettingsButtons';
import SearchBox from '../SchemeSettings/SearchBox';
import DateRange from '../SchemeSettings/DateRange';

import compose from 'recompose/compose';
import classnames from 'classnames';
import withStyles from '../Header/toolbar';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';


class DataListToolbar extends Component {

  static propTypes = {
    selectionMode: PropTypes.bool,                  // режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
    denyAddDel: PropTypes.bool,                     // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

    handleAdd: PropTypes.func,                      // обработчик добавления объекта
    handleEdit: PropTypes.func,                     // обработчик открфтия формы редактора
    handleRemove: PropTypes.func,                   // обработчик удаления строки

    handleSchemeChange: PropTypes.func.isRequired,  // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,            // значение настроек компоновки

    handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
    handleAttachments: PropTypes.func.isRequired,   // обработчик открытия диалога присоединенных файлов
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
    const {classes, scheme, width, btns, end_btns, menu_items, toolbar2row} = props;
    const widthUpSm = isWidthUp('sm', width);

    return [
      <Toolbar key="toolbar1" disableGutters className={classes.toolbar}>

        {props.selectionMode && <Button
          key="select"
          title="Выбрать из списка"
          size="small"
          variant="outlined"
          className={classes.spaceLeft}
          onClick={props.handleSelect}>Выбрать</Button>}
        {!props.denyAddDel && <IconButton key="create" title="Создать объект" onClick={props.handleAdd}><AddIcon/></IconButton>}
        {!props.denyAddDel && <IconButton key="edit" title="Открыть форму объекта" onClick={props.handleEdit}><EditIcon/></IconButton>}
        {!props.denyAddDel && <IconButton key="del" title="Пометить на удаление" onClick={props.handleRemove}><RemoveIcon/></IconButton>}

        {!scheme.standard_period.empty() && widthUpSm && <IconButton disabled>|</IconButton>}
        {!scheme.standard_period.empty() && <DateRange
          _obj={scheme}
          _fld={'date'}
          _meta={{synonym: 'Период'}}
          classes={classes}
          handleChange={props.handleFilterChange}
        />}

        {(!toolbar2row || widthUpSm) && btns /* дополнительные кнопки */}

        <div className={classes.flex} />

        {(!toolbar2row || widthUpSm) && end_btns /* дополнительные кнопки */}

        <SchemeSettingsButtons
          handleSettingsOpen={props.handleSettingsOpen}
          handleSettingsClose={props.handleSettingsClose}
          handleSchemeChange={props.handleSchemeChange}
          handleFilterChange={props.handleFilterChange}
          settings_open={props.settings_open}
          classes={classes}
          scheme={scheme}
          show_search={props.show_search && (!toolbar2row || widthUpSm)}
          show_variants={props.show_variants}
          hide_btn={!widthUpSm}
        />

        <IconButton onClick={this.handleClick} title="Дополнительно"><MoreVertIcon/></IconButton>
        <Menu
          anchorEl={state.anchorEl}
          open={state.open}
          onClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleDnROpen}><PrintIcon/> &nbsp;Печать</MenuItem>
          <MenuItem onClick={props.handleAttachments}><AttachIcon/> &nbsp;Вложения</MenuItem>
          {menu_items /* дополнительные пункты меню */}
        </Menu>

      </Toolbar>,

      toolbar2row && !widthUpSm && <Toolbar key="toolbar2" disableGutters className={classes.toolbar}>
        {btns /* дополнительные кнопки */}
        <div className={classes.flex}/>
        {end_btns /* дополнительные кнопки */}
        <SearchBox
          scheme={scheme}
          handleFilterChange={props.handleFilterChange}
        />
      </Toolbar>
    ];
  }
}


export default compose(withStyles, withWidth())(DataListToolbar);

