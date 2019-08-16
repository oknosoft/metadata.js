import React from 'react';
import ReactDOM from 'react-dom';
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
import {withStyles} from '@material-ui/styles';
import {compose} from 'redux';
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
    marginLeft: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
  },
  contentNoSpace: {
    padding: 0,
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 480,
    },
  },
  maxwidth: {
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100vw - 80px)',
    },
  },
  minheight: {
    minHeight: 320,
  },
  large: {
    [theme.breakpoints.up('md')]: {
      minWidth: 720,
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

  portalTarget() {
    const domNode = ReactDOM.findDOMNode(this);
    if(domNode) {
      for(let i = domNode.children.length - 1; i > 0; i--) {
        const child = domNode.children.item(i).firstChild;
        if(child) {
          return child;
        }
      }
    }
    return document.body;
  }

  get frameRect() {
    const {content} = this;
    return content ? {width: content.clientWidth, height: content.clientHeight} : {};
  }

  toggleFullScreen = () => {
    this.setState({fullScreen: !this.state.fullScreen}, () => {
      this.props.toggleFullScreen && this.props.toggleFullScreen(this.state.fullScreen);
    })
  }

  render() {
    const {open, fullScreen, disablePortal, noSpace, title, actions, children, classes, onClose, minheight, large} = this.props;
    const stateFullScreen = fullScreen || this.state.fullScreen;
    return <Dialog
      disablePortal={disablePortal}
      open={open}
      fullScreen={stateFullScreen}
      onClose={onClose}
      classes={{paper: cn(large ? classes.large : classes.paper, minheight && classes.minheight, !stateFullScreen && classes.maxwidth)}}
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

      <DialogContent
        ref={(el) => this.content = el}
        className={noSpace ? classes.contentNoSpace : classes.content}
      >{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>;
  }
}


SimpleDialog.propTypes = {
  open: PropTypes.bool,
  fullScreen: PropTypes.bool,
  disablePortal: PropTypes.bool,
  initFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  title: PropTypes.node.isRequired,
  actions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
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
