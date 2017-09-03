import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

export default function Confirm({text, title, handleOk, handleCancel, open}) {

  return (
    <Dialog open={open} onRequestClose={handleCancel}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Отмена
        </Button>
        <Button onClick={handleOk} color="primary">
          Ок
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
