/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import AccountOn from '@material-ui/icons/PersonOutline';
import AccountOff from './AccountOff';

import Notifications from '../Notifications';

import {compose} from 'redux';
import withStyles from './toolbar';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';

function HeaderButtons({sync_started, classes, fetch, offline, user, handleNavigate, width, compact, barColor, CustomBtn}) {

  const offline_tooltip = offline ? 'Автономный режим' :
    (user.logged_in ? 'Подключение установлено' : 'Вход не выполнен');
  const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(не авторизован)'}`;

  return [

    // показываем допкнопки, если задано в redux
    CustomBtn && <CustomBtn key="custom_btn" user={user}/>,

    // индикатор доступности облака показываем только на экране шире 'sm'
    !compact && isWidthUp('sm', width) &&
    <IconButton key="offline" title={offline_tooltip} onClick={() => 
        handleNavigate(location.pathname.includes('offline') ? `/offline` : '/')}>
      {offline ? <CloudOff color="inherit"/> : <CloudQueue color="inherit"/>}
    </IconButton>,

    <IconButton key="logged_in" title={login_tooltip} onClick={() => 
        handleNavigate(location.pathname.includes('login') ? `/login` : '/')}>
      {user.logged_in ? <AccountOn color="inherit"/> : <AccountOff color="inherit"/>}
    </IconButton>,

    <Notifications key="noti" barColor={barColor}/>

  ];
}

// HeaderButtons.defaultProps = {
//   barColor: 'primary'
// }

HeaderButtons.propTypes = {
  sync_started: PropTypes.bool, // выполняется синхронизация
  fetch: PropTypes.bool,        // обмен данными
  offline: PropTypes.bool,      // сервер недоступен
  user: PropTypes.object,       // пользователь
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  compact: PropTypes.bool,      // скрывает кнопки облака
  barColor: PropTypes.string,
  custom_btn: PropTypes.object, // дополнительные кнопки, подключаемые через redux
};

export default compose(withStyles, withWidth())(HeaderButtons);
