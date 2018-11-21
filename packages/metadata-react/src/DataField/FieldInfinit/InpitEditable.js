import React from 'react';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input/Input';
import cn from 'classnames';
import Adornment from './Adornment';


export default function InpitEditable(props) {
  const {_meta, _obj, _fld, classes, fullWidth, mandatory, label_position, inputRef, inputProps, labelProps} = props;

  return props.isTabular ?
    <input
      type="text"
      title={_meta.tooltip || _meta.synonym}
      placeholder="Введите текст для поиска"
      {...inputProps}
      ref={inputRef}
    />
    :
    <FormControl
      className={cn(classes.formControl, props.bar && classes.barInput)}
      fullWidth={fullWidth}
      onDoubleClick={null}
    >
      {label_position != 'hide' && <InputLabel {...labelProps}>{_meta.tooltip || _meta.synonym}</InputLabel>}
      <Input
        {...inputProps}
        inputRef={inputRef}
        classes={{input: classes.input}}
        placeholder={label_position == 'hide' ? (_meta.tooltip || _meta.synonym) : _fld}
        endAdornment={props.focused &&
        <Adornment
          classes={classes}
          title={_obj[_fld]._manager.frm_obj_name}
          onClick={props.handleOpenObj}
          isOpen={props.isOpen}
          handleToggle={props.handleToggle}
        />
        }
      />
    </FormControl>;
}
