import React, {Component, PropTypes} from "react";

import TabsLogin from './TabsLogin';
import Profile from './Profile';

export default class SuperLogin extends Component {

  static contextTypes = {
    handleLocationChange: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      logged_in: props.state_user.logged_in
    };
  }


  render() {

    const { props } = this

    if(!this.state.logged_in && props.state_user.logged_in){
      setTimeout(() => {
        this.context.handleLocationChange('/')
      })
    }
    this.state.logged_in = props.state_user.logged_in

    return (
      <div>{

        props.state_user.logged_in

          ?
          < Profile { ...props } />

          :
          < TabsLogin { ...props } />

      }</div>
    );
  }
}
