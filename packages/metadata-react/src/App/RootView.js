import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ConnectedRouter as Router} from 'react-router-redux';
import {Route} from 'react-router';

// статусы "загружено и т.д." в ствойствах компонента
import {withMeta} from 'metadata-redux';

// заставка несовместимый браузер
import BrowserCompatibility, {browser_compatible} from './BrowserCompatibility';

// тема для material-ui
import {MuiThemeProvider} from '@material-ui/core/styles';

class RootView extends Component {

  constructor(props) {
    super(props);
    const iprops = props.item_props();
    this.state = {
      need_meta: !!iprops.need_meta,
      browser_compatible: browser_compatible(props.ie11),
    };

    this.shouldComponentUpdate(props, this.state, iprops)
  }

  shouldComponentUpdate(props, {need_meta}, iprops) {
    const {meta_loaded, user, data_empty, couch_direct, offline, history, item_props, first_run, path_log_in, disableAutoLogin} = props;
    let res = true;

    if(!iprops || !iprops.hasOwnProperty('need_meta')){
      iprops = item_props();
    }

    if(need_meta != !!iprops.need_meta) {
      this.setState({need_meta: !!iprops.need_meta});
      res = false;
    }

    // если есть сохранённый пароль и online, пытаемся авторизоваться
    if(!disableAutoLogin && meta_loaded && !user.logged_in && user.has_login && !user.try_log_in && !user.stop_log_in && !offline && !user.logged_out) {
      props.handleLogin();
      res = false;
    }

    // если это первый запуск или couch_direct и offline, переходим на страницу login
    if(!path_log_in && meta_loaded && res && iprops.need_user && (
      first_run || (data_empty === true && !user.try_log_in && !user.logged_in) || (couch_direct && offline)
      )) {
      history.push('/login');
      this.setState({pathname: '/login'});
      res = false;
    }

    return res;
  }

  render() {

    const {props, state} = this;
    const {meta_loaded, data_empty, data_loaded, history, DumbScreen, AppView, theme} = props;

    const show_dumb = DumbScreen && state.need_meta && (
      !meta_loaded || (!data_empty && !data_loaded)
    );

    return <MuiThemeProvider theme={theme}>
      {
        state.browser_compatible ?
          (show_dumb ?
            <DumbScreen {...props} />
            :
            <Router history={history}>
              <Route component={AppView}/>
            </Router>)
          :
          (<BrowserCompatibility/>)
      }
    </MuiThemeProvider>;

  }
}

RootView.propTypes = {
  DumbScreen: PropTypes.func,
  AppView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  item_props: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  ie11: PropTypes.bool,
  disableAutoLogin: PropTypes.bool,
};

export default withMeta(RootView);
