/**
 * ### Кнопка с колокольчиком и список сообщений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsIconActive from '@material-ui/icons/NotificationsActive';
import NotificationsIconNone from '@material-ui/icons/NotificationsNone';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Select from '@material-ui/core/Select';
import classnames from 'classnames';

import {withIface} from 'metadata-redux';
import withStyles from '../Header/toolbar';

class Notifications extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      anchorEl: undefined,
      open: false,
    };

    const {name} = this.constructor;
    this.handleToggle = props.handleIfaceState.bind(this, {
      component: name,
      name: 'open',
      value: 'invert',
    });
    this.handleClose = props.handleIfaceState.bind(this, {
      component: name,
      name: 'open',
      value: false,
    });
  }

  filterChange = ({target: {value}}) => {
    if(!value.length || !value[0]){
      value[0] = 'any';
    }
    const any = value.indexOf('any');
    if(any != -1){
      if(value.indexOf('hight') != -1 || value.indexOf('alert') != -1 || value.indexOf('info') != -1){
        value.splice(any, 1);
      }
    }
    this.props.handleIfaceState({
      component: this.constructor.name,
      name: 'filter',
      value
    });
  };

  handleMenu = (event) => {
    this.setState({open: true, anchorEl: event.currentTarget});
  };

  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {

    const {props, state, handleClose, handleToggle} = this;
    const {classes} = props;
    const notifications_tooltip = 'Нет непрочитанных сообщений';
    const filter = props.filter || [];
    if(!filter.length || filter[0] === ''){
      filter[0] = 'any';
    }

    return [
      <IconButton key="noti_button" title={notifications_tooltip} onClick={handleToggle}>
        <NotificationsIconNone className={classes.white}/>
      </IconButton>,

      props.open && <Drawer key="noti_drawer" anchor="right" open={props.open} onClose={handleClose} classes={{paper: classes.ndrawer}}>
        <AppBar position="static">
          <Toolbar disableGutters>
            <Typography variant="title" color="inherit" className={classnames(classes.title, classes.flex)}>Оповещения </Typography>
            <IconButton onClick={handleClose}><NotificationsIconNone className={classes.white}/></IconButton>
          </Toolbar>
        </AppBar>

        <Toolbar disableGutters className={classes.toolbar}>

          {/* вариант фильтрации */}
          <Select
            className={classes.select}
            value={filter}
            onChange={this.filterChange}
            multiple
          >
            <MenuItem value="any" className={classnames({[classes.bold]: filter.indexOf('any') !== -1})}>Все</MenuItem>
            <MenuItem value="new" className={classnames({[classes.bold]: filter.indexOf('new') !== -1})}>Новые</MenuItem>
            <MenuItem value="hight" className={classnames({[classes.bold]: filter.indexOf('hight') !== -1})}>Важно</MenuItem>
            <MenuItem value="alert" className={classnames({[classes.bold]: filter.indexOf('alert') !== -1})}>Замечание</MenuItem>
            <MenuItem value="info" className={classnames({[classes.bold]: filter.indexOf('info') !== -1})}>Инфо</MenuItem>
          </Select>

          <Typography variant="title" color="inherit" className={classes.flex}>&nbsp;</Typography>

          {/* меню дополнительных действий */}
          <IconButton onClick={this.handleMenu} title="Дополнительно"><MoreVertIcon/></IconButton>
          <Menu
            anchorEl={state.anchorEl}
            open={state.open}
            onClose={this.handleRequestClose}
          >
            <MenuItem>Считать все прочитанными</MenuItem>
            <MenuItem>Удалить все</MenuItem>
          </Menu>

        </Toolbar>
        <div>123</div>

      </Drawer>
    ];


  }
}

export default withStyles(withIface(Notifications));
