"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _reactDataGrid = require("react-data-grid");

var _reactDataGrid2 = _interopRequireDefault(_reactDataGrid);

var _reactDataGridAddons = require("react-data-grid-addons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Selectors } = _reactDataGridAddons.Data;

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

//import {Menu, Data, Editors, ToolsPanel} from "react-data-grid-addons";

class RepTabularSection extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    this.getRows = () => {
      return Selectors.getRows(this.state);
    };

    this.getRowAt = index => {
      const rows = this.getRows();
      return rows[index];
    };

    this.getSize = () => {
      return this.getRows().length;
    };

    this.onRowExpandToggle = args => {
      var expandedRows = Object.assign({}, this.state.expandedRows);
      expandedRows[args.columnGroupName] = Object.assign({}, expandedRows[args.columnGroupName]);
      expandedRows[args.columnGroupName][args.name] = { isExpanded: args.shouldExpand };
      this.setState({ expandedRows: expandedRows });
    };

    const { _obj, _tabular, _meta } = props;

    this.state = {

      _meta: _meta || _obj._metadata(_tabular),
      _tabular: _obj[_tabular],

      get rows() {
        return this._tabular._rows || [];
      },

      groupBy: [],
      expandedRows: {}
    };
  }

  render() {

    const { props, getRowAt, onRowExpandToggle } = this;
    const { _columns, minHeight } = props;

    return _react2.default.createElement(_reactDataGrid2.default, {
      ref: "grid",
      columns: _columns,
      enableCellSelect: true,
      rowGetter: getRowAt,
      rowsCount: this.getSize(),
      minHeight: minHeight || 200,

      onRowExpandToggle: onRowExpandToggle

    });
  }
}
exports.default = RepTabularSection;
RepTabularSection.propTypes = {

  _obj: _propTypes2.default.object.isRequired,
  _tabular: _propTypes2.default.string.isRequired,
  _meta: _propTypes2.default.object,

  _columns: _propTypes2.default.array.isRequired, // колонки

  handleRowChange: _propTypes2.default.func
};