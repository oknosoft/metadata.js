import React from "react";
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

function SimpleLoadingMessage({classes, text}) {
  return (
    <div className={classes.message}>
      <div className={classes.text}>
        {text || <span><CircularProgress component="span" className={classes.progress} size={24}/> загрузка...</span>}
      </div>
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
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    maxWidth: '70%',
  },
  progress: {
    verticalAlign: 'middle',
    marginRight: 8,
  }
})(SimpleLoadingMessage);
