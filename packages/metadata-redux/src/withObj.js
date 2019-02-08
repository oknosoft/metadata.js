import {connect} from 'react-redux';
import * as obj from './actions_obj';
import {push} from 'react-router-redux';
import {iface_state} from './actions_iface';

const mapDispatchToProps = (dispatch) => {

  const handlers = {
    handleNavigate(path) {
      return dispatch(push(path));
    },
    handleIfaceState(state) {
      return dispatch(iface_state(state));
    },
    handleAdd(_mgr) {
      return dispatch(push(`/${_mgr.class_name}/${$p.utils.generate_guid()}${_mgr.hasOwnProperty('_cachable') ? '?area=' + _mgr._cachable : ''}`));
    },
    handleAddRow() {

    },
    handleDelRow() {

    },
    handleEdit({ref, _mgr}) {
      return dispatch(push(`/${_mgr.class_name}/${ref}`));
    },
    handlePost() {

    },
    handleUnPost() {

    },
    handleMarkDeleted({ref, _mgr}) {
      const {current_user} = $p;
      if(current_user && current_user.get_acl(_mgr.class_name).includes('d')) {
        return _mgr.get(ref, 'promise')
          .then((o) => {
            return !o._deleted && o.mark_deleted(true);
          })
      }
    },
    handleUnMarkDeleted() {

    },
    handleSave() {

    },
    handleRevert() {

    },
    handlePrint() {

    },
    handleAttachment() {

    }
  };
  return Object.assign({handlers}, handlers);
};

export default connect(null, mapDispatchToProps);
