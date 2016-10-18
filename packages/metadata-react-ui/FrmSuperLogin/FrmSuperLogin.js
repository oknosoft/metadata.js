import React, {Component, PropTypes} from "react";

import TabsLogin from './TabsLogin';

export default class SuperLogin extends Component {


  render() {

    const { props } = this

    return (
      <div>{

        props.state_user.logged_in ?

          <div>logged_in</div>
          :
          < TabsLogin { ...props } />

      }</div>
    );
  }
}
