import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PlayArrow from '@material-ui/icons/PlayArrow';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CalculatorInput from './CalculatorInput';
import CalculatorButton from './CalculatorButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ReactClickOutside from 'react-onclickoutside';
import classnames from 'classnames';

import withStyles from './styles';

/**
 * 1C like calculator.
 */
class Calculator extends Component {
  static HISTORY_SIZE = 10;
  static MENU_ITEM_INNER_DIV_STYLE = {
    textAlign: 'left',
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
  };

  static defaultProps = {
    position: 'bottom',
  };

  constructor(props) {
    super(props);

    this.state = {
      availableRepeat: false,

      calculatorTypeMenuVisible: false,
      historyMenuVisible: false,

      isExpressionCalculator: false,
      isMicroCalculator: false,

      clearInputRequired: true,
      firstArgumentValue: null,
      operation: null,

      history: [],
    };
  }

  appendExpression(value) {
    if (this.state.clearInputRequired === true) {
      this.props.onChange(parseFloat(value));
      this.handleCalculatorInputCleared();
    } else {
      this.props.onChange(parseFloat(this.props.value + value));
    }

    this.setState({
      availableRepeat: false,
    });
  }

  appendInverseFunction() {
    this.setState({
      expression: '1 / (' + this.props.value + ')',
    });
  }

  inverse() {
    if (this.state.isExpressionCalculator) {
      this.appendInverseFunction();
    } else {
      this.setState({
        operation: '1/x',
        firstArgumentValue: null,
        availableRepeat: false,
      }, () => {
        /* Execute after state changed. */
        this.executeOperation();
      });
    }
  }

  swapSign() {
    this.setState({
      availableRepeat: false,
    }, () => {
      const value = parseFloat(this.props.value);
      this.props.onChange(-value);
    });
  }

  clearExpression() {
    this.setState({
      clearInputRequired: true,
      availableRepeat: false,
    }, () => {
      this.props.onChange('0');
    });
  }

  clearAll(afterClearCallback = null) {
    this.setState({
      operation: null,
      firstArgumentValue: null,
      clearInputRequired: true,
      availableRepeat: false,
    }, () => {
      this.props.onChange('0');
      if (afterClearCallback !== null) {
        afterClearCallback();
      }
    });
  }

  applyPercents() {
    if (this.state.firstArgumentValue === null) {
      this.clearExpression();
    } else {
      this.setState({
        availableRepeat: false,
      }, () => {
        const ratio = this.props.value / 100;
        this.props.onChange(this.state.firstArgumentValue * ratio);
      });
    }
  }

  removeLast() {
    let value = this.props.value.toString().slice(0, -1);

    if (this.state.isExpressionCalculator === false && ['', '-', '+'].indexOf(value) !== -1) {
      value = '0';
      this.setState({
        clearInputRequired: true,
        availableRepeat: false,
      });
    } else {
      this.setState({
        clearInputRequired: true,
        availableRepeat: false,
      });
    }

    this.props.onChange(value);
  }

  setOperation(operationCode) {
    this.setState({
      operation: operationCode,
      firstArgumentValue: this.props.value,
      clearInputRequired: true,
      availableRepeat: false,
    });
  }

  calculate() {
    if (this.state.isExpressionCalculator) {
      this.evalExpression();
    } else {
      this.executeOperation();
    }
  }

  evalExpression() {
    const expression = this.props.value;
    let result = Number.NaN;

    try {
      result = eval(expression);
    } catch (error) {
      result = Number.NaN;
    }

    this.calculatorHistoryPush({
      text: `${expression} = ${result.toFixed(2)}`,
      value: result,
    });

    this.props.onChange(result);
  }

  calculatorHistoryPush(historyItem) {
    const history = this.state.history;
    if (history.length === Calculator.HISTORY_SIZE) {
      history.shift();
    }

    history.push(historyItem);
  }

