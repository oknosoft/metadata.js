/**
 * ### Каркас поля ввода
 *
 * @module StyledCustomField
 *
 * Created 22.09.2016
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import withStyles from './styles';


class CustomField extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string
  };

  render() {
    const {classes, _fld, _meta, fullWidth, ...others} = this.props;

    return <FormControl
      className={classes.formControl}
      fullWidth={fullWidth}
    >
      <InputLabel>{_meta.synonym}</InputLabel>
      <Input {...others} />
    </FormControl>;
  }
}

export default withStyles(CustomField);
