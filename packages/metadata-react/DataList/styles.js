import withStyles from 'material-ui/styles/withStyles';
import colors from 'material-ui/colors/common';

export default withStyles({
  cell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '.3em',
  },
  headerCell: {
    borderLeft: '1px solid #e0e0e0',
    fontWeight: 'bold',
    padding: '.3em',
  },
  evenRow: {

  },
  oddRow: {
    backgroundColor: '#fafafa'
  },
  hoveredItem: {
    backgroundColor: '#f2f2fc'
  },
  selectedItem: {
    backgroundColor: '#fffbdc'
  },
});
