import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import providers from './providers';
import Autocomplete from '../../DataField/Autocomplete';
import withStyles from './styles';



function Provider({provider = 'couchdb', changeProvider, pkeys, classes}) {
  const value = pkeys.find(({value}) => value === provider);
  return <Autocomplete options={pkeys} label="Провайдер" onChange={(event, value) => changeProvider(value.value)} value={value} />;
}

export default withStyles(Provider);
