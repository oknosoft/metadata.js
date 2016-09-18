import React, { Component, PropTypes } from 'react';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import classes from './FrmLogin.scss';

export default class FrmLogin extends Component {

  static propTypes = {
    login: PropTypes.string,
    password: PropTypes.string,
    handleLogin: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      login: this.props.login,
      password: this.props.password
    };
  }

  handleChange(event){
    if(event.target.type == "password"){
      this.setState({
        password: event.target.value,
      });
    }else{
      this.setState({
        login: event.target.value,
      });
    }
  }

  handleLogin = (event) => {
    this.props.handleLogin(this.state.login, this.state.password);
  };

  render() {
    return (

      <div className={classes.loginPaper}>

        <Paper  zDepth={3} rounded={false} >

          <TextField
            className={classes.loginField}
            hintText="login"
            floatingLabelText="Имя пользователя"
            defaultValue={this.state.login}
            onChange={::this.handleChange}
          /><br />

          <TextField
            className={classes.loginField}
            hintText="password"
            floatingLabelText="Пароль"
            type="password"
            defaultValue={this.state.password}
            onChange={::this.handleChange}
          /><br />

          <RaisedButton label="Войти"
                        disabled={!this.state.login || !this.state.password} className={classes.loginButton}
                        onTouchTap={this.handleLogin}
          />
          <RaisedButton label="Справка" className={classes.loginButton} style={{float: 'right'}}/>

        </Paper>

      </div>

    );
  }
}
