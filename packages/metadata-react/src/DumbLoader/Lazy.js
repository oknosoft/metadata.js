/**
 * Абстрактный Lazy-load
 *
 * @module Lazy
 *
 * Created by Evgeniy Malyarov on 28.09.2018.
 */

import React from 'react';
import LoadingMessage from './LoadingMessage';

export default class Lazy extends React.Component {

  state = {Component: null};

  render() {
    const {Component} = this.state;
    return Component ? <Component {...this.props} /> : <LoadingMessage />;
  }
}
