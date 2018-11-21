// @flow weak

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function Flask(props) {
  return <SvgIcon {...props} viewBox="0 0 120 120">
    <path d={`
    M0,0 l120,0 l0,4 l-120,0 l0,-4z
    M0,39 l120,0 l0,4 l-120,0 l0,-4z
    M0,79 l120,0 l0,4 l-120,0 l0,-4z
    M0,116 l120,0 l0,4 l-120,0 l0,-4z
    M0,0 0,120 l4,0 l0,-120 l-4,0z
    M116,0 l0,120 l4,0 l0,-120 l-4,0z
    M59,39 l0,80 l4,0 l0,-80 l-4,0z
    `}/>
  </SvgIcon>;
}
