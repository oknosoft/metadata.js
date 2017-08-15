// higher-order component that passes the dimensions of the window as props to
// the wrapped component
// export default windowSize(Component);

import React, {Component} from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default (BaseComponent) => class extends Component {

  constructor() {
    super();
    // set initial state
    this.state = this.getSizes();
    // bind window resize listeners
    this.handleResize = this.handleResize.bind(this);
  }

  getSizes() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  handleResize() {
    this.setState(this.getSizes());
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  componentWillUnmount() {
    // clean up listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
  }

  render() {
    // pass window dimensions as props to wrapped component
    return (
      <BaseComponent
        {...this.props}
        windowWidth={this.state.width}
        windowHeight={this.state.height}
      />
    );
  }

  static get displayName() {
    return wrapDisplayName(BaseComponent, 'withWindowSizes');
  }

};
