import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { MenuList, MenuItem } from 'material-ui/Menu';

import { ListItemIcon, ListItemText } from 'material-ui/List';


import { withStyles } from 'material-ui/styles';

import Avatar from 'material-ui/Avatar';

import classnames from 'classnames';

const styles = theme => ({
  avatar: {
    margin: 10,
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

function AttachmentsList ({classes}) {
  return (
    <MenuList>
      <MenuItem className={classes.menuItem}>
        <Avatar className={classes.avatar}>doc</Avatar>
        <ListItemText classes={{ primary: classes.primary }} inset primary="Sent mail" />
      </MenuItem>
      <MenuItem className={classes.menuItem}>
        <Avatar className={classes.avatar}>xls</Avatar>
        <ListItemText classes={{ primary: classes.primary }} inset primary="Drafts" />
      </MenuItem>
      <MenuItem className={classes.menuItem}>
        <Avatar className={classes.avatar}>txt</Avatar>
        <ListItemText classes={{ primary: classes.primary }} inset primary="Inbox" />
      </MenuItem>
    </MenuList>
  );
};

AttachmentsList.propTypes = {
  _obj: PropTypes.object,
  handleDownload: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default withStyles(styles)(AttachmentsList);

