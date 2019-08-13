import React, {Component} from 'react';
import PropTypes from 'prop-types';

import LayoutCSS from 'react-grid-layout/css/styles.css';
import ResizableCSS from 'react-resizable/css/styles.css';
import RGL, { WidthProvider } from "react-grid-layout";
import Draggable from './Draggable';
import MetaTree from './MetaTree';
import LoadingMessage from 'metadata-react/DumbLoader/LoadingMessage';
import meta from './meta';
import './MetaDesigner.css';

const ReactGridLayout = WidthProvider(RGL);
const ltitle = 'Конфигуратор';


export default class MetaDesigner extends Component {

  state = {
    data: null,
    tree_item: null,
  };

  componentDidMount() {
    this.props.drawerClose(() => {
      this.shouldComponentUpdate(this.props);
      meta().then((data) => this.setState({data}));
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {title} = nextProps;
    if(title != ltitle) {
      nextProps.handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  treeSelect = (tree_item) => {
    this.setState({tree_item});
  }

  render() {
    const {data, tree_item} = this.state;
    return data ?
      <ReactGridLayout
        className="layout"
        draggableHandle=".designer-draggable-handle"
        cols={12}
        rowHeight={80}
      >
        <div key="a" data-grid={{x: 0, y: 0, w: 3, h: 7, minW: 2, maxW: 4}}>
          <MetaTree
            data={data}
            treeSelect={this.treeSelect}
          />
        </div>
        <div key="b" data-grid={{x: 3, y: 0, w: 6, h: 7, minW: 3, maxW: 8}}>
          <Draggable title="Код">Код</Draggable>
        </div>
        <div key="c" data-grid={{x: 9, y: 0, w: 3, h: 7, minW: 2, maxW: 4}}>
          <Draggable title="Свойства">{`Свойства ${tree_item && tree_item.name}`}</Draggable>
        </div>
      </ReactGridLayout>
      :
      <LoadingMessage text="Подготовка данных..."/>;
  }

}
