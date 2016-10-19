import React, { Component, PropTypes } from 'react';

import FieldSelect from './FieldSelect'
import FieldText from './FieldText'

export default class DataField extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    handleValueChange: PropTypes.func
  }

  constructor (props) {

    super(props);

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    }
  }

  render() {

    const { $p } = this.context;
    const { _meta } = this.state;
    const _val = this.props._obj[this.props._fld];
    const subProps = {
      _meta: this.state._meta,
      _obj: this.props._obj,
      _fld: this.props._fld,
      _val: _val
    }

    switch ($p.rx_control_by_type(this.state._meta.type, _val)){

      case 'ocombo':
        return <FieldSelect {...subProps} />

      default:
        return <FieldText {...subProps} />

    }

    ;
  }
}
