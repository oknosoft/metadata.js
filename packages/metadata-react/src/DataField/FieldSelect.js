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
    const _manager = _obj[props._fld] && _obj[props._fld]._manager || _meta.type._mgr;
    const select = _manager ? _manager.get_search_selector({_obj, _meta, top: 999, skip: 0}) : {};

    if(_meta.list) {
      if(_manager) {
        select.ref = {in: _meta.list};
      }
      else {
        const opt = {options: _meta.list};
        if(this._mounted) {
          this.setState(opt);
        }
        else {
          Object.assign(state, opt);
        }
        return;
      }
    }

    _manager.get_option_list(select)
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
    const {_obj, _fld, classes, extClasses, fullWidth} = props;
    const value = _obj[_fld];
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    }
    if(_meta.mandatory) {
      attr.required = true;
    }

    return isTabular ?
      <select
        value={value && value.valueOf()}
        onChange={onChange}
        {...attr}
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
          input={<Input classes={
            Object.assign(
              {input: cn(classes.input, attr.required && (!value || value.empty()) && classes.required)}, extClasses && extClasses.input)
          }/>}
        >
          {this.renderOptions()}
        </Select>
      </FormControl>;
  }
}

export default withStyles(FieldSelect);
