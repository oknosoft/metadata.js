/**
 * ### Поле переключателя
 *
 * @module FieldCheckbox
 *
 * Created 12.03.2018
 */

import React, {Component} from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';

import AbstractField from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';
import Switch from '@mui/material/Switch';


class FieldCheckbox extends AbstractField {

  // при изменении, подсовываем типовому обработчику, свойство checked, выдавая его за value
  handleChange = ({target}) => {
    this.onChange({target: {value: target.checked}});
  };

  render() {
    const {props: {read_only, _fld, classes, extClasses, fullWidth, label, bar}, state: {value}, _meta, isTabular, handleChange} = this;
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    };

    return (
      // в табчасти показываем обычный чекбокс
      isTabular ?
        <input
          type="checkbox"
          className={classes.checkbox}
          checked={value ? 'checked' : ''}
          disabled = {read_only}
          onChange = {handleChange}
          {...attr}
        />
        :
        <FormControl
          className={extClasses && extClasses.control ? '' : cn(classes.formControl, bar && classes.barInput)}
          classes={extClasses && extClasses.control}
          fullWidth={fullWidth}
          {...attr}
        >
          <InputLabel classes={extClasses && extClasses.label}>{label || _meta.synonym}</InputLabel>
          <Checkbox
            checked = {value}
            disabled = {read_only}
            color = "primary"
            onChange = {handleChange}
            classes={extClasses && extClasses.checkbox}
          />
        </FormControl>
    );
  }
}

export default withStyles(FieldCheckbox);
