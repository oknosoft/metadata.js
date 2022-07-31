/**
 *
 *
 * @module Creditales
 *
 * Created by Evgeniy Malyarov on 21.06.2019.
 */

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import withStyles, {extClasses} from '../DataField/stylesPropertyGrid';

function Creditales(
  {login, password, showPassword, handleClickShowPasssword, handleLogin, loginChange, passwordChange, classes}) {

  const ext = extClasses(classes);
  const {prevent} = $p.ui;

  return (
    <>
      <FormControl classes={ext.control} fullWidth>
        <InputLabel classes={ext.label}>Логин</InputLabel>
        <Input
          classes={ext.input}
          inputProps={{placeholder: 'login', id: 'username', name: 'username'}}
          value={login}
          onChange={loginChange}
        />
      </FormControl>
      <FormControl classes={ext.control} fullWidth>
        <InputLabel classes={ext.label}>Пароль</InputLabel>
        <Input
          classes={ext.input}
          type={showPassword ? 'text' : 'password'}
          inputProps={{placeholder: 'password', id: 'password', name: 'password'}}
          value={password}
          onChange={passwordChange}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPasssword}
                onMouseDown={prevent}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  );
}

export default withStyles(Creditales);
