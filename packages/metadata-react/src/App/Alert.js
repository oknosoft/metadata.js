import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';

export default function Alert({text, title, handleOk, open}) {
  return <Dialog
    open={open}
    title={title}
    onClose={handleOk}
    actions={[
      <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
    ]}
  >
    <DialogContentText>{text}</DialogContentText>
  </Dialog>;
}

Alert.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
