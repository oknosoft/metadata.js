import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import DataField from '../DataField';
import Subheader from 'material-ui/Subheader';
import {blue500, red500} from 'material-ui/styles/colors';
import {YandexIcon, GoogleIcon, FacebookIcon, VkontakteIcon} from './assets/icons';

import CircularProgress from "material-ui/CircularProgress";

import classes from "./FrmSuperLogin.scss";

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: '8px'
  },
  block: {
    //flex: '1 100%',
    fontWeight: 'bold'
  }
}

export default class UserObj extends Component {

  static contextTypes = {
    screen: React.PropTypes.object.isRequired
  }

  static propTypes = {

    _obj: PropTypes.object,
    _acl: PropTypes.string.isRequired,

    handleSave: PropTypes.func.isRequired,
    handleRevert: PropTypes.func.isRequired,
    handleMarkDeleted: PropTypes.func.isRequired,
    handlePost: PropTypes.func.isRequired,
    handleUnPost: PropTypes.func.isRequired,
    handlePrint: PropTypes.func.isRequired,
    handleAttachment: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddRow: PropTypes.func.isRequired,
    handleDelRow: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      tab_value: 'a',
      btn_login_disabled: !this.props.login || !this.props.password
    };
  }

  tabChange = (tab_value) => {
    if (tab_value === 'a' || tab_value === 'b') {
      this.setState({
        tab_value: tab_value,
      });
    }
  };

  handleLogOut = () => {
    this.props.handleLogOut()
  }

  handleSave() {

  }

  handleSend() {

  }

  handleMarkDeleted() {

  }

  handlePrint() {

  }

  handleAttachment() {

  }


  render() {

    const {screen} = this.context
    const {_obj} = this.props


    return (


      <div className={classes.paper}>

        {
          _obj

            ?
            <Paper zDepth={3} rounded={false}>

              <Tabs
                value={this.state.tab_value}
                onChange={this.tabChange}
              >
                <Tab label="Физлицо" value="a">

                  <div className={classes.padding18}>

                    <DataField _obj={_obj} _fld="id"/>
                    <DataField _obj={_obj} _fld="name"/>
                    <DataField _obj={_obj} _fld="sex"/>
                    <DataField _obj={_obj} _fld="birth_date"/>
                    <DataField _obj={_obj} _fld="birth_place"/>
                    <DataField _obj={_obj} _fld="category"/>
                    <DataField _obj={_obj} _fld="inn"/>
                    <DataField _obj={_obj} _fld="snils"/>
                    <DataField _obj={_obj} _fld="citizenship"/>
                    <DataField _obj={_obj} _fld="ОсновноеУдостоверение"/>
                    <DataField _obj={_obj} _fld="стрМестоРаботы"/>
                    <DataField _obj={_obj} _fld="стрДолжность"/>
                    <DataField _obj={_obj} _fld="АдресРегистрации"/>
                    <DataField _obj={_obj} _fld="АдресФактический"/>
                    <DataField _obj={_obj} _fld="phone"/>
                    <DataField _obj={_obj} _fld="email"/>
                    <DataField _obj={_obj} _fld="rank"/>

                    <br />
                    <Divider />

                    <RaisedButton label="Сохранить"
                                  className={classes.button}
                                  onTouchTap={this.handleSave}/>

                    <RaisedButton label="Выйти"
                                  className={classes.button}
                                  onTouchTap={this.handleLogOut}/>

                  </div>

                </Tab>

                <Tab label="Социальные сети" value="b">

                  <div className={classes.padding18}>

                    <Subheader>Привязка профилей социальных сетей</Subheader>

                    <RaisedButton
                      label="Google"
                      className={classes.social_button}
                      labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                      icon={<GoogleIcon viewBox="0 0 256 262" style={{width: 18, height: 18}} color={blue500}/>}
                      //onTouchTap={this.buttonTouchTap("google")}
                    /><br />
                    <RaisedButton
                      label="Яндекс"
                      className={classes.social_button}
                      labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                      icon={<YandexIcon viewBox="0 0 180 190" style={{width: 18, height: 18}} color={red500}/>}
                      //onTouchTap={this.buttonTouchTap("yandex")}
                    /><br />
                    <RaisedButton
                      label="Facebook"
                      className={classes.social_button}
                      labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                      icon={<FacebookIcon viewBox="0 0 450 450" style={{width: 18, height: 18}} color="#3A559F"/>}
                      //onTouchTap={this.buttonTouchTap("facebook")}
                    /><br />
                    <RaisedButton
                      label="В контакте"
                      className={classes.social_button}
                      labelStyle={{width: 120, textAlign: 'left', display: 'inline-block'}}
                      icon={<VkontakteIcon viewBox="50 50 400 400" style={{width: 18, height: 18}} color="#4c75a3"/>}
                      //onTouchTap={this.buttonTouchTap("vkontakte")}
                    />

                  </div>

                </Tab>

              </Tabs>

            </Paper>

            :
            <div >
              <CircularProgress size={120} thickness={5} className={classes.progress}/>
            </div>
        }

      </div>

    );
  }
}
