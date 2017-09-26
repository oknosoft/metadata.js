/**
 *
 *
 * @module DateRange
 *
 * Created by Evgeniy Malyarov on 25.09.2017.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconDateRange from 'material-ui-icons/DateRange';

import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import ruRU from 'rc-calendar/lib/locale/ru_RU';
import 'rc-calendar/assets/index.css';

import {isValidRange, formatRange} from '../DataField/FieldDateRange';


export default class DateRange extends PureComponent {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;

    this.state = {
      value: [moment(_obj[`${_fld}_from`]), moment(_obj[`${_fld}_till`])],
      hoverValue: [moment(_obj[`${_fld}_from`]), moment(_obj[`${_fld}_till`])],
    };
  }

  handleHoverChange = (hoverValue) => {
    this.setState({hoverValue});
  };

  handleChange = (value) => {
    if(value) {
      const {props, _meta} = this;
      const {_obj, _fld, handleChange} = props;
      if(isValidRange(value)) {
        _obj[`${_fld}_from`] = value[0].toDate();
        _obj[`${_fld}_till`] = value[1].toDate();
      }
      this.setState({value});
      handleChange(value);
    }
  };

  render() {

    const {props, state, _meta, isTabular, handleChange, handleChangeRaw} = this;
    const {_fld, classes, fullWidth} = props;
    const tooltip = formatRange(state.value) || 'Настройка периода';

    //locale={cn ? zhCN : enUS}
    //disabledTime={disabledTime}
    //timePicker={timePickerElement}

    const calendar = (
      <RangeCalendar
        hoverValue={state.hoverValue}
        defaultValue={state.value}
        onHoverChange={this.handleHoverChange}
        showOk
        locale={ruRU}
        dateInputPlaceholder={['Начало', 'Конец']}
      />
    );

    return (
      <Picker
        value={state.value}
        onChange={this.handleChange}
        animation="slide-up"
        calendar={calendar}
      >
        {
          ({value}) => {
            return (
              <IconButton title={tooltip}>
                <IconDateRange/>
              </IconButton>
            );
          }
        }
      </Picker>);
  }

}
