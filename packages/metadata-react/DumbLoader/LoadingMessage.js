import React from "react";
import PropTypes from "prop-types";
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Typography from '@material-ui/core/Typography/Typography';

function SimpleLoadingMessage({classes, text}) {
  return (
    <div className={classes.message}>
      <div className={classes.text}>{text || <div><CircularProgress size={24}/> загрузка...</div>}</div>
    </div>
  );
}

SimpleLoadingMessage.propTypes = {
  text: PropTypes.node,
  classes: PropTypes.object.isRequired,
}

export default withStyles({
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: 300,
  },
  text: {
    padding: '.4em 1em',
    //fontSize: '1.2em',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    maxWidth: '70%',
  },
})(SimpleLoadingMessage);
