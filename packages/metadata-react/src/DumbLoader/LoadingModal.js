import React from "react";
import PropTypes from "prop-types";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import withStyles from './styles';

function LoadingModal({classes, text, open, handleClose}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{style: {backgroundColor: 'rgba(0, 0, 0, 0.2)'}}}
    >
      <div className={classes.message}>
        <span className={classes.text}>
          <CircularProgress
            size={24}
            component="span"
            className={classes.progress}
          />{text || 'загрузка...'}</span>
      </div>
    </Modal>
  );
}

LoadingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  text: PropTypes.node,
  handleClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
}


export default withStyles(LoadingModal);
