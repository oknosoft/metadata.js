import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  formControl: {
    // marginLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    boxSizing: 'border-box',
    minWidth: 260,
    marginTop: theme.spacing.unit,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  root: {
    outline: 'none'
  },
  suggestionsContainerOpen: {
    position: 'fixed',
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    zIndex: 3000,
  },
  suggestion: {
    padding: '4px 8px',
    whiteSpace: 'nowrap',
    //textOverflow: 'ellipsis',
  },
  suggestionSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)'
  },
  suggestionCurrent: {
    fontWeight: 500
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: '#ddd'
  },
  bar: {
    minHeight: 48,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  threestateLabel: {
    paddingLeft: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
  threestateInput: {
    width: theme.spacing.unit * 2,
    height: theme.spacing.unit * 2,
  },
  barInput: {
    minWidth: 180,
    marginLeft: theme.spacing.unit,
    marginTop: 0,
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  a: {
    whiteSpace: 'nowrap',
    textDecoration: 'underline',
    textTransform: 'none',
    fontSize: 'inherit',
    cursor: 'pointer',
    color: '#0b0080'
  },
  icon: {
    width: 32,
    height: 32,
    paddingTop: 4,
  }
});

export default withStyles(styles);
