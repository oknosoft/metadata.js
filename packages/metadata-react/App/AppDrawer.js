// @flow

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Hidden from 'material-ui/Hidden';
import NavList from '../Header/NavList';


const styles = theme => ({
  paper: {
    width: 280,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary[500],
    },
  },
  // https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items
  toolbarIe11: {
    display: 'flex',
  },
  toolbar: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  anchor: {
    color: theme.palette.text.secondary,
  },
});

function AppDrawer(props) {
  const {classes, className, disablePermanent, mobileOpen, onRequestClose, handleNavigate, isHome, items, title} = props;

  const navigation = (
    <div className={classes.nav}>
      <div className={classes.toolbarIe11}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.title} onClick={() => {
            onRequestClose();
            !isHome && handleNavigate('/');
          }}>
            <Typography type="title" color="inherit">{title}</Typography>
          </div>
          <Divider absolute/>
        </Toolbar>
      </div>
      <NavList items={items} handleClose={onRequestClose} handleNavigate={handleNavigate}/>
    </div>
  );

  return (
    <div className={className}>
      <Hidden lgUp={!disablePermanent}>
        <Drawer
          classes={{paper: classes.paper}}
          type="temporary"
          open={mobileOpen}
          onRequestClose={onRequestClose}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {navigation}
        </Drawer>
      </Hidden>
      {disablePermanent ? null : (
        <Hidden lgDown implementation="css">
          <Drawer
            classes={{
              paper: classes.paper,
            }}
            type="permanent"
            open
          >
            {navigation}
          </Drawer>
        </Hidden>
      )}
    </div>
  );
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  disablePermanent: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  isHome: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,// action для навигации
  items: PropTypes.array.isRequired,        // массив элементов меню
  title: PropTypes.string,
};

export default withStyles(styles)(AppDrawer);
