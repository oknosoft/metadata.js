import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/SwipeableDrawer';
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
      component: NavDrawer.rname,
      name: 'open',
      value: 'invert',
    });

    this.handleClose = props.handleIfaceState.bind(this, {
      component: NavDrawer.rname,
      name: 'open',
      value: false,
    });

    this.handleOpen = props.handleIfaceState.bind(this, {
      component: NavDrawer.rname,
      name: 'open',
      value: true,
    });
  }

  render() {

    const {props, handleClose} = this;
    const {classes, items, title, handleNavigate} = props;

    return (
      <div>

        <IconButton onClick={this.handleToggle}>
          <IconNavigationMenu color="inherit"/>
        </IconButton>

        <Drawer
          open={props.open}
          onClose={handleClose}
          onOpen={this.handleOpen}
          classes={{paper: classes.drawer}}
          swipeAreaWidth={8}
        >

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

NavDrawer.rname = 'NavDrawer';

export default withIface(NavDrawer);

