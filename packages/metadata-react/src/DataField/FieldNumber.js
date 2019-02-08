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
import Calculator from '../Calculator';

import AbstractField from './AbstractField';
import withStyles from './styles';

class FieldNumber extends AbstractField {

  constructor(props, context) {
    super(props, context);
    Object.assign(this.state, {isCalculatorVisible: false});
  }

  onChange = (event) => {
    const {_obj, _fld, handleValueChange} = this.props;
    const {value} = event.target;
    _obj[_fld] = value;
    this.setState({value}, () => handleValueChange && handleValueChange(value));
  };

  handleInputClick() {
    this.setState({isCalculatorVisible: true});
  }

  handleCalculatorClose(value) {
    this.setState({isCalculatorVisible: false});
    //this.onChange({target: {value}});
  }

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
          onChange={(value) => this.setState({value})}
          onClose={(value) => this.handleCalculatorClose(value)}/>

        {isTabular ?
          <input
            type="text"
            value={state.value}
            onChange={this.onChange.bind(this)}
            onClick={this.handleInputClick.bind(this)}
          />
          :
          <TextField
            className={classes.formControl}
            fullWidth={fullWidth}
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

export default withStyles(FieldNumber);
