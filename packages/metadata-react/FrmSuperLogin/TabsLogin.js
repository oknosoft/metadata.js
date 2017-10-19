import React from 'react';
import Tabs, {Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import {FormGroup} from 'material-ui/Form';
import {DialogActions} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

import {blue, red} from 'material-ui/colors';
import {FacebookIcon, GitHubIcon, GoogleIcon, YandexIcon} from './assets/icons';

import withStyles from '../styles/paper600';
import classnames from 'classnames';

import {connect} from 'react-redux';

class TabsLogin extends React.Component {

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
    };
  }

  handleTextChange = () => {
    this.setState({
      btn_login_disabled: !this.state.login || !this.state.password
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    }, this.handleTextChange);
  };

  oauthClick(provider) {
    return this.props.handleSocialAuth(provider);
  }

  handleLogin = () => {
    this.props.handleLogin(this.state.login, this.state.password);
  };

  handleRegister = () => {
    const {props, state} = this;
    props.dispatch($p.superlogin._actions.handleRegister({
        name: state.name,
        username: state.username,
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
      }));
  };


  render() {
    const {props, state, handleLogin} = this;
    const {classes, handleLogOut} = props;
    const btn = classnames(classes.button, classes.fullWidth);

    return (

      <Paper className={classes.root} elevation={4}>

        <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Вход"/>
          <Tab label="Регистрация"/>
        </Tabs>

        {state.index === 0 &&
        <FormGroup>
          <TextField
            placeholder="Имя пользователя"
            label="Имя пользователя (login)"
            defaultValue={this.props.login}
            onChange={this.handleChange('login')}
          />

          <TextField
            placeholder="Пароль"
            label="Пароль"
            type="password"
            defaultValue={this.props.password}
            onChange={this.handleChange('password')}
          />

          <DialogActions>
            <Button color="primary" dense disabled={state.btn_login_disabled} className={classes.button} onClick={this.handleLogin}>Войти</Button>
            <Button color="primary" dense disabled={true} className={classes.button}>Забыли пароль?</Button>
          </DialogActions>

        </FormGroup>
        }
        {state.index === 0 &&
        <FormGroup>
          <Divider/>
          <Typography type="subheading" color="inherit">Вы можете авторизоваться при помощи учетных записей социальных сетей:</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <Button raised dense className={btn} onClick={this.oauthClick('google')}>
                <GoogleIcon viewBox="0 0 256 262" style={{height: 18}} color={blue[500]}/> Google
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button raised dense className={btn} onClick={this.oauthClick('yandex')}>
                <YandexIcon viewBox="0 0 180 190" style={{height: 18}} color={red[500]}/> Яндекс
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button raised dense className={btn} onClick={this.oauthClick('facebook')}>
                <FacebookIcon viewBox="0 0 450 450" style={{height: 18}} color="#3A559F"/> Facebook
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button raised dense className={btn} onClick={this.oauthClick('github')}>
                <GitHubIcon viewBox="0 0 256 250" style={{height: 18}}/> GitHub
              </Button>
            </Grid>
          </Grid>

        </FormGroup>
        }

        {state.index === 1 &&
        <FormGroup>
          <TextField
            onChange={this.handleChange('name')}
            fullWidth
            placeholder="Полное имя"
            label="Полное имя"
          /><br/>
          <TextField
            onChange={this.handleChange('username')}
            fullWidth
            placeholder="Имя пользователя"
            label="Имя пользователя (login)"
          /><br/>
          <TextField
            onChange={this.handleChange('email')}
            fullWidth
            placeholder="Электронная почта"
            label="Электронная почта"
          /><br/>
          <TextField
            onChange={this.handleChange('password')}
            fullWidth
            placeholder="Пароль"
            label="Пароль"
            type="password"
          /><br/>
          <TextField
            onChange={this.handleChange('confirmPassword')}
            fullWidth
            placeholder="Подтвердить пароль"
            label="Подтвердить пароль"
            type="password"
          />

          <DialogActions>
            <Button color="primary" dense className={classes.button} onClick={this.handleRegister}>Регистрация</Button>
          </DialogActions>
        </FormGroup>
        }

      </Paper>

    );
  }
}


export default withStyles(connect(null, (dispatch) => ({
  handleSocialAuth: (provider) => {
    const fn = $p.superlogin._actions.handleSocialAuth(provider);
    return () => fn(dispatch);
  },
  dispatch
}))(TabsLogin));
