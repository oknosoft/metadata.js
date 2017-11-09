import {connect} from 'react-redux';
import mapDispatchToProps from './dispatchIface';

// TODO: реализовать освобождение индивидуальной области компонента в iface
function disconnect(iface, area) {
  return () => {
  };
}

export function mapStateToProps(Component, area) {
  if(!area) {
    area = Component.name;
  }
  return ({iface}) => Object.assign({disconnect: disconnect(iface, area)}, iface.common, iface[area]);
}

export default (Component) => connect(mapStateToProps(Component), mapDispatchToProps)(Component);
