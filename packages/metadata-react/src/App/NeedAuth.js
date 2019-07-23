// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppContent from './AppContent';
import TabsLogin from '../FrmLogin/TabsLogin';

import {compose} from 'redux';
import {withMeta, withPrm} from 'metadata-redux';

const DefaultLogin = compose(withMeta, withPrm)(({classes, ...other}) => < TabsLogin {...other} />);

function NeedAuth(props) {
  const {handleNavigate, handleIfaceState, title, idle, user, ComponentLogin} = props;
  const FrmLogin = ComponentLogin || DefaultLogin;
  const margin = {marginTop: 16, marginBottom: 16};
  return <AppContent>
    <div style={margin}>
      {!idle && <Typography variant="h4" component="h1" color="primary" style={margin}>Вход в систему</Typography>}
      {idle && <Typography variant="h4" component="h1" color="primary" style={margin}>Сеанс работы был прерван</Typography>}
      {!idle && (!user || !user.logged_in) && <Typography color="inherit" style={margin}>Для доступа к данному разделу, необходима авторизация</Typography>}
      {!idle && (user && user.logged_in) && <Typography color="inherit" style={margin}>Текущий пользователь</Typography>}
      {idle && <Typography color="inherit" style={margin}>Вы долгое время не совершали никаких действий, повторите вход в систему</Typography>}
      <FrmLogin disableTitle {...props}/>
    </div>
  </AppContent>;
}

NeedAuth.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  ComponentLogin: PropTypes.oneOfType([PropTypes.object, PropTypes.node, PropTypes.func]),
  title: PropTypes.string,
  idle: PropTypes.bool,
  user: PropTypes.object,
};

export default NeedAuth;
