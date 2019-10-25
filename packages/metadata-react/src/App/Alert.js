import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';

export default function Alert({text, title, html, handleOk, open, initFullScreen}) {
  return <Dialog
    open={open}
    initFullScreen={initFullScreen}
    title={title}
    onClose={handleOk}
    actions={[
      <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
    ]}
  >
    {text && <DialogContentText>{text}</DialogContentText>}
    {html && <div dangerouslySetInnerHTML={{__html: html}}/>}
  </Dialog>;
}

Alert.propTypes = {
  title: PropTypes.node.isRequired,
  text: PropTypes.node,
  html: PropTypes.string,
  handleOk: PropTypes.func.isRequired,
  open: PropTypes.bool,
  initFullScreen: PropTypes.bool,
};
