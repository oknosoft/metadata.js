import { connect } from 'react-redux';

const mapStateToProps = ({meta}) => {
	const {meta_loaded, data_empty, data_loaded, fetch_local, sync_started, page} = meta;
	return {meta_loaded, data_empty, data_loaded, fetch_local, sync_started, page};
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginSuccess: (profile) => dispatch(loginSuccess(profile)),
		loginError: (error) => dispatch(loginError(error)),
		navigate: (path) => dispatch(push(path)),
		try_log_in: () => dispatch($p.rx_actions.USER_TRY_LOG_IN(
			$p.adapters.pouch, $p.job_prm.guests[0].username, $p.aes.Ctr.decrypt($p.job_prm.guests[0].password))),
	};
};

export default connect(mapStateToProps);