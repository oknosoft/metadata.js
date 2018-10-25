/**
 * Диалог забыли пароль
 *
 * @module Fogot
 *
 * Created by Evgeniy Malyarov on 30.08.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';

class Fogot extends Component {

  constructor(props, context) {
    super(props, context);
    this._timer = 0;
    this.state = {
      email: '',
      emailOk: false,
      popover: null,
      errorText: '',
    }
  }

  openFogot = (event) => {
    this.setState({popover: event.currentTarget});
  };

  closeFogot = () => {
    this.setState({popover: null});
  };

  sendFogot = () => {
    this.closeFogot();
    $p.superlogin.forgotPassword(this.state.email)
      .then(() => {
        this.props.handleInfo('info:Отправлено письмо, проверьте почтовый ящик');
      })
      .catch((err) => {
        this.props.handleInfo(err.error || err.toString());
      })
      .then(() => {
        this.props.afterSend && this.props.afterSend();
      });
  };

  handleChange = ({target}) => {
    this.setState({email: target.value, emailOk: false, errorText: ''});
    clearTimeout(this._timer);
    this._timer = setTimeout(this.checkEmail, 800);
  };

  checkEmail = () => {
    $p.superlogin.validateEmail(this.state.email)
      .then((res) => {
      if(!res || !res.error) {
        this.setState({errorText: `Email не связан ни с одним пользователем сервиса`});
      }
    })
      .catch((res) => {
        if(res.error.indexOf('Неверный формат') !== -1) {
          this.setState({errorText: res.error});
        }
        else {
          this.setState({emailOk: true, errorText: '', });
        }
      });
  }


  render() {
    const {props: {classes, text}, state: {email, emailOk, popover, errorText}} = this;
    return <div>
      <Button color="primary" size="small" className={classes.button} onClick={this.openFogot}>{text || 'Забыли пароль?'}</Button>
      <Popover
        classes={{paper: classes.spaceOuter}}
        open={!!popover}
        anchorEl={popover}
        onClose={this.closeFogot}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography variant="h6">Сброс пароля</Typography>
        <TextField
          label="Электронная почта"
          value={email}
          helperText="Адрес для восстановления пароля"
          margin="dense"
          onChange={this.handleChange}
        />
        <Typography>{errorText}</Typography>
        <DialogActions>
          <Button color="primary" size="small" disabled={!emailOk} className={classes.button} onClick={this.sendFogot}>Отправить</Button>
        </DialogActions>
      </Popover>
    </div>
  }

}

export default Fogot;
