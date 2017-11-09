/**
 * Компонент
 * - содержит свойство _mounted
 *
 * Created 11.01.2017
 */

import React, {Component} from 'react';

export default class MComponent extends Component {

  constructor(props, context) {
    super(props, context);
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
    this.shouldComponentUpdate && this.shouldComponentUpdate(this.props, this.state);
  }

  componentWillUnmount() {
    this._mounted = false;
  }
}
