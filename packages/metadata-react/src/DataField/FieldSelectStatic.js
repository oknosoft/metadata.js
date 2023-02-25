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
import cn from 'classnames';

class FieldSelectStatic extends AbstractField {

  render() {

    const {props: {_obj, _fld, options, classes, extClasses, fullWidth, label_position, bar, className}, _meta, onChange} = this;
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    };
    const value = _obj[_fld].valueOf();

    return <FormControl
        className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, bar && classes.barInput)}
        classes={extClasses && extClasses.control ? extClasses.control : null}
        fullWidth={fullWidth}
        {...attr}
      >
        {label_position != 'hide' &&
        <InputLabel
          classes={extClasses && extClasses.label ? extClasses.label : null}
        >{_meta.synonym}</InputLabel>}
        <Select
          native
          value={value}
          onChange={onChange}
          input={<Input classes={
            Object.assign({
              input: cn(classes.input, attr.required && !value && classes.required)
            }, extClasses && extClasses.input)
          }/>}
          inputProps={{title: value?.toString()}}
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
