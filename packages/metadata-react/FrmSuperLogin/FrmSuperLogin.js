import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TabsLogin from './TabsLogin';
import Profile from './Profile';


export default function FrmSuperLogin({ classes, ...other}) {
  return [
    <Helmet key="helmet" title="Профиль пользователя" />,
    other.user.logged_in ? < Profile key="profile" {...other} /> : < TabsLogin key="profile" {...other} />
  ];
};
