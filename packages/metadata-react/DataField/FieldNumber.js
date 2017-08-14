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

export default class FieldNumber extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func,
    partOfTabularSection: PropTypes.bool,
  };

  static defaultProps = {
    partOfTabularSection: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isCalculatorVisible: false,
      value: props._obj[props._fld],
    };
  }

  onChange = (event, newValue) => {
    this.setState({
      value: newValue,
    }, () => {
      if (this.props.handleValueChange) {
        this.props.handleValueChange(this.state.value);
      }
    });
  };

  handleInputClick() {
    this.setState({
      isCalculatorVisible: true,
    });
  }

  handleValueChange(value) {
    let floatValue = parseFloat(value);

    if (isNaN(floatValue)) {
      floatValue = 0.0;
    }

    this.setState({
      value: floatValue,
    });
  }

  handleCalculatorClose(value) {
    this.setState({
      value: value,
      isCalculatorVisible: false,
    });
  }

  render() {

    const {_obj, _fld, _meta, classes, read_only} = this.props;

    let input = null;
    if (this.props.partOfTabularSection) {
      // Render plain html input in cell of table.
      input = (
        <input
          type={'text'}
          name={_fld}
          value={this.state.value}

          onChange={(event, value) => {
            this.handleValueChange(value);
          }}
          onClick={() => {
            this.handleInputClick();
          }}/>
      );
    } else {
      input = (
        <TextField
          name={_fld}
          className={classes && classes.textField}
          fullWidth={true}
          disabled={read_only}
          label={_meta.synonym}
          title={_meta.tooltip || _meta.synonym}

          value={this.state.value}

          onChange={(event, value) => {
            this.handleValueChange(value);
          }}
          onClick={() => {
            this.handleInputClick();
          }}/>
      );
    }

    return (
      <div style={{position: 'relative'}}>
        <Calculator
          position={'bottom'}
          visible={this.state.isCalculatorVisible}
          value={this.state.value}
          onChange={(value) => {
            this.setState({value});
          }}
          onClose={(value) => {
            this.handleCalculatorClose(value);
          }}/>
        {input}
      </div>
    );
  }
}
