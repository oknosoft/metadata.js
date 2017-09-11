import withStyles from 'material-ui/styles/withStyles';

export default withStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    marginTop: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  }),
  textField: {
    marginTop: 24,
  },
  button: {
    margin: theme.spacing.unit,
  },
}), {withTheme: true});
