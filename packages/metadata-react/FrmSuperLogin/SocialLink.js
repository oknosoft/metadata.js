import React from "react";
import {Tabs, Tab} from "material-ui/Tabs";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";
import {blue500, red500} from "material-ui/styles/colors";
import {YandexIcon, GoogleIcon, GitHubIcon, FacebookIcon} from "./assets/icons";
import superlogin from "./client";
import classes from "./FrmSuperLogin.scss";

// https://github.com/micky2be/superlogin-client


export default class TabsLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
    };
  }

  tabChange = (value) => {
    if (value === 'a' || value === 'b') {
      this.setState({
        value: value,
      });
    }
  };

  buttonTouchTap(provider) {
    return function () {
      superlogin.socialAuth(provider);
    }
  }


  render() {
    return (

      <div className={classes.paper}>

        <div zDepth={3} rounded={false}>

          <Tabs
            value={this.state.value}
            onChange={this.tabChange}
          >
            <Tab label="Вход" value="a">

              <div className={classes.sub_paper}>

                <TextField
                  hintText="login"
                  floatingLabelText="Имя пользователя"
                /><br />
                <TextField
                  hintText="password"
                  floatingLabelText="Пароль"
                  type="password"
                /><br />
                <RaisedButton label="Забыли пароль?" className={classes.button}/>
                <RaisedButton label="Войти" disabled={true} className={classes.button}/>

              </div>

              <div className={classes.sub_paper}>

                <Subheader className={classes.subheader}>Вы можете авторизоваться при помощи учетных
                  записей социальных сетей:</Subheader>

                <RaisedButton
                  label="Google"
                  className={classes.social_button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<GoogleIcon viewBox="0 0 256 262" style={{width: 18, height: 18}}
                                    color={blue500}/>}
                  onClick={this.buttonTouchTap("google")}
                /><br />
                <RaisedButton
                  label="Yandex"
                  className={classes.social_button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<YandexIcon viewBox="0 0 180 190" style={{width: 18, height: 18}}
                                    color={red500}/>}
                  onClick={this.buttonTouchTap("yandex")}
                /><br />
                <RaisedButton
                  label="Facebook"
                  className={classes.social_button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<FacebookIcon viewBox="0 0 420 420" style={{width: 18, height: 18}}
                                      color={blue500}/>}
                  onClick={this.buttonTouchTap("facebook")}
                /><br />
                <RaisedButton
                  label="В контакте"
                  className={classes.social_button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<GitHubIcon viewBox="0 0 256 250" style={{width: 18, height: 18}}/>}
                  onClick={this.buttonTouchTap("vkontakte")}
                />
                {/*
                 <RaisedButton
                 label="GitHub"
                 className={classes.social_button}
                 labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                 icon={<GitHubIcon viewBox="0 0 256 250" style={{width: 18, height: 18}}/>}
                 onClick={this.buttonTouchTap("github")}
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

        </div>

      </div>

    );
  }
}
