import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import {blue500, red500} from 'material-ui/styles/colors';
import {YandexIcon, GoogleIcon, GitHubIcon} from './assets/icons';

// https://github.com/micky2be/superlogin-client
import superlogin from './client'


const tab_styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  },
};

const paper_style = {
  minWidth: 280,
  margin: 'auto',
  maxWidth: 800
};

const field_style = {
  marginLeft: 18,
  width: '90%'
};

const button_style = {
  margin: '18px 0 18px 18px'
};

export default class TabsLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
    };
  }

  tabChange = (value) => {
    if(value === 'a' || value === 'b'){
      this.setState({
        value: value,
      });
    }
  };

  buttonTouchTap(provider){
    return function () {
      superlogin.socialAuth(provider);
    }
  }


  render() {
    return (

      <div style={paper_style}>

        <Paper  zDepth={3} rounded={false}>

          <Tabs
            value={this.state.value}
            onChange={this.tabChange}
          >
            <Tab label="Вход" value="a" >
              <TextField
                style={field_style}
                hintText="login"
                floatingLabelText="Имя пользователя"
              /><br />
              <TextField
                style={field_style}
                hintText="password"
                floatingLabelText="Пароль"
                type="password"
              /><br />
              <RaisedButton label="Забыли пароль?" style={button_style} /><RaisedButton label="Войти" disabled={true} style={button_style}/>

            </Tab>

            <Tab label="Регистрация" value="b">
              <TextField
                style={field_style}
                hintText="name"
                floatingLabelText="Полное имя"
              /><br />
              <TextField
                style={field_style}
                hintText="login"
                floatingLabelText="Имя пользователя"
              /><br />
              <TextField
                style={field_style}
                hintText="email"
                floatingLabelText="Электронная почта"
              /><br />
              <TextField
                style={field_style}
                hintText="password"
                floatingLabelText="Пароль"
                type="password"
              /><br />
              <TextField
                style={field_style}
                hintText="confirm_password"
                floatingLabelText="Подтвердить пароль"
                type="password"
              /><br />
            </Tab>
          </Tabs>

          <Divider />
          <Subheader>Вход / регистрация с помощью:</Subheader>
          <RaisedButton
            label="Yandex"
            style={button_style}
            icon={<YandexIcon viewBox="0 0 180 190" style={{width: 18, height: 18}} color={red500} />}
            onTouchTap={this.buttonTouchTap("yandex")}
          />
          <RaisedButton
            label="Google"
            style={button_style}
            icon={<GoogleIcon viewBox="0 0 256 262" style={{width: 18, height: 18}} color={blue500}/>}
            onTouchTap={this.buttonTouchTap("google")}
          />
          <RaisedButton
            label="GitHub"
            //href="https://github.com/callemall/material-ui"
            //secondary={true}
            style={button_style}
            icon={<GitHubIcon viewBox="0 0 256 250" style={{width: 18, height: 18}} />}
            onTouchTap={this.buttonTouchTap("github")}
          />

        </Paper>

      </div>

    );
  }
}
