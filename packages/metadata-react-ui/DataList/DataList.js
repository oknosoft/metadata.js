/** @flow */
import React, {Component, PropTypes} from "react";
import {InfiniteLoader, Grid} from "react-virtualized";
import Toolbar from "./Toolbar";
import styles from "./DataList.scss";
import cn from "classnames";


const limit = 30,
  totalRows = 999999;


const list = {
  _data: [],
  get size(){ return this._data.length},
  get(index){ return this._data[index]},
  clear(){this._data.length = 0}
}

const columns = ['date','number_doc','partner','Санаторий']
const columnWidths = [130,130,200,200]

export default class DataList extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired,
    screen: React.PropTypes.object.isRequired
  }

  // rowIndex, columnIndex
  //cellContent

  constructor (props) {

    super(props);

    this.state = {
      totalRowCount: totalRows,
      filter: {id: 0, name: ''},
      selectedRowIndex: 0
    }

    this._isRowLoaded = ::this._isRowLoaded
    this._loadMoreRows = ::this._loadMoreRows
    this._cellRenderer = ::this._cellRenderer

  }

  render () {

    const { totalRowCount } = this.state
    const { screen } = this.context

    return (
      <div>

        <Toolbar
          handleAdd={this.handleAdd}
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
                    columns.map(function (v, index) {

                      let res = <div
                        key={v}
                        className={ cn(styles.oddRow, styles.cell)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          height: 30,
                          width: columnWidths[index],
                          left: left
                        }}>{v}</div>

                      left+=columnWidths[index]

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
                  columnWidth={({index}) => columnWidths[index] }
                  rowCount={totalRowCount}
                  rowHeight={30}
                  width={screen.width}
                  height={screen.height-140}
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
    const v = row[columns[index]]
    const { $p } = this.context

    switch(index){
      case 0:
        return $p.utils.moment(v).format($p.utils.moment._masks.date);
      case 1:
        return v;
      case 2:
        return 'клиент';
      case 3:
        return $p.cat.organizations.get(v).presentation;
    }
  }

  _isRowLoaded ({ index }) {
    const res = !!list.get(index)
    return res
  }

  _getRowClassName (row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _loadMoreRows ({ startIndex, stopIndex }) {

    const { filter, totalRowCount } = this.state
    const { $p } = this.context
    const increment = Math.max(limit, stopIndex - startIndex + 1)

    // готовим фильтры для запроса couchdb
    const select = {
      _view: 'doc/number_doc',
      _raw: true,
      _top: increment,
      _skip: startIndex,
      _key: {
        startkey: ['8cdf4b40-75a2-11e6-8809-5404a66e4a89', 2000],
        endkey: ['8cdf4b40-75a2-11e6-8809-5404a66e4a89', 2020]
      }

    }

    // выполняем запрос
    return $p.doc.buyers_order.find_rows_remote(select)

      .then((data) => {

        // обновляем массив результата
        for (var i = 0; i < data.length; i++) {
          if(!list._data[i+startIndex]){
            list._data[i+startIndex] = data[i];
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
        [styles.centeredCell]: columnIndex > 4, // выравнивание текста по центру
        [styles.hoveredItem]: rowIndex === this.state.hoveredRowIndex && rowIndex != this.state.selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
        [styles.selectedItem]: rowIndex === this.state.selectedRowIndex
      }
    )

    const row = list.get(rowIndex)

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
      >
        {content}
      </div>
    )
  }

}
