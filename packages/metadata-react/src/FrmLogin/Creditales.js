/**
 *
 *
 * @module Creditales
 *
 * Created by Evgeniy Malyarov on 21.06.2019.
 */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormGroup from '@material-ui/core/FormGroup';

export default function Creditales(
  {login, password, showPassword, handleClickShowPasssword, handleMouseDownPassword, handleLogin, loginChange, passwordChange}) {
  return (
    <FormGroup>

      <TextField
        label="Имя пользователя"
        inputProps={{placeholder: 'login', id: 'username', name: 'username'}}
        fullWidth
        margin="dense"
        value={login}
        onChange={loginChange}
      />

      <FormControl
        fullWidth
        margin="dense"
      >
        <InputLabel>Пароль</InputLabel>
        <Input
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

    </FormGroup>
  );
}
