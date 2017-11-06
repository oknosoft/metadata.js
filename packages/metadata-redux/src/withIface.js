import {connect} from 'react-redux';
import mapDispatchToProps from './dispatchIface';

export function mapStateToProps(Component) {
  const area = Component.name;
  return ({iface}) => Object.assign({}, iface.common, iface[area]);
}

export default (Component) => connect(mapStateToProps(Component), mapDispatchToProps)(Component);
