import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';

export default function Confirm({text, html, title, children, handleOk, handleCancel, open, initFullScreen, actions, hide_actions, ...others}) {
  if(typeof text === 'string') {
    if(text.includes('<') && text.includes('/>')) {
      html = text;
      text = '';
    }
    else if(text.includes('\n')) {
      html = text.replace('\n', '<br/>');
      text = '';
    }
  }
  const act = React.useMemo(() => {
    if(!actions && !hide_actions) {
      return <>
        <Button key="cancel" onClick={handleCancel} color="primary">Отмена</Button>
        <Button key="ok" onClick={handleOk} color="primary">Ок</Button>
      </>;
    }
    else if (typeof actions === 'function') {
      return actions({handleOk, handleCancel});
    }
    return actions || null;
  }, []);
  
  return <Dialog
    open={open}
    initFullScreen={initFullScreen}
    title={title}
    onClose={handleCancel}
    actions={act}
    {...others}
  >
    {text && <DialogContentText>{text}</DialogContentText>}
    {html && <div dangerouslySetInnerHTML={{__html: html}}/>}
    {children}
  </Dialog>;
}

Confirm.propTypes = {
  title: PropTypes.node.isRequired,
  text: PropTypes.node,
  node: PropTypes.node,
  html: PropTypes.string,
  children: PropTypes.node,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
  initFullScreen: PropTypes.bool,
};
