import React, {Component} from "react";
import PropTypes from 'prop-types';

import TabsLogin from './TabsLogin';
import Profile from './Profile';

export default class SuperLogin extends Component {

  static contextTypes = {
    $p: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      logged_in: props.state_user.logged_in
    };
  }


  render() {

    const {props} = this

    if (!this.state.logged_in && props.state_user.logged_in) {
      setTimeout(() => {
        this.context.$p.UI.history.push('/')
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
