import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

import ListboxComponent from './ListboxComponent';
import withStyles, {extClasses} from '../../DataField/stylesPropertyGrid';


const renderGroup = (params) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
];

function FieldComponent({classes, label, fullWidth, disableClearable, ...other}) {

  const ext = extClasses(classes);

  //renderGroup={renderGroup}
  //groupBy={(option) => option[0].toUpperCase()}
  //(params) => <TextField {...params}  label={label} />

  if(typeof disableClearable !== 'boolean') {
    disableClearable = true;
  }

  return (
    <Autocomplete
      classes={{listbox: classes.listbox}}
      disableListWrap
      disableClearable={disableClearable}
      ListboxComponent={ListboxComponent}
      getOptionLabel={(v) => (v && v.name) || ''}
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
