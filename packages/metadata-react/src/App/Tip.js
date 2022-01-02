import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import {withStyles} from '@mui/material/styles';

const styles = ({typography}) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: typography.pxToRem(12),
    fontWeight: 400,
    border: '1px solid #dadde9',
  },
});

export function Tip({title, children, classes, ...others}) {
  return <Tooltip
    title={title}
    classes={{tooltip: classes.tooltip}}
    enterTouchDelay={600}
    leaveTouchDelay={2000}
    {...others}
  >
    <span>{children}</span>
  </Tooltip>;
}

Tip.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tip);
