import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tabs, {Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import DataField from '../DataField';
import Typography from 'material-ui/Typography';
import {FacebookIcon, GitHubIcon, GoogleIcon, YandexIcon} from './assets/icons';

import {FormGroup} from 'material-ui/Form';
import {DialogActions} from 'material-ui/Dialog';

import {red, blue} from 'material-ui/colors';

import withStyles from '../styles/paper600';
import classnames from 'classnames';

class UserObj extends Component {

  static propTypes = {

    _obj: PropTypes.object,
    _acl: PropTypes.string.isRequired,

    handleSave: PropTypes.func,
    handleRevert: PropTypes.func,
    handleMarkDeleted: PropTypes.func,
    handlePost: PropTypes.func,
    handleUnPost: PropTypes.func,
    handlePrint: PropTypes.func,
    handleAttachment: PropTypes.func,
    handleValueChange: PropTypes.func,
    handleAddRow: PropTypes.func,
    handleDelRow: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      login: props.user_name,
    };
  }

  oauthClick(provider) {
    return () => $p.superlogin._actions.handleSocialAuth(provider);
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

    const {props, state} = this;
    const {classes, handleLogOut, _obj} = props;
    const btn = classnames(classes.button, classes.fullWidth);

    return _obj ?

      <Paper className={classes.root} elevation={4}>

        <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Пользователь"/>
          <Tab label="Социальные сети"/>
        </Tabs>

        {state.index === 0 &&
        <div>
          <DataField _obj={_obj} _fld="id"/>
          <DataField _obj={_obj} _fld="name"/>
          <DataField _obj={_obj} _fld="sex"/>
          <DataField _obj={_obj} _fld="email"/>
          <DialogActions>
            <Button color="primary" dense className={classes.button} onClick={this.handleSave}>Сохранить</Button>
            <Button color="primary" dense className={classes.button} onClick={handleLogOut}>Выйти</Button>
          </DialogActions>
        </div>
        }

        {state.index === 1 &&
        <div>

          <FormGroup>
            <Typography type="subheading" color="inherit">Вы можете авторизоваться либо связать свою учетную запись с учетными данными социальных сетей:</Typography>

            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <Button raised dense className={btn} onClick={this.oauthClick('google')}>
                  <GoogleIcon viewBox="0 0 256 262" style={{height: 18}} color={blue[500]}/> Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button raised dense className={btn} onClick={this.oauthClick('yandex')}>
                  <YandexIcon viewBox="0 0 180 190" style={{height: 18}} color={red[500]}/> Яндекс
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button raised dense className={btn} onClick={this.oauthClick('facebook')}>
                  <FacebookIcon viewBox="0 0 450 450" style={{height: 18}} color="#3A559F"/> Facebook
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button raised dense className={btn} onClick={this.oauthClick('github')}>
                  <GitHubIcon viewBox="0 0 256 250" style={{height: 18}}/> GitHub
                </Button>
              </Grid>
            </Grid>
          </FormGroup>

          <DialogActions>
            <Button color="primary" dense className={classes.button} onClick={handleLogOut}>Выйти</Button>
          </DialogActions>

        </div>
        }

      </Paper>

      :
      <div>
        Нет данных
      </div>;
  }
}

export default withStyles(UserObj);
