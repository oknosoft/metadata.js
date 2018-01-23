import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {DialogContentText} from 'material-ui/Dialog';
import Dialog from './Dialog';

export default function Confirm({text, title, handleOk, handleCancel, open}) {
  return <Dialog
    open={open}
    title={title}
    onClose={handleCancel}
    actions={[
      <Button key="cancel" onClick={handleCancel} color="primary">Отмена</Button>,
      <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
    ]}
  >
    <DialogContentText>{text}</DialogContentText>
  </Dialog>;
}

Confirm.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
