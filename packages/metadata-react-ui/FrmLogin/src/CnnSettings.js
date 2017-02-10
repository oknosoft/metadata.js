import React, {Component, PropTypes} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

export default class CnnSettings extends Component {

  static propTypes = {
    zone: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    couch_path: PropTypes.string.isRequired,
    couch_suffix: PropTypes.string.isRequired,
    couch_direct: PropTypes.bool,
    enable_save_pwd: PropTypes.bool,
    handleSetPrm: PropTypes.func.isRequired
  }

  constructor(props) {

    super(props)

    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct} = props;
    this.state = {zone, couch_path, couch_suffix, enable_save_pwd,  couch_direct};
  }

  handleSetPrm = () => {
    this.props.handleSetPrm(this.state)
  }

  valueToState(name){
    return (event) => this.setState({ [name]: event.target.value })
  }

  render() {

    const {zone, couch_path, enable_save_pwd, couch_suffix, couch_direct} = this.state;

    return (
      <div className={'meta-padding-18'} >

        <TextField
          floatingLabelText="Адрес CouchDB"
          hintText="couch_path"
          fullWidth={true}
          onChange={this.valueToState("couch_path")}
          value={couch_path}/>

        <TextField
          floatingLabelText="Область данных"
          hintText="zone"
          fullWidth={true}
          onChange={this.valueToState("zone")}
          value={zone} />

        <TextField
          floatingLabelText="Суффикс пользователя"
          hintText="couch_suffix"
          fullWidth={true}
          onChange={this.valueToState("couch_suffix")}
          value={couch_suffix} />

        <Toggle
          label="Прямое подключение без кеширования"
          className={'meta-toggle'}
          onToggle={() => this.setState({ couch_direct: !couch_direct })}
          toggled={couch_direct} />

        <Toggle
          label="Разрешить сохранение пароля"
          className={'meta-toggle'}
          onToggle={() => this.setState({ enable_save_pwd: !enable_save_pwd })}
          toggled={enable_save_pwd} />

        <Divider />

        <RaisedButton label="Сохранить настройки"
                      className={'meta-button-18-0'}
                      onTouchTap={this.handleSetPrm} />

      </div>
    )
  }
}