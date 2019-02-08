/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import ruRU from 'rc-calendar/lib/locale/ru_RU';
import 'rc-time-picker/assets/index.css';

import StyledCustomField from './StyledCustomField';
import AbstractField from './AbstractField';

const format = 'DD.MM.YYYY HH:mm:ss';

function getFormat(time) {
  return time ? format : 'DD.MM.YYYY';
}

export default class FieldDate extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;

    this.state = {
      showTime: true,
      showDateInput: true,
      value: moment(_obj[_fld]),
      defaultCalendarValue: moment(_obj[_fld]),
    };
  }

  handleChange = (value) => {
    if(value){
      const {props, _meta} = this;
      const {_obj, _fld, handleValueChange} = props;
      _obj[_fld] = value.toDate();
      this.setState({value});
      handleValueChange && handleValueChange(_obj[_fld]);
    }
  };

  get timePickerElement() {
    if(!FieldDate.timePickerElement) {
      FieldDate.timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;
    }
    return FieldDate.timePickerElement;
  }

  render() {

    const {props, state, _meta, isTabular, handleChange} = this;
    const {_fld, classes, fullWidth} = props;

    const calendar = (<Calendar
      locale={ruRU}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder={_meta.tooltip || _meta.synonym}
      formatter={getFormat(state.showTime)}
      timePicker={state.showTime ? this.timePickerElement : null}
      defaultValue={state.defaultCalendarValue}
      showDateInput={state.showDateInput}
    />);

    return (<DatePicker
      animation="slide-up"
      disabled={props.read_only}
      calendar={calendar}
      value={state.value}
      onChange={this.handleChange}
    >
      {
        ({ value }) => {

          return (isTabular ?
            <input
              type="date"
              readOnly={props.read_only}
              value={value && value.format(getFormat(state.showTime)) || ''}
            />
            :
            <StyledCustomField
              placeholder={_meta.tooltip || _meta.synonym}
              disabled={props.read_only}
              readOnly
              value={value && value.format(getFormat(state.showTime)) || ''}
              _fld={_fld}
              _meta={_meta}
              classes={classes}
              fullWidth={fullWidth}
            />);

        }
      }
    </DatePicker>);

  }

}
