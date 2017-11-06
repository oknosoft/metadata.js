import {connect} from 'react-redux';
import {mapStateToProps as metaStateToProps, mapDispatchToProps as metaDispatchToProps} from './withMeta';
import {mapStateToProps as ifaceStateToProps} from './withIface';
import ifaceDispatchToProps from './dispatchIface';

export default (Component) => {
  return connect(
    (state) => Object.assign({}, metaStateToProps(state), ifaceStateToProps(Component)(state)),
    (dispatch) => Object.assign({}, metaDispatchToProps(dispatch), ifaceDispatchToProps(dispatch)))(Component);
};
