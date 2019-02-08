/**
 * ### Комплект диаграмм
 * Получает настройки из профиля пользователя и выводит пачку
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import AppContent from 'metadata-react/App/AppContent';
import Snack from 'metadata-react/App/Snack';
import DiagramsArray from './DiagramsArray';
import Settings from './Settings';
import connect from './connect';

const ltitle = 'Диаграммы';

class DiagramsPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      diagrams: [],
      grid: '1',
      snack: '',
      reseted: false,
    };
    this.onChange = this.setDiagrams.bind(this, true);
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
    setTimeout(() => this.setDiagrams(), 400);
  }

  setDiagrams(force) {
    const {props} = this;
    if(!force && this.logged_in === props.user.logged_in) {
      return;
    }
    this.logged_in = props.user.logged_in;
    props.diagrams()
      .then(({diagrams, grid}) => {
        this.setState({diagrams, grid});
        props.subscribe(this.onChange);

        if(force) {
          this.setSnack('Данные обновлены');
          setTimeout(this.setSnack, 1500);
        }
      });
  }

  setSnack = (snack = '') => {
    this.setState({snack});
  };

  Settings = (props) => {
    return <Settings {...props} onChange={this.onChange} setSnack={this.setSnack}/>;
  };

  shouldComponentUpdate({handleIfaceState, title, user}) {

    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      handleIfaceState({
        component: '',
        name: 'CustomBtn',
        value: this.Settings,
      });
      return false;
    }

    if(user.logged_in) {
      if(this.state.snack) {
        this.setSnack();
        this.setDiagrams();
      }
    }
    else if(!this.state.reseted && !this.state.snack) {
      this.setSnack('Пользователь не авторизован - демо режим');
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.props.unsubscribe();
    this.props.handleIfaceState({
      component: '',
      name: 'CustomBtn',
      value: null,
    });
  }

  render() {
    const {props: {classes, queryGrid}, state: {diagrams, snack, grid}}  = this;
    const descr = "Комплект диаграмм с живыми данными";
    return <AppContent fullWidth>
      <Helmet title={ltitle}>
        <meta name="description" content={descr} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={descr} />
      </Helmet>
      {
        snack && <Snack
          snack={{open: true, message: snack, button: 'Закрыть'}}
          handleClose={() => this.setState({snack: '', reseted: true})}
        />
      }
      <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%', paddingBottom: 48}}>
        {({width}) => <DiagramsArray
          width={width}
          classes={classes}
          diagrams={diagrams}
          grid={queryGrid() || grid}
        />}
      </AutoSizer>
    </AppContent>;
  }
}


DiagramsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  diagrams: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  queryGrid: PropTypes.func.isRequired,
  snack: PropTypes.object,
  user: PropTypes.object,
};

export default connect(DiagramsPage);
