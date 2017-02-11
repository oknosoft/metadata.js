/**
 * ### Поле ввода ссылочных данных
 *
 * @module FieldSelect
 *
 */

import React, {Component, PropTypes} from "react";
import VirtualizedSelect from "./VirtualizedSelect";

export default class FieldSelect extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,

    multi: PropTypes.bool,              // множественный выбор - значение является массивом
    mandatory: PropTypes.bool,          // поле обязательно для заполнения

    handleValueChange: PropTypes.func
  }

  constructor(props, context) {

    super(props, context)

    const {_obj, _fld, _meta, mandatory} = props
    const _val = _obj[_fld]

    this.state = {
      clearable: true,
      disabled: false,
      options: [_val],
      value: _val,
      multi: props.multi || false,
      searchable: true,
      selectedCreatable: null,
      mandatory: mandatory || _meta.mandatory
    }
  }

  _loadOptions = (input) => {

    const selection = {_top: 40};
    const {_obj, _fld, _meta} = this.props

    if (input) {
      selection.presentation = {like: input}
    }
    if (_meta.choice_params) {
      _meta.choice_params.forEach((cp) => {
        selection[cp.name] = cp.path
      })
    }

    return _obj[_fld]._manager.get_option_list(selection)
      .then((options) => {
        this.setState({options})
        return {options}
      })
  }

  _onChange = (value) => {
    const {handleValueChange} = this.props
    this.setState({value})
    if (handleValueChange) {
      handleValueChange(value)
    }
  }

  render() {

    const {props, state, _loadOptions, _onChange} = this
    const {_obj, _fld} = props
    const {options, value, mandatory} = state

    return (
      <VirtualizedSelect
        name={_fld}
        async
        cache={false}
        clearable={!mandatory}
        backspaceRemoves={false}
        labelKey='presentation'
        valueKey='ref'
        loadOptions={_loadOptions}
        minimumInput={0}
        onChange={_onChange}
        //onValueClick={this._goToGithubUser}
        options={options}
        value={value}
      />
    );
  }
}

