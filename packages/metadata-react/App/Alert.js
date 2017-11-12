import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

export default function Alert({text, title, handleOk, open}) {
  return <Dialog open={open} onRequestClose={props.handleOk}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{text}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleOk} color="primary">Ок</Button>
    </DialogActions>
  </Dialog>;
}

Alert.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
