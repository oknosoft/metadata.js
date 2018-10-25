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
import NotificationsIcon from './NotificationsIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Select from '@material-ui/core/Select';
import NotiList from './NotiList';

import classnames from 'classnames';
import {withIface} from 'metadata-redux';
import withStyles from '../Header/toolbar';

class Notifications extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      anchorEl: undefined,
      open: false,
      count: 0,
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

  componentDidMount() {
    if(typeof $p === 'object') {
      $p.ireg.log.on({record: this.onLog});
    }
    else{
      setTimeout(this.componentDidMount.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    typeof $p === 'object' && $p.ireg.log.off({record: this.onLog});
  }

  filterChange = ({target: {value}}) => {
    if(!value.length || !value[0]){
      value[0] = 'any';
    }
    const any = value.indexOf('any');
    if(any != -1){
      if(value.indexOf('error') != -1 || value.indexOf('alert') != -1 || value.indexOf('note') != -1){
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

  onLog = ({count}) => {
    this.setState({count});
  };

  mark_viewed = () => {
    typeof $p === 'object' && $p.ireg.log.mark_viewed();
    this.setState({count: 0});
  };

  clear_log = () => {
    typeof $p === 'object' && $p.ireg.log.clear();
    this.setState({count: 0});
  };

  filterLog(filter) {
    return $p.ireg.log.viewed().filter((row) => {
      if(filter.indexOf('new') !== -1 && row.key) {
        return false;
      }
      if(filter.indexOf('any') !== -1) {
        return true;
      }
      return filter.indexOf(row.class) !== -1;
    });
  }

  render() {

    const {props, state, handleClose, handleToggle} = this;
    const {classes, barColor} = props;
    const tip = `${state.count || ''} непрочитанных сообщений`;
    const filter = props.filter || [];
    if(!filter.length || filter[0] === ''){
      filter[0] = 'any';
    }

    return [
      <NotificationsIcon key="noti_button" title={tip} onClick={handleToggle} count={state.count}/>,

      props.open && <Drawer key="noti_drawer" anchor="right" open={props.open} onClose={handleClose} classes={{paper: classes.ndrawer}}>
        <AppBar position="static" color={props.barColor}>
          <Toolbar disableGutters>
            <Typography variant="h6" color="textSecondary" className={classnames(classes.title, classes.flex)}>Оповещения </Typography>
            <NotificationsIcon onClick={handleClose} count={state.count}/>
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
            <MenuItem value="error" className={classnames({[classes.bold]: filter.indexOf('error') !== -1})}>Ошибка</MenuItem>
            <MenuItem value="alert" className={classnames({[classes.bold]: filter.indexOf('alert') !== -1})}>Замечание</MenuItem>
            <MenuItem value="note" className={classnames({[classes.bold]: filter.indexOf('note') !== -1})}>Инфо</MenuItem>
          </Select>

          <Typography variant="h6" color="inherit" className={classes.flex}>&nbsp;</Typography>

          {/* меню дополнительных действий */}
          <IconButton onClick={this.handleMenu} title="Дополнительно"><MoreVertIcon/></IconButton>
          <Menu
            anchorEl={state.anchorEl}
            open={state.open}
            onClose={this.handleRequestClose}
          >
            <MenuItem onClick={this.mark_viewed}>Считать все прочитанными</MenuItem>
            <MenuItem onClick={this.clear_log}>Удалить все</MenuItem>
          </Menu>

        </Toolbar>

        <NotiList rows={this.filterLog(filter)}/>

      </Drawer>
    ];


  }
}

export default withStyles(withIface(Notifications));
