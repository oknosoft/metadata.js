import {withStyles} from '@material-ui/core/styles';
import TabsBase from '@material-ui/core/Tabs';
import TabBase from '@material-ui/core/Tab';

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
