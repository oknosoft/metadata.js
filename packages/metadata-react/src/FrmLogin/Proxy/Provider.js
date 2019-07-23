import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import providers from './providers';
import withStyles from './styles';
const keys = Object.keys(providers);

function Provider({provider = 'couchdb', changeProvider, classes}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {Icon, name} = providers[provider];
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemClick(event, option) {
    changeProvider(option);
    setAnchorEl(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <List component="nav" aria-label="Select provider">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Провайдер авторизации"
          onClick={handleClickListItem}
        >
          <ListItemIcon><Icon key="icon" className={classes.small}/></ListItemIcon>
          <ListItemText primary={name} secondary="Провайдер авторизации" />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {keys.map((option, index) => (
          <MenuItem
            key={`opt-${index}`}
            selected={option === provider}
            onClick={event => handleMenuItemClick(event, option)}
          >
            {providers[option].name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default withStyles(Provider);
