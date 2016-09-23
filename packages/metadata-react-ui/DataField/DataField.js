import React, { Component, PropTypes } from 'react';

import FieldSelect from './FieldSelect'

export default class DataField extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    handleValueChange: PropTypes.func
  }


  render() {
    return (

      <FieldSelect {...this.props} />

    );
  }
}
