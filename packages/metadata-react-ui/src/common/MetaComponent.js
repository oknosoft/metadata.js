/**
 * Компонент с привязкой контекста metaengine
 *
 * @module Component
 *
 * Created 11.01.2017
 */

import React, {Component, PropTypes} from "react";

export default class MetaComponent extends Component {

  static contextTypes = {
    $p: PropTypes.object.isRequired
  }

}