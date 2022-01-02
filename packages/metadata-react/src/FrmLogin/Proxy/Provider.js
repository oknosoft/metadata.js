import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import providers from './providers';
import Autocomplete from '../../DataField/Autocomplete';
import withStyles from './styles';



function Provider({provider = 'couchdb', changeProvider, pkeys, classes}) {
  const value = pkeys.find(({value}) => value === provider);
  return <Autocomplete options={pkeys} label="Провайдер" onChange={(event, value) => changeProvider(value.value)} value={value} />;
}

export default withStyles(Provider);
