import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import withStyles from './styles';

class CalculatorButton extends Component {
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
    const {props, state} = this;
    const {classes} = props;
    const calculatorButtonClasses = classnames({
      [classes.button]: true,
      [classes.buttonRed]: props.red,
      [classes.buttonIsPressed]: state.isPressed,
      [classes.buttonDisabled]: props.disabled,
    });

    return (
      <div
        style={props.style}
        className={calculatorButtonClasses}
        onClick={() => this.handleClick()}
        onMouseDown={() => this.handleMouseDown()}
        onMouseUp={() => this.handleMouseUp()}
        onMouseOut={() => this.handleMouseOut()}>

        {props.icon}
        {props.text}

        <div className={classes.buttonMenu}>
          {props.menu}
        </div>
      </div>
    );
  }
};

export default withStyles(CalculatorButton);
