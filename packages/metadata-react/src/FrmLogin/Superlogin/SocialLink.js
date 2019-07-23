import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {red, blue} from '@material-ui/core/colors';
import {YandexIcon, GoogleIcon, GitHubIcon, FacebookIcon} from './assets/icons';

import superlogin from './client';

import classes from './FrmSuperLogin.css';


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

        <div >

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
                  variant="password"
                /><br />
                <RaisedButton label="Забыли пароль?" className={classes.button}/>
                <RaisedButton label="Войти" disabled={true} className={classes.button}/>

              </div>

              <div className={classes.sub_paper}>

                <Typography variant="h6" color="inherit" >Вы можете авторизоваться при помощи учетных
                  записей социальных сетей:</Typography>

                <RaisedButton
                  label="Google"
                  className={classes.button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<GoogleIcon viewBox="0 0 256 262" style={{height: 18, fill: blue[500]}}/>}
                  onClick={this.buttonTouchTap("google")}
                /><br />
                <RaisedButton
                  label="Yandex"
                  className={classes.button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<YandexIcon viewBox="0 0 180 190" style={{height: 18, fill: red[500]}}/>}
                  onClick={this.buttonTouchTap("yandex")}
                /><br />
                <RaisedButton
                  label="Facebook"
                  className={classes.button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<FacebookIcon viewBox="0 0 420 420" style={{height: 18, fill: '#3A559F'}}/>}
                  onClick={this.buttonTouchTap("facebook")}
                /><br />
                <RaisedButton
                  label="В контакте"
                  className={classes.button}
                  labelStyle={{width: 110, textAlign: 'left', display: 'inline-block'}}
                  icon={<GitHubIcon viewBox="0 0 256 250" style={{height: 18, fill: 'darkslategrey'}}/>}
                  onClick={this.buttonTouchTap("vkontakte")}
                />
                {/*
                 <RaisedButton
                 label="GitHub"
                 className={classes.button}
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
                  fullWidth
                  margin="dense"
                  floatingLabelText="Полное имя"
                /><br />
                <TextField
                  hintText="login"
                  fullWidth
                  margin="dense"
                  floatingLabelText="Имя пользователя"
                /><br />
                <TextField
                  hintText="email"
                  fullWidth
                  margin="dense"
                  floatingLabelText="Электронная почта"
                /><br />
                <TextField
                  hintText="password"
                  fullWidth
                  margin="dense"
                  floatingLabelText="Пароль"
                  variant="password"
                /><br />
                <TextField
                  hintText="confirm_password"
                  fullWidth
                  margin="dense"
                  floatingLabelText="Подтвердить пароль"
                  variant="password"
                />

              </div>

            </Tab>
          </Tabs>

        </div>

      </div>

    );
  }
}
