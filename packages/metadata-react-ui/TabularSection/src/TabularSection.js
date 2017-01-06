import React, {Component, PropTypes} from "react";
import ReactDataGrid from "react-data-grid";
import DumbLoader from "../DumbLoader";
import DefaultToolbar from "./TabularSectionToolbar"
import DataCell from 'components/DataField/DataCell'

import {Editors, Formatters} from "react-data-grid/addons";
const AutoCompleteEditor = Editors.AutoComplete;
const DropDownEditor = Editors.DropDownEditor;
const DropDownFormatter = Formatters.DropDownFormatter;


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

    Toolbar: PropTypes.func,              // Конструктор индивидуальной панели инструментов. Если не указан, рисуем типовую

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
    if(data && data.hasOwnProperty("rowIdx") && data.rowIdx > 0){
      this.state._tabular.swap(data.rowIdx, data.rowIdx - 1)
      data.rowIdx = data.rowIdx - 1
      this.forceUpdate()
    }
  }

  handleDown = () => {
    const data = this.refs.grid.state.selected
    if(data && data.hasOwnProperty("rowIdx") && data.rowIdx < this.state._tabular.count() - 1){
      this.state._tabular.swap(data.rowIdx, data.rowIdx + 1)
      data.rowIdx = data.rowIdx + 1
      this.forceUpdate()
    }
  }

  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state
    var row = this.rowGetter(e.rowIdx);
    Object.assign(row._row || row, e.updated);
  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const _columns = scheme.columns("ts")
    const {fields} = this.state._meta
    const {_obj} = this.props

    // подклеиваем редакторы и форматтеры
    _columns.forEach((column) => {

      const _fld = fields[column.key]

      if(!column.formatter){

        if (_fld.type.is_ref) {
          column.formatter = (v) => {
            const {presentation} = v.value
            return <div title={presentation}>{presentation}</div>
          }
        }
      }

      switch (column.ctrl_type) {

        case 'input':
          column.editable = true;
          break;

        case 'ocombo':
          column.editor = <DataCell />;
          break;

        case 'ofields':
          const options = _obj.used_fields_list()
          column.editor = <DropDownEditor options={options} />
          column.formatter = <DropDownFormatter options={options} />
          break;

        case 'dhxCalendar':
          column.editor = <DataCell />;
          break;

        default:
          ;
      }

    })

    this.setState({scheme, _columns})
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

    const {props, state, context, rowGetter, onRowsSelected, onRowsDeselected, handleAdd, handleRemove, handleUp, handleDown, handleRowUpdated} = this;
    const {_meta, _tabular, _columns, scheme, selectedIds, Toolbar} = state;
    const {_obj, rowSelection, deny_add_del, deny_reorder, minHeight, handleCustom} = props;

    if (!_columns || !_columns.length) {
      if (!scheme) {
        return <DumbLoader title="Чтение настроек компоновки..."/>
      }
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
      rowGetter: rowGetter,
      rowsCount: _tabular.count(),
      onRowUpdated: handleRowUpdated,
      minHeight: minHeight || 200
    }

    if(rowSelection){
      rowSelection.onRowsSelected = onRowsSelected
      rowSelection.onRowsDeselected = onRowsDeselected
      rowSelection.selectBy.keys.values = selectedIds
      gridProps.rowSelection = rowSelection
    }

    return (
      <div>

        <Toolbar
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          handleUp={handleUp}
          handleDown={handleDown}
          handleCustom={handleCustom}

          deny_add_del={deny_add_del}
          deny_reorder={deny_reorder}

          scheme={scheme}

        />

        <ReactDataGrid {...gridProps} />

      </div>
    )


  }
}
