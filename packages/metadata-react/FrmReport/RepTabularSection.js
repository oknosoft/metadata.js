import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactDataGrid from 'react-data-grid';

//import {Menu, Data, Editors, ToolsPanel} from "react-data-grid-addons";

import {Data} from 'react-data-grid-addons';

const {Row} = ReactDataGrid;
const {Selectors} = Data;

// // Import the necessary modules.
// // Create the context menu.
// // Use this.props.rowIdx and this.props.idx to get the row/column where the menu is shown.
// class MyContextMenu extends Component {
//
//   onRowDelete(e, data) {
//     if (typeof(this.props.onRowDelete) === 'function') {
//       this.props.onRowDelete(e, data);
//     }
//   }
//
//   onRowAdd(e, data) {
//     if (typeof(this.props.onRowAdd) === 'function') {
//       this.props.onRowAdd(e, data);
//     }
//   }
//
//   render() {
//
//     let { ContextMenu, MenuItem} = Menu;
//
//     return (
//       <ContextMenu>
//         <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={::this.onRowDelete}>Delete Row</MenuItem>
//         <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={::this.onRowAdd}>Add Row</MenuItem>
//       </ContextMenu>
//     );
//   }
//
// }


class RowRenderer extends Component {

  static propTypes = {
    idx: React.PropTypes.string.isRequired
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

const  RowGroupRenderer = (props) => {
  let treeDepth = props.treeDepth || 0;
  let marginLeft = treeDepth * 20;

  let style = {
    height: props.height,
    border: '1px solid #dddddd',
    paddingTop: '5px',
    paddingLeft: '5px'
  };

  let onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      props.onRowExpandToggle(false);
    }
    if (e.key === 'ArrowRight') {
      props.onRowExpandToggle(true);
    }
    if (e.key === 'Enter') {
      props.onRowExpandToggle(!props.isExpanded);
    }
  };

  //const {row, ...other} = props;
  //const grouping = new Map([[row.__metaData.columnGroupName, row.name]]);
  //const grouping = {cashbox: {presentation: `Группировка${row.name ? ': ' + row.name : ''}`}};
  //return (<Row ref={node => this.row = node} {...other} row={grouping} idx={0}/>);
  return (
    <div style={style} onKeyDown={onKeyDown} tabIndex={0}>
      <span className="row-expand-icon" style={{float: 'left', marginLeft: marginLeft, cursor: 'pointer'}} onClick={props.onRowExpandClick} >{props.isExpanded ? String.fromCharCode('9660') : String.fromCharCode('9658')}</span>
      <strong>{props.columnGroupName}: {props.name}</strong>
    </div>
  );
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
      _tabular: _obj[_tabular],

      get rows() {
        return this._tabular._rows || [];
      },

      get groupBy() {
        const {scheme} = that.props;
        return scheme ? scheme.dims() : [];
      },

      expandedRows: {}
    };
  }

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getRowAt = (index) => {
    const rows = this.getRows();
    return rows[index];
  };

  getSize = () => {
    return this.getRows().length;
  };

  onRowExpandToggle = (args) => {
    const expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[args.columnGroupName] = Object.assign({}, expandedRows[args.columnGroupName]);
    expandedRows[args.columnGroupName][args.name] = {isExpanded: args.shouldExpand};
    this.setState({expandedRows: expandedRows});
  };

  render() {

    const {props, getRowAt, onRowExpandToggle} = this;
    const {_columns, minHeight} = props;

    // rowRenderer={RowRenderer}
    //

    return (

      <ReactDataGrid
        ref="grid"
        columns={_columns}
        enableCellSelect={true}
        rowGetter={getRowAt}
        rowsCount={this.getSize()}
        rowGroupRenderer={RowGroupRenderer}
        minHeight={minHeight || 200}
        rowHeight={33}
        onRowExpandToggle={onRowExpandToggle}
      />

    );

  }
}
