/**
 * ### Поле ввода пути к данным
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cascader from 'rc-cascader';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import '../styles/cascader.css';

class FieldPath extends Component {

  constructor(props, context) {

    super(props, context);

    const options = this.fill_options();

    const {_obj, _fld} = props;
    const value = _obj[_fld];
    const defaultValue = typeof value === 'string' ? value.split('.') : [];
    let inputValue = '';
    if(defaultValue.length) {
      let curr;
      defaultValue.forEach((v) => {
        if(inputValue) {
          inputValue += '.';
        }
        (curr || options).some((opt) => {
          if(opt.value == v) {
            inputValue += opt.label;
            curr = opt.children || [];
            return true;
          }
        });
      });
    }
    this.state = {defaultValue, inputValue, options, value, open: false};
  }

  /**
   * Заполняет нулевой и первый уровни
   * @return {Array}
   */
  fill_options() {
    const options = [];
    const {_obj} = this.props;
    if(_obj._manager == $p.cat.scheme_settings){
      const {parts, _mgr, _meta} = _obj._owner._owner.child_meta();
      for(const fld in _meta.fields){
        if(fld !== 'predefined_name' && _meta.fields[fld]) {
          const {synonym, tooltip, type} = _meta.fields[fld];
          const option = {
            label: synonym || tooltip || fld,
            value: fld,
            type: type,
          };
          options.push(option);
          if(type.is_ref){
            this.loadData([option], 1);
          }
        }
      }
    }
    else{

    }
    return options;
  }

  onChange = (value, selectedOptions) => {
    const {_obj, _fld, handleValueChange} = this.props;
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join('.'),
    });
    if(_obj && _fld) {
      _obj[_fld] = value.reduce((sum, v) => sum + (sum ? '.' : '') + v, '');
      handleValueChange && handleValueChange(value);
    }
  };

  loadData = (selected, init) => {
    const targetOption = selected[selected.length - 1];
    targetOption.children = [];
    for(const name of targetOption.type.types){
      const _meta = $p.md.get(name);
      if(_meta){
        for(const fld in _meta.fields){
          if(fld == 'predefined_name'){
            continue;
          }
          const {synonym, tooltip, type} = _meta.fields[fld];
          const option = {
            label: synonym || tooltip || fld,
            value: fld,
            type: type,
            isLeaf: !type.is_ref
          };
          targetOption.children.push(option);
          if (option.isLeaf === false && init && init < 2){
            this.loadData([option], 2);
          }
        }
      }
    }
    !init && this.setState({options: [...this.state.options]});
  };

  render() {
    const {_obj, _fld, fullWidth} = this.props;
    const {inputValue, defaultValue, options, value, open} = this.state;
    const {prevent} = $p.ui;
    const input = <InputBase
      readOnly={open}
      value={open ? inputValue : value}
      placeholder="Путь к данным"
      fullWidth={fullWidth}
      onBlur={prevent}
      onChange={({target}) => {
        const {value} = target;
        _obj[_fld] = value;
        this.setState({value});
      }}
      style={{
        backgroundColor: 'white',
        paddingLeft: 4,
        fontSize: '0.9rem',
      }}
      endAdornment={<InputAdornment
        position="end"
        style={{cursor: 'pointer'}}
        onClick={() => this.setState({open: !open})}
      >
        <ArrowDropDownIcon />
      </InputAdornment>}
    />;
    return open ? <Cascader
        expandTrigger="hover"
        options={options}
        defaultValue={defaultValue}
        onChange={this.onChange}
        onKeyDown={prevent}
        onKeyPress={prevent}
        loadData={this.loadData}
        changeOnSelect
        open
      >
      {input}
      </Cascader>
      :
      input;
  }

}

export default FieldPath;
