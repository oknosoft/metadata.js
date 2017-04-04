/**
 * ### Поле ввода числовых данных с калькулятором
 *
 * @module FieldNumber
 *
 * Created 22.09.2016
 */
import React, {Component, PropTypes} from "react";
import TextField from "material-ui/TextField";
import Calculator from "../Calculator";
import classes from "./styles/FieldNumber.scss";

export default class FieldNumber extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func,
    partOfTabularSection: PropTypes.bool,
  }

  static defaultProps = {
    partOfTabularSection: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isCalculatorVisible: false,
      value: this.props._obj[this.props._fld]
    };
  }

  onChange = (event, newValue) => {
    this.setState({
      value: newValue
    }, () => {
      if (this.props.handleValueChange) {
        this.props.handleValueChange(this.state.value);
      }
    });
  }

  handleInputClick() {
    this.setState({
      isCalculatorVisible: true
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
    const name = this.props._fld;

    let input = null;
    if (this.props.partOfTabularSection) {
      // Render plain html input in cell of table.
      input = (
        <input
          type={"text"}
          name={name}
          value={this.state.value}

          className={classes["meta-field-number__input"]}
          onChange={(event, value) => { this.handleValueChange(value);}}
          onClick={() => { this.handleInputClick(); }} />
      );
    } else {
      input = (
        <TextField
          name={name}
          value={this.state.value}

          fullWidth={true}
          hintText={this.props._meta.tooltip || this.props._meta.synonym}
          onChange={(event, value) => { this.handleValueChange(value); }}
          onClick={() => { this.handleInputClick(); }} />
      );
    }

    return (
      <div className={classes["meta-field-number"]}>
        <Calculator
          position={"bottom"}
          visible={this.state.isCalculatorVisible}
          value={this.state.value}
          onChange={(value) => { this.setState({ value }); }}
          onClose={(value) => { this.handleCalculatorClose(value); }} />
        {input}
      </div>
    );
  }
}
