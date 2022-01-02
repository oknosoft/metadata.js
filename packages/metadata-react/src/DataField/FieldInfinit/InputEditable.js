import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputBase from '@mui/material/InputBase';
import Input from '@mui/material/Input';
import cn from 'classnames';

export default function InputEditable({iprops, ...props}) {
  const {_meta, isTabular, classes, extClasses, className, fullWidth, mandatory, onClick, value} = props;
  const {inputProps, InputProps, InputLabelProps, id, ...other} = iprops;
  const attr = {
    title: _meta.tooltip || _meta.synonym,
  }
  if(_meta.mandatory || mandatory) {
    attr.required = true;
  }
  if(other.fullWidth === undefined) {
    other.fullWidth = true;
  }

  if(isTabular) {
    return <InputBase
      placeholder="Введите текст для поиска"
      margin="none"
      inputProps={inputProps}
      {...InputProps}
      {...other}
      {...attr}
    />;
  }

  return <FormControl
    className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, props.bar && classes.barInput)}
    classes={extClasses && extClasses.control ? extClasses.control : null}
    onDoubleClick={null}
    onClick={onClick}
    {...other}
  >
    {props.label_position != 'hide' && <InputLabel
      classes={extClasses && extClasses.label ? extClasses.label : null}
      {...InputLabelProps}>{_meta.synonym}
    </InputLabel>}
    <Input
      classes={
        Object.assign({input: cn(classes.input, attr.required && (!value || value.empty()) && classes.required)}, extClasses && extClasses.input)
      }
      inputProps={inputProps}
      {...InputProps}
    />
  </FormControl>;
}

