/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import DatePicker from 'react-datepicker/dist/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {withStyles} from 'material-ui/styles';

import AbstractField from './AbstractField';

const formater = new global.Intl.DateTimeFormat();

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 280
  },
});

class FieldDate extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;

    this.state = {
      controlledDate: moment(_obj[_fld]),
    };
  }

  handleChange = (newValue) => {

    const {props, _meta} = this;
    const {_obj, _fld, handleValueChange} = props;

    this.setState({
      controlledDate: moment(_obj[_fld] = newValue),
    });

    if(handleValueChange) {
      handleValueChange(_obj[_fld]);
    }

  };


  render() {

    const {props, state, _meta, handleChange} = this;
    const {_fld, classes} = props;

    // return <TextField
    //   name={props._fld}
    //   type="date"
    //   title={tooltip || synonym}
    //   value={state.controlledDate}
    //   onChange={handleChange}
    // />;

    // popperPlacement="bottom-end"
    // popperModifiers={{
    //   offset: {
    //     enabled: true,
    //       offset: '5px, 10px'
    //   },
    //   preventOverflow: {
    //     enabled: true,
    //       escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
    //       boundariesElement: 'viewport'
    //   }
    // }}
    // showYearDropdown

    return <FormControl className={classes.formControl}>
      <InputLabel htmlFor={`fdate${_fld}`}>{_meta.synonym}</InputLabel>
      <DatePicker
        customInput={<Input id={`fdate${_fld}`} value={state.controlledDate.format('DD.MM.YYYY')}/>}
        todayButton={'Сегодня'}
        locale="ru-RU"
        disabledKeyboardNavigation
        placeholderText={_meta.tooltip || _meta.synonym}
        selected={state.controlledDate}
        onChange={handleChange}
      />
    </FormControl>;
  }

}

export default withStyles(styles)(FieldDate);
