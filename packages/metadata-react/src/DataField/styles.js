import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  formControl: {
    // marginLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    boxSizing: 'border-box',
    minWidth: 260,
    marginTop: theme.spacing(),
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
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(),
    zIndex: 3000,
  },
  suggestion: {
    padding: '4px 8px',
    whiteSpace: 'noWrap',
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
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  threestateLabel: {
    paddingLeft: theme.spacing(),
    paddingTop: theme.spacing(),
  },
  threestateInput: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  barInput: {
    minWidth: 180,
    marginLeft: theme.spacing(),
    marginTop: 0,
  },
  flex: {
    flex: 1,
    whiteSpace: 'noWrap',
  },
  a: {
    whiteSpace: 'noWrap',
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
  },
  checkbox: {
    width: `${theme.spacing(2)}px !important`,
    boxShadow: 'none  !important',
    margin: 'auto',
  },
  required: {
    borderBottom: '3px dashed red',
    paddingBottom: 4,
  },
  popper: {
    minWidth: 310,
  }
});

export default withStyles(styles);
