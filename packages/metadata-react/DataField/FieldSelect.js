/**
 * ### Поле ввода ссылочных данных на базе react-select
 *
 * @module FieldSelect
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VirtualizedSelect from './VirtualizedSelect';
import AbstractField from './AbstractField';

export default class FieldSelect extends AbstractField {

  constructor(props, context) {

    super(props, context);

    const {_obj, _fld, mandatory} = props;
    const _val = _obj[_fld];

    this.state = {
      clearable: true,
      disabled: false,
      options: [_val],
      value: _val,
      multi: props.multi || false,
      searchable: true,
      selectedCreatable: null,
      mandatory: typeof mandatory === 'boolean' ? mandatory : this._meta.mandatory,
    };
  }

  loadOptions = (input) => {

    const selection = {_top: 40};
    const {_obj, _fld} = this.props;
    const {choice_params} = this._meta;

    if (input) {
      selection.presentation = {like: input};
    }
    if (choice_params) {
      choice_params.forEach((cp) => {
        selection[cp.name] = cp.path;
      });
    }

    return _obj[_fld]._manager.get_option_list(selection)
      .then((options) => {
        this.setState({options});
        return {options};
      });
  };

  onChange = (value) => {
    const {handleValueChange} = this.props;
    this.setState({value});
    handleValueChange && handleValueChange(value);
  };

  render() {

    const {props, state, loadOptions, onChange} = this;
    const {_fld} = props;
    const {options, value, mandatory} = state;

    return (
      <VirtualizedSelect
        name={_fld}
        async
        cache={false}
        clearable={!mandatory}
        backspaceRemoves={false}
        labelKey='presentation'
        valueKey='ref'
        loadOptions={loadOptions}
        minimumInput={0}
        onChange={onChange}
        //onValueClick={this._goToGithubUser}
        options={options}
        value={value}
      />
    );
  }
}

