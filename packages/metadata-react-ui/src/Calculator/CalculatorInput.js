import {
  default as React,
  PureComponent,
  PropTypes
} from "react";

import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import CalculatorButton from "./CalculatorButton";
import DropDownMenu from "material-ui/DropDownMenu";
import classnames from "classnames";
import classes from "./styles/CalculatorInput.scss";

export default class CalculatorInput extends PureComponent {

  static propTypes = {
    isExpression: PropTypes.bool,
    value: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,

    onChange: PropTypes.func.isRequired,
    onOperationKeyPress: PropTypes.func,
    onRemoveKeyPress: PropTypes.func,
    onPercentsKeyPress: PropTypes.func,
    onInputCleared: PropTypes.func,
    onMenuToggleClick: PropTypes.func,
    clearInputRequired: PropTypes.bool,
    menu: PropTypes.element,
  }

  static defaultProps = {
    onOperationKeyPress: null,
    onRemoveKeyPress: null,
    onPercentsKeyPress: null,
    isExpression: false,
    onMenuToggleClick: null,
    onInputCleared: null,
    clearInputRequired: false,
    menu: null,
  }

  handleToggleButtonClick() {
    if (this.props.onMenuToggleClick !== null) {
      this.props.onMenuToggleClick();
    }
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  /**
   * Filter input if it is simple calculator.
   * @param  {SynteticEvent} event
   */
  handleKeyPress(event) {
    if (event.key === "=" || event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      if (this.props.onEqualSignPres !== null) {
        this.props.onEqualSignPres();
      }

      return;
    }

    if (this.props.isExpression === true) {
      return;
    }

    if (event.key.match(/[\d\.]/) === null) {
      event.preventDefault();
      event.stopPropagation();

      if (["+", "-", "/", "*"].indexOf(event.key) !== -1) {
        if (this.props.onOperationKeyPress !== null) {
          this.props.onOperationKeyPress(event.key);
        }
      }

      if (event.key === "%") {
        if (this.props.onPercentsKeyPress !== null) {
          this.props.onPercentsKeyPress();
        }
      }

    } else {
      if (event.key.match(/[\d\.]/) !== null && this.props.clearInputRequired === true) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onChange(event.key);

        if (this.props.onInputCleared !== null) {
          this.props.onInputCleared();
        }
      }
    }
  }

  handleKeyDown(event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      event.stopPropagation();

      if (this.props.onRemoveKeyPress !== null) {
        this.props.onRemoveKeyPress();
      }
    }
  }

  render() {
    const inputClassNames = classnames({
      [classes["meta-calculator-input__input"]]: true,
      [classes["meta-calculator-input__input--expression"]]: this.props.isExpression
    });

    return (
      <div className={classes["meta-calculator-input"]}>
        <input
          className={inputClassNames}
          onKeyDown={(event) => { this.handleKeyDown(event) }}
          onKeyPress={(event) => { this.handleKeyPress(event) }}
          onChange={(event) => { this.handleChange(event) }}
          value={this.props.value} />

        <CalculatorButton
          icon={<ArrowDropDown style={{ width: "1em", height: "1em" }} />}
          onClick={() => this.handleToggleButtonClick()}
          menu={this.props.menu}
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "32px",
            height: "100%",
            margin: "0",
            padding: "0"
          }} />
      </div>
    );
  }
}