  executeOperation() {
    if (this.state.operation === null) {
      return Number.NaN;
    }

    let result = Number.NaN;
    let secondArgument = parseFloat(this.props.value);
    /** Unar operations */
    if (this.state.firstArgumentValue === null) {

      switch (this.state.operation) {
        case '1/x':
          result = 1 / secondArgument;
          break;
      }

      this.calculatorHistoryPush({
        text: `1 / ${secondArgument} = ${result.toFixed(2)}`,
        value: result,
      });

    } else {
      let firstArgument = parseFloat(this.state.firstArgumentValue);
      if (this.state.availableRepeat) {
        [firstArgument, secondArgument] = [secondArgument, firstArgument];
      }

      switch (this.state.operation) {
        case '*':
          result = firstArgument * secondArgument;
          break;

        case '-':
          result = firstArgument - secondArgument;
          break;

        case '+':
          result = firstArgument + secondArgument;
          break;

        case '/':
          result = firstArgument / secondArgument;
          break;
      }

      if (this.state.availableRepeat === false) {
        this.setState({
          availableRepeat: true,
          firstArgumentValue: secondArgument,
        });
      }

      this.calculatorHistoryPush({
        text: `${firstArgument} ${this.state.operation} ${secondArgument} = ${result.toFixed(2)}`,
        value: result,
      });
    }

    this.props.onChange(result);
    return result;
  }

  handleOKTap() {
    if (this.props.onClose !== null) {
      this.props.onClose(this.props.value);
    }
  }

  handleHistoryMenuClick(event, value) {
    // Execute after changing data.
    this.clearAll(() => {
      this.props.onChange(value);
    });
  }

  handleCalculatorInputChange(value) {
    this.props.onChange(value);
  }

  handleOperationKeyPress(operationCode) {
    this.setOperation(operationCode);
  }

  handleCalculatorInputCleared() {
    this.setState({
      clearInputRequired: false,
      availableRepeat: false,
    });
  }

  handleClickOutside = (evt) => {
    const {onClose, value} = this.props;
    onClose && onClose(value);
  }

  renderCalculatorTypeMenu() {
    if (this.state.calculatorTypeMenuVisible === false) {
      return null;
    }

    return (
      <Menu desktop={true}>
        <MenuItem
          key={0}
          onClick={() => this.setState({isExpressionCalculator: !this.state.isExpressionCalculator})}
          primaryText={'формульный калькулятор'}
          checked={this.state.isExpressionCalculator}
          innerDivStyle={Calculator.MENU_ITEM_INNER_DIV_STYLE}/>

        <MenuItem
          key={1}
          onClick={() => this.setState({isMicroCalculator: !this.state.isMicroCalculator})}
          primaryText={'микрокалькулятор'}
          checked={this.state.isMicroCalculator}
          innerDivStyle={Calculator.MENU_ITEM_INNER_DIV_STYLE}/>
      </Menu>
    );
  }

  renderHistoryMenu() {
    if (this.state.historyMenuVisible === false) {
      return null;
    }

    return (
      <Menu desktop={true} onChange={(event, value) => {
        this.handleHistoryMenuClick(event, value);
      }}>
        {this.state.history.map((historyItem, key) => {
          return (<MenuItem
            key={key}
            primaryText={historyItem.text}
            value={historyItem.value}
            innerDivStyle={Calculator.MENU_ITEM_INNER_DIV_STYLE}
          />);
        })}
      </Menu>
    );
  }

