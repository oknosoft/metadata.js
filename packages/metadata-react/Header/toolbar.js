import withStyles from 'material-ui/styles/withStyles';
import colors from 'material-ui/colors/common';

export default withStyles(theme => ({
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
  inline: {
    display: 'inline-flex',
    alignItems: 'baseline'
  },
  progress: {
    color: colors.white,
    position: 'absolute',
    top: 8,
  },
  toolbar: {
    backgroundColor: theme.palette.primary[50],
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
