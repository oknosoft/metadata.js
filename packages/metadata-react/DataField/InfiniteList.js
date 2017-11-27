/**
 * ### Контейнер с динамической подгрузкой данных
 *
 * @module InfiniteList
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {InfiniteLoader, List, AutoSizer} from 'react-virtualized';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import classnames from 'classnames';
import MComponent from '../common/MComponent';
import {suggestionText} from './AbstractField';

const limit = 30;
const rowHeight = 32;

export function prevent(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

export default class InfiniteList extends MComponent {

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
    const val = props._obj[props._fld];
    this.list = [];
    if(val && !val.empty()){
      this.list.push(val);
    }
    this.search = props.search;
    this.state = {
      totalRows: props.is_enm && this.list.length ? 1 : 2,
      selectedItem: this.list.length ? 0 : -1,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadMoreRows({startIndex: 0, stopIndex: 99});
  }

  componentWillReceiveProps(nextProps) {
    if(this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if(this.props.search != nextProps.search) {
      this.updateTimer = setTimeout(() => {
        this.list.length = 0;
        this.setState({totalRows: this.state.totalRows <= 1 ? 2 : 1});
      }, 10);
    }
  }

  isRowLoaded = ({index}) => {
    return !!this.list[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {

    const {_mgr, _obj, _fld, _meta, search} = this.props;
    const {totalRows} = this.state;
    const increment = Math.max(limit, stopIndex - startIndex + 1);
    const select = _mgr.get_search_selector({_obj, _meta, search, top: increment, skip: startIndex});

    const update_state = (added) => {
      // обновляем состояние - изменилось количество записей
      const rowsCount = this.list.length + (added < increment ? 0 : increment);
      this.setState({totalRows: rowsCount});
    };

    // если объекты живут в ram
    let added = 0;
    if(_mgr.cachable == 'ram' || _mgr.cachable == 'doc_ram') {
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
      const filter = that.get_filter(start, count);

      return _mgr.pouch_db.find(filter)
        .then(({data}) => {
          // обновляем массив результата
          for (let i = 0; i < data.rows.length; i++) {
            if(!list._data[i + startIndex]) {
              list._data[i + startIndex] = data.rows[i].doc;
            }
          }
          update_state(data.rows.length);

        });
    }

  };

  next(evt) {
    const {state, list, _mounted, listContainer} = this;
    if(_mounted){
      let {selectedItem} = state;
      if(selectedItem < list.length - 1){
        selectedItem++;
      }
      this.setState({selectedItem});
      listContainer.forceUpdateGrid();
      prevent(evt);
    }
  }

  prev(evt) {
    const {state, _mounted, listContainer} = this;
    if(_mounted){
      let {selectedItem} = state;
      if(selectedItem >= 0){
        selectedItem--;
      }
      this.setState({selectedItem});
      listContainer.forceUpdateGrid();
      prevent(evt);
    }
  }

  handleSelect = (evt) => {
    const {state, props, list} = this;
    const value = list[state.selectedItem];
    prevent(evt);
    value && props.handleSelect(value);
  };


  /**
   *
   * @param index {Number} - Index of row
   * @param isScrolling {Boolean} - The List is currently being scrolled
   * @param isVisible {Boolean} - This row is visible within the List (eg it is not an overscanned row)
   * @param key {String} - Unique key within array of rendered rows
   * @param parent {Object} - Reference to the parent List (instance)
   * @param style {Object} - Style object to be applied to row (to position it)
   * @return {Object}
   */
  rowRenderer = ({index, isScrolling, isVisible, key, parent, style}) => {
    const {classes} = this.props;
    const suggestion = this.list[index];

    return (
      <ListItem
        button
        key={key}
        className={classnames({[classes.suggestion]: true, [classes.suggestionSelected]: index == this.state.selectedItem})}
        style={style}
        onClick={this.handleSelect}
        onMouseOver ={() => this.setState({selectedItem: index})}
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
    const {totalRows} = this.state;
    const rowCount = Math.min(this.list.length || 1, totalRows) + 1;
    const height = rowCount < 7 ? rowCount * rowHeight : 220;
    //containerStyle={rowCount < 7 && {overflow: 'hidden'}}
    return <List
      ref={(el) => registerChild(this.listContainer = el)}
      height={height}
      onRowsRendered={onRowsRendered}
      rowCount={totalRows}
      rowHeight={rowHeight}
      rowRenderer={this.rowRenderer}
      width={310}
    />;
  };

  render() {
    return <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.totalRows}
      minimumBatchSize={limit}
    >
      {this.listRenderer}
    </InfiniteLoader>;
  }
}
