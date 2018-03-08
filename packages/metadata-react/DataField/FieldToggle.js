/**
 * ### Поле переключателя
 *
 * @module FieldToggle
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Switch from 'material-ui/Switch';

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';

import AbstractField from './AbstractField';
import withStyles from './styles';


class FieldToggle extends AbstractField {

  render() {
    const {props, _meta, isTabular, onChange} = this;
    const {_obj, _fld, classes, read_only, fullWidth} = props;

    return (
      <FormControlLabel
        control={
          < Switch
            name = {_fld}
            checked = {_obj[_fld]}
            value = "{_obj[_fld]}"
            onChange = {onChange}
          />
        }
        label={_meta.tooltip || _meta.synonym}
      />
    );
  }
}

export default withStyles(FieldToggle);
