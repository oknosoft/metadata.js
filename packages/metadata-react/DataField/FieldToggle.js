/**
 * ### Поле переключателя
 *
 * @module FieldToggle
 *
 * Created 12.03.2018
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import AbstractField from './AbstractField';
import withStyles from './styles';


class FieldToggle extends AbstractField {

  // при изменении, подсовываем типовому обработчику, свойство checked, выдавая его за value
  handleChange = ({target}) => {
    this.onChange({target: {value: target.checked}});
  };

  render() {
    const {props: {read_only}, state: {value}, _meta, isTabular, handleChange} = this;

    return (
      // в табчасти показываем обычный чекбокс
      isTabular ?
        <input
          type="checkbox"
          value={value ? 'checked' : ''}
          disabled = {read_only}
          onChange = {handleChange}
        />
        :
        <FormControlLabel
          control={
            <Switch
              checked = {value}
              disabled = {read_only}
              color = "primary"
              onChange = {handleChange}
            />
          }
          label={_meta.tooltip || _meta.synonym}
        />
    );
  }
}

export default withStyles(FieldToggle);
