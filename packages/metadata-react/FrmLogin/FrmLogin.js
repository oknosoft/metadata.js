import React, {Component} from 'react';

import TabsLogin from './TabsLogin';
import TabsUser from './TabsUser';

import {withMeta, withIface} from 'metadata-redux/with.min';

class FrmLogin extends Component {

  render() {
    const {props} = this;

    return (props.user.logged_in && props._obj) ?
      < TabsUser {...props} />
      :
      < TabsLogin {...props} />;
  }

}

export default withIface(withMeta(FrmLogin));
