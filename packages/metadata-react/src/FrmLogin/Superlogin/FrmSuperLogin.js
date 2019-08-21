import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';

import AppContent from '../../App/AppContent';
import TabsLogin from './TabsLogin';
import Profile from './Profile';
import Reset from './Reset';


export default function FrmSuperLogin({ classes, ...other}) {
  const {token} = other.match.params;
  return <AppContent>
    <Helmet title="Профиль пользователя">
      <meta name="description" content="Вход в систему"/>
      <meta property="og:title" content="Профиль пользователя"/>
      <meta property="og:description" content="Вход в систему"/>
    </Helmet>
    {
      token ?
        <Reset {...other}/>
        :
        (
          other.user.logged_in ?
            <Profile {...other}/>
            :
            <TabsLogin {...other}/>
        )
    }
  </AppContent>;
};
