import React, {Component, PropTypes} from "react";
import ReactDataGrid from "react-data-grid";

import DumbLoader from "../DumbLoader";
import DataCell from '../DataField/DataCell'
import DefaultToolbar from "./TabularSectionToolbar"
import { AutoSizer } from "react-virtualized";
import styles from "./TabularSection.scss";
import { DataFieldFactory } from "../DataField";
import SimpleLoadingMessage from "../SimpleLoadingMessage";

export default class TabularSection extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    _columns: PropTypes.array,

    read_only: PropTypes.bool,            // Элемент только для чтения
    deny_add_del: PropTypes.bool,         // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    deny_reorder: PropTypes.bool,         // Запрет изменения порядка строк
    minHeight: PropTypes.number,

    Toolbar: PropTypes.func,              // Конструктор индивидуальной панели инструментов. Если не указан, рисуем типовую

    handleValueChange: PropTypes.func,    // Обработчик изменения значения в ячейке
    handleRowChange: PropTypes.func,      // При окончании редактирования строки
    handleCustom: PropTypes.func,         // Внешний дополнительный подключаемый обработчик

    rowSelection: PropTypes.object,       // Настройка пометок строк

    selectedIds: PropTypes.array
  }

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
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
      $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange)
    }
  }

  rowGetter = (i) => {
    const rowData = this.state._tabular.get(i);
    const fields = this.state._meta.fields;
    const row = new Map();

    let rowObject = null;
    if (this.state._tabular._obj.length > 0) {
      rowObject = this.state._tabular._obj[0];
    }

    for (const fieldName in fields) {
      if (fields.hasOwnProperty(fieldName) === false) {
        continue;
      }
      const field = fields[fieldName];

      // Create DataField for current cell.
      const dataFieldClassName = DataFieldFactory.getClassNameForType(field.type);
      row.set(fieldName, DataFieldFactory.create(dataFieldClassName, {
        _obj: rowObject,
        _fld: fieldName,
        _meta: this.state._meta
      }));
    }

    return row;
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

    const {props, state} = this
    const _columns = scheme.rx_columns({
      mode: "ts",
      fields: state._meta.fields,
      _obj: props._obj
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
        return <SimpleLoadingMessage text="Чтение настроек компоновки..." />;
      }

      return <SimpleLoadingMessage text="Ошибка настроек компоновки..."/>;
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

    if (rowSelection) {
      rowSelection.onRowsSelected = onRowsSelected
      rowSelection.onRowsDeselected = onRowsDeselected
      rowSelection.selectBy.keys.values = selectedIds
    }

    return (
      <div className={"content-with-toolbar-layout"}>
        <div className={"content-with-toolbar-layout__toolbar"}>
          <Toolbar
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            handleUp={handleUp}
            handleDown={handleDown}
            handleCustom={handleCustom}
            deny_add_del={deny_add_del}
            deny_reorder={deny_reorder}
            scheme={scheme} />
        </div>

        <div className={"content-with-toolbar-layout__content"}>
          <AutoSizer>
            {({width, height}) => (
              <ReactDataGrid
                minWidth={width}
                minHeight={height}

                ref={"grid"}
                columns={_columns}
                enableCellSelect={true}
                rowGetter={rowGetter}
                rowsCount={_tabular.count()}
                onRowUpdated={handleRowUpdated}
                rowSelection={rowSelection} />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}
