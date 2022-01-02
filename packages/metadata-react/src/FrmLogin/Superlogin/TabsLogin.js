import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import DialogActions from '@mui/material/DialogActions';
import {Helmet} from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconError from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';

import {blue, red} from '@mui/material/colors';
import {FacebookIcon, GitHubIcon, GoogleIcon, YandexIcon} from './assets/icons';

import withStyles from '../../styles/paper600';
import connect from './connect';
import classnames from 'classnames';
import Fogot from './Fogot';

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
  shouldComponentUpdate({handleIfaceState, title}, {index}) {
    const ltitle = index ? 'Регистрация...' : 'Авторизация...';
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

  oauthClick(provider) {
    return this.props.handleSocialAuth(provider);
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPasssword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  handleChange = (name) => event => {
    this.setState({[name]: event.target.value});
  };

  handleInfo = (text) => {
    this.setState({log_error: `${text}`});
  };

  handleLogin = () => {
    const {login, password} = this.state;
    login && password && this.props.handleLogin(login, password);
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
    const {classes, user, handleLogOut} = props;
    const btn = classnames(classes.button, classes.fullWidth);
    const log_error = user.log_error || state.log_error;
    const info = log_error && /info:/.test(log_error);

    return (

      <div className={classnames({[classes.disabled]: user.try_log_in})}>

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

          <FormControl
            fullWidth
            margin="dense"
          >
            <InputLabel>Пароль</InputLabel>
            <Input
              type={state.showPassword ? 'text' : 'password'}
              placeholder="password"
              defaultValue={this.props.password}
              onChange={this.handleChange('password')}
              onKeyPress={(e) => e.key === 'Enter' && this.handleLogin()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.handleClickShowPasssword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <DialogActions>
            <Fogot classes={classes} handleInfo={this.handleInfo} />
            <Button color="primary" size="small" disabled={!state.login || !state.password} className={classes.button} onClick={this.handleLogin}>Войти</Button>
          </DialogActions>

        </FormGroup>
        }

        {state.index === 0 && !log_error && user.try_log_in &&
        <FormGroup row>
          <CircularProgress size={24}/>
          <Typography variant="subtitle1" color="primary" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
            {`${$p.msg.login.title}, ${$p.msg.login.wait}...`}
          </Typography>
        </FormGroup>
        }

        {state.index === 0 && log_error &&
        <FormGroup row>
          {info ? <IconError /> : <IconError className={classes.error}/>}
          <Typography variant="subtitle1" color={info ? 'primary' : 'error'} gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
            {Array.isArray(log_error) ? log_error.join('; ') : log_error.replace('info:', '')}
          </Typography>
        </FormGroup>
        }

        {state.index === 0 &&
        <FormGroup>
          <Divider/>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle1" color="inherit">После первичной регистрации по логину/паролю, Вы можете связать учетную запись с профилем социальных сетей и выполнять вход через oAuth GitHub, Facebook и Google</Typography>
            </Grid>
            <Grid item xs={10} sm={5}>
              <Button variant="contained" size="small" className={btn} onClick={this.oauthClick('github')}>
                <GitHubIcon viewBox="0 0 256 250" style={{height: 18, fill: 'darkslategrey'}}/> GitHub
              </Button>
              <Button variant="contained" size="small" className={btn} onClick={this.oauthClick('google')}>
                <GoogleIcon viewBox="0 0 256 262" style={{height: 18, fill: blue[500]}}/> Google
              </Button>
              <Button variant="contained" size="small" className={btn} onClick={this.oauthClick('facebook')}>
                <FacebookIcon viewBox="0 0 450 450" style={{height: 18, fill: '#3A559F'}}/> Facebook
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
          />
          <TextField
            onChange={this.handleChange('username')}
            fullWidth
            placeholder="Имя пользователя"
            label="Имя пользователя (login)"
          />
          <TextField
            onChange={this.handleChange('email')}
            fullWidth
            placeholder="Электронная почта"
            label="Электронная почта"
          />
          <TextField
            onChange={this.handleChange('password')}
            fullWidth
            placeholder="Пароль"
            label="Пароль"
            type="password"
          />
          <TextField
            onChange={this.handleChange('confirmPassword')}
            fullWidth
            placeholder="Подтвердить пароль"
            label="Подтвердить пароль"
            type="password"
          />

          <DialogActions>
            <Button color="primary" size="small" className={classes.button} onClick={this.handleRegister}>Регистрация</Button>
          </DialogActions>

        </FormGroup>
        }

        {state.index === 1 && !log_error && user.try_log_in &&
        <FormGroup row>
          <CircularProgress size={24}/>
          <Typography variant="subtitle1" color="primary" gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
            {`${$p.msg.login.title}, ${$p.msg.login.wait}...`}
          </Typography>
        </FormGroup>
        }

        {state.index === 1 && log_error &&
        <FormGroup row>
          {info ? <IconError /> : <IconError className={classes.error}/>}
          <Typography variant="subtitle1" color={info ? 'primary' : 'error'} gutterBottom className={classnames(classes.spaceLeft, classes.errorText)}>
            {Array.isArray(log_error) ? log_error.join('; ') : log_error.replace('info:', '')}
          </Typography>
        </FormGroup>
        }

      </div>

    );
  }
}

export default withStyles(connect(TabsLogin));
