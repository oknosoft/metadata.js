/**
 *
 *
 * @module NotificationsIcon
 *
 * Created by Evgeniy Malyarov on 17.09.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsIconActive from '@mui/icons-material/NotificationsActive';
import NotificationsIconNone from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import {withStyles} from '@mui/styles';

const styles = ({palette, spacing}) => ({
  badge: {
    // The border color match the background color.
    border: `1px solid ${palette.type === 'light' ? palette.grey[200] : palette.grey[900]}`,
  },
  root: {
    marginRight: spacing(),
  }
});

function Icon({title, onClick, count, classes}) {
  return <IconButton title={title} onClick={onClick} classes={{root: classes.root}}>
    {
      count ?
        <Badge badgeContent={count > 99 ? 99 : count} color="primary" classes={{badge: classes.badge}}>
          <NotificationsIconActive color="error"/>
        </Badge>
        :
        <NotificationsIconNone color="inherit"/>
    }
  </IconButton>;
}

Icon.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Icon);
