import React from 'react';
import PropTypes from 'prop-types';
import NeedAuth from '../../App/NeedAuth';
import FrmLogin from './FrmLogin';

function Auth({dstyle, handleNavigate, handleIfaceState, title, offline}) {
  return <div style={dstyle}>
    <NeedAuth
      handleNavigate={handleNavigate}
      handleIfaceState={handleIfaceState}
      title={title}
      offline={offline}
      ComponentLogin={FrmLogin}
    />
  </div>;
}

Auth.propTypes = {
  dstyle: PropTypes.object,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  offline: PropTypes.bool.isRequired,
};

export default Auth;
