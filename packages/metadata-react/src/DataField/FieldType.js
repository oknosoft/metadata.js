/**
 * ### Поле ввода типа данных
 *
 * Created by Evgeniy Malyarov on 15.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cascader from 'rc-cascader';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import '../styles/cascader.css';

const options = [{
  label: 'Примитивы',
  value: '',
  children: [{
    label: 'Строка',
    value: 'string',
  }, {
    label: 'Число',
    value: 'number',
  }, {
    label: 'Дата',
    value: 'date',
  }, {
    label: 'Булево',
    value: 'boolean',
  }, {
    label: 'Путь',
    value: 'path',
  }, {
    label: 'Массив',
    value: 'array',
  }, {
    label: 'Вычисляемое значение',
    value: 'calculated',
  }],
}];

function fill_options() {
  if(options.length < 2) {
    const syn = $p.msg.meta;
    const {_m} = $p.md;
    'enm,cat,doc,cch'.split(',').forEach(v => {
      const option = {value: v, label: syn[v]};
      const children = Object.keys(_m[v])
        .filter(el => el.indexOf('meta_') != 0)
        .map(el => (v == 'enm' ?
          {value: el, label: $p.md.syns_1с(el)}
          :
          {label: _m[v][el] ? _m[v][el].synonym || _m[v][el].name : el, value: el}));
      children.sort((a, b) => {
        if(a.label < b.label) {
          return -1;
        }
        else if(a.label > b.label) {
          return 1;
        }
        else {
          return 0;
        }
      });
      options.push(Object.assign(option, {children}));
    });
  }
}

class FieldType extends Component {

  constructor(props, context) {
    super(props, context);

    fill_options();

    const {_obj, _fld} = props;
    const value = _obj[_fld];
    const defaultValue = typeof value === 'string' ? value.split('.') : [];
    let inputValue = '';
    if(defaultValue.length) {
      if(defaultValue.length == 1) {
        defaultValue.splice(0, 0, '');
      }
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

  render() {
    const {_obj, _fld} = this.props;
    const {inputValue, defaultValue, options, value, open} = this.state;
    const {prevent} = $p.ui;
    const input = <InputBase
      readOnly={open}
      value={open ? inputValue : value}
      placeholder="Тип значения"
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
        open
      >
        {input}
      </Cascader>
      :
      input;
  }

}

export default FieldType;
