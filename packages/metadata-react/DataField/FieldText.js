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

    return isTabular ?
      <input
        type="text"
        disabled={read_only}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_fld}
        value={_obj[_fld]}
        onChange={onChange}
      />
      :
      <TextField
        className={cn(classes.formControl, bar && classes.barInput)}
        disabled={read_only}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        InputProps={InputProps || {placeholder: _fld}}
        value={_obj[_fld]}
        onChange={onChange}
        {...other}
      />;
  }
}

export default withStyles(FieldText);
