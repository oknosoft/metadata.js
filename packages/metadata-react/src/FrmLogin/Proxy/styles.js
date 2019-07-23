import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  root: {
    maxWidth: 420,
  },
  button: {
    width: 300,
    marginBottom: theme.spacing(2),
    justifyContent: 'left',
  },
  dialogButton: {
    margin: theme.spacing(),
  },
  icon: {
    marginRight: theme.spacing(4),
    fontSize: theme.spacing(4),
  },
  small: {
    marginRight: theme.spacing(2),
    fontSize: theme.spacing(3),
  },
  flex: {display: 'flex'},
  infoText: {
    marginLeft: theme.spacing(),
    maxWidth: 380,
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.6,
  },
});

export default withStyles(styles);
