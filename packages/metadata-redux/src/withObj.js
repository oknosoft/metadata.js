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
    handleAdd() {
      return dispatch(push(`/${_mgr.class_name}/${$p.utils.generate_guid()}`));
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
    handleMarkDeleted() {

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
