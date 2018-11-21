import withStyles from '@material-ui/core/styles/withStyles';
import colors from '@material-ui/core/colors/common';

export default withStyles({
  calculator: {
    fontSize: '.9em',
    position: 'absolute',
    display: 'flex',
    border: '.2em solid #C0D4D8',
    flexDirection: 'column',
    zIndex: 1000,
    padding: '.2em',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px 0 gray'
  },
  top: {
    bottom: '100%',
    left: 0
  },
  bottom: {
    top: '100%',
    left: 0
  },
  left: {
    top: 0,
    right: '100%'
  },
  right: {
    top: 0,
    left: '100%'
  },

  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  rowHidden: {
    display: 'none'
  },

  button: {
    position: 'relative',
    flex: 1,
    borderRadius: '2px',
    border: '1px solid #A0A0A0',
    outline: 'none',
    background: 'linear-gradient(to bottom, white, #F0F4F0)',
    color: '#484C48',
    padding: '.1em',
    margin: '.2em',
    textAlign: 'center',
    userSelect: 'none',
    cursor: 'default',
    boxSizing: 'border-box',
  },
  buttonRed: {
    color: '#F80000'
  },
  buttonDisabled: {
    borderColor: '#D0D0D0',
    color: '#D0D0D0',
  },
  buttonIsPressed: {
    background: '#f0f4f0 !important',
    padding: '.2em 0 0 .2em',
  },
  buttonMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 1100,
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
  },

  input: {
    flex: 4,
    margin: '.2em',
    position: 'relative',
  },
  inputInput: {
    height: '100%',
    //width: '100%',
    borderRadius: '2px',
    border: '1px solid #A0A0A0',
    color: '#484C48',
    outline: 'none',
    padding: '.2em',
    paddingRight: '35px',
    textAlign: 'right',
    boxSizing: 'border-box',
  },
  inputExpression: {
    textAlign: 'left',
  },

});
