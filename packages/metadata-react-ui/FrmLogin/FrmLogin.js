import React, {Component, PropTypes} from "react";
import {Tabs, Tab} from "material-ui/Tabs";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Toggle from "material-ui/Toggle";
import Divider from "material-ui/Divider";
import classes from "./FrmLogin.scss";

export default class FrmLogin extends Component {

  static propTypes = {

    login: PropTypes.string,
    password: PropTypes.string,

    user: PropTypes.object.isRequired,

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

      btn_login_disabled: !this.props.login || !this.props.password,

      zone: this.props.zone,
      couch_path: this.props.couch_path,
      couch_suffix: this.props.couch_suffix,
      enable_save_pwd: this.props.enable_save_pwd,

      tab_value:'a'
    };

  }

  // handleToggle() {
  //   this.setState({enable_save_pwd: !this.state.enable_save_pwd});
  // }

  handleSetPrm(){
    this.props.handleSetPrm({
      zone: this.refs.zone.input.value,
      couch_path: this.refs.couch_path.input.value,
      enable_save_pwd: this.refs.enable_save_pwd.state.switched
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
    this.props.handleLogin(this.refs.login.input.value, this.refs.password.input.value);
  };

  render() {

    const handleTextChange = function () {
      this.setState({
        btn_login_disabled: !this.refs.login.input.value || !this.refs.password.input.value,
      });
    }.bind(this);

    return (

      <div className={classes.container}>

        <Paper  zDepth={3} rounded={false} className={classes.paper}  >

          <Tabs
            value={this.state.tab_value}
            onChange={this.tabChange}
          >
            <Tab label="Вход" value="a" >

              {
                this.props.state_user.logged_in ?
                  <div>

                    <TextField
                      className={classes.loginField}
                      hintText="login"
                      floatingLabelText="Имя пользователя"
                      value={this.props.user.presentation}
                      onChange={handleTextChange}
                    />

                    <RaisedButton label="Выйти"
                                className={classes.loginButton}
                                onTouchTap={this.handleLogin}/>

                    <RaisedButton label="Справка"
                                  className={classes.loginButton}
                                  style={{float: 'right'}} />
                  </div>
                  :
                  <div>

                    <TextField
                      ref="login"
                      className={classes.loginField}
                      hintText="login"
                      floatingLabelText="Имя пользователя"
                      defaultValue={this.props.login}
                      onChange={handleTextChange}
                    />

                    <TextField
                      ref="password"
                      className={classes.loginField}
                      hintText="password"
                      floatingLabelText="Пароль"
                      type="password"
                      defaultValue={this.props.password}
                      onChange={handleTextChange}
                    />

                    <RaisedButton label="Войти"
                                  disabled={this.state.btn_login_disabled}
                                  className={classes.loginButton}
                                  onTouchTap={this.handleLogin}/>

                    <RaisedButton label="Забыли пароль?"
                                  disabled={true}
                                  className={classes.loginButton}/>

                    <RaisedButton label="Справка"
                                  className={classes.loginButton}
                                  style={{float: 'right'}} />
                  </div>

              }




            </Tab>

            <Tab label="Подключение" value="b">

              <TextField
                ref="zone"
                floatingLabelText="Область данных"
                hintText="zone"
                className={classes.loginField}
                defaultValue={this.props.zone}
              />

              <TextField
                ref="couch_path"
                floatingLabelText="Адрес CouchDB"
                hintText="couch_path"
                className={classes.loginField}
                defaultValue={this.props.couch_path}
              />

              <Toggle
                ref="enable_save_pwd"
                label="Разрешить сохранение пароля"
                className={classes.loginToggle}
                defaultToggled={this.props.enable_save_pwd}
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
