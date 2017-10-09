import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tabs, {Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import {FormGroup} from 'material-ui/Form';
import {DialogActions} from 'material-ui/Dialog';

import DataField from '../DataField';
import CnnSettings from './CnnSettings';
import withPrm from 'metadata-redux/src/withPrm';
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

    const {props, state, handleNavigate} = this;
    const {classes, handleLogOut} = props;

    return (

      <div className={'meta-paper'}>

        {
          this.props._obj
            ?
            <Paper className={classes.root} elevation={4}>

              <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
                <Tab label="Профиль"/>
                <Tab label="Подключение"/>
              </Tabs>

              {state.index === 0 &&
              <FormGroup>
                <DataField _obj={this.props._obj} _fld="id" read_only />
                <DataField _obj={this.props._obj} _fld="name" read_only />
              </FormGroup>}

              {state.index === 0 &&
              <DialogActions>
                <Button color="primary" dense className={classes.button} onClick={handleLogOut}>Выйти</Button>
                <Button color="primary" dense className={classes.button} onClick={handleNavigate}>К списку заказов</Button>
              </DialogActions>}

              {state.index === 1 && <CnnSettings {...props}/>}

            </Paper>

            :
            <div>
              нет данных
            </div>
        }

      </div>

    );
  }
}

TabsUser.propTypes = {
  _obj: PropTypes.object,
  _acl: PropTypes.string.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  first_run: PropTypes.bool.isRequired,
};

export default withPrm(withStyles(TabsUser));

