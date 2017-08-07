import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import Divider from 'material-ui/Divider';
import {FormControlLabel} from 'material-ui/Form';

import Confirm from '../Confirm';

class CnnSettings extends Component {

  constructor(props) {
    super(props);
    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct} = props;
    this.state = {zone, couch_path, couch_suffix, enable_save_pwd, couch_direct, confirm_reset: false};
  }

  handleSetPrm = () => this.props.handleSetPrm(this.state);

  openConfirm = () => this.setState({confirm_reset: true});

  closeConfirm = () => this.setState({confirm_reset: false});

  resetData = () => {
    this.closeConfirm();
    $p.eve && ($p.eve.redirect = true);
    $p.adapters.pouch.reset_local_data();
  };

  valueToState(name) {
    return (event) => this.setState({[name]: event.target.value});
  }

  render() {

    const {classes} = this.props;
    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct, confirm_reset} = this.state;

    return (
      <div>

        <Confirm
          title="Сброс данных"
          text="Уничтожить локальные данные и пересоздать базы в IndexedDB браузера?"
          handleOk={this.resetData}
          handleCancel={this.closeConfirm}
          open={confirm_reset}
        />

        <TextField
          className={classes.textField}
          label="Адрес CouchDB"
          InputProps={{ placeholder: 'couch_path' }}
          helperText="Абсолютный либо относительный путь CouchDB"
          fullWidth={true}
          onChange={this.valueToState('couch_path')}
          value={couch_path}/>

        <TextField
          className={classes.textField}
          label="Область данных"
          InputProps={{ placeholder: 'zone' }}
          helperText="Значение разделителя данных"
          fullWidth={true}
          onChange={this.valueToState('zone')}
          value={zone}/>

        <TextField
          className={classes.textField}
          label="Суффикс пользователя"
          InputProps={{ placeholder: 'couch_suffix' }}
          helperText="Назначается дилеру при регистрации"
          fullWidth={true}
          onChange={this.valueToState('couch_suffix')}
          value={couch_suffix}/>

        <FormControlLabel
          control={
            <Switch
              onChange={(event, checked) => this.setState({couch_direct: checked})}
              checked={couch_direct}/>
          }
          label="Прямое подключение без кеширования"
        />

        <FormControlLabel
          control={
            <Switch
              onChange={(event, checked) => this.setState({enable_save_pwd: checked})}
              checked={enable_save_pwd}/>
          }
          label="Разрешить сохранение пароля"
        />

        <Divider/>

        <Button raised className={classes.button} onClick={this.handleSetPrm}>Сохранить настройки</Button>
        <Button raised className={classes.button} onClick={this.openConfirm}>Сбросить данные</Button>

      </div>
    );
  }
}

CnnSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  zone: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  couch_path: PropTypes.string.isRequired,
  couch_suffix: PropTypes.string,
  couch_direct: PropTypes.bool,
  enable_save_pwd: PropTypes.bool,
  handleSetPrm: PropTypes.func.isRequired,
};

export default CnnSettings;
