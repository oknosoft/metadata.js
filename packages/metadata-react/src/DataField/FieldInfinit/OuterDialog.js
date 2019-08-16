/**
 * @module OuterDialog
 *
 * Created by Evgeniy Malyarov on 22.10.2018.
 */

import React from 'react';
import Dialog from '../../App/Dialog';

class OuterDialog extends React.Component {
  state = {fullScreen: undefined};

  toggleFullScreen = (fullScreen) => {
    this.setState({fullScreen});
  };

  render() {
    const {_obj, _fld, dialogOpened, handleSelect, handleCloseDialog, components: {DataList, DataObj, DataTree}, _owner} = this.props;
    const {_manager: _mgr, ref} = _obj[_fld];
    const {current_user} = _mgr._owner.$p;
    const _acl = current_user ? current_user.get_acl(_mgr.class_name) : {};
    const title = (dialogOpened == 'list' || dialogOpened == 'tree') ?
      (_mgr.metadata().list_presentation || _mgr.metadata().synonym)
      :
      (_mgr.metadata().obj_presentation || _mgr.metadata().synonym);

    const otherProps = {
      fullScreen: this.state.fullScreen,
      handlers: {handleSelect},
      _mgr,
      _acl,
    }

    return <Dialog
      key="down-dialog"
      disablePortal={!_owner.isTabular}
      open
      noSpace
      title={title}
      onClose={handleCloseDialog}
      toggleFullScreen={this.toggleFullScreen}
    >
      {dialogOpened == 'list' && <DataList _owner={_owner} selectionMode {...otherProps}/>}
      {dialogOpened == 'tree' && <DataTree _owner={_owner} denyAddDel {...otherProps}/>}
      {dialogOpened == 'obj' && <DataObj match={{params: {ref}}} {...otherProps}/>}

    </Dialog>;
  }
}

export default OuterDialog;
