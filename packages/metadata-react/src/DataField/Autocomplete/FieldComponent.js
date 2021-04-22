import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListSubheader from '@material-ui/core/ListSubheader';
import {Typography} from '@material-ui/core';

import ListboxComponent from './ListboxComponent';
import withStyles, {extClasses} from '../../DataField/stylesPropertyGrid';


const renderGroup = (params) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
];

function FieldComponent({classes, label, fullWidth, ...other}) {

  const ext = extClasses(classes);

  //renderGroup={renderGroup}
  //groupBy={(option) => option[0].toUpperCase()}

  //(params) => <TextField {...params}  label={label} />

  return (
    <Autocomplete
      classes={{listbox: classes.listbox}}
      disableListWrap
      disableClearable
      ListboxComponent={ListboxComponent}
      getOptionLabel={(v) => v.name}
      renderInput={({inputProps, InputProps, InputLabelProps, id, ...other}) => (
        <FormControl classes={ext.control} fullWidth={fullWidth} {...other}>
          <InputLabel classes={ext.label} {...InputLabelProps}>{label}</InputLabel>
          <Input classes={ext.input} inputProps={inputProps} {...InputProps} />
        </FormControl>
      )}
      renderOption={(option) => <Typography noWrap>{option.name}</Typography>}
      {...other}
    />
  );
}

export default withStyles(FieldComponent);
