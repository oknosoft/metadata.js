/**
 * ### Контейнер с динамической подгрузкой данных
 *
 * @module InfiniteList
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {InfiniteLoader, List } from 'react-virtualized';

const limit = 30;
const totalRows = 999999;

export default class InfiniteList extends PureComponent {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,  // Менеджер данных
    _acl: PropTypes.string,             // Права на чтение-изменение
    _meta: PropTypes.object,            // Описание метаданных. Если не указано, используем метаданные менеджера
    value: PropTypes.object,            // Текущее значение в родительском поле
    search: PropTypes.string,           // Строка поиска
    highlightedItem: PropTypes.number,  // Текущий выделенный эдемент
    onSelect: PropTypes.func,           // обработчик при изменении значения в поле
  }

  constructor(props, context) {
    super(props, context);
    this.state = {totalRowCount: 1};
    this.list = new Map([[0, 'row1'], [1,'row2']]);
  }

  isRowLoaded = ({ index }) => {
    return !!this.list.get(index);
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {

    const {_mgr, search} = this.props;
    const { infoReceived, totalRowCount } = this.state

    const increment = Math.max(limit, stopIndex - startIndex + 1)

    // готовим фильтры для запроса couchdb
    let fun = 'doc/by_id';
    const select = {
      include_docs: true,
      skip: startIndex,
      limit: increment
    }

    const filter = that.get_filter(start, count);

    return _mgr.pouch_db.find(filter)
      .then(({data}) => {
        // обновляем массив результата
        for (let i = 0; i < data.rows.length; i++) {
          if(!list._data[i+startIndex]){
            list._data[i+startIndex] = data.rows[i].doc;
          }
        }

        // обновляем состояние - изменилось количество записей
        if(totalRowCount != startIndex + data.rows.length + (data.rows.length < increment ? 0 : increment )){
          this.setState({
            totalRowCount: startIndex + data.rows.length + (data.rows.length < increment ? 0 : increment )
          })
        }else{
          // refs.Grid
          this.infinit.forceUpdate()
        }
      });
  }

  rowClassName (row) {
    return row % 2 === 0 ? 'evenRow' : 'oddRow'
  }

  rowRenderer = ({ key, index, style}) => {
    return (
      <div
        key={key}
        style={style}
      >
        {this.list.get(index)}
      </div>
    )
  }

  listRenderer = ({onRowsRendered, registerChild}) => {
    return <List
      height={200}
      onRowsRendered={onRowsRendered}
      ref={registerChild}
      rowCount={this.state.totalRowCount}
      rowHeight={30}
      rowRenderer={this.rowRenderer}
      width={300}
    />;
  }

  render() {
    return <InfiniteLoader
      ref={(el) => this.infinit = el}
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.totalRowCount}
      minimumBatchSize={limit}
    >
      {this.listRenderer}
      </InfiniteLoader>;
  }
}
