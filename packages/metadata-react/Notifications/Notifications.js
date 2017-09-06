/**
 * ### Кнопка с колокольчиком и список сообщений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui-icons/Notifications';
import NotificationsIconActive from 'material-ui-icons/NotificationsActive';
import NotificationsIconNone from 'material-ui-icons/NotificationsNone';

import withIface from 'metadata-redux/src/withIface';

class Notifications extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleToggle = props.handleIfaceState.bind(this, {
      component: this.constructor.name,
      name: 'open',
      value: 'invert',
    });

    this.handleClose = props.handleIfaceState.bind(this, {
      component: this.constructor.name,
      name: 'open',
      value: false,
    });
  }

  render() {

    const {props, handleClose, handleToggle} = this;
    const {classes} = props;
    const notifications_tooltip = 'Нет непрочитанных сообщений';

    return <div>

      <IconButton title={notifications_tooltip} onClick={handleToggle}>
        <NotificationsIconNone className={classes.white}/>
      </IconButton>

      <Drawer anchor="right" open={props.open} onRequestClose={handleClose} classes={{paper: classes.drawer}} >

        <AppBar position="static" className={classes.appbar}>
          <Toolbar className={classes.bar}>
            <Typography type="title" color="inherit" className={classes.flex}>Оповещения </Typography>
            <IconButton onClick={handleClose}>
              <NotificationsIconNone className={classes.white}/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <div>123</div>

      </Drawer>

    </div>
  }
}

export default withIface(Notifications);
