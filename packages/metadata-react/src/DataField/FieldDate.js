/**
 * ### Поле ввода даты
 *
 * @module FieldDate
 *
 * Created 22.09.2016
 */

import React from 'react';
import AbstractField from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

class FieldDate extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const m = moment(this.state.value);
    this._type = this._meta.type.date_part.includes('time') ? 'datetime-local' : 'date';
    this.state.value = m.format(this._type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm');
  }

  onChange = ({target}) => {
    this.setState({value: target.value});
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = moment(target.value).toDate();
    handleValueChange && handleValueChange(_obj[_fld]);
  };

  render() {
    let {props, state: {value}, _meta, _type, onChange, read_only} = this;
    const {_obj, _fld, classes, extClasses, className, fullWidth, InputProps, label_position, bar, isTabular, dyn_meta, ...other} = props;
    const attr = {
      title: _meta.tooltip || _meta.synonym,
    }
    Object.assign(other, {value, onChange});
    if(_meta.mandatory) {
      attr.required = true;
      if(!other.value) {
        other.inputProps = Object.assign(other.inputProps || {}, {className: classes.required});
      }
    }
    if(read_only) {
      other.readOnly = true;
    }

    return this.isTabular ?
      <input type={_type} {...attr} {...other}/>
      :
      <FormControl
        className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, props.bar && classes.barInput)}
        classes={extClasses && extClasses.control ? extClasses.control : null}
        fullWidth={fullWidth}
        {...attr}
      >
        {label_position != 'hide' &&
        <InputLabel
          classes={extClasses && extClasses.label ? extClasses.label : null}
          shrink
        >{_meta.synonym}</InputLabel>}
        <Input
          type={_type}
          {...other}
          classes={
            Object.assign({
              input: cn(classes.input, attr.required && !other.value && classes.required)
            }, extClasses && extClasses.input)
          }
        />
      </FormControl>;
  }
}

export default withStyles(FieldDate);
