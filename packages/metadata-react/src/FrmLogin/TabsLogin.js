import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import BaseButton from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import {Helmet} from 'react-helmet';
import Typography from '@mui/material/Typography';
import IconError from '@mui/icons-material/ErrorOutline';
import Input from '@mui/material/Input';
import FormGroup from '@mui/material/FormGroup';
import CircularProgress from '@mui/material/CircularProgress';
import classnames from 'classnames';

import Creditales from './Creditales';
import CnnSettings from './CnnSettings';
import {withPrm} from 'metadata-redux';
import withStyles from '../styles/paper600';

export class TabsLogin extends Component {

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
    const {classes, user, couch_direct, offline, disableTitle} = props;
    const descr = "Вход в систему";

    function Button(props) {
      return <BaseButton color="primary" size="small" className={classes.button} {...props}/>;
    }

    return <Paper className={classnames({
      [classes.root]: true,
      [classes.disabled]: user.try_log_in && couch_direct,
      [classes.spaceLeft]: disableTitle,

    })} elevation={4} id="login-form">
      {[
        <Helmet key="helmet" title={props.title}>
          <meta name="description" content={descr} />
          <meta property="og:title" content={props.title} />
          <meta property="og:description" content={descr} />
        </Helmet>,

        <Tabs key="tabs"  value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Вход"/>
          <Tab label="Подключение"/>
        </Tabs>,

        state.index === 0 &&
        <Creditales
          key="creditales"
          login={state.login}
          password={state.password}
          showPassword={state.showPassword}
          handleClickShowPasssword={this.handleClickShowPasssword}
          handleMouseDownPassword={this.handleMouseDownPassword}
          handleLogin={this.handleLogin}
          loginChange={event => this.setState({login: event.target.value})}
          passwordChange={event => this.setState({password: event.target.value})}
        />,

        state.index === 0 && !user.log_error && user.try_log_in &&
        <FormGroup key="info" row>
          <CircularProgress size={24}/>
          <Typography variant="subtitle1" color="primary" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
            {`${$p.msg.login.title}, ${$p.msg.login.wait}...`}
          </Typography>
        </FormGroup>,

        state.index === 0 && user.log_error &&
        <FormGroup key="error" row>
          <IconError className={classes.error}/>
          <Typography variant="subtitle1" color="error" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>{user.log_error}</Typography>
        </FormGroup>,

        state.index === 0 &&
        <DialogActions key="actions" >
          {user.logged_in && !props.idle && <Button onClick={props.handleLogOut}>Выйти</Button>}
          {user.logged_in && props.idle && <Button onClick={props.handleUnLock}>Войти</Button>}
          {!user.logged_in && !couch_direct && <Button disabled={user.try_log_in || !state.login || !state.password} onClick={handleLogin}>Автономный режим</Button>}
          {!user.logged_in && !offline && <Button disabled={user.try_log_in || !state.login || !state.password} onClick={handleLogin}>Войти</Button>}
          <Button disabled={true}>Забыли пароль?</Button>
        </DialogActions>,

        state.index === 1 && <CnnSettings key="settings" {...props}/>,
      ]}

    </Paper>;
  }
}

TabsLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleLock: PropTypes.func.isRequired,
  handleUnLock: PropTypes.func.isRequired,
  user_name: PropTypes.string,
  user_pwd: PropTypes.string,
  idle: PropTypes.bool,
};

export default withPrm(withStyles(TabsLogin));
