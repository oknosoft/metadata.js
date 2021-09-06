/**
 * Компонент
 * - содержит свойство _mounted
 *
 * Created 11.01.2017
 */

import React from 'react';

export default class MComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
    this.shouldComponentUpdate && this.shouldComponentUpdate(this.props, this.state);
    typeof this.props.get_ref === 'function' && this.constructor.name !== 'DataField' && this.props.get_ref(this);
  }

  componentWillUnmount() {
    this._mounted = false;
  }
}
