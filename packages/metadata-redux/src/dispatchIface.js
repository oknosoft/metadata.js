import {iface_state} from './actions_iface';
import {push} from 'react-router-redux';

export default function mapDispatchToProps(dispatch) {
  return {
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleNavigate(path) {
      return dispatch(push(path));
    },
  };
};



