import {connect} from 'react-redux';
import {iface_state} from './actions_iface';
import {push} from 'react-router-redux';

const mapDispatchToProps = (dispatch) => {
  return {
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleNavigate: (path) => dispatch(push(path)),
  };
};

export default (Component) => {
  const area = Component.name;
  const mapStateToProps = ({iface}) => {
    return Object.assign({}, iface.common, iface[area]);
  };
  return connect(mapStateToProps, mapDispatchToProps)(Component);
};
