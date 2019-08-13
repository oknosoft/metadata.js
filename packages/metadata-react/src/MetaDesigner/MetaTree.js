import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Treebeard, decorators} from 'react-treebeard';
import treebeardTheme from './assets/treebeard-theme'

import * as filters from './filter';

import Draggable from './Draggable';


import styles from './assets/treebeard-styles';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = (props) => {
  const style = props.style;
  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={styles.treeview_icon} className={props.node.icon}/>
        {props.node.name}
      </div>
    </div>
  );
};

decorators.Toggle = (props) => {
  const style = props.style;
  const height = style.height;
  const width = style.width;
  let r = (height - 4) / 2;
  let path = `M${r / 2},${r * 1.5}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 -${r * 2},0`;
  if (props.node.toggled === true)
    path += `M${r * 1.5},${r}l0,${r}`;
  else
    path += `M${r},${r * 1.5}l${r},0M${r * 1.5},${r}l0,${r}`;

  return (
    <div style={style.base}>
      <div style={style.wrapper}>
        <svg height={height} width={width}>
          <path d={path} fill="none" stroke="black"></path>
        </svg>
      </div>
    </div>
  );
};

const TreebeardContainer = decorators.Container;
class Container extends TreebeardContainer {
  renderToggleDecorator() {
    const {style, decorators, node} = this.props;
    return (<decorators.Toggle style={style.toggle} node={node}/>);
  }
}
decorators.Container = Container;


export default class MetaTree extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {data: props.data, current: null};
  }

  onToggle = (node, toggled) => {
    const {current} = this.state;
    if (current) {
      current.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({current: node});
    this.props.treeSelect(node);
  };

  onFilterMouseUp = (e) => {
    const filter = e.target.value.trim();
    const {data} = this.props;
    if (!filter) {
      return this.setState({data});
    }
    const filtered = filters.expandFilteredNodes(filters.filterTree(data, filter), filter);
    this.setState({data: filtered});
  }

  render() {
    return (
      <Draggable title="Метаданные">
        <div className="designer-search-box">
          <input type="text"
                 className="designer-input"
                 placeholder="Поиск в метаданных..."
                 onKeyUp={this.onFilterMouseUp}
          />
        </div>
        <div className="designer-tree">
          <Treebeard
            data={this.state.data}
            style={treebeardTheme}
            onToggle={this.onToggle}
            decorators={decorators}
          />
        </div>
      </Draggable>
    );
  }
}