  render() {

    const {classes, position, visible} = this.props;

    if (visible === false) {
      return null;
    }

    const calculatorClassNames = classnames([classes.calculator, classes[this.props.position]]);

    const keyboardRowClassNames = classnames({[classes.row]: true, [classes.rowHidden]: this.state.isMicroCalculator});

    return (
      <div className={calculatorClassNames}>
        <div className={classes.row}>
          <CalculatorButton
            icon={<PlayArrow style={{width: '1em', height: '1em'}}/>}
            onClick={() => {
              this.setState({calculatorTypeMenuVisible: !this.state.calculatorTypeMenuVisible});
            }}
            menu={this.renderCalculatorTypeMenu()}/>

          <CalculatorInput
            isExpression={this.state.isExpressionCalculator}
            value={this.props.value.toString()}
            onRemoveKeyPress={() => {
              this.removeLast();
            }}
            onPercentsKeyPress={() => {
              this.applyPercents();
            }}
            onOperationKeyPress={(operationCode) => {
              this.handleOperationKeyPress(operationCode);
            }}
            onChange={(value) => {
              this.handleCalculatorInputChange(value);
            }}
            onMenuToggleClick={() => {
              this.setState({historyMenuVisible: !this.state.historyMenuVisible});
            }}
            onInputCleared={() => {
              this.handleCalculatorInputCleared();
            }}
            onEqualSignPres={() => {
              this.calculate();
            }}
            clearInputRequired={this.state.clearInputRequired}
            menu={this.renderHistoryMenu()}
          />
        </div>

        <div className={keyboardRowClassNames}>
          <CalculatorButton text={'7'} onClick={() => {
            this.appendExpression('7');
          }}/>
          <CalculatorButton text={'8'} onClick={() => {
            this.appendExpression('8');
          }}/>
          <CalculatorButton text={'9'} onClick={() => {
            this.appendExpression('9');
          }}/>
          <CalculatorButton text={'+'} onClick={() => {
            this.setOperation('+');
          }} red={true}/>
          <CalculatorButton text={'+/-'} onClick={() => {
            this.swapSign();
          }} disabled={this.state.isExpressionCalculator}/>
          <CalculatorButton text={'C'} onClick={() => {
            this.clearAll();
          }} red={true}/>
        </div>

        <div className={keyboardRowClassNames}>
          <CalculatorButton text={'4'} onClick={() => {
            this.appendExpression('4');
          }}/>
          <CalculatorButton text={'5'} onClick={() => {
            this.appendExpression('5');
          }}/>
          <CalculatorButton text={'6'} onClick={() => {
            this.appendExpression('6');
          }}/>
          <CalculatorButton text={'-'} onClick={() => {
            this.setOperation('-');
          }} red={true}/>
          <CalculatorButton text={'%'} onClick={() => {
            this.applyPercents();
          }} disabled={this.state.isExpressionCalculator}/>
          <CalculatorButton text={'CE'} onClick={() => {
            this.clearExpression();
          }} red={true}/>
        </div>

        <div className={keyboardRowClassNames}>
          <CalculatorButton text={'1'} onClick={() => {
            this.appendExpression('1');
          }}/>
          <CalculatorButton text={'2'} onClick={() => {
            this.appendExpression('2');
          }}/>
          <CalculatorButton text={'3'} onClick={() => {
            this.appendExpression('3');
          }}/>
          <CalculatorButton text={'*'} onClick={() => {
            this.setOperation('*');
          }} red={true}/>
          <CalculatorButton text={'1/x'} onClick={() => {
            this.inverse();
          }}/>
          <CalculatorButton icon={<ArrowBack style={{width: '1em', height: '1em'}}/>} onClick={() => {
            this.removeLast();
          }}/>
        </div>

        <div className={keyboardRowClassNames}>
          <CalculatorButton text={'0'} onClick={() => {
            this.appendExpression('0');
          }}/>
          <CalculatorButton text={'00'} onClick={() => {
            this.appendExpression('00');
          }}/>
          <CalculatorButton text={'.'} onClick={() => {
            this.appendExpression('.');
          }}/>
          <CalculatorButton text={'/'} onClick={() => {
            this.setOperation('/');
          }} red={true}/>
          <CalculatorButton text={'='} onClick={() => {
            this.calculate();
          }} red={true}/>
          <CalculatorButton text={'OK'} onClick={() => {
            this.handleOKTap();
          }} red={true}/>
        </div>
      </div>
    );
  }
}

export default withStyles(ReactClickOutside(Calculator));
