import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
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
    <TextField
      disabled
      className={cn(classes.root, classes.formControl, props.bar && classes.barInput)}
      fullWidth={props.fullWidth}
      label={props.label_position === 'hide' ? '' : _meta.synonym}
      title={_meta.tooltip || _meta.synonym}
      value={props.inputValue}
      classes={{input: classes.input}}
    />;
}
