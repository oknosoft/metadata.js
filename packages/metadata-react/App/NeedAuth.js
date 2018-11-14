// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Helmet from 'react-helmet';
import AppContent from './AppContent';

export const ltitle = 'Необходима авторизация';
const htitle = 'Пользователь не авторизован';

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
    <Helmet title={htitle}>
      <meta name="description" content={ltitle} />
      <meta property="og:title" content={htitle} />
      <meta property="og:description" content={ltitle} />
    </Helmet>
    <div style={{marginTop: 16}}>
      <Typography variant="h4" component="h1" color="primary" style={margin}>Пользователь не авторизован</Typography>
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
