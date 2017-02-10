/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React, {Component, PropTypes} from "react";
import DatePicker from 'material-ui/DatePicker';

const DateTimeFormat = global.Intl.DateTimeFormat;


export default class FieldDate extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func
  }

  constructor(props) {

    super(props);

    const {_obj, _fld} = this.props;

    this.state = {
      controlledDate: _obj[_fld],
    };
  }

  handleChange = (event, newValue) => {

    this.setState({
      controlledDate: newValue,
    });

    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = newValue
    if(handleValueChange){
      handleValueChange(newValue)
    }

  };


  render() {

    const {props, state, handleChange} = this;
    const {_obj, _fld, _meta} = props;

    return <DatePicker
      name={_fld}
      hintText="_meta.tooltip || _meta.synonym"
      value={state.controlledDate}
      onChange={handleChange}
      DateTimeFormat={DateTimeFormat}
      autoOk
      mode="landscape"
      cancelLabel="Отмена"
      locale="ru-RU"
    />
  }

}
