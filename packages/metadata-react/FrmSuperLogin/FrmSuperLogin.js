import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TabsLogin from './TabsLogin';
import Profile from './Profile';


export default function FrmSuperLogin({ classes, ...other}) {
  return other.user.logged_in ?
    < Profile {...other} />
    :
    < TabsLogin {...other} />;
};
