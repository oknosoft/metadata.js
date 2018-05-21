import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';

import classnames from 'classnames';

const styles = theme => ({
  avatar: {
    margin: 10,
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon, & $secondary': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
  secondary: {},
});

function AttachmentsList (props) {
  const {classes, _obj} = props;
  const list = [];
  if(_obj._attachments){
    for(const name in _obj._attachments) {
      const att = _obj._attachments[name];
      list.push(
        <MenuItem key={name}
                  className={classes.menuItem}
                  onClick={() => props.handleSelect(name)}
                  onDoubleClick={() => props.handleDownload(name)}
        >
          <Avatar className={classes.avatar}>{name.substr(name.lastIndexOf('.') + 1, 3)}</Avatar>
          <ListItemText inset
                        classes={{primary: classes.primary, secondary: classes.secondary}}
                        primary={name.substr(0, name.lastIndexOf('.'))}
                        secondary={`${(att.length/1000).round(2)}Kb, ${att.content_type}`}
          />
        </MenuItem>
      );
    }
  }
  else {
    list.push(
      <MenuItem key="empty" className={classes.menuItem}>
        <Avatar className={classes.avatar}>X</Avatar>
        <ListItemText classes={{primary: classes.primary}} inset primary="Нет вложенных файлов"/>
      </MenuItem>
    );
  }

  return <MenuList>{list}</MenuList>;
};

AttachmentsList.propTypes = {
  _obj: PropTypes.object,
  handleDownload: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default withStyles(styles)(AttachmentsList);

