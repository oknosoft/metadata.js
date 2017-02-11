import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

import classes from './DumbLoader.scss'


export default class DumbScreen extends Component {

  static propTypes = {
    step: PropTypes.number,
    step_size: PropTypes.number,
    count_all: PropTypes.number,

    title: PropTypes.string,
    processed: PropTypes.string,
    current: PropTypes.string,
    bottom: PropTypes.string,
    page: PropTypes.object
  }

  render() {

    let { title, img, page } = this.props;

    if(!title)
      title = "Загрузка модулей...";

    return (
    <div className={classes.splash}>

      <div style={{position: 'absolute', bottom: '-20px'}}>{title}</div>

      { img }

      { page ? <div style={{position: 'absolute', bottom: '-44px'}}>{
        `Страница №${page.page}, загружено ${Math.min(page.page * page.limit, page.total_rows)} из ${page.total_rows} объектов`
      }</div> : null }

    </div>

    );
  }
}
