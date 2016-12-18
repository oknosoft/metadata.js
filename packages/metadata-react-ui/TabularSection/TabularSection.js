"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDataGrid = require("react-data-grid");

var _reactDataGrid2 = _interopRequireDefault(_reactDataGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // Import the necessary modules.
// import { Menu } from "react-data-grid/addons";
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


class TabularSection extends _react.Component {

  constructor(props, context) {

    super(props);

    const users_mgr = context.$p.cat.users;

    this.state = {
      _meta: props._meta || props._obj._metadata(props._tabular),
      _tabular: props._obj[props._tabular],
      _columns: props._columns || []
    };

    if (!this.state._columns.length) {

      for (let fld in this.state._meta.fields) {
        let _fld = this.state._meta.fields[fld],
            column = {
          key: fld,
          name: _fld.synonym,
          resizable: true
        };

        if (_fld.type.is_ref) {
          column.formatter = v => {
            return _react2.default.createElement(
              "div",
              null,
              v.value.presentation
            );
          };
        }

        this.state._columns.push(column);
      }
      // this.state._columns = [
      //   {
      //     key: 'row',
      //     name: '№',
      //     resizable : true,
      //     width : 80
      //   },
      //   {
      //     key: 'nom',
      //     name: 'ФИО',
      //     resizable : true,
      //     formatter: v => {
      //       v = users_mgr.get(v.value)
      //       return (<div>{v instanceof Promise ? 'loading...' : v.presentation}</div>)
      //     }
      //   }]
    }
  }

  rowGetter(i) {
    //return this.state._tabular.get(i)._obj;
    return this.state._tabular.get(i);
  }

  deleteRow(e, data) {
    if (!data) {
      data = this.refs.grid.state.selected;
    }
    this.state._tabular.del(data.rowIdx);
    this.forceUpdate();
  }

  addRow(e, data) {
    this.state._tabular.add();
    this.forceUpdate();
  }

  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state
    var row = this.rowGetter(e.rowIdx);
    Object.assign(row._row || row, e.updated);
  }

  render() {

    const { $p } = this.context;
    const { _meta, _tabular, _columns } = this.state;
    const { _obj, _fld, Toolbar } = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val
    };

    // contextMenu={<MyContextMenu
    //   onRowDelete={::this.deleteRow}
    //   onRowAdd={::this.addRow}
    //   style={{zIndex: 9999}}
    // />}

    // <SettingsProductionToolbar
    //   handleAdd={}
    //   handleRemove={}
    // />

    return Toolbar ? _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(Toolbar, {
        handleAdd: this.addRow.bind(this),
        handleRemove: this.deleteRow.bind(this),
        handleCustom: this.props.handleCustom
      }),
      _react2.default.createElement(_reactDataGrid2.default, {
        ref: "grid",
        columns: _columns,
        enableCellSelect: true,
        rowGetter: this.rowGetter.bind(this),
        rowsCount: _tabular.count(),
        onRowUpdated: this.handleRowUpdated,
        minHeight: this.props.minHeight || 200

      })
    ) : _react2.default.createElement(_reactDataGrid2.default, {

      columns: _columns,
      enableCellSelect: true,
      rowGetter: this.rowGetter.bind(this),
      rowsCount: _tabular.count(),
      onRowUpdated: this.handleRowUpdated,
      minHeight: this.props.minHeight || 200

    });
  }
}
exports.default = TabularSection;
TabularSection.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
TabularSection.propTypes = {

  _obj: _react.PropTypes.object.isRequired,
  _tabular: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,
  _columns: _react.PropTypes.object,

  read_only: _react.PropTypes.object, // Элемент только для чтения
  deny_add_del: _react.PropTypes.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)

  Toolbar: _react.PropTypes.func, // Индивидуальная панель инструментов. Если не указана, рисуем типовую

  handleValueChange: _react.PropTypes.func, // Обработчик изменения значения в ячейке
  handleRowChange: _react.PropTypes.func };