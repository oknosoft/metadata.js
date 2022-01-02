import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import cn from 'classnames';

export default function InputReadOnly(props) {
  const {_meta, isTabular, classes, extClasses, className, fullWidth, inputValue, ...other} = props;
  if(isTabular) {
    return <div>
      <input
        type="text"
        value={inputValue}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_meta.synonym || _meta.tooltip}
        readOnly
      />
    </div>;
  }

  if(other.fullWidth === undefined) {
    other.fullWidth = true;
  }
  return <FormControl
      className={extClasses && extClasses.control ? '' : cn(classes.formControl, className, props.bar && classes.barInput)}
      classes={extClasses && extClasses.control ? extClasses.control : null}
      onDoubleClick={null}
      {...other}
    >
      {props.label_position != 'hide' && <InputLabel classes={extClasses && extClasses.label ? extClasses.label : null}>
        {_meta.synonym}
      </InputLabel>}
      <Input
        classes={Object.assign({input: classes.input}, extClasses && extClasses.input)}
        value={inputValue}
        readOnly
      />
    </FormControl>;

}
