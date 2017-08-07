import {createStyleSheet, withStyles} from 'material-ui/styles';
import colors from 'material-ui/colors/common';

export default withStyles(createStyleSheet('toolbar', {
  root: {
    marginTop: 20,
    width: '100%',
  },
  drawer: {
    maxWidth: 300,
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  progress: {
    color: colors.white,
    position: 'absolute',
    top: 8,
  },
  bar: {
    minHeight: 48,
  },
  appbar: {
    backgroundColor: colors.lightBlack,
  },
  white: {
    color: colors.white
  },
  rotation: {
    animation: 'rotate-progress-circle 1733ms linear infinite',
  },
  '@keyframes rotate-progress-circle': {
    '0%': {
      transform: 'rotate(270deg)',
    },
    '100%': {
      transform: 'rotate(-90deg)',
    },
  },
}));
