import {createStyleSheet, withStyles} from 'material-ui/styles';
//import colors from 'material-ui/colors/common';

export default withStyles(createStyleSheet('menu', theme => ({
  list: {
    width: 300,
    flex: 'initial',
  },
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  flex: {
    flex: 1,
  },
  bar: {
    height: 48,
  },
  bold: {
    fontWeight: 'bold',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  pointer: {cursor: 'pointer'},
})));
