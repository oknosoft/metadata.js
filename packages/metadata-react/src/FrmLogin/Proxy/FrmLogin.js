/**
 * Форма авторизации
 *
 * @module FrmLogin
 *
 * Created by Evgeniy Malyarov on 21.06.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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
    this.state = {
      fetching: false,
      showPassword: false,
      error: '',
      provider: typeof $p === 'object' && $p.adapters.pouch ? $p.adapters.pouch.props._auth_provider || '' : '',
      login: '',
      password: '',

    };
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleLogin = (provider) => {
    const {props, state} = this;
    const {login, password} = state;
    if(!provider) {
      provider = state.provider;
    }

    $p.adapters.pouch.props._auth_provider = provider;
    props.handleLogin(login, password);

  };

  footer() {
    const {state: {provider}, props: {classes, user, handleLogOut}} = this;
    return [
      <DialogActions key="actions">
        {user.logged_in &&
        <Button color="primary" size="small" className={classes.dialogButton} onClick={handleLogOut}>Выйти</Button>}
        {!user.logged_in && directLogins.includes(provider) &&
        <Button color="primary" size="small" className={classes.dialogButton} onClick={() => this.handleLogin(provider)}>Войти</Button>}
      </DialogActions>,
      user.log_error &&
      <FormGroup key="error" row>
        <IconError className={classes.error}/>
        <Typography variant="subtitle1" color="error" gutterBottom className={classes.infoText}>{user.log_error}</Typography>
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
    const {state: {  provider, login, password, showPassword}, props: {classes, user, _obj}} = this;
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
        <Provider key="select-provider" provider={provider} changeProvider={(provider) => this.setState({provider})}/>,
        <Creditales
          key="creditales"
          login={login}
          password={password}
          showPassword={showPassword}
          handleClickShowPasssword={this.handleClickShowPasssword}
          handleMouseDownPassword={this.handleMouseDownPassword}
          handleLogin={this.handleLogin}
          loginChange={({target}) => this.setState({login: target.value})}
          passwordChange={({target}) => this.setState({password: target.value})}
        />];
    }
    else {
      return [
        <Typography key="title" variant="subtitle1" color="primary" gutterBottom>
          Войти с помощью:
        </Typography>,
        Object.keys(providers).map((provider) => {
          const {Icon, name, disabled} = providers[provider];
          return <Button
            key={provider}
            className={classes.button}
            variant="contained"
            disabled={disabled}
            onClick={() => directLogins.includes(provider) ? this.setState({provider}) : this.handleLogin('google')}>
            <Icon className={classes.icon}/>{name}
          </Button>;
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
};

export default withMeta(withStyles(FrmLogin));
