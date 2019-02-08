import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Treebeard, decorators} from 'react-treebeard';
import treebeardTheme from './assets/treebeard-theme'

import * as filters from './filter';

import classes from './MetaDesigner.css';
import styles from './assets/treebeard-styles';

import data from './assets/meta';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = (props) => {
  const style = props.style;
  return (
    <div style={style.base}>
      <div style={style.title}>
        <div style={styles.treeview_icon} className={classes[props.node.icon]}/>
        <div className={classes.span}>{props.node.name}</div>
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

  constructor(props) {
    super(props);
    this.state = {data};
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({cursor: node});
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim();
    if (!filter) {
      return this.setState({data});
    }
    var filtered = filters.filterTree(data, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    this.setState({data: filtered});
  }

  render() {
    return (
      <div className={classes.component}>

        <div className={classes.draggableHandle}></div>

        <div className={classes.content}>
          <div className={classes.searchBox}>
            <input type="text"
                   className={classes.input}
                   placeholder="Поиск в метаданных..."
                   onKeyUp={this.onFilterMouseUp.bind(this)}
            />
          </div>

          <Treebeard
            data={this.state.data}
            style={treebeardTheme}
            onToggle={this.onToggle}
            decorators={decorators}
          />
        </div>


      </div>

    );
  }
}
