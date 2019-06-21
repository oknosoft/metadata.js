import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import IconError from '@material-ui/icons/ErrorOutline';
import Input from '@material-ui/core/Input';
import FormGroup from '@material-ui/core/FormGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';

import Creditales from './Creditales';
import CnnSettings from './CnnSettings';
import {withPrm} from 'metadata-redux';
import withStyles from '../styles/paper600';


class TabsLogin extends Component {

  constructor(props) {
    super(props);
    let password = '';
    try {
      password = props.user_pwd && $p.aes.Ctr.decrypt(props.user_pwd);
    }
    catch (e) {
    }
    this.state = {
      index: 0,
      login: props.user_name,
      password,
      showPassword: false,
    };

  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title, disableTitle}, {index}) {
    if(disableTitle) {
      return true;
    }
    const ltitle = index ? 'Параметры подключения' : 'Авторизация...';
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleLogin = () => {
    const {props, state: {login, password}} = this;
    login && password && props.handleLogin(login, password);
  };

  render() {

    const {props, state, handleLogin} = this;
    const {classes, user, handleLogOut, couch_direct, offline, disableTitle} = props;
    const descr = "Вход в систему";

    return <Paper className={classnames({
      [classes.root]: true,
      [classes.disabled]: user.try_log_in && couch_direct,
      [classes.spaceLeft]: disableTitle,

    })} elevation={4} id="login-form">

      <Helmet title={props.title}>
        <meta name="description" content={descr} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={descr} />
      </Helmet>

      <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
        <Tab label="Вход"/>
        <Tab label="Подключение"/>
      </Tabs>

      {state.index === 0 && <Creditales
        login={state.login}
        password={state.password}
        showPassword={state.showPassword}
        handleClickShowPasssword={this.handleClickShowPasssword}
        handleMouseDownPassword={this.handleMouseDownPassword}
        handleLogin={this.handleLogin}
        loginChange={event => this.setState({login: event.target.value})}
        passwordChange={event => this.setState({password: event.target.value})}
      />
      }

      {state.index === 0 && !user.log_error && user.try_log_in &&
      <FormGroup row>
        <CircularProgress size={24}/>
        <Typography variant="subtitle1" color="primary" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
          {`${$p.msg.login.title}, ${$p.msg.login.wait}...`}
        </Typography>
      </FormGroup>
      }

      {state.index === 0 && user.log_error &&
      <FormGroup row>
        <IconError className={classes.error}/>
        <Typography variant="subtitle1" color="error" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>{user.log_error}</Typography>
      </FormGroup>
      }

      {state.index === 0 && <DialogActions>
        {props.user.logged_in ?
          <Button color="primary" size="small" className={classes.button} onClick={handleLogOut}>Выйти</Button>
          :
          [
            !couch_direct && <Button
              key="offline"
              color="primary"
              size="small"
              className={classes.button}
              disabled={user.try_log_in || !state.login || !state.password}
              onClick={handleLogin}>Автономный режим</Button>,
            !offline && <Button
              key="login"
              color="primary"
              size="small"
              className={classes.button}
              disabled={user.try_log_in || !state.login || !state.password}
              onClick={handleLogin}>Войти</Button>
          ]
        }
        <Button variant="contained" size="small" disabled={true} className={classes.button}>Забыли пароль?</Button>
      </DialogActions>}

      {state.index === 1 && <CnnSettings {...props}/>}

    </Paper>;
  }
}

TabsLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  user_name: PropTypes.string,
  user_pwd: PropTypes.string,
};

export default withPrm(withStyles(TabsLogin));
