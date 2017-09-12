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
import withStyles from './styles';

class FieldText extends AbstractField {

  onChange = (event) => {
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = event.target.value;
    handleValueChange && handleValueChange(event.target.value);

  };

  render() {
    const {onChange, props, _meta} = this;
    const {_obj, _fld, classes, read_only, fullWidth} = props;

    return (
      <TextField
        name={_fld}
        className={classes.formControl}
        fullWidth={fullWidth}
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

export default withStyles(FieldText);
