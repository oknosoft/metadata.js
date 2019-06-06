import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import cn from 'classnames';
import Adornment from './Adornment';


export default function InpitEditable(props) {
  const {_meta, _obj, _fld, classes, fullWidth, mandatory, label_position, inputRef, inputProps, labelProps} = props;
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
      className={cn(classes.formControl, props.bar && classes.barInput)}
      fullWidth={fullWidth}
      onDoubleClick={null}
      {...attr}
    >
      {label_position != 'hide' && <InputLabel htmlFor={`downshift-${_fld}`} {...labelProps}>{_meta.synonym}</InputLabel>}
      <Input
        id={`downshift-${_fld}`}
        {...inputProps}
        inputRef={inputRef}
        classes={{input: classes.input}}
        endAdornment={props.inputFocused &&
        <Adornment
          classes={classes}
          title={_obj[_fld]._manager.frm_obj_name}
          isOpen={props.isOpen}
          handleToggle={props.handleToggle}
        />
        }
      />
    </FormControl>
    );
}

