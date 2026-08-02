import {iface_state} from './actions_iface';
import {push, goBack} from 'react-router-redux';

export default function mapDispatchToProps(dispatch) {
  return {
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleNavigate(path) {
      return dispatch(path === -1 ? goBack() : push(path));
    },
  };
};



