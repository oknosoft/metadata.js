/**
 * ### Поле ввода ссылочных данных на базе material-ui-select
 *
 * @module FieldSelect
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

import AbstractField, {suggestionText} from './AbstractField';
import withStyles from './styles';

class FieldSelect extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;
    Object.assign(this.state, {options: [_obj[_fld]]});
    this.loadOptions(_obj);
  }

  shouldComponentUpdate({_obj}) {
    if(this.props._obj != _obj) {
      this.loadOptions(_obj);
      return false;
    }
    return true;
  }

  loadOptions(_obj) {

    const {_meta, props, state} = this;
    const {_manager} = _obj[props._fld];
    const select = _manager.get_search_selector({_obj, _meta, top: 999, skip: 0});

    return _manager.get_option_list(select)
      .then((options) => {
        if(this._mounted) {
          this.setState({options});
        }
        else {
          Object.assign(state, {options});
        }
      });
  };

  renderOptions() {
    return this.state.options.map((v) => {
      const key = v.valueOf();
      return <option key={key} value={key}>{suggestionText(v)}</option>;
    });
  }

  render() {

    const {props, _meta, isTabular, onChange} = this;
    const {_obj, _fld, classes} = props;

    return isTabular ?
      <select
        value={_obj[_fld].valueOf()}
        onChange={onChange}
      >
        {this.renderOptions()}
      </select>
      :
      <FormControl className={classes.formControl}>
        <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>
        <Select
          native
          value={_obj[_fld].valueOf()}
          onChange={onChange}
          input={<Input/>}
        >
          {this.renderOptions()}
        </Select>
      </FormControl>;
  }
}

export default withStyles(FieldSelect);
