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
import DataField from '../DataField';
import CnnSettings from './CnnSettings';
import {withPrm} from 'metadata-redux';
import withStyles from '../styles/paper600';

class TabsUser extends Component {

  constructor(props) {
    super(props);
    this.state = {index: 0};
    this.handleNavigate = this.handleNavigate.bind(this);
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  shouldComponentUpdate({handleIfaceState, title, user}, {index}) {
    const ltitle = index ? 'Параметры подключения' : `Профиль пользователя '${user.name}'`;
    if (title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }



  handleNavigate() {
    const {handleNavigate, first_run} = this.props;
    if (first_run) {
      $p.eve && ($p.eve.redirect = true);
      location.replace('/');
    }
    else {
      handleNavigate('/');
    }
  }

  render() {

    const {props, state, handleNavigate, handlePush} = this;
    const {classes, handleLogOut, _obj} = props;
    const descr = "Свойства пользователя";

    return _obj ?

      <Paper className={classes.root} elevation={4}>

        <Helmet title={props.title}>
          <meta name="description" content={descr} />
          <meta property="og:title" content={props.title} />
          <meta property="og:description" content={descr} />
        </Helmet>

        <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
          <Tab label="Профиль"/>
          <Tab label="Подключение"/>
        </Tabs>

        {state.index === 0 &&
        <FormGroup>
          <DataField _obj={_obj} _fld="id" read_only />
          <DataField _obj={_obj} _fld="name" read_only />
          <DataField _obj={_obj} _fld="branch" read_only fullWidth />
          <DataField _obj={_obj} _fld="suffix" read_only />
          <DataField _obj={_obj} _fld="direct" read_only />
          <DataField _obj={_obj} _fld="push_only" read_only />
        </FormGroup>}

        {state.index === 0 &&
        <DialogActions>
          <Button color="primary" size="small" className={classes.button} onClick={handleLogOut}>Выйти</Button>
          <Button color="primary" size="small" className={classes.button} onClick={handleNavigate} title="Перейти к списку документов">К документам</Button>
          {handlePush && _obj.push_only && <Button color="primary" size="small" className={classes.button}
                                                   onClick={handlePush} title="Прочитать изменения с сервера">Прочитать изменения</Button>}
        </DialogActions>}

        {state.index === 1 && <CnnSettings {...props}/>}

      </Paper>
      :
      <div>
        <Helmet title="Пользователь не найден">
          <meta name="description" content={descr} />
          <meta property="og:title" content="Пользователь не найден" />
          <meta property="og:description" content={descr} />
        </Helmet>
        нет данных
      </div>;
  }
}

TabsUser.propTypes = {
  _obj: PropTypes.object,
  _acl: PropTypes.string.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handlePush: PropTypes.func,
  first_run: PropTypes.bool.isRequired,
};

export default withPrm(withStyles(TabsUser));

