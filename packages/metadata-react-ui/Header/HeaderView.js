/**
 * ### AppBar, Drawer с навигацией и UserButtons
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import withIface from 'metadata-redux/src/withIface';

import HeaderButtons from '../HeaderButtons';
import HeaderMenu from '../HeaderMenu';

import withStyles from './toolbar';

class Header extends Component {

  render() {

    const {props} = this;
    const {classes, title} = this.props;

    return (
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.bar}>
          <HeaderMenu {...props} />
          <Typography type="title" color="inherit" className={classes.flex}>{title}</Typography>
          <HeaderButtons {...props} />
        </Toolbar>
      </AppBar>
    );
  }
}
Header.propTypes = {
  title: PropTypes.string.isRequired, // заголовок AppBar
  items: PropTypes.array.isRequired,   // массив элементов меню
  classes: PropTypes.object.isRequired,   // css
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(withIface(Header));
