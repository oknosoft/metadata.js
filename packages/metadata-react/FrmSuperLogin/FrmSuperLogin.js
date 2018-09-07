import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TabsLogin from './TabsLogin';
import Profile from './Profile';
import Reset from './Reset';


export default function FrmSuperLogin({ classes, ...other}) {
  const {token} = other.match.params;
  return [
    <Helmet key="helmet" title="Профиль пользователя">
      <meta name="description" content="Вход в систему"/>
      <meta property="og:title" content="Профиль пользователя"/>
      <meta property="og:description" content="Вход в систему"/>
    </Helmet>,
    token ?
      <Reset key="profile" {...other}/>
      :
      (
        other.user.logged_in ?
          <Profile key="profile" {...other}/>
          :
          <TabsLogin key="profile" {...other}/>
      )
  ];
};
