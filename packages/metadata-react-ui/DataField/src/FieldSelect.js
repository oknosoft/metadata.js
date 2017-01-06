import React, {Component, PropTypes} from "react";

import VirtualizedSelect from "./FieldVirtualizedSelect";

export default class FieldSelect extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,

    multi: PropTypes.bool,

    handleValueChange: PropTypes.func
  }

  constructor (props) {

    super(props)

    this.state = {
      clearable: true,
      disabled: false,
      options: [],
      multi: props.multi || false,
      searchable: true,
      selectedCreatable: null,
    }
  }

  _loadOptions = (input) => {

    const selection = {_top: 40};
    const {_obj, _fld, _meta} = this.props

    if(input){
      selection.presentation = {like: input}
    }
    if(_meta.choice_params){
      _meta.choice_params.forEach((cp) => {
        selection[cp.name] = cp.path
      })
    }

    return _obj[_fld]._manager.get_option_list(selection)
      .then((options) => {

        this.setState({ options })

        return { options }
      })
  }

  _onChange = (value) => {
    this.setState({value})
    if(this.props.handleValueChange)
      this.props.handleValueChange(value)
  }

  render() {

    return (

      <VirtualizedSelect
        name={this.props._fld}
        async
        cache={false}
        backspaceRemoves={false}
        labelKey='presentation'
        valueKey='ref'
        loadOptions={this._loadOptions}
        minimumInput={0}
        onChange={this._onChange}
        //onValueClick={this._goToGithubUser}
        options={this.state.options}
        value={this.state.value}

      />

    );
  }
}

