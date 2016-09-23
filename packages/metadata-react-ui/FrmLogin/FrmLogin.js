import React, { Component, PropTypes } from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import classes from './FrmLogin.scss';

export default class FrmLogin extends Component {

  static propTypes = {
    login: PropTypes.string,
    password: PropTypes.string,

    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    couch_path: PropTypes.string,
    couch_suffix: PropTypes.string,
    enable_save_pwd: PropTypes.bool,

    handleLogin: PropTypes.func.isRequired,
    handleSetPrm: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      login: this.props.login,
      password: this.props.password,

      zone: this.props.zone,
      couch_path: this.props.couch_path,
      couch_suffix: this.props.couch_suffix,
      enable_save_pwd: this.props.enable_save_pwd,

      tab_value:'a'
    };

  }

  handleToggle() {
    this.setState({enable_save_pwd: !this.state.enable_save_pwd});
  }

  handleTextChange(event){
    const v = {};
    v[event.target.id] =  event.target.value;
    this.setState(v);
  }

  handleSetPrm(){
    this.props.handleSetPrm({
      zone: this.state.zone,
      couch_path: this.state.couch_path,
      enable_save_pwd: this.state.enable_save_pwd
    })
  }

  tabChange = (value) => {
    if(value === 'a' || value === 'b'){
      this.setState({
        tab_value: value,
      });
    }
  };

  handleLogin = (event) => {
    this.props.handleLogin(this.state.login, this.state.password);
  };

  render() {

    const handleTextChange = ::this.handleTextChange;

    return (

      <div className={classes.container}>

        <Paper  zDepth={3} rounded={false} className={classes.paper}  >

          <Tabs
            value={this.state.tab_value}
            onChange={this.tabChange}
          >
            <Tab label="Вход" value="a" >

              <TextField
                id="login"
                className={classes.loginField}
                hintText="login"
                floatingLabelText="Имя пользователя"
                defaultValue={this.state.login}
                onChange={handleTextChange}
              />

              <TextField
                id="password"
                className={classes.loginField}
                hintText="password"
                floatingLabelText="Пароль"
                type="password"
                defaultValue={this.state.password}
                onChange={handleTextChange}
              />

              <RaisedButton label="Войти"
                            disabled={!this.state.login || !this.state.password}
                            className={classes.loginButton}
                            onTouchTap={this.handleLogin} />

              <RaisedButton label="Забыли пароль?"
                            disabled={true}
                            className={classes.loginButton} />

              <RaisedButton label="Справка"
                            className={classes.loginButton}
                            style={{float: 'right'}} />

            </Tab>

            <Tab label="Подключение" value="b">

              <TextField
                id="zone"
                floatingLabelText="Область данных"
                hintText="zone"
                className={classes.loginField}
                defaultValue={this.state.zone}
                onChange={handleTextChange}
              />

              <TextField
                id="couch_path"
                floatingLabelText="Адрес CouchDB"
                hintText="couch_path"
                className={classes.loginField}
                defaultValue={this.state.couch_path}
                onChange={handleTextChange}
              />

              <Toggle
                label="Разрешить сохранение пароля"
                className={classes.loginToggle}
                toggled={this.state.enable_save_pwd}
                onToggle={::this.handleToggle}
              />

              <Divider />

              <RaisedButton label="Сохранить настройки"
                            className={classes.loginButton}
                            onTouchTap={::this.handleSetPrm} />

            </Tab>
          </Tabs>

        </Paper>

      </div>

    );
  }
}
