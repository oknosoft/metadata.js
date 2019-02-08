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
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';

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

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  handleLogin() {
    const {props, state: {login, password}} = this;
    login && password && props.handleLogin(login, password);
  }

  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title}, {index}) {
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

  render() {

    const {props, state, handleLogin} = this;
    const {classes, user, handleLogOut, couch_direct} = props;
    const descr = "Вход в систему";

    return <Paper className={classnames({
      [classes.root]: true,
      [classes.disabled]: user.try_log_in && couch_direct
    })} elevation={4}>

      <Helmet title={props.title}>
        <meta name="description" content={descr} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={descr} />
      </Helmet>

      <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
        <Tab label="Вход"/>
        <Tab label="Подключение"/>
      </Tabs>

      {state.index === 0 &&
      <FormGroup>

        <TextField
          label="Имя пользователя"
          InputProps={{placeholder: 'login'}}
          fullWidth
          margin="dense"
          value={state.login}
          onChange={event => this.setState({login: event.target.value})}
        />

        <FormControl
          fullWidth
          margin="dense"
        >
          <InputLabel>Пароль</InputLabel>
          <Input
            type={state.showPassword ? 'text' : 'password'}
            placeholder="password"
            value={state.password}
            onChange={event => this.setState({password: event.target.value})}
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

      </FormGroup>
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
          <Button color="primary" size="small" className={classes.button} disabled={!state.login || !state.password} onClick={handleLogin}>Войти</Button>
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
