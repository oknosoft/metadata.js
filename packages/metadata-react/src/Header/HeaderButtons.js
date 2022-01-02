/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';

import CloudQueue from '@mui/icons-material/CloudQueue';
import CloudOff from '@mui/icons-material/CloudOff';

import SyncIcon from '@mui/icons-material/Sync';
import SyncIconDisabled from '@mui/icons-material/SyncDisabled';
import PersonOutline from '@mui/icons-material/PersonOutline';
import AccountOff from './AccountOff';

import Notifications from '../Notifications';

import {compose} from 'redux';
import classnames from 'classnames';
import withStyles from './toolbar';
import withWidth, {isWidthUp} from '@mui/material/withWidth';

function HeaderButtons({sync_started, classes, fetch, offline, user, handleNavigate, width, compact, barColor, CustomBtn}) {

  const offline_tooltip = offline ? 'Сервер недоступен' : 'Подключение установлено';
  const sync_tooltip = `Синхронизация ${user.logged_in && sync_started ? 'выполняется' : 'отключена'}`;
  const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(автономный режим)'}`;
  const base = typeof $p === 'object' ? $p.job_prm.base : '';

  return [

    // показываем допкнопки, если задано в redux
    CustomBtn && <CustomBtn key="custom_btn" user={user}/>,

    // индикатор доступности облака показываем только на экране шире 'sm'
    !compact && isWidthUp('sm', width) &&
    <IconButton key="offline" title={offline_tooltip}>
      {offline ? <CloudOff color="inherit"/> : <CloudQueue color="inherit"/>}
    </IconButton>,

    !compact &&
    <IconButton key="sync_started" title={sync_tooltip}>
      {user.logged_in && sync_started ?
        <SyncIcon color="inherit" className={classnames({[classes.rotation]: fetch || user.try_log_in})} />
        :
        <SyncIconDisabled color="inherit"/>
      }
    </IconButton>,

    <IconButton key="logged_in" title={login_tooltip} onClick={() => handleNavigate(`${base || ''}/login`)}>
      {user.logged_in ? <PersonOutline color="inherit"/> : <AccountOff color="inherit"/>}
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
