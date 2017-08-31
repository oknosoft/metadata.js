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

    const {state, props} = this;
    const {_obj, _fld, _meta, classes, read_only} = props;

    let input = null;
    if (props.partOfTabularSection) {
      // Render plain html input in cell of table.
      input = (
        <input
          type={'text'}
          name={_fld}
          value={state.value}
          onChange={this.onChange.bind(this)}
          onClick={this.handleInputClick.bind(this)}
        />
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

          value={state.value}

          onChange={this.onChange.bind(this)}
          onClick={this.handleInputClick.bind(this)}
        />
      );
    }

    return (
      <div style={{position: 'relative'}}>
        <Calculator
          position={'bottom'}
          visible={state.isCalculatorVisible}
          value={state.value}
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
