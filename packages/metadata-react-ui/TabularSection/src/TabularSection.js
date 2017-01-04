import React, {Component, PropTypes} from "react";
import ReactDataGrid from "react-data-grid";
import DumbLoader from "../DumbLoader";
import DefaultToolbar from "./TabularSectionToolbar"


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


export default class TabularSection extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {

    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    _columns: PropTypes.array,

    read_only: PropTypes.bool,            // Элемент только для чтения
    deny_add_del: PropTypes.bool,         // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    deny_reorder: PropTypes.bool,         // Запрет изменения порядка строк

    Toolbar: PropTypes.func,              // Индивидуальная панель инструментов. Если не указана, рисуем типовую

    handleValueChange: PropTypes.func,    // Обработчик изменения значения в ячейке
    handleRowChange: PropTypes.func,      // При окончании редактирования строки

    rowSelection: PropTypes.object,       // Настройка пометок строк

    selectedIds: PropTypes.array
  }

  static defaultProps = {
    deny_add_del: false,
    read_only: false
  }

  constructor(props, context) {

    super(props, context);

    const {$p} = context
    const {_obj} = props
    const class_name = _obj._manager.class_name + "." + props._tabular

    this.state = {
      _meta: props._meta || _obj._metadata(props._tabular),
      _tabular: _obj[props._tabular],
      _columns: props._columns || [],

      Toolbar: props.Toolbar || DefaultToolbar,

      selectedIds: props.rowSelection ? props.rowSelection.selectBy.keys.values : []
    }

    if (!this.state._columns.length) {

      for (let fld in this.state._meta.fields) {
        let _fld = this.state._meta.fields[fld],
          column = {
            key: fld,
            name: _fld.synonym,
            resizable: true
          }

        if (_fld.type.is_ref) {
          column.formatter = v => {
            return <div>{v.value.presentation}</div>
          }
        }

        this.state._columns.push(column)

      }

      $p.cat.scheme_settings.get_scheme(class_name)
        .then(this.handleSchemeChange)

    }
  }

  rowGetter = (i) => {
    //return this.state._tabular.get(i)._obj;
    return this.state._tabular.get(i);
  }

  handleRemove = (e, data) => {
    if (!data) {
      data = this.refs.grid.state.selected
    }
    this.state._tabular.del(data.rowIdx)
    this.forceUpdate()
  }

  handleAdd = (e, data) => {
    this.state._tabular.add()
    this.forceUpdate()
  }

  handleUp = () => {
    const data = this.refs.grid.state.selected
  }

  handleDown = () => {
    const data = this.refs.grid.state.selected
  }

  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state
    var row = this.rowGetter(e.rowIdx);
    Object.assign(row._row || row, e.updated);
  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {
    this.setState({
      scheme,
      _columns: scheme.columns("ts")
    })
  }

  onRowsSelected = (rows) => {
    const {rowSelection} = this.props
    this.setState({
      selectedIds: this.state.selectedIds.concat(
        rows.map(r => {
          if(rowSelection.selectBy.keys.markKey){
            r.row[rowSelection.selectBy.keys.markKey] = true
          }
          return r.row[rowSelection.selectBy.keys.rowKey]
        }))
    })
  }

  onRowsDeselected = (rows) => {
    const {rowSelection} = this.props
    let rowIds = rows.map(r => {
      if(rowSelection.selectBy.keys.markKey){
        r.row[rowSelection.selectBy.keys.markKey] = false
      }
      return r.row[rowSelection.selectBy.keys.rowKey]
    })
    this.setState({
      selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1 )
    })
  }

  render() {

    const {$p} = this.context;
    const {_meta, _tabular, _columns, scheme, selectedIds, Toolbar} = this.state;
    const {_obj, rowSelection, deny_add_del, deny_reorder} = this.props;

    if (!scheme) {
      return <DumbLoader title="Чтение настроек компоновки..."/>

    } else if (!_columns || !_columns.length) {
      return <DumbLoader title="Ошибка настроек компоновки..."/>

    }

    // contextMenu={<MyContextMenu
    //   onRowDelete={this.handleRemove}
    //   onRowAdd={this.handleAdd}
    //   style={{zIndex: 9999}}
    // />}

    // <SettingsProductionToolbar
    //   handleAdd={}
    //   handleRemove={}
    // />

    const gridProps = {
      ref: "grid",
      columns: _columns,
      enableCellSelect: true,
      rowGetter: this.rowGetter,
      rowsCount: _tabular.count(),
      onRowUpdated: this.handleRowUpdated,
      minHeight: this.props.minHeight || 200
    }

    if(rowSelection){
      rowSelection.onRowsSelected = this.onRowsSelected
      rowSelection.onRowsDeselected = this.onRowsDeselected
      rowSelection.selectBy.keys.values = selectedIds
      gridProps.rowSelection = rowSelection
    }

    return (
      <div>

        <Toolbar
          handleAdd={this.handleAdd}
          handleRemove={this.handleRemove}
          handleUp={this.handleUp}
          handleDown={this.handleDown}
          handleCustom={this.props.handleCustom}

          deny_add_del={deny_add_del}
          deny_reorder={deny_reorder}

        />

        <ReactDataGrid {...gridProps} />

      </div>
    )


  }
}
