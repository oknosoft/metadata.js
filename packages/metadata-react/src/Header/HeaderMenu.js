import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import IconNavigationMenu from '@material-ui/icons/Menu';

import {withIface} from 'metadata-redux';

import NavList from './NavList';


class NavDrawer extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleToggle = props.handleIfaceState.bind(this, {
      component: this.constructor.name,
      name: 'open',
      value: 'invert',
    });

    this.handleClose = props.handleIfaceState.bind(this, {
      component: this.constructor.name,
      name: 'open',
      value: false,
    });
  }

  render() {

    const {props, handleClose, handleToggle} = this;
    const {classes, items, title, handleNavigate} = props;

    return (
      <div>

        <IconButton onClick={handleToggle}>
          <IconNavigationMenu color="inherit"/>
        </IconButton>

        <Drawer open={props.open} onClose={handleClose} classes={{paper: classes.drawer}} >

          <AppBar position="static" color="default">
            <Toolbar disableGutters >
              <IconButton onClick={handleClose}>
                <IconNavigationMenu color="inherit"/>
              </IconButton>
              <Typography variant="h6" color="textSecondary" className={classes.flex}>{title}</Typography>
            </Toolbar>
          </AppBar>

          <NavList items={items} handleClose={handleClose} handleNavigate={handleNavigate}/>

        </Drawer>

      </div>
    );
  }

  static propTypes = {
    open: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    handleIfaceState: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,  // список элементов меню получеам от родительского компонента
  };
}


export default withIface(NavDrawer);

