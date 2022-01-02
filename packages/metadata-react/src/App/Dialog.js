import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import IconButton from '@mui/material/IconButton';
import colors from '@mui/material/colors/common';
import {withStyles} from '@mui/styles';
import Draggable from 'react-draggable';
import {compose} from 'redux';
import cn from 'classnames';

const style = theme => ({
  flex: {
    flex: 1,
    whiteSpace: 'noWrap',
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
  top: {
    alignItems: 'flex-start',
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
    this._id = `draggable-title-${Date.now()}`;
    this._listeners = new Set();
  }

  componentWillUnmount() {
    this._listeners.clear();
  }

  onFullScreen(fn) {
    this._listeners.add(fn);
  }

  offFullScreen(fn) {
    this._listeners.delete(fn);
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
    return content ? {content, width: content.clientWidth, height: content.clientHeight} : {};
  }

  toggleFullScreen = () => {
    this.setState({fullScreen: !this.state.fullScreen}, () => {
      const {props, state} = this;
      props.toggleFullScreen && props.toggleFullScreen(state.fullScreen);
      Promise.resolve().then(() => {
        for(const fn of this._listeners) {
          fn();
        }
      });
      //setTimeout(, 100);
    });
  }

  PaperComponent = (props) => {
    const {props: {fullScreen}, state} = this;
    return <Draggable
      handle={`#${this._id}`}
      cancel={'[class*="MuiDialogContent-root"]'}
      position={fullScreen || state.fullScreen ? {x: 0, y: 0} : null}
    >
      <Paper {...props} />
    </Draggable>;
  };

  render() {
    const {open, fullScreen, top, disablePortal, disableFullScreen, noSpace, title, actions, toolbtns, children, classes, onClose, minheight, large} = this.props;
    const stateFullScreen = fullScreen || this.state.fullScreen;
    return <Dialog
      disablePortal={disablePortal}
      open={open}
      fullScreen={stateFullScreen}
      onClose={onClose}
      classes={{
        paper: cn(large ? classes.large : classes.paper, minheight && classes.minheight, !stateFullScreen && classes.maxwidth),
        scrollPaper: top ? classes.top : null,
      }}
      PaperComponent={this.PaperComponent}
      aria-labelledby={this._id}
    >
      <Toolbar
        disableGutters
        className={classes.toolbar}
        style={{ cursor: 'move' }}
        id={this._id}
      >
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>{title}</Typography>
        {toolbtns}
        {
          !fullScreen && !disableFullScreen && <IconButton
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
  disableFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  title: PropTypes.node.isRequired,
  actions: PropTypes.node,
  toolbtns: PropTypes.node,
  children: PropTypes.node,
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
