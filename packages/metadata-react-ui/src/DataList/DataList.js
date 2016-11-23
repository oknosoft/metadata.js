/** @flow */
import React, {Component, PropTypes} from "react";
import {InfiniteLoader, Grid} from "react-virtualized";
import Toolbar from "./Toolbar";
import styles from "./DataList.scss";
import cn from "classnames";


const limit = 30,
  totalRows = 999999;

export default class DataList extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {

    columns: PropTypes.array.isRequired,

    select: PropTypes.object.isRequired,
    _mgr: PropTypes.object.isRequired,
    _width: PropTypes.number.isRequired,
    _height: PropTypes.number.isRequired
  }

  constructor (props) {

    super(props);

    this.state = {
      totalRowCount: totalRows,
      selectedRowIndex: 0
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

    this.handleEdit = ::this.handleEdit

  }

  render () {

    const { totalRowCount } = this.state
    const { columns, _width, _height } = this.props

    return (
      <div>

        <Toolbar
          handleAdd={this.props.handleAdd}
          handleEdit={this.handleEdit}
          handleRemove={this.handleRemove}
          handleSelectionChange={this.handleSelectionChange}
          handlePrint={this.handlePrint}
          handleAttachment={this.handleAttachment}
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

  handleAdd(e){

  }

  handleEdit(e){
    const row = this._list.get(this.state.selectedRowIndex)
    if(row)
      this.props.handleEdit(row)
  }

  handleRemove(e){

  }

  handleSelectionChange(e){

  }

  handlePrint(e){

  }

  handleAttachment(e){

  }

  _formatter (row, index){

    const { $p } = this.context
    const { columns } = this.props
    const column = columns[index]
    const v = row[column.id]

    switch ($p.rx_control_by_type(column.type, v)){

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

    const { totalRowCount } = this.state
    const { select, _mgr } = this.props
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
        onDoubleClick={this.handleEdit}
      >
        {content}
      </div>
    )
  }

}
