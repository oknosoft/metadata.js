/**
 * ### Поле ввода ссылочных данных на базе material-ui-select
 *
 * @module FieldSelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

import AbstractField, {suggestionText} from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';

class FieldSelect extends AbstractField {

  constructor(props, context) {
    super(props, context);
    this.state.options = [this.typedValue(props)];
    this.loadOptions(props._obj);
  }

  typedValue({_obj, _fld}) {
    let v;
    const {is_ref, types} = this._meta.type;
    if(is_ref && types.length === 1 && _obj._obj && _obj._obj.hasOwnProperty(_fld)) {
      v = $p.md.mgr_by_class_name(types[0]).get(_obj._obj[_fld]);
    }
    else {
      v = _obj[_fld];
    }
    return v;
  }

  shouldComponentUpdate({_obj, _meta, dyn_meta}) {
    if(this.props._obj !== _obj) {
      this.loadOptions(_obj);
      return false;
    }
    if(_meta && this.props._meta !== _meta) {
      if(!dyn_meta) {
        this._meta = _meta;
      }
      this.loadOptions(_obj);
      return false;
    }
    return true;
  }

  setOptions(options, v) {
    if(v && !options.includes(v)) {
      options.unshift(v);
    }
    options = Array.from(new Set(options.filter((v) => v)));
    if(this._mounted) {
      this.setState({options});
    }
    else {
      Object.assign(this.state, {options});
    }
  }

  loadOptions(_obj) {

    const {_meta, props: {_fld}, state} = this;
    const {is_ref, types} = _meta.type;
    const v = this.typedValue({_obj, _fld});
    const _manager = v && v._manager || _meta.type._mgr;

    if(_meta.list && _meta.list.length && _meta.list[0]._manager === _manager) {
      this.setOptions([..._meta.list], v);
      return;
    }

    const select = _manager ? _manager.get_search_selector({_obj, _meta, top: 999, skip: 0}) : {};

    if(_meta.list) {
      if(_manager) {
        select.ref = {in: _meta.list};
      }
      else {
        this.setOptions([..._meta.list], v);
        return;
      }
    }

    _manager
      .get_option_list(select)
      .then((options) => this.setOptions(options, v));
  };

  renderOptions() {
    const {empty_text} = this.props;
    return this.state.options.map((v) => {
      const key = v.valueOf();
      const text = empty_text && v.empty && v.empty() ? empty_text : suggestionText(v);
      return <option key={key} value={key}>{text}</option>;
    });
  }

  render() {

    const {props, _meta, onChange} = this;
    const {classes, extClasses, fullWidth, read_only, disabled, isTabular, get_ref, empty_text, dyn_meta, ...other} = props;
    const value = this.typedValue(props);
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    }
    if(_meta.mandatory && (!value || value.empty())) {
      attr.error = true;
    }
    if(read_only || disabled) {
      other.disabled = true;
    }

    return this.isTabular ?
      <select
        value={value && value.valueOf()}
        onChange={onChange}
        {...attr}
        {...other}
      >
        {this.renderOptions()}
      </select>
      :
      <FormControl
        className={extClasses && extClasses.control ? '' : cn(classes.formControl, props.bar && classes.barInput)}
        classes={extClasses && extClasses.control ? extClasses.control : null}
        fullWidth={fullWidth}
        {...attr}
      >
        <InputLabel classes={extClasses && extClasses.label ? extClasses.label : null}>{_meta.synonym}</InputLabel>
        <Select
          native
          value={value && value.valueOf()}
          onChange={onChange}
          input={<Input classes={Object.assign({input: classes.input}, extClasses && extClasses.input)}/>}
          {...other}
        >
          {this.renderOptions()}
        </Select>
      </FormControl>;
  }
}

export default withStyles(FieldSelect);
