import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';


import classes from "./FrmLogin.scss";

export default class TabsLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab_value: 'a',
      btn_login_disabled: !this.props.login || !this.props.password
    };
  }

  tabChange = (tab_value) => {
    if(tab_value === 'a' || tab_value === 'b'){
      this.setState({
        tab_value: tab_value,
      });
    }
  };

  handleSetPrm(){
    this.props.handleSetPrm({
      zone: this.state.zone,
      couch_path: this.state.couch_path,
      enable_save_pwd: this.state.enable_save_pwd
    })
  }

  handleTextChange = () => {
    this.setState({
      btn_login_disabled: !this.refs.login.input.value || !this.refs.password.input.value
    });
  }

  handleLogin = () => {
    this.props.handleLogin(this.refs.login.input.value, this.refs.password.input.value)
  }


  render() {
    return (

      <div className={classes.paper}>

        <Paper  zDepth={3} rounded={false}>

          <Tabs
            value={this.state.tab_value}
            onChange={this.tabChange}
          >
            <Tab label="Вход" value="a" >

              <div className={classes.sub_paper} >

                <TextField
                  ref="login"
                  hintText="login"
                  floatingLabelText="Имя пользователя"
                  fullWidth={true}
                  defaultValue={this.props.login}
                  onChange={this.handleTextChange}
                />

                <TextField
                  ref="password"
                  hintText="password"
                  floatingLabelText="Пароль"
                  fullWidth={true}
                  type="password"
                  defaultValue={this.props.password}
                  onChange={this.handleTextChange}
                />
                <br />

                <RaisedButton label="Войти"
                              disabled={this.state.btn_login_disabled}
                              className={classes.button}
                              onTouchTap={this.handleLogin} />

                <RaisedButton label="Забыли пароль?"
                              disabled={true}
                              className={classes.button} />

              </div>

            </Tab>

            <Tab label="Подключение" value="b">

              <div className={classes.sub_paper} >

                <TextField
                  ref="zone"
                  floatingLabelText="Область данных"
                  hintText="zone"
                  fullWidth={true}
                  defaultValue={this.props.zone}
                />

                <TextField
                  ref="couch_path"
                  floatingLabelText="Адрес CouchDB"
                  hintText="couch_path"
                  fullWidth={true}
                  defaultValue={this.props.couch_path}
                />

                <Toggle
                  ref="enable_save_pwd"
                  label="Разрешить сохранение пароля"
                  className={classes.toggle}
                  defaultToggled={this.props.enable_save_pwd}
                />

                <Divider />

                <RaisedButton label="Сохранить настройки"
                              className={classes.button}
                              onTouchTap={::this.handleSetPrm} />

              </div>

            </Tab>

          </Tabs>

        </Paper>

      </div>

    );
  }
}
