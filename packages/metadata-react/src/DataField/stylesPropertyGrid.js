/**
 * Стилизация DataField под PropertyGrid
 *
 * @module stylesPropertyGrid
 *
 * Created by Evgeniy Malyarov on 19.02.2020.
 */

import {withStyles} from '@material-ui/styles';

const styles = (theme) => ({
  lshrink: {
    transform: 'translate(0, 12px)',
  },
  lformControl: {
    top: 0,
    left: 0,
    position: 'absolute',
    transform: 'translate(0, 12px)',
  },
  iroot: {
    marginLeft: '40%',
    'label + &': {
      marginTop: 0,
    }
  },
  control: {
    minWidth: 180,
    paddingRight: theme.spacing(),
    paddingTop: 2,
    borderBottom: '1px solid #e8e8e8',
  },
  checkbox: {
    borderRadius: 'unset',
  },
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  }
});

export const extClasses = (classes) => ({
  label: {
    shrink: classes.lshrink,
    formControl: classes.lformControl,
  },
  input: {
    root: classes.iroot,
  },
  control: {
    root: classes.control,
  },
  checkbox: {
    root: classes.checkbox,
  }
});

export default withStyles(styles);
