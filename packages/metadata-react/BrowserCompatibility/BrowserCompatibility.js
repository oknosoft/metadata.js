/**
 *
 *
 * @module BrowserCompatibility
 *
 * Created by Evgeniy Malyarov on 07.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import withStyles from '../styles/paper600';

function BrowserCompatibility({classes}) {

  return <Paper className={classes.root} elevation={4}>
    <Typography type="display1">Неподдерживаемый браузер</Typography>
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


