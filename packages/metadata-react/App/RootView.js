import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ConnectedRouter as Router} from 'react-router-redux';
import {Route} from 'react-router';

// статусы "загружено и т.д." в ствойствах компонента
import {withMeta} from 'metadata-redux';

// заставка несовместимый браузер
import BrowserCompatibility, {browser_compatible} from '../BrowserCompatibility';

// тема для material-ui
import {MuiThemeProvider} from 'material-ui/styles';

class RootView extends Component {

  constructor(props) {
    super(props);
    const iprops = props.item_props();
    this.state = {
      need_meta: !!iprops.need_meta,
      need_user: !!iprops.need_user,
      browser_compatible: browser_compatible(),
    };
  }

  shouldComponentUpdate(props, {need_user, need_meta}) {
    const {meta_loaded, user, data_empty, couch_direct, offline, history, item_props} = props;
    const iprops = item_props();
    let res = true;

    if(need_user != !!iprops.need_user) {
      this.setState({need_user: !!iprops.need_user});
      res = false;
    }

    if(need_meta != !!iprops.need_meta) {
      this.setState({need_meta: !!iprops.need_meta});
      res = false;
    }

    // если есть сохранённый пароль и online, пытаемся авторизоваться
    if(meta_loaded && !user.logged_in && user.has_login && !user.try_log_in && !offline) {
      props.handleLogin();
      res = false;
    }

    // если это первый запуск или couch_direct и offline, переходим на страницу login
    if(meta_loaded && res && need_user && ((data_empty === true && !user.try_log_in && !user.logged_in) || (couch_direct && offline))) {
      history.push('/login');
      this.setState({pathname: '/login'});
      res = false;
    }

    return res;
  }

  render() {

    const {props, state} = this;
    const {meta_loaded, data_empty, data_loaded, history, DumbScreen, AppView, theme} = props;
    const show_dumb = state.need_meta && (
      !meta_loaded ||
      (data_empty === undefined) ||
      (data_empty === false && !data_loaded)
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
  DumbScreen: PropTypes.func.isRequired,
  AppView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  item_props: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withMeta(RootView);
