import withStyles from 'material-ui/styles/withStyles';
import createMixins from 'material-ui/styles/mixins';
import createBreakpoints from 'material-ui/styles/breakpoints';
import spacing from 'material-ui/styles/spacing';

export default withStyles({
  root: createMixins(createBreakpoints(), spacing).gutters({
    maxWidth: 600,
    marginTop: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
  }),
  textField: {
    marginTop: 24,
  },
  button: {
    margin: spacing.unit,
  },
});
