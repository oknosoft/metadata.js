import {withStyles} from '@mui/material/styles';
import TabsBase from '@mui/material/Tabs';
import TabBase from '@mui/material/Tab';

export const Tabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
    marginBottom: 8,
  },
})(TabsBase);

export const Tab = withStyles({
  root: {
    fontSize: 'large',
    '@media (min-width: 600px)': {
      minWidth: 72
    },
  },
})(TabBase);
