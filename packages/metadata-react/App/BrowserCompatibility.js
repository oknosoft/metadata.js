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
  // navigator.userAgent.match(/(Chrome|Opera|YaBrowser)/) && !navigator.userAgent.match(/Edge/);

  return (typeof Promise == 'function' && typeof Proxy == 'function' && typeof Symbol == 'function') ||
    (ie11 && navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/11.0/)) ||
    navigator.userAgent.match(/Google|Yandex|Slurp|ia_archiver/i);
}

function BrowserCompatibility({classes}) {

  return <Paper className={classes.root} elevation={4}>
    <Typography variant="h4">Неподдерживаемый браузер</Typography>
    <Typography>Для запуска приложений metadata.js, требуется браузер с движком V8 или SpiderMonkey:</Typography>
    <ul>
      <li>Chrome</li>
      <li>Opera</li>
      <li>Yandex</li>
      <li>Firefox</li>
    </ul>
    <p>&nbsp;</p>
  </Paper>;

}

export default withStyles(BrowserCompatibility);


