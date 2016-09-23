import React, { Component, PropTypes } from 'react';
import classes from './DataField.scss'

import TextField from 'material-ui/TextField';

export default class FieldText extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    handleValueChange: PropTypes.func
  }


  render() {
    return (

      <div className={classes.row}>
        <div className={classes.celllabel}>Поле ввода</div>
        <div className={classes.celldata}>
          <TextField
            fullWidth={true}
          />
        </div>
      </div>

    );
  }
}
