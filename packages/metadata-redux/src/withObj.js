import {connect} from 'react-redux';
import * as obj from './actions_obj';
import {push} from 'react-router-redux';

const mapDispatchToProps = (dispatch) => {

  const handlers = {
    handleNavigate(path) {
      dispatch(push(path))
    },
    handleAdd() {

    },
    handleAddRow() {

    },
    handleDelRow() {

    },
    handleEdit({ref, _mgr}) {
      dispatch(push(`/${_mgr.class_name}/${ref}`));
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
