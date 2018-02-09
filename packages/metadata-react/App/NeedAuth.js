// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
//import {DialogActions} from 'material-ui/Dialog';
import Helmet from 'react-helmet';
import AppContent from './AppContent';

const ltitle = 'Необходима авторизация';

function NeedAuth(props) {
  const {handleNavigate, handleIfaceState, title} = props;

  if(title != ltitle) {
    handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
    return false;
  }

  const margin = {marginTop: 16, marginBottom: 16};
  return <AppContent>
    <Helmet title="Пользователь не авторизован"/>
    <div style={{marginTop: 16}}>
      <Typography variant="display1" component="h1" color="primary" style={margin}>Пользователь не авторизован</Typography>
      <Typography color="inherit" style={margin}>Для доступа к данному разделу, необходима авторизация</Typography>
      <Button color="primary" size="small" onClick={() => handleNavigate('/login')}>Перейти на страницу авторизации</Button>
    </div>
  </AppContent>;
}

NeedAuth.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default NeedAuth;
