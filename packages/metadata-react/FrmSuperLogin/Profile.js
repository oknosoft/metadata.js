import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs, {Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import {FormGroup} from 'material-ui/Form';
import {DialogActions} from 'material-ui/Dialog';
import Helmet from 'react-helmet';
import Grid from 'material-ui/Grid';
import DataField from '../DataField';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import {blue, red} from 'material-ui/colors';
import {FacebookIcon, GitHubIcon, GoogleIcon, YandexIcon} from './assets/icons';

import withStyles from '../styles/paper600';
import connect from './connect';
import classnames from 'classnames';

class UserObj extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    const {profile} = $p.superlogin.getSession();
    if(profile && props._obj && props._obj.subscription !== !!profile.subscription) {
      props._obj._obj.subscription = !!profile.subscription;
    }
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title}, {index}) {
    const ltitle = index ? 'Регистрация...' : 'Авторизация...';
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  oauthClick(provider) {
    return this.props.handleSocialAuth(provider);
  }



  render() {

    const {props: {classes, handleLogOut, title, _obj}, state, handleNavigate} = this;
    const btn = classnames(classes.button, classes.fullWidth);

    return _obj ?

      <Paper className={classes.root} elevation={4}>

        <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Пользователь"/>
          <Tab label="Социальные сети"/>
        </Tabs>

        {state.index === 0 &&
        <FormGroup>
          <DataField _obj={_obj} _fld="id" read_only/>
          <DataField _obj={_obj} _fld="name" label="ФИО пользователя" read_only/>
          <DataField _obj={_obj} _fld="email_addr" read_only/>
          <DataField _obj={_obj} _fld="subscription"/>
          <DialogActions>
            <Button color="primary" size="small" className={classes.button} onClick={handleLogOut}>Выйти</Button>
          </DialogActions>
        </FormGroup>
        }

        {state.index === 1 &&
        <FormGroup>

          <FormGroup>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={7}>
                <Typography variant="subheading" color="inherit">Вы можете связать свою учетную запись с профилем социальных сетей</Typography>
              </Grid>
              <Grid item xs={10} sm={5}>
                <Button variant="raised" size="small" className={btn} onClick={this.oauthClick('github')}>
                  <GitHubIcon viewBox="0 0 256 250" style={{height: 18, fill: 'darkslategrey'}}/> GitHub
                </Button>
                <Button variant="raised" size="small" className={btn} onClick={this.oauthClick('google')}>
                  <GoogleIcon viewBox="0 0 256 262" style={{height: 18, fill: blue[500]}}/> Google
                </Button>
                <Button variant="raised" size="small" className={btn} onClick={this.oauthClick('facebook')}>
                  <FacebookIcon viewBox="0 0 450 450" style={{height: 18, fill: '#3A559F'}}/> Facebook
                </Button>
              </Grid>
            </Grid>
          </FormGroup>

          <DialogActions>
            <Button color="primary" size="small" className={classes.button} onClick={handleLogOut}>Выйти</Button>
          </DialogActions>

        </FormGroup>
        }

      </Paper>

      :
      <div>
        Нет данных
      </div>;
  }
}

UserObj.propTypes = {
  _obj: PropTypes.object,
  _acl: PropTypes.string.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  first_run: PropTypes.bool.isRequired,
};

export default withStyles(connect(UserObj));
