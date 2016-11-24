import React, {Component, PropTypes} from "react";
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// FIXME
// import CnnSettings from './CnnSettings';

export default class TabsLogin extends Component {

  static propTypes = {
    zone: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    couch_path: PropTypes.string.isRequired,
    enable_save_pwd: PropTypes.bool.isRequired,
    handleSetPrm: PropTypes.func.isRequired
  }

  constructor(props) {

    super(props)

    this.state = {
      tab_value: 'a',
      btn_login_disabled: !props.login || !props.password
    }
  }

  tabChange = (tab_value) => {
    if(tab_value === 'a' || tab_value === 'b'){
      this.setState({
        tab_value: tab_value,
      });
    }
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

    const { props } = this;

    return (

      <div className={'meta-paper'}>

        <Paper  zDepth={3} rounded={false}>

          <Tabs
            value={this.state.tab_value}
            onChange={this.tabChange} >

            <Tab label="Вход" value="a" >

              <div className={'meta-padding-18'} >

                <TextField
                  ref="login"
                  hintText="login"
                  floatingLabelText="Имя пользователя"
                  fullWidth={true}
                  defaultValue={props.login}
                  onChange={this.handleTextChange}
                />

                <TextField
                  ref="password"
                  hintText="password"
                  floatingLabelText="Пароль"
                  fullWidth={true}
                  type="password"
                  defaultValue={props.password}
                  onChange={this.handleTextChange}
                />
                <br />

                <RaisedButton label="Войти"
                              disabled={this.state.btn_login_disabled}
                              className={'meta-button-18-0'}
                              onTouchTap={this.handleLogin} />

                <RaisedButton label="Забыли пароль?"
                              disabled={true}
                              className={'meta-button-18-0'} />

              </div>

            </Tab>

            <Tab label="Подключение" value="b">

              {/* <CnnSettings {...props} /> */}

            </Tab>

          </Tabs>

        </Paper>

      </div>

    )
  }
}
