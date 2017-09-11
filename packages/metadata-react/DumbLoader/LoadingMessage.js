import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import withStyles from 'material-ui/styles/withStyles';

class SimpleLoadingMessage extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    text: "загрузка..."
  }

  render() {
    const {classes, text} = this.props;
    return (
      <div className={classes.message}>
        <div className={classes.text}>
          {text}
        </div>
      </div>
    );
  }
}

export default withStyles({
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  text: {
    padding: '.4em 1em',
    fontSize: '1.2em',
    backgroundColor: '#f9f9f9',
    border: '2px solid #e0e0e0'
  },
})(SimpleLoadingMessage);
