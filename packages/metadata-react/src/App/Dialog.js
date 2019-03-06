import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
//import withMobileDialog from '@material-ui/core/withMobileDialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';
import colors from '@material-ui/core/colors/common';
import withStyles from '@material-ui/core/styles/withStyles';
import compose from 'recompose/compose';
import cn from 'classnames';

const style = theme => ({
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  toolbar: {
    backgroundColor: theme.palette.primary[50],
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.primary[100],
  },
  title: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit * 2,
  },
  content: {
    padding: theme.spacing.unit * 2,
  },
  contentNoSpace: {
    padding: 0,
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 480,
    }
  },
  minheight: {
    minHeight: 320,
  },
  large: {
    [theme.breakpoints.up('md')]: {
      minWidth: 960,
    },
    maxHeight: 'calc(100vh - 80px)',
  }
});

class SimpleDialog extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {fullScreen: props.initFullScreen || false};
  }

  getChildContext() {
    return {dnr: this};
  }

  get frameRect() {
    return {};
  }

  toggleFullScreen = () => {
    this.setState({fullScreen: !this.state.fullScreen})
  }

  render() {
    const {open, fullScreen, disablePortal, noSpace, title, actions, children, classes, onClose, minheight, large} = this.props;
    const stateFullScreen = fullScreen || this.state.fullScreen;
    return <Dialog
      disablePortal={disablePortal}
      open={open}
      fullScreen={stateFullScreen}
      onClose={onClose}
      classes={{paper: cn(large ? classes.large : classes.paper, minheight && classes.minheight)}}
    >
      <Toolbar disableGutters className={classes.toolbar}>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>{title}</Typography>
        {
          !fullScreen && <IconButton
            title={stateFullScreen ? 'Свернуть' : 'Развернуть'}
            onClick={this.toggleFullScreen}>
            {stateFullScreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
          </IconButton>
        }
        <IconButton title="Закрыть диалог" onClick={onClose}><CloseIcon/></IconButton>
      </Toolbar>
      <DialogContent className={noSpace ? classes.contentNoSpace : classes.content}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>;
  }
}


SimpleDialog.propTypes = {
  open: PropTypes.bool,
  fullScreen: PropTypes.bool,
  disablePortal: PropTypes.bool,
  initFullScreen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  actions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

SimpleDialog.defaultProps = {
  disablePortal: true,
};

SimpleDialog.childContextTypes = {
  dnr: PropTypes.object
};


//export default compose(withStyles(style), withMobileDialog({ breakpoint: 'md' }))(SimpleDialog);
export default withStyles(style)(SimpleDialog);
