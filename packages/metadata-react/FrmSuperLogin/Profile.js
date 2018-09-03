import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import DialogActions from '@material-ui/core/DialogActions';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import DataField from '../DataField';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {blue, red} from '@material-ui/core/colors';
import {FacebookIcon, GitHubIcon, GoogleIcon, YandexIcon} from './assets/icons';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Avatar from '@material-ui/core/Avatar';

import withStyles from '../styles/paper600';
import connect from './connect';
import classnames from 'classnames';

import YAML from 'yamljs';

class UserObj extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      profile: {}
    };
    const {profile} = $p.superlogin.getSession();
    if(profile && props._obj && props._obj.subscription !== !!profile.subscription) {
      props._obj._obj.subscription = !!profile.subscription;
    }
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
    this.fetchProfile();
  }

  // получает профиль из суперлогина
  fetchProfile() {
    $p.superlogin._http.get('/user/profile')
      .then(({data}) => {
        for(const provider of ['google', 'facebook', 'github']) {
          if(data[provider]) {
            data[provider] = YAML.parse(data[provider]);
          }
        }
        this.setState({profile: data});
      })
  }

  profileInfo(provider, classes) {
    const info = this.state.profile[provider];
    if(!info) {
      return <Typography className={classes.spaceOuter}>{`Связь с провайдером '${provider}' не установлена`}</Typography>;
    }
    if(provider === 'github') {
      return <div className={classes.spaceOuter}>
        <div className={classes.row}>
          <Avatar alt={info.name} src={info.avatar_url} className={classes.avatar} />
          <Typography>{info.name}</Typography>
        </div>
        <a href={info.html_url} target="_blank" rel="noopener noreferrer">{info.html_url}</a>
        </div>;
    }
    return <Typography>{`Связь с провайдером '${provider}' установлена`}</Typography>;
  }

  profileButton(provider, classes) {
    const info = this.state.profile[provider];
    return <ExpansionPanelActions>
      {!info &&
      <Button size="small" onClick={this.oauthClick(provider)}>
        <LinkIcon className={classes.marginRight}/>Установить связь
      </Button>
      }
      {info &&
      <Button size="small" onClick={this.oauthClick(provider)}>
        <LinkOffIcon className={classes.marginRight}/>Разорвать связь
      </Button>
      }
    </ExpansionPanelActions>
  }



  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title}, {index}) {
    const ltitle = index ? 'Профиль...' : 'Социальные сети...';
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

    const {props: {classes, handleLogOut, title, _obj}, state: {profile, index}, handleNavigate} = this;
    const btn = classnames(classes.button, classes.fullWidth);

    return _obj ?

      <Paper className={classes.root} elevation={4}>

        <Tabs value={index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Пользователь"/>
          <Tab label="Социальные сети"/>
        </Tabs>

        {index === 0 &&
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

        {index === 1 &&
        <FormGroup>
          <Typography
            variant="subheading"
            color="inherit"
            className={classes.button}>
            Можно связать учетную запись с профилем социальных сетей
          </Typography>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <GitHubIcon viewBox="0 0 256 250" className={classes.marginRight} style={{height: 18, fill: 'darkslategrey'}}/>
              <Typography>GitHub</Typography>
            </ExpansionPanelSummary>
            {this.profileInfo('github', classes)}
            <Divider />
            {this.profileButton('github', classes)}
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <GoogleIcon viewBox="0 0 256 262" className={classes.marginRight} style={{height: 18, fill: blue[500]}}/>
              <Typography>Google+</Typography>
            </ExpansionPanelSummary>
            {this.profileInfo('google', classes)}
            <Divider />
            {this.profileButton('google', classes)}
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <FacebookIcon viewBox="0 0 450 450" className={classes.marginRight} style={{height: 18, fill: '#3A559F'}}/>
              <Typography>Facebook</Typography>
            </ExpansionPanelSummary>
            {this.profileInfo('facebook', classes)}
            <Divider />
            {this.profileButton('facebook', classes)}
          </ExpansionPanel>

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
