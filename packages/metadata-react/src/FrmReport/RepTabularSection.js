import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactDataGrid from 'react-data-grid';

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

  expandAll(level = 0) {
    const dims = this.props.scheme.dims();
    const {expanded, rows} = this.state;
    if(rows.length && dims.length){
      const srows = rows.slice(0);
      rows.slice(0).forEach((rootRow, idx) => {
        if(rootRow._level || !rootRow.children || expanded[rootRow.row]) {
          return;
        }
        const subRows = rootRow.children;
        srows.splice(srows.indexOf(rootRow) + 1, 0, ...subRows);
        this.updateSubRowDetails(subRows, 1);
        expanded[rootRow.row] = true;
      });
      this.setState({expanded, rows: srows});
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

  RowRenderer = ({renderBaseRow, ...props}) => {
    let formatted;
    const {scheme} = this.props;
    scheme.conditional_appearance.find_rows({use: true, columns: {in: ['','*']}}, (crow) => {
      if(crow.check(props.row)) {
        try{
          formatted = <div style={JSON.parse(crow.css)}>{renderBaseRow(props)}</div>;
        }
        catch(e) {}
        return false;
      }
    });
    return formatted || renderBaseRow(props);
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

    const {props, state, RowRenderer} = this;
    const {_columns, minHeight, minWidth, hideHeader} = props;

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
        minWidth={minWidth}
        minHeight={minHeight || 220}
        rowHeight={33}
        headerRowHeight={hideHeader ? 1 : 33}
        rowRenderer={RowRenderer}
      />
    );

  }
}
