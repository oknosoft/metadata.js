/** @flow */
import React, {Component, PropTypes} from "react";
import {InfiniteLoader, Grid} from "react-virtualized";
import Toolbar from "./Toolbar";
import styles from "./DataList.scss";
import cn from "classnames";


const limit = 30,
  totalRows = 999999;


/**
 * Динамический список
 */
export default class DataList extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  };

  static propTypes = {
    _mgr: PropTypes.object.isRequired,

    columns: PropTypes.array,
    select: PropTypes.object,
    _width: PropTypes.number,
    _height: PropTypes.number,

    // Redux actions
    handleAdd: PropTypes.func.isRequired,         // обработчик добавления объекта
    handleEdit: PropTypes.func.isRequired,        // обработчик открфтия формы редактора
    handleRevert: PropTypes.func.isRequired,
    handleMarkDeleted: PropTypes.func.isRequired, // обработчик удаления строки
    handlePost: PropTypes.func.isRequired,        // значение фильтра
    handleUnPost: PropTypes.func.isRequired,
    handlePrint: PropTypes.func.isRequired,       // обработчик открытия диалога печати
    handleAttachment: PropTypes.func.isRequired,  // обработчик открытия диалога присоединенных файлов
  };

  static defaultProps = {
    _width: 1000,
    _height: 400,
  };

  constructor (props, context) {

    super(props);

    this.state = {
      totalRowCount: totalRows,
      selectedRowIndex: 0,
      columns: props.columns,
      _meta: props._meta || props._mgr.metadata(),

      // готовим фильтры для запроса couchdb
      select: props.select || {
        _view: 'doc/by_date',
        _raw: true,
        _top: 30,
        _skip: 0,
        _key: {
          startkey: [props._mgr.class_name, 2000],
          endkey: [props._mgr.class_name, 2020]
        }
      }
    }

    const { state } = this
    const { $p } = context

    if(!state.columns || !state.columns.length){

      state.columns = []

      // набираем поля
      if (state._meta.form && state._meta.form.selection) {
        state._meta.form.selection.cols.forEach( fld => {
          const fld_meta = state._meta.fields[fld.id] || props._mgr.metadata(fld.id)
          state.columns.push({
            id: fld.id,
            synonym: fld.caption || fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: (fld.width == '*') ? 250 : (parseInt(fld.width) || 140)
          });
        });
      } else {
        if(props._mgr instanceof $p.classes.CatManager){
          if(state._meta.code_length){
            state.columns.push('id')
          }

          if(state._meta.main_presentation_name){
            state.columns.push('name')
          }

        }else if(props._mgr instanceof $p.classes.DocManager){
          state.columns.push('number_doc')
          state.columns.push('date')
        }

        state.columns = state.columns.map((id, index) => {
          // id, synonym, tooltip, type, width
          const fld_meta = state._meta.fields[id] || props._mgr.metadata(id)
          return {
            id,
            synonym: fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: fld_meta.width || 140
          }
        })
      }
    }

    this._list = {
      _data: [],
      get size(){ return this._data.length},
      get(index){ return this._data[index]},
      clear(){this._data.length = 0}
    }

    this._isRowLoaded = ::this._isRowLoaded
    this._loadMoreRows = ::this._loadMoreRows
    this._cellRenderer = ::this._cellRenderer
  }

  handleAdd(event){
    this.props.handleAdd();
  }

  handleEdit(event) {
    const row = this._list.get(this.state.selectedRowIndex);

    if (row) {
      this.props.handleEdit(row);
    }
  }

  handleRemove(event) {
    this.props.handleMarkDeleted();
  }

  handleSelectionChange(event) {
    this.props.handleSelectionChange();
  }

  handlePrint(event) {
    this.props.handlePrint();
  }

  handleAttachment(event) {
    this.props.handleAttachment();
  }

  _formatter (row, index) {

    const { $p } = this.context
    const { columns } = this.state
    const column = columns[index]
    const v = row[column.id]

    switch ($p.UI.control_by_type(column.type, v)){

      case 'ocombo':
        return $p.utils.value_mgr(row, column.id, column.type, false, v).get(v).presentation

      case 'dhxCalendar':
        return $p.utils.moment(v).format($p.utils.moment._masks.date)

      default:
        return v
    }
  }

  _isRowLoaded ({ index }) {
    const res = !!this._list.get(index)
    return res
  }

  _getRowClassName (row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _loadMoreRows ({ startIndex, stopIndex }) {

    const { select, totalRowCount } = this.state
    const { _mgr } = this.props
    const increment = Math.max(limit, stopIndex - startIndex + 1)

    select._top = increment
    select._skip = startIndex

    // выполняем запрос
    return _mgr.find_rows_remote(select)

      .then((data) => {

        // обновляем массив результата
        for (var i = 0; i < data.length; i++) {
          if(!this._list._data[i+startIndex]){
            this._list._data[i+startIndex] = data[i];
          }
        }

        // обновляем состояние - изменилось количество записей
        if(totalRowCount != startIndex + data.length + (data.length < increment ? 0 : increment )){
          this.setState({
            totalRowCount: startIndex + data.length + (data.length < increment ? 0 : increment )
          })
        }else{
          this.forceUpdate()
        }

      })
  }

  /**
   *
   * @param columnIndex - Horizontal (column) index of cell
   * @param isScrolling - The Grid is currently being scrolled
   * @param key - Unique key within array of cells
   * @param rowIndex - Vertical (row) index of cell
   * @param style - Style object to be applied to cell
   * @return {XML}
   * @private
   */
  _cellRenderer ({columnIndex, isScrolling, key, rowIndex, style}) {

    const { $p } = this.context
    const setState = ::this.setState
    // var grid = this.refs.AutoSizer.refs.Grid

    const classNames = cn(
      this._getRowClassName(rowIndex),
      styles.cell,
      {
        [styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
        [styles.hoveredItem]: rowIndex === this.state.hoveredRowIndex && rowIndex != this.state.selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
        [styles.selectedItem]: rowIndex === this.state.selectedRowIndex
      }
    )

    const row = this._list.get(rowIndex)

    let content

    if (row) {
      content = this._formatter(row, columnIndex)

    } else {
      content = (
        <div
          className={styles.placeholder}
          style={{ width: 10 + Math.random() * 80 }}
        />
      )
    }

    // It is important to attach the style specified as it controls the cell's position.
    // You can add additional class names or style properties as you would like.
    // Key is also required by React to more efficiently manage the array of cells.
    return (
      <div
        className={classNames}
        key={key}
        style={style}
        onMouseOver={function () {
          setState({
            hoveredColumnIndex: columnIndex,
            hoveredRowIndex: rowIndex
          })
        }}
        onTouchTap={function () {
          setState({
            selectedRowIndex: rowIndex
          })
        }}
        onDoubleClick={(event) => { this.handleEdit(event) }}
      >

        {content}
      </div>
    )
  }

  render () {
    const { columns, totalRowCount } = this.state;
    const { _width, _height } = this.props;

    return (
      <div>

        <Toolbar
          handleAdd={(event) => { this.handleAdd(event) }}
          handleEdit={(event) => { this.handleEdit(event) }}
          handleRemove={(event) => { this.handleRemove(event) }}
          handleSelectionChange={(event) => { this.handleSelectionChange(event) }}
          handlePrint={(event) => { this.handlePrint() }}
          handleAttachment={(event) => { this.handleAttachment(event) }}
          selectionValue={{}}
        />

        <InfiniteLoader
          isRowLoaded={this._isRowLoaded}
          loadMoreRows={this._loadMoreRows}
          rowCount={totalRowCount}
          minimumBatchSize={limit}
        >
          {({onRowsRendered, registerChild}) => {

            const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex}) => {

              onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex
              })
            }

            let left = 0;

            return (

              <div>

                <div
                  //className={styles.BodyGrid}
                  style={{position: 'relative'}}>
                  {
                    columns.map(function (column, index) {

                      let res = <div
                        key={'caption_' + column.id}
                        className={ cn(styles.oddRow, styles.cell)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          height: 30,
                          width: column.width,
                          left: left
                        }}>{column.synonym}</div>

                      left+=column.width

                      return res;
                    })

                  }
                </div>

                <Grid
                  ref={registerChild}
                  //className={styles.BodyGrid}
                  onSectionRendered={onSectionRendered}
                  cellRenderer={this._cellRenderer}
                  columnCount={columns.length}
                  columnWidth={({index}) => columns[index].width }
                  rowCount={totalRowCount}
                  rowHeight={30}
                  width={_width}
                  height={_height-140}
                  style={{top: 30}}
                />

              </div>

            )
          }

          }

        </InfiniteLoader>

      </div>
    )
  }
}