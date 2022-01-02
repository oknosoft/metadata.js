import React from "react";
import PropTypes from "prop-types";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import withStyles from './styles';

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

export default withStyles(SimpleLoadingMessage);
