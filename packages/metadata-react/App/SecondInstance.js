/**
 * Показывает предупреждение о втором экземпляре в соседнем окне
 *
 * @module SecondInstance
 *
 * Created by Evgeniy Malyarov on 30.07.2018
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '../styles/paper600';


function SecondInstance({classes}) {

  return <Paper className={classes.root} >
    <Typography variant="h4">Второй экземпляр</Typography>
    <Typography>В соседнем окне или закладке браузера, открыт второй экземпляр приложения</Typography>
    <Typography>Программы на metadata.js, монопольно используют idb и localstorage браузера, одновременный запуск в нескольких окнах - не поддержан</Typography>
    <p>&nbsp;</p>
  </Paper>;

}

export default withStyles(SecondInstance);


