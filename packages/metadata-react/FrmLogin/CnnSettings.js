import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FormGroup, FormHelperText, FormControl, FormControlLabel} from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import {DialogActions} from 'material-ui/Dialog';

import Confirm from '../Confirm';

class CnnSettings extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    couch_path: PropTypes.string.isRequired,
    couch_suffix: PropTypes.string,
    couch_direct: PropTypes.bool,
    enable_save_pwd: PropTypes.bool,
    handleSetPrm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct} = props;
    this.state = {zone, couch_path, couch_suffix, enable_save_pwd, couch_direct, confirm_reset: false};
  }

  handleSetPrm = () => {
    const {handleSetPrm, handleIfaceState} = this.props;
    handleSetPrm && handleSetPrm(this.state);
    handleIfaceState && handleIfaceState({component: '', name: 'snack',
      value: {open: true, reset: true, message: 'Требуется перезагрузить страницу после изменения параматров'}});
  };

  openConfirm = () => this.setState({confirm_reset: true});

  closeConfirm = () => this.setState({confirm_reset: false});

  resetData = () => {
    this.closeConfirm();
    $p.eve && ($p.eve.redirect = true);
    $p.adapters.pouch.reset_local_data();
  };

  valueToState(name) {
    return ({target}) => {
      const value = ['...'].indexOf(name) != -1 ? (parseFloat(target.value) || 0) : target.value;
      this.setState({[name]: value});
    };
  }

  render() {

    const {classes} = this.props;
    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct, confirm_reset} = this.state;

    return (
      <div>

        <TextField
          fullWidth
          margin="dense"
          label="Адрес CouchDB"
          InputProps={{placeholder: 'couch_path'}}
          helperText="Абсолютный либо относительный путь CouchDB"
          onChange={this.valueToState('couch_path')}
          value={couch_path}/>

        <TextField
          fullWidth
          margin="dense"
          label="Область данных"
          InputProps={{placeholder: 'zone'}}
          helperText="Значение разделителя данных"
          onChange={this.valueToState('zone')}
          value={zone}/>

        <TextField
          fullWidth
          margin="dense"
          label="Суффикс пользователя"
          InputProps={{placeholder: 'couch_suffix'}}
          helperText="Назначается дилеру при регистрации"
          onChange={this.valueToState('couch_suffix')}
          value={couch_suffix}/>

        <FormGroup>
          <FormControl>
            <FormControlLabel
              control={<Switch
                onChange={(event, checked) => this.setState({couch_direct: checked})}
                checked={couch_direct}/>}
              label="Прямое подключение без кеширования"
            />
            <FormHelperText style={{marginTop: -4}}>Отключает режим оффлайн</FormHelperText>
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={<Switch
                onChange={(event, checked) => this.setState({enable_save_pwd: checked})}
                checked={enable_save_pwd}/>}
              label="Разрешить сохранение пароля"
            />
            <FormHelperText style={{marginTop: -4}}>Не требовать повторного ввода пароля</FormHelperText>
          </FormControl>
        </FormGroup>

        <DialogActions style={{marginBottom: 0, marginRight: 0}}>
          <Button dense className={classes.button} onClick={this.handleSetPrm}>Сохранить настройки</Button>
          <Button dense className={classes.button} onClick={this.openConfirm}>Сбросить данные</Button>
        </DialogActions>

        <Confirm
          title="Сброс данных"
          text="Уничтожить локальные данные и пересоздать базы в IndexedDB браузера?"
          handleOk={this.resetData}
          handleCancel={this.closeConfirm}
          open={confirm_reset}
        />

      </div>
    );
  }
}

export default CnnSettings;
