/**
 * ### Поле ввода текстовых данных
 *
 * @module FieldText
 *
 */

import React from 'react';
import AbstractField from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

class FieldText extends AbstractField {

  render() {
    const {props, _meta, onChange, read_only} = this;
    const {_obj, _fld, classes, extClasses, className, fullWidth, InputProps, label_position, bar, isTabular,
      dyn_meta, handleValueChange, ...other} = props;
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    }
    Object.assign(other, {value: _obj[_fld], onChange});
    if(_meta.mandatory) {
      attr.required = true;
      if(!other.value) {
        other.inputProps = Object.assign(other.inputProps || {}, {className: classes.required});
      }
    }
    if(read_only) {
      other.readOnly = true;
    }

    return this.isTabular ?
      <input type="text" {...attr} {...other}/>
      :
      <FormControl
        className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, props.bar && classes.barInput)}
        classes={extClasses && extClasses.control ? extClasses.control : null}
        fullWidth={fullWidth}
        {...attr}
      >
        {label_position != 'hide' &&
        <InputLabel
          classes={extClasses && extClasses.label ? extClasses.label : null}
        >{_meta.synonym}</InputLabel>}
        <Input
          {...other}
          classes={
            Object.assign({
              input: cn(classes.input, attr.required && !other.value && classes.required)
            }, extClasses && extClasses.input)
          }
        />
      </FormControl>;
  }
}

export default withStyles(FieldText);
