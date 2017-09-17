/**
 * Компонент с замашкой на асинхронность
 * - содержит свойство _mounted
 * - знает, размещен ли он в основном дереве react или во всплывающем окне
 *
 * Created 11.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class MComponent extends Component {

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  static contextTypes = {
    dnr: PropTypes.object
  };
}
