import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import cn from 'classnames';
import Adornment from './Adornment';


export default function InpitEditable(props) {
  const {_meta, _obj, _fld, classes, extClasses, fullWidth, mandatory, label_position, inputRef, inputProps, labelProps} = props;
  const value = _obj[_fld];
  const attr = {
    title: _meta.tooltip || _meta.synonym,
  }
  if(_meta.mandatory) {
    attr.required = true;
  }

  if(props.isTabular) {
    return <input
      type="text"
      ref={inputRef}
      placeholder="Введите текст для поиска"
      {...inputProps}
      {...attr}
    />;
  }

  return (
    <FormControl
      className={extClasses && extClasses.control ? '' : cn(classes.formControl, props.bar && classes.barInput)}
      classes={extClasses && extClasses.control ? extClasses.control : null}
      fullWidth={fullWidth}
      onDoubleClick={null}
      {...attr}
    >
      {label_position != 'hide' &&
      <InputLabel
        htmlFor={`downshift-${_fld}`}
        {...labelProps}
        classes={extClasses && extClasses.label ? extClasses.label : null}
      >{_meta.synonym}</InputLabel>}
      <Input
        id={`downshift-${_fld}`}
        {...inputProps}
        inputRef={inputRef}
        classes={
          Object.assign({input: cn(classes.input, attr.required && (!value || value.empty()) && classes.required)}, extClasses && extClasses.input)
        }
        endAdornment={props.inputFocused &&
          <Adornment
            classes={classes}
            title={value && value._manager.frm_obj_name}
            isOpen={props.isOpen}
            handleToggle={props.handleToggle}
          />
        }
      />
    </FormControl>
    );
}

