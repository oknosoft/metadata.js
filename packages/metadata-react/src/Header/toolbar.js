import withStyles from '@material-ui/core/styles/withStyles';
import colors from '@material-ui/core/colors/common';

export default withStyles(theme => ({
  root: {
    marginTop: 20,
    width: '100%',
  },
  drawer: {
    width: 280,
  },
  ndrawer: {
    width: 310,
    [theme.breakpoints.up('md')]: {
      width: 420,
    },
    [theme.breakpoints.up('lg')]: {
      width: 560,
    },
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
    top: theme.spacing.unit,
  },
  toolbar: {
    backgroundColor: theme.palette.primary[50],
  },
  title: {
    marginLeft: theme.spacing.unit * 3,
  },
  spaceLeft: {
    marginLeft: theme.spacing.unit,
  },
  bold: {
    fontWeight: 500,
  },
  select: {
    width: 180,
    marginLeft: theme.spacing.unit,
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
