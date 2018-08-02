import React from "react";
import PropTypes from "prop-types";

import withStyles from '@material-ui/core/styles/withStyles';

function SimpleLoadingMessage({classes, text}) {
  return (
    <div className={classes.message}>
      <div className={classes.text}>{text || "загрузка..."}</div>
    </div>
  );
}

SimpleLoadingMessage.propTypes = {
  text: PropTypes.string,
  classes: PropTypes.object.isRequired,
}

export default withStyles({
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 80px)'
  },
  text: {
    padding: '.4em 1em',
    fontSize: '1.2em',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0'
  },
})(SimpleLoadingMessage);
