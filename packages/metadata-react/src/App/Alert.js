import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from './Dialog';
import MarkdownElement from '../Markdown/MarkdownElementLight';

export default function Alert({text, title, html, markdown, Component, props, handleOk, open, initFullScreen, hide_btn, ...other}) {
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
  return <Dialog
    open={open}
    initFullScreen={initFullScreen}
    title={title}
    onClose={handleOk}
    actions={!hide_btn && [<Button key="ok" onClick={handleOk} color="primary">Ок</Button>]}
    {...other}
  >
    {text && <DialogContentText>{text}</DialogContentText>}
    {html && <div dangerouslySetInnerHTML={{__html: html}}/>}
    {markdown && <MarkdownElement text={markdown} {...other}/>}
    {Component && <Component handleOk={handleOk} {...other} {...props}/>}
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
