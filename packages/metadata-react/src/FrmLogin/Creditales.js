/**
 *
 *
 * @module Creditales
 *
 * Created by Evgeniy Malyarov on 21.06.2019.
 */

import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import withStyles, {extClasses} from '../DataField/stylesPropertyGrid';

function Creditales(
  {login, password, showPassword, handleClickShowPasssword, handleMouseDownPassword, handleLogin, loginChange, passwordChange, classes}) {

  const ext = extClasses(classes);

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
                onMouseDown={handleMouseDownPassword}
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
