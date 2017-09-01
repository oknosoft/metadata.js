/**
 * ### Поле ввода текстовых данных
 *
 * @module FieldText
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import AbstractField from './AbstractField';

export default class FieldText extends AbstractField {

  onChange = (event) => {
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = event.target.value;
    if (handleValueChange) {
      handleValueChange(event.target.value);
    }
  };

  render() {
    const {onChange, props, _meta} = this;
    const {_obj, _fld, classes, read_only} = props;

    return (
      <TextField
        name={_fld}
        className={classes && classes.textField}
        fullWidth
        margin="dense"
        disabled={read_only}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        InputProps={{ placeholder: _fld }}
        defaultValue={_obj[_fld]}
        onChange={onChange}
      />
    );
  }
}
