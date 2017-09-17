/**
 * ### Поле ввода пути к данным
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cascader from 'rc-cascader';

import '../styles/cascader.css';


class PathField extends Component {

  constructor(props, context) {

    super(props, context);

    const options = this.fill_options();

    const {_obj, _fld} = props;
    const defaultValue = _obj[_fld].split('.');
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
    this.state = {defaultValue, inputValue, options};
  }

  fill_options() {
    const options = [];
    const {_obj} = this.props;
    if(_obj._manager == $p.cat.scheme_settings){
      const {parts, _mgr, _meta} = _obj._owner._owner.child_meta();
      for(const fld in _meta.fields){
        const {synonym, type} = _meta.fields[fld];
        const option = {
          label: synonym,
          value: fld,
          type: type,
          isLeaf: !type.is_ref
        };
        options.push(option);
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

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [{
        label: `${targetOption.label}м1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label}м2`,
        value: 'dynamic2',
      }];
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  };

  prevent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {_obj, _fld, popupVisible} = this.props;
    const {inputValue, defaultValue, options} = this.state;
    return (
      <Cascader expandTrigger="hover"
                popupVisible={popupVisible}
                options={options}
                defaultValue={defaultValue}
                onChange={this.onChange}
                onKeyDown={this.prevent}
                onKeyPress={this.prevent}
                loadData={this.loadData}
                changeOnSelect
      >
        <input placeholder="Путь к данным" value={inputValue} onBlur={this.prevent}/>
      </Cascader>
    );
  }

}

export default PathField;
