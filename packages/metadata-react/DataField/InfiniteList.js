/**
 * ### Контейнер с динамической подгрузкой данных
 *
 * @module InfiniteList
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {InfiniteLoader, List, AutoSizer} from 'react-virtualized';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import classnames from 'classnames';

const limit = 30;
const totalRows = 999999;
const rowHeight = 32;

export default class InfiniteList extends PureComponent {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,  // Менеджер данных
    _acl: PropTypes.string,             // Права на чтение-изменение
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // Описание метаданных. Если не указано, используем метаданные менеджера
    search: PropTypes.string,           // Строка поиска
    selectedItem: PropTypes.number,     // Текущий выделенный элемент
    handleSelect: PropTypes.func,       // обработчик при изменении значения в поле
  };

  constructor(props, context) {
    super(props, context);
    this.state = {totalRowCount: limit};
    this.list = [props._obj[props._fld]];
    this.search = props.search;
  }

  componentWillReceiveProps(nextProps) {
    if(this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if(this.props.search != nextProps.search) {
      this.updateTimer = setTimeout(() => {
        this.list.length = 0;
        this.setState({totalRowCount: this.state.totalRowCount <= 1 ? 2 : 1});
      }, 100);
    }
    else if(this.props.selectedItem != nextProps.selectedItem){
      this.listContainer.forceUpdateGrid();
    }
  }

  isRowLoaded = ({index}) => {
    return !!this.list[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    const {_mgr, _obj, _fld, _meta, search} = this.props;
    const {totalRowCount} = this.state;
    const increment = Math.max(limit, stopIndex - startIndex + 1);
    const select = _mgr.get_search_selector({_obj, _meta, search, top: increment, skip: startIndex});

    const update_state = (length) => {
      // обновляем состояние - изменилось количество записей
      const rowsCount = startIndex + length + (length < increment ? 0 : increment );
      if(totalRowCount != rowsCount) {
        this.setState({totalRowCount: rowsCount});
      }
      // else {
      //   // refs.Grid
      //   this.infinit.forceUpdate();
      // }
    };

    // если объекты живут в ram
    if(_mgr.cachable == 'ram' || _mgr.cachable == 'doc_ram') {
      let added = 0;
      _mgr.find_rows(select, (o) => {
        // если значение уже есть в коллекции - пропускаем
        if(this.list.indexOf(o) === -1) {
          this.list.push(o);
          added++;
        }
      });
      return Promise.resolve(update_state(added));
    }
    // будем делать запрос к couchdb
    else {
      // готовим фильтры для запроса couchdb
      let fun = 'doc/by_id';
      Object.assign(select, {
        include_docs: true,
        skip: startIndex,
        limit: increment
      });

      const filter = that.get_filter(start, count);

      return _mgr.pouch_db.find(filter)
        .then(({data}) => {
          // обновляем массив результата
          for (let i = 0; i < data.rows.length; i++) {
            if(!list._data[i + startIndex]) {
              list._data[i + startIndex] = data.rows[i].doc;
            }
          }
          update_state(this.list.length);

        });
    }

  };

  rowRenderer = ({
                   index,       // Index of row
                   isScrolling, // The List is currently being scrolled
                   isVisible,   // This row is visible within the List (eg it is not an overscanned row)
                   key,         // Unique key within array of rendered rows
                   parent,      // Reference to the parent List (instance)
                   style        // Style object to be applied to row (to position it);
                                // This must be passed through to the rendered row element.
                 }) => {
    const {suggestionText, classes, selectedItem, handleSelect} = this.props;
    const suggestion = this.list[index];

    return (
      <ListItem
        button
        key={key}
        className={classnames({[classes.suggestion]: true, [classes.suggestionSelected]: index == selectedItem})}
        onClick={() => handleSelect(index)}
      >
        {suggestion && !isScrolling && isVisible ?
          <ListItemText primary={suggestionText(suggestion)}/>
          :
          <div className={classes.placeholder} style={{width: 10 + Math.random() * 80}}/>
        }
      </ListItem>
    );
  };

  listRenderer = ({onRowsRendered, registerChild}) => {
    const {totalRowCount} = this.state;
    const rowCount = Math.min(this.list.length || 1, totalRowCount) + 0.6;
    const height = rowCount < 7 ? rowCount * rowHeight : 220;
    return <List
      ref={(el) => registerChild(this.listContainer = el)}
      height={height}
      onRowsRendered={onRowsRendered}
      rowCount={totalRowCount}
      rowHeight={rowHeight}
      rowRenderer={this.rowRenderer}
      width={300}
    />;
  };

  render() {
    return <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.totalRowCount}
      minimumBatchSize={limit}
    >
      {this.listRenderer}
    </InfiniteLoader>;
  }
}
