import React, {PropTypes} from "react";
import MetaComponent from "../common/MetaComponent";

import ReactDataGrid from "react-data-grid";

//import {Menu, Data, Editors, ToolsPanel} from "react-data-grid-addons";

import {Data} from "react-data-grid-addons";
const {Selectors} = Data;

// const { AdvancedToolbar, GroupedColumnsPanel }   = ToolsPanel;
// const DraggableContainer  = ReactDataGridPlugins.Draggable.Container;

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

// class CustomToolbar extends Component {
//   render() {
//     return (
//       <AdvancedToolbar>
//         <GroupedColumnsPanel
//           groupBy={this.props.groupBy}
//           onColumnGroupAdded={this.props.onColumnGroupAdded}
//           onColumnGroupDeleted={this.props.onColumnGroupDeleted}
//         />
//       </AdvancedToolbar>
//     )
//   }
// }

export default class RepTabularSection extends MetaComponent {

  static propTypes = {

    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,

    _columns: PropTypes.array.isRequired,   // колонки

    handleRowChange: PropTypes.func,
  }

  constructor (props, context) {

    super(props, context);

    const {_obj, _tabular, _meta} = props

    this.state = {

      _meta: _meta || _obj._metadata(_tabular),
      _tabular: _obj[_tabular],

      get rows(){
        return this._tabular._rows || []
      },

      groupBy: [],
      expandedRows: {}
    }
  }

  getRows = () => {
    return Selectors.getRows(this.state);
  }

  getRowAt = (index) => {
    const rows = this.getRows();
    return rows[index];
  }

  getSize = () => {
    return this.getRows().length;
  }

  onRowExpandToggle = (args) => {
    var expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[args.columnGroupName] = Object.assign({}, expandedRows[args.columnGroupName]);
    expandedRows[args.columnGroupName][args.name] = {isExpanded: args.shouldExpand};
    this.setState({expandedRows: expandedRows});
  }

  render() {

    const {props, getRowAt, onRowExpandToggle} = this;
    const {_columns, minHeight} = props;

    return (

      <ReactDataGrid
        ref="grid"
        columns={_columns}
        enableCellSelect={true}
        rowGetter={getRowAt}
        rowsCount={this.getSize()}
        minHeight={minHeight || 200}

        onRowExpandToggle={onRowExpandToggle}

      />

    )

  }
}
