/**
 * ### Поле переключателя
 *
 * @module FieldToggle
 *
 * Created 22.09.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

export default class FieldToggle extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    handleValueChange: PropTypes.func,
  };

  onChange = (event, newValue) => {
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = newValue;
    if (handleValueChange) {
      handleValueChange(newValue);
    }
  };

  render() {
    const {onChange, props} = this;
    const {_obj, _fld, _meta} = props;

    return (
      <TextField
        name={_fld}
        fullWidth={true}
        defaultValue={_obj[_fld]}
        hintText={_meta.tooltip || _meta.synonym}
        onChange={onChange}/>
    );
  }
}