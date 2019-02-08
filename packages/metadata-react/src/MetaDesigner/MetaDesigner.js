import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactGridLayout from 'react-grid-layout';
import LayoutCSS from 'react-grid-layout/css/styles.css';
import ResizableCSS from 'react-resizable/css/styles.css';

import classes from './MetaDesigner.css';

import MetaTree from './MetaTree';


export default class MetaDesigner extends Component {

  render() {
    return (
      <ReactGridLayout
        className="layout"
        draggableHandle={"." + classes.draggableHandle}
        cols={10}
        rowHeight={100}
        width={1600}
      >
        <div key="a" data-grid={{x: 0, y: 0, w: 3, h: 5, minW: 2, maxW: 3}}>
          <MetaTree />
        </div>
        <div key="b" data-grid={{x: 4, y: 0, w: 2, h: 5, minW: 1, maxW: 3}}>b</div>
        <div key="c" data-grid={{x: 7, y: 0, w: 3, h: 5, minW: 1, maxW: 3}}>c</div>
      </ReactGridLayout>
    )
  }

}
