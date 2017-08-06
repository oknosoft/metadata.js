/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const DateTimeFormat = global.Intl.DateTimeFormat;

export default class FieldDate extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func,
  };

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
    _obj[_fld] = newValue;
    if(handleValueChange) {
      handleValueChange(newValue);
    }

  };


  render() {

    const {props, state, handleChange} = this;
    const {tooltip, synonym} = props._meta;
    //const {_obj, _fld, _meta} = props;

    return <TextField
      name={props._fld}
      type="date"
      hintText={tooltip || synonym}
      value={state.controlledDate}
      onChange={handleChange}
      DateTimeFormat={DateTimeFormat}
      locale="ru-RU"
    />;
  }

}
