import React from 'react';
import Popover from '@material-ui/core/Popover';
import MenuPrint from '../DynList/MenuPrint'

export default function Popup({anchorEl, anchorOrigin, transformOrigin, handleClose, Component, _mgr, handlePrint, ...other}) {

  if(!Component && _mgr && handlePrint) {
     return <MenuPrint
       anchorEl={anchorEl}
       handleClose={handleClose}
       _mgr={_mgr}
       handlePrint={(model) => {
         handleClose();
         handlePrint(model);
       }}
       {...other}
     />;
  }

  if (!anchorOrigin) {
    anchorOrigin = {vertical: 'top', horizontal: 'left'};
  }
  if (!transformOrigin) {
    transformOrigin = {vertical: 'top', horizontal: 'right'};
  }
  if(!Component) {
    Component = () => 'The content of the Popover.';
  }
     
  return <Popover
    open={true}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
  >
    <Component {...other} />
  </Popover>;
}
