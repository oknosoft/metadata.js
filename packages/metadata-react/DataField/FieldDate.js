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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formater = new global.Intl.DateTimeFormat();

export default class FieldDate extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const {_obj, _fld, _meta} = props;

    this.state = {
      controlledDate: moment(_obj[_fld]),
    };
  }

  handleChange = (newValue) => {

    const {_obj, _fld, _meta, handleValueChange} = this.props;

    this.setState({
      controlledDate: moment(_obj[_fld] = newValue),
    });

    if(handleValueChange) {
      handleValueChange(_obj[_fld]);
    }

  };


  render() {

    const {props, state, handleChange} = this;
    const {tooltip, synonym} = props._meta;
    //const {_obj, _fld, _meta} = props;

    // return <TextField
    //   name={props._fld}
    //   type="date"
    //   title={tooltip || synonym}
    //   value={state.controlledDate}
    //   onChange={handleChange}
    // />;

    return <DatePicker
      todayButton={"Сегодня"}
      locale="ru-RU"
      selected={state.controlledDate}
      onChange={handleChange}
    />
  }

}
