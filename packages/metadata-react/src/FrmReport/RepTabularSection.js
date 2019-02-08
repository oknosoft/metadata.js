import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactDataGrid from 'metadata-external/react-data-grid.min';

const {Row} = ReactDataGrid;

class RowRenderer extends Component {

  static propTypes = {
    idx: PropTypes.string.isRequired
  };

  // setScrollLeft(scrollBy) {
  //   // if you want freeze columns to work, you need to make sure you implement this as apass through
  //   this.row.setScrollLeft(scrollBy);
  // },

  getRowStyle() {
    return {
      color: this.getRowBackground()
    };
  }

  getRowBackground() {
    return this.props.idx % 2 ? 'green' : 'blue';
  }

  render() {
    // here we are just changing the style
    // but we could replace this with anything we liked, cards, images, etc
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (<div style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props}/></div>);
  }
};

export default class RepTabularSection extends Component {

  static propTypes = {

    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,

    _columns: PropTypes.array.isRequired,   // колонки

    handleRowChange: PropTypes.func,
  };

  constructor(props, context) {

    super(props, context);

    const {_obj, _tabular, _meta} = props;
    const that = this;

    this.state = {
      _meta: _meta || _obj._metadata(_tabular),
      rows: [],
      expanded: {},
    };
  }

  shouldComponentUpdate({scheme}) {
    if(scheme !== this.props.scheme) {
      // в случае непустого результата - чистим
      const {_obj, _tabular} = this.props;
      const tabular = _obj[_tabular];
      if(tabular && tabular.count()){
        if(tabular._rows){
          tabular._rows.length = tabular._rows._count = 0;
        }
        tabular.clear();
      }
      this.state.rows.length = 0;
      this.state.expanded = {};
    }
    return true;
  }

  expandRoot() {
    const {_obj, _tabular, scheme} = this.props;
    const dims = scheme.dims();
    const rows = _obj[_tabular]._rows || [];
    if(rows.length && dims.length /*&& !dims[0]*/){
      const srows = rows.slice(0);
      const subRows = rows[0].children;
      srows.splice(1, 0, ...subRows);
      this.updateSubRowDetails(subRows, 1);
      this.setState({expanded: {'0': true}, rows: srows});
    }
    else{
      this.setState({expanded: {}, rows});
    }
  }

  getRows = (i) => {
    return this.state.rows[i];
  };

  onRowExpandToggle = (args) => {
    const expanded = Object.assign({}, this.state.expanded);
    expanded[args.columnGroupName] = Object.assign({}, expanded[args.columnGroupName]);
    expanded[args.columnGroupName][args.row] = {isExpanded: args.shouldExpand};
    this.setState({expanded: expanded});
  };

  onCellExpand = (args) => {
    let rows = this.state.rows.slice(0);
    let rowKey = args.rowData.row;
    let rowIndex = rows.indexOf(args.rowData);
    let subRows = args.expandArgs.children;

    let expanded = Object.assign({}, this.state.expanded);
    if (expanded && !expanded[rowKey]) {
      expanded[rowKey] = true;
      this.updateSubRowDetails(subRows, args.rowData.treeDepth);
      rows.splice(rowIndex + 1, 0, ...subRows);
    }
    else if (expanded[rowKey]) {
      expanded[rowKey] = false;
      rows.splice(rowIndex + 1, subRows.length);
    }

    this.setState({expanded, rows});
  };

  getSubRowDetails = (rowItem) => {
    const {_columns} = this.props;
    const {key} = _columns[0];
    let isExpanded = this.state.expanded[rowItem.row] ? this.state.expanded[rowItem.row] : false;
    return {
      group: rowItem.children && rowItem.children.length > 0,
      expanded: isExpanded,
      children: rowItem.children,
      field: key,
      treeDepth: rowItem.treeDepth || 0,
      siblingIndex: rowItem.siblingIndex,
      numberSiblings: rowItem.numberSiblings
    };
  };

  updateSubRowDetails = (subRows, parentTreeDepth) => {
    let treeDepth = parentTreeDepth || 0;
    subRows.forEach((sr, i) => {
      sr.treeDepth = treeDepth + 1;
      sr.siblingIndex = i;
      sr.numberSiblings = subRows.length;
      sr.children && this.updateSubRowDetails(sr.children, sr.treeDepth);
    });
  };

  render() {

    const {props, state} = this;
    const {_columns, minHeight} = props;

    // rowRenderer={RowRenderer}
    // onRowExpandToggle={onRowExpandToggle}
    // rowGroupRenderer={RowGroupRenderer}

    return (

      <ReactDataGrid
        columns={_columns}
        enableCellSelect={true}
        rowGetter={this.getRows}
        rowsCount={state.rows.length}
        getSubRowDetails={this.getSubRowDetails}
        onCellExpand={this.onCellExpand}
        minHeight={minHeight || 220}
        rowHeight={33}
      />

    );

  }
}
