/**
 * Формирует div от текущей позиции до низа экрана или диалога
 *
 * @module AutoHeight
 *
 * Created by Evgeniy Malyarov on 07.05.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from '@material-ui/utils';

const WithAutoHeight = (BaseComponent) => class extends React.Component {

  static contextTypes = {
    dnr: PropTypes.object,
  };

  static propTypes = {
    windowHeight: PropTypes.number.isRequired,
  };

  state = {el: null};

  divRef = (el) => {
    this.setState({el});
  };

  // обновляем содержимое при максимизации или сворачивании диалога
  handleFullScreen = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    const {dnr} = this.context;
    dnr && dnr.onFullScreen(this.handleFullScreen);
  }

  componentWillUnmount() {
    const {dnr} = this.context;
    dnr && dnr.offFullScreen(this.handleFullScreen);
  }

  render() {
    // pass window dimensions as props to wrapped component
    const {props, state: {el}, context: {dnr}}  = this;
    let autoHeight = 0, windowHeight = props.windowHeight || window.innerHeight;
    if(dnr && !dnr.state.fullScreen) {
      const box = dnr.content.getBoundingClientRect();
      windowHeight = Math.floor(box.bottom);
    }

    if(el) {
      autoHeight = windowHeight - el.getBoundingClientRect().top + window.pageYOffset - 9;
    }
    if(autoHeight < 300) {
      autoHeight = 300;
    }

    return <div
      style={{height: autoHeight}}
      ref={this.divRef}
    >
      <BaseComponent
        {...props}
        autoHeight={autoHeight}
      />
    </div>;
  }

  static get displayName() {
    return `WithAutoHeight(${getDisplayName(BaseComponent)})`;
  }

};

export default WithAutoHeight;
