import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: 300,
  },
  text: {
    padding: '.4em 1em',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    maxWidth: '70%',
  },
  progress: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(),
  }
});

export default withStyles(styles);
