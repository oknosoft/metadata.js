import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';

export default function Confirm({text, title, children, handleOk, handleCancel, open}) {
  return <Dialog
    open={open}
    title={title}
    onClose={handleCancel}
    actions={[
      <Button key="cancel" onClick={handleCancel} color="primary">Отмена</Button>,
      <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
    ]}
  >
    {text && <DialogContentText>{text}</DialogContentText>}
    {children}
  </Dialog>;
}

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  children: PropTypes.node,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
