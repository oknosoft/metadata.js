import {createStyleSheet, withStyles} from 'material-ui/styles';
//import colors from 'material-ui/colors/common';

export default withStyles(createStyleSheet('menu', theme => ({
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
})));
