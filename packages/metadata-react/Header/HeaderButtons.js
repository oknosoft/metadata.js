/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';

import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import SyncIcon from '@material-ui/icons/Sync';
import SyncIconDisabled from '@material-ui/icons/SyncDisabled';
import PersonOutline from '@material-ui/icons/PersonOutline';
import AccountOff from './AccountOff';

import Notifications from '../Notifications';

import compose from 'recompose/compose';
import classnames from 'classnames';
import withStyles from './toolbar';
import withWidth, {isWidthUp} from 'material-ui/utils/withWidth';

function HeaderButtons({sync_started, classes, fetch, offline, user, handleNavigate, width}) {

  const offline_tooltip = offline ? 'Сервер недоступен' : 'Подключение установлено';
  const sync_tooltip = `Синхронизация ${user.logged_in && sync_started ? 'выполняется' : 'отключена'}`;
  const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(автономный режим)'}`;

  return [
    // индикатор доступности облака показываем только на экране шире 'sm'
    isWidthUp('sm', width) && <IconButton key="offline" title={offline_tooltip}>
      {offline ? <CloudOff className={classes.white}/> : <CloudQueue className={classes.white}/>}
    </IconButton>,

    <IconButton key="sync_started" title={sync_tooltip}>
      {user.logged_in && sync_started ?
        <SyncIcon className={classnames(classes.white, {[classes.rotation]: fetch || user.try_log_in})} />
        :
        <SyncIconDisabled className={classes.white}/>
      }
    </IconButton>,

    <IconButton key="logged_in" title={login_tooltip} onClick={() => handleNavigate('/login')}>
      {user.logged_in ? <PersonOutline className={classes.white}/> : <AccountOff className={classes.white}/>}
    </IconButton>,

    <Notifications key="noti" />

  ];
}

HeaderButtons.propTypes = {
  sync_started: PropTypes.bool, // выполняется синхронизация
  fetch: PropTypes.bool,        // обмен данными
  offline: PropTypes.bool,      // сервер недоступен
  user: PropTypes.object,       // пользователь
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles, withWidth())(HeaderButtons);
