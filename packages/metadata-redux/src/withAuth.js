import { connect } from 'react-redux';
import {try_log_in, log_out} from './actions_auth'

const {adapters, job_prm, aes} = $p;

const mapStateToProps = ({meta}) => {
	return {
		state_user: meta.user,
		_obj: $p.current_user,
		_mgr: $p.cat.users,
		_acl: 'e',
	};
};

const mapDispatchToProps = (dispatch) => {

	return {
		handleLogin(login, password) {
			if(!login && !password){
				login = job_prm.guests[0].username;
				password = aes.Ctr.decrypt(job_prm.guests[0].password);
			}
			return dispatch(try_log_in(adapters.pouch, login, password));
		},
		handleLogOut() {
			return dispatch(log_out(adapters.pouch));
		},
	};
};


export default connect(mapStateToProps, mapDispatchToProps);