/**
 * ### Поле ввода даты
 *
 * @module FieldDateRange
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import StyledCustomField from './StyledCustomField';
import AbstractField from './AbstractField';

import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import ruRU from 'rc-calendar/lib/locale/ru_RU';
import 'rc-calendar/assets/index.css';
import './rc-calendar.css';


const formatStr = 'DD.MM.YYYY';
function format(v) {
  return v ? v.format(formatStr) : '';
}

export function isValidRange(v) {
  return v && v[0] && v[1];
}

export function formatRange(v) {
  return isValidRange(v) && `${format(v[0])} - ${format(v[1])}` || ''
}

export default class FieldDateRange extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;

    this.state = {
      value: [moment(_obj[`${_fld}_from`]),moment(_obj[`${_fld}_till`])],
      hoverValue: [moment(_obj[`${_fld}_from`]),moment(_obj[`${_fld}_till`])],
    };
  }

  handleHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
  };

  handleChange = (value) => {
    if(value){
      const {props, _meta} = this;
      const {_obj, _fld, handleValueChange} = props;
      if(isValidRange(value)){
        _obj[`${_fld}_from`] = value[0].toDate();
        _obj[`${_fld}_till`] = value[1].toDate();
      }
      this.setState({ value });
      handleValueChange && handleValueChange(value);
    }
  };



  render() {

    const {props, state, _meta, isTabular, handleChange, handleChangeRaw} = this;
    const {_fld, classes, fullWidth} = props;

    //locale={cn ? zhCN : enUS}
    //disabledTime={disabledTime}
    //timePicker={timePickerElement}

    const calendar = (
      <RangeCalendar
        hoverValue={state.hoverValue}
        defaultValue={state.value}
        onHoverChange={this.handleHoverChange}
        showOk
        locale={ruRU}
        dateInputPlaceholder={['Начало', 'Конец']}
      />
    );

    return (
      <Picker
        value={state.value}
        onChange={this.handleChange}
        animation="slide-up"
        calendar={calendar}
      >
        {
          ({ value }) => {
            return (isTabular ?
              <input
                disabled={props.read_only}
                readOnly
                value={formatRange(value)}
              />
            :
              <StyledCustomField
                placeholder={_meta.tooltip || _meta.synonym}
                disabled={props.read_only}
                readOnly
                value={formatRange(value)}
                _fld={_fld}
                _meta={_meta}
                classes={classes}
                fullWidth={fullWidth}
              />);
          }
        }
      </Picker>);

  }

}
