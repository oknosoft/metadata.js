/**
 * Массив диаграмм с фиксированным составом
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 10.09.2018.
 */

import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import DiagramsArray from './DiagramsArray';
import connect from './connect';

class Diagrams extends Component {

  state = {diagrams: []};

  componentDidMount() {
    const {http, db} = this.state;
    this.props.fetch(this.props.charts)
      .then((diagrams) => this.setState({diagrams}))
      .catch($p.record_log);
  }

  render() {
    const {classes, grid} = this.props;
    const {diagrams} = this.state;
    return <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%', paddingBottom: 48}}>
      {({width}) => <DiagramsArray
        width={width}
        classes={classes}
        diagrams={diagrams}
        grid={grid}
      />}
    </AutoSizer>
  }

}

Diagrams.defaultProps = {
  charts: [],
  grid: '1',
};

export default connect(Diagrams);
