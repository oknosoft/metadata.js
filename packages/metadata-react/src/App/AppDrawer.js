// @flow

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconHome from '@material-ui/icons/Home';

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
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  space: {
    flex: '1 1 auto',
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
    paddingRight: 0,
  },
  anchor: {
    color: theme.palette.text.secondary,
  },
  marginRight: {
    marginRight: theme.spacing.unit * 2,
  },
});

function AppDrawer(props) {
  const {classes, className, disablePermanent, mobileOpen, onClose, onPermanentClose, handleNavigate, isHome, items, title} = props;

  const navigation = (
    <div className={classes.nav}>
      <div className={classes.toolbarIe11}>
        <Toolbar className={classes.toolbar}>
          <div
            className={classes.title}
            onClick={() => {
              onClose();
              !isHome && handleNavigate('/');
            }}
          >
            <IconHome className={classes.marginRight}/>

            <Typography className={classes.space} variant="h6" color="inherit">{title}</Typography>
            {onPermanentClose &&
            <IconButton onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPermanentClose();
            }}>
              <ChevronLeftIcon />
            </IconButton>}
          </div>
          <Divider absolute/>
        </Toolbar>
      </div>
      <NavList items={items} handleClose={onClose} handleNavigate={handleNavigate}/>
    </div>
  );

  return (
    <div className={className}>
      <Hidden lgUp={!disablePermanent}>
        <Drawer
          classes={{paper: classes.paper}}
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {navigation}
        </Drawer>
      </Hidden>
      {disablePermanent ? null : (
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.paper,
            }}
            variant="permanent"
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
  onClose: PropTypes.func.isRequired,
  onPermanentClose: PropTypes.func,
  handleNavigate: PropTypes.func.isRequired,// action для навигации
  items: PropTypes.array.isRequired,        // массив элементов меню
  title: PropTypes.string,
};

export default withStyles(styles)(AppDrawer);
