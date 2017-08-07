/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';

import CloudQueue from 'material-ui-icons/CloudQueue';
import CloudOff from 'material-ui-icons/CloudOff';

import SyncIcon from 'material-ui-icons/Sync';
import SyncIconDisabled from 'material-ui-icons/SyncDisabled';

// import NotificationsIcon from 'material-ui-icons/Notifications';
// import NotificationsIconActive from 'material-ui-icons/NotificationsActive';
import NotificationsIconNone from 'material-ui-icons/NotificationsNone';

import PersonOutline from 'material-ui-icons/PersonOutline';

import AccountOff from './AccountOff';

import classnames from 'classnames';
import withStyles from '../Header/toolbar';

class NavUserButtons extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = props.handleNavigate.bind(null, '/login');
  }

  render() {

    const {handleLogin, props} = this;
    const {
      sync_started,
      classes,
      fetch,
      offline,
      user,
    } = props;
    const offline_tooltip = offline ? 'Сервер недоступен' : 'Подключение установлено';
    const sync_tooltip = `Синхронизация ${user.logged_in && sync_started ? 'выполняется' : 'отключена'}`;
    const notifications_tooltip = 'Нет непрочитанных сообщений';
    const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(автономный режим)'}`;

    return (
      <div>

        <IconButton title={offline_tooltip}>
          {offline ?
            <CloudOff className={classes.white}/>
            :
            <CloudQueue className={classes.white}/>
          }
        </IconButton>

        <IconButton title={sync_tooltip}>
          {user.logged_in && sync_started ?
            <SyncIcon className={classnames(classes.white, {[classes.rotation]: fetch || user.try_log_in})} />
            :
            <SyncIconDisabled className={classes.white}/>
          }
        </IconButton>

        <IconButton title={login_tooltip} onClick={handleLogin}>
          {
            user.logged_in ?
              <PersonOutline className={classes.white}/>
              :
              <AccountOff className={classes.white}/>
          }
        </IconButton>

        <IconButton title={notifications_tooltip}>
          <NotificationsIconNone className={classes.white}/>
        </IconButton>


      </div>
    );
  }
}
NavUserButtons.propTypes = {
  sync_started: PropTypes.bool, // выполняется синхронизация
  user: PropTypes.object,  // пользователь
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,

};

export default withStyles(NavUserButtons);
