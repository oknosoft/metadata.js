import React, {Component, PropTypes} from "react";

import TabsLogin from './TabsLogin';
import User from 'components/User';

export default class FrmLogin extends Component {


  render() {

    const { props } = this

    return (
      <div>{

        props.state_user.logged_in ?

          < User { ...props } />
          :
          < TabsLogin { ...props } />

      }</div>
    );
  }
}
