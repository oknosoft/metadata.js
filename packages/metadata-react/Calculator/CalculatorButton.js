import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import classes from './styles/CalculatorButton.scss';

export default class CalculatorButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    icon: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    red: PropTypes.bool,
    menu: PropTypes.element,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    style: null,
    text: null,
    icon: null,
    red: false,
    menu: null,
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
      isMenuVisible: false,
    };
  }

  handleMouseDown() {
    if (this.props.disabled === true) {
      return;
    }

    this.setState({
      isPressed: true,
    });
  }

  handleMouseUp() {
    this.setState({isPressed: false});
  }

  handleMouseOut() {
    this.setState({isPressed: false});
  }

  handleClick() {
    if (this.props.disabled === true) {
      return;
    }

    this.props.onClick();
  }

  render() {
    const calculatorButtonClasses = classnames({
      [classes['meta-calculator-button']]: true,
      [classes['meta-calculator-button--red']]: this.props.red,
      [classes['meta-calculator-button--is-pressed']]: this.state.isPressed,
      [classes['meta-calculator-button--disabled']]: this.props.disabled,
    });

    return (
      <div
        style={this.props.style}
        className={calculatorButtonClasses}
        onClick={() => this.handleClick()}
        onMouseDown={() => this.handleMouseDown()}
        onMouseUp={() => this.handleMouseUp()}
        onMouseOut={() => this.handleMouseOut()}>

        {this.props.icon}
        {this.props.text}

        <div className={classes['meta-calculator-button__menu']}>
          {this.props.menu}
        </div>
      </div>
    );
  }
}