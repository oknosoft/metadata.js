import withStyles from 'material-ui/styles/withStyles';
import colors from 'material-ui/colors/common';

export default withStyles({
  cell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '.3em',
    boxSizing: 'border-box'
  },
  headerCell: {
    borderLeft: '1px solid #e0e0e0',
  },
  evenRow: {},
  oddRow: {
    backgroundColor: '#fafafa'
  },
  hoveredItem: {
    backgroundColor: '#f5f2f2'
  },
  selectedItem: {
    backgroundColor: '#fffbdc'
  },

});
