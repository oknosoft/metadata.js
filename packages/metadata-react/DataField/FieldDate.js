/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import DatePicker from 'react-datepicker/dist/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import withStyles from './styles';

import AbstractField from './AbstractField';

const formater = new global.Intl.DateTimeFormat();


class CustomField extends Component {


  render() {
    const {classes, _fld, _meta, fullWidth, ...others} = this.props;

    return <FormControl
      className={classes.formControl}
      fullWidth={fullWidth}
      margin="dense">
      <InputLabel>{_meta.synonym}</InputLabel>
      <Input {...others} />
    </FormControl>;
  }

  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string
  };
}

const StyledCustomField = withStyles(CustomField);

export default class FieldDate extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;

    this.state = {
      controlledDate: moment(_obj[_fld]),
    };
  }

  handleChange = (newValue) => {
    if(newValue){
      const {props, _meta} = this;
      const {_obj, _fld, handleValueChange} = props;
      _obj[_fld] = newValue.toDate();
      this.setState({controlledDate: newValue});
      handleValueChange && handleValueChange(_obj[_fld]);
    }
  };

  handleChangeRaw = ({target}) => {
    if(target.value === 'tomorrow') {
      const tomorrow = moment().add(1, 'day');
      const formatted = tomorrow.format(this.dateFormat);
      target.value = formatted;
      this.handleChange(tomorrow);
    }
  };

  componentDidMount() {
    const {input} = this._picker;
    const node = ReactDOM.findDOMNode(input);
    input.focus = () => node.focus();
  }

  render() {

    const {props, state, _meta, isTabular, handleChange, handleChangeRaw} = this;
    const {_fld, classes, fullWidth} = props;

    // return <TextField
    //   name={props._fld}
    //   type="date"
    //   title={tooltip || synonym}
    //   value={state.controlledDate}
    //   onChange={handleChange}
    // />;

    // popperPlacement="bottom-end"
    // popperModifiers={{
    //   offset: {
    //     enabled: true,
    //       offset: '5px, 10px'
    //   },
    //   preventOverflow: {
    //     enabled: true,
    //       escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
    //       boundariesElement: 'viewport'
    //   }
    // }}
    // showYearDropdown

    return isTabular ?
      <DatePicker
        ref={(el) => this._picker = el}
        todayButton={'Сегодня'}
        locale="ru-RU"
        disabledKeyboardNavigation
        placeholderText={_meta.tooltip || _meta.synonym}
        selected={state.controlledDate}
        onChange={handleChange}
        onChangeRaw={handleChangeRaw}
      />
      :
      <DatePicker
        ref={(el) => this._picker = el}
        customInput={<StyledCustomField _fld={_fld} _meta={_meta} classes={classes} fullWidth={fullWidth} />}
        todayButton={'Сегодня'}
        locale="ru-RU"
        disabledKeyboardNavigation
        placeholderText={_meta.tooltip || _meta.synonym}
        selected={state.controlledDate}
        onChange={handleChange}
        onChangeRaw={handleChangeRaw}
      />;
  }

}
