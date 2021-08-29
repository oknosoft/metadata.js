import { withStyles } from '@material-ui/styles';
export default withStyles(({
  mixins,
  custom,
  spacing,
  shadows,
  palette
}) => ({
  root: {
    maxWidth: 600,
    marginTop: custom && custom.appbar.position == 'fixed' ? 72 : 24,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: spacing()
  },
  disabled: {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    boxShadow: shadows[0]
  },
  error: {
    color: palette.error.A400
  },
  errorText: {
    maxWidth: 500
  },
  rightWidth: {
    minWidth: 310
  },
  textField: {
    marginTop: spacing(3)
  },
  spaceLeft: {
    marginLeft: spacing()
  },
  spaceOuter: {
    padding: spacing(2),
    paddingBottom: 0,
    minWidth: 260
  },
  paddingRight: {
    paddingRight: spacing()
  },
  paddingTop: {
    paddingTop: spacing()
  },
  paddingBottom: {
    paddingBottom: spacing()
  },
  marginRight: {
    marginRight: spacing() / 2
  },
  button: {
    margin: spacing()
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  fullFlex: {
    flex: 1
  }
}), {
  name: 'Paper600'
});