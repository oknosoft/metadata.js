/**
 * ### Поле ввода числовых данных с калькулятором
 *
 * @module FieldNumber
 *
 * Created 22.09.2016
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Calculator from '../Calculator';

import AbstractField from './AbstractField';

export default class FieldNumber extends AbstractField {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isCalculatorVisible: false,
      value: props._obj[props._fld],
    };
  }

  onChange = (event) => {
    const {_obj, _fld, handleValueChange} = this.props;
    const {value} = event.target;
    _obj[_fld] = value;
    this.setState({value}, () => handleValueChange && handleValueChange(value));
  };

  handleInputClick() {
    this.setState({
      isCalculatorVisible: true,
    });
  }

  handleCalculatorClose(value) {
    this.setState({isCalculatorVisible: false});
    this.onChange({target: {value}});
  }

  render() {

    const {state, props, _meta, isTabular} = this;
    const {_obj, _fld, classes, read_only} = props;

    // Render plain html input in cell of table.
    return (
      <div style={{position: 'relative'}}>

        <Calculator
          position={'bottom'}
          visible={state.isCalculatorVisible}
          value={state.value}
          onChange={(value) => this.setState({value})}
          onClose={(value) => this.handleCalculatorClose(value)}/>

        {isTabular ?
          <input
            type="text"
            name={_fld}
            value={state.value}
            onChange={this.onChange.bind(this)}
            onClick={this.handleInputClick.bind(this)}
          />
          :
          <TextField
            name={_fld}
            className={classes && classes.textField}
            fullWidth
            margin="dense"
            disabled={read_only}
            label={_meta.synonym}
            title={_meta.tooltip || _meta.synonym}

            value={state.value}

            onChange={this.onChange.bind(this)}
            onClick={this.handleInputClick.bind(this)}
          />
        }
      </div>
    );
  }
}
