import {withStyles} from 'material-ui/styles';

const styles = theme => ({
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  icon: {
    '&:before': {
      backgroundColor: '#216ba5',
      borderRadius: '50%',
      bottom: 0,
      boxSizing: 'border-box',
      color: '#fff',
      content: 'х',
      cursor: 'pointer',
      fontSize: 12,
      height: 16,
      width: 16,
      lineHeight: 1,
      margin: '-8px auto 0',
      padding: 2,
      position: 'absolute',
      right: 17,
      textAlign: 'center',
      top: '50%'
    },
  }
});

export default withStyles(styles);
