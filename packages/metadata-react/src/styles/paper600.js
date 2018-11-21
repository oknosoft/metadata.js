import withStyles from '@material-ui/core/styles/withStyles';

export default withStyles(({mixins, custom, spacing, shadows, palette}) => ({
  root: mixins.gutters({
    maxWidth: 600,
    marginTop: custom && custom.appbar.position == 'fixed' ? 72 : 24,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: spacing.unit,
  }),
  disabled: {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    boxShadow: shadows[0],
  },
  error: {
    color: palette.error.A400,
  },
  errorText: {
    maxWidth: 500,
  },
  rightWidth: {
    minWidth: 310,
  },
  textField: {
    marginTop: spacing.unit * 3,
  },
  spaceLeft: {
    marginLeft: spacing.unit,
  },
  spaceOuter: {
    padding: spacing.unit * 2,
    paddingBottom: 0,
    minWidth: 260,
  },
  paddingRight: {
    paddingRight: spacing.unit,
  },
  paddingTop: {
    paddingTop: spacing.unit * 1.5,
  },
  marginRight: {
    marginRight: spacing.unit / 2,
  },
  button: {
    margin: spacing.unit,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullFlex: {
    flex: 1,
  },
}), {name: 'Paper600'});
