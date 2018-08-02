import {connect} from 'react-redux';
import {try_log_in, log_out} from './actions_auth';

export function mapStateToProps({meta}) {
  return typeof $p === 'object' ?
    Object.assign({}, meta, {
      _obj: $p.current_user,
      _mgr: $p.cat.users,
      _acl: 'e',
    }) : meta;
};

export function mapDispatchToProps(dispatch) {

  return {

    handleLogin(login, password) {

      const {adapters, wsql, job_prm, aes, cat, superlogin} = $p;

      if(!login && !password) {
        if(wsql.get_user_param('user_name') && wsql.get_user_param('user_pwd')) {
          login = wsql.get_user_param('user_name');
          password = aes.Ctr.decrypt(wsql.get_user_param('user_pwd'));
        }
        else if(wsql.get_user_param('zone') == job_prm.zone_demo) {
          login = job_prm.guests[0].username;
          password = aes.Ctr.decrypt(job_prm.guests[0].password);
        }
        else if(superlogin) {
          if(superlogin.authenticated()){
            login = superlogin.getSession().user_id;
          }
          else {
            return dispatch(log_out(adapters.pouch));
          }
        }
        else {
          return dispatch(log_out(adapters.pouch));
        }
      }
      return dispatch(try_log_in(adapters.pouch, login, password));
    },

    handleLogOut() {
      return dispatch(log_out($p.adapters.pouch));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps);
