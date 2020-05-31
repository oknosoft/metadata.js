import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ConnectedRouter as Router} from 'react-router-redux';
import {Route} from 'react-router';

// статусы "загружено и т.д." в ствойствах компонента
import {withMeta} from 'metadata-redux';

// заставка несовместимый браузер
import BrowserCompatibility, {browser_compatible} from './BrowserCompatibility';
import SecondInstance from './SecondInstance';

// тема для material-ui
import {ThemeProvider} from '@material-ui/styles';

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

    return res;
  }

  render() {

    const {props, state} = this;
    const {meta_loaded, data_empty, data_loaded, history, DumbScreen, AppView, theme, repl, second_instance} = props;

    const show_dumb = DumbScreen && state.need_meta && (
      !meta_loaded || (!data_empty && !data_loaded)
    );

    if(!show_dumb && repl) {
      for(const dbs in repl) {
        const info = repl[dbs];
        if(info.ok && !info.end_time) {
          show_dumb = true;
        }
      }
    }

    const _dumb = show_dumb && ((React.isValidElement(DumbScreen) ? DumbScreen : <DumbScreen {...props} />));

    return <ThemeProvider theme={theme}>
      {
        second_instance ?
          (
            <SecondInstance/>
          )
          :
          (
            state.browser_compatible ?
              (show_dumb ? _dumb : <Router history={history}><Route component={AppView}/></Router>)
              :
              <BrowserCompatibility/>
          )
      }
    </ThemeProvider>;

  }
}

RootView.propTypes = {
  DumbScreen: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  AppView: PropTypes.oneOfType([PropTypes.object, PropTypes.node, PropTypes.func]).isRequired,
  history: PropTypes.object.isRequired,
  item_props: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  ie11: PropTypes.bool,
  disableAutoLogin: PropTypes.bool,
};

export default withMeta(RootView);
