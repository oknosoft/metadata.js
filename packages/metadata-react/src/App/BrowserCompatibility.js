/**
 * Показывает предупреждение о несовместимом браузере
 *
 * @module BrowserCompatibility
 *
 * Created by Evgeniy Malyarov on 07.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '../styles/paper600';

// Совместимость браузера проверяем по наличию конструкторов Promise, Proxy и Symbol
export function browser_compatible(ie11) {
  // navigator.userAgent.match(/Google|Yandex|Slurp|ia_archiver/i);
  return typeof Promise === 'function' && typeof Proxy === 'function' && typeof Symbol === 'function';
}

function BrowserCompatibility({classes}) {

  return <Paper className={classes.root} elevation={4}>
    <Typography variant="h4">Неподдерживаемый браузер</Typography>
    <Typography>Для запуска приложений metadata.js, требуется браузер с движком V8:</Typography>
    <ul>
      <li>Chrome</li>
      <li>Opera</li>
      <li>Yandex</li>
    </ul>
    <p>&nbsp;</p>
  </Paper>;

}

export default withStyles(BrowserCompatibility);


