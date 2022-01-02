// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IconHome from '@mui/icons-material/Home';

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
    whiteSpace: 'noWrap',
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
    marginRight: theme.spacing(2),
  },
});

function AppDrawer(props) {
  const {classes, className, disablePermanent, mobileOpen, onClose, onPermanentClose, handleNavigate, isHome, items, title} = props;
  const base = typeof $p === 'object' ? $p.job_prm.base : '';

  const navigation = (
    <div className={classes.nav}>
      <div className={classes.toolbarIe11}>
        <Toolbar className={classes.toolbar}>
          <div
            className={classes.title}
            onClick={() => {
              onClose();
              !isHome && handleNavigate(`${base || ''}`);
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
          ModalProps={{keepMounted: true}}
        >
          {navigation}
        </Drawer>
      </Hidden>
      {disablePermanent ? null : (
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{paper: classes.paper}}
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
