import {withStyles} from 'material-ui/styles';

const styles = theme => ({
  formControl: {
    // marginLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    boxSizing: 'border-box',
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
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 3000,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  flex: {
    flex: 1,
  },
  a: {
    width: 'inherit',
    whiteSpace: 'nowrap',
    textDecoration: 'underline',
    cursor: 'pointer',
    color: '#0b0080'
  },
});

export default withStyles(styles);
