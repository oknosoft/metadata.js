import {
  default as React,
  PureComponent,
  PropTypes
} from "react";

import classes from "./styles/SimpleLoadingMessage.scss";

export default class SimpleLoadingMessage extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  static defaultProps = {
    text: "загрузка..."
  }

  render() {
    return (
      <div className={classes["simple-loading-message"]}>
        <div className={classes["simple-loading-message__text"]}>
          {this.props.text}
        </div>
      </div>
    );
  }
}