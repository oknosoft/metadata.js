// @flow

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  content: {
    paddingTop: theme.spacing(4),
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
  [theme.breakpoints.up(980 + theme.spacing(4))]: {
    maxWidth: {
      maxWidth: 980,
    },
  }
});

function AppContent(props) {
  const { className, fullWidth, classes, children } = props;

  return <div className={cn(classes.content, !fullWidth && classes.maxWidth, className)}>{children}</div>;
}

AppContent.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default withStyles(styles)(AppContent);
