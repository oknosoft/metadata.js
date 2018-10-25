import React from 'react';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input/Input';
import cn from 'classnames';

export default function InpitReadOnly(props) {
  const {_meta, classes} = props;
  return props.isTabular ?
    <div>
      <input
        type="text"
        value={props.inputValue}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_meta.synonym || _meta.tooltip}
        readOnly
      />
    </div>
    :
    <div className={classes.root}>
      <FormControl
        className={cn(classes.formControl, props.bar && classes.barInput)}
        fullWidth={props.fullWidth}
        disabled
      >
        {props.label_position != 'hide' && <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>}
        <Input
          value={props.inputValue}
          classes={{input: classes.input}}
          placeholder={props.label_position == 'hide' ? (_meta.tooltip || _meta.synonym) : props._fld}
        />
      </FormControl>
    </div>;
}
