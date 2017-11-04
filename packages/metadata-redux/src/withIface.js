import {connect} from 'react-redux';
import mapDispatchToProps from './dispatchIface';

export default (Component) => {
  const area = Component.name;
  const mapStateToProps = ({iface}) => {
    return Object.assign({}, iface.common, iface[area]);
  };
  return connect(mapStateToProps, mapDispatchToProps)(Component);
};
