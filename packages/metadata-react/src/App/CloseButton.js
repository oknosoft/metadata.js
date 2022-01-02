import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tip from './Tip';

export default function CloseButton(props) {
  return <Tip title={props.title || 'Закрыть форму'}>
    <IconButton onClick={props.handleClose}><CloseIcon/></IconButton>
  </Tip>;
}

CloseButton.propTypes = {
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};
