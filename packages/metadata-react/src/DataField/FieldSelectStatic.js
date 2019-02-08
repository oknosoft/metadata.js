/**
 * ### Поле ввода на базе material-ui-select
 *
 * @module FieldSelectStatic
 *
 */

import React from 'react';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import AbstractField from './AbstractField';
import withStyles from './styles';

class FieldSelectStatic extends AbstractField {

  render() {

    const {props: {_obj, _fld, options, classes}, _meta, isTabular, onChange} = this;

    return <FormControl className={classes.formControl}>
        <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>
        <Select
          native
          value={_obj[_fld].valueOf()}
          onChange={onChange}
          input={<Input/>}
        >
          {options.map((v, key) => <option key={key} value={v.valueOf()}>{v.toString()}</option>)}
        </Select>
      </FormControl>;
  }
}

export default withStyles(FieldSelectStatic);

export class ActivityOption {

  constructor(target) {
    this.target = target;
  }

  toString() {
    return this.target.text;
  }

  valueOf() {
    return this.target.value;
  }
}
