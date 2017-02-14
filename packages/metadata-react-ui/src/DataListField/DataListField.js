/**
 * ### React-component _Поле списка_
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 *
 * @module DataListField
 *
 * Created 09.01.2017
 */

import React, { Component, PropTypes } from 'react';
import MetaComponent from "../common/MetaComponent";
import {Async} from "react-select";
//import Select from "../DataField/FieldVirtualizedSelect";


export default class DataListField extends MetaComponent {

  static propTypes = {
    _tabular: PropTypes.object.isRequired,  // TabularSection, к которой будет привязано поле
    _fld: PropTypes.string.isRequired,      // имя колонки табчасти - путь к данным
    _meta: PropTypes.object,                // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    label_position: PropTypes.object,       // положение заголовка, $p.enm.label_positions
    read_only: PropTypes.bool,              // поле только для чтения

    handleValueChange: PropTypes.func   // обработчик при изменении значения в поле
  }

  constructor(props, context) {

    super(props, context)

    const {_fld, _tabular} = props
    const _meta = props._meta || _tabular._metadata(_fld)

    this.state = {
      _meta,
      _mgr: context.$p.utils.value_mgr({}, _fld, _meta.fields[_fld].type, false),
      options: [],
      value: _tabular.unload_column(_fld),
      multi: true
    }
  }

  _loadOptions = (input, callback) => {

    const selection = {_top: 40};
    const {_fld, _meta} = this.props
    const {_mgr} = this.state


    if(input){
      selection.presentation = {like: input}
    }
    if(_meta.choice_params){
      _meta.choice_params.forEach((cp) => {
        selection[cp.name] = cp.path
      })
    }

    return _mgr.get_option_list(selection)
      .then((options) => {
        callback(null, {
          options: options,
          complete: true,
        })
      })
  }

  _onChange = (value) => {
    const {handleValueChange, _fld, _tabular} = this.props;
    this.setState({value});

    // удаляем-добавляем строки в _tabular
    _tabular.load(value.map((row) => ({[_fld]: row})));

    if(handleValueChange){
       handleValueChange(value)
    }
  }

  render() {

    const {props, state, _loadOptions, _onChange} = this;
    const {_obj, _fld, label_position} = props;
    const {options, value, _meta} = state;

    const control = <Async
      name={_fld}
      multi
      cache={false}
      clearable={false}
      labelKey='presentation'
      valueKey='ref'
      loadOptions={_loadOptions}
      minimumInput={0}
      onChange={_onChange}
      options={options}
      value={value}
    />

    if(label_position == this.context.$p.enm.label_positions.hide){
      return control

    }else{
      return (
        <div className={'meta-datafield-field'}>
          <div className={'meta-datafield-label'}>{_meta.synonym}</div>
          <div className={'meta-datafield-data'}>
            {control}
          </div>
        </div>
      )
    }
  }
}