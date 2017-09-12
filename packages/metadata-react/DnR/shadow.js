import React from 'react';

const style = {
  snapShadow: {
    background: '#999',
    opacity: 0.2,
    position: 'absolute',
    margin: 0,
    padding: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
};

export default class Shadow extends React.Component {
  render() {
    return this.props.canSnap ? (
      <div ref="snapShadow" style={{...style, ...this.props.style}}>
      </div>) : null;
  }
}
