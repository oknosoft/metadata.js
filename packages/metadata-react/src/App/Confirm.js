import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';

export default function Confirm({text, html, title, children, handleOk, handleCancel, open, initFullScreen}) {
  return <Dialog
    open={open}
    initFullScreen={initFullScreen}
    title={title}
    onClose={handleCancel}
    actions={[
      <Button key="cancel" onClick={handleCancel} color="primary">Отмена</Button>,
      <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
    ]}
  >
    {text && <DialogContentText>{text}</DialogContentText>}
    {html && <div dangerouslySetInnerHTML={{__html: html}}/>}
    {children}
  </Dialog>;
}

Confirm.propTypes = {
  title: PropTypes.node.isRequired,
  text: PropTypes.node,
  html: PropTypes.string,
  children: PropTypes.node,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
  initFullScreen: PropTypes.bool,
};
