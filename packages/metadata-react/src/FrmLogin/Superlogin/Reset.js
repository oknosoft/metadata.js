/**
 * Сброс пароля
 *
 * @module Reset
 *
 * Created by Evgeniy Malyarov on 30.08.2018.
 */

import React, {Component} from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import withStyles from '../../styles/paper600';
import connect from './connect';
import classnames from 'classnames';

const ltitle = 'Сброс пароля';

class Reset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: props.match.params.token,
      password: '',
      confirmPassword: '',
      showPassword: false,
    };
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  // если изменили state - не перерисовываем
  shouldComponentUpdate({handleIfaceState, title}) {
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPasssword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  handleChange = (name) => event => {
    this.setState({[name]: event.target.value});
  };

  handleReset = () => {
    const {state: {password, confirmPassword, token}, props} = this;
    const base = typeof $p === 'object' ? $p.job_prm.base : '';
    if(password !== confirmPassword) {
      props.handleIfaceState({
        component: '',
        name: 'snack',
        value: {open: true, message: 'Не совпадают пароль и подтверждение пароля'},
      });
    }
    else {
      $p.superlogin.resetPassword({password, confirmPassword, token})
        .then(() => {
          props.handleNavigate(`${base || ''}/login`);
        })
        .catch((err) => {
          props.handleIfaceState({
            component: '',
            name: 'snack',
            value: {open: true, message: err.error || err.toString()},
          });
        });
    }
  };

  render() {
    const {props, state, handleLogin} = this;
    const {classes, user, handleLogOut} = props;
    const btn = classnames(classes.button, classes.fullWidth);
    const info = user.log_error && /info:/.test(user.log_error);

    return (

      <div className={classnames({[classes.disabled]: user.try_log_in})}>

        <FormGroup>
          <FormControl
            fullWidth
            margin="dense"
          >
            <InputLabel>Пароль</InputLabel>
            <Input
              type={state.showPassword ? 'text' : 'password'}
              placeholder="password"
              onChange={this.handleChange('password')}
              onKeyPress={(e) => e.key === 'Enter' && this.handleLogin()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.handleClickShowPasssword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <TextField
            onChange={this.handleChange('confirmPassword')}
            fullWidth
            placeholder="Подтвердить пароль"
            label="Подтвердить пароль"
            type="password"
          />

          <DialogActions>
            <Button
              color="primary"
              size="small"
              disabled={!state.confirmPassword || !state.password}
              className={classes.button}
              onClick={this.handleReset}
            >
              Выполнить
            </Button>
          </DialogActions>

        </FormGroup>
      </div>

    );
  }
}

export default withStyles(connect(Reset));

