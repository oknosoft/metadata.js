/**
 * ### Поле переключателя
 *
 * @module FieldToggle
 *
 * Created 12.03.2018
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

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;
    this.state = {checked: _obj[_fld]};
  }

  handleChange = name => event => {
    const {checked} = event.target;
    this.setState({ 'checked': checked });
    const {_obj, _fld} = this.props;
    _obj[_fld] = checked;
  };

  render() {
    const {props, _meta, isTabular} = this;
    const {_obj, _fld, read_only} = props;

    return (
      <FormControlLabel
        control={
          < Switch
            name = {_fld}
            checked = {this.state.checked}
            disabled = {read_only}
            color = 'primary'
            onChange = {this.handleChange()}
          />
        }
        label={_meta.tooltip || _meta.synonym}
      />
    );
  }
}

export default withStyles(FieldToggle);
