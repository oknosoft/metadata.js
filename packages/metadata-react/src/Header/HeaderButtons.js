/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';
import SyncProblem from '@material-ui/icons/SyncProblem';

import AccountOn from '@material-ui/icons/PersonOutline';
import AccountOff from './AccountOff';

import Notifications from '../Notifications';

function HeaderButtons({sync_waiting, offline, user, handleNavigate, barColor, CustomBtn}) {

  const offline_tooltip = sync_waiting ? 'Ожидание обмена с сервером' : (
    offline ? 'Автономный режим' :
      (user.logged_in ? 'Подключение установлено' : 'Вход не выполнен')
  );
  const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(не авторизован)'}`;

  return [

    // показываем допкнопки, если задано в redux
    CustomBtn && <CustomBtn key="custom_btn" user={user}/>,

    // индикатор доступности облака показываем только на экране шире 'sm'
    <IconButton key="offline" title={offline_tooltip} onClick={() => 
        handleNavigate(location.pathname.includes('offline') ? -1 : '/offline')}>
      {sync_waiting ? <SyncProblem color="inherit"/> : (offline ? <CloudOff color="inherit"/> : <CloudQueue color="inherit"/>)}
    </IconButton>,

    <IconButton key="logged_in" title={login_tooltip} onClick={() => 
        handleNavigate(location.pathname.includes('login') ? -1 : '/login')}>
      {user.logged_in ? <AccountOn color="inherit"/> : <AccountOff color="inherit"/>}
    </IconButton>,

    <Notifications key="noti" barColor={barColor}/>

  ];
}

// HeaderButtons.defaultProps = {
//   barColor: 'primary'
// }

HeaderButtons.propTypes = {
  sync_waiting: PropTypes.bool, // ожидание синхронизации
  offline: PropTypes.bool,      // используется автономный режим
  user: PropTypes.object,       // пользователь
  handleNavigate: PropTypes.func.isRequired,
  compact: PropTypes.bool,      // скрывает кнопки облака
  barColor: PropTypes.string,
  CustomBtn: PropTypes.elementType, // дополнительные кнопки, подключаемые через redux
};

export default HeaderButtons;
