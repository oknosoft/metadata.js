/**
 * ### Поле ввода числовых данных с калькулятором
 *
 * @module FieldNumber
 *
 * Created 22.09.2016
 */
import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Keyboard from '@material-ui/icons/Keyboard';
import cn from 'classnames';

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
    if(!this.read_only) {
      this.setState({isCalculatorVisible: true});
    }
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

    const {state, props, _meta, read_only} = this;
    const {
      _obj, _fld, classes, extClasses, className, disabled, label_position, fullWidth, isTabular, handleValueChange, read_only: r, ...other} = props;
    const inputProps={readOnly: Boolean(read_only)};
    let endAdornment;
    if(navigator.userAgent.match(/android|ios|iphone/i)) {
      inputProps.type = 'number';
    }
    else {
      endAdornment = !read_only && (state.focused || state.isCalculatorVisible) ? <InputAdornment position="end">
        <IconButton onClick={this.handleInputClick} tabIndex={-1}><Keyboard /></IconButton>
      </InputAdornment>  : undefined;
    }

    const attr = {
      title: _meta.tooltip || _meta.synonym,
    }
    if(_meta.mandatory) {
      attr.required = true;
    }
    if(disabled) {
      attr.disabled = true;
    }
    if(read_only) {
      other.readOnly = true;
    }
    const v = state.focused && !read_only ? state.value : _obj[_fld];

    // Render plain html input in cell of table.
    return (
      <div style={{position: 'relative'}}>

        <Calculator
          position={'bottom'}
          visible={state.isCalculatorVisible}
          value={state.value}
          onChange={(value) => this.onChange({target: {value}})}
          onClose={this.handleCalculatorClose}/>

        {this.isTabular ?
          <input
            type="text"
            value={state.value}
            onChange={this.onChange}
            onClick={this.handleInputClick}
            {...other}
          />
          :
          <FormControl
            className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, props.bar && classes.barInput)}
            classes={extClasses && extClasses.control ? extClasses.control : null}
            fullWidth={fullWidth}
            {...attr}
          >
            {label_position != 'hide' &&
            <InputLabel
              classes={extClasses && extClasses.label ? extClasses.label : null}
            >{_meta.synonym}</InputLabel>}
            <Input
              value={v}
              onChange={this.onChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              inputProps={inputProps}
              endAdornment={endAdornment}
              classes={
                Object.assign({input: cn(classes.input, attr.required && !v && classes.required)}, extClasses && extClasses.input)
              }
              {...other}
            />
          </FormControl>
        }
      </div>
    );
  }
}

export default withStyles(FieldNumber);
