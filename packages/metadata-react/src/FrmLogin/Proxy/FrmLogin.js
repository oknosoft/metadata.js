/**
 * Форма авторизации
 *
 * @module FrmLogin
 *
 * Created by Evgeniy Malyarov on 21.06.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconError from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Creditales from 'metadata-react/FrmLogin/Creditales';
import DataField from 'metadata-react/DataField';
import {withMeta} from 'metadata-redux';
import classnames from 'classnames';
import Provider from './Provider';
import withStyles from './styles';
import providers from './providers';

const directLogins = ['couchdb', 'ldap'];

class FrmLogin extends React.Component {

  constructor(props, context) {
    super(props, context);
    let provider = typeof $p === 'object' && $p.adapters.pouch ? $p.adapters.pouch.props._auth_provider || '' : '';
    if(typeof $p === 'object' && $p.adapters.pouch) {
      provider = $p.adapters.pouch.props._auth_provider || '';
      if(!provider) {
        provider = $p.wsql.get_user_param('auth_provider');
      }
    }
    this.state = {
      fetching: false,
      showPassword: false,
      error: '',
      login: '',
      password: '',
      provider,
    };
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPasssword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  handlePasswordChange = ({target}) => {
    this.setState({password: target.value, error: ''});
  };

  handleLoginChange = ({target}) => {
    this.setState({login: target.value, error: ''});
  };

  handleLogin = (provider) => {
    const {props, state} = this;
    const {login, password} = state;
    if(!provider) {
      provider = state.provider;
    }

    $p.adapters.pouch.props._auth_provider = provider;
    $p.wsql.set_user_param('auth_provider', provider);
    props.handleLogin(login, password);

  };

  handleNavigate = () => {
    const {handleNavigate, first_run, ret_url} = this.props;
    if (first_run) {
      $p.eve && ($p.eve.redirect = true);
      location.replace(ret_url || '/');
    }
    else {
      handleNavigate(ret_url || '/');
    }
  };

  handleAuth = (provider) => {
    if(directLogins.includes(provider)) {
      this.setState({provider, error: ''});
    }
    else if(provider === 'offline') {
      let {login, password} = this.state;
      if(login && password) {
        this.handleLogin('couchdb');
      }
      else {
        const {wsql, aes} = $p;
        login = wsql.get_user_param('user_name');
        password = wsql.get_user_param('user_pwd');
        if(login && password) {
          this.setState({
            login,
            password: aes.Ctr.decrypt(password),
            error: '',
          }, () => this.handleLogin('couchdb'));
        }
        else {
          this.setState({error: 'Нет сохраненных логина и пароля для автономного режима'});
        }
      }
    }
    else {
      this.handleLogin('google');
    }
  };

  footer() {
    const {state: {provider, error}, props: {classes, user, idle, handleLogOut, handleUnLock}, handleNavigate} = this;

    function Button(props) {
      return <BaseButton color="primary" size="small" className={classes.dialogButton} {...props}/>;
    }

    return [
      <DialogActions key="actions">
        {user.logged_in && !idle && <Button onClick={handleLogOut}>Выйти</Button>}
        {user.logged_in && idle && <Button onClick={handleUnLock}>Войти</Button>}
        {!user.logged_in && directLogins.includes(provider) && <Button onClick={() => this.handleLogin(provider)}>Войти</Button>}
        {user.logged_in && !idle && <Button onClick={handleNavigate} title="Перейти к списку документов">К документам</Button>}
      </DialogActions>,
      (user.log_error || error) &&
      <FormGroup key="error" row>
        <IconError className={classes.error}/>
        <Typography variant="subtitle1" color="error" gutterBottom className={classes.infoText}>{(user.log_error || error)}</Typography>
      </FormGroup>,
      !user.log_error && user.try_log_in &&
      <FormGroup key="info" row>
        <CircularProgress size={24}/>
        <Typography variant="subtitle1" color="primary" gutterBottom className={classes.infoText}>
          {`${$p.msg.login.title}, ${$p.msg.login.wait}...`}
        </Typography>
      </FormGroup>,
    ];
  }

  creditales() {
    const {state: {  provider, login, password, showPassword}, props: {classes, user, _obj, disable}} = this;
    if(user.logged_in) {
      return <FormGroup>
        <DataField _obj={_obj} _fld="id" read_only />
        <DataField _obj={_obj} _fld="branch" read_only fullWidth />
        <DataField _obj={_obj} _fld="roles" read_only />
      </FormGroup>;
    }
    else if(directLogins.includes(provider)) {
      const {Icon, name} = providers[provider];
      return [
        <Provider key="select-provider" provider={provider} changeProvider={(provider) => this.setState({provider, error: ''})}/>,
        <Creditales
          key="creditales"
          login={login}
          password={password}
          showPassword={showPassword}
          handleClickShowPasssword={this.handleClickShowPasssword}
          handleMouseDownPassword={this.handleMouseDownPassword}
          handleLogin={this.handleLogin}
          loginChange={this.handleLoginChange}
          passwordChange={this.handlePasswordChange}
        />];
    }
    else {
      return [
        <Typography key="title" variant="subtitle1" color="primary" gutterBottom>
          Войти с помощью:
        </Typography>,
        Object.keys(providers).map((provider) => {
          const {Icon, name, disabled} = providers[provider];
          return <BaseButton
            key={provider}
            className={classes.button}
            variant="contained"
            disabled={(disable || []).includes(provider)}
            onClick={() => this.handleAuth(provider)}>
            <Icon className={classes.icon}/>{name}
          </BaseButton>;
        })
        ];
    }
  }

  render() {
    const {state: {fetching, error}, props: {classes, user}} = this;
    return <div className={classnames({
      [classes.root]: true,
      [classes.disabled]: user.try_log_in,
    })}>
      {this.creditales()}
      {this.footer()}
    </div>;
  }

}

FrmLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default withMeta(withStyles(FrmLogin));
