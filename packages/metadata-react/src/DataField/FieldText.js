/**
 * ### Поле ввода текстовых данных
 *
 * @module FieldText
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import AbstractField from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';

class FieldText extends AbstractField {

  render() {
    const {props, _meta, isTabular, onChange} = this;
    const {_obj, _fld, classes, read_only, InputProps, bar, ...other} = props;
    const attr = {
      disabled: read_only,
      title: _meta.tooltip || _meta.synonym,
      value: _obj[_fld],
      onChange,
    }
    if(_meta.mandatory) {
      attr.required = true;
      if(!attr.value) {
        other.inputProps = Object.assign(other.inputProps || {}, {className: classes.required});
      }
    }

    return isTabular ?
      <input type="text" {...attr}/>
      :
      <TextField
        className={cn(classes.formControl, bar && classes.barInput)}
        label={_meta.synonym}
        InputProps={InputProps}
        {...attr}
        {...other}
      />;
  }
}

export default withStyles(FieldText);
