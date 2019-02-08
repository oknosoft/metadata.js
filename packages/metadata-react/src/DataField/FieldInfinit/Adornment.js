
import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {prevent} from './InfiniteList';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


export default function Adornment({classes, title, onClick, isOpen, handleToggle}) {
  return <InputAdornment position="end">
    <IconButton
      tabIndex={-1}
      className={classes.icon}
      title={title}
      onClick={handleToggle}
      onMouseDown={prevent}
    >
      {isOpen ? <ExpandLess/> : <ExpandMore/>}
    </IconButton>
  </InputAdornment>;
}
