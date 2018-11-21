/**
 * ### Поле переключателя
 *
 * @module FieldToggle
 *
 * Created 12.03.2018
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import AbstractField from './AbstractField';
import withStyles from './styles';


class FieldThreeState extends AbstractField {

  // при изменении, подсовываем типовому обработчику, свойство checked, выдавая его за value
  handleChange = ({target}) => {
    this.onChange({target: {value: target.checked ? 1 : -1}});
  };

  render() {
    const {props: {read_only, labels, classes}, state: {value}, _meta} = this;

    const control = <input
      type="checkbox"
      className={classes.threestateInput}
      ref={input => {
        if (input) {
          input.checked = value > 0;
          input.indeterminate = !value;
          input.disabled = read_only;
        }
      }}
      onChange = {this.handleChange}
    />;

    return (
      // в табчасти показываем обычный чекбокс
      this.isTabular ?
        control
        :
        <FormControlLabel
          className={classes.threestateLabel}
          control={control}
          label={labels ? labels[value + 1] : (_meta.tooltip || _meta.synonym)}
        />
    );
  }
}

export default withStyles(FieldThreeState);
