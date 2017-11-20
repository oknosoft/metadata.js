import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {DialogActions, DialogContent, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import colors from 'material-ui/colors/common';
import withStyles from 'material-ui/styles/withStyles';
import compose from 'recompose/compose';

const style = theme => ({
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  white: {
    color: colors.white,
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
});

class SimpleDialog extends React.Component {

  getChildContext() {
    return {dnr: this};
  }

  get frameRect() {
    return {};
  }

  render() {
    const {open, fullScreen, noSpace, title, actions, children, classes, onRequestClose} = this.props;
    const paper = classes.paper ? {paper: classes.paper} : {};
    return <Dialog open={open} fullScreen={fullScreen} onRequestClose={onRequestClose} classes={paper}>
      <Toolbar disableGutters className={classes.toolbar}>
        <Typography className={classes.title} type="title" color="inherit" noWrap>{title}</Typography>
        <IconButton title="Закрыть диалог" onClick={onRequestClose}><CloseIcon/></IconButton>
      </Toolbar>
      <DialogContent className={noSpace ? classes.contentNoSpace : classes.content}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>;
  }
}


SimpleDialog.propTypes = {
  open: PropTypes.bool,
  fullScreen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  actions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

SimpleDialog.childContextTypes = {
  dnr: PropTypes.object
};


export default compose(withStyles(style), withMobileDialog())(SimpleDialog);
