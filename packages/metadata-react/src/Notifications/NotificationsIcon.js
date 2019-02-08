/**
 *
 *
 * @module NotificationsIcon
 *
 * Created by Evgeniy Malyarov on 17.09.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsIconActive from '@material-ui/icons/NotificationsActive';
import NotificationsIconNone from '@material-ui/icons/NotificationsNone';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  badge: {
    right: -15,
    // The border color match the background color.
    border: `1px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
      }`,
  },
  root: {
    marginRight: theme.spacing.unit,
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
