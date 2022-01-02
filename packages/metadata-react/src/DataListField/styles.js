import {withStyles} from '@mui/styles';
import colors from '@mui/material/colors/common';

export default withStyles(theme => ({
  bold: {
    fontWeight: 500,
  },
  item: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing() / 2,
    paddingBottom: theme.spacing() / 2,
  },
}));
