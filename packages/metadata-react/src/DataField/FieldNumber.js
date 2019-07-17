/**
 * ### Поле ввода числовых данных с калькулятором
 *
 * @module FieldNumber
 *
 * Created 22.09.2016
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Keyboard from '@material-ui/icons/Keyboard';

import Calculator from '../Calculator';

import AbstractField from './AbstractField';
import withStyles from './styles';

class FieldNumber extends AbstractField {

  constructor(props, context) {
    super(props, context);
    Object.assign(this.state, {isCalculatorVisible: false, focused: false});
  }

  onChange = ({target}) => {
    const {_obj, _fld, handleValueChange} = this.props;
    const {value} = target;
    _obj[_fld] = value;
    this.setState({value}, () => handleValueChange && handleValueChange(_obj[_fld]));
  };

  handleInputClick = () => {
    this.setState({isCalculatorVisible: true});
  };

  handleCalculatorClose = () => {
    this.setState({isCalculatorVisible: false});
  };

  handleFocus = (focused) => {
    if(typeof focused === 'boolean') {
      const {_obj, _fld} = this.props;
      this._mounted && this.setState({focused, value: _obj[_fld]});
    }
    else {
      setTimeout(this.handleFocus.bind(this, true), 200);
    }
  };

  handleBlur = () => {
    setTimeout(this.handleFocus.bind(this, false), 200);
  };

  render() {

    const {state, props, _meta, isTabular} = this;
    const {_obj, _fld, classes, read_only, fullWidth} = props;

    // Render plain html input in cell of table.
    return (
      <div style={{position: 'relative'}}>

        <Calculator
          position={'bottom'}
          visible={state.isCalculatorVisible}
          value={state.value}
          onChange={(value) => this.onChange({target: {value}})}
          onClose={this.handleCalculatorClose}/>

        {isTabular ?
          <input
            type="text"
            value={state.value}
            onChange={this.onChange}
            onClick={this.handleInputClick}
          />
          :
          <TextField
            className={classes.formControl}
            fullWidth={fullWidth}
            label={_meta.synonym}
            title={_meta.tooltip || _meta.synonym}
            value={state.focused && !read_only ? state.value : _obj[_fld]}
            onChange={this.onChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            InputProps={{
              readOnly: Boolean(read_only),
              endAdornment: !read_only && (state.focused || state.isCalculatorVisible) ? <InputAdornment position="end">
                <IconButton onClick={this.handleInputClick} tabIndex={-1}><Keyboard /></IconButton>
              </InputAdornment>  : undefined,
            }}
          />
        }
      </div>
    );
  }
}

export default withStyles(FieldNumber);
