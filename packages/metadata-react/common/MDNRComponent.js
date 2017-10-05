/**
 * Компонент
 * - содержит свойство _mounted
 * - знает, размещен ли он в основном дереве react или во всплывающем окне
 *
 * Created 11.01.2017
 */

import React from 'react';
import PropTypes from 'prop-types';
import MComponent from './MComponent';

export default class MDNRComponent extends MComponent {

  static contextTypes = {
    dnr: PropTypes.object
  };
}
