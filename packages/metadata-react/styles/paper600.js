import withStyles from '@material-ui/core/styles/withStyles';

export default withStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    marginTop: theme.custom && theme.custom.appbar.position == 'fixed' ? 72 : 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  }),
  disabled: {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    boxShadow: theme.shadows[0],
  },
  error: {
    color: theme.palette.error.A400,
  },
  errorText: {
    maxWidth: 500,
  },
  textField: {
    marginTop: theme.spacing.unit * 3,
  },
  spaceLeft: {
    marginLeft: theme.spacing.unit,
  },
  paddingRight: {
    paddingRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  fullWidth: {
    width: '100%',
  }
}), {name: 'Paper600'});
