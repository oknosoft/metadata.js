import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import IconNavigationMenu from 'material-ui-icons/Menu';

import withIface from 'metadata-redux/src/withIface';

import NavList from './NavList';

import withStyles from '../Header/toolbar';


class NavDrawer extends Component {

  constructor(props) {
    super(props);

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
          <IconNavigationMenu className={classes.white}/>
        </IconButton>

        <Drawer open={props.open} onRequestClose={handleClose} classes={{paper: classes.drawer}} >

          <AppBar position="static" className={classes.appbar}>
            <Toolbar className={classes.bar}>
              <IconButton onClick={handleToggle}>
                <IconNavigationMenu className={classes.white}/>
              </IconButton>
              <Typography type="title" color="inherit" className={classes.flex}>{title}</Typography>
            </Toolbar>
          </AppBar>

          <NavList items={items} handleClose={handleClose} handleNavigate={handleNavigate}/>

        </Drawer>

      </div>
    );
  }
}
NavDrawer.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,  // список элементов меню получеам от родительского компонента
};

export default withStyles(withIface(NavDrawer));

