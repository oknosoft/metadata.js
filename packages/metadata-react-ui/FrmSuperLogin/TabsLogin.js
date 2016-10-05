import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import {blue500, red500} from 'material-ui/styles/colors';
import {YandexIcon, GoogleIcon, FacebookIcon, VkontakteIcon} from './assets/icons';


import classes from "./FrmSuperLogin.scss";

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

  handleTextChange = () => {
    this.setState({
      btn_login_disabled: !this.refs.login.input.value || !this.refs.password.input.value
    });
  }

  buttonTouchTap(provider){
    return () => {
      this.props.handleSocialAuth(provider)
    }
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
                  defaultValue={this.props.login}
                  onChange={this.handleTextChange}
                />

                <TextField
                  ref="password"
                  hintText="password"
                  floatingLabelText="Пароль"
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

              <div className={classes.sub_paper} >

                <Subheader className={classes.subheader} >Вход / регистрация с помощью:</Subheader>

                <RaisedButton
                  label="Google"
                  className={classes.social_button}
                  labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                  icon={<GoogleIcon viewBox="0 0 256 262" style={{width: 18, height: 18}} color={blue500}/>}
                  onTouchTap={this.buttonTouchTap("google")}
                /><br />
                <RaisedButton
                  label="Яндекс"
                  className={classes.social_button}
                  labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                  icon={<YandexIcon viewBox="0 0 180 190" style={{width: 18, height: 18}} color={red500} />}
                  onTouchTap={this.buttonTouchTap("yandex")}
                /><br />
                <RaisedButton
                  label="Facebook"
                  className={classes.social_button}
                  labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                  icon={<FacebookIcon viewBox="0 0 450 450" style={{width: 18, height: 18}} color="#3A559F"/>}
                  onTouchTap={this.buttonTouchTap("facebook")}
                /><br />
                <RaisedButton
                  label="В контакте"
                  className={classes.social_button}
                  labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                  icon={<VkontakteIcon viewBox="50 50 400 400" style={{width: 18, height: 18}} color="#4c75a3" />}
                  onTouchTap={this.buttonTouchTap("vkontakte")}
                />

                {/*
                 <RaisedButton
                 label="GitHub"
                 className={classes.social_button}
                 labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                 icon={<GitHubIcon viewBox="0 0 256 250" style={{width: 18, height: 18}}/>}
                 onTouchTap={this.buttonTouchTap("github")}
                 />
                 */}

              </div>

            </Tab>

            <Tab label="Регистрация" value="b">

              <div style={{padding: 18}}>
                <TextField
                  hintText="name"
                  fullWidth={true}
                  floatingLabelText="Полное имя"
                /><br />
                <TextField
                  hintText="login"
                  fullWidth={true}
                  floatingLabelText="Имя пользователя"
                /><br />
                <TextField
                  hintText="email"
                  fullWidth={true}
                  floatingLabelText="Электронная почта"
                /><br />
                <TextField
                  hintText="password"
                  fullWidth={true}
                  floatingLabelText="Пароль"
                  type="password"
                /><br />
                <TextField
                  hintText="confirm_password"
                  fullWidth={true}
                  floatingLabelText="Подтвердить пароль"
                  type="password"
                />

              </div>

            </Tab>

          </Tabs>

        </Paper>

      </div>

    );
  }
}
